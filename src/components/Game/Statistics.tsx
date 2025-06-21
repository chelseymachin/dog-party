import React from 'react';
import { 
  Stack, 
  Title, 
  Text, 
  Paper,
  Group,
  Badge,
  Container,
  Box,
  Progress,
  SimpleGrid,
  Card,
  Center,
  RingProgress,
  ThemeIcon
} from '@mantine/core';
import { 
  TrendingUp, 
  Heart, 
  DollarSign, 
  Star,
  Users,
  Award,
  Zap,
  Activity,
  Home
} from 'lucide-react';
import { useGameStore, useUIStore, useAnimalStore, useDayStore, usePlayerStore } from '@/stores';

const Statistics: React.FC = () => {
  const { 
    budget, 
    totalMoneyEarned, 
    totalMoneySpent, 
    currentDay,
    calculateOverallHealth,
    calculateOverallHappiness,
    getShelterOccupancy
  } = useGameStore();
  
  const { 
    player 
  } = usePlayerStore();
  
  const { 
    animals 
  } = useAnimalStore();
  
  const { 
    actionsPerformedToday, 
    animalsHelpedToday,
    completedGoals,
    currentDayGoals
  } = useDayStore();
  
  const { isMobile } = useUIStore();

  const occupancy = getShelterOccupancy();
  const overallHealth = calculateOverallHealth();
  const overallHappiness = calculateOverallHappiness();

  // Calculate derived statistics
  const profitability = totalMoneyEarned - totalMoneySpent;
  const averageHealthHappiness = Math.round((overallHealth + overallHappiness) / 2);
  const goalCompletionRate = currentDayGoals.length > 0 ? Math.round((completedGoals.length / currentDayGoals.length) * 100) : 0;
  const experienceProgress = Math.round((player.experience / player.experienceToNextLevel) * 100);
  const energyEfficiency = Math.round((actionsPerformedToday / Math.max(1, player.energySpentToday)) * 100);
  const reputationLevel = player.reputation >= 80 ? 'Excellent' : player.reputation >= 60 ? 'Good' : player.reputation >= 40 ? 'Fair' : 'Poor';

  // Get some animal statistics
  const healthyAnimals = animals.filter(animal => animal.health >= 70).length;
  const happyAnimals = animals.filter(animal => animal.happiness >= 70).length;
  const adoptableAnimals = animals.filter(animal => animal.adoptionReadiness >= 80).length;
  const sickAnimals = animals.filter(animal => animal.needsMedical || animal.health < 40).length;

  const getHealthColor = (value: number) => {
    if (value >= 80) return 'green';
    if (value >= 60) return 'yellow';
    if (value >= 40) return 'orange';
    return 'red';
  };

  const getPerformanceColor = (value: number) => {
    if (value >= 80) return 'green';
    if (value >= 60) return 'blue';
    if (value >= 40) return 'yellow';
    return 'red';
  };

  return (
    <Container size="xl" px={0} style={{ minWidth: isMobile ? 'auto' : '800px' }}>
      <Stack gap="lg">
        {/* Header */}
        <Paper 
          p="lg" 
          radius="md" 
          bg="pink.1" 
          style={{ border: '1px solid var(--mantine-color-pink-2)' }}
        >
          <Group justify="space-between" align="flex-start" wrap="wrap">
            <Box>
              <Title order={2} c="pink.7" mb={4}>
                📊 Shelter Statistics
              </Title>
              <Text size="md" c="pink.8">
                Track your shelter's performance and progress
              </Text>
            </Box>
            
            <Group gap="md">
              <Paper p="sm" bg="blue.0" style={{ border: '1px solid var(--mantine-color-blue-3)' }}>
                <Group gap="xs">
                  <Box ta="center">
                    <Text size="xs" c="blue.6" fw={600}>DAY</Text>
                    <Text size="lg" fw={700} c="blue.7">{currentDay}</Text>
                  </Box>
                </Group>
              </Paper>
            </Group>
          </Group>
        </Paper>

        {/* Overview Cards */}
        <SimpleGrid cols={isMobile ? 2 : 4} spacing="md">
          {/* Overall Performance */}
          <Card padding="md" radius="md" withBorder style={{ textAlign: 'center' }}>
            <ThemeIcon size="xl" radius="md" color="pink" variant="light" mb="sm" style={{ margin: '0 auto' }}>
              <Star size={24} />
            </ThemeIcon>
            <Text size="lg" fw={700} c="pink.7">{averageHealthHappiness}%</Text>
            <Text size="xs" c="gray.6">Overall Care Quality</Text>
          </Card>

          {/* Financial Health */}
          <Card padding="md" radius="md" withBorder style={{ textAlign: 'center' }}>
            <ThemeIcon size="xl" radius="md" color={profitability >= 0 ? "green" : "red"} variant="light" mb="sm" style={{ margin: '0 auto' }}>
              <DollarSign size={24} />
            </ThemeIcon>
            <Text size="lg" fw={700} c={profitability >= 0 ? "green.7" : "red.7"}>
              ${Math.abs(profitability)}
            </Text>
            <Text size="xs" c="gray.6">
              {profitability >= 0 ? 'Profit' : 'Loss'}
            </Text>
          </Card>

          {/* Animal Count */}
          <Card padding="md" radius="md" withBorder style={{ textAlign: 'center' }}>
            <ThemeIcon size="xl" radius="md" color="blue" variant="light" mb="sm" style={{ margin: '0 auto' }}>
              <Heart size={24} />
            </ThemeIcon>
            <Text size="lg" fw={700} c="blue.7">{animals.length}</Text>
            <Text size="xs" c="gray.6">Animals in Care</Text>
          </Card>

          {/* Experience Level */}
          <Card padding="md" radius="md" withBorder style={{ textAlign: 'center' }}>
            <ThemeIcon size="xl" radius="md" color="orange" variant="light" mb="sm" style={{ margin: '0 auto' }}>
              <Award size={24} />
            </ThemeIcon>
            <Text size="lg" fw={700} c="orange.7">Level {player.level}</Text>
            <Text size="xs" c="gray.6">{experienceProgress}% to next</Text>
          </Card>
        </SimpleGrid>

        {/* Detailed Statistics */}
        <SimpleGrid cols={isMobile ? 1 : 2} spacing="lg">
          
          {/* Animal Care Statistics */}
          <Paper p="lg" radius="md" bg="white" withBorder>
            <Group mb="md">
              <ThemeIcon size="lg" radius="md" color="green" variant="light">
                <Heart size={20} />
              </ThemeIcon>
              <Title order={4} c="gray.8">Animal Care</Title>
            </Group>

            <Stack gap="md">
              <Group justify="space-between">
                <Text size="sm" c="gray.6">Overall Health</Text>
                <Group gap="xs">
                  <Progress 
                    value={overallHealth} 
                    size="sm" 
                    color={getHealthColor(overallHealth)}
                    style={{ width: isMobile ? '80px' : '100px' }}
                  />
                  <Text size="sm" fw={600}>{overallHealth}%</Text>
                </Group>
              </Group>

              <Group justify="space-between">
                <Text size="sm" c="gray.6">Overall Happiness</Text>
                <Group gap="xs">
                  <Progress 
                    value={overallHappiness} 
                    size="sm" 
                    color="pink"
                    style={{ width: isMobile ? '80px' : '100px' }}
                  />
                  <Text size="sm" fw={600}>{overallHappiness}%</Text>
                </Group>
              </Group>

              <SimpleGrid cols={2} spacing="xs">
                <Box ta="center" p="xs" bg="green.0">
                  <Text size="lg" fw={700} c="green.7">{healthyAnimals}</Text>
                  <Text size="xs" c="gray.6">Healthy</Text>
                </Box>
                <Box ta="center" p="xs" bg="pink.0">
                  <Text size="lg" fw={700} c="pink.7">{happyAnimals}</Text>
                  <Text size="xs" c="gray.6">Happy</Text>
                </Box>
                <Box ta="center" p="xs" bg="blue.0">
                  <Text size="lg" fw={700} c="blue.7">{adoptableAnimals}</Text>
                  <Text size="xs" c="gray.6">Ready</Text>
                </Box>
                <Box ta="center" p="xs" bg={sickAnimals > 0 ? "orange.0" : "gray.0"}>
                  <Text size="lg" fw={700} c={sickAnimals > 0 ? "orange.7" : "gray.7"}>{sickAnimals}</Text>
                  <Text size="xs" c="gray.6">Need Care</Text>
                </Box>
              </SimpleGrid>
            </Stack>
          </Paper>

          {/* Financial Statistics */}
          <Paper p="lg" radius="md" bg="white" withBorder>
            <Group mb="md">
              <ThemeIcon size="lg" radius="md" color="green" variant="light">
                <DollarSign size={20} />
              </ThemeIcon>
              <Title order={4} c="gray.8">Financial Summary</Title>
            </Group>

            <Stack gap="md">
              <Group justify="space-between">
                <Text size="sm" c="gray.6">Current Budget</Text>
                <Text size="lg" fw={700} c="green.7">${budget}</Text>
              </Group>

              <Group justify="space-between">
                <Text size="sm" c="gray.6">Total Earned</Text>
                <Text size="sm" fw={600} c="green.6">${totalMoneyEarned}</Text>
              </Group>

              <Group justify="space-between">
                <Text size="sm" c="gray.6">Total Spent</Text>
                <Text size="sm" fw={600} c="red.6">${totalMoneySpent}</Text>
              </Group>

              <Group justify="space-between" pt="sm" style={{ borderTop: '1px solid var(--mantine-color-gray-2)' }}>
                <Text size="sm" fw={600} c="gray.7">Net Profit/Loss</Text>
                <Text size="lg" fw={700} c={profitability >= 0 ? "green.7" : "red.7"}>
                  {profitability >= 0 ? '+' : '-'}${Math.abs(profitability)}
                </Text>
              </Group>
            </Stack>
          </Paper>

        </SimpleGrid>

        {/* Performance Metrics */}
        <SimpleGrid cols={isMobile ? 1 : 3} spacing="lg">
          
          {/* Today's Performance */}
          <Paper p="lg" radius="md" bg="white" withBorder>
            <Group mb="md">
              <ThemeIcon size="lg" radius="md" color="blue" variant="light">
                <Activity size={20} />
              </ThemeIcon>
              <Title order={4} c="gray.8">Today's Activity</Title>
            </Group>

            <Stack gap="md">
              <Center>
                <RingProgress
                  size={isMobile ? 120 : 140}
                  thickness={12}
                  sections={[
                    { value: goalCompletionRate, color: 'pink' }
                  ]}
                  label={
                    <Center>
                      <Stack gap={2} align="center">
                        <Text size="lg" fw={700} c="pink.7">
                          {completedGoals.length}/{currentDayGoals.length}
                        </Text>
                        <Text size="xs" c="gray.6">Goals</Text>
                      </Stack>
                    </Center>
                  }
                />
              </Center>

              <SimpleGrid cols={2} spacing="xs">
                <Box ta="center" p="xs" bg="blue.0">
                  <Text size="md" fw={700} c="blue.7">{actionsPerformedToday}</Text>
                  <Text size="xs" c="gray.6">Actions</Text>
                </Box>
                <Box ta="center" p="xs" bg="green.0">
                  <Text size="md" fw={700} c="green.7">{animalsHelpedToday.size}</Text>
                  <Text size="xs" c="gray.6">Animals Helped</Text>
                </Box>
              </SimpleGrid>
            </Stack>
          </Paper>

          {/* Player Progress */}
          <Paper p="lg" radius="md" bg="white" withBorder>
            <Group mb="md">
              <ThemeIcon size="lg" radius="md" color="orange" variant="light">
                <TrendingUp size={20} />
              </ThemeIcon>
              <Title order={4} c="gray.8">Progress</Title>
            </Group>

            <Stack gap="md">
              <Box>
                <Group justify="space-between" mb="xs">
                  <Text size="sm" c="gray.6">Experience</Text>
                  <Text size="sm" fw={600}>Level {player.level}</Text>
                </Group>
                <Progress 
                  value={experienceProgress} 
                  size="md" 
                  color="orange"
                />
                <Text size="xs" c="gray.5" mt={4}>
                  {player.experience}/{player.experienceToNextLevel} XP
                </Text>
              </Box>

              <Box>
                <Group justify="space-between" mb="xs">
                  <Text size="sm" c="gray.6">Reputation</Text>
                  <Badge 
                    size="sm" 
                    color={getPerformanceColor(player.reputation)}
                    variant="light"
                  >
                    {reputationLevel}
                  </Badge>
                </Group>
                <Progress 
                  value={player.reputation} 
                  size="md" 
                  color={getPerformanceColor(player.reputation)}
                />
                <Text size="xs" c="gray.5" mt={4}>
                  {player.reputation}/100 reputation
                </Text>
              </Box>
            </Stack>
          </Paper>

          {/* Shelter Efficiency */}
          <Paper p="lg" radius="md" bg="white" withBorder>
            <Group mb="md">
              <ThemeIcon size="lg" radius="md" color="purple" variant="light">
                <Home size={20} />
              </ThemeIcon>
              <Title order={4} c="gray.8">Shelter Status</Title>
            </Group>

            <Stack gap="md">
              <Box>
                <Group justify="space-between" mb="xs">
                  <Text size="sm" c="gray.6">Capacity Usage</Text>
                  <Text size="sm" fw={600}>{occupancy.current}/{occupancy.max}</Text>
                </Group>
                <Progress 
                  value={occupancy.percentage} 
                  size="md" 
                  color={occupancy.percentage >= 90 ? 'red' : occupancy.percentage >= 70 ? 'yellow' : 'green'}
                />
                <Text size="xs" c="gray.5" mt={4}>
                  {occupancy.percentage}% full
                </Text>
              </Box>

              <SimpleGrid cols={2} spacing="xs">
                <Box ta="center" p="xs" bg="pink.1">
                  <Text size="md" fw={700} c="pink.7">{player.totalAnimalsHelped}</Text>
                  <Text size="xs" c="gray.6">Total Helped</Text>
                </Box>
                <Box ta="center" p="xs" bg="green.0">
                  <Text size="md" fw={700} c="green.7">{player.totalAdoptions}</Text>
                  <Text size="xs" c="gray.6">Adopted Out</Text>
                </Box>
              </SimpleGrid>
            </Stack>
          </Paper>

        </SimpleGrid>

        {/* Skills Overview */}
        <Paper p="lg" radius="md" bg="white" withBorder>
          <Group mb="lg">
            <ThemeIcon size="lg" radius="md" color="indigo" variant="light">
              <Zap size={20} />
            </ThemeIcon>
            <Title order={4} c="gray.8">Skills & Efficiency</Title>
          </Group>

          <SimpleGrid cols={isMobile ? 2 : 5} spacing="md">
            <Box ta="center" p="md" bg="red.0">
              <ThemeIcon size="lg" radius="md" color="red" variant="light" mb="sm" style={{ margin: '0 auto' }}>
                <Heart size={20} />
              </ThemeIcon>
              <Text size="lg" fw={700} c="red.7">{player.skills.veterinarySkill}</Text>
              <Text size="xs" c="gray.6">Veterinary</Text>
            </Box>

            <Box ta="center" p="md" bg="green.0">
              <ThemeIcon size="lg" radius="md" color="green" variant="light" mb="sm" style={{ margin: '0 auto' }}>
                <Activity size={20} />
              </ThemeIcon>
              <Text size="lg" fw={700} c="green.7">{player.skills.exerciseTraining}</Text>
              <Text size="xs" c="gray.6">Exercise</Text>
            </Box>

            <Box ta="center" p="md" bg="blue.0">
              <ThemeIcon size="lg" radius="md" color="blue" variant="light" mb="sm" style={{ margin: '0 auto' }}>
                <Users size={20} />
              </ThemeIcon>
              <Text size="lg" fw={700} c="blue.7">{player.skills.animalPsychology}</Text>
              <Text size="xs" c="gray.6">Psychology</Text>
            </Box>

            <Box ta="center" p="md" bg="orange.0">
              <ThemeIcon size="lg" radius="md" color="orange" variant="light" mb="sm" style={{ margin: '0 auto' }}>
                <Home size={20} />
              </ThemeIcon>
              <Text size="lg" fw={700} c="orange.7">{player.skills.shelterManagement}</Text>
              <Text size="xs" c="gray.6">Management</Text>
            </Box>

            <Box ta="center" p="md" bg="yellow.0">
                <ThemeIcon size="lg" radius="md" color="yellow" variant="light" mb="sm" style={{ margin: '0 auto' }}>
                    <DollarSign size={20} />
                </ThemeIcon>
                <Text size="lg" fw={700} c="yellow.7">{player.skills.fundraising}</Text>
                <Text size="xs" c="gray.6">Fundraising</Text>
            </Box>
          </SimpleGrid>
        </Paper>

        {/* Quick Stats Footer */}
        <Paper p="md" radius="md" bg="gray.0">
          <Group justify="space-around" ta="center" wrap="wrap">
            <Box>
              <Text size="lg" fw={700} c="blue.6">{currentDay}</Text>
              <Text size="xs" c="gray.6">Days Active</Text>
            </Box>
            <Box>
              <Text size="lg" fw={700} c="pink.6">{player.energy}/{player.maxEnergy}</Text>
              <Text size="xs" c="gray.6">Energy Remaining</Text>
            </Box>
            <Box>
              <Text size="lg" fw={700} c="green.6">{Math.round(energyEfficiency)}%</Text>
              <Text size="xs" c="gray.6">Energy Efficiency</Text>
            </Box>
            <Box>
              <Text size="lg" fw={700} c="orange.6">{reputationLevel}</Text>
              <Text size="xs" c="gray.6">Reputation</Text>
            </Box>
          </Group>
        </Paper>
      </Stack>
    </Container>
  );
};

export default Statistics;