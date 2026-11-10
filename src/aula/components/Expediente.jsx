import {useState} from 'react'
import {Modal,St,IN,B,B2,Empty} from './ui.jsx'
import {useLms} from '../store/LmsContext.jsx'
import {libres,matricular,matricularConPago,observarPago,log} from '../lib/matricula.js'
import {fmt} from '../lib/lms.js'
const S=n=>'S/ '+Number(n||0).toLocaleString('es-PE')
const MOT=['Monto no coincide','N° de operación inválido o duplicado','Voucher ilegible','Cuenta de destino incorrecta','Otro']
const Row=({a,b})=><div className="flex justify-between gap-4 border-b border-slate-100 py-2 text-sm"><span className="text-slate-500">{a}</span><b className="text-right text-slate-800">{b||'—'}</b></div>
export default function Expediente({r,onClose,onCred}){const {db,up,me}=useLms()
const e=db.enrollments.find(x=>x.reqId===r.id),secs=db.courses.filter(c=>c.name===r.program&&c.period===r.period),pg=r.pago
const [id,setId]=useState(secs[0]?.id||'');const [plan,setPlan]=useState(r.plan||'Contado');const [dc,setDc]=useState(0);const [mot,setMot]=useState(MOT[0]);const [man,setMan]=useState({})
const c=secs.find(x=>x.id===id),total=Math.round((c?.precio||0)*(1-(+dc||0)/100)),k=plan==='Contado'?1:parseInt(plan),primero=Math.round(total/k),hoy=new Date().toLocaleDateString('en-CA')
const dup=!!pg&&(db.payments.some(x=>x.op&&x.op===pg.op&&x.status!=='Rechazada')||db.requests.some(x=>x.id!==r.id&&x.pago?.op===pg.op&&x.status!=='Rechazada'))
const auto={monto:!!pg&&!!c&&+pg.paidAmount===primero,op:!!pg&&!dup,fecha:!!pg&&pg.paidDate<=hoy}
const ck=key=>auto[key]||!!man[key]
const items=pg?[['monto',`Monto pagado (${S(pg.paidAmount)}) coincide con el primer pago (${S(primero)})`],['op',`N° de operación ${pg.op} no está repetido`],['fecha',`Fecha de pago (${pg.paidDate}) válida`],['cuenta','La cuenta de destino es la correcta'],['legible','El comprobante es legible']]:[]
const ok=items.every(([key])=>ck(key))&&!!c&&libres(db,c)>0
const Vw=()=>pg?.img?(pg.kind==='pdf'?<iframe title="comprobante" src={pg.img} className="h-80 w-full rounded border"/>:<img src={pg.img} alt="Comprobante" className="max-h-80 w-full rounded border object-contain"/>):<Empty>Sin comprobante adjunto.</Empty>
return <Modal wide title={`Expediente ${r.code} · ${r.name}`} onClose={onClose}><div className="grid gap-8 lg:grid-cols-2">
<div><h4 className="mb-2 font-bold text-navy">Datos del postulante</h4><Row a="Documento" b={r.dni}/><Row a="Correo" b={r.email}/><Row a="Teléfono" b={r.phone}/><Row a="Nacimiento" b={r.dob}/><Row a="Dirección" b={r.address}/><Row a="Programa" b={r.program}/><Row a="Período" b={r.period}/><Row a="Plan solicitado" b={r.plan}/><Row a="Nos conoció por" b={r.source}/><Row a="Discapacidad" b={r.disability}/><Row a="Comentarios" b={r.comments}/>
<h4 className="mb-2 mt-6 font-bold text-navy">Historial</h4><ul className="space-y-1 text-xs">{(r.log||[]).slice().reverse().map((l,i)=><li key={i}><b>{fmt(l.d)}</b> · {l.t}</li>)}</ul></div>
<div className="space-y-5"><h4 className="font-bold text-navy">Pago y matrícula</h4>
{e?<div className="rounded-xl bg-green-50 p-5 text-sm text-green-800"><b>Matrícula {e.code}</b> <St s={e.status}/>{e.cred?.pass&&<button onClick={()=>onCred(r.id)} className={B+' mt-4'}>Ver credenciales</button>}</div>:<>
{pg?<><Vw/><div className="text-sm"><Row a="Medio" b={pg.medio}/><Row a="N° de operación" b={pg.op}/><Row a="Fecha de pago" b={pg.paidDate}/><Row a="Monto pagado" b={S(pg.paidAmount)}/>{pg.obs&&<p className="mt-2 text-xs font-semibold text-red-500">Observado: {pg.obs}</p>}</div></>:<Empty>El postulante no adjuntó comprobante. Puedes generar una orden de pago.</Empty>}
{!secs.length?<Empty>No hay secciones para este programa y período. Créala en “Períodos y secciones”.</Empty>:<div className="grid grid-cols-3 gap-3"><div className="col-span-3"><label className="mb-1 block text-xs font-semibold text-navy">Sección</label><select className={IN} value={id} onChange={ev=>setId(ev.target.value)}>{secs.map(s=><option key={s.id} value={s.id}>{s.code} · cupos libres: {libres(db,s)}</option>)}</select></div>
<div className="col-span-2"><label className="mb-1 block text-xs font-semibold text-navy">Plan de pago</label><select className={IN} value={plan} onChange={ev=>setPlan(ev.target.value)}>{['Contado','2 cuotas','3 cuotas'].map(x=><option key={x}>{x}</option>)}</select></div><div><label className="mb-1 block text-xs font-semibold text-navy">Desc. %</label><input type="number" min="0" max="100" className={IN} value={dc} onChange={ev=>setDc(ev.target.value)}/></div></div>}
{pg&&<div className="space-y-2 text-sm">{items.map(([key,t])=><label key={key} className="flex gap-2"><input type="checkbox" checked={ck(key)} disabled={auto[key]} onChange={ev=>setMan({...man,[key]:ev.target.checked})}/><span className={!auto[key]&&['monto','op','fecha'].includes(key)?'text-red-500':''}>{t}</span></label>)}</div>}
<div className="flex flex-wrap gap-3">{pg?<button disabled={!ok} className={B+' disabled:opacity-40'} onClick={()=>{up(d=>matricularConPago(d,d.requests.find(x=>x.id===r.id),d.courses.find(x=>x.id===id),plan,dc,me.name));onClose();onCred(r.id)}}>Validar pago y matricular</button>:<button disabled={!c||libres(db,c)<=0} className={B+' disabled:opacity-40'} onClick={()=>{up(d=>matricular(d,d.requests.find(x=>x.id===r.id),d.courses.find(x=>x.id===id),plan,dc));onClose()}}>Generar orden de pago</button>}
<button className={B2} onClick={()=>{if(confirm('¿Rechazar esta solicitud?')){up(d=>{const x=d.requests.find(y=>y.id===r.id);x.status='Rechazada';log(x,'Solicitud rechazada por '+me.name)});onClose()}}}>Rechazar solicitud</button></div>
{pg&&<div className="flex gap-2 border-t border-slate-100 pt-4"><select className={IN+' !w-auto'} value={mot} onChange={ev=>setMot(ev.target.value)}>{MOT.map(m=><option key={m}>{m}</option>)}</select><button className={B2} onClick={()=>{up(d=>observarPago(d,r.id,mot,me.name));onClose()}}>Observar comprobante</button></div>}</>}</div></div></Modal>}
