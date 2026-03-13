// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-green; icon-glyph: magic;
function makeAlert(title,message){
  let a = new Alert
  a.title=title
  a.message=message
  return a
}
module.exports.makeAlert=(title,message)=>makeAlert(title, message)