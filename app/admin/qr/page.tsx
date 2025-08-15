"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { QrCode, Plus, Download, Copy, Eye, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

type QRCodeRecord = {
  id: number
  hotelId: string
  tableId: string
  qrUrl: string
  createdAt: string
  scans: number
  isActive: boolean
}

export default function QRPage() {
  const [qrCodes, setQrCodes] = useState<QRCodeRecord[]>([
    {
      id: 1,
      hotelId: "hotel-001",
      tableId: "table-01",
      qrUrl: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://hotelbus.com/user/hotel-001/table-01",
      createdAt: "2024-01-15T10:30:00Z",
      scans: 45,
      isActive: true
    },
    {
      id: 2,
      hotelId: "hotel-001",
      tableId: "table-02",
      qrUrl: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://hotelbus.com/user/hotel-001/table-02",
      createdAt: "2024-01-14T14:20:00Z",
      scans: 23,
      isActive: true
    },
    {
      id: 3,
      hotelId: "hotel-001",
      tableId: "table-03",
      qrUrl: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://hotelbus.com/user/hotel-001/table-03",
      createdAt: "2024-01-13T09:15:00Z",
      scans: 67,
      isActive: false
    }
  ])

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    hotelId: "",
    tableId: ""
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const generateQRCode = () => {
    if (!formData.hotelId || !formData.tableId) return

    const newQRCode: QRCodeRecord = {
      id: Date.now(),
      hotelId: formData.hotelId,
      tableId: formData.tableId,
      qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://hotelbus.com/user/${formData.hotelId}/${formData.tableId}`,
      createdAt: new Date().toISOString(),
      scans: 0,
      isActive: true
    }

    setQrCodes(prev => [...prev, newQRCode])
    setFormData({ hotelId: "", tableId: "" })
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
        </div>

        {/* QR Code Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {qrCodes.map((qrCode) => (
            <Card key={qrCode.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {qrCode.hotelId} - {qrCode.tableId}
                  </CardTitle>
                  <Badge variant={qrCode.isActive ? "default" : "secondary"}>
                    {qrCode.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
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
                    <p className="text-muted-foreground">Created</p>
                    <p className="font-medium">
                      {new Date(qrCode.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Scans</p>
                    <p className="font-medium">{qrCode.scans}</p>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadQR(qrCode.qrUrl, qrCode.tableId)}
                      className="flex-1"
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(`https://hotelbus.com/user/${qrCode.hotelId}/${qrCode.tableId}`)}
                      className="flex-1"
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy URL
                    </Button>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant={qrCode.isActive ? "secondary" : "default"}
                      size="sm"
                      onClick={() => toggleActive(qrCode.id)}
                      className="flex-1"
                    >
                      {qrCode.isActive ? "Deactivate" : "Activate"}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteQRCode(qrCode.id)}
                      className="flex-1"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  </div>
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
      </div>
    </div>
  )
}