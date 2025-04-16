import { ContentItem, deleteContentItem } from "../../../persistence/ContentBankPerisistence";


function ContentCard(content: ContentItem) {
    const handleOnClickEvent = async () => {
        const result = await deleteContentItem(content.id);
        if (result ?? true){
            alert('Content Item deleted');
        }else{
            alert('An error occured unable to delete item');
        }
    };

    return (
        <div className="card bg-base-100 w-96 shadow-sm">
            <figure>
                <img
                    src={content.thumbnail}
                    alt="Shoes" />
            </figure>
            <div className="card-body">
                <h2 className="card-title">
                    {content.title}
                    <div className="badge badge-secondary">{content.category}</div>
                </h2>
                <p>TimeStamp: {content.created_at}</p>
                <div className="card-actions justify-end">
                    <div className="badge badge-outline">
                        <a
                            href={content.media}
                            target="_blank"
                        >View</a>
                    </div>
                    <div className="badge badge-outline">
                        <a
                            onClick={handleOnClickEvent}
                        >Delete</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContentCard;