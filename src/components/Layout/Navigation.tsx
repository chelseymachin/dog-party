// src/components/Layout/Navigation.tsx

import React from 'react';
import { 
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

const Navigation: React.FC = () => {
  const { currentView, setCurrentView, isMobile } = useUIStore();
  
  // Get store instances and call functions properly
  const animalStore = useAnimalStore();
  const adoptableAnimals = animalStore.getAdoptableAnimals();
  const animalsNeedingCare = animalStore.getAnimalsNeedingCare();

  const budget = useGameStore(state => state.budget);
  const currentDay = useDayStore(state => state.currentDay);
  
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
      id: 'adoptions',
      label: 'Adoptions',
      icon: <Heart size={20} />,
      badge: adoptableAnimals.length > 0 ? adoptableAnimals.length : undefined,
      color: 'green',
    },
    {
      id: 'stats',
      label: 'Statistics',
      icon: <BarChart3 size={20} />,
    },
  ];
  
  if (!isMobile) {
    navigationItems.push({
      id: 'settings',
      label: 'Settings',
      icon: <Settings size={20} />,
    });
  }
  
  return (
    <Stack gap="xs">
        {/* Header */}
        <div style={{
          padding: '4px',
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
      <Divider />
      {/* Goals Progress */}
      <div style={{ 
        background: 'var(--mantine-color-pink-0)', 
        padding: '12px', 
        borderRadius: '8px',
        border: '1px solid var(--mantine-color-pink-2)'
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
            variant="light"
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
            variant={currentView === item.id ? 'filled' : 'subtle'}
            color="pink"
            size="md"
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
            onClick={() => setCurrentView(item.id)}
            fullWidth
            styles={{
              root: {
                height: '44px',
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
        background: 'var(--mantine-color-gray-0)', 
        padding: '12px', 
        borderRadius: '8px',
        border: '1px solid var(--mantine-color-gray-2)'
      }}>
        <Text size="sm" fw={600} c="gray.7" mb="xs">
          📊 Quick Stats
        </Text>
        <Stack gap={4}>
          <Group justify="space-between">
            <Text size="xs" c="gray.6">Animals Needing Care</Text>
            <Text size="xs" fw={600} c={animalsNeedingCare.length > 0 ? 'red' : 'green'}>
              {animalsNeedingCare.length}
            </Text>
          </Group>
          <Group justify="space-between">
            <Text size="xs" c="gray.6">Ready for Adoption</Text>
            <Text size="xs" fw={600} c="green">
              {adoptableAnimals.length}
            </Text>
          </Group>
        </Stack>
      </div>
    </Stack>
  );
};

export default Navigation;