import { useLocation } from "react-router";
import { useState, ChangeEvent } from "react";


//  ADD NEW SOCIAL MEDIA POST AND SET DATE FOR POSTING 
function AddNewSocialMediaPost() {
    const defaultImages = [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Samson_comic_page.jpg/640px-Samson_comic_page.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/The_Outcasts_of_Poker_Flat_%281919%29_-_Ad_2.jpg/640px-The_Outcasts_of_Poker_Flat_%281919%29_-_Ad_2.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Fantastic_Comics_1.jpg/640px-Fantastic_Comics_1.jpg"
    ];

    const [images, setImages] = useState<string[]>([]);
    const [chosenMediaSite, setChosenMediaSite] = useState("");

    const handleMediaFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const arrayFiles = Array.from(event.target.files);
            const imageSrcs = arrayFiles.map((file) => URL.createObjectURL(file));
            setImages((prev) => [...prev, ...imageSrcs]);
        }else{
            setImages(defaultImages);
        }
    };


    const location = useLocation();
    let projectName = location.state?.title || "";

    return (
        <div className="p-10">

            <div className="flex flex-col lg:flex-row gap-4">

                {/** MEDIA PREVIEW AND ENTRY  */}
                <div className="flex flex-col gap-2">

                    <h1 className="text-5xl font-bold">Add Post for Project : {projectName}</h1>
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
                        onChange={handleMediaFileUpload}
                        multiple
                    />
                </div>

                {/** THE FORM WITH VALIDATION  */}
                <div className="flex flex-col justify-center lg: flex-none">
                    <form className="form">
                        <fieldset className="fieldset space-y-2">

                            <label
                                className="fieldset-label text-3xl font-bold"
                            >
                                Post Title
                            </label><br />
                            <input
                                type="text"
                                className="input input-bordered text-sm w-full"
                                placeholder="Post Title"
                                id="title"
                            /><br />

                            <label
                                className="fieldset-label text-2xl font-bold"
                            >
                                Post Hashtags
                            </label><br />
                            <input
                                type="text"
                                className="input input-bordered w-full text-xs"
                                placeholder="#blackvalleycomics#eelpower#error404"
                                id="hashtags"
                            /><br />

                            <label
                                className="fieldset-label text-2xl font-bold"
                            >
                                Post Target Audience
                            </label><br />
                            <input
                                type="text"
                                className="input input-bordered w-full text-sm"
                                placeholder="Scifi watchers, young adult"
                                id="audience"
                            /><br />

                            {/** Release date and Ad Budget and Social Media Selector */}
                            <div className="flex flex-row justify-center gap-4 space-x-6">

                                {/** Release Date  */}
                                <div>
                                    <label
                                        className="fieldset-label text-lg font-semibold"
                                    >
                                        Post Scheduled Release
                                    </label><br />
                                    <input
                                        type="date"
                                        className="input input-bordered text-sm"
                                        placeholder="yy-mm-dd"
                                        id="releaseDate"
                                    /><br />
                                </div>
                                {/** Ad Budget */}
                                <div>
                                    {/** A CHECK BOX FOR RUNNING ADS AND INPUT NEXT TO IT  */}
                                    <label
                                        className="fieldset-label text-lg font-semibold">
                                        Will the post be advertised?
                                    </label><br />

                                    <div className="flex flex-row flex-wrap gap-2">
                                        <input
                                            type="checkbox"
                                            className="checkbox checkbox-primary"
                                            id="isAd"
                                        />
                                        <input
                                            type="text"
                                            className="input input-bordered text-sm"
                                            placeholder="CAD $40.00"
                                            id="adBudget"
                                        />
                                    </div>
                                </div>
                                {/** Social Media Platform */}
                                <div>
                                    <label
                                        className="fieldset-label text-lg font-semibold"
                                    >
                                        Post Social Media Platform
                                    </label><br />
                                    <div className="flex flex-row flex-wrap">

                                        <input
                                            type="text"
                                            className="input input-bordered text-sm font-extrabold"
                                            placeholder={chosenMediaSite}
                                            id="social"
                                            disabled
                                        /><br />
                                        <div className="dropdown dropdown-bottom">
                                            <div tabIndex={0} role="button" className="btn m-1">Platform ⬇️</div>
                                            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                                                <li>
                                                    <a id="facebookId" onClick={() => {
                                                        setChosenMediaSite("facebook");
                                                     }}>
                                                        Facebook
                                                    </a>
                                                </li>

                                                <li>
                                                    <a id="tiktokId" onClick={() => {
                                                        setChosenMediaSite("tiktok");
                                                     }}>
                                                        Tiktok
                                                    </a>
                                                </li>

                                                <li>
                                                    <a id="mediumId" onClick={() => { 
                                                        setChosenMediaSite("medium");
                                                    }}>
                                                        Medium
                                                    </a>
                                                </li>

                                                <li>
                                                    <a id="linkedInId" onClick={() => { 
                                                        setChosenMediaSite("linkedIn");
                                                    }}>
                                                        LinkedIn
                                                    </a>
                                                </li>

                                                <li>
                                                    <a id="youtubeId" onClick={() => { 
                                                        setChosenMediaSite("youtube");
                                                    }}>
                                                        Youtube
                                                    </a>
                                                </li>

                                                <li>
                                                    <a id="instagramId" onClick={() => {
                                                        setChosenMediaSite("instagram");
                                                     }}>
                                                        Instagram
                                                    </a>
                                                </li>

                                            </ul>
                                        </div>

                                    </div>
                                </div>
                            </div>

                            <label
                                className="fieldset-label text-2xl font-bold">
                                Post Caption
                            </label><br />
                            <textarea
                                className="textarea textarea-bordered textarea-lg text-sm w-full"
                                placeholder="Your Caption"
                                id="caption"
                            /><br />

                            <button className="btn btn-neutral mt-4">Submit</button>

                        </fieldset>
                    </form>
                </div>
            </div>

        </div>

    );
}


export default AddNewSocialMediaPost;
