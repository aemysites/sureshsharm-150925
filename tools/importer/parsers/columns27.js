/* global WebImporter */
export default function parse(element, { document }) {
  // Find main grid containing columns
  const mainGrid = element.querySelector('.container > .grid-layout');
  if (!mainGrid) return;

  // Extract first two <p> for left and right column
  const mainChildren = Array.from(mainGrid.children);
  let leftCol = null;
  let rightCol = null;
  let dividerGrid = null;
  for (let i = 0; i < mainChildren.length; i++) {
    if (mainChildren[i].tagName === 'P' && !leftCol) {
      leftCol = mainChildren[i];
    } else if (mainChildren[i].tagName === 'P' && leftCol && !rightCol) {
      rightCol = mainChildren[i];
    } else if (mainChildren[i].classList.contains('grid-layout')) {
      dividerGrid = mainChildren[i];
    }
  }
  // Defensive fallback
  leftCol = leftCol || '';
  rightCol = rightCol || '';

  // Extract second row: divider/avatar/attribution cluster (left), logo image (right)
  let leftBottom = '';
  let rightBottom = '';
  if (dividerGrid) {
    const dividerChildren = Array.from(dividerGrid.children);
    if (dividerChildren.length >= 3) {
      // Create a semantic cluster for left cell
      const leftCluster = document.createElement('div');
      leftCluster.appendChild(dividerChildren[0]);
      leftCluster.appendChild(dividerChildren[1]);
      leftBottom = leftCluster;
      rightBottom = dividerChildren[2];
    } else if (dividerChildren.length === 2) {
      leftBottom = dividerChildren[0];
      rightBottom = dividerChildren[1];
    } else if (dividerChildren.length === 1) {
      leftBottom = dividerChildren[0];
      rightBottom = '';
    }
  }

  const headerRow = ['Columns (columns27)'];
  const firstRow = [leftCol, rightCol];
  const secondRow = [leftBottom, rightBottom];

  // All text/images are included, original elements referenced, header matches block
  const table = WebImporter.DOMUtils.createTable([headerRow, firstRow, secondRow], document);

  element.replaceWith(table);
}
