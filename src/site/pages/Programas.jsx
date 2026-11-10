import {useState} from 'react'
import {Search,Clock,Monitor,BarChart3} from 'lucide-react'
import {programs} from '../../data.js'
import {PageHeader} from '../ui.jsx'
import {useSite} from '../ctx.jsx'
export default function Programas(){const {enroll,detail}=useSite();const [q,setQ]=useState('');const [c,setC]=useState('Todos')
const list=programs.filter(p=>(c==='Todos'||p.cat===c)&&(p.t+p.d).toLowerCase().includes(q.toLowerCase()))
return <><PageHeader title="Programas para" hl="transformar tu futuro" sub="Diseñamos experiencias de aprendizaje enfocadas en las necesidades reales del sector financiero, empresarial y social."/>
<section className="sec"><div className="wrap"><div className="mb-14 flex flex-col gap-5 md:flex-row md:items-center md:justify-between"><div className="relative w-full md:max-w-md"><Search size={17} className="absolute left-4 top-4 text-slate-400"/><input className="input !rounded-full !py-3.5 pl-11" placeholder="Buscar programa…" value={q} onChange={e=>setQ(e.target.value)}/></div>
<div className="flex flex-wrap gap-2">{['Todos','Diplomado','Curso','Certificación'].map(x=><button key={x} onClick={()=>setC(x)} className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${c===x?'bg-navy text-white':'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand dark:bg-white/5 dark:text-slate-300 dark:ring-white/10'}`}>{x}</button>)}</div></div>
<div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">{list.map(p=><div key={p.t} className="card flex flex-col"><div className="mb-6 flex items-center justify-between"><span className="ico"><p.I size={22}/></span><span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-brand dark:bg-white/10">{p.cat}</span></div>
<h3 className="mb-3 text-xl font-bold text-navy dark:text-white">{p.t}</h3><p className="mb-6 flex-1 text-sm leading-7">{p.d}</p>
<div className="mb-7 flex flex-wrap gap-x-5 gap-y-2 border-t border-slate-100 pt-5 text-xs dark:border-white/10"><span className="inline-flex items-center gap-1.5"><Clock size={14} className="text-brand"/>{p.dur}</span><span className="inline-flex items-center gap-1.5"><Monitor size={14} className="text-brand"/>{p.mod}</span><span className="inline-flex items-center gap-1.5"><BarChart3 size={14} className="text-brand"/>{p.lvl}</span></div>
<div className="flex gap-3"><button onClick={()=>detail(p)} className="btn2 flex-1 justify-center !px-4 !py-3">Ver detalle</button><button onClick={()=>enroll(p)} className="btn flex-1 !px-4 !py-3">Inscribirme</button></div></div>)}</div>
{!list.length&&<p className="py-16 text-center">No encontramos programas con ese criterio.</p>}</div></section></>}
