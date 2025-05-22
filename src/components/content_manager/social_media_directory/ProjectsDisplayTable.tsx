import { useLocation } from "react-router";
import { Fragment } from "react/jsx-runtime";
import PostsPopUpModal from "./PostsPopModal";

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

function ProjectsDisplayTable() {
    const location = useLocation();
    const posts = location.state?.posts as Post[] || []; // Ensure an empty array if undefined
    const postCategory = location.state?.category as string; 
    console.log(posts);
    return (
        <div className="overflow-x-auto">
            <table className="table">
                <thead>
                    <tr>
                        <th>Ad Run</th>
                        <th>Thumbnail + Title</th>
                        <th>Caption</th>
                        <th>Mentions</th>
                        <th>Ad Cost</th>
                        <th>Media</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {posts && posts.length > 0 ? ( // Ensure posts exist
                        posts.map((post, index) => (
                            <Fragment key={index}>
                                <tr>
                                    <td>
                                        <label>
                                            <input
                                                type="checkbox"
                                                className="checkbox"
                                                checked={post.adRun}
                                                disabled
                                            />
                                        </label>
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="avatar">
                                                <div className="mask mask-squircle h-12 w-12">
                                                    <img
                                                        src={post.thumbnail.replace("url(", "").replace(")", "")}
                                                        alt={post.title} />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-bold">{post.title}</div>
                                                <div className="text-sm opacity-50">{post.hashtags}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{(JSON.parse(post.caption)).status}</td>
                                    <td>{post.mentions}</td>
                                    <td>${post.adCost}</td>
                                    <td>
                                        <a
                                            href={post.media}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 underline"
                                        >
                                            View Media
                                        </a>
                                    </td>
                                    <td>
                                        <button 
                                            className="btn btn-ghost btn-xs"
                                            onClick={() => (document.getElementById(postCategory + "" +post.title) as HTMLDialogElement)?.showModal()}
                                            >
                                                Details
                                            </button>
                                        <PostsPopUpModal 
                                            modalId={postCategory + "" + post.title}
                                            post={post}
                                        />
                                    </td>
                                </tr>
                            </Fragment>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={9} className="text-center text-gray-500">
                                No posts available
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

        </div>
    );
}

export default ProjectsDisplayTable;
