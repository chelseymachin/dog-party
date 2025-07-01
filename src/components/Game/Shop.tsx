import React, { useState } from 'react';
import { 
  Stack, 
  SimpleGrid, 
  Title, 
  Text, 
  Paper,
  Group,
  Badge,
  Container,
  Box,
  Tabs,
  Button,
  Card,
  Tooltip,
  Progress,
  Flex
} from '@mantine/core';
import { 
  ShoppingCart, 
  Package, 
  Star,
  Zap,
  Coffee,
  Heart,
  Bot
} from 'lucide-react';
import { useGameStore, useUIStore } from '@/stores';
import { SHOP_ITEMS, type ShopItem, type ItemCategory } from '@/types';

const Shop: React.FC = () => {
  const { budget, canAfford, spendMoney, addMoney } = useGameStore();
  const { addQuickNotification, isMobile } = useUIStore();
  const [activeTab, setActiveTab] = useState<string>('shop');
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | 'all'>('all');
  const [inventory, setInventory] = useState<Record<string, number>>({
    'energy_drink': 2,
    'premium_treats': 1,
    'coffee_machine': 1,
    'comfy_leash': 1,
  }); // This would come from inventory store

  // Filter items based on category
  const availableItems = SHOP_ITEMS.filter(item => {
    if (selectedCategory === 'all') return item.alwaysAvailable;
    return item.category === selectedCategory && item.alwaysAvailable;
  });

  const categories: Array<{ id: ItemCategory | 'all', label: string, icon: React.ReactNode }> = [
    { id: 'all', label: 'All Items', icon: <ShoppingCart size={16} /> },
    { id: 'supplies', label: 'Supplies', icon: <Package size={16} /> },
    { id: 'energy', label: 'Energy', icon: <Zap size={16} /> },
    { id: 'equipment', label: 'Equipment', icon: <Coffee size={16} /> },
    { id: 'medical', label: 'Medical', icon: <Heart size={16} /> },
    { id: 'automation', label: 'Automation', icon: <Bot size={16} /> },
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'gray';
      case 'uncommon': return 'pink';
      case 'rare': return 'purple';
      case 'epic': return 'orange';
      case 'legendary': return 'yellow';
      default: return 'gray';
    }
  };

  const getCategoryIcon = (category: ItemCategory) => {
    switch (category) {
      case 'supplies': return <Package size={14} />;
      case 'energy': return <Zap size={14} />;
      case 'equipment': return <Coffee size={14} />;
      case 'medical': return <Heart size={14} />;
      case 'automation': return <Bot size={14} />;
      default: return <Package size={14} />;
    }
  };

  const handlePurchase = (item: ShopItem, quantity: number = 1) => {
    const totalCost = item.currentPrice * quantity;
    
    if (!canAfford(totalCost)) {
      addQuickNotification('error', 'Not enough money!', `You need $${totalCost} but only have $${budget}`);
      return;
    }

    // Check max quantity
    const currentQuantity = inventory[item.id] || 0;
    if (item.maxQuantity && currentQuantity + quantity > item.maxQuantity) {
      addQuickNotification('warning', 'Maximum quantity reached!', `You can only own ${item.maxQuantity} of this item`);
      return;
    }

    // Process purchase
    const success = spendMoney(totalCost, `purchase_${item.id}`);
    
    if (success) {
      setInventory(prev => ({
        ...prev,
        [item.id]: (prev[item.id] || 0) + quantity
      }));
      
      addQuickNotification('success', 'Purchase successful!', `Bought ${quantity}x ${item.name} for $${totalCost}`);
    }
  };

  const handleSell = (item: ShopItem, quantity: number = 1) => {
    const currentQuantity = inventory[item.id] || 0;
    
    if (currentQuantity < quantity) {
      addQuickNotification('error', 'Not enough items!', `You only have ${currentQuantity} of this item`);
      return;
    }

    // Sell for 70% of purchase price
    const sellPrice = Math.floor(item.currentPrice * 0.7);
    const totalEarned = sellPrice * quantity;

    setInventory(prev => ({
      ...prev,
      [item.id]: Math.max(0, (prev[item.id] || 0) - quantity)
    }));

    addMoney(totalEarned, `sell_${item.id}`);
    addQuickNotification('success', 'Item sold!', `Sold ${quantity}x ${item.name} for $${totalEarned}`);
  };

  const getInventoryItems = () => {
    return Object.entries(inventory)
      .filter(([_, quantity]) => quantity > 0)
      .map(([itemId, quantity]) => {
        const item = SHOP_ITEMS.find(i => i.id === itemId);
        return item ? { item, quantity } : null;
      })
      .filter((entry): entry is { item: ShopItem; quantity: number } => entry !== null);
  };

  return (
    <Container size="xl" px={0} style={{ minWidth: isMobile ? 'auto' : '800px' }}>
      <Stack gap="lg">
        {/* Header */}
        <Paper 
          p="lg" 
          radius="md" 
          bg="pink.1" 
          style={{ border: '1px solid var(--mantine-color-pink-2)' }}
        >
          <Group justify="space-between" align="flex-start" wrap="wrap">
            <Box>
              <Title order={2} c="pink.7" mb={4}>
                🛒 Shelter Supply Shop
              </Title>
              <Text size="md" c="pink.8">
                Purchase supplies, equipment, and upgrades for your shelter
              </Text>
            </Box>
            
            <Group gap="md">
              <Paper p="sm" bg="green.0" style={{ border: '1px solid var(--mantine-color-green-3)' }}>
                <Group gap="xs">
                  <Box>
                    <Text size="xs" c="green.6" fw={600}>BUDGET</Text>
                    <Text size="lg" fw={700} c="green.7">${budget}</Text>
                  </Box>
                </Group>
              </Paper>
            </Group>
          </Group>
        </Paper>

        {/* Tabs */}
        <Tabs color="pink" value={activeTab} onChange={(value) => setActiveTab(value as string)}>
          <Tabs.List justify={isMobile ? 'center' : 'flex-start'}>
            <Tabs.Tab color="pink" value="shop" leftSection={<ShoppingCart size={16} />}>
              Shop
            </Tabs.Tab>
            <Tabs.Tab color="pink" value="inventory" leftSection={<Package size={16} />}>
              My Inventory
            </Tabs.Tab>
          </Tabs.List>

          {/* Shop Tab */}
          <Tabs.Panel value="shop" pt="lg">
            <Stack gap="md">
              {/* Category Filter */}
              <Paper p="md" radius="md" bg="pink.0">
                <Group gap="xs" wrap="wrap">
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      size="xs"
                      variant={selectedCategory === category.id ? 'filled' : 'light'}
                      color="pink"
                      leftSection={category.icon}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      {category.label}
                    </Button>
                  ))}
                </Group>
              </Paper>

              {/* Shop Items Grid */}
              <SimpleGrid cols={isMobile ? 1 : 3} spacing="md">
                {availableItems.map((item) => {
                  const canAffordItem = canAfford(item.currentPrice);
                  const currentQuantity = inventory[item.id] || 0;
                  const isMaxed = item.maxQuantity && currentQuantity >= item.maxQuantity;

                  return (
                    <Card
                      key={item.id}
                      padding="md"
                      radius="md"
                      withBorder
                      style={{
                        border: `1px solid var(--mantine-color-pink-3)`,
                        backgroundColor: isMaxed ? 'var(--mantine-color-pink-0)' : 'var(--mantine-color-pink-2)',
                        opacity: isMaxed ? 0.7 : 1,
                        height: '220px', // Fixed height for all cards
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                    >
                      <Flex direction="column" style={{ height: '100%' }}>
                        {/* Item Header - Fixed position at top */}
                        <Group justify="space-between" align="flex-start" mb="sm" wrap="nowrap">
                          <Group gap="xs" style={{ flex: 1, minWidth: 0 }}>
                            <Text size="xl" style={{ flexShrink: 0 }}>{item.icon}</Text>
                            <Box style={{ flex: 1, minWidth: 0 }}>
                              <Group gap="xs" align="center" wrap="wrap">
                                <Text 
                                  size="sm" 
                                  fw={600} 
                                  c="pink.8"
                                  style={{ 
                                    lineHeight: 1.2,
                                    wordBreak: 'break-word'
                                  }}
                                >
                                  {item.name}
                                </Text>
                                <Badge 
                                  size="xs" 
                                  color={getRarityColor(item.rarity)}
                                  variant="light"
                                >
                                  {item.rarity}
                                </Badge>
                              </Group>
                              <Group gap={4} align="center" mt={2}>
                                {getCategoryIcon(item.category)}
                                <Text size="xs" c="pink.5">
                                  {item.category}
                                </Text>
                              </Group>
                            </Box>
                          </Group>
                          
                          <Text 
                            size="lg" 
                            fw={700} 
                            c="green.6"
                            style={{ flexShrink: 0, marginLeft: '8px' }}
                          >
                            ${item.currentPrice}
                          </Text>
                        </Group>

                        {/* Description - Flexible content area */}
                        <Text 
                          size="sm" 
                          c="pink.6" 
                          style={{ 
                            lineHeight: 1.4,
                            flex: 1,
                            overflow: 'hidden',
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical'
                          }}
                          mb="sm"
                        >
                          {item.description}
                        </Text>

                        {/* Bottom section - Fixed at bottom */}
                        <Box>
                          {/* Quantity Info */}
                          {item.maxQuantity && (
                            <Group justify="space-between" mb="sm">
                              <Text size="xs" c="pink.5">
                                Owned: {currentQuantity}/{item.maxQuantity}
                              </Text>
                              <Progress
                                value={(currentQuantity / item.maxQuantity) * 100}
                                size="xs"
                                color={isMaxed ? 'pink' : 'green'}
                                style={{ flex: 1, marginLeft: 8 }}
                              />
                            </Group>
                          )}

                          {/* Purchase Button - Always at bottom */}
                          <Button
                            fullWidth
                            color="pink"
                            disabled={!canAffordItem || !!isMaxed}
                            onClick={() => handlePurchase(item)}
                            leftSection={<ShoppingCart size={16} />}
                          >
                            {!canAffordItem ? 'Not enough money' : 
                             isMaxed ? 'Maximum owned' : 
                             `Buy for $${item.currentPrice}`}
                          </Button>
                        </Box>
                      </Flex>
                    </Card>
                  );
                })}
              </SimpleGrid>
            </Stack>
          </Tabs.Panel>

          {/* Inventory Tab */}
          <Tabs.Panel value="inventory" pt="lg">
            <Stack gap="md">
              {getInventoryItems().length === 0 ? (
                <Paper p="xl" radius="md" ta="center" bg="pink.0" style={{ border: '2px dashed var(--mantine-color-pink-3)' }}>
                  <Text size="xl" c="pink.5" mb="md">
                    📦 Your inventory is empty
                  </Text>
                  <Text size="md" c="gray.6" mb="lg">
                    Purchase items from the shop to get started!
                  </Text>
                  <Button 
                    variant="light" 
                    onClick={() => setActiveTab('shop')}
                    leftSection={<ShoppingCart size={16} />}
                  >
                    Go Shopping
                  </Button>
                </Paper>
              ) : (
                <>
                  {/* Inventory Stats */}
                  <Paper p="md" radius="md" bg="pink.0">
                    <Group justify="space-between">
                      <Text size="sm" fw={600} c="pink.7">
                        Total Inventory Value: ${getInventoryItems().reduce((total, { item, quantity }) => 
                          total + (item.currentPrice * quantity), 0
                        )}
                      </Text>
                      <Text size="xs" c="pink.6">
                        Items sold back at 70% value
                      </Text>
                    </Group>
                  </Paper>

                  {/* Inventory Grid */}
                  <SimpleGrid cols={isMobile ? 1 : 3} spacing="md">
                    {getInventoryItems().map(({ item, quantity }) => (
                      <Card
                        key={item.id}
                        padding="md"
                        radius="md"
                        withBorder
                        style={{
                          border: `1px solid var(--mantine-color-${getRarityColor(item.rarity)}-3)`,
                          height: '260px', // Fixed height for inventory cards too
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                      >
                        <Flex direction="column" style={{ height: '100%' }}>
                          {/* Item Header */}
                          <Group justify="space-between" align="flex-start" mb="sm" wrap="nowrap">
                            <Group gap="xs" style={{ flex: 1, minWidth: 0 }}>
                              <Text size="xl" style={{ flexShrink: 0 }}>{item.icon}</Text>
                              <Box style={{ flex: 1, minWidth: 0 }}>
                                <Text 
                                  size="sm" 
                                  fw={600} 
                                  c="pink.8"
                                  style={{ 
                                    lineHeight: 1.2,
                                    wordBreak: 'break-word'
                                  }}
                                >
                                  {item.name}
                                </Text>
                                <Text size="xs" c="pink.5">
                                  Quantity: {quantity}
                                </Text>
                              </Box>
                            </Group>
                            
                            <Badge 
                              color="green" 
                              variant="light"
                              style={{ flexShrink: 0, marginLeft: '8px' }}
                            >
                              ${Math.floor(item.currentPrice * 0.7)} each
                            </Badge>
                          </Group>

                          {/* Description */}
                          <Text 
                            size="sm" 
                            c="gray.6" 
                            style={{ 
                              lineHeight: 1.4,
                              flex: 1,
                              overflow: 'hidden',
                              display: '-webkit-box',
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: 'vertical'
                            }}
                            mb="sm"
                          >
                            {item.description}
                          </Text>

                          {/* Action Buttons - Always at bottom */}
                          <Group gap="xs">
                            {item.consumable && (
                              <Tooltip label="Use this item">
                                <Button
                                  size="xs"
                                  color="green"
                                  variant="light"
                                  leftSection={<Star size={14} />}
                                  onClick={() => {
                                    // TO-DO: add in item usage logic, remove one count from inventory and add any effects from it
                                    addQuickNotification('info', 'Item used!', `Used ${item.name}`);
                                  }}
                                >
                                  Use
                                </Button>
                              </Tooltip>
                            )}
                            
                            <Button
                              size="xs"
                              color="red"
                              variant="light"
                              onClick={() => handleSell(item, 1)}
                              style={{ flex: 1 }}
                            >
                              Sell for ${Math.floor(item.currentPrice * 0.7)}
                            </Button>
                          </Group>
                        </Flex>
                      </Card>
                    ))}
                  </SimpleGrid>
                </>
              )}
            </Stack>
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Container>
  );
};

export default Shop;