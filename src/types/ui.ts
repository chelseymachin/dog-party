export type ViewMode = 'dashboard' | 'shop' | 'adoptions' | 'stats' | 'settings';

export type ModalType = 
  'animal_care'
  | 'day_end_summary'
  | 'day_start'
  | 'shop_purchase'
  | 'adoption_confirm'
  | 'settings'
  | 'tutorial'
  | 'achievement'
  | 'energy_restore'
  | 'confirm_action';

export type NotificationType = 
  'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'achievement'
  | 'energy_low'
  | 'animal_sick'
  | 'adoption_ready';

export interface UIState {
  // Current view and navigation
  currentView: ViewMode;
  previousView?: ViewMode;
  
  // Modal management
  activeModal: ModalType | null;
  modalData?: any; // Data passed to the current modal
  modalHistory: ModalType[]; // For modal navigation
  
  // Loading states
  isLoading: boolean;
  loadingMessage?: string;
  
  // Notifications and alerts
  notifications: Notification[];
  
  // Selected items and focus
  selectedAnimalId?: string;
  selectedShopItem?: string;
  focusedElement?: string;
  
  // UI interaction states
  isDayTransitioning: boolean;
  isActionInProgress: boolean;
  draggedItem?: string;
  
  // Layout and responsive
  isMobile: boolean;
  mobileSidebarCollapsed: boolean;
  navigationCollapsed: boolean;
  showTutorialOverlay: boolean;
  
  // Filters and sorting
  animalSortBy: 'name' | 'health' | 'happiness' | 'energy' | 'adoption_readiness';
  animalFilterBy: 'all' | 'needs_care' | 'ready_for_adoption' | 'low_energy';
  shopFilterBy: 'all' | 'supplies' | 'energy' | 'equipment' | 'automation';
  
  // Animation and visual states
  animationsEnabled: boolean;
  lastActionResult?: {
    animalId: string;
    action: string;
    success: boolean;
    timestamp: number;
  };
  
  // Tutorial and onboarding
  tutorialStep?: string;
  highlightedElements: string[];
  tooltipVisible: boolean;
  tooltipContent?: string;
  tooltipPosition?: { x: number; y: number };
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  duration?: number; // Auto-dismiss after X milliseconds
  persistent?: boolean; // Don't auto-dismiss
  actions?: NotificationAction[];
  icon?: string;
  animalId?: string; // If related to a specific animal
}

export interface NotificationAction {
  label: string;
  action: string;
  style?: 'primary' | 'secondary' | 'danger';
}

// Default UI state
export const createInitialUIState = (): UIState => ({
  currentView: 'dashboard',
  activeModal: null,
  isLoading: false,
  notifications: [],
  isDayTransitioning: false,
  isActionInProgress: false,
  isMobile: window.innerWidth < 768,
  mobileSidebarCollapsed: false,
  navigationCollapsed: false,
  showTutorialOverlay: true,
  animalSortBy: 'name',
  animalFilterBy: 'all',
  shopFilterBy: 'all',
  animationsEnabled: true,
  modalHistory: [],
  highlightedElements: [],
  tooltipVisible: false,
});

// Helper functions for UI state management
export const createNotification = (
  type: NotificationType,
  title: string,
  message: string,
  options?: Partial<Notification>
): Notification => ({
  id: crypto.randomUUID(),
  type,
  title,
  message,
  timestamp: new Date(),
  duration: type === 'error' ? 5000 : 3000,
  ...options,
});

// Predefined notification templates
export const NOTIFICATION_TEMPLATES = {
  energyLow: (currentEnergy: number): Notification => createNotification(
    'warning',
    'Low Energy',
    `You only have ${currentEnergy} energy left. Consider ending the day or using an energy drink.`,
    { persistent: true, icon: '⚡' }
  ),
  
  animalSick: (animalName: string): Notification => createNotification(
    'error',
    'Animal Needs Medical Care',
    `${animalName} is sick and needs immediate medical attention!`,
    { persistent: true, icon: '🏥' }
  ),
  
  adoptionReady: (animalName: string): Notification => createNotification(
    'success',
    'Ready for Adoption!',
    `${animalName} is now ready to find their forever home!`,
    { icon: '🏡' }
  ),
  
  actionSuccess: (action: string, animalName: string): Notification => createNotification(
    'success',
    'Action Completed',
    `Successfully performed ${action} with ${animalName}`,
    { duration: 2000 }
  ),
  
  levelUp: (newLevel: number): Notification => createNotification(
    'achievement',
    'Level Up!',
    `Congratulations! You've reached level ${newLevel}!`,
    { persistent: true, icon: '🌟' }
  ),
  
  dayComplete: (day: number): Notification => createNotification(
    'info',
    'Day Complete',
    `Day ${day} has ended. Time to rest and prepare for tomorrow!`,
    { icon: '🌙' }
  ),
};