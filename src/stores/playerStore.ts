// src/stores/playerStore.ts

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Player, PlayerSkills, ActionType } from '@/types';

interface PlayerStore {
  player: Player;
  
  // Energy management
  useEnergy: (amount: number) => boolean;
  restoreEnergy: (amount: number) => void;
  canUseEnergy: (amount: number) => boolean;
  resetDailyEnergy: () => void;
  
  // Experience and leveling
  gainExperience: (amount: number) => { leveledUp: boolean; newLevel?: number };
  
  // Skills
  improveSkill: (skill: keyof PlayerSkills, amount: number) => void;
  getSkillLevel: (skill: keyof PlayerSkills) => number;
  getActionEnergyDiscount: (action: ActionType) => number;
  
  // Statistics
  incrementAnimalsHelped: () => void;
  incrementAdoptions: () => void;
  updateDailyStats: (actionsPerformed: number) => void;
  
  // Reputation
  updateReputation: (change: number) => void;
  
  // Efficiency calculations
  calculateEfficiency: () => number;
  getEnergyEfficiencyTips: () => string[];
}

export const usePlayerStore = create<PlayerStore>()(
  devtools(
    (set, get) => ({
      player: {
        energy: 10,
        maxEnergy: 10,
        energySpentToday: 0,
        level: 1,
        experience: 0,
        experienceToNextLevel: 100,
        skills: {
          veterinarySkill: 0,
          exerciseTraining: 0,
          animalPsychology: 0,
          shelterManagement: 0,
          fundraising: 0,
        },
        totalAnimalsHelped: 0,
        totalAdoptions: 0,
        daysActive: 0,
        reputation: 50,
      },
      
      useEnergy: (amount: number) => {
        const { player } = get();
        if (player.energy >= amount) {
          set((state) => ({
            player: {
              ...state.player,
              energy: state.player.energy - amount,
              energySpentToday: state.player.energySpentToday + amount,
            }
          }), false, 'useEnergy');
          return true;
        }
        return false;
      },
      
      restoreEnergy: (amount: number) => {
        set((state) => ({
          player: {
            ...state.player,
            energy: Math.min(state.player.maxEnergy, state.player.energy + amount),
          }
        }), false, 'restoreEnergy');
      },
      
      canUseEnergy: (amount: number) => {
        return get().player.energy >= amount;
      },
      
      resetDailyEnergy: () => {
        set((state) => {
          const shelterManagementBonus = Math.floor(state.player.skills.shelterManagement / 2);
          const newMaxEnergy = 10 + shelterManagementBonus;
          
          return {
            player: {
              ...state.player,
              energy: newMaxEnergy,
              maxEnergy: newMaxEnergy,
              energySpentToday: 0,
              daysActive: state.player.daysActive + 1,
            }
          };
        }, false, 'resetDailyEnergy');
      },
      
      gainExperience: (amount: number) => {
        const state = get();
        const newExp = state.player.experience + amount;
        let leveledUp = false;
        let newLevel = state.player.level;
        let expToNext = state.player.experienceToNextLevel;
        
        // Check for level up
        if (newExp >= state.player.experienceToNextLevel) {
          leveledUp = true;
          newLevel = state.player.level + 1;
          expToNext = newLevel * 100; // Each level requires more exp
        }
        
        set((state) => ({
          player: {
            ...state.player,
            experience: newExp,
            level: newLevel,
            experienceToNextLevel: expToNext,
          }
        }), false, 'gainExperience');
        
        return { leveledUp, newLevel: leveledUp ? newLevel : undefined };
      },
      
      improveSkill: (skill: keyof PlayerSkills, amount: number) => {
        set((state) => ({
          player: {
            ...state.player,
            skills: {
              ...state.player.skills,
              [skill]: Math.min(10, state.player.skills[skill] + amount),
            }
          }
        }), false, `improveSkill:${skill}`);
      },
      
      getSkillLevel: (skill: keyof PlayerSkills) => {
        return get().player.skills[skill];
      },
      
      getActionEnergyDiscount: (action: ActionType) => {
        const { player } = get();
        let discount = 0;
        
        switch (action) {
          case 'medical':
            discount = Math.floor(player.skills.veterinarySkill / 3);
            break;
          case 'walk':
          case 'exercise':
            discount = Math.floor(player.skills.exerciseTraining / 3);
            break;
          case 'play':
          case 'socialization':
            discount = Math.floor(player.skills.animalPsychology / 4);
            break;
          default:
            discount = Math.floor(player.skills.shelterManagement / 5);
        }
        
        return Math.min(discount, 2); // Max 2 energy discount
      },
      
      incrementAnimalsHelped: () => {
        set((state) => ({
          player: {
            ...state.player,
            totalAnimalsHelped: state.player.totalAnimalsHelped + 1,
          }
        }), false, 'incrementAnimalsHelped');
      },
      
      incrementAdoptions: () => {
        set((state) => ({
          player: {
            ...state.player,
            totalAdoptions: state.player.totalAdoptions + 1,
          }
        }), false, 'incrementAdoptions');
      },
      
      updateDailyStats: (actionsPerformed: number) => {
        const { player } = get();
        const efficiency = actionsPerformed / Math.max(1, player.energySpentToday);
        
        // Improve skills based on actions performed
        if (actionsPerformed >= 8) {
          get().improveSkill('shelterManagement', 0.1);
        }
        if (efficiency >= 1.5) {
          get().improveSkill('shelterManagement', 0.2);
        }
      },
      
      updateReputation: (change: number) => {
        set((state) => ({
          player: {
            ...state.player,
            reputation: Math.max(0, Math.min(100, state.player.reputation + change)),
          }
        }), false, 'updateReputation');
      },
      
      calculateEfficiency: () => {
        const { player } = get();
        if (player.energySpentToday === 0) return 0;
        
        // This would be calculated based on actions performed today
        // For now, return a placeholder calculation
        const actionsPerformed = player.energySpentToday * 1.2; // Estimate
        return actionsPerformed / player.energySpentToday;
      },
      
      getEnergyEfficiencyTips: () => {
        const { player } = get();
        const tips: string[] = [];
        
        if (player.skills.shelterManagement < 3) {
          tips.push("Improve Shelter Management skill to increase max energy");
        }
        
        if (player.skills.veterinarySkill < 5 && player.energy < 5) {
          tips.push("Level up Veterinary skill to reduce medical action costs");
        }
        
        if (player.energy <= 3) {
          tips.push("Consider using an energy drink or ending the day");
        }
        
        if (player.energySpentToday > player.maxEnergy * 0.8) {
          tips.push("You're being very efficient with your energy today!");
        }
        
        return tips;
      },
    }),
    {
      name: 'player-store',
      enabled: process.env.NODE_ENV === 'development',
    }
  )
);