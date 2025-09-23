/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: ensure we're working with the expected structure
  // Find the grid layout container
  const grid = element.querySelector('.grid-layout');
  if (!grid) return;

  // Get all immediate children of the grid (these should be the columns)
  const columns = Array.from(grid.children);
  if (columns.length < 2) return; // Expect at least two columns

  // Prepare header row
  const headerRow = ['Columns (columns28)'];

  // Map each column's content into a cell
  // Column 1: should be the content with text and button
  // Column 2: should be the image
  const col1 = columns[0];
  const col2 = columns[1];

  // Defensive: If col1 or col2 is not found, skip
  if (!col1 || !col2) return;

  // For the first cell, reference the entire column div (text, headings, paragraphs, button)
  // For the second cell, reference the image element directly
  const img = col2.querySelector('img, picture');
  const cell1 = col1;
  const cell2 = img ? img : col2; // fallback to the div itself if image not found (unlikely)

  // Build the table structure
  const rows = [
    headerRow,
    [cell1, cell2]
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the table
  element.replaceWith(block);
}
