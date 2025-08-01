import { SeriesEventCard } from "../../ui/series-events-card";


const testData = [
    {
        "id": "event-001",
        "createdAt": "2025-04-28T10:00:00Z",
        "title": "The Battle of Black Valley",
        "date": "2025-06-15",
        "importance": "Major Turning Point",
        "description": "A pivotal battle that determined the fate of the northern territories, involving the key characters from all factions.",
        "eventsMedia": [
          "https://www.usatoday.com/gcdn/media/2020/08/30/USATODAY/usatsports/247WallSt.com-247WS-731827-imageforentry5310.jpg?width=660&height=371&fit=crop&format=pjpg&auto=webp",
          "https://www.usatoday.com/gcdn/media/2020/08/30/USATODAY/usatsports/247WallSt.com-247WS-731827-imageforentry4144.jpg?width=660&height=371&fit=crop&format=pjpg&auto=webp"
        ]
      }
];
//  TODO: ADD A BUTTON THAT LEADS TO A FORM TO ADD A NEW SERIES EVENTSv   

function ImportantEventsTable() {
    return(
        <div>
            {testData.map((seriesEvent, index) => {
                return (
                    <div key={index}>
                        <SeriesEventCard 
                            {
                                ...seriesEvent
                            }
                        />
                    </div>
                );
            })}
        </div>
    );
}

export default ImportantEventsTable;