/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header: Must match block name exactly
  const headerRow = ['Rounded-Image (rounded-image99)'];

  // 2. Find the image within the element, reference it directly (do not clone)
  const img = element.querySelector('img');
  let imageCell;
  if (img) {
    // Reference the actual DOM element for semantic meaning and all attributes
    imageCell = img;
  } else {
    // Edge case: If missing, insert a placeholder
    imageCell = document.createElement('span');
    imageCell.textContent = '[Image missing]';
  }

  // 3. Build table structure: 2 rows
  const rows = [
    headerRow,
    [imageCell]
  ];

  // 4. Create table using WebImporter utility, respecting semantic structure
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // 5. Replace original element with block table
  element.replaceWith(table);
}
