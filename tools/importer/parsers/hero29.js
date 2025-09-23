/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Only parse if available
  if (!element) return;

  // Header row
  const headerRow = ['Hero (hero29)'];

  // --- Extract background image ---
  // Find the image inside the hero
  let bgImg = null;
  const grid = element.querySelector('.grid-layout');
  if (grid) {
    // Search all img inside grid-layout
    const img = grid.querySelector('img');
    if (img) {
      bgImg = img; // Reference, do not clone
    }
  }
  // 2nd row: cell contains background image (optional)
  const imageRow = [bgImg ? bgImg : ''];

  // --- Extract Heading, Subheading, CTA ---
  let headingBlock = document.createElement('div');
  // Find text container
  let textContainer = null;
  const gridChildren = grid ? grid.querySelectorAll(':scope > div') : [];
  // Find the div with class 'container'
  for (const child of gridChildren) {
    if (child.classList.contains('container')) {
      textContainer = child;
      break;
    }
  }
  // Look for heading, subheading, CTA etc.
  if (textContainer) {
    // Find title
    const titleContainer = textContainer.querySelector('.utility-margin-bottom-6rem');
    if (titleContainer) {
      // Find h1 (title)
      const h1 = titleContainer.querySelector('h1');
      if (h1) headingBlock.appendChild(h1);
      // Find optional button group for CTA
      const buttonGroup = titleContainer.querySelector('.button-group');
      if (buttonGroup && buttonGroup.childNodes.length > 0) {
        headingBlock.appendChild(buttonGroup);
      }
    }
  }
  // 3rd row: cell contains heading, subheading, CTA (if present)
  const contentRow = [headingBlock];

  // -- Table structure --
  const cells = [
    headerRow,
    imageRow,
    contentRow
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
