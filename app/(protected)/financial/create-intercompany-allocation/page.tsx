'use client'

export default function CreateIntercompanyAllocationPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create Intercompany Allocation Schedules</h1>
        <p className="text-gray-500">Define allocation rules between companies</p>
      </div>

      <div className="bg-white border rounded-lg p-8 text-center">
        <div className="max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Intercompany Allocations</h3>
          <p className="text-gray-600">
            This feature allows you to create allocation schedules that distribute costs across multiple companies in your organization.
          </p>
          <p className="text-sm text-gray-500">
            Similar to standard allocation schedules but with multi-company support.
          </p>
        </div>
      </div>
    </div>
  )
}
