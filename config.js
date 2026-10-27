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
  /* Optional: fill these from your Firebase project to save bookings online (Firestore). If empty, bookings are saved in this browser only. */
  firebase:{projectId:"",apiKey:""}
};

/* Small storage helper used by app.js and admin.js */
const DB=(function(){
  const LS="chopra_bookings", fb=CFG.firebase, on=!!(fb.projectId&&fb.apiKey);
  const base=on?"https://firestore.googleapis.com/v1/projects/"+fb.projectId+"/databases/(default)/documents/bookings":"";
  const toFS=o=>{const f={};for(const k in o){const v=o[k];f[k]=typeof v==="number"?{integerValue:String(v)}:{stringValue:String(v==null?"":v)};}return f};
  const fromFS=d=>{const o={};for(const k in d.fields){const v=d.fields[k];o[k]=v.integerValue!==undefined?Number(v.integerValue):(v.stringValue||"");}return o};
  const lsGet=()=>{try{return JSON.parse(localStorage.getItem(LS)||"[]")}catch(e){return[]}};
  const lsSet=a=>{try{localStorage.setItem(LS,JSON.stringify(a))}catch(e){}};
  return{
    online:on,
    async save(b){
      if(on){const r=await fetch(base+"?documentId="+encodeURIComponent(b.id)+"&key="+fb.apiKey,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({fields:toFS(b)})});if(!r.ok)throw new Error("save failed");return b}
      const a=lsGet();a.push(b);lsSet(a);return b
    },
    async list(){
      if(on){const r=await fetch(base+"?pageSize=300&key="+fb.apiKey);if(!r.ok)throw new Error("load failed");const j=await r.json();return(j.documents||[]).map(fromFS)}
      return lsGet()
    },
    async update(id,patch){
      if(on){const q=Object.keys(patch).map(k=>"updateMask.fieldPaths="+k).join("&");const r=await fetch(base+"/"+encodeURIComponent(id)+"?"+q+"&key="+fb.apiKey,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({fields:toFS(patch)})});if(!r.ok)throw new Error("update failed");return}
      lsSet(lsGet().map(b=>b.id===id?Object.assign(b,patch):b))
    },
    async remove(id){
      if(on){const r=await fetch(base+"/"+encodeURIComponent(id)+"?key="+fb.apiKey,{method:"DELETE"});if(!r.ok)throw new Error("delete failed");return}
      lsSet(lsGet().filter(b=>b.id!==id))
    }
  };
})();
