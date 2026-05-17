'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Download, Eye } from 'lucide-react'
import { formatDate } from '@/lib/format-date'

export default function ProjectDocumentsPage() {
  const documents = [
    { id: 1, name: 'MEP Layout Drawing.pdf', type: 'Drawing', date: '2024-01-15', size: '2.4 MB' },
    { id: 2, name: 'Electrical Schematic.dwg', type: 'CAD', date: '2024-01-14', size: '1.8 MB' },
    { id: 3, name: 'Plumbing Details.pdf', type: 'Drawing', date: '2024-01-13', size: '3.1 MB' },
  ]

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Project Documents</h1>
        <p className="text-gray-500">View and manage project documentation</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">All Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Document Name</th>
                  <th className="text-left p-2">Type</th>
                  <th className="text-left p-2">Date</th>
                  <th className="text-left p-2">Size</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr key={doc.id} className="border-b hover:bg-gray-50">
                    <td className="p-2 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      {doc.name}
                    </td>
                    <td className="p-2">{doc.type}</td>
                    <td className="p-2">{formatDate(doc.date)}</td>
                    <td className="p-2">{doc.size}</td>
                    <td className="p-2">
                      <div className="flex gap-2">
                        <button className="text-blue-600 hover:text-blue-800"><Eye className="h-4 w-4" /></button>
                        <button className="text-green-600 hover:text-green-800"><Download className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
