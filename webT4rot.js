// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: green; icon-glyph: magic;
// assumes tarotData (assumes lucaLib)
// currently implemented:
// Unspecified (only order is given, not compatible with web display)
// Past/Present/Future (or any 3 card)
// CLArity
// CONnection
// celtic CRoSs
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
const Spreadused="CRS"
//only applies to unspecified spread
const Cards=3
//
// ACTUAL CODE
//
const SELECTION=(["minor","major","full"].includes(Selection.toLowerCase()))?Selection.toLowerCase():"full"
const VERSION="2.0.0"
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
  case "CRS":
    cd=11
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
//fuck css
async function displayWeb(results){
  let style=".grid {display: grid;grid-template-columns: repeat(3, 95px);gap: 0px;} .card {width: 95px;height: 95px;}"
  let EVIL='<div class="card"></div>'
  let map=[EVIL]
  let incrementor=0
  for (let i of results){
    map.push('<img height=95 crossorigin="anonymous" text-align: "center" src="'+tarot.data[i.name]["link"]+'" style="transform: scaleY('+(i.reversed?"-1":"1")+') scaleX('+(i.reversed?"-1":"1")+')">')
  }
  let spreadLocations=SPREADS[SPREAD]["positionMatrix"]
  let htmlString = "<table cellspacing='0' cellpadding='0'>"
  for (let y = 0; y < 7; y++) {
    htmlString += "<tr>"
    for (let x = 0; x < 7; x++) {
      if (typeof spreadLocations[y][x]==="string"){
        let crossData=SPREADS[SPREAD]["crosses"][spreadLocations[y][x]]
        let req1=new Request("")
        req1.url=tarot.data[results[crossData[0]-1].name].link
        let img1=await req1.loadImage()
        let req2=new Request("")
        req2.url=tarot.data[results[crossData[1]-1].name].link
        let img2=await req2.loadImage()
        let cross=await buildCross(img1,img2)
        let b64=Data.fromPNG(cross).toBase64String()
        htmlString += `
        <td style="text-align:center;width:95px;height:95px;">
          <img crossorigin="anonymous" src="data:image/png;base64,${b64}">
        </td>
      `
      }else{
        htmlString += `
          <td style="text-align:center;width:95px;height:95px;">
            ${map[spreadLocations[y][x]] || ""}
          </td>
        `
      }
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
async function buildCross(a,b){
  //a card is 71x95, square is 95x95, thus a card has 12 px on each side
  let context=new DrawContext()
  let size=new Size(95,95)
  context.size=size
  let Ra=new Rect(12,0,71,95)
  let Rb=new Rect(0,12,95,71)
  context.drawImageInRect(a,Ra)
  let rb=await rotateImage(b,90)
  context.drawImageInRect(rb,Rb)
  return context.getImage()
}
async function rotateImage(image, degrees) {
  let base64 = Data.fromPNG(image).toBase64String()

  let html = `
    <canvas id="canvas"></canvas>
    <script>
      const img = new Image();
      img.onload = () => {
        const canvas = document.getElementById("canvas");
        const ctx = canvas.getContext("2d");
        const radians = ${degrees} * Math.PI / 180;
        const is90or270 = Math.abs(${degrees}) % 180 === 90;
        canvas.width = is90or270 ? img.height : img.width;
        canvas.height = is90or270 ? img.width : img.height;
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(radians);
        ctx.drawImage(
          img,
          -img.width / 2,
          -img.height / 2
        );
        document.body.dataset.result =
          canvas.toDataURL("image/png");
      };
      img.src = "data:image/png;base64,${base64}";
    </script>
  `
  let wv = new WebView()
  await wv.loadHTML(html)
  let resultDataUrl = null
  while (resultDataUrl === null) {
    resultDataUrl = await wv.evaluateJavaScript(
      "document.body.dataset.result || null",
      false
    )
    if (resultDataUrl === null) {
      await new Promise(resolve => setTimeout(resolve, 10))
    }
  }
  let prefix = "data:image/png;base64,"
  let cleanBase64 = resultDataUrl.slice(prefix.length)
  return Image.fromData(
    Data.fromBase64String(cleanBase64)
  )
}