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
    { id: 1, title: "Pasta Alfredo", image: "https://via.placeholder.com/150", description: "Creamy pasta with cheese" },
    { id: 2, title: "Veggie Pizza", image: "https://via.placeholder.com/150", description: "Loaded with vegetables" },
    { id: 3, title: "Chocolate Cake", image: "https://via.placeholder.com/150", description: "Rich and moist cake" }
  ]

  const handleSend = () => {
    if (!chatInput.trim()) return
    setChatMessages(prev => [...prev, `You: ${chatInput}`, `Bot: Description for '${chatInput}'...`])
    setChatInput("")
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-6 space-y-6">
      {/* Recipe Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {recipes.map((recipe) => (
          <Dialog key={recipe.id}>
            <DialogTrigger asChild>
              <div
                className="cursor-pointer border rounded-xl overflow-hidden shadow-md hover:shadow-xl transition bg-card"
                onClick={() => setSelectedRecipe(recipe)}
              >
                <img src={recipe.image} alt={recipe.title} className="w-full h-32 object-cover" />
                <div className="p-3 font-semibold text-center">{recipe.title}</div>
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">{selectedRecipe?.title}</DialogTitle>
              </DialogHeader>
              <Separator className="my-2" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column - Image & Description */}
                <div className="space-y-4">
                  <img src={selectedRecipe?.image} alt={selectedRecipe?.title} className="w-full h-48 object-cover rounded-lg" />
                  <p className="text-muted-foreground">{selectedRecipe?.description}</p>
                </div>
                {/* Right Column - Chatbot */}
                <div className="border rounded-lg p-4 h-[300px] flex flex-col bg-muted/30">
                  <ScrollArea className="flex-1 pr-2">
                    <div className="space-y-2">
                      {chatMessages.map((msg, i) => (
                        <div
                          key={i}
                          className={`p-2 rounded-lg ${msg.startsWith("You:") ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                        >
                          {msg}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  <div className="mt-2 flex gap-2">
                    <Input
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Ask for recipe details..."
                      className="flex-1"
                    />
                    <Button onClick={handleSend}>Send</Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        ))}

        {/* Add Recipe Button */}
        <Dialog>
          <DialogTrigger asChild>
            <div className="cursor-pointer border-2 border-dashed rounded-xl flex flex-col items-center justify-center h-40 hover:bg-muted/40 transition">
              <span className="text-lg font-semibold">+ Add Recipe</span>
              <span className="text-sm text-muted-foreground">Upload your own</span>
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Upload Recipe</DialogTitle>
            </DialogHeader>
            <Separator className="my-2" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column - Form */}
              <div className="space-y-4">
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

              {/* Right Column - Chatbot */}
              <div className="border rounded-lg p-4 h-[350px] flex flex-col bg-muted/30">
                <ScrollArea className="flex-1 pr-2">
                  <div className="space-y-2">
                    {chatMessages.map((msg, i) => (
                      <div
                        key={i}
                        className={`p-2 rounded-lg ${msg.startsWith("You:") ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                      >
                        {msg}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <div className="mt-2 flex gap-2">
                  <Input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask for recipe description..."
                    className="flex-1"
                  />
                  <Button onClick={handleSend}>Send</Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
