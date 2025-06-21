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
  const { notifications, removeNotification, isMobile } = useUIStore();
  
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
        return 'pink';
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
      left: isMobile ? '50%' : 'auto',
      right: isMobile ? 'auto' : 20,
      transform: isMobile ? 'translateX(-50%)' : 'none',
      zIndex: 1000,
      maxWidth: isMobile ? '90vw' : '400px',
      width: isMobile ? '90vw' : '100%',
      pointerEvents: 'none', 
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
                  pointerEvents: 'auto', 
                  backgroundColor: getNotificationBackground(notification.type),
                  border: getNotificationBorder(notification.type),
                  padding: isMobile ? '10px 12px' : '12px 16px',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  width: '100%',
                }}
              >
                <Group align="flex-start" wrap="nowrap" gap={isMobile ? "xs" : "sm"}>
                  {/* Icon */}
                  <div style={{ 
                    color: `var(--mantine-color-${getNotificationColor(notification.type)}-6)`,
                    marginTop: '2px',
                    flexShrink: 0
                  }}>
                    {notification.icon ? (
                      <span style={{ fontSize: isMobile ? '16px' : '18px' }}>{notification.icon}</span>
                    ) : (
                      getNotificationIcon(notification.type)
                    )}
                  </div>
                  
                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Group justify="space-between" align="flex-start" mb={4}>
                      <Text 
                        size={isMobile ? "xs" : "sm"}
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
                      size={isMobile ? "xs" : "sm"}
                      c="gray.7"
                      style={{ lineHeight: 1.4 }}
                    >
                      {notification.message}
                    </Text>
                    
                    {/* Action buttons */}
                    {notification.actions && notification.actions.length > 0 && (
                      <Group gap="xs" mt="xs">
                        {notification.actions.map((action, index) => (
                          <button
                            key={index}
                            style={{
                              background: action.style === 'primary' 
                                ? `var(--mantine-color-${getNotificationColor(notification.type)}-6)`
                                : action.style === 'danger' 
                                ? 'var(--mantine-color-red-6)'
                                : 'var(--mantine-color-gray-2)',
                              color: action.style === 'secondary' 
                                ? 'var(--mantine-color-gray-8)'
                                : 'white',
                              border: 'none',
                              padding: isMobile ? '4px 8px' : '6px 12px',
                              borderRadius: '4px',
                              fontSize: isMobile ? '11px' : '12px',
                              fontWeight: 500,
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                            }}
                            onClick={() => {
                              removeNotification(notification.id);
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.opacity = '0.8';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.opacity = '1';
                            }}
                          >
                            {action.label}
                          </button>
                        ))}
                      </Group>
                    )}
                  </div>
                  
                  {/* Close button - Show on mobile or persistent notifications */}
                  {(isMobile || notification.persistent) && (
                    <ActionIcon
                      size="sm"
                      variant="subtle"
                      color="gray"
                      onClick={() => removeNotification(notification.id)}
                      style={{ flexShrink: 0, marginTop: '-2px' }}
                    >
                      <X size={14} />
                    </ActionIcon>
                  )}
                </Group>
              </Paper>
            )}
          </Transition>
        ))}
      </Stack>
    </div>
  );
};

export default NotificationContainer;