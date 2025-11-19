/**
 * Image Utility Functions
 * Handles image imports with fallback support for Vite
 */

/**
 * Get image URL with fallback support
 * @param {string} imagePath - Relative path to image from src/images
 * @returns {string} - Image URL
 */
export const getImageUrl = (imagePath) => {
  try {
    // Try dynamic import with Vite's import.meta.url
    const imageUrl = new URL(`../images/${imagePath}`, import.meta.url).href;
    return imageUrl;
  } catch (error) {
    // Fallback: return path as string (Vite will handle it)
    console.warn(`Image import failed for ${imagePath}, using fallback`);
    return `/src/images/${imagePath}`;
  }
};

/**
 * Pre-defined image paths for common images
 */
export const IMAGE_PATHS = {
  // Category images
  RING: '/src/images/ring2.jpg',
  NECKLACE: '/src/images/imgi_155_navraani-hr.jpg',
  BRACELET: '/src/images/imgi_240_bracelets-cat.jpg',
  EARRING: '/src/images/imgi_241_bangles-cat.jpg',
  
  // Hero images
  HERO1: '/src/images/hero1.jpg',
  HERO2: '/src/images/hero2.jpg',
  HERO3: '/src/images/hero3.jpg',
  HERO4: '/src/images/hero4.jpg',
  
  // Logo
  LOGO: '/src/images/logo.jpg',
  
  // Video
  HERO_VIDEO: '/src/images/HeroSectionVideo.mp4',
};











