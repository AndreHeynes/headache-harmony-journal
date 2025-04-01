
/**
 * Security Headers Component
 * 
 * This component sets security-related meta tags in the application.
 * When proper backend hosting is implemented, these should also be set as HTTP headers.
 */

import React, { useEffect } from "react";

export const SecurityHeaders = () => {
  // Add security headers directly to the document head
  useEffect(() => {
    const metaTags = [
      { httpEquiv: "Content-Security-Policy", content: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://*.supabase.co" },
      { httpEquiv: "X-Content-Type-Options", content: "nosniff" },
      { httpEquiv: "X-XSS-Protection", content: "1; mode=block" },
      { httpEquiv: "X-Frame-Options", content: "DENY" },
      { name: "referrer", content: "strict-origin-when-cross-origin" },
      { httpEquiv: "Permissions-Policy", content: "camera=(), microphone=(), geolocation=(self), interest-cohort=()" },
    ];
    
    // Create a document fragment to minimize DOM operations
    const fragment = document.createDocumentFragment();
    const existingTags = {};
    
    // Check for existing tags to avoid duplicates
    document.querySelectorAll('meta[http-equiv], meta[name="referrer"]').forEach(tag => {
      if (tag.getAttribute('http-equiv')) {
        existingTags[tag.getAttribute('http-equiv')] = true;
      } else if (tag.getAttribute('name') === 'referrer') {
        existingTags['referrer'] = true;
      }
    });
    
    // Create and append new tags only if they don't already exist
    metaTags.forEach(tag => {
      const key = tag.httpEquiv || tag.name;
      if (!existingTags[key]) {
        const meta = document.createElement('meta');
        if (tag.httpEquiv) meta.httpEquiv = tag.httpEquiv;
        if (tag.name) meta.name = tag.name;
        meta.content = tag.content;
        fragment.appendChild(meta);
      }
    });
    
    // Append all new tags at once
    document.head.appendChild(fragment);
    
    // Cleanup function to remove the tags when component unmounts
    return () => {
      metaTags.forEach(tag => {
        const key = tag.httpEquiv || tag.name;
        const selector = tag.httpEquiv 
          ? `meta[http-equiv="${tag.httpEquiv}"]` 
          : `meta[name="${tag.name}"]`;
        
        const element = document.querySelector(selector);
        if (element && !element.hasAttribute('data-permanent')) {
          element.remove();
        }
      });
    };
  }, []);

  // No need to render anything, the effect handles everything
  return null;
};
