// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: teal; icon-glyph: magic;
// assumes tarotData (assumes lucaLib)
// currently implemented:
// Unspecified (only order is given, not compatible with web display)
// Past/Present/Future (or any 3 card)
// CLArity
// CONnection
// Year AHead
// CHANGE THESE AS NEEDED
//Minor, Major, or Full<-(default)
const Selection="Full"
//render in web mode?
const Webview=true
//send to a webhook reciever?
const UseWebhook=false
//what reciever to use?
const HookTarget='discord'
//display symbolic info?
const Moreinfo=true
//which spread to use?
const Spreadused="CLA"
//only applies to unspecified spread
const Cards=3
//
// ACTUAL CODE
//
const SELECTION=(["minor","major","full"].includes(Selection.toLowerCase()))?Selection.toLowerCase():"full"
const VERSION="1.0.0"
const WEBVIEW=Webview
const MOREINFO=Moreinfo
const SPREAD=Spreadused
const CARDS=Cards
const USEHOOK=UseWebhook
const HOOKTARGET=HookTarget
let cd
let unspecified=false
switch (SPREAD){
  case "PPF":
    cd=3
    break
  case "CLA":
    cd=4
    break
  case "CON":
    cd=5
    break
  case "YAH":
    cd=13
    break
  default:
    log("Defaulted from "+SPREAD)
    cd=CARDS
    unspecified=true
}
const CARDSDRAWN=cd
const VERSION="1.0.0"
let n=FileManager.iCloud()
const skillLib=importModule(n.bookmarkedPath("skillLib"))
// my rage is immense at having to do this
skillLib.install()
// life is hard
eval(skillLib.superBackup)
const eddaLib=importModule(n.bookmarkedPath("eddaLib"))
const sonarLib=importModule(n.bookmarkedPath("sonarLib"))
let html=true
let tarotData
try{
  tarot=importModule(n.bookmarkedPath("tarotData"))
  let tarotData=tarot.data
}catch{
  html=false
}
const NAMES=tarot.dNames
const INTERNALNAMES=tarot.iNames
const SPREADS=tarot.spreadData
//a little timesaver for later
const INV_MAP={
  "+":"Upright",
  "-":"Reversed"
}
//Functions:
function pm(){
  //randomly returns a + or -
  return (Math.random()<0.5)? "+":"-"
}
function forceZeroes(n,l){
  let preOut=String(n)
  let out=preOut.toReverse()
  let ll=l-(out.length)
  out=(out+dupe(ll,"0")).toReverse()
  return out
}
function initMajor(){
  let deck=[]
  for (let i=0;i<=21;i++){
    let sign=pm()
    let base=forceZeroes(i,2)
    let cardData="M"+base+sign
    deck.push(cardData)
  }
  deck=deck.shuffle()
  return deck
}
function initMinor(){
  let deck=[]
  //S-tier code coming up here
  for (let i of "WSCP"){
    for (let j=1;j<=14;j++){
      deck.push(i+forceZeroes(j,2)+pm())
    }
  }
  deck=deck.shuffle()
  return deck
}
function initFull(){
  //so advanced!
  let minor=initMinor()
  let major=initMajor()
  let full=[...minor,...major]
  full=full.shuffle()
  return full
}
function draw(deck,number){
  let results=[]
  for (let i=0;i<number;i++){
    results.push(new Result(deck[i]))
  }
  return results
}
function dupe(i,j){
  let out=""
  for (let k=0;k<i;k++){
    out+=j
  }
  return out
}
// a result needs location (maybe), position (definitely), and data (name, +/-, number, could be stored as XX+)
class Result{
  constructor(cardValue){
    this.cardValue=cardValue
    this.name=tarot.iNames[cardValue[0]+cardValue[1]+cardValue[2]]
    this.reversed=(cardValue[3]==="-")
    this.symbolic=tarot.data[this.name][this.reversed?"reversed":"upright"]
    this.displayName=tarot.data[this.name]["name"]+", "+(this.reversed?"Reversed":"Upright")
  }
}
//'<img width="71" height="95" src=""'+tarotData[results[i-1].name]["link"]+'" style="transform: scaleY('+results[i-1].reversed?"-1":"1"+')">'
async function displayWeb(results){
  let style=".grid {display: grid;grid-template-columns: repeat(3, 71px);gap: 0px;} .card {width: 71px;height: 95px;}"
  let EVIL='<div class="card"></div>'
  let map=[EVIL]
  for (let i of results){
    map.push('<img width="71" height="95" crossorigin="anonymous" src="'+tarot.data[i.name]["link"]+'" style="transform: scaleY('+(i.reversed?"-1":"1")+') scaleX('+(i.reversed?"-1":"1")+')">')
  }
  let spreadLocations=SPREADS[SPREAD]["positionMatrix"]
  let htmlString = "<table cellspacing='0' cellpadding='0'>"
  for (let y = 0; y < 7; y++) {
    htmlString += "<tr>"
    for (let x = 0; x < 7; x++) {
      htmlString += `
        <td style="width:71px;height:95px;">
          ${map[spreadLocations[y][x]] || ""}
        </td>
      `
    }
    htmlString += "</tr>"
  }
  htmlString += "</table>"
  const SPREADDATA=SPREADS[SPREAD]
  let outString="======Your Cards (Spread: "+SPREADDATA["name"]+"):======<br>"
  for (let i=1;i<=CARDSDRAWN;i++){
    outString+=(unspecified?"Position "+i:SPREADDATA["positionMeaning"][i])+": <b>"+results[i-1].displayName
    outString+="</b><br>"
    outString+=(MOREINFO)?("\u2514\u2574Meanings: "+results[i-1].symbolic+"<br>"):""
  }
  htmlString+=outString
  let display=new WebView()
  display.loadHTML(htmlString)
  await display.present(true)
  if (USEHOOK){await sonarLib.sendWebhook(htmlString,style,HOOKTARGET,"Result:")}
}
function displayText(results){
  const SPREADDATA=SPREADS[SPREAD]
  let outString="\n======Your Cards:======\n"
  for (let i=1;i<=CARDSDRAWN;i++){
    outString+=(unspecified?"Position "+i:SPREADDATA["positionMeaning"][i])+": "+results[i-1].displayName
    outString+="\n"
    outString+=(MOREINFO)?("\u2514\u2574Meanings: "+results[i-1].symbolic+"\n"):""
  }
  log(outString)
}
async function main(){
  //great security
  let deck=eval("init"+(SELECTION[0].toUpperCase()+(SELECTION.slice(1))+"()"))
  let results=draw(deck,CARDSDRAWN)
  if (WEBVIEW&&(!unspecified)){await displayWeb(results)}else{displayText(results)}
}
await main()