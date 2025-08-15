"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, ChefHat } from "lucide-react"

type Recipe = {
  id: number
  name: string
  image: string
  ingredients: string[]
  dishType: string
  description: string
  price?: number
}

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([
    {
      id: 1,
      name: "Butter Chicken",
      image: "https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg",
      ingredients: ["Chicken", "Butter", "Tomatoes", "Cream", "Spices"],
      dishType: "Main Course",
      description: "Creamy and rich butter chicken with aromatic spices",
      price: 18.99
    },
    {
      id: 2,
      name: "Caesar Salad",
      image: "https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg",
      ingredients: ["Lettuce", "Parmesan", "Croutons", "Caesar Dressing"],
      dishType: "Appetizer",
      description: "Fresh crispy salad with homemade caesar dressing",
      price: 12.99
    }
  ])

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    ingredients: "",
    dishType: "",
    description: "",
    price: ""
  })

  const dishTypes = ["Appetizer", "Main Course", "Dessert", "Beverage", "Side Dish"]

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    if (!formData.name || !formData.dishType || !formData.description) return

    const newRecipe: Recipe = {
      id: editingRecipe ? editingRecipe.id : Date.now(),
      name: formData.name,
      image: formData.image || "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg",
      ingredients: formData.ingredients.split(",").map(i => i.trim()).filter(i => i),
      dishType: formData.dishType,
      description: formData.description,
      price: formData.price ? parseFloat(formData.price) : undefined
    }

    if (editingRecipe) {
      setRecipes(prev => prev.map(r => r.id === editingRecipe.id ? newRecipe : r))
    } else {
      setRecipes(prev => [...prev, newRecipe])
    }

    resetForm()
  }

  const resetForm = () => {
    setFormData({
      name: "",
      image: "",
      ingredients: "",
      dishType: "",
      description: "",
      price: ""
    })
    setEditingRecipe(null)
    setIsAddDialogOpen(false)
  }

  const handleEdit = (recipe: Recipe) => {
    setEditingRecipe(recipe)
    setFormData({
      name: recipe.name,
      image: recipe.image,
      ingredients: recipe.ingredients.join(", "),
      dishType: recipe.dishType,
      description: recipe.description,
      price: recipe.price?.toString() || ""
    })
    setIsAddDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    setRecipes(prev => prev.filter(r => r.id !== id))
  }

  return (
    <div className="flex-1 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <ChefHat className="h-8 w-8 text-primary" />
              Recipe Management
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage your hotel's recipe collection
            </p>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="h-4 w-4 mr-2" />
                Add Recipe
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingRecipe ? "Edit Recipe" : "Add New Recipe"}
                </DialogTitle>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Recipe Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Enter recipe name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="dishType">Dish Type *</Label>
                    <Select value={formData.dishType} onValueChange={(value) => handleInputChange("dishType", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select dish type" />
                      </SelectTrigger>
                      <SelectContent>
                        {dishTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => handleInputChange("price", e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="image">Image URL</Label>
                    <Input
                      id="image"
                      value={formData.image}
                      onChange={(e) => handleInputChange("image", e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="ingredients">Ingredients</Label>
                    <Textarea
                      id="ingredients"
                      value={formData.ingredients}
                      onChange={(e) => handleInputChange("ingredients", e.target.value)}
                      placeholder="Comma separated ingredients"
                      className="min-h-[100px]"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder="Describe the dish"
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit}>
                  {editingRecipe ? "Update Recipe" : "Add Recipe"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Recipe Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <Card key={recipe.id} className="overflow-hidden hover:shadow-lg transition-shadow">
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
                      {recipe.ingredients.slice(0, 3).map((ingredient, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
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
              Start by adding your first recipe to the collection
            </p>
          </div>
        )}
      </div>
    </div>
  )
}