// src/stores/gameStore.ts

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { 
  GameState, 
  GameSettings 
} from '@/types';
import { createInitialGameState } from '@/types/game';

interface GameStore extends GameState {
  // Actions
  initializeGame: () => void;
  updateBudget: (amount: number) => void;
  updateShelterStats: () => void;
  updateSettings: (settings: Partial<GameSettings>) => void;
  
  // Game progression
  incrementDay: () => void;
  addMoney: (amount: number, source?: string) => void;
  spendMoney: (amount: number, reason?: string) => boolean;
  
  // Shelter management
  canAfford: (cost: number) => boolean;
  getShelterOccupancy: () => { current: number; max: number; percentage: number };
  
  // Statistics and calculations
  calculateOverallHealth: () => number;
  calculateOverallHappiness: () => number;
  calculateReputation: () => number;
  
  // Debug and testing
  resetGame: () => void;
  setDebugMode: (enabled: boolean) => void;
}

export const useGameStore = create<GameStore>()(
  devtools(
    (set, get) => ({
      // Initialize with default state
      ...createInitialGameState(),
      
      // Actions
      initializeGame: () => {
        const initialState = createInitialGameState();
        set(initialState, false, 'initializeGame');
      },
      
      updateBudget: (amount: number) => {
        set((state) => ({
          budget: Math.max(0, state.budget + amount),
          totalMoneyEarned: amount > 0 ? state.totalMoneyEarned + amount : state.totalMoneyEarned,
          totalMoneySpent: amount < 0 ? state.totalMoneySpent + Math.abs(amount) : state.totalMoneySpent,
        }), false, 'updateBudget');
      },
      
      updateShelterStats: () => {
        const state = get();
        const animals = state.animals;
        
        if (animals.length === 0) {
          set((state) => ({
            shelterStats: {
              ...state.shelterStats,
              overallHealth: 0,
              overallHappiness: 0,
              overallAdoptionReadiness: 0,
            }
          }), false, 'updateShelterStats');
          return;
        }
        
        const avgHealth = animals.reduce((sum, animal) => sum + animal.health, 0) / animals.length;
        const avgHappiness = animals.reduce((sum, animal) => sum + animal.happiness, 0) / animals.length;
        const avgAdoptionReadiness = animals.reduce((sum, animal) => sum + animal.adoptionReadiness, 0) / animals.length;
        
        set((state) => ({
          shelterStats: {
            ...state.shelterStats,
            overallHealth: Math.round(avgHealth),
            overallHappiness: Math.round(avgHappiness),
            overallAdoptionReadiness: Math.round(avgAdoptionReadiness),
            totalAnimalsHelped: state.shelterStats.totalAnimalsHelped,
          }
        }), false, 'updateShelterStats');
      },
      
      updateSettings: (newSettings: Partial<GameSettings>) => {
        set((state) => ({
          settings: {
            ...state.settings,
            ...newSettings,
          }
        }), false, 'updateSettings');
      },
      
      incrementDay: () => {
        set((state) => ({
          currentDay: state.currentDay + 1,
          dayStartTime: new Date(),
          isNightTime: false,
        }), false, 'incrementDay');
      },
      
      addMoney: (amount: number, source = 'unknown') => {
        set((state) => ({
          budget: state.budget + amount,
          totalMoneyEarned: state.totalMoneyEarned + amount,
        }), false, `addMoney:${source}`);
      },
      
      spendMoney: (amount: number, reason = 'unknown') => {
        const state = get();
        if (state.budget >= amount) {
          set((state) => ({
            budget: state.budget - amount,
            totalMoneySpent: state.totalMoneySpent + amount,
          }), false, `spendMoney:${reason}`);
          return true;
        }
        return false;
      },
      
      canAfford: (cost: number) => {
        return get().budget >= cost;
      },
      
      getShelterOccupancy: () => {
        const { animals, shelterCapacity } = get();
        const current = animals.length;
        return {
          current,
          max: shelterCapacity,
          percentage: Math.round((current / shelterCapacity) * 100),
        };
      },
      
      calculateOverallHealth: () => {
        const { animals } = get();
        if (animals.length === 0) return 0;
        return Math.round(animals.reduce((sum, animal) => sum + animal.health, 0) / animals.length);
      },
      
      calculateOverallHappiness: () => {
        const { animals } = get();
        if (animals.length === 0) return 0;
        return Math.round(animals.reduce((sum, animal) => sum + animal.happiness, 0) / animals.length);
      },
      
      calculateReputation: () => {
        const state = get();
        // Reputation based on care quality, adoption success, etc.
        const baseReputation = state.player.reputation;
        const careQualityBonus = state.shelterStats.careQuality - 50; // -50 to +50
        const adoptionBonus = Math.min(state.shelterStats.successfulAdoptions * 2, 20);
        
        return Math.max(0, Math.min(100, baseReputation + careQualityBonus + adoptionBonus));
      },
      
      resetGame: () => {
        const initialState = createInitialGameState();
        set(initialState, false, 'resetGame');
      },
      
      setDebugMode: (enabled: boolean) => {
        set((state) => ({
          settings: {
            ...state.settings,
            debugMode: enabled,
          }
        }), false, 'setDebugMode');
      },
    }),
    {
      name: 'game-store',
      // Only log in development
      enabled: process.env.NODE_ENV === 'development',
    }
  )
);