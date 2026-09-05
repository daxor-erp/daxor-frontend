'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { QrCode, Camera, CheckCircle } from 'lucide-react'

export default function ScanQRCodePage() {
  const [scanning, setScanning] = useState(false)
  const [scannedData, setScannedData] = useState<string | null>(null)

  const handleScan = () => {
    setScanning(true)
    setTimeout(() => {
      setScannedData('MODULE-2024-001')
      setScanning(false)
    }, 2000)
  }

  return (
    <div className="erp-shell">
      <div>
        <h1 className="erp-page-title">Scan QR Code</h1>
        <p className="erp-page-desc">Scan module QR codes for tracking</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">QR Code Scanner</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
              {scanning ? (
                <div className="space-y-3">
                  <Camera className="h-16 w-16 text-primary mx-auto animate-pulse" />
                  <p className="erp-page-desc">Scanning...</p>
                </div>
              ) : scannedData ? (
                <div className="space-y-3">
                  <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
                  <p className="text-sm font-semibold">Scanned: {scannedData}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <QrCode className="h-16 w-16 text-gray-400 mx-auto" />
                  <p className="erp-page-desc">Ready to scan</p>
                </div>
              )}
            </div>
            <Button onClick={handleScan} disabled={scanning} className="w-full">
              <Camera className="h-4 w-4 mr-2" />
              {scanning ? 'Scanning...' : 'Start Scan'}
            </Button>
            {scannedData && (
              <Button variant="outline" onClick={() => setScannedData(null)} className="w-full">
                Scan Another
              </Button>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Recent Scans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {['MODULE-2024-001', 'MODULE-2024-002', 'MODULE-2024-003'].map((code, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center gap-2">
                    <QrCode className="h-4 w-4 text-gray-500" />
                    <span className="text-xs font-mono">{code}</span>
                  </div>
                  <span className="text-xs text-gray-400">{new Date().toLocaleTimeString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
