/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find main grid layout (columns container)
  const grid = element.querySelector('.grid-layout');
  if (!grid) return;

  // Get immediate children of grid (each column)
  const columns = Array.from(grid.children);

  // Build cells for the second row
  // Each column will be one cell in the row
  const rowCells = columns.map((col) => col);

  // Table rows: header row and columns row
  const cells = [
    ['Columns (columns4)'], // Header row as specified
    rowCells               // Second row: one cell per column
  ];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the table
  element.replaceWith(table);
}