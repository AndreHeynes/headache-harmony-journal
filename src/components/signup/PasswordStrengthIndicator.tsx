
interface PasswordStrengthProps {
  score: number;
  feedback: string;
}

export function PasswordStrengthIndicator({ score, feedback }: PasswordStrengthProps) {
  return (
    <div className="mt-1">
      <div className="h-1 w-full bg-gray-700 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-300 ${
            score === 0 ? 'bg-red-500 w-1/5' :
            score === 1 ? 'bg-red-500 w-2/5' :
            score === 2 ? 'bg-yellow-500 w-3/5' :
            score === 3 ? 'bg-yellow-500 w-4/5' :
            'bg-green-500 w-full'
          }`}
        />
      </div>
      <p className={`text-xs mt-1 ${
        score < 3 ? 'text-red-400' : 
        score < 4 ? 'text-yellow-400' : 
        'text-green-400'
      }`}>
        {feedback}
      </p>
    </div>
  );
}
