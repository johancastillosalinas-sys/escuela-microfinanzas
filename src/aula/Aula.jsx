import {useEffect} from 'react'
import {Routes,Route,Navigate} from 'react-router-dom'
import CambiarClave from './pages/CambiarClave.jsx'
import {hasExpired,expire} from './lib/matricula.js'
import {LmsProvider,useLms} from './store/LmsContext.jsx'
import Shell from './components/Shell.jsx'
import Login from './pages/Login.jsx'
import Cursos from './pages/Cursos.jsx'
import Course from './pages/Course.jsx'
import Herramientas from './pages/Herramientas.jsx'
import Matricula from './pages/Matricula.jsx'
import MiMatricula from './pages/MiMatricula.jsx'
import {Actividad,CalendarioG,Mensajes,CalifG,Institucion} from './pages/Global.jsx'
function Gate(){const {me,db,up}=useLms();useEffect(()=>{if(me?.role==='admin'&&hasExpired(db))up(expire)},[me?.id])
if(!me)return <Login/>
if(me.mustChange)return <CambiarClave/>

return <Routes><Route element={<Shell/>}><Route index element={<Navigate to="cursos" replace/>}/><Route path="institucion" element={<Institucion/>}/><Route path="actividad" element={<Actividad/>}/><Route path="cursos" element={<Cursos/>}/><Route path="calendario" element={<CalendarioG/>}/><Route path="mensajes" element={<Mensajes/>}/><Route path="calificaciones" element={<CalifG/>}/>{me.role==='admin'&&<Route path="herramientas" element={<Herramientas/>}/>}{me.role==='admin'&&<Route path="matricula" element={<Matricula/>}/>}{me.role==='alumno'&&<Route path="mi-matricula" element={<MiMatricula/>}/>}</Route>
<Route path="cursos/:id/:tab?" element={<Course/>}/><Route path="*" element={<Navigate to="/aula/cursos" replace/>}/></Routes>}
export default function Aula(){return <LmsProvider><Gate/></LmsProvider>}
