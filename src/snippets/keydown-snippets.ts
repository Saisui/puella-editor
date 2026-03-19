type Snippet = {
  key?: string;
  match?: string | RegExp | (string | RegExp)[],
  body: string | ((matches: string[], preset: object) => string),
  goto?: string,
}

export const PuellaKeydownSnippets: Record<string, Snippet[]> = {
  global: [
    {match: '"', body: '"##"'},
    {match: "'", body: "'##'"},
    {match: "{", body: "{##}"},
    {match: "(", body: "(##)"},
    {match: "[", body: "[##]"},
    // {match: "<%", body: "<% ## %>"},
  ],
}