import { escapeRegExp, rgbToHex } from "./utilities";

export function convert_tags_to_html(data: string): string {
  const simpleReplacements: { [key: string]: string } = {
    " (disabled)": "",
    " ": "<space>&thinsp;</space>",
    "{/color}": "</color>",
    "{g}": '<gender type="male">',
    "|": '</gender>|<gender type="female">',
    "{/g}": "</gender>",
    "{b}": "<b>",
    "{/b}": "</b>",
    "{i}": "<i>",
    "{/i}": "</i>",
    "[[": "[",
    "]]": "]",
    "\n": "</p><p>",
  };

  const regex =
    /\{color=([^}]+)\}|\[([^\[\]]*)\]|(\[\[|\]\]|\{\/?b\}|\{\/?i\}|\{\/?g\}|\{\/color\}|\||\n| \(disabled\)| )/g;

  const convertedData = data.replace(
    regex,
    (match, colorValue, varName, simpleMatch) => {
      if (colorValue) {
        return `<color color="${colorValue}">`;
      }
      if (varName) {
        return `<var>${varName}</var>`;
      }

      if (simpleReplacements[simpleMatch] !== undefined) {
        return simpleReplacements[simpleMatch];
      }

      return match;
    }
  );

  return `<p>${convertedData}</p>`;
}

export function convert_html_to_tags(data: string, disabled: boolean) {
  data = data
    .replace(/<space>/g, "")
    .replace(/<\/space>/g, "")
    .replace(/ /g, " ");

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
