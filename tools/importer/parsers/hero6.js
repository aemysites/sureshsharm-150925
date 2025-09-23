/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: find the hero background image (must be <img>, not hardcoded)
  function findBackgroundImage(el) {
    // Only consider direct descendants for background images
    return el.querySelector('img.cover-image, img[alt][src]');
  }

  // Helper: extract hero text and CTAs, including all text content
  function extractHeroContent(el) {
    // Find the main content container (by .card)
    const card = el.querySelector('.card');
    if (!card) return '';
    // We will preserve heading, subheading, buttons, in order
    const frag = document.createElement('div');
    // Heading: use original tag for heading semantics
    const heading = card.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) frag.appendChild(heading.cloneNode(true));
    // Subheading: paragraph (class or first <p> after heading)
    let subheading = null;
    if (card.querySelector('.subheading')) {
      subheading = card.querySelector('.subheading');
    } else if (heading && heading.nextElementSibling && heading.nextElementSibling.tagName.toLowerCase() === 'p') {
      subheading = heading.nextElementSibling;
    } else {
      subheading = card.querySelector('p');
    }
    if (subheading) frag.appendChild(subheading.cloneNode(true));
    // Buttons: group all <a> inside button group
    const buttonGroup = card.querySelector('.button-group');
    if (buttonGroup) {
      const btns = buttonGroup.querySelectorAll('a');
      btns.forEach(btn => frag.appendChild(btn.cloneNode(true)));
    }
    return frag.childNodes.length ? frag : '';
  }

  // Always use exact target block name in header
  const headerRow = ['Hero (hero6)'];

  // Row 2: background image
  let bgImg = findBackgroundImage(element);
  let bgCell = '';
  if (bgImg) {
    // Reference the actual (not clone) img element from the document
    bgCell = bgImg;
  }

  // Row 3: hero text/CTAs
  let heroContent = extractHeroContent(element);
  let heroCell = '';
  if (heroContent && heroContent.childNodes.length) {
    heroCell = heroContent;
  }

  // Create table: each row as per spec
  const rows = [
    headerRow,
    [bgCell],
    [heroCell],
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
