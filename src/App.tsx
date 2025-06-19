// src/App.tsx

import '@mantine/core/styles.css';
import './App.css';
import { MantineProvider, createTheme, Text, Paper, Stack } from '@mantine/core';
import { useUIStore } from '@/stores';
import MainLayout from './components/Layout/MainLayout';

const theme = createTheme({
  primaryColor: 'pink',
  colors: {
    pink: [
      '#fdf2f8', // pink-50
      '#fce7f3', // pink-100
      '#fbcfe8', // pink-200
      '#f9a8d4', // pink-300
      '#f472b6', // pink-400
      '#ec4899', // pink-500 (primary)
      '#db2777', // pink-600
      '#be185d', // pink-700
      '#9d174d', // pink-800
      '#831843', // pink-900
    ],
    energy: [
      '#f0fdf4', // green-50
      '#dcfce7', // green-100
      '#bbf7d0', // green-200
      '#86efac', // green-300
      '#4ade80', // green-400
      '#22c55e', // green-500 (main energy color)
      '#16a34a', // green-600
      '#15803d', // green-700
      '#166534', // green-800
      '#14532d', // green-900
    ],
  },
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
  headings: {
    fontFamily: 'Poppins, Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
  },
  defaultRadius: 'md',
});

// Simple placeholder component for testing
const TestDashboard = () => {
  return (
    <Stack gap="lg">
      <Paper p="xl" radius="md" bg="pink.0" style={{ border: '1px solid var(--mantine-color-pink-2)' }}>
        <Text size="xl" fw={600} c="pink.7" ta="center" mb="md">
          🎉 Welcome to Dog Party: Shelter Simulator!
        </Text>
        <Text ta="center" c="gray.6">
          Your layout components are working! The game is initializing...
        </Text>
      </Paper>
      
      <Paper p="md" radius="md" bg="blue.0" style={{ border: '1px solid var(--mantine-color-blue-2)' }}>
        <Text fw={600} c="blue.7" mb="xs">
          🧪 Testing Features:
        </Text>
        <Stack gap="xs">
          <Text size="sm" c="blue.6">✅ Header with day counter and budget</Text>
          <Text size="sm" c="blue.6">✅ Navigation sidebar with goals</Text>
          <Text size="sm" c="blue.6">✅ Responsive design (try resizing window)</Text>
          <Text size="sm" c="blue.6">✅ Pink theme and custom colors</Text>
          <Text size="sm" c="blue.6">✅ Lucide icons integration</Text>
        </Stack>
      </Paper>
      
      <Paper p="md" radius="md" bg="yellow.0" style={{ border: '1px solid var(--mantine-color-yellow-3)' }}>
        <Text fw={600} c="yellow.8" mb="xs">
          🚧 Coming Next:
        </Text>
        <Stack gap="xs">
          <Text size="sm" c="yellow.7">🐕 Animal cards and care system</Text>
          <Text size="sm" c="yellow.7">⚡ Energy management panel</Text>
          <Text size="sm" c="yellow.7">🎯 Daily goals and progression</Text>
          <Text size="sm" c="yellow.7">🛒 Shop and inventory system</Text>
        </Stack>
      </Paper>
    </Stack>
  );
};

const App: React.FC = () => {
  const currentView = useUIStore(state => state.currentView);
  
  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <TestDashboard />;
      case 'shop':
        return (
          <Paper p="xl" radius="md" ta="center">
            <Text size="xl" mb="md">🛒 Shop View</Text>
            <Text c="gray.6">Coming soon! This will be your shop interface.</Text>
          </Paper>
        );
      case 'adoptions':
        return (
          <Paper p="xl" radius="md" ta="center">
            <Text size="xl" mb="md">🏡 Adoption Center</Text>
            <Text c="gray.6">Coming soon! This will show animals ready for adoption.</Text>
          </Paper>
        );
      case 'stats':
        return (
          <Paper p="xl" radius="md" ta="center">
            <Text size="xl" mb="md">📊 Statistics</Text>
            <Text c="gray.6">Coming soon! This will show your shelter's performance data.</Text>
          </Paper>
        );
      case 'settings':
        return (
          <Paper p="xl" radius="md" ta="center">
            <Text size="xl" mb="md">⚙️ Settings</Text>
            <Text c="gray.6">Coming soon! This will be your game settings.</Text>
          </Paper>
        );
      default:
        return <TestDashboard />;
    }
  };
  
  return (
    <MantineProvider theme={theme}>
      <MainLayout>
        {renderCurrentView()}
      </MainLayout>
    </MantineProvider>
  );
};

export default App;