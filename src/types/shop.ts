import { type ActionType } from './actions';
import { type PlayerSkills } from './player';

export type ItemCategory = 
  'supplies' 
  | 'energy' 
  | 'equipment' 
  | 'automation' 
  | 'comfort' 
  | 'medical'
  | 'special';

export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: ItemCategory;
  rarity: ItemRarity;
  
  // Pricing
  basePrice: number;
  currentPrice: number; // Can change based on reputation, events, etc.
  
  // Purchase restrictions
  maxQuantity?: number; // Max you can own at once
  requiresLevel?: number;
  requiresReputation?: number;
  prerequisiteItems?: string[]; // Must own these items first
  
  // Effects when owned/used
  effects: ItemEffect;
  
  // Usage
  consumable: boolean; // Does it get used up?
  usesPerDay?: number; // How many times per day it can be used
  
  // Availability
  alwaysAvailable: boolean;
  unlockDay?: number; // Day it becomes available
  limitedTime?: boolean;
  stockLeft?: number; // For limited items
}

export interface ItemEffect {
  // Energy effects
  restorePlayerEnergy?: number;
  restoreAnimalEnergy?: number;
  increaseMaxPlayerEnergy?: number;
  increaseMaxAnimalEnergy?: number;
  dailyEnergyBonus?: number; // Extra energy each day
  
  // Action efficiency
  reduceActionCost?: {
    action: ActionType;
    reduction: number; // Energy cost reduction
  }[];
  improveActionEffect?: {
    action: ActionType;
    multiplier: number; // Effect multiplier
  }[];
  
  // Automation
  autoFeeding?: boolean; // Automatically feeds animals
  autoGrooming?: boolean;
  autoExercise?: boolean;
  passiveHappiness?: number; // Happiness gained per day without action
  passiveHealth?: number;
  
  // Financial
  increaseAdoptionFees?: number; // Percentage increase
  dailyIncome?: number; // Passive income per day
  reducePurchaseCosts?: number; // Percentage discount on future purchases
  
  // Skill improvements
  skillBonus?: Partial<PlayerSkills>;
  experienceMultiplier?: number;
  
  // Shelter improvements
  increaseShelterCapacity?: number;
  improveAnimalComfort?: number;
  reduceSicknessChance?: number;
  
  // Special effects
  customEffect?: string; // For unique items with complex effects
}

export interface Inventory {
  items: Record<string, number>; // item ID -> quantity
  equipment: string[]; // Installed equipment items
  capacity: number;
  usedCapacity: number;
}

export interface Purchase {
  itemId: string;
  quantity: number;
  totalCost: number;
  timestamp: Date;
}

// Predefined shop items
export const SHOP_ITEMS: ShopItem[] = [
  // === BASIC SUPPLIES ===
  {
    id: 'basic_food',
    name: 'Basic Dog Food',
    description: 'Standard nutrition for daily feeding - reduces feed cost to $0',
    icon: '🍖',
    category: 'supplies',
    rarity: 'common',
    basePrice: 50,
    currentPrice: 50,
    consumable: true,
    maxQuantity: 10,
    alwaysAvailable: true,
    effects: {
      // This will be used to offset feeding costs
    }
  },
  
  {
    id: 'premium_treats',
    name: 'Premium Treats',
    description: 'Delicious treats that boost animal energy by 2 points',
    icon: '🦴',
    category: 'supplies',
    rarity: 'uncommon',
    basePrice: 40,
    currentPrice: 40,
    consumable: true,
    maxQuantity: 8,
    alwaysAvailable: true,
    effects: {
      restoreAnimalEnergy: 2
    }
  },

  // === ENERGY ITEMS ===
  {
    id: 'energy_drink',
    name: 'Energy Drink',
    description: 'Restore 3 player energy points instantly',
    icon: '⚡',
    category: 'energy',
    rarity: 'common',
    basePrice: 30,
    currentPrice: 30,
    consumable: true,
    maxQuantity: 5,
    alwaysAvailable: true,
    effects: {
      restorePlayerEnergy: 3
    }
  },
  
  {
    id: 'super_energy_drink',
    name: 'Super Energy Drink',
    description: 'Restore 5 player energy points instantly',
    icon: '🔋',
    category: 'energy',
    rarity: 'rare',
    basePrice: 80,
    currentPrice: 80,
    consumable: true,
    maxQuantity: 3,
    requiresLevel: 3,
    alwaysAvailable: true,
    effects: {
      restorePlayerEnergy: 5
    }
  },

  {
    id: 'coffee_machine',
    name: 'Coffee Machine',
    description: 'Start each day with +2 bonus energy',
    icon: '☕',
    category: 'equipment',
    rarity: 'uncommon',
    basePrice: 200,
    currentPrice: 200,
    consumable: false,
    maxQuantity: 1,
    alwaysAvailable: true,
    effects: {
      dailyEnergyBonus: 2
    }
  },

  // === EFFICIENCY UPGRADES ===
  {
    id: 'comfy_leash',
    name: 'Comfortable Leash',
    description: 'Makes walking more efficient - reduces walk energy cost by 1',
    icon: '🦮',
    category: 'equipment',
    rarity: 'common',
    basePrice: 75,
    currentPrice: 75,
    consumable: false,
    maxQuantity: 1,
    alwaysAvailable: true,
    effects: {
      reduceActionCost: [{
        action: 'walk',
        reduction: 1
      }]
    }
  },

  {
    id: 'grooming_kit',
    name: 'Professional Grooming Kit',
    description: 'Increases grooming effectiveness by 50%',
    icon: '✂️',
    category: 'equipment',
    rarity: 'uncommon',
    basePrice: 120,
    currentPrice: 120,
    consumable: false,
    maxQuantity: 1,
    requiresLevel: 2,
    alwaysAvailable: true,
    effects: {
      improveActionEffect: [{
        action: 'groom',
        multiplier: 1.5
      }]
    }
  },

  {
    id: 'training_treats',
    name: 'Training Treats',
    description: 'Makes training sessions 30% more effective',
    icon: '🎯',
    category: 'supplies',
    rarity: 'uncommon',
    basePrice: 60,
    currentPrice: 60,
    consumable: true,
    maxQuantity: 6,
    requiresLevel: 2,
    alwaysAvailable: true,
    effects: {
      improveActionEffect: [{
        action: 'train',
        multiplier: 1.3
      }]
    }
  },

  // === AUTOMATION ===
  {
    id: 'auto_feeder',
    name: 'Automatic Feeder',
    description: 'Automatically feeds one animal per day without using energy',
    icon: '🤖',
    category: 'automation',
    rarity: 'rare',
    basePrice: 400,
    currentPrice: 400,
    consumable: false,
    maxQuantity: 1,
    requiresLevel: 5,
    alwaysAvailable: false,
    unlockDay: 7,
    effects: {
      autoFeeding: true,
      reduceActionCost: [{
        action: 'feed',
        reduction: 1
      }]
    }
  },

  // === COMFORT & PASSIVE BENEFITS ===
  {
    id: 'comfort_beds',
    name: 'Comfort Beds',
    description: 'Animals recover +1 energy per day passively',
    icon: '🛏️',
    category: 'comfort',
    rarity: 'uncommon',
    basePrice: 180,
    currentPrice: 180,
    consumable: false,
    maxQuantity: 1,
    requiresLevel: 3,
    alwaysAvailable: true,
    effects: {
      passiveHealth: 5, // Animals gain 5 health per day
      increaseMaxAnimalEnergy: 1 // All animals get +1 max energy
    }
  },

  // === ADVANCED EQUIPMENT ===
  {
    id: 'medical_kit',
    name: 'Advanced Medical Kit',
    description: 'Medical care is 40% more effective and costs 1 less energy',
    icon: '🏥',
    category: 'medical',
    rarity: 'rare',
    basePrice: 250,
    currentPrice: 250,
    consumable: false,
    maxQuantity: 1,
    requiresLevel: 4,
    alwaysAvailable: true,
    effects: {
      reduceActionCost: [{
        action: 'medical',
        reduction: 1
      }],
      improveActionEffect: [{
        action: 'medical',
        multiplier: 1.4
      }]
    }
  }
];