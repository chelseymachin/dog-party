import React from 'react';
import { Modal as MantineModal } from '@mantine/core';
import { useUIStore } from '@/stores';
import AnimalModal from '../Animals/AnimalModal';
import DayEndModal from '../Day/DayEndModal';
import SettingsModal from '../Settings/SettingsModal';
import EnergyRestoreModal from '../Energy/EnergyRestoreModal';

const Modal: React.FC = () => {
  const { activeModal, modalData, closeModal } = useUIStore();
  
  const renderModalContent = () => {
    switch (activeModal) {
      case 'animal_care':
        return <AnimalModal animalId={modalData?.animalId} />;
      
      case 'day_end_summary':
        return <DayEndModal summary={modalData} />;
      
      case 'settings':
        return <SettingsModal />;
      
      case 'energy_restore':
        return <EnergyRestoreModal />;
      
      case 'shop_purchase':
        return (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <h3>🛒 Shop Purchase</h3>
            <p>Shop purchase functionality coming soon!</p>
          </div>
        );
      
      case 'adoption_confirm':
        return (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <h3>🏡 Adoption Confirmation</h3>
            <p>Adoption confirmation coming soon!</p>
          </div>
        );
      
      case 'tutorial':
        return (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <h3>📚 Tutorial</h3>
            <p>Interactive tutorial coming soon!</p>
          </div>
        );
      
      case 'achievement':
        return (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <h3>🏆 Achievement Unlocked!</h3>
            <p>Achievement system coming soon!</p>
          </div>
        );
      
      case 'confirm_action':
        return (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <h3>❓ Confirm Action</h3>
            <p>Action confirmation coming soon!</p>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  const getModalProps = () => {
    const baseProps = {
      opened: !!activeModal,
      onClose: closeModal,
      zIndex: 10000,
      withinPortal: false,
      centered: true,
      overlayProps: {
        backgroundOpacity: 0.6,
        blur: 4,
      },
      styles: {
        header: {
          backgroundColor: 'var(--mantine-color-pink-0)',
          borderBottom: '1px solid var(--mantine-color-pink-2)',
        },
        content: {
          border: '1px solid var(--mantine-color-pink-2)',
        },
      },
    };
    
    // Customize props based on modal type
    switch (activeModal) {
      case 'animal_care':
        return {
          ...baseProps,
          title: '🐾 Animal Care',
          size: 'lg',
        };
      
      case 'day_end_summary':
        return {
          ...baseProps,
          title: '🌙 Day Complete',
          size: 'md',
          closeOnClickOutside: false,
          closeOnEscape: false,
          withCloseButton: false,
        };
      
      case 'settings':
        return {
          ...baseProps,
          title: '⚙️ Settings',
          size: 'md',
        };
      
      case 'energy_restore':
        return {
          ...baseProps,
          title: '⚡ Energy Boost',
          size: 'sm',
        };
      
      case 'shop_purchase':
        return {
          ...baseProps,
          title: '🛒 Shop Purchase',
          size: 'md',
        };
      
      case 'adoption_confirm':
        return {
          ...baseProps,
          title: '🏡 Adoption Confirmation',
          size: 'sm',
        };
      
      case 'tutorial':
        return {
          ...baseProps,
          title: '📚 Tutorial',
          size: 'lg',
        };
      
      case 'achievement':
        return {
          ...baseProps,
          title: '🏆 Achievement',
          size: 'sm',
        };
      
      case 'confirm_action':
        return {
          ...baseProps,
          title: '❓ Confirm',
          size: 'xs',
        };
      
      default:
        return {
          ...baseProps,
          title: 'Modal',
          size: 'md',
        };
    }
  };
  
  if (!activeModal) {
    return null;
  }
  
  return (
    <MantineModal 
      {...getModalProps()}
    >
      {renderModalContent()}
    </MantineModal>
  );
};

export default Modal;