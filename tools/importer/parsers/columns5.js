/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main two columns: left (text/buttons), right (image)
  // The outermost grid contains two children: one <div> (the left column) and one <img> (the right column).
  const grid = element.querySelector(':scope > div');
  if (!grid) return;
  const gridChildren = Array.from(grid.children);
  if (gridChildren.length !== 2) return;

  // Left column: the <div> containing the text/button content
  const leftCol = gridChildren.find((c) => c.tagName === 'DIV');
  // Right column: the <img> element
  const rightCol = gridChildren.find((c) => c.tagName === 'IMG');
  if (!leftCol || !rightCol) return;

  // Build the table rows and columns
  const headerRow = ['Columns (columns5)'];
  // Each cell can contain a single element or an array of elements.
  // For the left column, grab the heading, paragraph, and button(s) as a group.
  const leftColContent = [];
  const h2 = leftCol.querySelector('h2');
  if (h2) leftColContent.push(h2);
  const para = leftCol.querySelector('.rich-text, .w-richtext, p');
  if (para) leftColContent.push(para);
  const buttonGroup = leftCol.querySelector('.button-group');
  if (buttonGroup) {
    // Add all buttons as block elements
    const buttons = Array.from(buttonGroup.querySelectorAll('a'));
    buttons.forEach(btn => leftColContent.push(btn));
  }

  // For the right column, use the image directly
  const rightColContent = rightCol;

  const columnsRow = [
    leftColContent,
    rightColContent,
  ];

  const tableCells = [
    headerRow,
    columnsRow,
  ];

  const table = WebImporter.DOMUtils.createTable(tableCells, document);
  element.replaceWith(table);
}
