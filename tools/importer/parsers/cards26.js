/* global WebImporter */
export default function parse(element, { document }) {
  // CRITICAL: Table header row must contain EXACTLY one column
  const headerRow = ['Cards (cards26)'];
  const rows = [headerRow];

  // Get all direct child divs (cards)
  const cards = Array.from(element.children);

  cards.forEach(card => {
    // Find the image (mandatory)
    const img = card.querySelector('img');
    // Find the text content container (h3 and p)
    let textContent = null;
    const textWrapper = card.querySelector('.utility-padding-all-2rem');
    if (textWrapper) {
      textContent = document.createElement('div');
      Array.from(textWrapper.childNodes).forEach(node => {
        textContent.appendChild(node.cloneNode(true));
      });
    } else {
      // Fallback: look for h3 and p
      const h3 = card.querySelector('h3');
      const p = card.querySelector('p');
      if (h3 || p) {
        textContent = document.createElement('div');
        if (h3) textContent.appendChild(h3.cloneNode(true));
        if (p) textContent.appendChild(p.cloneNode(true));
      }
    }

    // Only push cards with BOTH image and non-empty text content (spec requirement)
    if (img && textContent && textContent.textContent.trim().length > 0) {
      rows.push([img, textContent]);
    }
    // Do NOT add image-only or text-only cards
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
