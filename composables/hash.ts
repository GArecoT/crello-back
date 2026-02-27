import { encodeHex } from "jsr:@std/encoding/hex";
import { crypto } from "jsr:@std/crypto";

export default async function (text: string) {
  const messageBuffer = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", messageBuffer);
  const hash = encodeHex(hashBuffer);
  return hash;
}
