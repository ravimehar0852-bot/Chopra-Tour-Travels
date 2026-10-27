/* Chopra Tour & Travels - site settings. Edit the values below. */
const CFG={
  name:"Chopra Tour & Travels",
  owner:"Nikhil Chopra",
  phone:"+91 77102 99028",
  phoneRaw:"917710299028",
  address:"VV2Q+RJ4, Shimlapuri, Ludhiana, Punjab 141003",
  insta:"nikhilchopra_0201",
  facebook:"Nikhil Chopra",
  /* UPI for advance payment: put the real UPI ID here */
  upi:"PASTE-UPI-ID@bank",
  upiName:"Chopra Tour & Travels",
  advance:500,
  routes:[
    {name:"Ludhiana to Chandigarh Airport",price:1800},
    {name:"Ludhiana to Amritsar Airport",price:2800},
    {name:"Ludhiana to Delhi Airport",price:3500},
    {name:"Outstation / All India trip",price:0}
  ],
  /* Admin password is stored as a SHA-256 hash, not as plain text */
  adminHash:"0aed5213caf2533cb6bbcfdbf53919215ab51bba5e7d6431e803f210a284213c",
  /* Firebase: fill projectId and apiKey (Project settings > Your apps > Web app), and adminEmail (the admin user you create in Firebase Authentication). If empty, bookings are saved in this browser only. */
  adminEmail:"Choparatravel@gmail.com",
  firebase:{projectId:"chopara-travel-2641b",apiKey:"AIzaSyAMoC3v2Gp5tHWphiKtcKj2PACOQdqMa5o"}
};

/* Storage helper used by app.js and admin.js (Firestore REST + Firebase Auth for admin) */
const DB=(function(){
  const LS="chopra_bookings", AK="chopra_admin_auth", fb=CFG.firebase, on=!!(fb.projectId&&fb.apiKey);
  const base=on?"https://firestore.googleapis.com/v1/projects/"+fb.projectId+"/databases/(default)/documents/bookings":"";
  let tok="";
  const hd=()=>{const h={"Content-Type":"application/json"};if(tok)h.Authorization="Bearer "+tok;return h};
  const toFS=o=>{const f={};for(const k in o){const v=o[k];f[k]=typeof v==="number"?{integerValue:String(v)}:{stringValue:String(v==null?"":v)};}return f};
  const fromFS=d=>{const o={};for(const k in d.fields){const v=d.fields[k];o[k]=v.integerValue!==undefined?Number(v.integerValue):(v.stringValue||"");}return o};
  const lsGet=()=>{try{return JSON.parse(localStorage.getItem(LS)||"[]")}catch(e){return[]}};
  const lsSet=a=>{try{localStorage.setItem(LS,JSON.stringify(a))}catch(e){}};
  const keep=j=>{tok=j.idToken||j.id_token;const rt=j.refreshToken||j.refresh_token;try{localStorage.setItem(AK,rt)}catch(e){}};
  return{
    online:on,
    /* admin sign-in with the Firebase Auth user (email + password) */
    async login(pw){
      const r=await fetch("https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key="+fb.apiKey,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:CFG.adminEmail,password:pw,returnSecureToken:true})});
      const j=await r.json().catch(()=>({}));if(!r.ok)throw new Error((j.error&&j.error.message)||"bad login");keep(j)
    },
    /* stay logged in on this device using the saved refresh token */
    async resume(){
      let rt="";try{rt=localStorage.getItem(AK)||""}catch(e){}
      if(!rt)return false;
      const r=await fetch("https://securetoken.googleapis.com/v1/token?key="+fb.apiKey,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:"grant_type=refresh_token&refresh_token="+encodeURIComponent(rt)});
      if(!r.ok)return false;keep(await r.json());return true
    },
    logout(){tok="";try{localStorage.removeItem(AK)}catch(e){}},
    async save(b){
      if(on){const r=await fetch(base+"?documentId="+encodeURIComponent(b.id)+"&key="+fb.apiKey,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({fields:toFS(b)})});if(!r.ok)throw new Error("save failed");return b}
      const a=lsGet();a.push(b);lsSet(a);return b
    },
    async list(){
      if(on){const r=await fetch(base+"?pageSize=300&key="+fb.apiKey,{headers:hd()});if(!r.ok)throw new Error("load failed");const j=await r.json();return(j.documents||[]).map(fromFS)}
      return lsGet()
    },
    async update(id,patch){
      if(on){const q=Object.keys(patch).map(k=>"updateMask.fieldPaths="+k).join("&");const r=await fetch(base+"/"+encodeURIComponent(id)+"?"+q+"&key="+fb.apiKey,{method:"PATCH",headers:hd(),body:JSON.stringify({fields:toFS(patch)})});if(!r.ok)throw new Error("update failed");return}
      lsSet(lsGet().map(b=>b.id===id?Object.assign(b,patch):b))
    },
    async remove(id){
      if(on){const r=await fetch(base+"/"+encodeURIComponent(id)+"?key="+fb.apiKey,{method:"DELETE",headers:hd()});if(!r.ok)throw new Error("delete failed");return}
      lsSet(lsGet().filter(b=>b.id!==id))
    }
  };
})();
    
