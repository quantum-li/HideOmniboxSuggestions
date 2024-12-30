function hideOmniboxSuggestions() {
    const style = document.createElement('style');
    style.textContent = `
      .OBMEnb {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
  }
  
  hideOmniboxSuggestions();
  