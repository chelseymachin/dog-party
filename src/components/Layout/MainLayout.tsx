import React, { useEffect, useRef } from 'react';
import { AppShell, Container } from '@mantine/core';
import { useUIStore, useGameActions } from '@/stores';
import Header from './Header';
import Navigation from './Navigation';
import MobileSidebar from './MobileSidebar';
import Modal from '../UI/Modal';
import NotificationContainer from '../UI/NotificationContainer';
import LoadingOverlay from '../UI/LoadingOverlay';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { 
    isLoading,
    isDayTransitioning,
    isMobile, 
    mobileSidebarCollapsed,
    navigationCollapsed,
    toggleMobileSidebar,
    toggleNavigation,
    setMobile,
  } = useUIStore();
  
  const { initializeNewGame } = useGameActions();
  
  // Use a ref to ensure we only initialize once
  const hasInitialized = useRef(false);
  
  // Initialize game on mount (only once)
  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      initializeNewGame();
    }
  }, []);
  
  // Handle responsive design and sidebar logic
  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth < 768;
      setMobile(newIsMobile);
      
      // When switching to mobile, close the sidebar
      // When switching to desktop, open the sidebar
      if (newIsMobile && !navigationCollapsed) {
        toggleNavigation();
      } else if (!newIsMobile && !mobileSidebarCollapsed) {
        // On desktop, sidebar should be open by default
        toggleMobileSidebar();
        toggleNavigation();
      }
    };
    
    // Set initial state
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setMobile, navigationCollapsed, mobileSidebarCollapsed, toggleMobileSidebar, toggleNavigation]);
  
  // Set global background color
  useEffect(() => {
    document.body.style.backgroundColor = 'var(--mantine-color-pink-0)';
    document.documentElement.style.backgroundColor = 'var(--mantine-color-pink-0)';
    
    return () => {
      document.body.style.backgroundColor = '';
      document.documentElement.style.backgroundColor = '';
    };
  }, []);
  
  // Desktop sidebar should show when not mobile and not collapsed
  const showDesktopSidebar = !isMobile && !navigationCollapsed;

  const getLoadingMessage = () => {
    if (isDayTransitioning) {
      return 'Transitioning to next day...';
    }
    if (isLoading) {
      return 'Loading your shelter...';
    }
    return undefined;
  };
  
  return (
    <>
      <AppShell
        header={{ height: 70 }}
        navbar={showDesktopSidebar ? { 
          width: 250, 
          breakpoint: 'md',
          collapsed: { mobile: true } // Always collapse on mobile
        } : undefined}
        padding="md"
        styles={{
          root: {
            backgroundColor: 'var(--mantine-color-pink-0)',
          },
          header: {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid var(--mantine-color-pink-2)',
            zIndex: 199, // Below drawer but above content
          },
          navbar: {
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            borderRight: '1px solid var(--mantine-color-pink-2)',
            zIndex: 100,
          },
          main: {
            backgroundColor: 'var(--mantine-color-pink-0)',
            minHeight: '100vh',
          }
        }}
      >
        <AppShell.Header>
          <Header />
        </AppShell.Header>
        
        {showDesktopSidebar && (
          <AppShell.Navbar p="md">
            <Navigation />
          </AppShell.Navbar>
        )}
        
        <AppShell.Main>
          <Container size="xl" px={isMobile ? 'xs' : 'md'}>
            {children}
          </Container>
        </AppShell.Main>
      </AppShell>
      
      {/* Mobile Sidebar - Only renders on mobile */}
      <MobileSidebar />

      {/* Global UI Elements - Outside AppShell to avoid z-index conflicts */}
      <Modal />
      <NotificationContainer />
      
      {/* Loading Overlay - Highest z-index */}
      {(isLoading || isDayTransitioning) && (
        <LoadingOverlay 
          message={getLoadingMessage()}
          visible={true}
        />
      )}
    </>
  );
};

export default MainLayout;