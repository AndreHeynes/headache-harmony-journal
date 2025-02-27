
import { useState, useRef, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function NotesSection() {
  const [notes, setNotes] = useState<string>("");
  const MAX_LENGTH = 500;
  const [charCount, setCharCount] = useState<number>(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setCharCount(notes.length);
  }, [notes]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_LENGTH) {
      setNotes(value);
      setCharCount(value.length);
    }
  };

  return (
    <div>
      <Label className="text-white/60">Additional Notes</Label>
      <Textarea 
        ref={textareaRef}
        value={notes}
        onChange={handleChange}
        className="mt-2 bg-white/5 border-white/10 text-white min-h-[100px]" 
        placeholder="Enter your notes here..."
        maxLength={MAX_LENGTH}
      />
      <div className="flex justify-end mt-1">
        <span className={`text-xs ${charCount > MAX_LENGTH * 0.9 ? 'text-red-400' : 'text-white/60'}`}>
          {charCount}/{MAX_LENGTH}
        </span>
      </div>
    </div>
  );
}
