/* global WebImporter */
export default function parse(element, { document }) {
  // Step 1: Table header
  const headerRow = ['Hero (hero38)'];

  // Step 2: Background image row (must always be present as the 2nd row, even if empty)
  let bgImageCell = '';
  const img = element.querySelector('img');
  if (img) {
    bgImageCell = img;
  }
  const imageRow = [bgImageCell];

  // Step 3: Content row
  let title = null, subheading = null, cta = null;
  const container = element.querySelector('.container');
  if (container) {
    const grid = container.querySelector('.w-layout-grid');
    if (grid) {
      const gridChildren = Array.from(grid.querySelectorAll(':scope > div'));
      if (gridChildren.length > 0) {
        const textDiv = gridChildren[0];
        title = textDiv.querySelector('h2');
        subheading = textDiv.querySelector('p');
      }
      const ctaLink = grid.querySelector('a.button');
      if (ctaLink) cta = ctaLink;
    }
  }
  const contentElements = [];
  if (title) contentElements.push(title);
  if (subheading) contentElements.push(subheading);
  if (cta) contentElements.push(cta);
  const contentRow = [contentElements];

  // Compose table: always 3 rows
  const rows = [headerRow, imageRow, contentRow];

  // Create and replace
  const blockTable = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(blockTable);
}
