import {useState} from 'react'
import {Upload} from 'lucide-react'
import {fileToData} from '../aula/lib/files.js'
import {B,IN} from '../aula/components/ui.jsx'
const MEDIOS=['Transferencia bancaria','Depósito en banco','Yape','Plin','Agente bancario']
export default function VoucherForm({order,cuentas=[],variant='lms',onSave}){const site=variant==='site',I=site?'input':IN,Bt=site?'btn !px-6 !py-3':B
const hoy=new Date().toLocaleDateString('en-CA');const [f,setF]=useState({medio:MEDIOS[0],op:'',paidDate:'',paidAmount:order.amount});const [file,setFile]=useState(null);const [err,setErr]=useState('');const [busy,setBusy]=useState(false)
const L=t=><label className="mb-1 block text-xs font-semibold">{t}</label>
const submit=async e=>{e.preventDefault();setErr('')
if(!f.op.trim())return setErr('Ingresa el N° de operación.')
if(!f.paidDate||f.paidDate>hoy)return setErr('Ingresa una fecha de pago válida.')
if(!(+f.paidAmount>0))return setErr('Ingresa el monto pagado.')
setBusy(true);try{const v=await fileToData(file);await onSave({medio:f.medio,op:f.op.trim(),paidDate:f.paidDate,paidAmount:+f.paidAmount,img:v.data,imgName:v.name,kind:v.kind})}catch(x){setErr(x.message||'No se pudo registrar el voucher.')}finally{setBusy(false)}}
return <form onSubmit={submit} className="space-y-4">
<div className="rounded-xl bg-sky-50 p-4 text-sm dark:bg-white/5"><b className="text-navy dark:text-white">Orden {order.code}</b><span className="block">Monto a pagar: <b>S/ {order.amount}</b>{order.vence&&<> · Vence: <b>{order.vence}</b></>}</span>
{cuentas.length>0&&<div className="mt-3 space-y-1 border-t border-sky-100 pt-3 text-xs dark:border-white/10"><b>Medios de pago institucionales</b>{cuentas.map(c=><p key={c.medio}>{c.medio}: {c.detalle}</p>)}</div>}</div>
<div className="grid gap-3 sm:grid-cols-2"><div>{L('Medio de pago')}<select className={I} value={f.medio} onChange={e=>setF({...f,medio:e.target.value})}>{MEDIOS.map(m=><option key={m}>{m}</option>)}</select></div><div>{L('N° de operación')}<input className={I} value={f.op} onChange={e=>setF({...f,op:e.target.value})}/></div>
<div>{L('Fecha de pago')}<input type="date" max={hoy} className={I} value={f.paidDate} onChange={e=>setF({...f,paidDate:e.target.value})}/></div><div>{L('Monto pagado (S/)')}<input type="number" step="0.01" className={I} value={f.paidAmount} onChange={e=>setF({...f,paidAmount:e.target.value})}/></div></div>
<div>{L('Voucher (imagen JPG/PNG o PDF)')}<input type="file" accept="image/*,application/pdf" className={I} onChange={e=>setFile(e.target.files[0])}/></div>
{err&&<p className="text-sm font-semibold text-red-500">{err}</p>}
<button disabled={busy} className={Bt+' disabled:opacity-50'}><Upload size={15}/>{busy?'Enviando…':'Enviar voucher'}</button></form>}
