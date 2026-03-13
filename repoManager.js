// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: purple; icon-glyph: magic;
const OWNER = "ChkChkChkBoom";
const REPO = "myScriptableScripts";
const BRANCH = "main";
const SELF_SCRIPT = "RepoManager";
const UPDATER_SCRIPT = "RepoManagerUpdater";

const API = `https://api.github.com/repos/${OWNER}/${REPO}/contents`;

let fm = FileManager.local();
let dir = fm.documentsDirectory();

async function getRepoFiles() {
  let req = new Request(API);
  let data = await req.loadJSON();
  return data.filter(x => x.type === "file" && x.name.endsWith(".js"));
}

function localExists(name) {
  let path = fm.joinPath(dir, name);
  return fm.fileExists(path);
}

async function download(file) {
  let req = new Request(file.download_url);
  return await req.loadString();
}

async function write(file, code) {
  let path = fm.joinPath(dir, file.name);
  fm.writeString(path, code);
}

async function install(file) {
  if (localExists(file.name)) return;
  let code = await download(file);
  await write(file, code);
}

async function update(file) {
  if (!localExists(file.name)) return;
  let code = await download(file);
  await write(file, code);
}

async function updateOrInstall(file) {
  let code = await download(file);
  await write(file, code);
}

async function updateAll(files) {
  for (let f of files) {
    if (localExists(f.name)) await update(f);
  }
}

async function installAll(files) {
  for (let f of files) {
    if (!localExists(f.name)) await install(f);
  }
}

async function updateInstallAll(files) {
  for (let f of files) {
    await updateOrInstall(f);
  }
}

function runUpdater(file) {
  let data = encodeURIComponent(JSON.stringify(file));
  Safari.open(`scriptable:///run?scriptName=${UPDATER_SCRIPT}&args=${data}`);
}

async function showMenu(files) {

  let table = new UITable();

  let controls = new UITableRow();
  controls.addText("Update All");
  controls.onSelect = async () => {
    await updateAll(files);
    Script.complete();
  };
  table.addRow(controls);

  let installRow = new UITableRow();
  installRow.addText("Install All");
  installRow.onSelect = async () => {
    await installAll(files);
    Script.complete();
  };
  table.addRow(installRow);

  let bothRow = new UITableRow();
  bothRow.addText("Update + Install");
  bothRow.onSelect = async () => {
    await updateInstallAll(files);
    Script.complete();
  };
  table.addRow(bothRow);

  let spacer = new UITableRow();
  spacer.addText("────────────");
  table.addRow(spacer);

  for (let file of files) {

    let row = new UITableRow();
    row.addText(file.name);

    row.onSelect = async () => {

      let alert = new Alert();
      alert.title = file.name;

      alert.addAction("Update");
      alert.addAction("Install");
      alert.addCancelAction("Cancel");

      let r = await alert.present();

      if (r === 0) {
        if (file.name === SELF_SCRIPT + ".js") {
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

let files = await getRepoFiles();
await showMenu(files);