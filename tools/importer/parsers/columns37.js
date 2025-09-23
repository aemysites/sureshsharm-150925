/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the header row
  const headerRow = ['Columns (columns37)'];

  // Find the main grid layout
  const grid = element.querySelector('.grid-layout');
  if (!grid) return;

  // Gather all column feature blocks
  // 1. The large left block
  const leftBlock = grid.querySelector('a.utility-link-content-block');
  // 2. The right-side image+text features (can be several)
  let rightBlocks = [];
  const wrappers = Array.from(grid.querySelectorAll('.flex-horizontal.flex-vertical.flex-gap-sm'));
  if (wrappers.length > 0) {
    // The first wrapper contains image features
    rightBlocks = rightBlocks.concat(Array.from(wrappers[0].querySelectorAll('a.utility-link-content-block')));
    // The second wrapper contains text-only features
    if (wrappers.length > 1) {
      rightBlocks = rightBlocks.concat(Array.from(wrappers[1].querySelectorAll('a.utility-link-content-block')));
    }
  }

  // Compose all columns
  const columns = [];
  if (leftBlock) columns.push(leftBlock);
  columns.push(...rightBlocks);

  // Compose table
  const cells = [headerRow, columns];
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(blockTable);
}
