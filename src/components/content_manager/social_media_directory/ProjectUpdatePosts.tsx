import ProjectCard from "./ProjectCard"
//  INTEREFACE
interface Posts {
    title: string,
    thumbnail: string,
    media : string,
    caption: string,
    hashtags: string,
    mentions : string,
    adCost : string,
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
    instagram : Posts[],
    twitter : Posts[],
    youtube : Posts[],
    tiktok : Posts[],
    linkedIn : Posts[],
    medium : Posts[]
}


interface ProjectUpdateProps {
    projects: Project[]
}

function ProjectUpdatePosts({projects}: ProjectUpdateProps) {
    console.log(projects);
    return (
        <div className='flex flex-row flex-wrap gap-8'>
            {projects.map((item, index) => {
                return (
                    <div id={index.toString()}>
                        <ProjectCard project={item} />
                    </div>
                );
            })}
        </div>
    );
} // end project Promotional Posts


export default ProjectUpdatePosts;