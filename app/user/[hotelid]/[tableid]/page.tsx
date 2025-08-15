"use client"

import React, { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const dishesData = {
  all: [
    { name: "Paneer Butter Masala", description: "Rich & creamy cottage cheese curry.", price: 250, image: "https://i.pinimg.com/564x/3a/9c/68/3a9c680433b124f14bc8ec7a0e1a78db.jpg" },
    { name: "Chicken Biryani", description: "Fragrant rice with tender chicken.", price: 320, image: "https://i.pinimg.com/564x/0d/3a/0e/0d3a0e3c61bdf7d67621b2e1d9e7dcb5.jpg" },
    { name: "Veg Pulao", description: "Aromatic basmati rice with fresh vegetables.", price: 200, image: "https://i.pinimg.com/564x/ea/0e/60/ea0e606cbb69ab0cfb1b85e4b8a7f62e.jpg" },
    { name: "Butter Naan", description: "Soft flatbread brushed with butter.", price: 40, image: "https://i.pinimg.com/564x/0e/bd/3b/0ebd3b7e77b63f48d6a6d6e04610ce49.jpg" },
    { name: "Chicken Tikka", description: "Spiced grilled chicken chunks.", price: 280, image: "https://i.pinimg.com/564x/3b/1c/2e/3b1c2e00ecb99d7b7d7f6c8f1c27b7f3.jpg" },
    { name: "Palak Paneer", description: "Spinach curry with cottage cheese.", price: 230, image: "https://i.pinimg.com/564x/56/69/3e/56693e5143c27c5a8e2b9cf056f0498e.jpg" },
  ],
  Trending: [
    { name: "Masala Dosa", description: "Crispy dosa with potato filling.", price: 180, image: "https://i.pinimg.com/564x/98/b7/3d/98b73d88d8282d576f3efbccf4b6b37c.jpg" },
    { name: "Pav Bhaji", description: "Spiced vegetable mash with buttered buns.", price: 150, image: "https://i.pinimg.com/564x/64/f5/0e/64f50e7f437bcf1b7a6d8b5cbe1d5a8b.jpg" },
    { name: "Vada Pav", description: "Spicy potato fritter in bun.", price: 70, image: "https://i.pinimg.com/564x/7c/49/af/7c49afcfa1437d1b0c0b3d3ff0c18a0f.jpg" },
  ],
  specials: [
    { name: "Tandoori Platter", description: "Mixed grilled delicacies.", price: 450, image: "https://i.pinimg.com/564x/18/1a/fc/181afc2f36d9b6f9f3d3f1e6e1b13c6f.jpg" },
    { name: "Lamb Rogan Josh", description: "Tender lamb in spicy curry.", price: 480, image: "https://i.pinimg.com/564x/72/1e/4a/721e4a3bbcf6b85fa3b9d5a50c8e9a1b.jpg" },
    { name: "Fish Curry", description: "Tangy and spicy coastal fish curry.", price: 400, image: "https://i.pinimg.com/564x/4f/21/2b/4f212bfcf5a4b53a61dc3a7ad1a6c8e4.jpg" },
    { name: "Paneer Tikka Masala", description: "Grilled paneer in rich tomato gravy.", price: 300, image: "https://i.pinimg.com/564x/2c/7d/3b/2c7d3b785f46d7dbb6c8e4a6d1b9e7d4.jpg" },
  ],
  favorites: [
    { name: "Margarita Pizza", description: "Classic cheese pizza.", price: 300, image: "https://i.pinimg.com/564x/1a/2b/3c/1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d.jpg" },
    { name: "Veg Burger", description: "Grilled veggie patty with sauces.", price: 180, image: "https://i.pinimg.com/564x/2b/3c/4d/2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e.jpg" },
    { name: "French Fries", description: "Crispy golden potato fries.", price: 120, image: "https://i.pinimg.com/564x/3c/4d/5e/3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f.jpg" },
    { name: "Chocolate Brownie", description: "Rich chocolate dessert.", price: 150, image: "https://i.pinimg.com/564x/4d/5e/6f/4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a.jpg" },
  ],
}

const Page = () => {
  const [activeTab, setActiveTab] = useState("all")
  const [orderCounts, setOrderCounts] = useState<{ [key: string]: number }>({})

  const handleIncrement = (dishName: string) => {
    setOrderCounts(prev => ({ ...prev, [dishName]: (prev[dishName] || 0) + 1 }))
  }

  const handleDecrement = (dishName: string) => {
    setOrderCounts(prev => ({ ...prev, [dishName]: Math.max((prev[dishName] || 0) - 1, 0) }))
  }

  const handleAddOrder = (dishName: string) => {
    if (!orderCounts[dishName] || orderCounts[dishName] === 0) {
      handleIncrement(dishName)
    }
    alert(`${dishName} added to order!`)
  }

  const totalItems = Object.values(orderCounts).reduce((a, b) => a + b, 0)
  const totalPrice = Object.entries(orderCounts).reduce((sum, [dishName, count]) => {
    const dish = Object.values(dishesData).flat().find(d => d.name === dishName)
    return sum + (dish ? dish.price * count : 0)
  }, 0)

  return (
    <div className="w-full max-w-md mx-auto px-8 py-4">
      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 w-full border-b border-muted">
          {Object.keys(dishesData).map(tab => (
            <TabsTrigger
              key={tab}
              value={tab}
              className={cn(
                "px-4 py-2 text-center transition-colors border-b-2",
                activeTab === tab
                  ? "border-black dark:border-white font-semibold"
                  : "border-transparent hover:text-primary"
              )}
            >
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Tabs Content */}
        {Object.entries(dishesData).map(([key, items]) => (
          <TabsContent key={key} value={key} className="space-y-4 pb-28">
            {items.map(dish => (
              <Card key={dish.name} className="rounded-2xl shadow-md flex flex-col gap-2">
                <img src={dish.image} alt={dish.name} className="w-full h-48 object-cover rounded-t-2xl"/>
                <CardHeader>
                  <CardTitle>{dish.name}</CardTitle>
                  <CardDescription>{dish.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  <p className="font-semibold text-lg">₹{dish.price}</p>
                  <div className="flex items-center gap-2">
                    <Button size="sm" onClick={() => handleDecrement(dish.name)}>-</Button>
                    <span>{orderCounts[dish.name] || 0}</span>
                    <Button size="sm" onClick={() => handleIncrement(dish.name)}>+</Button>
                    <Button size="sm" variant="outline" onClick={() => handleAddOrder(dish.name)}>
                      Add Order
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        ))}
      </Tabs>

      {/* Floating Place Order */}
      <div className="fixed bottom-4 left-0 right-0 flex justify-center items-center gap-4 bg-background/80 p-4 shadow-md backdrop-blur-md">
        <Button disabled={totalItems === 0}>
          Place Order ({totalItems} {totalItems === 1 ? "item" : "items"})
        </Button>
        <span className="font-semibold text-lg">Total: ₹{totalPrice}</span>
      </div>
    </div>
  )
}

export default Page
