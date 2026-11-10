import {useState} from 'react'
import {GraduationCap,Lock} from 'lucide-react'
import {useLms} from '../store/LmsContext.jsx'
import {B,IN} from '../components/ui.jsx'
export default function Login(){const {login}=useLms();const [e,setE]=useState('');const [p,setP]=useState('');const [err,setErr]=useState('')
return <div className="grid min-h-screen font-lms lg:grid-cols-2">
<div className="hidden flex-col justify-between bg-gradient-to-br from-navy to-[#0b1740] p-14 text-white lg:flex"><b className="text-2xl">ESM<span className="text-cyan-300"> Aula Virtual</span></b>
<div><span className="mb-6 flex h-16 w-16 items-center justify-center rounded bg-cyan2"><GraduationCap size={30}/></span><h1 className="text-5xl font-extrabold leading-tight">Tu aprendizaje,<br/><span className="text-cyan-300">en un solo lugar</span></h1><p className="mt-5 max-w-md text-lg text-slate-300">Cursos, materiales, tareas, calificaciones y comunicación con tus docentes.</p></div><p className="text-xs text-slate-400">© 2026 Escuela Superior de Microfinanzas</p></div>
<div className="flex items-center justify-center bg-slate-50 p-6"><form onSubmit={x=>{x.preventDefault();if(!login(e,p))setErr('Correo o contraseña incorrectos.')}} className="w-full max-w-md rounded border border-slate-200 bg-white p-10 shadow-sm">
<h2 className="mb-1 font-serif text-3xl text-slate-800">Iniciar sesión</h2><p className="mb-8 text-sm">Acceso exclusivo para alumnos y docentes de ESM.</p>
<label className="mb-1 block text-sm font-semibold text-navy">Código de alumno o correo</label><input required type="text" placeholder="2026-0001 o correo" className={IN+' mb-5'} value={e} onChange={x=>setE(x.target.value)}/>
<label className="mb-1 block text-sm font-semibold text-navy">Contraseña</label><input required type="password" className={IN} value={p} onChange={x=>setP(x.target.value)}/>
{err&&<p className="mt-4 text-sm font-semibold text-red-500">{err}</p>}<button className={B+' mt-7 w-full justify-center !py-3'}><Lock size={15}/>Ingresar</button>
<p className="mt-6 text-xs">Las cuentas son creadas por el administrador de ESM.</p>
<div className="mt-6 rounded bg-sky-50 p-4 text-xs"><b className="text-navy">Cuentas de prueba</b><br/>admin@esm.pe / admin123<br/>docente@esm.pe / docente123<br/>alumno@esm.pe / alumno123</div></form></div></div>}
