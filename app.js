/* Chopra Tour & Travels - shared site script (header, footer, forms) */
(function(){
const $=(s,r)=>(r||document).querySelector(s);
const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const page=document.body.dataset.page||"";
const wa=(t)=>"https://wa.me/"+CFG.phoneRaw+"?text="+encodeURIComponent(t);

/* header + footer */
const nav=[["index.html","Home"],["tours.html","Rates"],["about.html","About"],["company.html","Company"],["contact.html","Contact"]];
const h=$("#site-header");
if(h){
  h.innerHTML='<div class="topbar"><div class="wrap"><span>Open 24 hours · Ludhiana, Punjab</span><span><a href="tel:+'+CFG.phoneRaw+'">'+esc(CFG.phone)+'</a> · <a href="https://www.instagram.com/'+CFG.insta+'" target="_blank" rel="noopener">Instagram</a></span></div></div>'+
  '<header><div class="wrap bar"><a class="logo" href="index.html"><i>C</i><span>Chopra<small>TOUR &amp; TRAVELS</small></span></a>'+
  '<button class="burger" aria-label="Menu" aria-expanded="false"><span></span><span></span><span></span></button>'+
  '<nav id="nav"><ul>'+nav.map(n=>'<li><a href="'+n[0]+'"'+(n[0]===page?' class="on"':'')+'>'+n[1]+'</a></li>').join("")+'<li><a class="btn btn-sun" href="booking.html">Book a cab</a></li></ul></nav></div></header>';
  const b=$(".burger",h),n=$("#nav",h);
  b.addEventListener("click",()=>{const o=n.classList.toggle("open");b.setAttribute("aria-expanded",o)});
}
const f=$("#site-footer");
if(f){
  f.innerHTML='<footer><div class="wrap"><div class="fgrid">'+
  '<div><h4>'+esc(CFG.name)+'</h4><p>From Highways to Himalayas. India\'s most trusted and reliable taxi service provider.</p></div>'+
  '<div><h4>Pages</h4><ul>'+nav.map(n=>'<li><a href="'+n[0]+'">'+n[1]+'</a></li>').join("")+'<li><a href="booking.html">Book a cab</a></li></ul></div>'+
  '<div><h4>Contact</h4><ul><li>'+esc(CFG.address)+'</li><li><a href="tel:+'+CFG.phoneRaw+'">'+esc(CFG.phone)+'</a></li><li>Open 24 hours</li><li><a href="https://www.instagram.com/'+CFG.insta+'" target="_blank" rel="noopener">Instagram @'+CFG.insta+'</a></li><li>Facebook: '+esc(CFG.facebook)+'</li></ul></div>'+
  '</div><div class="copy">© '+new Date().getFullYear()+' '+esc(CFG.name)+'. All rights reserved.</div></div></footer>'+
  '<a class="wa" target="_blank" rel="noopener" aria-label="WhatsApp" href="'+wa("Hello, I need a cab.")+'"><svg viewBox="0 0 32 32"><path d="M16 3C9 3 3.3 8.6 3.3 15.5c0 2.4.7 4.7 1.9 6.6L3 29l7.1-2.1c1.8 1 3.8 1.5 5.9 1.5 7 0 12.7-5.6 12.7-12.5S23 3 16 3zm6.4 17.5c-.3.8-1.6 1.5-2.2 1.6-.6.1-1.3.1-2.1-.1-.5-.2-1.1-.4-1.9-.7-3.3-1.4-5.4-4.7-5.6-4.9-.2-.2-1.3-1.7-1.3-3.2s.8-2.3 1.1-2.6c.3-.3.6-.4.8-.4h.6c.2 0 .5-.1.7.5.3.6.9 2.1 1 2.3.1.2.1.4 0 .6-.1.2-.2.4-.4.6l-.5.6c-.2.2-.4.4-.2.8.2.4 1 1.6 2.1 2.6 1.4 1.2 2.6 1.6 3 1.8.4.2.6.1.8-.1.2-.3.9-1 1.1-1.4.2-.4.5-.3.8-.2.3.1 2 .9 2.3 1.1.3.2.6.3.7.4.1.2.1.8-.2 1.5z"/></svg></a>';
}

/* scroll reveal */
const rv=document.querySelectorAll(".rv");
if("IntersectionObserver" in window){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}}),{threshold:.1});rv.forEach(x=>io.observe(x))}else rv.forEach(x=>x.classList.add("in"));

/* contact form -> WhatsApp */
const cf=$("#contact");
if(cf)cf.addEventListener("submit",e=>{e.preventDefault();const d=new FormData(cf);window.open(wa("Hello, I am "+d.get("name")+".\n"+d.get("msg")),"_blank","noopener")});

/* booking form */
const bf=$("#book");
if(bf){
  const sel=$("#trip");
  sel.innerHTML='<option value="">Select route</option>'+CFG.routes.map(r=>'<option value="'+esc(r.name)+'">'+esc(r.name)+(r.price?' (approx. ₹'+r.price.toLocaleString("en-IN")+')':'')+'</option>').join("");
  let cur=null;
  const err=(id,m)=>{$("#e-"+id).textContent=m||""};
  bf.addEventListener("submit",async e=>{
    e.preventDefault();
    const d=new FormData(bf);["name","phone","trip","n"].forEach(k=>err(k,""));
    let ok=true;
    const name=(d.get("name")||"").trim();
    let ph=String(d.get("phone")||"").replace(/\D/g,"");ph=ph.replace(/^(91|0)(?=\d{10}$)/,"");
    const n=parseInt(d.get("n"),10);
    if(name.length<2){err("name","Enter your name");ok=false}
    if(!/^[6-9]\d{9}$/.test(ph)){err("phone","Enter a valid 10-digit mobile number");ok=false}
    if(!d.get("trip")){err("trip","Select a route");ok=false}
    if(!(n>=1)){err("n","Enter number of passengers");ok=false}
    if(!ok)return;
    const btn=bf.querySelector("button[type=submit]");btn.disabled=true;
    cur={id:"CTT"+Date.now().toString(36).toUpperCase(),created:new Date().toISOString(),name:name,phone:ph,trip:d.get("trip"),n:n,date:d.get("date")||"",intent:d.get("intent"),note:(d.get("note")||"").trim(),advance:CFG.advance,utr:"",pay:"Unpaid",status:"New"};
    let saved=true;try{await DB.save(cur)}catch(x){saved=false}
    bf.hidden=true;$("#pay").hidden=false;
    $("#sum").textContent="Booking "+cur.id+": "+cur.trip+", "+cur.n+" passenger(s)"+(cur.date?" on "+cur.date:"")+"."+(saved?"":" Please also send the details on WhatsApp.");
    $("#amt").textContent="₹"+CFG.advance.toLocaleString("en-IN");
    $("#upiid").textContent=CFG.upi;
    const upi="upi://pay?pa="+encodeURIComponent(CFG.upi)+"&pn="+encodeURIComponent(CFG.upiName)+"&am="+CFG.advance+"&cu=INR&tn="+encodeURIComponent("Booking "+cur.id);
    $("#upilink").href=upi;
    const q=$("#qr");q.innerHTML="";
    if(window.QRCode)new QRCode(q,{text:upi,width:200,height:200});
    $("#wa").href=wa("Hello, I want to book a cab.\nBooking ID: "+cur.id+"\nName: "+cur.name+"\nPhone: "+cur.phone+"\nRoute: "+cur.trip+"\nPassengers: "+cur.n+"\nDate: "+(cur.date||"-")+"\nNote: "+(cur.note||"-"));
    $("#pay").scrollIntoView({behavior:"smooth"});
  });
  const ub=$("#utrbtn");
  if(ub)ub.addEventListener("click",async()=>{
    const u=$("#utr").value.replace(/\s/g,"");err("utr","");
    if(!/^\d{12}$/.test(u)){err("utr","Enter the 12-digit UTR");return}
    try{await DB.update(cur.id,{utr:u,pay:"Submitted"})}catch(x){}
    $("#paid").hidden=false;ub.disabled=true;
  });
}
})();
