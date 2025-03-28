import Facebook from "../../../assets/icons/facebook.svg?react"
import Instagram from "../../../assets/icons/instagram.svg?react"
import LinkedIn from "../../../assets/icons/linkedin.svg?react"
import Medium from "../../../assets/icons/medium.svg?react"
import Tiktok from "../../../assets/icons/tiktok.svg?react"
import Twitter from "../../../assets/icons/twitter.svg?react"
import Youtube from "../../../assets/icons/youtube.svg?react"
import { useNavigate } from "react-router"

//  INTEREFACE
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
//  INTERFACE 
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

function socialMediaButton(buttonValue: string, project: Project) {
    const navigate = useNavigate();

    if (buttonValue == 'facebook') {
        return (
            <a onClick={() => navigate('/socialDir/projectsTable', {
                state: { "posts": project.facebook }
            })}>
                <Facebook />
            </a>

        );
    } // end if 

    if (buttonValue == 'instagram') {
        return (
            <a onClick={() => navigate('/socialDir/projectsTable', {
                state: { "posts": project.instagram }
            })}>
                <Instagram />
            </a>);
    } // end if 

    if (buttonValue == 'linkedin') {
        return (
            <a onClick={() => navigate('/socialDir/projectsTable', {
                state: { "posts": project.linkedIn }
            })}>
                <LinkedIn />
            </a>);
    } // end if 

    if (buttonValue == 'medium') {
        return (
            <a onClick={() => navigate('/socialDir/projectsTable', {
                state: { "posts": project.medium }
            })}>
                <Medium />
            </a>);
    } // end if 

    if (buttonValue == 'tiktok') {
        return (
            <a onClick={() => navigate('/socialDir/projectsTable', {
                state: { "posts": project.tiktok }
            })}>
                <Tiktok />
            </a>
        );
    } // end if 

    if (buttonValue == 'twitter') {
        return (
            <a onClick={() => navigate('/socialDir/projectsTable', {
                state: { "posts": project.twitter }
            })}>
                <Twitter />
            </a>);
    } // end if 

    if (buttonValue == 'youtube') {
        return (
            <a onClick={() => navigate('/socialDir/projectsTable', {
                state: { "posts": project.youtube }
            })}>
                <Youtube />
            </a>
        );
    } // end if 

    if (buttonValue == 'add') {
        return (
            <div
                    className="btn btn-primary"
                    onClick={() => {
                        console.log('clicked');
                        navigate('/socialDir/addNewPost', {
                            state: {
                                "title": project.title
                            }
                        });
                    }}
                >
                    Add new post
                </div>
        );
    }
    return (
        <button className="btn btn-primary">View</button>
    );
}


function ProjectCard({ project }: ProjectProps) {

    return (
        <div className="card card-compact bg-base-100 w-96 shadow-xl">
            <figure>
                {/** TODO: FIGURE OUT MEDIA TYPE AND ACT ACCORDNIGLY */}
                <img
                    src={project.media}
                    alt="Project Thumbnail" />
            </figure>
            <div className="card-body">
                <h2 className="card-title">{project.title}</h2>
                {/** CAPTION + TAGS + HASHTAGS + ADRUN */}
                <p>{project.caption}</p>
                <h3 className="text text-sm">Typical {project.tags}</h3>
                <h4 className="text text-xs">Typical {project.hashtags}</h4>
                <p className="text text-lg">Ad budget : {project.budget}</p>
                {/** ADD NEW SOCIAL MEDIA POST FOR THE PROJECT  */}
                {socialMediaButton('add', project)}
                <div className="card-actions justify-end gap-4">
                    {/** A ROW OF BUTTONS BASED OF ACCESSIBLE SOCIALS */}
                    {socialMediaButton('facebook', project)}
                    {socialMediaButton('instagram', project)}
                    {socialMediaButton('youtube', project)}
                    {socialMediaButton('twitter', project)}
                </div>
            </div>
        </div>
    );
} // end project card 

export default ProjectCard;