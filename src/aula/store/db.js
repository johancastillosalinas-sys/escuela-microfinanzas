// Capa de datos. Hoy usa localStorage; para producción se reemplaza por una API (Supabase/Firebase) manteniendo estas funciones.
const K='esm_lms_v2'
const pad=n=>String(n).padStart(2,'0')
export const iso=(n=0,h=23,m=59)=>{const x=new Date();x.setDate(x.getDate()+n);return `${x.getFullYear()}-${pad(x.getMonth()+1)}-${pad(x.getDate())}T${pad(h)}:${pad(m)}`}
export const uid=()=>Math.random().toString(36).slice(2,9)
export const S='esm_lms_session'
export const COLORS=['#a855f7','#f97316','#ec4899','#eab308','#0ea5e0','#22c55e']
const seed=()=>({
users:[{id:'u1',name:'Administrador ESM',email:'admin@esm.pe',pass:'admin123',role:'admin'},{id:'u2',name:'Docente Demo',email:'docente@esm.pe',pass:'docente123',role:'docente'},{id:'u3',name:'Alumno Demo',email:'alumno@esm.pe',pass:'alumno123',role:'alumno'}],
courses:[
{id:'c1',code:'202620-FIN-101',name:'Finanzas y Banca',period:'202620',color:COLORS[0],teacherId:'u2',students:['u3'],desc:'Fundamentos del sistema financiero, microfinanzas y gestión del crédito.',cupos:30,precio:900,modalidad:'Online',horario:'Sábados 9:00–12:00',
content:[{id:'a1',type:'documento',title:'Bienvenida al período 202620',url:'#'},{id:'a2',type:'enlace',title:'Clase en vivo con el docente (Teams)',url:'#'},
{id:'a3',type:'carpeta',title:'Información del curso',desc:'Estimado estudiante, revisa los materiales en el orden indicado.',children:[{id:'a4',type:'documento',title:'Sílabo del curso',url:'#'},{id:'a5',type:'video',title:'Clase 1: Panorama financiero',url:'#'}]},
{id:'a6',type:'tarea',title:'Caso 1: análisis de una IMF',desc:'Resume en una página el caso asignado.',due:iso(6),points:20},
{id:'a7',type:'tarea',title:'Trabajo final del curso',desc:'Entrega el informe final según la rúbrica.',due:iso(20),points:20}],
notices:[{id:'n1',text:'Bienvenidos al curso. Revisen el sílabo antes de la primera clase.',date:iso(-1,9,0)}]},
{id:'c2',code:'202620-EMP-204',name:'Emprendimiento',period:'202620',color:COLORS[1],teacherId:'u2',students:['u3'],desc:'Herramientas prácticas para crear y hacer crecer negocios.',cupos:25,precio:600,modalidad:'Presencial',horario:'Lunes y miércoles 19:00–21:00',
content:[{id:'b1',type:'documento',title:'Guía del curso',url:'#'},{id:'b2',type:'tarea',title:'Plan de negocio: avance 1',desc:'Entrega el modelo de negocio (canvas).',due:iso(0),points:20}],notices:[]}],
progress:{},subs:{},fav:{},
periods:[{id:'p1',code:'202620',name:'Período 2026-II',open:true,inicio:iso(14).slice(0,10)},{id:'p2',code:'202710',name:'Período 2027-I',open:true,inicio:iso(120).slice(0,10)}],
requests:[{id:'r1',code:'SOL-0001',name:'María Quispe Rojas',dni:'72345678',email:'maria@correo.com',phone:'987654321',program:'Finanzas y Banca',period:'202620',msg:'',status:'Nueva',date:iso(-1,15,30),log:[{d:iso(-1,15,30),t:'Solicitud registrada'}]}],
enrollments:[{id:'e1',code:'MAT-2026-0001',reqId:null,userId:'u3',courseId:'c1',plan:'2 cuotas',disc:0,total:900,status:'Matriculado',date:iso(-10,10,0),log:[{d:iso(-10,10,0),t:'Matrícula generada'}]}],
payments:[{id:'y1',enrId:'e1',code:'OP-2026-0001',concept:'Cuota 1',amount:450,vence:iso(-10).slice(0,10),status:'Validada',op:'100234',medio:'Transferencia bancaria',paidAmount:450,paidDate:iso(-11).slice(0,10),log:[]},{id:'y2',enrId:'e1',code:'OP-2026-0002',concept:'Cuota 2',amount:450,vence:iso(20).slice(0,10),status:'Emitida',log:[]}],
settings:{plazoDias:5,cuentas:[{medio:'Transferencia / depósito',detalle:'Banco y N° de cuenta (por configurar)'},{medio:'Yape',detalle:'N° de celular (por configurar)'},{medio:'Plin',detalle:'N° de celular (por configurar)'}]},
threads:[{id:'t1',courseId:'c1',title:'Presentación de participantes',authorId:'u2',date:iso(-1,10,0),posts:[{id:'p1',authorId:'u2',text:'Cuéntanos quién eres y qué esperas del curso.',date:iso(-1,10,0)}]}],
messages:[{id:'m1',from:'u1',to:'u3',subject:'Bienvenido al Aula Virtual',text:'Tu cuenta fue creada. Revisa tus cursos en la sección Cursos.',date:iso(-1,8,0),read:false}]})
const MAP={'Pendiente':'Emitida','En validación':'Voucher recibido','Validado':'Validada'}
const migrate=d=>{d.payments.forEach((p,i)=>{if(MAP[p.status])p.status=MAP[p.status];if(!p.code)p.code='OP-'+new Date().getFullYear()+'-'+String(i+1).padStart(4,'0');if(!p.vence)p.vence=p.due;if(p.voucher&&!p.op)p.op=p.voucher});return d}
export const load=()=>{const s=seed();try{const d=JSON.parse(localStorage.getItem(K));return migrate(d?{...s,...d}:s)}catch{return s}}
export const save=d=>{try{localStorage.setItem(K,JSON.stringify(d))}catch{alert('No hay espacio de almacenamiento en el navegador. Sube un voucher más liviano.')}}
