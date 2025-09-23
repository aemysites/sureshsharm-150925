/* global WebImporter */
export default function parse(element, { document }) {
  // Find the collage/grid of images (background)
  const collageGrid = element.querySelector('.desktop-3-column');
  let collageImages = [];
  if (collageGrid) {
    collageImages = Array.from(collageGrid.querySelectorAll('img'));
  }

  // Defensive: If no collage images, just leave cell empty
  const backgroundCell = collageImages.length ? collageImages : [''];

  // Find the content container (headline, subheading, CTA)
  const contentContainer = element.querySelector('.ix-hero-scale-3x-to-1x-content .container');
  let contentCell;
  if (contentContainer) {
    // Gather all direct children (h1, p, button group)
    contentCell = Array.from(contentContainer.children);
  } else {
    contentCell = [''];
  }

  // Table header MUST match the spec exactly
  const headerRow = ['Hero (hero20)'];
  const cells = [
    headerRow,
    [backgroundCell],
    [contentCell]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
