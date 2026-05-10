'use client'

export default function MakeStatisPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Make Statistical Accounts</h1>
        <p className="text-gray-500">Create non-monetary statistical tracking accounts</p>
      </div>

      <div className="bg-white border rounded-lg p-8 text-center">
        <div className="max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Statistical Accounts</h3>
          <p className="text-gray-600">
            Statistical accounts track non-monetary metrics like headcount, square footage, or units produced for allocation and reporting purposes.
          </p>
          <p className="text-sm text-gray-500">
            These accounts don't affect financial statements but provide valuable operational metrics.
          </p>
        </div>
      </div>
    </div>
  )
}
