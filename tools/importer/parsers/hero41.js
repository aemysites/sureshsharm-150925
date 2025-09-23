/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row with block name
  const headerRow = ['Hero (hero41)'];

  // --- Row 2: Background Image (optional) ---
  // Find the image inside the hero block
  const img = element.querySelector('img');
  // Defensive check: only add if present
  const imageRow = [img ? img : ''];

  // --- Row 3: Text/CTA ---
  // The heading, paragraph, and CTA live in the second major div
  // Get grid cell containing text
  const textCol = element.querySelector('.container');

  let textContent = [];
  if (textCol) {
    // Find the main grid inside textCol
    const grid = textCol.querySelector('.w-layout-grid');
    if (grid) {
      // Extract heading
      const h1 = grid.querySelector('h1');
      if (h1) textContent.push(h1);
      // Extract paragraph
      const p = grid.querySelector('p');
      if (p) textContent.push(p);
      // Extract CTA (button group)
      const btnGroup = grid.querySelector('.button-group');
      if (btnGroup) {
        // Find the button/link
        const link = btnGroup.querySelector('a');
        if (link) textContent.push(link);
      }
    }
  }
  // Defensive: if nothing found, use blank cell
  if (textContent.length === 0) textContent = [''];

  const cells = [
    headerRow,
    imageRow,
    [textContent]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
