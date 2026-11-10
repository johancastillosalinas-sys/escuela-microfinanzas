import {Link,useParams,Navigate} from 'react-router-dom'
import {Home,Mail,Users,FileCheck2,Activity} from 'lucide-react'
import {useLms} from '../store/LmsContext.jsx'
import {pct,ROLE} from '../lib/lms.js'
import {Bar} from '../components/ui.jsx'
import Contenido from '../course/Contenido.jsx'
import {CalTab,Anuncios,Debates,Libro,Logros,Participantes} from '../course/Tabs.jsx'
export default function Course(){const {id,tab='contenido'}=useParams();const {db,me,mine}=useLms();const c=mine.find(x=>x.id===id)
if(!c)return <Navigate to="/aula/cursos" replace/>
const tabs=[['contenido','Contenido'],['calendario','Calendario'],['anuncios','Anuncios'],['debates','Debates'],['calificaciones','Libro de calificaciones'],...(me.role==='alumno'?[['logros','Logros']]:[]),['participantes','Participantes']]
const V={contenido:Contenido,calendario:CalTab,anuncios:Anuncios,debates:Debates,calificaciones:Libro,logros:Logros,participantes:Participantes}[tab]||Contenido
const t=db.users.find(u=>u.id===c.teacherId);const L=k=>`/aula/cursos/${c.id}/${k}`
return <div className="min-h-screen bg-[#f6f6f6] font-lms text-slate-700">
<div className="flex items-center gap-4 bg-[#1d1e22] px-6 py-3.5 text-white"><Link to="/aula/cursos" className="rounded bg-white/10 p-2" aria-label="Inicio"><Home size={18}/></Link><Link to="/aula/cursos" className="text-sm">Cursos ▾</Link><span className="h-6 w-px bg-white/20"/><span className="truncate text-sm font-semibold">{c.code} • {c.name}</span><span className="ml-auto rounded-full bg-sky-200 px-3 py-0.5 text-[10px] font-bold text-navy">ABIERTO</span></div>
<nav className="flex gap-1 overflow-x-auto bg-[#1d1e22] px-4">{tabs.map(([k,l])=><Link key={k} to={L(k)} className={`whitespace-nowrap border-b-4 px-4 py-4 text-[15px] ${tab===k?'border-brand font-semibold text-white':'border-transparent text-slate-300 hover:text-white'}`}>{l}</Link>)}</nav>
<div className="relative flex h-60 items-end p-10 text-white" style={{background:`radial-gradient(circle at 80% 20%,rgba(255,255,255,.18),transparent 40%),linear-gradient(110deg,${c.color},#0b1740 75%)`}}><div><span className="text-lg">{c.code}</span><h1 className="text-4xl font-semibold uppercase">{c.name}</h1></div></div>
<div className="mx-auto grid max-w-[1400px] gap-10 p-8 lg:grid-cols-[1fr_340px]"><section className="min-w-0"><V c={c}/></section>
<aside className="h-fit rounded border border-slate-200 bg-white"><div className="border-b border-slate-200 p-6"><h2 className="mb-4 text-xl text-slate-800">Profesores del curso</h2>{t?<div className="flex items-center gap-3"><span className="flex h-12 w-12 items-center justify-center rounded-full bg-navy text-sm font-bold text-white">{t.name.split(' ').map(x=>x[0]).slice(0,2).join('')}</span><div className="min-w-0 flex-1"><b className="block truncate text-slate-800">{t.name}</b><span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold">INSTRUCTOR_ESM</span></div><Link to="/aula/mensajes" aria-label="Mensaje"><Mail size={18}/></Link></div>:<p className="text-sm">Sin docente asignado.</p>}</div>
<div className="space-y-5 p-6"><h2 className="text-xl text-slate-800">Detalles y acciones</h2>
<div><b className="flex items-center gap-2 text-slate-800"><Users size={16}/>Lista</b><Link className="text-sm text-sky-700 underline" to={L('participantes')}>Ver a los participantes de su curso</Link></div>
<div><b className="flex items-center gap-2 text-slate-800"><FileCheck2 size={16}/>Calificaciones</b><Link className="text-sm text-sky-700 underline" to={L('calificaciones')}>Ver libro de calificaciones</Link></div>
{me.role==='alumno'&&<div><b className="flex items-center gap-2 text-slate-800"><Activity size={16}/>Progreso</b><div className="mt-2"><Bar v={pct(db,me.id,c)}/><span className="text-xs">{pct(db,me.id,c)}% completado</span></div></div>}</div></aside></div></div>}
