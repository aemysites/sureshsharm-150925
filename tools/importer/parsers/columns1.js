/* global WebImporter */
export default function parse(element, { document }) {
  // Define table header as required
  const headerRow = ['Columns (columns1)'];

  // Defensive: Get all immediate children (columns)
  // Each child div is a column; each contains an img
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // Build columns row
  // Reference the child divs directly for resilience and future flexibility
  const columnsRow = columns.map((colDiv) => colDiv);

  // Compose the table rows
  const cells = [headerRow, columnsRow];

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(blockTable);
}
