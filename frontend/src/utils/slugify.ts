export function slugify(text: string): string {
  if (!text) return "";
  return text
    .toLowerCase()
    .normalize("NFD")
    .split("")
    .filter((c) => (c >= "a" && c <= "z") || (c >= "0" && c <= "9") || c === " ")
    .join("")
    .trim()
    .split(" ")
    .filter(Boolean)
    .join("-");
}
