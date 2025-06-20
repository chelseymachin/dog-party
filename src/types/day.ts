import { type ActionType } from './actions';

export interface DayHistory {
  day: number;
  date: Date;
  
  // Actions performed
  actionsPerformed: number;
  actionBreakdown: Record<ActionType, number>;
  
  // Energy usage
  playerEnergyUsed: number;
  playerMaxEnergy: number;
  totalAnimalEnergyUsed: number;
  
  // Animals helped
  animalsHelped: number;
  animalIds: string[];
  
  // Financial
  moneyEarned: number;
  moneySpent: number;
  adoptionFees: number;
  
  // Achievements
  adoptions: number;
  adoptedAnimalIds: string[];
  newAnimalsReceived: number;
  
  // Performance metrics
  averageHealthGain: number;
  averageHappinessGain: number;
  efficiencyScore: number; // Actions per energy spent
  
  // Special events
  events: DayEvent[];
  
  // Goals
  goalsCompleted: string[];
  goalsAvailable: string[];
}

export interface DayEvent {
  id: string;
  type: 'donation' | 'new_animal' | 'adoption_inquiry' | 'emergency' | 'weather' | 'celebration';
  title: string;
  description: string;
  effects: {
    money?: number;
    reputation?: number;
    newAnimals?: number;
    energyBonus?: number;
    itemsReceived?: string[];
  };
  icon: string;
  timestamp: Date;
}

export interface DailyGoal {
  id: string;
  title: string;
  description: string;
  type: 'care' | 'adoption' | 'efficiency' | 'financial' | 'special';
  
  // Requirements to complete
  requirements: {
    actionsRequired?: number;
    specificActions?: Record<ActionType, number>;
    animalsToHelp?: number;
    adoptionsNeeded?: number;
    energyEfficiency?: number; // Minimum actions per energy
    moneyToEarn?: number;
    customCondition?: string; // For special goals
  };
  
  // Rewards for completion
  rewards: {
    money?: number;
    experience?: number;
    items?: string[];
    reputation?: number;
    energyBonus?: number; // Extra energy for tomorrow
  };
  
  // Metadata
  difficulty: 'easy' | 'medium' | 'hard';
  isOptional: boolean;
  expiresAfterDays?: number;
}

export interface DayEndSummary {
  dayCompleted: number;
  dayHistory: DayHistory;
  
  // Performance
  performanceGrade: 'A' | 'B' | 'C' | 'D' | 'F';
  performanceMessage: string;
  
  // Progress
  experienceGained: number;
  levelUp?: boolean;
  newSkillPoints?: number;
  
  // Tomorrow's preview
  tomorrowsGoals: DailyGoal[];
  predictedEvents: DayEvent[];
  energyRestored: {
    player: number;
    animals: Record<string, number>;
  };
  
  // Unlocks
  newItemsUnlocked?: string[];
  newFeaturesUnlocked?: string[];
  
  // Streaks and achievements
  careStreak: number; // Consecutive days of good care
  adoptionStreak: number;
  newAchievements: string[];
}

// Predefined daily goals templates
export const DAILY_GOAL_TEMPLATES: DailyGoal[] = [
  {
    id: 'basic_care',
    title: 'Basic Care Day',
    description: 'Feed and walk an animal in the shelter',
    type: 'care',
    requirements: {
        specificActions: { feed: 1, walk: 1, play: 0, medical: 0, exercise: 0, grooming: 0, training: 0, socialization: 0 }
    },
    rewards: {
      money: 50,
      experience: 10,
      reputation: 5
    },
    difficulty: 'easy',
    isOptional: false
  },
  
  {
    id: 'efficiency_master',
    title: 'Efficiency Master',
    description: 'Perform at least 12 actions using only 8 energy',
    type: 'efficiency',
    requirements: {
      actionsRequired: 12,
      energyEfficiency: 1.5
    },
    rewards: {
      experience: 25,
      energyBonus: 2,
      items: ['energy_drink']
    },
    difficulty: 'hard',
    isOptional: true
  },
  
  {
    id: 'adoption_ready',
    title: 'Adoption Ready',
    description: 'Prepare at least one animal for adoption',
    type: 'adoption',
    requirements: {
      adoptionsNeeded: 1
    },
    rewards: {
      money: 100,
      experience: 20,
      reputation: 10
    },
    difficulty: 'medium',
    isOptional: false
  }
];