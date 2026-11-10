import {useLms} from '../store/LmsContext.jsx'
import {Modal,B} from './ui.jsx'
import {who} from '../lib/matricula.js'
export default function Constancia({e,onClose}){const {db}=useLms();const c=db.courses.find(x=>x.id===e.courseId),w=who(db,e)
return <Modal title="Constancia de matrícula" onClose={onClose}><div className="print-area border border-slate-300 bg-white p-10 text-sm text-slate-800"><div className="mb-8 text-center"><b className="block text-xl text-navy">ESCUELA SUPERIOR DE MICROFINANZAS</b><span>Perú</span></div><h2 className="mb-6 text-center text-lg font-bold">CONSTANCIA DE MATRÍCULA</h2>
<p className="mb-5 leading-7">Se deja constancia que <b>{w.name}</b>, con DNI <b>{w.dni}</b>, se encuentra <b>matriculado(a)</b> en el programa <b>{c?.name}</b>, período <b>{c?.period}</b>, con código de matrícula <b>{e.code}</b>.</p>
<p>Modalidad: {c?.modalidad||'—'} · Horario: {c?.horario||'—'}</p><p className="mt-8">Fecha de emisión: {new Date().toLocaleDateString('es-PE')}</p><div className="mt-16 w-56 border-t border-slate-400 pt-1 text-center text-xs">Secretaría Académica</div></div>
<button onClick={()=>window.print()} className={B+' mt-5'}>Imprimir / Guardar como PDF</button></Modal>}
