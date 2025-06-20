import React from 'react';
import { 
  Stack, 
  SimpleGrid, 
  Title, 
  Text, 
  Paper,
  Group,
  Badge,
  Container,
  Box
} from '@mantine/core';
import { AlertTriangle, Heart } from 'lucide-react';
import { useAnimalStore, useDayStore, useGameStore, usePlayerStore } from '@/stores';
import EnergyPanel from './EnergyPanel';
import AnimalGrid from '../Animals/AnimalGrid';
import GoalsPanel from '../Day/GoalsPanel';
import { useMediaQuery } from '@mantine/hooks';

const Dashboard: React.FC = () => {
  // Get all the data we need for the dashboard
  const animals = useAnimalStore(state => state.animals);
  const animalStore = useAnimalStore();
  
  // Call store functions properly (not in selectors)
  const animalsNeedingCare = animalStore.getAnimalsNeedingCare();
  const adoptableAnimals = animalStore.getAdoptableAnimals();
  
  const dayStore = useDayStore();
  const currentDay = dayStore.currentDay;
  const dayStats = dayStore.getDayStats();

  const isLargeScreen = useMediaQuery('(min-width: 1024px)');
  
  const gameStore = useGameStore();
  const shelterOccupancy = gameStore.getShelterOccupancy();
  const overallHealth = gameStore.calculateOverallHealth();
  const overallHappiness = gameStore.calculateOverallHappiness();
  
  const playerEnergy = usePlayerStore(state => state.player.energy);
  
  // Determine alerts and urgency
  const hasUrgentCare = animalsNeedingCare.length > 0;
  const hasLowEnergy = playerEnergy <= 3;
  const hasAdoptableAnimals = adoptableAnimals.length > 0;
  
  return (
    <Container size="xl" px={0}>
      <Stack gap="lg">
        {/* Welcome Header */}
        <Paper 
          p="lg" 
          radius="md" 
          bg="pink.0" 
          style={{ border: '1px solid var(--mantine-color-pink-2)' }}
        >
          <Group justify="space-between" align="flex-start" wrap="wrap">
            <Box>
              <Title order={2} c="pink.7" mb={4}>
                🌅 Good Morning, Shelter Manager!
              </Title>
              <Text c="gray.6" size="lg">
                Day {currentDay} • {animals.length} animal{animals.length !== 1 ? 's' : ''} in your care
              </Text>
            </Box>
            
            {/* Urgent Alerts */}
            <Group gap="xs">
              {hasLowEnergy && (
                <Badge 
                  leftSection={<AlertTriangle size={14} />}
                  color="orange" 
                  variant="filled" 
                  size="lg"
                >
                  Low Energy ({playerEnergy}/10)
                </Badge>
              )}
              {hasUrgentCare && (
                <Badge 
                  leftSection={<AlertTriangle size={14} />}
                  color="red" 
                  variant="filled" 
                  size="lg"
                >
                  {animalsNeedingCare.length} need{animalsNeedingCare.length === 1 ? 's' : ''} care
                </Badge>
              )}
              {hasAdoptableAnimals && (
                <Badge 
                  leftSection={<Heart size={14} />}
                  color="green" 
                  variant="filled" 
                  size="lg"
                >
                  {adoptableAnimals.length} ready for adoption
                </Badge>
              )}
            </Group>
          </Group>
        </Paper>
        
        {/* Status Row - Energy + Shelter Stats */}
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
          {/* Energy Panel */}
          <EnergyPanel />
          
          {/* Shelter Status */}
          <Paper p="md" radius="md" bg="white" style={{ border: '1px solid var(--mantine-color-gray-2)' }}>
            <Title order={4} size="h5" c="gray.8" mb="md">
              🏠 Shelter Status
            </Title>
            
            <SimpleGrid cols={2} spacing="md">
              <div>
                <Group justify="space-between" mb="xs">
                  <Text size="sm" c="gray.6">Capacity</Text>
                  <Badge 
                    color={shelterOccupancy.percentage >= 90 ? 'red' : shelterOccupancy.percentage >= 70 ? 'yellow' : 'green'}
                    variant="light"
                    size="sm"
                  >
                    {shelterOccupancy.current}/{shelterOccupancy.max}
                  </Badge>
                </Group>
                <Text size="xs" c="gray.5">
                  {shelterOccupancy.percentage}% full
                </Text>
              </div>
              
              <div>
                <Group justify="space-between" mb="xs">
                  <Text size="sm" c="gray.6">Avg Health</Text>
                  <Badge 
                    color={overallHealth >= 70 ? 'green' : overallHealth >= 40 ? 'yellow' : 'red'}
                    variant="light"
                    size="sm"
                  >
                    {overallHealth}%
                  </Badge>
                </Group>
                <Text size="xs" c="gray.5">
                  Overall condition
                </Text>
              </div>
              
              <div>
                <Group justify="space-between" mb="xs">
                  <Text size="sm" c="gray.6">Avg Happiness</Text>
                  <Badge 
                    color={overallHappiness >= 70 ? 'blue' : overallHappiness >= 40 ? 'yellow' : 'red'}
                    variant="light"
                    size="sm"
                  >
                    {overallHappiness}%
                  </Badge>
                </Group>
                <Text size="xs" c="gray.5">
                  Animal wellbeing
                </Text>
              </div>
              
              <div>
                <Group justify="space-between" mb="xs">
                  <Text size="sm" c="gray.6">Actions Today</Text>
                  <Badge 
                    color="blue"
                    variant="light"
                    size="sm"
                  >
                    {dayStats.totalActions}
                  </Badge>
                </Group>
                <Text size="xs" c="gray.5">
                  Care activities
                </Text>
              </div>
            </SimpleGrid>
          </Paper>
        </SimpleGrid>
        
        {/* Main Content - Animals + Sidebar */}
        <SimpleGrid cols={{ base: 1, lg: 3 }} spacing="lg">
          {/* Animals Section - Takes up 2 columns on large screens */}
          <Box style={{ gridColumn: isLargeScreen ? 'span 2' : 'span 1' }}>
            <Group justify="space-between" align="center" mb="md">
              <Title order={3} c="gray.8">
                🐾 Your Animals
              </Title>
              
              {animals.length > 0 && (
                <Group gap="xs">
                  <Text size="sm" c="gray.6">
                    {animalsNeedingCare.length} need care
                  </Text>
                  <Text size="sm" c="gray.6">•</Text>
                  <Text size="sm" c="gray.6">
                    {adoptableAnimals.length} adoption ready
                  </Text>
                </Group>
              )}
            </Group>
            
            {animals.length === 0 ? (
              // Empty State
              <Paper p="xl" radius="md" ta="center" bg="gray.0" style={{ border: '2px dashed var(--mantine-color-gray-3)' }}>
                <Text size="xl" c="gray.5" mb="md">
                  🏠 Your shelter is empty
                </Text>
                <Text size="md" c="gray.6" mb="lg">
                  New animals will arrive soon as you progress in the game
                </Text>
                <Text size="sm" c="gray.5">
                  Focus on preparing your shelter and completing goals while you wait!
                </Text>
              </Paper>
            ) : (
              <AnimalGrid animals={animals} />
            )}
          </Box>
          
          {/* Sidebar - Goals and Stats */}
          <Stack gap="lg">
            {/* Goals Panel */}
            <GoalsPanel />
            
            {/* Today's Progress */}
            <Paper p="md" radius="md" bg="gray.0" style={{ border: '1px solid var(--mantine-color-gray-2)' }}>
              <Title order={4} size="h5" c="gray.8" mb="md">
                📊 Today's Progress
              </Title>
              
              <Stack gap="sm">
                <Group justify="space-between">
                  <Text size="sm" c="gray.6">Actions Performed</Text>
                  <Badge color="blue" variant="light" size="sm">
                    {dayStats.totalActions}
                  </Badge>
                </Group>
                
                <Group justify="space-between">
                  <Text size="sm" c="gray.6">Animals Helped</Text>
                  <Badge color="green" variant="light" size="sm">
                    {dayStats.animalsHelped}
                  </Badge>
                </Group>
                
                <Group justify="space-between">
                  <Text size="sm" c="gray.6">Goals Completed</Text>
                  <Badge color="pink" variant="light" size="sm">
                    {dayStats.goalsCompleted}
                  </Badge>
                </Group>
                
                <Group justify="space-between">
                  <Text size="sm" c="gray.6" fw={500}>Efficiency Score</Text>
                  <Badge 
                    color={dayStats.efficiency >= 1.2 ? 'green' : dayStats.efficiency >= 0.8 ? 'yellow' : 'red'}
                    variant="light"
                    size="sm"
                  >
                    {(dayStats.efficiency * 100).toFixed(0)}%
                  </Badge>
                </Group>
              </Stack>
            </Paper>
            
            {/* Quick Tips */}
            <Paper p="md" radius="md" bg="blue.0" style={{ border: '1px solid var(--mantine-color-blue-2)' }}>
              <Title order={4} size="h5" c="blue.7" mb="md">
                💡 Quick Tips
              </Title>
              
              <Stack gap="xs">
                {hasUrgentCare && (
                  <Text size="sm" c="blue.7">
                    • Priority: {animalsNeedingCare.length} animal{animalsNeedingCare.length !== 1 ? 's' : ''} need{animalsNeedingCare.length === 1 ? 's' : ''} immediate attention
                  </Text>
                )}
                
                {hasLowEnergy && (
                  <Text size="sm" c="blue.7">
                    • Consider ending the day or using an energy boost
                  </Text>
                )}
                
                {dayStats.efficiency < 0.8 && dayStats.totalActions > 0 && (
                  <Text size="sm" c="blue.7">
                    • Try to be more strategic with your energy usage
                  </Text>
                )}
                
                {hasAdoptableAnimals && (
                  <Text size="sm" c="blue.7">
                    • Visit the Adoption Center to find homes for ready animals
                  </Text>
                )}
                
                {animals.length < shelterOccupancy.max && (
                  <Text size="sm" c="blue.7">
                    • You have space for {shelterOccupancy.max - animals.length} more animal{shelterOccupancy.max - animals.length !== 1 ? 's' : ''}
                  </Text>
                )}
                
                {dayStats.totalActions === 0 && animals.length > 0 && (
                  <Text size="sm" c="blue.7">
                    • Click on an animal card to start caring for them
                  </Text>
                )}
                
                {animals.length === 0 && (
                  <Text size="sm" c="blue.7">
                    • Complete goals to attract new animals to your shelter
                  </Text>
                )}
              </Stack>
            </Paper>
          </Stack>
        </SimpleGrid>
      </Stack>
    </Container>
  );
};

export default Dashboard;