import React, { useState, useEffect } from "react";
import lightThemes from "../../assets/themes/light-mode-themes.json";
import darkThemes from "../../assets/themes/dark-mode-themes.json"
import { rgb } from 'culori';
import { HexColorPicker } from "react-colorful";
import ThemePreview from "./react-native-elements/buttons-preview";
import { saveThemesToJson } from "../../logic/theme-handlers";
// Add this import for color conversion 
// business and fantasy 

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
        components: parseReturnJson(unflatten(formatB.lightComponents)),
    };
}

function parseReturnJson(formatB: any) {
    return {
        Button: {
            raised: true,
            buttonStyle: {
                backgroundColor: formatB.Button.buttonStyle.backgroundColor || "#6200EE",
                height: 50,
                width: "100%",
                borderRadius: 8,
                paddingHorizontal: 16,
            },
            disabledStyle: {
                backgroundColor: formatB.Button.disabledStyle.backgroundColor || "#E0E0E0",
            },
            disabledTitleStyle: {
                color: formatB.Button.disabledTitleStyle.color || "#9E9E9E",
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
                color: formatB.Text.style.color || "#212121",
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
                borderColor: formatB.Input.inputContainerStyle.borderColor || "#E0E0E0",
            },
            inputStyle: {
                fontSize: 16,
                color: formatB.Input.inputStyle.color || "#212121",
                minHeight: 48,
            },
            labelStyle: {
                fontSize: 14,
                color: formatB.Input.labelStyle.color || "#757575",
                marginBottom: 4,
            },
            errorStyle: {
                fontSize: 12,
                color: formatB.Input.errorStyle.color || "#B00020",
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
                shadowColor: formatB.Card.containerStyle.shadowColor || "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
            },
        },
        // Avatar styling
        Avatar: {
            containerStyle: {
                backgroundColor: formatB.Avatar.containerStyle.backgroundColor || "#E0E0E0",
            },
            titleStyle: {
                color: formatB.Avatar.titleStyle.color || "#212121",
            },
            overlayContainerStyle: {
                backgroundColor: "transparent",
            },
        },
        // Icon styling
        Icon: {
            size: 24,
            color: formatB.Icon.color || "#6200EE",
        },
        // ListItem styling
        ListItem: {
            containerStyle: {
                borderBottomWidth: 1,
                borderBottomColor: formatB.ListItem.containerStyle.borderBottomColor || "#E0E0E0",
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
            checkedColor: formatB.CheckBox.checkedColor || "#6200EE",
            uncheckedColor: formatB.CheckBox.uncheckedColor || "#757575",
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
                backgroundColor: formatB.Overlay.overlayStyle.backgroundColor || "#FFFFFF",
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
                backgroundColor: formatB.SearchBar.inputContainerStyle.backgroundColor || "#F5F5F5",
                borderRadius: 8,
                height: 48,
            },
            inputStyle: {
                fontSize: 16,
                color: formatB.SearchBar.inputStyle || "#212121",
            },
            searchIcon: {
                size: 24,
                color: formatB.SearchBar.searchIcon.color || "#757575",
            },
            clearIcon: {
                size: 24,
                color: formatB.SearchBar.clearIcon.color || "#757575",
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
                backgroundColor: formatB.Divider.style.backgroundColor || "#E0E0E0",
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
                backgroundColor: formatB.Tab.containerStyle.backgroundColor || "#FFFFFF",
            },
        },
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


// Theme selection and preview component
export default function ReactNativeElementsCustom() {
    const initialColors = parseDaisyThemeToRN(lightThemes[0].content, darkThemes[0].content);

    const [cssResultant, setCssResultant] = useState(() => saveThemesToJson(convertFormatBToA(convertFormatAToB(initialColors)), lightThemes[0].name, darkThemes[0].name));
    const [selectedTheme, setSelectedTheme] = useState(lightThemes[0]);
    const [selectedDarkTheme, setSelectedDarkTheme] = useState(darkThemes[0]);
    const [formColors, setFormColors] = useState(() => convertFormatAToB(initialColors));
    const [parsedTheme, setParsedTheme] = useState(() => parseDaisyThemeToRN(lightThemes[0].content, darkThemes[0].content));

    useEffect(() => {
        if (lightThemes.length > 0) {
            applyThemeCSS(selectedTheme.content);
            setParsedTheme(parseDaisyThemeToRN(selectedTheme.content, selectedDarkTheme.content));
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
        console.log(mode);
        setFormColors((prev) => ({
            ...prev,
            [mode]: {
                ...prev[mode],
                [key]: value,
            },
        }));
    };

    

    const handleSubmit = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        setParsedTheme(convertFormatBToA(formColors));

    };

    const handleJsonSave = () => {

        const cssResult = saveThemesToJson(convertFormatBToA(formColors), selectedTheme.name, selectedDarkTheme.name)
        setCssResultant(cssResult);
        (document.getElementById('my_modal_1') as HTMLDialogElement).showModal();
    };

    const saveThemeLightCopy = async () => {

        try {
            await navigator.clipboard.writeText(JSON.stringify(cssResultant.light, null, 2));
        } catch (err) {
            console.error('Failed to copy!', err);
        }
    }

     const saveThemeDarkCopy = async () => {

        try {
            await navigator.clipboard.writeText(JSON.stringify(cssResultant.dark, null, 2));
        } catch (err) {
            console.error('Failed to copy!', err);
        }
    }


    return (
        <div className="p-4 space-y-6 bg-base-100 min-h-screen">
            <h1 className="text-2xl font-bold">React Native Elements Theme Generator</h1>

            {/* Theme selection */}
            <div className="flex flex-row gap-8 p-8 justify-between">
                {/** Light Themes */}
                <div className="form-control w-full max-w-xs">
                    <label className="label">
                        <span className="label-text">Select Light Theme Base</span>
                    </label>
                    <select
                        className="select select-bordered"
                        value={selectedTheme.name}
                        onChange={(e) => {
                            const theme = lightThemes.find((t) => t.name === e.target.value);
                            if (theme) setSelectedTheme(theme);
                            const daisyResult = parseDaisyThemeToRN(theme?.content!, selectedDarkTheme.content);
                            setParsedTheme(daisyResult);
                            setFormColors(() => convertFormatAToB(daisyResult));
                        }}
                    >
                        {lightThemes.map((theme) => (
                            <option key={theme.name} value={theme.name}>
                                {theme.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/** Dark Themes  */}
                <div className="form-control w-full max-w-xs">
                    <label className="label">
                        <span className="label-text">Select Dark Theme Base</span>
                    </label>
                    <select
                        className="select select-bordered"
                        value={selectedDarkTheme.name}
                        onChange={(e) => {
                            const theme = darkThemes.find((t) => t.name === e.target.value);
                            if (theme) setSelectedDarkTheme(theme);
                            const daisyResult = parseDaisyThemeToRN(selectedTheme.content, theme?.content!);
                            setParsedTheme(daisyResult);
                            setFormColors(() => convertFormatAToB(daisyResult));
                        }}
                    >
                        {darkThemes.map((theme) => (
                            <option key={theme.name} value={theme.name}>
                                {theme.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Theme preview */}
            <ThemePreview formColors={formColors} />

            {/** THE FORM  */}
            <div className="p-4 space-y-8">
                <form>
                    {(["lightColors", "darkColors", "lightComponents", "darkComponents"] as const).map((mode) => (
                        <div className="pt-8 pb-6">
                            <div className="bg-base-100 border-base-300 collapse border">
                                <input type="checkbox" className="peer" />
                                <div
                                    className="collapse-title bg-primary peer-checked:bg-secondary peer-checked:text-white text-white"
                                >
                                    {mode.replace("Colors", " Mode").replace("Components", " mode Components").charAt(0).toUpperCase() + mode.replace("Colors", " Mode").replace("Components", " mode Components").slice(1)}
                                </div>
                                <div
                                    className="collapse-content bg-primary text-primary-content peer-checked:bg-secondary peer-checked:text-secondary-content"
                                >
                                    <pre className="bg-base-300 text-sm p-4 rounded overflow-x-auto text-white">
                                        <div key={mode} className="bg-base-200 p-4 rounded-box shadow pb-6">
                                            <h2 className="text-xl font-bold mb-4 capitalize">{mode.replace("Colors", " Mode").replace("Components", " mode Components")}</h2>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                                {Object.entries(formColors[mode]).map(([key, value]) => (
                                                    <div key={key} className="form-control">
                                                        <label className="label">
                                                            <span className="label-text capitalize">{key}</span>
                                                        </label>
                                                        <HexColorPicker color={value} onChange={(result) => {
                                                            setFormColors((prev) => ({
                                                                ...prev,
                                                                [mode]: {
                                                                    ...prev[mode],
                                                                    [key]: result,
                                                                },
                                                            }));
                                                        }} />

                                                        <input
                                                            type="text"
                                                            value={value}
                                                            onChange={(e) => handleChange(mode, key, e.target.value)}
                                                            className="input input-bordered"
                                                        />

                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <br />
                                    </pre>
                                </div>
                            </div>

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

                <div className="bg-base-100 border-base-300 collapse border">
                    <input type="checkbox" className="peer" />
                    <div
                        className="collapse-title bg-primary peer-checked:bg-secondary peer-checked:text-white text-white"
                    >
                        View Preview
                    </div>
                    <div
                        className="collapse-content bg-primary text-primary-content peer-checked:bg-secondary peer-checked:text-secondary-content"
                    >
                        <pre className="bg-base-300 text-sm p-4 rounded overflow-x-auto text-white">
                            {JSON.stringify(parsedTheme, null, 2)}
                        </pre>
                    </div>
                </div>

                <div className="flex flex-row gap-8 p-8 ">
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

                    <div>
                        <button
                            className="btn btn-outline"
                            onClick={() => handleJsonSave()}>
                            Save Theme
                        </button>
                        <dialog id="my_modal_1" className="modal">
                            <div className="modal-box  w-11/12 max-w-5xl">
                                <h3 className="font-bold text-lg">Save Theme in relevant files</h3>
                                <p className="py-4">Below is the theme elements you need, simply copy and pase to the relevant file in assets/themes/</p>

                                {/** LIGHT MODE  */}
                                <div>
                                    <div className="bg-base-100 border-base-300 collapse border">
                                        <input type="checkbox" className="peer" />
                                        <div
                                            className="collapse-title bg-primary peer-checked:bg-secondary peer-checked:text-white text-white"
                                        >
                                            View Theme
                                        </div>
                                        <div
                                            className="collapse-content bg-primary text-primary-content peer-checked:bg-secondary peer-checked:text-secondary-content"
                                        >
                                            <div className="card bg-neutral text-neutral-content w-11/12">
                                                <div className="card-body items-center text-left">
                                                    <h2 className="card-title">light-mode-themes.json</h2>
                                                    <p>Copy the contents to /light-mode-themes.json</p>
                                                    <br />
                                                    {cssResultant.light.map((element, index) => {
                                                        return (
                                                            <p
                                                                id={index.toString()}
                                                                className="text-sm text-white"
                                                            >
                                                                {JSON.stringify(element, null, 2)}
                                                            </p>
                                                        );
                                                    })}
                                                    <div className="card-actions justify-end">
                                                        <button className="btn btn-primary" onClick={() => saveThemeLightCopy()}>Copy</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                {/** DARK MODE  */}
                                <div>
                                    <div className="bg-base-100 border-base-300 collapse border">
                                        <input type="checkbox" className="peer" />
                                        <div
                                            className="collapse-title bg-primary peer-checked:bg-secondary peer-checked:text-white text-white"
                                        >
                                            View Theme
                                        </div>
                                        <div
                                            className="collapse-content bg-primary text-primary-content peer-checked:bg-secondary peer-checked:text-secondary-content"
                                        >
                                            <div>
                                                <div className="card bg-neutral text-neutral-content w-11/12">
                                                    <div className="card-body items-center text-left">
                                                        <h2 className="card-title">dark-mode-themes.json</h2>
                                                        <p>Copy the contents to /dark-mode-themes.json</p>
                                                        <br />
                                                        {cssResultant.dark.map((element, index) => {
                                                            return (
                                                                <p
                                                                    id={index.toString()}
                                                                    className="text-sm text-white"
                                                                >
                                                                    {JSON.stringify(element, null, 2)}
                                                                </p>
                                                            );
                                                        })}
                                                        <div className="card-actions justify-end">
                                                            <button
                                                                className="btn btn-primary"
                                                                onClick={() => saveThemeDarkCopy()}
                                                            >
                                                                Copy
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                <div className="modal-action">
                                    <form method="dialog">
                                        {/* if there is a button in form, it will close the modal */}
                                        <button className="btn">Close</button>
                                    </form>
                                </div>
                            </div>
                        </dialog>
                    </div>
                </div>

            </div>
        </div>
    );
}


