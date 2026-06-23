// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: green; icon-glyph: magic;
//Imported to upgrade prototypes to better prototypes
//janky imports go brrr
const VERSION="2.0.0"
//log("skills loaded")
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
    let out=[...this]
    for (let i=1;i<out.length;i++) {
        let j = 0|Math.random()*(i+1);
        [out[i],out[j]]=[out[j],out[i]]
    }
    return out
}
function backup(){
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
        let out=[...this]
        for (let i=1;i<out.length;i++) {
            let j = 0|Math.random()*(i+1);
            [out[i],out[j]]=[out[j],out[i]]
        }
        return out
    }
}
let install=backup
let superBackup="//return a copy of self\nString.prototype.reflect=function(){return (this.slice(0,-1)).concat(this.slice(-1))}\n//sdrawkcab ekaM\nString.prototype.toReverse=function(){return this.reflect().split('').reverse().join('')}\n//remove first instance of item\nArray.prototype.delete=function(item){return [...this.slice(0,this.indexOf(item))].concat(this.slice(this.indexOf(item)+1))}\n//remove all instances of item\nArray.prototype.erase=function(item){let i=this;while (i.includes(item)){i=i.delete(item)};return i}\n//remove item at index h\nArray.prototype.excise=function(h){let out=[];for (let i=0;i<this.length;i++){if (i!=h){out.push(this[i])}};return out}\n//shuffle a list\nArray.prototype.shuffle=function(){\n\tlet out=[...this]\n\tfor (let i=1;i<out.length;i++) {\n\t\tlet j = 0|Math.random()*(i+1)\n\t\tlet temp = out[i]\nout[i] = out[j]\nout[j] = temp\n\t}\n\treturn out}"
module.exports={VERSION,install,backup,superBackup}