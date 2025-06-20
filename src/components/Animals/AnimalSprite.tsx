import React, { useState, useEffect } from 'react';
import { Box } from '@mantine/core';

interface AnimalSpriteProps {
  breed: string;
  color: string;
  animation: 'idle' | 'feeding' | 'walking' | 'medical' | 'playing';
  size?: number;
  onAnimationComplete?: () => void;
}

const AnimalSprite: React.FC<AnimalSpriteProps> = ({ 
  breed, 
  color,
  animation, 
  size = 64,
  onAnimationComplete 
}) => {

  interface BreedAnimationConfig {
    availableAnimations: (keyof typeof animations)[];
    defaultIdle: keyof typeof animations;
    actionMappings: Record<string, keyof typeof animations>;
    customFrameCounts?: Record<string, number>; // Override specific animation frame counts
  }
  

  const [currentFrame, setCurrentFrame] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [detectedFrameCount, setDetectedFrameCount] = useState<number | null>(null);

  // Animation configurations
  const animations = {
    idle: { frames: 4, duration: 800, loop: true },
    barking: { frames: 4, duration: 1000, loop: false },
    bite: { frames: 4, duration: 1200, loop: false },
    dying: { frames: 10, duration: 1500, loop: false },
    jump: { frames: 7, duration: 1000, loop: false },
    running: { frames: 8, duration: 900, loop: false }, 
    walking: { frames: 8, duration: 1000, loop: false },
    playing: { frames: 7, duration: 1400, loop: false },
    standing: { frames: 3, duration: 600, loop: true },
    sitting: { frames: 9, duration: 1200, loop: false },
    sleeping: { frames: 14, duration: 1000, loop: false },
    hurt: { frames: 4, duration: 800, loop: false },
    laydown: { frames: 5, duration: 1200, loop: false },
    sit: { frames: 4, duration: 800, loop: false },
    sleep: { frames: 6, duration: 1000, loop: false },
    bark: { frames: 6, duration: 800, loop: false },
  };

  const smallDogsConfig: Record<string, BreedAnimationConfig> = {
    'bull_terrier': {
      availableAnimations: ['idle', 'sit', 'walking', 'playing', 'sleeping'],
      defaultIdle: 'idle',
      actionMappings: {
        'feed': 'sit',
        'walk': 'walking',
        'play': 'playing',
        'medical': 'sleeping',
      }
    },
    'chihuahua': {
      availableAnimations: ['idle', 'sit', 'walking', 'barking'],
      defaultIdle: 'idle',
      actionMappings: {
        'feed': 'sit',
        'walk': 'walking',
        'play': 'barking',
        'medical': 'sitting',
      }
    },
    'corgi': {
      availableAnimations: ['idle', 'sit', 'walking', 'playing', 'sleeping'],
      defaultIdle: 'idle',
      actionMappings: {
        'feed': 'sit',
        'walk': 'walking',
        'play': 'playing',
        'medical': 'sleeping',
      }
    },
    'miniature_poodle': {
      availableAnimations: ['idle', 'sit', 'walking', 'playing'],
      defaultIdle: 'idle',
      actionMappings: {
        'feed': 'sit',
        'walk': 'walking',
        'play': 'playing',
        'medical': 'sitting',
      }
    },
    'papillion': {
      availableAnimations: ['idle', 'sit', 'walking', 'playing'],
      defaultIdle: 'idle',
      actionMappings: {
        'feed': 'sit',
        'walk': 'walking',
        'play': 'playing',
        'medical': 'sitting',
      }
    },
    'pug': {
      availableAnimations: ['idle', 'sit', 'walking', 'sleeping'],
      defaultIdle: 'idle',
      actionMappings: {
        'feed': 'sit',
        'walk': 'walking',
        'play': 'walking',
        'medical': 'sleeping',
      }
    }
  };

  const largeDogsConfig: Record<string, BreedAnimationConfig> = {
    'afghan_hound': {
      availableAnimations: ['standing', 'sitting', 'walking', 'sleeping'],
      defaultIdle: 'standing',
      actionMappings: {
        'feed': 'sitting',
        'walk': 'walking',
        'play': 'walking',
        'medical': 'sleeping',
      }
    },
    'bloodhound': {
      availableAnimations: ['standing', 'sitting', 'walking', 'sleeping'],
      defaultIdle: 'standing',
      actionMappings: {
        'feed': 'sitting',
        'walk': 'walking',
        'play': 'walking',
        'medical': 'sleeping',
      }
    },
    'dalmation': {
      availableAnimations: ['standing', 'running', 'sitting', 'playing'],
      defaultIdle: 'standing',
      actionMappings: {
        'feed': 'sitting',
        'walk': 'running',
        'play': 'playing',
        'medical': 'sitting',
      }
    },
    'doberman': {
      availableAnimations: ['standing', 'running', 'sitting', 'sleeping'],
      defaultIdle: 'standing',
      actionMappings: {
        'feed': 'sitting',
        'walk': 'running',
        'play': 'running',
        'medical': 'sleeping',
      }
    },
    'german_shepherd': {
      availableAnimations: ['standing', 'walking', 'sitting', 'sleeping'],
      defaultIdle: 'standing',
      actionMappings: {
        'feed': 'sitting',
        'walk': 'walking',
        'play': 'walking',
        'medical': 'sleeping',
      }
    },
    'great_dane': {
      availableAnimations: ['standing', 'walking', 'sleeping'],
      defaultIdle: 'standing',
      actionMappings: {
        'feed': 'standing',
        'walk': 'walking',
        'play': 'walking',
        'medical': 'sleeping',
      }
    },
    'greyhound': {
      availableAnimations: ['standing', 'sitting', 'running', 'sleeping', 'walking'],
      defaultIdle: 'standing',
      actionMappings: {
        'feed': 'sitting',
        'walk': 'walking',
        'play': 'running',
        'medical': 'dying',
      }
    },
    'siberian_husky': {
      availableAnimations: ['standing', 'walking', 'sitting', 'playing'],
      defaultIdle: 'standing',
      actionMappings: {
        'feed': 'sitting',
        'walk': 'walking',
        'play': 'playing',
        'medical': 'sitting',
      }
    },
    'mountain_dog': {
      availableAnimations: ['standing', 'walking', 'sitting', 'sleeping'],
      defaultIdle: 'standing',
      actionMappings: {
        'feed': 'sitting',
        'walk': 'walking',
        'play': 'walking',
        'medical': 'sleeping',
      },
    },
    'shiba_inu': {
      availableAnimations: ['standing', 'sitting', 'walking', 'sleeping'],
      defaultIdle: 'standing',
      actionMappings: {
        'feed': 'sitting',
        'walk': 'walking',
        'play': 'playing',
        'medical': 'sitting',
      }
    }
  };


  const defaultConfig: BreedAnimationConfig = {
    availableAnimations: ['idle', 'sitting'],
    defaultIdle: 'idle',
    actionMappings: {
      'feed': 'sitting',
      'walk': 'idle',
      'play': 'idle',
      'medical': 'idle',
    }
  };

  const BREED_ANIMATION_CONFIGS = {
    ...smallDogsConfig,
    ...largeDogsConfig,
    'default': defaultConfig
  };

  const detectFrameCount = async (animationName: string): Promise<number> => {
    const formattedBreed = breed.toLowerCase().replace(/\s+/g, '_');
    const basePath = `/sprites/${formattedBreed}/${color.toLowerCase()}`;
    const animationNameCap = animationName.charAt(0).toUpperCase() + animationName.slice(1);
    
    let frameCount = 0;
    let consecutiveFailures = 0;
    const maxConsecutiveFailures = 2; // Stop after 2 consecutive failures
    
    
    // Check up to 20 frames but stop early if we hit consecutive failures
    for (let i = 1; i <= 20; i++) {
      try {
        const imagePath = `${basePath}/${animationName}/${animationNameCap}${i}.png`;
        
        // Create a new image element to test if it loads
        const img = new Image();
        const imageExists = await new Promise<boolean>((resolve) => {
          img.onload = () => resolve(true);
          img.onerror = () => resolve(false);
          img.src = imagePath;
          
          // Add timeout to prevent hanging
          setTimeout(() => resolve(false), 1000);
        });
        
        if (imageExists) {
          frameCount = i;
          consecutiveFailures = 0; // Reset failure counter
        } else {
          consecutiveFailures++;
          
          // Stop if we've had too many consecutive failures
          if (consecutiveFailures >= maxConsecutiveFailures) {
            break;
          }
        }
      } catch (error) {
        consecutiveFailures++;
        
        if (consecutiveFailures >= maxConsecutiveFailures) {
          break;
        }
      }
    }
    
    // Fallback to default if no frames detected or if detected count seems wrong
    const fallbackCount = animations[animationName as keyof typeof animations]?.frames || 1;
    const finalCount = frameCount > 0 ? frameCount : fallbackCount;
    
    // Sanity check - if detected count is way higher than expected, use fallback
    if (frameCount > 20) {
      console.warn(`Detected frame count (${frameCount}) seems too high, using fallback (${fallbackCount})`);
      return fallbackCount;
    }
    
    return finalCount;
  };


  const getBreedConfig = (breedName: string): BreedAnimationConfig => {
    const formattedBreed = breedName.toLowerCase().replace(/\s+/g, '_');
    return (BREED_ANIMATION_CONFIGS as Record<string, BreedAnimationConfig>)[formattedBreed] || BREED_ANIMATION_CONFIGS['default'];
  };
  
  const mapActionToAnimation = (action: string): keyof typeof animations => {
    const breedConfig = getBreedConfig(breed);
    
    // Handle idle case
    if (action === 'idle') {
      return breedConfig.defaultIdle;
    }
    
    // Get the mapped animation for this action
    const mappedAnimation = breedConfig.actionMappings[action];
    
    // Check if the breed actually has this animation available
    if (mappedAnimation && breedConfig.availableAnimations.includes(mappedAnimation)) {
      return mappedAnimation;
    }
    
    // Fallback to default idle if the animation isn't available
    console.warn(`Animation '${mappedAnimation}' not available for breed '${breed}', falling back to '${breedConfig.defaultIdle}'`);
    return breedConfig.defaultIdle;
  };

  const mappedAnimation = mapActionToAnimation(animation);

  const getCurrentAnimation = () => {
    const baseConfig = animations[mappedAnimation];
    const breedConfig = getBreedConfig(breed);
    const customFrameCount = breedConfig.customFrameCounts?.[mappedAnimation];
    
    // Priority: detected frames > custom config > base config
    const frameCount = detectedFrameCount || customFrameCount || baseConfig.frames;
    
    return {
      ...baseConfig,
      frames: frameCount
    };
  };

  const currentAnimation = getCurrentAnimation();

  useEffect(() => {
    const detectAndSetFrames = async () => {
      const frameCount = await detectFrameCount(mappedAnimation);
      setDetectedFrameCount(frameCount);
    };

    detectAndSetFrames();
  }, [mappedAnimation, breed, color]);

  useEffect(() => {
    if (animation === 'idle') {
      setIsAnimating(true);
    } else {
      // Start action animation
      setIsAnimating(true);
      setCurrentFrame(0);
    }
  }, [animation]);

  useEffect(() => {
    if (!isAnimating) return;

    const interval = setInterval(() => {
      setCurrentFrame((prev) => {
        const nextFrame = prev + 1;
        
        if (nextFrame >= currentAnimation.frames) {
          if (currentAnimation.loop) {
            return 0; // Loop back to start
          } else {
            // Animation finished
            setIsAnimating(false);
            // Use setTimeout to avoid the React error
            setTimeout(() => {
              onAnimationComplete?.();
            }, 0);
            return 0; // Reset to idle
          }
        }
        
        return nextFrame;
      });
    }, currentAnimation.duration / currentAnimation.frames);

    return () => clearInterval(interval);
  }, [isAnimating, currentAnimation, onAnimationComplete]);

  // Get the sprite image path
  const getSpritePath = () => {
    const formattedBreed = breed.toLowerCase().replace(/\s+/g, '_');
    const basePath = `/sprites/${formattedBreed}/${color.toLowerCase()}`;
    
    const animationName = mappedAnimation.charAt(0).toUpperCase() + mappedAnimation.slice(1);
    const path = `${basePath}/${mappedAnimation}/${animationName}${currentFrame + 1}.png`;
    
    return path;
  };

  return (
    <Box
      style={{
        width: size,
        height: size,
        backgroundImage: `url(${getSpritePath()})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        imageRendering: 'pixelated', // Keep sprites crisp
      }}
    />
  );
};

export default AnimalSprite;