/* global WebImporter */
export default function parse(element, { document }) {
  // Columns (columns40) block
  const headerRow = ['Columns (columns40)'];

  // Get all direct child divs (each is a column)
  const columns = Array.from(element.querySelectorAll(':scope > div'));
  // Each column likely has an image as its main content
  const columnCells = columns.map((col) => {
    // Defensive: if the column has multiple children, only select the main content
    // For this block, the visible content is the inner img inside each column div
    const img = col.querySelector('img');
    // If there's any additional content in the column, include it after the image
    if (img && col.childNodes.length === 1) {
      return img;
    } else if (img) {
      // Return all children (image and other inline content)
      return Array.from(col.childNodes).filter(n => n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim()));
    } else {
      // Just in case: fallback to the column's children
      return Array.from(col.childNodes).filter(n => n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim()));
    }
  });

  const tableRows = [headerRow, columnCells];
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
