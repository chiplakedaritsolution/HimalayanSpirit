import {useEffect,useState} from 'react'
import {Navigate,useNavigate} from 'react-router-dom'
import {sb,useTitle,wa} from './lib.jsx'

export function Login(){useTitle('Admin Login');const nav=useNavigate();const[e,setE]=useState('');const[p,setP]=useState('');const[sh,setSh]=useState(false);const[m,setM]=useState('');const[b,setB]=useState(false)
 async function go(ev){ev.preventDefault();setB(true);setM('');const{error}=await sb.auth.signInWithPassword({email:e.trim(),password:p});setB(false);if(error)return setM(error.message);nav('/admin')}
 async function reset(){if(!e)return setM('Enter your email first.');const{error}=await sb.auth.resetPasswordForEmail(e.trim(),{redirectTo:location.origin+'/admin/login'});setM(error?error.message:'If this email is registered, a reset link has been sent.')}
 return<div className="wrap" style={{maxWidth:420,paddingTop:80}}><h2>Admin Login</h2><form onSubmit={go} className="f" style={{gridTemplateColumns:'1fr'}}>
 <div className="fl"><label htmlFor="ae">Email address</label><input id="ae" type="email" value={e} onChange={x=>setE(x.target.value)} autoComplete="username" required/></div>
 <div className="fl"><label htmlFor="ap">Password</label><input id="ap" type={sh?'text':'password'} value={p} onChange={x=>setP(x.target.value)} autoComplete="current-password" required/></div>
 <label><input type="checkbox" style={{width:'auto'}} checked={sh} onChange={x=>setSh(x.target.checked)}/> Show password</label>
 <button className="btn" disabled={b}>{b?'Signing in…':'Log in'}</button><button type="button" className="chip" onClick={reset}>Forgot password?</button>{m&&<div className="note" role="alert">{m}</div>}</form></div>}

export function AdminGate(){const[st,setSt]=useState('load')
 useEffect(()=>{let ok=true;async function chk(){const{data:{session}}=await sb.auth.getSession();if(!session)return ok&&setSt('no')
  const{data}=await sb.from('profiles').select('role').eq('id',session.user.id).maybeSingle();ok&&setSt(data&&data.role==='admin'?'yes':'deny')}
  chk();const{data:l}=sb.auth.onAuthStateChange(()=>chk());return()=>{ok=false;l.subscription.unsubscribe()}},[])
 if(st==='load')return<p className="wrap muted">Checking access…</p>
 if(st==='no')return<Navigate to="/admin/login" replace/>
 if(st==='deny')return<div className="wrap" style={{paddingTop:80}}><h2>Access denied</h2><p>This account is not an administrator.</p><button className="btn" onClick={()=>sb.auth.signOut()}>Log out</button></div>
 return<Dash/>}

const F={
 destinations:[['name','Name'],['slug','URL slug'],['short_description','Short description','textarea'],['overview','Overview','textarea'],['hero_image_url','Cover image','image','destination-images'],['highlights','Highlights (one per line)','array'],['duration','Duration'],['start_point','Starting point'],['end_point','Ending point'],['inclusions','Inclusions (one per line)','array'],['exclusions','Exclusions (one per line)','array'],['transportation','Transportation'],['accommodation','Accommodation'],['permit_info','Permit information','textarea'],['best_season','Best season'],['altitude','Altitude'],['important_info','Important information','textarea'],['price_per_person','Starting price per person (blank = on request)','number'],['price_note','Price note','text','','Price on request'],['categories','Categories (one per line: spiritual, adventure, family, trekking, customized)','array'],['display_group','Display group (same value joins records into one category)'],['is_featured','Feature on homepage','bool'],['is_published','Published (visible on website)','bool'],['sort_order','Sort order','number']],
 packages:[['destination_id','Destination','dest'],['name','Package name'],['slug','URL slug'],['description','Description','textarea'],['days','Days','number'],['nights','Nights','number'],['start_point','Starting point'],['end_point','Ending point'],['price','Price (blank = on request)','number'],['price_type','Price type','select',['per_person','per_vehicle','fixed_group']],['price_note','Price note','text','','Price on request'],['min_travellers','Minimum travellers','number'],['max_travellers','Maximum travellers','number'],['inclusions','Inclusions (one per line)','array'],['exclusions','Exclusions (one per line)','array'],['available_dates','Available dates (YYYY-MM-DD, one per line)','array'],['instructions','Important instructions','textarea'],['is_published','Published','bool'],['sort_order','Sort order','number']],
 itineraries:[['destination_id','Destination','dest'],['package_id','Package (blank = destination itinerary)','pkg'],['day_number','Day number (use this to reorder)','number'],['title','Title'],['route','Route'],['description','Description','textarea'],['activities','Sightseeing / activities (one per line)','array'],['overnight_stay','Overnight stay'],['meals','Meals'],['image_url','Day photo','image','destination-images'],['is_published','Published','bool']],
 team_members:[['name','Name'],['role','Designation'],['department','Department','select',['Management','Ground Operations']],['photo_url','Photo','image','team-images'],['bio','Description','textarea'],['sort_order','Sort order','number'],['is_published','Published','bool']],
 gallery_images:[['image_url','Image','image','gallery-images'],['alt_text','Image title / alt text','text','',''],['category','Category','select',['Adi Kailash','Om Parvat','Panchachuli','Darma Valley','Munsyari','Dharchula','Nainital','Himalayan Villages','Trekking','Travel Experiences']],['caption','Description','textarea'],['sort_order','Sort order','number'],['is_published','Published','bool']],
 testimonials:[['name','Customer name'],['location','Location'],['rating','Rating (1-5)','number'],['review','Review','textarea'],['photo_url','Photo (only with permission)','image','testimonial-images'],['is_published','Published','bool']],
 site_settings:[['company_name','Company name'],['tagline','Tagline'],['about_story','Company description','textarea'],['vision','Vision','textarea'],['mission','Mission','textarea'],['address','Business address'],['phone','Phone'],['whatsapp','WhatsApp number (with country code)'],['email','Email'],['instagram_url','Instagram URL'],['facebook_url','Facebook URL'],['youtube_url','YouTube URL'],['map_embed_url','Google Maps link or embed URL'],['logo_url','Logo','image','website-assets'],['hero_image_url','Hero image','image','website-assets'],['business_hours','Business hours (JSON, e.g. {"Mon-Sat":"9am-6pm"})','json']]}
const TABS=[['overview','Dashboard Overview'],['leads','Leads Management'],['destinations','Destination Management','sort_order',true],['packages','Package Management','sort_order',true],['itineraries','Itinerary Management','day_number',true],['team_members','Team Management','sort_order',true],['gallery_images','Gallery Management','sort_order',true],['testimonials','Testimonials','created_at'],['site_settings','Website Settings','id']]

function Dash(){const[t,setT]=useState('overview');const tab=TABS.find(x=>x[0]===t)
 return<div className="adm"><aside className="side"><b style={{padding:'6px 10px'}}>Admin</b>{TABS.map(x=><button key={x[0]} className={t===x[0]?'on':''} onClick={()=>setT(x[0])}>{x[1]}</button>)}<button onClick={()=>sb.auth.signOut()}>Logout</button></aside>
 <div className="main"><h2>{tab[1]}</h2>{t==='overview'?<Overview/>:t==='leads'?<Leads/>:<Crud key={t} t={t} fields={F[t]} order={tab[2]} asc={tab[3]} single={t==='site_settings'}/>}</div></div>}

const bars=(o)=>{const mx=Math.max(1,...Object.values(o));return Object.entries(o).map(([k,v])=><div className="bar" key={k}><span>{k}</span><i style={{width:(v/mx*60)+'%'}}/><span>{v}</span></div>)}
function Overview(){const[d,setD]=useState(null)
 useEffect(()=>{(async()=>{const[l,de,pk,te]=await Promise.all([sb.from('leads').select('status,created_at,destination').limit(5000),sb.from('destinations').select('id',{count:'exact',head:true}),sb.from('packages').select('id',{count:'exact',head:true}).eq('is_published',true),sb.from('testimonials').select('id',{count:'exact',head:true})]);setD({l:l.data||[],de:de.count||0,pk:pk.count||0,te:te.count||0,err:l.error&&l.error.message})})()},[])
 if(!d)return<p className="muted">Loading…</p>
 const L=d.l,c=s=>L.filter(x=>x.status===s).length,elig=L.length-c('cancelled'),rate=elig?(c('confirmed')/elig*100).toFixed(1):'0.0'
 const mo={},dst={},st={New:c('new'),Contacted:c('contacted'),'Follow-up':c('follow_up'),Confirmed:c('confirmed'),Closed:c('closed'),Cancelled:c('cancelled')}
 L.forEach(x=>{const m=x.created_at.slice(0,7);mo[m]=(mo[m]||0)+1;const n=x.destination||'Not selected';dst[n]=(dst[n]||0)+1})
 const S=[['Total enquiries',L.length],['New',c('new')],['Contacted',c('contacted')],['Follow-up',c('follow_up')],['Confirmed bookings',c('confirmed')],['Closed',c('closed')],['Destinations',d.de],['Active packages',d.pk],['Testimonials',d.te],['Conversion rate',rate+'%']]
 return<>{d.err&&<p className="err">{d.err}</p>}<div className="stats">{S.map(([k,v])=><div className="stat" key={k}><b>{v}</b>{k}</div>)}</div>
 <p className="muted">Conversion rate = Confirmed leads ÷ (all leads except Cancelled) × 100.</p>
 <div className="two"><div className="bx"><b>Lead status</b>{bars(st)}</div><div className="bx"><b>Enquiries per month</b>{L.length?bars(Object.fromEntries(Object.entries(mo).sort().slice(-12))):<p className="muted">No enquiries yet.</p>}</div></div>
 <div className="bx" style={{marginTop:18}}><b>Destination-wise enquiries</b>{L.length?bars(dst):<p className="muted">No enquiries yet.</p>}</div></>}

const ST=['new','contacted','follow_up','confirmed','closed','cancelled'],PG=20
function Leads(){const[rows,setR]=useState(null);const[q,setQ]=useState('');const[fs,setFs]=useState('');const[fd,setFd]=useState('');const[from,setFrom]=useState('');const[pg,setPg]=useState(0);const[sel,setSel]=useState(null);const[notes,setN]=useState([]);const[nt,setNt]=useState('');const[m,setM]=useState('')
 const load=async()=>{const{data,error}=await sb.from('leads').select('*').order('created_at',{ascending:false}).limit(5000);if(error)setM(error.message);setR(data||[])}
 useEffect(()=>{load()},[])
 const open=async r=>{setSel(r);const{data}=await sb.from('lead_notes').select('*').eq('lead_id',r.id).order('created_at',{ascending:false});setN(data||[])}
 async function status(r,s){const{error}=await sb.from('leads').update({status:s}).eq('id',r.id);if(error)return setM(error.message);setR(rows.map(x=>x.id===r.id?{...x,status:s}:x));if(sel&&sel.id===r.id)setSel({...sel,status:s})}
 async function addNote(){if(!nt.trim())return;const{error}=await sb.from('lead_notes').insert({lead_id:sel.id,note:nt.trim()});if(error)return setM(error.message);setNt('');open(sel)}
 async function del(r){if(!confirm('Delete this lead and its notes permanently?'))return;const{error}=await sb.from('leads').delete().eq('id',r.id);if(error)return setM(error.message);setSel(null);load()}
 if(!rows)return<p className="muted">Loading…</p>
 const ds=[...new Set(rows.map(x=>x.destination).filter(Boolean))]
 const f=rows.filter(x=>(!fs||x.status===fs)&&(!fd||x.destination===fd)&&(!from||x.created_at.slice(0,10)>=from)&&(!q||(x.full_name+' '+x.mobile+' '+(x.whatsapp||'')).toLowerCase().includes(q.toLowerCase())))
 const csv=()=>{const h=['created_at','status','full_name','mobile','whatsapp','email','destination','travellers','preferred_date','duration','budget','lead_source','message'];const e=v=>'"'+String(v==null?'':v).replace(/"/g,'""')+'"'
  const b=new Blob([[h.join(','),...f.map(r=>h.map(k=>e(r[k])).join(','))].join('\n')],{type:'text/csv'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='leads.csv';a.click()}
 return<>{m&&<p className="err">{m}</p>}<div className="row2" style={{marginBottom:12}}><input style={{maxWidth:220}} placeholder="Search name or phone" value={q} onChange={e=>{setQ(e.target.value);setPg(0)}}/>
 <select style={{maxWidth:160}} value={fs} onChange={e=>{setFs(e.target.value);setPg(0)}}><option value="">All statuses</option>{ST.map(s=><option key={s}>{s}</option>)}</select>
 <select style={{maxWidth:200}} value={fd} onChange={e=>{setFd(e.target.value);setPg(0)}}><option value="">All destinations</option>{ds.map(s=><option key={s}>{s}</option>)}</select>
 <input type="date" style={{maxWidth:160}} value={from} onChange={e=>{setFrom(e.target.value);setPg(0)}} aria-label="From date"/><button className="btn s g" onClick={csv}>Export CSV</button></div>
 {!f.length?<p className="muted">No enquiries found.</p>:<div className="tw"><table className="tbl"><thead><tr><th>Date</th><th>Name</th><th>Phone</th><th>Destination</th><th>Travellers</th><th>Status</th><th></th></tr></thead><tbody>
 {f.slice(pg*PG,pg*PG+PG).map(r=><tr key={r.id}><td>{new Date(r.created_at).toLocaleDateString()}</td><td>{r.full_name}</td><td>{r.mobile}</td><td>{r.destination||'-'}</td><td>{r.travellers||'-'}</td>
 <td><select value={r.status} onChange={e=>status(r,e.target.value)}>{ST.map(s=><option key={s}>{s}</option>)}</select></td><td><button className="btn s" onClick={()=>open(r)}>View</button></td></tr>)}</tbody></table></div>}
 <div className="row2" style={{marginTop:10}}><button className="btn s" disabled={pg===0} onClick={()=>setPg(pg-1)}>Previous</button><span>Page {pg+1} of {Math.max(1,Math.ceil(f.length/PG))}</span><button className="btn s" disabled={(pg+1)*PG>=f.length} onClick={()=>setPg(pg+1)}>Next</button></div>
 {sel&&<div className="bx" style={{marginTop:18}}><div className="row2" style={{justifyContent:'space-between'}}><h3 style={{margin:0}}>{sel.full_name}</h3><button className="btn s" onClick={()=>setSel(null)}>Close</button></div>
 {[['Mobile',sel.mobile],['WhatsApp',sel.whatsapp],['Email',sel.email],['Destination',sel.destination],['Travellers',sel.travellers],['Preferred date',sel.preferred_date],['Duration',sel.duration],['Budget',sel.budget],['Source',sel.lead_source],['Received',new Date(sel.created_at).toLocaleString()],['Message',sel.message]].map(([k,v])=><p key={k} style={{margin:'3px 0',whiteSpace:'pre-wrap'}}><b>{k}:</b> {v||'-'}</p>)}
 <div className="row2" style={{margin:'10px 0'}}><a className="btn s w" href={wa(sel.whatsapp||sel.mobile)} target="_blank" rel="noopener">Open WhatsApp</a><a className="btn s g" href={'tel:'+sel.mobile}>Call</a><button className="btn s d" onClick={()=>del(sel)}>Delete lead</button></div>
 <b>Private notes</b><div className="row2"><input value={nt} onChange={e=>setNt(e.target.value)} placeholder="Add a note" style={{flex:1}}/><button className="btn s" onClick={addNote}>Add</button></div>
 {notes.map(n=><p key={n.id} className="muted" style={{margin:'6px 0'}}>{new Date(n.created_at).toLocaleString()}: {n.note}</p>)}</div>}</>}

function Crud({t,fields,order,asc,single}){const[rows,setR]=useState(null);const[ed,setEd]=useState(null);const[m,setM]=useState('');const[ds,setDs]=useState([]);const[pk,setPk]=useState([])
 const load=async()=>{const{data,error}=await sb.from(t).select('*').order(order||'created_at',{ascending:!!asc});if(error)setM(error.message);setR(data||[]);if(single&&data&&data[0])openEd(data[0])}
 useEffect(()=>{load();sb.from('destinations').select('id,name').order('sort_order').then(r=>setDs(r.data||[]));sb.from('packages').select('id,name').then(r=>setPk(r.data||[]))},[])
 function openEd(r){const o={...r};fields.forEach(([k,,ty])=>{if(ty==='array')o[k]=(r[k]||[]).join('\n');if(ty==='json')o[k]=r[k]?JSON.stringify(r[k]):''});setEd(o)}
 async function up(k,bucket,file){if(!file)return;if(!['image/jpeg','image/png','image/webp'].includes(file.type))return setM('Only JPG, PNG or WebP images are allowed.');if(file.size>5242880)return setM('Image must be 5 MB or smaller.')
  const path=Date.now()+'-'+file.name.replace(/[^\w.-]/g,'_');const{error}=await sb.storage.from(bucket).upload(path,file);if(error)return setM('Upload failed: '+error.message);setEd(e=>({...e,[k]:sb.storage.from(bucket).getPublicUrl(path).data.publicUrl}));setM('Image uploaded. Press Save to keep it.')}
 async function save(ev){ev.preventDefault();const p={}
  for(const[k,l,ty,,d]of fields){let v=ed[k];if(ty==='array')v=(v||'').split('\n').map(x=>x.trim()).filter(Boolean);else if(ty==='number')v=v===''||v==null?null:Number(v);else if(ty==='json'){try{v=v?JSON.parse(v):null}catch{return setM('Invalid JSON in '+l)}}else if(ty==='bool')v=!!v;else if(v===''||v===undefined)v=d!==undefined?d:null;p[k]=v}
  const isEdit=ed.id!==undefined&&ed.id!==null&&ed.id!=='';if(!isEdit)Object.keys(p).forEach(k=>p[k]==null&&delete p[k])
  const{error}=await(isEdit?sb.from(t).update(p).eq('id',ed.id):sb.from(t).insert(p));if(error)return setM('Save failed: '+error.message);setM('Saved.');if(!single)setEd(null);load()}
 async function del(r){if(!confirm('Delete this record permanently? Photos already uploaded stay in storage.'))return;const{error}=await sb.from(t).delete().eq('id',r.id);if(error)return setM('Delete failed: '+error.message);load()}
 async function pub(r){const{error}=await sb.from(t).update({is_published:!r.is_published}).eq('id',r.id);if(error)return setM(error.message);load()}
 if(!rows)return<p className="muted">Loading…</p>
 const title=r=>r.name||r.title||r.review||('Day '+r.day_number)
 return<>{m&&<p className={m==='Saved.'||m.startsWith('Image up')?'':'err'} role="status">{m}</p>}
 {!single&&!ed&&<><button className="btn s" onClick={()=>setEd({})}>Add new</button>{!rows.length?<p className="muted">Nothing here yet. Use "Add new".</p>:<div className="tw"><table className="tbl"><tbody>{rows.map(r=><tr key={r.id}><td><b>{title(r)}</b>{r.day_number!=null&&r.title?'':''}{r.destination_id&&<div className="muted">{(ds.find(x=>x.id===r.destination_id)||{}).name}</div>}</td><td>{'is_published' in r&&<button className={'tag'+(r.is_published?' on':'')} style={{border:0,cursor:'pointer'}} onClick={()=>pub(r)}>{r.is_published?'Published':'Hidden'}</button>}</td><td><button className="btn s g" onClick={()=>openEd(r)}>Edit</button> <button className="btn s d" onClick={()=>del(r)}>Delete</button></td></tr>)}</tbody></table></div>}</>}
 {ed&&<form className="f" onSubmit={save}>{fields.map(([k,l,ty='text',o])=><div className={'fl'+(ty==='textarea'||ty==='array'||ty==='json'?' full':'')} key={k}><label htmlFor={'c'+k}>{l}</label>
 {ty==='textarea'||ty==='array'||ty==='json'?<textarea id={'c'+k} rows={ty==='textarea'?3:4} value={ed[k]??''} onChange={e=>setEd({...ed,[k]:e.target.value})}/>
 :ty==='bool'?<input id={'c'+k} type="checkbox" style={{width:'auto'}} checked={!!ed[k]} onChange={e=>setEd({...ed,[k]:e.target.checked})}/>
 :ty==='select'?<select id={'c'+k} value={ed[k]??''} onChange={e=>setEd({...ed,[k]:e.target.value})}><option value="">-</option>{o.map(x=><option key={x}>{x}</option>)}</select>
 :ty==='dest'||ty==='pkg'?<select id={'c'+k} value={ed[k]??''} onChange={e=>setEd({...ed,[k]:e.target.value})}><option value="">-</option>{(ty==='dest'?ds:pk).map(x=><option key={x.id} value={x.id}>{x.name}</option>)}</select>
 :ty==='image'?<><input id={'c'+k} value={ed[k]??''} onChange={e=>setEd({...ed,[k]:e.target.value})} placeholder="Image URL"/>{ed[k]&&<img src={ed[k]} alt="Preview" style={{maxHeight:90,objectFit:'cover',borderRadius:8}}/>}<input type="file" accept="image/jpeg,image/png,image/webp" onChange={e=>up(k,o,e.target.files[0])}/></>
 :<input id={'c'+k} type={ty==='number'?'number':'text'} step="any" value={ed[k]??''} onChange={e=>setEd({...ed,[k]:e.target.value})}/>}</div>)}
 <div className="full row2"><button className="btn">Save</button>{!single&&<button type="button" className="btn s" onClick={()=>setEd(null)}>Cancel</button>}</div></form>}</>}
