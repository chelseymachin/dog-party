import React from 'react';
import { Stack, Text, Button, Paper, Group, Badge } from '@mantine/core';
import { useUIStore, useAnimalStore } from '@/stores';

interface AnimalModalProps {
  animalId: string;
}

const AnimalModal: React.FC<AnimalModalProps> = ({ animalId }) => {
  const { closeModal } = useUIStore();
  const animal = useAnimalStore(state => state.getAnimal(animalId));
  
  if (!animal) {
    return (
      <Stack>
        <Text c="red">Animal not found</Text>
        <Button onClick={closeModal}>Close</Button>
      </Stack>
    );
  }
  
  return (
    <Stack gap="lg">
      <Paper p="md" radius="md" bg="pink.0">
        <Group justify="space-between">
          <div>
            <Text size="xl" fw={600} c="pink.7">
              🐕 {animal.name}
            </Text>
            <Text c="gray.6">
              {animal.breed} • {animal.age} • {animal.size}
            </Text>
          </div>
          <Badge color="blue" variant="light">
            Day {animal.daysInShelter + 1}
          </Badge>
        </Group>
      </Paper>
      
      <Text ta="center" c="gray.6">
        🚧 Detailed animal care interface coming soon!
      </Text>
      
      <Text ta="center" size="sm" c="gray.5">
        This will include advanced care options, detailed stats, 
        training activities, and adoption preparation tools.
      </Text>
      
      <Button onClick={closeModal} variant="light">
        Close
      </Button>
    </Stack>
  );
};

export default AnimalModal;