// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: green; icon-glyph: magic;
//does all the setup a script can do.
const VERSION="1.2.0"
//makes a clipboard folder
let fm=FileManager.iCloud()
if (!fm.fileExists(fm.joinPath(fm.documentsDirectory(), "clipboards"))){
  fm.createDirectory(fm.joinPath(fm.documentsDirectory(), "clipboards"))
}
//initializes keychain
const eddaLib=importModule(n.bookmarkedPath("eddaLib"))
let dir=fm.documentsDirectory()
async function loadNames(){
    let path = fm.joinPath(dir, "names.txt")
    if (!fm.isFileDownloaded(path)) {
        await fm.downloadFileFromiCloud(path)
    }
    let text = fm.readString(path)
    let list = []
    for (let line of text.split("\n")) {
        line = line.trim()
        if (!line || line.startsWith("#")) continue
        list.push(line)
    }
    for (let name of list) {
        let a=eddaLib.prompt("Data Entry",name+":","")
        Keychain.set(name,a)
    }
}
await loadNames()