import React, { useState } from 'react';
import chroma from 'chroma-js';
import { saveAs } from 'file-saver';

const initialColors = {
  "color-text-500": "#000000",
  "color-button-500": "#FF5733",
  "color-card-500": "#3498DB",
  "color-tile-500": "#1ABC9C",
  "color-background-500": "#F1C40F",
  "color-appbar-500": "#9B59B6",
  "color-appbar-text-500": "#34495E",
  "color-shadow-500": "#2ECC71",
  "color-dialog-500": "#E74C3C",
  "color-dialog-text-500": "#ECF0F1",
  "color-button-text-500": "#8E44AD",
  "color-scaffold-500": "#D35400",
  "color-explore-500": "#BDC3C7",
  "color-icon-500": "#16A085",
  "color-navBar-selected-500": "#C0392B",
  "color-navBar-unselected-500": "#7F8C8D",
  "color-navBar-500": "#D6E4FF",
  "color-primary-500": "#D6E4FF",
  "color-success-500": "#28A745",
  "color-info-500": "#17A2B8",
  "color-warning-500": "#FFC107",
  "color-danger-500": "#DC3545",
};

const generateGradient = (baseColor: string) => {
  try {
    const scale = chroma.scale(['#fff', baseColor, '#000']).mode('lab');
    const shades = [900, 800, 700, 600, 500, 400, 300, 200, 100].reduce(
      (acc, shade) => {
        acc[shade] = scale(shade / 1000).hex();
        return acc;
      },
      {} as Record<number, string>
    );
    return shades;
  } catch (error) {
    console.error('Invalid color:', baseColor);
    return {};
  }
};

const ColorGradientForm: React.FC = () => {
  const [colors, setColors] = useState(initialColors);
  const [generatedGradients, setGeneratedGradients] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setColors({ ...colors, [field]: value });
  };

  const handleGenerate = () => {
    const result: Record<string, string> = {};
    Object.entries(colors).forEach(([key, color]) => {
      const label = key.replace('-500', '');
      const shades = generateGradient(color);
      Object.entries(shades).forEach(([shade, hex]) => {
        result[`${label}-${shade}`] = hex;
      });
    });
    setGeneratedGradients(result);
  };

  const handleDownload = () => {
    const jsonData = JSON.stringify(generatedGradients, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    saveAs(blob, 'color-gradients.json');
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Color Gradient Generator</h1>
      <div className="space-y-4">
        {Object.entries(colors).map(([key, value]) => (
          <div key={key} className="flex items-center space-x-4">
            <label className="w-48 font-semibold">{key.replace('-500', '')}</label>
            <br/>
            <input
              type="text"
              value={value}
              onChange={(e) => handleInputChange(key, e.target.value)}
              className="border p-2 rounded w-full"
            />
            <div
              className="w-10 h-10 rounded"
              style={{ backgroundColor: value }}
            ></div>
          </div>
        ))}
      </div>
      <button
        onClick={handleGenerate}
        className="mt-6 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Generate Gradients
      </button>
      {Object.keys(generatedGradients).length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Generated Gradients</h2>
          <table className="table-auto w-full border-collapse border border-gray-200">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2">Color</th>
                {[100, 200, 300, 400, 500, 600, 700, 800, 900].map(shade => (
                  <th key={shade} className="border border-gray-300 p-2">{shade}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.keys(initialColors).map((key) => {
                const label = key.replace('-500', '');
                return (
                  <tr key={label}>
                    <td className="border border-gray-300 p-2 font-semibold">{label}</td>
                    {[100, 200, 300, 400, 500, 600, 700, 800, 900].map(shade => (
                      <td key={shade} className="border border-gray-300 p-2" style={{ backgroundColor: generatedGradients[`${label}-${shade}`] }}>
                        {generatedGradients[`${label}-${shade}`]}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
          <button
            onClick={handleDownload}
            className="mt-6 bg-green-500 text-white px-4 py-2 rounded"
          >
            Download JSON
          </button>
        </div>
      )}
    </div>
  );
};

export default ColorGradientForm;
