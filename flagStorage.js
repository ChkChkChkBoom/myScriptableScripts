// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: database;
// stores flags
const VERSION="1.0.1"
const fm=FileManager.iCloud()
const avenLib=importModule(fm.bookmarkedPath("avenLib"))
var g={
  "remove":(item)=>{self[item]=null},
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
avenLib.readFile(fm.joinPath(fm.documentsDirectory(),"flagNames.txt"),"\n").forEach(x=>{
  x=x.trimRight()
  if (x[0]==="#"){
    //no
  }else{
    let s=x.split("-")
    let name=s[0]
    let aliases=s[1].split(",")
    for (let alias of aliases){
      g[alias]=g[name]
    }
  }
})
//iterative refinement
for (let i of Object.keys(g)){
  if (i[0]==="\\"){
    let hold=g[i]
    g[i.slice(2)]=hold
    g.remove(i)
  }
}
module.exports.flagDict=g