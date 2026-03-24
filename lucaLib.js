// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: cyan; icon-glyph: dice;
const VERSION = "1.0.0"
function sanitize(data,blacklist) {
    let copy = JSON.parse(JSON.stringify(data))
    function strip(obj) {
        for (let key in obj) {
            if (blacklist.includes(key)) {
                delete obj[key]
            } else if (typeof obj[key] === "object" && obj[key] !== null) {
                strip(obj[key])
            }
        }
    }
    strip(copy)
    return copy
}
function validate(data) {
    let str = JSON.stringify(data)
    if (str.match(/token|auth|password/i)) {
        throw new Error("Refusing to upload possible sensitive data")
    }
}
module.exports={sanitize,validate}