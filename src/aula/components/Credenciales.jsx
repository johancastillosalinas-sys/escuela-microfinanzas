import {useLms} from '../store/LmsContext.jsx'
import {Modal,B} from './ui.jsx'
import {who} from '../lib/matricula.js'
export default function Credenciales({e,onClose}){const {db}=useLms();const w=who(db,e),c=e.cred
return <Modal title="Credenciales de acceso" onClose={onClose}>{c?.pass?<><div className="print-area border border-slate-300 bg-white p-8 text-sm text-slate-800"><b className="block text-center text-lg text-navy">ESCUELA SUPERIOR DE MICROFINANZAS</b><h2 className="mb-5 mt-1 text-center font-bold">Credenciales del Aula Virtual</h2>
<p>Alumno: <b>{w.name}</b></p><p>Matrícula: <b>{e.code}</b></p><p className="mt-4">Código de alumno (usuario): <b className="text-lg">{c.code}</b></p><p>Contraseña temporal: <b className="font-mono text-lg">{c.pass}</b></p><p className="mt-4">Dirección: <b>{location.origin}/aula</b></p><p className="mt-4 text-xs">Por seguridad, el sistema te pedirá cambiar esta contraseña en tu primer ingreso.</p></div>
<button onClick={()=>window.print()} className={B+' mt-5'}>Imprimir credenciales</button></>:<p className="text-sm">{c?.existing?'El alumno ya contaba con una cuenta; se lo agregó a su curso.':'Las credenciales ya no están disponibles porque el alumno cambió su contraseña.'}</p>}</Modal>}
