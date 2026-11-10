import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter } from 'lucide-react';

const SOCIAL_LINKS = [
  { label: 'Headache Recovery on Facebook', href: 'https://www.facebook.com/profile.php?id=61587618582831', Icon: Facebook },
  { label: 'Headache Recovery on Instagram', href: 'https://www.instagram.com/headacherecover/', Icon: Instagram },
  { label: 'Headache Recovery on X', href: 'https://x.com/headachere78621', Icon: Twitter },
];

export function PublicPageFooter() {
  return (
    <footer className="mt-12 border-t border-border pt-6 pb-2 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
      <p>© {new Date().getFullYear()} My Headache Experience Journal</p>
      <Link to="/policy" className="hover:text-foreground transition-colors">Privacy &amp; policies</Link>
      <nav aria-label="Social media" className="ml-auto flex items-center gap-1">
        {SOCIAL_LINKS.map(({ label, href, Icon }) => (
          <a
            key={href}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="p-2 rounded-md text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
          >
            <Icon className="h-4 w-4" />
          </a>
        ))}
      </nav>
    </footer>
  );
}
