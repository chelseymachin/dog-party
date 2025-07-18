import '@mantine/core/styles.css';
import './App.css';
import './index.css'; 
import { MantineProvider, createTheme, Text, Paper } from '@mantine/core';
import Dashboard from './components/Game/Dashboard';
import Shop from './components/Game/Shop';
import Rescue from './components/Game/Rescue';
import Statistics from './components/Game/Statistics';
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
const App: React.FC = () => {
  const currentView = useUIStore(state => state.currentView);
  
  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'shop':
        return <Shop />;
      case 'rescue':
        return <Rescue />;
      case 'stats':
        return <Statistics />;
      case 'settings':
        return (
          <Paper p="xl" radius="md" ta="center">
            <Text size="xl" mb="md">⚙️ Settings</Text>
            <Text c="gray.6">Coming soon! This will be your game settings.</Text>
          </Paper>
        );
      default:
        return <Dashboard />;
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