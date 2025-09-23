/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid with two columns
  const mainGrid = element.querySelector('.grid-layout');
  if (!mainGrid) return;
  const columns = Array.from(mainGrid.children);

  // Defensive: Expecting two major columns
  const leftCol = columns[0];
  const rightCol = columns[1];

  // LEFT COLUMN: gather all actual children (not clones)
  let leftColContent = '';
  if (leftCol) {
    const frag = document.createDocumentFragment();
    Array.from(leftCol.childNodes).forEach(node => frag.appendChild(node));
    leftColContent = frag;
  }

  // RIGHT COLUMN: gather all images (real elements)
  let rightColContent = '';
  if (rightCol) {
    const imgGrid = rightCol.querySelector('.grid-layout');
    if (imgGrid) {
      const frag = document.createDocumentFragment();
      Array.from(imgGrid.children).forEach(img => frag.appendChild(img));
      rightColContent = frag;
    }
  }

  // Table header must match the required block name
  const headerRow = ['Columns (columns39)'];
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    [leftColContent, rightColContent],
  ], document);

  element.replaceWith(table);
}
