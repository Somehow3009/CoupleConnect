import { ThemePreset } from '@/types/theme';

export const themePresets: ThemePreset[] = [
  {
    id: 'couple',
    name: 'Couple',
    description: 'Romantic pink theme',
    accentColor: 'pink',
    bubbleStyle: 'rounded',
    icon: '💕',
  },
  {
    id: 'friend',
    name: 'Friend',
    description: 'Friendly blue theme',
    accentColor: 'blue',
    bubbleStyle: 'ios',
    icon: '👋',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean purple theme',
    accentColor: 'purple',
    bubbleStyle: 'minimal',
    icon: '✨',
  },
  {
    id: 'nature',
    name: 'Nature',
    description: 'Fresh green theme',
    accentColor: 'green',
    bubbleStyle: 'rounded',
    icon: '🌿',
  },
  {
    id: 'sunset',
    name: 'Sunset',
    description: 'Warm orange theme',
    accentColor: 'orange',
    bubbleStyle: 'ios',
    icon: '🌅',
  },
];
