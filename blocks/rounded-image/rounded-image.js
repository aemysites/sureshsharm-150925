/**
 * loads and decorates the rounded-image block
 * @param {Element} block The rounded-image block element
 */
export default async function decorate(block) {
  // Get all images in the block
  const images = block.querySelectorAll('img');
  
  // Process each image
  images.forEach((img) => {
    // Ensure images have proper loading attributes
    if (!img.getAttribute('loading')) {
      img.setAttribute('loading', 'lazy');
    }
    
    // Add alt text if missing
    if (!img.getAttribute('alt')) {
      img.setAttribute('alt', 'Rounded image');
    }
    
    // Wrap image in a container if not already wrapped
    const parent = img.parentElement;
    if (parent.tagName.toLowerCase() !== 'div' || parent === block) {
      const wrapper = document.createElement('div');
      wrapper.classList.add('rounded-image-wrapper');
      parent.insertBefore(wrapper, img);
      wrapper.appendChild(img);
    }
  });
  
  // Check for variant classes in the first row
  const firstRow = block.querySelector('div');
  if (firstRow) {
    const textContent = firstRow.textContent.trim().toLowerCase();
    
    // Add variant classes based on content
    if (textContent.includes('square')) {
      block.classList.add('square');
    }
    
    if (textContent.includes('large')) {
      block.classList.add('large');
    }
    
    // Remove the variant text if it's the only content in the row
    if (textContent === 'square' || textContent === 'large' || textContent === 'square large') {
      firstRow.remove();
    }
  }
  
  // Set loaded status
  block.classList.add('block-loaded');
}
