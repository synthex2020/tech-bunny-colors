import { useState, ChangeEvent, FormEvent } from "react";
import { useLocation } from "react-router";

//  TO ADD A NEW CHARACTER THERE MUST BE AN EXISTING SERIES 


function AddNewCharacter() {

    const [images, setImages] = useState<string[]>([]);

    const [formData, setFormData] = useState({
        name: "",
        titles: "",
        sex: "",
        gender: "",
        species: "",
        personality: "",
        family: "",
        hair: "",
        fashion: "",
        quirks: "",
        relationships: "",
        orientation: "",
        race: "",
        age: "",
        powers: "",
        arts: "",
        hobbies: "",
        equipment: "",
        backstory: "",
        references: "",
        referenceImages: "",
        bodyModifications: "",
        anatomy: "",
        seriesId: "",
        characterSheet: "",
        model: ""
    });

    const location = useLocation();
    const seriesId = location.state.seriesId;

    const handleFormChange = (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { id, value, files } = event.target as HTMLInputElement;

        // If input is a file input
        if (files && files.length > 0) {
            const arrayFiles = Array.from(files);
            const imageSrcs = arrayFiles.map((file) => URL.createObjectURL(file));
            setImages((prev) => [...prev, ...imageSrcs]);

            // You might want to store file URLs or raw file data in formData
            setFormData((prev) => ({
                ...prev,
                [id]: imageSrcs.join(','),
            }));
        } else {
            // For text/textarea fields
            setFormData((prev) => ({
                ...prev,
                [id]: value,
            }));
        }
    };

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        formData.referenceImages = images.toString();
        formData.seriesId = seriesId;
        console.log(formData);
        console.log(images);
    }; // end on submit


    return (
        <div className="p-10">

            <div className="flex flex-col lg:flex-row gap-4 ">
                {/** MEDIA PREVIEW AND ENTRY  - UPLOAD IMAGES SEPERATLY ONLY REFERENCE IMAGES*/}
                <div className="flex flex-col">
                    <h1 className="text text-4xl font-bold "> Create a new Character</h1>

                    <div>
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
                        <label
                            className="fieldset-label text-3xl font-bold"
                        >
                            Character Sheet
                        </label><br />
                        <input
                            type="file"
                            className="file-input input-bordered text-sm w-full"
                            id="images"
                            onChange={handleFormChange}
                            multiple
                        />
                    </div>

                    <div>
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
                        <label
                            className="fieldset-label text-3xl font-bold"
                        >
                            Upload Character 3D model
                        </label><br />
                        <input
                            type="file"
                            className="file-input input-bordered text-sm w-full"
                            id="model"
                            onChange={handleFormChange}
                            multiple
                        />
                    </div>
                </div>
                {/** TEXT ENTRIES  */}
                <div className="flex flex-col justify-center lg: flex-none">
                    <form className="form" onSubmit={onSubmit}>
                        <fieldset className="fieldset space-y-2">
                            <label
                                className="fieldset-label text-3xl font-bold"
                            >
                                Character Name
                            </label><br />
                            <input
                                type="text"
                                className="input input-bordered text-sm w-full"
                                placeholder="The Character's name"
                                id="name"
                                onChange={handleFormChange}
                            /><br />

                            <label
                                className="fieldset-label text-3xl font-bold"
                            >
                                Character Titles
                            </label><br />
                            <input
                                type="text"
                                className="input input-bordered text-sm w-full"
                                placeholder="Character's titles, Mr, Mrs, Dr, Lord etc "
                                id="titles"
                                onChange={handleFormChange}
                            /><br />

                            <label
                                className="fieldset-label text-3xl font-bold"
                            >
                                Character Martial Arts
                            </label><br />
                            <input
                                type="text"
                                className="input input-bordered text-sm w-full"
                                placeholder="Karate, Sword Fighting etc"
                                id="arts"
                                onChange={handleFormChange}
                            /><br />

                            <label
                                className="fieldset-label text-3xl font-bold"
                            >
                                Character References
                            </label><br />
                            <input
                                type="text"
                                className="input input-bordered text-sm w-full"
                                placeholder="Inpsirations for your character"
                                id="references"
                                onChange={handleFormChange}
                            /><br />
                            {/** ADD MULTI-CHIP SELECTION FOR GENRE */}
                            <label
                                className="fieldset-label text-3xl font-bold"
                            >
                                Character's Gender
                            </label><br />
                            <input
                                type="text"
                                className="input input-bordered text-sm w-full"
                                placeholder="Character's Gender, Man, Woman, etc"
                                id="gender"
                                onChange={handleFormChange}
                            /><br />

                            <label
                                className="fieldset-label text-3xl font-bold"
                            >
                                Character's Species
                            </label><br />
                            <input
                                type="text"
                                className="input input-bordered text-sm w-full"
                                placeholder="What Species are they?"
                                id="species"
                                onChange={handleFormChange}
                            /><br />

                            <label
                                className="fieldset-label text-3xl font-bold"
                            >
                                Character's Anatomy
                            </label><br />
                            <input
                                type="text"
                                className="input input-bordered text-sm w-full"
                                placeholder="Describe your character's anatomy "
                                id="anatomy"
                                onChange={handleFormChange}
                            /><br />

                            {/** AGE, Orientation, SEX */}
                            <div className="flex flex-row gap-4 justify-center">

                                {/** AGE RATING*/}
                                <div>
                                    <label
                                        className="fieldset-label font-semibold"
                                    >
                                        Age
                                    </label><br />
                                    <input
                                        type="number"
                                        className="input input-bordered text-sm"
                                        placeholder="15 "
                                        id="age"
                                        onChange={handleFormChange}
                                    /><br />
                                </div>
                                {/** ORIENTATION */}
                                <div>
                                    <label
                                        className="fieldset-label font-semibold"
                                    >
                                        Orientation
                                    </label><br />
                                    <select
                                        defaultValue="Pick an orientation"
                                        className="select select-bordered"
                                        id="orientation"
                                    >
                                        <option value={"Heterosexual"}>Heterosexual ( Straight ) </option>
                                        <option value={"Homosexual"}>Homosexual ( Gay )</option>
                                        <option value={"Pansexual"}>Pansexual</option>
                                        <option value={"Asexual"}>Asexual</option>
                                        <option value={"Unknown"}>Unknown</option>
                                    </select>
                                </div>

                                {/** SEX */}
                                <div>
                                    <label
                                        className="fieldset-label font-semibold"
                                    >
                                        Sex
                                    </label><br />
                                    <select
                                        defaultValue="Sex"
                                        className="select select-bordered"
                                        id="sex"
                                    >
                                        <option value={"Male"}>Male</option>
                                        <option value={"Female"}>Female</option>
                                        <option value={"Intersex"}>Intersex</option>
                                        <option value={"Unknown"}>Unknown</option>
                                    </select>
                                </div>

                            </div>

                            {/** RACE */}
                            <label
                                className="fieldset-label text-3xl font-bold"
                            >
                                Race
                            </label><br />
                            <input
                                type="text"
                                className="input input-bordered text-sm w-full"
                                placeholder="Describe your character's Race "
                                id="race"
                                onChange={handleFormChange}
                            /><br />

                            <label
                                className="fieldset-label text-3xl font-bold"
                            >
                                Character's Relationships
                            </label><br />
                            <input
                                className="textarea textarea-bordered text-sm w-full"
                                placeholder="The character's relationships of note, Mother, Father, Lover etc"
                                id="relationships"
                                onChange={handleFormChange}
                            /><br />

                            <label
                                className="fieldset-label text-3xl font-bold"
                            >
                                Character's Familial connections
                            </label><br />
                            <input
                                className="textarea textarea-bordered text-sm w-full h-[70%]"
                                placeholder="The Character's relevent family leanage"
                                id="family"
                                onChange={handleFormChange}
                            /><br />

                            <label
                                className="fieldset-label text-3xl font-bold"
                            >
                                Character's Hobbies
                            </label><br />
                            <input
                                className="textarea textarea-bordered text-sm w-full h-1/4"
                                placeholder="Character's Hobbies of note for example likes to bake etc"
                                id="hobbies"
                                onChange={handleFormChange}
                            /><br />

                            <label
                                className="fieldset-label text-3xl font-bold"
                            >
                                Character's Hair
                            </label><br />
                            <input
                                type="text"
                                className="input input-bordered text-sm w-full"
                                placeholder="Character's usaul hair style"
                                id="hair"
                                onChange={handleFormChange}
                            /><br />

                            <label
                                className="fieldset-label text-3xl font-bold"
                            >
                                Character's Fashion
                            </label><br />
                            <input
                                type="text"
                                className="input input-bordered text-sm w-full"
                                placeholder="Character's sense of fashion, how do they typically dress?"
                                id="fashion"
                                onChange={handleFormChange}
                            /><br />

                            <label
                                className="fieldset-label text-3xl font-bold"
                            >
                                Character's Personality
                            </label><br />
                            <input
                                className="textarea textarea-bordered text-sm w-full h-1/4"
                                placeholder="Describe the personality of your character, what type are they? "
                                id="personality"
                                onChange={handleFormChange}
                            /><br />

                            <label
                                className="fieldset-label text-3xl font-bold"
                            >
                                Character's Quirks
                            </label><br />
                            <input
                                className="textarea textarea-bordered text-sm w-full h-1/4"
                                placeholder="What quirks describe your character? "
                                id="quirks"
                                onChange={handleFormChange}
                            /><br />

                            <label
                                className="fieldset-label text-3xl font-bold"
                            >
                                Character's Equipment
                            </label><br />
                            <input
                                className="textarea textarea-bordered text-sm w-full h-1/4"
                                placeholder="What equipment does your character usaully carry ? "
                                id="equipment"
                                onChange={handleFormChange}
                            /><br />

                            <label
                                className="fieldset-label text-3xl font-bold"
                            >
                                Character's Power Set
                            </label><br />
                            <input
                                className="textarea textarea-bordered text-sm w-full h-1/4"
                                placeholder="What is your character's power set ? "
                                id="powers"
                                onChange={handleFormChange}
                            /><br />

                            <label
                                className="fieldset-label text-3xl font-bold"
                            >
                                Character's Body Modifications
                            </label><br />
                            <input
                                className="textarea textarea-bordered text-sm w-full h-1/4"
                                placeholder="What modifications does your character have for example scars or tattoos "
                                id="bodyModifications"
                                onChange={handleFormChange}
                            /><br />
                        </fieldset>

                        <label
                            className="fieldset-label text-3xl font-bold"
                        >
                            Character's Backstory
                        </label><br />
                        <textarea
                            className="textarea textarea-bordered text-sm w-full h-1/4"
                            placeholder="What is the Character's Backstory, their origin and future roles"
                            id="backstory"
                            onChange={handleFormChange}
                        /><br />

                        <button className="btn btn-neutral mt-4" type="submit">Submit</button>

                    </form>
                </div>
            </div>

        </div>
    );
}

export default AddNewCharacter;
