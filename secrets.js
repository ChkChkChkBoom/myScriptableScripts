const VERSION = "1.0.0"
let n=FileManager.iCloud()
var eddaLib=importModule(n.bookmarkedPath("eddaLib"))
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
loadNames()