// src/stores/animalStore.ts

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { 
  type Animal, 
  type AnimalStatus, 
  type ActionType, 
  type ActionResult, 
  ACTION_DEFINITIONS,
  ANIMAL_BREEDS,
  calculateMaxEnergy
} from '@/types';

interface AnimalStore {
  animals: Animal[];
  
  // Animal management
  addAnimal: (animal: Omit<Animal, 'id'>) => Animal;
  removeAnimal: (animalId: string) => void;
  getAnimal: (animalId: string) => Animal | undefined;
  updateAnimal: (animalId: string, updates: Partial<Animal>, updateStatus: boolean) => void;
  
  // Animal actions
  performAction: (animalId: string, action: ActionType, playerEnergyUsed: number) => ActionResult;
  canPerformAction: (animalId: string, action: ActionType) => { canPerform: boolean; reason?: string };
  
  // Energy management for animals
  useAnimalEnergy: (animalId: string, amount: number) => boolean;
  restoreAnimalEnergy: (animalId: string, amount: number) => void;
  resetAllAnimalEnergy: () => void;
  
  // Status and health
  updateAnimalStatus: (animalId: string) => void;
  checkForSickness: (animalId: string) => boolean;
  healAnimal: (animalId: string) => void;
  
  // Adoption system
  getAdoptableAnimals: () => Animal[];
  adoptAnimal: (animalId: string) => { success: boolean; adoptionFee: number };
  calculateAdoptionReadiness: (animalId: string) => number;
  
  // Daily maintenance
  dailyAnimalMaintenance: () => void;
  applyHungerDecay: () => void;
  applyHappinessDecay: () => void;
  
  // Utility functions
  getAnimalsByStatus: (status: AnimalStatus) => Animal[];
  getAnimalsNeedingCare: () => Animal[];
  createRandomAnimal: () => Animal;
}

export const useAnimalStore = create<AnimalStore>()(
  devtools(
    (set, get) => ({
      animals: [],
      
      addAnimal: (animalData) => {
        const newAnimal: Animal = {
          id: crypto.randomUUID(),
          ...animalData,
          arrivalDate: new Date(),
          daysInShelter: 0,
        };
        
        set((state) => ({
          animals: [...state.animals, newAnimal]
        }), false, 'addAnimal');
        
        return newAnimal;
      },
      
      removeAnimal: (animalId: string) => {
        set((state) => ({
          animals: state.animals.filter(animal => animal.id !== animalId)
        }), false, 'removeAnimal');
      },
      
      getAnimal: (animalId: string) => {
        return get().animals.find(animal => animal.id === animalId);
      },
      
      updateAnimal: (animalId: string, updates: Partial<Animal>, updateStatus: boolean = true) => {
        set((state) => ({
          animals: state.animals.map(animal =>
            animal.id === animalId ? { ...animal, ...updates } : animal
          )
        }), false, 'updateAnimal');
        
        // Only update status if explicitly requested 
        if (updateStatus) {
          get().updateAnimalStatus(animalId);
        }
      },
      
      performAction: (animalId: string, action: ActionType, playerEnergyUsed: number) => {
        const animal = get().getAnimal(animalId);
        if (!animal) {
          return {
            success: false,
            effects: {},
            message: 'Animal not found',
            energyUsed: { player: 0, animal: 0 },
            experienceGained: 0,
            reason: 'animal_not_found'
          };
        }
        
        const actionDef = ACTION_DEFINITIONS[action];
        const canPerform = get().canPerformAction(animalId, action);
        
        if (!canPerform.canPerform) {
          return {
            success: false,
            effects: {},
            message: canPerform.reason || 'Cannot perform action',
            energyUsed: { player: 0, animal: 0 },
            experienceGained: 0,
            reason: canPerform.reason
          };
        }
        
        // Calculate actual energy costs (could be reduced by skills/equipment)
        const animalEnergyCost = actionDef.baseCost.animalEnergy;
        
        // Use animal energy
        const energyUsed = get().useAnimalEnergy(animalId, animalEnergyCost);

        if (!energyUsed && animalEnergyCost > 0) {
          return {
            success: false,
            effects: {},
            message: 'Animal is too tired',
            energyUsed: { player: 0, animal: 0 },
            experienceGained: 0,
            reason: 'insufficient_animal_energy'
          };
        }
        
        // Apply action effects
        const effects = actionDef.baseEffect;
        const healthChange = effects.health || 0;
        const happinessChange = effects.happiness || 0;
        const adoptionChange = effects.adoptionReadiness || 0;
        
        // Apply critical success chance
        const criticalSuccess = Math.random() < (effects.criticalSuccessChance || 0);
        const multiplier = criticalSuccess ? 1.5 : 1;

        
        get().updateAnimal(animalId, {
          health: Math.min(100, Math.max(0, animal.health + (healthChange * multiplier))),
          happiness: Math.min(100, Math.max(0, animal.happiness + (happinessChange * multiplier))),
          adoptionReadiness: Math.min(100, Math.max(0, animal.adoptionReadiness + (adoptionChange * multiplier))),
          energySpentToday: animal.energySpentToday + animalEnergyCost,
          [`last${action.charAt(0).toUpperCase() + action.slice(1)}`]: new Date(),
        }, true);

        
        // Special effects
        if (effects.curesSickness) {
          get().healAnimal(animalId);
        }
        
        return {
          success: true,
          effects: {
            health: healthChange * multiplier,
            happiness: happinessChange * multiplier,
            adoptionReadiness: adoptionChange * multiplier,
          },
          message: `Successfully ${action} ${animal.name}${criticalSuccess ? ' (Critical Success!)' : ''}`,
          energyUsed: { player: playerEnergyUsed, animal: animalEnergyCost },
          experienceGained: effects.experience || 1,
          criticalSuccess,
        };
      },
      
      canPerformAction: (animalId: string, action: ActionType) => {
        const animal = get().getAnimal(animalId);
        if (!animal) {
          return { canPerform: false, reason: 'Animal not found' };
        }
        
        const actionDef = ACTION_DEFINITIONS[action];
        
        // Check animal energy
        if (animal.energy < actionDef.baseCost.animalEnergy) {
          return { canPerform: false, reason: 'Animal is too tired' };
        }
        
        // Check for required items (this would integrate with inventory)
        if (actionDef.baseCost.requiredItems && actionDef.baseCost.requiredItems.length > 0) {
          // TODO: Check inventory for required items
          // For now, assume items are available
        }
        
        return { canPerform: true };
      },
      
      useAnimalEnergy: (animalId: string, amount: number) => {
        const animal = get().getAnimal(animalId);
      
        if (!animal || animal.energy < amount) {
          return false;
        }
        
        // Don't trigger status update for simple energy changes
        get().updateAnimal(animalId, {
          energy: animal.energy - amount,
          energySpentToday: animal.energySpentToday + amount,
        }, false); // <- Pass false to prevent status update
        
        return true;
      },
      
      restoreAnimalEnergy: (animalId: string, amount: number) => {
        const animal = get().getAnimal(animalId);
        if (!animal) return;
        
        get().updateAnimal(animalId, {
          energy: Math.min(animal.maxEnergy, animal.energy + amount),
        }, true);
      },
      
      resetAllAnimalEnergy: () => {
        set((state) => ({
          animals: state.animals.map(animal => ({
            ...animal,
            energy: animal.maxEnergy,
            energySpentToday: 0,
            daysInShelter: animal.daysInShelter + 1,
          }))
        }), false, 'resetAllAnimalEnergy');
      },
      
      updateAnimalStatus: (animalId: string) => {
        const animal = get().getAnimal(animalId);
        if (!animal) return;
        
        let newStatus: AnimalStatus = 'healthy';
        
        if (animal.health < 30 || animal.needsMedical) {
          newStatus = 'sick';
        } else if (animal.health < 60 || animal.happiness < 40) {
          newStatus = 'needs_care';
        } else if (animal.adoptionReadiness >= 80 && animal.health >= 80 && animal.happiness >= 70) {
          newStatus = 'ready_for_adoption';
        } else if (animal.health >= 70 && animal.happiness >= 60) {
          newStatus = 'healthy';
        } else {
          newStatus = 'needs_care';
        }
        
        // Only update if status actually changed and don't trigger another status update
        if (newStatus !== animal.status) {
          get().updateAnimal(animalId, { status: newStatus }, false); // <- Pass false here too
        }
      },
      
      checkForSickness: (animalId: string) => {
        const animal = get().getAnimal(animalId);
        if (!animal) return false;
        
        // Random chance for sickness based on health and care
        const sicknessChance = Math.max(0, (100 - animal.health) / 1000);
        const getSick = Math.random() < sicknessChance;
        
        if (getSick) {
          get().updateAnimal(animalId, {
            needsMedical: true,
            health: Math.max(10, animal.health - 20),
          }, true);
          return true;
        }
        
        return false;
      },
      
      healAnimal: (animalId: string) => {
        get().updateAnimal(animalId, {
          needsMedical: false,
        }, true);
      },
      
      getAdoptableAnimals: () => {
        return get().animals.filter(animal => animal.status === 'ready_for_adoption');
      },
      
      adoptAnimal: (animalId: string) => {
        const animal = get().getAnimal(animalId);
        if (!animal || animal.status !== 'ready_for_adoption') {
          return { success: false, adoptionFee: 0 };
        }
        
        const adoptionFee = animal.adoptionFee;
        get().removeAnimal(animalId);
        
        return { success: true, adoptionFee };
      },
      
      calculateAdoptionReadiness: (animalId: string) => {
        const animal = get().getAnimal(animalId);
        if (!animal) return 0;
        
        // Weighted calculation based on multiple factors
        const healthWeight = 0.4;
        const happinessWeight = 0.4;
        const timeWeight = 0.2;
        
        const healthScore = animal.health;
        const happinessScore = animal.happiness;
        const timeScore = Math.min(100, (animal.daysInShelter / 14) * 100); // Max after 2 weeks
        
        return Math.round(
          healthScore * healthWeight +
          happinessScore * happinessWeight +
          timeScore * timeWeight
        );
      },
      
      dailyAnimalMaintenance: () => {
        get().applyHungerDecay();
        get().applyHappinessDecay();
        
        // Check for random sickness
        get().animals.forEach(animal => {
          get().checkForSickness(animal.id);
          get().updateAnimalStatus(animal.id);
        });
      },
      
      applyHungerDecay: () => {
        set((state) => ({
          animals: state.animals.map(animal => ({
            ...animal,
            health: Math.max(0, animal.health - (animal.lastFed ? 5 : 15)),
          }))
        }), false, 'applyHungerDecay');
      },
      
      applyHappinessDecay: () => {
        set((state) => ({
          animals: state.animals.map(animal => ({
            ...animal,
            happiness: Math.max(0, animal.happiness - 3),
          }))
        }), false, 'applyHappinessDecay');
      },
      
      getAnimalsByStatus: (status: AnimalStatus) => {
        return get().animals.filter(animal => animal.status === status);
      },
      
      getAnimalsNeedingCare: () => {
        return get().animals.filter(animal => 
          animal.status === 'needs_care' || 
          animal.status === 'sick' ||
          animal.health < 60 ||
          animal.happiness < 50
        );
      },
      
      createRandomAnimal: () => {
        const breeds = Object.keys(ANIMAL_BREEDS);
        const breedKey = breeds[Math.floor(Math.random() * breeds.length)];
        const breed = ANIMAL_BREEDS[breedKey];
        
        const names = ['Buddy', 'Luna', 'Max', 'Bella', 'Charlie', 'Daisy', 'Rocky', 'Lily', 'Cooper', 'Ruby'];
        const name = names[Math.floor(Math.random() * names.length)];
        
        const maxEnergy = calculateMaxEnergy({ size: breed.size, age: 'adult', breed: breed.name });
        
        const newAnimal: Animal = {
          id: crypto.randomUUID(),
          name,
          type: breed.type,
          breed: breed.name,
          size: breed.size,
          age: 'adult',
          health: Math.floor(Math.random() * 40) + 40, // 40-80 starting health
          happiness: Math.floor(Math.random() * 30) + 30, // 30-60 starting happiness
          adoptionReadiness: Math.floor(Math.random() * 20) + 10, // 10-30 starting readiness
          energy: maxEnergy,
          maxEnergy,
          energySpentToday: 0,
          needsMedical: Math.random() < 0.3, // 30% chance of needing medical care
          lastFed: null,
          lastWalked: null,
          lastGroomed: null,
          adoptionFee: Math.floor(Math.random() * 100) + 100, // $100-200
          daysInShelter: 0,
          status: 'needs_care',
          specialNeeds: [],
          temperament: breed.specialTraits || [],
          backstory: `${name} is a lovely ${breed.name} looking for a forever home.`,
          arrivalDate: new Date(),
        };
        
        return newAnimal;
      },
    }),
    {
      name: 'animal-store',
      enabled: process.env.NODE_ENV === 'development',
    }
  )
);