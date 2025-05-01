
// Combines code to complete html doc 
export const combineCode = (html, css, js) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>${css}</style>
    </head>
    <body>${html}
      <script>${js}</script>
    </body>
    </html>
  `;
};


export const extractHtml = (combinedCode) => {
  // gets everything between the body tags (html)
  const bodyMatch = combinedCode.match(/<body>([\s\S]*)<\/body>/);
  if (bodyMatch && bodyMatch[1]) {
    return bodyMatch[1].replace(/<script>[\s\S]*<\/script>/, '').trim();
  }
  return '';
};

export const extractCss = (combinedCode) => {
  // gets everything between the style tags (css)
  const styleMatch = combinedCode.match(/<style>([\s\S]*)<\/style>/);
  if (styleMatch && styleMatch[1]) {
    return styleMatch[1].trim();
  }
  return '';
};

export const extractJs = (combinedCode) => {
  // gets everything between the script tags (js)
  const scriptMatch = combinedCode.match(/<script>([\s\S]*)<\/script>/);
  if (scriptMatch && scriptMatch[1]) {
    return scriptMatch[1].trim();
  }
  return '';
};