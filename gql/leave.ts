import { gql } from '@apollo/client'

export const GET_LEAVE_TYPES = gql`
  query GetLeaveTypes($organizationId: ID!, $activeOnly: Boolean) {
    leaveTypes(organizationId: $organizationId, activeOnly: $activeOnly) {
      id
      code
      name
      paid
      defaultDaysPerYear
      allowCarryForward
      maxCarryForwardDays
      organizationId
      active
      createdAt
      updatedAt
    }
  }
`

export const CREATE_LEAVE_TYPE = gql`
  mutation CreateLeaveType($input: CreateLeaveTypeInput!) {
    createLeaveType(input: $input) {
      id
      code
      name
    }
  }
`

export const UPDATE_LEAVE_TYPE = gql`
  mutation UpdateLeaveType($id: ID!, $input: UpdateLeaveTypeInput!) {
    updateLeaveType(id: $id, input: $input) {
      id
      code
      name
      active
    }
  }
`

export const DELETE_LEAVE_TYPE = gql`
  mutation DeleteLeaveType($id: ID!) {
    deleteLeaveType(id: $id) {
      id
    }
  }
`

export const GET_LEAVE_ENROLLMENTS = gql`
  query GetLeaveEnrollments($organizationId: ID!, $userId: ID, $calendarYear: Int) {
    leaveEnrollments(organizationId: $organizationId, userId: $userId, calendarYear: $calendarYear) {
      id
      userId
      leaveTypeId
      calendarYear
      entitledDays
      usedDays
      carriedForward
      organizationId
      notes
      createdAt
      updatedAt
    }
  }
`

export const CREATE_LEAVE_ENROLLMENT = gql`
  mutation CreateLeaveEnrollment($input: CreateLeaveEnrollmentInput!) {
    createLeaveEnrollment(input: $input) {
      id
      userId
      leaveTypeId
      calendarYear
      entitledDays
      usedDays
    }
  }
`

export const UPDATE_LEAVE_ENROLLMENT = gql`
  mutation UpdateLeaveEnrollment($id: ID!, $input: UpdateLeaveEnrollmentInput!) {
    updateLeaveEnrollment(id: $id, input: $input) {
      id
      entitledDays
      usedDays
      carriedForward
    }
  }
`

export const DELETE_LEAVE_ENROLLMENT = gql`
  mutation DeleteLeaveEnrollment($id: ID!) {
    deleteLeaveEnrollment(id: $id) {
      id
    }
  }
`

export const GET_LEAVE_APPLICATIONS = gql`
  query GetLeaveApplications($organizationId: ID!, $userId: ID, $status: String) {
    leaveApplications(organizationId: $organizationId, userId: $userId, status: $status) {
      id
      userId
      leaveTypeId
      startDate
      endDate
      totalDays
      reason
      status
      approvedBy
      approvedAt
      rejectedReason
      organizationId
      createdAt
      updatedAt
    }
  }
`

export const CREATE_LEAVE_APPLICATION = gql`
  mutation CreateLeaveApplication($input: CreateLeaveApplicationInput!) {
    createLeaveApplication(input: $input) {
      id
      status
      totalDays
      startDate
      endDate
    }
  }
`

export const UPDATE_LEAVE_APPLICATION = gql`
  mutation UpdateLeaveApplication($id: ID!, $input: UpdateLeaveApplicationInput!) {
    updateLeaveApplication(id: $id, input: $input) {
      id
      status
    }
  }
`

export const APPROVE_LEAVE_APPLICATION = gql`
  mutation ApproveLeaveApplication($id: ID!) {
    approveLeaveApplication(id: $id) {
      id
      status
      approvedAt
    }
  }
`

export const REJECT_LEAVE_APPLICATION = gql`
  mutation RejectLeaveApplication($id: ID!, $reason: String!) {
    rejectLeaveApplication(id: $id, reason: $reason) {
      id
      status
      rejectedReason
    }
  }
`

export const DELETE_LEAVE_APPLICATION = gql`
  mutation DeleteLeaveApplication($id: ID!) {
    deleteLeaveApplication(id: $id) {
      id
    }
  }
`

export const GET_LEAVE_REINSTATEMENTS = gql`
  query GetLeaveReinstatements($organizationId: ID!, $userId: ID, $status: String) {
    leaveReinstatements(organizationId: $organizationId, userId: $userId, status: $status) {
      id
      userId
      leaveTypeId
      calendarYear
      daysRestored
      reason
      leaveApplicationId
      status
      reviewedBy
      reviewedAt
      reviewNotes
      organizationId
      createdAt
      updatedAt
    }
  }
`

export const CREATE_LEAVE_REINSTATEMENT = gql`
  mutation CreateLeaveReinstatement($input: CreateLeaveReinstatementInput!) {
    createLeaveReinstatement(input: $input) {
      id
      status
      daysRestored
    }
  }
`

export const APPROVE_LEAVE_REINSTATEMENT = gql`
  mutation ApproveLeaveReinstatement($id: ID!) {
    approveLeaveReinstatement(id: $id) {
      id
      status
      reviewedAt
    }
  }
`

export const REJECT_LEAVE_REINSTATEMENT = gql`
  mutation RejectLeaveReinstatement($id: ID!, $reviewNotes: String) {
    rejectLeaveReinstatement(id: $id, reviewNotes: $reviewNotes) {
      id
      status
    }
  }
`

export const DELETE_LEAVE_REINSTATEMENT = gql`
  mutation DeleteLeaveReinstatement($id: ID!) {
    deleteLeaveReinstatement(id: $id) {
      id
    }
  }
`
