import {useState} from 'react'
import {Search} from 'lucide-react'
import {load,save} from '../aula/store/db.js'
import {attachVoucher,reenviarPago,vencida} from '../aula/lib/matricula.js'
import VoucherForm from './VoucherForm.jsx'
const NEXT={'Nueva':'Recibimos tu solicitud. Admisiones revisará tus datos y tu comprobante de pago.','En evaluación':'Tu solicitud está en evaluación. Podemos contactarte si necesitamos algo más.','Admitida':'Tu solicitud fue aprobada. El administrador gestionará tu matrícula.','Rechazada':'Tu solicitud no pudo ser aprobada. Contáctanos para más información.'}
const Box=({c,children})=><div className={`rounded-xl p-5 text-sm ${c}`}>{children}</div>
export default function Consulta(){const [c,setC]=useState('');const [d,setD]=useState('');const [q,setQ]=useState(null);const [,tick]=useState(0)
const db=q?load():null;const x=db&&db.requests.find(y=>y.code===q.c&&y.dni.toUpperCase()===q.d);const e=x&&db.enrollments.find(y=>y.reqId===x.id);const p=e&&db.payments.find(y=>y.enrId===e.id)
const ven=p&&(p.status==='Vencida'||e.status==='Vencida'||vencida(p,e))
const reenviar=v=>{const dd=load();reenviarPago(dd,x.id,v);save(dd);tick(n=>n+1)}
const send=v=>{const dd=load();attachVoucher(dd,p.id,v);save(dd);tick(n=>n+1)}
return <div><form onSubmit={ev=>{ev.preventDefault();setQ({c:c.trim().toUpperCase(),d:d.trim().toUpperCase()})}}><div className="space-y-3"><input required className="input" placeholder="Código (ej. SOL-0001)" value={c} onChange={ev=>setC(ev.target.value)}/><input required className="input" placeholder="DNI / Pasaporte" maxLength={12} value={d} onChange={ev=>setD(ev.target.value)}/></div><button className="btn mt-5 !px-6 !py-3"><Search size={15}/>Consultar</button></form>
{q&&!x&&<p className="mt-4 text-sm font-semibold text-red-500">No encontramos una solicitud con esos datos.</p>}
{x&&<div className="mt-5 space-y-4"><Box c="bg-slate-50 dark:bg-white/5"><b className="text-navy dark:text-white">{x.program} · {x.period}</b><p className="my-1">Estado de la solicitud: <b className="text-brand">{x.status}</b></p>{!e&&<p>{NEXT[x.status]}</p>}{e&&<p>Matrícula <b>{e.code}</b>: {e.status}</p>}</Box>
{!e&&x.pago?.obs&&<Box c="border border-red-200"><b className="text-red-600">Tu comprobante fue observado</b><p className="mb-4 mt-1">Motivo: {x.pago.obs}</p><VoucherForm variant="site" order={{code:x.code,amount:x.pago.paidAmount}} cuentas={db.settings.cuentas} onSave={reenviar}/></Box>}
{!e&&x.pago&&!x.pago.obs&&x.status!=='Rechazada'&&<Box c="bg-sky-50 text-sky-800">Recibimos tu comprobante (operación {x.pago.op}). Está en revisión; cuando se valide tu pago, el administrador realizará tu matrícula.</Box>}
{e&&e.userId&&<Box c="bg-green-50 text-green-800">¡Tu pago fue validado y tu matrícula está activa! Admisiones te entregará tu código de alumno y tu contraseña temporal para ingresar al <a href="/aula" target="_blank" rel="noreferrer" className="font-bold underline">Aula Virtual</a>.</Box>}
{e&&!e.userId&&ven&&<Box c="bg-red-50 text-red-700">Tu orden de pago venció y el cupo fue liberado. Contáctanos para reactivarla.</Box>}
{e&&!e.userId&&!ven&&p&&p.status==='Voucher recibido'&&<Box c="bg-sky-50 text-sky-800">Recibimos tu voucher (operación {p.op}). Está en revisión.</Box>}
{e&&!e.userId&&!ven&&p&&['Emitida','Rechazada'].includes(p.status)&&<div className="rounded-xl border border-slate-200 p-5 dark:border-white/10"><h4 className="mb-3 font-bold text-navy dark:text-white">{p.status==='Rechazada'?'Tu voucher fue rechazado. Súbelo nuevamente':'Paga y sube tu voucher'}</h4>{p.reason&&<p className="mb-3 text-sm font-semibold text-red-500">Motivo: {p.reason}</p>}<VoucherForm variant="site" order={p} cuentas={db.settings.cuentas} onSave={send}/></div>}</div>}</div>}
