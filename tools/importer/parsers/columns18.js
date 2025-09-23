/* global WebImporter */
export default function parse(element, { document }) {
  // Create the header row for the block
  const headerRow = ['Columns (columns18)'];

  // Defensive: Collect all main question/answer blocks
  // Each child of the input element is a 'divider', each containing a grid with two children
  const dividers = Array.from(element.querySelectorAll(':scope > .divider'));
  const contentRows = [];

  dividers.forEach(divider => {
    // Get the grid within divider
    const grid = divider.querySelector('.grid-layout');
    if (!grid) return; // Skip if grid missing
    // Each grid contains two direct children: heading and paragraph
    const gridChildren = Array.from(grid.children);
    if (gridChildren.length !== 2) return; // Defensive: must have two columns
    // Place both elements directly in cells
    contentRows.push([
      gridChildren[0], // Heading cell (question)
      gridChildren[1], // Answer cell (rich text)
    ]);
  });

  // Compose final table: header row followed by all content rows
  const tableCells = [headerRow, ...contentRows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableCells, document);

  // Replace the original element
  element.replaceWith(block);
}
