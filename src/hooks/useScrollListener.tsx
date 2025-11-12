/**
 * Custom hook to listen for scroll events and determine if the user has scrolled past a certain level/limit/threshold.
 * @param threshold The scroll threshold in pixels to trigger the scrolled state. Default is 50.
 * @return A boolean indicating whether the user has scrolled past the threshold/level/limit.
 * @example
 * const isScrolled = useScrollListener(100); // returns true if scrolled more than 100px
*/

import { useState, useEffect } from 'react'; // React hooks

// Custom hook definition passing the threshold as parameter with default value of 50 pixels if not provided
const useScrollListener = (threshold: number = 50): boolean => {
  // State to track if the user has scrolled past the threshold
  const [isScrolled, setIsScrolled] = useState(false);

  // Effect to add scroll event listener on mount and clean up on unmount
  useEffect(() => {
    // Handler to check scroll position
    const handleScroll = () => {
      // Determine if the scroll position is greater than the threshold
      const scrolled = window.scrollY > threshold;
      
      // Update state only if the scrolled state has changed
      if (scrolled !== isScrolled) {
        setIsScrolled(scrolled);
      }
    };

    // Attach the scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Clean up the event listener on unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
    // Dependency array to re-run effect if isScrolled or threshold changes
  }, [isScrolled, threshold]); 

  // Return the current scrolled state
  return isScrolled;
};

export default useScrollListener;