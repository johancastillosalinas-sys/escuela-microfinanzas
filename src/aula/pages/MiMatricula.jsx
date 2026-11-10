import {useState} from 'react'
import {useLms} from '../store/LmsContext.jsx'
import {Title,Box,Empty,St,B,B2,Modal} from '../components/ui.jsx'
import Constancia from '../components/Constancia.jsx'
import VoucherForm from '../../components/VoucherForm.jsx'
import {attachVoucher} from '../lib/matricula.js'
export default function MiMatricula(){const {db,me,up}=useLms();const [k,setK]=useState(null);const [v,setV]=useState(null)
const L=db.enrollments.filter(e=>e.userId===me.id);const P=db.payments.find(x=>x.id===v)
return <div><Title>Mi matrícula</Title><div className="mx-auto max-w-4xl space-y-6 p-8">
<Box className="bg-sky-50 p-5 text-sm"><b className="text-navy">Datos para realizar tus pagos</b>{db.settings.cuentas.map(c=><p key={c.medio}>{c.medio}: {c.detalle}</p>)}<p className="mt-2 text-xs">Después de pagar, sube tu voucher en la orden correspondiente. Un administrador lo validará.</p></Box>
{L.map(e=>{const c=db.courses.find(x=>x.id===e.courseId),ps=db.payments.filter(p=>p.enrId===e.id)
return <Box key={e.id} className="p-6"><div className="mb-4 flex flex-wrap items-start justify-between gap-3"><div><span className="text-xs">{e.code}</span><h2 className="text-xl font-bold uppercase text-slate-800">{c?.name}</h2><p className="text-sm">Período {c?.period} · {c?.modalidad||'—'} · {c?.horario||'Horario por confirmar'}</p></div><St s={e.status}/></div>
<div className="overflow-auto"><table className="w-full text-left text-sm"><thead className="text-navy"><tr><th className="py-2">Orden</th><th>Concepto</th><th>Monto</th><th>Vence</th><th>Estado</th><th/></tr></thead><tbody>{ps.map(p=><tr key={p.id} className="border-t border-slate-100 align-top"><td className="py-3 font-semibold">{p.code}</td><td>{p.concept}</td><td>S/ {p.amount}</td><td>{p.vence}</td><td><St s={p.status}/>{p.reason&&<span className="mt-1 block text-xs text-red-500">{p.reason}</span>}</td><td className="text-right">{['Emitida','Rechazada'].includes(p.status)&&<button className={B2+' !py-1.5'} onClick={()=>setV(p.id)}>Subir voucher</button>}</td></tr>)}</tbody></table></div>
{e.status==='Matriculado'&&<button className={B+' mt-5'} onClick={()=>setK(e)}>Ver constancia</button>}</Box>})}
{!L.length&&<Empty>Aún no tienes matrículas registradas.</Empty>}</div>
{v&&P&&<Modal title="Subir voucher de pago" onClose={()=>setV(null)}><VoucherForm order={P} cuentas={db.settings.cuentas} onSave={d=>{up(x=>attachVoucher(x,v,d,me.name));setV(null)}}/></Modal>}
{k&&<Constancia e={k} onClose={()=>setK(null)}/>}</div>}
