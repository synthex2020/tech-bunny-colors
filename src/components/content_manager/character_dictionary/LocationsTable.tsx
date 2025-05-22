import { SeriesLocationCard } from "../../ui/series-location-card";

const testData = [
    {
        "id": "location-001",
        "createdAt": "2025-04-27T14:30:00Z",
        "title": "Black Valley",
        "type": "Battlefield",
        "geoLocation": "45.4215,-75.6992",
        "description": "A desolate valley surrounded by jagged mountains, infamous for the legendary battle that took place there.",
        "locationMedia": [
          "https://media.nomadicmatt.com/2023/historyangkor.jpeg",
          "https://media.nomadicmatt.com/2023/historygiza.jpeg"
        ]
      }
      
];


function LocationsTable() {
    return (
        <div>
            {testData.map((location, index) => {
                return (
                    <div key={index}>
                        <SeriesLocationCard 
                            {
                                ...location
                            }
                        />
                    </div>
                );
            })}
        </div>
    );
}

export default LocationsTable;