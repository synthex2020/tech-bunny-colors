import React from 'react';
import { useNavigate } from "react-router";

// Define an interface for theme card props
interface ThemeCardProps {
  title: string;
  description: string;
  thumbnail: string;
  navigateTo: string;
}

// Reusable Theme Card Component
const ThemeCard: React.FC<ThemeCardProps> = ({ 
  title, 
  description, 
  thumbnail, 
  navigateTo 
}) => {
  const navigate = useNavigate();

  return (
    <div className="card w-96 bg-base-100 shadow-xl hover:scale-105 transition-transform duration-300">
      <figure className="px-10 pt-10">
        <img 
          src={thumbnail} 
          alt={`${title} Theme Thumbnail`} 
          className="rounded-xl h-48 w-full object-cover"
        />
      </figure>
      <div className="card-body items-center text-center">
        <h2 className="card-title">{title} Theme</h2>
        <p>{description}</p>
        <div className="card-actions">
          <button 
            className="btn btn-primary"
            onClick={() => {
              if (navigateTo.includes("http")){
                window.location.href = navigateTo;
              }else{
                navigate(navigateTo);
              }
            }}
          >
            Explore {title}
          </button>
        </div>
      </div>
    </div>
  );
};

function GradientInit() {
  const themeCards: ThemeCardProps[] = [
    {
      title: "Website",
      description: "A lightweight, modular CSS framework with customizable color themes and components.",
      thumbnail: "https://picsum.photos/seed/daisyui/400/300",
      navigateTo: 'https://daisyui.com/theme-generator/'
    },
    {
      title: "Flutter",
      description: "Google's UI toolkit for building natively compiled applications for mobile, web, and desktop.",
      thumbnail: "https://picsum.photos/seed/flutter/400/300",
      navigateTo: '/themes/colorGradient'
    },
    {
      title: "React Native",
      description: "React native elements styling and text formats",
      thumbnail: "https://picsum.photos/seed/react/400/300",
      navigateTo: '/themes/react-native-elements'
    },

  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Theme Exploration Hub</h1>
        <p className="text-xl text-gray-600">
          Discover and experiment with various design systems and color gradients
        </p>
      </header>

      <div className="flex flex-wrap justify-center gap-8">
        {themeCards.map((card, index) => (
          <ThemeCard 
            key={index}
            title={card.title}
            description={card.description}
            thumbnail={card.thumbnail}
            navigateTo={card.navigateTo}
          />
        ))}
      </div>

      <section className="text-center mt-12">
        <h2 className="text-2xl font-semibold mb-4">More Coming Soon</h2>
        <p className="text-gray-500">
          We're continuously expanding our theme and gradient libraries. 
          Stay tuned for more exciting design options!
        </p>
        <div className="mt-6">
          <button 
            className="btn btn-outline btn-secondary"
            onClick={() => {/* Future: Newsletter signup or notification */}}
          >
            Get Notified
          </button>
        </div>
      </section>
    </div>
  );
}

export default GradientInit;