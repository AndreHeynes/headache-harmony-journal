# Make SNOOP screening mandatory and clarify the over-50 question

Two changes to the red-flag screening in the headache logging flow.

## 1. Force an answer to every screening question

Today the SNOOP questions are optional: a user can press Continue without answering, and unanswered questions count as "no flag". That silently weakens the recommendation.

Change:
- Each step that contains screening questions (Duration, Symptoms, Triggers, Treatment) must have all of its *visible* screening questions answered before Continue works.
- Follow-up questions only count when their parent question was answered Yes (they stay conditional as today).
- When something is unanswered, the Continue button is disabled and the unanswered questions get a visible "Answer required" highlight, with a short toast explaining why.
- No new questions, no wording changes to existing ones.

## 2. First-headache-ever question driven by date of birth

The question is already triggered from the stored date of birth (age 50+), but it has two gaps:
- Users with no date of birth on their profile are never asked at all.
- It is asked only when the account has zero completed episodes, so anyone who joins with history already logged never sees it.

Changes:
- Reword for clarity: ask plainly whether this is the first headache they have *ever* experienced in their life, and note that logging history in the app is not the same as never having had one.
- If age is 50+ and the profile has no date of birth, prompt for date of birth inline first (single date field, saved to the profile), then ask the question. If the user skips the date, do not ask.
- Ask the question once per user based on whether the "first headache ever" answer has already been recorded — not on the episode count. That means an existing user who never answered gets asked on their next log.
- Keep the existing behaviour when the answer is Yes: record the red flag, show the medical advisory dialog, and feed it into the SNOOP result as the "O – Older age" criterion.

## Technical notes

- `src/components/logheadache/screening/ScreeningQuestion.tsx` — add a `required`/`invalid` visual state.
- `src/hooks/useRedFlagScreening.ts` — expose per-step completeness (which response keys belong to which step, and whether visible ones are answered).
- `src/pages/LogHeadache.tsx` — gate `handleNext` on the current step's screening completeness; disable the Continue button and surface the toast.
- `src/hooks/useRedFlagCheck.ts` — replace the `episodeCount === 0` condition with "no existing `first_headache_over_50` red flag"; expose whether date of birth is missing.
- `src/components/logheadache/FirstHeadacheCheck.tsx` — clearer copy plus the optional inline date-of-birth capture that writes to `profiles.date_of_birth`.

No database schema changes; no changes to how flags are scored or exported.
