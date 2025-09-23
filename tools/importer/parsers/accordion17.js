/* global WebImporter */
export default function parse(element, { document }) {
  if (!element) return;

  // Build rows: header is always one column per guidelines
  const rows = [['Accordion (accordion17)']];

  // Each data row is [title, content]
  const accordionEls = Array.from(element.querySelectorAll(':scope > .accordion'));
  accordionEls.forEach((accordion) => {
    // Title cell
    let titleCell = '';
    const toggle = accordion.querySelector('.w-dropdown-toggle');
    if (toggle) {
      const paragraph = toggle.querySelector('.paragraph-lg');
      titleCell = paragraph ? paragraph : document.createTextNode(toggle.textContent.trim());
    } else {
      titleCell = document.createTextNode('');
    }
    // Content cell
    let contentCell = '';
    const nav = accordion.querySelector('nav.accordion-content');
    if (nav) {
      const richText = nav.querySelector('.rich-text');
      contentCell = richText ? richText : document.createTextNode(nav.textContent.trim());
    } else {
      contentCell = document.createTextNode('');
    }
    rows.push([titleCell, contentCell]);
  });

  // Use WebImporter to create the table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
