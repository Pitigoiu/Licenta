export default function exportId(location) {
  const loc = location.pathname.split("/");
  const name = loc[2];
  const chapter = loc[3].replace(/%20/g, " ");

  return { name, chapter };
}
