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
  // Basic Supplies
  {
    id: 'basic_food',
    name: 'Basic Dog Food',
    description: 'Standard nutrition for daily feeding',
    icon: '🍖',
    category: 'supplies',
    rarity: 'common',
    basePrice: 25,
    currentPrice: 25,
    consumable: true,
    alwaysAvailable: true,
    effects: {
      // Used when feeding animals
    }
  },
  
  {
    id: 'premium_food',
    name: 'Premium Dog Food',
    description: 'High-quality nutrition that boosts health significantly',
    icon: '🥩',
    category: 'supplies',
    rarity: 'uncommon',
    basePrice: 75,
    currentPrice: 75,
    consumable: true,
    alwaysAvailable: true,
    effects: {
      improveActionEffect: [{
        action: 'feed',
        multiplier: 1.5
      }]
    }
  },
  
  // Energy Items
  {
    id: 'energy_drink',
    name: 'Energy Drink',
    description: 'Restore 3 energy points during the day',
    icon: '⚡',
    category: 'energy',
    rarity: 'common',
    basePrice: 25,
    currentPrice: 25,
    consumable: true,
    maxQuantity: 5,
    alwaysAvailable: true,
    effects: {
      restorePlayerEnergy: 3
    }
  },
  
  {
    id: 'coffee_machine',
    name: 'Coffee Machine',
    description: 'Start each day with +2 bonus energy',
    icon: '☕',
    category: 'equipment',
    rarity: 'uncommon',
    basePrice: 150,
    currentPrice: 150,
    consumable: false,
    maxQuantity: 1,
    alwaysAvailable: true,
    effects: {
      dailyEnergyBonus: 2
    }
  },
  
  // Automation
  {
    id: 'auto_feeder',
    name: 'Automatic Feeder',
    description: 'Automatically feeds animals without using your energy',
    icon: '🤖',
    category: 'automation',
    rarity: 'rare',
    basePrice: 200,
    currentPrice: 200,
    consumable: false,
    maxQuantity: 1,
    requiresLevel: 5,
    alwaysAvailable: false,
    unlockDay: 7,
    effects: {
      autoFeeding: true,
      reduceActionCost: [{
        action: 'feed',
        reduction: 1 // Feeding costs 0 energy instead of 1
      }]
    }
  },
  
  // Equipment
  {
    id: 'exercise_equipment',
    name: 'Exercise Equipment',
    description: 'Professional equipment that makes exercise more efficient',
    icon: '🏃‍♂️',
    category: 'equipment',
    rarity: 'rare',
    basePrice: 300,
    currentPrice: 300,
    consumable: false,
    maxQuantity: 1,
    requiresLevel: 8,
    alwaysAvailable: false,
    unlockDay: 10,
    effects: {
      reduceActionCost: [{
        action: 'exercise',
        reduction: 1
      }],
      improveActionEffect: [{
        action: 'exercise',
        multiplier: 1.3
      }]
    }
  },
  
  // Comfort Items
  {
    id: 'comfort_beds',
    name: 'Comfort Beds',
    description: 'Luxury beds that help animals recover energy faster',
    icon: '🛏️',
    category: 'comfort',
    rarity: 'uncommon',
    basePrice: 120,
    currentPrice: 120,
    consumable: false,
    maxQuantity: 3,
    alwaysAvailable: true,
    effects: {
      increaseMaxAnimalEnergy: 1,
      passiveHappiness: 2
    }
  },
  
  // Shelter Upgrades
  {
    id: 'kennel_expansion',
    name: 'Kennel Expansion',
    description: 'Add capacity for one additional animal',
    icon: '🏠',
    category: 'equipment',
    rarity: 'epic',
    basePrice: 500,
    currentPrice: 500,
    consumable: false,
    maxQuantity: 5,
    alwaysAvailable: true,
    effects: {
      increaseShelterCapacity: 1
    }
  },
  
  // Medical
  {
    id: 'medical_kit',
    name: 'Medical Kit',
    description: 'Essential supplies for treating sick animals',
    icon: '💉',
    category: 'medical',
    rarity: 'common',
    basePrice: 50,
    currentPrice: 50,
    consumable: true,
    maxQuantity: 10,
    alwaysAvailable: true,
    effects: {
      // Required for medical actions
    }
  },
  
  {
    id: 'veterinary_station',
    name: 'Veterinary Station',
    description: 'Professional medical equipment for advanced care',
    icon: '🏥',
    category: 'equipment',
    rarity: 'epic',
    basePrice: 750,
    currentPrice: 750,
    consumable: false,
    maxQuantity: 1,
    requiresLevel: 10,
    requiresReputation: 50,
    alwaysAvailable: false,
    unlockDay: 15,
    effects: {
      reduceActionCost: [{
        action: 'medical',
        reduction: 1
      }],
      improveActionEffect: [{
        action: 'medical',
        multiplier: 1.5
      }],
      reduceSicknessChance: 0.3
    }
  }
];