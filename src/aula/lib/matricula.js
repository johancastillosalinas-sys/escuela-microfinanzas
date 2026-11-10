// Reglas de negocio de admisión, órdenes de pago, validación y activación de cuentas (independientes de la interfaz).
import {uid,iso} from '../store/db.js'
const now=()=>iso(0,new Date().getHours(),new Date().getMinutes())
const today=()=>iso(0).slice(0,10)
export const log=(o,t)=>{o.log=[...(o.log||[]),{d:now(),t}]}
export const ST_SOL=['Nueva','En evaluación','Admitida','Rechazada']
export const ST_PAGO=['Emitida','Voucher recibido','Validada','Rechazada','Vencida']
const ACT=['Matriculado','Pendiente de pago','Pago en validación']
export const plazo=d=>d.settings?.plazoDias||5
export const libres=(db,c)=>(c.cupos??30)-db.enrollments.filter(e=>e.courseId===c.id&&ACT.includes(e.status)).length
export const who=(db,e)=>{const r=db.requests.find(x=>x.id===e.reqId),u=db.users.find(x=>x.id===e.userId);return {name:r?.name||u?.name||'—',dni:r?.dni||u?.dni||'—',email:r?.email||u?.email||''}}
export const first=(db,e)=>db.payments.find(p=>p.enrId===e.id)
export const genPass=()=>{const a='ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';return [...crypto.getRandomValues(new Uint32Array(10))].map(x=>a[x%a.length]).join('')}
export function newRequest(d,f){const r={id:uid(),code:'SOL-'+String(d.requests.length+1).padStart(4,'0'),...f,status:'Nueva',date:now(),log:[]};log(r,'Solicitud registrada');d.requests.push(r);return r}
export function matricular(d,r,c,plan,disc){const total=Math.round((c.precio||0)*(1-(+disc||0)/100)),n=plan==='Contado'?1:parseInt(plan)
const e={id:uid(),code:`MAT-${new Date().getFullYear()}-${String(d.enrollments.length+1).padStart(4,'0')}`,reqId:r.id,userId:null,courseId:c.id,plan,disc:+disc||0,total,status:'Pendiente de pago',date:now(),log:[]}
log(e,'Matrícula generada: cupo reservado');d.enrollments.push(e)
for(let i=0;i<n;i++){const p={id:uid(),enrId:e.id,code:`OP-${new Date().getFullYear()}-${String(d.payments.length+1).padStart(4,'0')}`,concept:n===1?'Pago único':`Cuota ${i+1}`,amount:i===n-1?total-Math.round(total/n)*(n-1):Math.round(total/n),vence:iso(plazo(d)+i*30).slice(0,10),status:'Emitida',log:[]};log(p,'Orden de pago emitida');d.payments.push(p)}
log(r,'Orden de pago emitida: '+e.code);return e}
function activate(d,e){const r=d.requests.find(x=>x.id===e.reqId);if(!r)return
let u=d.users.find(x=>x.email.toLowerCase()===r.email.toLowerCase())
if(u)e.cred={existing:true}
else{const code=`${new Date().getFullYear()}-${String(d.users.filter(x=>x.studentCode).length+1).padStart(4,'0')}`;u={id:uid(),name:r.name,email:r.email,studentCode:code,pass:genPass(),mustChange:true,dni:r.dni,role:'alumno'};d.users.push(u);e.cred={code,email:r.email,pass:u.pass}}
e.userId=u.id;const c=d.courses.find(x=>x.id===e.courseId);if(c&&!c.students.includes(u.id))c.students.push(u.id);log(e,'Pago validado: cuenta creada y matrícula activa en el aula virtual')}
export function recompute(d,e){if(['Retirado','Reserva','Vencida'].includes(e.status))return
const ps=d.payments.filter(p=>p.enrId===e.id),v=ps.some(p=>p.status==='Validada'),w=ps.some(p=>p.status==='Voucher recibido')
e.status=v?'Matriculado':w?'Pago en validación':'Pendiente de pago';if(v&&!e.userId)activate(d,e)}
const get=(d,id)=>{const p=d.payments.find(x=>x.id===id);return [p,d.enrollments.find(x=>x.id===p.enrId)]}
export function attachVoucher(d,id,v,by='Postulante'){const [p,e]=get(d,id);Object.assign(p,{...v,reason:'',status:'Voucher recibido'});log(p,'Voucher registrado por '+by);log(e,p.concept+': voucher recibido');recompute(d,e)}
export function validar(d,id,by){const [p,e]=get(d,id);Object.assign(p,{status:'Validada',validatedBy:by,validatedAt:now()});log(p,'Validado por '+by);recompute(d,e)}
export function rechazar(d,id,reason,by){const [p,e]=get(d,id);Object.assign(p,{status:'Rechazada',reason});log(p,`Rechazado por ${by}: ${reason}`);recompute(d,e)}
export function reactivar(d,id){const [p,e]=get(d,id);p.status='Emitida';p.vence=iso(plazo(d)).slice(0,10);e.status='Pendiente de pago';log(p,'Orden reactivada');log(e,'Matrícula reactivada')}
export const vencida=(p,e)=>!e.userId&&['Emitida','Rechazada'].includes(p.status)&&p.vence<today()
export const hasExpired=db=>db.enrollments.some(e=>{const p=e.status==='Pendiente de pago'&&first(db,e);return p&&vencida(p,e)})
export function expire(d){d.enrollments.forEach(e=>{const p=e.status==='Pendiente de pago'&&first(d,e);if(p&&vencida(p,e)){p.status='Vencida';e.status='Vencida';log(p,'Orden vencida');log(e,'Matrícula vencida por falta de pago: cupo liberado')}})}
export function matricularConPago(d,r,c,plan,disc,by){const e=matricular(d,r,c,plan,disc);const p=first(d,e),g=r.pago||{}
attachVoucher(d,p.id,{medio:g.medio,op:g.op,paidDate:g.paidDate,paidAmount:g.paidAmount,img:g.img,imgName:g.imgName,kind:g.kind},'Postulante');validar(d,p.id,by)
r.status='Admitida';log(r,`Pago validado y matrícula ${e.code} generada por ${by}`);return e}
export function observarPago(d,id,reason,by){const r=d.requests.find(x=>x.id===id);r.pago={...r.pago,obs:reason};r.status='En evaluación';log(r,`Comprobante observado por ${by}: ${reason}`)}
export function reenviarPago(d,id,v){const r=d.requests.find(x=>x.id===id);r.pago={...r.pago,...v,obs:''};r.status='En evaluación';log(r,'Nuevo comprobante enviado por el postulante')}
