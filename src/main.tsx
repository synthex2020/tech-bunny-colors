import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import './index.css'
import App from './App.tsx'
import ColorGradientForm from './components/color_gradients/ColorGradients.tsx'
import SocialMediaDiretory from './components/content_manager/social_media_directory/SocialMediaDirectory.tsx'


createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<App/>}/>
      <Route path='colorGradient' element={<ColorGradientForm />}/>
      <Route path='socialDir' element={<SocialMediaDiretory />}/>
    </Routes>
  </BrowserRouter>,
)
