interface ProgressBarProps {
  progress: number;
  total: number;
}

export const ProgressBar = ({ progress, total }: ProgressBarProps) => {
  const percentage = (progress / total) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-2">
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Progress</span>
        <span>{progress}/{total} prompts explored</span>
      </div>
      <div className="h-3 bg-progress-bg rounded-full overflow-hidden shadow-inner">
        <div 
          className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};