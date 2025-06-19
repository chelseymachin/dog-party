import React from 'react';
import { Stack, Text, Button } from '@mantine/core';
import { useUIStore } from '@/stores';

const SettingsModal: React.FC = () => {
  const { closeModal } = useUIStore();
  
  return (
    <Stack>
      <Text size="lg" fw={600} ta="center">
        ⚙️ Game Settings
      </Text>
      
      <Text ta="center" c="gray.6">
        🚧 Settings panel coming soon!
      </Text>
      
      <Text ta="center" size="sm" c="gray.5">
        This will include audio settings, accessibility options,
        game preferences, and save management.
      </Text>
      
      <Button onClick={closeModal} variant="light">
        Close
      </Button>
    </Stack>
  );
};

export default SettingsModal;