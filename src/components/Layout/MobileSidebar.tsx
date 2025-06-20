import React from 'react';
import { 
  Drawer,
  Stack, 
  Button, 
  Divider, 
  Text, 
  Badge,
  Group
} from '@mantine/core';
import { 
  Home, 
  ShoppingCart, 
  Heart, 
  BarChart3,
  Settings
} from 'lucide-react';
import { useUIStore, useAnimalStore, useDayStore, useGameStore } from '@/stores';
import { type ViewMode } from '@/types';

const MobileSidebar: React.FC = () => {
  const { 
    currentView, 
    setCurrentView, 
    isMobile, 
    mobileSidebarCollapsed,
    toggleMobileSidebar,
  } = useUIStore();
  
  const budget = useGameStore(state => state.budget);
  const currentDay = useDayStore(state => state.currentDay);
  
  // Get store instances and call functions properly
  const animalStore = useAnimalStore();
  const adoptableAnimals = animalStore.getAdoptableAnimals();
  const animalsNeedingCare = animalStore.getAnimalsNeedingCare();
  
  const completedGoals = useDayStore(state => state.completedGoals.length);
  const totalGoals = useDayStore(state => state.currentDayGoals.length);
  
  const navigationItems: Array<{
    id: ViewMode;
    label: string;
    icon: React.ReactNode;
    badge?: number;
    color?: string;
  }> = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <Home size={20} />,
      badge: animalsNeedingCare.length > 0 ? animalsNeedingCare.length : undefined,
      color: animalsNeedingCare.length > 0 ? 'red' : undefined,
    },
    {
      id: 'shop',
      label: 'Shop',
      icon: <ShoppingCart size={20} />,
    },
    {
      id: 'rescue',
      label: 'Rescue',
      icon: <Heart size={20} />,
      badge: adoptableAnimals.length > 0 ? adoptableAnimals.length : undefined,
      color: 'green',
    },
    {
      id: 'stats',
      label: 'Statistics',
      icon: <BarChart3 size={20} />,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings size={20} />,
    },
  ];
  
  const handleNavigation = (viewId: ViewMode) => {
    setCurrentView(viewId);
    toggleMobileSidebar(); // Close sidebar after navigation
  };
  
  // Only render if mobile
  if (!isMobile) {
    return null;
  }
  
  return (
    <Drawer
      opened={!mobileSidebarCollapsed}
      onClose={toggleMobileSidebar}
      position="left"
      size="280px"
      withCloseButton={false}
      zIndex={1000}
      styles={{
        root: {
          position: 'fixed',
        },
        inner: {
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        },
        content: {
          backgroundColor: 'white',
          border: 'none',
          borderRadius: 0,
        },
        body: {
          padding: 0,
          height: '100%',
          overflow: 'hidden',
        }
      }}
      overlayProps={{
        backgroundOpacity: 0.5,
        blur: 2,
      }}
    >
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{
          backgroundColor: 'var(--mantine-color-pink-0)',
          borderBottom: '1px solid var(--mantine-color-pink-3)',
          padding: '16px',
          marginTop: '70px',
          flexShrink: 0,
        }}>
          {/* Quick Stats in Header */}
          <Group gap="xs">
            <Badge
              size="sm"
              color="blue"
              variant="light"
            >
              📅 Day {currentDay}
            </Badge>
            <Badge
              size="sm"
              color="green"
              variant="light"
            >
              💰 ${budget}
            </Badge>
          </Group>
        </div>
        
        {/* Content */}
        <div style={{ 
          flex: 1, 
          padding: '16px', 
          overflow: 'auto',
          backgroundColor: 'var(--mantine-color-pink-0)',
        }}>
          <Stack gap="md">
            {/* Goals Progress */}
            <div style={{ 
              background: 'var(--mantine-color-pink-1)', 
              padding: '12px', 
              borderRadius: '8px',
              border: '1px solid var(--mantine-color-pink-3)'
            }}>
              <Text size="sm" fw={600} c="pink.7" mb="xs">
                📋 Today's Goals
              </Text>
              <Group justify="space-between">
                <Text size="sm" c="gray.6">
                  Progress
                </Text>
                <Badge 
                  size="sm" 
                  color={completedGoals === totalGoals ? 'green' : 'blue'}
                  variant="filled"
                >
                  {completedGoals}/{totalGoals}
                </Badge>
              </Group>
            </div>
            
            <Divider />
            
            {/* Navigation Items */}
            <Stack gap="xs">
              {navigationItems.map((item) => (
                <Button
                  key={item.id}
                  variant={currentView === item.id ? 'filled' : 'light'}
                  color="pink"
                  size="lg"
                  justify="flex-start"
                  leftSection={item.icon}
                  rightSection={
                    item.badge ? (
                      <Badge 
                        size="sm" 
                        color={item.color || 'pink'}
                        variant="filled"
                      >
                        {item.badge}
                      </Badge>
                    ) : null
                  }
                  onClick={() => handleNavigation(item.id)}
                  fullWidth
                  styles={{
                    root: {
                      height: '48px',
                      fontWeight: currentView === item.id ? 600 : 500,
                    },
                    inner: {
                      justifyContent: 'flex-start',
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Stack>
            
            <Divider />
            
            {/* Quick Stats */}
            <div style={{ 
              background: 'white', 
              padding: '12px', 
              borderRadius: '8px',
              border: '1px solid var(--mantine-color-gray-3)'
            }}>
              <Text size="sm" fw={600} c="gray.7" mb="xs">
                📊 Quick Stats
              </Text>
              <Stack gap={6}>
                <Group justify="space-between">
                  <Text size="sm" c="gray.6">Animals Needing Care</Text>
                  <Badge 
                    size="xs" 
                    color={animalsNeedingCare.length > 0 ? 'red' : 'green'}
                    variant="filled"
                  >
                    {animalsNeedingCare.length}
                  </Badge>
                </Group>
                <Group justify="space-between">
                  <Text size="sm" c="gray.6">Ready for Adoption</Text>
                  <Badge 
                    size="xs" 
                    color="green"
                    variant="filled"
                  >
                    {adoptableAnimals.length}
                  </Badge>
                </Group>
              </Stack>
            </div>
          </Stack>
        </div>
        
        {/* Footer */}
        <div style={{
          borderTop: '1px solid var(--mantine-color-pink-3)',
          padding: '12px 16px',
          backgroundColor: 'white',
          flexShrink: 0,
        }}>
          <Text size="xs" c="gray.5" ta="center">
            Dog Party: Shelter Simulator
          </Text>
        </div>
      </div>
    </Drawer>
  );
};

export default MobileSidebar;