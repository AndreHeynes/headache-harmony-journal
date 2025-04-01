
/**
 * Security Headers Component
 * 
 * This component sets security-related meta tags in the application.
 * When proper backend hosting is implemented, these should also be set as HTTP headers.
 */

import { Helmet } from "react-helmet";

export const SecurityHeaders = () => {
  return (
    <Helmet>
      {/* Content Security Policy - restricts sources of content */}
      <meta 
        http-equiv="Content-Security-Policy" 
        content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://*.supabase.co" 
      />
      
      {/* Prevent browsers from incorrectly detecting non-scripts as scripts */}
      <meta http-equiv="X-Content-Type-Options" content="nosniff" />
      
      {/* Prevents the browser from rendering the page if it detects a reflected XSS attack */}
      <meta http-equiv="X-XSS-Protection" content="1; mode=block" />
      
      {/* Prevents page from being framed - helps avoid clickjacking */}
      <meta http-equiv="X-Frame-Options" content="DENY" />
      
      {/* Referrer Policy - controls how much referrer information is sent */}
      <meta name="referrer" content="strict-origin-when-cross-origin" />
      
      {/* Permissions Policy - controls which features/APIs can be used */}
      <meta 
        http-equiv="Permissions-Policy" 
        content="camera=(), microphone=(), geolocation=(self), interest-cohort=()" 
      />
    </Helmet>
  );
};
