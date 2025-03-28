import React, { useState } from 'react';
import chroma from 'chroma-js';
import { saveAs } from 'file-saver';

const initialColors = {
  "color-text-500": "#000000",
  "color-text-secondary-500": "#ffffff",
  "color-button-500": "#fafafa",
  "color-button-secondary-500": "#ff5733",
  "color-card-500": "#fafafa",
  "color-card-secondary-500": "#3498db",
  "color-border-500": "#F59623",
  "color-border-secondary-500": "#fcfcfc",
  "color-tile-500": "#fafafa",
  "color-tile-secondary-500": "#1abc9c",
  "color-background-500": "#fafafa",
  "color-background-secondary-500": "#73320a",
  "color-appbar-500": "#fafafa",
  "color-appbar-secondary-500": "#73320a",
  "color-appbar-text-500": "#000000",
  "color-appbar-text-secondary-500": "#ffffff",
  "color-shadow-500": "#000000",
  "color-shadow-secondary-500": "#ffffff",
  "color-dialog-500": "#ffffff",
  "color-dialog-secondary-500": "#8e440d",
  "color-dialog-text-500": "#000000",
  "color-dialog-text-secondary-500": "#ffffff",
  "color-button-text-500": "#0d14e3",
  "color-button-text-secondary-500": "#fbd9b4",
  "color-button-border-500": "#E3DC0D",
  "color-button-border-secondary-500": "#E30D7F",
  "color-scaffold-500": "#fafafa",
  "color-scaffold-secondary-500": "#73320a",
  "color-explore-500": "#F59623",
  "color-explore-secondary-500": "#73320a",
  "color-icon-500": "#f59623",
  "color-icon-secondary-500": "#F3D313",
  "color-navBar-selected-500": "#f59623",
  "color-navBar-selected-secondary-500": "#F3D313",
  "color-navBar-unselected-500": "#000000",
  "color-navBar-unselected-secondary-500": "#ffffff",
  "color-navBar-500": "#fafafa",
  "color-navBar-secondary-500": "#73320a",
  "color-primary-500": "#2382F5",
  "color-primary-secondary-500": "#412f7d",
  "color-success-500": "#28A745",
  "color-success-secondary-500": "#28A745",
  "color-info-500": "#17A2B8",
  "color-info-secondary-500": "#17A2B8",
  "color-warning-500": "#FFC107",
  "color-warning-secondary-500": "#FFC107",
  "color-danger-500": "#DC3545",
  "color-danger-secondary-500": "#DC3545"
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
      
      <div className='grid md:grid-cols-2 gap-8'>
        <div className='flex flex-col h-full'>
          <div className="flex-grow space-y-4 overflow-auto">
            {Object.entries(colors).map(([key, value]) => (
              <div key={key} className="flex items-center space-x-4">
                <label className="w-48 font-semibold">{key.replace('-500', '')}</label>
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
            className="mt-6 bg-blue-500 text-white px-4 py-2 rounded self-start"
          >
            Generate Gradients
          </button>
        </div>

        <div className='flex flex-col h-full'>
          {Object.keys(generatedGradients).length > 0 ? (
            <>
              <div className="flex-grow overflow-auto">
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
              </div>
              <button
                onClick={handleDownload}
                className="mt-6 bg-green-500 text-white px-4 py-2 rounded self-start"
              >
                Download JSON
              </button>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Generated gradients will appear here
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ColorGradientForm;