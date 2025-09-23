/* global WebImporter */
export default function parse(element, { document }) {
  // --- Helper selectors for cleaner code ---
  // Main wrappers
  const section = element;
  const containers = section.querySelectorAll(':scope > div.container');
  // Defensive: Check if block structure is present
  if (!containers || containers.length === 0) return;

  // --- Header row ---
  const headerRow = ['Columns (columns11)'];

  // --- First content row (title area and intro) ---
  // Structure: left (title area), right (intro, author, button)
  const gridTop = containers[0].querySelector('.grid-layout.tablet-1-column');
  // Defensive: ensure .grid-layout exists
  if (!gridTop) return;
  const columnsTop = gridTop.querySelectorAll(':scope > div');
  // Left column (title and eyebrow)
  const leftTitleArea = columnsTop[0];
  // Right column (description, author, button)
  const rightArea = columnsTop[1];
  // Defensive
  if (!leftTitleArea || !rightArea) return;

  // --- Second content row (images) ---
  // Structure: left image, right image
  const gridBottom = containers[0].nextElementSibling;
  let imagesRow = [];
  if (gridBottom && gridBottom.classList.contains('grid-layout')) {
    const imageCells = gridBottom.querySelectorAll(':scope > div');
    // Only include images (defensive)
    imagesRow = Array.from(imageCells);
  }

  // --- Build content rows ---
  const firstContentRow = [leftTitleArea, rightArea];
  const secondContentRow = imagesRow.length === 2 ? [imagesRow[0], imagesRow[1]] : [];

  // --- Compose table cells ---
  let cells = [headerRow, firstContentRow];
  if (secondContentRow.length === 2) {
    cells.push(secondContentRow);
  }

  // --- Generate and replace ---
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
