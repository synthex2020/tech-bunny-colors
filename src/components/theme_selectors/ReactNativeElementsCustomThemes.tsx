import React, { useState, useEffect } from "react";
import themes from "../../assets/themes/daisyThemes.json";
import { oklch, rgb } from 'culori';
import { HexColorPicker } from "react-colorful";
import { Button } from "../ui/button";
import ThemePreview from "./react-native-elements/buttons-preview";
// Add this import for color conversion

type FormatA = {
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

function convertFormatBToA(formatB: FormatB): FormatA {

    const unflatten = (flatObj: Record<string, string>): Record<string, any> => {
        const result: Record<string, any> = {};
        for (const [flatKey, value] of Object.entries(flatObj)) {
            const keys = flatKey.split("_");
            let current = result;

            keys.forEach((key, idx) => {
                if (idx === keys.length - 1) {
                    current[key] = value;
                } else {
                    current[key] = current[key] || {};
                    current = current[key];
                }
            });
        }
        return result;
    };

    return {
        lightColors: formatB.lightColors,
        darkColors: formatB.darkColors,
        components: unflatten(formatB.lightComponents),
    };
}


// Apply the selected theme CSS dynamically
function applyThemeCSS(css: string) {
    let styleTag = document.getElementById("dynamic-theme-style") as HTMLStyleElement;
    if (!styleTag) {
        styleTag = document.createElement("style");
        styleTag.id = "dynamic-theme-style";
        document.head.appendChild(styleTag);
    }
    styleTag.innerHTML = css;
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

// Parse the DaisyUI theme into React Native Elements colors
function parseDaisyThemeToRN(css: string) {
    const colors: Record<string, string> = {};
    const regex = /--color-(.*?):\s*(oklch\(.*?\));/g;
    let match;
    while ((match = regex.exec(css)) !== null) {
        const [_, key, value] = match;
        colors[key] = convertToHex(value); // Convert oklch to hex
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
            primary: colors["primary"] || "#BB86FC",
            secondary: colors["secondary"] || "#03DAC6",
            background: colors["base-100"] || "#121212",
            error: colors["error"] || "#CF6679",
            disabled: "#757575",
            divider: "#2D2D2D",
            success: colors["success"] || "#81C784",
            warning: colors["warning"] || "#FFD54F",
        },
        components: {
            Button: {
                raised: true,
                buttonStyle: {
                    backgroundColor: colors["primary"] || "#6200EE",
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


// Theme selection and preview component
export default function ReactNativeElementsCustom() {
    const initialColors = {
        lightColors: {
            primary: "#6200EE",
            secondary: "#03DAC6",
            background: "#FFFFFF",
            error: "#B00020",
            disabled: "#9E9E9E",
            divider: "#EEEEEE",
            success: "#4CAF50",
            warning: "#FFC107",
        },
        darkColors: {
            primary: "#BB86FC",
            secondary: "#03DAC6",
            background: "#121212",
            error: "#CF6679",
            disabled: "#757575",
            divider: "#2D2D2D",
            success: "#81C784",
            warning: "#FFD54F",
        },
        lightComponents: {
            buttonStyle_backgroundColor: "#6200EE",
            disabledStyle_backgroundColor: "#E0E0E0",
            disabledTitleStyle_color: "#9E9E9E",
            textStyle_color: "#212121",
            input_inputContainerStyle_borderColor: "#E0E0E0",
            inputStyle_color: "#212121",
            labelStyle_color: "#757575",
            errorStyle_color: "#B00020",
            card_containerStyle_shadowColor: "#000",
            avatar_containerStyle_backgroundColor: "#E0E0E0",
            avatar_titleStyle_color: "#212121",
            avatar_overlayContainerStyle_backgroundColor: "transparent",
            icon_color: "#6200EE",
            listItem_containerStyle_borderBottomColor: "#E0E0E0",
            checkBox_containerStyle_backgroundColor: "transparent",
            checkBox_checkedColor: "#6200EE",
            checkBox_uncheckedColor: "#757575",
            overlay_overlayStyle_backgroundColor: "#FFFFFF",
        },
        darkComponents: {
            buttonStyle_backgroundColor: "#6200EE",
            disabledStyle_backgroundColor: "#E0E0E0",
            disabledTitleStyle_color: "#9E9E9E",
            textStyle_color: "#212121",
            input_inputContainerStyle_borderColor: "#E0E0E0",
            inputStyle_color: "#212121",
            labelStyle_color: "#757575",
            errorStyle_color: "#B00020",
            card_containerStyle_shadowColor: "#000",
            avatar_containerStyle_backgroundColor: "#E0E0E0",
            avatar_titleStyle_color: "#212121",
            avatar_overlayContainerStyle_backgroundColor: "transparent",
            icon_color: "#6200EE",
            listItem_containerStyle_borderBottomColor: "#E0E0E0",
            checkBox_containerStyle_backgroundColor: "transparent",
            checkBox_checkedColor: "#6200EE",
            checkBox_uncheckedColor: "#757575",
            overlay_overlayStyle_backgroundColor: "#FFFFFF",
        }
    };

    const [selectedTheme, setSelectedTheme] = useState(themes[0]);
    const [formColors, setFormColors] = useState(initialColors);
    const [parsedTheme, setParsedTheme] = useState(() => parseDaisyThemeToRN(themes[0].content));

    useEffect(() => {
        if (themes.length > 0) {
            applyThemeCSS(selectedTheme.content);
            setParsedTheme(parseDaisyThemeToRN(selectedTheme.content));
        }
    }, [selectedTheme]);


    // Function to download the JSON file
    const downloadJSON = () => {
        const blob = new Blob([JSON.stringify(parsedTheme, null, 2)], { type: "application/json" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${selectedTheme.name}_theme.json`;
        link.click();
    };

    const handleChange = (mode: "lightColors" | "darkColors" | "lightComponents" | "darkComponents", key: string, value: string) => {

        setFormColors((prev) => ({
            ...prev,
            [mode]: {
                ...prev[mode],
                [key]: value,
            },
        }));
    };

    const handleSubmit = (event : React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        setParsedTheme(convertFormatBToA(formColors));

    };

    return (
        <div className="p-4 space-y-6 bg-base-100 min-h-screen">
            <h1 className="text-2xl font-bold">React Native Elements Theme Generator</h1>

            {/* Theme selection */}
            <div className="form-control w-full max-w-xs">
                <label className="label">
                    <span className="label-text">Select DaisyUI Theme</span>
                </label>
                <select
                    className="select select-bordered"
                    value={selectedTheme.name}
                    onChange={(e) => {
                        const theme = themes.find((t) => t.name === e.target.value);
                        if (theme) setSelectedTheme(theme);
                    }}
                >
                    {themes.map((theme) => (
                        <option key={theme.name} value={theme.name}>
                            {theme.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Theme preview */}
            <ThemePreview formColors={formColors} />

            {/** THE FORM  */}
            <div className="p-4 space-y-8">
                <form>
                    {(["lightColors", "darkColors", "lightComponents", "darkComponents"] as const).map((mode) => (
                        <div>
                            <div key={mode} className="bg-base-200 p-4 rounded-box shadow pb-6">
                                <h2 className="text-xl font-bold mb-4 capitalize">{mode.replace("Colors", " Mode").replace("Components", " mode Components")}</h2>

                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {Object.entries(formColors[mode]).map(([key, value]) => (
                                        <div key={key} className="form-control">
                                            <label className="label">
                                                <span className="label-text capitalize">{key}</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={value}
                                                onChange={(e) => handleChange(mode, key, e.target.value)}
                                                className="input input-bordered"
                                            />
                                            <HexColorPicker color={value} onChange={(result) => handleChange(mode, key, result)} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <br />
                        </div>
                    ))}

                    <button className="btn btn-primary " onClick={(event) => handleSubmit(event)}
                    >Submit
                    </button>
                </form>
            </div>
            {/* Display and copy JSON */}
            <div>
                <h2 className="text-xl font-semibold mb-2">React Native Elements Theme (JSON)</h2>
                <pre className="bg-base-300 text-sm p-4 rounded overflow-x-auto">
                    {JSON.stringify(parsedTheme, null, 2)}
                </pre>

                <button
                    className="btn btn-outline"
                    onClick={() => {
                        navigator.clipboard.writeText(JSON.stringify(parsedTheme, null, 2));
                    }}
                >
                    Copy to Clipboard
                </button>
                <button
                    className="btn btn-outline"
                    onClick={downloadJSON}
                >
                    Download JSON
                </button>

            </div>
        </div>
    );
}
