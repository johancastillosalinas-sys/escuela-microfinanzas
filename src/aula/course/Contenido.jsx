import {useState} from 'react'
import {FileText,Link2,Video,FolderOpen,ClipboardList,ChevronDown,Trash2,CheckCircle2,Circle} from 'lucide-react'
import {useLms} from '../store/LmsContext.jsx'
import {Box,Form,Modal,B,IN,Empty} from '../components/ui.jsx'
import {uid} from '../store/db.js'
import {done,sub,fmt} from '../lib/lms.js'
const IC={documento:FileText,enlace:Link2,video:Video,carpeta:FolderOpen,tarea:ClipboardList}

function TaskModal({t,c,onClose}){const {db,me,up,can}=useLms();const s=sub(db,t.id,me.id);const [txt,setTxt]=useState(s.text||'')
const set=(u,p)=>up(d=>{d.subs[t.id+':'+u]={...(d.subs[t.id+':'+u]||{}),...p}})
return <Modal title={t.title} onClose={onClose}><p className="mb-1 text-sm">{t.desc}</p><p className="mb-6 text-xs">Entrega: {fmt(t.due)} · {t.points} puntos</p>
{me.role==='alumno'?<><textarea className={IN+' h-32'} placeholder="Escribe tu respuesta o pega el enlace de tu trabajo" value={txt} onChange={e=>setTxt(e.target.value)}/>
<button className={B+' mt-4'} onClick={()=>{set(me.id,{text:txt,date:new Date().toISOString()});onClose()}}>Entregar</button>
{(s.grade??'')!==''&&<div className="mt-6 rounded bg-sky-50 p-4 text-sm"><b className="text-navy">Calificación: {s.grade}/{t.points}</b>{s.feedback&&<p className="mt-1">{s.feedback}</p>}</div>}</>
:<div className="space-y-3">{c.students.map(u=>{const z=sub(db,t.id,u),n=db.users.find(x=>x.id===u)?.name;return <div key={u} className="rounded border border-slate-200 p-4 text-sm"><b className="text-navy">{n}</b><p className="my-2 text-slate-500">{z.text||'Sin entrega'}</p>{can('grade')&&z.text&&<div className="flex gap-2"><input type="number" min="0" max={t.points} placeholder="Nota" className={IN+' !w-24'} defaultValue={z.grade} onBlur={e=>set(u,{grade:e.target.value})}/><input className={IN} placeholder="Retroalimentación" defaultValue={z.feedback} onBlur={e=>set(u,{feedback:e.target.value})}/></div>}</div>})}{!c.students.length&&<Empty>No hay estudiantes matriculados.</Empty>}</div>}</Modal>}

function Row({i,c,depth=0,openTask,rm}){const {db,me,up,can}=useLms();const [o,setO]=useState(true);const I=IC[i.type];const ok=done(db,me.id,i);const st=me.role==='alumno'
const body=<><I size={26} className="shrink-0 text-slate-700"/><div className="min-w-0 flex-1"><b className="text-[17px] text-slate-800">{i.title}</b>{i.desc&&<p className="text-sm">{i.desc}</p>}{i.type==='tarea'&&<p className="text-xs">Entrega: {fmt(i.due)} · {i.points} pts</p>}</div></>
return <div style={{marginLeft:depth*28}} className="mb-4"><Box className="flex items-center gap-4 p-5">
{i.type==='carpeta'?<button onClick={()=>setO(!o)} className="flex flex-1 items-center gap-4 text-left">{body}<ChevronDown className={o?'rotate-180':''}/></button>
:i.type==='tarea'?<button onClick={()=>openTask(i)} className="flex flex-1 items-center gap-4 text-left hover:text-brand">{body}</button>
:<a href={i.url||'#'} target="_blank" rel="noreferrer" className="flex flex-1 items-center gap-4 hover:text-brand">{body}</a>}
{st&&i.type!=='carpeta'&&(i.type==='tarea'?<span className={`text-xs font-bold ${ok?'text-green-600':'text-slate-400'}`}>{ok?'Entregado':'Pendiente'}</span>:<button onClick={()=>up(d=>{d.progress[me.id+':'+i.id]=!d.progress[me.id+':'+i.id]})} className={ok?'text-green-500':'text-slate-300'} aria-label="Completado">{ok?<CheckCircle2/>:<Circle/>}</button>)}
{(can('content.edit')||(i.type==='tarea'&&can('task.create')))&&<button onClick={()=>rm(i.id)} className="text-red-400"><Trash2 size={17}/></button>}</Box>
{i.type==='carpeta'&&o&&<div className="mt-4">{i.children.map(x=><Row key={x.id} i={x} c={c} depth={1} openTask={openTask} rm={rm}/>)}{!i.children.length&&<Empty>Carpeta vacía.</Empty>}</div>}</div>}

export default function Contenido({c}){const {up,can}=useLms();const [t,setT]=useState(null)
const mut=f=>up(d=>f(d.courses.find(x=>x.id===c.id)))
const rm=id=>mut(co=>{co.content=co.content.filter(x=>x.id!==id);co.content.forEach(f=>f.children&&(f.children=f.children.filter(x=>x.id!==id)))})
const add=(it,parent)=>mut(co=>{const f=parent&&co.content.find(x=>x.type==='carpeta'&&x.title===parent);(f?f.children:co.content).push(it)})
const folders=c.content.filter(x=>x.type==='carpeta').map(x=>x.title)
return <div><h2 className="mb-6 text-2xl text-slate-800">Contenido del curso</h2>
{c.content.map(i=><Row key={i.id} i={i} c={c} openTask={setT} rm={rm}/>)}{!c.content.length&&<Empty>Este curso aún no tiene contenido.</Empty>}
{can('content.edit')&&<Box className="mt-8 p-5"><b className="mb-3 block text-navy">Agregar contenido</b><Form label="Agregar" fields={[['title','Título'],['type','',['documento','enlace','video','carpeta']],['_url','Enlace (Drive, YouTube, PDF…)'],['in','',['(Raíz)',...folders]]]} onSubmit={v=>add({id:uid(),type:v.type,title:v.title,url:v._url||'#',...(v.type==='carpeta'?{children:[]}:{})},v.in==='(Raíz)'?null:v.in)}/></Box>}
{can('task.create')&&<Box className="mt-5 p-5"><b className="mb-3 block text-navy">Crear tarea</b><Form label="Crear tarea" fields={[['title','Título'],['_desc','Descripción'],['due','Fecha límite','','datetime-local'],['points','Puntos','','number']]} onSubmit={v=>add({id:uid(),type:'tarea',title:v.title,desc:v._desc,due:v.due,points:+v.points||20})}/></Box>}
{t&&<TaskModal t={t} c={c} onClose={()=>setT(null)}/>}</div>}
