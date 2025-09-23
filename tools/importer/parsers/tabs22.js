/* global WebImporter */
export default function parse(element, { document }) {
  // Header row per block guidelines
  const headerRow = ['Tabs (tabs22)'];

  // Defensive selectors for tab labels and tab contents
  const tabMenu = Array.from(element.querySelectorAll(':scope > div')).find(div => div.classList.contains('w-tab-menu'));
  const tabContent = Array.from(element.querySelectorAll(':scope > div')).find(div => div.classList.contains('w-tab-content'));

  if (!tabMenu || !tabContent) {
    // Missing expected tab structure, skip
    return;
  }
  // Get tab labels
  const tabLinks = Array.from(tabMenu.querySelectorAll(':scope > a'));
  // Get tab panes
  const tabPanes = Array.from(tabContent.querySelectorAll(':scope > div.w-tab-pane'));

  // Build table rows: each row = [label, content]
  const rows = tabLinks.map((link, i) => {
    // Get label text (preserve markup)
    let labelContent = link.innerText || link.textContent || '';
    // Prefer text as label, fallback to the label inner div if needed
    const labelDiv = link.querySelector(':scope > div');
    if (labelDiv && labelDiv.textContent) {
      labelContent = labelDiv.textContent;
    }
    // Defensive: If there's markup in labelDiv, use it
    const labelCell = document.createElement('span');
    labelCell.textContent = labelContent.trim();
    // Get tab content: take the direct child div of the pane (the grid)
    let paneContent = null;
    const grid = tabPanes[i] && tabPanes[i].querySelector(':scope > div');
    if (grid) {
      paneContent = grid;
    } else {
      // Fallback: use pane itself
      paneContent = tabPanes[i] || document.createElement('div');
    }
    return [labelCell, paneContent];
  });

  // Final table cells array
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
