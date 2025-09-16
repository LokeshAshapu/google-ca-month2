import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PromptCard } from "@/components/PromptCard";
import { ProgressBar } from "@/components/ProgressBar";
import { SuccessMessage } from "@/components/SuccessMessage";
import profileImage from "@/assets/lokesh-profile.jpg";
import campusLogo from "@/assets/campus-ambassador-logo.png";

const Index = () => {
  const [visitedPrompts, setVisitedPrompts] = useState<Set<number>>(new Set());

  const prompts = [
    {
      id: 1,
      emoji: "🎉",
      title: "Plan a Festive Get-Together",
      description: "Create memorable celebrations with AI-powered party planning",
      url: "https://aiskillshouse.com/student/qr-mediator.html?uid=4916&promptId=16"
    },
    {
      id: 2,
      emoji: "🎬",
      title: "Bust Historical Myths in Movies",
      description: "Separate Hollywood fiction from historical facts",
      url: "https://aiskillshouse.com/student/qr-mediator.html?uid=4916&promptId=15"
    },
    {
      id: 3,
      emoji: "🌍",
      title: "Plan a Weekend Getaway",
      description: "Discover perfect short trips tailored to your preferences",
      url: "https://aiskillshouse.com/student/qr-mediator.html?uid=4916&promptId=14"
    },
    {
      id: 4,
      emoji: "✨",
      title: "Eco-Friendly Festive Decorations",
      description: "Celebrate sustainably with creative decoration ideas",
      url: "https://aiskillshouse.com/student/qr-mediator.html?uid=4916&promptId=13"
    },
    {
      id: 5,
      emoji: "🎓",
      title: "Gemini Student Offer",
      description: "Exclusive opportunities for student developers",
      url: "https://aiskillshouse.com/student/qr-mediator.html?uid=4916&promptId=6"
    }
  ];

  const handlePromptVisit = (promptId: number) => {
    setVisitedPrompts(prev => new Set([...prev, promptId]));
  };

  const isCompleted = visitedPrompts.size === prompts.length;

  // Save progress to localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('visitedPrompts');
    if (savedProgress) {
      setVisitedPrompts(new Set(JSON.parse(savedProgress)));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('visitedPrompts', JSON.stringify([...visitedPrompts]));
  }, [visitedPrompts]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Profile Photo */}
          <div className="relative inline-block">
            <img 
              src={profileImage}
              alt="Lokesh - Gemini AI Prompt Creator"
              className="w-32 h-32 rounded-full object-cover shadow-[var(--shadow-profile)] ring-4 ring-primary/10"
            />
          </div>

          {/* Name and Title */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Ashapu Lokesh
            </h1>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <p className="text-xl md:text-2xl text-muted-foreground">
                Gemini AI Prompt Creator & Google Campus Ambassador
              </p>
              <img 
                src={campusLogo}
                alt="Google Campus Ambassador"
                className="w-12 h-12 object-contain"
              />
              
            </div>
            <p className="text-lg text-muted-foreground">
              Get the trending prompts for free by connecting with me on linkedin
              </p>
          </div>
        </div>
      </section>

      {/* Prompts Section */}
      <section className="py-16 px-4 bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              My Gemini AI Prompts – Month 2 Collection
            </h2>
            <p className="text-lg text-muted-foreground">
              Explore these carefully crafted AI prompts designed to enhance your productivity
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-12">
            <ProgressBar progress={visitedPrompts.size} total={prompts.length} />
          </div>

          {/* Prompt Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {prompts.map((prompt) => (
              <PromptCard
                key={prompt.id}
                emoji={prompt.emoji}
                title={prompt.title}
                description={prompt.description}
                url={prompt.url}
                onVisit={() => handlePromptVisit(prompt.id)}
                isVisited={visitedPrompts.has(prompt.id)}
              />
            ))}
          </div>

          {/* Success Message */}
          {isCompleted && (
            <div className="mt-12">
              <SuccessMessage />
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-muted/50">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-muted-foreground">
            Built with ❤️ by Lokesh | Gemini AI Prompt Creator
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
