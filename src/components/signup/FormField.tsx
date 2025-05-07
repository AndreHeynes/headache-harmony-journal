
import { ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface FormFieldProps {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  icon: ReactNode;
  additionalContent?: ReactNode;
}

export function FormField({
  id,
  label,
  type,
  placeholder,
  value,
  onChange,
  error,
  icon,
  additionalContent
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-gray-300">{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          required
          value={value}
          onChange={onChange}
          className={`pl-10 bg-gray-900/50 border-${error ? 'red-500' : 'gray-700'} text-white placeholder:text-gray-500`}
        />
        <div className="absolute left-3 top-3 h-4 w-4 text-gray-500">
          {icon}
        </div>
      </div>
      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
      {additionalContent}
    </div>
  );
}
