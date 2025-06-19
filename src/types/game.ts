import { type Animal } from './animal';
import { type Player } from './player';
import { type DayHistory, type DailyGoal, type DayEvent } from './day';
import { type Inventory } from './shop';

export interface GameState {
  // Core game info
  gameId: string;
  createdAt: Date;
  lastSaved: Date;
  
  // Time and day progression
  currentDay: number;
  isNightTime: boolean;
  dayStartTime: Date;
  gameSpeed: number; // For potential time acceleration
  
  // Player state
  player: Player;
  
  // Financial
  budget: number;
  totalMoneyEarned: number;
  totalMoneySpent: number;
  
  // Shelter management
  animals: Animal[];
  shelterCapacity: number;
  shelterStats: ShelterStats;
  inventory: Inventory;
  
  // Day and history tracking
  dayHistory: DayHistory[];
  currentDayGoals: DailyGoal[];
  
  // Game progression
  unlockedFeatures: string[];
  unlockedItems: string[];
  completedAchievements: string[];
  
  // Settings and preferences
  settings: GameSettings;
  
  // Tutorial and onboarding
  tutorialCompleted: boolean;
  tutorialStep?: string;
  firstTimeUser: boolean;
  
  // Events and notifications
  activeEvents: DayEvent[];
  pendingNotifications: string[];
}

export interface ShelterStats {
  // Overall shelter health metrics
  overallHealth: number; // 0-100, average of all animals
  overallHappiness: number; // 0-100, average of all animals
  overallAdoptionReadiness: number; // 0-100, average of all animals
  
  // Reputation and quality metrics
  reputation: number; // 0-100, affects adoption fees and donations
  careQuality: number; // 0-100, based on consistency of care
  efficiency: number; // 0-100, based on energy usage optimization
  
  // Operational stats
  averageAnimalsPerDay: number;
  averageAdoptionTime: number; // Days from arrival to adoption
  successfulAdoptions: number;
  totalAnimalsHelped: number;
  
  // Financial health
  averageDailyIncome: number;
  averageDailyExpenses: number;
  profitability: number; // Income - expenses
  
  // Special metrics
  diseasePreventionRate: number; // How often you prevent illness
  volunteerSatisfaction: number; // Future feature
  communitySupport: number; // Affects donations and events
}

export interface GameSettings {
  // Gameplay preferences
  autoSave: boolean;
  autoEndDay: boolean; // Automatically end day when energy is depleted
  showEnergyWarnings: boolean;
  showEfficiencyTips: boolean;
  
  // Notifications
  enableNotifications: boolean;
  notifyOnLowEnergy: boolean;
  notifyOnSickAnimals: boolean;
  notifyOnAdoptionReady: boolean;
  
  // Accessibility
  highContrast: boolean;
  reducedMotion: boolean;
  fontSize: 'small' | 'medium' | 'large';
  
  // Audio (for future features)
  masterVolume: number; // 0-100
  soundEffects: boolean;
  backgroundMusic: boolean;
  
  // Advanced
  showAdvancedStats: boolean;
  enableExperimentalFeatures: boolean;
  debugMode: boolean;
}

export interface SaveData {
  version: string;
  gameState: GameState;
  checksum?: string; // For save file integrity
  compressed?: boolean;
}

// Initial/default game state
export const createInitialGameState = (): GameState => ({
  gameId: crypto.randomUUID(),
  createdAt: new Date(),
  lastSaved: new Date(),
  
  currentDay: 1,
  isNightTime: false,
  dayStartTime: new Date(),
  gameSpeed: 1.0,
  
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
  
  budget: 500,
  totalMoneyEarned: 500,
  totalMoneySpent: 0,
  
  animals: [], // Will be populated with initial animal
  shelterCapacity: 3,
  shelterStats: {
    overallHealth: 0,
    overallHappiness: 0,
    overallAdoptionReadiness: 0,
    reputation: 50,
    careQuality: 50,
    efficiency: 50,
    averageAnimalsPerDay: 0,
    averageAdoptionTime: 0,
    successfulAdoptions: 0,
    totalAnimalsHelped: 0,
    averageDailyIncome: 0,
    averageDailyExpenses: 0,
    profitability: 0,
    diseasePreventionRate: 100,
    volunteerSatisfaction: 50,
    communitySupport: 50,
  },
  
  inventory: {
    items: {
      'basic_food': 5,
      'medical_kit': 2,
      'toys': 3,
    },
    equipment: [],
    capacity: 20,
    usedCapacity: 10,
  },
  
  dayHistory: [],
  currentDayGoals: [],
  
  unlockedFeatures: ['basic_care', 'feeding', 'walking', 'playing'],
  unlockedItems: ['basic_food', 'medical_kit', 'toys'],
  completedAchievements: [],
  
  settings: {
    autoSave: true,
    autoEndDay: false,
    showEnergyWarnings: true,
    showEfficiencyTips: true,
    enableNotifications: true,
    notifyOnLowEnergy: true,
    notifyOnSickAnimals: true,
    notifyOnAdoptionReady: true,
    highContrast: false,
    reducedMotion: false,
    fontSize: 'medium',
    masterVolume: 70,
    soundEffects: true,
    backgroundMusic: true,
    showAdvancedStats: false,
    enableExperimentalFeatures: false,
    debugMode: false,
  },
  
  tutorialCompleted: false,
  firstTimeUser: true,
  
  activeEvents: [],
  pendingNotifications: [],
});