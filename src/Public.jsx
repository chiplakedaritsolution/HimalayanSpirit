import {useState} from 'react'
import {Link,NavLink,useParams} from 'react-router-dom'
import {sb,useQ,useSettings,wa,useTitle,Img,State} from './lib.jsx'

const DEF_STORY='Himalayan Spirit Adventures is a passionate travel and tourism company dedicated to exploring and showcasing the untouched beauty, spiritual heritage, and cultural richness of the Kumaon Himalayas. From the divine journey of Adi Kailash and Om Parvat to Munsyari, Darma Valley, Panchachuli, and hidden Himalayan villages, we create memorable travel experiences. We don’t just organize tours. We create experiences.'
const DEF_VISION='To establish Himalayan Spirit Adventures as a trusted name in Himalayan tourism while promoting sustainable tourism, local employment, and the natural and cultural heritage of Uttarakhand.'
const DEF_MISSION='Promote Kumaon tourism, offer authentic village and cultural experiences, provide safe and memorable journeys, and support local guides, drivers, homestays, and businesses.'
const GROUPS={'adi-kailash-om-parvat':'Adi Kailash & Om Parvat'}
const CATS=[['spiritual','Spiritual Tours'],['adventure','Adventure Tours'],['family','Family Tours'],['trekking','Trekking'],['customized','Customized Tours']]
const group=l=>{const seen={};return l.filter(d=>{if(!d.display_group)return true;if(seen[d.display_group])return false;seen[d.display_group]=1;return true}).map(d=>d.display_group?{...d,name:GROUPS[d.display_group]||d.name}:d)}

export function Layout({children}){const S=useSettings();const w=wa(S.whatsapp,'Hello, I would like to plan a Himalayan trip.')
 return<>
 <header className="top"><div className="wrap"><Link className="logo" to="/">{S.company_name||'Himalayan Spirit Adventures'}</Link>
 <nav aria-label="Main">{[['/','Home'],['/about','About Us'],['/destinations','Tour Destinations'],['/contact','Contact Us']].map(([p,t])=><NavLink key={p} end={p==='/'} className={({isActive})=>'l'+(isActive?' on':'')} to={p}>{t}</NavLink>)}
 <Link className="btn s" to="/contact">Plan Your Trip</Link></nav></div></header>
 <main>{children}</main>
 <footer><div className="wrap"><div className="cols">
 <div><h3 style={{color:'#fff'}}>{S.company_name}</h3><p>{S.tagline||'Local Kumaon Himalayan tours led from Dharchula.'}</p></div>
 <div><b>Quick links</b><Link to="/">Home</Link><Link to="/about">About Us</Link><Link to="/destinations">Tour Destinations</Link><Link to="/contact">Contact Us</Link></div>
 <div><b>Contact</b><p>{S.address}</p>{S.phone&&<a href={'tel:'+S.phone.replace(/\s/g,'')}>{S.phone}</a>}{S.email&&<a href={'mailto:'+S.email}>{S.email}</a>}
 {S.instagram_url&&<a href={S.instagram_url} target="_blank" rel="noopener">Instagram</a>}{S.facebook_url&&<a href={S.facebook_url} target="_blank" rel="noopener">Facebook</a>}{S.youtube_url&&<a href={S.youtube_url} target="_blank" rel="noopener">YouTube</a>}{w&&<a href={w} target="_blank" rel="noopener">WhatsApp</a>}</div>
 </div><p style={{marginTop:24,fontSize:'.85rem'}}>© {new Date().getFullYear()} {S.company_name}. All rights reserved.</p></div></footer>
 {w&&<a className="btn w fab" href={w} target="_blank" rel="noopener">WhatsApp us</a>}</>}

export function Enquiry({source,dest,options,pkgs,custom,subject,btn='Get Your Free Travel Consultation'}){
 const S=useSettings();const[f,setF]=useState({});const[st,setSt]=useState({s:'idle'});const set=k=>e=>setF({...f,[k]:e.target.value})
 async function go(e){e.preventDefault();if(st.s==='busy')return
  const m=(f.mobile||'').replace(/\D/g,''),w=(f.whatsapp||'').replace(/\D/g,''),er=[]
  if((f.name||'').trim().length<2)er.push('Enter your full name.')
  if(w.length<10||w.length>13)er.push('Enter a valid WhatsApp number (10 to 13 digits).')
  if(f.mobile&&(m.length<10||m.length>13))er.push('Enter a valid mobile number.')
  if(f.email&&!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email))er.push('Enter a valid email address.')
  if(subject&&!(f.subject||'').trim())er.push('Enter a subject.')
  if(er.length)return setSt({s:'err',m:er.join(' ')})
  setSt({s:'busy'})
  const sel=dest||(options||[]).find(o=>o.id===f.did)
  const msg=[subject&&'Subject: '+f.subject,custom&&f.exp&&'Trekking experience: '+f.exp,f.message].filter(Boolean).join('\n')||null
  const{error}=await sb.from('leads').insert({lead_source:source,full_name:f.name.trim(),mobile:(f.mobile||f.whatsapp).trim(),whatsapp:f.whatsapp.trim(),email:f.email||null,destination:sel?sel.name:null,destination_id:sel?sel.id:null,package_id:f.pid||null,travellers:f.trav?+f.trav:null,preferred_date:f.date||null,duration:f.days||null,budget:f.budget||null,message:msg})
  if(error)return setSt({s:'err',m:'Your enquiry could not be saved ('+error.message+'). Please try again or use WhatsApp.'})
  setSt({s:'ok'});setF({})}
 const I=(k,l,t='text',x={})=><div className="fl"><label htmlFor={'e'+k}>{l}</label><input id={'e'+k} type={t} value={f[k]||''} onChange={set(k)} {...x}/></div>
 return<form className="f" onSubmit={go} noValidate>
 {I('name','Full name *')}{I('whatsapp','WhatsApp number *','tel')}{I('mobile','Mobile number (optional)','tel')}{I('email','Email address','email')}
 {dest?<div className="fl"><label>Selected destination</label><input value={dest.name} readOnly/></div>:options&&<div className="fl"><label htmlFor="edid">Destination interested in</label><select id="edid" value={f.did||''} onChange={set('did')}><option value="">Select a destination</option>{options.map(o=><option key={o.id} value={o.id}>{o.name}</option>)}</select></div>}
 {pkgs&&pkgs.length>0&&<div className="fl"><label htmlFor="epid">Package</label><select id="epid" value={f.pid||''} onChange={set('pid')}><option value="">Not sure yet</option>{pkgs.map(o=><option key={o.id} value={o.id}>{o.name}</option>)}</select></div>}
 {I('trav','Number of travellers','number',{min:1,max:60})}{I('date','Preferred travel date','date')}{I('days','Travel duration','text',{placeholder:'e.g. 7 days'})}{(dest||custom)&&I('budget','Budget per person')}
 {subject&&I('subject','Subject *')}{custom&&I('exp','Trekking experience')}
 <div className="fl full"><label htmlFor="emsg">Message / special requirements</label><textarea id="emsg" rows="3" value={f.message||''} onChange={set('message')}/></div>
 <div className="full"><button className="btn" disabled={st.s==='busy'}>{st.s==='busy'?'Sending…':btn}</button></div>
 {st.s==='err'&&<div className="note bad" role="alert">{st.m}</div>}
 {st.s==='ok'&&<div className="note" role="status">Thank you. Your enquiry has been saved and our team will contact you on WhatsApp. {wa(S.whatsapp,'Hello, I just sent an enquiry on your website.')&&<a href={wa(S.whatsapp,'Hello, I just sent an enquiry on your website.')} target="_blank" rel="noopener">Message us on WhatsApp now</a>}</div>}
 </form>}

function DCard({d,i}){return<article className="card"><Img src={d.hero_image_url} alt={d.name} i={i}/><div className="b"><h3>{d.name}</h3><p>{d.short_description}</p>{d.duration&&<p><b>{d.duration}</b></p>}
 <div className="row2"><Link to={'/destinations/'+d.slug}>Explore Package</Link><Link to={'/destinations/'+d.slug+'#itinerary'}>View Itinerary</Link></div></div></article>}

export function Home(){useTitle('Himalayan Spirit Adventures | Kumaon, Adi Kailash & Om Parvat Tours')
 const S=useSettings();const[cat,setCat]=useState('all');const[lb,setLb]=useState(null)
 const d=useQ(()=>sb.from('destinations').select('*').eq('is_published',true).order('sort_order'),[])
 const g=useQ(()=>sb.from('gallery_images').select('*').eq('is_published',true).order('sort_order'),[])
 const t=useQ(()=>sb.from('testimonials').select('*').eq('is_published',true).order('created_at',{ascending:false}),[])
 const list=d.data?group(d.data):[];const feat=list.filter(x=>x.is_featured);const show=(feat.length?feat:list).slice(0,9)
 const gl=(g.data||[]).filter(x=>cat==='all'||x.category===cat);const cats=[...new Set((g.data||[]).map(x=>x.category).filter(Boolean))]
 return<>
 <section className="hero"><div className="wrap"><h1>Discover the Untouched Beauty of Kumaon Himalayas.</h1><p>Explore the divine landscapes, hidden Himalayan villages, breathtaking mountains, and unforgettable adventures with Himalayan Spirit.</p>
 <div className="row"><Link className="btn" to="/destinations">Explore Destinations</Link><Link className="btn o" to="/contact">Plan Your Trip</Link></div></div></section>
 <section className="sec"><div className="wrap"><h2>Welcome to {S.company_name||'Himalayan Spirit Adventures'}</h2><p className="muted" style={{maxWidth:'62ch'}}>{S.about_story||'A passionate travel company dedicated to the natural beauty, spiritual heritage, and cultural richness of the Kumaon Himalayas. We don’t just organize tours; we create memories.'}</p></div></section>
 <section className="sec" style={{paddingTop:0}}><div className="wrap"><h2>Explore Our Destinations</h2>
 <State s={d} empty="Destinations will appear here soon."><div className="grid">{show.map((x,i)=><DCard key={x.id} d={x} i={i}/>)}</div></State></div></section>
 <section className="sec" style={{paddingTop:0}}><div className="wrap"><h2>Photo Gallery</h2>
 <State s={g} empty="Photos will appear here soon."><div className="chips">{['all',...cats].map(c=><button key={c} className={'chip'+(c===cat?' on':'')} onClick={()=>setCat(c)}>{c}</button>)}</div>
 <div className="grid" style={{gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))'}}>{gl.map((x,i)=><button key={x.id} style={{border:0,padding:0,cursor:'pointer',borderRadius:12,overflow:'hidden'}} onClick={()=>setLb(x)} aria-label={'Open photo: '+(x.alt_text||x.caption||'gallery')}><Img src={x.image_url} alt={x.alt_text} i={i}/></button>)}</div></State></div></section>
 {lb&&<div className="lb" onClick={()=>setLb(null)} role="dialog" aria-modal="true"><Img src={lb.image_url} alt={lb.alt_text}/></div>}
 <section className="sec" style={{paddingTop:0}}><div className="wrap"><h2>What Travellers Say</h2>
 <State s={t} empty="Traveller reviews will appear here soon."><div className="grid">{(t.data||[]).map(x=><div className="bx" key={x.id}><p>{'★'.repeat(x.rating||5)}</p><p>{x.review}</p><b>{x.name}</b>{x.location&&<span className="muted"> · {x.location}</span>}</div>)}</div></State></div></section>
 <section className="sec" style={{background:'var(--nv)',color:'#fff'}}><div className="wrap"><h2>Get Your Free Travel Consultation</h2><Enquiry source="home_form" options={d.data||[]}/></div></section></>}

export function About(){useTitle('About Himalayan Spirit Adventures | Our Team & Story');const S=useSettings()
 const t=useQ(()=>sb.from('team_members').select('*').eq('is_published',true).order('sort_order'),[])
 const by=dep=>(t.data||[]).filter(x=>dep?x.department===dep:x.department!=='Management')
 const T=({l})=><div className="tc">{l.photo_url?<img className="av" src={l.photo_url} alt={l.name} loading="lazy"/>:<div className="av" aria-label="Photo placeholder">{l.name.split(' ').slice(0,2).map(x=>x[0]).join('')}</div>}<h3 style={{fontSize:'1.05rem',margin:'0 0 4px'}}>{l.name}</h3><p className="muted" style={{margin:0}}>{l.role}</p></div>
 return<><section className="hero"><div className="wrap"><h1>Every Journey Has a Story. Ours Begins in the Himalayas.</h1><p>Discover the mountains, culture, spirituality, and unforgettable experiences of Kumaon with Himalayan Spirit Adventures.</p></div></section>
 <section className="sec"><div className="wrap"><h2>Who We Are</h2><p className="muted" style={{maxWidth:'66ch'}}>{S.about_story||DEF_STORY}</p></div></section>
 <section className="sec" style={{paddingTop:0}}><div className="wrap two"><div className="bx"><h3>Our Vision</h3><p className="muted">{S.vision||DEF_VISION}</p></div><div className="bx"><h3>Our Mission</h3><p className="muted">{S.mission||DEF_MISSION}</p></div></div></section>
 <section className="sec" style={{paddingTop:0}}><div className="wrap"><h2>Meet Our Team</h2><State s={t} empty="Our team will be listed here soon.">
 <h3>Management Team</h3><div className="team">{by('Management').map(x=><T key={x.id} l={x}/>)}</div>
 <h3 style={{marginTop:32}}>Ground-Level Operations Team</h3><div className="team">{by(null).map(x=><T key={x.id} l={x}/>)}</div></State></div></section></>}

export function Destinations(){useTitle('Tour Destinations | Himalayan Spirit Adventures');const[cat,setCat]=useState('all');const[q,setQ]=useState('')
 const d=useQ(()=>sb.from('destinations').select('*').eq('is_published',true).order('sort_order'),[])
 const l=group(d.data||[]).filter(x=>(cat==='all'||(x.categories||[]).includes(cat))&&x.name.toLowerCase().includes(q.toLowerCase()))
 return<><section className="hero"><div className="wrap"><h1>Explore the Incredible Kumaon Himalayas</h1><p>From sacred Himalayan pilgrimages to breathtaking mountain adventures, discover unforgettable journeys with Himalayan Spirit Adventures.</p></div></section>
 <section className="sec"><div className="wrap"><label htmlFor="q">Search destinations</label><input id="q" style={{maxWidth:340}} value={q} onChange={e=>setQ(e.target.value)} placeholder="e.g. Munsyari"/>
 <div className="chips"><button className={'chip'+(cat==='all'?' on':'')} onClick={()=>setCat('all')}>All</button>{CATS.map(([k,v])=><button key={k} className={'chip'+(cat===k?' on':'')} onClick={()=>setCat(k)}>{v}</button>)}</div>
 <State s={d} empty="Destinations will appear here soon."><div className="grid">{l.map((x,i)=><DCard key={x.id} d={x} i={i}/>)}</div>{!l.length&&<p className="muted">No destinations match. Try another search or filter.</p>}</State></div></section></>}

export function Detail(){const{slug}=useParams();const S=useSettings()
 const q=useQ(async()=>{const{data:d,error}=await sb.from('destinations').select('*').eq('slug',slug).eq('is_published',true).maybeSingle();if(error||!d)return{data:d?[d]:[],error}
  const[i,p,s]=await Promise.all([sb.from('itineraries').select('*').eq('destination_id',d.id).eq('is_published',true).order('day_number'),sb.from('packages').select('*').eq('destination_id',d.id).eq('is_published',true).order('sort_order'),d.display_group?sb.from('destinations').select('slug,name').eq('display_group',d.display_group).eq('is_published',true).neq('id',d.id):{data:[]}])
  return{data:[{d,i:i.data||[],p:p.data||[],s:s.data||[]}]}},[slug])
 useTitle(q.data&&q.data[0]?q.data[0].d.name+' Tour | Himalayan Spirit Adventures':'Destination')
 if(q.loading||q.error||!q.data||!q.data.length)return<section className="sec"><div className="wrap"><State s={q} empty="This destination was not found."/><Link to="/destinations">Back to destinations</Link></div></section>
 const{d,i,p,s}=q.data[0];const days=i.filter(x=>!x.package_id);const custom=slug==='trekking-customized-tours'
 const L=a=>a&&a.length>0&&<ul>{a.map((x,k)=><li key={k}>{x}</li>)}</ul>
 const Days=({l})=>l.map(x=><details className="acc" key={x.id}><summary>DAY {String(x.day_number).padStart(2,'0')} · {x.title}</summary><div>{x.route&&<p><b>Route:</b> {x.route}</p>}{x.description&&<p>{x.description}</p>}{L(x.activities)}{x.overnight_stay&&<p><b>Overnight stay:</b> {x.overnight_stay}</p>}{x.meals&&<p><b>Meals:</b> {x.meals}</p>}</div></details>)
 const w=wa(S.whatsapp,`Hello Himalayan Spirit Adventures, I am interested in your ${d.name} tour package. Please share the detailed itinerary, package cost, available dates, and booking information.`)
 return<><section className="hero"><div className="wrap"><Link to="/destinations" style={{color:'#dbe6e2'}}>Back to destinations</Link><h1 style={{marginTop:10}}>{d.name}</h1><p>{d.short_description}</p>
 <p>{[d.duration,d.start_point&&'Start: '+d.start_point,d.end_point&&'End: '+d.end_point].filter(Boolean).join(' · ')}</p>
 <div className="row"><a className="btn" href="#itinerary">View Itinerary</a><a className="btn o" href="#enquire">Enquire</a></div></div></section>
 <section className="sec"><div className="wrap">{s.length>0&&<p>Also see: {s.map(x=><Link key={x.slug} to={'/destinations/'+x.slug}>{x.name} </Link>)}</p>}
 {d.overview&&<><h2>About {d.name}</h2><p className="muted" style={{maxWidth:'66ch'}}>{d.overview}</p></>}
 {d.highlights&&d.highlights.length>0&&<><h2>Tour Highlights</h2>{L(d.highlights)}</>}
 <p><b>{d.price_per_person?'From ₹'+Number(d.price_per_person).toLocaleString('en-IN')+' per person':d.price_note}</b></p></div></section>
 <section className="sec" id="itinerary" style={{paddingTop:0}}><div className="wrap"><h2>Day-wise Itinerary</h2>{days.length?<Days l={days}/>:<p className="muted">The detailed itinerary will be added soon. Please enquire for the latest plan.</p>}</div></section>
 {p.length>0&&<section className="sec" style={{paddingTop:0}}><div className="wrap"><h2>Packages</h2><div className="grid">{p.map(x=><div className="bx" key={x.id}><h3>{x.name}</h3><p className="muted">{x.description}</p><p>{[x.days&&x.days+' days',x.nights!=null&&x.nights+' nights'].filter(Boolean).join(' / ')}</p><p><b>{x.price?'₹'+Number(x.price).toLocaleString('en-IN')+' '+({per_person:'per person',per_vehicle:'per vehicle',fixed_group:'fixed group price'}[x.price_type]||''):x.price_note}</b></p>
 {L(x.inclusions)}{i.filter(y=>y.package_id===x.id).length>0&&<details className="acc" style={{marginTop:10}}><summary>Package itinerary</summary><div><Days l={i.filter(y=>y.package_id===x.id)}/></div></details>}{x.instructions&&<p className="muted">{x.instructions}</p>}</div>)}</div></div></section>}
 <section className="sec" style={{paddingTop:0}}><div className="wrap two"><div className="bx"><b>Inclusions</b>{d.inclusions&&d.inclusions.length?L(d.inclusions):<p className="muted">Confirmed per package. Please enquire.</p>}</div><div className="bx"><b>Exclusions</b>{d.exclusions&&d.exclusions.length?L(d.exclusions):<p className="muted">Personal expenses and anything not listed under inclusions.</p>}</div></div></section>
 <section className="sec" style={{paddingTop:0}}><div className="wrap"><h2>Important Travel Information</h2><p className="muted" style={{maxWidth:'66ch'}}>{[d.permit_info,d.important_info,d.best_season&&'Best season: '+d.best_season,d.altitude&&'Altitude: '+d.altitude].filter(Boolean).join(' ')||'Details are shared on enquiry. Access depends on weather and official permissions.'}</p></div></section>
 <section className="sec" id="enquire" style={{background:'var(--nv)',color:'#fff'}}><div className="wrap"><h2>{custom?'Customize Your Trip':'Enquire About This Package'}</h2>
 <Enquiry source={custom?'customize_form':'destination_form'} dest={d} pkgs={p} custom={custom} btn={custom?'Customize Your Trip':'Enquire About This Package'}/>{w&&<p><a className="btn w" href={w} target="_blank" rel="noopener">Enquire on WhatsApp</a></p>}</div></section></>}

export function Contact(){useTitle('Contact Himalayan Spirit Adventures | Plan Your Trip');const S=useSettings()
 const d=useQ(()=>sb.from('destinations').select('id,name').eq('is_published',true).order('sort_order'),[])
 const w=wa(S.whatsapp,'Hello Himalayan Spirit Adventures, I would like to plan a Himalayan trip.')
 const hrs=S.business_hours&&typeof S.business_hours==='object'?Object.entries(S.business_hours):[]
 const map=S.map_embed_url||'https://www.google.com/maps/search/?api=1&query=Dharchula%2C+Pithoragarh%2C+Uttarakhand'
 return<><section className="hero"><div className="wrap"><h1>Let’s Plan Your Next Himalayan Adventure.</h1><p>Tell us where you want to go. Our team will help you plan your perfect journey.</p>{w&&<a className="btn w" href={w} target="_blank" rel="noopener">Chat on WhatsApp</a>}</div></section>
 <section className="sec"><div className="wrap"><h2>Contact Information</h2><div className="grid">{[['Company',S.company_name],['Location',S.address],['Phone',S.phone],['WhatsApp',S.whatsapp],['Email',S.email],['Instagram',S.instagram_url],['Facebook',S.facebook_url]].map(([k,v])=><div className="bx" key={k}><b>{k}</b><p className="muted" style={{margin:0,wordBreak:'break-word'}}>{v||'Not added yet'}</p></div>)}</div></div></section>
 <section className="sec" style={{paddingTop:0}}><div className="wrap"><h2>Send Your Enquiry</h2><Enquiry source="contact_form" options={d.data||[]} subject btn="Send Your Enquiry"/></div></section>
 <section className="sec" style={{paddingTop:0}}><div className="wrap two"><div><h2>Find Us</h2>{map.includes('/embed')?<iframe title="Map" src={map} style={{border:0,width:'100%',height:300,borderRadius:12}} loading="lazy"/>:<a className="btn g" href={map} target="_blank" rel="noopener">Open in Google Maps</a>}</div>
 <div><h2>Business Hours</h2>{hrs.length?hrs.map(([k,v])=><p key={k} style={{margin:'4px 0'}}><b>{k}:</b> {String(v)}</p>):<p className="muted">Business hours will be added soon.</p>}</div></div></section></>}
