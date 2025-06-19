import React, { useEffect } from 'react';
import { 
  Stack, 
  Paper, 
  Group, 
  Text, 
  ActionIcon, 
  Badge,
  Transition
} from '@mantine/core';
import { 
  X, 
  CheckCircle, 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  Trophy,
  Zap,
  Heart,
  Sparkles
} from 'lucide-react';
import { useUIStore } from '@/stores';
import { type NotificationType } from '@/types';

const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useUIStore();
  
  // Auto-remove non-persistent notifications
  useEffect(() => {
    notifications.forEach(notification => {
      if (!notification.persistent && notification.duration) {
        const timer = setTimeout(() => {
          removeNotification(notification.id);
        }, notification.duration);
        
        return () => clearTimeout(timer);
      }
    });
  }, [notifications, removeNotification]);
  
  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={18} />;
      case 'warning':
        return <AlertTriangle size={18} />;
      case 'error':
        return <AlertCircle size={18} />;
      case 'info':
        return <Info size={18} />;
      case 'achievement':
        return <Trophy size={18} />;
      case 'energy_low':
        return <Zap size={18} />;
      case 'animal_sick':
        return <Heart size={18} />;
      case 'adoption_ready':
        return <Sparkles size={18} />;
      default:
        return <Info size={18} />;
    }
  };
  
  const getNotificationColor = (type: NotificationType) => {
    switch (type) {
      case 'success':
      case 'adoption_ready':
        return 'green';
      case 'warning':
      case 'energy_low':
        return 'yellow';
      case 'error':
      case 'animal_sick':
        return 'red';
      case 'achievement':
        return 'purple';
      case 'info':
      default:
        return 'blue';
    }
  };
  
  const getNotificationBackground = (type: NotificationType) => {
    const color = getNotificationColor(type);
    return `var(--mantine-color-${color}-0)`;
  };
  
  const getNotificationBorder = (type: NotificationType) => {
    const color = getNotificationColor(type);
    return `1px solid var(--mantine-color-${color}-3)`;
  };
  
  if (notifications.length === 0) {
    return null;
  }
  
  return (
    <div style={{
      position: 'fixed',
      top: 80,
      right: 20,
      zIndex: 1000,
      maxWidth: '400px',
      width: '100%',
      pointerEvents: 'none', // Allow clicks through the container
    }}>
      <Stack gap="sm">
        {notifications.slice(-5).map(notification => (
          <Transition
            key={notification.id}
            mounted={true}
            transition="slide-left"
            duration={200}
            timingFunction="ease"
          >
            {(styles) => (
              <Paper
                style={{
                  ...styles,
                  pointerEvents: 'auto', // Re-enable clicks for individual notifications
                  backgroundColor: getNotificationBackground(notification.type),
                  border: getNotificationBorder(notification.type),
                  padding: '12px 16px',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                }}
              >
                <Group align="flex-start" wrap="nowrap">
                  {/* Icon */}
                  <div style={{ 
                    color: `var(--mantine-color-${getNotificationColor(notification.type)}-6)`,
                    marginTop: '2px',
                    flexShrink: 0
                  }}>
                    {notification.icon ? (
                      <span style={{ fontSize: '18px' }}>{notification.icon}</span>
                    ) : (
                      getNotificationIcon(notification.type)
                    )}
                  </div>
                  
                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Group justify="space-between" align="flex-start" mb={4}>
                      <Text 
                        size="sm" 
                        fw={600} 
                        c={`${getNotificationColor(notification.type)}.7`}
                        style={{ lineHeight: 1.3 }}
                      >
                        {notification.title}
                      </Text>
                      
                      {notification.type === 'achievement' && (
                        <Badge size="xs" color="purple" variant="filled">
                          NEW!
                        </Badge>
                      )}
                    </Group>
                    
                    <Text 
                      size="sm" 
                      c="gray.7"
                      style={{ lineHeight: 1.4 }}
                    >
                      {notification.message}
                    </Text>
                    
                    {/* Action buttons if any */}
                    {notification.actions && notification.actions.length > 0 && (
                      <Group gap="xs" mt="xs">
                        {notification.actions.map((action, index) => (
                          <button
                            key={index}
                            style={{
                              background: action.style === 'primary' 
                                ? `var(--mantine-color-${getNotificationColor(notification.type)}-6)`
                                : 'transparent',
                              color: action.style === 'primary' 
                                ? 'white' 
                                : `var(--mantine-color-${getNotificationColor(notification.type)}-7)`,
                              border: `1px solid var(--mantine-color-${getNotificationColor(notification.type)}-4)`,
                              borderRadius: '4px',
                              padding: '4px 8px',
                              fontSize: '12px',
                              cursor: 'pointer',
                              fontWeight: 500,
                            }}
                            onClick={() => {
                              // Handle action click here
                              console.log('Action clicked:', action.action);
                            }}
                          >
                            {action.label}
                          </button>
                        ))}
                      </Group>
                    )}
                  </div>
                  
                  {/* Close button */}
                  {!notification.persistent && (
                    <ActionIcon
                      size="sm"
                      variant="subtle"
                      color={getNotificationColor(notification.type)}
                      onClick={() => removeNotification(notification.id)}
                      style={{ flexShrink: 0 }}
                    >
                      <X size={14} />
                    </ActionIcon>
                  )}
                </Group>
                
                {/* Progress bar for timed notifications */}
                {!notification.persistent && notification.duration && (
                  <div 
                    style={{
                      marginTop: '8px',
                      height: '2px',
                      backgroundColor: `var(--mantine-color-${getNotificationColor(notification.type)}-2)`,
                      borderRadius: '1px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        backgroundColor: `var(--mantine-color-${getNotificationColor(notification.type)}-5)`,
                        width: '100%',
                        animation: `shrink ${notification.duration}ms linear`,
                        transformOrigin: 'left',
                      }}
                    />
                  </div>
                )}
              </Paper>
            )}
          </Transition>
        ))}
      </Stack>
      
      {/* Add CSS animation for progress bar */}
      <style>
        {`
          @keyframes shrink {
            from {
              transform: scaleX(1);
            }
            to {
              transform: scaleX(0);
            }
          }
        `}
      </style>
    </div>
  );
};

export default NotificationContainer;