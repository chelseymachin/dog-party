import React from 'react';
import { 
  Group, 
  Title, 
  Badge, 
  ActionIcon, 
  Burger,
  Flex,
} from '@mantine/core';
import { Menu, Settings, HelpCircle } from 'lucide-react';
import { useDayStore, useUIStore, useGameStore } from '@/stores';

const Header: React.FC = () => {
  const currentDay = useDayStore(state => state.currentDay);
  const budget = useGameStore(state => state.budget);
  const { 
    isMobile, 
    mobileSidebarCollapsed,
    toggleMobileSidebar, 
    toggleNavigation,
    openModal,
    setCurrentView 
  } = useUIStore();
  
  return (
    <Flex
      h="100%"
      px="md"
      align="center"
      justify="space-between"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--mantine-color-pink-2)',
      }}
    >
      {/* Left side - Logo and Navigation */}
      <Group>
        {!isMobile && (
          <ActionIcon
            variant="subtle"
            color="pink"
            size="lg"
            onClick={toggleNavigation}
          >
            <Menu size={20} />
          </ActionIcon>
        )}
        
        <Title 
          order={1} 
          size="h2" 
          c="pink.6"
          style={{ 
            fontFamily: 'Poppins, sans-serif',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span>🐾</span>
          {isMobile ? 'Dog Party' : 'Dog Party: Shelter Simulator'}
        </Title>
      </Group>
      
      
      {/* Right side - Budget and Actions */}
      <Group>
        {!isMobile && (
          <>
            <ActionIcon
              variant="subtle"
              color="gray"
              size="lg"
              onClick={() => openModal('settings')}
            >
              <Settings size={20} />
            </ActionIcon>
            
            <ActionIcon
              variant="subtle"
              color="gray"
              size="lg"
              onClick={() => setCurrentView('dashboard')}
            >
              <HelpCircle size={20} />
            </ActionIcon>
          </>
        )}
        
        {isMobile && (
          <Burger
            opened={!mobileSidebarCollapsed}
            onClick={toggleMobileSidebar}
            color="var(--mantine-color-pink-6)"
            size="sm"
          />
        )}
      </Group>
    </Flex>
  );
};

export default Header;