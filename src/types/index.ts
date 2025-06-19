// Export all animal-related types
export type {
    AnimalType,
    AnimalSize,
    AnimalAge,
    AnimalStatus,
    Animal,
    AnimalBreed
  } from './animal';
  
  export {
    ANIMAL_BREEDS,
    calculateMaxEnergy
  } from './animal';
  
  // Export all player-related types
  export type {
    Player,
    PlayerSkills,
    PlayerStats
  } from './player';
  
  // Export all action-related types
  export type {
    ActionType,
    ActionCost,
    ActionEffect,
    ActionResult,
    ActionValidation
  } from './actions';
  
  export {
    ACTION_DEFINITIONS
  } from './actions';
  
  // Export all day/time-related types
  export type {
    DayHistory,
    DayEvent,
    DailyGoal,
    DayEndSummary
  } from './day';
  
  export {
    DAILY_GOAL_TEMPLATES
  } from './day';
  
  // Export all shop-related types
  export type {
    ItemCategory,
    ItemRarity,
    ShopItem,
    ItemEffect,
    Inventory,
    Purchase
  } from './shop';
  
  export {
    SHOP_ITEMS
  } from './shop';
  
  // Export game state types
  export type {
    GameState,
    ShelterStats,
    GameSettings,
    SaveData
  } from './game';
  
  // Export UI state types
  export type {
    UIState,
    ModalType,
    NotificationType,
    Notification,
    ViewMode
  } from './ui';
  
  // Re-export commonly used utility types
  export type ID = string;
  export type Timestamp = Date;
  export type Currency = number;
  export type Percentage = number; // 0-100
  export type Multiplier = number; // Usually 0.5-2.0