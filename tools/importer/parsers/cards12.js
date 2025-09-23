/* global WebImporter */
export default function parse(element, { document }) {
  // Table header (block name)
  const headerRow = ['Cards (cards12)'];

  // Each card is an <a> element
  const cards = Array.from(element.querySelectorAll(':scope > a'));

  // Build row for each card
  const rows = cards.map(card => {
    // Find image (mandatory)
    const imgDiv = card.querySelector(':scope > div.utility-aspect-2x3');
    const img = imgDiv ? imgDiv.querySelector('img') : null;
    // Reference the existing <img> element, not clone

    // Find tag (optional) and date (optional)
    const infoDiv = card.querySelector('.flex-horizontal');
    let infoRow = null;
    if (infoDiv) {
      // Use only the direct children for tag and date
      const tagDiv = infoDiv.querySelector('.tag');
      const dateDiv = infoDiv.querySelector('.paragraph-sm');
      if (tagDiv || dateDiv) {
        infoRow = document.createElement('div');
        infoRow.style.display = 'flex';
        if (tagDiv) infoRow.appendChild(tagDiv);
        if (dateDiv) infoRow.appendChild(dateDiv);
      }
    }

    // Find title (heading)
    const heading = card.querySelector('h3');

    // Compose text cell
    const textCell = document.createElement('div');
    if (infoRow) textCell.appendChild(infoRow);
    if (heading) textCell.appendChild(heading);

    // All text from tag, date, and heading is included
    return [img, textCell];
  });

  // Table array
  const tableArr = [headerRow, ...rows];

  // Table creation
  const table = WebImporter.DOMUtils.createTable(tableArr, document);

  // Replace original element
  element.replaceWith(table);
}
