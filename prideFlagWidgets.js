// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: light-blue; icon-glyph: flag;
//What this needs: flagBackgroundModule.js bookmarked as FBM, avenLib.js bookmarked as avenLib
const VERSION="1.0.1"
const handler=FileManager.iCloud()
const flagMaker=importModule(handler.bookmarkedPath("FBM"))
const avenLib=importModule(handler.bookmarkedPath("avenLib"))
const DEBUG=false
let mode=(args.widgetParameter || "aroace").toLowerCase()
let g={
  "asexual":[["black gray white purple",false]],
  "pride":[["red orange yellow green blue purple",false]],
  "aroace":[["orange yellow white lightBlue blue",false]],
  "transgender":[["lightBlue pink white pink lightBlue",false]],
  "nonbinary":[["yellow white purple black",false]],
  "lesbian":[["red orange yellow white pink magenta purple",false]],
  "aromantic":[["darkGreen green white gray black",false]],
  "pansexual":[["magenta yellow blue",false]],
  "demigirl":[["darkGray lightGray pink white"+" "+"darkGray lightGray pink".split(" ").reverse().join(" "),false]],
  "demigender":[["darkGray lightGray yellow white"+" "+"darkGray lightGray yellow".split(" ").reverse().join(" "),false]],
  "demiboy":[["darkGray lightGray blue white blue lightGray darkGray",false]],
  "transfem":[["white pink magenta black",false]],
  "transmasc":[["white lightBlue blue black",false]],
  "quoiromantic":[["black green blue gray",false]],
  "quoisexual":[["black white green blue",false]],
  "femaric":[["black white pink",true]],
  "mascic":[["black white blue",true]],
  "cupioquoiromantic":[["black green white pink magenta",false]],
  "orientedaroace":[["black gray white cyan",false],["darkGreen green white cyan blue",false]],
  "bisexual":[["magenta magenta magenta magenta purple purple purple blue blue blue blue",false]],
  "androgyne":[["magenta darkPurple blue",true],["gray gray gray purple purple purple purple gray pink pink pink pink gray gray gray",false]]
}
g["random"]=g[avenLib.shuffle(Object.keys(g))[0]]
function main(flag,subset=0){
  let sub
  if (subset==0){
    sub=1
  }
  else{
    sub=subset
  }
  if (g[flag].length<=subset){
    sub=0
  }
  if (DEBUG){
    log("flag name: "+flag)
    log("subset: "+sub)
  }
  let f=g[flag][sub-1]
  if (DEBUG){
    log("f[0]: "+f[0])
    log(flagMaker.strToList(f[0]))
    log("f[1]: "+f[1])
  }
  let out=flagMaker.toGrad(flagMaker.strToList(f[0]),f[1])
  if(DEBUG){log(out)}
  return out
}
function trmain(mod,flag,subset){
  let wid=trueCopy(mod)
  wid.backgroundGradient=main(flag, subset)
  return wid
}
function trueCopy(n){
  log(n)
  let m=n.construct
  log(m)
  let k=Object.keys(n)
  for (let i of k){
    m[k]=n[k]
  }
  return m
}
function side(a,b,c){
  if (((parseFloat(Device.systemVersion())>=15)&&(Device.name()=="iPad"&&(Device.isInLandscapeLeft()||Device.isInLandscapeRight())))){
    return a
  }
  else{
    if (Device.isInLandscapeLeft()||Device.isInLandscapeRight()){
      return b
    }
    else{
      return c
    }
  }
}
if (!Script.runsInWidget){
  let d=new ListWidget()
  d.backgroundGradient=main(mode)
  side(((x)=>x.presentExtraLarge()),((x)=>x.presentMedium()),((x)=>x.presentLarge()))(d)
}
if (false){
  let ab=new Color("#000000")
  log(Object.create(ab))
  trueCopy(new Color("#000000"))
}
module.exports.bgmaker=(wid,flag,subset=0)=>trmain(wid,flag, subset)
module.exports.gradMake=(flag,subset=0)=>main(flag, subset)
module.exports.flagTypes=Object.keys(g)
module.exports.lookup=(flag)=>g[flag]
if (Script.runsInWidget){
  let a=main((args.widgetParameter.split(",")[0]),(parseInt(args.widgetParameter.split(",")[1])|0))
  Script.setWidget(a)
}