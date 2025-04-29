import { useState, FormEvent } from "react";

//  NO Rules on adding series 
/** 
 * 
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
    timeline: [];
    locations: [];
    characters: [];
}
 */

function AddNewSeries() {

   /**
    *  const defaultImages = [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Samson_comic_page.jpg/640px-Samson_comic_page.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/The_Outcasts_of_Poker_Flat_%281919%29_-_Ad_2.jpg/640px-The_Outcasts_of_Poker_Flat_%281919%29_-_Ad_2.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Fantastic_Comics_1.jpg/640px-Fantastic_Comics_1.jpg"
    ];
    */

    const [images, setImages] = useState<string[]>([]);
    const [formData, setFormData] = useState({

        title: "",
        authors : "",
        artists : "",
        genre: "",
        age : "",
        description: "",
        plot: "",
        audience : "",
        history : "",
        physics : "",
        world: "",
        powerSystem: "",
        images : "",
    });
    /** const handleMediaFileUpload = (event: ChangeEvent<HTMLInputElement>) => {

        if (event.target.files) {
            const arrayFiles = Array.from(event.target.files);
            const imageSrcs = arrayFiles.map((file) => URL.createObjectURL(file));
            setImages((prev) => [...prev, ...imageSrcs]);
        } else {
            setImages(defaultImages);
        }
    }; */

    const handleFormChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        // Type assertion to check if the event target is an HTMLInputElement
        const target = event.target as HTMLInputElement;
        
        let value: (typeof formData)[keyof typeof formData] = target.value;
    
        // Check if the input is a file input
        if (target.type === 'file' && target.files) {
            const arrayFiles = Array.from(target.files);
            const imageSrcs = arrayFiles.map((file) => URL.createObjectURL(file));
            
            setImages((prev) => [...prev, ...imageSrcs]);
            value = imageSrcs.toString();
            console.log("values: ", imageSrcs);
        }
    
        setFormData({...formData, [target.id]: value});
    };

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        formData.images = images.toString();
        console.log(formData);
        console.log(images);
    }; // end on submit 

    return (

        <div className="p-10">
            <div className="flex flex-col lg:flex-row gap-4">
                {/** MEDIA PREVIEW AND ENTRY  */}
                <div className="flex flex-col">
                    <h1 className="text text-4xl font-bold "> Create a new Series </h1>

                    {/** MEDIA ENTRY AND PREVIEW  */}
                    <div className="carousel w-full">
                        {images.map((image, index) => (
                            <div
                                id={`slide${index + 1}`}
                                key={index}
                                className="carousel-item relative w-full"
                            >
                                <img src={image} className="w-full object-contain" alt={`Slide ${index + 1}`} />
                                <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                                    <a
                                        href={`#slide${index === 0 ? images.length : index}`}
                                        className="btn btn-circle"
                                    >
                                        ❮
                                    </a>
                                    <a
                                        href={`#slide${index === images.length - 1 ? 1 : index + 2}`}
                                        className="btn btn-circle"
                                    >
                                        ❯
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/** FILE UPLOAD BUTTON  */}
                    <input
                        type="file"
                        className="file-input input-bordered text-sm w-full"
                        id="images"
                        onChange={handleFormChange}
                        multiple
                    />
                </div>
                {/** TEXT ENTRIES  */}
                <div className="flex flex-col justify-center lg: flex-none">
                    <form className="form" onSubmit={onSubmit}>
                        <fieldset className="fieldset space-y-2">
                            <label
                                className="fieldset-label text-3xl font-bold"
                            >
                                Series Title
                            </label><br />
                            <input
                                type="text"
                                className="input input-bordered text-sm w-full"
                                placeholder="Series Title"
                                id="title"
                                onChange={handleFormChange}
                            /><br />

                            <label
                                className="fieldset-label text-3xl font-bold"
                            >
                                Series Authors
                            </label><br />
                            <input
                                type="text"
                                className="input input-bordered text-sm w-full"
                                placeholder="John .h , Russel Q, "
                                id="authors"
                                onChange={handleFormChange}
                            /><br />

                            <label
                                className="fieldset-label text-3xl font-bold"
                            >
                                Series Artists
                            </label><br />
                            <input
                                type="text"
                                className="input input-bordered text-sm w-full"
                                placeholder="Post Title"
                                id="artists"
                                onChange={handleFormChange}
                            /><br />
                            {/** ADD MULTI-CHIP SELECTION FOR GENRE */}
                            <label
                                className="fieldset-label text-3xl font-bold"
                            >
                                Series Genre
                            </label><br />
                            <input
                                type="text"
                                className="input input-bordered text-sm w-full"
                                placeholder="Fantasy, Action, Horror"
                                id="genres"
                                onChange={handleFormChange}
                            /><br />

                            <label
                                className="fieldset-label text-3xl font-bold"
                            >
                                Series Target Audience
                            </label><br />
                            
                            <div>
                            
                                {/** AGE RATING, Rated E, 12+ , 16+ , 17+ , 18+ , R+ */}
                                <select 
                                    defaultValue="Pick an age rating" 
                                    className="select select-bordered"
                                    id="age"
                                >
                                    <option value={"E"} disabled={true}>E - Rated E for Everyone</option>
                                    <option value={"12+"}> 12+ - Rated 12+ for young children</option>
                                    <option value={"16+"}> 16+ - Rated 16+ for young teens</option>
                                    <option value={"17+"}> 17+ - Rated 17+ for older teens</option>
                                    <option value={"18+"}> 18+ - Rated 18+ for young adults</option>
                                    <option value={"R+"}> R+ - Rated R+ for Mature Auidences</option>
                                </select>
                            </div>

                            <label
                                className="fieldset-label text-3xl font-bold"
                            >
                                Series Description
                            </label><br />
                            <input
                                className="textarea textarea-bordered text-sm w-full"
                                placeholder="A quick overall summary on the series as a whole"
                                id="description"
                                onChange={handleFormChange}
                            /><br />

                            <label
                                className="fieldset-label text-3xl font-bold"
                            >
                                Series World History
                            </label><br />
                            <input
                                className="textarea textarea-bordered text-sm w-full h-[70%]"
                                placeholder="A run down of the general in-world history your series will be focused around"
                                id="history"
                                onChange={handleFormChange}
                            /><br />

                            <label
                                className="fieldset-label text-3xl font-bold"
                            >
                                Series World Physics
                            </label><br />
                            <input
                                className="textarea textarea-bordered text-sm w-full h-1/4"
                                placeholder="Describe the nature of science and or magic in the world, how technologically advanced are they"
                                id="physcis"
                                onChange={handleFormChange}
                            /><br />

                            <label
                                className="fieldset-label text-3xl font-bold"
                            >
                                Series Power Scaling System
                            </label><br />
                            <input
                                className="textarea textarea-bordered text-sm w-full h-1/4"
                                placeholder="What is the power scaling in the series, how do we categorize the weak and the strong ?"
                                id="powerSystem"
                                onChange={handleFormChange}
                            /><br />
                        </fieldset>

                        <label
                            className="fieldset-label text-3xl font-bold"
                        >
                            Series Main Plot
                        </label><br />
                        <input
                            className="textarea textarea-bordered text-sm w-full h-1/4"
                            placeholder="What is the main plot of the series?"
                            id="plot"
                            onChange={handleFormChange}
                        /><br />

                        <button className="btn btn-neutral mt-4" type="submit">Submit</button>

                    </form>
                </div>
            </div>
        </div>
    );
} // end function 

export default AddNewSeries;

