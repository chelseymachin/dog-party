import React, { useState, useRef, useEffect } from 'react';
import { Button, Paper, Badge, Box, Group, Text, Stack, Divider, Portal } from '@mantine/core';
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
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

  // Update dropdown position when opening and on scroll
  const updateDropdownPosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
      });
    }
  };

  // Handle scroll to keep dropdown positioned with button
  useEffect(() => {
    const handleScroll = () => {
      if (isDropdownOpen) {
        updateDropdownPosition();
      }
    };

    if (isDropdownOpen) {
      window.addEventListener('scroll', handleScroll, true);
      window.addEventListener('resize', handleScroll);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleScroll);
    };
  }, [isDropdownOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if click is outside the dropdown panel
      const target = event.target as Node;
      const dropdownPanel = document.querySelector('[data-dropdown-panel="true"]');
      
      if (buttonRef.current && dropdownPanel) {
        const isClickOnButton = buttonRef.current.contains(target);
        const isClickInDropdown = dropdownPanel.contains(target);
        
        if (!isClickOnButton && !isClickInDropdown) {
          setIsDropdownOpen(false);
        }
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);
  
  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (onClick) {
      onClick(e);
    }
    
    if (canPerform) {
      if (!isDropdownOpen) {
        updateDropdownPosition();
      }
      setIsDropdownOpen(!isDropdownOpen);
    }
  };

  const handleConfirm = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (canPerform) {
      await performAnimalAction(animalId, action);
      setIsDropdownOpen(false);
    }
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDropdownOpen(false);
  };

  return (
    <Box ref={containerRef} style={{ position: 'relative', width: fullWidth ? '100%' : 'auto' }}>
      {/* Main Action Button */}
      <Button
        ref={buttonRef}
        size={size}
        variant={variant}
        color="pink"
        fullWidth={fullWidth}
        disabled={!canPerform}
        onClick={handleButtonClick}
        leftSection={<span>{actionDef.icon}</span>}
        title={!canPerform ? getDisabledReason() : undefined} // Tooltip for disabled state
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

      {/* Dropdown Panel - Using Portal to escape container boundaries */}
      {isDropdownOpen && canPerform && (
        <Portal>
          <Paper
            shadow="md"
            radius="md"
            p="sm"
            data-dropdown-panel="true"
            style={{
              position: 'fixed',
              top: dropdownPosition.top,
              left: dropdownPosition.left,
              width: Math.max(dropdownPosition.width, 280), // Minimum width for content
              zIndex: 10000,
              border: '1px solid var(--mantine-color-pink-3)',
              backgroundColor: 'white',
            }}
          >
          <Stack gap="xs">
            {/* Action Description */}
            <Text size="sm" fw={500} c="gray.8">
              {actionDef.description}
            </Text>

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
              <Button
                size="xs"
                variant="light"
                color="gray"
                onClick={handleCancel}
                style={{ flex: 1 }}
              >
                Cancel
              </Button>
              <Button
                size="xs"
                variant="filled"
                color="pink"
                onClick={handleConfirm}
                style={{ flex: 1 }}
              >
                Confirm {actionDef.name}
              </Button>
            </Group>
          </Stack>
        </Paper>
      </Portal>
      )}
    </Box>
  );
};

export default ActionButton;