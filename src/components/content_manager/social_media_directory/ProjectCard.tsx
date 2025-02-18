import Facebook from "../../../assets/icons/facebook.svg?react"
import Instagram from "../../../assets/icons/instagram.svg?react"
import LinkedIn from "../../../assets/icons/linkedin.svg?react"
import Medium from "../../../assets/icons/medium.svg?react"
import Tiktok from "../../../assets/icons/tiktok.svg?react"
import Twitter from "../../../assets/icons/twitter.svg?react"
import Youtube from "../../../assets/icons/youtube.svg?react"

import ProjectPopUpModal from "./ProjectPopUpModal"


//  INTERFACE 
interface Project {
    title: string,
    media: string,
    caption: string,
    hashtags: string,
    tags: string,
    targetAudience: string,
    adRun: boolean,
    cost: string
}

function socialMediaButton(buttonValue: string, project: Project) {

    if (buttonValue == 'facebook') {
        return (
            <a onClick={() => (document.getElementById("facebook") as HTMLDialogElement)?.showModal()}>
                <Facebook />
                <ProjectPopUpModal  
                    project={project}
                    modalId="facebook"
                />
            </a>

        );
    } // end if 

    if (buttonValue == 'instagram') {
        return (
        <a onClick={() => (document.getElementById("instagram") as HTMLDialogElement)?.showModal()}>
            <Instagram />
            <ProjectPopUpModal 
                project={project}
                modalId="instagram"
            />
        </a>);
    } // end if 

    if (buttonValue == 'linkedin') {
        return (
        <a onClick={() => (document.getElementById("linkedin") as HTMLDialogElement)?.showModal()}>
            <LinkedIn />
            <ProjectPopUpModal 
                project={project}
                modalId="linkedin"
            />
        </a>);
    } // end if 

    if (buttonValue == 'medium') {
        return (
        <a onClick={() => (document.getElementById("medium") as HTMLDialogElement)?.showModal()}>
            <Medium />
            <ProjectPopUpModal 
                project={project}
                modalId="medium"
            />
        </a>);
    } // end if 

    if (buttonValue == 'tiktok') {
        return (
            <a onClick={() => (document.getElementById("tiktok") as HTMLDialogElement)?.showModal()}>
                <Tiktok />
                <ProjectPopUpModal 
                    project={project}
                    modalId="tiktok"
            />
            </a>
        );
    } // end if 

    if (buttonValue == 'twitter') {
        return (
        <a onClick={() => (document.getElementById("twitter") as HTMLDialogElement)?.showModal()}>
            <Twitter />
            <ProjectPopUpModal 
                project={project}
                modalId="twitter"
            />
        </a>);
    } // end if 

    if (buttonValue == 'youtube') {
        return (
            <a onClick={() => (document.getElementById("youtube") as HTMLDialogElement)?.showModal()}>
                <Youtube />
                <ProjectPopUpModal 
                    project={project}
                    modalId="youtube"
            />
            </a>
        );
    } // end if 
    return (
        <button className="btn btn-primary">View</button>
    );
}

function ProjectCard(project : Project) {
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
                <h3 className="text text-sm">{project.tags}</h3>
                <h4 className="text text-xs">{project.hashtags}</h4>
                <p className="text text-lg">Has Ad : {project.adRun.toString()}</p>
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