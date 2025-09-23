/* global WebImporter */
export default function parse(element, { document }) {
  // Step 1: Create Section Metadata Table with <thead> and <tbody>
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const trHead = document.createElement('tr');
  const th = document.createElement('th');
  th.textContent = 'Section Metadata';
  trHead.appendChild(th);
  thead.appendChild(trHead);

  const tbody = document.createElement('tbody');
  const trBody = document.createElement('tr');
  const td1 = document.createElement('td');
  td1.textContent = 'block';
  const td2 = document.createElement('td');
  td2.textContent = 'columns99';
  trBody.appendChild(td1);
  trBody.appendChild(td2);
  tbody.appendChild(trBody);

  table.appendChild(thead);
  table.appendChild(tbody);

  // Step 2: Create empty content section for child blocks
  const contentSection = document.createElement('div');
  contentSection.className = 'parent-block-content';
  // Add HTML comment as a marker for where child blocks will be inserted
  contentSection.appendChild(document.createComment(' Child blocks will be inserted here during import '));

  // Step 3: Create section breaks
  const hrStart = document.createElement('hr');
  const hrEnd = document.createElement('hr');

  // Step 4: Replace the original element with the new structure
  element.replaceWith(hrStart, contentSection, table, hrEnd);
}
