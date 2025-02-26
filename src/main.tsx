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


createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<App/>}/>
      <Route path='/socialDir/projectsTable' element={<ProjectsDisplayTable />}/>
      <Route path='brandingKit' element={<BrandingKit/>}/>
      <Route path='characterDir' element={<CharacterDirectory />}/>
      <Route path='/characterDir/charactersTable' element={<CharacterTable />} />
      <Route path='/characterDir/locationsTable' element={<LocationsTable />} />
      <Route path='/characterDir/importantEvents' element={<ImportantEventsTable />} />
      <Route path='colorGradient' element={<ColorGradientForm />}/>
      <Route path='socialDir' element={<SocialMediaDiretory />}>
      </Route>
    
    </Routes>
  </BrowserRouter>,
)
