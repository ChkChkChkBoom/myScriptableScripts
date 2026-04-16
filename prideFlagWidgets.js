// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: light-blue; icon-glyph: flag-checkered;
//What this needs: flagBackgroundModule.js bookmarked as FBM (might put into another lib), avenLib.js bookmarked as avenLib
const VERSION="1.3.0"
const handler=FileManager.iCloud()
const flagMaker=importModule(handler.bookmarkedPath("FBM"))
const avenLib=importModule(handler.bookmarkedPath("avenLib"))
let masterDebug=false
let testFlag="asexual"
let mainDebug=true||masterDebug
let widgetDebug=true||masterDebug
let mode=(args.widgetParameter || "asexual").toLowerCase()
var g={
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
avenLib.readFile(handler.joinPath(handler.documentsDirectory(),"flagNames.txt"),"\n").forEach(x=>{
  let s=x.split("-")
  let name=s[0]
  let aliases=s[1].split(",")
  for (let alias of aliases){
    g[alias]=g[name]
  }
})
g["random"]=g[avenLib.shuffle(Object.keys(g))[0]]
function main(flag,subset=0){
  let sub
  if (mainDebug){
    log(flag)
  }
  if (!subset){
    sub=1
  }
  else{
    sub=subset
  }
  if (g[flag].length<=subset){
    sub=0
  }
  if (mainDebug){
    log("flag name: "+flag)
    log("subset: "+sub)
  }
  let f=g[flag][sub-1]
  if (mainDebug){
    log("f[0]: "+f[0])
    log("f[1]: "+f[1])
  }
  let out=flagMaker.toGrad(flagMaker.strToList(f[0]),f[1])
  if(mainDebug){log(out)}
  return out
}
function trmain(mod,flag,subset=0){
  let wid=JSON.parse(JSON.stringify(mod))
  wid.backgroundGradient=main(flag, subset)
  return wid
}
function trueCopy(n){
  return JSON.parse(JSON.stringify(n))
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
function antiError(test,testArgs,fallback,fallbackArgs,debug=false){
  let out
  try {
    out=test(...testArgs)
  } catch (err) {
    if ((typeof fallback)=='function'){
      out=fallback(...fallbackArgs)
    } else {
      out=fallback
    }
  }
  return out
}
module.exports.bgmaker=(wid,flag,subset=0)=>trmain(wid,flag, subset)
module.exports.gradMake=(flag,subset=0)=>main(flag, subset)
module.exports.flagDict=g
if (Script.runsInWidget||widgetDebug){
  let a=main(antiError(eval,['args.widgetParameter.split(",")[0])'],testFlag,[]),antiError(eval,['parseInt(args.widgetParameter.split(",")[1])'],0,[]))
  if (Script.runsInWidget){
    Script.setWidget(a)
  } else {
    null
  }
}