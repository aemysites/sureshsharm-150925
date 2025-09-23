/* global WebImporter */
export default function parse(element, { document }) {
  // Get the grid container
  const grid = element.querySelector('.grid-layout');
  if (!grid) return;

  // Defensive: get all immediate children of .grid-layout
  const gridChildren = Array.from(grid.children);

  // First column: the left content (heading, subheading, etc.)
  // Second column: the contact info list
  // Third column: the image (if present)

  // Find heading section (first div)
  const headingCol = gridChildren.find(
    (el) => el.tagName === 'DIV' && el.querySelector('h2, h3, p')
  );

  // Find contact info (ul)
  const contactCol = gridChildren.find((el) => el.tagName === 'UL');

  // Find the image (img)
  const imageCol = gridChildren.find((el) => el.tagName === 'IMG');

  // Layout: 2 columns (left: text + list, right: image)
  //   | [heading, subheading, p] [ul with contact info] | [image] |

  // Compose left column: a div containing both headingCol and contactCol
  const leftCol = document.createElement('div');
  if (headingCol) leftCol.appendChild(headingCol);
  if (contactCol) leftCol.appendChild(contactCol);

  // Compose right column: image
  let rightCol = null;
  if (imageCol) {
    rightCol = imageCol;
  }

  // Table rows
  const headerRow = ['Columns (columns9)'];
  const contentRow = rightCol ? [leftCol, rightCol] : [leftCol];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);
  element.replaceWith(table);
}
