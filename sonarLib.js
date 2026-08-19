// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-blue; icon-glyph: rss;
const VERSION="2.0.0"
async function sendWebhook(bodyInfo,styleInfo,target,text=""){
  let url = JSON.parse(Keychain.get("webhooks"))[target]
  let renderer=new WebView()
  let usedHtml=(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        ${styleInfo}
      </style>
    </head>
    <body>
      <div id="render-target">
        ${bodyInfo}
      </div>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
      <script>
        async function capture() {
          const element = document.getElementById("render-target");
          const canvas = await html2canvas(element, {
              useCORS: true,
              allowTaint: false,
              backgroundColor: null,
              windowWidth: element.scrollWidth,
              windowHeight: element.scrollHeight
          });
          
          const base64Image = canvas.toDataURL("image/png").split(",");
          completion(base64Image);
        }
        // Boosted timeout to 1200ms to give slow external URLs ample time to load completely
        setTimeout(capture, 1200);
      </script>
    </body>
    </html>
    `);
  await (renderer.loadHTML(usedHtml))
  let base64Result = await renderer.evaluateJavaScript("", true);
  let imageBytes = Data.fromBase64String(base64Result[1]);
  let image = Image.fromData(imageBytes);
  let R = new Request(url)
  R.method = "POST"
  R.addImageToMultipart(image, "file", "result.png")
  R.addParameterToMultipart("content", text||"Results from "+Script.name())
  await (R.load())
}
module.exports={
  VERSION,
  sendWebhook
}