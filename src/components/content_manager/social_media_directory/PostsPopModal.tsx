
interface Post {
    title: string;
    thumbnail: string;
    media: string;
    caption: string;
    hashtags: string;
    mentions: string;
    adCost: string;
    adRun: boolean;
}

interface PostPopUpModalProps {
    post: Post,
    modalId: string

}


function PostsPopUpModal(post: PostPopUpModalProps) {
    const description = post.post.caption;
    const formattedDescription = JSON.parse(description)
    console.log(post.post.thumbnail + "")
    return (
        <dialog id={post.modalId} className="modal">
            <div className="modal-box w-11/12 max-w-5xl ">
                <h3 className="font-bold text-lg">{post.post.title}</h3>

                <div className="border-2 border-solid">
                    <div>
                        {/** ROW WITH MEDIA ON THE LEFT AND ENTRIES ON THE RIGHT  */}
                        <div className="hero">
                            <div className="hero-content flex-col lg:flex-row">
                                {/** IN THE FUTURE OPTIMIZE FOR VIDEO AS WELL */}
                                <img
                                    src={post.post.thumbnail}
                                    className="max-w-sm rounded-lg shadow-2xl" />
                                <div>
                                    <h1 className="text-2xl font-bold">{post.post.title}</h1>
                                    <p className="text text-lg">
                                        Ad Run : {post.post.adRun.toString()} <br /> Cost: ${post.post.adCost}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        {/** PROJECT COMPLETE CAPTION + HASHTAGS  */}
                        <p className="text text-lg pt-2 pb-2 pr-2 pl-2">
                            {formattedDescription.status} <br /> {post.post.hashtags} <br /> {post.post.mentions}
                        </p>
                    </div>
                </div>
                <div className="modal-action">
                    <form method="dialog">
                        {/* if there is a button, it will close the modal */}
                        <button className="btn">Close</button>
                    </form>
                </div>
            </div>
        </dialog>
    );
}

export default PostsPopUpModal;

