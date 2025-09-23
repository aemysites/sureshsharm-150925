/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the main grid-layout container (holds columns)
  const grid = element.querySelector('.grid-layout');
  if (!grid) return;

  // Get all immediate children of the grid (each is a column)
  const columns = Array.from(grid.querySelectorAll(':scope > div'));
  if (columns.length < 2) return; // must be at least 2 columns

  // Prepare header row as required
  const headerRow = ['Columns (columns32)'];

  // Prepare the columns row
  // Each column may contain several elements, so group them per column
  const columnsRow = columns.map(col => {
    // Defensive: collect all direct children of the column
    // If only one child, use it. Else, put all children in an array.
    const children = Array.from(col.childNodes).filter((child) => {
      // Ignore empty text nodes
      return !(child.nodeType === 3 && !child.textContent.trim());
    });
    if (children.length === 1) {
      return children[0];
    }
    return children;
  });

  // Build the table
  const cells = [
    headerRow,
    columnsRow
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element with the block table
  element.replaceWith(table);
}
