import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { 
  type DayHistory, 
  type DailyGoal, 
  type DayEvent, 
  type DayEndSummary,
  type ActionType,
  DAILY_GOAL_TEMPLATES
} from '@/types';

// Helper functions moved outside the store
const getPerformanceMessage = (grade: string) => {
  switch (grade) {
    case 'A': return "Outstanding work! Your animals are thriving under your excellent care.";
    case 'B': return "Great job! You're providing quality care for your animals.";
    case 'C': return "Good effort! Your animals are getting the care they need.";
    case 'D': return "You're helping your animals, but there's room for improvement.";
    case 'F': return "Your animals need more attention. Try to spend more time caring for them.";
    default: return "Keep up the good work!";
  }
};

const calculateCareStreak = (dayHistory: DayHistory[]) => {
  let streak = 0;
  
  // Count consecutive days with good performance
  for (let i = dayHistory.length - 1; i >= 0; i--) {
    const day = dayHistory[i];
    if (day.animalsHelped >= 2 && day.actionsPerformed >= 6) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
};

interface DayStore {
  currentDay: number;
  isNightTime: boolean;
  dayStartTime: Date;
  
  // Goals and events
  currentDayGoals: DailyGoal[];
  completedGoals: string[];
  activeEvents: DayEvent[];
  dayHistory: DayHistory[];
  
  // Day actions tracking
  actionsPerformedToday: number;
  actionBreakdown: Record<ActionType, number>;
  animalsHelpedToday: Set<string>;
  moneyEarnedToday: number;
  moneySpentToday: number;
  
  // Day management
  startNewDay: () => void;
  endDay: () => DayEndSummary;
  initializeFirstDay: () => void;
  canEndDay: () => boolean;
  
  // Goal management
  generateDailyGoals: () => DailyGoal[];
  checkGoalCompletion: (goalId: string) => boolean;
  checkAllGoals: () => string[];
  completeGoal: (goalId: string) => void;
  
  // Action tracking
  recordAction: (action: ActionType, animalId: string) => string[];
  recordMoney: (amount: number, type: 'earned' | 'spent') => void;
  
  // Events
  triggerRandomEvent: () => DayEvent | null;
  addEvent: (event: DayEvent) => void;
  
  // Statistics
  getDayStats: () => {
    efficiency: number;
    animalsHelped: number;
    goalsCompleted: number;
    totalActions: number;
  };
  
  // History
  getDayHistory: (dayNumber?: number) => DayHistory | undefined;
  getWeeklyStats: () => {
    averageActions: number;
    averageAnimalsHelped: number;
    totalAdoptions: number;
    totalMoney: number;
  };
}

export const useDayStore = create<DayStore>()(
  devtools(
    (set, get) => ({
      currentDay: 1,
      isNightTime: false,
      dayStartTime: new Date(),
      
      currentDayGoals: [],
      completedGoals: [],
      activeEvents: [],
      dayHistory: [],
      
      actionsPerformedToday: 0,
      actionBreakdown: {
        feed: 0,
        walk: 0,
        play: 0,
        medical: 0,
        exercise: 0,
        grooming: 0,
        training: 0,
        socialization: 0,
      },
      animalsHelpedToday: new Set(),
      moneyEarnedToday: 0,
      moneySpentToday: 0,
      
      startNewDay: () => {
        const state = get();
        const newDay = state.currentDay + 1;
        const newGoals = get().generateDailyGoals();
        
        set({
          currentDay: newDay,
          isNightTime: false,
          dayStartTime: new Date(),
          currentDayGoals: newGoals,
          completedGoals: [],
          actionsPerformedToday: 0,
          actionBreakdown: {
            feed: 0,
            walk: 0,
            play: 0,
            medical: 0,
            exercise: 0,
            grooming: 0,
            training: 0,
            socialization: 0,
            idle: 0
          },
          animalsHelpedToday: new Set(),
          moneyEarnedToday: 0,
          moneySpentToday: 0,
          activeEvents: [],
        }, false, 'startNewDay');
        
        // Trigger potential random event
        const randomEvent = get().triggerRandomEvent();
        if (randomEvent) {
          get().addEvent(randomEvent);
        }
      },
      
      endDay: () => {
        const state = get();
        
        // Calculate performance metrics
        const efficiency = state.actionsPerformedToday / Math.max(1, 10); // Assuming 10 max energy
        const animalsHelped = state.animalsHelpedToday.size;
        const goalsCompleted = state.completedGoals.length;
        
        // Determine performance grade
        let performanceGrade: 'A' | 'B' | 'C' | 'D' | 'F' = 'C';
        if (efficiency >= 1.2 && animalsHelped >= 3 && goalsCompleted >= 2) {
          performanceGrade = 'A';
        } else if (efficiency >= 1.0 && animalsHelped >= 2 && goalsCompleted >= 1) {
          performanceGrade = 'B';
        } else if (efficiency >= 0.8 && animalsHelped >= 1) {
          performanceGrade = 'C';
        } else if (animalsHelped >= 1) {
          performanceGrade = 'D';
        } else {
          performanceGrade = 'F';
        }
        
        // Create day history entry
        const dayHistory: DayHistory = {
          day: state.currentDay,
          date: new Date(),
          actionsPerformed: state.actionsPerformedToday,
          actionBreakdown: { ...state.actionBreakdown },
          playerEnergyUsed: 0, // This would come from player store
          playerMaxEnergy: 10, // This would come from player store
          totalAnimalEnergyUsed: 0, // This would be calculated
          animalsHelped: animalsHelped,
          animalIds: Array.from(state.animalsHelpedToday),
          moneyEarned: state.moneyEarnedToday,
          moneySpent: state.moneySpentToday,
          adoptionFees: 0, // This would be calculated from adoptions
          adoptions: 0, // This would come from animal store
          adoptedAnimalIds: [],
          newAnimalsReceived: 0,
          averageHealthGain: 0, // Would be calculated from animal changes
          averageHappinessGain: 0, // Would be calculated from animal changes
          efficiencyScore: efficiency,
          events: [...state.activeEvents],
          goalsCompleted: [...state.completedGoals],
          goalsAvailable: state.currentDayGoals.map(g => g.id),
        };
        
        // Generate tomorrow's goals
        const tomorrowsGoals = get().generateDailyGoals();
        
        const summary: DayEndSummary = {
          dayCompleted: state.currentDay,
          dayHistory,
          performanceGrade,
          performanceMessage: getPerformanceMessage(performanceGrade), // Use helper function
          experienceGained: state.actionsPerformedToday * 2,
          levelUp: false, // This would be determined by player store
          tomorrowsGoals,
          predictedEvents: [],
          energyRestored: { player: 10, animals: {} },
          careStreak: calculateCareStreak(state.dayHistory), // Use helper function
          adoptionStreak: 0,
          newAchievements: [],
        };
        
        // Add to history
        set((state) => ({
          dayHistory: [...state.dayHistory, dayHistory],
          isNightTime: true,
        }), false, 'endDay');
        
        return summary;
      },
      
      canEndDay: () => {
        // Can always end day, but maybe warn if goals aren't complete
        return true;
      },

      initializeFirstDay: () => {
        const newGoals = get().generateDailyGoals();
        
        set({
          currentDay: 1,  // Keep it at 1 for the first day
          isNightTime: false,
          dayStartTime: new Date(),
          currentDayGoals: newGoals,
          completedGoals: [],
          actionsPerformedToday: 0,
          actionBreakdown: {
            feed: 0,
            walk: 0,
            play: 0,
            medical: 0,
            exercise: 0,
            grooming: 0,
            training: 0,
            socialization: 0,
            idle: 0,
          },
          animalsHelpedToday: new Set(),
          moneyEarnedToday: 0,
          moneySpentToday: 0,
          activeEvents: [],
        }, false, 'initializeFirstDay');
        
        // Trigger potential random event
        const randomEvent = get().triggerRandomEvent();
        if (randomEvent) {
          get().addEvent(randomEvent);
        }
      },
      
      generateDailyGoals: () => {
        const state = get();
        const availableGoals = [...DAILY_GOAL_TEMPLATES];
        
        // Select 2-3 goals based on difficulty and day progression
        const selectedGoals: DailyGoal[] = [];
        
        // Always include a basic care goal
        const basicCareGoal = availableGoals.find(g => g.id === 'basic_care');
        if (basicCareGoal) {
          selectedGoals.push({ ...basicCareGoal, id: `${basicCareGoal.id}_${state.currentDay}` });
        }
        
        // Add additional goals based on day number
        if (state.currentDay >= 3) {
          const adoptionGoal = availableGoals.find(g => g.id === 'adoption_ready');
          if (adoptionGoal) {
            selectedGoals.push({ ...adoptionGoal, id: `${adoptionGoal.id}_${state.currentDay}` });
          }
        }
        
        if (state.currentDay >= 5) {
          const efficiencyGoal = availableGoals.find(g => g.id === 'efficiency_master');
          if (efficiencyGoal && Math.random() < 0.4) {
            selectedGoals.push({ ...efficiencyGoal, id: `${efficiencyGoal.id}_${state.currentDay}` });
          }
        }
        
        return selectedGoals;
      },

      checkAllGoals: () => {
        const state = get();
        const newlyCompleted: string[] = [];
        
        state.currentDayGoals.forEach(goal => {
          if (!state.completedGoals.includes(goal.id) && get().checkGoalCompletion(goal.id)) {
            newlyCompleted.push(goal.id);
            get().completeGoal(goal.id);
          }
        });
        
        return newlyCompleted;
      },
      
      checkGoalCompletion: (goalId: string) => {
        const state = get();
        const goal = state.currentDayGoals.find(g => g.id === goalId);
        if (!goal) return false;
        
        // Check if already completed
        if (state.completedGoals.includes(goalId)) return true;
        
        // Check completion based on goal type
        switch (goal.type) {
          case 'care':
            if (goal.requirements?.specificActions) {
              const required = goal.requirements.specificActions;
              return Object.entries(required).every(([action, count]) => {
                return state.actionBreakdown[action as ActionType] >= count;
              });
            }
            break;
            
          case 'efficiency':
            if (goal.requirements?.energyEfficiency && goal.requirements?.actionsRequired) {
              const efficiency = state.actionsPerformedToday / Math.max(1, 10); // Assuming 10 max energy
              return state.actionsPerformedToday >= goal.requirements.actionsRequired && 
                     efficiency >= goal.requirements.energyEfficiency;
            }
            break;
            
          case 'adoption':
            if (goal.requirements?.adoptionsNeeded) {
              // This would need to be tracked - you'll need to add adoption tracking
              return false; // Implement when adoption system is ready
            }
            break;
        }
        
        return false;
      },
      
      completeGoal: (goalId: string) => {
        const goal = get().currentDayGoals.find(g => g.id === goalId);
        if (!goal || get().completedGoals.includes(goalId)) return;
        
        set((state) => ({
          completedGoals: [...state.completedGoals, goalId]
        }), false, 'completeGoal');
        
        // Apply goal rewards (would integrate with other stores)
        if (goal.rewards.money) {
          get().recordMoney(goal.rewards.money, 'earned');
        }
      },
      
      recordAction: (action: ActionType, animalId: string) => {
        set((state) => ({
          actionsPerformedToday: state.actionsPerformedToday + 1,
          actionBreakdown: {
            ...state.actionBreakdown,
            [action]: state.actionBreakdown[action] + 1,
          },
          animalsHelpedToday: new Set([...state.animalsHelpedToday, animalId]),
        }), false, 'recordAction');

        const newlyCompleted = get().checkAllGoals();
        
        return newlyCompleted;
      },
      
      recordMoney: (amount: number, type: 'earned' | 'spent') => {
        set((state) => ({
          [type === 'earned' ? 'moneyEarnedToday' : 'moneySpentToday']: 
            state[type === 'earned' ? 'moneyEarnedToday' : 'moneySpentToday'] + amount,
        }), false, 'recordMoney');
      },
      
      triggerRandomEvent: () => {
        const events: Omit<DayEvent, 'id' | 'timestamp'>[] = [
          {
            type: 'donation',
            title: 'Generous Donation',
            description: 'A kind supporter has donated money to your shelter!',
            effects: { money: 100 },
            icon: '💝',
          },
          {
            type: 'new_animal',
            title: 'New Rescue',
            description: 'A new animal has been brought to your shelter.',
            effects: { newAnimals: 1 },
            icon: '🐕',
          },
          {
            type: 'adoption_inquiry',
            title: 'Adoption Interest',
            description: 'Someone is interested in adopting one of your animals!',
            effects: { reputation: 5 },
            icon: '❤️',
          },
        ];
        
        // 30% chance of an event
        if (Math.random() < 0.3) {
          const event = events[Math.floor(Math.random() * events.length)];
          return {
            id: crypto.randomUUID(),
            ...event,
            timestamp: new Date(),
          };
        }
        
        return null;
      },
      
      addEvent: (event: DayEvent) => {
        set((state) => ({
          activeEvents: [...state.activeEvents, event]
        }), false, 'addEvent');
      },
      
      getDayStats: () => {
        const state = get();
        return {
          efficiency: state.actionsPerformedToday / Math.max(1, 10),
          animalsHelped: state.animalsHelpedToday.size,
          goalsCompleted: state.completedGoals.length,
          totalActions: state.actionsPerformedToday,
        };
      },
      
      getDayHistory: (dayNumber?: number) => {
        const state = get();
        if (dayNumber) {
          return state.dayHistory.find(day => day.day === dayNumber);
        }
        return state.dayHistory[state.dayHistory.length - 1];
      },
      
      getWeeklyStats: () => {
        const state = get();
        const lastWeek = state.dayHistory.slice(-7);
        
        if (lastWeek.length === 0) {
          return {
            averageActions: 0,
            averageAnimalsHelped: 0,
            totalAdoptions: 0,
            totalMoney: 0,
          };
        }
        
        return {
          averageActions: lastWeek.reduce((sum, day) => sum + day.actionsPerformed, 0) / lastWeek.length,
          averageAnimalsHelped: lastWeek.reduce((sum, day) => sum + day.animalsHelped, 0) / lastWeek.length,
          totalAdoptions: lastWeek.reduce((sum, day) => sum + day.adoptions, 0),
          totalMoney: lastWeek.reduce((sum, day) => sum + day.moneyEarned - day.moneySpent, 0),
        };
      },
    }),
    {
      name: 'day-store',
      enabled: process.env.NODE_ENV === 'development',
    }
  )
);