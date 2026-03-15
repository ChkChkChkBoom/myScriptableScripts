// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-blue; icon-glyph: magic;
//Requires: eddaLib.js bookmarked as eddaLib

//===============================================================================//|
//What we need:                                                                  //|
//Display (easy)                                                                 //|
//Affect display (hard)                                                          //|
//===============================================================================//|
//Inverted fool=-00                                                              //|
//22 major (0-21)                                                                //|
//14 minor/suit (2-A+knight[N]), 4 suits (wand cup sword pentacle [W/C/S/P])     //|
//(2/3/4/5/6/7/8/9/0/J/N/Q/K)(W/C/S/P)(+/-)                                      //|
//All cards upright or inverse (+/-)                                             //|
//===============================================================================//|
//Not an endorsement but I only know of one online option:                       //|
//https://biddytarot.com/tarot-card-meanings/major-arcana/                       //|
//===============================================================================//|
let n=FileManager.iCloud()
const ON_MY_DEVICE=n.bookmarkExists("eddaLib")
if (ON_MY_DEVICE){
  var ALERTER=importModule(n.bookmarkedPath("eddaLib"))
  //.makeAlert
}
//all the variables I remembered about
let results=[]
let tick=0
//Names of Major Arcana cards
const NAMES={
  "00":"The Fool",
  "01":"The Magician",
  "02":"The High Priestess",
  "03":"The Emperess",
  "04":"The Emperor",
  "05":"The Heirophant",
  "06":"The Lovers",
  "07":"The Chariot",
  "08":"Justice",
  "09":"The Hermit",
  "10":"Wheel of Fortune",
  "11":"Strength",
  "12":"The Hanged Man",
  "13":"Death",
  "14":"Temperance",
  "15":"The Devil",
  "16":"The Tower",
  "17":"The Star",
  "18":"The Moon",
  "19":"The Sun",
  "20":"Judgement",
  "21":"The World"
}
//a little timesaver for later
const INV_MAP={
  "+":"Upright",
  "-":"Inverted"
}
//yay, prototype editing!
//return a copy of self
String.prototype.reflect=function(){return (this.slice(0,-1)).concat(this.slice(-1))}
//sdrawkcab ekaM
String.prototype.toReverse=function(){return this.reflect().split('').reverse().join('')}
//remove first instance of item
Array.prototype.delete=function(item){return [...this.slice(0,this.indexOf(item))].concat(this.slice(this.indexOf(item)+1))}
//remove all instances of item
Array.prototype.erase=function(item){let i=this;while (i.includes(item)){i=i.delete(item)};return i}
//remove item at index h
Array.prototype.excise=function(h){let out=[];for (let i=0;i<this.length;i++){if (i!=h){out.push(this[i])}};return out}
//shuffle a list
Array.prototype.shuffle=function(){
  let out=[...this];
  for (let i=1;i<out.length;i++) {
    let j = 0|Math.random()*(i+1);
    [out[i],out[j]]=[out[j],out[i]];
  }
  return out;
}
//Functions:
function pm(){
  //randomly returns a + or -
  return (Math.random()<0.5)? "+":"-"
}
function genListList(x,y,mods){
  //makes a list of lists, x by y, with modifications
  //mods is [[x,y,newValue],...]. for every item in the list of mods, sets the item at (x,y) to newValue
  x--
  y--
  let out=[]
  //row loop
  for (let i=0;i<=y;i++){
    //make empty row
    let hold=[]
    //for every spot in the row
    for (let j=0;j<=x;j++){
      //add the item in that spot
      hold.push(["a",(String(i)+","+String(j))])
    }
    //then add the row to the result
    out.push(hold)
  }
  //modify according to mods
  for (let m of mods){
    out[m[0]][m[1]]=m[2]//out[y][x]=newValue
  }
  //debug
  //log(out)
  return out
}
//shows a list, used to debug
function readList(l,sep){
  for (let x of l){
    if (Array.isArray(x)){
      let redo=false
      for (let y of x){
        if (Array.isArray(y)){
          redo=true
        }
      }
      if (redo){
        readList(x,sep)
      }
      else{
        log(x.join(sep))
      }
    }
    else{
      log(x)
    }
  }
}
//create a row of UITableCells
function makeRow(l,ll,row){
  //l is display name list, ll is hidden value list, row is for indexing items
  //get an empty dict set up
  let key={}
  //output
  let p=[]
  //turns a/i into button/text
  let k={
    "a":"button",
    "i":"text"
  }
  //make key work
  for (let y=0;y<l.length;y++){
    key[l[y]]=y
  }
  //make each cell
  for (let i of l){
    // i IS A LIST OF FORM ["a"/"i","{name}"]
    let g=eval("UITableCell."+k[i[0]]+"('"+String(i[1])+"')")//UITableCell.{button/text}({name of cell})
    if (i[0]="a"){
      //if its a button, make it do button stuff
      g.dismissOnTap=true
      g.hidden=ll[key[i]]
      g.onTap=()=>{add([row,key[i],g.hidden])}
    }
    else{
      //no getting out of pushing buttons for you!
      g.dismissOnTap=false
    }
    //add to output
    p.push(g)
  }
  //real output
  let out=new UITableRow()
  //make out have all the stuff p has
  for (let z of p){
    out.addCell(z)
  }
  return out
}
//a way to use makeRow
function makeTable(l,ll){
  //same concept as makeRow, except now l and ll are lists of lists
  let p=[]
  //make the rows
  for (let i=0;i<l.length;i++){
    p.push(makeRow(l[i],ll[i],i))
  }
  //make p into something useful
  let out=new UITable()
  for (let j of p){
    out.addRow(j)
  }
  return out
}
function add(item){
  //adds item to results
  let otherItem=item
  otherItem[2]=["i",item[2]]
  tick++
  results.push(otherItem)
}
async function showTable(l,ll){
  //easy way to use makeTable and present it
  let abcde=makeTable(l, ll)
  await abcde.present(false)
}
//helper for making a list into a list of lists
function toListList(x,y,l){
  let num=x*y
  let hold=[]
  for (let i=0;i<y;i++){
    hold.push([])
  }
  for (let i=0;i<num;i++){
    let x2=i%x
    let y2=(i-x2)/x
    hold[y2][x2]=l[i]
  }
  return hold
}
//make sure a number has enough zeroes
function forceZeroes(n,l){
  let out=String(n).toReverse()
  let ll=l-String(n).length
  out=out.concat(dupe(ll,"0")).toReverse()
  return out
}
//non-unity of 2 sets
function nOver(a1, a2) {
  const s1 = new Set(a1)
  const s2 = new Set(a2)
  
  return [
    ...a1.filter(x => !s2.has(x)),
    ...a2.filter(x => !s1.has(x))
  ]
}
//make a random integer from 0 to n-1 (inclusive on both sides)
function randint(n){
  return Math.floor(Math.random()*n)
}
//make the major arcana
function initMajor(){
  let out=[]
  for (let i=0;i<22;i++){
    out.push((forceZeroes(i, 1)).concat(pm()))
  }
  return out.shuffle()
}
//mimic pythons "a"*3 equaling "aaa"
function dupe(i,j){
  let out=""
  for (let k=0;k<=i;k++){
    out=[out,j].join("")
  }
  return out
}
//main
let e=initMajor()
while (tick<3){
  let a=makeTable(genListList(7, 3, results), toListList(7, 3, e))
  await a.present(true)
  results=results.map((inp)=>{return [inp[0],inp[1],["i",inp[2][1]]]})
  //log(results)
}
function read(item){
  let base=[item[0],item[1]].join("")
  let rest=item[2]
  log(`${NAMES[base]} (${INV_MAP[rest]})`)
  return `${NAMES[base]} (${INV_MAP[rest]})`
}
if (ON_MY_DEVICE){
  mes="Cards you selected:"
}
else{
  mes="Please report having seen this message, it means something is wrong with my code. Sorry!"
}
for (const i of results){mes=[mes,"\n",read(i[2][1])].join("");}
if (ON_MY_DEVICE){
  let alert=ALERTER.makeAlert("iTarot",mes)
  alert.present()
}