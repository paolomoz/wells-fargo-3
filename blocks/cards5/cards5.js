import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  // Process each card
  const cards = [...block.children];
  cards.forEach((card) => {
    // Get the image and text content divs
    const imageDiv = card.querySelector('picture')?.closest('div');
    const contentDiv = card.querySelector('div:not(:has(picture))');

    if (imageDiv && contentDiv) {
      // Extract content elements before restructuring
      const heading = contentDiv.querySelector('h3, h2, h1, strong');
      const timeText = contentDiv.textContent.match(/(\d+)\s*(min|minute|minutes)/i);
      const readMoreLink = contentDiv.querySelector('a');

      // Optimize images
      const picture = imageDiv.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
          picture.replaceWith(optimizedPic);
        }
      }

      // Create new structure matching Figma design
      // Link wrapper
      const linkWrapper = document.createElement('div');

      // Background+Border+Shadow wrapper
      const borderWrapper = document.createElement('div');

      // Image container wrapper
      const imageContainer = document.createElement('div');
      const imageElementContainer = document.createElement('div');
      imageElementContainer.appendChild(imageDiv.cloneNode(true));
      imageContainer.appendChild(imageElementContainer);
      borderWrapper.appendChild(imageContainer);

      // Content container
      const contentContainer = document.createElement('div');

      // Create title wrapper
      const titleWrapper = document.createElement('div');
      if (heading) {
        const h3 = document.createElement('h3');
        h3.textContent = heading.textContent;
        titleWrapper.appendChild(h3);
      }
      contentContainer.appendChild(titleWrapper);

      // Create footer container
      const footer = document.createElement('div');

      // Create time indicator container
      const timeContainer = document.createElement('div');

      // Clock icon wrapper
      const clockWrapper = document.createElement('div');
      const clockIcon = document.createElement('div');
      clockIcon.className = 'icon icon-clock';
      clockIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z"/></svg>';
      clockWrapper.appendChild(clockIcon);
      timeContainer.appendChild(clockWrapper);

      // Time text wrapper
      if (timeText) {
        const timeTextWrapper = document.createElement('div');
        const timeParagraph = document.createElement('p');
        timeParagraph.textContent = timeText[0];
        timeTextWrapper.appendChild(timeParagraph);
        timeContainer.appendChild(timeTextWrapper);
      }

      footer.appendChild(timeContainer);

      // Create read more container
      const readMoreContainer = document.createElement('div');

      // Read more text wrapper
      const readMoreTextWrapper = document.createElement('div');
      if (readMoreLink) {
        // Clone the link and ensure it's not treated as a button
        const link = readMoreLink.cloneNode(true);
        // Remove any button classes that might have been added
        link.classList.remove('button');
        readMoreTextWrapper.appendChild(link);
      }
      readMoreContainer.appendChild(readMoreTextWrapper);

      // Chevron icon wrapper
      const chevronWrapper = document.createElement('div');
      const chevronIcon = document.createElement('div');
      chevronIcon.className = 'icon icon-chevron-right';
      chevronIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M9.3 18.7c-.4-.4-.4-1 0-1.4l4.3-4.3-4.3-4.3c-.4-.4-.4-1 0-1.4.4-.4 1-.4 1.4 0l5 5c.4.4.4 1 0 1.4l-5 5c-.4.4-1 .4-1.4 0z"/></svg>';
      chevronWrapper.appendChild(chevronIcon);
      readMoreContainer.appendChild(chevronWrapper);

      footer.appendChild(readMoreContainer);
      contentContainer.appendChild(footer);

      borderWrapper.appendChild(contentContainer);
      linkWrapper.appendChild(borderWrapper);

      // Replace card content
      card.innerHTML = '';
      card.appendChild(linkWrapper);
    }
  });
}
