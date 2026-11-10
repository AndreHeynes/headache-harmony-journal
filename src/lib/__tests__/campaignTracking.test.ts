import { describe, it, expect } from 'vitest';
import { parseCampaign, summarizeCampaigns } from '../campaignTracking';

describe('campaign tracking', () => {
  it('ignores links without a source tag', () => {
    expect(parseCampaign('?utm_campaign=pain_map', '/try', 'session-1234')).toBeNull();
  });
  it('keeps only tag values, never other parameters', () => {
    const c = parseCampaign('?utm_source=Instagram&utm_medium=bio&utm_campaign=pain_map&email=a@b.com', '/try', 'session-1234');
    expect(c).toEqual({ source: 'instagram', medium: 'bio', campaign: 'pain_map', page: '/try', session: 'session-1234' });
  });
  it('counts each step per platform and campaign', () => {
    const rows = summarizeCampaigns([
      { event_type: 'visit', utm_source: 'instagram', utm_campaign: 'doctor_prep' },
      { event_type: 'visit', utm_source: 'instagram', utm_campaign: 'doctor_prep' },
      { event_type: 'signup', utm_source: 'instagram', utm_campaign: 'doctor_prep' },
      { event_type: 'visit', utm_source: 'tiktok', utm_campaign: 'pain_map' },
    ]);
    expect(rows[0]).toMatchObject({ source: 'instagram', campaign: 'doctor_prep', visit: 2, signup: 1 });
    expect(rows[1]).toMatchObject({ source: 'tiktok', visit: 1, signup: 0 });
  });
});
