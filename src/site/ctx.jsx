import {createContext,useContext} from 'react'
export const SiteCtx=createContext({enroll:()=>{},detail:()=>{}})
export const useSite=()=>useContext(SiteCtx)
