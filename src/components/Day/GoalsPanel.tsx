import React from 'react';
import { 
  Paper, 
  Title, 
  Stack, 
  Group, 
  Text, 
  Progress,
  Badge,
  ActionIcon,
  Tooltip
} from '@mantine/core';
import { Check, Clock, Target, Gift } from 'lucide-react';
import { useDayStore } from '@/stores';

const GoalsPanel: React.FC = () => {
  const { currentDayGoals, completedGoals } = useDayStore();
  
  if (currentDayGoals.length === 0) {
    return (
      <Paper p="md" radius="md" bg="gray.0" style={{ border: '1px solid var(--mantine-color-gray-2)' }}>
        <Title order={4} size="h5" c="gray.8" mb="md">
          🎯 Daily Goals
        </Title>
        <Text size="sm" c="gray.6" ta="center" py="md">
          No goals for today. Enjoy your free day at the shelter!
        </Text>
      </Paper>
    );
  }
  
  const completionPercentage = (completedGoals.length / currentDayGoals.length) * 100;
  
  return (
    <Paper p="md" radius="md" bg="white" style={{ border: '1px solid var(--mantine-color-pink-2)' }}>
      <Group justify="space-between" align="center" mb="md">
        <Title order={4} size="h5" c="pink.7">
          🎯 Daily Goals
        </Title>
        <Badge 
          color={completionPercentage === 100 ? 'green' : 'pink'}
          variant="light"
        >
          {completedGoals.length}/{currentDayGoals.length}
        </Badge>
      </Group>
      
      <Progress
        value={completionPercentage}
        color={completionPercentage === 100 ? 'green' : 'pink'}
        size="sm"
        radius="xl"
        mb="md"
      />
      
      <Stack gap="sm">
        {currentDayGoals.map(goal => {
          const isCompleted = completedGoals.includes(goal.id);
          
          return (
            <Group key={goal.id} gap="sm" wrap="nowrap" align="flex-start">
              <ActionIcon
                size="sm"
                color={isCompleted ? 'green' : 'gray'}
                variant={isCompleted ? 'filled' : 'light'}
                style={{ marginTop: 2, flexShrink: 0 }}
              >
                {isCompleted ? <Check size={12} /> : <Clock size={12} />}
              </ActionIcon>
              
              <div style={{ flex: 1, minWidth: 0 }}>
                <Text 
                  size="sm" 
                  fw={500}
                  c={isCompleted ? 'green.7' : 'gray.8'}
                  style={{ 
                    textDecoration: isCompleted ? 'line-through' : 'none',
                    lineHeight: 1.3
                  }}
                >
                  {goal.title}
                </Text>
                <Text size="xs" c="gray.6" style={{ lineHeight: 1.2 }}>
                  {goal.description}
                </Text>
                
                {/* Rewards */}
                <Group gap="xs" mt={4}>
                  {goal.rewards.money && (
                    <Badge size="xs" color="green" variant="light">
                      💰 ${goal.rewards.money}
                    </Badge>
                  )}
                  {goal.rewards.experience && (
                    <Badge size="xs" color="blue" variant="light">
                      ⭐ {goal.rewards.experience} XP
                    </Badge>
                  )}
                  {goal.rewards.items && goal.rewards.items.length > 0 && (
                    <Tooltip label={goal.rewards.items.join(', ')}>
                      <Badge size="xs" color="purple" variant="light">
                        <Gift size={10} style={{ marginRight: 2 }} />
                        Items
                      </Badge>
                    </Tooltip>
                  )}
                  {goal.rewards.energyBonus && (
                    <Badge size="xs" color="yellow" variant="light">
                      ⚡ +{goal.rewards.energyBonus}
                    </Badge>
                  )}
                </Group>
              </div>
              
              {/* Difficulty indicator */}
              <Badge 
                size="xs" 
                color={
                  goal.difficulty === 'easy' ? 'green' : 
                  goal.difficulty === 'medium' ? 'yellow' : 'red'
                }
                variant="dot"
                style={{ flexShrink: 0 }}
              >
                {goal.difficulty}
              </Badge>
            </Group>
          );
        })}
      </Stack>
      
      {/* Completion message */}
      {completionPercentage === 100 && (
        <Paper 
          p="sm" 
          mt="md" 
          bg="green.0" 
          style={{ border: '1px solid var(--mantine-color-green-3)' }}
        >
          <Group>
            <ActionIcon color="green" variant="light" size="sm">
              <Target size={14} />
            </ActionIcon>
            <Text size="sm" c="green.7" fw={500}>
              🎉 All goals completed! Great work today!
            </Text>
          </Group>
        </Paper>
      )}
      
      {/* Progress encouragement */}
      {completionPercentage > 0 && completionPercentage < 100 && (
        <Text size="xs" c="gray.6" ta="center" mt="sm">
          Keep going! You're {Math.round(completionPercentage)}% complete
        </Text>
      )}
    </Paper>
  );
};

export default GoalsPanel;