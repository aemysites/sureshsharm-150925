/* global WebImporter */
export default function parse(element, { document }) {
  // Table header for Carousel block
  const headerRow = ['Carousel (carousel24)'];
  const rows = [headerRow];

  // Defensive: find the innermost content container
  let cardBody = element;
  // The structure is: div > div > div > div > div.card-body
  // Seek for .card-body
  const cardBodyEl = element.querySelector('.card-body');
  if (cardBodyEl) {
    cardBody = cardBodyEl;
  }

  // Find image and text content
  let imgEl = cardBody.querySelector('img');
  // Defensive: if not found, try a broader search
  if (!imgEl) {
    imgEl = element.querySelector('img');
  }

  // Find heading/text
  let titleEl = cardBody.querySelector('.h4-heading');
  // Defensive: fallback to h4, h3, h2 etc.
  if (!titleEl) {
    titleEl = cardBody.querySelector('h4, h3, h2, h1');
  }

  // Create text cell contents
  const textCell = [];
  if (titleEl) {
    // Wrap heading in its own element (preserves semantics)
    textCell.push(titleEl);
  }
  // Try and get any additional description (e.g., paragraphs, etc.)
  // Exclude heading itself
  Array.from(cardBody.childNodes).forEach((node) => {
    // Only add text or elements other than heading and image
    if (node !== titleEl && node !== imgEl) {
      // Only add non-empty text or element
      if (node.nodeType === 3 && node.textContent.trim()) {
        // Wrap in paragraph
        const p = document.createElement('p');
        p.textContent = node.textContent.trim();
        textCell.push(p);
      } else if (node.nodeType === 1 && node.tagName !== 'IMG') {
        textCell.push(node);
      }
    }
  });
  // Defensive: If nothing in textCell, push empty string
  if (textCell.length === 0) {
    textCell.push('');
  }

  // Create the row for the slide (always 2 columns)
  const slideRow = [imgEl, textCell];
  rows.push(slideRow);

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace original element
  element.replaceWith(block);
}
