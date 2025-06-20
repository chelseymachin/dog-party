// src/stores/index.ts

import { ACTION_DEFINITIONS } from '@/types';
import { NOTIFICATION_TEMPLATES } from '@/types/ui';

// Export all store hooks
export { useGameStore } from './gameStore';
export { usePlayerStore } from './playerStore';
export { useAnimalStore } from './animalStore';
export { useDayStore } from './dayStore';
export { useUIStore } from './uiStore';

import { useGameStore } from './gameStore';
import { usePlayerStore } from './playerStore';
import { useAnimalStore } from './animalStore';
import { useDayStore } from './dayStore';
import { useUIStore } from './uiStore';

// Helper hook for accessing multiple stores
export const useStores = () => ({
  game: useGameStore(),
  player: usePlayerStore(),
  animals: useAnimalStore(),
  day: useDayStore(),
  ui: useUIStore(),
});

// Store action creators for complex operations that involve multiple stores
export const useGameActions = () => {
  const gameStore = useGameStore();
  const playerStore = usePlayerStore();
  const animalStore = useAnimalStore();
  const dayStore = useDayStore();
  const uiStore = useUIStore();
  
  return {
    // Initialize a new game
    initializeNewGame: () => {
      gameStore.initializeGame();
      
      // Add the first animal
      const firstAnimal = animalStore.createRandomAnimal();
      animalStore.addAnimal(firstAnimal);
      
      // Start the first day
      dayStore.initializeFirstDay();
      
      // Set up UI
      uiStore.setCurrentView('dashboard');
      uiStore.addQuickNotification(
        'info',
        'Welcome to Dog Party, a shelter simulator!',
        `Meet ${firstAnimal.name}, your first rescue animal!`
      );
    },
    
    // Perform an action on an animal
    performAnimalAction: async (animalId: string, action: string) => {
      const actionType = action as keyof typeof ACTION_DEFINITIONS; // Type assertion for actionType
      
      // Get actual action cost from definitions
      const actionDef = ACTION_DEFINITIONS[actionType];

      if (!actionDef) {
        uiStore.addQuickNotification('error', 'Invalid Action', 'Unknown action type');
        return false;
      }
      
      const actionCost = actionDef.baseCost.playerEnergy;
      
      // Check if player has enough energy
      if (!playerStore.canUseEnergy(actionCost)) {
        uiStore.addQuickNotification('warning', 'Not Enough Energy', 'You need more energy to perform this action');
        return false;
      }
      
      // Check if animal can perform action
      const canPerform = animalStore.canPerformAction(animalId, actionType);
      if (!canPerform.canPerform) {
        uiStore.addQuickNotification('warning', 'Cannot Perform Action', canPerform.reason || 'Action not available');
        return false;
      }
      
      // Set action in progress
      uiStore.setActionInProgress(true);
      
      try {
        // Use player energy
        const energyUsed = playerStore.useEnergy(actionCost);
        if (!energyUsed) {
          throw new Error('Failed to use player energy');
        }
        
        // Perform the action
        const result = animalStore.performAction(animalId, actionType, actionCost);
        
        if (result.success) {
          
          uiStore.recordActionResult(animalId, action, true);
          // Grant experience
          const expResult = playerStore.gainExperience(result.experienceGained);
          
          // Record the action for day tracking
          const newlyCompleted = dayStore.recordAction(actionType, animalId);

          newlyCompleted.forEach((goalId: string) => {
            const goal = dayStore.currentDayGoals.find(g => g.id === goalId);
            if (goal?.rewards) {
              // Apply goal rewards
              if (goal.rewards.money) {
                gameStore.addMoney(goal.rewards.money, `goal:${goalId}`);
              }
              if (goal.rewards.experience) {
                const expResult = playerStore.gainExperience(goal.rewards.experience);
                if (expResult.leveledUp) {
                  uiStore.addQuickNotification('success', 'Level Up!', `Congratulations! You reached level ${expResult.newLevel}!`);
                }
              }
              if (goal.rewards.reputation) {
                playerStore.updateReputation(goal.rewards.reputation);
              }
              if (goal.rewards.energyBonus) {
                playerStore.restoreEnergy(goal.rewards.energyBonus);
              }
              if (goal.rewards.items) {
                // Add items to inventory (implement when inventory system is ready)
              }
              
              // Show goal completion notification
              uiStore.addQuickNotification(
                'achievement',
                'Goal Completed!',
                `${goal.title} - ${goal.description}`
              );
            }
          });
          
          // Update game stats
          gameStore.updateShelterStats();
          
          // Show success notification
          uiStore.addQuickNotification('success', 'Action Successful', result.message);
          
          // Check for level up
          if (expResult.leveledUp) {
            uiStore.addQuickNotification('achievement', 'Level Up!', `Congratulations! You reached level ${expResult.newLevel}!`);
          }
          
          // Record action result for UI feedback
          uiStore.recordActionResult(animalId, action, true);
        } else {
          // Action failed, refund energy
          playerStore.restoreEnergy(actionCost);
          uiStore.addQuickNotification('error', 'Action Failed', result.message);
          uiStore.recordActionResult(animalId, action, false);
        }
        
        return result.success;
      } catch (error) {
        // Handle unexpected errors
        playerStore.restoreEnergy(actionCost);
        uiStore.addQuickNotification('error', 'Error', 'Something went wrong performing that action');
        return false;
      } finally {
        uiStore.setActionInProgress(false);
      }
    },

    // End the current day
    endCurrentDay: async () => {
      uiStore.setDayTransitioning(true);
    
      try {
        const summary = dayStore.endDay();
        
        gameStore.incrementDay();
        playerStore.resetDailyEnergy();
        animalStore.resetAllAnimalEnergy();
        
        uiStore.setDayTransitioning(false);
        
        uiStore.openModal('day_end_summary', summary);
        
      } catch (error) {
        uiStore.setDayTransitioning(false);
      }
    },
    
    // Start a new day
    startNewDay: () => {
      uiStore.setDayTransitioning(true);
      
      try {
        // Start new day
        dayStore.startNewDay();
        
        // Close any open modals
        uiStore.closeAllModals();
        
        // Welcome message
        uiStore.addQuickNotification(
          'info',
          `Day ${dayStore.currentDay} Begins!`,
          'A new day full of opportunities to help animals!'
        );
        
        // Check for low energy warnings
        const playerEnergy = playerStore.player.energy;
        if (playerEnergy <= 3) {
          uiStore.addNotification(
            NOTIFICATION_TEMPLATES.energyLow(playerEnergy)
          );
        }
        
        // Check for sick animals
        const sickAnimals = animalStore.getAnimalsByStatus('sick');
        sickAnimals.forEach(animal => {
          uiStore.addNotification(
            NOTIFICATION_TEMPLATES.animalSick(animal.name)
          );
        });
        
        // Check for adoption-ready animals
        const adoptableAnimals = animalStore.getAdoptableAnimals();
        adoptableAnimals.forEach(animal => {
          uiStore.addNotification(
            NOTIFICATION_TEMPLATES.adoptionReady(animal.name)
          );
        });
      } finally {
        uiStore.setDayTransitioning(false);
      }
    },
    
    // Adopt out an animal
    adoptAnimal: (animalId: string) => {
      const animal = animalStore.getAnimal(animalId);
      if (!animal) {
        uiStore.addQuickNotification('error', 'Error', 'Animal not found');
        return false;
      }
      
      const result = animalStore.adoptAnimal(animalId);
      
      if (result.success) {
        // Add money from adoption fee
        gameStore.addMoney(result.adoptionFee, 'adoption');
        dayStore.recordMoney(result.adoptionFee, 'earned');
        
        // Update player stats
        playerStore.incrementAdoptions();
        
        // Update reputation
        playerStore.updateReputation(5);
        
        // Show success message
        uiStore.addQuickNotification(
          'success',
          '🎉 Successful Adoption!',
          `${animal.name} found their forever home! You earned $${result.adoptionFee}.`
        );
        
        // Update stats
        gameStore.updateShelterStats();
        
        return true;
      } else {
        uiStore.addQuickNotification('error', 'Adoption Failed', 'This animal is not ready for adoption yet');
        return false;
      }
    },
    
    // Purchase shop item
    purchaseItem: (itemId: string, quantity: number = 1) => {
      // This would integrate with a shop store when created
      // For now, just placeholder
      console.log(itemId, quantity);
      uiStore.addQuickNotification('info', 'Shop', 'Shop functionality coming soon!');
      return false;
    },
    
    // Get comprehensive game status
    getGameStatus: () => {
      // Use the store references we already have instead of calling getState()
      return {
        day: dayStore.currentDay,
        budget: gameStore.budget,
        playerEnergy: `${playerStore.player.energy}/${playerStore.player.maxEnergy}`,
        animalsCount: animalStore.animals.length,
        shelterCapacity: `${animalStore.animals.length}/${gameStore.shelterCapacity}`,
        actionsToday: dayStore.actionsPerformedToday,
        goalsCompleted: `${dayStore.completedGoals.length}/${dayStore.currentDayGoals.length}`,
        overallHealth: gameStore.calculateOverallHealth(),
        overallHappiness: gameStore.calculateOverallHappiness(),
        reputation: playerStore.player.reputation,
      };
    },
  };
};

// Debug helpers (only available in development)
export const useDebugActions = () => {
  if (process.env.NODE_ENV !== 'development') {
    return {};
  }
  
  const gameStore = useGameStore();
  const playerStore = usePlayerStore();
  const animalStore = useAnimalStore();
  const dayStore = useDayStore();
  const uiStore = useUIStore();
  
  return {
    // Add money for testing
    addMoney: (amount: number) => {
      gameStore.addMoney(amount, 'debug');
    },
    
    // Add energy for testing
    addEnergy: (amount: number) => {
      playerStore.restoreEnergy(amount);
    },
    
    // Add a random animal
    addRandomAnimal: () => {
      const animal = animalStore.createRandomAnimal();
      animalStore.addAnimal(animal);
      return animal;
    },
    
    // Heal all animals
    healAllAnimals: () => {
      animalStore.animals.forEach(animal => {
        animalStore.updateAnimal(animal.id, {
          health: 100,
          happiness: 100,
          energy: animal.maxEnergy,
          needsMedical: false,
        }, true);
      });
    },
    
    // Skip to next day
    skipDay: () => {
      const actions = useGameActions();
      actions.endCurrentDay();
      setTimeout(() => {
        actions.startNewDay();
      }, 1000);
    },
    
    // Reset game
    resetGame: () => {
      gameStore.resetGame();
      uiStore.clearAllNotifications();
      uiStore.setCurrentView('dashboard');
    },
    
    // Log current state
    logState: () => {
      console.log('=== GAME STATE DEBUG ===');
      console.log('Game:', gameStore);
      console.log('Player:', playerStore);
      console.log('Animals:', animalStore);
      console.log('Day:', dayStore);
      console.log('UI:', uiStore);
    },
  };
};