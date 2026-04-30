// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: green; icon-glyph: magic;
//Imported to upgrade prototypes to better prototypes
//janky imports go brrr
const VERSION="1.1.0"
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
module.exports={VERSION}