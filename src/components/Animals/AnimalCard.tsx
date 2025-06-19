import React from 'react';
import { 
  Card, 
  Group, 
  Text, 
  Badge, 
  Progress, 
  SimpleGrid,
  Flex,
  ActionIcon,
  Tooltip,
} from '@mantine/core';
import { Heart, Zap, Sparkles } from 'lucide-react';
import { type Animal } from '@/types';
import { useUIStore } from '@/stores';
import ActionButton from './ActionButton';

interface AnimalCardProps {
  animal: Animal;
}

const AnimalCard: React.FC<AnimalCardProps> = ({ animal }) => {
  const { openModal, selectAnimal } = useUIStore();
  
  const getStatusColor = () => {
    switch (animal.status) {
      case 'healthy': return 'green';
      case 'needs_care': return 'yellow';
      case 'sick': return 'red';
      case 'ready_for_adoption': return 'blue';
      default: return 'gray';
    }
  };
  
  const getStatusLabel = () => {
    switch (animal.status) {
      case 'healthy': return 'Healthy';
      case 'needs_care': return 'Needs Care';
      case 'sick': return 'Sick';
      case 'ready_for_adoption': return 'Ready for Adoption';
      default: return 'Unknown';
    }
  };
  
  const getEnergyColor = () => {
    const percentage = (animal.energy / animal.maxEnergy) * 100;
    if (percentage >= 70) return 'green';
    if (percentage >= 40) return 'yellow';
    return 'red';
  };
  
  const handleCardClick = () => {
    selectAnimal(animal.id);
    openModal('animal_care', { animalId: animal.id });
  };
  
  return (
    <Card
      shadow="sm"
      padding="md"
      radius="md"
      withBorder
      style={{
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        border: '1px solid var(--mantine-color-pink-2)',
        backgroundColor: 'white',
        height: 'fit-content',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(236, 72, 153, 0.15)';
        e.currentTarget.style.borderColor = 'var(--mantine-color-pink-3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '';
        e.currentTarget.style.borderColor = 'var(--mantine-color-pink-2)';
      }}
      onClick={handleCardClick}
    >
      {/* Header */}
      <Flex justify="space-between" align="flex-start" mb="md">
        <div>
          <Group gap="xs" mb={4}>
            <Text size="lg" fw={600} c="gray.8">
              🐕 {animal.name}
            </Text>
            {animal.needsMedical && (
              <Tooltip label="Needs medical attention">
                <ActionIcon size="sm" color="red" variant="light">
                  <Heart size={12} />
                </ActionIcon>
              </Tooltip>
            )}
          </Group>
          <Text size="sm" c="gray.6">
            {animal.breed} • {animal.age} • {animal.size}
          </Text>
        </div>
        
        <Badge 
          color={getStatusColor()} 
          variant="light"
          size="sm"
        >
          {getStatusLabel()}
        </Badge>
      </Flex>
      
      {/* Energy Status */}
      <Group justify="space-between" mb="xs">
        <Text size="sm" fw={500} c="gray.7">
          <Zap size={14} style={{ marginRight: 4 }} />
          Energy
        </Text>
        <Badge 
          size="sm" 
          color={getEnergyColor()}
          variant="light"
        >
          {animal.energy}/{animal.maxEnergy}
        </Badge>
      </Group>
      
      <Progress
        value={(animal.energy / animal.maxEnergy) * 100}
        color={getEnergyColor()}
        size="sm"
        radius="xl"
        mb="md"
      />
      
      {/* Health and Happiness Bars */}
      <SimpleGrid cols={2} spacing="xs" mb="md">
        <div>
          <Group justify="space-between" mb={4}>
            <Text size="xs" c="gray.6">Health</Text>
            <Text size="xs" fw={500}>{animal.health}%</Text>
          </Group>
          <Progress
            value={animal.health}
            color={animal.health >= 70 ? 'green' : animal.health >= 40 ? 'yellow' : 'red'}
            size="xs"
            radius="xl"
          />
        </div>
        
        <div>
          <Group justify="space-between" mb={4}>
            <Text size="xs" c="gray.6">Happiness</Text>
            <Text size="xs" fw={500}>{animal.happiness}%</Text>
          </Group>
          <Progress
            value={animal.happiness}
            color={animal.happiness >= 70 ? 'blue' : animal.happiness >= 40 ? 'yellow' : 'red'}
            size="xs"
            radius="xl"
          />
        </div>
      </SimpleGrid>
      
      {/* Adoption Readiness */}
      <Group justify="space-between" mb="xs">
        <Text size="sm" fw={500} c="gray.7">
          <Sparkles size={14} style={{ marginRight: 4 }} />
          Adoption Ready
        </Text>
        <Text size="sm" fw={500}>
          {animal.adoptionReadiness}%
        </Text>
      </Group>
      
      <Progress
        value={animal.adoptionReadiness}
        color={animal.adoptionReadiness >= 80 ? 'blue' : 'gray'}
        size="sm"
        radius="xl"
        mb="md"
      />
      
      {/* Quick Actions */}
      <SimpleGrid cols={2} spacing="xs" mb="xs">
        <ActionButton
          animalId={animal.id}
          action="feed"
          size="xs"
          fullWidth
          onClick={(e) => e.stopPropagation()}
        />
        <ActionButton
          animalId={animal.id}
          action="walk"
          size="xs"
          fullWidth
          onClick={(e) => e.stopPropagation()}
        />
        {animal.needsMedical && (
          <>
            <ActionButton
              animalId={animal.id}
              action="medical"
              size="xs"
              fullWidth
              variant="filled"
              onClick={(e) => e.stopPropagation()}
            />
            <div /> {/* Empty cell for grid alignment */}
          </>
        )}
      </SimpleGrid>
      
      {/* Days in Shelter */}
      <Text size="xs" c="gray.5" ta="center" mt="xs">
        Day {animal.daysInShelter + 1} in shelter
      </Text>
    </Card>
  );
};

export default AnimalCard;