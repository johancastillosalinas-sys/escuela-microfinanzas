import {NavLink,Outlet} from 'react-router-dom'
import {Landmark,Globe,BookOpen,CalendarDays,Mail,FileCheck2,Wrench,LogOut,ClipboardList,BadgeCheck} from 'lucide-react'
import {useLms} from '../store/LmsContext.jsx'
import {ROLE,initials} from '../lib/lms.js'
export default function Shell(){const {me,db,logout}=useLms();const un=db.messages.filter(m=>m.to===me.id&&!m.read).length
const nav=[['institucion','Página de la institución',Landmark],['actividad','Actividad',Globe],['cursos','Cursos',BookOpen],['calendario','Calendario',CalendarDays],['mensajes','Mensajes',Mail],['calificaciones','Calificaciones',FileCheck2],...(me.role==='admin'?[['matricula','Matrícula',ClipboardList],['herramientas','Herramientas',Wrench]]:[]),...(me.role==='alumno'?[['mi-matricula','Mi matrícula',BadgeCheck]]:[])]
return <div className="flex min-h-screen flex-col bg-white font-lms text-slate-700 md:flex-row">
<aside className="flex shrink-0 flex-col bg-[#1d1e22] text-slate-300 md:sticky md:top-0 md:h-screen md:w-64">
<div className="px-6 py-6 text-2xl font-extrabold text-white">ESM<span className="text-brand"> Aula</span></div>
<div className="flex items-center gap-3 border-y border-white/10 px-6 py-4"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-600 text-xs font-bold text-white">{initials(me.name)}</span><div className="min-w-0"><b className="block truncate text-sm text-white">{me.name}</b><span className="text-xs text-slate-400">{ROLE[me.role]}</span></div></div>
<nav className="flex gap-1 overflow-x-auto py-2 md:flex-1 md:flex-col md:overflow-visible">{nav.map(([k,t,I])=><NavLink key={k} to={'/aula/'+k} className={({isActive})=>`flex items-center gap-4 whitespace-nowrap px-6 py-3.5 text-[15px] transition ${isActive?'bg-brand font-semibold text-white':'hover:bg-white/10'}`}><I size={20}/><span className="flex-1">{t}</span>{k==='mensajes'&&un>0&&<span className="rounded-full bg-red-500 px-2 text-[11px] text-white">{un}</span>}</NavLink>)}</nav>
<div className="hidden px-6 pb-6 md:block"><button onClick={logout} className="flex items-center gap-4 py-3 text-[15px] hover:text-white"><LogOut size={20}/>Cerrar sesión</button><a href="/" className="text-xs text-slate-400 hover:text-white">← Volver al sitio web</a></div></aside>
<main className="min-w-0 flex-1"><Outlet/></main></div>}
