/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row
  const headerRow = ['Columns (columns15)'];

  // Locate the grid-layout container
  const grid = element.querySelector('.grid-layout');
  let columns = [];

  if (grid) {
    // Get all immediate children = columns
    const colDivs = Array.from(grid.children);
    columns = colDivs.map((col) => {
      // If only one child, use it directly, else wrap all children in a div (preserving order)
      if (col.childElementCount === 1) {
        return col.firstElementChild;
      } else {
        const wrapper = document.createElement('div');
        Array.from(col.childNodes).forEach(child => wrapper.appendChild(child));
        return wrapper;
      }
    });
  }

  // Only create the block if we have at least one column
  if (columns.length > 0) {
    const tableRows = [headerRow, columns];
    const block = WebImporter.DOMUtils.createTable(tableRows, document);
    element.replaceWith(block);
  }
}
