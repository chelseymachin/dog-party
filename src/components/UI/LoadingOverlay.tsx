import React from 'react';
import { 
  Overlay, 
  Center, 
  Stack, 
  Text, 
  Loader,
  Paper
} from '@mantine/core';

interface LoadingOverlayProps {
  message?: string;
  visible?: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  message = 'Loading...', 
  visible = true 
}) => {
  if (!visible) {
    return null;
  }
  
  return (
    <Overlay
      color="var(--mantine-color-pink-0)"
      backgroundOpacity={0.85}
      blur={4}
      zIndex={1000}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      <Center style={{ height: '100vh' }}>
        <Paper
          p="xl"
          radius="lg"
          shadow="lg"
          style={{
            backgroundColor: 'white',
            border: '1px solid var(--mantine-color-pink-3)',
            minWidth: '200px',
          }}
        >
          <Stack align="center" gap="lg">
            {/* Custom animated loader */}
            <div style={{ position: 'relative' }}>
              <Loader 
                color="pink" 
                size="lg" 
                type="dots"
              />
              
              {/* Cute paw animation overlay */}
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  fontSize: '24px',
                  animation: 'bounce 1.5s ease-in-out infinite',
                }}
              >
                🐾
              </div>
            </div>
            
            <Stack align="center" gap="xs">
              <Text 
                size="lg" 
                fw={600} 
                c="pink.7"
                ta="center"
              >
                {message}
              </Text>
              
              <Text 
                size="sm" 
                c="gray.6" 
                ta="center"
              >
                Taking care of your animals...
              </Text>
            </Stack>
          </Stack>
        </Paper>
      </Center>
      
      {/* CSS animations */}
      <style>
        {`
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
              transform: translate(-50%, -50%) translateY(0);
            }
            40% {
              transform: translate(-50%, -50%) translateY(-10px);
            }
            60% {
              transform: translate(-50%, -50%) translateY(-5px);
            }
          }
          
          @keyframes pulse {
            0% {
              box-shadow: 0 0 0 0 rgba(236, 72, 153, 0.7);
            }
            70% {
              box-shadow: 0 0 0 10px rgba(236, 72, 153, 0);
            }
            100% {
              box-shadow: 0 0 0 0 rgba(236, 72, 153, 0);
            }
          }
        `}
      </style>
    </Overlay>
  );
};

export default LoadingOverlay;