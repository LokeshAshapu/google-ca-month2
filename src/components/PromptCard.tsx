import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface PromptCardProps {
  emoji: string;
  title: string;
  description: string;
  url: string;
  onVisit: () => void;
  isVisited: boolean;
}

export const PromptCard = ({ emoji, title, description, url, onVisit, isVisited }: PromptCardProps) => {
  const handleClick = () => {
    onVisit();
    window.open(url, '_blank');
  };

  return (
    <Card className={`group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border ${
      isVisited ? 'ring-2 ring-primary/20 bg-primary/5' : ''
    }`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="text-2xl">{emoji}</span>
          <span className="group-hover:text-primary transition-colors">{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <CardDescription className="text-muted-foreground leading-relaxed">
          {description}
        </CardDescription>
        <Button 
          onClick={handleClick}
          variant={isVisited ? "secondary" : "default"}
          className="w-full group-hover:shadow-md transition-all"
        >
          {isVisited ? "✓ Visited" : "View Prompt"}
        </Button>
      </CardContent>
    </Card>
  );
};