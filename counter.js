// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: sort-numeric-down;
let li={}
let cl=Pasteboard.pasteString()
let cvs=cl.split(",")
for (const entry of cvs){
  li[entry]="0"
}
for (const entry of cvs){
  let aaaa = parseInt(li[entry])+1
  let bbbb = aaaa.toString()
  li[entry]=aaaa
}
var out="Sample size: "+cvs.length
let ab=Object.keys(li)
for (let c=0;c<ab.length;c++){
  let e=ab[c]
  if (!(li[e]=="0")){
    let aa=((c==0)? "\n":"\n")
    let ef=aa+e+": "+li[e]
    out+=ef
  }
}
Pasteboard.copy(out)
log(out)
alerrr=new Alert
alerrr.message=out
alerrr.present()