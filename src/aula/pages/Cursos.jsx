import {useState} from 'react'
import {Link} from 'react-router-dom'
import {Search,Star,ChevronDown} from 'lucide-react'
import {useLms} from '../store/LmsContext.jsx'
import {Title,Bar,IN} from '../components/ui.jsx'
import {tasks,done,group,fmt,pct,toGrade} from '../lib/lms.js'

export function Pending(){const {db,me,mine}=useLms();const st=me.role==='alumno'
const rows=st?mine.flatMap(c=>tasks(c).filter(t=>!done(db,me.id,t)).map(t=>({c,t,g:group(t.due)}))):[]
const secs=[['vencida','Vencida','No hay elementos vencidos en los últimos 7 días'],['hoy','Vence hoy','No hay elementos pendientes para hoy'],['pronto','Vence pronto','No hay elementos próximos']]
return <aside className="border-slate-200 p-8 lg:w-96 lg:shrink-0 lg:border-l"><h2 className="mb-6 text-xl font-semibold text-slate-800">{st?'Tareas pendientes':'Por calificar'}</h2>
{st?secs.map(([k,t,e])=>{const r=rows.filter(x=>x.g===k);return <div key={k} className="mb-8"><h3 className="mb-3 font-semibold text-slate-800">{t}</h3>{r.length?r.map(({c,t})=>{const d=new Date(t.due);return <Link key={t.id} to={`/aula/cursos/${c.id}/contenido`} className="mb-4 flex gap-4"><div className="w-12 shrink-0 overflow-hidden rounded border border-slate-200 text-center"><div className="bg-sky-200 text-[10px] font-bold uppercase">{d.toLocaleDateString('es-PE',{month:'short'})}</div><div className="text-lg font-bold">{d.getDate()}</div></div><div className="text-sm"><b className="text-navy">{t.title}</b><span className="block text-xs">{c.name}</span><span className="text-xs">{fmt(t.due)}</span></div></Link>}):<p className="rounded bg-slate-100 p-6 text-center text-sm text-slate-500">{e}</p>}</div>}):
mine.filter(c=>toGrade(db,c)).map(c=><Link key={c.id} to={`/aula/cursos/${c.id}/calificaciones`} className="mb-3 flex justify-between rounded bg-slate-100 p-4 text-sm"><b className="text-navy">{c.name}</b><span>{toGrade(db,c)} entregas</span></Link>)}
{!st&&!mine.some(c=>toGrade(db,c))&&<p className="rounded bg-slate-100 p-6 text-center text-sm text-slate-500">No hay entregas pendientes de calificar.</p>}</aside>}

export default function Cursos(){const {db,me,mine,up}=useLms();const [q,setQ]=useState('');const [fav,setFav]=useState(false);const [per,setPer]=useState('');const [open,setOpen]=useState(null)
const list=mine.filter(c=>(c.name+c.code).toLowerCase().includes(q.toLowerCase())&&(!fav||db.fav[me.id+':'+c.id])&&(!per||c.period===per))
const periods=[...new Set(mine.map(c=>c.period))]
return <div><Title>Cursos</Title><div className="flex flex-col lg:flex-row"><div className="min-w-0 flex-1 p-8">
<div className="mb-6 flex flex-wrap gap-3"><div className="relative min-w-[16rem] flex-1"><Search size={16} className="absolute left-3 top-3 text-slate-500"/><input className={IN+' !py-2.5 pl-9'} placeholder="Busque sus cursos" value={q} onChange={e=>setQ(e.target.value)}/></div>
<select className={IN+' !w-auto !py-2.5'} value={per} onChange={e=>setPer(e.target.value)}><option value="">Todos los períodos</option>{periods.map(p=><option key={p}>{p}</option>)}</select>
<select className={IN+' !w-auto !py-2.5'} value={fav?'f':''} onChange={e=>setFav(e.target.value==='f')}><option value="">Todos los cursos</option><option value="f">Favoritos</option></select></div>
<p className="mb-6 text-sm">{list.length} resultados</p>
{periods.filter(p=>list.some(c=>c.period===p)).map(p=><div key={p} className="mb-8"><h2 className="mb-4 text-lg text-slate-800">{p} - Formación Profesional</h2><div className="space-y-5">{list.filter(c=>c.period===p).map(c=>{const f=db.fav[me.id+':'+c.id];const t=db.users.find(u=>u.id===c.teacherId)
return <div key={c.id} className="flex border border-slate-300 bg-white"><div className="w-3.5 shrink-0" style={{background:c.color}}/><div className="flex-1 p-5"><div className="flex items-start justify-between gap-4"><Link to={`/aula/cursos/${c.id}/contenido`} className="group"><span className="block text-sm text-slate-500">{c.code}</span><b className="text-[17px] uppercase text-slate-800 group-hover:text-brand">{c.name}</b></Link><button onClick={()=>up(d=>{d.fav[me.id+':'+c.id]=!d.fav[me.id+':'+c.id]})} aria-label="Favorito"><Star size={22} fill={f?'#eab308':'none'} className={f?'text-yellow-500':'text-slate-500'}/></button></div>
<div className="mt-2 flex flex-wrap items-center gap-3 text-sm"><span>Abierto</span><span className="text-brand">|</span><span className="uppercase">{t?.name||'Sin docente'}</span><span className="text-brand">|</span><button onClick={()=>setOpen(open===c.id?null:c.id)} className="inline-flex items-center gap-1">Más información <ChevronDown size={14} className={open===c.id?'rotate-180':''}/></button></div>
{open===c.id&&<div className="mt-4 border-t border-slate-100 pt-4 text-sm"><p>{c.desc}</p><p className="mt-2">{c.students.length} estudiantes matriculados</p></div>}
{me.role==='alumno'&&<div className="mt-4 max-w-xs"><Bar v={pct(db,me.id,c)}/><span className="text-xs">{pct(db,me.id,c)}% completado</span></div>}</div></div>})}</div></div>)}
{!list.length&&<p className="rounded bg-slate-100 p-8 text-center text-sm text-slate-500">No se encontraron cursos.</p>}</div><Pending/></div></div>}
