// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: green; icon-glyph: eye-slash;
const VERSION = "1.1.0"
let n=FileManager.iCloud()
var eddaLib=importModule(n.bookmarkedPath("eddaLib"))
let dir= n.documentsDirectory()
async function loadNames(){
    let path = n.joinPath(dir, "names.txt")
    if (!n.isFileDownloaded(path)) {
        await n.downloadFileFromiCloud(path)
    }
    let text = n.readString(path)
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