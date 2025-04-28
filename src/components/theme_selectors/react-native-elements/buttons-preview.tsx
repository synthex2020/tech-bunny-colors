import React, { useState } from "react";

export default function ThemePreview({ formColors }: { formColors: any }) {
    const [themeMode, setThemeMode] = useState<"light" | "dark">("light");

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

    const colorKeys = [
        "primary",
        "secondary",
        "success",
        "warning",
        "error",
        "disabled",
        "divider",
    ];

    const componentColorKeys = [
        "Button_buttonStyle_backgroundColor",
        "Button_disabledStyle_backgroundColor",
        "Button_disabledTitleStyle_color",
        "TextStyle_color",
        "Input_inputContainerStyle_borderColor",
        "InputStyle_color",
        "LabelStyle_color",
        "ErrorStyle_color",
        "Card_containerStyle_shadowColor",
        "Avatar_containerStyle_backgroundColor",
        "Avatar_titleStyle_color",
        "Avatar_overlayContainerStyle_backgroundColor",
        "Icon_color",
        "ListItem_containerStyle_borderBottomColor",
        "CheckBox_containerStyle_backgroundColor",
        "CheckBox_checkedColor",
        "CheckBox_uncheckedColor",
        "Overlay_overlayStyle_backgroundColor",
    ];

    const colors = themeMode === "light" ? formColors.lightColors : formColors.darkColors;
    const components =
        themeMode === "light" ? formColors.lightComponents : formColors.darkComponents;

    const renderColorButtons = () => (
        <div className="space-x-2 flex flex-wrap gap-2">
            {colorKeys.map((key) => (
                <button
                    key={key}
                    className="text-white px-4 py-2 rounded shadow"
                    style={{
                        backgroundColor: colors[key] || "#ccc",
                        color:
                            key === "divider" || colors[key]?.toLowerCase() === "#ffffff"
                                ? "#000"
                                : "#fff",
                    }}
                >
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                </button>
            ))}
        </div>
    );

    const renderComponentStyle = () => (
        <div className="space-x-2 flex flex-wrap gap-2">
            {componentColorKeys.map((key) => {
                const bg =
                    key === "primary"
                        ? components["Button_buttonStyle_backgroundColor"]
                        : components[key] || "#ccc";
                const label = key.charAt(0).toUpperCase() + key.slice(1);
                return (
                    <button
                        key={key}
                        className="text-white px-4 py-2 rounded shadow"
                        style={{
                            backgroundColor: bg,
                            color: bg.toLowerCase() === "#ffffff" ? "#000" : "#fff",
                        }}
                    >
                        {label.split("_")[0].replace("Style", "")}
                    </button>
                );
            })}
        </div>
    );

    return (
        <div
            className="rounded p-6 shadow space-y-6 transition-all duration-300"
            style={{
                backgroundColor: colors.background,
                color: colors.background?.toLowerCase() === "#ffffff" ? "#000" : "#fff",
            }}
        >
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Theme Preview</h2>
                <button
                    onClick={() => setThemeMode((prev) => (prev === "light" ? "dark" : "light"))}
                    className="px-4 py-2 rounded border"
                    style={{
                        backgroundColor: colors.primary,
                        color: "#fff",
                    }}
                >
                    Switch to {themeMode === "light" ? "Dark" : "Light"} Mode
                </button>
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-2">Base Colors</h3>
                {renderColorButtons()}
            </div>

            <hr className="my-4 opacity-30" />

            <div>
                <h3 className="text-lg font-semibold mb-2">Component Colors</h3>
                {renderComponentStyle()}
            </div>
        </div>
    );
};
