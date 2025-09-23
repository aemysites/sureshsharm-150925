/* global WebImporter */
export default function parse(element, { document }) {
  // Use the required block name for the header
  const headerRow = ['Columns (columns21)'];

  // Defensive: find the inner grid layout which contains the columns
  const grid = element.querySelector('.w-layout-grid');
  if (!grid) return;
  // Each direct child of grid is a column
  const columns = Array.from(grid.children);

  // Build the columns row
  // For this footer, screenshots show 4 columns:
  // - Logo/social icons
  // - Trends links
  // - Inspire links
  // - Explore links
  // Each column's entire content is placed in one cell
  const rowCells = columns.map(col => col);

  // Compose table data
  const cells = [headerRow, rowCells];
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(blockTable);
}
