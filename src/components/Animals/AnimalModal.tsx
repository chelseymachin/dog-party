// src/components/Animals/AnimalModal.tsx

import React, { useState, useEffect } from 'react';
import { 
  Stack, 
  Text, 
  Button, 
  Paper, 
  Group, 
  Badge, 
  Progress, 
  SimpleGrid,
  Flex,
  ActionIcon,
  Tooltip,
  ScrollArea,
  Card,
  Alert,
  Collapse,
} from '@mantine/core';
import { 
  Heart, 
  Zap, 
  Sparkles, 
  Info,
  Home,
  Star,
  Clock,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useUIStore, useAnimalStore } from '@/stores';
import { type ActionType } from '@/types';
import AnimalSprite from './AnimalSprite';
import ActionButton from './ActionButton';

interface AnimalModalProps {
  animalId: string;
}

const AnimalModal: React.FC<AnimalModalProps> = ({ animalId }) => {
  const { closeModal, isMobile } = useUIStore();
  const animal = useAnimalStore(state => state.getAnimal(animalId));
  const adoptAnimal = useAnimalStore(state => state.adoptAnimal);
  const lastActionResult = useUIStore(state => state.lastActionResult);
  
  const [currentAnimation, setCurrentAnimation] = useState<'idle' | 'feeding' | 'walking' | 'medical' | 'playing'>('idle');
  const [expandedSections, setExpandedSections] = useState({
    stats: true,
    history: false,
    backstory: true,
    personality: false,
    actions: true,
  });

  useEffect(() => {
    if (lastActionResult?.animalId === animalId && lastActionResult.success) {
      setCurrentAnimation(lastActionResult.action as any);
    }
  }, [lastActionResult, animalId]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleAnimationComplete = () => {
    setCurrentAnimation('idle');
  };
  
  if (!animal) {
    return (
      <Stack>
        <Text c="red">Animal not found</Text>
        <Button onClick={closeModal}>Close</Button>
      </Stack>
    );
  }

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

  const handleAdoption = async () => {
    if (animal.status === 'ready_for_adoption') {
      const result = adoptAnimal(animal.id);
      if (result.success) {
        closeModal();
      }
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'Never';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <ScrollArea.Autosize mah="80vh" mx="auto">
      <Stack gap="lg" p="md">
        {/* Header with Animal Info */}
        <Paper p="lg" radius="md" bg="pink.0" style={{ border: '1px solid var(--mantine-color-pink-2)', marginTop: '16px' }}>
          <Flex justify="center" align="center" mb="md">
            <Group align="center" gap="lg">
              <AnimalSprite
                breed={animal.breed}
                color={animal.color}
                animation={currentAnimation as ActionType} // Type assertion to ensure compatibility
                size={96}
                onAnimationComplete={handleAnimationComplete}
              />
              
              <div style={{ flex: 1 }}>
                <Group gap="xs" mb={4}>
                  <Text size="xl" fw={700} c="pink.8">
                    {animal.name}
                  </Text>
                  {animal.needsMedical && (
                    <Tooltip label="Needs medical attention">
                      <ActionIcon size="sm" color="red" variant="light">
                        <Heart size={16} />
                      </ActionIcon>
                    </Tooltip>
                  )}
                </Group>
              
                <Text size="md" c="gray.7" mb="xs" ta="left">
                  {animal.breed} • {animal.age} • {animal.size}
                </Text>
              
                <Group gap="xs">
                  <Badge color={getStatusColor()} variant="light" size="md">
                    {getStatusLabel()}
                  </Badge>
                  <Badge color="gray" variant="outline" size="md">
                    Day {animal.daysInShelter + 1}
                  </Badge>
                  <Badge color="green" variant="outline" size="md">
                    ${animal.adoptionFee}
                  </Badge>
                </Group>
              </div>
            </Group>
          </Flex>

          {/* Adoption Button - Prominent if ready */}
          {animal.status === 'ready_for_adoption' && (
            <Alert
              icon={<Home size={16} />}
              title="Ready for Adoption!"
              color="blue"
              variant="light"
              mb="md"
            >
              <Group justify="space-between">
                <Text size="sm">
                  {animal.name} is ready to find their forever home!
                </Text>
                <Button
                  color="blue"
                  variant="filled"
                  leftSection={<Home size={16} />}
                  onClick={handleAdoption}
                >
                  Adopt for ${animal.adoptionFee}
                </Button>
              </Group>
            </Alert>
          )}
        </Paper>

        {/* Action Buttons */}
        <Card padding="md" radius="md" withBorder>
          <Group justify="space-between" mb="md" style={{ cursor: 'pointer' }} onClick={() => toggleSection('actions')}>
            <Text size="lg" fw={600} c="gray.8">
              Care Actions
            </Text>
            <ActionIcon variant="subtle" size="sm">
              {expandedSections.actions ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </ActionIcon>
          </Group>

          <Collapse in={expandedSections.actions}>

          {/* Priority Actions */}
          {animal.needsMedical && (
            <Alert
              icon={<AlertTriangle size={16} />}
              title="Medical Attention Required"
              color="red"
              variant="light"
              mb="md"
            >
              <Text size="sm" mb="xs">
                {animal.name} needs immediate medical care!
              </Text>
              <ActionButton
                animalId={animal.id}
                action="medical"
                size="sm"
                variant="filled"
              />
            </Alert>
          )}

          {/* Primary Actions */}
          <Text size="md" fw={500} mb="sm" c="gray.7">Essential Care</Text>
          <SimpleGrid cols={isMobile ? 1 : 2} spacing="sm" mb="lg">
            <ActionButton
              animalId={animal.id}
              action="feed"
              size="md"
              fullWidth
            />
            <ActionButton
              animalId={animal.id}
              action="walk"
              size="md"
              fullWidth
            />
          </SimpleGrid>

          {/* Secondary Actions */}
          <Text size="md" fw={500} mb="sm" c="gray.7">Additional Care</Text>
          <SimpleGrid cols={isMobile ? 1 : 3} spacing="sm" mb="lg">
            <ActionButton
              animalId={animal.id}
              action="play"
              size="sm"
              fullWidth
            />
            <ActionButton
              animalId={animal.id}
              action="groom"
              size="sm"
              fullWidth
            />
            <ActionButton
              animalId={animal.id}
              action="train"
              size="sm"
              fullWidth
            />
          </SimpleGrid>

          {/* Advanced Actions */}
          <Text size="md" fw={500} mb="sm" c="gray.7">Advanced Care</Text>
          <SimpleGrid cols={isMobile ? 1 : 2} spacing="sm">
            <ActionButton
              animalId={animal.id}
              action="exercise"
              size="sm"
              fullWidth
            />
            <ActionButton
              animalId={animal.id}
              action="socialize"
              size="sm"
              fullWidth
            />
          </SimpleGrid>
          </Collapse>
        </Card>

        {/* Stats Overview */}
        <Card padding="md" radius="md" withBorder>
          <Group justify="space-between" mb="md" style={{ cursor: 'pointer' }} onClick={() => toggleSection('stats')}>
            <Group gap="xs">
              <Star size={18} />
              <Text size="lg" fw={600} c="gray.8">
                Health & Wellness
              </Text>
            </Group>
            <ActionIcon variant="subtle" size="sm">
              {expandedSections.stats ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </ActionIcon>
          </Group>

          <Collapse in={expandedSections.stats}>

          {/* Energy Status */}
          <Group justify="space-between" mb="xs">
            <Text size="sm" fw={500} c="gray.7">
              <Zap size={16} style={{ marginRight: 4, marginBottom: -2 }} />
              Energy
            </Text>
            <Badge size="md" color={getEnergyColor()} variant="light">
              {animal.energy}/{animal.maxEnergy}
            </Badge>
          </Group>
          
          <Progress
            value={(animal.energy / animal.maxEnergy) * 100}
            color={getEnergyColor()}
            size="md"
            radius="xl"
            mb="lg"
          />

          {/* Health and Happiness */}
          <SimpleGrid cols={2} spacing="md" mb="lg">
            <div>
              <Group justify="space-between" mb={8}>
                <Text size="sm" fw={500} c="gray.7">Health</Text>
                <Text size="sm" fw={600}>{animal.health}%</Text>
              </Group>
              <Progress
                value={animal.health}
                color={animal.health >= 70 ? 'green' : animal.health >= 40 ? 'yellow' : 'red'}
                size="md"
                radius="xl"
              />
            </div>
            
            <div>
              <Group justify="space-between" mb={8}>
                <Text size="sm" fw={500} c="gray.7">Happiness</Text>
                <Text size="sm" fw={600}>{animal.happiness}%</Text>
              </Group>
              <Progress
                value={animal.happiness}
                color={animal.happiness >= 70 ? 'blue' : animal.happiness >= 40 ? 'yellow' : 'red'}
                size="md"
                radius="xl"
              />
            </div>
          </SimpleGrid>

          {/* Adoption Readiness */}
          <Group justify="space-between" mb="xs">
            <Text size="sm" fw={500} c="gray.7">
              <Sparkles size={16} style={{ marginRight: 4, marginBottom: -2 }} />
              Adoption Readiness
            </Text>
            <Text size="sm" fw={600}>
              {animal.adoptionReadiness}%
            </Text>
          </Group>
          
          <Progress
            value={animal.adoptionReadiness}
            color={animal.adoptionReadiness >= 80 ? 'blue' : 'gray'}
            size="md"
            radius="xl"
          />
          </Collapse>
        </Card>

        {/* Care History */}
        <Card padding="md" radius="md" withBorder>
          <Group justify="space-between" mb="md" style={{ cursor: 'pointer' }} onClick={() => toggleSection('history')}>
            <Group gap="xs">
              <Clock size={18} />
              <Text size="lg" fw={600} c="gray.8">
                Care History
              </Text>
            </Group>
            <ActionIcon variant="subtle" size="sm">
              {expandedSections.history ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </ActionIcon>
          </Group>

          <Collapse in={expandedSections.history}>
            <SimpleGrid cols={1} spacing="xs">
              <Group justify="space-between">
                <Text size="sm" c="gray.6">Last Fed:</Text>
                <Text size="sm" fw={500}>{formatDate(animal.lastFeed)}</Text>
              </Group>
              <Group justify="space-between">
                <Text size="sm" c="gray.6">Last Walked:</Text>
                <Text size="sm" fw={500}>{formatDate(animal.lastWalk)}</Text>
              </Group>
              <Group justify="space-between">
                <Text size="sm" c="gray.6">Last Groomed:</Text>
                <Text size="sm" fw={500}>{formatDate(animal.lastGroom)}</Text>
              </Group>
            </SimpleGrid>
          </Collapse>
        </Card>

        {/* Backstory */}
        {animal.backstory && (
          <Card padding="md" radius="md" withBorder>
            <Group justify="space-between" mb="md" style={{ cursor: 'pointer' }} onClick={() => toggleSection('backstory')}>
              <Group gap="xs">
                <Info size={18} />
                <Text size="lg" fw={600} c="gray.8">
                  {animal.name}'s Story
                </Text>
              </Group>
              <ActionIcon variant="subtle" size="sm">
                {expandedSections.backstory ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </ActionIcon>
            </Group>

            <Collapse in={expandedSections.backstory}>
              <Text size="sm" c="gray.7" style={{ lineHeight: 1.6 }}>
                {animal.backstory}
              </Text>
            </Collapse>
          </Card>
        )}

        {/* Temperament & Special Needs */}
        {(animal.temperament.length > 0 || animal.specialNeeds.length > 0) && (
          <Card padding="md" radius="md" withBorder>
            <Group justify="space-between" mb="md" style={{ cursor: 'pointer' }} onClick={() => toggleSection('personality')}>
              <Text size="lg" fw={600} c="gray.8">
                Personality & Needs
              </Text>
              <ActionIcon variant="subtle" size="sm">
                {expandedSections.personality ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </ActionIcon>
            </Group>
            
            <Collapse in={expandedSections.personality}>
              {animal.temperament.length > 0 && (
                <div style={{ marginBottom: 12 }}>
                  <Text size="sm" fw={500} c="gray.7" mb="xs">Temperament:</Text>
                  <Group gap="xs">
                    {animal.temperament.map((trait, index) => (
                      <Badge key={index} size="sm" color="blue" variant="light">
                        {trait.replace('_', ' ')}
                      </Badge>
                    ))}
                  </Group>
                </div>
              )}
              
              {animal.specialNeeds.length > 0 && (
                <div>
                  <Text size="sm" fw={500} c="gray.7" mb="xs">Special Needs:</Text>
                  <Group gap="xs">
                    {animal.specialNeeds.map((need, index) => (
                      <Badge key={index} size="sm" color="orange" variant="light">
                        {need.replace('_', ' ')}
                      </Badge>
                    ))}
                  </Group>
                </div>
              )}
            </Collapse>
          </Card>
        )}

        {/* Close Button */}
        <Button 
          onClick={closeModal} 
          variant="light" 
          size="lg"
          fullWidth
        >
          Close
        </Button>
      </Stack>
    </ScrollArea.Autosize>
  );
};

export default AnimalModal;