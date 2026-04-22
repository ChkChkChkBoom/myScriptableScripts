// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: cyan; icon-glyph: eye;
// frontend utils (will be absorbing various others soon)
const VERSION = "1.3.0"
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
// Helper: stringify keys safely (handles Symbols)
function keyToString(key) {
  return typeof key === "symbol" ? key.toString() : key
}
// ===================== DICT PRINT =====================
function dictPrintBase(dictionary, name, first = true, lastness = [], seen = new Set()) {
  let output = ""
  if (seen.has(dictionary)) {
    return "[Circular]\n"
  }
  seen.add(dictionary)
  if (first) {
    output += name + "\n"
  }
  let keys = Reflect.ownKeys(dictionary)
  for (let i = 0; i < keys.length; i++) {
    let lasty = lastness.slice()
    // indentation
    for (let j = 0; j < lasty.length; j++) {
      output += lasty[j] ? "  " : "│ "
    }
    // branch
    output += (i === keys.length - 1) ? "└─" : "├─"
    let key = keys[i]
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
  return output
}
function dictPrint(name) {
  return dictPrintBase(eval(name), name)
}
// ===================== LIST PRINT =====================
function listPrintBase(list, name, first = true, lastness = [], seen = new Set()) {
  let output = ""
  if (seen.has(list)) {
    output+="[Circular]: "
  }
  seen.add(list)
  if (first) {
    output += name + "\n"
  }
  for (let i = 0; i < list.length; i++) {
    let lasty = lastness.slice()
    // indentation
    for (let j = 0; j < lasty.length; j++) {
      output += lasty[j] ? "  " : "│ "
    }
    // branch
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
  prompt,
  dictPrintBase,
  dictPrint,
  listPrintBase,
  listPrint,
  VERSION
}