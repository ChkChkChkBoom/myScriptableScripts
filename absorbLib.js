// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: green; icon-glyph: magic;
const VERSION="1.1.0"
const OWNER = "ChkChkChkBoom"
const REPO = "myScriptableScripts"
const lucaLib=importModule(FileManager.iCloud().bookmarkedPath("lucaLib"));
if (!Keychain.contains("githubToken")) {
    throw new Error("GitHub token not found in Keychain, see bookmarks.js for instructions")
}
const TOKEN = Keychain.get("githubToken")
// Remove sensitive fields
let blacklist=["token", "auth", "password", "deviceId"]
function sanitize(data){return lucaLib.sanitize(data,blacklist)}
// Validate no obvious secrets
function validate(data){return lucaLib.validate(data)}
// Encode to base64
function encode(content) {
    return Data.fromString(content).toBase64String()
}

// ===== MAIN UPLOAD FUNCTION =====

async function uploadFile(path, data) {
    let clean = sanitize(data)
    validate(clean)
    let content = JSON.stringify(clean, null, 2)
    let url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}`
    // Check if file exists (to get SHA)
    let sha = null
    let getReq = new Request(url)
    getReq.headers = { Authorization: `token ${TOKEN}` }
    try {
        let existing = await getReq.loadJSON()
        sha = existing.sha
    } catch (e) {
        // file does not exist, that's fine
    }
    // Upload (create or update)
    let req = new Request(url)
    req.method = "PUT"
    req.headers = {
        Authorization: `token ${TOKEN}`,
        "Content-Type": "application/json"
    }
    req.body = JSON.stringify({
        message: `Update ${path}`,
        content: encode(content),
        sha: sha
    })
    let res = await req.loadJSON()
    console.log("Upload complete:", res.content?.path || path)
}
async function getRepoFiles() {
    let req = new Request(API);
    req.headers = { "User-Agent": "Scriptable" };
    let data = await req.loadJSON();
    if (!Array.isArray(data)) {
        throw new Error("Invalid GitHub response");
    }
    return data.filter(x => x.type === "file" && (x.name.endsWith(".js")||x.name.endsWith(".txt")));
    }
async function main() {
    let fm=FileManager.iCloud()
    for (let file of await getRepoFiles()) {
        let path=fm.joinPath(fm.documentsDirectory(), file.name)
        if (fm.fileExists(path)) {
            uploadFile(file.name, fm.readString(path))
        }
    }
    log("All files uploaded")
}
if (config.runsInApp) {
    main()
} else {
    module.exports={uploadFile,getRepoFiles,main,VERSION}
}