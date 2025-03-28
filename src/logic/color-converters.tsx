import { oklch } from 'culori';

/**
 * Converts a hex color to OKLCH color space
 * @param hex Hex color code (e.g., '#RRGGBB')
 * @returns OKLCH color string suitable for DaisyUI theme
 */
export function hexToOklch(hex: string): string {
  try {
    // Remove # if present
    hex = hex.replace(/^#/, '');

    // Convert hex to RGB
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;

    // Convert RGB to OKLCH
    const oklchColor = oklch({
      mode: 'rgb',
      r,
      g,
      b
    });

    if (!oklchColor) {
      throw new Error('Invalid color conversion');
    }

    // Format OKLCH to match DaisyUI theme format
    return `oklch(${(oklchColor.l * 100).toFixed(3)}% ${oklchColor.c.toFixed(3)} ${oklchColor.h?.toFixed(3)})`;
  } catch (error) {
    console.error('Color conversion error:', error);
    return 'oklch(50% 0.1 270)'; // Fallback color
  }
}

/**
 * Creates a DaisyUI theme object from hex colors
 * @param themeColors Object of theme color keys and hex values
 * @returns Object with OKLCH color values
 */
export function createDaisyUITheme(themeColors: Record<string, string>) {
  const theme: Record<string, string> = {};
  
  const colorMappings: Record<string, string> = {
    'base-100': '--color-base-100',
    'base-200': '--color-base-200',
    'base-300': '--color-base-300',
    'base-content': '--color-base-content',
    'primary': '--color-primary',
    'primary-content': '--color-primary-content',
    'secondary': '--color-secondary',
    'secondary-content': '--color-secondary-content',
    'accent': '--color-accent',
    'accent-content': '--color-accent-content',
    'neutral': '--color-neutral',
    'neutral-content': '--color-neutral-content',
    'info': '--color-info',
    'info-content': '--color-info-content',
    'success': '--color-success',
    'success-content': '--color-success-content',
    'warning': '--color-warning',
    'warning-content': '--color-warning-content',
    'error': '--color-error',
    'error-content': '--color-error-content'
  };

  Object.entries(themeColors).forEach(([key, hexColor]) => {
    const themeKey = colorMappings[key];
    if (themeKey) {
      theme[themeKey] = hexToOklch(hexColor);
    }
  });

  return theme;
}

// Example usage
const forestThemeHex = {
  'base-100': '#1F2937',
  'base-200': '#111827',
  'base-300': '#0F1729',
  'base-content': '#D1D5DB',
  'primary': '#34D399',
  'secondary': '#6366F1',
  'accent': '#8B5CF6',
  // Add other color mappings as needed
};

const forestThemeOklch = createDaisyUITheme(forestThemeHex);
console.log(forestThemeOklch);