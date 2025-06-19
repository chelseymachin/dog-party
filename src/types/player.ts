export interface Player {
    // Energy system
    energy: number;
    maxEnergy: number;
    energySpentToday: number;
    
    // Experience and progression
    level: number;
    experience: number;
    experienceToNextLevel: number;
    
    // Skills that affect efficiency
    skills: PlayerSkills;
    
    // Achievements and stats
    totalAnimalsHelped: number;
    totalAdoptions: number;
    daysActive: number;
    reputation: number; // 0-100, affects adoption fees and donations
  }
  
  export interface PlayerSkills {
    // Each skill reduces energy cost for related actions
    veterinarySkill: number; // 0-10, reduces medical action energy cost
    exerciseTraining: number; // 0-10, reduces walk/exercise energy cost
    animalPsychology: number; // 0-10, improves happiness gain efficiency
    shelterManagement: number; // 0-10, general efficiency bonus
    fundraising: number; // 0-10, increases adoption fees and donations
  }
  
  export interface PlayerStats {
    // Daily tracking
    actionsPerformedToday: number;
    animalsHelpedToday: number;
    energyUsedToday: number;
    
    // All-time stats
    totalActions: number;
    totalEnergySpent: number;
    totalMoneyEarned: number;
    totalMoneySpent: number;
    
    // Efficiency metrics
    averageActionsPerDay: number;
    averageEnergyEfficiency: number; // Actions per energy point
    bestSingleDayActions: number;
    
    // Care quality
    averageAnimalHealthImprovement: number;
    averageAnimalHappinessImprovement: number;
    averageTimeToAdoption: number; // In days
  }