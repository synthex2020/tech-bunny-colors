import { SeriesEvent } from "../../types";
import { SeriesEventsEditModal } from "./series-event-edit-modal";

export function SeriesEventCard(seriesEvent: SeriesEvent) {
    const thumbnail = seriesEvent.eventsMedia[0];
    return (
        <div className="card card-side bg-base-100 shadow-sm border">
            <figure>
                <img
                    src={thumbnail}
                    alt="Even thumbnail" />
            </figure>
            <div className="card-body">
                <h2 className="card-title">{seriesEvent.title}</h2>
                <h3 className="text text-xs">{seriesEvent.date}</h3>
                
                <div className="divider" />

                <p className="text text-sm">{seriesEvent.importance}</p>
                <p className="text text-lg pt-2">{seriesEvent.description}</p>
                
                <div className="card-actions justify-end">
                    <SeriesEventsEditModal 
                        event={seriesEvent}
                        onSave={(updatedEvent) => {}}
                    />
                </div>
            </div>
        </div>
    );
};
