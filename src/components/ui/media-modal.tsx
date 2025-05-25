import { MediaCarousel } from "./media-carousel";

interface MediaModalProps {
    identity: string;
    images: string[];
};

export const MediaModal = (values: MediaModalProps) => {
    //console.log(values.images)
    return (
        <div className="flex">
            <button className="btn" onClick={() => (document.getElementById('media_modal_' + values.identity + '') as HTMLDialogElement).showModal()}>open modal</button>
            <dialog id={'media_modal_' + values.identity + ''} className="modal">
                <div className="modal-box w-1/2 max-w-none p-4">

                    <h3 className="font-bold text-lg">Hello!</h3>
                    
                    <MediaCarousel images={values.images}/>
                    
                    <p className="py-4">Click the button below to close</p>

                    <div className="modal-action">
                        <form method="dialog">
                            {/* if there is a button, it will close the modal */}
                            <button className="btn">Close</button>
                        </form>
                    </div>
                </div>
            </dialog>
        </div>
    );
};


