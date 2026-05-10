'use client'

export default function AdvancedIntercompanyJournalPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Make Advanced Intercompany Journal Entries</h1>
        <p className="text-gray-500">Create journal entries that affect multiple companies</p>
      </div>

      <div className="bg-white border rounded-lg p-8 text-center">
        <div className="max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Intercompany Journal Entries</h3>
          <p className="text-gray-600">
            Create journal entries that automatically generate corresponding entries in related companies to maintain balanced intercompany accounts.
          </p>
          <p className="text-sm text-gray-500">
            Similar to standard journal entries but with automatic intercompany balancing.
          </p>
        </div>
      </div>
    </div>
  )
}
