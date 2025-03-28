import { useNavigate } from "react-router";

function GradientInit () {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col">
            <button 
                className="btn btn-primary"
                onClick={() => {
                    navigate('/themes/daisyui');
                }}
            >
                Daisy UI 
            </button>
            <br/>
            <button 
                className="btn btn-primary"
                onClick={() => {
                    navigate('/themes/colorGradient');
                }}
            >
                Flutter 
            </button>
        </div>
    );
}

export default GradientInit;