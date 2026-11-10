import {Link} from 'react-router-dom'
import {ArrowRight,ArrowUpRight,Users,TrendingUp,Award,BookOpen,GraduationCap,Network,Globe} from 'lucide-react'
import {programs} from '../../data.js'
import {Head,Eyebrow} from '../ui.jsx'
import {useSite} from '../ctx.jsx'
export default function Inicio(){const {detail}=useSite()
const f=[[Users,'Formación','Especializada'],[TrendingUp,'Enfoque','Práctico'],[Award,'Calidad','Educativa']]
const why=[[BookOpen,'Casos reales','Aprende de situaciones y desafíos reales del sector financiero y empresarial.'],[GraduationCap,'Docentes expertos','Profesionales con experiencia activa en sus respectivas áreas.'],[Network,'Networking','Conecta con profesionales, emprendedores y líderes con tus objetivos.'],[Globe,'Visión internacional','Amplía tu perspectiva con una formación orientada a un entorno global.']]
return <>
<section className="relative overflow-hidden bg-gradient-to-b from-white to-sky-50/80 dark:from-[#050816] dark:to-[#071026]"><div className="absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-sky-200/40 blur-3xl dark:bg-brand/10"/>
<div className="wrap relative grid items-center gap-16 py-20 md:py-28 lg:grid-cols-2">
<div><span className="mb-8 inline-flex items-center gap-2 rounded-full border border-sky-100 bg-white px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-navy shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-white"><Award size={14} className="text-brand"/>Educación para transformar</span>
<h1 className="text-5xl font-extrabold leading-[1.05] tracking-tight text-navy sm:text-6xl xl:text-7xl dark:text-white">Formando <span className="text-brand">Líderes</span> para el Desarrollo Económico</h1>
<p className="mt-8 max-w-xl text-lg leading-8">Desarrollamos profesionales capaces de liderar, innovar y generar oportunidades para el crecimiento sostenible de personas, empresas y comunidades.</p>
<div className="mt-10 flex flex-wrap gap-4"><Link to="/programas" className="btn">Descubre nuestros programas <ArrowRight size={16}/></Link><Link to="/nosotros" className="btn2">Conoce ESM</Link></div>
<div className="mt-14 grid max-w-xl grid-cols-3 gap-6 border-t border-slate-200 pt-8 dark:border-white/10">{f.map(([I,a,b])=><div key={a} className="flex items-center gap-3"><span className="ico !h-11 !w-11 shrink-0"><I size={18}/></span><div className="text-sm"><b className="block text-navy dark:text-white">{a}</b><span className="text-xs">{b}</span></div></div>)}</div></div>
<div className="relative mx-auto w-full max-w-lg lg:ml-auto"><div className="absolute -right-6 -top-6 h-full w-full rounded-[2rem] bg-navy"/><div className="absolute -bottom-6 -left-6 h-32 w-32 rounded-3xl bg-brand"/>
<div className="relative min-h-[30rem] overflow-hidden rounded-[2rem] shadow-2xl"><img src="/hero-esm.jpg" alt="Estudiantes de la Escuela Superior de Microfinanzas" className="absolute inset-0 h-full w-full object-cover"/>
<div className="absolute inset-x-6 bottom-6 rounded-2xl bg-white p-4 shadow-lg dark:bg-slate-900"><span className="text-[10px] font-bold uppercase tracking-widest text-brand">ESM · Perú</span><b className="block text-sm text-navy dark:text-white">Formación que genera impacto</b></div></div></div></div></section>

<section className="sec"><div className="wrap"><Head e="Nuestra oferta académica" a="Programas" b="destacados" p="Una selección de nuestros programas. Conoce toda la oferta en la sección de Programas."/>
<div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">{programs.slice(0,4).map((p,i)=><div key={p.t} className="card flex flex-col"><span className="ico mb-6"><p.I size={22}/></span><span className="text-[11px] font-bold uppercase tracking-widest text-brand">Programa 0{i+1}</span><h3 className="mb-3 mt-2 text-xl font-bold text-navy dark:text-white">{p.t}</h3><p className="mb-6 flex-1 text-sm leading-7">{p.d}</p><button onClick={()=>detail(p)} className="inline-flex items-center gap-1 text-sm font-bold text-navy hover:text-brand dark:text-white">Ver detalles <ArrowUpRight size={14}/></button></div>)}</div>
<div className="mt-14 text-center"><Link to="/programas" className="btn">Ver todos los programas <ArrowRight size={16}/></Link></div></div></section>

<section className="sec alt"><div className="wrap"><Head e="¿Por qué estudiar en ESM?" a="Una formación diseñada" b="para el mundo real"/>
<div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">{why.map(([I,t,d])=><div key={t} className="card"><span className="ico mb-6"><I size={22}/></span><h3 className="mb-3 text-lg font-bold text-navy dark:text-white">{t}</h3><p className="text-sm leading-7">{d}</p></div>)}</div></div></section>

<section className="sec"><div className="wrap"><div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-navy to-[#0b1740] px-8 py-16 text-center text-white md:px-16"><div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand/25 blur-3xl"/>
<div className="relative mx-auto max-w-2xl"><Eyebrow center>Admisiones ESM</Eyebrow><h2 className="text-3xl font-extrabold leading-tight md:text-5xl">Da el siguiente paso hacia <span className="text-cyan-300">tu futuro profesional</span></h2><p className="mt-5 text-slate-300">Inicia tu pre-inscripción en línea y recibe orientación de nuestro equipo.</p><div className="mt-9 flex flex-wrap justify-center gap-4"><Link to="/admisiones" className="btn">Iniciar pre-inscripción <ArrowRight size={16}/></Link><Link to="/contactanos" className="inline-flex items-center gap-2 rounded-full border border-white/25 px-8 py-4 text-sm font-semibold transition hover:bg-white/10">Contáctanos</Link></div></div></div></div></section></>}
