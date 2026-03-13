// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-purple; icon-glyph: magic;
let arg = args.queryParameters.args;

if (!arg) {
  let a = new Alert();
  a.title = "No update info";
  a.addAction("OK");
  await a.present();
  Script.complete();
}

let file = JSON.parse(decodeURIComponent(arg));

let confirm = new Alert();
confirm.title = "Update RepoManager";
confirm.message = "Replace current version?";
confirm.addAction("Update");
confirm.addCancelAction("Cancel");

if (await confirm.present() === -1) {
  Script.complete();
}

let req = new Request(file.download_url);
let code = await req.loadString();

let fm = FileManager.local();
let path = fm.joinPath(fm.documentsDirectory(), file.name);

fm.writeString(path, code);

let done = new Alert();
done.title = "Updated";
done.message = "RepoManager updated.";
done.addAction("OK");
await done.present();