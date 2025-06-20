import React, { useState, useEffect } from 'react';
import { Box } from '@mantine/core';
import { ANIMAL_BREEDS, type AnimationName } from '@/types/animal';
import { type ActionType } from '@/types/actions';

interface AnimalSpriteProps {
  breed: string;
  color: string;
  animation: ActionType;
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

  const [currentFrame, setCurrentFrame] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const getBreedData = () => {
    const formattedBreed = breed.toLowerCase().replace(/\s+/g, '_');
    return ANIMAL_BREEDS[formattedBreed] || null;
  };

  const breedData = getBreedData();

  const getAnimationName = (): AnimationName => {
    if (!breedData) {
      console.warn(`No breed data found for: ${breed}, using idle`);
      return 'idle';
    }

    const { actionMappings, defaultIdle } = breedData.animationData;
    
    if (animation === 'idle') {
      return defaultIdle;
    }

    const mappedAnimation = actionMappings[animation];
    if (mappedAnimation && breedData.animationData.animations[mappedAnimation]) {
      return mappedAnimation;
    }

    return defaultIdle;
  };

  const currentAnimationName = getAnimationName();

  const getAnimationConfig = () => {
    if (!breedData) {
      // Fallback configuration if no breed data
      return {
        duration: 800,
        loop: true,
        frames: ['idle/Idle1.png'] // Default fallback frame
      };
    }

    const animConfig = breedData.animationData.animations[currentAnimationName];
    if (!animConfig) {
      console.warn(`Animation config not found for '${currentAnimationName}' in breed '${breed}'`);
      // Try to find the default idle animation as fallback
      const fallbackAnim = breedData.animationData.animations[breedData.animationData.defaultIdle];
      if (fallbackAnim) {
        return fallbackAnim;
      }
      // Ultimate fallback if even default idle is missing
      return { duration: 800, loop: true, frames: ['idle/Idle1.png'] };
    }

    return animConfig;
  };

  const animationConfig = getAnimationConfig();

  // Reset animation when animation prop changes
  useEffect(() => {
    setIsAnimating(true);
    setCurrentFrame(0);
  }, [animation, breed, color]);

  // Handle animation frame progression
  useEffect(() => {
    if (!isAnimating || !animationConfig.frames.length) return;

    const frameInterval = animationConfig.duration / animationConfig.frames.length;
    
    const interval = setInterval(() => {
      setCurrentFrame((prevFrame) => {
        const nextFrame = prevFrame + 1;
        
        if (nextFrame >= animationConfig.frames.length) {
          if (animationConfig.loop) {
            return 0; // Loop back to start
          } else {
            // Animation finished
            setIsAnimating(false);
            // Use setTimeout to avoid React warning
            setTimeout(() => {
              onAnimationComplete?.();
            }, 0);
            return 0; // Reset to first frame
          }
        }
        
        return nextFrame;
      });
    }, frameInterval);

    return () => clearInterval(interval);
  }, [isAnimating, animationConfig, onAnimationComplete]);

  const getSpritePath = () => {
    if (!breedData || !animationConfig.frames.length) {
      return '/sprites/default/default.png'; // Fallback image
    }

    const formattedBreed = breed.toLowerCase().replace(/\s+/g, '_');
    const formattedColor = color.toLowerCase();
    const framePath = animationConfig.frames[currentFrame];
    
    return `/sprites/${formattedBreed}/${formattedColor}/${framePath}`;
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