import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const SuccessMessage = () => {
  return (
    <Card className="max-w-md mx-auto text-center border-success-green/20 bg-success-green/5 animate-fade-in">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="text-4xl">🚀</div>
          <h3 className="text-lg font-semibold text-success-green">
            You've explored all my prompts!
          </h3>
          <p className="text-muted-foreground">
            Now connect with me on LinkedIn to get prompts for free
          </p>
          <Button 
            className="bg-[#0077b5] hover:bg-[#005885] text-white w-full"
            onClick={() => window.open('https://linkedin.com/in/ashapu-lokesh', '_blank')}
          >
            Connect on LinkedIn
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};