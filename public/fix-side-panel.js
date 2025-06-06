/**
 * Fix for sidePanelUtil.js error
 * 
 * This script defines the missing startTime variable to prevent
 * "Uncaught ReferenceError: startTime is not defined" errors
 */

(function() {
  // Define startTime if it doesn't exist
  if (typeof window !== 'undefined' && typeof window.startTime === 'undefined') {
    window.startTime = Date.now();
    console.log('Fixed missing startTime variable for sidePanelUtil.js');
  }
})();
