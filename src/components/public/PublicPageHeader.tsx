import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function PublicPageHeader() {
  return <nav aria-label="Journal public pages" className="flex flex-wrap gap-2 border-b border-border pb-4 mb-6">
    <Button asChild variant="ghost" size="sm"><Link to="/try">Pain map</Link></Button>
    <Button asChild variant="ghost" size="sm"><Link to="/sample-report">Sample report</Link></Button>
    <Button asChild variant="ghost" size="sm"><Link to="/clinicians">For clinicians</Link></Button>
    <Button asChild variant="outline" size="sm" className="ml-auto"><Link to="/signup">Create account</Link></Button>
  </nav>;
}