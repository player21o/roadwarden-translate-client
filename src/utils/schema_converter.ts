export function convert_tags_to_html(data: string) {
  const matches = [...data.matchAll(/{color=/g)];

  matches.forEach((match) => {
    //match.
  });

  return (
    data
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
    .replace(/<\/gender>(?!\|)/g, "{/g}");
}
