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
module.exports={makeAlert,makePrompt,prompt}