// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: red; icon-glyph: eye-slash;
//backend utils to make life easier
const VERSION="1.0.0"
function shuffle(l){
  let out=[...l]
  for (let i=1;i<out.length;i++) {
    let j = (0|Math.random()*(i+1))
    [out[i],out[j]]=[out[j],out[i]]
  }
  return out
}
module.exports.shuffle=(l)=>shuffle(l)