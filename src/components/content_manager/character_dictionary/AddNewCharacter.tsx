import { useState, ChangeEvent, FormEvent } from "react";
import { useParams } from "react-router";
import { useEffect } from "react";
import useFamilyStore from "../../../store/FamilyStore"; // adjust import path as needed
import { fetch_series_families } from "../../../persistence/SeriesPerisistence";
import { add_new_character } from "../../../persistence/CharactersPersistence";



function AddNewCharacter() {

    //  TODO: ADD CHARACTER BY JSON FILE 
    //      [IMAGE (URL), CHARACTER_DATA (JSON)]
    //  todo : save the JSON content under character anatomy

    const { families, setFamilies } = useFamilyStore();
    const { id } = useParams<{ id: string }>();

    const [images, setImages] = useState<string[]>([]);

    const [formData, setFormData] = useState({
        name: "",
        titles: "",
        sex: "Male",
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
        age: "15",
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

    const [selectedFamilyId, setSelectedFamilyId] = useState<string>("");


    const seriesId = id!;

    

    useEffect(() => {
        if (seriesId) {
            fetch_series_families(seriesId).then(setFamilies);
        }
    }, [seriesId, setFamilies, id]);

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

    const handleJsonDataInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const json = JSON.parse(e.target?.result as string);

                if (!json.character) {
                    alert("Invalid JSON: Missing 'character' key.");
                    return;
                }

                // Optional image URL to preview
                if (json.image) {
                    setImages((prev) => [...prev, json.image]);
                }

                // Merge existing form data with new character fields
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    ["anatomy"]: json.character
                }));
            } catch (err) {
                console.error("Failed to parse JSON:", err);
                alert("Invalid JSON file.");
            }
        };

        reader.readAsText(file);
    };


    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        formData.referenceImages = images.toString();
        formData.seriesId = seriesId;

        //  Add selected family to the formData.family field
        if (selectedFamilyId) {
            const familyObj = families.find((f) => f.id === selectedFamilyId);
            if (familyObj) {
                formData.family = "" + familyObj.id + "," + familyObj.familyName;
            }
        } else {
            formData.family = "[]";
        }

        //  Append the free-text family entry into the backstory
        if (formData.family && formData.family.length > 0 && formData.family !== "[]") {
            formData.backstory = `[Familial Relations]: ${formData.family}\n[Backstory]: ${formData.backstory}`;
        }
        console.log(formData.sex)

        const characterEntry = {
            createdAt: "",
            titles: formData.titles,
            name: formData.name,
            sex: formData.sex,
            gender: formData.gender,
            species: formData.species,
            personality: formData.personality,
            hair: formData.hair,
            fashion: formData.fashion,
            quirks: formData.quirks,
            relationships: formData.relationships,
            orientation: formData.orientation,
            race: formData.race,
            age: formData.age,
            powers: formData.powers,
            martialArts: formData.arts,
            hobbies: formData.hobbies,
            equipment: formData.equipment,
            backstory: formData.backstory,
            references: formData.references,
            characterSheet: images[0],
            bodyMods: formData.bodyModifications,
            anatomy: formData.anatomy,
            model: formData.model,
            family: [selectedFamilyId],
            referenceMedia: [""],
            media: [""],
        }
        add_new_character(
            {
                character: characterEntry,
                seriesId: seriesId
            }
        ).then((value: Boolean) => {
            if (value) {
                alert("Character Added");
                setFormData({
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
            } else {
                alert("Failed to upload character")
            }
        })
    };

    return (
        <div className="p-10">

            <div className="flex flex-col lg:flex-row gap-4 ">
                {/** MEDIA PREVIEW AND ENTRY  - UPLOAD IMAGES SEPERATLY ONLY REFERENCE IMAGES*/}
                <h1 className="text text-4xl font-bold "> Create a new Character</h1>
                <div className="flex flex-row gap-8 justify-center">
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

                                </div>
                            ))}
                        </div>

                    </div>
                </div>
                {/** TEXT ENTRIES  */}
                <div className="flex flex-col justify-center lg: flex-none">
                    <form className="form" onSubmit={onSubmit}>
                        <fieldset className="fieldset space-y-2">
                            <label
                                className="fieldset-label text-3xl font-bold"
                            >
                                Anatomy File (JSON)
                            </label><br />
                            <input
                                type="file"
                                id="anatomy"
                                accept=".json"
                                onChange={handleJsonDataInputChange}
                                className="file-input input-bordered text-sm w-full"
                            /><br />

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



                            {/** AGE, Orientation, SEX, family */}
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

                                {/** Family */}
                                <div>
                                    <label className="fieldset-label font-semibold">
                                        Select a Family (optional)
                                    </label><br />
                                    <select
                                        className="select select-bordered w-full"
                                        value={selectedFamilyId}
                                        onChange={(e) => setSelectedFamilyId(e.target.value)}
                                    >
                                        <option value="">-- Choose a Family --</option>
                                        {families.map((family) => (
                                            <option key={family.id} value={family.id}>
                                                {family.familyName}
                                            </option>
                                        ))}
                                    </select><br />

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
