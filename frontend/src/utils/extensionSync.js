// Extension sync utility for the web app using message passing
export const syncWithExtension = async () => {
  return new Promise((resolve) => {
    try {
      // Request sync from content script
      window.postMessage({ type: 'REVISTER_SYNC_REQUEST' }, '*');
      
      // Wait a bit for the sync to complete, then return current localStorage
      setTimeout(() => {
        const items = JSON.parse(localStorage.getItem('revister_items') || '[]');
        resolve(items.length > 0 ? items : null);
      }, 100);
    } catch (error) {
      console.log('Extension sync not available:', error);
      resolve(null);
    }
  });
};

// Function to export data to extension storage
export const exportToExtension = async (items) => {
  try {
    // Save to localStorage first
    localStorage.setItem('revister_items', JSON.stringify(items));
    
    // Request export to extension
    window.postMessage({ type: 'REVISTER_EXPORT_REQUEST' }, '*');
    return true;
  } catch (error) {
    console.log('Could not export to extension:', error);
    return false;
  }
};
