import {createContext,useContext,useState} from 'react'
import {load,save,S} from './db.js'
import {can} from '../lib/lms.js'
const Ctx=createContext()
export const useLms=()=>useContext(Ctx)
export function LmsProvider({children}){
const [db,setDb]=useState(load);const [sid,setSid]=useState(()=>sessionStorage.getItem(S))
const up=f=>setDb(p=>{const n=structuredClone(p);f(n);save(n);return n})
const me=db.users.find(u=>u.id===sid)||null
const mine=me?db.courses.filter(c=>me.role==='admin'||(me.role==='docente'?c.teacherId===me.id:c.students.includes(me.id))):[]
const login=(e,p)=>{const u=db.users.find(x=>(x.email.toLowerCase()===e.trim().toLowerCase()||x.studentCode?.toLowerCase()===e.trim().toLowerCase())&&x.pass===p);if(!u)return false;sessionStorage.setItem(S,u.id);setSid(u.id);return true}
const logout=()=>{sessionStorage.removeItem(S);setSid(null)}
return <Ctx.Provider value={{db,up,me,mine,login,logout,can:a=>can(me?.role,a)}}>{children}</Ctx.Provider>}
