import React, { useState } from 'react';
import { saveAs } from 'file-saver';
import { oklch } from 'culori';

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

const DaisyUIThemePack: React.FC = () => {
  const [colors, setColors] = useState(initialColors);
  const [convertedTheme, setConvertedTheme] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setColors({ ...colors, [field]: value });
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
      
      <div className='grid md:grid-cols-2 gap-8'>
        <div className='flex flex-col h-full'>
          <h2 className="text-xl font-semibold mb-4">Input Hex Colors</h2>
          <div className="flex-grow space-y-4 overflow-auto">
            {Object.entries(colors).map(([key, value]) => (
              <div key={key} className="flex items-center space-x-4">
                <label className="w-32 font-medium">{key}</label>
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