/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row as per block guidelines
  const headerRow = ['Cards (cards7)'];

  // Collect the immediate child divs (cards) from the grid container
  const cardContainers = Array.from(element.querySelectorAll(':scope > div'));

  // Each card is a wrapper div with an image inside
  const rows = cardContainers.map((cardEl) => {
    // Find the image element within this card
    const img = cardEl.querySelector('img');
    if (!img) return null;
    // Use all available text content in card div (not just img.alt)
    // This ensures all text in the card is included (not just alt text)
    const textParts = [];
    // Include alt text if available
    if (img.alt) textParts.push(img.alt);
    // Also collect all text nodes from the card container (excluding img)
    cardEl.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        textParts.push(node.textContent.trim());
      }
      // If there's a text sibling element, add its text as well
      if (node.nodeType === Node.ELEMENT_NODE && node !== img) {
        textParts.push(node.textContent.trim());
      }
    });
    const textCell = textParts.join(' ').trim();
    return [img, textCell];
  }).filter(Boolean);

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows,
  ], document);

  // Replace original element with new table block
  element.replaceWith(table);
}
