import {useState} from 'react'
import {ShieldCheck} from 'lucide-react'
import {useLms} from '../store/LmsContext.jsx'
import {B,IN} from '../components/ui.jsx'
export default function CambiarClave(){const {me,up,logout}=useLms();const [a,setA]=useState('');const [b,setB]=useState('');const [err,setErr]=useState('')
const go=e=>{e.preventDefault();if(a.length<8)return setErr('La contraseña debe tener al menos 8 caracteres.');if(a!==b)return setErr('Las contraseñas no coinciden.')
up(d=>{const u=d.users.find(x=>x.id===me.id);u.pass=a;u.mustChange=false;d.enrollments.filter(x=>x.userId===u.id).forEach(x=>{x.cred=null})})}
return <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6 font-lms"><form onSubmit={go} className="w-full max-w-md rounded border border-slate-200 bg-white p-10 shadow-sm"><ShieldCheck className="mb-4 text-brand" size={34}/><h1 className="mb-1 font-serif text-3xl text-slate-800">Crea tu contraseña</h1><p className="mb-6 text-sm">Por seguridad, debes reemplazar la contraseña temporal antes de continuar.</p>
<label className="mb-1 block text-sm font-semibold text-navy">Nueva contraseña</label><input required type="password" className={IN+' mb-4'} value={a} onChange={e=>setA(e.target.value)}/><label className="mb-1 block text-sm font-semibold text-navy">Confirmar contraseña</label><input required type="password" className={IN} value={b} onChange={e=>setB(e.target.value)}/>
{err&&<p className="mt-3 text-sm font-semibold text-red-500">{err}</p>}<button className={B+' mt-6 w-full justify-center !py-3'}>Guardar y continuar</button><button type="button" onClick={logout} className="mt-4 block w-full text-center text-xs">Cerrar sesión</button></form></div>}
