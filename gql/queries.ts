import { gql } from '@apollo/client'

// ===========================================================================
// Notifications (backend-persisted, see backend modules/notification)
// ===========================================================================
export const GET_MY_NOTIFICATIONS = gql`
  query MyNotifications($unreadOnly: Boolean, $limit: Int, $skip: Int) {
    myNotifications(unreadOnly: $unreadOnly, limit: $limit, skip: $skip) {
      id
      organizationId
      recipientUserId
      actorUserId
      kind
      severity
      title
      message
      link
      referenceModule
      referenceId
      moduleKey
      isRead
      readAt
      archivedAt
      createdAt
    }
  }
`

export const GET_MY_UNREAD_NOTIFICATION_COUNT = gql`
  query MyUnreadNotificationCount {
    myUnreadNotificationCount
  }
`

export const MARK_NOTIFICATION_READ = gql`
  mutation MarkNotificationRead($id: ID!) {
    markNotificationRead(id: $id) {
      id
      isRead
      readAt
    }
  }
`

export const MARK_ALL_NOTIFICATIONS_READ = gql`
  mutation MarkAllNotificationsRead {
    markAllNotificationsRead
  }
`

export const ARCHIVE_NOTIFICATION = gql`
  mutation ArchiveNotification($id: ID!) {
    archiveNotification(id: $id) {
      id
      archivedAt
    }
  }
`

export const ARCHIVE_ALL_NOTIFICATIONS = gql`
  mutation ArchiveAllNotifications {
    archiveAllNotifications
  }
`

// ===========================================================================
// Tax Rates
// ===========================================================================
export const GET_TAX_RATES = gql`
  query GetTaxRates($organizationId: ID!, $status: String, $appliesTo: String, $search: String) {
    taxRates(organizationId: $organizationId, status: $status, appliesTo: $appliesTo, search: $search) {
      id
      name
      code
      ratePercent
      taxType
      appliesTo
      hsnSacCode
      description
      isCompound
      isInclusive
      status
      effectiveFrom
      effectiveTo
      createdAt
    }
  }
`

export const CREATE_TAX_RATE = gql`
  mutation CreateTaxRate($input: CreateTaxRateInput!) {
    createTaxRate(input: $input) {
      id
      name
      code
      ratePercent
    }
  }
`

export const UPDATE_TAX_RATE = gql`
  mutation UpdateTaxRate($id: ID!, $input: UpdateTaxRateInput!) {
    updateTaxRate(id: $id, input: $input) {
      id
      name
      ratePercent
      status
    }
  }
`

export const DELETE_TAX_RATE = gql`
  mutation DeleteTaxRate($id: ID!) {
    deleteTaxRate(id: $id) {
      id
    }
  }
`

// ===========================================================================
// Fixed Assets
// ===========================================================================
export const GET_FIXED_ASSETS = gql`
  query GetFixedAssets($organizationId: ID!, $status: String, $category: String, $search: String) {
    fixedAssets(organizationId: $organizationId, status: $status, category: $category, search: $search) {
      id
      assetCode
      name
      category
      status
      purchaseDate
      acquisitionCost
      accumulatedDepreciation
      bookValue
      usefulLifeMonths
      depreciationMethod
      depreciationRatePercent
      serialNumber
      barcode
      assignedToUserId
      siteLocationId
      vendorId
      warrantyExpiryDate
      createdAt
    }
  }
`

export const GET_FIXED_ASSET = gql`
  query GetFixedAsset($id: ID!) {
    fixedAsset(id: $id) {
      id
      organizationId
      assetCode
      name
      description
      category
      status
      assignedToUserId
      siteLocationId
      vendorId
      purchaseDate
      commissionedDate
      disposalDate
      acquisitionCost
      salvageValue
      usefulLifeMonths
      depreciationMethod
      depreciationRatePercent
      accumulatedDepreciation
      bookValue
      serialNumber
      barcode
      warrantyExpiryDate
      depreciationHistory {
        periodEndDate
        amount
        accumulatedDepreciation
        bookValue
        method
        notes
        postedAt
      }
      notes
      createdAt
      updatedAt
    }
  }
`

export const GET_FIXED_ASSET_SUMMARY = gql`
  query GetFixedAssetSummary($organizationId: ID!) {
    fixedAssetSummaryByCategory(organizationId: $organizationId) {
      category
      count
      acquisitionCost
      accumulatedDepreciation
      bookValue
    }
  }
`

export const CREATE_FIXED_ASSET = gql`
  mutation CreateFixedAsset($input: CreateFixedAssetInput!) {
    createFixedAsset(input: $input) {
      id
      assetCode
      name
    }
  }
`

export const UPDATE_FIXED_ASSET = gql`
  mutation UpdateFixedAsset($id: ID!, $input: UpdateFixedAssetInput!) {
    updateFixedAsset(id: $id, input: $input) {
      id
      name
      status
    }
  }
`

export const DELETE_FIXED_ASSET = gql`
  mutation DeleteFixedAsset($id: ID!) {
    deleteFixedAsset(id: $id) {
      id
    }
  }
`

export const POST_FIXED_ASSET_DEPRECIATION = gql`
  mutation PostFixedAssetDepreciation($id: ID!, $input: PostDepreciationInput!) {
    postFixedAssetDepreciation(id: $id, input: $input) {
      id
      accumulatedDepreciation
      bookValue
    }
  }
`

export const DISPOSE_FIXED_ASSET = gql`
  mutation DisposeFixedAsset($id: ID!, $disposalDate: String!, $notes: String) {
    disposeFixedAsset(id: $id, disposalDate: $disposalDate, notes: $notes) {
      id
      status
      disposalDate
    }
  }
`

// ===========================================================================
// Global search
// ===========================================================================
export const GLOBAL_SEARCH = gql`
  query GlobalSearch($organizationId: ID!, $query: String!, $limitPerKind: Int) {
    globalSearch(organizationId: $organizationId, query: $query, limitPerKind: $limitPerKind) {
      id
      kind
      title
      subtitle
      link
      matchedField
    }
  }
`

// ===========================================================================
// HR Master (generic) + Employee Master + Delivery Order + Intercompany + QC + Maintenance
// ===========================================================================
export const GET_HR_MASTERS = gql`
  query GetHrMasters($organizationId: ID!, $kind: String!, $active: Boolean, $search: String) {
    hrMasters(organizationId: $organizationId, kind: $kind, active: $active, search: $search) {
      id
      code
      name
      description
      metadataJson
      active
      sortOrder
      createdAt
    }
  }
`
export const CREATE_HR_MASTER = gql`
  mutation CreateHrMaster($input: CreateHrMasterInput!) {
    createHrMaster(input: $input) { id code name }
  }
`
export const UPDATE_HR_MASTER = gql`
  mutation UpdateHrMaster($id: ID!, $input: UpdateHrMasterInput!) {
    updateHrMaster(id: $id, input: $input) { id code name active }
  }
`
export const DELETE_HR_MASTER = gql`
  mutation DeleteHrMaster($id: ID!) {
    deleteHrMaster(id: $id) { id }
  }
`

export const GET_EMPLOYEE_MASTERS = gql`
  query GetEmployeeMasters($organizationId: ID!, $status: String, $department: String, $search: String) {
    employeeMasters(organizationId: $organizationId, status: $status, department: $department, search: $search) {
      id
      userId
      employeeCode
      firstName
      lastName
      designation
      department
      workEmail
      phone
      dateOfJoining
      employmentType
      basicSalary
      status
      createdAt
    }
  }
`
export const GET_EMPLOYEE_MASTER = gql`
  query GetEmployeeMaster($id: ID!) {
    employeeMaster(id: $id) {
      id
      employeeCode
      firstName
      lastName
      dateOfBirth
      gender
      bloodGroup
      nationality
      maritalStatus
      personalEmail
      workEmail
      phone
      alternatePhone
      address
      city
      state
      country
      pincode
      designation
      department
      reportsToUserId
      dateOfJoining
      dateOfConfirmation
      dateOfRelieving
      employmentType
      workLocation
      basicSalary
      currency
      panNumber
      aadhaarNumber
      uanNumber
      esiNumber
      bankDetails { bankName accountNumber ifscCode branchName }
      emergencyContact { name relation phone }
      status
      notes
      createdAt
      updatedAt
    }
  }
`
export const CREATE_EMPLOYEE_MASTER = gql`
  mutation CreateEmployeeMaster($input: CreateEmployeeMasterInput!) {
    createEmployeeMaster(input: $input) { id employeeCode firstName lastName }
  }
`
export const UPDATE_EMPLOYEE_MASTER = gql`
  mutation UpdateEmployeeMaster($id: ID!, $input: UpdateEmployeeMasterInput!) {
    updateEmployeeMaster(id: $id, input: $input) { id status }
  }
`
export const DELETE_EMPLOYEE_MASTER = gql`
  mutation DeleteEmployeeMaster($id: ID!) {
    deleteEmployeeMaster(id: $id) { id }
  }
`

export const GET_DELIVERY_ORDERS = gql`
  query GetDeliveryOrders($organizationId: ID!, $status: String, $customerId: ID, $salesOrderId: ID, $search: String) {
    deliveryOrders(organizationId: $organizationId, status: $status, customerId: $customerId, salesOrderId: $salesOrderId, search: $search) {
      id
      docNumber
      customerName
      deliveryDate
      carrier
      trackingNumber
      totalQuantity
      status
      createdAt
    }
  }
`
export const CREATE_DELIVERY_ORDER = gql`
  mutation CreateDeliveryOrder($input: CreateDeliveryOrderInput!) {
    createDeliveryOrder(input: $input) { id docNumber }
  }
`
export const UPDATE_DELIVERY_ORDER = gql`
  mutation UpdateDeliveryOrder($id: ID!, $input: UpdateDeliveryOrderInput!) {
    updateDeliveryOrder(id: $id, input: $input) { id status }
  }
`
export const DELETE_DELIVERY_ORDER = gql`
  mutation DeleteDeliveryOrder($id: ID!) {
    deleteDeliveryOrder(id: $id) { id }
  }
`
export const TRANSITION_DELIVERY_STATUS = gql`
  mutation TransitionDeliveryOrderStatus($id: ID!, $status: String!, $signedBy: String) {
    transitionDeliveryOrderStatus(id: $id, status: $status, signedBy: $signedBy) { id status }
  }
`

export const GET_INTERCOMPANY_ALLOCATIONS = gql`
  query GetIntercompanyAllocations($organizationId: ID!, $status: String, $search: String) {
    intercompanyAllocations(organizationId: $organizationId, status: $status, search: $search) {
      id
      scheduleCode
      name
      sourceAccount
      basisAmount
      basisDate
      allocationMethod
      totalAllocated
      status
      lines {
        targetOrganizationId
        targetOrganizationName
        percentage
        amount
      }
      createdAt
    }
  }
`
export const CREATE_INTERCOMPANY_ALLOCATION = gql`
  mutation CreateIntercompanyAllocation($input: CreateIntercompanyAllocationInput!) {
    createIntercompanyAllocation(input: $input) { id scheduleCode }
  }
`
export const UPDATE_INTERCOMPANY_ALLOCATION = gql`
  mutation UpdateIntercompanyAllocation($id: ID!, $input: UpdateIntercompanyAllocationInput!) {
    updateIntercompanyAllocation(id: $id, input: $input) { id status }
  }
`
export const DELETE_INTERCOMPANY_ALLOCATION = gql`
  mutation DeleteIntercompanyAllocation($id: ID!) {
    deleteIntercompanyAllocation(id: $id) { id }
  }
`
export const POST_INTERCOMPANY_ALLOCATION = gql`
  mutation PostIntercompanyAllocation($id: ID!) {
    postIntercompanyAllocation(id: $id) { id status postedAt }
  }
`

export const GET_INTERCOMPANY_JOURNALS = gql`
  query GetIntercompanyJournals($originatingOrganizationId: ID!, $status: String, $search: String) {
    intercompanyJournalEntries(originatingOrganizationId: $originatingOrganizationId, status: $status, search: $search) {
      id
      docNumber
      entryDate
      description
      totalDebit
      totalCredit
      status
      postedAt
      lines {
        organizationId
        account
        debit
        credit
      }
      createdAt
    }
  }
`
export const CREATE_INTERCOMPANY_JOURNAL = gql`
  mutation CreateIntercompanyJournal($input: CreateIntercompanyJournalInput!) {
    createIntercompanyJournalEntry(input: $input) { id docNumber }
  }
`
export const POST_INTERCOMPANY_JOURNAL = gql`
  mutation PostIntercompanyJournal($id: ID!) {
    postIntercompanyJournalEntry(id: $id) { id status postedAt }
  }
`
export const REVERSE_INTERCOMPANY_JOURNAL = gql`
  mutation ReverseIntercompanyJournal($id: ID!) {
    reverseIntercompanyJournalEntry(id: $id) { id status }
  }
`

export const GET_QC_INSPECTIONS = gql`
  query GetQCInspections($organizationId: ID!, $outcome: String, $sourceModule: String, $search: String) {
    qcInspections(organizationId: $organizationId, outcome: $outcome, sourceModule: $sourceModule, search: $search) {
      id
      docNumber
      inspectionDate
      sourceModule
      itemName
      batchNumber
      quantityInspected
      quantityPassed
      quantityFailed
      outcome
      defects { code severity quantity }
      createdAt
    }
  }
`
export const GET_QC_OUTCOME_SUMMARY = gql`
  query GetQCOutcomeSummary($organizationId: ID!) {
    qcOutcomeSummary(organizationId: $organizationId) {
      outcome
      count
      quantityInspected
      quantityPassed
      quantityFailed
    }
  }
`
export const CREATE_QC_INSPECTION = gql`
  mutation CreateQCInspection($input: CreateQCInspectionInput!) {
    createQCInspection(input: $input) { id docNumber outcome }
  }
`
export const SET_QC_OUTCOME = gql`
  mutation SetQCInspectionOutcome($id: ID!, $outcome: String!, $notes: String) {
    setQCInspectionOutcome(id: $id, outcome: $outcome, notes: $notes) { id outcome }
  }
`
export const DELETE_QC_INSPECTION = gql`
  mutation DeleteQCInspection($id: ID!) {
    deleteQCInspection(id: $id) { id }
  }
`

export const GET_ASSET_MAINTENANCES = gql`
  query GetAssetMaintenances($organizationId: ID!, $status: String, $assetId: ID, $maintenanceType: String, $search: String) {
    assetMaintenances(organizationId: $organizationId, status: $status, assetId: $assetId, maintenanceType: $maintenanceType, search: $search) {
      id
      docNumber
      assetId
      assetName
      maintenanceType
      priority
      scheduledDate
      completedAt
      description
      partsCost
      laborCost
      totalCost
      status
      createdAt
    }
  }
`
export const GET_UPCOMING_MAINTENANCE = gql`
  query GetUpcomingMaintenance($organizationId: ID!, $days: Int) {
    upcomingMaintenance(organizationId: $organizationId, days: $days) {
      id
      docNumber
      assetName
      maintenanceType
      priority
      scheduledDate
      status
    }
  }
`
export const CREATE_ASSET_MAINTENANCE = gql`
  mutation CreateAssetMaintenance($input: CreateAssetMaintenanceInput!) {
    createAssetMaintenance(input: $input) { id docNumber }
  }
`
export const UPDATE_ASSET_MAINTENANCE = gql`
  mutation UpdateAssetMaintenance($id: ID!, $input: UpdateAssetMaintenanceInput!) {
    updateAssetMaintenance(id: $id, input: $input) { id status }
  }
`
export const DELETE_ASSET_MAINTENANCE = gql`
  mutation DeleteAssetMaintenance($id: ID!) {
    deleteAssetMaintenance(id: $id) { id }
  }
`
export const START_ASSET_MAINTENANCE = gql`
  mutation StartAssetMaintenance($id: ID!) {
    startAssetMaintenance(id: $id) { id status startedAt }
  }
`
export const COMPLETE_ASSET_MAINTENANCE = gql`
  mutation CompleteAssetMaintenance($id: ID!, $input: CompleteMaintenanceInput!) {
    completeAssetMaintenance(id: $id, input: $input) { id status completedAt }
  }
`

// ===========================================================================
// Documents (attachments on any parent entity)
// ===========================================================================
export const GET_DOCUMENTS = gql`
  query GetDocuments($parentModule: String!, $parentId: ID!) {
    documents(parentModule: $parentModule, parentId: $parentId) {
      id
      filename
      mimeType
      sizeBytes
      category
      description
      downloadUrl
      uploadedByUserId
      createdAt
    }
  }
`

export const GET_ORG_DOCUMENTS = gql`
  query GetOrgDocuments($organizationId: ID!, $parentModule: String) {
    organizationDocuments(organizationId: $organizationId, parentModule: $parentModule) {
      id
      filename
      mimeType
      sizeBytes
      parentModule
      parentId
      category
      downloadUrl
      createdAt
    }
  }
`

export const DELETE_DOCUMENT = gql`
  mutation DeleteDocument($id: ID!) {
    deleteDocument(id: $id) {
      id
    }
  }
`

// ===========================================================================
// Timesheets
// ===========================================================================
export const GET_TIMESHEETS = gql`
  query GetTimesheets($organizationId: ID!, $employeeUserId: ID, $projectId: ID, $status: String, $startDate: String, $endDate: String, $billable: Boolean) {
    timesheetEntries(
      organizationId: $organizationId
      employeeUserId: $employeeUserId
      projectId: $projectId
      status: $status
      startDate: $startDate
      endDate: $endDate
      billable: $billable
    ) {
      id
      employeeUserId
      projectId
      workOrderId
      taskName
      entryDate
      hours
      billable
      billRate
      costRate
      notes
      status
      submittedAt
      approvedAt
      approvedByUserId
      rejectionReason
      createdAt
    }
  }
`

export const GET_TIMESHEET_WEEKLY_SUMMARY = gql`
  query GetTimesheetWeeklySummary($organizationId: ID!, $employeeUserId: ID!, $weekStart: String!, $weekEnd: String!) {
    timesheetWeeklySummary(
      organizationId: $organizationId
      employeeUserId: $employeeUserId
      weekStart: $weekStart
      weekEnd: $weekEnd
    ) {
      totalHours
      billableHours
      approvedHours
      pending
      draft
    }
  }
`

export const CREATE_TIMESHEET_ENTRY = gql`
  mutation CreateTimesheetEntry($input: CreateTimesheetEntryInput!) {
    createTimesheetEntry(input: $input) {
      id
      hours
      status
    }
  }
`

export const UPDATE_TIMESHEET_ENTRY = gql`
  mutation UpdateTimesheetEntry($id: ID!, $input: UpdateTimesheetEntryInput!) {
    updateTimesheetEntry(id: $id, input: $input) {
      id
      hours
      status
    }
  }
`

export const DELETE_TIMESHEET_ENTRY = gql`
  mutation DeleteTimesheetEntry($id: ID!) {
    deleteTimesheetEntry(id: $id) {
      id
    }
  }
`

export const SUBMIT_TIMESHEET_ENTRY = gql`
  mutation SubmitTimesheetEntry($id: ID!) {
    submitTimesheetEntry(id: $id) {
      id
      status
    }
  }
`

export const RESOLVE_TIMESHEET_ENTRY = gql`
  mutation ResolveTimesheetEntry($id: ID!, $decision: String!, $reason: String) {
    resolveTimesheetEntry(id: $id, decision: $decision, reason: $reason) {
      id
      status
    }
  }
`

// ===========================================================================
// Bill of Materials
// ===========================================================================
export const GET_BOMS = gql`
  query GetBOMs($organizationId: ID!, $status: String, $parentItemId: ID, $search: String) {
    billsOfMaterials(organizationId: $organizationId, status: $status, parentItemId: $parentItemId, search: $search) {
      id
      parentItemId
      parentItemName
      bomCode
      version
      quantityProduced
      unit
      laborCost
      overheadCost
      totalMaterialCost
      totalCost
      status
      components {
        itemId
        itemName
        quantity
        unit
        scrapPercent
        standardCost
      }
      createdAt
    }
  }
`

export const GET_BOM = gql`
  query GetBOM($id: ID!) {
    billOfMaterials(id: $id) {
      id
      organizationId
      parentItemId
      parentItemName
      bomCode
      version
      description
      quantityProduced
      unit
      laborCost
      overheadCost
      totalMaterialCost
      totalCost
      status
      notes
      components {
        itemId
        itemName
        quantity
        unit
        scrapPercent
        standardCost
        notes
      }
      createdAt
      updatedAt
    }
  }
`

export const CREATE_BOM = gql`
  mutation CreateBOM($input: CreateBOMInput!) {
    createBillOfMaterials(input: $input) {
      id
      bomCode
      totalCost
    }
  }
`

export const UPDATE_BOM = gql`
  mutation UpdateBOM($id: ID!, $input: UpdateBOMInput!) {
    updateBillOfMaterials(id: $id, input: $input) {
      id
      totalCost
      status
    }
  }
`

export const DELETE_BOM = gql`
  mutation DeleteBOM($id: ID!) {
    deleteBillOfMaterials(id: $id) {
      id
    }
  }
`

// ===========================================================================
// Audit Log
// ===========================================================================
export const GET_AUDIT_LOGS = gql`
  query GetAuditLogs($entityType: String, $entityId: ID, $userId: ID, $action: String, $page: Int, $limit: Int) {
    auditLogs(entityType: $entityType, entityId: $entityId, userId: $userId, action: $action, page: $page, limit: $limit) {
      data {
        id
        userId
        action
        entityType
        entityId
        oldValuesJson
        newValuesJson
        ipAddress
        userAgent
        createdAt
      }
      total
      page
      pages
    }
  }
`

// Auth
export const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        id
        email
        firstName
        lastName
        roles
        organizationId
        modulePermissions {
          moduleKey
          canCreate
          canUpdate
          canDelete
          canView
        }
      }
    }
  }
`

export const ME = gql`
  query Me {
    me {
      id
      email
      firstName
      lastName
      roles
      organizationId
      modulePermissions {
        moduleKey
        submoduleKey
        canCreate
        canUpdate
        canDelete
        canView
      }
      packageEnabledModules {
        moduleKey
        submoduleKey
      }
      dashboardPreferences {
        erp {
          hiddenWidgets
          widgetOrder
        }
        admin {
          hiddenWidgets
          widgetOrder
        }
        orgAdmin {
          hiddenWidgets
          widgetOrder
        }
      }
    }
  }
`

export const UPDATE_MY_DASHBOARD_PREFERENCES = gql`
  mutation UpdateMyDashboardPreferences($dashboard: String!, $input: DashboardWidgetPreferencesInput!) {
    updateMyDashboardPreferences(dashboard: $dashboard, input: $input) {
      id
      dashboardPreferences {
        erp {
          hiddenWidgets
          widgetOrder
        }
        admin {
          hiddenWidgets
          widgetOrder
        }
        orgAdmin {
          hiddenWidgets
          widgetOrder
        }
      }
    }
  }
`

// Users
export const GET_USERS = gql`
  query GetUsers($organizationId: ID!, $page: Int, $limit: Int, $search: String) {
    usersByOrganization(
      organizationId: $organizationId
      page: $page
      limit: $limit
      search: $search
    ) {
      users {
        id
        seqNo
        email
        firstName
        lastName
        userType
        roles
        status
        organizationId
        createdAt
      }
      total
      page
      limit
    }
  }
`

export const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      seqNo
      email
      firstName
      lastName
      userType
      roles
      status
      organizationId
      modulePermissions {
        moduleKey
        submoduleKey
        canCreate
        canUpdate
        canDelete
        canView
      }
      createdAt
    }
  }
`

export const SET_USER_MODULE_PERMISSIONS = gql`
  mutation SetUserModulePermissions($userId: ID!, $permissions: [ModulePermissionInput!]!) {
    setUserModulePermissions(userId: $userId, permissions: $permissions) {
      id
      modulePermissions {
        moduleKey
        submoduleKey
        canCreate
        canUpdate
        canDelete
        canView
      }
    }
  }
`

export const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      seqNo
      email
      firstName
      lastName
      status
    }
  }
`

export const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      id
      firstName
      lastName
      status
      currency
    }
  }
`

export const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) {
      id
    }
  }
`

export const GET_ROLES_BY_ORGANIZATION = gql`
  query RolesByOrganization($organizationId: ID!) {
    rolesByOrganization(organizationId: $organizationId) {
      id
      name
      displayName
      description
      isSystemRole
      organizationId
      permissions {
        resource
        actions
      }
    }
  }
`

export const CREATE_ROLE = gql`
  mutation CreateRole($input: CreateRoleInput!) {
    createRole(input: $input) {
      id
      name
      displayName
      isSystemRole
    }
  }
`

export const DELETE_ROLE = gql`
  mutation DeleteRole($id: ID!) {
    deleteRole(id: $id)
  }
`

// Organizations
export const GET_ORGANIZATIONS = gql`
  query GetOrganizations($page: Int, $limit: Int, $search: String) {
    organizations(page: $page, limit: $limit, search: $search) {
      id
      seqNo
      name
      code
      address
      phone
      email
      status
      parentOrganizationId
      allowSubTenants
      packageId
      createdAt
    }
  }
`

export const GET_ORGANIZATION = gql`
  query GetOrganization($id: ID!) {
    organization(id: $id) {
      id
      seqNo
      name
      code
      address
      phone
      email
      status
      parentOrganizationId
      allowSubTenants
      moduleApprovers {
        moduleKey
        approverUserId
        approverUserIds
      }
      createdAt
    }
  }
`

export const SET_ORGANIZATION_MODULE_APPROVERS = gql`
  mutation SetOrganizationModuleApprovers(
    $organizationId: ID!
    $assignments: [OrganizationModuleApproverInput!]!
  ) {
    setOrganizationModuleApprovers(organizationId: $organizationId, assignments: $assignments) {
      id
      moduleApprovers {
        moduleKey
        approverUserId
        approverUserIds
      }
    }
  }
`

export const CREATE_ORGANIZATION = gql`
  mutation CreateOrganization($input: CreateOrganizationInput!) {
    createOrganization(input: $input) {
      id
      name
      code
      status
    }
  }
`

export const CREATE_ORGANIZATION_WITH_ORG_ADMIN = gql`
  mutation CreateOrganizationWithOrgAdmin($input: CreateOrganizationWithOrgAdminInput!) {
    createOrganizationWithOrgAdmin(input: $input) {
      id
      name
      code
      status
    }
  }
`

export const UPDATE_ORGANIZATION = gql`
  mutation UpdateOrganization($id: ID!, $input: UpdateOrganizationInput!) {
    updateOrganization(id: $id, input: $input) {
      id
      name
      status
    }
  }
`

export const DELETE_ORGANIZATION = gql`
  mutation DeleteOrganization($id: ID!) {
    deleteOrganization(id: $id) {
      id
    }
  }
`

// Manual notification compose (super admin → org admins, org admin → org users)
export const SEND_NOTIFICATION = gql`
  mutation SendNotification($input: SendNotificationInput!) {
    sendNotification(input: $input)
  }
`

// Approvals (workflow inbox — see org-admin routing)
export const MY_PENDING_APPROVAL_REQUESTS = gql`
  query MyPendingApprovalRequests {
    myPendingApprovalRequests {
      id
      organizationId
      moduleKey
      entityType
      entityId
      title
      status
      requesterUserId
      requesterDisplayName
      assigneeApproverUserId
      createdAt
      updatedAt
    }
  }
`

export const RESOLVE_APPROVAL_REQUEST = gql`
  mutation ResolveApprovalRequest($id: ID!, $decision: ApprovalDecision!, $note: String) {
    resolveApprovalRequest(id: $id, decision: $decision, note: $note) {
      id
      status
      decidedAt
    }
  }
`

export const MY_APPROVAL_REQUESTS = gql`
  query MyApprovalRequests(
    $status: ApprovalRequestStatus
    $role: ApprovalRequestRole
    $limit: Int
    $skip: Int
  ) {
    myApprovalRequests(status: $status, role: $role, limit: $limit, skip: $skip) {
      id
      organizationId
      moduleKey
      entityType
      entityId
      title
      status
      requesterUserId
      requesterDisplayName
      assigneeApproverUserId
      resolutionNote
      decidedByUserId
      decidedAt
      createdAt
      updatedAt
    }
  }
`

/** Workspace snapshots saved per route (createModuleWorkspaceRecord / approval drafts). */
export const GET_MODULE_WORKSPACE_RECORDS = gql`
  query ModuleWorkspaceRecords($organizationId: ID!, $routePath: String!, $limit: Int) {
    moduleWorkspaceRecords(organizationId: $organizationId, routePath: $routePath, limit: $limit) {
      id
      routePath
      approvalModuleKey
      title
      detail
      snapshot
      status
      createdAt
      updatedAt
    }
  }
`

export const CREATE_MODULE_WORKSPACE_RECORD = gql`
  mutation CreateModuleWorkspaceRecord($input: CreateModuleWorkspaceRecordInput!) {
    createModuleWorkspaceRecord(input: $input) {
      id
      title
      status
      routePath
      approvalModuleKey
      createdAt
    }
  }
`

export const SUBMIT_MODULE_WORKSPACE_RECORD_FOR_APPROVAL = gql`
  mutation SubmitModuleWorkspaceRecordForApproval($id: ID!) {
    submitModuleWorkspaceRecordForApproval(id: $id) {
      id
      title
      status
      updatedAt
    }
  }
`

export const GET_SALES_ENQUIRIES = gql`
  query SalesEnquiries($organizationId: ID!, $page: Int, $limit: Int, $status: String, $search: String) {
    salesEnquiries(organizationId: $organizationId, page: $page, limit: $limit, status: $status, search: $search) {
      id
      enquiryNumber
      subject
      status
      approvalStatus
      approvalRequestedAt
      approvedAt
      approvedBy
      priority
      createdAt
      updatedAt
    }
  }
`

export const SUBMIT_SALES_ENQUIRY_FOR_APPROVAL = gql`
  mutation SubmitSalesEnquiryForApproval($id: ID!) {
    submitSalesEnquiryForApproval(id: $id) {
      id
      enquiryNumber
      subject
      status
      approvalStatus
      approvalRequestedAt
      approvedAt
      approvedBy
    }
  }
`

export const SUBMIT_SALES_ORDER = gql`
  mutation SubmitSalesOrder($id: ID!) {
    submitSalesOrder(id: $id) {
      id
      status
      seqNo
    }
  }
`

export const SUBMIT_QUOTATION_FOR_APPROVAL = gql`
  mutation SubmitQuotationForApproval($id: ID!) {
    submitQuotationForApproval(id: $id) {
      id
      quotationNumber
      status
    }
  }
`

export const SUBMIT_CUSTOMER_INVOICE_FOR_APPROVAL = gql`
  mutation SubmitCustomerInvoiceForApproval($id: ID!) {
    submitCustomerInvoiceForApproval(id: $id) {
      id
      seqNo
      status
    }
  }
`

export const SUBMIT_LEAD_FOR_APPROVAL = gql`
  mutation SubmitLeadForApproval($id: ID!) {
    submitLeadForApproval(id: $id) {
      id
      seqNo
      status
    }
  }
`

export const SUBMIT_PAYROLL_UI_RECORD_FOR_APPROVAL = gql`
  mutation SubmitPayrollUiRecordForApproval($id: ID!) {
    submitPayrollUiRecordForApproval(id: $id) {
      id
      approvalStatus
      category
    }
  }
`

// Items
export const GET_ITEMS = gql`
  query GetItems($organizationId: ID!, $page: Int, $limit: Int, $search: String) {
    items(
      organizationId: $organizationId
      page: $page
      limit: $limit
      search: $search
    ) {
      id
      seqNo
      name
      description
      category
      unit
      rate
      organizationId
      status
      createdAt
    }
  }
`

export const GET_ITEM = gql`
  query GetItem($id: ID!) {
    item(id: $id) {
      id
      seqNo
      name
      description
      category
      unit
      rate
      organizationId
      status
      createdAt
    }
  }
`

export const CREATE_ITEM = gql`
  mutation CreateItem($input: CreateItemInput!) {
    createItem(input: $input) {
      id
      name
      category
      status
    }
  }
`

export const UPDATE_ITEM = gql`
  mutation UpdateItem($id: ID!, $input: UpdateItemInput!) {
    updateItem(id: $id, input: $input) {
      id
      name
      status
    }
  }
`

export const DELETE_ITEM = gql`
  mutation DeleteItem($id: ID!) {
    deleteItem(id: $id) {
      id
    }
  }
`

// Vendors
export const GET_VENDORS = gql`
  query GetVendors($organizationId: ID!, $page: Int, $limit: Int, $search: String) {
    vendors(
      organizationId: $organizationId
      page: $page
      limit: $limit
      search: $search
    ) {
      id
      seqNo
      name
      contactPerson
      email
      phone
      address
      organizationId
      orgApprovalStatus
      status
      createdAt
    }
  }
`

export const GET_VENDOR = gql`
  query GetVendor($id: ID!) {
    vendor(id: $id) {
      id
      seqNo
      name
      contactPerson
      email
      phone
      address
      city
      state
      country
      zipCode
      taxNumber
      paymentTerms
      notes
      organizationId
      orgApprovalStatus
      status
      createdAt
      updatedAt
      createdBy {
        id
        firstName
        lastName
        email
      }
    }
  }
`

export const GET_VENDOR_ELIGIBLE_APPROVERS = gql`
  query VendorEligibleApprovers($organizationId: ID!) {
    vendorEligibleApprovers(organizationId: $organizationId) {
      id
      firstName
      lastName
      email
    }
  }
`

export const GET_VENDOR_APPROVAL_REQUESTS = gql`
  query VendorApprovalRequests($vendorId: ID!, $limit: Int = 50) {
    vendorApprovalRequests(vendorId: $vendorId, limit: $limit) {
      id
      title
      status
      assigneeApproverUserId
      assigneeDisplayName
      requesterDisplayName
      createdAt
      decidedAt
      resolutionNote
      moduleKey
    }
  }
`

export const CREATE_VENDOR = gql`
  mutation CreateVendor($input: CreateVendorInput!) {
    createVendor(input: $input) {
      id
      name
      orgApprovalStatus
      status
    }
  }
`

export const UPDATE_VENDOR = gql`
  mutation UpdateVendor($id: ID!, $input: UpdateVendorInput!) {
    updateVendor(id: $id, input: $input) {
      id
      name
      orgApprovalStatus
      status
    }
  }
`

export const SUBMIT_VENDOR_FOR_APPROVAL = gql`
  mutation SubmitVendorForApproval($id: ID!, $assigneeApproverUserIds: [ID!]) {
    submitVendorForApproval(id: $id, assigneeApproverUserIds: $assigneeApproverUserIds) {
      id
      seqNo
      orgApprovalStatus
      status
    }
  }
`

export const DELETE_VENDOR = gql`
  mutation DeleteVendor($id: ID!) {
    deleteVendor(id: $id)
  }
`

// Projects
export const GET_PROJECTS = gql`
  query GetProjects($organizationId: ID!, $page: Int, $limit: Int, $search: String) {
    projects(
      organizationId: $organizationId
      page: $page
      limit: $limit
      search: $search
    ) {
      id
      seqNo
      name
      description
      startDate
      endDate
      orgApprovalStatus
      status
      organizationId
      createdAt
    }
  }
`

export const GET_PROJECT = gql`
  query GetProject($id: ID!) {
    project(id: $id) {
      id
      seqNo
      name
      description
      startDate
      endDate
      orgApprovalStatus
      status
      organizationId
      createdAt
    }
  }
`

export const CREATE_PROJECT = gql`
  mutation CreateProject($input: CreateProjectInput!) {
    createProject(input: $input) {
      id
      name
      orgApprovalStatus
      status
    }
  }
`

export const SUBMIT_PROJECT_FOR_APPROVAL = gql`
  mutation SubmitProjectForApproval($id: ID!) {
    submitProjectForApproval(id: $id) {
      id
      seqNo
      orgApprovalStatus
      status
    }
  }
`

export const UPDATE_PROJECT = gql`
  mutation UpdateProject($id: ID!, $input: UpdateProjectInput!) {
    updateProject(id: $id, input: $input) {
      id
      name
      orgApprovalStatus
      status
    }
  }
`

export const DELETE_PROJECT = gql`
  mutation DeleteProject($id: ID!) {
    deleteProject(id: $id) {
      id
    }
  }
`

// Purchase Orders
export const GET_PURCHASE_ORDERS = gql`
  query GetPurchaseOrders($organizationId: ID!, $page: Int, $limit: Int, $status: String) {
    purchaseorders(
      organizationId: $organizationId
      page: $page
      limit: $limit
      status: $status
    ) {
      id
      seqNo
      vendorId
      vendorName
      projectId
      projectName
      deliveryDate
      subtotal
      taxAmount
      totalAmount
      status
      orderDate
      items {
        itemDescription
        quantity
        unitPrice
        lineTotal
      }
      notes
      organizationId
      createdAt
    }
  }
`

export const CREATE_PURCHASE_ORDER = gql`
  mutation CreatePurchaseOrder($input: CreatePurchaseOrderInput!) {
    createPurchaseOrder(input: $input) {
      id
      seqNo
      status
      totalAmount
    }
  }
`

export const UPDATE_PURCHASE_ORDER = gql`
  mutation UpdatePurchaseOrder($id: ID!, $input: UpdatePurchaseOrderInput!) {
    updatePurchaseOrder(id: $id, input: $input) {
      id
      seqNo
      status
      totalAmount
    }
  }
`

export const SUBMIT_PURCHASE_ORDER = gql`
  mutation SubmitPurchaseOrder($id: ID!) {
    submitPurchaseOrder(id: $id) {
      id
      status
    }
  }
`

export const APPROVE_PURCHASE_ORDER = gql`
  mutation ApprovePurchaseOrder($id: ID!) {
    approvePurchaseOrder(id: $id) {
      id
      status
    }
  }
`

export const RECEIVE_PURCHASE_ORDER = gql`
  mutation ReceivePurchaseOrder($id: ID!) {
    receivePurchaseOrder(id: $id) {
      id
      status
    }
  }
`

export const BILL_PURCHASE_ORDER = gql`
  mutation BillPurchaseOrder($id: ID!, $billDate: String!, $dueDate: String!) {
    billPurchaseOrder(id: $id, billDate: $billDate, dueDate: $dueDate) {
      id
      billNumber
      status
      totalAmount
    }
  }
`

// Sales Orders
export const GET_SALES_ORDERS = gql`
  query GetSalesOrders(
    $organizationId: ID!
    $page: Int
    $limit: Int
    $status: String
    $cashSale: Boolean
  ) {
    salesorders(
      organizationId: $organizationId
      page: $page
      limit: $limit
      status: $status
      cashSale: $cashSale
    ) {
      id
      seqNo
      quotationId
      quotationStatus
      customerId
      projectId
      totalAmount
      status
      orderDate
      organizationId
      cashSale
      refundedAt
      refundAmount
      createdAt
    }
  }
`

export const GET_SALES_ORDER = gql`
  query GetSalesOrder($id: ID!) {
    salesorder(id: $id) {
      id
      seqNo
      customerId
      projectId
      totalAmount
      status
      orderDate
      organizationId
      createdAt
    }
  }
`

export const CREATE_SALES_ORDER = gql`
  mutation CreateSalesOrder($input: CreateSalesOrderInput!) {
    createSalesOrder(input: $input) {
      id
      seqNo
      status
    }
  }
`

export const UPDATE_SALES_ORDER = gql`
  mutation UpdateSalesOrder($id: ID!, $input: UpdateSalesOrderInput!) {
    updateSalesOrder(id: $id, input: $input) {
      id
      seqNo
      status
    }
  }
`

// Customer Invoices
export const GET_CUSTOMER_INVOICES = gql`
  query GetCustomerInvoices($organizationId: ID!, $page: Int, $limit: Int, $status: String, $customerId: ID) {
    customerinvoices(
      organizationId: $organizationId
      page: $page
      limit: $limit
      status: $status
      customerId: $customerId
    ) {
      id
      seqNo
      customerId
      salesOrderId
      invoiceDate
      dueDate
      totalAmount
      paidAmount
      outstandingAmount
      status
      organizationId
      createdAt
    }
  }
`

export const GET_CUSTOMER_PAYMENTS = gql`
  query GetCustomerPayments($organizationId: ID!, $customerId: ID, $page: Int, $limit: Int) {
    customerPayments(organizationId: $organizationId, customerId: $customerId, page: $page, limit: $limit) {
      id
      paymentNumber
      paymentDate
      paymentMethod
      referenceNumber
      totalAmount
      status
      createdAt
      customer {
        id
        name
        docNumber
      }
    }
  }
`

export const CREATE_CUSTOMER_PAYMENT = gql`
  mutation CreateCustomerPayment($input: CreateCustomerPaymentInput!) {
    createCustomerPayment(input: $input) {
      id
      paymentNumber
      totalAmount
    }
  }
`

export const CREATE_CUSTOMER_INVOICE = gql`
  mutation CreateCustomerInvoice($input: CreateCustomerInvoiceInput!) {
    createCustomerInvoice(input: $input) {
      id
      seqNo
      status
    }
  }
`

// Cash Sales (alias for sales order with immediate payment)
export const CREATE_CASH_SALE = gql`
  mutation CreateCashSale($input: CreateSalesOrderInput!) {
    createSalesOrder(input: $input) {
      id
      seqNo
      status
      totalAmount
      orderDate
      cashSale
    }
  }
`

export const GET_CASH_SALES_REFUND_CANDIDATES = gql`
  query GetCashSalesRefundCandidates($organizationId: ID!) {
    cashSalesRefundCandidates(organizationId: $organizationId) {
      id
      seqNo
      customerId
      totalAmount
      status
      orderDate
      cashSale
    }
  }
`

export const REFUND_CASH_SALE = gql`
  mutation RefundCashSale($input: RefundCashSaleInput!) {
    refundCashSale(input: $input) {
      id
      seqNo
      status
      totalAmount
      refundedAt
      refundAmount
      refundMethod
    }
  }
`

// Credit Memos (update invoice status to cancelled + record credit)
export const UPDATE_CUSTOMER_INVOICE = gql`
  mutation UpdateCustomerInvoice($id: ID!, $input: UpdateCustomerInvoiceInput!) {
    updateCustomerInvoice(id: $id, input: $input) {
      id
      seqNo
      status
      paidAmount
      totalAmount
    }
  }
`

// Attendance
export const GET_ATTENDANCES = gql`
  query GetAttendances($organizationId: ID!, $userId: ID, $page: Int, $limit: Int) {
    attendances(
      organizationId: $organizationId
      userId: $userId
      page: $page
      limit: $limit
    ) {
      id
      userId
      date
      checkIn
      checkOut
      status
      organizationId
      createdAt
    }
  }
`

export const CREATE_ATTENDANCE = gql`
  mutation CreateAttendance($input: CreateAttendanceInput!) {
    createAttendance(input: $input) {
      id
      status
    }
  }
`

// General Ledger
export const GET_GENERAL_LEDGERS = gql`
  query GetGeneralLedgers($organizationId: String!, $fiscalYear: String, $status: String) {
    generalLedgers(organizationId: $organizationId, fiscalYear: $fiscalYear, status: $status) {
      id
      transactionNumber
      transactionDate
      transactionType
      referenceModule
      referenceId
      debitAccount
      creditAccount
      amount
      currency
      description
      fiscalYear
      fiscalPeriod
      status
      createdAt
    }
  }
`

export const GET_CHART_OF_ACCOUNTS = gql`
  query GetChartOfAccounts($organizationId: String!, $accountType: String) {
    chartOfAccounts(organizationId: $organizationId, accountType: $accountType) {
      id
      accountCode
      accountNumber
      accountName
      accountType
      parentAccount
      level
      isActive
      description
      createdAt
    }
  }
`

export const CREATE_GENERAL_LEDGER = gql`
  mutation CreateGeneralLedger($input: GeneralLedgerInput!) {
    createGeneralLedger(input: $input) {
      id
      transactionNumber
      status
    }
  }
`

export const CREATE_CHART_OF_ACCOUNT = gql`
  mutation CreateChartOfAccount($input: ChartOfAccountsInput!) {
    createChartOfAccount(input: $input) {
      id
      accountCode
      accountNumber
      accountName
    }
  }
`

// Cash Bank
export const GET_CASH_BANKS = gql`
  query GetCashBanks(
    $organizationId: String!
    $reconciliationStatus: String
    $bankAccount: String
  ) {
    cashBanks(
      organizationId: $organizationId
      reconciliationStatus: $reconciliationStatus
      bankAccount: $bankAccount
    ) {
      id
      transactionNumber
      transactionDate
      transactionType
      bankAccount
      referenceModule
      referenceId
      amount
      currency
      paymentMethod
      chequeNumber
      description
      reconciliationStatus
      reconciliationDate
      organizationId
      createdAt
    }
  }
`

export const GET_BANK_ACCOUNTS = gql`
  query GetBankAccounts($organizationId: String!) {
    bankAccounts(organizationId: $organizationId) {
      id
      accountNumber
      accountName
      accountHolder
      bankName
      branchName
      accountType
      currency
      currentBalance
      isActive
      organizationId
      createdAt
    }
  }
`

export const CREATE_CASH_BANK = gql`
  mutation CreateCashBank($input: CashBankInput!) {
    createCashBank(input: $input) {
      id
      transactionNumber
    }
  }
`

export const CREATE_BANK_ACCOUNT = gql`
  mutation CreateBankAccount($input: BankAccountInput!) {
    createBankAccount(input: $input) {
      id
      accountNumber
      accountName
      accountHolder
    }
  }
`

export const RECONCILE_CASH_BANK = gql`
  mutation ReconcileCashBank($id: ID!) {
    reconcileCashBank(id: $id) {
      id
      transactionNumber
      reconciliationStatus
      reconciliationDate
    }
  }
`

export const GET_BANK_STATEMENT_LINES = gql`
  query GetBankStatementLines(
    $organizationId: String!
    $bankAccount: String!
    $onlyUnmatched: Boolean
  ) {
    bankStatementLines(organizationId: $organizationId, bankAccount: $bankAccount, onlyUnmatched: $onlyUnmatched) {
      id
      lineDate
      amount
      lineKind
      description
      bankReference
      bankAccount
      organizationId
      isMatched
      matchedCashBankId
      createdAt
    }
  }
`

export const CREATE_BANK_STATEMENT_LINE = gql`
  mutation CreateBankStatementLine($input: BankStatementLineInput!) {
    createBankStatementLine(input: $input) {
      id
      lineDate
      amount
      lineKind
    }
  }
`

export const DELETE_BANK_STATEMENT_LINE = gql`
  mutation DeleteBankStatementLine($id: ID!) {
    deleteBankStatementLine(id: $id)
  }
`

export const MATCH_BANK_STATEMENT_LINE = gql`
  mutation MatchBankStatementLineToBook($bankStatementLineId: ID!, $cashBankId: ID!) {
    matchBankStatementLineToBook(bankStatementLineId: $bankStatementLineId, cashBankId: $cashBankId) {
      id
      isMatched
      matchedCashBankId
    }
  }
`

export const GET_RECONCILIATION_RULES = gql`
  query GetReconciliationRules($organizationId: String!) {
    reconciliationRules(organizationId: $organizationId) {
      id
      name
      organizationId
      bankAccount
      priority
      isActive
      bankLineTextContains
      bookLineTextContains
      amountTolerance
      notes
      createdAt
      updatedAt
    }
  }
`

export const CREATE_RECONCILIATION_RULE = gql`
  mutation CreateReconciliationRule($input: ReconciliationRuleInput!) {
    createReconciliationRule(input: $input) {
      id
      name
      priority
    }
  }
`

export const UPDATE_RECONCILIATION_RULE = gql`
  mutation UpdateReconciliationRule($id: ID!, $input: ReconciliationRulePatch!) {
    updateReconciliationRule(id: $id, input: $input) {
      id
      name
      priority
      isActive
    }
  }
`

export const DELETE_RECONCILIATION_RULE = gql`
  mutation DeleteReconciliationRule($id: ID!) {
    deleteReconciliationRule(id: $id)
  }
`

export const TRANSFER_BANK_FUNDS = gql`
  mutation TransferBankFunds($input: BankTransferInput!) {
    transferBankFunds(input: $input) {
      transferId
      fromCashBankId
      toCashBankId
      fromTransactionNumber
      toTransactionNumber
    }
  }
`

// Inventory Control
export const GET_INVENTORY_CONTROLS = gql`
  query GetInventoryControls($organizationId: String!, $warehouseId: String, $stockStatus: String) {
    inventoryControls(organizationId: $organizationId, warehouseId: $warehouseId, stockStatus: $stockStatus) {
      id
      itemId
      itemName
      binLocation
      quantity
      unit
      minStockLevel
      maxStockLevel
      reorderPoint
      warehouseId
      lastStockDate
      stockStatus
      createdAt
    }
  }
`

export const GET_LOW_STOCK_ITEMS = gql`
  query GetLowStockItems($organizationId: String!) {
    lowStockItems(organizationId: $organizationId) {
      id
      itemId
      itemName
      quantity
      reorderPoint
      stockStatus
    }
  }
`

export const CREATE_INVENTORY_CONTROL = gql`
  mutation CreateInventoryControl($input: InventoryControlInput!) {
    createInventoryControl(input: $input) {
      id
      itemName
      quantity
    }
  }
`

export const UPDATE_INVENTORY_CONTROL = gql`
  mutation UpdateInventoryControl($id: ID!, $input: InventoryControlInput!) {
    updateInventoryControl(id: $id, input: $input) {
      id
      itemName
      quantity
      stockStatus
      lastStockDate
    }
  }
`

export const ADJUST_STOCK = gql`
  mutation AdjustStock($itemId: String!, $binLocation: String!, $quantity: Float!, $reason: String!, $organizationId: String) {
    adjustStock(itemId: $itemId, binLocation: $binLocation, quantity: $quantity, reason: $reason, organizationId: $organizationId) {
      id
      quantity
      stockStatus
    }
  }
`

export const GET_STOCK_MOVEMENTS = gql`
  query GetStockMovements($organizationId: String!, $itemId: String) {
    stockMovements(organizationId: $organizationId, itemId: $itemId) {
      id
      itemId
      movementType
      fromLocation
      toLocation
      quantity
      unit
      referenceModule
      referenceId
      movementDate
      notes
      organizationId
      createdAt
    }
  }
`

// Warehouse
export const GET_WAREHOUSES = gql`
  query GetWarehouses($organizationId: String!, $isActive: Boolean) {
    warehouses(organizationId: $organizationId, isActive: $isActive) {
      id
      warehouseCode
      warehouseName
      location
      address
      capacity
      currentUtilization
      managerName
      contactNumber
      warehouseType
      isActive
      createdAt
    }
  }
`

export const GET_WAREHOUSE_BINS = gql`
  query GetWarehouseBins($organizationId: String!, $warehouseId: String) {
    warehouseBins(organizationId: $organizationId, warehouseId: $warehouseId) {
      id
      warehouseId
      binCode
      binLocation
      binType
      capacity
      currentStock
      isAvailable
      createdAt
    }
  }
`

export const CREATE_WAREHOUSE = gql`
  mutation CreateWarehouse($input: WarehouseInput!) {
    createWarehouse(input: $input) {
      id
      warehouseCode
      warehouseName
      location
      address
      capacity
      currentUtilization
      managerName
      contactNumber
      warehouseType
      isActive
      createdAt
    }
  }
`

export const UPDATE_WAREHOUSE = gql`
  mutation UpdateWarehouse($id: ID!, $input: WarehouseInput!) {
    updateWarehouse(id: $id, input: $input) {
      id
      warehouseCode
      warehouseName
      location
      address
      capacity
      managerName
      contactNumber
      warehouseType
      isActive
    }
  }
`

export const CREATE_WAREHOUSE_BIN = gql`
  mutation CreateWarehouseBin($input: WarehouseBinInput!) {
    createWarehouseBin(input: $input) {
      id
      warehouseId
      binCode
      binLocation
      binType
      capacity
      currentStock
      isAvailable
      createdAt
    }
  }
`

export const UPDATE_WAREHOUSE_BIN = gql`
  mutation UpdateWarehouseBin($id: ID!, $input: WarehouseBinInput!) {
    updateWarehouseBin(id: $id, input: $input) {
      id
      warehouseId
      binCode
      binLocation
      binType
      capacity
      currentStock
      isAvailable
      createdAt
    }
  }
`

// Customer
export const GET_CUSTOMERS = gql`
  query GetCustomers($organizationId: String!) {
    customers(organizationId: $organizationId) {
      id
      docNumber
      name
      contactPerson
      email
      phone
      address
      city
      state
      country
      zipCode
      taxNumber
      paymentTerms
      notes
      status
      invoiceBillable
      createdAt
    }
  }
`

export const CREATE_CUSTOMER = gql`
  mutation CreateCustomer($input: CreateCustomerInput!) {
    createCustomer(input: $input) {
      id
      docNumber
      name
      status
    }
  }
`

export const UPDATE_CUSTOMER = gql`
  mutation UpdateCustomer($id: ID!, $input: UpdateCustomerInput!) {
    updateCustomer(id: $id, input: $input) {
      id
      name
      status
      invoiceBillable
    }
  }
`

export const DELETE_CUSTOMER = gql`
  mutation DeleteCustomer($id: ID!) {
    deleteCustomer(id: $id)
  }
`

// Return authorizations (RMA) — approve / reject workflow
export const GET_RETURN_AUTHORIZATIONS = gql`
  query GetReturnAuthorizations(
    $organizationId: String!
    $status: String
    $customerId: ID
    $receiptComplete: Boolean
    $page: Int
    $limit: Int
  ) {
    returnAuthorizations(
      organizationId: $organizationId
      status: $status
      customerId: $customerId
      receiptComplete: $receiptComplete
      page: $page
      limit: $limit
    ) {
      id
      raNumber
      customerId
      customer {
        id
        name
        docNumber
      }
      reason
      notes
      status
      requestedDate
      lines {
        id
        itemId
        description
        quantity
        quantityReceived
      }
      rejectionReason
      approvedAt
      goodsReceivedAt
      receiptComplete
      receiptNotes
      createdAt
    }
  }
`

export const APPROVE_RETURN_AUTHORIZATION = gql`
  mutation ApproveReturnAuthorization($id: ID!) {
    approveReturnAuthorization(id: $id) {
      id
      raNumber
      status
    }
  }
`

export const REJECT_RETURN_AUTHORIZATION = gql`
  mutation RejectReturnAuthorization($id: ID!, $reason: String) {
    rejectReturnAuthorization(id: $id, reason: $reason) {
      id
      raNumber
      status
    }
  }
`

export const CANCEL_RETURN_AUTHORIZATION = gql`
  mutation CancelReturnAuthorization($id: ID!) {
    cancelReturnAuthorization(id: $id) {
      id
      raNumber
      status
    }
  }
`

export const CREATE_RETURN_AUTHORIZATION = gql`
  mutation CreateReturnAuthorization($input: CreateReturnAuthorizationInput!) {
    createReturnAuthorization(input: $input) {
      id
      raNumber
      customerId
      salesOrderId
      reason
      notes
      status
      requestedDate
      lines {
        id
        itemId
        description
        quantity
        quantityReceived
      }
      createdAt
    }
  }
`

export const RECEIVE_RETURN_AUTHORIZATION_GOODS = gql`
  mutation ReceiveReturnAuthorizationGoods($input: ReceiveReturnAuthorizationGoodsInput!) {
    receiveReturnAuthorizationGoods(input: $input) {
      id
      raNumber
      status
      receiptComplete
      goodsReceivedAt
      receiptNotes
      lines {
        id
        description
        quantity
        quantityReceived
      }
    }
  }
`

// Customer refunds (disbursements; optional link to invoice adjusts paid amount)
export const GET_CUSTOMER_REFUNDS = gql`
  query GetCustomerRefunds($organizationId: ID!, $customerId: ID, $page: Int, $limit: Int) {
    customerRefunds(organizationId: $organizationId, customerId: $customerId, page: $page, limit: $limit) {
      id
      refundNumber
      customerId
      customer {
        id
        name
        docNumber
      }
      refundDate
      refundMethod
      referenceNumber
      amount
      customerInvoiceId
      invoice {
        id
        seqNo
      }
      notes
      status
      createdAt
    }
  }
`

export const CREATE_CUSTOMER_REFUND = gql`
  mutation CreateCustomerRefund($input: CreateCustomerRefundInput!) {
    createCustomerRefund(input: $input) {
      id
      refundNumber
      refundDate
      refundMethod
      amount
      status
      createdAt
    }
  }
`

export const CANCEL_CUSTOMER_REFUND = gql`
  mutation CancelCustomerRefund($id: ID!) {
    cancelCustomerRefund(id: $id) {
      id
      refundNumber
      status
    }
  }
`

// Customer deposits (prepayments / on-account — not applied to invoices here)
export const GET_CUSTOMER_DEPOSITS = gql`
  query GetCustomerDeposits($organizationId: ID!, $customerId: ID, $page: Int, $limit: Int) {
    customerDeposits(organizationId: $organizationId, customerId: $customerId, page: $page, limit: $limit) {
      id
      depositNumber
      customerId
      customer {
        id
        name
        docNumber
      }
      depositDate
      depositMethod
      referenceNumber
      amount
      notes
      status
      createdAt
    }
  }
`

export const CREATE_CUSTOMER_DEPOSIT = gql`
  mutation CreateCustomerDeposit($input: CreateCustomerDepositInput!) {
    createCustomerDeposit(input: $input) {
      id
      depositNumber
      depositDate
      amount
      status
      createdAt
    }
  }
`

export const CANCEL_CUSTOMER_DEPOSIT = gql`
  mutation CancelCustomerDeposit($id: ID!) {
    cancelCustomerDeposit(id: $id) {
      id
      depositNumber
      status
    }
  }
`

// Finance charge assessments (overdue AR — simple annual rate × days / 365)
export const GET_FINANCE_CHARGE_ASSESSMENTS = gql`
  query GetFinanceChargeAssessments($organizationId: String!, $status: String, $page: Int, $limit: Int) {
    financeChargeAssessments(organizationId: $organizationId, status: $status, page: $page, limit: $limit) {
      id
      assessmentNumber
      asOfDate
      annualRatePercent
      status
      totalChargeAmount
      postedAt
      createdAt
    }
  }
`

export const DRAFT_FINANCE_CHARGE_ASSESSMENT = gql`
  mutation DraftFinanceChargeAssessment($input: DraftFinanceChargeAssessmentInput!) {
    draftFinanceChargeAssessment(input: $input) {
      id
      assessmentNumber
      asOfDate
      annualRatePercent
      status
      totalChargeAmount
      lines {
        invoiceId
        invoiceNumber
        customerId
        customer {
          id
          name
          docNumber
        }
        daysOverdue
        outstandingBefore
        chargeAmount
      }
    }
  }
`

export const POST_FINANCE_CHARGE_ASSESSMENT = gql`
  mutation PostFinanceChargeAssessment($id: ID!) {
    postFinanceChargeAssessment(id: $id) {
      id
      assessmentNumber
      status
      postedAt
      totalChargeAmount
    }
  }
`

export const CANCEL_FINANCE_CHARGE_ASSESSMENT = gql`
  mutation CancelFinanceChargeAssessment($id: ID!) {
    cancelFinanceChargeAssessment(id: $id) {
      id
      status
    }
  }
`

// Price lists (generated from active items)
export const GET_PRICE_LISTS = gql`
  query GetPriceLists($organizationId: String!, $page: Int, $limit: Int) {
    priceLists(organizationId: $organizationId, page: $page, limit: $limit) {
      id
      listNumber
      title
      categoryFilter
      lines {
        itemId
        seqNo
        name
        unit
        rate
        category
      }
      generatedAt
      createdAt
    }
  }
`

export const GENERATE_PRICE_LIST = gql`
  mutation GeneratePriceList($input: GeneratePriceListInput!) {
    generatePriceList(input: $input) {
      id
      listNumber
      title
      categoryFilter
      lines {
        itemId
        seqNo
        name
        unit
        rate
        category
      }
      generatedAt
      createdAt
    }
  }
`

// Per-customer negotiated rates (catalog lines + editable customer rate)
export const GET_INDIVIDUAL_PRICE_LIST_BY_CUSTOMER = gql`
  query GetIndividualPriceListByCustomer($organizationId: String!, $customerId: ID!) {
    individualPriceListByCustomer(organizationId: $organizationId, customerId: $customerId) {
      id
      listNumber
      title
      notes
      lines {
        itemId
        seqNo
        name
        unit
        category
        standardRate
        customerRate
      }
      createdAt
      updatedAt
    }
  }
`

export const UPSERT_INDIVIDUAL_PRICE_LIST = gql`
  mutation UpsertIndividualPriceList($input: UpsertIndividualPriceListInput!) {
    upsertIndividualPriceList(input: $input) {
      id
      listNumber
      title
      notes
      lines {
        itemId
        seqNo
        name
        unit
        category
        standardRate
        customerRate
      }
      updatedAt
    }
  }
`

export const SEED_INDIVIDUAL_PRICE_LIST_FROM_CATALOG = gql`
  mutation SeedIndividualPriceListFromCatalog($organizationId: String!, $customerId: ID!) {
    seedIndividualPriceListFromCatalog(organizationId: $organizationId, customerId: $customerId) {
      id
      listNumber
      title
      lines {
        itemId
        seqNo
        name
        unit
        category
        standardRate
        customerRate
      }
      updatedAt
    }
  }
`

// Customer AR statements (period activity + current balance)
export const GENERATE_CUSTOMER_STATEMENT = gql`
  query GenerateCustomerStatement(
    $organizationId: String!
    $customerId: ID!
    $dateFrom: String!
    $dateTo: String!
  ) {
    generateCustomerStatement(
      organizationId: $organizationId
      customerId: $customerId
      dateFrom: $dateFrom
      dateTo: $dateTo
    ) {
      customerId
      customer {
        id
        name
        docNumber
      }
      dateFrom
      dateTo
      periodInvoicesTotal
      periodPaymentsTotal
      currentBalance
      lines {
        date
        kind
        reference
        description
        debit
        credit
      }
    }
  }
`

// Production Planning
export const GET_PRODUCTION_PLANNINGS = gql`
  query GetProductionPlannings($organizationId: String!) {
    productionplannings(organizationId: $organizationId) {
      id
      docNumber
      docDate
      projectId
      managerId
      budget
      actualCost
      progress
      tasks {
        id
        name
        description
        assignedTo
        status
        priority
        startDate
        dueDate
        completedAt
      }
      milestones {
        id
        name
        description
        dueDate
        status
        completedAt
      }
      status
      createdAt
    }
  }
`

export const CREATE_PRODUCTION_PLANNING = gql`
  mutation CreateProductionPlanning($input: ProductionPlanningInput!) {
    createProductionPlanning(input: $input) {
      id
      docNumber
    }
  }
`

export const UPDATE_PRODUCTION_PLANNING = gql`
  mutation UpdateProductionPlanning($id: ID!, $input: ProductionPlanningInput!) {
    updateProductionPlanning(id: $id, input: $input) {
      id
      docNumber
    }
  }
`

export const DELETE_PRODUCTION_PLANNING = gql`
  mutation DeleteProductionPlanning($id: ID!) {
    deleteProductionPlanning(id: $id)
  }
`

// Work Order
export const GET_WORK_ORDERS = gql`
  query GetWorkOrders($organizationId: String!) {
    workorders(organizationId: $organizationId) {
      id
      docNumber
      docDate
      status
      createdAt
    }
  }
`

export const CREATE_WORK_ORDER = gql`
  mutation CreateWorkOrder($input: WorkOrderInput!) {
    createWorkOrder(input: $input) {
      id
      docNumber
    }
  }
`

// Vendor Payment
export const GET_VENDOR_PAYMENTS = gql`
  query GetVendorPayments($organizationId: ID!, $vendorId: ID, $page: Int, $limit: Int) {
    vendorPayments(organizationId: $organizationId, vendorId: $vendorId, page: $page, limit: $limit) {
      id
      paymentNumber
      vendorId
      vendor {
        id
        name
      }
      paymentDate
      paymentMethod
      referenceNumber
      totalAmount
      allocations {
        billId
        amount
      }
      notes
      status
      organizationId
      createdAt
    }
  }
`

export const GET_VENDOR_PAYMENT = gql`
  query GetVendorPayment($id: ID!) {
    vendorPayment(id: $id) {
      id
      paymentNumber
      vendorId
      vendor {
        id
        name
      }
      paymentDate
      paymentMethod
      referenceNumber
      totalAmount
      allocations {
        billId
        billNumber
        amount
      }
      notes
      status
      organizationId
      createdAt
    }
  }
`

export const CREATE_VENDOR_PAYMENT = gql`
  mutation CreateVendorPayment($input: CreateVendorPaymentInput!) {
    createVendorPayment(input: $input) {
      id
      paymentNumber
      status
    }
  }
`

export const UPDATE_VENDOR_PAYMENT = gql`
  mutation UpdateVendorPayment($id: ID!, $input: UpdateVendorPaymentInput!) {
    updateVendorPayment(id: $id, input: $input) {
      id
      paymentNumber
      status
    }
  }
`

export const DELETE_VENDOR_PAYMENT = gql`
  mutation DeleteVendorPayment($id: ID!) {
    deleteVendorPayment(id: $id)
  }
`

// Vendor Bills
export const GET_VENDOR_BILLS = gql`
  query GetVendorBills($organizationId: ID!, $vendorId: ID, $status: String, $page: Int, $limit: Int) {
    vendorBills(organizationId: $organizationId, vendorId: $vendorId, status: $status, page: $page, limit: $limit) {
      id
      billNumber
      vendorId
      vendor {
        id
        name
      }
      billDate
      dueDate
      subtotal
      discountAmount
      taxAmount
      totalAmount
      paidAmount
      outstandingAmount
      notes
      status
      organizationId
      createdAt
    }
  }
`

export const GET_VENDOR_BILL = gql`
  query GetVendorBill($id: ID!) {
    vendorBill(id: $id) {
      id
      billNumber
      vendorId
      vendor {
        id
        name
        email
      }
      purchaseOrderId
      billDate
      dueDate
      lineItems {
        description
        quantity
        unitPrice
        discount
        tax
        total
      }
      subtotal
      discountAmount
      taxAmount
      totalAmount
      paidAmount
      outstandingAmount
      notes
      status
      organizationId
      createdAt
    }
  }
`

export const GET_OUTSTANDING_VENDOR_BILLS = gql`
  query GetOutstandingVendorBills($organizationId: ID!) {
    outstandingVendorBills(organizationId: $organizationId) {
      id
      billNumber
      vendorId
      vendor {
        id
        name
      }
      dueDate
      totalAmount
      paidAmount
      outstandingAmount
      status
    }
  }
`

export const CREATE_VENDOR_BILL = gql`
  mutation CreateVendorBill($input: CreateVendorBillInput!) {
    createVendorBill(input: $input) {
      id
      billNumber
      status
    }
  }
`

export const UPDATE_VENDOR_BILL = gql`
  mutation UpdateVendorBill($id: ID!, $input: UpdateVendorBillInput!) {
    updateVendorBill(id: $id, input: $input) {
      id
      billNumber
      status
    }
  }
`

export const APPROVE_VENDOR_BILL = gql`
  mutation ApproveVendorBill($id: ID!) {
    approveVendorBill(id: $id) {
      id
      billNumber
      status
    }
  }
`

export const SUBMIT_VENDOR_BILL_FOR_APPROVAL = gql`
  mutation SubmitVendorBillForApproval($id: ID!) {
    submitVendorBillForApproval(id: $id) {
      id
      billNumber
      status
    }
  }
`

export const DELETE_VENDOR_BILL = gql`
  mutation DeleteVendorBill($id: ID!) {
    deleteVendorBill(id: $id)
  }
`

// Material Receipt
export const GET_MATERIAL_RECEIPTS = gql`
  query GetMaterialReceipts($organizationId: ID!, $page: Int, $limit: Int, $status: String) {
    materialreceipts(organizationId: $organizationId, page: $page, limit: $limit, status: $status) {
      id
      mrnNumber
      purchaseOrderId
      purchaseOrderNumber
      vendorId
      vendorName
      receiptDate
      warehouseId
      warehouseName
      lineItems {
        itemDescription
        orderedQty
        receivedQty
        rejectedQty
        unit
        unitPrice
        lineTotal
      }
      totalAmount
      status
      notes
      organizationId
      createdAt
      updatedAt
    }
  }
`

export const GET_MATERIAL_RECEIPT = gql`
  query GetMaterialReceipt($id: ID!) {
    materialreceipt(id: $id) {
      id
      mrnNumber
      purchaseOrderId
      purchaseOrderNumber
      vendorId
      vendorName
      receiptDate
      warehouseId
      warehouseName
      lineItems {
        itemId
        itemDescription
        orderedQty
        receivedQty
        rejectedQty
        unit
        unitPrice
        lineTotal
      }
      totalAmount
      status
      notes
      organizationId
      createdAt
      updatedAt
    }
  }
`

export const CREATE_MATERIAL_RECEIPT = gql`
  mutation CreateMaterialReceipt($input: CreateMaterialReceiptInput!) {
    createMaterialReceipt(input: $input) {
      id
      mrnNumber
      status
    }
  }
`

export const UPDATE_MATERIAL_RECEIPT = gql`
  mutation UpdateMaterialReceipt($id: ID!, $input: UpdateMaterialReceiptInput!) {
    updateMaterialReceipt(id: $id, input: $input) {
      id
      mrnNumber
      status
    }
  }
`

export const CONFIRM_MATERIAL_RECEIPT = gql`
  mutation ConfirmMaterialReceipt($id: ID!) {
    confirmMaterialReceipt(id: $id) {
      id
      mrnNumber
      status
    }
  }
`

export const CANCEL_MATERIAL_RECEIPT = gql`
  mutation CancelMaterialReceipt($id: ID!) {
    cancelMaterialReceipt(id: $id) {
      id
      mrnNumber
      status
    }
  }
`

export const SUBMIT_MATERIAL_RECEIPT_FOR_APPROVAL = gql`
  mutation SubmitMaterialReceiptForApproval($id: ID!) {
    submitMaterialReceiptForApproval(id: $id) {
      id
      mrnNumber
      status
    }
  }
`

export const DELETE_MATERIAL_RECEIPT = gql`
  mutation DeleteMaterialReceipt($id: ID!) {
    deleteMaterialReceipt(id: $id)
  }
`

// Goods Receipt
export const GET_GOODS_RECEIPTS = gql`
  query GetGoodsReceipts($organizationId: String!) {
    goodsreceipts(organizationId: $organizationId) {
      id
      docNumber
      docDate
      status
      createdAt
    }
  }
`

export const CREATE_GOODS_RECEIPT = gql`
  mutation CreateGoodsReceipt($input: GoodsReceiptInput!) {
    createGoodsReceipt(input: $input) {
      id
      docNumber
      docDate
      status
      createdAt
    }
  }
`

export const UPDATE_GOODS_RECEIPT = gql`
  mutation UpdateGoodsReceipt($id: ID!, $input: GoodsReceiptInput!) {
    updateGoodsReceipt(id: $id, input: $input) {
      id
      docNumber
      docDate
      status
      createdAt
    }
  }
`

export const DELETE_GOODS_RECEIPT = gql`
  mutation DeleteGoodsReceipt($id: ID!) {
    deleteGoodsReceipt(id: $id)
  }
`

// GRN
export const GET_GRNS = gql`
  query GetGRNs($organizationId: ID!, $page: Int, $limit: Int) {
    grns(organizationId: $organizationId, page: $page, limit: $limit) {
      id
      grnNumber
      purchaseOrderId
      vendorId
      vendorName
      receivedDate
      lineItems {
        itemDescription
        orderedQty
        receivedQty
        unitPrice
      }
      notes
      status
      organizationId
      createdAt
    }
  }
`

export const CREATE_GRN = gql`
  mutation CreateGRN($input: CreateGRNInput!) {
    createGRN(input: $input) {
      id
      grnNumber
      receivedDate
      status
      lineItems {
        itemDescription
        orderedQty
        receivedQty
        unitPrice
      }
    }
  }
`

export const UPDATE_GRN = gql`
  mutation UpdateGRN($id: ID!, $input: UpdateGRNInput!) {
    updateGRN(id: $id, input: $input) {
      id
      grnNumber
      receivedDate
      status
      notes
      lineItems {
        itemDescription
        orderedQty
        receivedQty
        unitPrice
      }
    }
  }
`

export const SUBMIT_GRN_FOR_APPROVAL = gql`
  mutation SubmitGRNForApproval($id: ID!) {
    submitGRNForApproval(id: $id) {
      id
      grnNumber
      status
    }
  }
`

export const DELETE_GRN = gql`
  mutation DeleteGRN($id: ID!) {
    deleteGRN(id: $id)
  }
`

// Delivery Challan
export const GET_DELIVERY_CHALLANS = gql`
  query GetDeliveryChallans($organizationId: String!) {
    deliverychallans(organizationId: $organizationId) {
      id
      docNumber
      docDate
      status
      createdAt
    }
  }
`

export const CREATE_DELIVERY_CHALLAN = gql`
  mutation CreateDeliveryChallan($input: DeliveryChallanInput!) {
    createDeliveryChallan(input: $input) {
      id
      docNumber
      status
    }
  }
`

export const SUBMIT_DELIVERY_CHALLAN_FOR_APPROVAL = gql`
  mutation SubmitDeliveryChallanForApproval($id: ID!) {
    submitDeliveryChallanForApproval(id: $id) {
      id
      docNumber
      status
    }
  }
`

// Sales Return
export const GET_SALES_RETURNS = gql`
  query GetSalesReturns($organizationId: String!) {
    salesreturns(organizationId: $organizationId) {
      id
      docNumber
      docDate
      status
      createdAt
    }
  }
`

export const CREATE_SALES_RETURN = gql`
  mutation CreateSalesReturn($input: SalesReturnInput!) {
    createSalesReturn(input: $input) {
      id
      docNumber
      status
    }
  }
`

export const SUBMIT_SALES_RETURN_FOR_APPROVAL = gql`
  mutation SubmitSalesReturnForApproval($id: ID!) {
    submitSalesReturnForApproval(id: $id) {
      id
      docNumber
      status
    }
  }
`

// Stock Adjustment
export const GET_STOCK_ADJUSTMENTS = gql`
  query GetStockAdjustments($organizationId: ID!, $page: Int, $limit: Int) {
    stockadjustments(organizationId: $organizationId, page: $page, limit: $limit) {
      id
      adjNumber
      adjDate
      warehouseId
      warehouseName
      adjustmentType
      lineItems {
        itemDescription
        currentQty
        adjustedQty
        difference
        unit
      }
      reason
      status
      notes
      organizationId
      createdAt
    }
  }
`

export const CREATE_STOCK_ADJUSTMENT = gql`
  mutation CreateStockAdjustment($input: CreateStockAdjustmentInput!) {
    createStockAdjustment(input: $input) {
      id
      adjNumber
      status
    }
  }
`

export const UPDATE_STOCK_ADJUSTMENT = gql`
  mutation UpdateStockAdjustment($id: ID!, $input: UpdateStockAdjustmentInput!) {
    updateStockAdjustment(id: $id, input: $input) {
      id
      adjNumber
      status
    }
  }
`

export const CONFIRM_STOCK_ADJUSTMENT = gql`
  mutation ConfirmStockAdjustment($id: ID!) {
    confirmStockAdjustment(id: $id) {
      id
      adjNumber
      status
    }
  }
`

export const CANCEL_STOCK_ADJUSTMENT = gql`
  mutation CancelStockAdjustment($id: ID!) {
    cancelStockAdjustment(id: $id) {
      id
      adjNumber
      status
    }
  }
`

export const DELETE_STOCK_ADJUSTMENT = gql`
  mutation DeleteStockAdjustment($id: ID!) {
    deleteStockAdjustment(id: $id)
  }
`

// Stock Transfer
export const GET_STOCK_TRANSFERS = gql`
  query GetStockTransfers($organizationId: ID!, $page: Int, $limit: Int) {
    stocktransfers(organizationId: $organizationId, page: $page, limit: $limit) {
      id
      transferNumber
      transferDate
      fromWarehouseId
      fromWarehouseName
      toWarehouseId
      toWarehouseName
      lineItems {
        itemDescription
        qty
        unit
      }
      status
      notes
      organizationId
      createdAt
    }
  }
`

export const CREATE_STOCK_TRANSFER = gql`
  mutation CreateStockTransfer($input: CreateStockTransferInput!) {
    createStockTransfer(input: $input) {
      id
      transferNumber
      status
    }
  }
`

export const UPDATE_STOCK_TRANSFER = gql`
  mutation UpdateStockTransfer($id: ID!, $input: UpdateStockTransferInput!) {
    updateStockTransfer(id: $id, input: $input) {
      id
      transferNumber
      status
    }
  }
`

export const CONFIRM_STOCK_TRANSFER = gql`
  mutation ConfirmStockTransfer($id: ID!) {
    confirmStockTransfer(id: $id) {
      id
      transferNumber
      status
    }
  }
`

export const CANCEL_STOCK_TRANSFER = gql`
  mutation CancelStockTransfer($id: ID!) {
    cancelStockTransfer(id: $id) {
      id
      transferNumber
      status
    }
  }
`

export const DELETE_STOCK_TRANSFER = gql`
  mutation DeleteStockTransfer($id: ID!) {
    deleteStockTransfer(id: $id)
  }
`

// Fixed assets / equipment masters (Asset module)
export const GET_ASSETS = gql`
  query GetAssets(
    $organizationId: String!
    $page: Int
    $limit: Int
    $status: String
    $assetType: String
  ) {
    assets(
      organizationId: $organizationId
      page: $page
      limit: $limit
      status: $status
      assetType: $assetType
    ) {
      id
      assetNumber
      assetName
      assetType
      category
      purchaseDate
      purchasePrice
      currentValue
      depreciationMethod
      usefulLife
      location
      assignedTo
      status
      serialNumber
      manufacturer
      warrantyExpiry
      organizationId
      createdAt
      updatedAt
    }
  }
`

export const CREATE_ASSET = gql`
  mutation CreateAsset($input: AssetInput!) {
    createAsset(input: $input) {
      id
      assetNumber
      assetName
      status
    }
  }
`

export const UPDATE_ASSET = gql`
  mutation UpdateAsset($id: ID!, $input: AssetInput!) {
    updateAsset(id: $id, input: $input) {
      id
      assetNumber
      assetName
      status
    }
  }
`

export const DELETE_ASSET = gql`
  mutation DeleteAsset($id: ID!) {
    deleteAsset(id: $id)
  }
`

// Intercompany transfer (inventory)
export const GET_INTERCOMPANY_TRANSFERS = gql`
  query GetIntercompanyTransfers($organizationId: ID!, $page: Int, $limit: Int) {
    intercompanyTransfers(organizationId: $organizationId, page: $page, limit: $limit) {
      id
      transferNumber
      transferDate
      fromOrganizationId
      fromOrganizationName
      toOrganizationId
      toOrganizationName
      lineItems {
        itemDescription
        qty
        unit
      }
      status
      notes
      organizationId
      createdAt
    }
  }
`

export const CREATE_INTERCOMPANY_TRANSFER = gql`
  mutation CreateIntercompanyTransfer($input: CreateIntercompanyTransferInput!) {
    createIntercompanyTransfer(input: $input) {
      id
      transferNumber
      status
    }
  }
`

export const UPDATE_INTERCOMPANY_TRANSFER = gql`
  mutation UpdateIntercompanyTransfer($id: ID!, $input: UpdateIntercompanyTransferInput!) {
    updateIntercompanyTransfer(id: $id, input: $input) {
      id
      transferNumber
      status
    }
  }
`

export const CONFIRM_INTERCOMPANY_TRANSFER = gql`
  mutation ConfirmIntercompanyTransfer($id: ID!) {
    confirmIntercompanyTransfer(id: $id) {
      id
      transferNumber
      status
    }
  }
`

export const CANCEL_INTERCOMPANY_TRANSFER = gql`
  mutation CancelIntercompanyTransfer($id: ID!) {
    cancelIntercompanyTransfer(id: $id) {
      id
      transferNumber
      status
    }
  }
`

export const DELETE_INTERCOMPANY_TRANSFER = gql`
  mutation DeleteIntercompanyTransfer($id: ID!) {
    deleteIntercompanyTransfer(id: $id)
  }
`

// Payroll Management
export const GET_PAYROLL_MANAGEMENTS = gql`
  query GetPayrollManagements($organizationId: String!) {
    payrollmanagements(organizationId: $organizationId) {
      id
      docNumber
      docDate
      status
      organizationId
      createdAt
      title
      remarks
      payPeriodStart
      payPeriodEnd
    }
  }
`

export const CREATE_PAYROLL_MANAGEMENT = gql`
  mutation CreatePayrollManagement($input: PayrollManagementInput!) {
    createPayrollManagement(input: $input) {
      id
      docNumber
    }
  }
`

export const UPDATE_PAYROLL_MANAGEMENT = gql`
  mutation UpdatePayrollManagement($id: ID!, $input: PayrollManagementInput!) {
    updatePayrollManagement(id: $id, input: $input) {
      id
      docNumber
    }
  }
`

export const DELETE_PAYROLL_MANAGEMENT = gql`
  mutation DeletePayrollManagement($id: ID!) {
    deletePayrollManagement(id: $id)
  }
`

export const SUBMIT_PAYROLL_MANAGEMENT_FOR_APPROVAL = gql`
  mutation SubmitPayrollManagementForApproval($id: ID!) {
    submitPayrollManagementForApproval(id: $id) {
      id
      docNumber
      status
    }
  }
`

// Salary Processing
export const GET_SALARY_PROCESSINGS = gql`
  query GetSalaryProcessings($organizationId: String!) {
    salaryprocessings(organizationId: $organizationId) {
      id
      docNumber
      docDate
      status
      organizationId
      createdAt
      title
      remarks
      payPeriodStart
      payPeriodEnd
    }
  }
`

export const CREATE_SALARY_PROCESSING = gql`
  mutation CreateSalaryProcessing($input: SalaryProcessingInput!) {
    createSalaryProcessing(input: $input) {
      id
      docNumber
    }
  }
`

export const UPDATE_SALARY_PROCESSING = gql`
  mutation UpdateSalaryProcessing($id: ID!, $input: SalaryProcessingInput!) {
    updateSalaryProcessing(id: $id, input: $input) {
      id
      docNumber
    }
  }
`

export const DELETE_SALARY_PROCESSING = gql`
  mutation DeleteSalaryProcessing($id: ID!) {
    deleteSalaryProcessing(id: $id)
  }
`

// Loan repayment (payroll — others)
export const GET_LOAN_REPAYMENTS = gql`
  query GetLoanRepayments($organizationId: String!) {
    loanrepayments(organizationId: $organizationId) {
      id
      docNumber
      docDate
      status
      organizationId
      createdAt
      title
      remarks
      payPeriodStart
      payPeriodEnd
      employeeNo
      employeeName
      loanReference
      repaymentAmount
    }
  }
`

export const CREATE_LOAN_REPAYMENT = gql`
  mutation CreateLoanRepayment($input: LoanRepaymentInput!) {
    createLoanRepayment(input: $input) {
      id
      docNumber
    }
  }
`

export const UPDATE_LOAN_REPAYMENT = gql`
  mutation UpdateLoanRepayment($id: ID!, $input: LoanRepaymentInput!) {
    updateLoanRepayment(id: $id, input: $input) {
      id
      docNumber
    }
  }
`

export const DELETE_LOAN_REPAYMENT = gql`
  mutation DeleteLoanRepayment($id: ID!) {
    deleteLoanRepayment(id: $id)
  }
`

// Site Locations
export const GET_SITE_LOCATIONS = gql`
  query GetSiteLocations($organizationId: String!) {
    siteLocations(organizationId: $organizationId) {
      id
      seqNo
      name
      address
      city
      state
      country
      zipCode
      contactPerson
      phone
      email
      status
      createdAt
    }
  }
`

export const CREATE_SITE_LOCATION = gql`
  mutation CreateSiteLocation($input: SiteLocationInput!) {
    createSiteLocation(input: $input) {
      id
      seqNo
      name
    }
  }
`

export const UPDATE_SITE_LOCATION = gql`
  mutation UpdateSiteLocation($id: ID!, $input: SiteLocationInput!) {
    updateSiteLocation(id: $id, input: $input) {
      id
      name
    }
  }
`

export const DELETE_SITE_LOCATION = gql`
  mutation DeleteSiteLocation($id: ID!) {
    deleteSiteLocation(id: $id)
  }
`

// Contractors
export const GET_CONTRACTORS = gql`
  query GetContractors($organizationId: String!) {
    contractors(organizationId: $organizationId) {
      id
      seqNo
      name
      contactPerson
      email
      phone
      address
      specialty
      status
      createdAt
    }
  }
`

export const CREATE_CONTRACTOR = gql`
  mutation CreateContractor($input: ContractorInput!) {
    createContractor(input: $input) {
      id
      seqNo
      name
    }
  }
`

export const UPDATE_CONTRACTOR = gql`
  mutation UpdateContractor($id: ID!, $input: ContractorInput!) {
    updateContractor(id: $id, input: $input) {
      id
      name
    }
  }
`

export const DELETE_CONTRACTOR = gql`
  mutation DeleteContractor($id: ID!) {
    deleteContractor(id: $id)
  }
`

// Leads
export const GET_LEADS = gql`
  query GetLeads($organizationId: String!, $status: String) {
    leads(organizationId: $organizationId, status: $status) {
      id
      seqNo
      firstName
      lastName
      company
      title
      email
      phone
      source
      status
      rating
      estimatedValue
      expectedCloseDate
      assignedTo
      notes
      createdAt
    }
  }
`

export const CREATE_LEAD = gql`
  mutation CreateLead($input: LeadInput!) {
    createLead(input: $input) {
      id
      seqNo
    }
  }
`

export const UPDATE_LEAD = gql`
  mutation UpdateLead($id: ID!, $input: LeadInput!) {
    updateLead(id: $id, input: $input) {
      id
    }
  }
`

export const DELETE_LEAD = gql`
  mutation DeleteLead($id: ID!) {
    deleteLead(id: $id)
  }
`

export const CONVERT_LEAD_TO_OPPORTUNITY = gql`
  mutation ConvertLeadToOpportunity($id: ID!) {
    convertLeadToOpportunity(id: $id)
  }
`

// Opportunities
export const GET_OPPORTUNITIES = gql`
  query GetOpportunities($organizationId: String!, $stage: String) {
    opportunities(organizationId: $organizationId, stage: $stage) {
      id
      seqNo
      name
      accountName
      contactName
      email
      phone
      amount
      closeDate
      stage
      probability
      leadSource
      nextStep
      description
      assignedTo
      createdAt
    }
  }
`

export const CREATE_OPPORTUNITY = gql`
  mutation CreateOpportunity($input: OpportunityInput!) {
    createOpportunity(input: $input) {
      id
      seqNo
    }
  }
`

export const UPDATE_OPPORTUNITY = gql`
  mutation UpdateOpportunity($id: ID!, $input: OpportunityInput!) {
    updateOpportunity(id: $id, input: $input) {
      id
    }
  }
`

export const DELETE_OPPORTUNITY = gql`
  mutation DeleteOpportunity($id: ID!) {
    deleteOpportunity(id: $id)
  }
`

// Payroll UI extension records (persist processing / setup / workflow / statutory forms)
export const GET_PAYROLL_UI_RECORDS = gql`
  query GetPayrollUiRecords($organizationId: String!, $category: String!) {
    payrolluirecords(organizationId: $organizationId, category: $category) {
      id
      organizationId
      category
      code
      data
      approvalStatus
      createdAt
      updatedAt
    }
  }
`

export const CREATE_PAYROLL_UI_RECORD = gql`
  mutation CreatePayrollUiRecord($input: PayrollUiRecordInput!) {
    createPayrollUiRecord(input: $input) {
      id
      category
      code
    }
  }
`

export const UPDATE_PAYROLL_UI_RECORD = gql`
  mutation UpdatePayrollUiRecord($id: ID!, $input: PayrollUiRecordInput!) {
    updatePayrollUiRecord(id: $id, input: $input) {
      id
      category
      code
    }
  }
`

export const DELETE_PAYROLL_UI_RECORD = gql`
  mutation DeletePayrollUiRecord($id: ID!) {
    deletePayrollUiRecord(id: $id)
  }
`

// Extraction
export const GET_EXTRACTIONS = gql`
  query GetExtractions($organizationId: String!, $status: String) {
    extractions(organizationId: $organizationId, status: $status) {
      id
      extractionNumber
      extractionDate
      rawMaterialId
      rawMaterialName
      quantity
      unit
      sourceLocation
      extractionType
      status
      createdAt
    }
  }
`

export const CREATE_EXTRACTION = gql`
  mutation CreateExtraction($input: ExtractionInput!) {
    createExtraction(input: $input) {
      id
      extractionNumber
    }
  }
`

// Raw Material Requisition
export const GET_RAW_MATERIAL_REQUISITIONS = gql`
  query GetRawMaterialRequisitions($organizationId: String!, $status: String) {
    rawMaterialRequisitions(organizationId: $organizationId, status: $status) {
      id
      requisitionNumber
      requisitionDate
      requiredDate
      rawMaterialId
      requestedQuantity
      unit
      purpose
      status
      createdAt
    }
  }
`

export const CREATE_RAW_MATERIAL_REQUISITION = gql`
  mutation CreateRawMaterialRequisition($input: RawMaterialRequisitionInput!) {
    createRawMaterialRequisition(input: $input) {
      id
      requisitionNumber
    }
  }
`

// Clients
export const GET_CLIENTS = gql`
  query GetClients($organizationId: ID, $page: Int, $limit: Int, $status: String, $search: String) {
    clients(organizationId: $organizationId, page: $page, limit: $limit, status: $status, search: $search) {
      id
      seqNo
      name
      email
      phone
      company
      address
      city
      state
      country
      zipCode
      website
      industry
      notes
      status
      organizationId
      createdAt
    }
  }
`

export const GET_CLIENT = gql`
  query GetClient($id: ID!) {
    client(id: $id) {
      id
      seqNo
      name
      email
      phone
      company
      address
      city
      state
      country
      zipCode
      website
      industry
      notes
      status
      organizationId
      createdAt
    }
  }
`

export const GET_CLIENTS_BY_ORGANIZATION = gql`
  query GetClientsByOrganization($organizationId: ID!) {
    clientsByOrganization(organizationId: $organizationId) {
      id
      name
      email
      phone
      company
      status
    }
  }
`

export const CREATE_CLIENT = gql`
  mutation CreateClient($input: CreateClientInput!) {
    createClient(input: $input) {
      id
      name
      email
      status
    }
  }
`

export const UPDATE_CLIENT = gql`
  mutation UpdateClient($id: ID!, $input: UpdateClientInput!) {
    updateClient(id: $id, input: $input) {
      id
      name
      email
      status
    }
  }
`

export const DELETE_CLIENT = gql`
  mutation DeleteClient($id: ID!) {
    deleteClient(id: $id)
  }
`

// Quotations
export const GET_QUOTATIONS = gql`
  query GetQuotations {
    quotations {
      id
      seqNo
      quotationNumber
      customerId {
        id
        name
        email
        docNumber
      }
      clientId {
        id
        name
        email
        docNumber
      }
      subject
      quotationDate
      validUntil
      lineItems {
        itemId
        description
        quantity
        unitPrice
        discount
        tax
        total
      }
      subtotal
      taxAmount
      discountAmount
      totalAmount
      terms
      notes
      status
      sentAt
      sentBy
      organizationId
      createdAt
    }
  }
`

export const GET_QUOTATION = gql`
  query GetQuotation($id: ID!) {
    quotation(id: $id) {
      id
      seqNo
      quotationNumber
      customerId {
        id
        name
        email
        docNumber
      }
      clientId {
        id
        name
        email
        docNumber
      }
      subject
      quotationDate
      validUntil
      lineItems {
        itemId
        description
        quantity
        unitPrice
        discount
        tax
        total
      }
      subtotal
      taxAmount
      discountAmount
      totalAmount
      terms
      notes
      status
      sentAt
      sentBy
      organizationId
      createdAt
    }
  }
`

export const GET_QUOTATIONS_BY_ORGANIZATION = gql`
  query GetQuotationsByOrganization($organizationId: ID!) {
    quotationsByOrganization(organizationId: $organizationId) {
      id
      quotationNumber
      customerId {
        id
        name
        email
        docNumber
      }
      clientId {
        id
        name
        email
        docNumber
      }
      subject
      quotationDate
      validUntil
      totalAmount
      status
      sentAt
    }
  }
`

export const GET_QUOTATIONS_BY_CLIENT = gql`
  query GetQuotationsByClient($clientId: ID!) {
    quotationsByClient(clientId: $clientId) {
      id
      quotationNumber
      subject
      quotationDate
      validUntil
      totalAmount
      status
      sentAt
    }
  }
`

export const CREATE_QUOTATION = gql`
  mutation CreateQuotation($input: CreateQuotationInput!) {
    createQuotation(input: $input) {
      id
      quotationNumber
      status
    }
  }
`

export const UPDATE_QUOTATION = gql`
  mutation UpdateQuotation($id: ID!, $input: UpdateQuotationInput!) {
    updateQuotation(id: $id, input: $input) {
      id
      quotationNumber
      status
    }
  }
`

export const DELETE_QUOTATION = gql`
  mutation DeleteQuotation($id: ID!) {
    deleteQuotation(id: $id)
  }
`

export const SEND_QUOTATION = gql`
  mutation SendQuotation($id: ID!) {
    sendQuotation(id: $id) {
      quotation {
        id
        quotationNumber
        status
        sentAt
        sentBy
      }
      emailSent
    }
  }
`

// Products
export const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      seqNo
      name
      sku
      description
      category
      brand
      unit
      price
      costPrice
      taxRate
      minStockLevel
      maxStockLevel
      reorderPoint
      barcode
      status
      organizationId
      createdAt
    }
  }
`

export const GET_PRODUCT = gql`
  query GetProduct($id: ID!) {
    product(id: $id) {
      id
      seqNo
      name
      sku
      description
      category
      brand
      unit
      price
      costPrice
      taxRate
      minStockLevel
      maxStockLevel
      reorderPoint
      barcode
      status
      organizationId
      createdAt
    }
  }
`

export const GET_PRODUCTS_BY_ORGANIZATION = gql`
  query GetProductsByOrganization($organizationId: ID!) {
    productsByOrganization(organizationId: $organizationId) {
      id
      name
      sku
      price
      status
    }
  }
`

export const CREATE_PRODUCT = gql`
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      id
      name
      sku
    }
  }
`

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($id: ID!, $input: UpdateProductInput!) {
    updateProduct(id: $id, input: $input) {
      id
      name
      sku
    }
  }
`

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id)
  }
`

// Vendor Credits
export const GET_VENDOR_CREDITS = gql`
  query GetVendorCredits($organizationId: ID!, $vendorId: ID) {
    vendorCredits(organizationId: $organizationId, vendorId: $vendorId) {
      id
      creditNumber
      vendorId
      vendor { id name }
      creditDate
      totalAmount
      appliedAmount
      remainingAmount
      reason
      notes
      status
      organizationId
      createdAt
    }
  }
`

export const CREATE_VENDOR_CREDIT = gql`
  mutation CreateVendorCredit($input: CreateVendorCreditInput!) {
    createVendorCredit(input: $input) {
      id
      creditNumber
      status
    }
  }
`
export const DELETE_VENDOR_CREDIT = gql`
  mutation DeleteVendorCredit($id: ID!) {
    deleteVendorCredit(id: $id)
  }
`

// Vendor Prepayments
export const GET_VENDOR_PREPAYMENTS = gql`
  query GetVendorPrepayments($organizationId: ID!, $vendorId: ID) {
    vendorPrepayments(organizationId: $organizationId, vendorId: $vendorId) {
      id
      prepaymentNumber
      vendorId
      vendor { id name }
      prepaymentDate
      amount
      appliedAmount
      remainingAmount
      paymentMethod
      referenceNumber
      notes
      status
      organizationId
      createdAt
    }
  }
`

export const CREATE_VENDOR_PREPAYMENT = gql`
  mutation CreateVendorPrepayment($input: CreateVendorPrepaymentInput!) {
    createVendorPrepayment(input: $input) {
      id
      prepaymentNumber
      status
    }
  }
`

export const DELETE_VENDOR_PREPAYMENT = gql`
  mutation DeleteVendorPrepayment($id: ID!) {
    deleteVendorPrepayment(id: $id)
  }
`

// Purchase Orders (extended for Bill PO)
export const GET_PURCHASE_ORDERS_FOR_BILLING = gql`
  query GetPurchaseOrdersForBilling($organizationId: ID!) {
    purchaseorders(organizationId: $organizationId, page: 1, limit: 200) {
      id
      seqNo
      vendorId
      vendorName
      projectId
      projectName
      totalAmount
      status
      orderDate
      organizationId
    }
  }
`

// Journal Entries
export const GET_JOURNAL_ENTRIES = gql`
  query GetJournalEntries($organizationId: String!, $status: String) {
    journalEntries(organizationId: $organizationId, status: $status) {
      id
      seqNo
      entryNumber
      entryDate
      referenceNumber
      description
      lines {
        accountCode
        accountName
        debit
        credit
        description
      }
      totalDebit
      totalCredit
      status
      postedAt
      createdAt
    }
  }
`

export const CREATE_JOURNAL_ENTRY = gql`
  mutation CreateJournalEntry($input: JournalEntryInput!) {
    createJournalEntry(input: $input) {
      id
      seqNo
      entryNumber
    }
  }
`

export const UPDATE_JOURNAL_ENTRY = gql`
  mutation UpdateJournalEntry($id: ID!, $input: JournalEntryInput!) {
    updateJournalEntry(id: $id, input: $input) {
      id
      entryNumber
    }
  }
`

export const POST_JOURNAL_ENTRY = gql`
  mutation PostJournalEntry($id: ID!) {
    postJournalEntry(id: $id) {
      id
      status
      postedAt
    }
  }
`

export const DELETE_JOURNAL_ENTRY = gql`
  mutation DeleteJournalEntry($id: ID!) {
    deleteJournalEntry(id: $id)
  }
`

// Budgets
export const GET_BUDGETS = gql`
  query GetBudgets($organizationId: String!, $fiscalYear: String) {
    budgets(organizationId: $organizationId, fiscalYear: $fiscalYear) {
      id
      seqNo
      budgetName
      fiscalYear
      startDate
      endDate
      lines {
        accountCode
        accountName
        period
        amount
      }
      totalAmount
      status
      createdAt
    }
  }
`

export const CREATE_BUDGET = gql`
  mutation CreateBudget($input: BudgetInput!) {
    createBudget(input: $input) {
      id
      seqNo
      budgetName
    }
  }
`

export const UPDATE_BUDGET = gql`
  mutation UpdateBudget($id: ID!, $input: BudgetInput!) {
    updateBudget(id: $id, input: $input) {
      id
      budgetName
    }
  }
`

export const ACTIVATE_BUDGET = gql`
  mutation ActivateBudget($id: ID!) {
    activateBudget(id: $id) {
      id
      status
    }
  }
`

export const DELETE_BUDGET = gql`
  mutation DeleteBudget($id: ID!) {
    deleteBudget(id: $id)
  }
`

export const UPDATE_CHART_OF_ACCOUNT = gql`
  mutation UpdateChartOfAccount($id: ID!, $input: ChartOfAccountsInput!) {
    updateChartOfAccount(id: $id, input: $input) {
      id
      accountCode
      accountName
    }
  }
`

export const DELETE_CHART_OF_ACCOUNT = gql`
  mutation DeleteChartOfAccount($id: ID!) {
    deleteChartOfAccount(id: $id)
  }
`

// Allocation Schedules
export const GET_ALLOCATION_SCHEDULES = gql`
  query GetAllocationSchedules($organizationId: String!) {
    allocationSchedules(organizationId: $organizationId) {
      id
      seqNo
      scheduleName
      sourceAccount
      allocationMethod
      lines {
        destinationAccount
        percentage
        amount
      }
      isActive
      createdAt
    }
  }
`

export const CREATE_ALLOCATION_SCHEDULE = gql`
  mutation CreateAllocationSchedule($input: AllocationScheduleInput!) {
    createAllocationSchedule(input: $input) {
      id
      seqNo
      scheduleName
    }
  }
`

export const UPDATE_ALLOCATION_SCHEDULE = gql`
  mutation UpdateAllocationSchedule($id: ID!, $input: AllocationScheduleInput!) {
    updateAllocationSchedule(id: $id, input: $input) {
      id
      scheduleName
    }
  }
`

export const DELETE_ALLOCATION_SCHEDULE = gql`
  mutation DeleteAllocationSchedule($id: ID!) {
    deleteAllocationSchedule(id: $id)
  }
`

// Currency Revaluation
export const GET_CURRENCY_REVALUATIONS = gql`
  query GetCurrencyRevaluations($organizationId: String!) {
    currencyRevaluations(organizationId: $organizationId) {
      id
      seqNo
      revaluationDate
      baseCurrency
      lines {
        accountCode
        accountName
        currency
        originalAmount
        revaluedAmount
        gainLoss
      }
      totalGainLoss
      status
      postedAt
      createdAt
    }
  }
`

export const CREATE_CURRENCY_REVALUATION = gql`
  mutation CreateCurrencyRevaluation($input: CurrencyRevaluationInput!) {
    createCurrencyRevaluation(input: $input) {
      id
      seqNo
    }
  }
`

export const POST_CURRENCY_REVALUATION = gql`
  mutation PostCurrencyRevaluation($id: ID!) {
    postCurrencyRevaluation(id: $id) {
      id
      status
      postedAt
    }
  }
`

export const DELETE_CURRENCY_REVALUATION = gql`
  mutation DeleteCurrencyRevaluation($id: ID!) {
    deleteCurrencyRevaluation(id: $id)
  }
`

// Payslip / Payroll calculation engine
export const COMPUTE_PAYROLL_RUN = gql`
  mutation ComputePayrollRun($payrollRunId: ID!) {
    computePayrollRun(payrollRunId: $payrollRunId) {
      id
      employeeCode
      employeeName
      grossEarnings
      totalDeductions
      netPay
      paidDays
      lopDays
    }
  }
`

export const GET_PAYSLIPS_BY_RUN = gql`
  query GetPayslipsByRun($payrollRunId: String!) {
    payslipsByRun(payrollRunId: $payrollRunId) {
      id
      employeeCode
      employeeName
      payPeriodStart
      payPeriodEnd
      workingDays
      paidDays
      lopDays
      grossEarnings
      totalDeductions
      pfEmployee
      esiEmployee
      tds
      netPay
      status
      earnings {
        code
        name
        amount
      }
      deductions {
        code
        name
        amount
      }
    }
  }
`

export const GET_PAYSLIPS_BY_EMPLOYEE = gql`
  query GetPayslipsByEmployee($employeeId: String!) {
    payslipsByEmployee(employeeId: $employeeId) {
      id
      payPeriodStart
      payPeriodEnd
      grossEarnings
      totalDeductions
      netPay
      status
    }
  }
`

// Employee Salary Structure
export const GET_EMPLOYEE_SALARY_STRUCTURES = gql`
  query GetEmployeeSalaryStructures($organizationId: String!) {
    employeeSalaryStructures(organizationId: $organizationId) {
      id
      employeeId
      effectiveFrom
      effectiveTo
      ctcAnnual
      basicMonthly
      status
      components {
        payComponentId
        amount
      }
      statutory {
        pfOptIn
        pfRate
        pfWageCeiling
        esiOptIn
        tdsRegime
        oldRegimeDeductions
        tdsMonthlyOverride
      }
    }
  }
`

export const CREATE_EMPLOYEE_SALARY_STRUCTURE = gql`
  mutation CreateEmployeeSalaryStructure($input: EmployeeSalaryStructureInput!) {
    createEmployeeSalaryStructure(input: $input) {
      id
      employeeId
      basicMonthly
    }
  }
`

export const UPDATE_EMPLOYEE_SALARY_STRUCTURE = gql`
  mutation UpdateEmployeeSalaryStructure($id: ID!, $input: EmployeeSalaryStructureInput!) {
    updateEmployeeSalaryStructure(id: $id, input: $input) {
      id
      basicMonthly
    }
  }
`

export const DELETE_EMPLOYEE_SALARY_STRUCTURE = gql`
  mutation DeleteEmployeeSalaryStructure($id: ID!) {
    deleteEmployeeSalaryStructure(id: $id)
  }
`

// Onboarding
export const GET_ONBOARDINGS = gql`
  query GetOnboardings($organizationId: String!) {
    onboardings(organizationId: $organizationId) {
      id
      employeeId
      startedAt
      expectedCompletionDate
      completedAt
      status
      tasks {
        title
        done
        doneAt
        notes
      }
    }
  }
`
export const CREATE_ONBOARDING = gql`
  mutation CreateOnboarding($input: OnboardingInput!) {
    createOnboarding(input: $input) {
      id
      employeeId
    }
  }
`
export const TOGGLE_ONBOARDING_TASK = gql`
  mutation ToggleOnboardingTask($id: ID!, $index: Int!, $done: Boolean!) {
    toggleOnboardingTask(id: $id, index: $index, done: $done) {
      id
      status
      tasks {
        title
        done
        doneAt
      }
    }
  }
`

// Appraisal
export const GET_APPRAISALS = gql`
  query GetAppraisals($organizationId: String!) {
    appraisals(organizationId: $organizationId) {
      id
      employeeId
      cycle
      periodStart
      periodEnd
      status
      overallRating
      recommendedHikePercent
    }
  }
`
export const CREATE_APPRAISAL = gql`
  mutation CreateAppraisal($input: AppraisalInput!) {
    createAppraisal(input: $input) {
      id
      cycle
    }
  }
`
export const UPDATE_APPRAISAL = gql`
  mutation UpdateAppraisal($id: ID!, $input: AppraisalInput!) {
    updateAppraisal(id: $id, input: $input) {
      id
      status
    }
  }
`
export const TRANSITION_APPRAISAL = gql`
  mutation TransitionAppraisal($id: ID!, $status: String!) {
    transitionAppraisal(id: $id, status: $status) {
      id
      status
    }
  }
`

// Multi-tenancy
export const GET_SUB_TENANTS = gql`
  query GetSubTenants($parentOrganizationId: ID!) {
    subTenants(parentOrganizationId: $parentOrganizationId) {
      id
      name
      code
      email
      phone
      status
      parentOrganizationId
      allowSubTenants
      createdAt
    }
  }
`

export const CREATE_SUB_TENANT_WITH_ADMIN = gql`
  mutation CreateSubTenantWithAdmin($input: CreateOrganizationWithOrgAdminInput!) {
    createSubTenantWithAdmin(input: $input) {
      id
      name
      code
      parentOrganizationId
    }
  }
`

export const UPDATE_ORGANIZATION_ALLOW_SUB_TENANTS = gql`
  mutation UpdateOrganizationAllowSubTenants($id: ID!, $allowSubTenants: Boolean!) {
    updateOrganization(id: $id, input: { allowSubTenants: $allowSubTenants }) {
      id
      allowSubTenants
    }
  }
`

// Packages (platform admin)
export const GET_PACKAGES = gql`
  query GetPackages {
    packages {
      id
      packageName
      externalName
      price
      durationDays
      createdAt
      updatedAt
    }
  }
`

export const CREATE_PACKAGE = gql`
  mutation CreatePackage($input: CreatePackageInput!) {
    createPackage(input: $input) {
      id
      packageName
      externalName
      price
      durationDays
      createdAt
    }
  }
`

export const UPDATE_PACKAGE = gql`
  mutation UpdatePackage($id: ID!, $input: UpdatePackageInput!) {
    updatePackage(id: $id, input: $input) {
      id
      packageName
      externalName
      price
      durationDays
      updatedAt
    }
  }
`

export const GET_PACKAGE_MODULE_ASSIGNMENT = gql`
  query GetPackageModuleAssignment($packageId: ID!, $organizationId: ID!) {
    packageModuleAssignment(packageId: $packageId, organizationId: $organizationId) {
      id
      packageId
      organizationId
      enabledModules {
        moduleKey
        submoduleKey
      }
      updatedAt
      createdAt
    }
  }
`

export const GET_PACKAGE_MODULE_ASSIGNMENTS = gql`
  query GetPackageModuleAssignments($packageId: ID!) {
    packageModuleAssignments(packageId: $packageId) {
      id
      packageId
      organizationId
      organizationName
      enabledModules {
        moduleKey
        submoduleKey
      }
      updatedAt
      createdAt
    }
  }
`

export const SET_PACKAGE_MODULE_ASSIGNMENT = gql`
  mutation SetPackageModuleAssignment(
    $packageId: ID!
    $organizationId: ID!
    $enabledModules: [PackageEnabledModuleInput!]!
  ) {
    setPackageModuleAssignment(
      packageId: $packageId
      organizationId: $organizationId
      enabledModules: $enabledModules
    ) {
      id
      packageId
      organizationId
      enabledModules {
        moduleKey
        submoduleKey
      }
      updatedAt
      createdAt
    }
  }
`

export const DELETE_PACKAGE_MODULE_ASSIGNMENT = gql`
  mutation DeletePackageModuleAssignment($packageId: ID!, $organizationId: ID!) {
    deletePackageModuleAssignment(packageId: $packageId, organizationId: $organizationId)
  }
`
