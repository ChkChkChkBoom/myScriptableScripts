// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: cyan; icon-glyph: dice;
const VERSION = "2.0.0"
function md5(str) {
  const bytes = Data.fromString(str).getBytes();
  const bitLength = bytes.length * 8;
  const paddedLength = ((bytes.length + 8) >> 6) * 64 + 64;
  const msg = new Array(paddedLength).fill(0);
  for (let i = 0; i < bytes.length; i++) {
    msg[i] = bytes[i];
  }
  msg[bytes.length] = 0x80;
  for (let i = 0; i < 8; i++) {
    msg[paddedLength - 8 + i] =
      Math.floor(bitLength / Math.pow(2, 8 * i)) & 0xff;
  }
  let a0 = 0x67452301;
  let b0 = 0xefcdab89;
  let c0 = 0x98badcfe;
  let d0 = 0x10325476;
  const s = [
     7, 12, 17, 22,  7, 12, 17, 22,
     7, 12, 17, 22,  7, 12, 17, 22,
     5,  9, 14, 20,  5,  9, 14, 20,
     5,  9, 14, 20,  5,  9, 14, 20,
     4, 11, 16, 23,  4, 11, 16, 23,
     4, 11, 16, 23,  4, 11, 16, 23,
     6, 10, 15, 21,  6, 10, 15, 21,
     6, 10, 15, 21,  6, 10, 15, 21
  ];
  const K = [];
  for (let i = 0; i < 64; i++) {
    K[i] = Math.floor(
      Math.abs(Math.sin(i + 1)) * 0x100000000
    ) >>> 0;
  }
  function leftRotate(x, n) {
    return ((x << n) | (x >>> (32 - n))) >>> 0;
  }
  function add(...values) {
    let result = 0;
    for (const value of values) {
      result = (result + value) >>> 0;
    }
    return result;
  }
  for (let offset = 0; offset < paddedLength; offset += 64) {
    const M = new Array(16);
    for (let i = 0; i < 16; i++) {
      const p = offset + i * 4;
      M[i] =
        (msg[p]) |
        (msg[p + 1] << 8) |
        (msg[p + 2] << 16) |
        (msg[p + 3] << 24);
    }
    let A = a0;
    let B = b0;
    let C = c0;
    let D = d0;
    for (let i = 0; i < 64; i++) {
      let F;
      let g;
      if (i < 16) {
        F = (B & C) | (~B & D);
        g = i;
      } else if (i < 32) {
        F = (D & B) | (~D & C);
        g = (5 * i + 1) % 16;
      } else if (i < 48) {
        F = B ^ C ^ D;
        g = (3 * i + 5) % 16;
      } else {
        F = C ^ (B | ~D);
        g = (7 * i) % 16;
      }
      const oldD = D;
      D = C;
      C = B;
      B = add(
        B,
        leftRotate(
          add(A, F, K[i], M[g]),
          s[i]
        )
      );
      A = oldD;
    }
    a0 = add(a0, A);
    b0 = add(b0, B);
    c0 = add(c0, C);
    d0 = add(d0, D);
  }
  function wordToHex(word) {
    let result = "";
    for (let i = 0; i < 4; i++) {
      result += ((word >>> (i * 8)) & 0xff)
        .toString(16)
        .padStart(2, "0");
    }
    return result;
  }
  return (
    wordToHex(a0) +
    wordToHex(b0) +
    wordToHex(c0) +
    wordToHex(d0)
  );
}
module.exports={
  VERSION,
  md5
}
