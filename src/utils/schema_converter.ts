export function convert_tags_to_html(data: string) {
  console.log(data.replace(/\n/gm, "</p><p>"));

  data = data.replace(/ /g, "<space> </space>");

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

export function convert_html_to_tags(data: string) {
  data = data.replace(/<space>[^<]*<\/space>/g, " ");

  const matches = [...data.matchAll(/<color style="color: /g)];

  const to_append = "{color=";
  let offset = 0;

  matches.forEach((match) => {
    const index = match.index + offset;

    data = [
      data.substring(0, index),
      to_append,
      data.substring(
        index + '<color style="color: '.length,
        index + '<color style="color: '.length + 7
      ),
      "}",
      data.substring(
        index + '<color style="color: '.length + 6 + 3,
        data.length
      ),
    ].join("");

    offset +=
      to_append.length - '<color style="color: '.length + "}".length - 2;
  });

  return data
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
    .replace(/<\/p>/, "")
    .replace(/<p>/, "")

    .slice(0, -1); //to delete trailing \n
}
