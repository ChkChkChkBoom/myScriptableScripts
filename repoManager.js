// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: green; icon-glyph: magic;
// repoManager.js
const VERSION="1.1.1"
const OWNER = "ChkChkChkBoom";
const REPO = "myScriptableScripts";
const API = `https://api.github.com/repos/${OWNER}/${REPO}/contents`;

const SELF_SCRIPT = "RepoManager.js";
const UPDATER_SCRIPT = "RepoManagerUpdater";

let fm = FileManager.iCloud();
let dir = fm.documentsDirectory();

function localPath(name) {
  return fm.joinPath(dir, name);
}

function exists(name) {
  return fm.fileExists(localPath(name));
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

async function download(file) {
  let req = new Request(file.download_url);
  return await req.loadString();
}

function extractVersion(code) {

  let match = code.match(/VERSION\s*=\s*["']([^"']+)["']/);

  if (!match) return null;

  return match[1];
}

function readLocalVersion(name) {

  if (!exists(name)) return null;

  let text = fm.readString(localPath(name));
  return extractVersion(text);
}

async function readRemoteVersion(file) {

  let code = await download(file);
  return extractVersion(code);
}

function compareVersions(a, b) {

  if (!a || !b) return 0;

  let pa = a.split(".").map(Number);
  let pb = b.split(".").map(Number);

  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    let x = pa[i] || 0;
    let y = pb[i] || 0;

    if (x > y) return 1;
    if (x < y) return -1;
  }

  return 0;
}

async function install(file) {

  if (exists(file.name)) return;

  let code = await download(file);
  fm.writeString(localPath(file.name), code);
}

async function update(file) {

  if (!exists(file.name)) return;

  let code = await download(file);
  fm.writeString(localPath(file.name), code);
}

async function updateOrInstall(file) {

  let code = await download(file);
  fm.writeString(localPath(file.name), code);
}

async function updateAll(files) {

  for (let f of files) {
    if (f.name !== SELF_SCRIPT && exists(f.name)) {
      await update(f);
    }
  }
}

async function installAll(files) {

  for (let f of files) {
    if (!exists(f.name)) {
      await install(f);
    }
  }
}

async function updateInstallAll(files) {

  for (let f of files) {
    if (f.name !== SELF_SCRIPT) {
      await updateOrInstall(f);
    }
  }
  runUpdater(download(SELF_SCRIPT))
}

function runUpdater(file) {

  let data = encodeURIComponent(JSON.stringify(file));
  Safari.open(`scriptable:///run?scriptName=${UPDATER_SCRIPT}&args=${data}`);
}

async function buildStatus(file) {

  if (!exists(file.name)) return "Not Installed";

  let localV = readLocalVersion(file.name);
  let remoteV = await readRemoteVersion(file);

  if (!remoteV) return "Installed";
  if (!localV) return "Update Available"
  let cmp = compareVersions(localV, remoteV);

  if (cmp < 0) return "Update Available";
  if (cmp > 0) return "Causality Violation";
  return "Up to Date";
}

async function showMenu(files) {

  let table = new UITable();

  let row1 = new UITableRow();
  row1.addText("Update All");
  row1.onSelect = async () => { await updateAll(files); };
  table.addRow(row1);

  let row2 = new UITableRow();
  row2.addText("Install All");
  row2.onSelect = async () => { await installAll(files); };
  table.addRow(row2);

  let row3 = new UITableRow();
  row3.addText("Update + Install");
  row3.onSelect = async () => { await updateInstallAll(files); };
  table.addRow(row3);

  let spacer = new UITableRow();
  spacer.addText("────────────");
  table.addRow(spacer);

  for (let file of files) {

    let status = await buildStatus(file);

    let row = new UITableRow();
    row.addText(file.name, status);

    row.onSelect = async () => {

      let alert = new Alert();
      alert.title = file.name;

      alert.addAction("Update");
      alert.addAction("Install");
      alert.addCancelAction("Cancel");

      let r = await alert.present();

      if (r === 0) {

        if (file.name === SELF_SCRIPT) {
          runUpdater(file);
          return;
        }

        await update(file);
      }

      if (r === 1) {
        await install(file);
      }

    };

    table.addRow(row);
  }

  await table.present();
}

async function shortcutMode(files) {

  await updateAll(files);

  let selfFile = files.find(f => f.name === SELF_SCRIPT);
  if (selfFile) runUpdater(selfFile);
}

let files = await getRepoFiles();

if (config.runsFromShortcut) {
  await shortcutMode(files);
} else {
  await showMenu(files);
}