export const ROLE={admin:'Administrador',docente:'Docente',alumno:'Alumno'}
const P={admin:['content.edit','task.create','notice.post','grade','users.manage','course.create','enroll'],docente:['task.create','notice.post','grade'],alumno:['submit']}
export const can=(r,a)=>!!P[r]?.includes(a)
export const initials=n=>n.split(' ').slice(0,2).map(x=>x[0]).join('').toUpperCase()
export const fmt=i=>i?new Date(i).toLocaleString('es-PE',{weekday:'short',day:'numeric',month:'numeric',year:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false}).replace(',',' ·'):''
export const group=i=>{const t=new Date(i),n=new Date(),s=new Date(n.getFullYear(),n.getMonth(),n.getDate()),e=new Date(s.getTime()+864e5);return t<s?(t>=s.getTime()-7*864e5?'vencida':'old'):t<e?'hoy':'pronto'}
export const flat=c=>c.content.flatMap(i=>i.type==='carpeta'?i.children:[i])
export const tasks=c=>flat(c).filter(i=>i.type==='tarea')
export const sub=(db,t,u)=>db.subs[t+':'+u]||{}
export const done=(db,u,i)=>i.type==='tarea'?!!sub(db,i.id,u).text:!!db.progress[u+':'+i.id]
export const pct=(db,u,c)=>{const a=flat(c);return a.length?Math.round(a.filter(i=>done(db,u,i)).length/a.length*100):0}
export const grades=(db,u,c)=>tasks(c).map(t=>sub(db,t.id,u).grade).filter(g=>g!==undefined&&g!=='')
export const avg=(db,u,c)=>{const g=grades(db,u,c);return g.length?(g.reduce((a,b)=>a+ +b,0)/g.length).toFixed(1):'—'}
export const toGrade=(db,c)=>tasks(c).reduce((a,t)=>a+c.students.filter(s=>sub(db,t.id,s).text&&(sub(db,t.id,s).grade??'')==='').length,0)
