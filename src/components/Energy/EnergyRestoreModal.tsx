import React from 'react';
import { Stack, Text, Button } from '@mantine/core';
import { useUIStore } from '@/stores';

const EnergyRestoreModal: React.FC = () => {
  const { closeModal } = useUIStore();
  
  return (
    <Stack>
      <Text size="lg" fw={600} ta="center">
        ⚡ Energy Boost
      </Text>
      
      <Text ta="center" c="gray.6">
        🚧 Energy restoration system coming soon!
      </Text>
      
      <Text ta="center" size="sm" c="gray.5">
        This will let you use energy drinks, coffee, and other
        items to restore your energy during the day.
      </Text>
      
      <Button onClick={closeModal} variant="light">
        Close
      </Button>
    </Stack>
  );
};

export default EnergyRestoreModal;