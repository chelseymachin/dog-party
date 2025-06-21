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
  Flex,
  Center,
  SimpleGrid
} from '@mantine/core';
import { 
  Heart, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles,
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

  const handleAdoptAnimal = async (animalIndex?: number) => {
    const targetAnimal = animalIndex !== undefined ? adoptableAnimals[animalIndex] : currentAnimal;
    if (!targetAnimal || !canAdopt) return;

    setIsLoading(true);

    try {
      const adoptedAnimal = { 
        ...targetAnimal, 
        status: 'needs_care' as const,
        arrivalDate: new Date(),
        daysInShelter: 0
      };
      
      addAnimal(adoptedAnimal);

      const newAnimal = createRandomAnimal();
      newAnimal.status = 'intake';
      newAnimal.daysInShelter = 0;

      const replaceIndex = animalIndex !== undefined ? animalIndex : currentAnimalIndex;
      setAdoptableAnimals(prev => {
        const newList = [...prev];
        newList[replaceIndex] = newAnimal;
        return newList;
      });

      addQuickNotification(
        'success', 
        'Welcome to the shelter!', 
        `${adoptedAnimal.name} has joined your shelter. Show them some love!`
      );

      if (animalIndex === undefined) {
        handleNextAnimal();
      }

    } catch (error) {
      addQuickNotification('error', 'Rescue failed', 'Something went wrong. Please try again.');
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
          <Text size="xl" mb="md">🐕 Loading rescue animals...</Text>
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
                  You need to find homes for some animals before rescuing new ones.
                </Text>
              </Box>
            </Group>
          </Paper>
        )}

        {/* MOBILE LAYOUT */}
        {isMobile ? (
          <Stack gap="md">
            {/* Mobile Navigation */}
            <Paper p="md" radius="md" bg="pink.0">
              <Stack gap="sm" align="center">
                {/* Navigation Buttons */}
                <Group justify="center" gap="lg">
                  <Button
                    variant="light"
                    color="pink"
                    size="sm"
                    onClick={handlePreviousAnimal}
                    disabled={adoptableAnimals.length <= 1}
                    leftSection={<ChevronLeft size={16} />}
                    style={{ minWidth: '100px' }}
                  >
                    Previous
                  </Button>
                  
                  <Button
                    variant="light"
                    color="pink"
                    size="sm"
                    onClick={handleNextAnimal}
                    disabled={adoptableAnimals.length <= 1}
                    rightSection={<ChevronRight size={16} />}
                    style={{ minWidth: '100px' }}
                  >
                    Next
                  </Button>
                </Group>
                
                {/* Counter Badge */}
                <Badge size="lg" variant="light" color="pink">
                  {currentAnimalIndex + 1} of {adoptableAnimals.length}
                </Badge>
              </Stack>
            </Paper>

            {/* Mobile Animal Card */}
            <Card
              padding="lg"
              radius="lg"
              withBorder
              style={{
                border: '2px solid var(--mantine-color-pink-4)',
                backgroundColor: 'white'
              }}
            >
              <Stack gap="md">
                {/* Header */}
                <Group justify="space-between" align="flex-start">
                  <Box style={{ flex: 1 }}>
                    <Title order={4} c="pink.8" mb={4}>
                      {currentAnimal.name}
                    </Title>
                    <Group gap="xs" wrap="wrap">
                      <Badge size="xs" variant="light" color="blue">
                        {currentAnimal.breed}
                      </Badge>
                      <Badge size="xs" variant="light" color="gray">
                        {currentAnimal.size} • {currentAnimal.age}
                      </Badge>
                    </Group>
                  </Box>
                  <Badge 
                    size="md" 
                    variant="filled" 
                    color={getHealthColor(currentAnimal.health)}
                  >
                    ${currentAnimal.adoptionFee}
                  </Badge>
                </Group>

                {/* Sprite */}
                <Center py="lg">
                  <Box style={{ transform: 'scale(2)' }}>
                    <AnimalSprite
                      breed={currentAnimal.breed}
                      color={currentAnimal.color}
                      animation="idle"
                      size={64}
                    />
                  </Box>
                </Center>

                {/* Quick Stats Grid */}
                <SimpleGrid cols={3} spacing="xs">
                  <Box ta="center">
                    <Text size="lg" fw={700} c={getHealthColor(currentAnimal.health)}>
                      {currentAnimal.health}%
                    </Text>
                    <Text size="xs" c="gray.6">Health</Text>
                  </Box>
                  <Box ta="center">
                    <Text size="lg" fw={700} c="pink.6">
                      {currentAnimal.happiness}%
                    </Text>
                    <Text size="xs" c="gray.6">Happiness</Text>
                  </Box>
                  <Box ta="center">
                    <Text size="lg" fw={700} c="green.6">
                      {currentAnimal.energy}
                    </Text>
                    <Text size="xs" c="gray.6">Energy</Text>
                  </Box>
                </SimpleGrid>

                {/* Temperament & Medical */}
                <Group gap="xs" justify="center" wrap="wrap">
                  {currentAnimal.needsMedical && (
                    <Badge size="xs" color="orange" variant="light">
                      ⚕️ Medical
                    </Badge>
                  )}
                  {currentAnimal.temperament.slice(0, 3).map((trait, index) => (
                    <Badge
                      key={index}
                      size="xs"
                      variant="light"
                      color="blue"
                    >
                      {trait}
                    </Badge>
                  ))}
                </Group>

                {/* Backstory */}
                <Paper p="sm" bg="gray.0" radius="md">
                  <Text size="sm" c="gray.7" ta="center" style={{ fontStyle: 'italic' }}>
                    "{currentAnimal.backstory}"
                  </Text>
                </Paper>

                {/* Rescue Button */}
                <Button
                  fullWidth
                  size="lg"
                  color="pink"
                  disabled={!canAdopt || isLoading}
                  loading={isLoading}
                  onClick={() => handleAdoptAnimal()}
                  leftSection={<Heart size={16} />}
                >
                  {!canAdopt ? 'Shelter Full' : `Rescue ${currentAnimal.name}`}
                </Button>
              </Stack>
            </Card>
          </Stack>
        ) : (
          /* DESKTOP LAYOUT - Grid of all animals */
          <Stack gap="lg">
            {/* Desktop Header */}
            <Paper p="md" radius="md" bg="pink.0">
              <Group justify="space-between" align="center">
                <Text size="sm" fw={600} c="pink.7">
                  {adoptableAnimals.length} animals awaiting rescue
                </Text>
                <Button
                  variant="light"
                  color="blue"
                  size="sm"
                  leftSection={<Sparkles size={16} />}
                  onClick={refreshAdoptableAnimals}
                >
                  Refresh Animals
                </Button>
              </Group>
            </Paper>

            {/* Desktop Grid */}
            <SimpleGrid cols={2} spacing="lg">
              {adoptableAnimals.map((animal, index) => (
                <Card
                  key={animal.id}
                  padding="lg"
                  radius="lg"
                  withBorder
                  style={{
                    border: index === currentAnimalIndex 
                      ? '3px solid var(--mantine-color-pink-5)' 
                      : '2px solid var(--mantine-color-pink-4)',
                    backgroundColor: 'white',
                    height: '380px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    transform: index === currentAnimalIndex ? 'scale(1.02)' : 'scale(1)',
                    boxShadow: index === currentAnimalIndex ? '0 8px 25px rgba(236, 72, 153, 0.15)' : 'none'
                  }}
                  onClick={() => setCurrentAnimalIndex(index)}
                >
                  <Flex direction="column" style={{ height: '100%' }}>
                    {/* Header */}
                    <Group justify="space-between" align="flex-start" mb="md">
                      <Box style={{ flex: 1, minWidth: 0 }}>
                        <Title order={4} c="pink.8" mb={4} style={{ wordBreak: 'break-word' }}>
                          {animal.name}
                        </Title>
                        <Group gap="xs" wrap="wrap">
                          <Badge size="xs" variant="light" color="blue">
                            {animal.breed}
                          </Badge>
                          <Badge size="xs" variant="light" color="gray">
                            {animal.size} • {animal.age}
                          </Badge>
                        </Group>
                      </Box>
                      <Badge 
                        size="md" 
                        variant="filled" 
                        color={getHealthColor(animal.health)}
                        style={{ flexShrink: 0 }}
                      >
                        ${animal.adoptionFee}
                      </Badge>
                    </Group>

                    {/* Sprite */}
                    <Center style={{ flex: 1 }} mb="md">
                      <Box style={{ transform: 'scale(1.5)' }}>
                        <AnimalSprite
                          breed={animal.breed}
                          color={animal.color}
                          animation="idle"
                          size={64}
                        />
                      </Box>
                    </Center>

                    {/* Stats */}
                    <SimpleGrid cols={3} spacing="xs" mb="md">
                      <Box ta="center">
                        <Text size="sm" fw={700} c={getHealthColor(animal.health)}>
                          {animal.health}%
                        </Text>
                        <Text size="xs" c="gray.6">Health</Text>
                      </Box>
                      <Box ta="center">
                        <Text size="sm" fw={700} c="pink.6">
                          {animal.happiness}%
                        </Text>
                        <Text size="xs" c="gray.6">Happy</Text>
                      </Box>
                      <Box ta="center">
                        <Text size="sm" fw={700} c="green.6">
                          {animal.energy}
                        </Text>
                        <Text size="xs" c="gray.6">Energy</Text>
                      </Box>
                    </SimpleGrid>

                    {/* Traits */}
                    <Group justify="center" mb="md" style={{ minHeight: '20px' }}>
                      {animal.needsMedical && (
                        <Badge size="xs" color="orange" variant="light">
                          ⚕️ Medical
                        </Badge>
                      )}
                      {animal.temperament.slice(0, 2).map((trait, traitIndex) => (
                        <Badge
                          key={traitIndex}
                          size="xs"
                          variant="light"
                          color={getTemperamentColor(animal.temperament)}
                        >
                          {trait}
                        </Badge>
                      ))}
                    </Group>

                    {/* Button */}
                    <Button
                      fullWidth
                      size="sm"
                      color="pink"
                      disabled={!canAdopt || isLoading}
                      loading={isLoading && currentAnimalIndex === index}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAdoptAnimal(index);
                      }}
                      leftSection={<Heart size={16} />}
                    >
                      {!canAdopt ? 'Shelter Full' : `Rescue ${animal.name}`}
                    </Button>
                  </Flex>
                </Card>
              ))}
            </SimpleGrid>
          </Stack>
        )}
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