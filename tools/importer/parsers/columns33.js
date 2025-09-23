/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid layout inside the section
  const grid = element.querySelector('.grid-layout');
  if (!grid) return;
  const columns = Array.from(grid.children);
  if (columns.length < 2) return;

  // The first grid child is the image
  const imgEl = columns[0];
  // The second grid child is the content column
  const contentEl = columns[1];

  // Ensure we're referencing DOM elements - do not clone or create new
  const headerRow = ['Columns (columns33)'];
  const columnsRow = [imgEl, contentEl];
  const tableRows = [headerRow, columnsRow];
  
  // Create table and replace
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
