
interface Project {

    title: string,
    media: string,
    caption: string,
    hashtags: string,
    tags: string,
    targetAudience: string,
    adRun: boolean,
    budget: string
}

interface PopUpProps {
    project: Project,
    modalId: string
}

function ProjectPopUpModal(project: PopUpProps) {

    let projectTitle = project.project.title;
    let projectMedia = project.project.media;
    let projectCaption = project.project.caption;
    let projectHashtags = project.project.hashtags;
    let projectTags = project.project.tags;
    let projectAuidence = project.project.targetAudience;
    let projectAdRun = project.project.adRun;
    let projectCost = project.project.budget;
    let modelName = project.modalId;

    return (
        <dialog id={modelName} className="modal">
            <div className="modal-box w-11/12 max-w-5xl">
                <h3 className="font-bold text-lg">{projectTitle}</h3>

                <div>
                    {/** ROW WITH MEDIA ON THE LEFT AND ENTRIES ON THE RIGHT  */}
                    <div className="hero">
                        <div className="hero-content flex-col lg:flex-row">
                            {/** IN THE FUTURE OPTIMIZE FOR VIDEO AS WELL */}
                            <img
                            src={projectMedia}
                                className="max-w-sm rounded-lg shadow-2xl" />
                            <div>
                                <h1 className="text-2xl font-bold">{projectAuidence}</h1>
                                <p className="text text-lg">
                                    Ad Run : {projectAdRun.toString()} <br/> Cost: ${projectCost}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-2 border-solid">
                    {/** PROJECT COMPLETE CAPTION + HASHTAGS  */}
                    <p className="text text-lg pt-2 pb-2 pr-2 pl-2">
                        {projectCaption} <br /> {projectHashtags} <br /> {projectTags}
                    </p>
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
} // end project pop up modal 

export default ProjectPopUpModal;