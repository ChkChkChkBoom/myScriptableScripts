// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: cyan; icon-glyph: eye;
//frontend utils (will be absorbing various others soon)
const VERSION="1.0.1"
function makeAlert(title,message){
  let a = new Alert
  a.title=title
  a.message=message
  return a
}
module.exports={makeAlert}