import React from 'react';
import { Button, Badge, Group, Text, Stack, Divider, Menu } from '@mantine/core';
import { type ActionType, ACTION_DEFINITIONS } from '@/types';
import { usePlayerStore, useAnimalStore, useGameActions } from '@/stores';

interface ActionButtonProps {
  animalId: string;
  action: ActionType;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'filled' | 'light' | 'outline' | 'subtle';
  fullWidth?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  animalId,
  action,
  size = 'sm',
  variant = 'light',
  fullWidth = false,
  onClick,
}) => {
  const { player, canUseEnergy, getActionEnergyDiscount } = usePlayerStore();
  const { canPerformAction, getAnimal } = useAnimalStore();
  const { performAnimalAction } = useGameActions();
  
  const animal = getAnimal(animalId);
  const actionDef = ACTION_DEFINITIONS[action];
  
  if (!animal || !actionDef) {
    return null;
  }
  
  // Calculate actual energy cost (with potential discounts)
  const basePlayerCost = actionDef.baseCost.playerEnergy;
  const discount = getActionEnergyDiscount(action);
  const actualPlayerCost = Math.max(0, basePlayerCost - discount);
  const animalCost = actionDef.baseCost.animalEnergy;
  
  // Check if action can be performed
  const canPlayerPerform = canUseEnergy(actualPlayerCost);
  const animalCheck = canPerformAction(animalId, action);
  const canPerform = canPlayerPerform && animalCheck.canPerform;
  
  // Get reason for disabled state
  const getDisabledReason = () => {
    if (!canPlayerPerform) {
      return `You need ${actualPlayerCost} energy (you have ${player.energy})`;
    }
    if (!animalCheck.canPerform) {
      return animalCheck.reason || 'Animal cannot perform this action';
    }
    return undefined;
  };

  const handleConfirm = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent bubbling to parent containers
    
    if (canPerform) {
      await performAnimalAction(animalId, action);
    }
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent bubbling to parent containers
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent bubbling to parent containers
    
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <Menu shadow="md" width={Math.max(280, fullWidth ? 320 : 280)} position="bottom-start">
      <Menu.Target>
        <Button
          size={size}
          variant={variant}
          color="pink"
          fullWidth={fullWidth}
          disabled={!canPerform}
          onClick={handleButtonClick}
          leftSection={<span>{actionDef.icon}</span>}
          title={!canPerform ? getDisabledReason() : undefined}
          styles={{
            root: {
              opacity: canPerform ? 1 : 0.6,
              cursor: canPerform ? 'pointer' : 'not-allowed',
            },
            inner: {
              justifyContent: fullWidth ? 'center' : 'flex-start',
            },
          }}
        >
          {actionDef.name}
        </Button>
      </Menu.Target>

      <Menu.Dropdown p="sm">
        <Stack gap="xs">
          {/* Action Description */}
          <Menu.Label>
            <Text size="sm" fw={500} c="gray.8">
              {actionDef.description}
            </Text>
          </Menu.Label>

          <Divider size="xs" />

          {/* Cost Information */}
          <Stack gap="xs">
            <Text size="xs" fw={500} c="gray.7">Energy Costs:</Text>
            
            <Group gap="xs" wrap="wrap">
              {/* Player Energy Cost */}
              <Badge
                size="sm"
                color={actualPlayerCost <= 1 ? 'green' : actualPlayerCost <= 2 ? 'yellow' : actualPlayerCost <= 3 ? 'orange' : 'red'}
                variant="light"
              >
                ⚡ You: {actualPlayerCost}
              </Badge>

              {/* Animal Energy Cost */}
              {animalCost > 0 && (
                <Badge size="sm" color="blue" variant="light">
                  🐕 {animal.name}: {animalCost}
                </Badge>
              )}

              {/* Discount Indicator */}
              {discount > 0 && (
                <Badge size="sm" color="yellow" variant="filled">
                  ↓ Skill Discount: -{discount}
                </Badge>
              )}
            </Group>

            {/* Required Items */}
            {actionDef.baseCost.requiredItems && actionDef.baseCost.requiredItems.length > 0 && (
              <Group gap="xs">
                <Text size="xs" c="gray.6">Requires:</Text>
                {actionDef.baseCost.requiredItems.map((item, index) => (
                  <Badge key={index} size="xs" color="purple" variant="light">
                    {item.replace('_', ' ')}
                  </Badge>
                ))}
              </Group>
            )}

            {/* Money Cost */}
            {actionDef.baseCost.moneyRequired && (
              <Badge size="sm" color="green" variant="light">
                💰 ${actionDef.baseCost.moneyRequired}
              </Badge>
            )}
          </Stack>

          {/* Expected Effects */}
          {(actionDef.baseEffect.health || actionDef.baseEffect.happiness || actionDef.baseEffect.adoptionReadiness) && (
            <>
              <Divider size="xs" />
              <Stack gap="xs">
                <Text size="xs" fw={500} c="gray.7">Expected Effects:</Text>
                <Group gap="xs" wrap="wrap">
                  {actionDef.baseEffect.health && (
                    <Badge size="xs" color="red" variant="light">
                      ❤️ +{actionDef.baseEffect.health} Health
                    </Badge>
                  )}
                  {actionDef.baseEffect.happiness && (
                    <Badge size="xs" color="blue" variant="light">
                      😊 +{actionDef.baseEffect.happiness} Happiness
                    </Badge>
                  )}
                  {actionDef.baseEffect.adoptionReadiness && (
                    <Badge size="xs" color="purple" variant="light">
                      ✨ +{actionDef.baseEffect.adoptionReadiness} Adoption
                    </Badge>
                  )}
                </Group>
              </Stack>
            </>
          )}

          <Divider size="xs" />

          {/* Action Buttons */}
          <Group gap="xs" justify="space-between">
            <Menu.Item
              style={{ 
                flex: 1,
                color: 'var(--mantine-color-gray-6)',
                textAlign: 'center'
              }}
              onClick={handleCancel}
            >
              Cancel
            </Menu.Item>
            
            <Menu.Item
              style={{ 
                flex: 1,
                color: 'var(--mantine-color-pink-6)',
                backgroundColor: 'var(--mantine-color-pink-0)',
                textAlign: 'center',
                fontWeight: 600
              }}
              onClick={handleConfirm}
            >
              Confirm {actionDef.name}
            </Menu.Item>
          </Group>
        </Stack>
      </Menu.Dropdown>
    </Menu>
  );
};

export default ActionButton;