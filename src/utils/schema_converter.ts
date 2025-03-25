export function convert_tags_to_html(data: string) {
  const matches = [...data.matchAll(/{color=/g)];

  const to_append = '<span style="color: ';
  let offset = 0;

  matches.forEach((match) => {
    const index = match.index + offset;

    data = [
      data.substring(0, index),
      to_append,
      data.substring(index + "{color=".length, index + "{color=".length + 7),
      ';">',
      data.substring(index + "{color=".length + 6 + 2, data.length + offset),
    ].join("");

    offset += to_append.length - "{color=".length + ';">'.length - 1;
  });

  return (
    data
      .replace(/{\/color}/g, "</span>")
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
  return data
    .replace(/<gender type="male">/g, "{g}")
    .replace(/<gender type="female">/g, "")
    .replace(/<\/gender>(?!\|)/g, "{/g}")
    .replace(/<i>/g, "{i}")
    .replace(/<\/i>/g, "{/i}")
    .replace(/<b>/g, "{b}")
    .replace(/<\/b>/g, "{/b}")
    .replace(/<\/p><p>/gm, "\n")
    .replace(/<\/span>/g, "{/color}")
    .replace(/<\/p>/, "")
    .replace(/<p>/, "");
}
