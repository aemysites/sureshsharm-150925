/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: safely query direct children
  function getDirectChildrenBySelector(el, selector) {
    return Array.from(el.querySelectorAll(':scope > ' + selector));
  }

  // HEADER ROW
  const headerRow = ['Hero (hero13)'];

  // ----- ROW 2: BACKGROUND IMAGE (optional) -----
  let bgImg = null;
  const directGridDivs = getDirectChildrenBySelector(
    element.querySelector('.w-layout-grid'),
    'div'
  );
  if (directGridDivs.length > 0) {
    const possibleBg = directGridDivs[0].querySelector('img.cover-image.utility-position-absolute');
    if (possibleBg) bgImg = possibleBg;
  }
  if (!bgImg) {
    bgImg = element.querySelector('img.cover-image');
  }
  const row2 = [bgImg ? bgImg : ''];

  // ----- ROW 3: CONTENT (heading, subheading, CTA) -----
  let contentCell = '';
  if (directGridDivs.length > 1) {
    const container = directGridDivs[1];
    const cardBody = container.querySelector('.card-body');
    if (cardBody) {
      const grid = cardBody.querySelector('.w-layout-grid');
      if (grid) {
        // Find the grid column containing the main text content
        // Prefer the column with the heading (usually first or second, not the image)
        let textCol = null;
        Array.from(grid.children).forEach((col) => {
          if (!textCol && col.querySelector('h2')) textCol = col;
        });
        if (!textCol && grid.children.length > 0) textCol = grid.children[0];
        if (textCol) {
          const frag = document.createDocumentFragment();
          // Heading
          const h2 = textCol.querySelector('h2');
          if (h2) frag.appendChild(h2.cloneNode(true));
          // Feature bullets (paragraphs only, not icons/dividers)
          textCol.querySelectorAll('.flex-horizontal p').forEach(p => {
            frag.appendChild(p.cloneNode(true));
          });
          // CTA(s)
          const buttonGroup = textCol.querySelector('.button-group');
          if (buttonGroup) frag.appendChild(buttonGroup.cloneNode(true));
          contentCell = frag;
        } else {
          // Fallback: just all text content in grid
          const frag = document.createDocumentFragment();
          grid.querySelectorAll('h1,h2,h3,h4,h5,h6,p,a').forEach((el) => {
            frag.appendChild(el.cloneNode(true));
          });
          contentCell = frag;
        }
      } else {
        // Fallback: all text content from cardBody
        const frag = document.createDocumentFragment();
        cardBody.querySelectorAll('h1,h2,h3,h4,h5,h6,p,a').forEach((el) => {
          frag.appendChild(el.cloneNode(true));
        });
        contentCell = frag;
      }
    } else {
      // Fallback: all text from container
      const frag = document.createDocumentFragment();
      container.querySelectorAll('h1,h2,h3,h4,h5,h6,p,a').forEach((el) => {
        frag.appendChild(el.cloneNode(true));
      });
      contentCell = frag;
    }
  }

  const row3 = [contentCell];

  // Assemble table
  const tableCells = [headerRow, row2, row3];

  const table = WebImporter.DOMUtils.createTable(tableCells, document);
  element.replaceWith(table);
}
