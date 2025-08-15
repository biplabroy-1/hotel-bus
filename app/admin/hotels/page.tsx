"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Building2, Search, Filter, Eye, CheckCircle, XCircle, Clock, MapPin, Phone, Mail, Star } from "lucide-react"

type HotelStatus = "pending" | "verified" | "rejected" | "suspended"

type Hotel = {
  id: number
  name: string
  email: string
  phone: string
  address: string
  city: string
  country: string
  hotelId: string
  description: string
  category: string
  submittedAt: string
  status: HotelStatus
  rating?: number
  totalTables?: number
  documents: string[]
}

export default function HotelsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([
    {
      id: 1,
      name: "Grand Palace Hotel",
      email: "admin@grandpalace.com",
      phone: "+1-555-0123",
      address: "123 Luxury Ave",
      city: "New York",
      country: "USA",
      hotelId: "hotel-001",
      description: "Luxury 5-star hotel in the heart of Manhattan",
      category: "Luxury",
      submittedAt: "2024-01-15T10:30:00Z",
      status: "pending",
      rating: 4.8,
      totalTables: 25,
      documents: ["business_license.pdf", "tax_certificate.pdf"]
    },
    {
      id: 2,
      name: "Seaside Resort",
      email: "contact@seasideresort.com",
      phone: "+1-555-0124",
      address: "456 Ocean Drive",
      city: "Miami",
      country: "USA",
      hotelId: "hotel-002",
      description: "Beautiful beachfront resort with ocean views",
      category: "Resort",
      submittedAt: "2024-01-14T14:20:00Z",
      status: "verified",
      rating: 4.6,
      totalTables: 18,
      documents: ["business_license.pdf", "health_permit.pdf", "fire_safety.pdf"]
    },
    {
      id: 3,
      name: "Budget Inn",
      email: "info@budgetinn.com",
      phone: "+1-555-0125",
      address: "789 Main Street",
      city: "Chicago",
      country: "USA",
      hotelId: "hotel-003",
      description: "Affordable accommodation for business travelers",
      category: "Budget",
      submittedAt: "2024-01-13T09:15:00Z",
      status: "rejected",
      totalTables: 8,
      documents: ["business_license.pdf"]
    }
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const getStatusIcon = (status: HotelStatus) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "suspended":
        return <XCircle className="h-4 w-4 text-orange-500" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
    }
  }

  const getStatusBadge = (status: HotelStatus) => {
    const variants = {
      verified: "default",
      rejected: "destructive",
      suspended: "destructive",
      pending: "secondary"
    } as const

    return (
      <Badge variant={variants[status]} className="flex items-center gap-1">
        {getStatusIcon(status)}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const updateHotelStatus = (id: number, newStatus: HotelStatus) => {
    setHotels(prev => prev.map(hotel => 
      hotel.id === id ? { ...hotel, status: newStatus } : hotel
    ))
  }

  const filteredHotels = hotels.filter(hotel => {
    const matchesSearch = hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hotel.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hotel.hotelId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || hotel.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const statusCounts = {
    total: hotels.length,
    pending: hotels.filter(h => h.status === "pending").length,
    verified: hotels.filter(h => h.status === "verified").length,
    rejected: hotels.filter(h => h.status === "rejected").length,
    suspended: hotels.filter(h => h.status === "suspended").length
  }

  const viewDetails = (hotel: Hotel) => {
    setSelectedHotel(hotel)
    setIsDetailsOpen(true)
  }

  return (
    <div className="flex-1 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Building2 className="h-8 w-8 text-primary" />
            Hotel Verification
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage hotel registrations and verification status
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Hotels</p>
                  <p className="text-2xl font-bold">{statusCounts.total}</p>
                </div>
                <Building2 className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{statusCounts.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Verified</p>
                  <p className="text-2xl font-bold text-green-600">{statusCounts.verified}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Rejected</p>
                  <p className="text-2xl font-bold text-red-600">{statusCounts.rejected}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Suspended</p>
                  <p className="text-2xl font-bold text-orange-600">{statusCounts.suspended}</p>
                </div>
                <XCircle className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by hotel name, email, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Hotel Records */}
        <div className="space-y-4">
          {filteredHotels.map((hotel) => (
            <Card key={hotel.id}>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                          {hotel.name}
                          {hotel.rating && (
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              <span className="text-sm text-muted-foreground">{hotel.rating}</span>
                            </div>
                          )}
                        </h3>
                        <p className="text-sm text-muted-foreground">ID: {hotel.hotelId}</p>
                      </div>
                      {getStatusBadge(hotel.status)}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          Email
                        </p>
                        <p className="text-sm font-medium">{hotel.email}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          Phone
                        </p>
                        <p className="text-sm font-medium">{hotel.phone}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          Location
                        </p>
                        <p className="text-sm font-medium">{hotel.city}, {hotel.country}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4 mt-2">
                      <div>
                        <p className="text-xs text-muted-foreground">Category</p>
                        <Badge variant="outline">{hotel.category}</Badge>
                      </div>
                      {hotel.totalTables && (
                        <div>
                          <p className="text-xs text-muted-foreground">Tables</p>
                          <p className="text-sm font-medium">{hotel.totalTables}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-xs text-muted-foreground">Submitted</p>
                        <p className="text-sm font-medium">
                          {new Date(hotel.submittedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" size="sm" onClick={() => viewDetails(hotel)}>
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                    {hotel.status === "pending" && (
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="default"
                          onClick={() => updateHotelStatus(hotel.id, "verified")}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Verify
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => updateHotelStatus(hotel.id, "rejected")}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    )}
                    {hotel.status === "verified" && (
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => updateHotelStatus(hotel.id, "suspended")}
                      >
                        Suspend
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredHotels.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">
              No hotels found
            </h3>
            <p className="text-sm text-muted-foreground">
              {searchTerm || statusFilter !== "all" 
                ? "Try adjusting your search or filter criteria"
                : "Hotel registrations will appear here when submitted"
              }
            </p>
          </div>
        )}

        {/* Hotel Details Modal */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Hotel Details - {selectedHotel?.name}
              </DialogTitle>
            </DialogHeader>
            
            {selectedHotel && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Hotel Name</Label>
                      <p className="text-sm text-muted-foreground">{selectedHotel.name}</p>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Hotel ID</Label>
                      <p className="text-sm text-muted-foreground">{selectedHotel.hotelId}</p>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Category</Label>
                      <Badge variant="outline">{selectedHotel.category}</Badge>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Status</Label>
                      <div className="mt-1">
                        {getStatusBadge(selectedHotel.status)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Contact Email</Label>
                      <p className="text-sm text-muted-foreground">{selectedHotel.email}</p>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Phone Number</Label>
                      <p className="text-sm text-muted-foreground">{selectedHotel.phone}</p>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Address</Label>
                      <p className="text-sm text-muted-foreground">
                        {selectedHotel.address}<br />
                        {selectedHotel.city}, {selectedHotel.country}
                      </p>
                    </div>
                    
                    {selectedHotel.rating && (
                      <div>
                        <Label className="text-sm font-medium">Rating</Label>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm">{selectedHotel.rating}/5</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Description</Label>
                  <p className="text-sm text-muted-foreground mt-1">{selectedHotel.description}</p>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Submitted Documents</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedHotel.documents.map((doc, index) => (
                      <Badge key={index} variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                        {doc}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Total Tables</Label>
                    <p className="text-sm text-muted-foreground">{selectedHotel.totalTables || "Not specified"}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Submitted Date</Label>
                    <p className="text-sm text-muted-foreground">
                      {new Date(selectedHotel.submittedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                {selectedHotel.status === "pending" && (
                  <div className="flex gap-2 pt-4 border-t">
                    <Button 
                      onClick={() => {
                        updateHotelStatus(selectedHotel.id, "verified")
                        setIsDetailsOpen(false)
                      }}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Verify Hotel
                    </Button>
                    <Button 
                      variant="destructive"
                      onClick={() => {
                        updateHotelStatus(selectedHotel.id, "rejected")
                        setIsDetailsOpen(false)
                      }}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject Application
                    </Button>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}