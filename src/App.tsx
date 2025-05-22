import React from 'react';
import { useNavigate } from 'react-router';
import './App.css';

// Project Card Sample Data (could be moved to a separate file

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
      title: "Theme Mapping and Generations",
      description: "Select themes and colors with a given gradient",
      imageSrc: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Color_of_festival.jpg/640px-Color_of_festival.jpg",
      altText: "Color Gradient Selection",
      navigateTo: '/themes'
    },
    {
      title: "Social Media and Marketing ",
      description: "A collection of content meant to be posted publically",
      imageSrc: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Social_media.png/640px-Social_media.png",
      altText: "Social Media Directory thumbnail",
      navigateTo: "socialDir"
    },
    {
      title: "Series and Character Directory",
      description: "Collection of characters and their related assets such as references and character sheets",
      imageSrc: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Zulu_2013_-_Zulu_Maids_in_Orange.jpg/640px-Zulu_2013_-_Zulu_Maids_in_Orange.jpg",
      altText: "Character Directory thumbnail",
      navigateTo: 'characterDir'
    },
    {
      title: "Available Branding Kits",
      description: "Marketing assets for TurboBunny that maybe used by 3rd parties",
      imageSrc: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Audit%C3%B3rio_-_Brazil_Promotion_2015.jpg/640px-Audit%C3%B3rio_-_Brazil_Promotion_2015.jpg",
      altText: "Branding Kit Thumbnail",
      navigateTo: '/branding'
    }
    
  ];

  return (
    <div>

      <header className="text-center my-8">
        <h1 className="text-3xl font-bold">Siziba.dev</h1>
        <p className="text-xl text-gray-600 mt-2">A Caleido-Hope Project</p>
      </header>

      <div className="container mx-auto px-4">

        <section id='mainContent' className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
      {/**
       * 
      <footer className="footer sm:footer-horizontal bg-neutral text-neutral-content items-center p-4">
        <aside className="grid-flow-col items-center">
          <img
            src='/icons/siziba-dev.svg'
            alt='siziba.dev logo'
            className='w-36 h-36'
          />
          <p>Copyright © {new Date().getFullYear()} - All right reserved</p>
          <br />
          <p className='text-sm'>A Caleido-Hope Project</p>
        </aside>
        <nav className="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
          <a>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="fill-current">
              <path
                d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
            </svg>
          </a>
          <a>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="fill-current">
              <path
                d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
            </svg>
          </a>
          <a>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="fill-current">
              <path
                d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
            </svg>
          </a>
        </nav>
      </footer>
       */}
    </div>

  );
}

export default App;