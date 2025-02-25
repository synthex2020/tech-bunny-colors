//  SHOW MORE DETAILS ON SERIES  - INCLUDE IN-WORLD LOCATIONS AND EVENTS OF IMPORTANCE

interface Locations {
    title: string;
    type: string;
    geoLocation: string;
    description: string;
    images: string[];
}

interface ImportantEvents {
    title: string;
    date: string;
    importance: string;
    description: string;
    images: string[];
}

interface Character {
    name: string;
    titles: string;
    sex: string;
    gender: string;
    species: string;
    personality: string;
    family: string[];
    hair: string;
    fashion: string;
    quirks: string;
    relationship: string;
    orientation: string;
    race: string;
    age: string;
    images: string[];
    powers: string;
    martialArts: string;
    hobbies: string;
    equipment: string;
    backstory: string;
    references: string;
    referenceImages: string[];
    characterSheet: string;
    bodyModifications: string;
    anatomyMeasurements: string
}

//  style, 
interface Series {

    title: string;
    authors: string;
    artists: string;
    genre: string;
    age: string;
    thumbnail: string;
    description: string;
    plot: string;
    auidence: string;
    history: string;
    physics: string;
    world: string;
    issues: number;
    volumes: number;
    merchandised: boolean;
    published: boolean;
    currentStatus: string;
    powerSystem: string[];
    images: string[];
    timeline: ImportantEvents[];
    locations: Locations[];
    characters: Character[];
}

interface SeriesProps {
    series: Series;
    modalId: string;
}

function SeriesMoreDetailsModal(seriesProps: SeriesProps) {
    return (
        <div>
            <button
                className="btn"
                onClick={() => (document.getElementById(seriesProps.modalId) as HTMLDialogElement)?.showModal()}
            >
                View Series
            </button>
            <dialog id={seriesProps.modalId} className="modal">
                <div className="modal-box w-11/12 max-w-5xl">

                    <div className="hero bg-base-200 min-h-screen">
                        <div className="hero-content flex-col lg:flex-row">
                            {/** MEDIA ITEMS  */}
                            <img
                                src="https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp"
                                className="max-w-sm rounded-lg shadow-2xl" />
                            
                            {/** TEXT DESCRIPTORS  */}
                            <div>
                                <h1 className="text-5xl font-bold">Box Office News!</h1>
                                <p className="py-6">
                                    Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem
                                    quasi. In deleniti eaque aut repudiandae et a id nisi.
                                </p>
                                <button className="btn btn-primary">Get Started</button>
                            </div>
                        </div>
                    </div>
                    {/** TEXT AREA DESCRIPTORS */}
                    <div>
                        <h3>History</h3>
                        <p className="text text-wrap text-sm">{seriesProps.series.history}</p>
                        <h3>Physics</h3>
                        <p className="text text-wrap text-sm">{seriesProps.series.physics}</p>
                        <h3>World</h3>
                        <p className="text text-wrap text-sm">{seriesProps.series.world}</p>
                        <h3>Description</h3>
                        <p className="text text-wrap text-sm">{seriesProps.series.description}</p>

                    </div>
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
}

export default SeriesMoreDetailsModal;