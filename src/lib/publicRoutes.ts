// One place for which pages the beta gate opens to visitors, and which pages a
// user may be auto-redirected from after signing in.

// Open to people who are not signed in: the trial, the sample report, the
// clinician sheet, the auth pages, and the policies (signup consent links to
// /policy, so it must be readable before an account exists).
export const PUBLIC_PATHS = [
  '/',
  '/try',
  '/sample-report',
  '/clinicians',
  '/auth',
  '/signin',
  '/signup',
  '/policy',
  '/press-kit',
  '/demo',
] as const;

// Where a user is standing when it makes sense to send them to the dashboard
// after signing in. Anywhere else is a page they opened on purpose — leave them
// there.
export const POST_SIGNIN_ENTRY_PATHS = [
  '/',
  '/auth',
  '/signin',
  '/signup',
  '/try',
  '/sample-report',
  '/clinicians',
] as const;

export const isPublicPath = (pathname: string): boolean =>
  (PUBLIC_PATHS as readonly string[]).includes(pathname);

export const isPostSigninEntryPath = (pathname: string): boolean =>
  (POST_SIGNIN_ENTRY_PATHS as readonly string[]).includes(pathname);
