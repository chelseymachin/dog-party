// src/stores/uiStore.ts

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { 
  UIState, 
  ViewMode, 
  ModalType, 
  Notification, 
  NotificationType
} from '@/types';
import { createInitialUIState, createNotification } from '@/types/ui';

interface UIStore extends UIState {
  // Navigation
  setCurrentView: (view: ViewMode) => void;
  goBack: () => void;
  
  // Modal management
  openModal: (modal: ModalType, data?: any) => void;
  closeModal: () => void;
  closeAllModals: () => void;
  
  // Notifications
  addNotification: (notification: Notification) => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
  addQuickNotification: (type: NotificationType, title: string, message: string) => void;
  
  // Animal selection and focus
  selectAnimal: (animalId: string | undefined) => void;
  
  // Loading states
  setLoading: (loading: boolean, message?: string) => void;
  
  // Day transition
  setDayTransitioning: (transitioning: boolean) => void;
  
  // Action feedback
  setActionInProgress: (inProgress: boolean) => void;
  recordActionResult: (animalId: string, action: string, success: boolean) => void;
  
  // Filters and sorting
  setAnimalSortBy: (sortBy: UIState['animalSortBy']) => void;
  setAnimalFilterBy: (filterBy: UIState['animalFilterBy']) => void;
  setShopFilterBy: (filterBy: UIState['shopFilterBy']) => void;
  
  // Tutorial and onboarding
  setTutorialStep: (step: string | undefined) => void;
  highlightElement: (elementId: string) => void;
  removeHighlight: (elementId: string) => void;
  clearAllHighlights: () => void;
  showTooltip: (content: string, position: { x: number; y: number }) => void;
  hideTooltip: () => void;
  
  // Responsive
  setMobile: (isMobile: boolean) => void;
  toggleNavigation: () => void;
  toggleMobileSidebar: () => void;
  
  // Settings
  toggleAnimations: () => void;
  setTutorialOverlay: (show: boolean) => void;
  
  // Utility functions
  getActiveNotifications: () => Notification[];
  hasUnreadNotifications: () => boolean;
  getNotificationsByType: (type: NotificationType) => Notification[];
}

export const useUIStore = create<UIStore>()(
  devtools(
    (set, get) => ({
      // Initialize with default state
      ...createInitialUIState(),
      
      // Navigation
      setCurrentView: (view: ViewMode) => {
        set((state) => ({
          previousView: state.currentView,
          currentView: view,
        }), false, 'setCurrentView');
      },
      
      goBack: () => {
        const { previousView } = get();
        if (previousView) {
          set(() => ({
            currentView: previousView,
            previousView: undefined,
          }), false, 'goBack');
        }
      },
      
      // Modal management
      openModal: (modal: ModalType, data?: any) => {
        set((state) => ({
          activeModal: modal,
          modalData: data,
          modalHistory: [...state.modalHistory, modal],
        }), false, 'openModal');
      },
      
      closeModal: () => {
        set((state) => ({
          activeModal: null,
          modalData: undefined,
          modalHistory: state.modalHistory.slice(0, -1),
        }), false, 'closeModal');
      },
      
      closeAllModals: () => {
        set({
          activeModal: null,
          modalData: undefined,
          modalHistory: [],
        }, false, 'closeAllModals');
      },
      
      // Notifications
      addNotification: (notification: Notification) => {
        set((state) => ({
          notifications: [...state.notifications, notification]
        }), false, 'addNotification');
        
        // Auto-remove non-persistent notifications
        if (!notification.persistent && notification.duration) {
          setTimeout(() => {
            get().removeNotification(notification.id);
          }, notification.duration);
        }
      },
      
      removeNotification: (id: string) => {
        set((state) => ({
          notifications: state.notifications.filter(n => n.id !== id)
        }), false, 'removeNotification');
      },
      
      clearAllNotifications: () => {
        set({ notifications: [] }, false, 'clearAllNotifications');
      },
      
      addQuickNotification: (type: NotificationType, title: string, message: string) => {
        const notification = createNotification(type, title, message);
        get().addNotification(notification);
      },
      
      // Animal selection
      selectAnimal: (animalId: string | undefined) => {
        set({ selectedAnimalId: animalId }, false, 'selectAnimal');
      },
      
      // Loading states
      setLoading: (loading: boolean, message?: string) => {
        set({
          isLoading: loading,
          loadingMessage: message,
        }, false, 'setLoading');
      },
      
      // Day transition
      setDayTransitioning: (transitioning: boolean) => {
        set({ isDayTransitioning: transitioning }, false, 'setDayTransitioning');
      },
      
      // Action feedback
      setActionInProgress: (inProgress: boolean) => {
        set({ isActionInProgress: inProgress }, false, 'setActionInProgress');
      },
      
      recordActionResult: (animalId: string, action: string, success: boolean) => {
        set({
          lastActionResult: {
            animalId,
            action,
            success,
            timestamp: Date.now(),
          }
        }, false, 'recordActionResult');
        
        // Clear after 3 seconds
        setTimeout(() => {
          set({ lastActionResult: undefined }, false, 'clearActionResult');
        }, 3000);
      },
      
      // Filters and sorting
      setAnimalSortBy: (sortBy) => {
        set({ animalSortBy: sortBy }, false, 'setAnimalSortBy');
      },
      
      setAnimalFilterBy: (filterBy) => {
        set({ animalFilterBy: filterBy }, false, 'setAnimalFilterBy');
      },
      
      setShopFilterBy: (filterBy) => {
        set({ shopFilterBy: filterBy }, false, 'setShopFilterBy');
      },
      
      // Tutorial and onboarding
      setTutorialStep: (step: string | undefined) => {
        set({ tutorialStep: step }, false, 'setTutorialStep');
      },
      
      highlightElement: (elementId: string) => {
        set((state) => ({
          highlightedElements: [...state.highlightedElements, elementId]
        }), false, 'highlightElement');
      },
      
      removeHighlight: (elementId: string) => {
        set((state) => ({
          highlightedElements: state.highlightedElements.filter(id => id !== elementId)
        }), false, 'removeHighlight');
      },
      
      clearAllHighlights: () => {
        set({ highlightedElements: [] }, false, 'clearAllHighlights');
      },
      
      showTooltip: (content: string, position: { x: number; y: number }) => {
        set({
          tooltipVisible: true,
          tooltipContent: content,
          tooltipPosition: position,
        }, false, 'showTooltip');
      },
      
      hideTooltip: () => {
        set({
          tooltipVisible: false,
          tooltipContent: undefined,
          tooltipPosition: undefined,
        }, false, 'hideTooltip');
      },
      
      // Responsive
      setMobile: (isMobile: boolean) => {
        set({ isMobile }, false, 'setMobile');
      },
    
      toggleNavigation: () => {
        set((state) => ({
          navigationCollapsed: !state.navigationCollapsed
        }), false, 'toggleNavigation');
      },

      toggleMobileSidebar: () => {
        set((state) => ({
          mobileSidebarCollapsed: !state.mobileSidebarCollapsed
        }), false, 'toggleMobileSidebar');
      },
      
      // Settings
      toggleAnimations: () => {
        set((state) => ({
          animationsEnabled: !state.animationsEnabled
        }), false, 'toggleAnimations');
      },
      
      setTutorialOverlay: (show: boolean) => {
        set({ showTutorialOverlay: show }, false, 'setTutorialOverlay');
      },
      
      // Utility functions
      getActiveNotifications: () => {
        return get().notifications.filter(n => 
          !n.persistent || Date.now() - n.timestamp.getTime() < (n.duration || 5000)
        );
      },
      
      hasUnreadNotifications: () => {
        return get().notifications.length > 0;
      },
      
      getNotificationsByType: (type: NotificationType) => {
        return get().notifications.filter(n => n.type === type);
      },
    }),
    {
      name: 'ui-store',
      enabled: process.env.NODE_ENV === 'development',
    }
  )
);