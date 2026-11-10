import {useState} from 'react'
import {Link} from 'react-router-dom'
import {Megaphone,ClipboardList,Mail,Landmark,Target,Eye} from 'lucide-react'
import {useLms} from '../store/LmsContext.jsx'
import {Title,Box,Form,Empty,B} from '../components/ui.jsx'
import Calendar from '../components/Calendar.jsx'
import {uid,iso} from '../store/db.js'
import {tasks,fmt,avg,pct,toGrade} from '../lib/lms.js'

export function Actividad(){const {mine}=useLms()
const ev=mine.flatMap(c=>[...c.notices.map(n=>({k:'a',c,t:n.text,d:n.date})),...tasks(c).map(t=>({k:'t',c,t:t.title,d:t.due}))]).sort((a,b)=>b.d.localeCompare(a.d))
return <div><Title>Actividad</Title><div className="mx-auto max-w-3xl space-y-4 p-8">{ev.map((e,i)=><Link key={i} to={`/aula/cursos/${e.c.id}/${e.k==='a'?'anuncios':'contenido'}`}><Box className="mb-4 flex gap-4 p-5 hover:border-brand">{e.k==='a'?<Megaphone className="text-brand"/>:<ClipboardList className="text-orange-500"/>}<div><b className="text-slate-800">{e.t}</b><span className="block text-xs">{e.c.name} · {e.k==='a'?'Anuncio':'Entrega'} · {fmt(e.d)}</span></div></Box></Link>)}{!ev.length&&<Empty>Sin actividad reciente.</Empty>}</div></div>}

export function CalendarioG(){const {mine}=useLms()
return <div><Title>Calendario</Title><div className="p-8"><Calendar events={mine.flatMap(c=>tasks(c).map(t=>({date:t.due.slice(0,10),title:`${t.title} · ${c.name}`,color:c.color,to:`/aula/cursos/${c.id}/contenido`})))}/></div></div>}

export function Mensajes(){const {db,me,up}=useLms();const [o,setO]=useState(null)
const L=db.messages.filter(m=>m.to===me.id||m.from===me.id).sort((a,b)=>b.date.localeCompare(a.date));const nm=id=>db.users.find(u=>u.id===id)?.name
const others=db.users.filter(u=>u.id!==me.id)
return <div><Title>Mensajes</Title><div className="grid gap-8 p-8 lg:grid-cols-2"><div><h2 className="mb-4 text-lg text-slate-800">Nuevo mensaje</h2><Box className="p-5"><Form label="Enviar" fields={[['to','',others.map(u=>u.name)],['subject','Asunto'],['text','Mensaje']]} onSubmit={v=>up(d=>{d.messages.push({id:uid(),from:me.id,to:others.find(u=>u.name===v.to).id,subject:v.subject,text:v.text,date:iso(0,new Date().getHours(),new Date().getMinutes()),read:false})})}/></Box></div>
<div><h2 className="mb-4 text-lg text-slate-800">Bandeja</h2><div className="space-y-3">{L.map(m=><Box key={m.id} className="p-4"><button className="w-full text-left" onClick={()=>{setO(o===m.id?null:m.id);if(m.to===me.id&&!m.read)up(d=>{d.messages.find(x=>x.id===m.id).read=true})}}><div className="flex items-center gap-3"><Mail size={16} className={m.to===me.id&&!m.read?'text-brand':'text-slate-400'}/><b className="flex-1 text-slate-800">{m.subject}</b><span className="text-xs">{fmt(m.date)}</span></div><span className="text-xs">{m.from===me.id?'Para: '+nm(m.to):'De: '+nm(m.from)}</span></button>{o===m.id&&<p className="mt-3 border-t border-slate-100 pt-3 text-sm">{m.text}</p>}</Box>)}{!L.length&&<Empty>No hay mensajes.</Empty>}</div></div></div></div>}

export function CalifG(){const {db,me,mine}=useLms();const st=me.role==='alumno'
return <div><Title>Calificaciones</Title><div className="grid gap-5 p-8 sm:grid-cols-2 xl:grid-cols-3">{mine.map(c=><Link key={c.id} to={`/aula/cursos/${c.id}/calificaciones`}><Box className="border-l-[14px] p-6 hover:shadow-md" style={{borderLeftColor:c.color}}><span className="text-sm">{c.code}</span><b className="mb-4 block text-lg uppercase text-slate-800">{c.name}</b>{st?<div className="flex gap-8 text-sm"><div><b className="block text-2xl text-navy">{avg(db,me.id,c)}</b>Promedio</div><div><b className="block text-2xl text-navy">{pct(db,me.id,c)}%</b>Avance</div></div>:<div className="text-sm"><b className="text-2xl text-navy">{toGrade(db,c)}</b> entregas por calificar</div>}</Box></Link>)}{!mine.length&&<Empty>Sin cursos.</Empty>}</div></div>}

export function Institucion(){return <div><Title>Página de la institución</Title><div className="mx-auto max-w-3xl space-y-5 p-8"><Box className="p-8"><Landmark className="mb-4 text-brand" size={30}/><h2 className="mb-2 text-2xl font-bold text-navy">Escuela Superior de Microfinanzas</h2><p>Formando líderes para el desarrollo económico, empresarial y social del Perú.</p></Box>
<div className="grid gap-5 sm:grid-cols-2"><Box className="p-6"><Target className="mb-2 text-brand"/><b className="text-navy">Misión</b><p className="text-sm">Formar profesionales y líderes capaces de generar soluciones y oportunidades para el desarrollo económico sostenible.</p></Box><Box className="p-6"><Eye className="mb-2 text-brand"/><b className="text-navy">Visión</b><p className="text-sm">Ser una institución referente en formación especializada para el desarrollo financiero, empresarial y social.</p></Box></div><a href="/" className={B}>Ir al sitio web</a></div></div>}
