import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { SHOP_ITEMS, type Inventory, type Purchase } from '@/types';

interface InventoryStore {
  inventory: Inventory;
  purchaseHistory: Purchase[];
  
  // Inventory management
  addItem: (itemId: string, quantity: number) => boolean;
  removeItem: (itemId: string, quantity: number) => boolean;
  useItem: (itemId: string) => boolean;
  hasItem: (itemId: string, quantity?: number) => boolean;
  getItemQuantity: (itemId: string) => number;
  
  // Equipment
  installEquipment: (itemId: string) => boolean;
  uninstallEquipment: (itemId: string) => boolean;
  isEquipmentInstalled: (itemId: string) => boolean;
  
  // Shop integration
  purchaseItem: (itemId: string, quantity: number, totalCost: number) => boolean;
  
  // Effects calculation
  getActiveEffects: () => any;
  getEnergyBonus: () => number;
  getActionCostReduction: (action: string) => number;
  getActionEffectMultiplier: (action: string) => number;
  
  // Utility
  getInventoryValue: () => number;
  canAffordItem: (itemId: string, quantity: number, playerMoney: number) => boolean;
}

const createInitialInventory = (): Inventory => ({
  items: {},
  equipment: [],
  capacity: 50,
  usedCapacity: 0,
});

export const useInventoryStore = create<InventoryStore>()(
  devtools(
    (set, get) => ({
      inventory: createInitialInventory(),
      purchaseHistory: [],
      
      addItem: (itemId: string, quantity: number) => {
        const item = SHOP_ITEMS.find(i => i.id === itemId);
        if (!item) return false;
        
        set((state) => {
          const currentQuantity = state.inventory.items[itemId] || 0;
          const newQuantity = currentQuantity + quantity;
          
          // Check max quantity limit
          if (item.maxQuantity && newQuantity > item.maxQuantity) {
            return state; // Don't add if it exceeds max
          }
          
          return {
            inventory: {
              ...state.inventory,
              items: {
                ...state.inventory.items,
                [itemId]: newQuantity,
              },
              usedCapacity: state.inventory.usedCapacity + quantity,
            },
          };
        }, false, 'addItem');
        
        return true;
      },
      
      removeItem: (itemId: string, quantity: number) => {
        set((state) => {
          const currentQuantity = state.inventory.items[itemId] || 0;
          const newQuantity = Math.max(0, currentQuantity - quantity);
          
          const newItems = { ...state.inventory.items };
          if (newQuantity === 0) {
            delete newItems[itemId];
          } else {
            newItems[itemId] = newQuantity;
          }
          
          return {
            inventory: {
              ...state.inventory,
              items: newItems,
              usedCapacity: Math.max(0, state.inventory.usedCapacity - quantity),
            },
          };
        }, false, 'removeItem');
        
        return true;
      },
      
      useItem: (itemId: string) => {
        const item = SHOP_ITEMS.find(i => i.id === itemId);
        if (!item || !item.consumable) return false;
        
        const hasItem = get().hasItem(itemId);
        if (!hasItem) return false;
        
        get().removeItem(itemId, 1);
        return true;
      },
      
      hasItem: (itemId: string, quantity = 1) => {
        const currentQuantity = get().inventory.items[itemId] || 0;
        return currentQuantity >= quantity;
      },
      
      getItemQuantity: (itemId: string) => {
        return get().inventory.items[itemId] || 0;
      },
      
      installEquipment: (itemId: string) => {
        const item = SHOP_ITEMS.find(i => i.id === itemId);
        if (!item || item.consumable) return false;
        
        if (!get().hasItem(itemId)) return false;
        
        set((state) => ({
          inventory: {
            ...state.inventory,
            equipment: [...state.inventory.equipment, itemId],
          },
        }), false, 'installEquipment');
        
        return true;
      },
      
      uninstallEquipment: (itemId: string) => {
        set((state) => ({
          inventory: {
            ...state.inventory,
            equipment: state.inventory.equipment.filter(id => id !== itemId),
          },
        }), false, 'uninstallEquipment');
        
        return true;
      },
      
      isEquipmentInstalled: (itemId: string) => {
        return get().inventory.equipment.includes(itemId);
      },
      
      purchaseItem: (itemId: string, quantity: number, totalCost: number) => {
        const success = get().addItem(itemId, quantity);
        
        if (success) {
          const purchase: Purchase = {
            itemId,
            quantity,
            totalCost,
            timestamp: new Date(),
          };
          
          set((state) => ({
            purchaseHistory: [...state.purchaseHistory, purchase],
          }), false, 'purchaseItem');
          
          // Auto-install equipment if it's not consumable
          const item = SHOP_ITEMS.find(i => i.id === itemId);
          if (item && !item.consumable && item.category === 'equipment') {
            get().installEquipment(itemId);
          }
        }
        
        return success;
      },
      
      getActiveEffects: () => {
        const effects: any = {
          dailyEnergyBonus: 0,
          passiveHealth: 0,
          actionCostReductions: {},
          actionEffectMultipliers: {},
        };
        
        // Combine effects from all installed equipment
        get().inventory.equipment.forEach(itemId => {
          const item = SHOP_ITEMS.find(i => i.id === itemId);
          if (!item) return;
          
          const itemEffects = item.effects;
          
          if (itemEffects.dailyEnergyBonus) {
            effects.dailyEnergyBonus += itemEffects.dailyEnergyBonus;
          }
          
          if (itemEffects.passiveHealth) {
            effects.passiveHealth += itemEffects.passiveHealth;
          }
          
          if (itemEffects.reduceActionCost) {
            itemEffects.reduceActionCost.forEach(reduction => {
              effects.actionCostReductions[reduction.action] = 
                (effects.actionCostReductions[reduction.action] || 0) + reduction.reduction;
            });
          }
          
          if (itemEffects.improveActionEffect) {
            itemEffects.improveActionEffect.forEach(improvement => {
              effects.actionEffectMultipliers[improvement.action] = 
                (effects.actionEffectMultipliers[improvement.action] || 1) * improvement.multiplier;
            });
          }
        });
        
        return effects;
      },
      
      getEnergyBonus: () => {
        return get().getActiveEffects().dailyEnergyBonus;
      },
      
      getActionCostReduction: (action: string) => {
        return get().getActiveEffects().actionCostReductions[action] || 0;
      },
      
      getActionEffectMultiplier: (action: string) => {
        return get().getActiveEffects().actionEffectMultipliers[action] || 1;
      },
      
      getInventoryValue: () => {
        let totalValue = 0;
        
        Object.entries(get().inventory.items).forEach(([itemId, quantity]) => {
          const item = SHOP_ITEMS.find(i => i.id === itemId);
          if (item) {
            totalValue += item.currentPrice * quantity;
          }
        });
        
        return totalValue;
      },
      
      canAffordItem: (itemId: string, quantity: number, playerMoney: number) => {
        const item = SHOP_ITEMS.find(i => i.id === itemId);
        if (!item) return false;
        
        const totalCost = item.currentPrice * quantity;
        return playerMoney >= totalCost;
      },
    }),
    {
      name: 'inventory-store',
      enabled: process.env.NODE_ENV === 'development',
    }
  )
);