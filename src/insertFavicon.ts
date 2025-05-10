export function insertFavicon(svgHtmlCode: string) {
  const encodedSVG = svgHtmlCode.replace(/\"/g, '%22').replace(/\#/g, '%23');

  const link = document.createElement('link');
  link.rel = 'icon';
  document.head.appendChild(link);
  link.href = `data:image/svg+xml,${encodedSVG}`;
}
