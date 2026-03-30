// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: cyan; icon-glyph: eye;
//frontend utils (will be absorbing various others soon)
const VERSION="1.1.1"
function makeAlert(title,message){
  let a = new Alert
  a.title=title
  a.message=message
  return a
}
function makePrompt(title,message,placeholder){
  let a = makeAlert(title,message)
  a.addTextField(placeholder)
  a.addAction("OK")
  return a
}
function prompt(title,message,placeholder){
  let a = makePrompt(title,message,placeholder)
  return a.presentAlert().then(i=>{
    if(i==0){
      return a.textFieldValue(0)
    } else {
      return null
    }
  })
}
function dictPrint(dictionary,name,first=true,lastness=[]){
  let keys=Object.keys(dictionary)
  let output=""
  if (first){
    output+=name+"\n"
  }
  for (let i=0;i<keys.length;i++){
    let lasty=lastness.slice()
    //console.log(i)
    //Make the line before the value
    if (lasty.length>0){
      for (let j=0;j<lasty.length;j++){
        if (lasty[j]==true){
          output+="  "
        } else {
          output+="│ "
        }
      }
    }
    if (i==keys.length-1&&((typeof dictionary[i])!=typeof {"foo":"bar"})){
      output+="└─"
    } else {
      output+="├─"
    }
    output+=keys[i]
    if (typeof dictionary[keys[i]]=="object"){
      //dict case
      output+="\n"
      lasty.push((i==Object.keys(dictionary).length-1))
      output+=dictPrint(dictionary[keys[i]],keys[i],first=false,lasty)
    } else {
      output+=": "+dictionary[keys[i]]+"\n"
    }
  }
  return output
}
module.exports={makeAlert,makePrompt,prompt,dictPrint,VERSION}