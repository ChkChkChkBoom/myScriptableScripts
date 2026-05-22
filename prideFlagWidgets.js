// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: yellow; icon-glyph: flag;
//What this needs:
//  flagBackgroundModule.js bookmarked as FBM
//  avenLib.js bookmarked as avenLib
//  flagStorage.js bookmarked as flagStorage
const VERSION="1.4.2"
const handler=FileManager.iCloud()
const flagMaker=importModule(handler.bookmarkedPath("FBM"))
const avenLib=importModule(handler.bookmarkedPath("avenLib"))
const flagStorage=importModule(handler.bookmarkedPath("flagStorage"))
let masterDebug=false
let testFlag="asexual"
let mainDebug=false||masterDebug
let widgetDebug=false||masterDebug
let mode=(args.widgetParameter || (Keychain.get("baseFlag") || "asexual")).toLowerCase()
var g=flagStorage.flagDict
g["random"]=g[avenLib.shuffle(Object.keys(g).slice(1))[0]]
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