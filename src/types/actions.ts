export type ActionType = 
  'feed' 
  | 'walk' 
  | 'play' 
  | 'medical' 
  | 'exercise' 
  | 'groom'
  | 'train'
  | 'socialize'
  | 'idle';

export interface ActionCost {
  playerEnergy: number;
  animalEnergy: number;
  requiredItems?: string[]; // Item IDs needed to perform action
  moneyRequired?: number; // Some actions might cost money
  skillRequirement?: {
    skill: keyof import('./player').PlayerSkills;
    level: number;
  };
}

export interface ActionEffect {
  health?: number; // Change to health (can be negative)
  happiness?: number; // Change to happiness
  adoptionReadiness?: number; // Direct change to adoption readiness
  experience?: number; // Player experience gained
  
  // Special effects
  curesSickness?: boolean;
  preventsIllness?: boolean; // Preventive care
  improvesTemperament?: boolean;
  
  // Multipliers based on circumstances
  healthMultiplier?: number; // Multiplies health gain (1.0 = normal)
  happinessMultiplier?: number;
  
  // Chance-based effects
  criticalSuccessChance?: number; // 0-1, chance for bonus effects
}

export interface ActionResult {
  success: boolean;
  effects: ActionEffect;
  message: string;
  energyUsed: {
    player: number;
    animal: number;
  };
  experienceGained: number;
  criticalSuccess?: boolean;
  reason?: string; // If action failed, why?
}

// Action definitions with costs and base effects
export const ACTION_DEFINITIONS: Record<ActionType, {
  name: string;
  description: string;
  icon: string;
  baseCost: ActionCost;
  baseEffect: ActionEffect;
  cooldown?: number; // Minutes before can be used on same animal again
}> = {
  feed: {
    name: 'Feed',
    description: 'Give the animal food to restore health',
    icon: '🍖',
    baseCost: {
      playerEnergy: 1,
      animalEnergy: 0,
    },
    baseEffect: {
      health: 10,
      happiness: 5,
      experience: 1,
    }
  },
  
  walk: {
    name: 'Walk',
    description: 'Take the animal for a walk to improve happiness',
    icon: '🚶‍♀️',
    baseCost: {
      playerEnergy: 2,
      animalEnergy: 2,
    },
    baseEffect: {
      health: 5,
      happiness: 15,
      adoptionReadiness: 3,
      experience: 2,
    }
  },
  
  play: {
    name: 'Play',
    description: 'Play games with the animal to boost happiness',
    icon: '🎾',
    baseCost: {
      playerEnergy: 2,
      animalEnergy: 2,
      requiredItems: ['toys']
    },
    baseEffect: {
      happiness: 20,
      adoptionReadiness: 5,
      experience: 2,
      criticalSuccessChance: 0.1,
    }
  },
  
  medical: {
    name: 'Medical Care',
    description: 'Provide medical treatment to restore health',
    icon: '💉',
    baseCost: {
      playerEnergy: 3,
      animalEnergy: 1,
      requiredItems: ['medical_supplies'],
      moneyRequired: 10,
    },
    baseEffect: {
      health: 25,
      adoptionReadiness: 2,
      experience: 4,
      curesSickness: true,
      preventsIllness: true,
    }
  },
  
  exercise: {
    name: 'Exercise',
    description: 'Intensive exercise for maximum health and happiness',
    icon: '🏃‍♂️',
    baseCost: {
      playerEnergy: 4,
      animalEnergy: 4,
    },
    baseEffect: {
      health: 15,
      happiness: 25,
      adoptionReadiness: 8,
      experience: 3,
      healthMultiplier: 1.2,
      happinessMultiplier: 1.2,
    }
  },
  
  groom: {
    name: 'Groom',
    description: 'Clean and groom the animal for adoption readiness',
    icon: '✂️',
    baseCost: {
      playerEnergy: 2,
      animalEnergy: 1,
      requiredItems: ['grooming_supplies']
    },
    baseEffect: {
      health: 5,
      happiness: 10,
      adoptionReadiness: 15,
      experience: 2,
    }
  },
  
  train: {
    name: 'Train',
    description: 'Teach basic commands and improve behavior',
    icon: '🎯',
    baseCost: {
      playerEnergy: 3,
      animalEnergy: 3,
      skillRequirement: {
        skill: 'animalPsychology',
        level: 2
      }
    },
    baseEffect: {
      adoptionReadiness: 20,
      experience: 4,
      improvesTemperament: true,
    }
  },
  
  socialize: {
    name: 'Socialize',
    description: 'Help the animal interact with others',
    icon: '👥',
    baseCost: {
      playerEnergy: 2,
      animalEnergy: 2,
    },
    baseEffect: {
      happiness: 15,
      adoptionReadiness: 10,
      experience: 3,
      improvesTemperament: true,
    }
  },
  idle: {
    name: 'Idle',
    description: 'Let the animal rest and recover energy',
    icon: '😴',
    baseCost: {
      playerEnergy: 0,
      animalEnergy: 0,
    },
    baseEffect: {
    }
  }
};

// Helper type for action validation
export interface ActionValidation {
  canPerform: boolean;
  reason?: string;
  missingItems?: string[];
  insufficientEnergy?: {
    player?: number;
    animal?: number;
  };
  skillTooLow?: {
    required: number;
    current: number;
    skill: string;
  };
}