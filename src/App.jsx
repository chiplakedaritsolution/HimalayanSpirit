import {useEffect,useState} from 'react'
import {Routes,Route,Navigate} from 'react-router-dom'
import {sb,SettingsCtx} from './lib.jsx'
import {Layout,Home,About,Destinations,Detail,Contact} from './Public.jsx'
import {Login,AdminGate} from './Admin.jsx'
export default function App(){const[S,setS]=useState({})
 useEffect(()=>{sb.from('site_settings').select('*').eq('id',1).maybeSingle().then(r=>r.data&&setS(r.data))},[])
 const P=c=><Layout>{c}</Layout>
 return<SettingsCtx.Provider value={S}><Routes>
 <Route path="/" element={P(<Home/>)}/><Route path="/about" element={P(<About/>)}/><Route path="/destinations" element={P(<Destinations/>)}/>
 <Route path="/destinations/:slug" element={P(<Detail/>)}/><Route path="/contact" element={P(<Contact/>)}/>
 <Route path="/admin/login" element={<Login/>}/><Route path="/admin" element={<AdminGate/>}/><Route path="/admin/dashboard" element={<Navigate to="/admin" replace/>}/>
 <Route path="*" element={<Navigate to="/" replace/>}/></Routes></SettingsCtx.Provider>}
