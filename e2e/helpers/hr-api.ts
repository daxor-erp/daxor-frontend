import type { APIRequestContext } from '@playwright/test'
import { gql } from './graphql-api'

export async function createEmployeeMasterViaApi(
  request: APIRequestContext,
  token: string,
  organizationId: string,
  tag: string,
  userId?: string,
): Promise<{ id: string; employeeCode: string; status: string }> {
  const today = new Date().toISOString().split('T')[0]
  const data = await gql<{
    createEmployeeMaster: { id: string; employeeCode: string; status: string }
  }>(
    request,
    `mutation($input: CreateEmployeeMasterInput!) {
      createEmployeeMaster(input: $input) { id employeeCode status }
    }`,
    {
      input: {
        organizationId,
        userId: userId || undefined,
        firstName: 'E2E',
        lastName: `Emp ${tag.slice(-6)}`,
        dateOfJoining: today,
        designation: 'Engineer',
        department: 'Operations',
        employmentType: 'FULL_TIME',
        basicSalary: 50000,
        currency: 'INR',
        workEmail: `emp.${tag.slice(-8)}@example.com`,
      },
    },
    token,
  )
  return data.createEmployeeMaster
}

export async function createLeaveTypeViaApi(
  request: APIRequestContext,
  token: string,
  organizationId: string,
  tag: string,
): Promise<{ id: string; code: string; name: string }> {
  const code = `AL-${tag.slice(-6)}`.toUpperCase()
  const data = await gql<{ createLeaveType: { id: string; code: string; name: string } }>(
    request,
    `mutation($input: CreateLeaveTypeInput!) {
      createLeaveType(input: $input) { id code name paid defaultDaysPerYear }
    }`,
    {
      input: {
        organizationId,
        code,
        name: `Annual Leave ${tag}`,
        paid: true,
        defaultDaysPerYear: 12,
        allowCarryForward: false,
        active: true,
      },
    },
    token,
  )
  return data.createLeaveType
}

export async function createLeaveEnrollmentViaApi(
  request: APIRequestContext,
  token: string,
  organizationId: string,
  userId: string,
  leaveTypeId: string,
  calendarYear = new Date().getFullYear(),
): Promise<{ id: string; entitledDays: number }> {
  const data = await gql<{
    createLeaveEnrollment: { id: string; entitledDays: number }
  }>(
    request,
    `mutation($input: CreateLeaveEnrollmentInput!) {
      createLeaveEnrollment(input: $input) { id entitledDays usedDays }
    }`,
    {
      input: {
        organizationId,
        userId,
        leaveTypeId,
        calendarYear,
        entitledDays: 12,
        carriedForward: 0,
        notes: 'E2E enrollment',
      },
    },
    token,
  )
  return data.createLeaveEnrollment
}

export async function createLeaveApplicationViaApi(
  request: APIRequestContext,
  token: string,
  organizationId: string,
  userId: string,
  leaveTypeId: string,
): Promise<{ id: string; status: string; totalDays: number }> {
  const start = new Date()
  start.setDate(start.getDate() + 14)
  const end = new Date(start)
  end.setDate(end.getDate() + 1)
  const data = await gql<{
    createLeaveApplication: { id: string; status: string; totalDays: number }
  }>(
    request,
    `mutation($input: CreateLeaveApplicationInput!) {
      createLeaveApplication(input: $input) { id status totalDays startDate endDate }
    }`,
    {
      input: {
        organizationId,
        userId,
        leaveTypeId,
        startDate: start.toISOString().split('T')[0],
        endDate: end.toISOString().split('T')[0],
        reason: 'E2E leave application',
      },
    },
    token,
  )
  return data.createLeaveApplication
}

export async function approveLeaveApplicationViaApi(
  request: APIRequestContext,
  token: string,
  leaveApplicationId: string,
): Promise<{ id: string; status: string }> {
  const data = await gql<{ approveLeaveApplication: { id: string; status: string } }>(
    request,
    `mutation($id: ID!) {
      approveLeaveApplication(id: $id) { id status approvedAt }
    }`,
    { id: leaveApplicationId },
    token,
  )
  return data.approveLeaveApplication
}
