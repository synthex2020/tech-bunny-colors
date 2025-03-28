import { useNavigate } from "react-router";
import SeriesCard from "./SeriesCard";


// SHOW SERIES CARDS FIRST AND THEY LEAD TO CHARACTER TABLE
interface Locations {
  title: string;
  type: string;
  geoLocation: string;
  description: string;
  images: string[];
}

interface ImportantEvents {
  title: string;
  date: string;
  importance: string;
  description: string;
  images: string[];
}

interface Character {
  name: string;
  titles: string;
  sex: string;
  gender: string;
  species: string;
  personality: string;
  family: string[];
  hair: string;
  fashion: string;
  quirks: string;
  relationship: string;
  orientation: string;
  race: string;
  age: string;
  images: string[];
  powers: string;
  martialArts: string;
  hobbies: string;
  equipment: string;
  backstory: string;
  references: string;
  referenceImages: string[];
  characterSheet: string;
  bodyModifications: string;
  anatomyMeasurements: string
}

//  style, 
interface Series {

  title: string;
  authors: string;
  artists: string;
  genre: string;
  age: string;
  thumbnail: string;
  description: string;
  plot: string;
  auidence: string;
  history: string;
  physics: string;
  world: string;
  issues: number;
  volumes: number;
  merchandised: boolean;
  published: boolean;
  currentStatus: string;
  powerSystem: string[];
  images: string[];
  timeline: ImportantEvents[];
  locations: Locations[];
  characters: Character[];
}


function CharacterDirectory() {
  const series = [
    {
      "title": "Chronicles of Etheria",
      "authors": "J.D. Blackwood",
      "artists": "Lina Carter",
      "genre": "Fantasy",
      "age": "16+",
      "thumbnail": "https://picsum.photos/300/400",
      "description": "A high fantasy epic set in the mystical realm of Etheria, where magic and destiny intertwine.",
      "plot": "A war between celestial beings and mortals threatens to destroy the balance of Etheria.",
      "auidence": "Young Adult",
      "history": "A thousand-year-old prophecy predicts the rise of a chosen one.",
      "physics": "Magic is governed by elemental forces bound to the world's ley lines.",
      "world": "Etheria is composed of vast kingdoms, each with its own culture and ruler.",
      "issues": 25,
      "volumes": 5,
      "merchandised": true,
      "published": true,
      "currentStatus": "Ongoing",
      "powerSystem": ["Elemental Magic", "Divine Blessings", "Runic Enchantments"],
      "images": [
        "https://picsum.photos/800/600",
        "https://picsum.photos/801/600"
      ],
      "timeline": [
        {
          "title": "The Great War Begins",
          "date": "Year 1001",
          "importance": "Major",
          "description": "The war between the celestial beings and mortals erupts, reshaping Etheria.",
          "images": [
            "https://picsum.photos/802/600",
            "https://picsum.photos/803/600"
          ]
        },
        {
          "title": "Rise of the Chosen One",
          "date": "Year 1025",
          "importance": "Critical",
          "description": "A mysterious warrior is foretold to end the war and bring peace.",
          "images": [
            "https://picsum.photos/804/600",
            "https://picsum.photos/805/600"
          ]
        }
      ],
      "locations": [
        {
          "title": "Kingdom of Eldoria",
          "type": "Capital City",
          "geoLocation": "45.6789° N, 123.4567° W",
          "description": "A grand city built upon ancient ruins, ruled by the Etherian monarchy.",
          "images": [
            "https://picsum.photos/806/600",
            "https://picsum.photos/807/600"
          ]
        },
        {
          "title": "The Forbidden Forest",
          "type": "Mystical Forest",
          "geoLocation": "38.6789° N, 110.2345° W",
          "description": "A dense, enchanted forest where time flows differently.",
          "images": [
            "https://picsum.photos/808/600",
            "https://picsum.photos/809/600"
          ]
        }
      ],
      "characters": [
        {
          "name": "Lyra Nightshade",
          "titles": "The Celestial Warrior",
          "sex": "Female",
          "gender": "Woman",
          "species": "Half-Elf",
          "personality": "Brave, Determined, Compassionate",
          "family": ["King Alden Nightshade", "Queen Elara Nightshade"],
          "hair": "Silver",
          "fashion": "Battle armor with celestial engravings",
          "quirks": "Always carries a star-shaped pendant",
          "relationship": "Complicated",
          "orientation": "Bisexual",
          "race": "Half-Elven",
          "age": "120",
          "images": [
            "https://picsum.photos/810/600",
            "https://picsum.photos/811/600"
          ],
          "powers": "Celestial Energy Manipulation",
          "martialArts": "Swordsmanship, Archery",
          "hobbies": "Stargazing, Reading ancient scrolls",
          "equipment": "Celestial Blade, Enchanted Armor",
          "backstory": "Born under a prophecy, Lyra was raised in secrecy to harness her celestial powers.",
          "references": "Ancient Etherian Scrolls",
          "referenceImages": [
            "https://picsum.photos/812/600",
            "https://picsum.photos/813/600"
          ],
          "characterSheet": "https://picsum.photos/814/600",
          "bodyModifications": "Celestial markings on arms",
          "anatomyMeasurements": "5'9\", athletic build"
        },
        {
          "name": "Draven Shadowborn",
          "titles": "The Exiled Prince",
          "sex": "Male",
          "gender": "Man",
          "species": "Dark Elf",
          "personality": "Brooding, Intelligent, Fiercely Loyal",
          "family": ["Unknown"],
          "hair": "Black",
          "fashion": "Dark leather armor, red cape",
          "quirks": "Always seen with a raven companion",
          "relationship": "Single",
          "orientation": "Straight",
          "race": "Dark Elven",
          "age": "250",
          "images": [
            "https://picsum.photos/815/600",
            "https://picsum.photos/816/600"
          ],
          "powers": "Shadow Magic, Illusions",
          "martialArts": "Dual Dagger Combat",
          "hobbies": "Alchemy, Playing the lute",
          "equipment": "Twin Shadow Daggers, Enchanted Cloak",
          "backstory": "Once a prince of the Dark Elves, exiled for refusing to partake in a dark ritual.",
          "references": "Tales of the Shadowborn",
          "referenceImages": [
            "https://picsum.photos/817/600",
            "https://picsum.photos/818/600"
          ],
          "characterSheet": "https://picsum.photos/819/600",
          "bodyModifications": "Ritual scars on his back",
          "anatomyMeasurements": "6'1\", lean but muscular build"
        }
      ]
    }
  ];

  const navigate = useNavigate();

  return (
    <div className="flex flex-col">
      <div>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/characterDir/addNewSeries')}
          >
            Add New Series
        </button>
      </div>

      <div className="flex flex-wrap gap-2">

        {series.map((item, index) => {
          return (
            <SeriesCard
              series={item}
              index={index}
            />
          );
        })}
      </div>

    </div>
  );
} // end character directory 

export default CharacterDirectory;