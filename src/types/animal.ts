export type AnimalType = 'dog';
export type AnimalSize = 'small' | 'medium' | 'large';
export type AnimalAge = 'puppy' | 'adult' | 'senior';
export type AnimalStatus = 'healthy' | 'needs_care' | 'ready_for_adoption' | 'sick' | 'recovering';

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
  availableColors: string[]; // List of colors available for this breed
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
    specialTraits: ['independent', 'loyal', 'aloof'],
    availableColors: ['black', 'red', 'tan']
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
    availableColors: ['black', 'orange', 'red']
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
    availableColors: ['white', 'black']
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
    availableColors: ['black', 'gray', 'tan']
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
    availableColors: ['black', 'orange', 'spotted', 'wizard']
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
    availableColors: ['black', 'brown', 'tricolor']
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
    availableColors: ['black', 'gray', 'red']
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
    availableColors: ['black', 'gray', 'panda']
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
    availableColors: ['black', 'gray', 'tan']
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
    availableColors: ['black', 'tan', 'white']
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
    availableColors: ['blue', 'gray', 'brown']
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
    availableColors: ['apricot', 'ash', 'ivory']
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
    availableColors: ['gray', 'black', 'brown']
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
    availableColors: ['black', 'orange', 'white']
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
    availableColors: ['apricot', 'brown']
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
    availableColors: ['black', 'cream', 'orange']
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