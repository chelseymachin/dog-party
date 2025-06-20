import React from 'react';
import { Stack, Text, Button, Paper, Group, Badge } from '@mantine/core';
import { useUIStore, useGameActions } from '@/stores';
import { type DayEndSummary } from '@/types';

interface DayEndModalProps {
  summary?: DayEndSummary;
}

const DayEndModal: React.FC<DayEndModalProps> = ({ summary }) => {
  const { closeModal } = useUIStore();
  const { startNewDay } = useGameActions();
    
  const handleStartNewDay = () => {
    startNewDay();
    closeModal();
  };
  
  if (!summary) {
    return (
      <Stack>
        <Text>Loading day summary...</Text>
      </Stack>
    );
  }
  
  return (
    <Stack gap="lg">
      <Paper p="md" radius="md" bg="blue.0" ta="center">
        <Text size="xl" fw={600} c="blue.7" mb="xs">
          🌟 Day {summary.dayCompleted} Complete!
        </Text>
        <Badge size="xl" color="blue" variant="filled">
          Great Job!
        </Badge>
      </Paper>
      
      <Group justify="center">
        <Paper p="md" ta="center">
          <Text size="lg" fw={600}>
            {summary.dayHistory.actionsPerformed}
          </Text>
          <Text size="sm" c="gray.6">Actions</Text>
        </Paper>
        
        <Paper p="md" ta="center">
          <Text size="lg" fw={600}>
            {summary.dayHistory.animalsHelped}
          </Text>
          <Text size="sm" c="gray.6">Animals Helped</Text>
        </Paper>
      </Group>
      
      <Text ta="center" c="gray.6">
        🚧 Detailed day summary coming soon!
      </Text>
      
      <Button
        size="lg"
        onClick={handleStartNewDay}
        fullWidth
      >
        🌅 Start Day {summary.dayCompleted + 1}
      </Button>
    </Stack>
  );
};

export default DayEndModal;