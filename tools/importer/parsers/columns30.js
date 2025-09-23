/* global WebImporter */
export default function parse(element, { document }) {
  // Get all direct column divs
  const columns = Array.from(element.querySelectorAll(':scope > div'));
  if (!columns.length) return;

  // Block header must match exactly
  const headerRow = ['Columns (columns30)'];

  // Each column: use reference to original content (not cloned)
  const secondRow = columns.map(col => {
    // If column is just an image wrapper, output the image
    const img = col.querySelector(':scope > img');
    if (img && col.childElementCount === 1) return img;
    // Otherwise, output all child nodes as an array (preserves semantic meaning)
    return Array.from(col.childNodes);
  });

  // Build table
  const tableRows = [headerRow, secondRow];
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
