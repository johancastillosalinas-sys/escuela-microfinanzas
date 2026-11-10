import {Link} from 'react-router-dom'
import {ChevronRight} from 'lucide-react'
export const Eyebrow=({children,center})=><span className={`eyebrow ${center?'justify-center':''}`}>{children}</span>
export const Head=({e,a,b,c,p,center=true})=><div className={`mb-16 max-w-2xl ${center?'mx-auto text-center':''}`}><Eyebrow center={center}>{e}</Eyebrow><h2 className="h2">{a} <span className="text-brand">{b}</span>{c&&<> {c}</>}</h2>{p&&<p className="mt-5 text-base">{p}</p>}</div>
export const PageHeader=({title,sub,hl})=><section className="relative overflow-hidden bg-gradient-to-br from-navy to-[#0b1740] text-white"><div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-brand/20 blur-3xl"/>
<div className="wrap relative py-20 md:py-24"><nav className="mb-6 flex items-center gap-2 text-xs text-slate-300"><Link to="/" className="hover:text-white">Inicio</Link><ChevronRight size={12}/><span className="text-white">{title}</span></nav>
<h1 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">{title} {hl&&<span className="text-cyan-300">{hl}</span>}</h1>{sub&&<p className="mt-5 max-w-2xl text-lg text-slate-300">{sub}</p>}</div></section>
