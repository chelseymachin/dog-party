import React from 'react';
import { Box, Text, Stack } from '@mantine/core';
import { type Animal } from '@/types';
import AnimalCard from './AnimalCard';

interface AnimalGridProps {
  animals: Animal[];
}

const AnimalGrid: React.FC<AnimalGridProps> = ({ animals }) => {
  if (animals.length === 0) {
    return (
      <Stack align="center" py="xl">
        <Text size="lg" c="gray.5">
          🐕 No animals in your shelter yet
        </Text>
        <Text size="sm" c="gray.6" ta="center">
          New animals will arrive as you progress through the game
        </Text>
      </Stack>
    );
  }

  return (
    <Box
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: 'var(--mantine-spacing-lg)',
        width: '100%',
      }}
    >
      {animals.map(animal => (
        <AnimalCard key={animal.id} animal={animal} />
      ))}
    </Box>
  );
};

export default AnimalGrid;