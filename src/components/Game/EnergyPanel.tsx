import React from 'react';
import { 
  Paper, 
  Group, 
  Text, 
  Progress, 
  Button,
  Flex,
  Badge,
  Tooltip,
} from '@mantine/core';
import { Zap, Moon, Coffee } from 'lucide-react';
import { usePlayerStore, useGameActions, useUIStore } from '@/stores';

const EnergyPanel: React.FC = () => {
  const { player } = usePlayerStore();
  const { endCurrentDay } = useGameActions();
  const { openModal } = useUIStore();
  
  const energyPercentage = (player.energy / player.maxEnergy) * 100;
  
  const getEnergyColor = () => {
    if (energyPercentage >= 70) return 'green';
    if (energyPercentage >= 40) return 'yellow';
    return 'red';
  };
  
  const getEnergyStatus = () => {
    if (energyPercentage >= 80) return 'Energized';
    if (energyPercentage >= 60) return 'Good';
    if (energyPercentage >= 40) return 'Moderate';
    if (energyPercentage >= 20) return 'Low';
    return 'Exhausted';
  };
  
  const handleEndDay = () => {
    endCurrentDay();
  };
  
  const handleEnergyBoost = () => {
    openModal('energy_restore');
  };
  
  return (
    <Paper
      p="md"
      radius="md"
      style={{
        background: 'linear-gradient(135deg, var(--mantine-color-green-5), var(--mantine-color-green-6))',
        color: 'white',
        border: '1px solid var(--mantine-color-green-4)',
      }}
    >
      <Flex justify="space-between" align="center" mb="md">
        <Group>
          <Zap size={24} />
          <div>
            <Text size="lg" fw={600}>
              Your Energy: {player.energy}/{player.maxEnergy}
            </Text>
            <Text size="sm" opacity={0.9}>
              Status: {getEnergyStatus()}
            </Text>
          </div>
        </Group>
        
        <Badge
          color={getEnergyColor()}
          variant="filled"
          size="lg"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
        >
          {Math.round(energyPercentage)}%
        </Badge>
      </Flex>
      
      <Progress
        value={energyPercentage}
        color="white"
        size="lg"
        radius="xl"
        mb="md"
        styles={{
          root: {
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
          },
          section: {
            backgroundColor: 'white',
          }
        }}
      />
      
      <Flex justify="space-between" align="center" mb="sm">
        <Text size="sm" opacity={0.9}>
          Energy used today: {player.energySpentToday}
        </Text>
        
        <Group gap="xs">
          {player.energy <= 3 && (
            <Tooltip label="Restore energy with items">
              <Button
                size="xs"
                variant="white"
                color="green"
                leftSection={<Coffee size={14} />}
                onClick={handleEnergyBoost}
              >
                Boost
              </Button>
            </Tooltip>
          )}
          
          <Tooltip label="End the current day and restore energy">
            <Button
              size="xs"
              variant="white"
              color="green"
              leftSection={<Moon size={14} />}
              onClick={handleEndDay}
            >
              End Day
            </Button>
          </Tooltip>
        </Group>
      </Flex>
      
      {/* Energy Tips */}
      {player.energy <= 5 && (
        <Paper
          p="xs"
          radius="sm"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <Text size="xs" opacity={0.9}>
            💡 Tip: {player.energy <= 2 
              ? "You're almost out of energy! Consider ending the day or using an energy drink."
              : "Your energy is running low. Plan your remaining actions carefully."
            }
          </Text>
        </Paper>
      )}
    </Paper>
  );
};

export default EnergyPanel;