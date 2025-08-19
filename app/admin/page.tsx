"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
// import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Edit, Trash2, ChefHat, Filter } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

type Dish = {
  id: number;
  name: string;
  image: string;
  ingredients: string[];
  dishType: string;
  description: string;
  price?: number;
};

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Dish[]>([
    {
      id: 1,
      name: "Butter Chicken",
      image:
        "https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg",
      ingredients: ["Chicken", "Butter", "Tomatoes", "Cream", "Spices"],
      dishType: "Main Course",
      description: "Creamy and rich butter chicken with aromatic spices",
      price: 18.99,
    },
    {
      id: 2,
      name: "Caesar Salad",
      image:
        "https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg",
      ingredients: ["Lettuce", "Parmesan", "Croutons", "Caesar Dressing"],
      dishType: "Appetizer",
      description: "Fresh crispy salad with homemade caesar dressing",
      price: 12.99,
    },
  ]);

  const [humanInput, setHumanInput] = useState("");
  const [aiInput, setAiInput] = useState("");
  const [humanMessages, setHumanMessages] = useState<
    { role: "user" | "system"; text: string }[]
  >([]);
  const [aiMessages, setAiMessages] = useState<
    { role: "user" | "system"; text: string }[]
  >([]);

  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Dish | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    ingredients: "",
    dishType: "",
    description: "",
    price: "",
  });

  const dishTypes = [
    "Appetizer",
    "Main Course",
    "Dessert",
    "Beverage",
    "Side Dish",
  ];

  const handleSaveDraft = () => {
    // For now, just log the current form data
    console.log("Draft saved:", formData);

    // Later you can store it in localStorage, DB, or API
    localStorage.setItem("recipeDraft", JSON.stringify(formData));
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.dishType || !formData.description) return;

    const newRecipe: Dish = {
      id: editingRecipe ? editingRecipe.id : Date.now(),
      name: formData.name,
      image:
        formData.image ||
        "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg",
      ingredients: formData.ingredients
        .split(",")
        .map((i) => i.trim())
        .filter((i) => i),
      dishType: formData.dishType,
      description: formData.description,
      price: formData.price ? parseFloat(formData.price) : undefined,
    };

    if (editingRecipe) {
      setRecipes((prev) =>
        prev.map((r) => (r.id === editingRecipe.id ? newRecipe : r))
      );
    } else {
      setRecipes((prev) => [...prev, newRecipe]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      image: "",
      ingredients: "",
      dishType: "",
      description: "",
      price: "",
    });
    setEditingRecipe(null);
    setIsAddDialogOpen(false);
  };

  const handleEdit = (recipe: Dish) => {
    setEditingRecipe(recipe);
    setFormData({
      name: recipe.name,
      image: recipe.image,
      ingredients: recipe.ingredients.join(", "),
      dishType: recipe.dishType,
      description: recipe.description,
      price: recipe.price?.toString() || "",
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setRecipes((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="flex-1 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold flex items-center gap-2 mb-3">
          <ChefHat className="h-8 w-8 text-primary" />
          DishManagement
        </h1>
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-muted-foreground mt-2">
                Manage your Hotel Dish collection
              </p>
            </div>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => resetForm()}>
                  <Plus className="h-4 w-4 mr-2" />
                  {editingRecipe ? "Edit Recipe" : "Add Recipe"}
                </Button>
              </DialogTrigger>

              <DialogContent className="!w-[90vw] !max-w-none h-[90vh] p-6 overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingRecipe ? "Edit Recipe" : "Add New Recipe"}
                  </DialogTitle>
                </DialogHeader>

                <div className="flex flex-col lg:flex-row gap-4 overflow-y-auto h-full">
                  {/* Left Panel: Dish Form + Chatbot */}
                  {/* Left Panel: Dish Form + Chatbot */}
                  <div className="lg:w-2/3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-4">
                        {/* Dish Name */}
                        <div>
                          <Label htmlFor="name">Dish Name *</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) =>
                              handleInputChange("name", e.target.value)
                            }
                            placeholder="Enter Dish name"
                          />
                        </div>

                        {/* Dish Type */}
                        <div>
                          <Label htmlFor="dishType">Dish Type *</Label>
                          <Select
                            value={formData.dishType}
                            onValueChange={(value) =>
                              handleInputChange("dishType", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select dish type" />
                            </SelectTrigger>
                            <SelectContent>
                              {dishTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Price */}
                        <div>
                          <Label htmlFor="price">Price ($)</Label>
                          <Input
                            id="price"
                            type="number"
                            step="0.01"
                            value={formData.price}
                            onChange={(e) =>
                              handleInputChange("price", e.target.value)
                            }
                            placeholder="0.00"
                          />
                        </div>

                        {/* Image Upload */}
                        <div>
                          <Label htmlFor="image">Upload Image</Label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const reader = new FileReader();
                              reader.onload = () => {
                                handleInputChange(
                                  "image",
                                  reader.result as string
                                );
                              };
                              reader.readAsDataURL(file);
                            }}
                            className="mt-1"
                          />
                        </div>
                      </div>

                      {/* human/AI tabs */}
                      <div>
                        <div className="space-y-4">
                          <Tabs defaultValue="Human" className="w-full max-w-md">
                            <TabsList className="w-full">
                              <TabsTrigger value="Human" className="w-1/2">
                                Human
                              </TabsTrigger>
                              <TabsTrigger value="AI" className="w-1/2">
                                AI
                              </TabsTrigger>
                            </TabsList>

                            {/* Human Tab */}
                            <TabsContent value="Human" className="space-y-3">
                              <div className="space-y-2">
                                <Textarea
                                  placeholder="Write your thoughts..."
                                  value={humanInput}
                                  onChange={(e) => setHumanInput(e.target.value)}
                                  className="h-64 resize-none"
                                />
                                <div className="flex gap-2">
                                  <Button
                                    className="flex-1"
                                    variant="secondary"
                                    onClick={() =>
                                      setHumanMessages([
                                        ...humanMessages,
                                        {
                                          role: "system",
                                          text: "Summary feature coming soon...",
                                        },
                                      ])
                                    }
                                  >
                                    Summarize
                                  </Button>
                                  <Button
                                    className="flex-1"
                                    onClick={() => {
                                      if (!humanInput.trim()) return;
                                      setHumanMessages([
                                        ...humanMessages,
                                        { role: "user", text: humanInput },
                                      ]);
                                      setHumanInput("");
                                    }}
                                  >
                                    Submit
                                  </Button>
                                </div>
                              </div>
                            </TabsContent>

                            {/* AI Chat Tab */}
                            <TabsContent value="AI" className="space-y-3">
                              {/* Chat Area */}
                              <ScrollArea className="h-64 border rounded p-3 space-y-2 bg-muted">
                                {aiMessages.length === 0 ? (
                                  <p className="text-sm text-muted-foreground text-center">
                                    No AI messages yet...
                                  </p>
                                ) : (
                                  aiMessages.map((msg, i) => (
                                    <div
                                      key={i}
                                      className={`p-2 rounded-md max-w-[80%] ${msg.role === "user"
                                        ? "bg-primary text-primary-foreground ml-auto"
                                        : "bg-secondary mr-auto"
                                        }`}
                                    >
                                      {msg.text}
                                    </div>
                                  ))
                                )}
                              </ScrollArea>

                              {/* Input + + Button */}
                              <div className="flex items-center gap-2">
                                <Input
                                  placeholder="Ask AI..."
                                  value={aiInput}
                                  onChange={(e) => setAiInput(e.target.value)}
                                />
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => {
                                    if (!aiInput.trim()) return;
                                    setAiMessages([
                                      ...aiMessages,
                                      { role: "user", text: aiInput },
                                    ]);
                                    setAiInput("");
                                  }}
                                >
                                  +
                                </Button>
                              </div>
                            </TabsContent>
                          </Tabs>
                        </div>
                      </div>

                      <div>

                      </div>
                    </div>

                    {/* Footer Buttons (stick bottom-left) */}
                    <div className="flex justify-start gap-2 mt-4">
                      <Button variant="outline" onClick={resetForm}>
                        Cancel
                      </Button>
                      <Button variant="secondary" onClick={handleSaveDraft}>
                        Save Draft
                      </Button>
                      <Button onClick={handleSubmit}>
                        {editingRecipe ? "Update Recipe" : "Add Recipe"}
                      </Button>
                    </div>
                  </div>

                  {/* Right Panel: Chatbot Understanding */}
                  <div className="lg:w-1/3 border rounded p-4 mt-4 lg:mt-0">
                    <h3 className="text-lg font-semibold mb-2">
                      What Chatbot Understood
                    </h3>
                    <div className="p-2 rounded bg-muted text-muted-foreground">
                      {/* Placeholder */}
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex items-center gap-2 mb-4">
            {/* Search Bar */}
            <Input
              type="text"
              placeholder="Search recipes..."
              className="flex-1"
            />
            {/* Filter Button */}
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Dish Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <Card
              key={recipe.id}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="aspect-video relative">
                <img
                  src={recipe.image}
                  alt={recipe.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary">{recipe.dishType}</Badge>
                </div>
              </div>

              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{recipe.name}</CardTitle>
                  {recipe.price && (
                    <span className="text-lg font-bold text-primary">
                      ${recipe.price}
                    </span>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {recipe.description}
                </p>

                {recipe.ingredients.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">
                      Ingredients:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {recipe.ingredients
                        .slice(0, 3)
                        .map((ingredient, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {ingredient}
                          </Badge>
                        ))}
                      {recipe.ingredients.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{recipe.ingredients.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(recipe)}
                    className="flex-1"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(recipe.id)}
                    className="flex-1"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {recipes.length === 0 && (
          <div className="text-center py-12">
            <ChefHat className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">
              No recipes yet
            </h3>
            <p className="text-sm text-muted-foreground">
              Start by adding your first Dish to the collection
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
