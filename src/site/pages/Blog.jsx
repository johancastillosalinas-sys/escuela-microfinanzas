import {useState} from 'react'
import {Search,Clock} from 'lucide-react'
import {posts} from '../../data.js'
import {PageHeader} from '../ui.jsx'
export default function Blog(){const [q,setQ]=useState('');const [c,setC]=useState('Todas');const cats=['Todas',...new Set(posts.map(p=>p.c))]
const l=posts.filter(p=>(c==='Todas'||p.c===c)&&p.t.toLowerCase().includes(q.toLowerCase()))
return <><PageHeader title="Noticias y" hl="artículos" sub="Contenido para profesionales, emprendedores y comunidades que quieren seguir creciendo."/>
<section className="sec"><div className="wrap"><div className="mb-14 flex flex-col gap-5 md:flex-row md:items-center md:justify-between"><div className="relative w-full md:max-w-md"><Search size={17} className="absolute left-4 top-4 text-slate-400"/><input className="input !rounded-full !py-3.5 pl-11" placeholder="Buscar artículos…" value={q} onChange={e=>setQ(e.target.value)}/></div>
<div className="flex flex-wrap gap-2">{cats.map(x=><button key={x} onClick={()=>setC(x)} className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${c===x?'bg-navy text-white':'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand dark:bg-white/5 dark:text-slate-300 dark:ring-white/10'}`}>{x}</button>)}</div></div>
<div className="grid gap-8 md:grid-cols-3">{l.map(p=><article key={p.t} className="card overflow-hidden !p-0"><div className="h-48 bg-gradient-to-br from-sky-100 to-cyan-200 dark:from-navy dark:to-slate-800"/><div className="p-8"><span className="text-[11px] font-bold uppercase tracking-widest text-brand">{p.c}</span><h3 className="mb-3 mt-2 text-lg font-bold leading-snug text-navy dark:text-white">{p.t}</h3><p className="mb-6 text-sm leading-7">{p.e}</p><p className="flex items-center gap-2 text-xs"><Clock size={13}/>{p.f} · {p.r} de lectura</p></div></article>)}</div>
{!l.length&&<p className="py-16 text-center">No se encontraron artículos.</p>}</div></section></>}
