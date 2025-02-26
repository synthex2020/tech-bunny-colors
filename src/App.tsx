import './App.css'
import { useNavigate } from 'react-router';
import ColorGradientGenerator from './components/color_gradients/ColorGradients';
import ProjectCard from './components/content_manager/social_media_directory/ProjectCard';

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



function App() {
  const navigate = useNavigate();
  return (
    <div className='flex flex-grid grid-clos-4 gap-4 justify-between pr-3 pl-3'>
      {/** THEME COLOR GRADIENT SELECTOR */}
      <div className="card card-compact bg-base-100 w-96 shadow-xl">
        <figure>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Color_of_festival.jpg/640px-Color_of_festival.jpg"
            alt="Shoes" />
        </figure>
        <div className="card-body">
          <h2 className="card-title">Themes and Colors Gradient Selector</h2>
          <p>Select themes and colors with a given gradient</p>
          <div className="card-actions justify-end">
            <button className="btn btn-primary" onClick={() => navigate('colorGradient')}>View</button>
          </div>
        </div>
      </div>

      {/** SOCIAL MEDIA DIRECOTORY  */}
      <div className="card card-compact bg-base-100 w-96 shadow-xl">
        <figure>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Social_media.png/640px-Social_media.png"
            alt="Social Media Directory thumbnail" />
        </figure>
        <div className="card-body">
          <h2 className="card-title">Social Media Directory</h2>
          <p>A collection of content meant to be posted publically</p>
          <div className="card-actions justify-end">
            <button className="btn btn-primary" onClick={() => navigate("socialDir")}>View</button>
          </div>
        </div>
      </div>

      {/** CHARACTER DIRECTORY  */}
      <div className="card card-compact bg-base-100 w-96 shadow-xl">
        <figure>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Zulu_2013_-_Zulu_Maids_in_Orange.jpg/640px-Zulu_2013_-_Zulu_Maids_in_Orange.jpg"
            alt="Character Directory thumbnail" />
        </figure>
        <div className="card-body">
          <h2 className="card-title">Character Directory</h2>
          <p>Collection of characters and their related assets such as references and character sheets</p>
          <div className="card-actions justify-end">
            <button className="btn btn-primary" onClick={() => navigate('characterDir')}>View</button>
          </div>
        </div>
      </div>

      {/** BRANDING KITS  */}
      <div className="card card-compact bg-base-100 w-96 shadow-xl">
        <figure>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Audit%C3%B3rio_-_Brazil_Promotion_2015.jpg/640px-Audit%C3%B3rio_-_Brazil_Promotion_2015.jpg"
            alt="Branding Kit Thumbnail" />
        </figure>
        <div className="card-body">
          <h2 className="card-title">Branding Kits</h2>
          <p>Marketing assets for TurboBunny that maybe used by 3rd parties</p>
          <div className="card-actions justify-end">
            <button className="btn btn-primary">View</button>
          </div>
        </div>
      </div>

    </div>
  );
}

export default App
