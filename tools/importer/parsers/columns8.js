/* global WebImporter */
export default function parse(element, { document }) {
  // Find grid layout and extract its columns
  const grid = element.querySelector('.w-layout-grid');
  if (!grid) return;
  // left column: heading
  const leftCol = grid.querySelector('h2');
  // right column: content div
  const rightCol = grid.querySelector('div:not(.w-layout-grid)');

  // Compose the block table: header, then columns
  const headerRow = ['Columns (columns8)'];
  const columnsRow = [leftCol, rightCol];

  // Create the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow
  ], document);

  element.replaceWith(table);
}
