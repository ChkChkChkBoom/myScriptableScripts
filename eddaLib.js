// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: cyan; icon-glyph: eye;
// frontend utils (will be absorbing various others soon)
const VERSION = "1.4.0"
function makeAlert(title, message) {
  let a = new Alert
  a.title = title
  a.message = message
  return a
}
function makePrompt(title, message, placeholder) {
  let a = makeAlert(title, message)
  a.addTextField(placeholder)
  a.addAction("OK")
  return a
}
function prompt(title, message, placeholder) {
  let a = makePrompt(title, message, placeholder)
  return a.presentAlert().then(i => {
    if (i == 0) {
      return a.textFieldValue(0)
    } else {
      return null
    }
  })
}
function menu(title,optionNames,subtitle="",optionFuncts=null,titleMetadata={"font":"","color":""},subtitleMetadata={"font":"","size":""},optionMetadata=[],fullscreen=false){
  return new Promise(resolve => {
    log("resolve started")
    if (typeof optionFuncts=="function"){
      log("single function detected")
      let hold=optionFuncts
      optionFuncts=[]
      optionNames.forEach(()=>(optionFuncts.push(hold)))
      log("done")
    }
    if (optionFuncts===null){
      log("fallback function")
      optionFuncts=[]
      optionNames.forEach(()=>(optionFuncts.push(null)))
      log("done")
    }
    log("making output")
    let output=new UITable()
    let rows=[]
    let titleRow=new UITableRow()
    let titleCell=subtitle?UITableCell.text(title,subtitle):UITableCell.text(title)
    titleCell.dismissOnTap=false
    log("making metadata")
    if (titleMetadata.font){
      titleCell.titleFont=titleMetadata.font
    }
    if (titleMetadata.color){
      titleCell.titleColor=titleMetadata.color
    }
    if (subtitleMetadata.font){
      titleCell.subtitleFont=subtitleMetadata.font
    }
    if (subtitleMetadata.color){
      titleCell.subtitleColor=subtitleMetadata.color
    }
    titleRow.addCell(titleCell)
    rows.push(titleRow)
    log("making function")
    for (let i=0;i<optionNames.length;i++){
      let cell=UITableCell.button(optionNames[i]||i+1)
      let input={}
      cell.index=i
      let row=new UITableRow()
      log("using optional function?")
      if (optionFuncts!==null&&optionFuncts[i]!==null){
        log("yes")
        let funct=optionFuncts[i]
        let num=i
        input.cell=cell
        log("making async")
        cell.onTap=async ()=>{
          let out=await funct(input)
          resolve(out!==undefined?out:num)
        }
        log("done")
      }else{
        log("no")
        let num=i
        cell.onTap=()=>resolve(num)
        log("done")
      }
      cell.dismissOnTap=true
      if (optionMetadata[i]){
        cell.titleColor=(optionMetadata[i]["titleColor"]?optionMetadata[i]["titleColor"]:cell.titleColor)
        cell.titleFont=(optionMetadata[i]["titleFont"]?optionMetadata[i]["titleFont"]:cell.titleFont)
      }
      row.addCell(cell)
      rows.push(row)
    }
    for (let i of rows){
      output.addRow(i)
    }
    log("done")
    output.present(fullscreen)
    log("DONE")
  })
}
function keyToString(key) {
  return typeof key === "symbol" ? key.toString() : key
}
function dictPrintBase(dictionary, name, first = true, lastness = [], seen = new Set()) {
  let output = ""
  if (first) {
    output += name + "\n"
  }
  let keys = Reflect.ownKeys(dictionary)
  for (let i = 0; i < keys.length; i++) {
    let lasty = lastness.slice()
    for (let j = 0; j < lasty.length; j++) {
      output += lasty[j] ? "  " : "│ "
    }
    output += (i === keys.length - 1) ? "└─" : "├─"
    let key = keys[i]
    if (seen.has(dictionary[key])) {
      output += "[Circular]: "
    }
    let keyName = keyToString(key)
    let value = dictionary[key]
    output += keyName
    if (Array.isArray(value)) {
      output += "\n"
      lasty.push(i === keys.length - 1)
      output += listPrintBase(value, keyName, false, lasty, seen)
    } else if (typeof value === "object" && value !== null) {
      output += "\n"
      lasty.push(i === keys.length - 1)
      output += dictPrintBase(value, keyName, false, lasty, seen)
    } else {
      output += ": " + value + "\n"
    }
  }
  seen.add(dictionary)
  return output
}
function dictPrint(name) {
  return dictPrintBase(eval(name), name)
}
function listPrintBase(list, name, first = true, lastness = [], seen = new Set()) {
  let output = ""
  if (seen.has(list)) {
    let lasty = lastness.slice()
    for (let j = 0; j < lasty.length; j++) {
      output += lasty[j] ? "  " : "│ "
    }
    output += (i === list.length - 1) ? "└─" : "├─"
    return output+"[Circular]\n"
  }
  seen.add(list)
  if (first) {
    output += name + "\n"
  }
  for (let i = 0; i < list.length; i++) {
    let lasty = lastness.slice()
    for (let j = 0; j < lasty.length; j++) {
      output += lasty[j] ? "  " : "│ "
    }
    output += (i === list.length - 1) ? "└─" : "├─"
    let value = list[i]
    if (Array.isArray(value)) {
      output += "[list]\n"
      lasty.push(i === list.length - 1)
      output += listPrintBase(value, name, false, lasty, seen)
    } else if (typeof value === "object" && value !== null) {
      output += "{dict}\n"
      lasty.push(i === list.length - 1)
      output += dictPrintBase(value, name, false, lasty, seen)
    } else {
      output += value + "\n"
    }
  }
  return output
}
function listPrint(name) {
  return listPrintBase(eval(name), name)
}
module.exports = {
  makeAlert,
  makePrompt,
  menu,
  prompt,
  dictPrintBase,
  dictPrint,
  listPrintBase,
  listPrint,
  VERSION
}