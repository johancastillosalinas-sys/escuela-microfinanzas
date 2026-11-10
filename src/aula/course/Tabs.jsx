import {useState} from 'react'
import {Link} from 'react-router-dom'
import {Megaphone,Trash2,Award,Lock,MessageSquare,ArrowLeft} from 'lucide-react'
import {useLms} from '../store/LmsContext.jsx'
import {Box,Form,Bar,Empty,IN} from '../components/ui.jsx'
import Calendar from '../components/Calendar.jsx'
import {uid,iso} from '../store/db.js'
import {tasks,sub,grades,avg,pct,done,fmt,flat} from '../lib/lms.js'
const nm=(db,id)=>db.users.find(u=>u.id===id)?.name||'Usuario'

export function CalTab({c}){return <div><h2 className="mb-6 text-2xl text-slate-800">Calendario del curso</h2><Calendar events={tasks(c).map(t=>({date:t.due.slice(0,10),title:t.title,color:c.color,to:`/aula/cursos/${c.id}/contenido`}))}/></div>}

export function Anuncios({c}){const {db,up,can}=useLms();const mut=f=>up(d=>f(d.courses.find(x=>x.id===c.id)))
return <div className="space-y-4"><h2 className="text-2xl text-slate-800">Anuncios</h2>
{can('notice.post')&&<Box className="p-5"><Form label="Publicar" fields={[['text','Escribe un anuncio para el curso']]} onSubmit={v=>mut(x=>{x.notices.unshift({id:uid(),text:v.text,date:iso(0,new Date().getHours(),new Date().getMinutes())})})}/></Box>}
{c.notices.map(n=><Box key={n.id} className="flex gap-4 p-5"><Megaphone className="text-brand"/><div className="flex-1"><p className="text-slate-800">{n.text}</p><span className="text-xs">{fmt(n.date)}</span></div>{can('notice.post')&&<button onClick={()=>mut(x=>{x.notices=x.notices.filter(y=>y.id!==n.id)})} className="text-red-400"><Trash2 size={16}/></button>}</Box>)}
{!c.notices.length&&<Empty>No hay anuncios.</Empty>}</div>}

export function Debates({c}){const {db,me,up}=useLms();const [o,setO]=useState(null);const th=db.threads.filter(t=>t.courseId===c.id);const t=th.find(x=>x.id===o)
const now=()=>iso(0,new Date().getHours(),new Date().getMinutes())
if(t)return <div><button onClick={()=>setO(null)} className="mb-4 flex items-center gap-1 text-sm font-semibold text-brand"><ArrowLeft size={15}/>Debates</button><h2 className="mb-5 text-2xl text-slate-800">{t.title}</h2>
<div className="mb-5 space-y-3">{t.posts.map(p=><Box key={p.id} className="p-5"><b className="text-navy">{nm(db,p.authorId)}</b><span className="ml-3 text-xs">{fmt(p.date)}</span><p className="mt-2 text-slate-800">{p.text}</p></Box>)}</div>
<Form label="Responder" fields={[['text','Escribe tu respuesta']]} onSubmit={v=>up(d=>{d.threads.find(x=>x.id===t.id).posts.push({id:uid(),authorId:me.id,text:v.text,date:now()})})}/></div>
return <div className="space-y-4"><h2 className="text-2xl text-slate-800">Debates</h2><Box className="p-5"><Form label="Nuevo debate" fields={[['title','Tema del debate'],['text','Mensaje inicial']]} onSubmit={v=>up(d=>{d.threads.unshift({id:uid(),courseId:c.id,title:v.title,authorId:me.id,date:now(),posts:[{id:uid(),authorId:me.id,text:v.text,date:now()}]})})}/></Box>
{th.map(x=><button key={x.id} onClick={()=>setO(x.id)} className="block w-full text-left"><Box className="flex items-center gap-4 p-5 hover:border-brand"><MessageSquare className="text-brand"/><div className="flex-1"><b className="text-slate-800">{x.title}</b><span className="block text-xs">{nm(db,x.authorId)} · {fmt(x.date)}</span></div><span className="text-sm">{x.posts.length} mensajes</span></Box></button>)}{!th.length&&<Empty>Aún no hay debates.</Empty>}</div>}

export function Libro({c}){const {db,me}=useLms();const T=tasks(c);const st=me.role==='alumno'
return <div><h2 className="mb-6 text-2xl text-slate-800">Libro de calificaciones</h2><Box className="overflow-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-navy"><tr><th className="p-4">{st?'Actividad':'Estudiante'}</th>{st?<><th>Entrega</th><th>Nota</th></>:<>{T.map(t=><th key={t.id} className="p-4">{t.title}</th>)}<th className="p-4">Promedio</th></>}</tr></thead>
<tbody>{st?T.map(t=>{const s=sub(db,t.id,me.id);return <tr key={t.id} className="border-t border-slate-100"><td className="p-4 font-semibold">{t.title}</td><td>{s.text?'Entregado':'Pendiente'}</td><td>{(s.grade??'')!==''?`${s.grade}/${t.points}`:'—'}</td></tr>})
:c.students.map(u=><tr key={u} className="border-t border-slate-100"><td className="p-4 font-semibold">{nm(db,u)}</td>{T.map(t=>{const s=sub(db,t.id,u);return <td key={t.id} className="p-4">{(s.grade??'')!==''?s.grade:s.text?'Por calificar':'—'}</td>})}<td className="p-4 font-bold text-navy">{avg(db,u,c)}</td></tr>)}</tbody></table>
{!T.length&&<Empty>No hay actividades calificables.</Empty>}</Box>{st&&<p className="mt-4 text-sm">Promedio actual: <b className="text-navy">{avg(db,me.id,c)}</b></p>}</div>}

export function Logros({c}){const {db,me}=useLms();const p=pct(db,me.id,c),n=flat(c).filter(i=>done(db,me.id,i)).length,g=grades(db,me.id,c),a=g.length?g.reduce((x,y)=>x+ +y,0)/g.length:0
const L=[['Primer paso','Completa tu primer contenido',n>=1],['A mitad de camino','Alcanza 50% de avance',p>=50],['Primera entrega','Entrega tu primera tarea',tasks(c).some(t=>done(db,me.id,t))],['Buen desempeño','Promedio de 15 o más',a>=15],['Curso completado','Completa el 100% del curso',p===100]]
return <div><h2 className="mb-6 text-2xl text-slate-800">Logros</h2><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{L.map(([t,d,ok])=><Box key={t} className={`p-6 text-center ${ok?'':'opacity-50'}`}><span className={`mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full ${ok?'bg-yellow-100 text-yellow-600':'bg-slate-100 text-slate-400'}`}>{ok?<Award/>:<Lock/>}</span><b className="text-navy">{t}</b><p className="text-sm">{d}</p></Box>)}</div></div>}

export function Participantes({c}){const {db,up,can}=useLms();const mut=f=>up(d=>f(d.courses.find(x=>x.id===c.id)))
return <div className="space-y-6"><h2 className="text-2xl text-slate-800">Lista de participantes</h2>
{can('enroll')&&<Box className="p-5"><label className="mb-1 block text-sm font-semibold text-navy">Docente del curso</label><select className={IN+' mb-5 max-w-sm'} value={c.teacherId||''} onChange={e=>mut(x=>{x.teacherId=e.target.value})}><option value="">Sin asignar</option>{db.users.filter(u=>u.role==='docente').map(u=><option key={u.id} value={u.id}>{u.name}</option>)}</select>
<b className="mb-3 block text-sm text-navy">Matricular alumnos</b><div className="grid gap-2 sm:grid-cols-2">{db.users.filter(u=>u.role==='alumno').map(u=><label key={u.id} className="flex items-center gap-3 rounded bg-slate-50 p-3 text-sm"><input type="checkbox" checked={c.students.includes(u.id)} onChange={e=>mut(x=>{x.students=e.target.checked?[...x.students,u.id]:x.students.filter(y=>y!==u.id)})}/>{u.name}</label>)}</div></Box>}
<Box className="divide-y divide-slate-100">{[c.teacherId&&{id:c.teacherId,r:'Docente'},...c.students.map(id=>({id,r:'Alumno'}))].filter(Boolean).map(({id,r})=><div key={id} className="flex items-center gap-4 p-4 text-sm"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-navy">{nm(db,id).split(' ').map(x=>x[0]).slice(0,2).join('')}</span><b className="flex-1 text-slate-800">{nm(db,id)}</b><span>{r}</span>{r==='Alumno'&&can('grade')&&<div className="w-32"><Bar v={pct(db,id,c)}/></div>}</div>)}</Box></div>}
