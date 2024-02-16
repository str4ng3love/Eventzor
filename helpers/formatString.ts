 export default function FormatString (string: string){

  return string
    .replaceAll("</div>", ``)
    .replaceAll("<div>", "")
    .replaceAll("<br>", "\n")
    .replaceAll("&nbsp;", " ")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&amp;", "&");
};

