/* global WebImporter */

export default function parse(element, { document }) {
  // Find the active tab pane (the one visible)
  const tabPanes = Array.from(element.querySelectorAll('.w-tab-pane'));
  const activePane = tabPanes.find(p => p.classList.contains('w--tab-active')) || tabPanes[0] || element;
  // Find the grid in the active pane
  const grid = activePane.querySelector('.w-layout-grid');
  if (!grid) return;

  // Always get all anchor tags as cards (do not skip those without utility-aspect-3x2)
  const cardLinks = Array.from(grid.querySelectorAll('a'));

  // Header row as block name
  const headerRow = ['Cards (cards23)'];
  const rows = [headerRow];

  cardLinks.forEach(card => {
    // Find image (first cell)
    let img = card.querySelector('img');
    let imageCell = img ? img.cloneNode(true) : '';

    // Collect text content (heading + description)
    let heading = card.querySelector('h3, h2, .h4-heading');
    let desc = card.querySelector('.paragraph-sm');
    const textCell = document.createElement('div');
    if (heading) textCell.appendChild(heading.cloneNode(true));
    if (desc) textCell.appendChild(desc.cloneNode(true));
    // Also collect any CTA links *within* this card, but not the card link itself
    const ctas = Array.from(card.querySelectorAll('a')).filter(a => a !== card);
    ctas.forEach(cta => textCell.appendChild(cta.cloneNode(true)));

    // Only add row if we have image and at least some text content
    if (imageCell && textCell.textContent.trim()) {
      rows.push([imageCell, textCell]);
    }
  });

  if (rows.length === 1) return; // Only header, skip replacement

  // Build table with correct colspan for header
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Fix header to use colspan if needed
  const ths = table.querySelectorAll('thead tr th');
  if (ths.length === 1 && rows[1] && rows[1].length === 2) {
    ths[0].setAttribute('colspan', '2');
  }
  element.replaceWith(table);
}
