/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Extracts content for a single card <a> element
  function extractCardInfo(cardLink) {
    // Find image (first img)
    const img = cardLink.querySelector('img');

    // Find the text container (first div after img)
    const contentDiv = cardLink.querySelector('img + div');
    if (!contentDiv) return [img, ''];

    // Tag and meta (can be ignored for main text block, but can be included as meta if desired)
    // We'll make a meta line for tag and readtime, then heading, then description, then CTA
    let meta = '';
    const metaRow = contentDiv.querySelector('.flex-horizontal');
    if (metaRow) {
      // Tag
      const tagDiv = metaRow.querySelector('.tag');
      if (tagDiv) {
        const tagText = tagDiv.textContent.trim();
        meta += `<span>${tagText}</span>`;
      }
      // Read time
      const rtDiv = metaRow.querySelector('.paragraph-sm');
      if (rtDiv) {
        if (meta) meta += ' · ';
        meta += `<span>${rtDiv.textContent.trim()}</span>`;
      }
    }
    let metaElem = null;
    if (meta) {
      metaElem = document.createElement('div');
      metaElem.innerHTML = meta;
    }

    // Heading
    const heading = contentDiv.querySelector('h3');
    // Description
    const desc = contentDiv.querySelector('p');
    // CTA (the last div, with text 'Read')
    // Only grab the last direct child div with textContent 'Read' (avoid accidental matches!)
    let ctaElem = null;
    const divs = Array.from(contentDiv.querySelectorAll('div'));
    const ctaDiv = divs.reverse().find(div => div.textContent.trim().toLowerCase() === 'read');
    if (ctaDiv) {
      ctaElem = document.createElement('a');
      ctaElem.href = cardLink.href;
      ctaElem.textContent = 'Read';
      ctaElem.setAttribute('target','_blank');
      ctaElem.style.display = 'inline-block';
    }

    // Compose the content cell
    const contentCell = [];
    if (metaElem) contentCell.push(metaElem);
    if (heading) contentCell.push(heading);
    if (desc) contentCell.push(desc);
    if (ctaElem) contentCell.push(ctaElem);

    return [img, contentCell];
  }

  // Select all direct <a> elements = cards
  const cards = Array.from(element.querySelectorAll(':scope > a'));

  // Header row as required
  const tableRows = [ ['Cards (cards34)'] ];

  cards.forEach(cardLink => {
    // Defensive: skip broken/empty cards
    if (!cardLink.querySelector('img')) return;
    tableRows.push(extractCardInfo(cardLink));
  });

  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
