import './App.css'
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
  return (
    <div className='grid grid-clos-4 gap-4'>
      {/** THEME COLOR GRADIENT SELECTOR */}
      <div className="card card-compact bg-base-100 w-96 shadow-xl">
        <figure>
          <img
            src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
            alt="Shoes" />
        </figure>
        <div className="card-body">
          <h2 className="card-title">Themes and Colors Gradient Selector</h2>
          <p>Select themes and colors with a given gradient</p>
          <div className="card-actions justify-end">
            <button className="btn btn-primary">View</button>
          </div>
        </div>
      </div>

      {/** SOCIAL MEDIA DIRECOTORY  */}
      <div className="card card-compact bg-base-100 w-96 shadow-xl">
        <figure>
          <img
            src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
            alt="Shoes" />
        </figure>
        <div className="card-body">
          <h2 className="card-title">Social Media Directory</h2>
          <p>A collection of content meant to be posted publically</p>
          <div className="card-actions justify-end">
            <button className="btn btn-primary">View</button>
          </div>
        </div>
      </div>

      {/** CHARACTER DIRECTORY  */}
      <div className="card card-compact bg-base-100 w-96 shadow-xl">
        <figure>
          <img
            src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
            alt="Shoes" />
        </figure>
        <div className="card-body">
          <h2 className="card-title">Character Directory</h2>
          <p>Collection of characters and their related assets such as references and character sheets</p>
          <div className="card-actions justify-end">
            <button className="btn btn-primary">View</button>
          </div>
        </div>
      </div>

      {/** BRANDING KITS  */}
      <div className="card card-compact bg-base-100 w-96 shadow-xl">
        <figure>
          <img
            src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
            alt="Shoes" />
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
