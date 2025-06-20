import React, { useState, useEffect } from 'react';
import { 
  Stack, 
  Title, 
  Text, 
  Paper,
  Group,
  Badge,
  Container,
  Box,
  Button,
  Card,
  Progress,
  Flex,
  Center
} from '@mantine/core';
import { 
  Heart, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles
} from 'lucide-react';
import { useGameStore, useUIStore, useAnimalStore } from '@/stores';
import { type Animal } from '@/types';
import AnimalSprite from '@/components/Animals/AnimalSprite';

const Rescue: React.FC = () => {
  const { getShelterOccupancy } = useGameStore();
  const { addQuickNotification, isMobile } = useUIStore();
  const { createRandomAnimal, addAnimal, animals } = useAnimalStore();
  
  const [adoptableAnimals, setAdoptableAnimals] = useState<Animal[]>([]);
  const [currentAnimalIndex, setCurrentAnimalIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const occupancy = getShelterOccupancy();

  // Generate initial set of adoptable animals
  useEffect(() => {
    const generateAdoptableAnimals = () => {
      const newAnimals: Animal[] = [];
      for (let i = 0; i < 5; i++) {
        const animal = createRandomAnimal();
        // Set these animals as intake (not in shelter yet)
        animal.status = 'intake';
        animal.daysInShelter = 0;
        newAnimals.push(animal);
      }
      setAdoptableAnimals(newAnimals);
    };

    generateAdoptableAnimals();
  }, [createRandomAnimal]);

  const currentAnimal = adoptableAnimals[currentAnimalIndex];
  const canAdopt = occupancy.current < occupancy.max;

  const handlePreviousAnimal = () => {
    setCurrentAnimalIndex(prev => 
      prev === 0 ? adoptableAnimals.length - 1 : prev - 1
    );
  };

  const handleNextAnimal = () => {
    setCurrentAnimalIndex(prev => 
      prev === adoptableAnimals.length - 1 ? 0 : prev + 1
    );
  };

  const handleAdoptAnimal = async () => {
    if (!currentAnimal || !canAdopt) return;

    setIsLoading(true);

    try {
      // Add animal to shelter
      const adoptedAnimal = { 
        ...currentAnimal, 
        status: 'needs_care' as const,
        arrivalDate: new Date(),
        daysInShelter: 0
      };
      
      addAnimal(adoptedAnimal);

      // Generate a new animal to replace the adopted one
      const newAnimal = createRandomAnimal();
      newAnimal.status = 'intake';
      newAnimal.daysInShelter = 0;

      // Replace the adopted animal in the available list
      setAdoptableAnimals(prev => {
        const newList = [...prev];
        newList[currentAnimalIndex] = newAnimal;
        return newList;
      });

      addQuickNotification(
        'success', 
        'Welcome to the shelter!', 
        `${adoptedAnimal.name} has joined your shelter. Show them some love!`
      );

      // Move to next animal
      handleNextAnimal();

    } catch (error) {
      addQuickNotification('error', 'Adoption failed', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getTemperamentColor = (temperament: string[]) => {
    if (temperament.includes('aggressive') || temperament.includes('anxious')) return 'red';
    if (temperament.includes('energetic') || temperament.includes('playful')) return 'orange';
    if (temperament.includes('calm') || temperament.includes('gentle')) return 'green';
    return 'blue';
  };

  const getHealthColor = (health: number) => {
    if (health >= 80) return 'green';
    if (health >= 60) return 'yellow';
    if (health >= 40) return 'orange';
    return 'red';
  };

  const refreshAdoptableAnimals = () => {
    const newAnimals: Animal[] = [];
    for (let i = 0; i < 5; i++) {
      const animal = createRandomAnimal();
      animal.status = 'intake';
      animal.daysInShelter = 0;
      newAnimals.push(animal);
    }
    setAdoptableAnimals(newAnimals);
    setCurrentAnimalIndex(0);
          addQuickNotification('info', 'New animals available!', 'The rescue center has been refreshed with new animals.');
  };

  if (!currentAnimal) {
    return (
      <Container size="xl" px={0}>
        <Paper p="xl" radius="md" ta="center">
          <Text size="xl" mb="md">🐕 Loading adoptable animals...</Text>
        </Paper>
      </Container>
    );
  }

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
                🚑 Animal Rescue Center
              </Title>
              <Text size="md" c="pink.8">
                Rescue animals in need and bring them to your shelter
              </Text>
            </Box>
            
            <Group gap="md">
              <Paper p="sm" bg="green.0" style={{ border: '1px solid var(--mantine-color-green-3)' }}>
                <Group gap="xs">
                  <Box ta="center">
                    <Text size="xs" c="green.6" fw={600}>SHELTER CAPACITY</Text>
                    <Text size="lg" fw={700} c="green.7">
                      {occupancy.current}/{occupancy.max}
                    </Text>
                  </Box>
                </Group>
              </Paper>
            </Group>
          </Group>
        </Paper>

        {/* Capacity Warning */}
        {!canAdopt && (
          <Paper p="md" radius="md" bg="red.0" style={{ border: '1px solid var(--mantine-color-red-3)' }}>
            <Group>
              <Text size="lg">⚠️</Text>
              <Box>
                <Text size="sm" fw={600} c="red.7">Shelter at Capacity</Text>
                <Text size="sm" c="red.6">
                  You need to find homes for some animals before adopting new ones.
                </Text>
              </Box>
            </Group>
          </Paper>
        )}

        {/* Main Adoption Carousel */}
        <Paper p="xl" radius="lg" bg="pink.0" style={{ border: '2px solid var(--mantine-color-pink-3)' }}>
          <Stack gap="xl">
            {/* Animal Counter */}
            <Group justify="center">
              <Badge size="lg" variant="light" color="pink">
                {currentAnimalIndex + 1} of {adoptableAnimals.length}
              </Badge>
            </Group>

            {/* Navigation Arrows & Animal Display */}
            <Group justify="center" align="center" gap="xl">
              <Button
                variant="light"
                color="pink"
                size="m"
                onClick={handlePreviousAnimal}
                disabled={adoptableAnimals.length <= 1}
                style={{ borderRadius: '50%', width: '60px', height: '60px' }}
              >
                <ChevronLeft size={24} />
              </Button>

              {/* Animal Card */}
              <Card
                padding="xl"
                radius="lg"
                withBorder
                style={{
                  border: '2px solid var(--mantine-color-pink-4)',
                  backgroundColor: 'white',
                  height: '620px', // Fixed height instead of minHeight
                  width: isMobile ? '300px' : '400px',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <Flex direction="column" style={{ height: '100%' }}>
                  {/* Animal Header - Fixed height section */}
                  <Box style={{ minHeight: '80px' }} mb="md">
                    <Group justify="space-between" align="flex-start">
                      <Box style={{ flex: 1, minWidth: 0 }}>
                        <Title 
                          order={3} 
                          c="pink.8" 
                          mb={4}
                          style={{ 
                            lineHeight: 1.2,
                            wordBreak: 'break-word'
                          }}
                        >
                          {currentAnimal.name}
                        </Title>
                        <Group gap="xs" wrap="wrap">
                          <Badge size="sm" variant="light" color="blue">
                            {currentAnimal.breed}
                          </Badge>
                          <Badge size="sm" variant="light" color="gray">
                            {currentAnimal.size} • {currentAnimal.age}
                          </Badge>
                        </Group>
                      </Box>
                      <Badge 
                        size="lg" 
                        variant="filled" 
                        color={getHealthColor(currentAnimal.health)}
                        style={{ flexShrink: 0, marginLeft: '8px' }}
                      >
                        ${currentAnimal.adoptionFee}
                      </Badge>
                    </Group>
                  </Box>

                  {/* Animal Sprite - Fixed height section with more padding */}
                  <Center style={{ height: '140px' }} mb="md">
                    <Box style={{ transform: 'scale(2)' }}>
                      <AnimalSprite
                        breed={currentAnimal.breed}
                        color={currentAnimal.color}
                        animation="idle"
                        size={64}
                      />
                    </Box>
                  </Center>

                  {/* Animal Stats - Fixed height section */}
                  <Box style={{ minHeight: '90px' }} mb="md">
                    <Stack gap="sm">
                      <Group justify="space-between">
                        <Text size="sm" c="gray.6">Health</Text>
                        <Group gap="xs">
                          <Progress
                            value={currentAnimal.health}
                            size="sm"
                            color={getHealthColor(currentAnimal.health)}
                            style={{ width: '100px' }}
                          />
                          <Text size="sm" fw={600}>{currentAnimal.health}%</Text>
                        </Group>
                      </Group>

                      <Group justify="space-between">
                        <Text size="sm" c="gray.6">Happiness</Text>
                        <Group gap="xs">
                          <Progress
                            value={currentAnimal.happiness}
                            size="sm"
                            color="pink"
                            style={{ width: '100px' }}
                          />
                          <Text size="sm" fw={600}>{currentAnimal.happiness}%</Text>
                        </Group>
                      </Group>

                      <Group justify="space-between">
                        <Text size="sm" c="gray.6">Energy</Text>
                        <Group gap="xs">
                          <Progress
                            value={(currentAnimal.energy / currentAnimal.maxEnergy) * 100}
                            size="sm"
                            color="green"
                            style={{ width: '100px' }}
                          />
                          <Text size="sm" fw={600}>
                            {currentAnimal.energy}/{currentAnimal.maxEnergy}
                          </Text>
                        </Group>
                      </Group>
                    </Stack>
                  </Box>

                  {/* Temperament - Fixed height section */}
                  <Box style={{ minHeight: '40px' }} mb="md">
                    {currentAnimal.temperament.length > 0 && (
                      <Group gap="xs">
                        <Text size="sm" c="gray.6">Personality:</Text>
                        <Group gap={4}>
                          {currentAnimal.temperament.slice(0, 3).map((trait, index) => (
                            <Badge
                              key={index}
                              size="xs"
                              variant="light"
                              color={getTemperamentColor(currentAnimal.temperament)}
                            >
                              {trait}
                            </Badge>
                          ))}
                        </Group>
                      </Group>
                    )}
                  </Box>

                  {/* Backstory - Flexible content area */}
                  <Paper 
                    p="md" 
                    bg="gray.0" 
                    radius="md" 
                    mb="md"
                    style={{ flex: 1, display: 'flex', alignItems: 'flex-start' }}
                  >
                    <Text 
                      size="sm" 
                      c="gray.7" 
                      style={{ 
                        fontStyle: 'italic',
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical'
                      }}
                    >
                      "{currentAnimal.backstory}"
                    </Text>
                  </Paper>

                  {/* Special Needs Warning - Fixed at bottom */}
                  <Box style={{ minHeight: currentAnimal.needsMedical ? '50px' : '0px' }} mb="md">
                    {currentAnimal.needsMedical && (
                      <Paper p="md" bg="orange.0" radius="md" style={{ border: '1px solid var(--mantine-color-orange-3)' }}>
                        <Group gap="xs">
                          <Text size="sm">⚕️</Text>
                          <Text size="sm" c="orange.7" fw={600}>
                            This animal needs medical attention
                          </Text>
                        </Group>
                      </Paper>
                    )}
                  </Box>
                  {/* Adoption Button - Always at bottom */}
                  <Button
                    fullWidth
                    size="lg"
                    color="pink"
                    disabled={!canAdopt || isLoading}
                    loading={isLoading}
                    onClick={handleAdoptAnimal}
                    leftSection={<Heart size={20} />}
                  >
                    {!canAdopt ? 'Shelter Full' : `Rescue ${currentAnimal.name}`}
                  </Button>
                </Flex>
              </Card>

              <Button
                variant="light"
                color="pink"
                size="m"
                onClick={handleNextAnimal}
                disabled={adoptableAnimals.length <= 1}
                style={{ borderRadius: '50%', width: '60px', height: '60px' }}
              >
                <ChevronRight size={24} />
              </Button>
            </Group>

            {/* Animal Dots Indicator */}
            <Group justify="center" gap="xs">
              {adoptableAnimals.map((_, index) => (
                <Box
                  key={index}
                  onClick={() => setCurrentAnimalIndex(index)}
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: index === currentAnimalIndex 
                      ? 'var(--mantine-color-pink-5)' 
                      : 'var(--mantine-color-gray-3)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                />
              ))}
            </Group>
          </Stack>
        </Paper>

        {/* Action Buttons */}
        <Group justify="center" gap="md">
          <Button
            variant="light"
            color="blue"
            leftSection={<Sparkles size={16} />}
            onClick={refreshAdoptableAnimals}
          >
            Find More Animals
          </Button>
        </Group>

        {/* Stats Footer */}
        <Paper p="md" radius="md" bg="gray.0">
          <Group justify="space-around" ta="center">
            <Box>
              <Text size="lg" fw={700} c="pink.6">{animals.length}</Text>
              <Text size="xs" c="gray.6">Animals in Shelter</Text>
            </Box>
            <Box>
              <Text size="lg" fw={700} c="green.6">{occupancy.max - occupancy.current}</Text>
              <Text size="xs" c="gray.6">Space Available</Text>
            </Box>
            <Box>
              <Text size="lg" fw={700} c="blue.6">{adoptableAnimals.length}</Text>
              <Text size="xs" c="gray.6">Awaiting Rescue</Text>
            </Box>
          </Group>
        </Paper>
      </Stack>
    </Container>
  );
};

export default Rescue;