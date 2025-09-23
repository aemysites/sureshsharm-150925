/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive check: find the grid columns container
  const grid = element.querySelector('.grid-layout');
  if (!grid) return;

  // Get all direct children of the grid layout (these are the columns)
  const columns = Array.from(grid.children);

  // Compose cells for the second row
  // Screenshot shows 3 columns:
  // 1. "Taylor Brooks"
  // 2. Tag list (vertical stack)
  // 3. Heading + rich text body
  const col1 = columns[0]; // Name
  const col2 = columns[1]; // Tag list
  const col3 = [columns[2], columns[3]]; // Heading + body: combine both in one cell

  // Table header row
  const headerRow = ['Columns (columns31)'];

  // Table second row (columns)
  const columnsRow = [col1, col2, col3];

  // Create block table
  const cells = [headerRow, columnsRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element with block
  element.replaceWith(block);
}
