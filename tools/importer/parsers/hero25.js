/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: gets first matching descendant by class name (non-recursive)
  function findChildByClass(parent, className) {
    return Array.from(parent.children).find(el => el.classList.contains(className));
  }

  // 1. Table header row per instructions
  const headerRow = ['Hero (hero25)'];

  // 2. Background image or video row
  let visualRow;

  // The visual (image or video) is within the grid-layout. The visual is a div containing an <img> and an <iframe>
  // We'll prefer the iframe's src as a video, but per block desc, use as visual asset (row 2)
  // Find the .grid-layout div
  const grid = element.querySelector('.grid-layout');
  let visualDiv, img, iframe, linkEl;
  if (grid) {
    // The visual container is the 2nd child in expected markup
    visualDiv = grid.querySelector('.utility-position-relative, .utility-aspect-3x2, .w-embed-youtubevideo');
    if (!visualDiv) {
      // fallback: just get first <img> or <iframe>
      img = grid.querySelector('img');
      iframe = grid.querySelector('iframe');
    } else {
      img = visualDiv.querySelector('img');
      iframe = visualDiv.querySelector('iframe');
    }
  }

  // Per requirements: if it's not an image (e.g., iframe), include a link to its src, not the iframe itself
  if (iframe && iframe.src) {
    linkEl = document.createElement('a');
    linkEl.href = iframe.src;
    linkEl.textContent = 'Watch video';
    visualRow = [linkEl];
  } else if (img && img.src) {
    visualRow = [img];
  } else {
    visualRow = [''];
  }

  // 3. Text + CTA row (title, subheading, paragraph, and buttons)
  // Get heading, subheading, and CTA buttons from their respective containers
  // h1 visually hidden, but use .h1-heading as main visual heading
  let heading = grid && grid.querySelector('.h1-heading');
  // Subheading: find <p class="subheading">
  let subheading = grid && grid.querySelector('p.subheading');
  // Paragraph: subheading covers it already, keep as is
  // Buttons: find .button-group
  let btnGroup = grid && grid.querySelector('.button-group');
  // Compose content for cell
  let textCell = [];
  if (heading) textCell.push(heading);
  if (subheading) textCell.push(subheading);
  if (btnGroup) textCell.push(btnGroup);
  
  // Defensive: if nothing found, fallback to all children except the visual
  if (textCell.length === 0 && grid) {
    // .h1-heading and .button-group may vary, so use all divs except the utility-position-relative
    const children = Array.from(grid.children).filter(child => {
      return !child.classList.contains('utility-position-relative') &&
             !child.classList.contains('utility-aspect-3x2') &&
             !child.classList.contains('w-embed-youtubevideo');
    });
    textCell = children;
  }

  const textRow = [textCell];

  // 4. Compose table and replace
  const rows = [headerRow, visualRow, textRow];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
