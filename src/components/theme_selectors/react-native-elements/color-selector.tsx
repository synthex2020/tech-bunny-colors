import { HexColorPicker } from "react-colorful";

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

interface ColorSelectorProps {
  index: string;
  color: string;
  onChange: (value: React.SetStateAction<FormatB>) => void;
}

export default function ColorSelector({ index, color, onChange }: ColorSelectorProps) {
  return (
    <>
      {/* Open the modal using document.getElementById('ID').showModal() method */}
      <button 
        className="btn" 
        onClick={() => (document.getElementById('my_modal_0' + index) as HTMLDialogElement).showModal()}
      >
        color selector
      </button>
      <dialog id={'my_modal_0' + index} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Choose Color</h3>

          <HexColorPicker color={color} onChange={() => onChange} />
          
          <div className="modal-action">
              {/* if there is a button in form, it will close the modal */}
                <button className="btn">Close</button>
          </div>
        </div>
      </dialog>
    </>
  );
}
