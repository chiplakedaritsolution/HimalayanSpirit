import {createClient} from '@supabase/supabase-js'
import {createContext,useContext,useEffect,useState} from 'react'
export const sb=createClient(import.meta.env.VITE_SUPABASE_URL,import.meta.env.VITE_SUPABASE_ANON_KEY)
export const SettingsCtx=createContext({})
export const useSettings=()=>useContext(SettingsCtx)
export function useQ(fn,deps=[]){const[s,set]=useState({data:null,loading:true,error:null})
 useEffect(()=>{let ok=true;set(x=>({...x,loading:true}))
  Promise.resolve(fn()).then(({data,error})=>ok&&set({data,loading:false,error:error?error.message:null}))
  return()=>{ok=false}},deps);return s}
export const wa=(n,t)=>n?`https://wa.me/${String(n).replace(/\D/g,'')}${t?'?text='+encodeURIComponent(t):''}`:null
export const useTitle=t=>useEffect(()=>{document.title=t},[t])
export const Img=({src,alt,i=0,cls=''})=>src?<img className={'im '+cls} src={src} alt={alt||''} loading="lazy"/>
 :<div className={'ph '+cls} style={{'--h':(i*47+150)%360}} role="img" aria-label={alt||'Photo placeholder'}><span>Photo placeholder</span></div>
export const State=({s,empty,children})=>s.loading?<p className="muted">Loading…</p>
 :s.error?<p className="err">Could not load data: {s.error}</p>
 :(!s.data||!s.data.length)&&empty?<p className="muted">{empty}</p>:children
