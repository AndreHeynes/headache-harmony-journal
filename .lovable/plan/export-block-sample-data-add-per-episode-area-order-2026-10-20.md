# Export: block sample data, add per-episode area order

## 1. No download without real data
Today, when there are no completed episodes, the export swaps in three built-in sample records ("Temples, left side", "Forehead", "Behind right eye"). The downloaded PDF and CSV then contain them without saying they are samples.

Changes:
- The sample records are used only for the on-screen preview. Nothing that builds the PDF or CSV can reach them: the file builders always receive the real completed episodes.
- While data is loading, or when there are 0 completed episodes:
  - The "Secure Export PDF/CSV" button is disabled and reads "Export unavailable".
  - The footer reads "0 completed episodes • export unavailable" instead of "3 records (demo)".
  - The amber notice becomes "No completed episodes yet — export is turned off. Finish logging at least one headache (all steps) to download your report."
  - The preview table gets a "SAMPLE — layout only, not downloadable" banner above it, and every sample row is labelled "Sample".
- A guard at the top of the export request also stops it (with a message) if it is ever triggered with 0 real episodes.
- The Share button and the premium/test-mode gate are unchanged.

## 2. Area order in the Standard PDF
The existing per-episode summary stays exactly as it is (date, intensity, location, duration, symptoms, triggers, treatments, notes). Directly under it comes an "Areas (in selection order)" block:

```text
Record 3 - 12 Oct 2026
  Intensity: 7/10
  Location: Left Temple, Occiput
  ... (unchanged lines) ...
  Areas (in selection order)
    1 · Left Temple  (Origin)        first selected 12 Oct 2026, 08:14
        Intensity 7/10 · Triggers: Stress, Screen time
        Treatment: Ibuprofen · Taken: 10-20 mins · Relief: 30-40 mins · Outcome: Partially effective
    2 · Occiput                       first selected 12 Oct 2026, 09:02
        Intensity 5/10 · Triggers: —
        Treatment: — · Taken: — · Relief: — · Outcome: Not recorded
    3 · Right Eye  (unselected)       first selected 12 Oct 2026, 09:10
        ...
```
- Areas are sorted by order number. Gaps are kept as they are (e.g. 1, 3) and nothing is renumbered.
- An area that was unselected keeps its number and is marked "(unselected)", so the order history is complete. "Origin" appears only on area 1 while it is selected. Statistics elsewhere are not affected.
- Blank fields show "—". A blank outcome shows "Not recorded".
- Episodes with no area rows show "Areas: none recorded".
- Long lines are wrapped to the page width with the same text-splitting already used for the disclaimer.
- Font: the heading uses the same size as the record lines, and area details are 1 pt smaller and indented 5 mm further.

Page breaks:
- A small helper, `ensureSpace(needed)`, adds a page when `yPos + needed > 280`.
- Before each record it reserves room for the record heading plus the summary lines, replacing today's fixed `yPos > 250` check, so a summary is never split.
- Before each area it reserves that area's full height (name line + wrapped detail lines), so one area never splits across pages.
- If an area moves to a new page, the line "Record N (continued) — areas" is repeated at the top.

The disclaimer, demographics, SNOOP criteria and red-flag sections are unchanged.

## 3. CSV area rows
The existing episode table is unchanged, except that an `EpisodeId` column is added as its first column so area rows can be joined to it. It is followed by a new section:

```text
# EPISODE AREAS (selection order)
EpisodeId,EpisodeDate,SelectionOrder,AreaName,AreaKey,IsOrigin,Status,FirstSelectedAt,Intensity,Symptoms,Triggers,Treatment,TreatmentTiming,ReliefTiming,Outcome,Notes
```
- One row per area, sorted by episode date, then by order number.
- `Status` is selected or unselected. `IsOrigin` is yes only for area 1 while selected.
- `FirstSelectedAt` is a full ISO timestamp.
- Lists are joined with "; ". Treatment uses the same name extraction as the analysis screens.
- All text values are quoted, with inner quotes doubled. The existing columns get this same escaping, which fixes notes containing commas or quotes.

## Files that change
- `src/hooks/useExportData.ts`: fetch all area rows for completed episodes, including unselected ones, with order number, first-selected time, key, timing and outcome. Sort them by order number. Expose `hasRealData` and keep `loading`.
- `src/components/export/HeadacheDataExport.tsx`: split preview data from export data, add the blocked state, the guard, `ensureSpace`, the PDF area block and the CSV area section.
- `src/lib/exportFormat.ts` (new): pure helpers for the area line text and CSV area rows, plus the "can export" rule.
- `src/lib/__tests__/exportFormat.test.ts` (new): tests for:
  - export blocked at 0 completed episodes, allowed at 1
  - areas sorted by order with gaps kept
  - origin only on selected area 1
  - CSV columns and quoting
- `AGENTS.md`: add a rule that export never uses sample data and is blocked until there is at least one completed episode.
