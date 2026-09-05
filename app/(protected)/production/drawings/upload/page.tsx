'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { InputFloating } from '@/components/ui/input-floating'
import { Upload, FileText, X } from 'lucide-react'

export default function UploadDrawingsPage() {
  const { user } = useAuth()
  const [files, setFiles] = useState<File[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  const handleUpload = () => {
    console.log('Uploading:', { title, description, files })
    alert('Upload functionality to be implemented')
  }

  return (
    <div className="erp-shell">
      <div>
        <h1 className="erp-page-title">Upload Drawings</h1>
        <p className="erp-page-desc">Upload technical drawings and documents</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Upload New Drawing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <InputFloating label="Title" value={title} onChange={e => setTitle(e.target.value)} className="h-8 text-xs" />
          <InputFloating label="Description" multiline rows={3} value={description} onChange={e => setDescription(e.target.value)} className="text-xs" />
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="erp-page-desc">Drag and drop files here or click to browse</p>
            <input type="file" multiple onChange={handleFileChange} className="hidden" id="file-upload" />
            <label htmlFor="file-upload">
              <Button size="sm" className="cursor-pointer" onClick={() => document.getElementById('file-upload')?.click()}>
                Select Files
              </Button>
            </label>
          </div>

          {files.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold">Selected Files:</p>
              {files.map((file, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <span className="text-xs">{file.name}</span>
                  </div>
                  <button onClick={() => setFiles(files.filter((_, i) => i !== idx))} className="text-red-500 hover:text-red-700">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <Button onClick={handleUpload} disabled={!title || files.length === 0} className="w-full">
            <Upload className="h-4 w-4 mr-2" />
            Upload Drawings
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
