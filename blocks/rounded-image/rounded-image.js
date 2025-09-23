/**
 * loads and decorates the rounded-image block
 * @param {Element} block The rounded-image block element
 */
export default async function decorate(block) {
  const img = block.querySelector('img');
  
  if (img) {
    // Ensure image has proper loading attribute
    if (!img.getAttribute('loading')) {
      img.setAttribute('loading', 'lazy');
    }
  }
}
