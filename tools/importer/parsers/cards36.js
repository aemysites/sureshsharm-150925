/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards36) block: 2 columns, multiple rows
  // Header row
  const headerRow = ['Cards (cards36)'];
  const cardDivs = Array.from(element.querySelectorAll(':scope > div'));
  const rows = [headerRow];
  cardDivs.forEach((cardDiv) => {
    const img = cardDiv.querySelector('img');
    if (!img) return;
    // Each card must have two columns: image and text (even if text is empty)
    rows.push([img, '']);
  });
  const blockTable = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(blockTable);
}
