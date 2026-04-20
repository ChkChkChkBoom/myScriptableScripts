// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-blue; icon-glyph: paste;
//Bookmarks: Clipboard folder as "clipboards"
//An adaptation of a favorite shortcut
const VERSION = "1.0.0"
const fm = FileManager.iCloud()
const baseDir = fm.bookmarkedPath("clipboards")
if (!fm.fileExists(baseDir)) {
  fm.createDirectory(baseDir, true)
}
async function menu(title, message, options) {
  const a = new Alert()
  a.title = title
  a.message = message || ""
  for (const option of options) {
    a.addAction(option)
  }
  a.addCancelAction("Cancel")
  const result = await a.presentSheet()
  if (result === -1) return null
  return options[result]
}
async function prompt(title, message, defaultValue = "") {
  const a = new Alert()
  a.title = title
  a.message = message || ""
  a.addTextField("", defaultValue)
  a.addAction("OK")
  a.addCancelAction("Cancel")
  const result = await a.presentAlert()
  if (result === -1) return null
  return a.textFieldValue(0).trim()
}
function listFiles() {
  let files = fm.listContents(baseDir)
  files = files.filter(name =>
    name.toLowerCase().endsWith(".txt")
  )
  files.sort((a, b) => a.localeCompare(b))
  return files
}
async function chooseExistingFile(promptText = "Which slot?") {
  const files = listFiles()
  if (files.length === 0) {
    const a = new Alert()
    a.title = "No Files"
    a.message = "There are no saved clipboard files."
    a.addAction("OK")
    await a.presentAlert()
    return null
  }
  return await menu("Choose File", promptText, files)
}
function fullPath(fileName) {
  return fm.joinPath(baseDir, fileName)
}
function ensureTxt(name) {
  if (!name.toLowerCase().endsWith(".txt")) {
    return name + ".txt"
  }
  return name
}
async function saveNewFile() {
  let name = await prompt(
    "New File",
    "What should I name it?"
  )
  if (!name) return
  name = ensureTxt(name)
  const path = fullPath(name)
  const clip = Pasteboard.pasteString() || ""
  fm.writeString(path, clip)
  const a = new Alert()
  a.title = "Saved"
  a.message = `Saved clipboard to:\n${name}`
  a.addAction("OK")
  await a.presentAlert()
}
async function overwriteFile() {
  const selected = await chooseExistingFile("Which file should be overwritten?")
  if (!selected) return
  const path = fullPath(selected)
  const clip = Pasteboard.pasteString() || ""
  fm.writeString(path, clip)
  const a = new Alert()
  a.title = "Overwritten"
  a.message = `Updated:\n${selected}`
  a.addAction("OK")
  await a.presentAlert()
}
async function loadFile() {
  // Shows file names only
  const selected = await chooseExistingFile("Which file should be loaded?")
  if (!selected) return
  const path = fullPath(selected)
  if (fm.isFileStoredIniCloud(path)) {
    await fm.downloadFileFromiCloud(path)
  }
  const content = fm.readString(path)
  Pasteboard.copyString(content)
  const a = new Alert()
  a.title = "Loaded"
  a.message = `Copied contents of:\n${selected}\nto clipboard`
  a.addAction("OK")
  await a.presentAlert()
}
async function loadFromShareSheetInput() {
  if (!args.fileURLs || args.fileURLs.length === 0) {
    return false
  }
  try {
    const fileURL = args.fileURLs[0]
    const path = fileURL.replace("file://", "")
    if (fm.isFileStoredIniCloud(path)) {
      await fm.downloadFileFromiCloud(path)
    }
    const content = fm.readString(path)
    Pasteboard.copyString(content)
    const a = new Alert()
    a.title = "Loaded"
    a.message = "Clipboard restored from shared file."
    a.addAction("OK")
    await a.presentAlert()
    return true
  } catch (e) {
    return false
  }
}
async function main() {
  // Share sheet file input support
  const handledInput = await loadFromShareSheetInput()
  if (handledInput) return
  const mode = await menu(
    "Parallel Clipboard",
    "Save or load?",
    ["Save", "Load"]
  )
  if (!mode) return
  if (mode === "Save") {
    const saveMode = await menu(
      "Save",
      "New or existing?",
      ["New file", "Overwrite file"]
    )
    if (!saveMode) return
    if (saveMode === "New file") {
      await saveNewFile()
    } else {
      await overwriteFile()
    }
  }
  if (mode === "Load") {
    await loadFile()
  }
}
await main()
Script.complete()