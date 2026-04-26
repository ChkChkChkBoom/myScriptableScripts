// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: green; icon-glyph: magic;
//does all the setup a script can do.
const VERSION="1.0.0"
//makes a clipboard folder
let fm=FileManager.iCloud()
if (!fm.fileExists(fm.joinPath(fm.documentsDirectory(), "clipboards"))){
  fm.createDirectory(fm.joinPath(fm.documentsDirectory(), "clipboards"))
}