import Facebook from "../../../assets/icons/facebook.svg?react"
import Instagram from "../../../assets/icons/instagram.svg?react"
import LinkedIn from "../../../assets/icons/linkedin.svg?react"
import Medium from "../../../assets/icons/medium.svg?react"
import Tiktok from "../../../assets/icons/tiktok.svg?react"
import Twitter from "../../../assets/icons/twitter.svg?react"
import Youtube from "../../../assets/icons/youtube.svg?react"
import { useNavigate } from "react-router"

interface Posts {
    title: string,
    thumbnail: string,
    media: string,
    caption: string,
    hashtags: string,
    mentions: string,
    adCost: string,
    adRun: boolean,
}

interface Project {
    title: string,
    media: string,
    caption: string,
    hashtags: string,
    tags: string,
    targetAudience: string,
    adRun: boolean,
    budget: string,
    facebook: Posts[],
    instagram: Posts[],
    twitter: Posts[],
    youtube: Posts[],
    tiktok: Posts[],
    linkedIn: Posts[],
    medium: Posts[]
}

interface ProjectProps {
    project: Project;
}

// Define a type for valid social media platforms
type SocialMediaPlatform = 'facebook' | 'instagram' | 'linkedin' | 'medium' | 'tiktok' | 'twitter' | 'youtube' | 'add';

function ProjectCard({ project }: ProjectProps) {
    const navigate = useNavigate();

    // Type-safe social media action mapping
    const socialMediaActions: Record<SocialMediaPlatform, () => void> = {
        'facebook': () => navigate('/socialDir/projectsTable', { state: { "posts": project.facebook } }),
        'instagram': () => navigate('/socialDir/projectsTable', { state: { "posts": project.instagram } }),
        'linkedin': () => navigate('/socialDir/projectsTable', { state: { "posts": project.linkedIn } }),
        'medium': () => navigate('/socialDir/projectsTable', { state: { "posts": project.medium } }),
        'tiktok': () => navigate('/socialDir/projectsTable', { state: { "posts": project.tiktok } }),
        'twitter': () => navigate('/socialDir/projectsTable', { state: { "posts": project.twitter } }),
        'youtube': () => navigate('/socialDir/projectsTable', { state: { "posts": project.youtube } }),
        'add': () => navigate('/socialDir/addNewPost', { state: { "title": project.title } })
    };

    // Type-safe social media icons mapping
    const socialIcons: Record<Exclude<SocialMediaPlatform, 'add'>, React.ReactNode> = {
        'facebook': <Facebook className="w-6 h-6 hover:scale-110 transition-transform" />,
        'instagram': <Instagram className="w-6 h-6 hover:scale-110 transition-transform" />,
        'linkedin': <LinkedIn className="w-6 h-6 hover:scale-110 transition-transform" />,
        'medium': <Medium className="w-6 h-6 hover:scale-110 transition-transform" />,
        'tiktok': <Tiktok className="w-6 h-6 hover:scale-110 transition-transform" />,
        'twitter': <Twitter className="w-6 h-6 hover:scale-110 transition-transform" />,
        'youtube': <Youtube className="w-6 h-6 hover:scale-110 transition-transform" />
    };

    // Type-safe social media button rendering
    const renderSocialMediaButton = (platform: SocialMediaPlatform) => {
        if (platform === 'add') {
            return (
                <button
                    className="btn btn-primary w-full hover:bg-blue-600 transition-colors"
                    onClick={socialMediaActions['add']}
                >
                    Add New Post
                </button>
            );
        }

        return (
            <a
                onClick={socialMediaActions[platform]}
                className="cursor-pointer hover:opacity-75 transition-opacity"
            >
                {socialIcons[platform]}
            </a>
        );
    };

    return (
        <div className="card card-compact bg-base-100 w-96 shadow-2xl rounded-xl overflow-hidden transform transition-all hover:scale-105 hover:shadow-3xl">
            <figure className="relative h-48 overflow-hidden">
                <img
                    src={project.media}
                    alt="Project Thumbnail"
                    className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
                    {project.adRun ? 'Ad Running' : 'Ad Paused'}
                </div>
            </figure>
            <div className="card-body space-y-3">
                <h2 className="card-title text-xl font-bold">{project.title}</h2>

                <div className="space-y-1">
                    <p className="line-clamp-2">{project.caption}</p>
                    <div className="flex flex-col justify-between text-sm">
                        <span className="font-medium">Tags: {project.tags}</span>
                        <span className="font-medium">#{project.hashtags}</span>
                    </div>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg">
                    <span className="text-lg font-semibold text-primary">Budget: {project.budget}</span>
                    <span className="text-sm">Target: {project.targetAudience}</span>
                </div>

                <div className="space-y-2">
                    {renderSocialMediaButton('add')}

                    <div className="card-actions justify-center gap-4 bg-gray-50 p-3 rounded-lg">
                        {(['facebook', 'instagram', 'youtube', 'twitter'] as const).map((platform) => (
                            <div key={platform} className="tooltip" data-tip={platform.charAt(0).toUpperCase() + platform.slice(1)}>
                                {renderSocialMediaButton(platform)}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProjectCard;