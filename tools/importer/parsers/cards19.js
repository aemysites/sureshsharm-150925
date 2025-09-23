/* global WebImporter */
export default function parse(element, { document }) {
  // Table header (block name and variant)
  const headerRow = ['Cards (cards19)'];

  // Find all direct child card elements
  const cardEls = element.querySelectorAll(':scope > div');

  // Each card row: [icon or image, text content]
  const rows = Array.from(cardEls).map((cardEl) => {
    // Defensive: find icon or image (icon container is always present)
    let iconOrImg = cardEl.querySelector('.icon');
    // Some sites use .icon for styling, but the content is the <img> inside
    if (iconOrImg) {
      // If there's an image inside, extract the image element
      const img = iconOrImg.querySelector('img');
      iconOrImg = img || iconOrImg;
    }

    // Defensive: find the first paragraph for text content
    const text = cardEl.querySelector('p, .text, .description') || cardEl;

    // Compose row: [icon/image, text content]
    return [iconOrImg, text];
  });

  // Table cells: header row, then one row per card
  const cells = [headerRow, ...rows];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(table);
}
