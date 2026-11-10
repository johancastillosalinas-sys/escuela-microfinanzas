import {Component} from 'react'
export default class ErrorBoundary extends Component{state={e:null}
static getDerivedStateFromError(e){return {e}}
componentDidCatch(e){console.error(e)}
render(){if(!this.state.e)return this.props.children
return <div className="mx-auto max-w-xl px-6 py-24 text-center"><h2 className="mb-3 text-2xl font-bold text-navy">No pudimos mostrar esta página</h2><p className="mb-2 text-sm">Ocurrió un error inesperado. Puedes recargar o volver al inicio.</p><pre className="mb-6 overflow-auto rounded bg-slate-100 p-3 text-left text-xs text-red-600">{String(this.state.e?.message||this.state.e)}</pre><div className="flex justify-center gap-3"><button onClick={()=>location.reload()} className="btn">Recargar</button><a href="/" className="btn2">Ir al inicio</a></div></div>}}
