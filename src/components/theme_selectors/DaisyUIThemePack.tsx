import React, { useState } from 'react';
import { saveAs } from 'file-saver';
import { oklch, rgb } from 'culori';
import ThemePreview from './react-native-elements/buttons-preview';
import lightThemes from "./../../assets/themes/website-light-theme.json"
import darkThemes from "./../../assets/themes/website-dark-theme.json"
import { HexColorPicker } from 'react-colorful';

type FormatA = {
  // Light                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          mode colors
  lightColors: {
    primary: string;// Primary purple
    secondary: string; // Teal accent
    background: string;// White background
    // surface: '#F5F5F5',         // Light gray surface
    error: string;// Error red
    // text: string;            // Primary text
    disabled: string; // Disabled state
    //  placeholder: string;     // Placeholder text
    divider: string; // Divider
    success: string;// Success green
    warning: string;// Warning amber
    //  info: string;           // Info blue
  },

  // Dark mode colors
  darkColors: {
    primary: string;// Purple variant
    secondary: string; // Teal accent
    background: string; // Dark background
    // surface: string;         // Surface
    error: string;// Error color
    //  text: string;           // Primary text
    disabled: string; // Disabled state
    //  placeholder: string;     // Placeholder text
    divider: string; // Divider
    success: string; // Success green
    warning: string; // Warning amber
  },

  // Component specific styling
  components: any
}

type FormatB = {
  // Light mode colors
  lightColors: {
    primary: string;// Primary purple
    secondary: string; // Teal accent
    background: string;// White background
    // surface: '#F5F5F5',         // Light gray surface
    error: string;// Error red
    // text: string;            // Primary text
    disabled: string; // Disabled state
    //  placeholder: string;     // Placeholder text
    divider: string; // Divider
    success: string;// Success green
    warning: string;// Warning amber
    //  info: string;           // Info blue
  },

  // Dark mode colors
  darkColors: {
    primary: string;// Purple variant
    secondary: string; // Teal accent
    background: string; // Dark background
    // surface: string;         // Surface
    error: string;// Error color
    //  text: string;           // Primary text
    disabled: string; // Disabled state
    //  placeholder: string;     // Placeholder text
    divider: string; // Divider
    success: string; // Success green
    warning: string; // Warning amber
  },
  lightComponents: Record<string, string>;
  darkComponents: Record<string, string>;
};

type ThemeJson = {
  name: string;
  content: string;
};

export function parseCssVariables(content: string): Record<string, string> {
  const regex = /--color-([\w-]+):\s*([^;]+);/g;
  const result: Record<string, string> = {};
  let match;
  while ((match = regex.exec(content))) {
    result[match[1]] = match[2].trim();
  }
  return result;
}

export function convertToFormatB(themes: ThemeJson[]): FormatB | null {
  const currentTheme = themes.find((t) => t.name === 'current');
  if (!currentTheme || !currentTheme.content) return null;

  const themeToApply = themes.find((t) => t.name !== 'current' && currentTheme.content.includes(t.name));
  if (!themeToApply) return null;

  const vars = parseCssVariables(themeToApply.content);

  const lightColors = {
    primary: vars['primary'] || '',
    secondary: vars['secondary'] || '',
    background: vars['base-100'] || '',
    error: vars['error'] || '',
    disabled: vars['neutral'] || '',
    divider: vars['base-300'] || '',
    success: vars['success'] || '',
    warning: vars['warning'] || '',
  };

  const darkColors = {
    primary: vars['primary'] || '',
    secondary: vars['secondary'] || '',
    background: vars['base-200'] || '',
    error: vars['error'] || '',
    disabled: vars['neutral'] || '',
    divider: vars['base-300'] || '',
    success: vars['success'] || '',
    warning: vars['warning'] || '',
  };

  const lightComponents = {
    primary: vars['primary'] || '',
    'primary-content': vars['primary-content'] || '',
    secondary: vars['secondary'] || '',
    'secondary-content': vars['secondary-content'] || '',
    accent: vars['accent'] || '',
    'accent-content': vars['accent-content'] || '',
    neutral: vars['neutral'] || '',
    'neutral-content': vars['neutral-content'] || '',
  };

  const darkComponents = {
    ...lightComponents,
  };

  return {
    lightColors,
    darkColors,
    lightComponents,
    darkComponents,
  };
}
// Convert oklch to hex
const convertToHex = (oklch: string) => {
  try {
    return oklchToHex(oklch);
  } catch (error) {
    console.error("Invalid oklch color value:", oklch);
    return "#FFFFFF"; // Default to white if conversion fails
  }
}

// Converts OKLCH to hex
function oklchToHex(oklchStr: string): string {
  try {
    // Parse the OKLCH string
    // Example format: "oklch(45.201% 0.313 264.052)"
    const matches = oklchStr.match(/oklch\((\d+\.?\d*)%\s+(\d+\.?\d*)\s+(\d+\.?\d*)\)/);

    if (!matches) {
      throw new Error('Invalid OKLCH string format');
    }

    // Extract the values
    const l = parseFloat(matches[1]) / 100; // Convert percentage to 0-1 range
    const c = parseFloat(matches[2]);
    const h = parseFloat(matches[3]);

    // Create OKLCH color object for culori
    const oklchColor = {
      mode: 'oklch' as const,
      l,
      c,
      h
    };

    // Convert OKLCH to RGB using culori
    const rgbColor = rgb(oklchColor);

    if (!rgbColor) {
      throw new Error('Invalid color conversion');
    }

    // Convert RGB values (0-1) to hex
    const r = Math.round(rgbColor.r * 255);
    const g = Math.round(rgbColor.g * 255);
    const b = Math.round(rgbColor.b * 255);

    // Format as hex
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  } catch (error) {
    console.error('Color conversion error:', error);
    return '#7F7FFF'; // Fallback color
  }
}

function parseDaisyThemeToRN(css: string, dark: string) {
  //  TODO: ADD THEMES FOR LIGHT AND DARK FROM DAISY-UI 
  const colors: Record<string, string> = {};
  const darkColors: Record<string, string> = {};

  const regex = /--color-(.*?):\s*(oklch\(.*?\));/g;
  let match;

  while ((match = regex.exec(css)) !== null) {
    const [_, key, value] = match;
    // Convert oklch to hex
    colors[key] = convertToHex(value);
  }

  while ((match = regex.exec(dark)) !== null) {
    const [_, key, value] = match;
    // Convert oklch to hex
    darkColors[key] = convertToHex(value);
  }

  return {
    lightColors: {
      primary: colors["primary"] || "#6200EE",
      secondary: colors["secondary"] || "#03DAC6",
      background: colors["base-100"] || "#FFFFFF",
      error: colors["error"] || "#B00020",
      disabled: "#9E9E9E",
      divider: "#EEEEEE",
      success: colors["success"] || "#4CAF50",
      warning: colors["warning"] || "#FFC107",
    },
    darkColors: {
      primary: darkColors["primary"] || "#BB86FC",
      secondary: darkColors["secondary"] || "#03DAC6",
      background: darkColors["base-100"] || "#121212",
      error: darkColors["error"] || "#CF6679",
      disabled: "#757575",
      divider: "#2D2D2D",
      success: darkColors["success"] || "#81C784",
      warning: darkColors["warning"] || "#FFD54F",
    },
    components: {
      Button: {
        raised: true,
        buttonStyle: {
          backgroundColor: darkColors["primary"] || "#6200EE",
          height: 50,
          width: "100%",
          borderRadius: 8,
          paddingHorizontal: 16,
        },
        disabledStyle: {
          backgroundColor: "#E0E0E0",
        },
        disabledTitleStyle: {
          color: "#9E9E9E",
        },
        titleStyle: {
          fontSize: 16,
          fontWeight: "bold",
          letterSpacing: 0.5,
        },
        containerStyle: {
          marginVertical: 8,
        },
      },
      // Add more components as needed, following the same structure
      // Text styling
      Text: {
        style: {
          color: "#212121",
          fontSize: 16,
          fontWeight: "normal",
          lineHeight: 24,
        },
        h1Style: {
          fontSize: 32,
          fontWeight: "bold",
          marginBottom: 16,
        },
        h2Style: {
          fontSize: 24,
          fontWeight: "bold",
          marginBottom: 12,
        },
        h3Style: {
          fontSize: 20,
          fontWeight: "bold",
          marginBottom: 8,
        },
        h4Style: {
          fontSize: 18,
          fontWeight: "bold",
          marginBottom: 8,
        },
      },
      // Input styling
      Input: {
        containerStyle: {
          paddingHorizontal: 0,
          marginBottom: 16,
        },
        inputContainerStyle: {
          borderBottomWidth: 1,
          borderColor: "#E0E0E0",
        },
        inputStyle: {
          fontSize: 16,
          color: "#212121",
          minHeight: 48,
        },
        labelStyle: {
          fontSize: 14,
          color: "#757575",
          marginBottom: 4,
        },
        errorStyle: {
          fontSize: 12,
          color: "#B00020",
          marginTop: 4,
        },
      },
      // Card styling
      Card: {
        containerStyle: {
          borderRadius: 8,
          padding: 16,
          margin: 8,
          borderWidth: 0,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 2,
        },
      },
      // Avatar styling
      Avatar: {
        containerStyle: {
          backgroundColor: "#E0E0E0",
        },
        titleStyle: {
          color: "#212121",
        },
        overlayContainerStyle: {
          backgroundColor: "transparent",
        },
      },
      // Icon styling
      Icon: {
        size: 24,
        color: "#6200EE",
      },
      // ListItem styling
      ListItem: {
        containerStyle: {
          borderBottomWidth: 1,
          borderBottomColor: "#E0E0E0",
          paddingVertical: 12,
        },
      },
      // CheckBox styling
      CheckBox: {
        containerStyle: {
          backgroundColor: "transparent",
          borderWidth: 0,
          padding: 0,
          marginLeft: 0,
          marginRight: 0,
        },
        textStyle: {
          fontSize: 16,
          fontWeight: "normal",
        },
        checkedColor: "#6200EE",
        uncheckedColor: "#757575",
      },
      // Badge styling
      Badge: {
        badgeStyle: {
          borderRadius: 12,
          height: 24,
          minWidth: 24,
          paddingHorizontal: 8,
        },
        textStyle: {
          fontSize: 12,
          fontWeight: "bold",
        },
      },
      // Overlay styling
      Overlay: {
        overlayStyle: {
          borderRadius: 8,
          padding: 24,
          backgroundColor: "#FFFFFF",
        },
      },
      // SearchBar styling
      SearchBar: {
        containerStyle: {
          backgroundColor: "transparent",
          borderBottomWidth: 0,
          borderTopWidth: 0,
          paddingHorizontal: 0,
        },
        inputContainerStyle: {
          backgroundColor: "#F5F5F5",
          borderRadius: 8,
          height: 48,
        },
        inputStyle: {
          fontSize: 16,
          color: "#212121",
        },
        searchIcon: {
          size: 24,
          color: "#757575",
        },
        clearIcon: {
          size: 24,
          color: "#757575",
        },
      },
      // Bottom Sheet styling
      BottomSheet: {
        containerStyle: {
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
        },
      },
      // Divider styling
      Divider: {
        style: {
          backgroundColor: "#E0E0E0",
          height: 1,
          marginVertical: 8,
        },
      },
      // Tab styling
      Tab: {
        indicatorStyle: {
          backgroundColor: "red",
          height: 3,
        },
        containerStyle: {
          backgroundColor: "#FFFFFF",
        },
      },
    },
  };
}

// Initial DaisyUI theme color keys
const initialColors = {
  'base-100': '#1F2937',
  'base-200': '#111827',
  'base-300': '#0F1729',
  'base-content': '#D1D5DB',
  'primary': '#34D399',
  'primary-content': '#000000',
  'secondary': '#6366F1',
  'secondary-content': '#000000',
  'accent': '#8B5CF6',
  'accent-content': '#000000',
  'neutral': '#2A323C',
  'neutral-content': '#A6ADBB',
  'info': '#3ABFF8',
  'info-content': '#000000',
  'success': '#36D399',
  'success-content': '#000000',
  'warning': '#FBBD23',
  'warning-content': '#000000',
  'error': '#F87272',
  'error-content': '#000000'
};


// Converts hex to OKLCH
function hexToOklch(hex: string): string {
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

function convertFormatAToB(formatA: FormatA): FormatB {

  const flatten = (obj: any, parentKey = ""): Record<string, string> => {
    let flat: Record<string, string> = {};
    for (const [key, value] of Object.entries(obj)) {
      const newKey = parentKey ? `${parentKey}_${key}` : key;
      if (typeof value === "object" && value !== null) {
        flat = { ...flat, ...flatten(value, newKey) };
      } else if (typeof value === "string" && value.startsWith("#")) {
        flat[newKey] = value;
      }
    }
    return flat;
  };

  return {
    lightColors: formatA.lightColors,
    darkColors: formatA.darkColors,
    lightComponents: flatten(formatA.components || {}),
    darkComponents: flatten(formatA.components || {}), // Can be changed if A includes dark-specific component styles
  };
}

const DaisyUIThemePack: React.FC = () => {
  const [colors, setColors] = useState(initialColors);
  const [convertedTheme, setConvertedTheme] = useState<Record<string, string>>({});


  const initialColored = parseDaisyThemeToRN(lightThemes[0].content, darkThemes[0].content);
  const [displayColors, setDisplayColors] = useState(() => convertFormatAToB(initialColored));

  const handleInputChange = (field: string, value: string) => {
    setColors({ ...colors, [field]: value });
    setDisplayColors({...displayColors, [field]: value});
  };

  const handleConvert = () => {
    const convertedColors: Record<string, string> = {};

    Object.entries(colors).forEach(([key, hexColor]) => {
      convertedColors[`--color-${key}`] = hexToOklch(hexColor);
    });

    setConvertedTheme(convertedColors);
  };

  const handleDownload = () => {
    const jsonData = JSON.stringify(convertedTheme, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    saveAs(blob, 'daisyui-theme.json');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">DaisyUI Theme Converter</h1>

      <div>
        <ThemePreview formColors={displayColors} />
      </div>
      <div>
        <div className='flex flex-col h-full'>
          <h2 className="text-xl font-semibold mb-4">Input Hex Colors</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(colors).map(([key, value]) => (
              <div key={key} className="form-control">

                <label className="label">
                  <span className="label-text capitalize">{key}</span>
                </label>

                <HexColorPicker color={value} onChange={(result) => handleInputChange(
                  key, result
                )} />

                <input
                  type="text"
                  value={value}
                  onChange={(e) => handleInputChange(key, e.target.value)}
                  className="border p-2 rounded w-full"
                  placeholder="Enter hex color"
                />
                <div
                  className="w-10 h-10 rounded border"
                  style={{ backgroundColor: value }}
                ></div>
              </div>
            ))}
          </div>

          <button
            onClick={handleConvert}
            className="mt-6 bg-primary text-primary-content px-4 py-2 rounded self-start"
          >
            Convert to OKLCH
          </button>
        </div>

        <div className='flex flex-col h-full'>
          {Object.keys(convertedTheme).length > 0 ? (
            <>
              <h2 className="text-xl font-semibold mb-4">Converted Theme</h2>
              <div className="flex-grow overflow-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border p-2 text-left">Color Key</th>
                      <th className="border p-2 text-left">OKLCH Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(convertedTheme).map(([key, value]) => (
                      <tr key={key}>
                        <td className="border p-2">{key}</td>
                        <td className="border p-2">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button
                onClick={handleDownload}
                className="mt-6 bg-success text-success-content px-4 py-2 rounded self-start"
              >
                Download Theme JSON
              </button>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Converted theme will appear here
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DaisyUIThemePack;