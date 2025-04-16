import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import './index.css'
import App from './App.tsx'
import ColorGradientForm from './components/color_gradients/ColorGradients.tsx'
import SocialMediaDiretory from './components/content_manager/social_media_directory/SocialMediaDirectory.tsx'
import CharacterDirectory from './components/content_manager/character_dictionary/CharacterDirectory.tsx'
import BrandingKit from './components/content_manager/branding_kit/BrandingKit.tsx'
import ProjectsDisplayTable from './components/content_manager/social_media_directory/ProjectsDisplayTable.tsx'
import CharacterTable from './components/content_manager/character_dictionary/CharactersTable.tsx'
import LocationsTable from './components/content_manager/character_dictionary/LocationsTable.tsx'
import ImportantEventsTable from './components/content_manager/character_dictionary/ImportantEventsTable.tsx'
import AddNewSocialMediaPost from './components/content_manager/social_media_directory/AddNewPost.tsx'
import AddNewSeries from './components/content_manager/character_dictionary/AddNewSeries.tsx'
import AddNewCharacter from './components/content_manager/character_dictionary/AddNewCharacter.tsx'
import GradientInit from './components/color_gradients/GradientInit.tsx'
import DaisyUIThemePack from './components/theme_selectors/DaisyUIThemePack.tsx'
import UploadContentPage from './components/content_manager/content_managment/AddContent.tsx'


createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<App/>}/>
      <Route path='/socialDir/projectsTable' element={<ProjectsDisplayTable />}/>
      <Route path='/socialDir/addNewPost' element={<AddNewSocialMediaPost />}   />
      <Route path='/socialDir/addContent' element={<UploadContentPage />} />
      <Route path='brandingKit' element={<BrandingKit/>}/>
      <Route path='characterDir' element={<CharacterDirectory />}/>
      <Route path='/characterDir/charactersTable' element={<CharacterTable />} />
      <Route path='/characterDir/locationsTable' element={<LocationsTable />} />
      <Route path='/characterDir/importantEvents' element={<ImportantEventsTable />} />
      <Route path='/characterDir/addNewSeries' element={<AddNewSeries />} />
      <Route path='/characterDir/addNewCharacter' element={<AddNewCharacter />} />
      <Route path='/themes' element={<GradientInit />} />
      <Route path='/themes/colorGradient' element={<ColorGradientForm />}/>
      <Route path='/themes/daisyui' element={<DaisyUIThemePack />} />
      <Route path='socialDir' element={<SocialMediaDiretory />}>
      </Route>
    
    </Routes>
  </BrowserRouter>,
)
