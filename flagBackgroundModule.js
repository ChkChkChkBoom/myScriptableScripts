// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: red; icon-glyph: flag;
const VERSION = "1.0.0"
function toGrad(colors,v){
  let z=1
  if (v){
    z=2
  }
  else{
    z=1
  }
  let out=new LinearGradient()
  out.startPoint=new Point(2-z,z-1)
  out.endPoint=new Point(1, 1)
  out.colors=colors
  let l=colors.length*2
  let li=[]
  for (let i=1;i<l-1;i++){
    li.push(((2*i)-1)/l)
  }
  out.locations=li
//   log(out)
  return out
}
Color.darkPurple=()=>{return new Color("#4B006E", 1)}
Color.darkGreen= () => {return new Color("#06402B",1)}
Color.lightBlue= () => {return new Color("#ADD8E6",1)}
Color.pink= () => {return new Color("#FFB6C1",1)}
Color.custom=(hex,a)=>{
  return new Color(hex,a)
}
// Valid colors (Color.x exists already or implemented in code): Black, Blue, Brown, Clear, Cyan, Dark Grey, Grey, Green, Light Gray, Magenta, Orange, Purple, Red, White, Yellow, Light Blue, Pink, Dark Green
function strToList(str) {
  return str.split(" ").map(name => {
    if (typeof Color[name] !== "function") {
      throw new Error("Invalid color: " + name)
    }
    return Color[name]()
  })
}
module.exports={toGrad,strToList,VERSION}