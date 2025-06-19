import React from 'react';
import { Button, Tooltip, Badge, Box } from '@mantine/core';
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
  
  // Get energy cost color
  const getEnergyCostColor = () => {
    if (actualPlayerCost <= 1) return 'green';
    if (actualPlayerCost <= 2) return 'yellow';
    if (actualPlayerCost <= 3) return 'orange';
    return 'red';
  };
  
  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (onClick) {
      onClick(e);
    }
    
    if (canPerform) {
      await performAnimalAction(animalId, action);
    }
  };
  
  const buttonContent = (
    <Box style={{ position: 'relative', width: '100%' }}>
      <Button
        size={size}
        variant={variant}
        color="pink"
        fullWidth={fullWidth}
        disabled={!canPerform}
        onClick={handleClick}
        leftSection={<span>{actionDef.icon}</span>}
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
      
      {/* Energy Cost Badge */}
      <Badge
        size="xs"
        color={getEnergyCostColor()}
        variant="filled"
        style={{
          position: 'absolute',
          top: -6,
          right: -6,
          fontSize: '0.6rem',
          fontWeight: 600,
          minWidth: '18px',
          height: '18px',
          padding: '0 4px',
          zIndex: 1,
        }}
      >
        -{actualPlayerCost}
      </Badge>
      
      {/* Animal Energy Cost Indicator */}
      {animalCost > 0 && (
        <Badge
          size="xs"
          color="blue"
          variant="filled"
          style={{
            position: 'absolute',
            top: -6,
            right: actualPlayerCost > 0 ? 16 : -6,
            fontSize: '0.6rem',
            fontWeight: 600,
            minWidth: '18px',
            height: '18px',
            padding: '0 4px',
            zIndex: 1,
          }}
        >
          🐕{animalCost}
        </Badge>
      )}
      
      {/* Discount Indicator */}
      {discount > 0 && (
        <Badge
          size="xs"
          color="yellow"
          variant="filled"
          style={{
            position: 'absolute',
            bottom: -6,
            right: -6,
            fontSize: '0.5rem',
            fontWeight: 600,
            minWidth: '16px',
            height: '16px',
            padding: '0 2px',
            zIndex: 1,
          }}
        >
          ↓{discount}
        </Badge>
      )}
    </Box>
  );
  
  // Wrap with tooltip if disabled or has special info
  if (!canPerform || discount > 0 || actionDef.baseCost.requiredItems) {
    let tooltipContent = '';
    
    if (!canPerform) {
      tooltipContent = getDisabledReason() || 'Action not available';
    } else {
      const parts = [];
      parts.push(`${actionDef.description}`);
      parts.push(`Player Energy: ${actualPlayerCost}`);
      if (animalCost > 0) parts.push(`Animal Energy: ${animalCost}`);
      if (discount > 0) parts.push(`Skill Discount: -${discount} energy`);
      if (actionDef.baseCost.requiredItems?.length) {
        parts.push(`Requires: ${actionDef.baseCost.requiredItems.join(', ')}`);
      }
      
      // Add effect preview
      const effects = [];
      if (actionDef.baseEffect.health) effects.push(`+${actionDef.baseEffect.health} Health`);
      if (actionDef.baseEffect.happiness) effects.push(`+${actionDef.baseEffect.happiness} Happiness`);
      if (actionDef.baseEffect.adoptionReadiness) effects.push(`+${actionDef.baseEffect.adoptionReadiness} Adoption`);
      if (effects.length > 0) parts.push(`Effects: ${effects.join(', ')}`);
      
      tooltipContent = parts.join('\n');
    }
    
    return (
      <Tooltip
        label={tooltipContent}
        multiline
        position="top"
        withArrow
        styles={{
          tooltip: {
            backgroundColor: 'var(--mantine-color-gray-9)',
            color: 'white',
            fontSize: '0.75rem',
            maxWidth: '200px',
            whiteSpace: 'pre-line',
          },
        }}
      >
        <div style={{ width: fullWidth ? '100%' : 'auto' }}>
          {buttonContent}
        </div>
      </Tooltip>
    );
  }
  
  return buttonContent;
};

export default ActionButton;