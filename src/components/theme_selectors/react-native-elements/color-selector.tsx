import { HexColorPicker } from "react-colorful";

interface ColorSelectorProps {
  index: string;
  color: string;
  onChange: (newColor: string) => void;
}

export default function ColorSelector({ index, color, onChange }: ColorSelectorProps) {
  return (
    <div>
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

          <HexColorPicker color={color} onChange={onChange} />
          
          <p className="py-4">Press ESC key or click the button below to close</p>
          <div className="modal-action">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">Close</button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
