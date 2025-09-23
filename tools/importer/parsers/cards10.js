/* global WebImporter */
export default function parse(element, { document }) {
  // Create the header row with the block name as specified
  const headerRow = ['Cards (cards10)'];
  const rows = [headerRow];
  
  // Get all card links (these are the direct children representing cards)
  const cardLinks = element.querySelectorAll(':scope > a.card-link');

  cardLinks.forEach((card) => {
    // Find the image (mandatory), which is inside the first div of the card
    const imageWrapper = card.querySelector('.utility-aspect-3x2');
    let image = imageWrapper ? imageWrapper.querySelector('img') : null;
    // Defensive: If image is not found, use the wrapper (could be an icon)
    const imageCell = image ? image : (imageWrapper || '');

    // Text content area
    const textContent = card.querySelector('.utility-padding-all-1rem');
    let textParts = [];
    if (textContent) {
      // Optional tag at the top
      const tagGroup = textContent.querySelector('.tag-group');
      if (tagGroup) {
        textParts.push(tagGroup);
      }
      // Title (h3)
      const heading = textContent.querySelector('h3');
      if (heading) {
        textParts.push(heading);
      }
      // Description (p)
      const desc = textContent.querySelector('p');
      if (desc) {
        textParts.push(desc);
      }
      // Optional: If this is a link to another page, add a CTA at the bottom
      // Only add CTA if card.href is not the homepage ('/')
      if (card.href && card.getAttribute('href') && card.getAttribute('href') !== '/') {
        const cta = document.createElement('p');
        const a = document.createElement('a');
        a.href = card.getAttribute('href');
        a.textContent = 'Learn more';
        cta.appendChild(a);
        textParts.push(cta);
      }
    }
    
    rows.push([
      imageCell,
      textParts
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
