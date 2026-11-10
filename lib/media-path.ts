/** Encode static public paths so filenames with spaces (e.g. `nmi1 (1).png`) load correctly. */
export function publicAssetPath(path: string): string {
  if (!path.startsWith("/")) return path;
  const [pathname, search = ""] = path.split("?");
  const segments = pathname.split("/").map((segment, i) => (i === 0 ? segment : encodeURIComponent(decodeURIComponent(segment))));
  return segments.join("/") + (search ? `?${search}` : "");
}
