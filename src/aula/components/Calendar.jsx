import {useState} from 'react'
import {Link} from 'react-router-dom'
import {ChevronLeft,ChevronRight} from 'lucide-react'
export default function Calendar({events}){const [m,setM]=useState(()=>{const n=new Date();return new Date(n.getFullYear(),n.getMonth(),1)})
const y=m.getFullYear(),mo=m.getMonth(),days=new Date(y,mo+1,0).getDate()
const cells=[...Array(m.getDay()).fill(null),...Array.from({length:days},(_,i)=>i+1)]
const key=d=>`${y}-${String(mo+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`
return <div><div className="mb-4 flex items-center gap-3"><button onClick={()=>setM(new Date(y,mo-1,1))}><ChevronLeft/></button><b className="w-44 text-center capitalize text-navy">{m.toLocaleDateString('es-PE',{month:'long',year:'numeric'})}</b><button onClick={()=>setM(new Date(y,mo+1,1))}><ChevronRight/></button></div>
<div className="grid grid-cols-7 border-l border-t border-slate-200 bg-white text-xs">{['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'].map(d=><div key={d} className="border-b border-r border-slate-200 bg-slate-50 p-2 text-center font-bold">{d}</div>)}
{cells.map((d,i)=><div key={i} className="min-h-24 border-b border-r border-slate-200 p-1.5">{d&&<><span className="font-semibold">{d}</span>{events.filter(e=>e.date===key(d)).map((e,k)=><Link key={k} to={e.to} className="mt-1 block truncate rounded px-1.5 py-0.5 text-[11px] font-semibold text-white" style={{background:e.color||'#12235a'}} title={e.title}>{e.title}</Link>)}</>}</div>)}</div></div>}
