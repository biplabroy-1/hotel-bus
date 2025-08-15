"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { QrCode, Plus, Download, Copy, Eye, Trash2, Settings, BarChart3, Building2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

type QRCodeRecord = {
  id: number
  hotelId: string
  hotelName: string
  tableId: string
  tableName?: string
  tableCapacity?: number
  qrUrl: string
  createdAt: string
  scans: number
  isActive: boolean
  lastScanned?: string
  notes?: string
}

export default function QRPage() {
  const [qrCodes, setQrCodes] = useState<QRCodeRecord[]>([
    {
      id: 1,
      hotelId: "hotel-001",
      hotelName: "Grand Palace Hotel",
      tableId: "table-01",
      tableName: "VIP Table 1",
      tableCapacity: 4,
      qrUrl: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://hotelbus.com/user/hotel-001/table-01",
      createdAt: "2024-01-15T10:30:00Z",
      scans: 45,
      isActive: true,
      lastScanned: "2024-01-20T14:30:00Z",
      notes: "Main dining area"
    },
    {
      id: 2,
      hotelId: "hotel-001",
      hotelName: "Grand Palace Hotel",
      tableId: "table-02",
      tableName: "Garden Table",
      tableCapacity: 6,
      qrUrl: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://hotelbus.com/user/hotel-001/table-02",
      createdAt: "2024-01-14T14:20:00Z",
      scans: 23,
      isActive: true,
      lastScanned: "2024-01-19T18:45:00Z",
      notes: "Outdoor seating"
    },
    {
      id: 3,
      hotelId: "hotel-001",
      hotelName: "Grand Palace Hotel",
      tableId: "table-03",
      tableName: "Bar Counter",
      tableCapacity: 2,
      qrUrl: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://hotelbus.com/user/hotel-001/table-03",
      createdAt: "2024-01-13T09:15:00Z",
      scans: 67,
      isActive: false,
      lastScanned: "2024-01-18T20:15:00Z",
      notes: "Bar area - temporarily closed"
    }
  ])

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedQR, setSelectedQR] = useState<QRCodeRecord | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [formData, setFormData] = useState({
    hotelId: "",
    hotelName: "",
    tableId: "",
    tableName: "",
    tableCapacity: "",
    notes: ""
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const generateQRCode = () => {
    if (!formData.hotelId || !formData.tableId || !formData.hotelName) return

    const newQRCode: QRCodeRecord = {
      id: Date.now(),
      hotelId: formData.hotelId,
      hotelName: formData.hotelName,
      tableId: formData.tableId,
      tableName: formData.tableName || undefined,
      tableCapacity: formData.tableCapacity ? parseInt(formData.tableCapacity) : undefined,
      qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://hotelbus.com/user/${formData.hotelId}/${formData.tableId}`,
      createdAt: new Date().toISOString(),
      scans: 0,
      isActive: true,
      notes: formData.notes || undefined
    }

    setQrCodes(prev => [...prev, newQRCode])
    setFormData({ hotelId: "", hotelName: "", tableId: "", tableName: "", tableCapacity: "", notes: "" })
    setIsAddDialogOpen(false)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const downloadQR = (qrUrl: string, tableId: string) => {
    const link = document.createElement('a')
    link.href = qrUrl
    link.download = `qr-code-${tableId}.png`
    link.click()
  }

  const toggleActive = (id: number) => {
    setQrCodes(prev => prev.map(qr => 
      qr.id === id ? { ...qr, isActive: !qr.isActive } : qr
    ))
  }

  const deleteQRCode = (id: number) => {
    setQrCodes(prev => prev.filter(qr => qr.id !== id))
  }

  const totalScans = qrCodes.reduce((sum, qr) => sum + qr.scans, 0)
  const activeQRs = qrCodes.filter(qr => qr.isActive).length
  const avgScansPerQR = qrCodes.length > 0 ? Math.round(totalScans / qrCodes.length) : 0

  const viewDetails = (qrCode: QRCodeRecord) => {
    setSelectedQR(qrCode)
    setIsDetailsOpen(true)
  }

  const hotels = ["Grand Palace Hotel", "Seaside Resort", "Budget Inn"] // This would come from your hotels data
  return (
    <div className="flex-1 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <QrCode className="h-8 w-8 text-primary" />
              QR Code Management
            </h1>
            <p className="text-muted-foreground mt-2">
              Generate and manage QR codes for hotel tables
            </p>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Generate QR Code
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Generate New QR Code</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="hotelName">Hotel Name *</Label>
                  <Select value={formData.hotelName} onValueChange={(value) => handleInputChange("hotelName", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select hotel" />
                    </SelectTrigger>
                    <SelectContent>
                      {hotels.map(hotel => (
                        <SelectItem key={hotel} value={hotel}>{hotel}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="hotelId">Hotel ID *</Label>
                  <Input
                    id="hotelId"
                    value={formData.hotelId}
                    onChange={(e) => handleInputChange("hotelId", e.target.value)}
                    placeholder="e.g., hotel-001"
                  />
                </div>
                
                <div>
                  <Label htmlFor="tableId">Table ID *</Label>
                  <Input
                    id="tableId"
                    value={formData.tableId}
                    onChange={(e) => handleInputChange("tableId", e.target.value)}
                    placeholder="e.g., table-01"
                  />
                </div>
                
                <div>
                  <Label htmlFor="tableName">Table Name</Label>
                  <Input
                    id="tableName"
                    value={formData.tableName}
                    onChange={(e) => handleInputChange("tableName", e.target.value)}
                    placeholder="e.g., VIP Table 1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="tableCapacity">Table Capacity</Label>
                  <Input
                    id="tableCapacity"
                    type="number"
                    value={formData.tableCapacity}
                    onChange={(e) => handleInputChange("tableCapacity", e.target.value)}
                    placeholder="e.g., 4"
                  />
                </div>
                
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    placeholder="Additional notes about this table"
                    className="min-h-[80px]"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={generateQRCode}>
                  Generate QR Code
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total QR Codes</p>
                  <p className="text-2xl font-bold">{qrCodes.length}</p>
                </div>
                <QrCode className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active QR Codes</p>
                  <p className="text-2xl font-bold text-green-600">{activeQRs}</p>
                </div>
                <Badge variant="default" className="h-8 px-3">Active</Badge>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Scans</p>
                  <p className="text-2xl font-bold text-purple-600">{totalScans}</p>
                </div>
                <Eye className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Scans</p>
                  <p className="text-2xl font-bold text-orange-600">{avgScansPerQR}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* QR Code Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {qrCodes.map((qrCode) => (
            <Card key={qrCode.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {qrCode.tableName || qrCode.tableId}
                  </CardTitle>
                  <Badge variant={qrCode.isActive ? "default" : "secondary"}>
                    {qrCode.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{qrCode.hotelName}</p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex justify-center">
                  <img
                    src={qrCode.qrUrl}
                    alt={`QR Code for ${qrCode.tableId}`}
                    className="w-32 h-32 border rounded-lg"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Hotel ID</p>
                    <p className="font-medium">{qrCode.hotelId}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Table ID</p>
                    <p className="font-medium">{qrCode.tableId}</p>
                  </div>
                  {qrCode.tableCapacity && (
                    <div>
                      <p className="text-muted-foreground">Capacity</p>
                      <p className="font-medium">{qrCode.tableCapacity} people</p>
                    </div>
                  )}
                  <div>
                    <p className="text-muted-foreground">Created</p>
                    <p className="font-medium">
                      {new Date(qrCode.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Scans</p>
                    <p className="font-medium">{qrCode.scans}</p>
                  </div>
                  {qrCode.lastScanned && (
                    <div>
                      <p className="text-muted-foreground">Last Scan</p>
                      <p className="font-medium">
                        {new Date(qrCode.lastScanned).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => viewDetails(qrCode)}
                      className="flex-1"
                    >
                      <Settings className="h-3 w-3 mr-1" />
                      Details
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadQR(qrCode.qrUrl, qrCode.tableId)}
                      className="flex-1"
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(`https://hotelbus.com/user/${qrCode.hotelId}/${qrCode.tableId}`)}
                      className="flex-1"
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy URL
                    </Button>
                    <Button
                      variant={qrCode.isActive ? "secondary" : "default"}
                      size="sm"
                      onClick={() => toggleActive(qrCode.id)}
                      className="flex-1"
                    >
                      {qrCode.isActive ? "Deactivate" : "Activate"}
                    </Button>
                  </div>
                  
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteQRCode(qrCode.id)}
                    className="w-full"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete QR Code
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {qrCodes.length === 0 && (
          <div className="text-center py-12">
            <QrCode className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">
              No QR codes generated yet
            </h3>
            <p className="text-sm text-muted-foreground">
              Start by generating your first QR code for a hotel table
            </p>
          </div>
        )}

        {/* QR Code Details Modal */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5" />
                QR Code Details - {selectedQR?.tableName || selectedQR?.tableId}
              </DialogTitle>
            </DialogHeader>
            
            {selectedQR && (
              <div className="space-y-6">
                <div className="flex justify-center">
                  <img
                    src={selectedQR.qrUrl}
                    alt={`QR Code for ${selectedQR.tableId}`}
                    className="w-48 h-48 border rounded-lg"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Hotel Name</Label>
                      <p className="text-sm text-muted-foreground">{selectedQR.hotelName}</p>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Hotel ID</Label>
                      <p className="text-sm text-muted-foreground">{selectedQR.hotelId}</p>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Table Name</Label>
                      <p className="text-sm text-muted-foreground">{selectedQR.tableName || "Not specified"}</p>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Table ID</Label>
                      <p className="text-sm text-muted-foreground">{selectedQR.tableId}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Capacity</Label>
                      <p className="text-sm text-muted-foreground">
                        {selectedQR.tableCapacity ? `${selectedQR.tableCapacity} people` : "Not specified"}
                      </p>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Status</Label>
                      <div className="mt-1">
                        <Badge variant={selectedQR.isActive ? "default" : "secondary"}>
                          {selectedQR.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Total Scans</Label>
                      <p className="text-sm text-muted-foreground">{selectedQR.scans}</p>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Last Scanned</Label>
                      <p className="text-sm text-muted-foreground">
                        {selectedQR.lastScanned 
                          ? new Date(selectedQR.lastScanned).toLocaleString()
                          : "Never"
                        }
                      </p>
                    </div>
                  </div>
                </div>
                
                {selectedQR.notes && (
                  <div>
                    <Label className="text-sm font-medium">Notes</Label>
                    <p className="text-sm text-muted-foreground mt-1">{selectedQR.notes}</p>
                  </div>
                )}
                
                <div>
                  <Label className="text-sm font-medium">QR Code URL</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      value={`https://hotelbus.com/user/${selectedQR.hotelId}/${selectedQR.tableId}`}
                      readOnly
                      className="text-xs"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(`https://hotelbus.com/user/${selectedQR.hotelId}/${selectedQR.tableId}`)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => downloadQR(selectedQR.qrUrl, selectedQR.tableId)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download QR Code
                  </Button>
                  <Button
                    variant={selectedQR.isActive ? "secondary" : "default"}
                    onClick={() => {
                      toggleActive(selectedQR.id)
                      setSelectedQR(prev => prev ? {...prev, isActive: !prev.isActive} : null)
                    }}
                  >
                    {selectedQR.isActive ? "Deactivate" : "Activate"}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}