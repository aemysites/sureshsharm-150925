/* global WebImporter */
export default function parse(element, { document }) {
  // Block name header
  const headerRow = ['Columns (columns16)'];

  // Defensive: Find the grid wrapper containing the columns
  // The grid is always the first (and only) .w-layout-grid inside the element
  const grid = element.querySelector('.w-layout-grid');
  if (!grid) return;

  // Get all immediate children of the grid (each column cell)
  // Each child contains an inner wrapper with an <img>
  const gridChildren = Array.from(grid.children);

  // Extract the image from each grid child (defensive: if not found, fallback to the wrapper)
  const columnCells = gridChildren.map(cell => {
    const imgWrapper = cell.querySelector('.utility-aspect-2x3');
    if (imgWrapper) {
      const img = imgWrapper.querySelector('img');
      if (img) return img;
      return imgWrapper; // fallback if no img but has wrapper
    } else {
      // fallback to cell if no wrapper
      return cell;
    }
  });

  // Table rows:
  // - header row
  // - second row: all images in columns
  const rows = [
    headerRow,
    columnCells
  ];

  // Create table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original element with the block
  element.replaceWith(block);
}
