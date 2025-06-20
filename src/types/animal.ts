import { type ActionType } from '@/types';

export type AnimalType = 'dog';
export type AnimalSize = 'small' | 'medium' | 'large';
export type AnimalAge = 'puppy' | 'adult' | 'senior';
export type AnimalStatus = 'healthy' | 'needs_care' | 'ready_for_adoption' | 'sick' | 'recovering';

export type AnimationName = 
  | 'idle' | 'barking' | 'bite' | 'dying' | 'jump' | 'running' | 'walking' 
  | 'playing' | 'standing' | 'sitting' | 'sleeping' | 'hurt' | 'laydown' 
  | 'sit' | 'sleep' | 'bark';

export interface AnimationConfig {
  duration: number;
  loop: boolean;
  frames: string[]; // Array of frame file paths relative to sprite base path
}

export interface BreedAnimationData {
  defaultIdle: AnimationName;
  actionMappings: Record<ActionType, AnimationName>;
  animations: Partial<Record<AnimationName, AnimationConfig>>;
}

export interface Animal {
  id: string;
  name: string;
  type: AnimalType;
  color: string;
  breed: string;
  size: AnimalSize;
  age: AnimalAge;
  
  // Core stats (0-100)
  health: number;
  happiness: number;
  adoptionReadiness: number;
  
  // Energy system
  energy: number;
  maxEnergy: number;
  energySpentToday: number;
  
  // Care tracking
  needsMedical: boolean;
  lastFeed: Date | null;
  lastWalk: Date | null;
  lastGroom: Date | null;
  
  // Adoption info
  adoptionFee: number;
  daysInShelter: number;
  
  // Status and conditions
  status: AnimalStatus;
  specialNeeds: string[];
  temperament: string[];
  
  // Backstory
  backstory?: string;
  arrivalDate: Date;
}

export interface AnimalBreed {
  name: string;
  type: AnimalType;
  size: AnimalSize;
  baseEnergy: number;
  healthTendency: number; // 0.8-1.2 multiplier for health changes
  happinessTendency: number; // 0.8-1.2 multiplier for happiness changes
  adoptionDifficulty: number; // Affects how long they take to get adoption ready
  specialTraits?: string[];
  availableColors: string[]; // List of colors available for this breed
  animationData: BreedAnimationData; // animation configuration for this breed
}

// Helper function to generate frame paths for an animation
const generateFramePaths = (animationName: AnimationName, frameCount: number): string[] => {
  const animationNameCap = animationName.charAt(0).toUpperCase() + animationName.slice(1);
  return Array.from({ length: frameCount }, (_, i) => 
    `${animationName}/${animationNameCap}${i + 1}.png`
  );
};

// Predefined animal data
export const ANIMAL_BREEDS: Record<string, AnimalBreed> = {
  'afghan_hound': {
    name: 'Afghan Hound',
    type: 'dog',
    size: 'large',
    baseEnergy: 6,
    healthTendency: 1.0,
    happinessTendency: 1.0,
    adoptionDifficulty: 1.1,
    specialTraits: ['independent', 'loyal', 'aloof'],
    availableColors: ['black', 'red', 'tan'],
    animationData: {
      defaultIdle: 'standing',
      actionMappings: {
        'idle': 'standing',
        'feed': 'sitting',
        'walk': 'walking',
        'play': 'barking',
        'medical': 'sleeping',
        'exercise': 'standing',
        'groom': 'standing',
        'train': 'standing',
        'socialize': 'standing'
      },
      animations: {
        standing: { duration: 600, loop: true, frames: generateFramePaths('standing', 3) },
        sitting: { duration: 1800, loop: false, frames: generateFramePaths('sitting', 9) },
        walking: { duration: 1600, loop: false, frames: generateFramePaths('walking', 8) },
        barking: { duration: 800, loop: false, frames: generateFramePaths('barking', 4) },
        sleeping: { duration: 2800, loop: false, frames: generateFramePaths('sleeping', 14) }
      }
    }
  },
  'bloodhound': {
    name: 'Bloodhound',
    type: 'dog',
    size: 'large',
    baseEnergy: 8,
    healthTendency: 0.9,
    happinessTendency: 1.2,
    adoptionDifficulty: 0.8, 
    specialTraits: ['affectionate', 'good_with_kids', 'independent'],
    availableColors: ['black', 'orange', 'red'],
    animationData: {
      defaultIdle: 'standing',
      actionMappings: {
        'idle': 'standing',
        'feed': 'sitting',
        'walk': 'walking',
        'play': 'barking',
        'medical': 'sleeping',
        'exercise': 'standing',
        'groom': 'standing',
        'train': 'standing',
        'socialize': 'standing'
      },
      animations: {
        standing: { duration: 800, loop: true, frames: generateFramePaths('standing', 4) },
        sitting: { duration: 1800, loop: false, frames: generateFramePaths('sitting', 9) },
        walking: { duration: 1600, loop: false, frames: generateFramePaths('walking', 8) },
        barking: { duration: 800, loop: false, frames: generateFramePaths('barking', 4) },
        sleeping: { duration: 2600, loop: false, frames: generateFramePaths('sleeping', 13) }
      }
    }
  },
  'bull_terrier': {
    name: 'Bull Terrier',
    type: 'dog',
    size: 'medium',
    baseEnergy: 9,
    healthTendency: 0.8,
    happinessTendency: 1.2,
    adoptionDifficulty: 0.8,
    specialTraits: ['playful', 'affectionate', 'small_space_friendly'],
    availableColors: ['white', 'black'],
    animationData: {
      defaultIdle: 'idle',
      actionMappings: {
        'idle': 'idle',
        'feed': 'sit',
        'walk': 'walking',
        'play': 'bark',
        'medical': 'hurt',
        'exercise': 'idle',
        'groom': 'idle',
        'train': 'idle',
        'socialize': 'idle'
      },
      animations: {
        idle: { duration: 800, loop: true, frames: generateFramePaths('idle', 4) },
        sit: { duration: 800, loop: false, frames: generateFramePaths('sit', 4) },
        walking: { duration: 1600, loop: false, frames: generateFramePaths('walking', 8) },
        bark: { duration: 1200, loop: false, frames: generateFramePaths('bark', 6) },
        hurt: { duration: 800, loop: false, frames: generateFramePaths('hurt', 4) }
      }
    }
  },
  'chihuahua': {
    name: 'Chihuahua',
    type: 'dog',
    size: 'small',
    baseEnergy: 5,
    healthTendency: 0.9,
    happinessTendency: 0.8,
    adoptionDifficulty: 1.1,
    specialTraits: ['small_space_friendly', 'protective', 'needs_patience'],
    availableColors: ['black', 'gray', 'tan'],
    animationData: {
      defaultIdle: 'idle',
      actionMappings: {
        'idle': 'idle',
        'feed': 'sit',
        'walk': 'walking',
        'play': 'bark',
        'medical': 'hurt',
        'exercise': 'idle',
        'groom': 'idle',
        'train': 'idle',
        'socialize': 'idle'
      },
      animations: {
        idle: { duration: 800, loop: true, frames: generateFramePaths('idle', 4) },
        sit: { duration: 1000, loop: false, frames: generateFramePaths('sit', 5) },
        walking: { duration: 1600, loop: false, frames: generateFramePaths('walking', 8) },
        bark: { duration: 1200, loop: false, frames: generateFramePaths('bark', 6) },
        hurt: { duration: 800, loop: false, frames: generateFramePaths('hurt', 4) }
      }
    }
  },
  'corgi': {
    name: 'Corgi',
    type: 'dog',
    size: 'small',
    baseEnergy: 8,
    healthTendency: 1.0,
    happinessTendency: 1.0,
    adoptionDifficulty: 1.2,
    specialTraits: ['small_space_friendly', 'protective', 'playful'],
    availableColors: ['black', 'orange', 'spotted', 'wizard'],
    animationData: {
      defaultIdle: 'idle',
      actionMappings: {
        'idle': 'idle',
        'feed': 'sit',
        'walk': 'walking',
        'play': 'bark',
        'medical': 'hurt',
        'exercise': 'idle',
        'groom': 'idle',
        'train': 'idle',
        'socialize': 'idle'
      },
      animations: {
        idle: { duration: 800, loop: true, frames: generateFramePaths('idle', 4) },
        sit: { duration: 1000, loop: false, frames: generateFramePaths('sit', 5) },
        walking: { duration: 1600, loop: false, frames: generateFramePaths('walking', 8) },
        bark: { duration: 1200, loop: false, frames: generateFramePaths('bark', 6) },
        hurt: { duration: 800, loop: false, frames: generateFramePaths('hurt', 4) }
      }
    }
  },
  'dalmation': {
    name: 'Dalmation',
    type: 'dog',
    size: 'large',
    baseEnergy: 8,
    healthTendency: 0.9,
    happinessTendency: 1.2,
    adoptionDifficulty: 0.8, 
    specialTraits: ['affectionate', 'good_with_kids', 'independent'],
    availableColors: ['black', 'brown', 'tricolor'],
    animationData: {
      defaultIdle: 'standing',
      actionMappings: {
        'idle': 'standing',
        'feed': 'sitting',
        'walk': 'walking',
        'play': 'barking',
        'medical': 'sleeping',
        'exercise': 'standing',
        'groom': 'standing',
        'train': 'standing',
        'socialize': 'standing'
      },
      animations: {
        standing: { duration: 1800, loop: true, frames: generateFramePaths('standing', 9) },
        sitting: { duration: 2000, loop: false, frames: generateFramePaths('sitting', 10) },
        walking: { duration: 1400, loop: false, frames: generateFramePaths('walking', 7) },
        barking: { duration: 800, loop: false, frames: generateFramePaths('barking', 4) },
        sleeping: { duration: 2800, loop: false, frames: generateFramePaths('sleeping', 14) }
      }
    }
  },
  'doberman': {
    name: 'Doberman',
    type: 'dog',
    size: 'large',
    baseEnergy: 8,
    healthTendency: 0.9,
    happinessTendency: 1.2,
    adoptionDifficulty: 0.8, 
    specialTraits: ['affectionate', 'good_with_kids', 'independent'],
    availableColors: ['black', 'gray', 'red'],
    animationData: {
      defaultIdle: 'standing',
      actionMappings: {
        'idle': 'standing',
        'feed': 'sitting',
        'walk': 'walking',
        'play': 'barking',
        'medical': 'sleeping',
        'exercise': 'standing',
        'groom': 'standing',
        'train': 'standing',
        'socialize': 'standing'
      },
      animations: {
        standing: { duration: 1000, loop: true, frames: generateFramePaths('standing', 5) },
        sitting: { duration: 1600, loop: false, frames: generateFramePaths('sitting', 8) },
        walking: { duration: 1600, loop: false, frames: generateFramePaths('walking', 8) },
        barking: { duration: 800, loop: false, frames: generateFramePaths('barking', 4) },
        sleeping: { duration: 3200, loop: false, frames: generateFramePaths('sleeping', 16) }
      }
    }
  },
  'german_shepherd': {
    name: 'German Shepherd',
    type: 'dog',
    size: 'large',
    baseEnergy: 8,
    healthTendency: 0.9,
    happinessTendency: 1.2,
    adoptionDifficulty: 0.8, 
    specialTraits: ['affectionate', 'good_with_kids', 'independent'],
    availableColors: ['black', 'gray', 'panda'],
    animationData: {
      defaultIdle: 'standing',
      actionMappings: {
        'idle': 'standing',
        'feed': 'sitting',
        'walk': 'walking',
        'play': 'barking',
        'medical': 'sleeping',
        'exercise': 'standing',
        'groom': 'standing',
        'train': 'standing',
        'socialize': 'standing'
      },
      animations: {
        standing: { duration: 1000, loop: true, frames: generateFramePaths('standing', 5) },
        sitting: { duration: 2200, loop: false, frames: generateFramePaths('sitting', 11) },
        walking: { duration: 1600, loop: false, frames: generateFramePaths('walking', 8) },
        barking: { duration: 800, loop: false, frames: generateFramePaths('barking', 4) },
        sleeping: { duration: 3000, loop: false, frames: generateFramePaths('sleeping', 15) }
      }
    }
  },
  'great_dane': {
    name: 'Great Dane',
    type: 'dog',
    size: 'large',
    baseEnergy: 8,
    healthTendency: 0.9,
    happinessTendency: 1.2,
    adoptionDifficulty: 0.8, 
    specialTraits: ['affectionate', 'good_with_kids', 'independent'],
    availableColors: ['black', 'gray', 'tan'],
    animationData: {
      defaultIdle: 'standing',
      actionMappings: {
        'idle': 'standing',
        'feed': 'sitting',
        'walk': 'walking',
        'play': 'barking',
        'medical': 'sleeping',
        'exercise': 'standing',
        'groom': 'standing',
        'train': 'standing',
        'socialize': 'standing'
      },
      animations: {
        standing: { duration: 800, loop: true, frames: generateFramePaths('standing', 4) },
        sitting: { duration: 2000, loop: false, frames: generateFramePaths('sitting', 10) },
        walking: { duration: 1600, loop: false, frames: generateFramePaths('walking', 8) },
        barking: { duration: 800, loop: false, frames: generateFramePaths('barking', 4) },
        sleeping: { duration: 3000, loop: false, frames: generateFramePaths('sleeping', 15) }
      }
    }
  },
  'greyhound': {
    name: 'Greyhound',
    type: 'dog',
    size: 'large',
    baseEnergy: 8,
    healthTendency: 0.9,
    happinessTendency: 1.2,
    adoptionDifficulty: 0.8, 
    specialTraits: ['affectionate', 'good_with_kids', 'independent'],
    availableColors: ['black', 'tan', 'white'],
    animationData: {
      defaultIdle: 'standing',
      actionMappings: {
        'idle': 'standing',
        'feed': 'sitting',
        'walk': 'walking',
        'play': 'barking',
        'medical': 'sleeping',
        'exercise': 'standing',
        'groom': 'standing',
        'train': 'standing',
        'socialize': 'standing'
      },
      animations: {
        standing: { duration: 800, loop: true, frames: generateFramePaths('standing', 4) },
        sitting: { duration: 2200, loop: false, frames: generateFramePaths('sitting', 11) },
        walking: { duration: 1600, loop: false, frames: generateFramePaths('walking', 8) },
        barking: { duration: 800, loop: false, frames: generateFramePaths('barking', 4) },
        sleeping: { duration: 3000, loop: false, frames: generateFramePaths('sleeping', 15) }
      }
    }
  },
  'siberian_husky': {
    name: 'Siberian Husky',
    type: 'dog',
    size: 'large',
    baseEnergy: 8,
    healthTendency: 0.9,
    happinessTendency: 1.2,
    adoptionDifficulty: 0.8, 
    specialTraits: ['affectionate', 'good_with_kids', 'independent'],
    availableColors: ['blue', 'gray', 'brown'],
    animationData: {
      defaultIdle: 'standing',
      actionMappings: {
        'idle': 'standing',
        'feed': 'sitting',
        'walk': 'walking',
        'play': 'barking',
        'medical': 'sleeping',
        'exercise': 'standing',
        'groom': 'standing',
        'train': 'standing',
        'socialize': 'standing'
      },
      animations: {
        standing: { duration: 1000, loop: true, frames: generateFramePaths('standing', 5) },
        sitting: { duration: 2000, loop: false, frames: generateFramePaths('sitting', 10) },
        walking: { duration: 1600, loop: false, frames: generateFramePaths('walking', 8) },
        barking: { duration: 800, loop: false, frames: generateFramePaths('barking', 4) },
        sleeping: { duration: 2800, loop: false, frames: generateFramePaths('sleeping', 14) }
      }
    }
  },
  'miniature_poodle': {
    name: 'Miniature Poodle',
    type: 'dog',
    size: 'small',
    baseEnergy: 8,
    healthTendency: 1.0,
    happinessTendency: 1.0,
    adoptionDifficulty: 1.2,
    specialTraits: ['small_space_friendly', 'protective', 'playful'],
    availableColors: ['apricot', 'ash', 'ivory'],
    animationData: {
      defaultIdle: 'idle',
      actionMappings: {
        'idle': 'idle',
        'feed': 'sit',
        'walk': 'walking',
        'play': 'bark',
        'medical': 'hurt',
        'exercise': 'idle',
        'groom': 'idle',
        'train': 'idle',
        'socialize': 'idle'
      },
      animations: {
        idle: { duration: 800, loop: true, frames: generateFramePaths('idle', 4) },
        sit: { duration: 1000, loop: false, frames: generateFramePaths('sit', 5) },
        walking: { duration: 1600, loop: false, frames: generateFramePaths('walking', 8) },
        bark: { duration: 1200, loop: false, frames: generateFramePaths('bark', 6) },
        hurt: { duration: 800, loop: false, frames: generateFramePaths('hurt', 4) }
      }
    }
  },
  'mountain_dog': {
    name: 'Mountain Dog',
    type: 'dog',
    size: 'large',
    baseEnergy: 8,
    healthTendency: 0.9,
    happinessTendency: 1.2,
    adoptionDifficulty: 0.8, 
    specialTraits: ['affectionate', 'good_with_kids', 'independent'],
    availableColors: ['gray', 'black', 'brown'],
    animationData: {
      defaultIdle: 'standing',
      actionMappings: {
        'idle': 'standing',
        'feed': 'sitting',
        'walk': 'walking',
        'play': 'barking',
        'medical': 'sleeping',
        'exercise': 'standing',
        'groom': 'standing',
        'train': 'standing',
        'socialize': 'standing'
      },
      animations: {
        standing: { duration: 800, loop: true, frames: generateFramePaths('standing', 4) },
        sitting: { duration: 2400, loop: false, frames: generateFramePaths('sitting', 12) },
        walking: { duration: 1600, loop: false, frames: generateFramePaths('walking', 8) },
        barking: { duration: 800, loop: false, frames: generateFramePaths('barking', 4) },
        sleeping: { duration: 3200, loop: false, frames: generateFramePaths('sleeping', 16) }
      }
    }
  },
  'papillion': {
    name: 'Papillion',
    type: 'dog',
    size: 'small',
    baseEnergy: 8,
    healthTendency: 1.0,
    happinessTendency: 1.0,
    adoptionDifficulty: 1.2,
    specialTraits: ['small_space_friendly', 'protective', 'playful'],
    availableColors: ['black', 'orange', 'white'],
    animationData: {
      defaultIdle: 'idle',
      actionMappings: {
        'idle': 'idle',
        'feed': 'sit',
        'walk': 'walking',
        'play': 'bark',
        'medical': 'hurt',
        'exercise': 'idle',
        'groom': 'idle',
        'train': 'idle',
        'socialize': 'idle'
      },
      animations: {
        idle: { duration: 800, loop: true, frames: generateFramePaths('idle', 4) },
        sit: { duration: 1000, loop: false, frames: generateFramePaths('sit', 5) },
        walking: { duration: 1600, loop: false, frames: generateFramePaths('walking', 8) },
        bark: { duration: 1200, loop: false, frames: generateFramePaths('bark', 6) },
        hurt: { duration: 800, loop: false, frames: generateFramePaths('hurt', 4) }
      }
    }
  },
  'pug': {
    name: 'Pug',
    type: 'dog',
    size: 'small',
    baseEnergy: 8,
    healthTendency: 1.0,
    happinessTendency: 1.0,
    adoptionDifficulty: 1.2,
    specialTraits: ['small_space_friendly', 'protective', 'playful'],
    availableColors: ['apricot', 'brown'],
    animationData: {
      defaultIdle: 'idle',
      actionMappings: {
        'idle': 'idle',
        'feed': 'sit',
        'walk': 'walking',
        'play': 'bark',
        'medical': 'hurt',
        'exercise': 'idle',
        'groom': 'idle',
        'train': 'idle',
        'socialize': 'idle'
      },
      animations: {
        idle: { duration: 800, loop: true, frames: generateFramePaths('idle', 4) },
        sit: { duration: 1000, loop: false, frames: generateFramePaths('sit', 5) },
        walking: { duration: 1600, loop: false, frames: generateFramePaths('walking', 8) },
        bark: { duration: 1200, loop: false, frames: generateFramePaths('bark', 6) },
        hurt: { duration: 800, loop: false, frames: generateFramePaths('hurt', 4) }
      }
    }
  },
  'shiba_inu': {
    name: 'Shiba Inu',
    type: 'dog',
    size: 'small',
    baseEnergy: 8,
    healthTendency: 1.0,
    happinessTendency: 1.0,
    adoptionDifficulty: 1.2,
    specialTraits: ['small_space_friendly', 'protective', 'playful'],
    availableColors: ['black', 'cream', 'orange'],
    animationData: {
      defaultIdle: 'standing',
      actionMappings: {
        'idle': 'standing',
        'feed': 'sitting',
        'walk': 'walking',
        'play': 'barking',
        'medical': 'sleeping',
        'exercise': 'standing',
        'groom': 'standing',
        'train': 'standing',
        'socialize': 'standing'
      },
      animations: {
        standing: { duration: 600, loop: true, frames: generateFramePaths('standing', 3) },
        sitting: { duration: 1800, loop: false, frames: generateFramePaths('sitting', 9) },
        walking: { duration: 1600, loop: false, frames: generateFramePaths('walking', 8) },
        barking: { duration: 800, loop: false, frames: generateFramePaths('barking', 4) },
        sleeping: { duration: 2800, loop: false, frames: generateFramePaths('sleeping', 14) }
      }
    }
  },
};

// Helper function to calculate max energy based on animal characteristics
export const calculateMaxEnergy = (animal: Pick<Animal, 'size' | 'age' | 'breed'>): number => {
  const breedData = ANIMAL_BREEDS[animal.breed.toLowerCase().replace(' ', '_')];
  let baseEnergy = breedData?.baseEnergy || 6;
  
  // Age modifiers
  switch (animal.age) {
    case 'puppy':
      baseEnergy += 2; // Puppies have lots of energy but tire quickly
      break;
    case 'senior':
      baseEnergy -= 2; // Seniors have less energy
      break;
    default:
      break;
  }
  
  // Ensure it's within reasonable bounds
  return Math.max(3, Math.min(12, baseEnergy));
};