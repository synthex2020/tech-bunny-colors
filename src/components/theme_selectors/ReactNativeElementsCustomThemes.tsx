import React, { useState, useEffect } from "react";
import themes from "../../assets/themes/daisyThemes.json";

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

// Parse the DaisyUI theme into React Native Elements colors
function parseDaisyThemeToRN(css: string) {
    const colors: Record<string, string> = {};
    const regex = /--color-(.*?):\s*(oklch\(.*?\));/g;
    let match;
    while ((match = regex.exec(css)) !== null) {
        const [_, key, value] = match;
        colors[key] = value;
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
        },
    };
}

// Theme selection and preview component
export default function ReactNativeElementsCustom() {
    const [selectedTheme, setSelectedTheme] = useState(themes[0]);
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
            <div className="border rounded p-4 bg-base-200 text-base-content space-y-4">
                <h2 className="text-xl font-semibold mb-2">Theme Preview</h2>
                <div className="space-x-2">
                    <button className="btn btn-primary">Primary</button>
                    <button className="btn btn-secondary">Secondary</button>
                    <button className="btn btn-accent">Accent</button>
                    <button className="btn btn-error">Error</button>
                </div>
            </div>

            {/* Display and copy JSON */}
            <div>
                <h2 className="text-xl font-semibold mb-2">React Native Elements Theme (JSON)</h2>
                <pre className="bg-base-300 text-sm p-4 rounded overflow-x-auto">
                    {JSON.stringify(parsedTheme, null, 2)}
                </pre>
                <div className="flex flex-row gap-4">
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
        </div>
    );
}
