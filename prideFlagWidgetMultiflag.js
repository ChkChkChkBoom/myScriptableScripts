// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: yellow; icon-glyph: flag;
//needs everything prideFlagWidgets does
const VERSION="1.1.2"
const fm=FileManager.iCloud()
const avenLib=importModule(fm.bookmarkedPath("avenLib"))
const fbm=importModule(fm.bookmarkedPath("FBM"))
const flagStorage=importModule(fm.bookmarkedPath("flagStorage"))
const DEBUG=false
const testData="ace,ace,ace"
var g=flagStorage.flagDict
if (DEBUG){
  log("Flag Dictionary Contents:")
  for (let i of Object.keys(g)){
    if (i==="remove"){
      continue
    }
    log("\t"+i+":")
    for (let j=0;j<g[i].length;j++){
      log("\t\tSubset "+(j+1)+":")
      for (let k of g[i][j]){
        log("\t\t\t"+k)
      }
    }
  }
}
function main(flags,subsets=null){
  let hold=[]
  if (subsets===null){
    subsets=[]
    for (let i of flags){
      subsets.push(1)
    }
  }
  while (flags.length>subsets.length){
    subsets.push(1)
  }
  for (let i=0;i<flags.length;i++){
    log(i)
    log(flags[i])
    log(subsets[i])
    if (flags[i]!=="random"){
      hold=[...hold,...fbm.strToList(g[flags[i]][subsets[i]-1][0])]
    }
    else{
      let f=[Object.keys(g)]
      let type=avenLib.shuffle(f)[0]
      let subset=avenLib.randint(g[type].length)
      hold=[...hold,...fbm.strToList(g[type][subset][0])]
    }
  }
  return fbm.toGrad(hold)
}

if (config.runsInWidget){
  let w=new ListWidget()
  let subs=null
  if (args.widgetParameter.split("-").length>1){
    subs=args.widgetParameter.split("-")[1].split(",")
  }
  w.backgroundGradient=main(args.widgetParameter.split("-")[0].split(","),subs)
  Script.setWidget(w)
}
else{
  if (DEBUG){let w=new ListWidget();w.backgroundGradient=main(testData.split(","));w.presentLarge()}
}