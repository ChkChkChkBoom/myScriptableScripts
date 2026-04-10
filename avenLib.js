// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: red; icon-glyph: eye-slash;
//backend utils to make life easier
const VERSION="1.3.1"
function shuffle(l){
  let out = [...l]
  for (let i = 1; i < out.length; i++) {
    let j = (0 | Math.random() * (i + 1))
    let t = out[i]
    out[i] = out[j]
    out[j] = t
  }
  return out
}
function randint(n){
  return Math.floor(Math.random()*n)
}
function readFile(path,separator,handler=FileManager.iCloud()){
  data=handler.readString(path)
  if (separator){
    return data.split(separator)
  }
  return data
}
function count(in){
  let li={}
  let cl=in
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
  return out
}
module.exports={shuffle,randint,readFile,count,VERSION}