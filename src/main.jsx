import React from 'react'
import {createRoot} from 'react-dom/client'
import {BrowserRouter,Routes,Route,Navigate} from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import Layout from './site/Layout.jsx'
import Inicio from './site/pages/Inicio.jsx'
import Programas from './site/pages/Programas.jsx'
import Nosotros from './site/pages/Nosotros.jsx'
import Admisiones from './site/pages/Admisiones.jsx'
import Blog from './site/pages/Blog.jsx'
import Contacto from './site/pages/Contacto.jsx'
import Inscripcion from './inscripcion/Inscripcion.jsx'
import Aula from './aula/Aula.jsx'
import './index.css'
createRoot(document.getElementById('root')).render(<ErrorBoundary><BrowserRouter><Routes>
<Route path="/aula/*" element={<Aula/>}/>
<Route path="/inscripcion" element={<Inscripcion/>}/>
<Route element={<Layout/>}><Route index element={<Inicio/>}/><Route path="programas" element={<Programas/>}/><Route path="nosotros" element={<Nosotros/>}/><Route path="admisiones" element={<Admisiones/>}/><Route path="blog" element={<Blog/>}/><Route path="contactanos" element={<Contacto/>}/><Route path="*" element={<Navigate to="/" replace/>}/></Route>
</Routes></BrowserRouter></ErrorBoundary>)
