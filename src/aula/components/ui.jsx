import {useState} from 'react'
import {Plus,X} from 'lucide-react'
export const B='inline-flex items-center gap-2 rounded bg-navy px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand'
export const B2='inline-flex items-center gap-2 rounded border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-navy transition hover:border-brand'
export const IN='w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-brand'
export const Box=({className='',...p})=><div className={`rounded border border-slate-200 bg-white ${className}`} {...p}/>
export const Bar=({v})=><div className="h-1.5 w-full rounded-full bg-slate-200"><div className="h-1.5 rounded-full bg-brand transition-all" style={{width:v+'%'}}/></div>
export const Empty=({children})=><p className="rounded bg-slate-100 p-6 text-center text-sm text-slate-500">{children}</p>
export const Title=({children,right})=><div className="flex items-center justify-between border-b border-slate-200 px-8 py-7"><h1 className="font-serif text-4xl text-slate-800">{children}</h1>{right}</div>
export function Form({fields,onSubmit,label}){const [v,setV]=useState({})
const d=Object.fromEntries(fields.filter(f=>Array.isArray(f[2])).map(f=>[f[0],f[2][0]]))
return <form className="flex flex-wrap gap-2" onSubmit={e=>{e.preventDefault();onSubmit({...d,...v});setV({})}}>{fields.map(([k,ph,o,t])=>Array.isArray(o)
?<select key={k} className={IN+' !w-auto'} value={v[k]||o[0]} onChange={e=>setV({...v,[k]:e.target.value})}>{o.map(x=><option key={x}>{x}</option>)}</select>
:<input key={k} type={t||'text'} required={!k.startsWith('_')} className={IN+' !w-auto min-w-[10rem] flex-1'} placeholder={ph} title={ph} value={v[k]||''} onChange={e=>setV({...v,[k]:e.target.value})}/>)}
<button className={B}><Plus size={15}/>{label}</button></form>}
export const Modal=({title,onClose,children,wide})=><div className="fixed inset-0 z-50 flex items-start justify-center overflow-auto bg-black/50 p-4" onClick={onClose}><div className={`my-10 w-full ${wide?'max-w-5xl':'max-w-2xl'} rounded bg-white p-8 shadow-2xl`} onClick={e=>e.stopPropagation()}><div className="mb-6 flex items-start justify-between gap-4"><h3 className="text-xl font-bold text-navy">{title}</h3><button onClick={onClose}><X/></button></div>{children}</div></div>

const TONE={'Nueva':'bg-sky-100 text-sky-700','En evaluación':'bg-amber-100 text-amber-700','Admitida':'bg-green-100 text-green-700','Rechazada':'bg-red-100 text-red-600','Pendiente de pago':'bg-amber-100 text-amber-700','Pago en validación':'bg-sky-100 text-sky-700','Matriculado':'bg-green-100 text-green-700','Retirado':'bg-slate-200 text-slate-600','Reserva':'bg-purple-100 text-purple-700','Pendiente':'bg-amber-100 text-amber-700','En validación':'bg-sky-100 text-sky-700','Validado':'bg-green-100 text-green-700','Emitida':'bg-amber-100 text-amber-700','Voucher recibido':'bg-sky-100 text-sky-700','Validada':'bg-green-100 text-green-700','Vencida':'bg-red-100 text-red-600','Observado':'bg-red-100 text-red-600','Voucher adjunto':'bg-sky-100 text-sky-700','Sin voucher':'bg-slate-100 text-slate-500'}
export const St=({s})=><span className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold ${TONE[s]||'bg-slate-100'}`}>{s}</span>
