export type AnimalType = 'dog' | 'cat';
export type AnimalSize = 'small' | 'medium' | 'large';
export type AnimalAge = 'puppy' | 'adult' | 'senior';
export type AnimalStatus = 'healthy' | 'needs_care' | 'ready_for_adoption' | 'sick' | 'recovering';

export interface Animal {
  id: string;
  name: string;
  type: AnimalType;
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
  lastFed: Date | null;
  lastWalked: Date | null;
  lastGroomed: Date | null;
  
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
}

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
    specialTraits: ['independent', 'loyal', 'aloof']
  },
  'bloodhound': {
    name: 'Bloodhound',
    type: 'dog',
    size: 'large',
    baseEnergy: 8,
    healthTendency: 0.9,
    happinessTendency: 1.2,
    adoptionDifficulty: 0.8, 
    specialTraits: ['affectionate', 'good_with_kids', 'independent']
  },
  'bull_terrier': {
    name: 'Bull Terrier',
    type: 'dog',
    size: 'medium',
    baseEnergy: 9,
    healthTendency: 0.8,
    happinessTendency: 1.2,
    adoptionDifficulty: 0.8,
    specialTraits: ['playful', 'affectionate', 'small_space_friendly']
  },
  'chihuahua': {
    name: 'Chihuahua',
    type: 'dog',
    size: 'small',
    baseEnergy: 5,
    healthTendency: 0.9,
    happinessTendency: 0.8,
    adoptionDifficulty: 1.1,
    specialTraits: ['small_space_friendly', 'protective', 'needs_patience']
  },
  'corgi': {
    name: 'Corgi',
    type: 'dog',
    size: 'small',
    baseEnergy: 8,
    healthTendency: 1.0,
    happinessTendency: 1.0,
    adoptionDifficulty: 1.2,
    specialTraits: ['small_space_friendly', 'protective', 'playful']
  },
  'dalmation': {
    name: 'Dalmation',
    type: 'dog',
    size: 'large',
    baseEnergy: 8,
    healthTendency: 0.9,
    happinessTendency: 1.2,
    adoptionDifficulty: 0.8, 
    specialTraits: ['affectionate', 'good_with_kids', 'independent']
  },
  'doberman': {
    name: 'Doberman',
    type: 'dog',
    size: 'large',
    baseEnergy: 8,
    healthTendency: 0.9,
    happinessTendency: 1.2,
    adoptionDifficulty: 0.8, 
    specialTraits: ['affectionate', 'good_with_kids', 'independent']
  },
  'german_shepherd': {
    name: 'German Shepherd',
    type: 'dog',
    size: 'large',
    baseEnergy: 8,
    healthTendency: 0.9,
    happinessTendency: 1.2,
    adoptionDifficulty: 0.8, 
    specialTraits: ['affectionate', 'good_with_kids', 'independent']
  },
  'great_dane': {
    name: 'Great Dane',
    type: 'dog',
    size: 'large',
    baseEnergy: 8,
    healthTendency: 0.9,
    happinessTendency: 1.2,
    adoptionDifficulty: 0.8, 
    specialTraits: ['affectionate', 'good_with_kids', 'independent']
  },
  'greyhound': {
    name: 'Greyhound',
    type: 'dog',
    size: 'large',
    baseEnergy: 8,
    healthTendency: 0.9,
    happinessTendency: 1.2,
    adoptionDifficulty: 0.8, 
    specialTraits: ['affectionate', 'good_with_kids', 'independent']
  },
  'siberian_husky': {
    name: 'Siberian Husky',
    type: 'dog',
    size: 'large',
    baseEnergy: 8,
    healthTendency: 0.9,
    happinessTendency: 1.2,
    adoptionDifficulty: 0.8, 
    specialTraits: ['affectionate', 'good_with_kids', 'independent']
  },
  'miniature_poodle': {
    name: 'Miniature Poodle',
    type: 'dog',
    size: 'small',
    baseEnergy: 8,
    healthTendency: 1.0,
    happinessTendency: 1.0,
    adoptionDifficulty: 1.2,
    specialTraits: ['small_space_friendly', 'protective', 'playful']
  },
  'mountain_dog': {
    name: 'Mountain Dog',
    type: 'dog',
    size: 'large',
    baseEnergy: 8,
    healthTendency: 0.9,
    happinessTendency: 1.2,
    adoptionDifficulty: 0.8, 
    specialTraits: ['affectionate', 'good_with_kids', 'independent']
  },
  'papillion': {
    name: 'Papillion',
    type: 'dog',
    size: 'small',
    baseEnergy: 8,
    healthTendency: 1.0,
    happinessTendency: 1.0,
    adoptionDifficulty: 1.2,
    specialTraits: ['small_space_friendly', 'protective', 'playful']
  },
  'pug': {
    name: 'Pug',
    type: 'dog',
    size: 'small',
    baseEnergy: 8,
    healthTendency: 1.0,
    happinessTendency: 1.0,
    adoptionDifficulty: 1.2,
    specialTraits: ['small_space_friendly', 'protective', 'playful']
  },
  'shiba_inu': {
    name: 'Shiba Inu',
    type: 'dog',
    size: 'small',
    baseEnergy: 8,
    healthTendency: 1.0,
    happinessTendency: 1.0,
    adoptionDifficulty: 1.2,
    specialTraits: ['small_space_friendly', 'protective', 'playful']
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