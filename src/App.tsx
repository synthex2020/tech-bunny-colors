import React from 'react';
import { useNavigate } from 'react-router';
import './App.css';

// Project Card Sample Data (could be moved to a separate file)
const sampleProject = {
  title: "New Comic Release",
  media: "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
  caption: "Our latest comic is now available!",
  hashtags: "#comics #newrelease",
  tags: "action, adventure, sci-fi",
  targetAudience: "Comic Enthusiasts",
  adRun: true,
  cost: "500.00"
};

// Card Configuration Type
interface DirectoryCardProps {
  title: string;
  description: string;
  imageSrc: string;
  altText: string;
  navigateTo: string;
}

// Reusable Directory Card Component
const DirectoryCard: React.FC<DirectoryCardProps> = ({ 
  title, 
  description, 
  imageSrc, 
  altText, 
  navigateTo 
}) => {
  const navigate = useNavigate();

  return (
    <div className="card card-compact bg-base-100 w-96 shadow-xl">
      <figure>
        <img src={imageSrc} alt={altText} />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        <p>{description}</p>
        <div className="card-actions justify-end">
          <button 
            className="btn btn-primary" 
            onClick={() => navigate(navigateTo)}
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
};

// Main App Component
function App() {
  const directoryCards: DirectoryCardProps[] = [
    {
      title: "Themes and Colors Gradient Selector",
      description: "Select themes and colors with a given gradient",
      imageSrc: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Color_of_festival.jpg/640px-Color_of_festival.jpg",
      altText: "Color Gradient Selection",
      navigateTo: '/themes'
    },
    {
      title: "Social Media Directory",
      description: "A collection of content meant to be posted publically",
      imageSrc: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Social_media.png/640px-Social_media.png",
      altText: "Social Media Directory thumbnail",
      navigateTo: "socialDir"
    },
    {
      title: "Character Directory",
      description: "Collection of characters and their related assets such as references and character sheets",
      imageSrc: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Zulu_2013_-_Zulu_Maids_in_Orange.jpg/640px-Zulu_2013_-_Zulu_Maids_in_Orange.jpg",
      altText: "Character Directory thumbnail",
      navigateTo: 'characterDir'
    },
    {
      title: "Branding Kits",
      description: "Marketing assets for TurboBunny that maybe used by 3rd parties",
      imageSrc: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Audit%C3%B3rio_-_Brazil_Promotion_2015.jpg/640px-Audit%C3%B3rio_-_Brazil_Promotion_2015.jpg",
      altText: "Branding Kit Thumbnail",
      navigateTo: '/branding'
    }
  ];

  return (
    <div className="container mx-auto px-4">
      <header className="text-center my-8">
        <h1 className="text-3xl font-bold">TurboBunny Content Management</h1>
        <p className="text-xl text-gray-600 mt-2">Centralized Resource Hub</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {directoryCards.map((card, index) => (
          <DirectoryCard 
            key={index}
            title={card.title}
            description={card.description}
            imageSrc={card.imageSrc}
            altText={card.altText}
            navigateTo={card.navigateTo}
          />
        ))}
      </section>
    </div>
  );
}

export default App;