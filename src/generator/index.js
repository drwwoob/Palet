import js from "./js.js";

export default function generate(type) {
  return { js }[type];
}
