/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: ONLY one column (block name)
  const headerRow = ['Cards (cards35)'];
  const cells = [headerRow];

  // Each card (image + text from alt)
  const cardDivs = element.querySelectorAll(':scope > div');
  cardDivs.forEach(cardDiv => {
    const img = cardDiv.querySelector('img');
    if (!img) return;
    // Only alt text is available in provided HTML
    const textContent = img.alt && img.alt.trim() ? img.alt.trim() : '';
    cells.push([img, textContent]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
