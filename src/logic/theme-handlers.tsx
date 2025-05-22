import { oklch } from 'culori';
import lightModeThemes from "../assets/themes/light-mode-themes.json";
import darkModeThemes from "../assets/themes/dark-mode-themes.json";

interface ThemeColors {
    primary: string;
    secondary: string;
    background: string;
    error: string;
    disabled: string;
    divider: string;
    success: string;
    warning: string;
}

interface ThemeProperties {
    name: string;
    prefersDark: boolean;
    colorScheme: string;
}


export type FormatA = {
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

export type ComponentType = {
        Button: {
            buttonStyle: {
                backgroundColor: string,
            },
            disabledStyle: {
                backgroundColor: string,
            },
            disabledTitleStyle: {
                color: string,
            },
        },
        // Add more components as needed, following the same structure
        // Text styling
        Text: {
            style: {
                color: string,
                
            }
        },
        // Input styling
        Input: {
            
            inputContainerStyle: {
                borderColor: string,
            },
            inputStyle: {
                color: string,
            },
            labelStyle: {
                color: string,
            },
            errorStyle: {
                color: string,
            },
        },
        // Card styling
        Card: {
            containerStyle: {
                shadowColor: string,
            },
        },
        // Avatar styling
        Avatar: {
            containerStyle: {
                backgroundColor: string,
            },
            titleStyle: {
                color: string,
            },
            overlayContainerStyle: {
                backgroundColor: string,
            },
        },
        // Icon styling
        Icon: {
            color: string,
        },
        // ListItem styling
        ListItem: {
            containerStyle: {
                borderBottomColor: string,
            },
        },
        // CheckBox styling
        CheckBox: {
            containerStyle: {
                backgroundColor: string,
            },
            checkedColor: string,
            uncheckedColor: string,
        },
       
        // Overlay styling
        Overlay: {
            overlayStyle: {
                backgroundColor: string,
            },
        },
        // SearchBar styling
        SearchBar: {
            containerStyle: {
                backgroundColor: string,
            },
            inputContainerStyle: {
                backgroundColor: string,
            },
            inputStyle: {
                color: string,
            },
            searchIcon: {
               color: string,
            },
            clearIcon: {
                color: string,
            },
        },
        // Divider styling
        Divider: {
            style: {
                backgroundColor: string,
            },
        },
        // Tab styling
        Tab: {
            indicatorStyle: {
                backgroundColor: string,
            },
            containerStyle: {
                backgroundColor: string,
            },
        },
    
};

export function hexToOklch(hexStr: string): string {
    try {
        // Validate and normalize the hex string
        if (!hexStr.startsWith('#')) {
            hexStr = '#' + hexStr;
        }
        hexStr = hexStr.replace("-", "")
        // Check if it's a valid hex color
        if (!/^#([0-9A-F]{3}){1,2}$/i.test(hexStr)) {
            console.log(hexStr)
            throw new Error('Invalid hex color format');
        }

        // Convert short hex (#RGB) to long form (#RRGGBB) if needed
        if (hexStr.length === 4) {
            hexStr = '#' + hexStr[1] + hexStr[1] + hexStr[2] + hexStr[2] + hexStr[3] + hexStr[3];
        }

        // Parse hex values to RGB
        const r = parseInt(hexStr.slice(1, 3), 16) / 255;
        const g = parseInt(hexStr.slice(3, 5), 16) / 255;
        const b = parseInt(hexStr.slice(5, 7), 16) / 255;

        // Create RGB color object for culori
        const rgbColor = {
            mode: 'rgb' as const,
            r,
            g,
            b
        };

        // Convert RGB to OKLCH using culori
        const oklchColor = oklch(rgbColor);

        if (!oklchColor) {
            throw new Error('Invalid color conversion');
        }

        // Format as OKLCH string
        // Convert l to percentage (0-100%)
        const lPercent = (oklchColor.l * 100).toFixed(3);
        const c = oklchColor.c.toFixed(3);
        const h = oklchColor.h?.toFixed(3);

        return `oklch(${lPercent}% ${c} ${h})`;
    } catch (error) {
        console.error('Color conversion error:', error);
        return 'oklch(45.201% 0.313 264.052)'; // Fallback color (purple-ish)
    }
}


export function saveThemesToJson(selectedTheme: FormatA, light : string, dark: string) {
    
    const parseJsonToTheme = (selectedTheme: FormatA) => {

        const lightThemeName = light;
        const darkThemeName = dark;
        const colors: ThemeColors = selectedTheme.lightColors;
        const darkColors: ThemeColors = selectedTheme.darkColors;

        const resultLightTheme = {
            name : "current",
            content : jsonToCssFormat(colors, {
                name : lightThemeName,
                prefersDark : false,
                colorScheme : "light"
            })
        };

        const resultDarkTheme = {
            name : "current",
            content : jsonToCssFormat(darkColors, {
                name : darkThemeName,
                prefersDark : true,
                colorScheme: "dark"
            })
        };

        return {
            lightTheme : resultLightTheme,
            darkTheme : resultDarkTheme
        };

    };

    const applicationTheme =  parseJsonToTheme(selectedTheme);

    //  SAVE IN LIGHT MODES 
    //lightModeThemes.push(applicationTheme.lightTheme);
    lightModeThemes[0].content = applicationTheme.lightTheme.content;
    //  SAVE IN DARK MODES 
    //darkModeThemes.push(applicationTheme.darkTheme);
    darkModeThemes[0].content = applicationTheme.darkTheme.content;

    return {
        light : lightModeThemes,
        dark : darkModeThemes
    };
};

function jsonToCssFormat(colors: ThemeColors, themeProps: ThemeProperties): string {
    try {
        // Convert each hex color to OKLCH using the hexToOklch function
        const cssProperties = {
            "--color-base-100": hexToOklch(colors.background),
            "--color-base-200": hexToOklch(adjustBrightness(colors.background, -3)),
            "--color-base-300": hexToOklch(adjustBrightness(colors.background, -7)),
            "--color-base-content": hexToOklch(adjustBrightness(colors.divider, -30)),
            "--color-primary": hexToOklch(colors.primary),
            "--color-primary-content": hexToOklch(adjustBrightness(colors.primary, -40)),
            "--color-secondary": hexToOklch(colors.secondary),
            "--color-secondary-content": hexToOklch(adjustBrightness(colors.secondary, -40)),
            "--color-accent": hexToOklch(adjustBrightness(colors.primary, 10, 20)),
            "--color-accent-content": hexToOklch(adjustBrightness(colors.divider, -30)),
            "--color-neutral": hexToOklch(colors.divider),
            "--color-neutral-content": hexToOklch(adjustBrightness(colors.background, -5)),
            "--color-info": hexToOklch(adjustBrightness(colors.secondary, -20)),
            "--color-info-content": hexToOklch(colors.background),
            "--color-success": hexToOklch(colors.success),
            "--color-success-content": hexToOklch(colors.background),
            "--color-warning": hexToOklch(colors.warning),
            "--color-warning-content": hexToOklch(colors.background),
            "--color-error": hexToOklch(colors.error),
            "--color-error-content": hexToOklch(adjustBrightness(colors.error, -30)),
        };

        // Additional theme properties
        const additionalProps = {
            "--radius-selector": "0.25rem",
            "--radius-field": "0.25rem",
            "--radius-box": "0.5rem",
            "--size-selector": "0.25rem",
            "--size-field": "0.25rem",
            "--border": "1px",
            "--depth": "0",
            "--noise": "0",
        };

        // Combine all properties
        const allProperties = {
            ...cssProperties,
            ...additionalProps
        };

        // Build the CSS string format
        let cssFormat = `name: "${themeProps.name}"; prefersdark: ${themeProps.prefersDark}; color-scheme: "${themeProps.colorScheme}"; `;

        // Add all the properties
        for (const [key, value] of Object.entries(allProperties)) {
            cssFormat += `${key}: ${value}; `;
        }

        return cssFormat;
    } catch (error) {
        console.error('Conversion error:', error);
        return ''; // Return empty string on error
    }
}


// Helper function to adjust brightness of a hex color
function adjustBrightness(hex: string, brightnessDelta: number, saturationDelta: number = 0): string {
    // This is a simplified version - in a real implementation you might want to:
    // 1. Convert hex to HSL
    // 2. Adjust lightness
    // 3. Convert back to hex

    // For this example, we'll just darken by adding some black
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    const factor = 1 + brightnessDelta / 100;
    console.log(saturationDelta);

    // Clamp values between 0-255
    const newR = Math.min(255, Math.max(0, Math.round(r * factor)));
    const newG = Math.min(255, Math.max(0, Math.round(g * factor)));
    const newB = Math.min(255, Math.max(0, Math.round(b * factor)));

    // Convert back to hex
    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
}
