import RegionMap from './RegionMap';
import { BACK_OUTLINE, BACK_REGIONS, BACK_VIEWBOX } from './backRegions';

interface Props { selected: string[]; onChange: (next: string[]) => void }

/** Back-of-head and neck map. */
export default function BackHeadMap({ selected, onChange }: Props) {
  return (
    <RegionMap viewBox={BACK_VIEWBOX} outline={BACK_OUTLINE} regions={BACK_REGIONS} label="Back of head and neck"
      leftText="Left" rightText="Right" caption="Seen from behind — your left is on the left."
      selected={selected} onChange={onChange} />
  );
}
