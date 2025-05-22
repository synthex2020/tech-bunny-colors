import { SeriesLocation } from "../../types";
import { SeriesLocationEditModal } from "./series-location-edit-modal";

export function SeriesLocationCard(location: SeriesLocation) {
    const thumnail = location.locationMedia[0];
    return (
        <div className="card bg-base-100 w-96 shadow-sm border">
            <figure>
                <img
                    src={thumnail}
                    alt="Location Thumbnail" />
            </figure>
            <div className="card-body">
                <h2 className="card-title">
                    {location.title}
                    <div className="badge badge-secondary">{location.type}</div>
                </h2>
                <p>{location.description}</p>
                <p>{location.geoLocation}</p>
                <div className="card-actions justify-end">
                    <SeriesLocationEditModal 
                        location={location}
                        onSave={() => {}}
                    />
                </div>
            </div>
        </div>
    );
};

