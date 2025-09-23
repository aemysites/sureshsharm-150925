/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row as specified
  const headerRow = ['Cards (cards2)'];
  const rows = [headerRow];

  // Find the main grid container with all cards
  const mainGrid = element.querySelector('.grid-layout');
  if (!mainGrid) return;

  // Find all immediate card containers (could be a direct child or nested)
  // The main card is an <a>, others are inside a nested grid-layout
  // Defensive: Collect both top-level <a> and nested grid cards
  let cardAnchors = [];
  // Get direct children
  mainGrid.childNodes.forEach(child => {
    if (child.nodeType === 1) {
      if (child.matches('a.utility-link-content-block')) {
        // First card: big left card
        cardAnchors.push(child);
      } else if (child.classList.contains('grid-layout')) {
        // Nested grid: contains other cards
        child.querySelectorAll('a.utility-link-content-block').forEach(a => {
          cardAnchors.push(a);
        });
      }
    }
  });

  cardAnchors.forEach(card => {
    // Find the image
    let imgWrapper = card.querySelector('.utility-aspect-2x3, .utility-aspect-1x1');
    let img = imgWrapper ? imgWrapper.querySelector('img') : null;

    // Defensive: if img not found, try to find first <img> in card
    if (!img) {
      img = card.querySelector('img');
    }
    // Use the actual element reference if found
    let imgCell = img || document.createTextNode('');

    // Compose the text cell
    // Try to find heading (h3), description (p), and CTA (div.button)
    let heading = card.querySelector('h2, h3, h4');
    let desc = card.querySelector('p');
    let cta = card.querySelector('.button');
    const textCellContent = [];
    if (heading) textCellContent.push(heading);
    if (desc) textCellContent.push(desc);
    if (cta) textCellContent.push(cta);

    // Defensive: fallback, if no heading or desc, just add all text from card
    if (textCellContent.length === 0) {
      Array.from(card.childNodes).forEach(node => {
        if (node.nodeType === 3 && node.textContent.trim()) {
          textCellContent.push(document.createTextNode(node.textContent));
        }
      });
    }

    rows.push([imgCell, textCellContent]);
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(table);
}
