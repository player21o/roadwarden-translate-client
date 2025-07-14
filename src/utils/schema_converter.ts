import { escapeRegExp, rgbToHex } from "./utilities";

export function convert_tags_to_html(data: string) {
  //console.log(data.replace(/\n/gm, "</p><p>"));

  data = data
    .replace(/ \(disabled\)/g, "")
    .replace(/ /g, "<space>&thinsp;</space>");

  const matches = [...data.matchAll(/{color=/g)];

  const to_append = '<color color="';
  let offset = 0;

  matches.forEach((match) => {
    const index = match.index + offset;

    data = [
      data.substring(0, index),
      to_append,
      data.substring(index + "{color=".length, index + "{color=".length + 7),
      '">',
      data.substring(index + "{color=".length + 6 + 2, data.length + offset),
    ].join("");

    offset += to_append.length - "{color=".length + '">'.length - 1;
  });

  return (
    "<p>" +
    data

      .replace(/(?<!\[)\[([^\[\]]*)\]/gm, "<var>$1</var>")
      .replace(/\[\[/g, "[")
      .replace(/\]/g, "]")

      .replace(/{\/color}/g, "</color>")

      .replace(/{g}/g, '<gender type="male">')
      .replace(/\|/g, '</gender>|<gender type="female">')
      .replace(/{\/g}/g, "</gender>")

      .replace(/\n/gm, "</p><p>")

      .replace(/{b}/g, "<b>")
      .replace(/{\/b}/g, "</b>")

      .replace(/{i}/g, "<i>")
      .replace(/{\/i}/g, "</i>") +
    //.substring(4)
    "</p>"
  );
}

export function convert_html_to_tags(data: string, disabled: boolean) {
  data = data
    .replace(/<space>/g, "")
    .replace(/<\/space>/g, "")
    .replace(/&thinsp;/g, " ");

  const rgb_matches = [...data.matchAll(/rgb\([^,]*, [^,]*, [^,]*\)/gm)];

  rgb_matches.forEach((match) => {
    data = data.replace(
      new RegExp(escapeRegExp(match[0]), "g"),
      rgbToHex(
        parseInt(match[0].split(",")[0].split("(")[1]),
        parseInt(match[0].split(",")[1]),
        parseInt(match[0].split(",")[2].split(")")[0])
      )
    );
  });

  data = data.replace(
    /<color style="color: (#\w{6});?">(.*?)<\/color>/g,
    "{color=$1}$2{/color}"
  );

  if (disabled) data = data + " (disabled)";

  const r = data
    .replace(/<gender [^<]* type="male">/g, "{g}")
    .replace(/<gender [^<]* type="female">/g, "")
    .replace(/<\/gender>(?!\|)/g, "{/g}")
    .replace(/<\/gender>\|/g, "|")

    .replace(/<i>/g, "{i}")
    .replace(/<\/i>/g, "{/i}")
    .replace(/<em>/g, "{i}")
    .replace(/<\/em>/g, "{/i}")

    .replace(/<b>/g, "{b}")
    .replace(/<\/b>/g, "{/b}")
    .replace(/<strong>/g, "{b}")
    .replace(/<\/strong>/g, "{/b}")

    .replace(/<\/color>/g, "{/color}")

    .replace(/<\/p><p>/gm, "\n")
    .replace(/<\/p>/g, "")
    .replace(/<p>/g, "")

    .replace(/\[/g, "[[")
    .replace(/\]/g, "]")

    .replace(/<var>/g, "[")
    .replace(/<\/var>/g, "]");

  return r;

  //.slice(0, -1); //to delete trailing \n
}
