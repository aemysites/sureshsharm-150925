/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the grid layout that contains the columns
  const grid = element.querySelector('.grid-layout');
  if (!grid) return;

  // Expecting two primary columns: image + content div
  const gridChildren = Array.from(grid.children);

  // Defensive: only proceed if both columns exist
  if (gridChildren.length < 2) return;

  // Find image (first column) and content (second column)
  const img = gridChildren.find((el) => el.tagName === 'IMG');
  const contentDiv = gridChildren.find((el) => el.tagName === 'DIV');
  if (!img || !contentDiv) return;

  // Reference the existing elements, do not clone
  const columns = [img, contentDiv];

  // Table header must match block name exactly
  const headerRow = ['Columns (columns3)'];
  const contentRow = columns;
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  element.replaceWith(table);
}
