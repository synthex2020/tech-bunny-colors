import { useState } from 'react';
import SeriesCard from './SeriesCard';

// Interfaces (kept from original code)
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
  const [series] = useState<Series[]>([
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
        }
      ]
    }
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Caleido-Hope Labs Characters and Story Encylopedia</h1>
        <p className="text-xl">
          A collection of our characters and relevant stories
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
        {series.map((item, index) => (
          <SeriesCard
            key={index}
            series={item}
            index={index}
          />
        ))}
      </section>

      <section className="text-center mt-12">
        <h2 className="text-2xl font-semibold mb-4">Interested in one of our Stories?</h2>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Our collection of stories continues to grow. Stay tuned for new series, 
          characters, and exciting narrative worlds waiting to be explored.
        </p>
        <div className="mt-6">
          <button 
            className="btn btn-outline btn-secondary"
            onClick={() => {/* Future: Newsletter signup or notification */}}
          >
            Get Updates
          </button>
        </div>
      </section>
    </div>
  );
}

export default CharacterDirectory;