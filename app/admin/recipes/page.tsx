"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

type Recipe = {
  id: number
  title: string
  image: string
  description: string
}

export default function Recipe() {
  const [chatMessages, setChatMessages] = useState<string[]>([])
  const [chatInput, setChatInput] = useState("")
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)

  const recipes: Recipe[] = [
    { id: 1, title: "Pasta Alfredo", image: "https://via.placeholder.com/300x200", description: "Creamy pasta with cheese" },
    { id: 2, title: "Veggie Pizza", image: "https://via.placeholder.com/300x200", description: "Loaded with vegetables" },
    { id: 3, title: "Chocolate Cake", image: "https://via.placeholder.com/300x200", description: "Rich and moist cake" }
  ]

const handleSend = async () => {
  if (!chatInput.trim()) return;

  // Add the user's message immediately
  setChatMessages(prev => [...prev, `You: ${chatInput}`]);

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: chatInput })
    });

    const data = await res.json();
    const botReply = data.reply || "dummy response";

    // Add the bot's response
    setChatMessages(prev => [...prev, `Bot: ${botReply}`]);
  } catch (error) {
    console.error("Error sending message:", error);
    setChatMessages(prev => [...prev, "Bot: dummy response"]);
  }

  setChatInput(""); // Clear input
};


  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 space-y-6">
      {/* Recipe Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {recipes.map((recipe) => (
          <Dialog key={recipe.id}>
            <DialogTrigger asChild>
              <div
                className="cursor-pointer border border-border rounded-xl overflow-hidden shadow-md hover:shadow-xl transition bg-card hover:-translate-y-1"
                onClick={() => setSelectedRecipe(recipe)}
              >
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full h-40 object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="p-4 font-semibold text-center">{recipe.title}</div>
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-4xl bg-gradient-to-br from-background/80 to-background/50 backdrop-blur-xl border border-border shadow-lg rounded-2xl">
              <DialogHeader>
                <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                  {selectedRecipe?.title}
                </DialogTitle>
              </DialogHeader>
              <Separator className="my-4" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-4">
                  <img
                    src={selectedRecipe?.image}
                    alt={selectedRecipe?.title}
                    className="w-full h-56 object-cover rounded-lg shadow-md"
                  />
                  <p className="text-muted-foreground leading-relaxed">{selectedRecipe?.description}</p>
                </div>
                {/* Right Column - Chat */}
                <div className="border rounded-lg p-4 h-[350px] flex flex-col bg-muted/30 backdrop-blur-md shadow-inner">
                  <ScrollArea className="flex-1 pr-2">
                    <div className="space-y-3">
                      {chatMessages.map((msg, i) => (
                        <div
                          key={i}
                          className={`px-3 py-2 text-sm rounded-lg max-w-[85%] ${
                            msg.startsWith("You:")
                              ? "bg-primary text-primary-foreground ml-auto"
                              : "bg-muted"
                          }`}
                        >
                          {msg}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  <div className="mt-3 flex gap-2">
                    <Input
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Ask something..."
                      className="flex-1"
                    />
                    <Button onClick={handleSend} variant="default">Send</Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        ))}

        {/* Add Recipe */}
        <Dialog>
          <DialogTrigger asChild>
            <div className="cursor-pointer border-2 border-dashed rounded-xl flex flex-col items-center justify-center h-44 hover:bg-muted/40 transition hover:-translate-y-1 shadow-sm">
              <span className="text-lg font-semibold">+ Add Recipe</span>
              <span className="text-sm text-muted-foreground">Upload your own</span>
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-4xl bg-gradient-to-br from-background/80 to-background/50 backdrop-blur-xl border border-border shadow-lg rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                Upload Recipe
              </DialogTitle>
            </DialogHeader>
            <Separator className="my-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Form */}
              <div className="space-y-5">
                <div>
                  <Label htmlFor="title">Recipe Title</Label>
                  <Input id="title" placeholder="Enter recipe name" />
                </div>
                <div>
                  <Label htmlFor="image">Recipe Image</Label>
                  <Input id="image" type="file" accept="image/*" />
                </div>
                <div>
                  <Label htmlFor="descFile">Description File</Label>
                  <Input id="descFile" type="file" accept=".pdf,.txt,.doc,.docx" />
                </div>
                <div>
                  <Label htmlFor="shortDesc">Short Description</Label>
                  <Textarea id="shortDesc" placeholder="Type here..." />
                </div>
                <Button type="submit" className="w-full">Save Recipe</Button>
              </div>
              {/* Chat */}
              <div className="border rounded-lg p-4 h-[350px] flex flex-col bg-muted/30 backdrop-blur-md shadow-inner">
                <ScrollArea className="flex-1 pr-2">
                  <div className="space-y-3">
                    {chatMessages.map((msg, i) => (
                      <div
                        key={i}
                        className={`px-3 py-2 text-sm rounded-lg max-w-[85%] ${
                          msg.startsWith("You:")
                            ? "bg-primary text-primary-foreground ml-auto"
                            : "bg-muted"
                        }`}
                      >
                        {msg}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <div className="mt-3 flex gap-2">
                  <Input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask something..."
                    className="flex-1"
                  />
                  <Button onClick={handleSend} variant="default">Send</Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
