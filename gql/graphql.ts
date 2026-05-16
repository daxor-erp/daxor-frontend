/* eslint-disable */
import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Address = {
  __typename?: 'Address';
  city: Scalars['String']['output'];
  country: Scalars['String']['output'];
  postalCode: Scalars['String']['output'];
  state: Scalars['String']['output'];
  street: Scalars['String']['output'];
};

export type AddressInput = {
  city: Scalars['String']['input'];
  country: Scalars['String']['input'];
  postalCode: Scalars['String']['input'];
  state: Scalars['String']['input'];
  street: Scalars['String']['input'];
};

export type AllocationLine = {
  __typename?: 'AllocationLine';
  amount?: Maybe<Scalars['Float']['output']>;
  destinationAccount: Scalars['String']['output'];
  percentage: Scalars['Float']['output'];
};

export type AllocationLineInput = {
  amount?: InputMaybe<Scalars['Float']['input']>;
  destinationAccount: Scalars['String']['input'];
  percentage: Scalars['Float']['input'];
};

export type AllocationSchedule = {
  __typename?: 'AllocationSchedule';
  allocationMethod: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  lines: Array<AllocationLine>;
  organizationId: Scalars['String']['output'];
  scheduleName: Scalars['String']['output'];
  seqNo?: Maybe<Scalars['String']['output']>;
  sourceAccount: Scalars['String']['output'];
};

export type AllocationScheduleInput = {
  allocationMethod?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  lines: Array<AllocationLineInput>;
  organizationId: Scalars['String']['input'];
  scheduleName: Scalars['String']['input'];
  sourceAccount: Scalars['String']['input'];
};

export type Applicant = {
  __typename?: 'Applicant';
  address: Address;
  alternatePhone?: Maybe<Scalars['String']['output']>;
  applicantNumber: Scalars['String']['output'];
  applicationStatus: Scalars['String']['output'];
  coverLetterUrl?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  dateOfBirth: Scalars['String']['output'];
  education: Array<Education>;
  email: Scalars['String']['output'];
  experience?: Maybe<Array<Experience>>;
  firstName: Scalars['String']['output'];
  gender: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastName: Scalars['String']['output'];
  nationality: Scalars['String']['output'];
  organizationId: Scalars['String']['output'];
  phone: Scalars['String']['output'];
  resumeUrl?: Maybe<Scalars['String']['output']>;
  skills: Array<Scalars['String']['output']>;
  source: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type ApplicantInput = {
  address: AddressInput;
  alternatePhone?: InputMaybe<Scalars['String']['input']>;
  applicantNumber: Scalars['String']['input'];
  applicationStatus?: InputMaybe<Scalars['String']['input']>;
  coverLetterUrl?: InputMaybe<Scalars['String']['input']>;
  dateOfBirth: Scalars['String']['input'];
  education: Array<EducationInput>;
  email: Scalars['String']['input'];
  experience?: InputMaybe<Array<ExperienceInput>>;
  firstName: Scalars['String']['input'];
  gender: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  nationality: Scalars['String']['input'];
  organizationId: Scalars['String']['input'];
  phone: Scalars['String']['input'];
  resumeUrl?: InputMaybe<Scalars['String']['input']>;
  skills: Array<Scalars['String']['input']>;
  source: Scalars['String']['input'];
};

export type ApprovalDecision =
  | 'APPROVED'
  | 'REJECTED';

export type ApprovalRequest = {
  __typename?: 'ApprovalRequest';
  assigneeApproverUserId: Scalars['ID']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  decidedAt?: Maybe<Scalars['String']['output']>;
  decidedByUserId?: Maybe<Scalars['ID']['output']>;
  entityId: Scalars['ID']['output'];
  entityType: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  moduleKey: Scalars['String']['output'];
  organizationId: Scalars['ID']['output'];
  requesterDisplayName?: Maybe<Scalars['String']['output']>;
  requesterUserId: Scalars['ID']['output'];
  resolutionNote?: Maybe<Scalars['String']['output']>;
  status: ApprovalRequestStatus;
  title: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
};

export type ApprovalRequestStatus =
  | 'APPROVED'
  | 'PENDING'
  | 'REJECTED';

export type Asset = {
  __typename?: 'Asset';
  assetName: Scalars['String']['output'];
  assetNumber: Scalars['String']['output'];
  assetType: Scalars['String']['output'];
  assignedTo?: Maybe<Scalars['String']['output']>;
  category: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  currentValue: Scalars['Float']['output'];
  depreciationMethod: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  location: Scalars['String']['output'];
  manufacturer?: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['String']['output'];
  purchaseDate: Scalars['String']['output'];
  purchasePrice: Scalars['Float']['output'];
  serialNumber?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
  usefulLife: Scalars['Int']['output'];
  warrantyExpiry?: Maybe<Scalars['String']['output']>;
};

export type AssetInput = {
  assetName: Scalars['String']['input'];
  assetNumber: Scalars['String']['input'];
  assetType: Scalars['String']['input'];
  assignedTo?: InputMaybe<Scalars['String']['input']>;
  category: Scalars['String']['input'];
  currentValue: Scalars['Float']['input'];
  depreciationMethod: Scalars['String']['input'];
  location: Scalars['String']['input'];
  manufacturer?: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['String']['input'];
  purchaseDate: Scalars['String']['input'];
  purchasePrice: Scalars['Float']['input'];
  serialNumber?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  usefulLife: Scalars['Int']['input'];
  warrantyExpiry?: InputMaybe<Scalars['String']['input']>;
};

export type Attendance = {
  __typename?: 'Attendance';
  checkIn?: Maybe<Scalars['String']['output']>;
  checkOut?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  date: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  organizationId: Scalars['ID']['output'];
  status: Scalars['String']['output'];
  userId: Scalars['ID']['output'];
};

export type AuthPayload = {
  __typename?: 'AuthPayload';
  token: Scalars['String']['output'];
  user: User;
};

export type BankAccount = {
  __typename?: 'BankAccount';
  accountHolder?: Maybe<Scalars['String']['output']>;
  accountName: Scalars['String']['output'];
  accountNumber: Scalars['String']['output'];
  accountType: Scalars['String']['output'];
  bankName: Scalars['String']['output'];
  branchName: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  currency: Scalars['String']['output'];
  currentBalance: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  organizationId: Scalars['String']['output'];
};

export type BankAccountInput = {
  accountHolder?: InputMaybe<Scalars['String']['input']>;
  accountName: Scalars['String']['input'];
  accountNumber: Scalars['String']['input'];
  accountType: Scalars['String']['input'];
  bankName: Scalars['String']['input'];
  branchName: Scalars['String']['input'];
  currency?: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['String']['input'];
};

export type BankStatementLine = {
  __typename?: 'BankStatementLine';
  amount: Scalars['Float']['output'];
  bankAccount: Scalars['String']['output'];
  bankReference?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isMatched: Scalars['Boolean']['output'];
  lineDate: Scalars['String']['output'];
  lineKind: Scalars['String']['output'];
  matchedCashBankId?: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['String']['output'];
};

export type BankStatementLineInput = {
  amount: Scalars['Float']['input'];
  bankAccount: Scalars['String']['input'];
  bankReference?: InputMaybe<Scalars['String']['input']>;
  description: Scalars['String']['input'];
  lineDate: Scalars['String']['input'];
  lineKind: Scalars['String']['input'];
  organizationId: Scalars['String']['input'];
};

export type BankTransferInput = {
  amount: Scalars['Float']['input'];
  currency?: InputMaybe<Scalars['String']['input']>;
  description: Scalars['String']['input'];
  fromAccountNumber: Scalars['String']['input'];
  organizationId: Scalars['String']['input'];
  paymentMethod?: InputMaybe<Scalars['String']['input']>;
  toAccountNumber: Scalars['String']['input'];
  transferDate: Scalars['String']['input'];
};

export type BankTransferResult = {
  __typename?: 'BankTransferResult';
  fromCashBankId: Scalars['String']['output'];
  fromTransactionNumber: Scalars['String']['output'];
  toCashBankId: Scalars['String']['output'];
  toTransactionNumber: Scalars['String']['output'];
  transferId: Scalars['String']['output'];
};

export type Budget = {
  __typename?: 'Budget';
  budgetName: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  endDate: Scalars['String']['output'];
  fiscalYear: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lines: Array<BudgetLine>;
  organizationId: Scalars['String']['output'];
  seqNo?: Maybe<Scalars['String']['output']>;
  startDate: Scalars['String']['output'];
  status: Scalars['String']['output'];
  totalAmount: Scalars['Float']['output'];
};

export type BudgetInput = {
  budgetName: Scalars['String']['input'];
  endDate: Scalars['String']['input'];
  fiscalYear: Scalars['String']['input'];
  lines: Array<BudgetLineInput>;
  organizationId: Scalars['String']['input'];
  startDate: Scalars['String']['input'];
};

export type BudgetLine = {
  __typename?: 'BudgetLine';
  accountCode: Scalars['String']['output'];
  accountName: Scalars['String']['output'];
  amount: Scalars['Float']['output'];
  period: Scalars['String']['output'];
};

export type BudgetLineInput = {
  accountCode: Scalars['String']['input'];
  accountName: Scalars['String']['input'];
  amount: Scalars['Float']['input'];
  period: Scalars['String']['input'];
};

export type Career = {
  __typename?: 'Career';
  closingDate: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  department: Scalars['String']['output'];
  employmentType: Scalars['String']['output'];
  experienceRequired: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  jobCode: Scalars['String']['output'];
  jobDescription: Scalars['String']['output'];
  jobTitle: Scalars['String']['output'];
  location: Scalars['String']['output'];
  openings: Scalars['Int']['output'];
  organizationId: Scalars['String']['output'];
  postedDate: Scalars['String']['output'];
  qualifications: Scalars['String']['output'];
  responsibilities: Scalars['String']['output'];
  salaryRange: SalaryRange;
  skills: Array<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type CareerInput = {
  closingDate: Scalars['String']['input'];
  department: Scalars['String']['input'];
  employmentType: Scalars['String']['input'];
  experienceRequired: Scalars['String']['input'];
  jobCode: Scalars['String']['input'];
  jobDescription: Scalars['String']['input'];
  jobTitle: Scalars['String']['input'];
  location: Scalars['String']['input'];
  openings: Scalars['Int']['input'];
  organizationId: Scalars['String']['input'];
  postedDate: Scalars['String']['input'];
  qualifications: Scalars['String']['input'];
  responsibilities: Scalars['String']['input'];
  salaryRange: SalaryRangeInput;
  skills: Array<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};

export type CashBank = {
  __typename?: 'CashBank';
  amount: Scalars['Float']['output'];
  bankAccount: Scalars['String']['output'];
  chequeNumber?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  currency: Scalars['String']['output'];
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  organizationId: Scalars['String']['output'];
  paymentMethod: Scalars['String']['output'];
  reconciliationDate?: Maybe<Scalars['String']['output']>;
  reconciliationStatus: Scalars['String']['output'];
  referenceId: Scalars['String']['output'];
  referenceModule: Scalars['String']['output'];
  transactionDate: Scalars['String']['output'];
  transactionNumber: Scalars['String']['output'];
  transactionType: Scalars['String']['output'];
};

export type CashBankInput = {
  amount: Scalars['Float']['input'];
  bankAccount: Scalars['String']['input'];
  chequeNumber?: InputMaybe<Scalars['String']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  description: Scalars['String']['input'];
  organizationId: Scalars['String']['input'];
  paymentMethod: Scalars['String']['input'];
  referenceId: Scalars['String']['input'];
  referenceModule: Scalars['String']['input'];
  transactionDate: Scalars['String']['input'];
  transactionType: Scalars['String']['input'];
};

export type ChartOfAccounts = {
  __typename?: 'ChartOfAccounts';
  accountCode: Scalars['String']['output'];
  accountName: Scalars['String']['output'];
  accountType: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  level: Scalars['Int']['output'];
  organizationId: Scalars['String']['output'];
  parentAccount?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['String']['output'];
};

export type ChartOfAccountsInput = {
  accountCode: Scalars['String']['input'];
  accountName: Scalars['String']['input'];
  accountType: Scalars['String']['input'];
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  level?: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['String']['input'];
  parentAccount?: InputMaybe<Scalars['String']['input']>;
};

export type Client = {
  __typename?: 'Client';
  address?: Maybe<Scalars['String']['output']>;
  city?: Maybe<Scalars['String']['output']>;
  company?: Maybe<Scalars['String']['output']>;
  country?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  industry?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['ID']['output'];
  phone?: Maybe<Scalars['String']['output']>;
  seqNo?: Maybe<Scalars['String']['output']>;
  state?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
  website?: Maybe<Scalars['String']['output']>;
  zipCode?: Maybe<Scalars['String']['output']>;
};

export type ClientRef = {
  __typename?: 'ClientRef';
  email?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type Competency = {
  __typename?: 'Competency';
  competency: Scalars['String']['output'];
  rating: Scalars['Float']['output'];
};

export type CompetencyInput = {
  competency: Scalars['String']['input'];
  rating: Scalars['Float']['input'];
};

export type Contractor = {
  __typename?: 'Contractor';
  address?: Maybe<Scalars['String']['output']>;
  contactPerson?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  email?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  organizationId: Scalars['String']['output'];
  phone?: Maybe<Scalars['String']['output']>;
  seqNo?: Maybe<Scalars['String']['output']>;
  specialty?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
};

export type ContractorInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  contactPerson?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  organizationId: Scalars['String']['input'];
  phone?: InputMaybe<Scalars['String']['input']>;
  specialty?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};

export type CreateAttendanceInput = {
  checkIn?: InputMaybe<Scalars['String']['input']>;
  checkOut?: InputMaybe<Scalars['String']['input']>;
  date: Scalars['String']['input'];
  organizationId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};

export type CreateClientInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  company?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  industry?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['ID']['input'];
  phone?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  website?: InputMaybe<Scalars['String']['input']>;
  zipCode?: InputMaybe<Scalars['String']['input']>;
};

export type CreateCustomerDepositInput = {
  amount: Scalars['Float']['input'];
  customerId: Scalars['ID']['input'];
  depositDate: Scalars['String']['input'];
  depositMethod: Scalars['String']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['ID']['input'];
  referenceNumber?: InputMaybe<Scalars['String']['input']>;
};

export type CreateCustomerInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  contactPerson?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  invoiceBillable?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['String']['input'];
  paymentTerms?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Scalars['String']['input']>;
  taxNumber?: InputMaybe<Scalars['String']['input']>;
  zipCode?: InputMaybe<Scalars['String']['input']>;
};

export type CreateCustomerInvoiceInput = {
  customerId: Scalars['ID']['input'];
  dueDate?: InputMaybe<Scalars['String']['input']>;
  invoiceDate: Scalars['String']['input'];
  organizationId: Scalars['ID']['input'];
  salesOrderId?: InputMaybe<Scalars['ID']['input']>;
  totalAmount: Scalars['Float']['input'];
};

export type CreateCustomerPaymentInput = {
  allocations: Array<CustomerPaymentAllocationInput>;
  customerId: Scalars['ID']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['ID']['input'];
  paymentDate: Scalars['String']['input'];
  paymentMethod: Scalars['String']['input'];
  referenceNumber?: InputMaybe<Scalars['String']['input']>;
  totalAmount: Scalars['Float']['input'];
};

export type CreateCustomerRefundInput = {
  amount: Scalars['Float']['input'];
  customerId: Scalars['ID']['input'];
  customerInvoiceId?: InputMaybe<Scalars['ID']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['ID']['input'];
  referenceNumber?: InputMaybe<Scalars['String']['input']>;
  refundDate: Scalars['String']['input'];
  refundMethod: Scalars['String']['input'];
};

export type CreateGrnInput = {
  lineItems: Array<GrnLineItemInput>;
  notes?: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['ID']['input'];
  purchaseOrderId?: InputMaybe<Scalars['ID']['input']>;
  receivedDate: Scalars['String']['input'];
  /** draft | submitted | approval_declined | confirmed (default draft) */
  status?: InputMaybe<Scalars['String']['input']>;
  vendorId?: InputMaybe<Scalars['ID']['input']>;
  vendorName?: InputMaybe<Scalars['String']['input']>;
};

export type CreateIntercompanyTransferInput = {
  fromOrganizationId: Scalars['ID']['input'];
  fromOrganizationName?: InputMaybe<Scalars['String']['input']>;
  lineItems: Array<IctLineItemInput>;
  notes?: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['ID']['input'];
  toOrganizationId: Scalars['ID']['input'];
  toOrganizationName?: InputMaybe<Scalars['String']['input']>;
  transferDate: Scalars['String']['input'];
};

export type CreateItemInput = {
  category?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  organizationId: Scalars['ID']['input'];
  rate?: InputMaybe<Scalars['Float']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  unit?: InputMaybe<Scalars['String']['input']>;
};

export type CreateLeaveApplicationInput = {
  endDate: Scalars['String']['input'];
  leaveTypeId: Scalars['ID']['input'];
  organizationId: Scalars['ID']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
  startDate: Scalars['String']['input'];
  userId: Scalars['ID']['input'];
};

export type CreateLeaveEnrollmentInput = {
  calendarYear: Scalars['Int']['input'];
  carriedForward?: InputMaybe<Scalars['Float']['input']>;
  entitledDays: Scalars['Float']['input'];
  leaveTypeId: Scalars['ID']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};

export type CreateLeaveReinstatementInput = {
  calendarYear: Scalars['Int']['input'];
  daysRestored: Scalars['Float']['input'];
  leaveApplicationId?: InputMaybe<Scalars['ID']['input']>;
  leaveTypeId: Scalars['ID']['input'];
  organizationId: Scalars['ID']['input'];
  reason: Scalars['String']['input'];
  userId: Scalars['ID']['input'];
};

export type CreateLeaveTypeInput = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  allowCarryForward?: InputMaybe<Scalars['Boolean']['input']>;
  code: Scalars['String']['input'];
  defaultDaysPerYear?: InputMaybe<Scalars['Float']['input']>;
  maxCarryForwardDays?: InputMaybe<Scalars['Float']['input']>;
  name: Scalars['String']['input'];
  organizationId: Scalars['ID']['input'];
  paid?: InputMaybe<Scalars['Boolean']['input']>;
};

export type CreateMaterialReceiptInput = {
  lineItems: Array<MrnLineItemInput>;
  notes?: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['ID']['input'];
  purchaseOrderId?: InputMaybe<Scalars['ID']['input']>;
  purchaseOrderNumber?: InputMaybe<Scalars['String']['input']>;
  receiptDate: Scalars['String']['input'];
  totalAmount: Scalars['Float']['input'];
  vendorId?: InputMaybe<Scalars['ID']['input']>;
  vendorName?: InputMaybe<Scalars['String']['input']>;
  warehouseId?: InputMaybe<Scalars['ID']['input']>;
  warehouseName?: InputMaybe<Scalars['String']['input']>;
};

export type CreateModuleWorkspaceRecordInput = {
  approvalModuleKey: Scalars['String']['input'];
  detail?: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['ID']['input'];
  routePath: Scalars['String']['input'];
  snapshot?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
};

/** Create a tenant organization and its first ORG_ADMIN user (platform admins only). */
export type CreateOrgAdminUserInput = {
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type CreateOrganizationInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  code?: InputMaybe<Scalars['String']['input']>;
  contactPerson?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  phone?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};

export type CreateOrganizationWithOrgAdminInput = {
  orgAdmin: CreateOrgAdminUserInput;
  organization: CreateOrganizationInput;
};

export type CreateProductInput = {
  barcode?: InputMaybe<Scalars['String']['input']>;
  brand?: InputMaybe<Scalars['String']['input']>;
  category?: InputMaybe<Scalars['String']['input']>;
  costPrice?: InputMaybe<Scalars['Float']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  images?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  maxStockLevel?: InputMaybe<Scalars['Float']['input']>;
  minStockLevel?: InputMaybe<Scalars['Float']['input']>;
  name: Scalars['String']['input'];
  organizationId: Scalars['ID']['input'];
  price: Scalars['Float']['input'];
  reorderPoint?: InputMaybe<Scalars['Float']['input']>;
  sku: Scalars['String']['input'];
  status?: InputMaybe<Scalars['String']['input']>;
  taxRate?: InputMaybe<Scalars['Float']['input']>;
  unit: Scalars['String']['input'];
};

export type CreateProjectInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  organizationId: Scalars['ID']['input'];
  startDate?: InputMaybe<Scalars['String']['input']>;
};

export type CreatePurchaseOrderInput = {
  deliveryDate?: InputMaybe<Scalars['String']['input']>;
  items: Array<PoLineItemInput>;
  notes?: InputMaybe<Scalars['String']['input']>;
  orderDate: Scalars['String']['input'];
  organizationId: Scalars['ID']['input'];
  projectId?: InputMaybe<Scalars['ID']['input']>;
  subtotal: Scalars['Float']['input'];
  taxAmount?: InputMaybe<Scalars['Float']['input']>;
  totalAmount: Scalars['Float']['input'];
  vendorId?: InputMaybe<Scalars['ID']['input']>;
};

export type CreateQuotationInput = {
  clientId: Scalars['ID']['input'];
  discountAmount?: InputMaybe<Scalars['Float']['input']>;
  lineItems: Array<QuotationLineItemInput>;
  notes?: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['ID']['input'];
  quotationDate: Scalars['String']['input'];
  quotationNumber?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  subject: Scalars['String']['input'];
  subtotal: Scalars['Float']['input'];
  taxAmount?: InputMaybe<Scalars['Float']['input']>;
  terms?: InputMaybe<Scalars['String']['input']>;
  totalAmount: Scalars['Float']['input'];
  validUntil: Scalars['String']['input'];
};

export type CreateReturnAuthorizationInput = {
  customerId: Scalars['ID']['input'];
  lines: Array<ReturnAuthorizationLineInput>;
  notes?: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['String']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
  requestedDate: Scalars['String']['input'];
  salesOrderId?: InputMaybe<Scalars['ID']['input']>;
};

export type CreateRoleInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  displayName: Scalars['String']['input'];
  name: Scalars['String']['input'];
  organizationId?: InputMaybe<Scalars['ID']['input']>;
  permissions: Array<PermissionInput>;
};

export type CreateSalesEnquiryInput = {
  assignedTo?: InputMaybe<Scalars['ID']['input']>;
  budget?: InputMaybe<Scalars['Float']['input']>;
  clientId?: InputMaybe<Scalars['ID']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  enquirySource?: InputMaybe<Scalars['String']['input']>;
  estimatedEndDate?: InputMaybe<Scalars['String']['input']>;
  estimatedStartDate?: InputMaybe<Scalars['String']['input']>;
  location?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  priority?: InputMaybe<Scalars['String']['input']>;
  projectScope?: InputMaybe<Scalars['String']['input']>;
  projectType?: InputMaybe<Scalars['String']['input']>;
  subject?: InputMaybe<Scalars['String']['input']>;
};

export type CreateSalesOrderInput = {
  customerId: Scalars['ID']['input'];
  orderDate: Scalars['String']['input'];
  organizationId: Scalars['ID']['input'];
  projectId?: InputMaybe<Scalars['ID']['input']>;
  quotationId?: InputMaybe<Scalars['ID']['input']>;
  quotationStatus?: InputMaybe<Scalars['String']['input']>;
  totalAmount: Scalars['Float']['input'];
};

export type CreateSalesQuotationInput = {
  assignedTo?: InputMaybe<Scalars['ID']['input']>;
  clientId: Scalars['ID']['input'];
  currency?: InputMaybe<Scalars['String']['input']>;
  deliveryTerms?: InputMaybe<Scalars['String']['input']>;
  enquiryId?: InputMaybe<Scalars['ID']['input']>;
  items: Array<QuotationItemInput>;
  notes?: InputMaybe<Scalars['String']['input']>;
  paymentTerms?: InputMaybe<Scalars['String']['input']>;
  quotationDate?: InputMaybe<Scalars['String']['input']>;
  subject: Scalars['String']['input'];
  termsAndConditions?: InputMaybe<Scalars['String']['input']>;
  validUntil: Scalars['String']['input'];
};

export type CreateStockAdjustmentInput = {
  adjDate: Scalars['String']['input'];
  adjustmentType: Scalars['String']['input'];
  lineItems: Array<SaLineItemInput>;
  notes?: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['ID']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
  warehouseId?: InputMaybe<Scalars['ID']['input']>;
  warehouseName?: InputMaybe<Scalars['String']['input']>;
};

export type CreateStockTransferInput = {
  fromWarehouseId?: InputMaybe<Scalars['ID']['input']>;
  fromWarehouseName?: InputMaybe<Scalars['String']['input']>;
  lineItems: Array<StLineItemInput>;
  notes?: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['ID']['input'];
  toWarehouseId?: InputMaybe<Scalars['ID']['input']>;
  toWarehouseName?: InputMaybe<Scalars['String']['input']>;
  transferDate: Scalars['String']['input'];
};

export type CreateUserInput = {
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  organizationId: Scalars['ID']['input'];
  password?: InputMaybe<Scalars['String']['input']>;
  roles?: InputMaybe<Array<Scalars['String']['input']>>;
  userType?: InputMaybe<Scalars['String']['input']>;
};

export type CreateVendorBillInput = {
  billDate: Scalars['String']['input'];
  discountAmount?: InputMaybe<Scalars['Float']['input']>;
  dueDate: Scalars['String']['input'];
  lineItems: Array<VendorBillLineItemInput>;
  notes?: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['ID']['input'];
  purchaseOrderId?: InputMaybe<Scalars['ID']['input']>;
  subtotal: Scalars['Float']['input'];
  taxAmount?: InputMaybe<Scalars['Float']['input']>;
  totalAmount: Scalars['Float']['input'];
  vendorId: Scalars['ID']['input'];
};

export type CreateVendorCreditInput = {
  creditDate: Scalars['String']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['ID']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
  totalAmount: Scalars['Float']['input'];
  vendorId: Scalars['ID']['input'];
};

export type CreateVendorInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  contactPerson?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['ID']['input'];
  paymentTerms?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Scalars['String']['input']>;
  taxNumber?: InputMaybe<Scalars['String']['input']>;
  zipCode?: InputMaybe<Scalars['String']['input']>;
};

export type CreateVendorPaymentInput = {
  allocations: Array<VendorPaymentAllocationInput>;
  notes?: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['ID']['input'];
  paymentDate: Scalars['String']['input'];
  paymentMethod: Scalars['String']['input'];
  referenceNumber?: InputMaybe<Scalars['String']['input']>;
  totalAmount: Scalars['Float']['input'];
  vendorId: Scalars['ID']['input'];
};

export type CreateVendorPrepaymentInput = {
  amount: Scalars['Float']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['ID']['input'];
  paymentMethod: Scalars['String']['input'];
  prepaymentDate: Scalars['String']['input'];
  referenceNumber?: InputMaybe<Scalars['String']['input']>;
  vendorId: Scalars['ID']['input'];
};

export type CurrencyRevaluation = {
  __typename?: 'CurrencyRevaluation';
  baseCurrency: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lines: Array<CurrencyRevaluationLine>;
  organizationId: Scalars['String']['output'];
  postedAt?: Maybe<Scalars['String']['output']>;
  revaluationDate: Scalars['String']['output'];
  seqNo?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  totalGainLoss: Scalars['Float']['output'];
};

export type CurrencyRevaluationInput = {
  baseCurrency: Scalars['String']['input'];
  organizationId: Scalars['String']['input'];
  revaluationDate: Scalars['String']['input'];
};

export type CurrencyRevaluationLine = {
  __typename?: 'CurrencyRevaluationLine';
  accountCode: Scalars['String']['output'];
  accountName: Scalars['String']['output'];
  currency: Scalars['String']['output'];
  gainLoss: Scalars['Float']['output'];
  originalAmount: Scalars['Float']['output'];
  revaluedAmount: Scalars['Float']['output'];
};

export type Customer = {
  __typename?: 'Customer';
  address?: Maybe<Scalars['String']['output']>;
  city?: Maybe<Scalars['String']['output']>;
  contactPerson?: Maybe<Scalars['String']['output']>;
  country?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  docNumber: Scalars['String']['output'];
  email?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  invoiceBillable: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['String']['output'];
  paymentTerms?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  state?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  taxNumber?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['String']['output'];
  zipCode?: Maybe<Scalars['String']['output']>;
};

export type CustomerDeposit = {
  __typename?: 'CustomerDeposit';
  amount: Scalars['Float']['output'];
  createdAt: Scalars['String']['output'];
  customer?: Maybe<Customer>;
  customerId: Scalars['ID']['output'];
  depositDate: Scalars['String']['output'];
  depositMethod: Scalars['String']['output'];
  depositNumber: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['ID']['output'];
  referenceNumber?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type CustomerInvoice = {
  __typename?: 'CustomerInvoice';
  createdAt: Scalars['String']['output'];
  customerId: Scalars['ID']['output'];
  dueDate?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  invoiceDate: Scalars['String']['output'];
  organizationId: Scalars['ID']['output'];
  outstandingAmount: Scalars['Float']['output'];
  paidAmount?: Maybe<Scalars['Float']['output']>;
  salesOrderId?: Maybe<Scalars['ID']['output']>;
  seqNo: Scalars['String']['output'];
  status: Scalars['String']['output'];
  totalAmount: Scalars['Float']['output'];
};

export type CustomerPayment = {
  __typename?: 'CustomerPayment';
  allocations: Array<CustomerPaymentAllocation>;
  createdAt: Scalars['String']['output'];
  customer?: Maybe<Customer>;
  customerId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['ID']['output'];
  paymentDate: Scalars['String']['output'];
  paymentMethod: Scalars['String']['output'];
  paymentNumber: Scalars['String']['output'];
  referenceNumber?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  totalAmount: Scalars['Float']['output'];
  updatedAt: Scalars['String']['output'];
};

export type CustomerPaymentAllocation = {
  __typename?: 'CustomerPaymentAllocation';
  amount: Scalars['Float']['output'];
  invoiceId: Scalars['ID']['output'];
  invoiceNumber?: Maybe<Scalars['String']['output']>;
};

export type CustomerPaymentAllocationInput = {
  amount: Scalars['Float']['input'];
  invoiceId: Scalars['ID']['input'];
};

export type CustomerRefund = {
  __typename?: 'CustomerRefund';
  amount: Scalars['Float']['output'];
  createdAt: Scalars['String']['output'];
  customer?: Maybe<Customer>;
  customerId: Scalars['ID']['output'];
  customerInvoiceId?: Maybe<Scalars['ID']['output']>;
  id: Scalars['ID']['output'];
  invoice?: Maybe<CustomerInvoice>;
  notes?: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['ID']['output'];
  referenceNumber?: Maybe<Scalars['String']['output']>;
  refundDate: Scalars['String']['output'];
  refundMethod: Scalars['String']['output'];
  refundNumber: Scalars['String']['output'];
  status: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type CustomerStatement = {
  __typename?: 'CustomerStatement';
  currentBalance: Scalars['Float']['output'];
  customer?: Maybe<Customer>;
  customerId: Scalars['ID']['output'];
  dateFrom: Scalars['String']['output'];
  dateTo: Scalars['String']['output'];
  lines: Array<CustomerStatementLine>;
  periodInvoicesTotal: Scalars['Float']['output'];
  periodPaymentsTotal: Scalars['Float']['output'];
};

export type CustomerStatementLine = {
  __typename?: 'CustomerStatementLine';
  credit?: Maybe<Scalars['Float']['output']>;
  date: Scalars['String']['output'];
  debit?: Maybe<Scalars['Float']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  kind: Scalars['String']['output'];
  reference: Scalars['String']['output'];
};

export type Dvs = {
  __typename?: 'DVS';
  applicantId: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  documentName: Scalars['String']['output'];
  documentNumber?: Maybe<Scalars['String']['output']>;
  documentType: Scalars['String']['output'];
  documentUrl?: Maybe<Scalars['String']['output']>;
  expiryDate?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  issueDate?: Maybe<Scalars['String']['output']>;
  issuingAuthority?: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
  verificationDate?: Maybe<Scalars['String']['output']>;
  verificationNotes?: Maybe<Scalars['String']['output']>;
  verificationStatus: Scalars['String']['output'];
  verifiedBy?: Maybe<Scalars['String']['output']>;
};

export type DvsInput = {
  applicantId: Scalars['String']['input'];
  documentName: Scalars['String']['input'];
  documentNumber?: InputMaybe<Scalars['String']['input']>;
  documentType: Scalars['String']['input'];
  documentUrl?: InputMaybe<Scalars['String']['input']>;
  expiryDate?: InputMaybe<Scalars['String']['input']>;
  issueDate?: InputMaybe<Scalars['String']['input']>;
  issuingAuthority?: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['String']['input'];
  verificationNotes?: InputMaybe<Scalars['String']['input']>;
  verificationStatus?: InputMaybe<Scalars['String']['input']>;
};

export type DeliveryChallan = {
  __typename?: 'DeliveryChallan';
  createdAt: Scalars['String']['output'];
  docDate: Scalars['String']['output'];
  docNumber: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  organizationId: Scalars['String']['output'];
  status: Scalars['String']['output'];
};

export type DeliveryChallanInput = {
  docDate: Scalars['String']['input'];
  organizationId: Scalars['String']['input'];
  status?: InputMaybe<Scalars['String']['input']>;
};

export type DraftFinanceChargeAssessmentInput = {
  annualRatePercent: Scalars['Float']['input'];
  asOfDate: Scalars['String']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['String']['input'];
};

export type Epm = {
  __typename?: 'EPM';
  areasOfImprovement?: Maybe<Scalars['String']['output']>;
  comments?: Maybe<Scalars['String']['output']>;
  competencies: Array<Competency>;
  createdAt: Scalars['String']['output'];
  employeeId: Scalars['String']['output'];
  goals: Array<Goal>;
  id: Scalars['ID']['output'];
  organizationId: Scalars['String']['output'];
  overallRating: Scalars['Float']['output'];
  reviewDate: Scalars['String']['output'];
  reviewPeriod: Scalars['String']['output'];
  reviewType: Scalars['String']['output'];
  reviewYear: Scalars['Int']['output'];
  reviewerId: Scalars['String']['output'];
  status: Scalars['String']['output'];
  strengths?: Maybe<Scalars['String']['output']>;
  trainingRecommendations?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['String']['output'];
};

export type EpmInput = {
  areasOfImprovement?: InputMaybe<Scalars['String']['input']>;
  comments?: InputMaybe<Scalars['String']['input']>;
  competencies: Array<CompetencyInput>;
  employeeId: Scalars['String']['input'];
  goals: Array<GoalInput>;
  organizationId: Scalars['String']['input'];
  overallRating: Scalars['Float']['input'];
  reviewDate: Scalars['String']['input'];
  reviewPeriod: Scalars['String']['input'];
  reviewType: Scalars['String']['input'];
  reviewYear: Scalars['Int']['input'];
  status?: InputMaybe<Scalars['String']['input']>;
  strengths?: InputMaybe<Scalars['String']['input']>;
  trainingRecommendations?: InputMaybe<Scalars['String']['input']>;
};

export type Education = {
  __typename?: 'Education';
  degree: Scalars['String']['output'];
  grade?: Maybe<Scalars['String']['output']>;
  institution: Scalars['String']['output'];
  year: Scalars['Int']['output'];
};

export type EducationInput = {
  degree: Scalars['String']['input'];
  grade?: InputMaybe<Scalars['String']['input']>;
  institution: Scalars['String']['input'];
  year: Scalars['Int']['input'];
};

export type ExciseInvoice = {
  __typename?: 'ExciseInvoice';
  createdAt: Scalars['String']['output'];
  docDate: Scalars['String']['output'];
  docNumber: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  organizationId: Scalars['String']['output'];
  status: Scalars['String']['output'];
};

export type ExciseInvoiceInput = {
  docDate: Scalars['String']['input'];
  organizationId: Scalars['String']['input'];
  status?: InputMaybe<Scalars['String']['input']>;
};

export type Experience = {
  __typename?: 'Experience';
  company: Scalars['String']['output'];
  current: Scalars['Boolean']['output'];
  from: Scalars['String']['output'];
  position: Scalars['String']['output'];
  to?: Maybe<Scalars['String']['output']>;
};

export type ExperienceInput = {
  company: Scalars['String']['input'];
  current?: InputMaybe<Scalars['Boolean']['input']>;
  from: Scalars['String']['input'];
  position: Scalars['String']['input'];
  to?: InputMaybe<Scalars['String']['input']>;
};

export type Extraction = {
  __typename?: 'Extraction';
  createdAt: Scalars['String']['output'];
  createdBy: Scalars['String']['output'];
  destinationLocation?: Maybe<Scalars['String']['output']>;
  extractionDate: Scalars['String']['output'];
  extractionNumber: Scalars['String']['output'];
  extractionType: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['String']['output'];
  productionOrderId?: Maybe<Scalars['String']['output']>;
  quantity: Scalars['Float']['output'];
  rawMaterialId: Scalars['String']['output'];
  rawMaterialName: Scalars['String']['output'];
  requisitionId?: Maybe<Scalars['String']['output']>;
  sourceLocation: Scalars['String']['output'];
  status: Scalars['String']['output'];
  unit: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type ExtractionInput = {
  destinationLocation?: InputMaybe<Scalars['String']['input']>;
  extractionDate: Scalars['String']['input'];
  extractionNumber: Scalars['String']['input'];
  extractionType: Scalars['String']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['String']['input'];
  productionOrderId?: InputMaybe<Scalars['String']['input']>;
  quantity: Scalars['Float']['input'];
  rawMaterialId: Scalars['String']['input'];
  rawMaterialName: Scalars['String']['input'];
  requisitionId?: InputMaybe<Scalars['String']['input']>;
  sourceLocation: Scalars['String']['input'];
  status?: InputMaybe<Scalars['String']['input']>;
  unit: Scalars['String']['input'];
};

export type FinanceChargeAssessment = {
  __typename?: 'FinanceChargeAssessment';
  annualRatePercent: Scalars['Float']['output'];
  asOfDate: Scalars['String']['output'];
  assessmentNumber: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lines: Array<FinanceChargeLine>;
  notes?: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['String']['output'];
  postedAt?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  totalChargeAmount: Scalars['Float']['output'];
  updatedAt: Scalars['String']['output'];
};

export type FinanceChargeLine = {
  __typename?: 'FinanceChargeLine';
  chargeAmount: Scalars['Float']['output'];
  customer?: Maybe<Customer>;
  customerId: Scalars['ID']['output'];
  daysOverdue: Scalars['Int']['output'];
  invoiceId: Scalars['ID']['output'];
  invoiceNumber?: Maybe<Scalars['String']['output']>;
  outstandingBefore: Scalars['Float']['output'];
};

export type Grn = {
  __typename?: 'GRN';
  createdAt?: Maybe<Scalars['String']['output']>;
  grnNumber: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lineItems: Array<GrnLineItem>;
  notes?: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['ID']['output'];
  purchaseOrderId?: Maybe<Scalars['ID']['output']>;
  receivedDate: Scalars['String']['output'];
  status: Scalars['String']['output'];
  vendorId?: Maybe<Scalars['ID']['output']>;
  vendorName?: Maybe<Scalars['String']['output']>;
};

export type GrnLineItem = {
  __typename?: 'GRNLineItem';
  itemDescription: Scalars['String']['output'];
  orderedQty: Scalars['Float']['output'];
  receivedQty: Scalars['Float']['output'];
  unitPrice?: Maybe<Scalars['Float']['output']>;
};

export type GrnLineItemInput = {
  itemDescription: Scalars['String']['input'];
  orderedQty: Scalars['Float']['input'];
  receivedQty: Scalars['Float']['input'];
  unitPrice?: InputMaybe<Scalars['Float']['input']>;
};

export type GeneralLedger = {
  __typename?: 'GeneralLedger';
  amount: Scalars['Float']['output'];
  createdAt: Scalars['String']['output'];
  createdBy: Scalars['String']['output'];
  creditAccount: Scalars['String']['output'];
  currency: Scalars['String']['output'];
  debitAccount: Scalars['String']['output'];
  description: Scalars['String']['output'];
  fiscalPeriod: Scalars['String']['output'];
  fiscalYear: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  organizationId: Scalars['String']['output'];
  referenceId: Scalars['String']['output'];
  referenceModule: Scalars['String']['output'];
  status: Scalars['String']['output'];
  transactionDate: Scalars['String']['output'];
  transactionNumber: Scalars['String']['output'];
  transactionType: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type GeneralLedgerInput = {
  amount: Scalars['Float']['input'];
  creditAccount: Scalars['String']['input'];
  currency?: InputMaybe<Scalars['String']['input']>;
  debitAccount: Scalars['String']['input'];
  description: Scalars['String']['input'];
  fiscalPeriod: Scalars['String']['input'];
  fiscalYear: Scalars['String']['input'];
  organizationId: Scalars['String']['input'];
  referenceId: Scalars['String']['input'];
  referenceModule: Scalars['String']['input'];
  transactionDate: Scalars['String']['input'];
  transactionType: Scalars['String']['input'];
};

export type GeneratePriceListInput = {
  category?: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['String']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
};

export type Goal = {
  __typename?: 'Goal';
  achievement?: Maybe<Scalars['Float']['output']>;
  goal: Scalars['String']['output'];
  weight: Scalars['Float']['output'];
};

export type GoalInput = {
  achievement?: InputMaybe<Scalars['Float']['input']>;
  goal: Scalars['String']['input'];
  weight: Scalars['Float']['input'];
};

export type GoodsReceipt = {
  __typename?: 'GoodsReceipt';
  createdAt: Scalars['String']['output'];
  docDate: Scalars['String']['output'];
  docNumber: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  organizationId: Scalars['String']['output'];
  status: Scalars['String']['output'];
};

export type GoodsReceiptInput = {
  docDate: Scalars['String']['input'];
  organizationId: Scalars['String']['input'];
  status?: InputMaybe<Scalars['String']['input']>;
};

export type IctLineItem = {
  __typename?: 'ICTLineItem';
  itemDescription: Scalars['String']['output'];
  qty: Scalars['Float']['output'];
  unit?: Maybe<Scalars['String']['output']>;
};

export type IctLineItemInput = {
  itemDescription: Scalars['String']['input'];
  qty: Scalars['Float']['input'];
  unit?: InputMaybe<Scalars['String']['input']>;
};

export type IpInspection = {
  __typename?: 'IPInspection';
  createdAt: Scalars['String']['output'];
  docDate: Scalars['String']['output'];
  docNumber: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  organizationId: Scalars['String']['output'];
  status: Scalars['String']['output'];
};

export type IpInspectionInput = {
  docDate: Scalars['String']['input'];
  organizationId: Scalars['String']['input'];
  status?: InputMaybe<Scalars['String']['input']>;
};

export type IndividualPriceList = {
  __typename?: 'IndividualPriceList';
  createdAt: Scalars['String']['output'];
  customer?: Maybe<Customer>;
  customerId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  lines: Array<IndividualPriceListLine>;
  listNumber: Scalars['String']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['String']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type IndividualPriceListLine = {
  __typename?: 'IndividualPriceListLine';
  category?: Maybe<Scalars['String']['output']>;
  customerRate?: Maybe<Scalars['Float']['output']>;
  itemId: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  seqNo?: Maybe<Scalars['String']['output']>;
  standardRate?: Maybe<Scalars['Float']['output']>;
  unit?: Maybe<Scalars['String']['output']>;
};

export type IndividualPriceListLineInput = {
  category?: InputMaybe<Scalars['String']['input']>;
  customerRate?: InputMaybe<Scalars['Float']['input']>;
  itemId: Scalars['ID']['input'];
  name: Scalars['String']['input'];
  seqNo?: InputMaybe<Scalars['String']['input']>;
  standardRate?: InputMaybe<Scalars['Float']['input']>;
  unit?: InputMaybe<Scalars['String']['input']>;
};

export type IntercompanyTransfer = {
  __typename?: 'IntercompanyTransfer';
  createdAt?: Maybe<Scalars['String']['output']>;
  fromOrganizationId: Scalars['ID']['output'];
  fromOrganizationName?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  lineItems: Array<IctLineItem>;
  notes?: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['ID']['output'];
  status: Scalars['String']['output'];
  toOrganizationId: Scalars['ID']['output'];
  toOrganizationName?: Maybe<Scalars['String']['output']>;
  transferDate: Scalars['String']['output'];
  transferNumber: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
};

export type InternalOrder = {
  __typename?: 'InternalOrder';
  createdAt: Scalars['String']['output'];
  docDate: Scalars['String']['output'];
  docNumber: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  organizationId: Scalars['String']['output'];
  status: Scalars['String']['output'];
};

export type InternalOrderInput = {
  docDate: Scalars['String']['input'];
  organizationId: Scalars['String']['input'];
  status?: InputMaybe<Scalars['String']['input']>;
};

export type InventoryControl = {
  __typename?: 'InventoryControl';
  binLocation: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  itemId: Scalars['String']['output'];
  itemName: Scalars['String']['output'];
  lastStockDate: Scalars['String']['output'];
  maxStockLevel: Scalars['Float']['output'];
  minStockLevel: Scalars['Float']['output'];
  organizationId: Scalars['String']['output'];
  quantity: Scalars['Float']['output'];
  reorderPoint: Scalars['Float']['output'];
  stockStatus: Scalars['String']['output'];
  unit: Scalars['String']['output'];
  warehouseId: Scalars['String']['output'];
};

export type InventoryControlInput = {
  binLocation: Scalars['String']['input'];
  itemId: Scalars['String']['input'];
  itemName: Scalars['String']['input'];
  maxStockLevel?: InputMaybe<Scalars['Float']['input']>;
  minStockLevel?: InputMaybe<Scalars['Float']['input']>;
  organizationId: Scalars['String']['input'];
  quantity: Scalars['Float']['input'];
  reorderPoint?: InputMaybe<Scalars['Float']['input']>;
  unit: Scalars['String']['input'];
  warehouseId: Scalars['String']['input'];
};

export type InventoryReturn = {
  __typename?: 'InventoryReturn';
  createdAt: Scalars['String']['output'];
  docDate: Scalars['String']['output'];
  docNumber: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  organizationId: Scalars['String']['output'];
  status: Scalars['String']['output'];
};

export type InventoryReturnInput = {
  docDate: Scalars['String']['input'];
  organizationId: Scalars['String']['input'];
  status?: InputMaybe<Scalars['String']['input']>;
};

export type Item = {
  __typename?: 'Item';
  category?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  organizationId: Scalars['ID']['output'];
  rate?: Maybe<Scalars['Float']['output']>;
  seqNo?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  unit?: Maybe<Scalars['String']['output']>;
};

export type JournalEntry = {
  __typename?: 'JournalEntry';
  createdAt: Scalars['String']['output'];
  description: Scalars['String']['output'];
  entryDate: Scalars['String']['output'];
  entryNumber: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lines: Array<JournalEntryLine>;
  organizationId: Scalars['String']['output'];
  postedAt?: Maybe<Scalars['String']['output']>;
  postedBy?: Maybe<Scalars['String']['output']>;
  referenceNumber?: Maybe<Scalars['String']['output']>;
  seqNo?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  totalCredit: Scalars['Float']['output'];
  totalDebit: Scalars['Float']['output'];
};

export type JournalEntryInput = {
  description: Scalars['String']['input'];
  entryDate: Scalars['String']['input'];
  entryNumber: Scalars['String']['input'];
  lines: Array<JournalEntryLineInput>;
  organizationId: Scalars['String']['input'];
  referenceNumber?: InputMaybe<Scalars['String']['input']>;
};

export type JournalEntryLine = {
  __typename?: 'JournalEntryLine';
  accountCode: Scalars['String']['output'];
  accountName: Scalars['String']['output'];
  credit: Scalars['Float']['output'];
  debit: Scalars['Float']['output'];
  description?: Maybe<Scalars['String']['output']>;
};

export type JournalEntryLineInput = {
  accountCode: Scalars['String']['input'];
  accountName: Scalars['String']['input'];
  credit: Scalars['Float']['input'];
  debit: Scalars['Float']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
};

export type Lead = {
  __typename?: 'Lead';
  assignedTo?: Maybe<Scalars['ID']['output']>;
  company?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  email?: Maybe<Scalars['String']['output']>;
  estimatedValue?: Maybe<Scalars['Float']['output']>;
  expectedCloseDate?: Maybe<Scalars['String']['output']>;
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastName: Scalars['String']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['String']['output'];
  phone?: Maybe<Scalars['String']['output']>;
  rating?: Maybe<Scalars['String']['output']>;
  seqNo?: Maybe<Scalars['String']['output']>;
  source?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  title?: Maybe<Scalars['String']['output']>;
};

export type LeadInput = {
  assignedTo?: InputMaybe<Scalars['ID']['input']>;
  company?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  estimatedValue?: InputMaybe<Scalars['Float']['input']>;
  expectedCloseDate?: InputMaybe<Scalars['String']['input']>;
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['String']['input'];
  phone?: InputMaybe<Scalars['String']['input']>;
  rating?: InputMaybe<Scalars['String']['input']>;
  source?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type LeaveApplication = {
  __typename?: 'LeaveApplication';
  approvedAt?: Maybe<Scalars['String']['output']>;
  approvedBy?: Maybe<Scalars['ID']['output']>;
  createdAt: Scalars['String']['output'];
  endDate: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  leaveTypeId: Scalars['ID']['output'];
  organizationId: Scalars['ID']['output'];
  reason?: Maybe<Scalars['String']['output']>;
  rejectedReason?: Maybe<Scalars['String']['output']>;
  startDate: Scalars['String']['output'];
  status: Scalars['String']['output'];
  totalDays: Scalars['Float']['output'];
  updatedAt: Scalars['String']['output'];
  userId: Scalars['ID']['output'];
};

export type LeaveEnrollment = {
  __typename?: 'LeaveEnrollment';
  calendarYear: Scalars['Int']['output'];
  carriedForward: Scalars['Float']['output'];
  createdAt: Scalars['String']['output'];
  entitledDays: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  leaveTypeId: Scalars['ID']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['ID']['output'];
  updatedAt: Scalars['String']['output'];
  usedDays: Scalars['Float']['output'];
  userId: Scalars['ID']['output'];
};

export type LeaveReinstatement = {
  __typename?: 'LeaveReinstatement';
  calendarYear: Scalars['Int']['output'];
  createdAt: Scalars['String']['output'];
  daysRestored: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  leaveApplicationId?: Maybe<Scalars['ID']['output']>;
  leaveTypeId: Scalars['ID']['output'];
  organizationId: Scalars['ID']['output'];
  reason: Scalars['String']['output'];
  reviewNotes?: Maybe<Scalars['String']['output']>;
  reviewedAt?: Maybe<Scalars['String']['output']>;
  reviewedBy?: Maybe<Scalars['ID']['output']>;
  status: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
  userId: Scalars['ID']['output'];
};

export type LeaveType = {
  __typename?: 'LeaveType';
  active: Scalars['Boolean']['output'];
  allowCarryForward: Scalars['Boolean']['output'];
  code: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  defaultDaysPerYear: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  maxCarryForwardDays?: Maybe<Scalars['Float']['output']>;
  name: Scalars['String']['output'];
  organizationId: Scalars['ID']['output'];
  paid: Scalars['Boolean']['output'];
  updatedAt: Scalars['String']['output'];
};

export type LoanRepayment = {
  __typename?: 'LoanRepayment';
  createdAt: Scalars['String']['output'];
  docDate: Scalars['String']['output'];
  docNumber: Scalars['String']['output'];
  employeeName?: Maybe<Scalars['String']['output']>;
  employeeNo?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  loanReference?: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['String']['output'];
  payPeriodEnd?: Maybe<Scalars['String']['output']>;
  payPeriodStart?: Maybe<Scalars['String']['output']>;
  remarks?: Maybe<Scalars['String']['output']>;
  repaymentAmount: Scalars['Float']['output'];
  status: Scalars['String']['output'];
  title?: Maybe<Scalars['String']['output']>;
};

export type LoanRepaymentInput = {
  docDate: Scalars['String']['input'];
  employeeName?: InputMaybe<Scalars['String']['input']>;
  employeeNo?: InputMaybe<Scalars['String']['input']>;
  loanReference?: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['String']['input'];
  payPeriodEnd?: InputMaybe<Scalars['String']['input']>;
  payPeriodStart?: InputMaybe<Scalars['String']['input']>;
  remarks?: InputMaybe<Scalars['String']['input']>;
  repaymentAmount?: InputMaybe<Scalars['Float']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type MrnLineItem = {
  __typename?: 'MRNLineItem';
  itemDescription: Scalars['String']['output'];
  itemId?: Maybe<Scalars['ID']['output']>;
  lineTotal: Scalars['Float']['output'];
  orderedQty: Scalars['Float']['output'];
  receivedQty: Scalars['Float']['output'];
  rejectedQty?: Maybe<Scalars['Float']['output']>;
  unit?: Maybe<Scalars['String']['output']>;
  unitPrice: Scalars['Float']['output'];
};

export type MrnLineItemInput = {
  itemDescription: Scalars['String']['input'];
  itemId?: InputMaybe<Scalars['ID']['input']>;
  lineTotal: Scalars['Float']['input'];
  orderedQty: Scalars['Float']['input'];
  receivedQty: Scalars['Float']['input'];
  rejectedQty?: InputMaybe<Scalars['Float']['input']>;
  unit?: InputMaybe<Scalars['String']['input']>;
  unitPrice: Scalars['Float']['input'];
};

export type MaterialReceipt = {
  __typename?: 'MaterialReceipt';
  createdAt?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  lineItems: Array<MrnLineItem>;
  mrnNumber: Scalars['String']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['ID']['output'];
  purchaseOrderId?: Maybe<Scalars['ID']['output']>;
  purchaseOrderNumber?: Maybe<Scalars['String']['output']>;
  receiptDate: Scalars['String']['output'];
  status: Scalars['String']['output'];
  totalAmount: Scalars['Float']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  vendorId?: Maybe<Scalars['ID']['output']>;
  vendorName?: Maybe<Scalars['String']['output']>;
  warehouseId?: Maybe<Scalars['ID']['output']>;
  warehouseName?: Maybe<Scalars['String']['output']>;
};

export type Milestone = {
  __typename?: 'Milestone';
  completedAt?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  dueDate?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  status: Scalars['String']['output'];
};

export type MilestoneInput = {
  completedAt?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  dueDate?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  name: Scalars['String']['input'];
  status?: InputMaybe<Scalars['String']['input']>;
};

export type ModulePermission = {
  __typename?: 'ModulePermission';
  canCreate: Scalars['Boolean']['output'];
  canDelete: Scalars['Boolean']['output'];
  canUpdate: Scalars['Boolean']['output'];
  canView: Scalars['Boolean']['output'];
  moduleKey: Scalars['String']['output'];
};

export type ModulePermissionInput = {
  canCreate: Scalars['Boolean']['input'];
  canDelete: Scalars['Boolean']['input'];
  canUpdate: Scalars['Boolean']['input'];
  canView: Scalars['Boolean']['input'];
  moduleKey: Scalars['String']['input'];
};

export type ModuleWorkspaceRecord = {
  __typename?: 'ModuleWorkspaceRecord';
  approvalModuleKey: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  createdByUserId?: Maybe<Scalars['ID']['output']>;
  detail?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  organizationId: Scalars['ID']['output'];
  routePath: Scalars['String']['output'];
  snapshot?: Maybe<Scalars['String']['output']>;
  status: ModuleWorkspaceStatus;
  title: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
};

export type ModuleWorkspaceStatus =
  | 'APPROVED'
  | 'DRAFT'
  | 'PENDING_APPROVAL'
  | 'REJECTED';

export type Mutation = {
  __typename?: 'Mutation';
  _empty?: Maybe<Scalars['String']['output']>;
  activateBudget: Budget;
  adjustStock: InventoryControl;
  approveLeaveApplication: LeaveApplication;
  approveLeaveReinstatement: LeaveReinstatement;
  approvePurchaseOrder: PurchaseOrder;
  approveReturnAuthorization: ReturnAuthorization;
  approveVendorBill: VendorBill;
  billPurchaseOrder: VendorBill;
  cancelCustomerDeposit: CustomerDeposit;
  cancelCustomerRefund: CustomerRefund;
  cancelFinanceChargeAssessment: FinanceChargeAssessment;
  cancelIntercompanyTransfer: IntercompanyTransfer;
  cancelMaterialReceipt: MaterialReceipt;
  cancelReturnAuthorization: ReturnAuthorization;
  cancelStockAdjustment: StockAdjustment;
  cancelStockTransfer: StockTransfer;
  confirmIntercompanyTransfer: IntercompanyTransfer;
  confirmMaterialReceipt: MaterialReceipt;
  confirmStockAdjustment: StockAdjustment;
  confirmStockTransfer: StockTransfer;
  convertLeadToOpportunity: Scalars['ID']['output'];
  createAllocationSchedule: AllocationSchedule;
  createApplicant: Applicant;
  createAsset: Asset;
  createAttendance: Attendance;
  createBankAccount: BankAccount;
  createBankStatementLine: BankStatementLine;
  createBudget: Budget;
  createCareer: Career;
  createCashBank: CashBank;
  createChartOfAccount: ChartOfAccounts;
  createClient: Client;
  createContractor: Contractor;
  createCurrencyRevaluation: CurrencyRevaluation;
  createCustomer: Customer;
  createCustomerDeposit: CustomerDeposit;
  createCustomerInvoice: CustomerInvoice;
  createCustomerPayment: CustomerPayment;
  createCustomerRefund: CustomerRefund;
  createDVS: Dvs;
  createDeliveryChallan: DeliveryChallan;
  createEPM: Epm;
  createExciseInvoice: ExciseInvoice;
  createExtraction: Extraction;
  createGRN: Grn;
  createGeneralLedger: GeneralLedger;
  createGoodsReceipt: GoodsReceipt;
  createIPInspection: IpInspection;
  createIntercompanyTransfer: IntercompanyTransfer;
  createInternalOrder: InternalOrder;
  createInventoryControl: InventoryControl;
  createInventoryReturn: InventoryReturn;
  createItem: Item;
  createJournalEntry: JournalEntry;
  createLead: Lead;
  createLeaveApplication: LeaveApplication;
  createLeaveEnrollment: LeaveEnrollment;
  createLeaveReinstatement: LeaveReinstatement;
  createLeaveType: LeaveType;
  createLoanRepayment: LoanRepayment;
  createMaterialReceipt: MaterialReceipt;
  createModuleWorkspaceRecord: ModuleWorkspaceRecord;
  createOpportunity: Opportunity;
  createOrganization: Organization;
  createOrganizationWithOrgAdmin: Organization;
  createPayrollManagement: PayrollManagement;
  createPayrollUiRecord: PayrollUiRecord;
  createProduct: Product;
  createProductionPlanning: ProductionPlanning;
  createProject: Project;
  createPurchaseOrder: PurchaseOrder;
  createQuotation: Quotation;
  createRawMaterialRequisition: RawMaterialRequisition;
  createReconciliationRule: ReconciliationRule;
  createRecruitment: Recruitment;
  createReturnAuthorization: ReturnAuthorization;
  createRole: Role;
  createSalaryProcessing: SalaryProcessing;
  createSalesEnquiry: SalesEnquiry;
  createSalesOrder: SalesOrder;
  createSalesQuotation: SalesQuotation;
  createSalesReturn: SalesReturn;
  createSiteLocation: SiteLocation;
  createStockAdjustment: StockAdjustment;
  createStockMovement: StockMovement;
  createStockTransfer: StockTransfer;
  createUser: User;
  createVendor: Vendor;
  createVendorBill: VendorBill;
  createVendorCredit: VendorCredit;
  createVendorPayment: VendorPayment;
  createVendorPrepayment: VendorPrepayment;
  createWarehouse: Warehouse;
  createWarehouseBin: WarehouseBin;
  createWorkOrder: WorkOrder;
  deleteAllocationSchedule: Scalars['Boolean']['output'];
  deleteApplicant: Scalars['Boolean']['output'];
  deleteAsset: Scalars['Boolean']['output'];
  deleteAttendance: Attendance;
  deleteBankStatementLine: Scalars['Boolean']['output'];
  deleteBudget: Scalars['Boolean']['output'];
  deleteCareer: Scalars['Boolean']['output'];
  deleteChartOfAccount: Scalars['Boolean']['output'];
  deleteClient: Scalars['Boolean']['output'];
  deleteContractor: Scalars['Boolean']['output'];
  deleteCurrencyRevaluation: Scalars['Boolean']['output'];
  deleteCustomer: Scalars['Boolean']['output'];
  deleteCustomerInvoice: CustomerInvoice;
  deleteCustomerPayment: Scalars['Boolean']['output'];
  deleteDVS: Scalars['Boolean']['output'];
  deleteDeliveryChallan: Scalars['Boolean']['output'];
  deleteEPM: Scalars['Boolean']['output'];
  deleteExciseInvoice: Scalars['Boolean']['output'];
  deleteExtraction: Scalars['Boolean']['output'];
  deleteFinanceChargeAssessment: Scalars['Boolean']['output'];
  deleteGRN: Scalars['Boolean']['output'];
  deleteGoodsReceipt: Scalars['Boolean']['output'];
  deleteIPInspection: Scalars['Boolean']['output'];
  deleteIndividualPriceList: Scalars['Boolean']['output'];
  deleteIntercompanyTransfer: Scalars['Boolean']['output'];
  deleteInternalOrder: Scalars['Boolean']['output'];
  deleteInventoryReturn: Scalars['Boolean']['output'];
  deleteItem: Item;
  deleteJournalEntry: Scalars['Boolean']['output'];
  deleteLead: Scalars['Boolean']['output'];
  deleteLeaveApplication: LeaveApplication;
  deleteLeaveEnrollment: LeaveEnrollment;
  deleteLeaveReinstatement: LeaveReinstatement;
  deleteLeaveType: LeaveType;
  deleteLoanRepayment: Scalars['Boolean']['output'];
  deleteMaterialReceipt: Scalars['Boolean']['output'];
  deleteOpportunity: Scalars['Boolean']['output'];
  deleteOrganization: Organization;
  deletePayrollManagement: Scalars['Boolean']['output'];
  deletePayrollUiRecord: Scalars['Boolean']['output'];
  deleteProduct: Scalars['Boolean']['output'];
  deleteProductionPlanning: Scalars['Boolean']['output'];
  deleteProject: Project;
  deletePurchaseOrder: Scalars['Boolean']['output'];
  deleteQuotation: Scalars['Boolean']['output'];
  deleteReconciliationRule: Scalars['Boolean']['output'];
  deleteReturnAuthorization: Scalars['Boolean']['output'];
  deleteRole: Scalars['Boolean']['output'];
  deleteSalaryProcessing: Scalars['Boolean']['output'];
  deleteSalesEnquiry: SalesEnquiry;
  deleteSalesOrder: SalesOrder;
  deleteSalesQuotation: SalesQuotation;
  deleteSalesReturn: Scalars['Boolean']['output'];
  deleteSiteLocation: Scalars['Boolean']['output'];
  deleteStockAdjustment: Scalars['Boolean']['output'];
  deleteStockTransfer: Scalars['Boolean']['output'];
  deleteUser: User;
  deleteVendor: Scalars['Boolean']['output'];
  deleteVendorBill: Scalars['Boolean']['output'];
  deleteVendorCredit: Scalars['Boolean']['output'];
  deleteVendorPayment: Scalars['Boolean']['output'];
  deleteVendorPrepayment: Scalars['Boolean']['output'];
  deleteWorkOrder: Scalars['Boolean']['output'];
  draftFinanceChargeAssessment: FinanceChargeAssessment;
  generatePriceList: PriceList;
  login: AuthPayload;
  matchBankStatementLineToBook: BankStatementLine;
  postCurrencyRevaluation: CurrencyRevaluation;
  postFinanceChargeAssessment: FinanceChargeAssessment;
  postJournalEntry: JournalEntry;
  receivePurchaseOrder: PurchaseOrder;
  receiveReturnAuthorizationGoods: ReturnAuthorization;
  reconcileCashBank: CashBank;
  refundCashSale: SalesOrder;
  register: AuthPayload;
  rejectLeaveApplication: LeaveApplication;
  rejectLeaveReinstatement: LeaveReinstatement;
  rejectReturnAuthorization: ReturnAuthorization;
  resolveApprovalRequest: ApprovalRequest;
  seedIndividualPriceListFromCatalog: IndividualPriceList;
  seedSystemRoles: Array<Role>;
  sendQuotation: SendQuotationResult;
  /** Replace module-level approver assignments for an organization (org admin: own org only). */
  setOrganizationModuleApprovers: Organization;
  setUserModulePermissions: User;
  submitCustomerInvoiceForApproval: CustomerInvoice;
  submitDeliveryChallanForApproval: DeliveryChallan;
  submitGRNForApproval: Grn;
  submitLeadForApproval: Lead;
  submitMaterialReceiptForApproval: MaterialReceipt;
  submitModuleWorkspaceRecordForApproval: ModuleWorkspaceRecord;
  submitPayrollManagementForApproval: PayrollManagement;
  submitPayrollUiRecordForApproval: PayrollUiRecord;
  submitProjectForApproval: Project;
  submitPurchaseOrder: PurchaseOrder;
  submitQuotationForApproval: Quotation;
  submitSalesEnquiryForApproval: SalesEnquiry;
  /** Draft → pending approval inbox for the Sales approver configured under Org admin → Approvals. */
  submitSalesOrder: SalesOrder;
  submitSalesReturnForApproval: SalesReturn;
  submitVendorBillForApproval: VendorBill;
  submitVendorForApproval: Vendor;
  transferBankFunds: BankTransferResult;
  updateAllocationSchedule: AllocationSchedule;
  updateApplicant: Applicant;
  updateAsset: Asset;
  updateAttendance: Attendance;
  updateBankAccount: BankAccount;
  updateBudget: Budget;
  updateCareer: Career;
  updateChartOfAccount: ChartOfAccounts;
  updateClient: Client;
  updateContractor: Contractor;
  updateCustomer: Customer;
  updateCustomerInvoice: CustomerInvoice;
  updateCustomerPayment: CustomerPayment;
  updateDVS: Dvs;
  updateDeliveryChallan: DeliveryChallan;
  updateEPM: Epm;
  updateExciseInvoice: ExciseInvoice;
  updateExtraction: Extraction;
  updateGRN: Grn;
  updateGoodsReceipt: GoodsReceipt;
  updateIPInspection: IpInspection;
  updateIntercompanyTransfer: IntercompanyTransfer;
  updateInternalOrder: InternalOrder;
  updateInventoryControl: InventoryControl;
  updateInventoryReturn: InventoryReturn;
  updateItem: Item;
  updateJournalEntry: JournalEntry;
  updateLead: Lead;
  updateLeaveApplication: LeaveApplication;
  updateLeaveEnrollment: LeaveEnrollment;
  updateLeaveReinstatement: LeaveReinstatement;
  updateLeaveType: LeaveType;
  updateLoanRepayment: LoanRepayment;
  updateMaterialReceipt: MaterialReceipt;
  updateModuleWorkspaceRecord: ModuleWorkspaceRecord;
  updateOpportunity: Opportunity;
  updateOrganization: Organization;
  updatePayrollManagement: PayrollManagement;
  updatePayrollUiRecord: PayrollUiRecord;
  updateProduct: Product;
  updateProductionPlanning: ProductionPlanning;
  updateProject: Project;
  updatePurchaseOrder: PurchaseOrder;
  updateQuotation: Quotation;
  updateRawMaterialRequisition: RawMaterialRequisition;
  updateReconciliationRule: ReconciliationRule;
  updateRecruitment: Recruitment;
  updateRole: Role;
  updateSalaryProcessing: SalaryProcessing;
  updateSalesEnquiry: SalesEnquiry;
  updateSalesOrder: SalesOrder;
  updateSalesQuotation: SalesQuotation;
  updateSalesReturn: SalesReturn;
  updateSiteLocation: SiteLocation;
  updateStockAdjustment: StockAdjustment;
  updateStockTransfer: StockTransfer;
  updateUser: User;
  updateVendor: Vendor;
  updateVendorBill: VendorBill;
  updateVendorCredit: VendorCredit;
  updateVendorPayment: VendorPayment;
  updateVendorPrepayment: VendorPrepayment;
  updateWarehouse: Warehouse;
  updateWarehouseBin: WarehouseBin;
  updateWorkOrder: WorkOrder;
  upsertIndividualPriceList: IndividualPriceList;
};


export type MutationActivateBudgetArgs = {
  id: Scalars['ID']['input'];
};


export type MutationAdjustStockArgs = {
  binLocation: Scalars['String']['input'];
  itemId: Scalars['String']['input'];
  organizationId?: InputMaybe<Scalars['String']['input']>;
  quantity: Scalars['Float']['input'];
  reason: Scalars['String']['input'];
};


export type MutationApproveLeaveApplicationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationApproveLeaveReinstatementArgs = {
  id: Scalars['ID']['input'];
};


export type MutationApprovePurchaseOrderArgs = {
  id: Scalars['ID']['input'];
};


export type MutationApproveReturnAuthorizationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationApproveVendorBillArgs = {
  id: Scalars['ID']['input'];
};


export type MutationBillPurchaseOrderArgs = {
  billDate: Scalars['String']['input'];
  dueDate: Scalars['String']['input'];
  id: Scalars['ID']['input'];
};


export type MutationCancelCustomerDepositArgs = {
  id: Scalars['ID']['input'];
};


export type MutationCancelCustomerRefundArgs = {
  id: Scalars['ID']['input'];
};


export type MutationCancelFinanceChargeAssessmentArgs = {
  id: Scalars['ID']['input'];
};


export type MutationCancelIntercompanyTransferArgs = {
  id: Scalars['ID']['input'];
};


export type MutationCancelMaterialReceiptArgs = {
  id: Scalars['ID']['input'];
};


export type MutationCancelReturnAuthorizationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationCancelStockAdjustmentArgs = {
  id: Scalars['ID']['input'];
};


export type MutationCancelStockTransferArgs = {
  id: Scalars['ID']['input'];
};


export type MutationConfirmIntercompanyTransferArgs = {
  id: Scalars['ID']['input'];
};


export type MutationConfirmMaterialReceiptArgs = {
  id: Scalars['ID']['input'];
};


export type MutationConfirmStockAdjustmentArgs = {
  id: Scalars['ID']['input'];
};


export type MutationConfirmStockTransferArgs = {
  id: Scalars['ID']['input'];
};


export type MutationConvertLeadToOpportunityArgs = {
  id: Scalars['ID']['input'];
};


export type MutationCreateAllocationScheduleArgs = {
  input: AllocationScheduleInput;
};


export type MutationCreateApplicantArgs = {
  input: ApplicantInput;
};


export type MutationCreateAssetArgs = {
  input: AssetInput;
};


export type MutationCreateAttendanceArgs = {
  input: CreateAttendanceInput;
};


export type MutationCreateBankAccountArgs = {
  input: BankAccountInput;
};


export type MutationCreateBankStatementLineArgs = {
  input: BankStatementLineInput;
};


export type MutationCreateBudgetArgs = {
  input: BudgetInput;
};


export type MutationCreateCareerArgs = {
  input: CareerInput;
};


export type MutationCreateCashBankArgs = {
  input: CashBankInput;
};


export type MutationCreateChartOfAccountArgs = {
  input: ChartOfAccountsInput;
};


export type MutationCreateClientArgs = {
  input: CreateClientInput;
};


export type MutationCreateContractorArgs = {
  input: ContractorInput;
};


export type MutationCreateCurrencyRevaluationArgs = {
  input: CurrencyRevaluationInput;
};


export type MutationCreateCustomerArgs = {
  input: CreateCustomerInput;
};


export type MutationCreateCustomerDepositArgs = {
  input: CreateCustomerDepositInput;
};


export type MutationCreateCustomerInvoiceArgs = {
  input: CreateCustomerInvoiceInput;
};


export type MutationCreateCustomerPaymentArgs = {
  input: CreateCustomerPaymentInput;
};


export type MutationCreateCustomerRefundArgs = {
  input: CreateCustomerRefundInput;
};


export type MutationCreateDvsArgs = {
  input: DvsInput;
};


export type MutationCreateDeliveryChallanArgs = {
  input: DeliveryChallanInput;
};


export type MutationCreateEpmArgs = {
  input: EpmInput;
};


export type MutationCreateExciseInvoiceArgs = {
  input: ExciseInvoiceInput;
};


export type MutationCreateExtractionArgs = {
  input: ExtractionInput;
};


export type MutationCreateGrnArgs = {
  input: CreateGrnInput;
};


export type MutationCreateGeneralLedgerArgs = {
  input: GeneralLedgerInput;
};


export type MutationCreateGoodsReceiptArgs = {
  input: GoodsReceiptInput;
};


export type MutationCreateIpInspectionArgs = {
  input: IpInspectionInput;
};


export type MutationCreateIntercompanyTransferArgs = {
  input: CreateIntercompanyTransferInput;
};


export type MutationCreateInternalOrderArgs = {
  input: InternalOrderInput;
};


export type MutationCreateInventoryControlArgs = {
  input: InventoryControlInput;
};


export type MutationCreateInventoryReturnArgs = {
  input: InventoryReturnInput;
};


export type MutationCreateItemArgs = {
  input: CreateItemInput;
};


export type MutationCreateJournalEntryArgs = {
  input: JournalEntryInput;
};


export type MutationCreateLeadArgs = {
  input: LeadInput;
};


export type MutationCreateLeaveApplicationArgs = {
  input: CreateLeaveApplicationInput;
};


export type MutationCreateLeaveEnrollmentArgs = {
  input: CreateLeaveEnrollmentInput;
};


export type MutationCreateLeaveReinstatementArgs = {
  input: CreateLeaveReinstatementInput;
};


export type MutationCreateLeaveTypeArgs = {
  input: CreateLeaveTypeInput;
};


export type MutationCreateLoanRepaymentArgs = {
  input: LoanRepaymentInput;
};


export type MutationCreateMaterialReceiptArgs = {
  input: CreateMaterialReceiptInput;
};


export type MutationCreateModuleWorkspaceRecordArgs = {
  input: CreateModuleWorkspaceRecordInput;
};


export type MutationCreateOpportunityArgs = {
  input: OpportunityInput;
};


export type MutationCreateOrganizationArgs = {
  input: CreateOrganizationInput;
};


export type MutationCreateOrganizationWithOrgAdminArgs = {
  input: CreateOrganizationWithOrgAdminInput;
};


export type MutationCreatePayrollManagementArgs = {
  input: PayrollManagementInput;
};


export type MutationCreatePayrollUiRecordArgs = {
  input: PayrollUiRecordInput;
};


export type MutationCreateProductArgs = {
  input: CreateProductInput;
};


export type MutationCreateProductionPlanningArgs = {
  input: ProductionPlanningInput;
};


export type MutationCreateProjectArgs = {
  input: CreateProjectInput;
};


export type MutationCreatePurchaseOrderArgs = {
  input: CreatePurchaseOrderInput;
};


export type MutationCreateQuotationArgs = {
  input: CreateQuotationInput;
};


export type MutationCreateRawMaterialRequisitionArgs = {
  input: RawMaterialRequisitionInput;
};


export type MutationCreateReconciliationRuleArgs = {
  input: ReconciliationRuleInput;
};


export type MutationCreateRecruitmentArgs = {
  input: RecruitmentInput;
};


export type MutationCreateReturnAuthorizationArgs = {
  input: CreateReturnAuthorizationInput;
};


export type MutationCreateRoleArgs = {
  input: CreateRoleInput;
};


export type MutationCreateSalaryProcessingArgs = {
  input: SalaryProcessingInput;
};


export type MutationCreateSalesEnquiryArgs = {
  input: CreateSalesEnquiryInput;
};


export type MutationCreateSalesOrderArgs = {
  input: CreateSalesOrderInput;
};


export type MutationCreateSalesQuotationArgs = {
  input: CreateSalesQuotationInput;
};


export type MutationCreateSalesReturnArgs = {
  input: SalesReturnInput;
};


export type MutationCreateSiteLocationArgs = {
  input: SiteLocationInput;
};


export type MutationCreateStockAdjustmentArgs = {
  input: CreateStockAdjustmentInput;
};


export type MutationCreateStockMovementArgs = {
  input: StockMovementInput;
};


export type MutationCreateStockTransferArgs = {
  input: CreateStockTransferInput;
};


export type MutationCreateUserArgs = {
  input: CreateUserInput;
};


export type MutationCreateVendorArgs = {
  input: CreateVendorInput;
};


export type MutationCreateVendorBillArgs = {
  input: CreateVendorBillInput;
};


export type MutationCreateVendorCreditArgs = {
  input: CreateVendorCreditInput;
};


export type MutationCreateVendorPaymentArgs = {
  input: CreateVendorPaymentInput;
};


export type MutationCreateVendorPrepaymentArgs = {
  input: CreateVendorPrepaymentInput;
};


export type MutationCreateWarehouseArgs = {
  input: WarehouseInput;
};


export type MutationCreateWarehouseBinArgs = {
  input: WarehouseBinInput;
};


export type MutationCreateWorkOrderArgs = {
  input: WorkOrderInput;
};


export type MutationDeleteAllocationScheduleArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteApplicantArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteAssetArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteAttendanceArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteBankStatementLineArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteBudgetArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteCareerArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteChartOfAccountArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteClientArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteContractorArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteCurrencyRevaluationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteCustomerArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteCustomerInvoiceArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteCustomerPaymentArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteDvsArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteDeliveryChallanArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteEpmArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteExciseInvoiceArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteExtractionArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteFinanceChargeAssessmentArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteGrnArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteGoodsReceiptArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteIpInspectionArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteIndividualPriceListArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteIntercompanyTransferArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteInternalOrderArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteInventoryReturnArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteItemArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteJournalEntryArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteLeadArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteLeaveApplicationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteLeaveEnrollmentArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteLeaveReinstatementArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteLeaveTypeArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteLoanRepaymentArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteMaterialReceiptArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteOpportunityArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteOrganizationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeletePayrollManagementArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeletePayrollUiRecordArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteProductArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteProductionPlanningArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteProjectArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeletePurchaseOrderArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteQuotationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteReconciliationRuleArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteReturnAuthorizationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteRoleArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteSalaryProcessingArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteSalesEnquiryArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteSalesOrderArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteSalesQuotationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteSalesReturnArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteSiteLocationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteStockAdjustmentArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteStockTransferArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteVendorArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteVendorBillArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteVendorCreditArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteVendorPaymentArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteVendorPrepaymentArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteWorkOrderArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDraftFinanceChargeAssessmentArgs = {
  input: DraftFinanceChargeAssessmentInput;
};


export type MutationGeneratePriceListArgs = {
  input: GeneratePriceListInput;
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationMatchBankStatementLineToBookArgs = {
  bankStatementLineId: Scalars['ID']['input'];
  cashBankId: Scalars['ID']['input'];
};


export type MutationPostCurrencyRevaluationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationPostFinanceChargeAssessmentArgs = {
  id: Scalars['ID']['input'];
};


export type MutationPostJournalEntryArgs = {
  id: Scalars['ID']['input'];
};


export type MutationReceivePurchaseOrderArgs = {
  id: Scalars['ID']['input'];
};


export type MutationReceiveReturnAuthorizationGoodsArgs = {
  input: ReceiveReturnAuthorizationGoodsInput;
};


export type MutationReconcileCashBankArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRefundCashSaleArgs = {
  input: RefundCashSaleInput;
};


export type MutationRegisterArgs = {
  input: RegisterInput;
};


export type MutationRejectLeaveApplicationArgs = {
  id: Scalars['ID']['input'];
  reason: Scalars['String']['input'];
};


export type MutationRejectLeaveReinstatementArgs = {
  id: Scalars['ID']['input'];
  reviewNotes?: InputMaybe<Scalars['String']['input']>;
};


export type MutationRejectReturnAuthorizationArgs = {
  id: Scalars['ID']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
};


export type MutationResolveApprovalRequestArgs = {
  decision: ApprovalDecision;
  id: Scalars['ID']['input'];
  note?: InputMaybe<Scalars['String']['input']>;
};


export type MutationSeedIndividualPriceListFromCatalogArgs = {
  customerId: Scalars['ID']['input'];
  organizationId: Scalars['String']['input'];
};


export type MutationSendQuotationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationSetOrganizationModuleApproversArgs = {
  assignments: Array<OrganizationModuleApproverInput>;
  organizationId: Scalars['ID']['input'];
};


export type MutationSetUserModulePermissionsArgs = {
  permissions: Array<ModulePermissionInput>;
  userId: Scalars['ID']['input'];
};


export type MutationSubmitCustomerInvoiceForApprovalArgs = {
  id: Scalars['ID']['input'];
};


export type MutationSubmitDeliveryChallanForApprovalArgs = {
  id: Scalars['ID']['input'];
};


export type MutationSubmitGrnForApprovalArgs = {
  id: Scalars['ID']['input'];
};


export type MutationSubmitLeadForApprovalArgs = {
  id: Scalars['ID']['input'];
};


export type MutationSubmitMaterialReceiptForApprovalArgs = {
  id: Scalars['ID']['input'];
};


export type MutationSubmitModuleWorkspaceRecordForApprovalArgs = {
  id: Scalars['ID']['input'];
};


export type MutationSubmitPayrollManagementForApprovalArgs = {
  id: Scalars['ID']['input'];
};


export type MutationSubmitPayrollUiRecordForApprovalArgs = {
  id: Scalars['ID']['input'];
};


export type MutationSubmitProjectForApprovalArgs = {
  id: Scalars['ID']['input'];
};


export type MutationSubmitPurchaseOrderArgs = {
  id: Scalars['ID']['input'];
};


export type MutationSubmitQuotationForApprovalArgs = {
  id: Scalars['ID']['input'];
};


export type MutationSubmitSalesEnquiryForApprovalArgs = {
  id: Scalars['ID']['input'];
};


export type MutationSubmitSalesOrderArgs = {
  id: Scalars['ID']['input'];
};


export type MutationSubmitSalesReturnForApprovalArgs = {
  id: Scalars['ID']['input'];
};


export type MutationSubmitVendorBillForApprovalArgs = {
  id: Scalars['ID']['input'];
};


export type MutationSubmitVendorForApprovalArgs = {
  id: Scalars['ID']['input'];
};


export type MutationTransferBankFundsArgs = {
  input: BankTransferInput;
};


export type MutationUpdateAllocationScheduleArgs = {
  id: Scalars['ID']['input'];
  input: AllocationScheduleInput;
};


export type MutationUpdateApplicantArgs = {
  id: Scalars['ID']['input'];
  input: ApplicantInput;
};


export type MutationUpdateAssetArgs = {
  id: Scalars['ID']['input'];
  input: AssetInput;
};


export type MutationUpdateAttendanceArgs = {
  id: Scalars['ID']['input'];
  input: UpdateAttendanceInput;
};


export type MutationUpdateBankAccountArgs = {
  id: Scalars['ID']['input'];
  input: BankAccountInput;
};


export type MutationUpdateBudgetArgs = {
  id: Scalars['ID']['input'];
  input: BudgetInput;
};


export type MutationUpdateCareerArgs = {
  id: Scalars['ID']['input'];
  input: CareerInput;
};


export type MutationUpdateChartOfAccountArgs = {
  id: Scalars['ID']['input'];
  input: ChartOfAccountsInput;
};


export type MutationUpdateClientArgs = {
  id: Scalars['ID']['input'];
  input: UpdateClientInput;
};


export type MutationUpdateContractorArgs = {
  id: Scalars['ID']['input'];
  input: ContractorInput;
};


export type MutationUpdateCustomerArgs = {
  id: Scalars['ID']['input'];
  input: UpdateCustomerInput;
};


export type MutationUpdateCustomerInvoiceArgs = {
  id: Scalars['ID']['input'];
  input: UpdateCustomerInvoiceInput;
};


export type MutationUpdateCustomerPaymentArgs = {
  id: Scalars['ID']['input'];
  input: UpdateCustomerPaymentInput;
};


export type MutationUpdateDvsArgs = {
  id: Scalars['ID']['input'];
  input: DvsInput;
};


export type MutationUpdateDeliveryChallanArgs = {
  id: Scalars['ID']['input'];
  input: DeliveryChallanInput;
};


export type MutationUpdateEpmArgs = {
  id: Scalars['ID']['input'];
  input: EpmInput;
};


export type MutationUpdateExciseInvoiceArgs = {
  id: Scalars['ID']['input'];
  input: ExciseInvoiceInput;
};


export type MutationUpdateExtractionArgs = {
  id: Scalars['ID']['input'];
  input: ExtractionInput;
};


export type MutationUpdateGrnArgs = {
  id: Scalars['ID']['input'];
  input: UpdateGrnInput;
};


export type MutationUpdateGoodsReceiptArgs = {
  id: Scalars['ID']['input'];
  input: GoodsReceiptInput;
};


export type MutationUpdateIpInspectionArgs = {
  id: Scalars['ID']['input'];
  input: IpInspectionInput;
};


export type MutationUpdateIntercompanyTransferArgs = {
  id: Scalars['ID']['input'];
  input: UpdateIntercompanyTransferInput;
};


export type MutationUpdateInternalOrderArgs = {
  id: Scalars['ID']['input'];
  input: InternalOrderInput;
};


export type MutationUpdateInventoryControlArgs = {
  id: Scalars['ID']['input'];
  input: InventoryControlInput;
};


export type MutationUpdateInventoryReturnArgs = {
  id: Scalars['ID']['input'];
  input: InventoryReturnInput;
};


export type MutationUpdateItemArgs = {
  id: Scalars['ID']['input'];
  input: UpdateItemInput;
};


export type MutationUpdateJournalEntryArgs = {
  id: Scalars['ID']['input'];
  input: JournalEntryInput;
};


export type MutationUpdateLeadArgs = {
  id: Scalars['ID']['input'];
  input: LeadInput;
};


export type MutationUpdateLeaveApplicationArgs = {
  id: Scalars['ID']['input'];
  input: UpdateLeaveApplicationInput;
};


export type MutationUpdateLeaveEnrollmentArgs = {
  id: Scalars['ID']['input'];
  input: UpdateLeaveEnrollmentInput;
};


export type MutationUpdateLeaveReinstatementArgs = {
  id: Scalars['ID']['input'];
  input: UpdateLeaveReinstatementInput;
};


export type MutationUpdateLeaveTypeArgs = {
  id: Scalars['ID']['input'];
  input: UpdateLeaveTypeInput;
};


export type MutationUpdateLoanRepaymentArgs = {
  id: Scalars['ID']['input'];
  input: LoanRepaymentInput;
};


export type MutationUpdateMaterialReceiptArgs = {
  id: Scalars['ID']['input'];
  input: UpdateMaterialReceiptInput;
};


export type MutationUpdateModuleWorkspaceRecordArgs = {
  detail?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  snapshot?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdateOpportunityArgs = {
  id: Scalars['ID']['input'];
  input: OpportunityInput;
};


export type MutationUpdateOrganizationArgs = {
  id: Scalars['ID']['input'];
  input: UpdateOrganizationInput;
};


export type MutationUpdatePayrollManagementArgs = {
  id: Scalars['ID']['input'];
  input: PayrollManagementInput;
};


export type MutationUpdatePayrollUiRecordArgs = {
  id: Scalars['ID']['input'];
  input: PayrollUiRecordInput;
};


export type MutationUpdateProductArgs = {
  id: Scalars['ID']['input'];
  input: UpdateProductInput;
};


export type MutationUpdateProductionPlanningArgs = {
  id: Scalars['ID']['input'];
  input: ProductionPlanningInput;
};


export type MutationUpdateProjectArgs = {
  id: Scalars['ID']['input'];
  input: UpdateProjectInput;
};


export type MutationUpdatePurchaseOrderArgs = {
  id: Scalars['ID']['input'];
  input: UpdatePurchaseOrderInput;
};


export type MutationUpdateQuotationArgs = {
  id: Scalars['ID']['input'];
  input: UpdateQuotationInput;
};


export type MutationUpdateRawMaterialRequisitionArgs = {
  id: Scalars['ID']['input'];
  input: RawMaterialRequisitionInput;
};


export type MutationUpdateReconciliationRuleArgs = {
  id: Scalars['ID']['input'];
  input: ReconciliationRulePatch;
};


export type MutationUpdateRecruitmentArgs = {
  id: Scalars['ID']['input'];
  input: RecruitmentInput;
};


export type MutationUpdateRoleArgs = {
  id: Scalars['ID']['input'];
  input: UpdateRoleInput;
};


export type MutationUpdateSalaryProcessingArgs = {
  id: Scalars['ID']['input'];
  input: SalaryProcessingInput;
};


export type MutationUpdateSalesEnquiryArgs = {
  id: Scalars['ID']['input'];
  input: UpdateSalesEnquiryInput;
};


export type MutationUpdateSalesOrderArgs = {
  id: Scalars['ID']['input'];
  input: UpdateSalesOrderInput;
};


export type MutationUpdateSalesQuotationArgs = {
  id: Scalars['ID']['input'];
  input: UpdateSalesQuotationInput;
};


export type MutationUpdateSalesReturnArgs = {
  id: Scalars['ID']['input'];
  input: SalesReturnInput;
};


export type MutationUpdateSiteLocationArgs = {
  id: Scalars['ID']['input'];
  input: SiteLocationInput;
};


export type MutationUpdateStockAdjustmentArgs = {
  id: Scalars['ID']['input'];
  input: UpdateStockAdjustmentInput;
};


export type MutationUpdateStockTransferArgs = {
  id: Scalars['ID']['input'];
  input: UpdateStockTransferInput;
};


export type MutationUpdateUserArgs = {
  id: Scalars['ID']['input'];
  input: UpdateUserInput;
};


export type MutationUpdateVendorArgs = {
  id: Scalars['ID']['input'];
  input: UpdateVendorInput;
};


export type MutationUpdateVendorBillArgs = {
  id: Scalars['ID']['input'];
  input: UpdateVendorBillInput;
};


export type MutationUpdateVendorCreditArgs = {
  id: Scalars['ID']['input'];
  input: UpdateVendorCreditInput;
};


export type MutationUpdateVendorPaymentArgs = {
  id: Scalars['ID']['input'];
  input: UpdateVendorPaymentInput;
};


export type MutationUpdateVendorPrepaymentArgs = {
  id: Scalars['ID']['input'];
  input: UpdateVendorPrepaymentInput;
};


export type MutationUpdateWarehouseArgs = {
  id: Scalars['ID']['input'];
  input: WarehouseInput;
};


export type MutationUpdateWarehouseBinArgs = {
  id: Scalars['ID']['input'];
  input: WarehouseBinInput;
};


export type MutationUpdateWorkOrderArgs = {
  id: Scalars['ID']['input'];
  input: WorkOrderInput;
};


export type MutationUpsertIndividualPriceListArgs = {
  input: UpsertIndividualPriceListInput;
};

export type Opportunity = {
  __typename?: 'Opportunity';
  accountName?: Maybe<Scalars['String']['output']>;
  amount?: Maybe<Scalars['Float']['output']>;
  assignedTo?: Maybe<Scalars['ID']['output']>;
  closeDate?: Maybe<Scalars['String']['output']>;
  contactName?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  leadSource?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  nextStep?: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['String']['output'];
  phone?: Maybe<Scalars['String']['output']>;
  probability?: Maybe<Scalars['Int']['output']>;
  seqNo?: Maybe<Scalars['String']['output']>;
  stage: Scalars['String']['output'];
};

export type OpportunityInput = {
  accountName?: InputMaybe<Scalars['String']['input']>;
  amount?: InputMaybe<Scalars['Float']['input']>;
  assignedTo?: InputMaybe<Scalars['ID']['input']>;
  closeDate?: InputMaybe<Scalars['String']['input']>;
  contactName?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  leadSource?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  nextStep?: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['String']['input'];
  phone?: InputMaybe<Scalars['String']['input']>;
  probability?: InputMaybe<Scalars['Int']['input']>;
  stage?: InputMaybe<Scalars['String']['input']>;
};

export type Organization = {
  __typename?: 'Organization';
  address?: Maybe<Scalars['String']['output']>;
  code?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  email?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  moduleApprovers: Array<OrganizationModuleApprover>;
  name: Scalars['String']['output'];
  phone?: Maybe<Scalars['String']['output']>;
  seqNo: Scalars['String']['output'];
  status: Scalars['String']['output'];
};

/** Which user under the organization acts as workflow approver for a given ERP module. */
export type OrganizationModuleApprover = {
  __typename?: 'OrganizationModuleApprover';
  approverUserId?: Maybe<Scalars['ID']['output']>;
  moduleKey: Scalars['String']['output'];
};

export type OrganizationModuleApproverInput = {
  /** Set to omit or empty to clear the approver for this module. */
  approverUserId?: InputMaybe<Scalars['ID']['input']>;
  moduleKey: Scalars['String']['input'];
};

export type PoLineItem = {
  __typename?: 'POLineItem';
  itemDescription?: Maybe<Scalars['String']['output']>;
  itemId?: Maybe<Scalars['ID']['output']>;
  lineTotal?: Maybe<Scalars['Float']['output']>;
  quantity?: Maybe<Scalars['Float']['output']>;
  unitPrice?: Maybe<Scalars['Float']['output']>;
};

export type PoLineItemInput = {
  itemDescription: Scalars['String']['input'];
  itemId?: InputMaybe<Scalars['ID']['input']>;
  lineTotal: Scalars['Float']['input'];
  quantity: Scalars['Float']['input'];
  unitPrice: Scalars['Float']['input'];
};

export type PayrollManagement = {
  __typename?: 'PayrollManagement';
  createdAt: Scalars['String']['output'];
  docDate: Scalars['String']['output'];
  docNumber: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  organizationId: Scalars['String']['output'];
  payPeriodEnd?: Maybe<Scalars['String']['output']>;
  payPeriodStart?: Maybe<Scalars['String']['output']>;
  remarks?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  title?: Maybe<Scalars['String']['output']>;
};

export type PayrollManagementInput = {
  docDate: Scalars['String']['input'];
  organizationId: Scalars['String']['input'];
  payPeriodEnd?: InputMaybe<Scalars['String']['input']>;
  payPeriodStart?: InputMaybe<Scalars['String']['input']>;
  remarks?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type PayrollUiRecord = {
  __typename?: 'PayrollUiRecord';
  approvalStatus: Scalars['String']['output'];
  category: Scalars['String']['output'];
  code?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  data: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  organizationId: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type PayrollUiRecordInput = {
  category: Scalars['String']['input'];
  code?: InputMaybe<Scalars['String']['input']>;
  data: Scalars['String']['input'];
  organizationId: Scalars['String']['input'];
};

export type Permission = {
  __typename?: 'Permission';
  actions: Array<Scalars['String']['output']>;
  resource: Scalars['String']['output'];
};

export type PermissionInput = {
  actions: Array<Scalars['String']['input']>;
  resource: Scalars['String']['input'];
};

export type PriceList = {
  __typename?: 'PriceList';
  categoryFilter?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  generatedAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lines: Array<PriceListLine>;
  listNumber: Scalars['String']['output'];
  organizationId: Scalars['String']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type PriceListLine = {
  __typename?: 'PriceListLine';
  category?: Maybe<Scalars['String']['output']>;
  itemId: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  rate?: Maybe<Scalars['Float']['output']>;
  seqNo?: Maybe<Scalars['String']['output']>;
  unit?: Maybe<Scalars['String']['output']>;
};

export type Product = {
  __typename?: 'Product';
  barcode?: Maybe<Scalars['String']['output']>;
  brand?: Maybe<Scalars['String']['output']>;
  category?: Maybe<Scalars['String']['output']>;
  costPrice?: Maybe<Scalars['Float']['output']>;
  createdAt: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  images?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  maxStockLevel?: Maybe<Scalars['Float']['output']>;
  minStockLevel?: Maybe<Scalars['Float']['output']>;
  name: Scalars['String']['output'];
  organizationId: Scalars['ID']['output'];
  price: Scalars['Float']['output'];
  reorderPoint?: Maybe<Scalars['Float']['output']>;
  seqNo?: Maybe<Scalars['String']['output']>;
  sku: Scalars['String']['output'];
  status: Scalars['String']['output'];
  taxRate?: Maybe<Scalars['Float']['output']>;
  unit: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type ProductionPlanning = {
  __typename?: 'ProductionPlanning';
  actualCost?: Maybe<Scalars['Float']['output']>;
  budget?: Maybe<Scalars['Float']['output']>;
  createdAt: Scalars['String']['output'];
  docDate: Scalars['String']['output'];
  docNumber: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  managerId?: Maybe<Scalars['ID']['output']>;
  milestones?: Maybe<Array<Milestone>>;
  organizationId: Scalars['String']['output'];
  progress?: Maybe<Scalars['Float']['output']>;
  projectId?: Maybe<Scalars['ID']['output']>;
  status: Scalars['String']['output'];
  tasks?: Maybe<Array<Task>>;
};

export type ProductionPlanningInput = {
  actualCost?: InputMaybe<Scalars['Float']['input']>;
  budget?: InputMaybe<Scalars['Float']['input']>;
  docDate: Scalars['String']['input'];
  managerId?: InputMaybe<Scalars['ID']['input']>;
  milestones?: InputMaybe<Array<MilestoneInput>>;
  organizationId: Scalars['String']['input'];
  progress?: InputMaybe<Scalars['Float']['input']>;
  projectId?: InputMaybe<Scalars['ID']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  tasks?: InputMaybe<Array<TaskInput>>;
};

export type Project = {
  __typename?: 'Project';
  createdAt?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  endDate?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  /** draft | submitted | approval_declined | approved — omitted on legacy rows means approved */
  orgApprovalStatus: Scalars['String']['output'];
  organizationId: Scalars['ID']['output'];
  seqNo?: Maybe<Scalars['String']['output']>;
  startDate?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
};

export type PurchaseOrder = {
  __typename?: 'PurchaseOrder';
  createdAt?: Maybe<Scalars['String']['output']>;
  deliveryDate?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  items?: Maybe<Array<PoLineItem>>;
  notes?: Maybe<Scalars['String']['output']>;
  orderDate?: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['ID']['output'];
  projectId?: Maybe<Scalars['ID']['output']>;
  projectName?: Maybe<Scalars['String']['output']>;
  seqNo?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  subtotal?: Maybe<Scalars['Float']['output']>;
  taxAmount?: Maybe<Scalars['Float']['output']>;
  totalAmount?: Maybe<Scalars['Float']['output']>;
  updatedAt?: Maybe<Scalars['String']['output']>;
  vendor?: Maybe<Vendor>;
  vendorId?: Maybe<Scalars['ID']['output']>;
  vendorName?: Maybe<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  _empty?: Maybe<Scalars['String']['output']>;
  allocationSchedule?: Maybe<AllocationSchedule>;
  allocationSchedules: Array<AllocationSchedule>;
  applicant?: Maybe<Applicant>;
  applicants: Array<Applicant>;
  asset?: Maybe<Asset>;
  assets: Array<Asset>;
  attendance?: Maybe<Attendance>;
  attendances: Array<Attendance>;
  availableVendorCredits: Array<VendorCredit>;
  availableVendorPrepayments: Array<VendorPrepayment>;
  bankAccount?: Maybe<BankAccount>;
  bankAccounts: Array<BankAccount>;
  bankStatementLines: Array<BankStatementLine>;
  budget?: Maybe<Budget>;
  budgets: Array<Budget>;
  career?: Maybe<Career>;
  careers: Array<Career>;
  cashBank?: Maybe<CashBank>;
  cashBanks: Array<CashBank>;
  cashSalesRefundCandidates: Array<SalesOrder>;
  chartOfAccount?: Maybe<ChartOfAccounts>;
  chartOfAccounts: Array<ChartOfAccounts>;
  client?: Maybe<Client>;
  clients: Array<Client>;
  clientsByOrganization: Array<Client>;
  clientsByStatus: Array<Client>;
  contractor?: Maybe<Contractor>;
  contractors: Array<Contractor>;
  currencyRevaluation?: Maybe<CurrencyRevaluation>;
  currencyRevaluations: Array<CurrencyRevaluation>;
  customer?: Maybe<Customer>;
  customerDeposit?: Maybe<CustomerDeposit>;
  customerDeposits: Array<CustomerDeposit>;
  customerPayment?: Maybe<CustomerPayment>;
  customerPayments: Array<CustomerPayment>;
  customerPaymentsByCustomer: Array<CustomerPayment>;
  customerRefund?: Maybe<CustomerRefund>;
  customerRefunds: Array<CustomerRefund>;
  customerinvoice?: Maybe<CustomerInvoice>;
  customerinvoices: Array<CustomerInvoice>;
  customers: Array<Customer>;
  deliverychallan?: Maybe<DeliveryChallan>;
  deliverychallans: Array<DeliveryChallan>;
  dvs?: Maybe<Dvs>;
  dvsRecords: Array<Dvs>;
  epm?: Maybe<Epm>;
  epms: Array<Epm>;
  exciseinvoice?: Maybe<ExciseInvoice>;
  exciseinvoices: Array<ExciseInvoice>;
  extraction?: Maybe<Extraction>;
  extractions: Array<Extraction>;
  financeChargeAssessment?: Maybe<FinanceChargeAssessment>;
  financeChargeAssessments: Array<FinanceChargeAssessment>;
  generalLedger?: Maybe<GeneralLedger>;
  generalLedgers: Array<GeneralLedger>;
  generateCustomerStatement: CustomerStatement;
  goodsreceipt?: Maybe<GoodsReceipt>;
  goodsreceipts: Array<GoodsReceipt>;
  grn?: Maybe<Grn>;
  grns: Array<Grn>;
  grnsByPO: Array<Grn>;
  individualPriceList?: Maybe<IndividualPriceList>;
  individualPriceListByCustomer?: Maybe<IndividualPriceList>;
  individualPriceLists: Array<IndividualPriceList>;
  intercompanyTransfer?: Maybe<IntercompanyTransfer>;
  intercompanyTransfers: Array<IntercompanyTransfer>;
  internalorder?: Maybe<InternalOrder>;
  internalorders: Array<InternalOrder>;
  inventoryControl?: Maybe<InventoryControl>;
  inventoryControls: Array<InventoryControl>;
  inventoryreturn?: Maybe<InventoryReturn>;
  inventoryreturns: Array<InventoryReturn>;
  invoiceBillableCustomers: Array<Customer>;
  ipinspection?: Maybe<IpInspection>;
  ipinspections: Array<IpInspection>;
  item?: Maybe<Item>;
  items: Array<Item>;
  journalEntries: Array<JournalEntry>;
  journalEntry?: Maybe<JournalEntry>;
  lead?: Maybe<Lead>;
  leads: Array<Lead>;
  leaveApplication?: Maybe<LeaveApplication>;
  leaveApplications: Array<LeaveApplication>;
  leaveEnrollment?: Maybe<LeaveEnrollment>;
  leaveEnrollments: Array<LeaveEnrollment>;
  leaveReinstatement?: Maybe<LeaveReinstatement>;
  leaveReinstatements: Array<LeaveReinstatement>;
  leaveType?: Maybe<LeaveType>;
  leaveTypes: Array<LeaveType>;
  loanrepayment?: Maybe<LoanRepayment>;
  loanrepayments: Array<LoanRepayment>;
  lowStockItems: Array<InventoryControl>;
  materialreceipt?: Maybe<MaterialReceipt>;
  materialreceipts: Array<MaterialReceipt>;
  materialreceiptsByPO: Array<MaterialReceipt>;
  me?: Maybe<User>;
  moduleWorkspaceRecords: Array<ModuleWorkspaceRecord>;
  /** Approval tasks assigned to the current user (same organization). */
  myPendingApprovalRequests: Array<ApprovalRequest>;
  opportunities: Array<Opportunity>;
  opportunity?: Maybe<Opportunity>;
  organization?: Maybe<Organization>;
  organizations: Array<Organization>;
  outstandingVendorBills: Array<VendorBill>;
  payrollmanagement?: Maybe<PayrollManagement>;
  payrollmanagements: Array<PayrollManagement>;
  payrolluirecord?: Maybe<PayrollUiRecord>;
  payrolluirecords: Array<PayrollUiRecord>;
  priceList?: Maybe<PriceList>;
  priceLists: Array<PriceList>;
  product?: Maybe<Product>;
  productionplanning?: Maybe<ProductionPlanning>;
  productionplannings: Array<ProductionPlanning>;
  products: Array<Product>;
  productsByCategory: Array<Product>;
  productsByOrganization: Array<Product>;
  productsByStatus: Array<Product>;
  project?: Maybe<Project>;
  projects: Array<Project>;
  purchaseorder?: Maybe<PurchaseOrder>;
  purchaseorders: Array<PurchaseOrder>;
  quotation?: Maybe<Quotation>;
  quotations: Array<Quotation>;
  quotationsByClient: Array<Quotation>;
  quotationsByOrganization: Array<Quotation>;
  quotationsByStatus: Array<Quotation>;
  rawMaterialRequisition?: Maybe<RawMaterialRequisition>;
  rawMaterialRequisitions: Array<RawMaterialRequisition>;
  reconciliationRules: Array<ReconciliationRule>;
  recruitment?: Maybe<Recruitment>;
  recruitments: Array<Recruitment>;
  returnAuthorization?: Maybe<ReturnAuthorization>;
  returnAuthorizations: Array<ReturnAuthorization>;
  role?: Maybe<Role>;
  roles: Array<Role>;
  rolesByOrganization: Array<Role>;
  salaryprocessing?: Maybe<SalaryProcessing>;
  salaryprocessings: Array<SalaryProcessing>;
  salesEnquiries: Array<SalesEnquiry>;
  salesEnquiriesByAssignedTo: Array<SalesEnquiry>;
  salesEnquiriesByClient: Array<SalesEnquiry>;
  salesEnquiriesByStatus: Array<SalesEnquiry>;
  salesEnquiry?: Maybe<SalesEnquiry>;
  salesQuotation?: Maybe<SalesQuotation>;
  salesQuotations: Array<SalesQuotation>;
  salesQuotationsByClient: Array<SalesQuotation>;
  salesQuotationsByEnquiry: Array<SalesQuotation>;
  salesQuotationsByStatus: Array<SalesQuotation>;
  salesorder?: Maybe<SalesOrder>;
  salesorders: Array<SalesOrder>;
  salesreturn?: Maybe<SalesReturn>;
  salesreturns: Array<SalesReturn>;
  siteLocation?: Maybe<SiteLocation>;
  siteLocations: Array<SiteLocation>;
  stockMovement?: Maybe<StockMovement>;
  stockMovements: Array<StockMovement>;
  stockadjustment?: Maybe<StockAdjustment>;
  stockadjustments: Array<StockAdjustment>;
  stocktransfer?: Maybe<StockTransfer>;
  stocktransfers: Array<StockTransfer>;
  systemRoles: Array<Role>;
  user?: Maybe<User>;
  userByEmail?: Maybe<User>;
  usersByOrganization: UserList;
  usersByRole: Array<User>;
  vendor?: Maybe<Vendor>;
  vendorBill?: Maybe<VendorBill>;
  vendorBills: Array<VendorBill>;
  vendorBillsByVendor: Array<VendorBill>;
  vendorCredit?: Maybe<VendorCredit>;
  vendorCredits: Array<VendorCredit>;
  vendorPayment?: Maybe<VendorPayment>;
  vendorPayments: Array<VendorPayment>;
  vendorPaymentsByVendor: Array<VendorPayment>;
  vendorPrepayment?: Maybe<VendorPrepayment>;
  vendorPrepayments: Array<VendorPrepayment>;
  vendors: Array<Vendor>;
  warehouse?: Maybe<Warehouse>;
  warehouseBin?: Maybe<WarehouseBin>;
  warehouseBins: Array<WarehouseBin>;
  warehouses: Array<Warehouse>;
  workorder?: Maybe<WorkOrder>;
  workorders: Array<WorkOrder>;
};


export type QueryAllocationScheduleArgs = {
  id: Scalars['ID']['input'];
};


export type QueryAllocationSchedulesArgs = {
  organizationId: Scalars['String']['input'];
};


export type QueryApplicantArgs = {
  id: Scalars['ID']['input'];
};


export type QueryApplicantsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['String']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};


export type QueryAssetArgs = {
  id: Scalars['ID']['input'];
};


export type QueryAssetsArgs = {
  assetType?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['String']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};


export type QueryAttendanceArgs = {
  id: Scalars['ID']['input'];
};


export type QueryAttendancesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['ID']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  userId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryAvailableVendorCreditsArgs = {
  organizationId: Scalars['ID']['input'];
  vendorId: Scalars['ID']['input'];
};


export type QueryAvailableVendorPrepaymentsArgs = {
  organizationId: Scalars['ID']['input'];
  vendorId: Scalars['ID']['input'];
};


export type QueryBankAccountArgs = {
  id: Scalars['ID']['input'];
};


export type QueryBankAccountsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['String']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryBankStatementLinesArgs = {
  bankAccount: Scalars['String']['input'];
  onlyUnmatched?: InputMaybe<Scalars['Boolean']['input']>;
  organizationId: Scalars['String']['input'];
};


export type QueryBudgetArgs = {
  id: Scalars['ID']['input'];
};


export type QueryBudgetsArgs = {
  fiscalYear?: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['String']['input'];
};


export type QueryCareerArgs = {
  id: Scalars['ID']['input'];
};


export type QueryCareersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['String']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};


export type QueryCashBankArgs = {
  id: Scalars['ID']['input'];
};


export type QueryCashBanksArgs = {
  bankAccount?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['String']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  reconciliationStatus?: InputMaybe<Scalars['String']['input']>;
};


export type QueryCashSalesRefundCandidatesArgs = {
  organizationId: Scalars['ID']['input'];
};


export type QueryChartOfAccountArgs = {
  id: Scalars['ID']['input'];
};


export type QueryChartOfAccountsArgs = {
  accountType?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['String']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryClientArgs = {
  id: Scalars['ID']['input'];
};


export type QueryClientsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  organizationId?: InputMaybe<Scalars['ID']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};


export type QueryClientsByOrganizationArgs = {
  organizationId: Scalars['ID']['input'];
};


export type QueryClientsByStatusArgs = {
  organizationId: Scalars['ID']['input'];
  status: Scalars['String']['input'];
};


export type QueryContractorArgs = {
  id: Scalars['ID']['input'];
};


export type QueryContractorsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['String']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryCurrencyRevaluationArgs = {
  id: Scalars['ID']['input'];
};


export type QueryCurrencyRevaluationsArgs = {
  organizationId: Scalars['String']['input'];
};


export type QueryCustomerArgs = {
  id: Scalars['ID']['input'];
};


export type QueryCustomerDepositArgs = {
  id: Scalars['ID']['input'];
};


export type QueryCustomerDepositsArgs = {
  customerId?: InputMaybe<Scalars['ID']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['ID']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryCustomerPaymentArgs = {
  id: Scalars['ID']['input'];
};


export type QueryCustomerPaymentsArgs = {
  customerId?: InputMaybe<Scalars['ID']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['ID']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryCustomerPaymentsByCustomerArgs = {
  customerId: Scalars['ID']['input'];
};


export type QueryCustomerRefundArgs = {
  id: Scalars['ID']['input'];
};


export type QueryCustomerRefundsArgs = {
  customerId?: InputMaybe<Scalars['ID']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['ID']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryCustomerinvoiceArgs = {
  id: Scalars['ID']['input'];
};


export type QueryCustomerinvoicesArgs = {
  customerId?: InputMaybe<Scalars['ID']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['ID']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};


export type QueryCustomersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['String']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryDeliverychallanArgs = {
  id: Scalars['ID']['input'];
};


export type QueryDeliverychallansArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['String']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryDvsArgs = {
  id: Scalars['ID']['input'];
};


export type QueryDvsRecordsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['String']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};


export type QueryEpmArgs = {
  id: Scalars['ID']['input'];
};


export type QueryEpmsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['String']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};


export type QueryExciseinvoiceArgs = {
  id: Scalars['ID']['input'];
};


export type QueryExciseinvoicesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['String']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryExtractionArgs = {
  id: Scalars['ID']['input'];
};


export type QueryExtractionsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['String']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};


export type QueryFinanceChargeAssessmentArgs = {
  id: Scalars['ID']['input'];
};


export type QueryFinanceChargeAssessmentsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['String']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGeneralLedgerArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGeneralLedgersArgs = {
  fiscalYear?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['String']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGenerateCustomerStatementArgs = {
  customerId: Scalars['ID']['input'];
  dateFrom: Scalars['String']['input'];
  dateTo: Scalars['String']['input'];
  organizationId: Scalars['String']['input'];
};


export type QueryGoodsreceiptArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGoodsreceiptsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['String']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGrnArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGrnsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['ID']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGrnsByPoArgs = {
  purchaseOrderId: Scalars['ID']['input'];
};


export type QueryIndividualPriceListArgs = {
  id: Scalars['ID']['input'];
};


export type QueryIndividualPriceListByCustomerArgs = {
  customerId: Scalars['ID']['input'];
  organizationId: Scalars['String']['input'];
};


export type QueryIndividualPriceListsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['String']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryIntercompanyTransferArgs = {
  id: Scalars['ID']['input'];
};


export type QueryIntercompanyTransfersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['ID']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryInternalorderArgs = {
  id: Scalars['ID']['input'];
};


export type QueryInternalordersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['String']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryInventoryControlArgs = {
  id: Scalars['ID']['input'];
};


export type QueryInventoryControlsArgs = {
  organizationId: Scalars['String']['input'];
  stockStatus?: InputMaybe<Scalars['String']['input']>;
  warehouseId?: InputMaybe<Scalars['String']['input']>;
};


export type QueryInventoryreturnArgs = {
  id: Scalars['ID']['input'];
};


export type QueryInventoryreturnsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['String']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryInvoiceBillableCustomersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['String']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryIpinspectionArgs = {
  id: Scalars['ID']['input'];
};


export type QueryIpinspectionsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['String']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryItemArgs = {
  id: Scalars['ID']['input'];
};


export type QueryItemsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['ID']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryJournalEntriesArgs = {
  organizationId: Scalars['String']['input'];
  status?: InputMaybe<Scalars['String']['input']>;
};


export type QueryJournalEntryArgs = {
  id: Scalars['ID']['input'];
};


export type QueryLeadArgs = {
  id: Scalars['ID']['input'];
};


export type QueryLeadsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['String']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};


export type QueryLeaveApplicationArgs = {
  id: Scalars['ID']['input'];
};


export type QueryLeaveApplicationsArgs = {
  organizationId: Scalars['ID']['input'];
  status?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryLeaveEnrollmentArgs = {
  id: Scalars['ID']['input'];
};


export type QueryLeaveEnrollmentsArgs = {
  calendarYear?: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['ID']['input'];
  userId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryLeaveReinstatementArgs = {
  id: Scalars['ID']['input'];
};


export type QueryLeaveReinstatementsArgs = {
  organizationId: Scalars['ID']['input'];
  status?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryLeaveTypeArgs = {
  id: Scalars['ID']['input'];
};


export type QueryLeaveTypesArgs = {
  activeOnly?: InputMaybe<Scalars['Boolean']['input']>;
  organizationId: Scalars['ID']['input'];
};


export type QueryLoanrepaymentArgs = {
  id: Scalars['ID']['input'];
};


export type QueryLoanrepaymentsArgs = {
  organizationId: Scalars['String']['input'];
};


export type QueryLowStockItemsArgs = {
  organizationId: Scalars['String']['input'];
};


export type QueryMaterialreceiptArgs = {
  id: Scalars['ID']['input'];
};


export type QueryMaterialreceiptsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['ID']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};


export type QueryMaterialreceiptsByPoArgs = {
  purchaseOrderId: Scalars['ID']['input'];
};


export type QueryModuleWorkspaceRecordsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['ID']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  routePath: Scalars['String']['input'];
};


export type QueryOpportunitiesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['String']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  stage?: InputMaybe<Scalars['String']['input']>;
};


export type QueryOpportunityArgs = {
  id: Scalars['ID']['input'];
};


export type QueryOrganizationArgs = {
  id: Scalars['ID']['input'];
};


export type QueryOrganizationsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryOutstandingVendorBillsArgs = {
  organizationId: Scalars['ID']['input'];
};


export type QueryPayrollmanagementArgs = {
  id: Scalars['ID']['input'];
};


export type QueryPayrollmanagementsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['String']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryPayrolluirecordArgs = {
  id: Scalars['ID']['input'];
};


export type QueryPayrolluirecordsArgs = {
  category: Scalars['String']['input'];
  organizationId: Scalars['String']['input'];
};


export type QueryPriceListArgs = {
  id: Scalars['ID']['input'];
};


export type QueryPriceListsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['String']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryProductArgs = {
  id: Scalars['ID']['input'];
};


export type QueryProductionplanningArgs = {
  id: Scalars['ID']['input'];
};


export type QueryProductionplanningsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['String']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryProductsByCategoryArgs = {
  category: Scalars['String']['input'];
  organizationId: Scalars['ID']['input'];
};


export type QueryProductsByOrganizationArgs = {
  organizationId: Scalars['ID']['input'];
};


export type QueryProductsByStatusArgs = {
  organizationId: Scalars['ID']['input'];
  status: Scalars['String']['input'];
};


export type QueryProjectArgs = {
  id: Scalars['ID']['input'];
};


export type QueryProjectsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['ID']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryPurchaseorderArgs = {
  id: Scalars['ID']['input'];
};


export type QueryPurchaseordersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['ID']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};


export type QueryQuotationArgs = {
  id: Scalars['ID']['input'];
};


export type QueryQuotationsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  organizationId?: InputMaybe<Scalars['ID']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};


export type QueryQuotationsByClientArgs = {
  clientId: Scalars['ID']['input'];
};


export type QueryQuotationsByOrganizationArgs = {
  organizationId: Scalars['ID']['input'];
};


export type QueryQuotationsByStatusArgs = {
  organizationId: Scalars['ID']['input'];
  status: Scalars['String']['input'];
};


export type QueryRawMaterialRequisitionArgs = {
  id: Scalars['ID']['input'];
};


export type QueryRawMaterialRequisitionsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['String']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};


export type QueryReconciliationRulesArgs = {
  organizationId: Scalars['String']['input'];
};


export type QueryRecruitmentArgs = {
  id: Scalars['ID']['input'];
};


export type QueryRecruitmentsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['String']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};


export type QueryReturnAuthorizationArgs = {
  id: Scalars['ID']['input'];
};


export type QueryReturnAuthorizationsArgs = {
  customerId?: InputMaybe<Scalars['ID']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['String']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  receiptComplete?: InputMaybe<Scalars['Boolean']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};


export type QueryRoleArgs = {
  id: Scalars['ID']['input'];
};


export type QueryRolesByOrganizationArgs = {
  organizationId: Scalars['ID']['input'];
};


export type QuerySalaryprocessingArgs = {
  id: Scalars['ID']['input'];
};


export type QuerySalaryprocessingsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['String']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
};


export type QuerySalesEnquiriesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['ID']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};


export type QuerySalesEnquiriesByAssignedToArgs = {
  userId: Scalars['ID']['input'];
};


export type QuerySalesEnquiriesByClientArgs = {
  clientId: Scalars['ID']['input'];
};


export type QuerySalesEnquiriesByStatusArgs = {
  status: Scalars['String']['input'];
};


export type QuerySalesEnquiryArgs = {
  id: Scalars['ID']['input'];
};


export type QuerySalesQuotationArgs = {
  id: Scalars['ID']['input'];
};


export type QuerySalesQuotationsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['ID']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};


export type QuerySalesQuotationsByClientArgs = {
  clientId: Scalars['ID']['input'];
};


export type QuerySalesQuotationsByEnquiryArgs = {
  enquiryId: Scalars['ID']['input'];
};


export type QuerySalesQuotationsByStatusArgs = {
  status: Scalars['String']['input'];
};


export type QuerySalesorderArgs = {
  id: Scalars['ID']['input'];
};


export type QuerySalesordersArgs = {
  cashSale?: InputMaybe<Scalars['Boolean']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['ID']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};


export type QuerySalesreturnArgs = {
  id: Scalars['ID']['input'];
};


export type QuerySalesreturnsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['String']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
};


export type QuerySiteLocationArgs = {
  id: Scalars['ID']['input'];
};


export type QuerySiteLocationsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['String']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryStockMovementArgs = {
  id: Scalars['ID']['input'];
};


export type QueryStockMovementsArgs = {
  itemId?: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['String']['input'];
};


export type QueryStockadjustmentArgs = {
  id: Scalars['ID']['input'];
};


export type QueryStockadjustmentsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['ID']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryStocktransferArgs = {
  id: Scalars['ID']['input'];
};


export type QueryStocktransfersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['ID']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUserByEmailArgs = {
  email: Scalars['String']['input'];
};


export type QueryUsersByOrganizationArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['ID']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};


export type QueryUsersByRoleArgs = {
  role: Scalars['String']['input'];
};


export type QueryVendorArgs = {
  id: Scalars['ID']['input'];
};


export type QueryVendorBillArgs = {
  id: Scalars['ID']['input'];
};


export type QueryVendorBillsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['ID']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  vendorId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryVendorBillsByVendorArgs = {
  vendorId: Scalars['ID']['input'];
};


export type QueryVendorCreditArgs = {
  id: Scalars['ID']['input'];
};


export type QueryVendorCreditsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['ID']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  vendorId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryVendorPaymentArgs = {
  id: Scalars['ID']['input'];
};


export type QueryVendorPaymentsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['ID']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  vendorId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryVendorPaymentsByVendorArgs = {
  vendorId: Scalars['ID']['input'];
};


export type QueryVendorPrepaymentArgs = {
  id: Scalars['ID']['input'];
};


export type QueryVendorPrepaymentsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['ID']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  vendorId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryVendorsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['ID']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};


export type QueryWarehouseArgs = {
  id: Scalars['ID']['input'];
};


export type QueryWarehouseBinArgs = {
  id: Scalars['ID']['input'];
};


export type QueryWarehouseBinsArgs = {
  organizationId: Scalars['String']['input'];
  warehouseId?: InputMaybe<Scalars['String']['input']>;
};


export type QueryWarehousesArgs = {
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  organizationId: Scalars['String']['input'];
};


export type QueryWorkorderArgs = {
  id: Scalars['ID']['input'];
};


export type QueryWorkordersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['String']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
};

export type Quotation = {
  __typename?: 'Quotation';
  clientId: ClientRef;
  createdAt: Scalars['String']['output'];
  createdBy?: Maybe<Scalars['ID']['output']>;
  discountAmount?: Maybe<Scalars['Float']['output']>;
  id: Scalars['ID']['output'];
  lineItems: Array<QuotationLineItem>;
  notes?: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['ID']['output'];
  quotationDate: Scalars['String']['output'];
  quotationNumber: Scalars['String']['output'];
  sentAt?: Maybe<Scalars['String']['output']>;
  sentBy?: Maybe<Scalars['ID']['output']>;
  seqNo?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  subject: Scalars['String']['output'];
  subtotal: Scalars['Float']['output'];
  taxAmount?: Maybe<Scalars['Float']['output']>;
  terms?: Maybe<Scalars['String']['output']>;
  totalAmount: Scalars['Float']['output'];
  updatedAt: Scalars['String']['output'];
  validUntil: Scalars['String']['output'];
};

export type QuotationItem = {
  __typename?: 'QuotationItem';
  amount: Scalars['Float']['output'];
  description?: Maybe<Scalars['String']['output']>;
  discount: Scalars['Float']['output'];
  itemName: Scalars['String']['output'];
  quantity: Scalars['Float']['output'];
  tax: Scalars['Float']['output'];
  unit: Scalars['String']['output'];
  unitPrice: Scalars['Float']['output'];
};

export type QuotationItemInput = {
  amount: Scalars['Float']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  discount?: InputMaybe<Scalars['Float']['input']>;
  itemName: Scalars['String']['input'];
  quantity: Scalars['Float']['input'];
  tax?: InputMaybe<Scalars['Float']['input']>;
  unit?: InputMaybe<Scalars['String']['input']>;
  unitPrice: Scalars['Float']['input'];
};

export type QuotationLineItem = {
  __typename?: 'QuotationLineItem';
  description: Scalars['String']['output'];
  discount?: Maybe<Scalars['Float']['output']>;
  itemId?: Maybe<Scalars['ID']['output']>;
  quantity: Scalars['Float']['output'];
  tax?: Maybe<Scalars['Float']['output']>;
  total: Scalars['Float']['output'];
  unitPrice: Scalars['Float']['output'];
};

export type QuotationLineItemInput = {
  description: Scalars['String']['input'];
  discount?: InputMaybe<Scalars['Float']['input']>;
  itemId?: InputMaybe<Scalars['ID']['input']>;
  quantity: Scalars['Float']['input'];
  tax?: InputMaybe<Scalars['Float']['input']>;
  total: Scalars['Float']['input'];
  unitPrice: Scalars['Float']['input'];
};

export type RawMaterialRequisition = {
  __typename?: 'RawMaterialRequisition';
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  organizationId: Scalars['String']['output'];
  purpose: Scalars['String']['output'];
  rawMaterialId: Scalars['String']['output'];
  requestedBy: Scalars['String']['output'];
  requestedQuantity: Scalars['Float']['output'];
  requiredDate: Scalars['String']['output'];
  requisitionDate: Scalars['String']['output'];
  requisitionNumber: Scalars['String']['output'];
  status: Scalars['String']['output'];
  unit: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type RawMaterialRequisitionInput = {
  organizationId: Scalars['String']['input'];
  purpose: Scalars['String']['input'];
  rawMaterialId: Scalars['String']['input'];
  requestedQuantity: Scalars['Float']['input'];
  requiredDate: Scalars['String']['input'];
  requisitionDate: Scalars['String']['input'];
  requisitionNumber: Scalars['String']['input'];
  status?: InputMaybe<Scalars['String']['input']>;
  unit: Scalars['String']['input'];
};

export type ReceiveReturnAuthorizationGoodsInput = {
  lines: Array<ReceiveReturnGoodsLineInput>;
  notes?: InputMaybe<Scalars['String']['input']>;
  receivedDate: Scalars['String']['input'];
  returnAuthorizationId: Scalars['ID']['input'];
};

export type ReceiveReturnGoodsLineInput = {
  lineId: Scalars['ID']['input'];
  quantityReceived: Scalars['Float']['input'];
};

export type ReconciliationRule = {
  __typename?: 'ReconciliationRule';
  amountTolerance: Scalars['Float']['output'];
  bankAccount?: Maybe<Scalars['String']['output']>;
  bankLineTextContains: Scalars['String']['output'];
  bookLineTextContains: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['String']['output'];
  priority: Scalars['Int']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
};

export type ReconciliationRuleInput = {
  amountTolerance?: InputMaybe<Scalars['Float']['input']>;
  bankAccount?: InputMaybe<Scalars['String']['input']>;
  bankLineTextContains?: InputMaybe<Scalars['String']['input']>;
  bookLineTextContains?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['String']['input'];
  priority?: InputMaybe<Scalars['Int']['input']>;
};

export type ReconciliationRulePatch = {
  amountTolerance?: InputMaybe<Scalars['Float']['input']>;
  bankAccount?: InputMaybe<Scalars['String']['input']>;
  bankLineTextContains?: InputMaybe<Scalars['String']['input']>;
  bookLineTextContains?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  priority?: InputMaybe<Scalars['Int']['input']>;
};

/** Unified workflow state stored on approvable ERP records (extend per module). */
export type RecordApprovalWorkflowStatus =
  | 'APPROVED'
  | 'DRAFT'
  | 'PENDING_APPROVAL'
  | 'REJECTED';

export type Recruitment = {
  __typename?: 'Recruitment';
  applicantId: Scalars['String']['output'];
  applicationDate: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  feedback?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  interviewDate?: Maybe<Scalars['String']['output']>;
  interviewers?: Maybe<Array<Scalars['String']['output']>>;
  jobId: Scalars['String']['output'];
  joiningDate?: Maybe<Scalars['String']['output']>;
  offerAmount?: Maybe<Scalars['Float']['output']>;
  organizationId: Scalars['String']['output'];
  source: Scalars['String']['output'];
  stage: Scalars['String']['output'];
  status: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type RecruitmentInput = {
  applicantId: Scalars['String']['input'];
  applicationDate: Scalars['String']['input'];
  feedback?: InputMaybe<Scalars['String']['input']>;
  interviewDate?: InputMaybe<Scalars['String']['input']>;
  interviewers?: InputMaybe<Array<Scalars['String']['input']>>;
  jobId: Scalars['String']['input'];
  joiningDate?: InputMaybe<Scalars['String']['input']>;
  offerAmount?: InputMaybe<Scalars['Float']['input']>;
  organizationId: Scalars['String']['input'];
  source: Scalars['String']['input'];
  stage?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};

export type RefundCashSaleInput = {
  amount: Scalars['Float']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  referenceNumber?: InputMaybe<Scalars['String']['input']>;
  refundDate: Scalars['String']['input'];
  refundMethod: Scalars['String']['input'];
  salesOrderId: Scalars['ID']['input'];
};

export type RegisterInput = {
  email: Scalars['String']['input'];
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  organizationId?: InputMaybe<Scalars['ID']['input']>;
  password: Scalars['String']['input'];
};

export type ReturnAuthorization = {
  __typename?: 'ReturnAuthorization';
  approvedAt?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  customer?: Maybe<Customer>;
  customerId: Scalars['ID']['output'];
  goodsReceivedAt?: Maybe<Scalars['String']['output']>;
  goodsReceivedBy?: Maybe<Scalars['ID']['output']>;
  id: Scalars['ID']['output'];
  lines: Array<ReturnAuthorizationLine>;
  notes?: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['String']['output'];
  raNumber: Scalars['String']['output'];
  reason?: Maybe<Scalars['String']['output']>;
  receiptComplete: Scalars['Boolean']['output'];
  receiptNotes?: Maybe<Scalars['String']['output']>;
  rejectionReason?: Maybe<Scalars['String']['output']>;
  requestedDate: Scalars['String']['output'];
  salesOrderId?: Maybe<Scalars['ID']['output']>;
  status: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type ReturnAuthorizationLine = {
  __typename?: 'ReturnAuthorizationLine';
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  itemId?: Maybe<Scalars['ID']['output']>;
  quantity: Scalars['Float']['output'];
  quantityReceived: Scalars['Float']['output'];
};

export type ReturnAuthorizationLineInput = {
  description: Scalars['String']['input'];
  itemId?: InputMaybe<Scalars['ID']['input']>;
  quantity: Scalars['Float']['input'];
};

export type Role = {
  __typename?: 'Role';
  createdAt: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  displayName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isSystemRole: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  organizationId?: Maybe<Scalars['ID']['output']>;
  permissions: Array<Permission>;
  updatedAt: Scalars['String']['output'];
};

export type SaLineItem = {
  __typename?: 'SALineItem';
  adjustedQty: Scalars['Float']['output'];
  currentQty: Scalars['Float']['output'];
  difference: Scalars['Float']['output'];
  itemDescription: Scalars['String']['output'];
  itemId?: Maybe<Scalars['ID']['output']>;
  unit?: Maybe<Scalars['String']['output']>;
};

export type SaLineItemInput = {
  adjustedQty: Scalars['Float']['input'];
  currentQty: Scalars['Float']['input'];
  difference: Scalars['Float']['input'];
  itemDescription: Scalars['String']['input'];
  itemId?: InputMaybe<Scalars['ID']['input']>;
  unit?: InputMaybe<Scalars['String']['input']>;
};

export type StLineItem = {
  __typename?: 'STLineItem';
  itemDescription: Scalars['String']['output'];
  itemId?: Maybe<Scalars['ID']['output']>;
  qty: Scalars['Float']['output'];
  unit?: Maybe<Scalars['String']['output']>;
};

export type StLineItemInput = {
  itemDescription: Scalars['String']['input'];
  itemId?: InputMaybe<Scalars['ID']['input']>;
  qty: Scalars['Float']['input'];
  unit?: InputMaybe<Scalars['String']['input']>;
};

export type SalaryProcessing = {
  __typename?: 'SalaryProcessing';
  createdAt: Scalars['String']['output'];
  docDate: Scalars['String']['output'];
  docNumber: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  organizationId: Scalars['String']['output'];
  payPeriodEnd?: Maybe<Scalars['String']['output']>;
  payPeriodStart?: Maybe<Scalars['String']['output']>;
  remarks?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  title?: Maybe<Scalars['String']['output']>;
};

export type SalaryProcessingInput = {
  docDate: Scalars['String']['input'];
  organizationId: Scalars['String']['input'];
  payPeriodEnd?: InputMaybe<Scalars['String']['input']>;
  payPeriodStart?: InputMaybe<Scalars['String']['input']>;
  remarks?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type SalaryRange = {
  __typename?: 'SalaryRange';
  max: Scalars['Float']['output'];
  min: Scalars['Float']['output'];
};

export type SalaryRangeInput = {
  max: Scalars['Float']['input'];
  min: Scalars['Float']['input'];
};

export type SalesEnquiry = {
  __typename?: 'SalesEnquiry';
  approvalRequestedAt?: Maybe<Scalars['String']['output']>;
  /** Org approval workflow (Draft → Pending → Approved/Rejected). Derived for legacy rows. */
  approvalStatus: RecordApprovalWorkflowStatus;
  approvedAt?: Maybe<Scalars['String']['output']>;
  approvedBy?: Maybe<Scalars['ID']['output']>;
  assignedTo?: Maybe<Scalars['ID']['output']>;
  budget?: Maybe<Scalars['Float']['output']>;
  clientId: Scalars['ID']['output'];
  createdAt: Scalars['String']['output'];
  createdBy?: Maybe<Scalars['ID']['output']>;
  currency?: Maybe<Scalars['String']['output']>;
  enquiryNumber: Scalars['String']['output'];
  enquirySource?: Maybe<Scalars['String']['output']>;
  estimatedEndDate?: Maybe<Scalars['String']['output']>;
  estimatedStartDate?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  location?: Maybe<Scalars['String']['output']>;
  notes?: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['ID']['output'];
  priority: Scalars['String']['output'];
  projectScope?: Maybe<Scalars['String']['output']>;
  projectType?: Maybe<Scalars['String']['output']>;
  seqNo?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  subject?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['String']['output'];
};

export type SalesOrder = {
  __typename?: 'SalesOrder';
  cashSale: Scalars['Boolean']['output'];
  clientId?: Maybe<Scalars['ID']['output']>;
  createdAt: Scalars['String']['output'];
  customerId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  orderDate: Scalars['String']['output'];
  organizationId: Scalars['ID']['output'];
  projectId?: Maybe<Scalars['ID']['output']>;
  quotationId?: Maybe<Scalars['ID']['output']>;
  quotationStatus?: Maybe<Scalars['String']['output']>;
  refundAmount?: Maybe<Scalars['Float']['output']>;
  refundMethod?: Maybe<Scalars['String']['output']>;
  refundNotes?: Maybe<Scalars['String']['output']>;
  refundReferenceNumber?: Maybe<Scalars['String']['output']>;
  refundedAt?: Maybe<Scalars['String']['output']>;
  seqNo: Scalars['String']['output'];
  status: Scalars['String']['output'];
  totalAmount: Scalars['Float']['output'];
};

export type SalesQuotation = {
  __typename?: 'SalesQuotation';
  assignedTo?: Maybe<Scalars['ID']['output']>;
  clientId: Scalars['ID']['output'];
  createdAt: Scalars['String']['output'];
  createdBy: Scalars['ID']['output'];
  currency: Scalars['String']['output'];
  deliveryTerms?: Maybe<Scalars['String']['output']>;
  enquiryId?: Maybe<Scalars['ID']['output']>;
  grandTotal: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  items: Array<QuotationItem>;
  notes?: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['ID']['output'];
  paymentTerms?: Maybe<Scalars['String']['output']>;
  quotationDate: Scalars['String']['output'];
  quotationNumber: Scalars['String']['output'];
  seqNo?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  subject: Scalars['String']['output'];
  subtotal: Scalars['Float']['output'];
  termsAndConditions?: Maybe<Scalars['String']['output']>;
  totalDiscount: Scalars['Float']['output'];
  totalTax: Scalars['Float']['output'];
  updatedAt: Scalars['String']['output'];
  validUntil: Scalars['String']['output'];
};

export type SalesReturn = {
  __typename?: 'SalesReturn';
  createdAt: Scalars['String']['output'];
  docDate: Scalars['String']['output'];
  docNumber: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  organizationId: Scalars['String']['output'];
  status: Scalars['String']['output'];
};

export type SalesReturnInput = {
  docDate: Scalars['String']['input'];
  organizationId: Scalars['String']['input'];
  status?: InputMaybe<Scalars['String']['input']>;
};

export type SendQuotationResult = {
  __typename?: 'SendQuotationResult';
  emailSent: Scalars['Boolean']['output'];
  quotation: Quotation;
};

export type SiteLocation = {
  __typename?: 'SiteLocation';
  address?: Maybe<Scalars['String']['output']>;
  city?: Maybe<Scalars['String']['output']>;
  contactPerson?: Maybe<Scalars['String']['output']>;
  country?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  email?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  organizationId: Scalars['String']['output'];
  phone?: Maybe<Scalars['String']['output']>;
  seqNo?: Maybe<Scalars['String']['output']>;
  state?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  zipCode?: Maybe<Scalars['String']['output']>;
};

export type SiteLocationInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  contactPerson?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  organizationId: Scalars['String']['input'];
  phone?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  zipCode?: InputMaybe<Scalars['String']['input']>;
};

export type StockAdjustment = {
  __typename?: 'StockAdjustment';
  adjDate: Scalars['String']['output'];
  adjNumber: Scalars['String']['output'];
  adjustmentType: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  lineItems: Array<SaLineItem>;
  notes?: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['ID']['output'];
  reason?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  warehouseId?: Maybe<Scalars['ID']['output']>;
  warehouseName?: Maybe<Scalars['String']['output']>;
};

export type StockMovement = {
  __typename?: 'StockMovement';
  createdAt: Scalars['String']['output'];
  fromLocation: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  itemId: Scalars['String']['output'];
  movementDate: Scalars['String']['output'];
  movementType: Scalars['String']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['String']['output'];
  quantity: Scalars['Float']['output'];
  referenceId: Scalars['String']['output'];
  referenceModule: Scalars['String']['output'];
  toLocation: Scalars['String']['output'];
  unit: Scalars['String']['output'];
};

export type StockMovementInput = {
  fromLocation: Scalars['String']['input'];
  itemId: Scalars['String']['input'];
  movementType: Scalars['String']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['String']['input'];
  quantity: Scalars['Float']['input'];
  referenceId: Scalars['String']['input'];
  referenceModule: Scalars['String']['input'];
  toLocation: Scalars['String']['input'];
  unit: Scalars['String']['input'];
};

export type StockTransfer = {
  __typename?: 'StockTransfer';
  createdAt?: Maybe<Scalars['String']['output']>;
  fromWarehouseId?: Maybe<Scalars['ID']['output']>;
  fromWarehouseName?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  lineItems: Array<StLineItem>;
  notes?: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['ID']['output'];
  status: Scalars['String']['output'];
  toWarehouseId?: Maybe<Scalars['ID']['output']>;
  toWarehouseName?: Maybe<Scalars['String']['output']>;
  transferDate: Scalars['String']['output'];
  transferNumber: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
};

export type Task = {
  __typename?: 'Task';
  assignedTo?: Maybe<Scalars['ID']['output']>;
  completedAt?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  dueDate?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  priority: Scalars['String']['output'];
  startDate?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
};

export type TaskInput = {
  assignedTo?: InputMaybe<Scalars['ID']['input']>;
  completedAt?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  dueDate?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  name: Scalars['String']['input'];
  priority?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateAttendanceInput = {
  checkIn?: InputMaybe<Scalars['String']['input']>;
  checkOut?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateClientInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  company?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  industry?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  website?: InputMaybe<Scalars['String']['input']>;
  zipCode?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateCustomerInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  contactPerson?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  invoiceBillable?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  paymentTerms?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  taxNumber?: InputMaybe<Scalars['String']['input']>;
  zipCode?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateCustomerInvoiceInput = {
  customerId?: InputMaybe<Scalars['ID']['input']>;
  dueDate?: InputMaybe<Scalars['String']['input']>;
  invoiceDate?: InputMaybe<Scalars['String']['input']>;
  paidAmount?: InputMaybe<Scalars['Float']['input']>;
  salesOrderId?: InputMaybe<Scalars['ID']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  totalAmount?: InputMaybe<Scalars['Float']['input']>;
};

export type UpdateCustomerPaymentInput = {
  notes?: InputMaybe<Scalars['String']['input']>;
  paymentDate?: InputMaybe<Scalars['String']['input']>;
  paymentMethod?: InputMaybe<Scalars['String']['input']>;
  referenceNumber?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateGrnInput = {
  notes?: InputMaybe<Scalars['String']['input']>;
  receivedDate?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateIntercompanyTransferInput = {
  fromOrganizationId?: InputMaybe<Scalars['ID']['input']>;
  fromOrganizationName?: InputMaybe<Scalars['String']['input']>;
  lineItems?: InputMaybe<Array<IctLineItemInput>>;
  notes?: InputMaybe<Scalars['String']['input']>;
  toOrganizationId?: InputMaybe<Scalars['ID']['input']>;
  toOrganizationName?: InputMaybe<Scalars['String']['input']>;
  transferDate?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateItemInput = {
  category?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  rate?: InputMaybe<Scalars['Float']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  unit?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateLeaveApplicationInput = {
  endDate?: InputMaybe<Scalars['String']['input']>;
  reason?: InputMaybe<Scalars['String']['input']>;
  rejectedReason?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  totalDays?: InputMaybe<Scalars['Float']['input']>;
};

export type UpdateLeaveEnrollmentInput = {
  carriedForward?: InputMaybe<Scalars['Float']['input']>;
  entitledDays?: InputMaybe<Scalars['Float']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  usedDays?: InputMaybe<Scalars['Float']['input']>;
};

export type UpdateLeaveReinstatementInput = {
  reviewNotes?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateLeaveTypeInput = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  allowCarryForward?: InputMaybe<Scalars['Boolean']['input']>;
  code?: InputMaybe<Scalars['String']['input']>;
  defaultDaysPerYear?: InputMaybe<Scalars['Float']['input']>;
  maxCarryForwardDays?: InputMaybe<Scalars['Float']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  paid?: InputMaybe<Scalars['Boolean']['input']>;
};

export type UpdateMaterialReceiptInput = {
  lineItems?: InputMaybe<Array<MrnLineItemInput>>;
  notes?: InputMaybe<Scalars['String']['input']>;
  receiptDate?: InputMaybe<Scalars['String']['input']>;
  totalAmount?: InputMaybe<Scalars['Float']['input']>;
  vendorId?: InputMaybe<Scalars['ID']['input']>;
  vendorName?: InputMaybe<Scalars['String']['input']>;
  warehouseId?: InputMaybe<Scalars['ID']['input']>;
  warehouseName?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateOrganizationInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateProductInput = {
  barcode?: InputMaybe<Scalars['String']['input']>;
  brand?: InputMaybe<Scalars['String']['input']>;
  category?: InputMaybe<Scalars['String']['input']>;
  costPrice?: InputMaybe<Scalars['Float']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  images?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  maxStockLevel?: InputMaybe<Scalars['Float']['input']>;
  minStockLevel?: InputMaybe<Scalars['Float']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  price?: InputMaybe<Scalars['Float']['input']>;
  reorderPoint?: InputMaybe<Scalars['Float']['input']>;
  sku?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  taxRate?: InputMaybe<Scalars['Float']['input']>;
  unit?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateProjectInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};

export type UpdatePurchaseOrderInput = {
  deliveryDate?: InputMaybe<Scalars['String']['input']>;
  items?: InputMaybe<Array<PoLineItemInput>>;
  projectId?: InputMaybe<Scalars['ID']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  subtotal?: InputMaybe<Scalars['Float']['input']>;
  taxAmount?: InputMaybe<Scalars['Float']['input']>;
  totalAmount?: InputMaybe<Scalars['Float']['input']>;
  vendorId?: InputMaybe<Scalars['ID']['input']>;
};

export type UpdateQuotationInput = {
  clientId?: InputMaybe<Scalars['ID']['input']>;
  discountAmount?: InputMaybe<Scalars['Float']['input']>;
  lineItems?: InputMaybe<Array<QuotationLineItemInput>>;
  notes?: InputMaybe<Scalars['String']['input']>;
  quotationDate?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  subject?: InputMaybe<Scalars['String']['input']>;
  subtotal?: InputMaybe<Scalars['Float']['input']>;
  taxAmount?: InputMaybe<Scalars['Float']['input']>;
  terms?: InputMaybe<Scalars['String']['input']>;
  totalAmount?: InputMaybe<Scalars['Float']['input']>;
  validUntil?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateRoleInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  displayName?: InputMaybe<Scalars['String']['input']>;
  permissions?: InputMaybe<Array<PermissionInput>>;
};

export type UpdateSalesEnquiryInput = {
  assignedTo?: InputMaybe<Scalars['ID']['input']>;
  budget?: InputMaybe<Scalars['Float']['input']>;
  clientId?: InputMaybe<Scalars['ID']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  enquirySource?: InputMaybe<Scalars['String']['input']>;
  estimatedEndDate?: InputMaybe<Scalars['String']['input']>;
  estimatedStartDate?: InputMaybe<Scalars['String']['input']>;
  location?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  priority?: InputMaybe<Scalars['String']['input']>;
  projectScope?: InputMaybe<Scalars['String']['input']>;
  projectType?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  subject?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateSalesOrderInput = {
  customerId?: InputMaybe<Scalars['ID']['input']>;
  projectId?: InputMaybe<Scalars['ID']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  totalAmount?: InputMaybe<Scalars['Float']['input']>;
};

export type UpdateSalesQuotationInput = {
  assignedTo?: InputMaybe<Scalars['ID']['input']>;
  clientId?: InputMaybe<Scalars['ID']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  deliveryTerms?: InputMaybe<Scalars['String']['input']>;
  enquiryId?: InputMaybe<Scalars['ID']['input']>;
  items?: InputMaybe<Array<QuotationItemInput>>;
  notes?: InputMaybe<Scalars['String']['input']>;
  paymentTerms?: InputMaybe<Scalars['String']['input']>;
  quotationDate?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  subject?: InputMaybe<Scalars['String']['input']>;
  termsAndConditions?: InputMaybe<Scalars['String']['input']>;
  validUntil?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateStockAdjustmentInput = {
  adjDate?: InputMaybe<Scalars['String']['input']>;
  adjustmentType?: InputMaybe<Scalars['String']['input']>;
  lineItems?: InputMaybe<Array<SaLineItemInput>>;
  notes?: InputMaybe<Scalars['String']['input']>;
  reason?: InputMaybe<Scalars['String']['input']>;
  warehouseId?: InputMaybe<Scalars['ID']['input']>;
  warehouseName?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateStockTransferInput = {
  fromWarehouseId?: InputMaybe<Scalars['ID']['input']>;
  fromWarehouseName?: InputMaybe<Scalars['String']['input']>;
  lineItems?: InputMaybe<Array<StLineItemInput>>;
  notes?: InputMaybe<Scalars['String']['input']>;
  toWarehouseId?: InputMaybe<Scalars['ID']['input']>;
  toWarehouseName?: InputMaybe<Scalars['String']['input']>;
  transferDate?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateUserInput = {
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  roles?: InputMaybe<Array<Scalars['String']['input']>>;
  status?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateVendorBillInput = {
  billDate?: InputMaybe<Scalars['String']['input']>;
  discountAmount?: InputMaybe<Scalars['Float']['input']>;
  dueDate?: InputMaybe<Scalars['String']['input']>;
  lineItems?: InputMaybe<Array<VendorBillLineItemInput>>;
  notes?: InputMaybe<Scalars['String']['input']>;
  purchaseOrderId?: InputMaybe<Scalars['ID']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  subtotal?: InputMaybe<Scalars['Float']['input']>;
  taxAmount?: InputMaybe<Scalars['Float']['input']>;
  totalAmount?: InputMaybe<Scalars['Float']['input']>;
  vendorId?: InputMaybe<Scalars['ID']['input']>;
};

export type UpdateVendorCreditInput = {
  creditDate?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  reason?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateVendorInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  contactPerson?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  paymentTerms?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  taxNumber?: InputMaybe<Scalars['String']['input']>;
  zipCode?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateVendorPaymentInput = {
  notes?: InputMaybe<Scalars['String']['input']>;
  paymentDate?: InputMaybe<Scalars['String']['input']>;
  paymentMethod?: InputMaybe<Scalars['String']['input']>;
  referenceNumber?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateVendorPrepaymentInput = {
  notes?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};

export type UpsertIndividualPriceListInput = {
  customerId: Scalars['ID']['input'];
  lines: Array<IndividualPriceListLineInput>;
  notes?: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['String']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['String']['output'];
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastName: Scalars['String']['output'];
  modulePermissions?: Maybe<Array<ModulePermission>>;
  organizationId?: Maybe<Scalars['ID']['output']>;
  roles?: Maybe<Array<Scalars['String']['output']>>;
  seqNo?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  userType?: Maybe<Scalars['String']['output']>;
};

export type UserList = {
  __typename?: 'UserList';
  limit: Scalars['Int']['output'];
  page: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
  users: Array<User>;
};

export type Vendor = {
  __typename?: 'Vendor';
  address?: Maybe<Scalars['String']['output']>;
  city?: Maybe<Scalars['String']['output']>;
  contactPerson?: Maybe<Scalars['String']['output']>;
  country?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  email?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  /** draft | submitted | approval_declined | approved — omitted on legacy rows means approved */
  orgApprovalStatus: Scalars['String']['output'];
  organizationId: Scalars['ID']['output'];
  paymentTerms?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  seqNo?: Maybe<Scalars['String']['output']>;
  state?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  taxNumber?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['String']['output'];
  zipCode?: Maybe<Scalars['String']['output']>;
};

export type VendorBill = {
  __typename?: 'VendorBill';
  billDate: Scalars['String']['output'];
  billNumber: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  discountAmount?: Maybe<Scalars['Float']['output']>;
  dueDate: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lineItems: Array<VendorBillLineItem>;
  notes?: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['ID']['output'];
  outstandingAmount: Scalars['Float']['output'];
  paidAmount: Scalars['Float']['output'];
  purchaseOrderId?: Maybe<Scalars['ID']['output']>;
  status: Scalars['String']['output'];
  subtotal: Scalars['Float']['output'];
  taxAmount?: Maybe<Scalars['Float']['output']>;
  totalAmount: Scalars['Float']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  vendor?: Maybe<Vendor>;
  vendorId: Scalars['ID']['output'];
};

export type VendorBillLineItem = {
  __typename?: 'VendorBillLineItem';
  description: Scalars['String']['output'];
  discount?: Maybe<Scalars['Float']['output']>;
  quantity: Scalars['Float']['output'];
  tax?: Maybe<Scalars['Float']['output']>;
  total: Scalars['Float']['output'];
  unitPrice: Scalars['Float']['output'];
};

export type VendorBillLineItemInput = {
  description: Scalars['String']['input'];
  discount?: InputMaybe<Scalars['Float']['input']>;
  quantity: Scalars['Float']['input'];
  tax?: InputMaybe<Scalars['Float']['input']>;
  total: Scalars['Float']['input'];
  unitPrice: Scalars['Float']['input'];
};

export type VendorCredit = {
  __typename?: 'VendorCredit';
  appliedAmount: Scalars['Float']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  creditDate: Scalars['String']['output'];
  creditNumber: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['ID']['output'];
  reason?: Maybe<Scalars['String']['output']>;
  remainingAmount: Scalars['Float']['output'];
  status: Scalars['String']['output'];
  totalAmount: Scalars['Float']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  vendor?: Maybe<Vendor>;
  vendorId: Scalars['ID']['output'];
};

export type VendorPayment = {
  __typename?: 'VendorPayment';
  allocations: Array<VendorPaymentAllocation>;
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['ID']['output'];
  paymentDate: Scalars['String']['output'];
  paymentMethod: Scalars['String']['output'];
  paymentNumber: Scalars['String']['output'];
  referenceNumber?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  totalAmount: Scalars['Float']['output'];
  updatedAt: Scalars['String']['output'];
  vendor?: Maybe<Vendor>;
  vendorId: Scalars['ID']['output'];
};

export type VendorPaymentAllocation = {
  __typename?: 'VendorPaymentAllocation';
  amount: Scalars['Float']['output'];
  billId: Scalars['ID']['output'];
  billNumber?: Maybe<Scalars['String']['output']>;
};

export type VendorPaymentAllocationInput = {
  amount: Scalars['Float']['input'];
  billId: Scalars['ID']['input'];
};

export type VendorPrepayment = {
  __typename?: 'VendorPrepayment';
  amount: Scalars['Float']['output'];
  appliedAmount: Scalars['Float']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['ID']['output'];
  paymentMethod: Scalars['String']['output'];
  prepaymentDate: Scalars['String']['output'];
  prepaymentNumber: Scalars['String']['output'];
  referenceNumber?: Maybe<Scalars['String']['output']>;
  remainingAmount: Scalars['Float']['output'];
  status: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  vendor?: Maybe<Vendor>;
  vendorId: Scalars['ID']['output'];
};

export type Warehouse = {
  __typename?: 'Warehouse';
  address: Scalars['String']['output'];
  capacity: Scalars['Float']['output'];
  contactNumber: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  currentUtilization: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  location: Scalars['String']['output'];
  managerName: Scalars['String']['output'];
  organizationId: Scalars['String']['output'];
  warehouseCode: Scalars['String']['output'];
  warehouseName: Scalars['String']['output'];
  warehouseType: Scalars['String']['output'];
};

export type WarehouseBin = {
  __typename?: 'WarehouseBin';
  binCode: Scalars['String']['output'];
  binLocation: Scalars['String']['output'];
  binType: Scalars['String']['output'];
  capacity: Scalars['Float']['output'];
  createdAt: Scalars['String']['output'];
  currentStock: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  isAvailable: Scalars['Boolean']['output'];
  organizationId: Scalars['String']['output'];
  warehouseId: Scalars['String']['output'];
};

export type WarehouseBinInput = {
  binCode: Scalars['String']['input'];
  binLocation: Scalars['String']['input'];
  binType: Scalars['String']['input'];
  capacity: Scalars['Float']['input'];
  /** Defaults to true when omitted. */
  isAvailable?: InputMaybe<Scalars['Boolean']['input']>;
  organizationId: Scalars['String']['input'];
  warehouseId: Scalars['String']['input'];
};

export type WarehouseInput = {
  address: Scalars['String']['input'];
  capacity: Scalars['Float']['input'];
  contactNumber: Scalars['String']['input'];
  /** Stored utilization / occupancy level for reporting. */
  currentUtilization?: InputMaybe<Scalars['Float']['input']>;
  /** Defaults to true on create when omitted. */
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  location: Scalars['String']['input'];
  managerName: Scalars['String']['input'];
  organizationId: Scalars['String']['input'];
  /** Omitted or blank values receive the next auto-generated code for the organization (e.g. WH0001). */
  warehouseCode?: InputMaybe<Scalars['String']['input']>;
  warehouseName: Scalars['String']['input'];
  warehouseType: Scalars['String']['input'];
};

export type WorkOrder = {
  __typename?: 'WorkOrder';
  createdAt: Scalars['String']['output'];
  docDate: Scalars['String']['output'];
  docNumber: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  organizationId: Scalars['String']['output'];
  status: Scalars['String']['output'];
};

export type WorkOrderInput = {
  docDate: Scalars['String']['input'];
  organizationId: Scalars['String']['input'];
  status?: InputMaybe<Scalars['String']['input']>;
};
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     rn Apollo.useSuspenseQuery<GetVendorPaymentQuery, GetVendorPaymentQueryVariables>(GetVendorPaymentDocument, options);
        }
export type GetVendorPaymentQueryHookResult = ReturnType<typeof useGetVendorPaymentQuery>;
export type GetVendorPaymentLazyQueryHookResult = ReturnType<typeof useGetVendorPaymentLazyQuery>;
export type GetVendorPaymentSuspenseQueryHookResult = ReturnType<typeof useGetVendorPaymentSuspenseQuery>;
export type GetVendorPaymentQueryResult = Apollo.QueryResult<GetVendorPaymentQuery, GetVendorPaymentQueryVariables>;
export const CreateVendorPaymentDocument = gql`
    mutation CreateVendorPayment($input: CreateVendorPaymentInput!) {
  createVendorPayment(input: $input) {
    id
    paymentNumber
    status
  }
}
    `;
export type CreateVendorPaymentMutationFn = Apollo.MutationFunction<CreateVendorPaymentMutation, CreateVendorPaymentMutationVariables>;
export function useCreateVendorPaymentMutation(baseOptions?: Apollo.MutationHookOptions<CreateVendorPaymentMutation, CreateVendorPaymentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateVendorPaymentMutation, CreateVendorPaymentMutationVariables>(CreateVendorPaymentDocument, options);
      }
export type CreateVendorPaymentMutationHookResult = ReturnType<typeof useCreateVendorPaymentMutation>;
export type CreateVendorPaymentMutationResult = Apollo.MutationResult<CreateVendorPaymentMutation>;
export type CreateVendorPaymentMutationOptions = Apollo.BaseMutationOptions<CreateVendorPaymentMutation, CreateVendorPaymentMutationVariables>;
export const UpdateVendorPaymentDocument = gql`
    mutation UpdateVendorPayment($id: ID!, $input: UpdateVendorPaymentInput!) {
  updateVendorPayment(id: $id, input: $input) {
    id
    paymentNumber
    status
  }
}
    `;
export type UpdateVendorPaymentMutationFn = Apollo.MutationFunction<UpdateVendorPaymentMutation, UpdateVendorPaymentMutationVariables>;
export function useUpdateVendorPaymentMutation(baseOptions?: Apollo.MutationHookOptions<UpdateVendorPaymentMutation, UpdateVendorPaymentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateVendorPaymentMutation, UpdateVendorPaymentMutationVariables>(UpdateVendorPaymentDocument, options);
      }
export type UpdateVendorPaymentMutationHookResult = ReturnType<typeof useUpdateVendorPaymentMutation>;
export type UpdateVendorPaymentMutationResult = Apollo.MutationResult<UpdateVendorPaymentMutation>;
export type UpdateVendorPaymentMutationOptions = Apollo.BaseMutationOptions<UpdateVendorPaymentMutation, UpdateVendorPaymentMutationVariables>;
export const DeleteVendorPaymentDocument = gql`
    mutation DeleteVendorPayment($id: ID!) {
  deleteVendorPayment(id: $id)
}
    `;
export type DeleteVendorPaymentMutationFn = Apollo.MutationFunction<DeleteVendorPaymentMutation, DeleteVendorPaymentMutationVariables>;
export function useDeleteVendorPaymentMutation(baseOptions?: Apollo.MutationHookOptions<DeleteVendorPaymentMutation, DeleteVendorPaymentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteVendorPaymentMutation, DeleteVendorPaymentMutationVariables>(DeleteVendorPaymentDocument, options);
      }
export type DeleteVendorPaymentMutationHookResult = ReturnType<typeof useDeleteVendorPaymentMutation>;
export type DeleteVendorPaymentMutationResult = Apollo.MutationResult<DeleteVendorPaymentMutation>;
export type DeleteVendorPaymentMutationOptions = Apollo.BaseMutationOptions<DeleteVendorPaymentMutation, DeleteVendorPaymentMutationVariables>;
export const GetVendorBillsDocument = gql`
    query GetVendorBills($organizationId: ID!, $vendorId: ID, $status: String, $page: Int, $limit: Int) {
  vendorBills(
    organizationId: $organizationId
    vendorId: $vendorId
    status: $status
    page: $page
    limit: $limit
  ) {
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
    `;
export function useGetVendorBillsQuery(baseOptions: Apollo.QueryHookOptions<GetVendorBillsQuery, GetVendorBillsQueryVariables> & ({ variables: GetVendorBillsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetVendorBillsQuery, GetVendorBillsQueryVariables>(GetVendorBillsDocument, options);
      }
export function useGetVendorBillsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetVendorBillsQuery, GetVendorBillsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetVendorBillsQuery, GetVendorBillsQueryVariables>(GetVendorBillsDocument, options);
        }
// @ts-ignore
export function useGetVendorBillsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetVendorBillsQuery, GetVendorBillsQueryVariables>): Apollo.UseSuspenseQueryResult<GetVendorBillsQuery, GetVendorBillsQueryVariables>;
export function useGetVendorBillsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetVendorBillsQuery, GetVendorBillsQueryVariables>): Apollo.UseSuspenseQueryResult<GetVendorBillsQuery | undefined, GetVendorBillsQueryVariables>;
export function useGetVendorBillsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetVendorBillsQuery, GetVendorBillsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetVendorBillsQuery, GetVendorBillsQueryVariables>(GetVendorBillsDocument, options);
        }
export type GetVendorBillsQueryHookResult = ReturnType<typeof useGetVendorBillsQuery>;
export type GetVendorBillsLazyQueryHookResult = ReturnType<typeof useGetVendorBillsLazyQuery>;
export type GetVendorBillsSuspenseQueryHookResult = ReturnType<typeof useGetVendorBillsSuspenseQuery>;
export type GetVendorBillsQueryResult = Apollo.QueryResult<GetVendorBillsQuery, GetVendorBillsQueryVariables>;
export const GetVendorBillDocument = gql`
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
    `;
export function useGetVendorBillQuery(baseOptions: Apollo.QueryHookOptions<GetVendorBillQuery, GetVendorBillQueryVariables> & ({ variables: GetVendorBillQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetVendorBillQuery, GetVendorBillQueryVariables>(GetVendorBillDocument, options);
      }
export function useGetVendorBillLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetVendorBillQuery, GetVendorBillQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetVendorBillQuery, GetVendorBillQueryVariables>(GetVendorBillDocument, options);
        }
// @ts-ignore
export function useGetVendorBillSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetVendorBillQuery, GetVendorBillQueryVariables>): Apollo.UseSuspenseQueryResult<GetVendorBillQuery, GetVendorBillQueryVariables>;
export function useGetVendorBillSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetVendorBillQuery, GetVendorBillQueryVariables>): Apollo.UseSuspenseQueryResult<GetVendorBillQuery | undefined, GetVendorBillQueryVariables>;
export function useGetVendorBillSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetVendorBillQuery, GetVendorBillQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetVendorBillQuery, GetVendorBillQueryVariables>(GetVendorBillDocument, options);
        }
export type GetVendorBillQueryHookResult = ReturnType<typeof useGetVendorBillQuery>;
export type GetVendorBillLazyQueryHookResult = ReturnType<typeof useGetVendorBillLazyQuery>;
export type GetVendorBillSuspenseQueryHookResult = ReturnType<typeof useGetVendorBillSuspenseQuery>;
export type GetVendorBillQueryResult = Apollo.QueryResult<GetVendorBillQuery, GetVendorBillQueryVariables>;
export const GetOutstandingVendorBillsDocument = gql`
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
    `;
export function useGetOutstandingVendorBillsQuery(baseOptions: Apollo.QueryHookOptions<GetOutstandingVendorBillsQuery, GetOutstandingVendorBillsQueryVariables> & ({ variables: GetOutstandingVendorBillsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetOutstandingVendorBillsQuery, GetOutstandingVendorBillsQueryVariables>(GetOutstandingVendorBillsDocument, options);
      }
export function useGetOutstandingVendorBillsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetOutstandingVendorBillsQuery, GetOutstandingVendorBillsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetOutstandingVendorBillsQuery, GetOutstandingVendorBillsQueryVariables>(GetOutstandingVendorBillsDocument, options);
        }
// @ts-ignore
export function useGetOutstandingVendorBillsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetOutstandingVendorBillsQuery, GetOutstandingVendorBillsQueryVariables>): Apollo.UseSuspenseQueryResult<GetOutstandingVendorBillsQuery, GetOutstandingVendorBillsQueryVariables>;
export function useGetOutstandingVendorBillsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetOutstandingVendorBillsQuery, GetOutstandingVendorBillsQueryVariables>): Apollo.UseSuspenseQueryResult<GetOutstandingVendorBillsQuery | undefined, GetOutstandingVendorBillsQueryVariables>;
export function useGetOutstandingVendorBillsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetOutstandingVendorBillsQuery, GetOutstandingVendorBillsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetOutstandingVendorBillsQuery, GetOutstandingVendorBillsQueryVariables>(GetOutstandingVendorBillsDocument, options);
        }
export type GetOutstandingVendorBillsQueryHookResult = ReturnType<typeof useGetOutstandingVendorBillsQuery>;
export type GetOutstandingVendorBillsLazyQueryHookResult = ReturnType<typeof useGetOutstandingVendorBillsLazyQuery>;
export type GetOutstandingVendorBillsSuspenseQueryHookResult = ReturnType<typeof useGetOutstandingVendorBillsSuspenseQuery>;
export type GetOutstandingVendorBillsQueryResult = Apollo.QueryResult<GetOutstandingVendorBillsQuery, GetOutstandingVendorBillsQueryVariables>;
export const CreateVendorBillDocument = gql`
    mutation CreateVendorBill($input: CreateVendorBillInput!) {
  createVendorBill(input: $input) {
    id
    billNumber
    status
  }
}
    `;
export type CreateVendorBillMutationFn = Apollo.MutationFunction<CreateVendorBillMutation, CreateVendorBillMutationVariables>;
export function useCreateVendorBillMutation(baseOptions?: Apollo.MutationHookOptions<CreateVendorBillMutation, CreateVendorBillMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateVendorBillMutation, CreateVendorBillMutationVariables>(CreateVendorBillDocument, options);
      }
export type CreateVendorBillMutationHookResult = ReturnType<typeof useCreateVendorBillMutation>;
export type CreateVendorBillMutationResult = Apollo.MutationResult<CreateVendorBillMutation>;
export type CreateVendorBillMutationOptions = Apollo.BaseMutationOptions<CreateVendorBillMutation, CreateVendorBillMutationVariables>;
export const UpdateVendorBillDocument = gql`
    mutation UpdateVendorBill($id: ID!, $input: UpdateVendorBillInput!) {
  updateVendorBill(id: $id, input: $input) {
    id
    billNumber
    status
  }
}
    `;
export type UpdateVendorBillMutationFn = Apollo.MutationFunction<UpdateVendorBillMutation, UpdateVendorBillMutationVariables>;
export function useUpdateVendorBillMutation(baseOptions?: Apollo.MutationHookOptions<UpdateVendorBillMutation, UpdateVendorBillMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateVendorBillMutation, UpdateVendorBillMutationVariables>(UpdateVendorBillDocument, options);
      }
export type UpdateVendorBillMutationHookResult = ReturnType<typeof useUpdateVendorBillMutation>;
export type UpdateVendorBillMutationResult = Apollo.MutationResult<UpdateVendorBillMutation>;
export type UpdateVendorBillMutationOptions = Apollo.BaseMutationOptions<UpdateVendorBillMutation, UpdateVendorBillMutationVariables>;
export const ApproveVendorBillDocument = gql`
    mutation ApproveVendorBill($id: ID!) {
  approveVendorBill(id: $id) {
    id
    billNumber
    status
  }
}
    `;
export type ApproveVendorBillMutationFn = Apollo.MutationFunction<ApproveVendorBillMutation, ApproveVendorBillMutationVariables>;
export function useApproveVendorBillMutation(baseOptions?: Apollo.MutationHookOptions<ApproveVendorBillMutation, ApproveVendorBillMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ApproveVendorBillMutation, ApproveVendorBillMutationVariables>(ApproveVendorBillDocument, options);
      }
export type ApproveVendorBillMutationHookResult = ReturnType<typeof useApproveVendorBillMutation>;
export type ApproveVendorBillMutationResult = Apollo.MutationResult<ApproveVendorBillMutation>;
export type ApproveVendorBillMutationOptions = Apollo.BaseMutationOptions<ApproveVendorBillMutation, ApproveVendorBillMutationVariables>;
export const SubmitVendorBillForApprovalDocument = gql`
    mutation SubmitVendorBillForApproval($id: ID!) {
  submitVendorBillForApproval(id: $id) {
    id
    billNumber
    status
  }
}
    `;
export type SubmitVendorBillForApprovalMutationFn = Apollo.MutationFunction<SubmitVendorBillForApprovalMutation, SubmitVendorBillForApprovalMutationVariables>;
export function useSubmitVendorBillForApprovalMutation(baseOptions?: Apollo.MutationHookOptions<SubmitVendorBillForApprovalMutation, SubmitVendorBillForApprovalMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SubmitVendorBillForApprovalMutation, SubmitVendorBillForApprovalMutationVariables>(SubmitVendorBillForApprovalDocument, options);
      }
export type SubmitVendorBillForApprovalMutationHookResult = ReturnType<typeof useSubmitVendorBillForApprovalMutation>;
export type SubmitVendorBillForApprovalMutationResult = Apollo.MutationResult<SubmitVendorBillForApprovalMutation>;
export type SubmitVendorBillForApprovalMutationOptions = Apollo.BaseMutationOptions<SubmitVendorBillForApprovalMutation, SubmitVendorBillForApprovalMutationVariables>;
export const DeleteVendorBillDocument = gql`
    mutation DeleteVendorBill($id: ID!) {
  deleteVendorBill(id: $id)
}
    `;
export type DeleteVendorBillMutationFn = Apollo.MutationFunction<DeleteVendorBillMutation, DeleteVendorBillMutationVariables>;
export function useDeleteVendorBillMutation(baseOptions?: Apollo.MutationHookOptions<DeleteVendorBillMutation, DeleteVendorBillMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteVendorBillMutation, DeleteVendorBillMutationVariables>(DeleteVendorBillDocument, options);
      }
export type DeleteVendorBillMutationHookResult = ReturnType<typeof useDeleteVendorBillMutation>;
export type DeleteVendorBillMutationResult = Apollo.MutationResult<DeleteVendorBillMutation>;
export type DeleteVendorBillMutationOptions = Apollo.BaseMutationOptions<DeleteVendorBillMutation, DeleteVendorBillMutationVariables>;
export const GetMaterialReceiptsDocument = gql`
    query GetMaterialReceipts($organizationId: ID!, $page: Int, $limit: Int, $status: String) {
  materialreceipts(
    organizationId: $organizationId
    page: $page
    limit: $limit
    status: $status
  ) {
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
    `;
export function useGetMaterialReceiptsQuery(baseOptions: Apollo.QueryHookOptions<GetMaterialReceiptsQuery, GetMaterialReceiptsQueryVariables> & ({ variables: GetMaterialReceiptsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMaterialReceiptsQuery, GetMaterialReceiptsQueryVariables>(GetMaterialReceiptsDocument, options);
      }
export function useGetMaterialReceiptsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMaterialReceiptsQuery, GetMaterialReceiptsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMaterialReceiptsQuery, GetMaterialReceiptsQueryVariables>(GetMaterialReceiptsDocument, options);
        }
// @ts-ignore
export function useGetMaterialReceiptsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetMaterialReceiptsQuery, GetMaterialReceiptsQueryVariables>): Apollo.UseSuspenseQueryResult<GetMaterialReceiptsQuery, GetMaterialReceiptsQueryVariables>;
export function useGetMaterialReceiptsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMaterialReceiptsQuery, GetMaterialReceiptsQueryVariables>): Apollo.UseSuspenseQueryResult<GetMaterialReceiptsQuery | undefined, GetMaterialReceiptsQueryVariables>;
export function useGetMaterialReceiptsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMaterialReceiptsQuery, GetMaterialReceiptsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetMaterialReceiptsQuery, GetMaterialReceiptsQueryVariables>(GetMaterialReceiptsDocument, options);
        }
export type GetMaterialReceiptsQueryHookResult = ReturnType<typeof useGetMaterialReceiptsQuery>;
export type GetMaterialReceiptsLazyQueryHookResult = ReturnType<typeof useGetMaterialReceiptsLazyQuery>;
export type GetMaterialReceiptsSuspenseQueryHookResult = ReturnType<typeof useGetMaterialReceiptsSuspenseQuery>;
export type GetMaterialReceiptsQueryResult = Apollo.QueryResult<GetMaterialReceiptsQuery, GetMaterialReceiptsQueryVariables>;
export const GetMaterialReceiptDocument = gql`
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
    `;
export function useGetMaterialReceiptQuery(baseOptions: Apollo.QueryHookOptions<GetMaterialReceiptQuery, GetMaterialReceiptQueryVariables> & ({ variables: GetMaterialReceiptQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMaterialReceiptQuery, GetMaterialReceiptQueryVariables>(GetMaterialReceiptDocument, options);
      }
export function useGetMaterialReceiptLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMaterialReceiptQuery, GetMaterialReceiptQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMaterialReceiptQuery, GetMaterialReceiptQueryVariables>(GetMaterialReceiptDocument, options);
        }
// @ts-ignore
export function useGetMaterialReceiptSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetMaterialReceiptQuery, GetMaterialReceiptQueryVariables>): Apollo.UseSuspenseQueryResult<GetMaterialReceiptQuery, GetMaterialReceiptQueryVariables>;
export function useGetMaterialReceiptSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMaterialReceiptQuery, GetMaterialReceiptQueryVariables>): Apollo.UseSuspenseQueryResult<GetMaterialReceiptQuery | undefined, GetMaterialReceiptQueryVariables>;
export function useGetMaterialReceiptSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMaterialReceiptQuery, GetMaterialReceiptQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetMaterialReceiptQuery, GetMaterialReceiptQueryVariables>(GetMaterialReceiptDocument, options);
        }
export type GetMaterialReceiptQueryHookResult = ReturnType<typeof useGetMaterialReceiptQuery>;
export type GetMaterialReceiptLazyQueryHookResult = ReturnType<typeof useGetMaterialReceiptLazyQuery>;
export type GetMaterialReceiptSuspenseQueryHookResult = ReturnType<typeof useGetMaterialReceiptSuspenseQuery>;
export type GetMaterialReceiptQueryResult = Apollo.QueryResult<GetMaterialReceiptQuery, GetMaterialReceiptQueryVariables>;
export const CreateMaterialReceiptDocument = gql`
    mutation CreateMaterialReceipt($input: CreateMaterialReceiptInput!) {
  createMaterialReceipt(input: $input) {
    id
    mrnNumber
    status
  }
}
    `;
export type CreateMaterialReceiptMutationFn = Apollo.MutationFunction<CreateMaterialReceiptMutation, CreateMaterialReceiptMutationVariables>;
export function useCreateMaterialReceiptMutation(baseOptions?: Apollo.MutationHookOptions<CreateMaterialReceiptMutation, CreateMaterialReceiptMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateMaterialReceiptMutation, CreateMaterialReceiptMutationVariables>(CreateMaterialReceiptDocument, options);
      }
export type CreateMaterialReceiptMutationHookResult = ReturnType<typeof useCreateMaterialReceiptMutation>;
export type CreateMaterialReceiptMutationResult = Apollo.MutationResult<CreateMaterialReceiptMutation>;
export type CreateMaterialReceiptMutationOptions = Apollo.BaseMutationOptions<CreateMaterialReceiptMutation, CreateMaterialReceiptMutationVariables>;
export const UpdateMaterialReceiptDocument = gql`
    mutation UpdateMaterialReceipt($id: ID!, $input: UpdateMaterialReceiptInput!) {
  updateMaterialReceipt(id: $id, input: $input) {
    id
    mrnNumber
    status
  }
}
    `;
export type UpdateMaterialReceiptMutationFn = Apollo.MutationFunction<UpdateMaterialReceiptMutation, UpdateMaterialReceiptMutationVariables>;
export function useUpdateMaterialReceiptMutation(baseOptions?: Apollo.MutationHookOptions<UpdateMaterialReceiptMutation, UpdateMaterialReceiptMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateMaterialReceiptMutation, UpdateMaterialReceiptMutationVariables>(UpdateMaterialReceiptDocument, options);
      }
export type UpdateMaterialReceiptMutationHookResult = ReturnType<typeof useUpdateMaterialReceiptMutation>;
export type UpdateMaterialReceiptMutationResult = Apollo.MutationResult<UpdateMaterialReceiptMutation>;
export type UpdateMaterialReceiptMutationOptions = Apollo.BaseMutationOptions<UpdateMaterialReceiptMutation, UpdateMaterialReceiptMutationVariables>;
export const ConfirmMaterialReceiptDocument = gql`
    mutation ConfirmMaterialReceipt($id: ID!) {
  confirmMaterialReceipt(id: $id) {
    id
    mrnNumber
    status
  }
}
    `;
export type ConfirmMaterialReceiptMutationFn = Apollo.MutationFunction<ConfirmMaterialReceiptMutation, ConfirmMaterialReceiptMutationVariables>;
export function useConfirmMaterialReceiptMutation(baseOptions?: Apollo.MutationHookOptions<ConfirmMaterialReceiptMutation, ConfirmMaterialReceiptMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ConfirmMaterialReceiptMutation, ConfirmMaterialReceiptMutationVariables>(ConfirmMaterialReceiptDocument, options);
      }
export type ConfirmMaterialReceiptMutationHookResult = ReturnType<typeof useConfirmMaterialReceiptMutation>;
export type ConfirmMaterialReceiptMutationResult = Apollo.MutationResult<ConfirmMaterialReceiptMutation>;
export type ConfirmMaterialReceiptMutationOptions = Apollo.BaseMutationOptions<ConfirmMaterialReceiptMutation, ConfirmMaterialReceiptMutationVariables>;
export const CancelMaterialReceiptDocument = gql`
    mutation CancelMaterialReceipt($id: ID!) {
  cancelMaterialReceipt(id: $id) {
    id
    mrnNumber
    status
  }
}
    `;
export type CancelMaterialReceiptMutationFn = Apollo.MutationFunction<CancelMaterialReceiptMutation, CancelMaterialReceiptMutationVariables>;
export function useCancelMaterialReceiptMutation(baseOptions?: Apollo.MutationHookOptions<CancelMaterialReceiptMutation, CancelMaterialReceiptMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CancelMaterialReceiptMutation, CancelMaterialReceiptMutationVariables>(CancelMaterialReceiptDocument, options);
      }
export type CancelMaterialReceiptMutationHookResult = ReturnType<typeof useCancelMaterialReceiptMutation>;
export type CancelMaterialReceiptMutationResult = Apollo.MutationResult<CancelMaterialReceiptMutation>;
export type CancelMaterialReceiptMutationOptions = Apollo.BaseMutationOptions<CancelMaterialReceiptMutation, CancelMaterialReceiptMutationVariables>;
export const SubmitMaterialReceiptForApprovalDocument = gql`
    mutation SubmitMaterialReceiptForApproval($id: ID!) {
  submitMaterialReceiptForApproval(id: $id) {
    id
    mrnNumber
    status
  }
}
    `;
export type SubmitMaterialReceiptForApprovalMutationFn = Apollo.MutationFunction<SubmitMaterialReceiptForApprovalMutation, SubmitMaterialReceiptForApprovalMutationVariables>;
export function useSubmitMaterialReceiptForApprovalMutation(baseOptions?: Apollo.MutationHookOptions<SubmitMaterialReceiptForApprovalMutation, SubmitMaterialReceiptForApprovalMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SubmitMaterialReceiptForApprovalMutation, SubmitMaterialReceiptForApprovalMutationVariables>(SubmitMaterialReceiptForApprovalDocument, options);
      }
export type SubmitMaterialReceiptForApprovalMutationHookResult = ReturnType<typeof useSubmitMaterialReceiptForApprovalMutation>;
export type SubmitMaterialReceiptForApprovalMutationResult = Apollo.MutationResult<SubmitMaterialReceiptForApprovalMutation>;
export type SubmitMaterialReceiptForApprovalMutationOptions = Apollo.BaseMutationOptions<SubmitMaterialReceiptForApprovalMutation, SubmitMaterialReceiptForApprovalMutationVariables>;
export const DeleteMaterialReceiptDocument = gql`
    mutation DeleteMaterialReceipt($id: ID!) {
  deleteMaterialReceipt(id: $id)
}
    `;
export type DeleteMaterialReceiptMutationFn = Apollo.MutationFunction<DeleteMaterialReceiptMutation, DeleteMaterialReceiptMutationVariables>;
export function useDeleteMaterialReceiptMutation(baseOptions?: Apollo.MutationHookOptions<DeleteMaterialReceiptMutation, DeleteMaterialReceiptMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteMaterialReceiptMutation, DeleteMaterialReceiptMutationVariables>(DeleteMaterialReceiptDocument, options);
      }
export type DeleteMaterialReceiptMutationHookResult = ReturnType<typeof useDeleteMaterialReceiptMutation>;
export type DeleteMaterialReceiptMutationResult = Apollo.MutationResult<DeleteMaterialReceiptMutation>;
export type DeleteMaterialReceiptMutationOptions = Apollo.BaseMutationOptions<DeleteMaterialReceiptMutation, DeleteMaterialReceiptMutationVariables>;
export const GetGoodsReceiptsDocument = gql`
    query GetGoodsReceipts($organizationId: String!) {
  goodsreceipts(organizationId: $organizationId) {
    id
    docNumber
    docDate
    status
    createdAt
  }
}
    `;
export function useGetGoodsReceiptsQuery(baseOptions: Apollo.QueryHookOptions<GetGoodsReceiptsQuery, GetGoodsReceiptsQueryVariables> & ({ variables: GetGoodsReceiptsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetGoodsReceiptsQuery, GetGoodsReceiptsQueryVariables>(GetGoodsReceiptsDocument, options);
      }
export function useGetGoodsReceiptsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetGoodsReceiptsQuery, GetGoodsReceiptsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetGoodsReceiptsQuery, GetGoodsReceiptsQueryVariables>(GetGoodsReceiptsDocument, options);
        }
// @ts-ignore
export function useGetGoodsReceiptsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetGoodsReceiptsQuery, GetGoodsReceiptsQueryVariables>): Apollo.UseSuspenseQueryResult<GetGoodsReceiptsQuery, GetGoodsReceiptsQueryVariables>;
export function useGetGoodsReceiptsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetGoodsReceiptsQuery, GetGoodsReceiptsQueryVariables>): Apollo.UseSuspenseQueryResult<GetGoodsReceiptsQuery | undefined, GetGoodsReceiptsQueryVariables>;
export function useGetGoodsReceiptsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetGoodsReceiptsQuery, GetGoodsReceiptsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetGoodsReceiptsQuery, GetGoodsReceiptsQueryVariables>(GetGoodsReceiptsDocument, options);
        }
export type GetGoodsReceiptsQueryHookResult = ReturnType<typeof useGetGoodsReceiptsQuery>;
export type GetGoodsReceiptsLazyQueryHookResult = ReturnType<typeof useGetGoodsReceiptsLazyQuery>;
export type GetGoodsReceiptsSuspenseQueryHookResult = ReturnType<typeof useGetGoodsReceiptsSuspenseQuery>;
export type GetGoodsReceiptsQueryResult = Apollo.QueryResult<GetGoodsReceiptsQuery, GetGoodsReceiptsQueryVariables>;
export const CreateGoodsReceiptDocument = gql`
    mutation CreateGoodsReceipt($input: GoodsReceiptInput!) {
  createGoodsReceipt(input: $input) {
    id
    docNumber
    docDate
    status
    createdAt
  }
}
    `;
export type CreateGoodsReceiptMutationFn = Apollo.MutationFunction<CreateGoodsReceiptMutation, CreateGoodsReceiptMutationVariables>;
export function useCreateGoodsReceiptMutation(baseOptions?: Apollo.MutationHookOptions<CreateGoodsReceiptMutation, CreateGoodsReceiptMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateGoodsReceiptMutation, CreateGoodsReceiptMutationVariables>(CreateGoodsReceiptDocument, options);
      }
export type CreateGoodsReceiptMutationHookResult = ReturnType<typeof useCreateGoodsReceiptMutation>;
export type CreateGoodsReceiptMutationResult = Apollo.MutationResult<CreateGoodsReceiptMutation>;
export type CreateGoodsReceiptMutationOptions = Apollo.BaseMutationOptions<CreateGoodsReceiptMutation, CreateGoodsReceiptMutationVariables>;
export const UpdateGoodsReceiptDocument = gql`
    mutation UpdateGoodsReceipt($id: ID!, $input: GoodsReceiptInput!) {
  updateGoodsReceipt(id: $id, input: $input) {
    id
    docNumber
    docDate
    status
    createdAt
  }
}
    `;
export type UpdateGoodsReceiptMutationFn = Apollo.MutationFunction<UpdateGoodsReceiptMutation, UpdateGoodsReceiptMutationVariables>;
export function useUpdateGoodsReceiptMutation(baseOptions?: Apollo.MutationHookOptions<UpdateGoodsReceiptMutation, UpdateGoodsReceiptMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateGoodsReceiptMutation, UpdateGoodsReceiptMutationVariables>(UpdateGoodsReceiptDocument, options);
      }
export type UpdateGoodsReceiptMutationHookResult = ReturnType<typeof useUpdateGoodsReceiptMutation>;
export type UpdateGoodsReceiptMutationResult = Apollo.MutationResult<UpdateGoodsReceiptMutation>;
export type UpdateGoodsReceiptMutationOptions = Apollo.BaseMutationOptions<UpdateGoodsReceiptMutation, UpdateGoodsReceiptMutationVariables>;
export const DeleteGoodsReceiptDocument = gql`
    mutation DeleteGoodsReceipt($id: ID!) {
  deleteGoodsReceipt(id: $id)
}
    `;
export type DeleteGoodsReceiptMutationFn = Apollo.MutationFunction<DeleteGoodsReceiptMutation, DeleteGoodsReceiptMutationVariables>;
export function useDeleteGoodsReceiptMutation(baseOptions?: Apollo.MutationHookOptions<DeleteGoodsReceiptMutation, DeleteGoodsReceiptMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteGoodsReceiptMutation, DeleteGoodsReceiptMutationVariables>(DeleteGoodsReceiptDocument, options);
      }
export type DeleteGoodsReceiptMutationHookResult = ReturnType<typeof useDeleteGoodsReceiptMutation>;
export type DeleteGoodsReceiptMutationResult = Apollo.MutationResult<DeleteGoodsReceiptMutation>;
export type DeleteGoodsReceiptMutationOptions = Apollo.BaseMutationOptions<DeleteGoodsReceiptMutation, DeleteGoodsReceiptMutationVariables>;
export const GetGrNsDocument = gql`
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
    `;
export function useGetGrNsQuery(baseOptions: Apollo.QueryHookOptions<GetGrNsQuery, GetGrNsQueryVariables> & ({ variables: GetGrNsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetGrNsQuery, GetGrNsQueryVariables>(GetGrNsDocument, options);
      }
export function useGetGrNsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetGrNsQuery, GetGrNsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetGrNsQuery, GetGrNsQueryVariables>(GetGrNsDocument, options);
        }
// @ts-ignore
export function useGetGrNsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetGrNsQuery, GetGrNsQueryVariables>): Apollo.UseSuspenseQueryResult<GetGrNsQuery, GetGrNsQueryVariables>;
export function useGetGrNsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetGrNsQuery, GetGrNsQueryVariables>): Apollo.UseSuspenseQueryResult<GetGrNsQuery | undefined, GetGrNsQueryVariables>;
export function useGetGrNsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetGrNsQuery, GetGrNsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetGrNsQuery, GetGrNsQueryVariables>(GetGrNsDocument, options);
        }
export type GetGrNsQueryHookResult = ReturnType<typeof useGetGrNsQuery>;
export type GetGrNsLazyQueryHookResult = ReturnType<typeof useGetGrNsLazyQuery>;
export type GetGrNsSuspenseQueryHookResult = ReturnType<typeof useGetGrNsSuspenseQuery>;
export type GetGrNsQueryResult = Apollo.QueryResult<GetGrNsQuery, GetGrNsQueryVariables>;
export const CreateGrnDocument = gql`
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
    `;
export type CreateGrnMutationFn = Apollo.MutationFunction<CreateGrnMutation, CreateGrnMutationVariables>;
export function useCreateGrnMutation(baseOptions?: Apollo.MutationHookOptions<CreateGrnMutation, CreateGrnMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateGrnMutation, CreateGrnMutationVariables>(CreateGrnDocument, options);
      }
export type CreateGrnMutationHookResult = ReturnType<typeof useCreateGrnMutation>;
export type CreateGrnMutationResult = Apollo.MutationResult<CreateGrnMutation>;
export type CreateGrnMutationOptions = Apollo.BaseMutationOptions<CreateGrnMutation, CreateGrnMutationVariables>;
export const UpdateGrnDocument = gql`
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
    `;
export type UpdateGrnMutationFn = Apollo.MutationFunction<UpdateGrnMutation, UpdateGrnMutationVariables>;
export function useUpdateGrnMutation(baseOptions?: Apollo.MutationHookOptions<UpdateGrnMutation, UpdateGrnMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateGrnMutation, UpdateGrnMutationVariables>(UpdateGrnDocument, options);
      }
export type UpdateGrnMutationHookResult = ReturnType<typeof useUpdateGrnMutation>;
export type UpdateGrnMutationResult = Apollo.MutationResult<UpdateGrnMutation>;
export type UpdateGrnMutationOptions = Apollo.BaseMutationOptions<UpdateGrnMutation, UpdateGrnMutationVariables>;
export const SubmitGrnForApprovalDocument = gql`
    mutation SubmitGRNForApproval($id: ID!) {
  submitGRNForApproval(id: $id) {
    id
    grnNumber
    status
  }
}
    `;
export type SubmitGrnForApprovalMutationFn = Apollo.MutationFunction<SubmitGrnForApprovalMutation, SubmitGrnForApprovalMutationVariables>;
export function useSubmitGrnForApprovalMutation(baseOptions?: Apollo.MutationHookOptions<SubmitGrnForApprovalMutation, SubmitGrnForApprovalMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SubmitGrnForApprovalMutation, SubmitGrnForApprovalMutationVariables>(SubmitGrnForApprovalDocument, options);
      }
export type SubmitGrnForApprovalMutationHookResult = ReturnType<typeof useSubmitGrnForApprovalMutation>;
export type SubmitGrnForApprovalMutationResult = Apollo.MutationResult<SubmitGrnForApprovalMutation>;
export type SubmitGrnForApprovalMutationOptions = Apollo.BaseMutationOptions<SubmitGrnForApprovalMutation, SubmitGrnForApprovalMutationVariables>;
export const DeleteGrnDocument = gql`
    mutation DeleteGRN($id: ID!) {
  deleteGRN(id: $id)
}
    `;
export type DeleteGrnMutationFn = Apollo.MutationFunction<DeleteGrnMutation, DeleteGrnMutationVariables>;
export function useDeleteGrnMutation(baseOptions?: Apollo.MutationHookOptions<DeleteGrnMutation, DeleteGrnMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteGrnMutation, DeleteGrnMutationVariables>(DeleteGrnDocument, options);
      }
export type DeleteGrnMutationHookResult = ReturnType<typeof useDeleteGrnMutation>;
export type DeleteGrnMutationResult = Apollo.MutationResult<DeleteGrnMutation>;
export type DeleteGrnMutationOptions = Apollo.BaseMutationOptions<DeleteGrnMutation, DeleteGrnMutationVariables>;
export const GetDeliveryChallansDocument = gql`
    query GetDeliveryChallans($organizationId: String!) {
  deliverychallans(organizationId: $organizationId) {
    id
    docNumber
    docDate
    status
    createdAt
  }
}
    `;
export function useGetDeliveryChallansQuery(baseOptions: Apollo.QueryHookOptions<GetDeliveryChallansQuery, GetDeliveryChallansQueryVariables> & ({ variables: GetDeliveryChallansQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetDeliveryChallansQuery, GetDeliveryChallansQueryVariables>(GetDeliveryChallansDocument, options);
      }
export function useGetDeliveryChallansLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetDeliveryChallansQuery, GetDeliveryChallansQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetDeliveryChallansQuery, GetDeliveryChallansQueryVariables>(GetDeliveryChallansDocument, options);
        }
// @ts-ignore
export function useGetDeliveryChallansSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetDeliveryChallansQuery, GetDeliveryChallansQueryVariables>): Apollo.UseSuspenseQueryResult<GetDeliveryChallansQuery, GetDeliveryChallansQueryVariables>;
export function useGetDeliveryChallansSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetDeliveryChallansQuery, GetDeliveryChallansQueryVariables>): Apollo.UseSuspenseQueryResult<GetDeliveryChallansQuery | undefined, GetDeliveryChallansQueryVariables>;
export function useGetDeliveryChallansSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetDeliveryChallansQuery, GetDeliveryChallansQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetDeliveryChallansQuery, GetDeliveryChallansQueryVariables>(GetDeliveryChallansDocument, options);
        }
export type GetDeliveryChallansQueryHookResult = ReturnType<typeof useGetDeliveryChallansQuery>;
export type GetDeliveryChallansLazyQueryHookResult = ReturnType<typeof useGetDeliveryChallansLazyQuery>;
export type GetDeliveryChallansSuspenseQueryHookResult = ReturnType<typeof useGetDeliveryChallansSuspenseQuery>;
export type GetDeliveryChallansQueryResult = Apollo.QueryResult<GetDeliveryChallansQuery, GetDeliveryChallansQueryVariables>;
export const CreateDeliveryChallanDocument = gql`
    mutation CreateDeliveryChallan($input: DeliveryChallanInput!) {
  createDeliveryChallan(input: $input) {
    id
    docNumber
    status
  }
}
    `;
export type CreateDeliveryChallanMutationFn = Apollo.MutationFunction<CreateDeliveryChallanMutation, CreateDeliveryChallanMutationVariables>;
export function useCreateDeliveryChallanMutation(baseOptions?: Apollo.MutationHookOptions<CreateDeliveryChallanMutation, CreateDeliveryChallanMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateDeliveryChallanMutation, CreateDeliveryChallanMutationVariables>(CreateDeliveryChallanDocument, options);
      }
export type CreateDeliveryChallanMutationHookResult = ReturnType<typeof useCreateDeliveryChallanMutation>;
export type CreateDeliveryChallanMutationResult = Apollo.MutationResult<CreateDeliveryChallanMutation>;
export type CreateDeliveryChallanMutationOptions = Apollo.BaseMutationOptions<CreateDeliveryChallanMutation, CreateDeliveryChallanMutationVariables>;
export const SubmitDeliveryChallanForApprovalDocument = gql`
    mutation SubmitDeliveryChallanForApproval($id: ID!) {
  submitDeliveryChallanForApproval(id: $id) {
    id
    docNumber
    status
  }
}
    `;
export type SubmitDeliveryChallanForApprovalMutationFn = Apollo.MutationFunction<SubmitDeliveryChallanForApprovalMutation, SubmitDeliveryChallanForApprovalMutationVariables>;
export function useSubmitDeliveryChallanForApprovalMutation(baseOptions?: Apollo.MutationHookOptions<SubmitDeliveryChallanForApprovalMutation, SubmitDeliveryChallanForApprovalMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SubmitDeliveryChallanForApprovalMutation, SubmitDeliveryChallanForApprovalMutationVariables>(SubmitDeliveryChallanForApprovalDocument, options);
      }
export type SubmitDeliveryChallanForApprovalMutationHookResult = ReturnType<typeof useSubmitDeliveryChallanForApprovalMutation>;
export type SubmitDeliveryChallanForApprovalMutationResult = Apollo.MutationResult<SubmitDeliveryChallanForApprovalMutation>;
export type SubmitDeliveryChallanForApprovalMutationOptions = Apollo.BaseMutationOptions<SubmitDeliveryChallanForApprovalMutation, SubmitDeliveryChallanForApprovalMutationVariables>;
export const GetSalesReturnsDocument = gql`
    query GetSalesReturns($organizationId: String!) {
  salesreturns(organizationId: $organizationId) {
    id
    docNumber
    docDate
    status
    createdAt
  }
}
    `;
export function useGetSalesReturnsQuery(baseOptions: Apollo.QueryHookOptions<GetSalesReturnsQuery, GetSalesReturnsQueryVariables> & ({ variables: GetSalesReturnsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSalesReturnsQuery, GetSalesReturnsQueryVariables>(GetSalesReturnsDocument, options);
      }
export function useGetSalesReturnsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSalesReturnsQuery, GetSalesReturnsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSalesReturnsQuery, GetSalesReturnsQueryVariables>(GetSalesReturnsDocument, options);
        }
// @ts-ignore
export function useGetSalesReturnsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetSalesReturnsQuery, GetSalesReturnsQueryVariables>): Apollo.UseSuspenseQueryResult<GetSalesReturnsQuery, GetSalesReturnsQueryVariables>;
export function useGetSalesReturnsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetSalesReturnsQuery, GetSalesReturnsQueryVariables>): Apollo.UseSuspenseQueryResult<GetSalesReturnsQuery | undefined, GetSalesReturnsQueryVariables>;
export function useGetSalesReturnsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetSalesReturnsQuery, GetSalesReturnsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetSalesReturnsQuery, GetSalesReturnsQueryVariables>(GetSalesReturnsDocument, options);
        }
export type GetSalesReturnsQueryHookResult = ReturnType<typeof useGetSalesReturnsQuery>;
export type GetSalesReturnsLazyQueryHookResult = ReturnType<typeof useGetSalesReturnsLazyQuery>;
export type GetSalesReturnsSuspenseQueryHookResult = ReturnType<typeof useGetSalesReturnsSuspenseQuery>;
export type GetSalesReturnsQueryResult = Apollo.QueryResult<GetSalesReturnsQuery, GetSalesReturnsQueryVariables>;
export const CreateSalesReturnDocument = gql`
    mutation CreateSalesReturn($input: SalesReturnInput!) {
  createSalesReturn(input: $input) {
    id
    docNumber
    status
  }
}
    `;
export type CreateSalesReturnMutationFn = Apollo.MutationFunction<CreateSalesReturnMutation, CreateSalesReturnMutationVariables>;
export function useCreateSalesReturnMutation(baseOptions?: Apollo.MutationHookOptions<CreateSalesReturnMutation, CreateSalesReturnMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateSalesReturnMutation, CreateSalesReturnMutationVariables>(CreateSalesReturnDocument, options);
      }
export type CreateSalesReturnMutationHookResult = ReturnType<typeof useCreateSalesReturnMutation>;
export type CreateSalesReturnMutationResult = Apollo.MutationResult<CreateSalesReturnMutation>;
export type CreateSalesReturnMutationOptions = Apollo.BaseMutationOptions<CreateSalesReturnMutation, CreateSalesReturnMutationVariables>;
export const SubmitSalesReturnForApprovalDocument = gql`
    mutation SubmitSalesReturnForApproval($id: ID!) {
  submitSalesReturnForApproval(id: $id) {
    id
    docNumber
    status
  }
}
    `;
export type SubmitSalesReturnForApprovalMutationFn = Apollo.MutationFunction<SubmitSalesReturnForApprovalMutation, SubmitSalesReturnForApprovalMutationVariables>;
export function useSubmitSalesReturnForApprovalMutation(baseOptions?: Apollo.MutationHookOptions<SubmitSalesReturnForApprovalMutation, SubmitSalesReturnForApprovalMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SubmitSalesReturnForApprovalMutation, SubmitSalesReturnForApprovalMutationVariables>(SubmitSalesReturnForApprovalDocument, options);
      }
export type SubmitSalesReturnForApprovalMutationHookResult = ReturnType<typeof useSubmitSalesReturnForApprovalMutation>;
export type SubmitSalesReturnForApprovalMutationResult = Apollo.MutationResult<SubmitSalesReturnForApprovalMutation>;
export type SubmitSalesReturnForApprovalMutationOptions = Apollo.BaseMutationOptions<SubmitSalesReturnForApprovalMutation, SubmitSalesReturnForApprovalMutationVariables>;
export const GetStockAdjustmentsDocument = gql`
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
    `;
export function useGetStockAdjustmentsQuery(baseOptions: Apollo.QueryHookOptions<GetStockAdjustmentsQuery, GetStockAdjustmentsQueryVariables> & ({ variables: GetStockAdjustmentsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetStockAdjustmentsQuery, GetStockAdjustmentsQueryVariables>(GetStockAdjustmentsDocument, options);
      }
export function useGetStockAdjustmentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetStockAdjustmentsQuery, GetStockAdjustmentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetStockAdjustmentsQuery, GetStockAdjustmentsQueryVariables>(GetStockAdjustmentsDocument, options);
        }
// @ts-ignore
export function useGetStockAdjustmentsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetStockAdjustmentsQuery, GetStockAdjustmentsQueryVariables>): Apollo.UseSuspenseQueryResult<GetStockAdjustmentsQuery, GetStockAdjustmentsQueryVariables>;
export function useGetStockAdjustmentsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetStockAdjustmentsQuery, GetStockAdjustmentsQueryVariables>): Apollo.UseSuspenseQueryResult<GetStockAdjustmentsQuery | undefined, GetStockAdjustmentsQueryVariables>;
export function useGetStockAdjustmentsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetStockAdjustmentsQuery, GetStockAdjustmentsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetStockAdjustmentsQuery, GetStockAdjustmentsQueryVariables>(GetStockAdjustmentsDocument, options);
        }
export type GetStockAdjustmentsQueryHookResult = ReturnType<typeof useGetStockAdjustmentsQuery>;
export type GetStockAdjustmentsLazyQueryHookResult = ReturnType<typeof useGetStockAdjustmentsLazyQuery>;
export type GetStockAdjustmentsSuspenseQueryHookResult = ReturnType<typeof useGetStockAdjustmentsSuspenseQuery>;
export type GetStockAdjustmentsQueryResult = Apollo.QueryResult<GetStockAdjustmentsQuery, GetStockAdjustmentsQueryVariables>;
export const CreateStockAdjustmentDocument = gql`
    mutation CreateStockAdjustment($input: CreateStockAdjustmentInput!) {
  createStockAdjustment(input: $input) {
    id
    adjNumber
    status
  }
}
    `;
export type CreateStockAdjustmentMutationFn = Apollo.MutationFunction<CreateStockAdjustmentMutation, CreateStockAdjustmentMutationVariables>;
export function useCreateStockAdjustmentMutation(baseOptions?: Apollo.MutationHookOptions<CreateStockAdjustmentMutation, CreateStockAdjustmentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateStockAdjustmentMutation, CreateStockAdjustmentMutationVariables>(CreateStockAdjustmentDocument, options);
      }
export type CreateStockAdjustmentMutationHookResult = ReturnType<typeof useCreateStockAdjustmentMutation>;
export type CreateStockAdjustmentMutationResult = Apollo.MutationResult<CreateStockAdjustmentMutation>;
export type CreateStockAdjustmentMutationOptions = Apollo.BaseMutationOptions<CreateStockAdjustmentMutation, CreateStockAdjustmentMutationVariables>;
export const UpdateStockAdjustmentDocument = gql`
    mutation UpdateStockAdjustment($id: ID!, $input: UpdateStockAdjustmentInput!) {
  updateStockAdjustment(id: $id, input: $input) {
    id
    adjNumber
    status
  }
}
    `;
export type UpdateStockAdjustmentMutationFn = Apollo.MutationFunction<UpdateStockAdjustmentMutation, UpdateStockAdjustmentMutationVariables>;
export function useUpdateStockAdjustmentMutation(baseOptions?: Apollo.MutationHookOptions<UpdateStockAdjustmentMutation, UpdateStockAdjustmentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateStockAdjustmentMutation, UpdateStockAdjustmentMutationVariables>(UpdateStockAdjustmentDocument, options);
      }
export type UpdateStockAdjustmentMutationHookResult = ReturnType<typeof useUpdateStockAdjustmentMutation>;
export type UpdateStockAdjustmentMutationResult = Apollo.MutationResult<UpdateStockAdjustmentMutation>;
export type UpdateStockAdjustmentMutationOptions = Apollo.BaseMutationOptions<UpdateStockAdjustmentMutation, UpdateStockAdjustmentMutationVariables>;
export const ConfirmStockAdjustmentDocument = gql`
    mutation ConfirmStockAdjustment($id: ID!) {
  confirmStockAdjustment(id: $id) {
    id
    adjNumber
    status
  }
}
    `;
export type ConfirmStockAdjustmentMutationFn = Apollo.MutationFunction<ConfirmStockAdjustmentMutation, ConfirmStockAdjustmentMutationVariables>;
export function useConfirmStockAdjustmentMutation(baseOptions?: Apollo.MutationHookOptions<ConfirmStockAdjustmentMutation, ConfirmStockAdjustmentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ConfirmStockAdjustmentMutation, ConfirmStockAdjustmentMutationVariables>(ConfirmStockAdjustmentDocument, options);
      }
export type ConfirmStockAdjustmentMutationHookResult = ReturnType<typeof useConfirmStockAdjustmentMutation>;
export type ConfirmStockAdjustmentMutationResult = Apollo.MutationResult<ConfirmStockAdjustmentMutation>;
export type ConfirmStockAdjustmentMutationOptions = Apollo.BaseMutationOptions<ConfirmStockAdjustmentMutation, ConfirmStockAdjustmentMutationVariables>;
export const CancelStockAdjustmentDocument = gql`
    mutation CancelStockAdjustment($id: ID!) {
  cancelStockAdjustment(id: $id) {
    id
    adjNumber
    status
  }
}
    `;
export type CancelStockAdjustmentMutationFn = Apollo.MutationFunction<CancelStockAdjustmentMutation, CancelStockAdjustmentMutationVariables>;
export function useCancelStockAdjustmentMutation(baseOptions?: Apollo.MutationHookOptions<CancelStockAdjustmentMutation, CancelStockAdjustmentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CancelStockAdjustmentMutation, CancelStockAdjustmentMutationVariables>(CancelStockAdjustmentDocument, options);
      }
export type CancelStockAdjustmentMutationHookResult = ReturnType<typeof useCancelStockAdjustmentMutation>;
export type CancelStockAdjustmentMutationResult = Apollo.MutationResult<CancelStockAdjustmentMutation>;
export type CancelStockAdjustmentMutationOptions = Apollo.BaseMutationOptions<CancelStockAdjustmentMutation, CancelStockAdjustmentMutationVariables>;
export const DeleteStockAdjustmentDocument = gql`
    mutation DeleteStockAdjustment($id: ID!) {
  deleteStockAdjustment(id: $id)
}
    `;
export type DeleteStockAdjustmentMutationFn = Apollo.MutationFunction<DeleteStockAdjustmentMutation, DeleteStockAdjustmentMutationVariables>;
export function useDeleteStockAdjustmentMutation(baseOptions?: Apollo.MutationHookOptions<DeleteStockAdjustmentMutation, DeleteStockAdjustmentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteStockAdjustmentMutation, DeleteStockAdjustmentMutationVariables>(DeleteStockAdjustmentDocument, options);
      }
export type DeleteStockAdjustmentMutationHookResult = ReturnType<typeof useDeleteStockAdjustmentMutation>;
export type DeleteStockAdjustmentMutationResult = Apollo.MutationResult<DeleteStockAdjustmentMutation>;
export type DeleteStockAdjustmentMutationOptions = Apollo.BaseMutationOptions<DeleteStockAdjustmentMutation, DeleteStockAdjustmentMutationVariables>;
export const GetStockTransfersDocument = gql`
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
    `;
export function useGetStockTransfersQuery(baseOptions: Apollo.QueryHookOptions<GetStockTransfersQuery, GetStockTransfersQueryVariables> & ({ variables: GetStockTransfersQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetStockTransfersQuery, GetStockTransfersQueryVariables>(GetStockTransfersDocument, options);
      }
export function useGetStockTransfersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetStockTransfersQuery, GetStockTransfersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetStockTransfersQuery, GetStockTransfersQueryVariables>(GetStockTransfersDocument, options);
        }
// @ts-ignore
export function useGetStockTransfersSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetStockTransfersQuery, GetStockTransfersQueryVariables>): Apollo.UseSuspenseQueryResult<GetStockTransfersQuery, GetStockTransfersQueryVariables>;
export function useGetStockTransfersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetStockTransfersQuery, GetStockTransfersQueryVariables>): Apollo.UseSuspenseQueryResult<GetStockTransfersQuery | undefined, GetStockTransfersQueryVariables>;
export function useGetStockTransfersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetStockTransfersQuery, GetStockTransfersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetStockTransfersQuery, GetStockTransfersQueryVariables>(GetStockTransfersDocument, options);
        }
export type GetStockTransfersQueryHookResult = ReturnType<typeof useGetStockTransfersQuery>;
export type GetStockTransfersLazyQueryHookResult = ReturnType<typeof useGetStockTransfersLazyQuery>;
export type GetStockTransfersSuspenseQueryHookResult = ReturnType<typeof useGetStockTransfersSuspenseQuery>;
export type GetStockTransfersQueryResult = Apollo.QueryResult<GetStockTransfersQuery, GetStockTransfersQueryVariables>;
export const CreateStockTransferDocument = gql`
    mutation CreateStockTransfer($input: CreateStockTransferInput!) {
  createStockTransfer(input: $input) {
    id
    transferNumber
    status
  }
}
    `;
export type CreateStockTransferMutationFn = Apollo.MutationFunction<CreateStockTransferMutation, CreateStockTransferMutationVariables>;
export function useCreateStockTransferMutation(baseOptions?: Apollo.MutationHookOptions<CreateStockTransferMutation, CreateStockTransferMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateStockTransferMutation, CreateStockTransferMutationVariables>(CreateStockTransferDocument, options);
      }
export type CreateStockTransferMutationHookResult = ReturnType<typeof useCreateStockTransferMutation>;
export type CreateStockTransferMutationResult = Apollo.MutationResult<CreateStockTransferMutation>;
export type CreateStockTransferMutationOptions = Apollo.BaseMutationOptions<CreateStockTransferMutation, CreateStockTransferMutationVariables>;
export const UpdateStockTransferDocument = gql`
    mutation UpdateStockTransfer($id: ID!, $input: UpdateStockTransferInput!) {
  updateStockTransfer(id: $id, input: $input) {
    id
    transferNumber
    status
  }
}
    `;
export type UpdateStockTransferMutationFn = Apollo.MutationFunction<UpdateStockTransferMutation, UpdateStockTransferMutationVariables>;
export function useUpdateStockTransferMutation(baseOptions?: Apollo.MutationHookOptions<UpdateStockTransferMutation, UpdateStockTransferMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateStockTransferMutation, UpdateStockTransferMutationVariables>(UpdateStockTransferDocument, options);
      }
export type UpdateStockTransferMutationHookResult = ReturnType<typeof useUpdateStockTransferMutation>;
export type UpdateStockTransferMutationResult = Apollo.MutationResult<UpdateStockTransferMutation>;
export type UpdateStockTransferMutationOptions = Apollo.BaseMutationOptions<UpdateStockTransferMutation, UpdateStockTransferMutationVariables>;
export const ConfirmStockTransferDocument = gql`
    mutation ConfirmStockTransfer($id: ID!) {
  confirmStockTransfer(id: $id) {
    id
    transferNumber
    status
  }
}
    `;
export type ConfirmStockTransferMutationFn = Apollo.MutationFunction<ConfirmStockTransferMutation, ConfirmStockTransferMutationVariables>;
export function useConfirmStockTransferMutation(baseOptions?: Apollo.MutationHookOptions<ConfirmStockTransferMutation, ConfirmStockTransferMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ConfirmStockTransferMutation, ConfirmStockTransferMutationVariables>(ConfirmStockTransferDocument, options);
      }
export type ConfirmStockTransferMutationHookResult = ReturnType<typeof useConfirmStockTransferMutation>;
export type ConfirmStockTransferMutationResult = Apollo.MutationResult<ConfirmStockTransferMutation>;
export type ConfirmStockTransferMutationOptions = Apollo.BaseMutationOptions<ConfirmStockTransferMutation, ConfirmStockTransferMutationVariables>;
export const CancelStockTransferDocument = gql`
    mutation CancelStockTransfer($id: ID!) {
  cancelStockTransfer(id: $id) {
    id
    transferNumber
    status
  }
}
    `;
export type CancelStockTransferMutationFn = Apollo.MutationFunction<CancelStockTransferMutation, CancelStockTransferMutationVariables>;
export function useCancelStockTransferMutation(baseOptions?: Apollo.MutationHookOptions<CancelStockTransferMutation, CancelStockTransferMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CancelStockTransferMutation, CancelStockTransferMutationVariables>(CancelStockTransferDocument, options);
      }
export type CancelStockTransferMutationHookResult = ReturnType<typeof useCancelStockTransferMutation>;
export type CancelStockTransferMutationResult = Apollo.MutationResult<CancelStockTransferMutation>;
export type CancelStockTransferMutationOptions = Apollo.BaseMutationOptions<CancelStockTransferMutation, CancelStockTransferMutationVariables>;
export const DeleteStockTransferDocument = gql`
    mutation DeleteStockTransfer($id: ID!) {
  deleteStockTransfer(id: $id)
}
    `;
export type DeleteStockTransferMutationFn = Apollo.MutationFunction<DeleteStockTransferMutation, DeleteStockTransferMutationVariables>;
export function useDeleteStockTransferMutation(baseOptions?: Apollo.MutationHookOptions<DeleteStockTransferMutation, DeleteStockTransferMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteStockTransferMutation, DeleteStockTransferMutationVariables>(DeleteStockTransferDocument, options);
      }
export type DeleteStockTransferMutationHookResult = ReturnType<typeof useDeleteStockTransferMutation>;
export type DeleteStockTransferMutationResult = Apollo.MutationResult<DeleteStockTransferMutation>;
export type DeleteStockTransferMutationOptions = Apollo.BaseMutationOptions<DeleteStockTransferMutation, DeleteStockTransferMutationVariables>;
export const GetAssetsDocument = gql`
    query GetAssets($organizationId: String!, $page: Int, $limit: Int, $status: String, $assetType: String) {
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
    `;
export function useGetAssetsQuery(baseOptions: Apollo.QueryHookOptions<GetAssetsQuery, GetAssetsQueryVariables> & ({ variables: GetAssetsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAssetsQuery, GetAssetsQueryVariables>(GetAssetsDocument, options);
      }
export function useGetAssetsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAssetsQuery, GetAssetsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAssetsQuery, GetAssetsQueryVariables>(GetAssetsDocument, options);
        }
// @ts-ignore
export function useGetAssetsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetAssetsQuery, GetAssetsQueryVariables>): Apollo.UseSuspenseQueryResult<GetAssetsQuery, GetAssetsQueryVariables>;
export function useGetAssetsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAssetsQuery, GetAssetsQueryVariables>): Apollo.UseSuspenseQueryResult<GetAssetsQuery | undefined, GetAssetsQueryVariables>;
export function useGetAssetsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAssetsQuery, GetAssetsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAssetsQuery, GetAssetsQueryVariables>(GetAssetsDocument, options);
        }
export type GetAssetsQueryHookResult = ReturnType<typeof useGetAssetsQuery>;
export type GetAssetsLazyQueryHookResult = ReturnType<typeof useGetAssetsLazyQuery>;
export type GetAssetsSuspenseQueryHookResult = ReturnType<typeof useGetAssetsSuspenseQuery>;
export type GetAssetsQueryResult = Apollo.QueryResult<GetAssetsQuery, GetAssetsQueryVariables>;
export const CreateAssetDocument = gql`
    mutation CreateAsset($input: AssetInput!) {
  createAsset(input: $input) {
    id
    assetNumber
    assetName
    status
  }
}
    `;
export type CreateAssetMutationFn = Apollo.MutationFunction<CreateAssetMutation, CreateAssetMutationVariables>;
export function useCreateAssetMutation(baseOptions?: Apollo.MutationHookOptions<CreateAssetMutation, CreateAssetMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateAssetMutation, CreateAssetMutationVariables>(CreateAssetDocument, options);
      }
export type CreateAssetMutationHookResult = ReturnType<typeof useCreateAssetMutation>;
export type CreateAssetMutationResult = Apollo.MutationResult<CreateAssetMutation>;
export type CreateAssetMutationOptions = Apollo.BaseMutationOptions<CreateAssetMutation, CreateAssetMutationVariables>;
export const UpdateAssetDocument = gql`
    mutation UpdateAsset($id: ID!, $input: AssetInput!) {
  updateAsset(id: $id, input: $input) {
    id
    assetNumber
    assetName
    status
  }
}
    `;
export type UpdateAssetMutationFn = Apollo.MutationFunction<UpdateAssetMutation, UpdateAssetMutationVariables>;
export function useUpdateAssetMutation(baseOptions?: Apollo.MutationHookOptions<UpdateAssetMutation, UpdateAssetMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateAssetMutation, UpdateAssetMutationVariables>(UpdateAssetDocument, options);
      }
export type UpdateAssetMutationHookResult = ReturnType<typeof useUpdateAssetMutation>;
export type UpdateAssetMutationResult = Apollo.MutationResult<UpdateAssetMutation>;
export type UpdateAssetMutationOptions = Apollo.BaseMutationOptions<UpdateAssetMutation, UpdateAssetMutationVariables>;
export const DeleteAssetDocument = gql`
    mutation DeleteAsset($id: ID!) {
  deleteAsset(id: $id)
}
    `;
export type DeleteAssetMutationFn = Apollo.MutationFunction<DeleteAssetMutation, DeleteAssetMutationVariables>;
export function useDeleteAssetMutation(baseOptions?: Apollo.MutationHookOptions<DeleteAssetMutation, DeleteAssetMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteAssetMutation, DeleteAssetMutationVariables>(DeleteAssetDocument, options);
      }
export type DeleteAssetMutationHookResult = ReturnType<typeof useDeleteAssetMutation>;
export type DeleteAssetMutationResult = Apollo.MutationResult<DeleteAssetMutation>;
export type DeleteAssetMutationOptions = Apollo.BaseMutationOptions<DeleteAssetMutation, DeleteAssetMutationVariables>;
export const GetIntercompanyTransfersDocument = gql`
    query GetIntercompanyTransfers($organizationId: ID!, $page: Int, $limit: Int) {
  intercompanyTransfers(
    organizationId: $organizationId
    page: $page
    limit: $limit
  ) {
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
    `;
export function useGetIntercompanyTransfersQuery(baseOptions: Apollo.QueryHookOptions<GetIntercompanyTransfersQuery, GetIntercompanyTransfersQueryVariables> & ({ variables: GetIntercompanyTransfersQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetIntercompanyTransfersQuery, GetIntercompanyTransfersQueryVariables>(GetIntercompanyTransfersDocument, options);
      }
export function useGetIntercompanyTransfersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetIntercompanyTransfersQuery, GetIntercompanyTransfersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetIntercompanyTransfersQuery, GetIntercompanyTransfersQueryVariables>(GetIntercompanyTransfersDocument, options);
        }
// @ts-ignore
export function useGetIntercompanyTransfersSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetIntercompanyTransfersQuery, GetIntercompanyTransfersQueryVariables>): Apollo.UseSuspenseQueryResult<GetIntercompanyTransfersQuery, GetIntercompanyTransfersQueryVariables>;
export function useGetIntercompanyTransfersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetIntercompanyTransfersQuery, GetIntercompanyTransfersQueryVariables>): Apollo.UseSuspenseQueryResult<GetIntercompanyTransfersQuery | undefined, GetIntercompanyTransfersQueryVariables>;
export function useGetIntercompanyTransfersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetIntercompanyTransfersQuery, GetIntercompanyTransfersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetIntercompanyTransfersQuery, GetIntercompanyTransfersQueryVariables>(GetIntercompanyTransfersDocument, options);
        }
export type GetIntercompanyTransfersQueryHookResult = ReturnType<typeof useGetIntercompanyTransfersQuery>;
export type GetIntercompanyTransfersLazyQueryHookResult = ReturnType<typeof useGetIntercompanyTransfersLazyQuery>;
export type GetIntercompanyTransfersSuspenseQueryHookResult = ReturnType<typeof useGetIntercompanyTransfersSuspenseQuery>;
export type GetIntercompanyTransfersQueryResult = Apollo.QueryResult<GetIntercompanyTransfersQuery, GetIntercompanyTransfersQueryVariables>;
export const CreateIntercompanyTransferDocument = gql`
    mutation CreateIntercompanyTransfer($input: CreateIntercompanyTransferInput!) {
  createIntercompanyTransfer(input: $input) {
    id
    transferNumber
    status
  }
}
    `;
export type CreateIntercompanyTransferMutationFn = Apollo.MutationFunction<CreateIntercompanyTransferMutation, CreateIntercompanyTransferMutationVariables>;
export function useCreateIntercompanyTransferMutation(baseOptions?: Apollo.MutationHookOptions<CreateIntercompanyTransferMutation, CreateIntercompanyTransferMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateIntercompanyTransferMutation, CreateIntercompanyTransferMutationVariables>(CreateIntercompanyTransferDocument, options);
      }
export type CreateIntercompanyTransferMutationHookResult = ReturnType<typeof useCreateIntercompanyTransferMutation>;
export type CreateIntercompanyTransferMutationResult = Apollo.MutationResult<CreateIntercompanyTransferMutation>;
export type CreateIntercompanyTransferMutationOptions = Apollo.BaseMutationOptions<CreateIntercompanyTransferMutation, CreateIntercompanyTransferMutationVariables>;
export const UpdateIntercompanyTransferDocument = gql`
    mutation UpdateIntercompanyTransfer($id: ID!, $input: UpdateIntercompanyTransferInput!) {
  updateIntercompanyTransfer(id: $id, input: $input) {
    id
    transferNumber
    status
  }
}
    `;
export type UpdateIntercompanyTransferMutationFn = Apollo.MutationFunction<UpdateIntercompanyTransferMutation, UpdateIntercompanyTransferMutationVariables>;
export function useUpdateIntercompanyTransferMutation(baseOptions?: Apollo.MutationHookOptions<UpdateIntercompanyTransferMutation, UpdateIntercompanyTransferMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateIntercompanyTransferMutation, UpdateIntercompanyTransferMutationVariables>(UpdateIntercompanyTransferDocument, options);
      }
export type UpdateIntercompanyTransferMutationHookResult = ReturnType<typeof useUpdateIntercompanyTransferMutation>;
export type UpdateIntercompanyTransferMutationResult = Apollo.MutationResult<UpdateIntercompanyTransferMutation>;
export type UpdateIntercompanyTransferMutationOptions = Apollo.BaseMutationOptions<UpdateIntercompanyTransferMutation, UpdateIntercompanyTransferMutationVariables>;
export const ConfirmIntercompanyTransferDocument = gql`
    mutation ConfirmIntercompanyTransfer($id: ID!) {
  confirmIntercompanyTransfer(id: $id) {
    id
    transferNumber
    status
  }
}
    `;
export type ConfirmIntercompanyTransferMutationFn = Apollo.MutationFunction<ConfirmIntercompanyTransferMutation, ConfirmIntercompanyTransferMutationVariables>;
export function useConfirmIntercompanyTransferMutation(baseOptions?: Apollo.MutationHookOptions<ConfirmIntercompanyTransferMutation, ConfirmIntercompanyTransferMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ConfirmIntercompanyTransferMutation, ConfirmIntercompanyTransferMutationVariables>(ConfirmIntercompanyTransferDocument, options);
      }
export type ConfirmIntercompanyTransferMutationHookResult = ReturnType<typeof useConfirmIntercompanyTransferMutation>;
export type ConfirmIntercompanyTransferMutationResult = Apollo.MutationResult<ConfirmIntercompanyTransferMutation>;
export type ConfirmIntercompanyTransferMutationOptions = Apollo.BaseMutationOptions<ConfirmIntercompanyTransferMutation, ConfirmIntercompanyTransferMutationVariables>;
export const CancelIntercompanyTransferDocument = gql`
    mutation CancelIntercompanyTransfer($id: ID!) {
  cancelIntercompanyTransfer(id: $id) {
    id
    transferNumber
    status
  }
}
    `;
export type CancelIntercompanyTransferMutationFn = Apollo.MutationFunction<CancelIntercompanyTransferMutation, CancelIntercompanyTransferMutationVariables>;
export function useCancelIntercompanyTransferMutation(baseOptions?: Apollo.MutationHookOptions<CancelIntercompanyTransferMutation, CancelIntercompanyTransferMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CancelIntercompanyTransferMutation, CancelIntercompanyTransferMutationVariables>(CancelIntercompanyTransferDocument, options);
      }
export type CancelIntercompanyTransferMutationHookResult = ReturnType<typeof useCancelIntercompanyTransferMutation>;
export type CancelIntercompanyTransferMutationResult = Apollo.MutationResult<CancelIntercompanyTransferMutation>;
export type CancelIntercompanyTransferMutationOptions = Apollo.BaseMutationOptions<CancelIntercompanyTransferMutation, CancelIntercompanyTransferMutationVariables>;
export const DeleteIntercompanyTransferDocument = gql`
    mutation DeleteIntercompanyTransfer($id: ID!) {
  deleteIntercompanyTransfer(id: $id)
}
    `;
export type DeleteIntercompanyTransferMutationFn = Apollo.MutationFunction<DeleteIntercompanyTransferMutation, DeleteIntercompanyTransferMutationVariables>;
export function useDeleteIntercompanyTransferMutation(baseOptions?: Apollo.MutationHookOptions<DeleteIntercompanyTransferMutation, DeleteIntercompanyTransferMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteIntercompanyTransferMutation, DeleteIntercompanyTransferMutationVariables>(DeleteIntercompanyTransferDocument, options);
      }
export type DeleteIntercompanyTransferMutationHookResult = ReturnType<typeof useDeleteIntercompanyTransferMutation>;
export type DeleteIntercompanyTransferMutationResult = Apollo.MutationResult<DeleteIntercompanyTransferMutation>;
export type DeleteIntercompanyTransferMutationOptions = Apollo.BaseMutationOptions<DeleteIntercompanyTransferMutation, DeleteIntercompanyTransferMutationVariables>;
export const GetPayrollManagementsDocument = gql`
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
    `;
export function useGetPayrollManagementsQuery(baseOptions: Apollo.QueryHookOptions<GetPayrollManagementsQuery, GetPayrollManagementsQueryVariables> & ({ variables: GetPayrollManagementsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPayrollManagementsQuery, GetPayrollManagementsQueryVariables>(GetPayrollManagementsDocument, options);
      }
export function useGetPayrollManagementsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPayrollManagementsQuery, GetPayrollManagementsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPayrollManagementsQuery, GetPayrollManagementsQueryVariables>(GetPayrollManagementsDocument, options);
        }
// @ts-ignore
export function useGetPayrollManagementsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetPayrollManagementsQuery, GetPayrollManagementsQueryVariables>): Apollo.UseSuspenseQueryResult<GetPayrollManagementsQuery, GetPayrollManagementsQueryVariables>;
export function useGetPayrollManagementsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPayrollManagementsQuery, GetPayrollManagementsQueryVariables>): Apollo.UseSuspenseQueryResult<GetPayrollManagementsQuery | undefined, GetPayrollManagementsQueryVariables>;
export function useGetPayrollManagementsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPayrollManagementsQuery, GetPayrollManagementsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPayrollManagementsQuery, GetPayrollManagementsQueryVariables>(GetPayrollManagementsDocument, options);
        }
export type GetPayrollManagementsQueryHookResult = ReturnType<typeof useGetPayrollManagementsQuery>;
export type GetPayrollManagementsLazyQueryHookResult = ReturnType<typeof useGetPayrollManagementsLazyQuery>;
export type GetPayrollManagementsSuspenseQueryHookResult = ReturnType<typeof useGetPayrollManagementsSuspenseQuery>;
export type GetPayrollManagementsQueryResult = Apollo.QueryResult<GetPayrollManagementsQuery, GetPayrollManagementsQueryVariables>;
export const CreatePayrollManagementDocument = gql`
    mutation CreatePayrollManagement($input: PayrollManagementInput!) {
  createPayrollManagement(input: $input) {
    id
    docNumber
  }
}
    `;
export type CreatePayrollManagementMutationFn = Apollo.MutationFunction<CreatePayrollManagementMutation, CreatePayrollManagementMutationVariables>;
export function useCreatePayrollManagementMutation(baseOptions?: Apollo.MutationHookOptions<CreatePayrollManagementMutation, CreatePayrollManagementMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreatePayrollManagementMutation, CreatePayrollManagementMutationVariables>(CreatePayrollManagementDocument, options);
      }
export type CreatePayrollManagementMutationHookResult = ReturnType<typeof useCreatePayrollManagementMutation>;
export type CreatePayrollManagementMutationResult = Apollo.MutationResult<CreatePayrollManagementMutation>;
export type CreatePayrollManagementMutationOptions = Apollo.BaseMutationOptions<CreatePayrollManagementMutation, CreatePayrollManagementMutationVariables>;
export const UpdatePayrollManagementDocument = gql`
    mutation UpdatePayrollManagement($id: ID!, $input: PayrollManagementInput!) {
  updatePayrollManagement(id: $id, input: $input) {
    id
    docNumber
  }
}
    `;
export type UpdatePayrollManagementMutationFn = Apollo.MutationFunction<UpdatePayrollManagementMutation, UpdatePayrollManagementMutationVariables>;
export function useUpdatePayrollManagementMutation(baseOptions?: Apollo.MutationHookOptions<UpdatePayrollManagementMutation, UpdatePayrollManagementMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdatePayrollManagementMutation, UpdatePayrollManagementMutationVariables>(UpdatePayrollManagementDocument, options);
      }
export type UpdatePayrollManagementMutationHookResult = ReturnType<typeof useUpdatePayrollManagementMutation>;
export type UpdatePayrollManagementMutationResult = Apollo.MutationResult<UpdatePayrollManagementMutation>;
export type UpdatePayrollManagementMutationOptions = Apollo.BaseMutationOptions<UpdatePayrollManagementMutation, UpdatePayrollManagementMutationVariables>;
export const DeletePayrollManagementDocument = gql`
    mutation DeletePayrollManagement($id: ID!) {
  deletePayrollManagement(id: $id)
}
    `;
export type DeletePayrollManagementMutationFn = Apollo.MutationFunction<DeletePayrollManagementMutation, DeletePayrollManagementMutationVariables>;
export function useDeletePayrollManagementMutation(baseOptions?: Apollo.MutationHookOptions<DeletePayrollManagementMutation, DeletePayrollManagementMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeletePayrollManagementMutation, DeletePayrollManagementMutationVariables>(DeletePayrollManagementDocument, options);
      }
export type DeletePayrollManagementMutationHookResult = ReturnType<typeof useDeletePayrollManagementMutation>;
export type DeletePayrollManagementMutationResult = Apollo.MutationResult<DeletePayrollManagementMutation>;
export type DeletePayrollManagementMutationOptions = Apollo.BaseMutationOptions<DeletePayrollManagementMutation, DeletePayrollManagementMutationVariables>;
export const SubmitPayrollManagementForApprovalDocument = gql`
    mutation SubmitPayrollManagementForApproval($id: ID!) {
  submitPayrollManagementForApproval(id: $id) {
    id
    docNumber
    status
  }
}
    `;
export type SubmitPayrollManagementForApprovalMutationFn = Apollo.MutationFunction<SubmitPayrollManagementForApprovalMutation, SubmitPayrollManagementForApprovalMutationVariables>;
export function useSubmitPayrollManagementForApprovalMutation(baseOptions?: Apollo.MutationHookOptions<SubmitPayrollManagementForApprovalMutation, SubmitPayrollManagementForApprovalMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SubmitPayrollManagementForApprovalMutation, SubmitPayrollManagementForApprovalMutationVariables>(SubmitPayrollManagementForApprovalDocument, options);
      }
export type SubmitPayrollManagementForApprovalMutationHookResult = ReturnType<typeof useSubmitPayrollManagementForApprovalMutation>;
export type SubmitPayrollManagementForApprovalMutationResult = Apollo.MutationResult<SubmitPayrollManagementForApprovalMutation>;
export type SubmitPayrollManagementForApprovalMutationOptions = Apollo.BaseMutationOptions<SubmitPayrollManagementForApprovalMutation, SubmitPayrollManagementForApprovalMutationVariables>;
export const GetSalaryProcessingsDocument = gql`
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
    `;
export function useGetSalaryProcessingsQuery(baseOptions: Apollo.QueryHookOptions<GetSalaryProcessingsQuery, GetSalaryProcessingsQueryVariables> & ({ variables: GetSalaryProcessingsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSalaryProcessingsQuery, GetSalaryProcessingsQueryVariables>(GetSalaryProcessingsDocument, options);
      }
export function useGetSalaryProcessingsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSalaryProcessingsQuery, GetSalaryProcessingsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSalaryProcessingsQuery, GetSalaryProcessingsQueryVariables>(GetSalaryProcessingsDocument, options);
        }
// @ts-ignore
export function useGetSalaryProcessingsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetSalaryProcessingsQuery, GetSalaryProcessingsQueryVariables>): Apollo.UseSuspenseQueryResult<GetSalaryProcessingsQuery, GetSalaryProcessingsQueryVariables>;
export function useGetSalaryProcessingsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetSalaryProcessingsQuery, GetSalaryProcessingsQueryVariables>): Apollo.UseSuspenseQueryResult<GetSalaryProcessingsQuery | undefined, GetSalaryProcessingsQueryVariables>;
export function useGetSalaryProcessingsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetSalaryProcessingsQuery, GetSalaryProcessingsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetSalaryProcessingsQuery, GetSalaryProcessingsQueryVariables>(GetSalaryProcessingsDocument, options);
        }
export type GetSalaryProcessingsQueryHookResult = ReturnType<typeof useGetSalaryProcessingsQuery>;
export type GetSalaryProcessingsLazyQueryHookResult = ReturnType<typeof useGetSalaryProcessingsLazyQuery>;
export type GetSalaryProcessingsSuspenseQueryHookResult = ReturnType<typeof useGetSalaryProcessingsSuspenseQuery>;
export type GetSalaryProcessingsQueryResult = Apollo.QueryResult<GetSalaryProcessingsQuery, GetSalaryProcessingsQueryVariables>;
export const CreateSalaryProcessingDocument = gql`
    mutation CreateSalaryProcessing($input: SalaryProcessingInput!) {
  createSalaryProcessing(input: $input) {
    id
    docNumber
  }
}
    `;
export type CreateSalaryProcessingMutationFn = Apollo.MutationFunction<CreateSalaryProcessingMutation, CreateSalaryProcessingMutationVariables>;
export function useCreateSalaryProcessingMutation(baseOptions?: Apollo.MutationHookOptions<CreateSalaryProcessingMutation, CreateSalaryProcessingMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateSalaryProcessingMutation, CreateSalaryProcessingMutationVariables>(CreateSalaryProcessingDocument, options);
      }
export type CreateSalaryProcessingMutationHookResult = ReturnType<typeof useCreateSalaryProcessingMutation>;
export type CreateSalaryProcessingMutationResult = Apollo.MutationResult<CreateSalaryProcessingMutation>;
export type CreateSalaryProcessingMutationOptions = Apollo.BaseMutationOptions<CreateSalaryProcessingMutation, CreateSalaryProcessingMutationVariables>;
export const UpdateSalaryProcessingDocument = gql`
    mutation UpdateSalaryProcessing($id: ID!, $input: SalaryProcessingInput!) {
  updateSalaryProcessing(id: $id, input: $input) {
    id
    docNumber
  }
}
    `;
export type UpdateSalaryProcessingMutationFn = Apollo.MutationFunction<UpdateSalaryProcessingMutation, UpdateSalaryProcessingMutationVariables>;
export function useUpdateSalaryProcessingMutation(baseOptions?: Apollo.MutationHookOptions<UpdateSalaryProcessingMutation, UpdateSalaryProcessingMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateSalaryProcessingMutation, UpdateSalaryProcessingMutationVariables>(UpdateSalaryProcessingDocument, options);
      }
export type UpdateSalaryProcessingMutationHookResult = ReturnType<typeof useUpdateSalaryProcessingMutation>;
export type UpdateSalaryProcessingMutationResult = Apollo.MutationResult<UpdateSalaryProcessingMutation>;
export type UpdateSalaryProcessingMutationOptions = Apollo.BaseMutationOptions<UpdateSalaryProcessingMutation, UpdateSalaryProcessingMutationVariables>;
export const DeleteSalaryProcessingDocument = gql`
    mutation DeleteSalaryProcessing($id: ID!) {
  deleteSalaryProcessing(id: $id)
}
    `;
export type DeleteSalaryProcessingMutationFn = Apollo.MutationFunction<DeleteSalaryProcessingMutation, DeleteSalaryProcessingMutationVariables>;
export function useDeleteSalaryProcessingMutation(baseOptions?: Apollo.MutationHookOptions<DeleteSalaryProcessingMutation, DeleteSalaryProcessingMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteSalaryProcessingMutation, DeleteSalaryProcessingMutationVariables>(DeleteSalaryProcessingDocument, options);
      }
export type DeleteSalaryProcessingMutationHookResult = ReturnType<typeof useDeleteSalaryProcessingMutation>;
export type DeleteSalaryProcessingMutationResult = Apollo.MutationResult<DeleteSalaryProcessingMutation>;
export type DeleteSalaryProcessingMutationOptions = Apollo.BaseMutationOptions<DeleteSalaryProcessingMutation, DeleteSalaryProcessingMutationVariables>;
export const GetLoanRepaymentsDocument = gql`
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
    `;
export function useGetLoanRepaymentsQuery(baseOptions: Apollo.QueryHookOptions<GetLoanRepaymentsQuery, GetLoanRepaymentsQueryVariables> & ({ variables: GetLoanRepaymentsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetLoanRepaymentsQuery, GetLoanRepaymentsQueryVariables>(GetLoanRepaymentsDocument, options);
      }
export function useGetLoanRepaymentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetLoanRepaymentsQuery, GetLoanRepaymentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetLoanRepaymentsQuery, GetLoanRepaymentsQueryVariables>(GetLoanRepaymentsDocument, options);
        }
// @ts-ignore
export function useGetLoanRepaymentsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetLoanRepaymentsQuery, GetLoanRepaymentsQueryVariables>): Apollo.UseSuspenseQueryResult<GetLoanRepaymentsQuery, GetLoanRepaymentsQueryVariables>;
export function useGetLoanRepaymentsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetLoanRepaymentsQuery, GetLoanRepaymentsQueryVariables>): Apollo.UseSuspenseQueryResult<GetLoanRepaymentsQuery | undefined, GetLoanRepaymentsQueryVariables>;
export function useGetLoanRepaymentsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetLoanRepaymentsQuery, GetLoanRepaymentsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetLoanRepaymentsQuery, GetLoanRepaymentsQueryVariables>(GetLoanRepaymentsDocument, options);
        }
export type GetLoanRepaymentsQueryHookResult = ReturnType<typeof useGetLoanRepaymentsQuery>;
export type GetLoanRepaymentsLazyQueryHookResult = ReturnType<typeof useGetLoanRepaymentsLazyQuery>;
export type GetLoanRepaymentsSuspenseQueryHookResult = ReturnType<typeof useGetLoanRepaymentsSuspenseQuery>;
export type GetLoanRepaymentsQueryResult = Apollo.QueryResult<GetLoanRepaymentsQuery, GetLoanRepaymentsQueryVariables>;
export const CreateLoanRepaymentDocument = gql`
    mutation CreateLoanRepayment($input: LoanRepaymentInput!) {
  createLoanRepayment(input: $input) {
    id
    docNumber
  }
}
    `;
export type CreateLoanRepaymentMutationFn = Apollo.MutationFunction<CreateLoanRepaymentMutation, CreateLoanRepaymentMutationVariables>;
export function useCreateLoanRepaymentMutation(baseOptions?: Apollo.MutationHookOptions<CreateLoanRepaymentMutation, CreateLoanRepaymentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateLoanRepaymentMutation, CreateLoanRepaymentMutationVariables>(CreateLoanRepaymentDocument, options);
      }
export type CreateLoanRepaymentMutationHookResult = ReturnType<typeof useCreateLoanRepaymentMutation>;
export type CreateLoanRepaymentMutationResult = Apollo.MutationResult<CreateLoanRepaymentMutation>;
export type CreateLoanRepaymentMutationOptions = Apollo.BaseMutationOptions<CreateLoanRepaymentMutation, CreateLoanRepaymentMutationVariables>;
export const UpdateLoanRepaymentDocument = gql`
    mutation UpdateLoanRepayment($id: ID!, $input: LoanRepaymentInput!) {
  updateLoanRepayment(id: $id, input: $input) {
    id
    docNumber
  }
}
    `;
export type UpdateLoanRepaymentMutationFn = Apollo.MutationFunction<UpdateLoanRepaymentMutation, UpdateLoanRepaymentMutationVariables>;
export function useUpdateLoanRepaymentMutation(baseOptions?: Apollo.MutationHookOptions<UpdateLoanRepaymentMutation, UpdateLoanRepaymentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateLoanRepaymentMutation, UpdateLoanRepaymentMutationVariables>(UpdateLoanRepaymentDocument, options);
      }
export type UpdateLoanRepaymentMutationHookResult = ReturnType<typeof useUpdateLoanRepaymentMutation>;
export type UpdateLoanRepaymentMutationResult = Apollo.MutationResult<UpdateLoanRepaymentMutation>;
export type UpdateLoanRepaymentMutationOptions = Apollo.BaseMutationOptions<UpdateLoanRepaymentMutation, UpdateLoanRepaymentMutationVariables>;
export const DeleteLoanRepaymentDocument = gql`
    mutation DeleteLoanRepayment($id: ID!) {
  deleteLoanRepayment(id: $id)
}
    `;
export type DeleteLoanRepaymentMutationFn = Apollo.MutationFunction<DeleteLoanRepaymentMutation, DeleteLoanRepaymentMutationVariables>;
export function useDeleteLoanRepaymentMutation(baseOptions?: Apollo.MutationHookOptions<DeleteLoanRepaymentMutation, DeleteLoanRepaymentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteLoanRepaymentMutation, DeleteLoanRepaymentMutationVariables>(DeleteLoanRepaymentDocument, options);
      }
export type DeleteLoanRepaymentMutationHookResult = ReturnType<typeof useDeleteLoanRepaymentMutation>;
export type DeleteLoanRepaymentMutationResult = Apollo.MutationResult<DeleteLoanRepaymentMutation>;
export type DeleteLoanRepaymentMutationOptions = Apollo.BaseMutationOptions<DeleteLoanRepaymentMutation, DeleteLoanRepaymentMutationVariables>;
export const GetSiteLocationsDocument = gql`
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
    `;
export function useGetSiteLocationsQuery(baseOptions: Apollo.QueryHookOptions<GetSiteLocationsQuery, GetSiteLocationsQueryVariables> & ({ variables: GetSiteLocationsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSiteLocationsQuery, GetSiteLocationsQueryVariables>(GetSiteLocationsDocument, options);
      }
export function useGetSiteLocationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSiteLocationsQuery, GetSiteLocationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSiteLocationsQuery, GetSiteLocationsQueryVariables>(GetSiteLocationsDocument, options);
        }
// @ts-ignore
export function useGetSiteLocationsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetSiteLocationsQuery, GetSiteLocationsQueryVariables>): Apollo.UseSuspenseQueryResult<GetSiteLocationsQuery, GetSiteLocationsQueryVariables>;
export function useGetSiteLocationsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetSiteLocationsQuery, GetSiteLocationsQueryVariables>): Apollo.UseSuspenseQueryResult<GetSiteLocationsQuery | undefined, GetSiteLocationsQueryVariables>;
export function useGetSiteLocationsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetSiteLocationsQuery, GetSiteLocationsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetSiteLocationsQuery, GetSiteLocationsQueryVariables>(GetSiteLocationsDocument, options);
        }
export type GetSiteLocationsQueryHookResult = ReturnType<typeof useGetSiteLocationsQuery>;
export type GetSiteLocationsLazyQueryHookResult = ReturnType<typeof useGetSiteLocationsLazyQuery>;
export type GetSiteLocationsSuspenseQueryHookResult = ReturnType<typeof useGetSiteLocationsSuspenseQuery>;
export type GetSiteLocationsQueryResult = Apollo.QueryResult<GetSiteLocationsQuery, GetSiteLocationsQueryVariables>;
export const CreateSiteLocationDocument = gql`
    mutation CreateSiteLocation($input: SiteLocationInput!) {
  createSiteLocation(input: $input) {
    id
    seqNo
    name
  }
}
    `;
export type CreateSiteLocationMutationFn = Apollo.MutationFunction<CreateSiteLocationMutation, CreateSiteLocationMutationVariables>;
export function useCreateSiteLocationMutation(baseOptions?: Apollo.MutationHookOptions<CreateSiteLocationMutation, CreateSiteLocationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateSiteLocationMutation, CreateSiteLocationMutationVariables>(CreateSiteLocationDocument, options);
      }
export type CreateSiteLocationMutationHookResult = ReturnType<typeof useCreateSiteLocationMutation>;
export type CreateSiteLocationMutationResult = Apollo.MutationResult<CreateSiteLocationMutation>;
export type CreateSiteLocationMutationOptions = Apollo.BaseMutationOptions<CreateSiteLocationMutation, CreateSiteLocationMutationVariables>;
export const UpdateSiteLocationDocument = gql`
    mutation UpdateSiteLocation($id: ID!, $input: SiteLocationInput!) {
  updateSiteLocation(id: $id, input: $input) {
    id
    name
  }
}
    `;
export type UpdateSiteLocationMutationFn = Apollo.MutationFunction<UpdateSiteLocationMutation, UpdateSiteLocationMutationVariables>;
export function useUpdateSiteLocationMutation(baseOptions?: Apollo.MutationHookOptions<UpdateSiteLocationMutation, UpdateSiteLocationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateSiteLocationMutation, UpdateSiteLocationMutationVariables>(UpdateSiteLocationDocument, options);
      }
export type UpdateSiteLocationMutationHookResult = ReturnType<typeof useUpdateSiteLocationMutation>;
export type UpdateSiteLocationMutationResult = Apollo.MutationResult<UpdateSiteLocationMutation>;
export type UpdateSiteLocationMutationOptions = Apollo.BaseMutationOptions<UpdateSiteLocationMutation, UpdateSiteLocationMutationVariables>;
export const DeleteSiteLocationDocument = gql`
    mutation DeleteSiteLocation($id: ID!) {
  deleteSiteLocation(id: $id)
}
    `;
export type DeleteSiteLocationMutationFn = Apollo.MutationFunction<DeleteSiteLocationMutation, DeleteSiteLocationMutationVariables>;
export function useDeleteSiteLocationMutation(baseOptions?: Apollo.MutationHookOptions<DeleteSiteLocationMutation, DeleteSiteLocationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteSiteLocationMutation, DeleteSiteLocationMutationVariables>(DeleteSiteLocationDocument, options);
      }
export type DeleteSiteLocationMutationHookResult = ReturnType<typeof useDeleteSiteLocationMutation>;
export type DeleteSiteLocationMutationResult = Apollo.MutationResult<DeleteSiteLocationMutation>;
export type DeleteSiteLocationMutationOptions = Apollo.BaseMutationOptions<DeleteSiteLocationMutation, DeleteSiteLocationMutationVariables>;
export const GetContractorsDocument = gql`
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
    `;
export function useGetContractorsQuery(baseOptions: Apollo.QueryHookOptions<GetContractorsQuery, GetContractorsQueryVariables> & ({ variables: GetContractorsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetContractorsQuery, GetContractorsQueryVariables>(GetContractorsDocument, options);
      }
export function useGetContractorsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetContractorsQuery, GetContractorsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetContractorsQuery, GetContractorsQueryVariables>(GetContractorsDocument, options);
        }
// @ts-ignore
export function useGetContractorsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetContractorsQuery, GetContractorsQueryVariables>): Apollo.UseSuspenseQueryResult<GetContractorsQuery, GetContractorsQueryVariables>;
export function useGetContractorsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetContractorsQuery, GetContractorsQueryVariables>): Apollo.UseSuspenseQueryResult<GetContractorsQuery | undefined, GetContractorsQueryVariables>;
export function useGetContractorsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetContractorsQuery, GetContractorsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetContractorsQuery, GetContractorsQueryVariables>(GetContractorsDocument, options);
        }
export type GetContractorsQueryHookResult = ReturnType<typeof useGetContractorsQuery>;
export type GetContractorsLazyQueryHookResult = ReturnType<typeof useGetContractorsLazyQuery>;
export type GetContractorsSuspenseQueryHookResult = ReturnType<typeof useGetContractorsSuspenseQuery>;
export type GetContractorsQueryResult = Apollo.QueryResult<GetContractorsQuery, GetContractorsQueryVariables>;
export const CreateContractorDocument = gql`
    mutation CreateContractor($input: ContractorInput!) {
  createContractor(input: $input) {
    id
    seqNo
    name
  }
}
    `;
export type CreateContractorMutationFn = Apollo.MutationFunction<CreateContractorMutation, CreateContractorMutationVariables>;
export function useCreateContractorMutation(baseOptions?: Apollo.MutationHookOptions<CreateContractorMutation, CreateContractorMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateContractorMutation, CreateContractorMutationVariables>(CreateContractorDocument, options);
      }
export type CreateContractorMutationHookResult = ReturnType<typeof useCreateContractorMutation>;
export type CreateContractorMutationResult = Apollo.MutationResult<CreateContractorMutation>;
export type CreateContractorMutationOptions = Apollo.BaseMutationOptions<CreateContractorMutation, CreateContractorMutationVariables>;
export const UpdateContractorDocument = gql`
    mutation UpdateContractor($id: ID!, $input: ContractorInput!) {
  updateContractor(id: $id, input: $input) {
    id
    name
  }
}
    `;
export type UpdateContractorMutationFn = Apollo.MutationFunction<UpdateContractorMutation, UpdateContractorMutationVariables>;
export function useUpdateContractorMutation(baseOptions?: Apollo.MutationHookOptions<UpdateContractorMutation, UpdateContractorMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateContractorMutation, UpdateContractorMutationVariables>(UpdateContractorDocument, options);
      }
export type UpdateContractorMutationHookResult = ReturnType<typeof useUpdateContractorMutation>;
export type UpdateContractorMutationResult = Apollo.MutationResult<UpdateContractorMutation>;
export type UpdateContractorMutationOptions = Apollo.BaseMutationOptions<UpdateContractorMutation, UpdateContractorMutationVariables>;
export const DeleteContractorDocument = gql`
    mutation DeleteContractor($id: ID!) {
  deleteContractor(id: $id)
}
    `;
export type DeleteContractorMutationFn = Apollo.MutationFunction<DeleteContractorMutation, DeleteContractorMutationVariables>;
export function useDeleteContractorMutation(baseOptions?: Apollo.MutationHookOptions<DeleteContractorMutation, DeleteContractorMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteContractorMutation, DeleteContractorMutationVariables>(DeleteContractorDocument, options);
      }
export type DeleteContractorMutationHookResult = ReturnType<typeof useDeleteContractorMutation>;
export type DeleteContractorMutationResult = Apollo.MutationResult<DeleteContractorMutation>;
export type DeleteContractorMutationOptions = Apollo.BaseMutationOptions<DeleteContractorMutation, DeleteContractorMutationVariables>;
export const GetLeadsDocument = gql`
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
    `;
export function useGetLeadsQuery(baseOptions: Apollo.QueryHookOptions<GetLeadsQuery, GetLeadsQueryVariables> & ({ variables: GetLeadsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetLeadsQuery, GetLeadsQueryVariables>(GetLeadsDocument, options);
      }
export function useGetLeadsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetLeadsQuery, GetLeadsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetLeadsQuery, GetLeadsQueryVariables>(GetLeadsDocument, options);
        }
// @ts-ignore
export function useGetLeadsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetLeadsQuery, GetLeadsQueryVariables>): Apollo.UseSuspenseQueryResult<GetLeadsQuery, GetLeadsQueryVariables>;
export function useGetLeadsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetLeadsQuery, GetLeadsQueryVariables>): Apollo.UseSuspenseQueryResult<GetLeadsQuery | undefined, GetLeadsQueryVariables>;
export function useGetLeadsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetLeadsQuery, GetLeadsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetLeadsQuery, GetLeadsQueryVariables>(GetLeadsDocument, options);
        }
export type GetLeadsQueryHookResult = ReturnType<typeof useGetLeadsQuery>;
export type GetLeadsLazyQueryHookResult = ReturnType<typeof useGetLeadsLazyQuery>;
export type GetLeadsSuspenseQueryHookResult = ReturnType<typeof useGetLeadsSuspenseQuery>;
export type GetLeadsQueryResult = Apollo.QueryResult<GetLeadsQuery, GetLeadsQueryVariables>;
export const CreateLeadDocument = gql`
    mutation CreateLead($input: LeadInput!) {
  createLead(input: $input) {
    id
    seqNo
  }
}
    `;
export type CreateLeadMutationFn = Apollo.MutationFunction<CreateLeadMutation, CreateLeadMutationVariables>;
export function useCreateLeadMutation(baseOptions?: Apollo.MutationHookOptions<CreateLeadMutation, CreateLeadMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateLeadMutation, CreateLeadMutationVariables>(CreateLeadDocument, options);
      }
export type CreateLeadMutationHookResult = ReturnType<typeof useCreateLeadMutation>;
export type CreateLeadMutationResult = Apollo.MutationResult<CreateLeadMutation>;
export type CreateLeadMutationOptions = Apollo.BaseMutationOptions<CreateLeadMutation, CreateLeadMutationVariables>;
export const UpdateLeadDocument = gql`
    mutation UpdateLead($id: ID!, $input: LeadInput!) {
  updateLead(id: $id, input: $input) {
    id
  }
}
    `;
export type UpdateLeadMutationFn = Apollo.MutationFunction<UpdateLeadMutation, UpdateLeadMutationVariables>;
export function useUpdateLeadMutation(baseOptions?: Apollo.MutationHookOptions<UpdateLeadMutation, UpdateLeadMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateLeadMutation, UpdateLeadMutationVariables>(UpdateLeadDocument, options);
      }
export type UpdateLeadMutationHookResult = ReturnType<typeof useUpdateLeadMutation>;
export type UpdateLeadMutationResult = Apollo.MutationResult<UpdateLeadMutation>;
export type UpdateLeadMutationOptions = Apollo.BaseMutationOptions<UpdateLeadMutation, UpdateLeadMutationVariables>;
export const DeleteLeadDocument = gql`
    mutation DeleteLead($id: ID!) {
  deleteLead(id: $id)
}
    `;
export type DeleteLeadMutationFn = Apollo.MutationFunction<DeleteLeadMutation, DeleteLeadMutationVariables>;
export function useDeleteLeadMutation(baseOptions?: Apollo.MutationHookOptions<DeleteLeadMutation, DeleteLeadMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteLeadMutation, DeleteLeadMutationVariables>(DeleteLeadDocument, options);
      }
export type DeleteLeadMutationHookResult = ReturnType<typeof useDeleteLeadMutation>;
export type DeleteLeadMutationResult = Apollo.MutationResult<DeleteLeadMutation>;
export type DeleteLeadMutationOptions = Apollo.BaseMutationOptions<DeleteLeadMutation, DeleteLeadMutationVariables>;
export const ConvertLeadToOpportunityDocument = gql`
    mutation ConvertLeadToOpportunity($id: ID!) {
  convertLeadToOpportunity(id: $id)
}
    `;
export type ConvertLeadToOpportunityMutationFn = Apollo.MutationFunction<ConvertLeadToOpportunityMutation, ConvertLeadToOpportunityMutationVariables>;
export function useConvertLeadToOpportunityMutation(baseOptions?: Apollo.MutationHookOptions<ConvertLeadToOpportunityMutation, ConvertLeadToOpportunityMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ConvertLeadToOpportunityMutation, ConvertLeadToOpportunityMutationVariables>(ConvertLeadToOpportunityDocument, options);
      }
export type ConvertLeadToOpportunityMutationHookResult = ReturnType<typeof useConvertLeadToOpportunityMutation>;
export type ConvertLeadToOpportunityMutationResult = Apollo.MutationResult<ConvertLeadToOpportunityMutation>;
export type ConvertLeadToOpportunityMutationOptions = Apollo.BaseMutationOptions<ConvertLeadToOpportunityMutation, ConvertLeadToOpportunityMutationVariables>;
export const GetOpportunitiesDocument = gql`
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
    `;
export function useGetOpportunitiesQuery(baseOptions: Apollo.QueryHookOptions<GetOpportunitiesQuery, GetOpportunitiesQueryVariables> & ({ variables: GetOpportunitiesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetOpportunitiesQuery, GetOpportunitiesQueryVariables>(GetOpportunitiesDocument, options);
      }
export function useGetOpportunitiesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetOpportunitiesQuery, GetOpportunitiesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetOpportunitiesQuery, GetOpportunitiesQueryVariables>(GetOpportunitiesDocument, options);
        }
// @ts-ignore
export function useGetOpportunitiesSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetOpportunitiesQuery, GetOpportunitiesQueryVariables>): Apollo.UseSuspenseQueryResult<GetOpportunitiesQuery, GetOpportunitiesQueryVariables>;
export function useGetOpportunitiesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetOpportunitiesQuery, GetOpportunitiesQueryVariables>): Apollo.UseSuspenseQueryResult<GetOpportunitiesQuery | undefined, GetOpportunitiesQueryVariables>;
export function useGetOpportunitiesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetOpportunitiesQuery, GetOpportunitiesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetOpportunitiesQuery, GetOpportunitiesQueryVariables>(GetOpportunitiesDocument, options);
        }
export type GetOpportunitiesQueryHookResult = ReturnType<typeof useGetOpportunitiesQuery>;
export type GetOpportunitiesLazyQueryHookResult = ReturnType<typeof useGetOpportunitiesLazyQuery>;
export type GetOpportunitiesSuspenseQueryHookResult = ReturnType<typeof useGetOpportunitiesSuspenseQuery>;
export type GetOpportunitiesQueryResult = Apollo.QueryResult<GetOpportunitiesQuery, GetOpportunitiesQueryVariables>;
export const CreateOpportunityDocument = gql`
    mutation CreateOpportunity($input: OpportunityInput!) {
  createOpportunity(input: $input) {
    id
    seqNo
  }
}
    `;
export type CreateOpportunityMutationFn = Apollo.MutationFunction<CreateOpportunityMutation, CreateOpportunityMutationVariables>;
export function useCreateOpportunityMutation(baseOptions?: Apollo.MutationHookOptions<CreateOpportunityMutation, CreateOpportunityMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateOpportunityMutation, CreateOpportunityMutationVariables>(CreateOpportunityDocument, options);
      }
export type CreateOpportunityMutationHookResult = ReturnType<typeof useCreateOpportunityMutation>;
export type CreateOpportunityMutationResult = Apollo.MutationResult<CreateOpportunityMutation>;
export type CreateOpportunityMutationOptions = Apollo.BaseMutationOptions<CreateOpportunityMutation, CreateOpportunityMutationVariables>;
export const UpdateOpportunityDocument = gql`
    mutation UpdateOpportunity($id: ID!, $input: OpportunityInput!) {
  updateOpportunity(id: $id, input: $input) {
    id
  }
}
    `;
export type UpdateOpportunityMutationFn = Apollo.MutationFunction<UpdateOpportunityMutation, UpdateOpportunityMutationVariables>;
export function useUpdateOpportunityMutation(baseOptions?: Apollo.MutationHookOptions<UpdateOpportunityMutation, UpdateOpportunityMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateOpportunityMutation, UpdateOpportunityMutationVariables>(UpdateOpportunityDocument, options);
      }
export type UpdateOpportunityMutationHookResult = ReturnType<typeof useUpdateOpportunityMutation>;
export type UpdateOpportunityMutationResult = Apollo.MutationResult<UpdateOpportunityMutation>;
export type UpdateOpportunityMutationOptions = Apollo.BaseMutationOptions<UpdateOpportunityMutation, UpdateOpportunityMutationVariables>;
export const DeleteOpportunityDocument = gql`
    mutation DeleteOpportunity($id: ID!) {
  deleteOpportunity(id: $id)
}
    `;
export type DeleteOpportunityMutationFn = Apollo.MutationFunction<DeleteOpportunityMutation, DeleteOpportunityMutationVariables>;
export function useDeleteOpportunityMutation(baseOptions?: Apollo.MutationHookOptions<DeleteOpportunityMutation, DeleteOpportunityMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteOpportunityMutation, DeleteOpportunityMutationVariables>(DeleteOpportunityDocument, options);
      }
export type DeleteOpportunityMutationHookResult = ReturnType<typeof useDeleteOpportunityMutation>;
export type DeleteOpportunityMutationResult = Apollo.MutationResult<DeleteOpportunityMutation>;
export type DeleteOpportunityMutationOptions = Apollo.BaseMutationOptions<DeleteOpportunityMutation, DeleteOpportunityMutationVariables>;
export const GetPayrollUiRecordsDocument = gql`
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
    `;
export function useGetPayrollUiRecordsQuery(baseOptions: Apollo.QueryHookOptions<GetPayrollUiRecordsQuery, GetPayrollUiRecordsQueryVariables> & ({ variables: GetPayrollUiRecordsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPayrollUiRecordsQuery, GetPayrollUiRecordsQueryVariables>(GetPayrollUiRecordsDocument, options);
      }
export function useGetPayrollUiRecordsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPayrollUiRecordsQuery, GetPayrollUiRecordsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPayrollUiRecordsQuery, GetPayrollUiRecordsQueryVariables>(GetPayrollUiRecordsDocument, options);
        }
// @ts-ignore
export function useGetPayrollUiRecordsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetPayrollUiRecordsQuery, GetPayrollUiRecordsQueryVariables>): Apollo.UseSuspenseQueryResult<GetPayrollUiRecordsQuery, GetPayrollUiRecordsQueryVariables>;
export function useGetPayrollUiRecordsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPayrollUiRecordsQuery, GetPayrollUiRecordsQueryVariables>): Apollo.UseSuspenseQueryResult<GetPayrollUiRecordsQuery | undefined, GetPayrollUiRecordsQueryVariables>;
export function useGetPayrollUiRecordsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPayrollUiRecordsQuery, GetPayrollUiRecordsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPayrollUiRecordsQuery, GetPayrollUiRecordsQueryVariables>(GetPayrollUiRecordsDocument, options);
        }
export type GetPayrollUiRecordsQueryHookResult = ReturnType<typeof useGetPayrollUiRecordsQuery>;
export type GetPayrollUiRecordsLazyQueryHookResult = ReturnType<typeof useGetPayrollUiRecordsLazyQuery>;
export type GetPayrollUiRecordsSuspenseQueryHookResult = ReturnType<typeof useGetPayrollUiRecordsSuspenseQuery>;
export type GetPayrollUiRecordsQueryResult = Apollo.QueryResult<GetPayrollUiRecordsQuery, GetPayrollUiRecordsQueryVariables>;
export const CreatePayrollUiRecordDocument = gql`
    mutation CreatePayrollUiRecord($input: PayrollUiRecordInput!) {
  createPayrollUiRecord(input: $input) {
    id
    category
    code
  }
}
    `;
export type CreatePayrollUiRecordMutationFn = Apollo.MutationFunction<CreatePayrollUiRecordMutation, CreatePayrollUiRecordMutationVariables>;
export function useCreatePayrollUiRecordMutation(baseOptions?: Apollo.MutationHookOptions<CreatePayrollUiRecordMutation, CreatePayrollUiRecordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreatePayrollUiRecordMutation, CreatePayrollUiRecordMutationVariables>(CreatePayrollUiRecordDocument, options);
      }
export type CreatePayrollUiRecordMutationHookResult = ReturnType<typeof useCreatePayrollUiRecordMutation>;
export type CreatePayrollUiRecordMutationResult = Apollo.MutationResult<CreatePayrollUiRecordMutation>;
export type CreatePayrollUiRecordMutationOptions = Apollo.BaseMutationOptions<CreatePayrollUiRecordMutation, CreatePayrollUiRecordMutationVariables>;
export const UpdatePayrollUiRecordDocument = gql`
    mutation UpdatePayrollUiRecord($id: ID!, $input: PayrollUiRecordInput!) {
  updatePayrollUiRecord(id: $id, input: $input) {
    id
    category
    code
  }
}
    `;
export type UpdatePayrollUiRecordMutationFn = Apollo.MutationFunction<UpdatePayrollUiRecordMutation, UpdatePayrollUiRecordMutationVariables>;
export function useUpdatePayrollUiRecordMutation(baseOptions?: Apollo.MutationHookOptions<UpdatePayrollUiRecordMutation, UpdatePayrollUiRecordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdatePayrollUiRecordMutation, UpdatePayrollUiRecordMutationVariables>(UpdatePayrollUiRecordDocument, options);
      }
export type UpdatePayrollUiRecordMutationHookResult = ReturnType<typeof useUpdatePayrollUiRecordMutation>;
export type UpdatePayrollUiRecordMutationResult = Apollo.MutationResult<UpdatePayrollUiRecordMutation>;
export type UpdatePayrollUiRecordMutationOptions = Apollo.BaseMutationOptions<UpdatePayrollUiRecordMutation, UpdatePayrollUiRecordMutationVariables>;
export const DeletePayrollUiRecordDocument = gql`
    mutation DeletePayrollUiRecord($id: ID!) {
  deletePayrollUiRecord(id: $id)
}
    `;
export type DeletePayrollUiRecordMutationFn = Apollo.MutationFunction<DeletePayrollUiRecordMutation, DeletePayrollUiRecordMutationVariables>;
export function useDeletePayrollUiRecordMutation(baseOptions?: Apollo.MutationHookOptions<DeletePayrollUiRecordMutation, DeletePayrollUiRecordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeletePayrollUiRecordMutation, DeletePayrollUiRecordMutationVariables>(DeletePayrollUiRecordDocument, options);
      }
export type DeletePayrollUiRecordMutationHookResult = ReturnType<typeof useDeletePayrollUiRecordMutation>;
export type DeletePayrollUiRecordMutationResult = Apollo.MutationResult<DeletePayrollUiRecordMutation>;
export type DeletePayrollUiRecordMutationOptions = Apollo.BaseMutationOptions<DeletePayrollUiRecordMutation, DeletePayrollUiRecordMutationVariables>;
export const GetExtractionsDocument = gql`
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
    `;
export function useGetExtractionsQuery(baseOptions: Apollo.QueryHookOptions<GetExtractionsQuery, GetExtractionsQueryVariables> & ({ variables: GetExtractionsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetExtractionsQuery, GetExtractionsQueryVariables>(GetExtractionsDocument, options);
      }
export function useGetExtractionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetExtractionsQuery, GetExtractionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetExtractionsQuery, GetExtractionsQueryVariables>(GetExtractionsDocument, options);
        }
// @ts-ignore
export function useGetExtractionsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetExtractionsQuery, GetExtractionsQueryVariables>): Apollo.UseSuspenseQueryResult<GetExtractionsQuery, GetExtractionsQueryVariables>;
export function useGetExtractionsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetExtractionsQuery, GetExtractionsQueryVariables>): Apollo.UseSuspenseQueryResult<GetExtractionsQuery | undefined, GetExtractionsQueryVariables>;
export function useGetExtractionsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetExtractionsQuery, GetExtractionsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetExtractionsQuery, GetExtractionsQueryVariables>(GetExtractionsDocument, options);
        }
export type GetExtractionsQueryHookResult = ReturnType<typeof useGetExtractionsQuery>;
export type GetExtractionsLazyQueryHookResult = ReturnType<typeof useGetExtractionsLazyQuery>;
export type GetExtractionsSuspenseQueryHookResult = ReturnType<typeof useGetExtractionsSuspenseQuery>;
export type GetExtractionsQueryResult = Apollo.QueryResult<GetExtractionsQuery, GetExtractionsQueryVariables>;
export const CreateExtractionDocument = gql`
    mutation CreateExtraction($input: ExtractionInput!) {
  createExtraction(input: $input) {
    id
    extractionNumber
  }
}
    `;
export type CreateExtractionMutationFn = Apollo.MutationFunction<CreateExtractionMutation, CreateExtractionMutationVariables>;
export function useCreateExtractionMutation(baseOptions?: Apollo.MutationHookOptions<CreateExtractionMutation, CreateExtractionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateExtractionMutation, CreateExtractionMutationVariables>(CreateExtractionDocument, options);
      }
export type CreateExtractionMutationHookResult = ReturnType<typeof useCreateExtractionMutation>;
export type CreateExtractionMutationResult = Apollo.MutationResult<CreateExtractionMutation>;
export type CreateExtractionMutationOptions = Apollo.BaseMutationOptions<CreateExtractionMutation, CreateExtractionMutationVariables>;
export const GetRawMaterialRequisitionsDocument = gql`
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
    `;
export function useGetRawMaterialRequisitionsQuery(baseOptions: Apollo.QueryHookOptions<GetRawMaterialRequisitionsQuery, GetRawMaterialRequisitionsQueryVariables> & ({ variables: GetRawMaterialRequisitionsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetRawMaterialRequisitionsQuery, GetRawMaterialRequisitionsQueryVariables>(GetRawMaterialRequisitionsDocument, options);
      }
export function useGetRawMaterialRequisitionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetRawMaterialRequisitionsQuery, GetRawMaterialRequisitionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetRawMaterialRequisitionsQuery, GetRawMaterialRequisitionsQueryVariables>(GetRawMaterialRequisitionsDocument, options);
        }
// @ts-ignore
export function useGetRawMaterialRequisitionsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetRawMaterialRequisitionsQuery, GetRawMaterialRequisitionsQueryVariables>): Apollo.UseSuspenseQueryResult<GetRawMaterialRequisitionsQuery, GetRawMaterialRequisitionsQueryVariables>;
export function useGetRawMaterialRequisitionsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetRawMaterialRequisitionsQuery, GetRawMaterialRequisitionsQueryVariables>): Apollo.UseSuspenseQueryResult<GetRawMaterialRequisitionsQuery | undefined, GetRawMaterialRequisitionsQueryVariables>;
export function useGetRawMaterialRequisitionsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetRawMaterialRequisitionsQuery, GetRawMaterialRequisitionsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetRawMaterialRequisitionsQuery, GetRawMaterialRequisitionsQueryVariables>(GetRawMaterialRequisitionsDocument, options);
        }
export type GetRawMaterialRequisitionsQueryHookResult = ReturnType<typeof useGetRawMaterialRequisitionsQuery>;
export type GetRawMaterialRequisitionsLazyQueryHookResult = ReturnType<typeof useGetRawMaterialRequisitionsLazyQuery>;
export type GetRawMaterialRequisitionsSuspenseQueryHookResult = ReturnType<typeof useGetRawMaterialRequisitionsSuspenseQuery>;
export type GetRawMaterialRequisitionsQueryResult = Apollo.QueryResult<GetRawMaterialRequisitionsQuery, GetRawMaterialRequisitionsQueryVariables>;
export const CreateRawMaterialRequisitionDocument = gql`
    mutation CreateRawMaterialRequisition($input: RawMaterialRequisitionInput!) {
  createRawMaterialRequisition(input: $input) {
    id
    requisitionNumber
  }
}
    `;
export type CreateRawMaterialRequisitionMutationFn = Apollo.MutationFunction<CreateRawMaterialRequisitionMutation, CreateRawMaterialRequisitionMutationVariables>;
export function useCreateRawMaterialRequisitionMutation(baseOptions?: Apollo.MutationHookOptions<CreateRawMaterialRequisitionMutation, CreateRawMaterialRequisitionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateRawMaterialRequisitionMutation, CreateRawMaterialRequisitionMutationVariables>(CreateRawMaterialRequisitionDocument, options);
      }
export type CreateRawMaterialRequisitionMutationHookResult = ReturnType<typeof useCreateRawMaterialRequisitionMutation>;
export type CreateRawMaterialRequisitionMutationResult = Apollo.MutationResult<CreateRawMaterialRequisitionMutation>;
export type CreateRawMaterialRequisitionMutationOptions = Apollo.BaseMutationOptions<CreateRawMaterialRequisitionMutation, CreateRawMaterialRequisitionMutationVariables>;
export const GetClientsDocument = gql`
    query GetClients($organizationId: ID, $page: Int, $limit: Int, $status: String, $search: String) {
  clients(
    organizationId: $organizationId
    page: $page
    limit: $limit
    status: $status
    search: $search
  ) {
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
    `;
export function useGetClientsQuery(baseOptions?: Apollo.QueryHookOptions<GetClientsQuery, GetClientsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetClientsQuery, GetClientsQueryVariables>(GetClientsDocument, options);
      }
export function useGetClientsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetClientsQuery, GetClientsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetClientsQuery, GetClientsQueryVariables>(GetClientsDocument, options);
        }
// @ts-ignore
export function useGetClientsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetClientsQuery, GetClientsQueryVariables>): Apollo.UseSuspenseQueryResult<GetClientsQuery, GetClientsQueryVariables>;
export function useGetClientsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetClientsQuery, GetClientsQueryVariables>): Apollo.UseSuspenseQueryResult<GetClientsQuery | undefined, GetClientsQueryVariables>;
export function useGetClientsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetClientsQuery, GetClientsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetClientsQuery, GetClientsQueryVariables>(GetClientsDocument, options);
        }
export type GetClientsQueryHookResult = ReturnType<typeof useGetClientsQuery>;
export type GetClientsLazyQueryHookResult = ReturnType<typeof useGetClientsLazyQuery>;
export type GetClientsSuspenseQueryHookResult = ReturnType<typeof useGetClientsSuspenseQuery>;
export type GetClientsQueryResult = Apollo.QueryResult<GetClientsQuery, GetClientsQueryVariables>;
export const GetClientDocument = gql`
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
    `;
export function useGetClientQuery(baseOptions: Apollo.QueryHookOptions<GetClientQuery, GetClientQueryVariables> & ({ variables: GetClientQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetClientQuery, GetClientQueryVariables>(GetClientDocument, options);
      }
export function useGetClientLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetClientQuery, GetClientQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetClientQuery, GetClientQueryVariables>(GetClientDocument, options);
        }
// @ts-ignore
export function useGetClientSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetClientQuery, GetClientQueryVariables>): Apollo.UseSuspenseQueryResult<GetClientQuery, GetClientQueryVariables>;
export function useGetClientSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetClientQuery, GetClientQueryVariables>): Apollo.UseSuspenseQueryResult<GetClientQuery | undefined, GetClientQueryVariables>;
export function useGetClientSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetClientQuery, GetClientQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetClientQuery, GetClientQueryVariables>(GetClientDocument, options);
        }
export type GetClientQueryHookResult = ReturnType<typeof useGetClientQuery>;
export type GetClientLazyQueryHookResult = ReturnType<typeof useGetClientLazyQuery>;
export type GetClientSuspenseQueryHookResult = ReturnType<typeof useGetClientSuspenseQuery>;
export type GetClientQueryResult = Apollo.QueryResult<GetClientQuery, GetClientQueryVariables>;
export const GetClientsByOrganizationDocument = gql`
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
    `;
export function useGetClientsByOrganizationQuery(baseOptions: Apollo.QueryHookOptions<GetClientsByOrganizationQuery, GetClientsByOrganizationQueryVariables> & ({ variables: GetClientsByOrganizationQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetClientsByOrganizationQuery, GetClientsByOrganizationQueryVariables>(GetClientsByOrganizationDocument, options);
      }
export function useGetClientsByOrganizationLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetClientsByOrganizationQuery, GetClientsByOrganizationQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetClientsByOrganizationQuery, GetClientsByOrganizationQueryVariables>(GetClientsByOrganizationDocument, options);
        }
// @ts-ignore
export function useGetClientsByOrganizationSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetClientsByOrganizationQuery, GetClientsByOrganizationQueryVariables>): Apollo.UseSuspenseQueryResult<GetClientsByOrganizationQuery, GetClientsByOrganizationQueryVariables>;
export function useGetClientsByOrganizationSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetClientsByOrganizationQuery, GetClientsByOrganizationQueryVariables>): Apollo.UseSuspenseQueryResult<GetClientsByOrganizationQuery | undefined, GetClientsByOrganizationQueryVariables>;
export function useGetClientsByOrganizationSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetClientsByOrganizationQuery, GetClientsByOrganizationQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetClientsByOrganizationQuery, GetClientsByOrganizationQueryVariables>(GetClientsByOrganizationDocument, options);
        }
export type GetClientsByOrganizationQueryHookResult = ReturnType<typeof useGetClientsByOrganizationQuery>;
export type GetClientsByOrganizationLazyQueryHookResult = ReturnType<typeof useGetClientsByOrganizationLazyQuery>;
export type GetClientsByOrganizationSuspenseQueryHookResult = ReturnType<typeof useGetClientsByOrganizationSuspenseQuery>;
export type GetClientsByOrganizationQueryResult = Apollo.QueryResult<GetClientsByOrganizationQuery, GetClientsByOrganizationQueryVariables>;
export const CreateClientDocument = gql`
    mutation CreateClient($input: CreateClientInput!) {
  createClient(input: $input) {
    id
    name
    email
    status
  }
}
    `;
export type CreateClientMutationFn = Apollo.MutationFunction<CreateClientMutation, CreateClientMutationVariables>;
export function useCreateClientMutation(baseOptions?: Apollo.MutationHookOptions<CreateClientMutation, CreateClientMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateClientMutation, CreateClientMutationVariables>(CreateClientDocument, options);
      }
export type CreateClientMutationHookResult = ReturnType<typeof useCreateClientMutation>;
export type CreateClientMutationResult = Apollo.MutationResult<CreateClientMutation>;
export type CreateClientMutationOptions = Apollo.BaseMutationOptions<CreateClientMutation, CreateClientMutationVariables>;
export const UpdateClientDocument = gql`
    mutation UpdateClient($id: ID!, $input: UpdateClientInput!) {
  updateClient(id: $id, input: $input) {
    id
    name
    email
    status
  }
}
    `;
export type UpdateClientMutationFn = Apollo.MutationFunction<UpdateClientMutation, UpdateClientMutationVariables>;
export function useUpdateClientMutation(baseOptions?: Apollo.MutationHookOptions<UpdateClientMutation, UpdateClientMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateClientMutation, UpdateClientMutationVariables>(UpdateClientDocument, options);
      }
export type UpdateClientMutationHookResult = ReturnType<typeof useUpdateClientMutation>;
export type UpdateClientMutationResult = Apollo.MutationResult<UpdateClientMutation>;
export type UpdateClientMutationOptions = Apollo.BaseMutationOptions<UpdateClientMutation, UpdateClientMutationVariables>;
export const DeleteClientDocument = gql`
    mutation DeleteClient($id: ID!) {
  deleteClient(id: $id)
}
    `;
export type DeleteClientMutationFn = Apollo.MutationFunction<DeleteClientMutation, DeleteClientMutationVariables>;
export function useDeleteClientMutation(baseOptions?: Apollo.MutationHookOptions<DeleteClientMutation, DeleteClientMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteClientMutation, DeleteClientMutationVariables>(DeleteClientDocument, options);
      }
export type DeleteClientMutationHookResult = ReturnType<typeof useDeleteClientMutation>;
export type DeleteClientMutationResult = Apollo.MutationResult<DeleteClientMutation>;
export type DeleteClientMutationOptions = Apollo.BaseMutationOptions<DeleteClientMutation, DeleteClientMutationVariables>;
export const GetQuotationsDocument = gql`
    query GetQuotations {
  quotations {
    id
    seqNo
    quotationNumber
    clientId {
      id
      name
      email
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
    `;
export function useGetQuotationsQuery(baseOptions?: Apollo.QueryHookOptions<GetQuotationsQuery, GetQuotationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetQuotationsQuery, GetQuotationsQueryVariables>(GetQuotationsDocument, options);
      }
export function useGetQuotationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetQuotationsQuery, GetQuotationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetQuotationsQuery, GetQuotationsQueryVariables>(GetQuotationsDocument, options);
        }
// @ts-ignore
export function useGetQuotationsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetQuotationsQuery, GetQuotationsQueryVariables>): Apollo.UseSuspenseQueryResult<GetQuotationsQuery, GetQuotationsQueryVariables>;
export function useGetQuotationsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetQuotationsQuery, GetQuotationsQueryVariables>): Apollo.UseSuspenseQueryResult<GetQuotationsQuery | undefined, GetQuotationsQueryVariables>;
export function useGetQuotationsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetQuotationsQuery, GetQuotationsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetQuotationsQuery, GetQuotationsQueryVariables>(GetQuotationsDocument, options);
        }
export type GetQuotationsQueryHookResult = ReturnType<typeof useGetQuotationsQuery>;
export type GetQuotationsLazyQueryHookResult = ReturnType<typeof useGetQuotationsLazyQuery>;
export type GetQuotationsSuspenseQueryHookResult = ReturnType<typeof useGetQuotationsSuspenseQuery>;
export type GetQuotationsQueryResult = Apollo.QueryResult<GetQuotationsQuery, GetQuotationsQueryVariables>;
export const GetQuotationDocument = gql`
    query GetQuotation($id: ID!) {
  quotation(id: $id) {
    id
    seqNo
    quotationNumber
    clientId {
      id
      name
      email
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
    `;
export function useGetQuotationQuery(baseOptions: Apollo.QueryHookOptions<GetQuotationQuery, GetQuotationQueryVariables> & ({ variables: GetQuotationQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetQuotationQuery, GetQuotationQueryVariables>(GetQuotationDocument, options);
      }
export function useGetQuotationLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetQuotationQuery, GetQuotationQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetQuotationQuery, GetQuotationQueryVariables>(GetQuotationDocument, options);
        }
// @ts-ignore
export function useGetQuotationSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetQuotationQuery, GetQuotationQueryVariables>): Apollo.UseSuspenseQueryResult<GetQuotationQuery, GetQuotationQueryVariables>;
export function useGetQuotationSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetQuotationQuery, GetQuotationQueryVariables>): Apollo.UseSuspenseQueryResult<GetQuotationQuery | undefined, GetQuotationQueryVariables>;
export function useGetQuotationSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetQuotationQuery, GetQuotationQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetQuotationQuery, GetQuotationQueryVariables>(GetQuotationDocument, options);
        }
export type GetQuotationQueryHookResult = ReturnType<typeof useGetQuotationQuery>;
export type GetQuotationLazyQueryHookResult = ReturnType<typeof useGetQuotationLazyQuery>;
export type GetQuotationSuspenseQueryHookResult = ReturnType<typeof useGetQuotationSuspenseQuery>;
export type GetQuotationQueryResult = Apollo.QueryResult<GetQuotationQuery, GetQuotationQueryVariables>;
export const GetQuotationsByOrganizationDocument = gql`
    query GetQuotationsByOrganization($organizationId: ID!) {
  quotationsByOrganization(organizationId: $organizationId) {
    id
    quotationNumber
    clientId {
      id
      name
      email
    }
    subject
    quotationDate
    validUntil
    totalAmount
    status
    sentAt
  }
}
    `;
export function useGetQuotationsByOrganizationQuery(baseOptions: Apollo.QueryHookOptions<GetQuotationsByOrganizationQuery, GetQuotationsByOrganizationQueryVariables> & ({ variables: GetQuotationsByOrganizationQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetQuotationsByOrganizationQuery, GetQuotationsByOrganizationQueryVariables>(GetQuotationsByOrganizationDocument, options);
      }
export function useGetQuotationsByOrganizationLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetQuotationsByOrganizationQuery, GetQuotationsByOrganizationQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetQuotationsByOrganizationQuery, GetQuotationsByOrganizationQueryVariables>(GetQuotationsByOrganizationDocument, options);
        }
// @ts-ignore
export function useGetQuotationsByOrganizationSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetQuotationsByOrganizationQuery, GetQuotationsByOrganizationQueryVariables>): Apollo.UseSuspenseQueryResult<GetQuotationsByOrganizationQuery, GetQuotationsByOrganizationQueryVariables>;
export function useGetQuotationsByOrganizationSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetQuotationsByOrganizationQuery, GetQuotationsByOrganizationQueryVariables>): Apollo.UseSuspenseQueryResult<GetQuotationsByOrganizationQuery | undefined, GetQuotationsByOrganizationQueryVariables>;
export function useGetQuotationsByOrganizationSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetQuotationsByOrganizationQuery, GetQuotationsByOrganizationQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetQuotationsByOrganizationQuery, GetQuotationsByOrganizationQueryVariables>(GetQuotationsByOrganizationDocument, options);
        }
export type GetQuotationsByOrganizationQueryHookResult = ReturnType<typeof useGetQuotationsByOrganizationQuery>;
export type GetQuotationsByOrganizationLazyQueryHookResult = ReturnType<typeof useGetQuotationsByOrganizationLazyQuery>;
export type GetQuotationsByOrganizationSuspenseQueryHookResult = ReturnType<typeof useGetQuotationsByOrganizationSuspenseQuery>;
export type GetQuotationsByOrganizationQueryResult = Apollo.QueryResult<GetQuotationsByOrganizationQuery, GetQuotationsByOrganizationQueryVariables>;
export const GetQuotationsByClientDocument = gql`
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
    `;
export function useGetQuotationsByClientQuery(baseOptions: Apollo.QueryHookOptions<GetQuotationsByClientQuery, GetQuotationsByClientQueryVariables> & ({ variables: GetQuotationsByClientQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetQuotationsByClientQuery, GetQuotationsByClientQueryVariables>(GetQuotationsByClientDocument, options);
      }
export function useGetQuotationsByClientLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetQuotationsByClientQuery, GetQuotationsByClientQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetQuotationsByClientQuery, GetQuotationsByClientQueryVariables>(GetQuotationsByClientDocument, options);
        }
// @ts-ignore
export function useGetQuotationsByClientSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetQuotationsByClientQuery, GetQuotationsByClientQueryVariables>): Apollo.UseSuspenseQueryResult<GetQuotationsByClientQuery, GetQuotationsByClientQueryVariables>;
export function useGetQuotationsByClientSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetQuotationsByClientQuery, GetQuotationsByClientQueryVariables>): Apollo.UseSuspenseQueryResult<GetQuotationsByClientQuery | undefined, GetQuotationsByClientQueryVariables>;
export function useGetQuotationsByClientSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetQuotationsByClientQuery, GetQuotationsByClientQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetQuotationsByClientQuery, GetQuotationsByClientQueryVariables>(GetQuotationsByClientDocument, options);
        }
export type GetQuotationsByClientQueryHookResult = ReturnType<typeof useGetQuotationsByClientQuery>;
export type GetQuotationsByClientLazyQueryHookResult = ReturnType<typeof useGetQuotationsByClientLazyQuery>;
export type GetQuotationsByClientSuspenseQueryHookResult = ReturnType<typeof useGetQuotationsByClientSuspenseQuery>;
export type GetQuotationsByClientQueryResult = Apollo.QueryResult<GetQuotationsByClientQuery, GetQuotationsByClientQueryVariables>;
export const CreateQuotationDocument = gql`
    mutation CreateQuotation($input: CreateQuotationInput!) {
  createQuotation(input: $input) {
    id
    quotationNumber
    status
  }
}
    `;
export type CreateQuotationMutationFn = Apollo.MutationFunction<CreateQuotationMutation, CreateQuotationMutationVariables>;
export function useCreateQuotationMutation(baseOptions?: Apollo.MutationHookOptions<CreateQuotationMutation, CreateQuotationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateQuotationMutation, CreateQuotationMutationVariables>(CreateQuotationDocument, options);
      }
export type CreateQuotationMutationHookResult = ReturnType<typeof useCreateQuotationMutation>;
export type CreateQuotationMutationResult = Apollo.MutationResult<CreateQuotationMutation>;
export type CreateQuotationMutationOptions = Apollo.BaseMutationOptions<CreateQuotationMutation, CreateQuotationMutationVariables>;
export const UpdateQuotationDocument = gql`
    mutation UpdateQuotation($id: ID!, $input: UpdateQuotationInput!) {
  updateQuotation(id: $id, input: $input) {
    id
    quotationNumber
    status
  }
}
    `;
export type UpdateQuotationMutationFn = Apollo.MutationFunction<UpdateQuotationMutation, UpdateQuotationMutationVariables>;
export function useUpdateQuotationMutation(baseOptions?: Apollo.MutationHookOptions<UpdateQuotationMutation, UpdateQuotationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateQuotationMutation, UpdateQuotationMutationVariables>(UpdateQuotationDocument, options);
      }
export type UpdateQuotationMutationHookResult = ReturnType<typeof useUpdateQuotationMutation>;
export type UpdateQuotationMutationResult = Apollo.MutationResult<UpdateQuotationMutation>;
export type UpdateQuotationMutationOptions = Apollo.BaseMutationOptions<UpdateQuotationMutation, UpdateQuotationMutationVariables>;
export const DeleteQuotationDocument = gql`
    mutation DeleteQuotation($id: ID!) {
  deleteQuotation(id: $id)
}
    `;
export type DeleteQuotationMutationFn = Apollo.MutationFunction<DeleteQuotationMutation, DeleteQuotationMutationVariables>;
export function useDeleteQuotationMutation(baseOptions?: Apollo.MutationHookOptions<DeleteQuotationMutation, DeleteQuotationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteQuotationMutation, DeleteQuotationMutationVariables>(DeleteQuotationDocument, options);
      }
export type DeleteQuotationMutationHookResult = ReturnType<typeof useDeleteQuotationMutation>;
export type DeleteQuotationMutationResult = Apollo.MutationResult<DeleteQuotationMutation>;
export type DeleteQuotationMutationOptions = Apollo.BaseMutationOptions<DeleteQuotationMutation, DeleteQuotationMutationVariables>;
export const SendQuotationDocument = gql`
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
    `;
export type SendQuotationMutationFn = Apollo.MutationFunction<SendQuotationMutation, SendQuotationMutationVariables>;
export function useSendQuotationMutation(baseOptions?: Apollo.MutationHookOptions<SendQuotationMutation, SendQuotationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SendQuotationMutation, SendQuotationMutationVariables>(SendQuotationDocument, options);
      }
export type SendQuotationMutationHookResult = ReturnType<typeof useSendQuotationMutation>;
export type SendQuotationMutationResult = Apollo.MutationResult<SendQuotationMutation>;
export type SendQuotationMutationOptions = Apollo.BaseMutationOptions<SendQuotationMutation, SendQuotationMutationVariables>;
export const GetProductsDocument = gql`
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
    `;
export function useGetProductsQuery(baseOptions?: Apollo.QueryHookOptions<GetProductsQuery, GetProductsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetProductsQuery, GetProductsQueryVariables>(GetProductsDocument, options);
      }
export function useGetProductsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetProductsQuery, GetProductsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetProductsQuery, GetProductsQueryVariables>(GetProductsDocument, options);
        }
// @ts-ignore
export function useGetProductsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetProductsQuery, GetProductsQueryVariables>): Apollo.UseSuspenseQueryResult<GetProductsQuery, GetProductsQueryVariables>;
export function useGetProductsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetProductsQuery, GetProductsQueryVariables>): Apollo.UseSuspenseQueryResult<GetProductsQuery | undefined, GetProductsQueryVariables>;
export function useGetProductsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetProductsQuery, GetProductsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetProductsQuery, GetProductsQueryVariables>(GetProductsDocument, options);
        }
export type GetProductsQueryHookResult = ReturnType<typeof useGetProductsQuery>;
export type GetProductsLazyQueryHookResult = ReturnType<typeof useGetProductsLazyQuery>;
export type GetProductsSuspenseQueryHookResult = ReturnType<typeof useGetProductsSuspenseQuery>;
export type GetProductsQueryResult = Apollo.QueryResult<GetProductsQuery, GetProductsQueryVariables>;
export const GetProductDocument = gql`
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
    `;
export function useGetProductQuery(baseOptions: Apollo.QueryHookOptions<GetProductQuery, GetProductQueryVariables> & ({ variables: GetProductQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetProductQuery, GetProductQueryVariables>(GetProductDocument, options);
      }
export function useGetProductLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetProductQuery, GetProductQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetProductQuery, GetProductQueryVariables>(GetProductDocument, options);
        }
// @ts-ignore
export function useGetProductSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetProductQuery, GetProductQueryVariables>): Apollo.UseSuspenseQueryResult<GetProductQuery, GetProductQueryVariables>;
export function useGetProductSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetProductQuery, GetProductQueryVariables>): Apollo.UseSuspenseQueryResult<GetProductQuery | undefined, GetProductQueryVariables>;
export function useGetProductSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetProductQuery, GetProductQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetProductQuery, GetProductQueryVariables>(GetProductDocument, options);
        }
export type GetProductQueryHookResult = ReturnType<typeof useGetProductQuery>;
export type GetProductLazyQueryHookResult = ReturnType<typeof useGetProductLazyQuery>;
export type GetProductSuspenseQueryHookResult = ReturnType<typeof useGetProductSuspenseQuery>;
export type GetProductQueryResult = Apollo.QueryResult<GetProductQuery, GetProductQueryVariables>;
export const GetProductsByOrganizationDocument = gql`
    query GetProductsByOrganization($organizationId: ID!) {
  productsByOrganization(organizationId: $organizationId) {
    id
    name
    sku
    price
    status
  }
}
    `;
export function useGetProductsByOrganizationQuery(baseOptions: Apollo.QueryHookOptions<GetProductsByOrganizationQuery, GetProductsByOrganizationQueryVariables> & ({ variables: GetProductsByOrganizationQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetProductsByOrganizationQuery, GetProductsByOrganizationQueryVariables>(GetProductsByOrganizationDocument, options);
      }
export function useGetProductsByOrganizationLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetProductsByOrganizationQuery, GetProductsByOrganizationQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetProductsByOrganizationQuery, GetProductsByOrganizationQueryVariables>(GetProductsByOrganizationDocument, options);
        }
// @ts-ignore
export function useGetProductsByOrganizationSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetProductsByOrganizationQuery, GetProductsByOrganizationQueryVariables>): Apollo.UseSuspenseQueryResult<GetProductsByOrganizationQuery, GetProductsByOrganizationQueryVariables>;
export function useGetProductsByOrganizationSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetProductsByOrganizationQuery, GetProductsByOrganizationQueryVariables>): Apollo.UseSuspenseQueryResult<GetProductsByOrganizationQuery | undefined, GetProductsByOrganizationQueryVariables>;
export function useGetProductsByOrganizationSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetProductsByOrganizationQuery, GetProductsByOrganizationQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetProductsByOrganizationQuery, GetProductsByOrganizationQueryVariables>(GetProductsByOrganizationDocument, options);
        }
export type GetProductsByOrganizationQueryHookResult = ReturnType<typeof useGetProductsByOrganizationQuery>;
export type GetProductsByOrganizationLazyQueryHookResult = ReturnType<typeof useGetProductsByOrganizationLazyQuery>;
export type GetProductsByOrganizationSuspenseQueryHookResult = ReturnType<typeof useGetProductsByOrganizationSuspenseQuery>;
export type GetProductsByOrganizationQueryResult = Apollo.QueryResult<GetProductsByOrganizationQuery, GetProductsByOrganizationQueryVariables>;
export const CreateProductDocument = gql`
    mutation CreateProduct($input: CreateProductInput!) {
  createProduct(input: $input) {
    id
    name
    sku
  }
}
    `;
export type CreateProductMutationFn = Apollo.MutationFunction<CreateProductMutation, CreateProductMutationVariables>;
export function useCreateProductMutation(baseOptions?: Apollo.MutationHookOptions<CreateProductMutation, CreateProductMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateProductMutation, CreateProductMutationVariables>(CreateProductDocument, options);
      }
export type CreateProductMutationHookResult = ReturnType<typeof useCreateProductMutation>;
export type CreateProductMutationResult = Apollo.MutationResult<CreateProductMutation>;
export type CreateProductMutationOptions = Apollo.BaseMutationOptions<CreateProductMutation, CreateProductMutationVariables>;
export const UpdateProductDocument = gql`
    mutation UpdateProduct($id: ID!, $input: UpdateProductInput!) {
  updateProduct(id: $id, input: $input) {
    id
    name
    sku
  }
}
    `;
export type UpdateProductMutationFn = Apollo.MutationFunction<UpdateProductMutation, UpdateProductMutationVariables>;
export function useUpdateProductMutation(baseOptions?: Apollo.MutationHookOptions<UpdateProductMutation, UpdateProductMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateProductMutation, UpdateProductMutationVariables>(UpdateProductDocument, options);
      }
export type UpdateProductMutationHookResult = ReturnType<typeof useUpdateProductMutation>;
export type UpdateProductMutationResult = Apollo.MutationResult<UpdateProductMutation>;
export type UpdateProductMutationOptions = Apollo.BaseMutationOptions<UpdateProductMutation, UpdateProductMutationVariables>;
export const DeleteProductDocument = gql`
    mutation DeleteProduct($id: ID!) {
  deleteProduct(id: $id)
}
    `;
export type DeleteProductMutationFn = Apollo.MutationFunction<DeleteProductMutation, DeleteProductMutationVariables>;
export function useDeleteProductMutation(baseOptions?: Apollo.MutationHookOptions<DeleteProductMutation, DeleteProductMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteProductMutation, DeleteProductMutationVariables>(DeleteProductDocument, options);
      }
export type DeleteProductMutationHookResult = ReturnType<typeof useDeleteProductMutation>;
export type DeleteProductMutationResult = Apollo.MutationResult<DeleteProductMutation>;
export type DeleteProductMutationOptions = Apollo.BaseMutationOptions<DeleteProductMutation, DeleteProductMutationVariables>;
export const GetVendorCreditsDocument = gql`
    query GetVendorCredits($organizationId: ID!, $vendorId: ID) {
  vendorCredits(organizationId: $organizationId, vendorId: $vendorId) {
    id
    creditNumber
    vendorId
    vendor {
      id
      name
    }
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
    `;
export function useGetVendorCreditsQuery(baseOptions: Apollo.QueryHookOptions<GetVendorCreditsQuery, GetVendorCreditsQueryVariables> & ({ variables: GetVendorCreditsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetVendorCreditsQuery, GetVendorCreditsQueryVariables>(GetVendorCreditsDocument, options);
      }
export function useGetVendorCreditsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetVendorCreditsQuery, GetVendorCreditsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetVendorCreditsQuery, GetVendorCreditsQueryVariables>(GetVendorCreditsDocument, options);
        }
// @ts-ignore
export function useGetVendorCreditsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetVendorCreditsQuery, GetVendorCreditsQueryVariables>): Apollo.UseSuspenseQueryResult<GetVendorCreditsQuery, GetVendorCreditsQueryVariables>;
export function useGetVendorCreditsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetVendorCreditsQuery, GetVendorCreditsQueryVariables>): Apollo.UseSuspenseQueryResult<GetVendorCreditsQuery | undefined, GetVendorCreditsQueryVariables>;
export function useGetVendorCreditsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetVendorCreditsQuery, GetVendorCreditsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetVendorCreditsQuery, GetVendorCreditsQueryVariables>(GetVendorCreditsDocument, options);
        }
export type GetVendorCreditsQueryHookResult = ReturnType<typeof useGetVendorCreditsQuery>;
export type GetVendorCreditsLazyQueryHookResult = ReturnType<typeof useGetVendorCreditsLazyQuery>;
export type GetVendorCreditsSuspenseQueryHookResult = ReturnType<typeof useGetVendorCreditsSuspenseQuery>;
export type GetVendorCreditsQueryResult = Apollo.QueryResult<GetVendorCreditsQuery, GetVendorCreditsQueryVariables>;
export const CreateVendorCreditDocument = gql`
    mutation CreateVendorCredit($input: CreateVendorCreditInput!) {
  createVendorCredit(input: $input) {
    id
    creditNumber
    status
  }
}
    `;
export type CreateVendorCreditMutationFn = Apollo.MutationFunction<CreateVendorCreditMutation, CreateVendorCreditMutationVariables>;
export function useCreateVendorCreditMutation(baseOptions?: Apollo.MutationHookOptions<CreateVendorCreditMutation, CreateVendorCreditMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateVendorCreditMutation, CreateVendorCreditMutationVariables>(CreateVendorCreditDocument, options);
      }
export type CreateVendorCreditMutationHookResult = ReturnType<typeof useCreateVendorCreditMutation>;
export type CreateVendorCreditMutationResult = Apollo.MutationResult<CreateVendorCreditMutation>;
export type CreateVendorCreditMutationOptions = Apollo.BaseMutationOptions<CreateVendorCreditMutation, CreateVendorCreditMutationVariables>;
export const DeleteVendorCreditDocument = gql`
    mutation DeleteVendorCredit($id: ID!) {
  deleteVendorCredit(id: $id)
}
    `;
export type DeleteVendorCreditMutationFn = Apollo.MutationFunction<DeleteVendorCreditMutation, DeleteVendorCreditMutationVariables>;
export function useDeleteVendorCreditMutation(baseOptions?: Apollo.MutationHookOptions<DeleteVendorCreditMutation, DeleteVendorCreditMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteVendorCreditMutation, DeleteVendorCreditMutationVariables>(DeleteVendorCreditDocument, options);
      }
export type DeleteVendorCreditMutationHookResult = ReturnType<typeof useDeleteVendorCreditMutation>;
export type DeleteVendorCreditMutationResult = Apollo.MutationResult<DeleteVendorCreditMutation>;
export type DeleteVendorCreditMutationOptions = Apollo.BaseMutationOptions<DeleteVendorCreditMutation, DeleteVendorCreditMutationVariables>;
export const GetVendorPrepaymentsDocument = gql`
    query GetVendorPrepayments($organizationId: ID!, $vendorId: ID) {
  vendorPrepayments(organizationId: $organizationId, vendorId: $vendorId) {
    id
    prepaymentNumber
    vendorId
    vendor {
      id
      name
    }
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
    `;
export function useGetVendorPrepaymentsQuery(baseOptions: Apollo.QueryHookOptions<GetVendorPrepaymentsQuery, GetVendorPrepaymentsQueryVariables> & ({ variables: GetVendorPrepaymentsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetVendorPrepaymentsQuery, GetVendorPrepaymentsQueryVariables>(GetVendorPrepaymentsDocument, options);
      }
export function useGetVendorPrepaymentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetVendorPrepaymentsQuery, GetVendorPrepaymentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetVendorPrepaymentsQuery, GetVendorPrepaymentsQueryVariables>(GetVendorPrepaymentsDocument, options);
        }
// @ts-ignore
export function useGetVendorPrepaymentsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetVendorPrepaymentsQuery, GetVendorPrepaymentsQueryVariables>): Apollo.UseSuspenseQueryResult<GetVendorPrepaymentsQuery, GetVendorPrepaymentsQueryVariables>;
export function useGetVendorPrepaymentsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetVendorPrepaymentsQuery, GetVendorPrepaymentsQueryVariables>): Apollo.UseSuspenseQueryResult<GetVendorPrepaymentsQuery | undefined, GetVendorPrepaymentsQueryVariables>;
export function useGetVendorPrepaymentsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetVendorPrepaymentsQuery, GetVendorPrepaymentsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetVendorPrepaymentsQuery, GetVendorPrepaymentsQueryVariables>(GetVendorPrepaymentsDocument, options);
        }
export type GetVendorPrepaymentsQueryHookResult = ReturnType<typeof useGetVendorPrepaymentsQuery>;
export type GetVendorPrepaymentsLazyQueryHookResult = ReturnType<typeof useGetVendorPrepaymentsLazyQuery>;
export type GetVendorPrepaymentsSuspenseQueryHookResult = ReturnType<typeof useGetVendorPrepaymentsSuspenseQuery>;
export type GetVendorPrepaymentsQueryResult = Apollo.QueryResult<GetVendorPrepaymentsQuery, GetVendorPrepaymentsQueryVariables>;
export const CreateVendorPrepaymentDocument = gql`
    mutation CreateVendorPrepayment($input: CreateVendorPrepaymentInput!) {
  createVendorPrepayment(input: $input) {
    id
    prepaymentNumber
    status
  }
}
    `;
export type CreateVendorPrepaymentMutationFn = Apollo.MutationFunction<CreateVendorPrepaymentMutation, CreateVendorPrepaymentMutationVariables>;
export function useCreateVendorPrepaymentMutation(baseOptions?: Apollo.MutationHookOptions<CreateVendorPrepaymentMutation, CreateVendorPrepaymentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateVendorPrepaymentMutation, CreateVendorPrepaymentMutationVariables>(CreateVendorPrepaymentDocument, options);
      }
export type CreateVendorPrepaymentMutationHookResult = ReturnType<typeof useCreateVendorPrepaymentMutation>;
export type CreateVendorPrepaymentMutationResult = Apollo.MutationResult<CreateVendorPrepaymentMutation>;
export type CreateVendorPrepaymentMutationOptions = Apollo.BaseMutationOptions<CreateVendorPrepaymentMutation, CreateVendorPrepaymentMutationVariables>;
export const DeleteVendorPrepaymentDocument = gql`
    mutation DeleteVendorPrepayment($id: ID!) {
  deleteVendorPrepayment(id: $id)
}
    `;
export type DeleteVendorPrepaymentMutationFn = Apollo.MutationFunction<DeleteVendorPrepaymentMutation, DeleteVendorPrepaymentMutationVariables>;
export function useDeleteVendorPrepaymentMutation(baseOptions?: Apollo.MutationHookOptions<DeleteVendorPrepaymentMutation, DeleteVendorPrepaymentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteVendorPrepaymentMutation, DeleteVendorPrepaymentMutationVariables>(DeleteVendorPrepaymentDocument, options);
      }
export type DeleteVendorPrepaymentMutationHookResult = ReturnType<typeof useDeleteVendorPrepaymentMutation>;
export type DeleteVendorPrepaymentMutationResult = Apollo.MutationResult<DeleteVendorPrepaymentMutation>;
export type DeleteVendorPrepaymentMutationOptions = Apollo.BaseMutationOptions<DeleteVendorPrepaymentMutation, DeleteVendorPrepaymentMutationVariables>;
export const GetPurchaseOrdersForBillingDocument = gql`
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
    `;
export function useGetPurchaseOrdersForBillingQuery(baseOptions: Apollo.QueryHookOptions<GetPurchaseOrdersForBillingQuery, GetPurchaseOrdersForBillingQueryVariables> & ({ variables: GetPurchaseOrdersForBillingQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPurchaseOrdersForBillingQuery, GetPurchaseOrdersForBillingQueryVariables>(GetPurchaseOrdersForBillingDocument, options);
      }
export function useGetPurchaseOrdersForBillingLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPurchaseOrdersForBillingQuery, GetPurchaseOrdersForBillingQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPurchaseOrdersForBillingQuery, GetPurchaseOrdersForBillingQueryVariables>(GetPurchaseOrdersForBillingDocument, options);
        }
// @ts-ignore
export function useGetPurchaseOrdersForBillingSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetPurchaseOrdersForBillingQuery, GetPurchaseOrdersForBillingQueryVariables>): Apollo.UseSuspenseQueryResult<GetPurchaseOrdersForBillingQuery, GetPurchaseOrdersForBillingQueryVariables>;
export function useGetPurchaseOrdersForBillingSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPurchaseOrdersForBillingQuery, GetPurchaseOrdersForBillingQueryVariables>): Apollo.UseSuspenseQueryResult<GetPurchaseOrdersForBillingQuery | undefined, GetPurchaseOrdersForBillingQueryVariables>;
export function useGetPurchaseOrdersForBillingSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPurchaseOrdersForBillingQuery, GetPurchaseOrdersForBillingQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPurchaseOrdersForBillingQuery, GetPurchaseOrdersForBillingQueryVariables>(GetPurchaseOrdersForBillingDocument, options);
        }
export type GetPurchaseOrdersForBillingQueryHookResult = ReturnType<typeof useGetPurchaseOrdersForBillingQuery>;
export type GetPurchaseOrdersForBillingLazyQueryHookResult = ReturnType<typeof useGetPurchaseOrdersForBillingLazyQuery>;
export type GetPurchaseOrdersForBillingSuspenseQueryHookResult = ReturnType<typeof useGetPurchaseOrdersForBillingSuspenseQuery>;
export type GetPurchaseOrdersForBillingQueryResult = Apollo.QueryResult<GetPurchaseOrdersForBillingQuery, GetPurchaseOrdersForBillingQueryVariables>;
export const GetJournalEntriesDocument = gql`
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
    `;
export function useGetJournalEntriesQuery(baseOptions: Apollo.QueryHookOptions<GetJournalEntriesQuery, GetJournalEntriesQueryVariables> & ({ variables: GetJournalEntriesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetJournalEntriesQuery, GetJournalEntriesQueryVariables>(GetJournalEntriesDocument, options);
      }
export function useGetJournalEntriesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetJournalEntriesQuery, GetJournalEntriesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetJournalEntriesQuery, GetJournalEntriesQueryVariables>(GetJournalEntriesDocument, options);
        }
// @ts-ignore
export function useGetJournalEntriesSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetJournalEntriesQuery, GetJournalEntriesQueryVariables>): Apollo.UseSuspenseQueryResult<GetJournalEntriesQuery, GetJournalEntriesQueryVariables>;
export function useGetJournalEntriesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetJournalEntriesQuery, GetJournalEntriesQueryVariables>): Apollo.UseSuspenseQueryResult<GetJournalEntriesQuery | undefined, GetJournalEntriesQueryVariables>;
export function useGetJournalEntriesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetJournalEntriesQuery, GetJournalEntriesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetJournalEntriesQuery, GetJournalEntriesQueryVariables>(GetJournalEntriesDocument, options);
        }
export type GetJournalEntriesQueryHookResult = ReturnType<typeof useGetJournalEntriesQuery>;
export type GetJournalEntriesLazyQueryHookResult = ReturnType<typeof useGetJournalEntriesLazyQuery>;
export type GetJournalEntriesSuspenseQueryHookResult = ReturnType<typeof useGetJournalEntriesSuspenseQuery>;
export type GetJournalEntriesQueryResult = Apollo.QueryResult<GetJournalEntriesQuery, GetJournalEntriesQueryVariables>;
export const CreateJournalEntryDocument = gql`
    mutation CreateJournalEntry($input: JournalEntryInput!) {
  createJournalEntry(input: $input) {
    id
    seqNo
    entryNumber
  }
}
    `;
export type CreateJournalEntryMutationFn = Apollo.MutationFunction<CreateJournalEntryMutation, CreateJournalEntryMutationVariables>;
export function useCreateJournalEntryMutation(baseOptions?: Apollo.MutationHookOptions<CreateJournalEntryMutation, CreateJournalEntryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateJournalEntryMutation, CreateJournalEntryMutationVariables>(CreateJournalEntryDocument, options);
      }
export type CreateJournalEntryMutationHookResult = ReturnType<typeof useCreateJournalEntryMutation>;
export type CreateJournalEntryMutationResult = Apollo.MutationResult<CreateJournalEntryMutation>;
export type CreateJournalEntryMutationOptions = Apollo.BaseMutationOptions<CreateJournalEntryMutation, CreateJournalEntryMutationVariables>;
export const UpdateJournalEntryDocument = gql`
    mutation UpdateJournalEntry($id: ID!, $input: JournalEntryInput!) {
  updateJournalEntry(id: $id, input: $input) {
    id
    entryNumber
  }
}
    `;
export type UpdateJournalEntryMutationFn = Apollo.MutationFunction<UpdateJournalEntryMutation, UpdateJournalEntryMutationVariables>;
export function useUpdateJournalEntryMutation(baseOptions?: Apollo.MutationHookOptions<UpdateJournalEntryMutation, UpdateJournalEntryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateJournalEntryMutation, UpdateJournalEntryMutationVariables>(UpdateJournalEntryDocument, options);
      }
export type UpdateJournalEntryMutationHookResult = ReturnType<typeof useUpdateJournalEntryMutation>;
export type UpdateJournalEntryMutationResult = Apollo.MutationResult<UpdateJournalEntryMutation>;
export type UpdateJournalEntryMutationOptions = Apollo.BaseMutationOptions<UpdateJournalEntryMutation, UpdateJournalEntryMutationVariables>;
export const PostJournalEntryDocument = gql`
    mutation PostJournalEntry($id: ID!) {
  postJournalEntry(id: $id) {
    id
    status
    postedAt
  }
}
    `;
export type PostJournalEntryMutationFn = Apollo.MutationFunction<PostJournalEntryMutation, PostJournalEntryMutationVariables>;
export function usePostJournalEntryMutation(baseOptions?: Apollo.MutationHookOptions<PostJournalEntryMutation, PostJournalEntryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PostJournalEntryMutation, PostJournalEntryMutationVariables>(PostJournalEntryDocument, options);
      }
export type PostJournalEntryMutationHookResult = ReturnType<typeof usePostJournalEntryMutation>;
export type PostJournalEntryMutationResult = Apollo.MutationResult<PostJournalEntryMutation>;
export type PostJournalEntryMutationOptions = Apollo.BaseMutationOptions<PostJournalEntryMutation, PostJournalEntryMutationVariables>;
export const DeleteJournalEntryDocument = gql`
    mutation DeleteJournalEntry($id: ID!) {
  deleteJournalEntry(id: $id)
}
    `;
export type DeleteJournalEntryMutationFn = Apollo.MutationFunction<DeleteJournalEntryMutation, DeleteJournalEntryMutationVariables>;
export function useDeleteJournalEntryMutation(baseOptions?: Apollo.MutationHookOptions<DeleteJournalEntryMutation, DeleteJournalEntryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteJournalEntryMutation, DeleteJournalEntryMutationVariables>(DeleteJournalEntryDocument, options);
      }
export type DeleteJournalEntryMutationHookResult = ReturnType<typeof useDeleteJournalEntryMutation>;
export type DeleteJournalEntryMutationResult = Apollo.MutationResult<DeleteJournalEntryMutation>;
export type DeleteJournalEntryMutationOptions = Apollo.BaseMutationOptions<DeleteJournalEntryMutation, DeleteJournalEntryMutationVariables>;
export const GetBudgetsDocument = gql`
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
    `;
export function useGetBudgetsQuery(baseOptions: Apollo.QueryHookOptions<GetBudgetsQuery, GetBudgetsQueryVariables> & ({ variables: GetBudgetsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetBudgetsQuery, GetBudgetsQueryVariables>(GetBudgetsDocument, options);
      }
export function useGetBudgetsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetBudgetsQuery, GetBudgetsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetBudgetsQuery, GetBudgetsQueryVariables>(GetBudgetsDocument, options);
        }
// @ts-ignore
export function useGetBudgetsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetBudgetsQuery, GetBudgetsQueryVariables>): Apollo.UseSuspenseQueryResult<GetBudgetsQuery, GetBudgetsQueryVariables>;
export function useGetBudgetsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetBudgetsQuery, GetBudgetsQueryVariables>): Apollo.UseSuspenseQueryResult<GetBudgetsQuery | undefined, GetBudgetsQueryVariables>;
export function useGetBudgetsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetBudgetsQuery, GetBudgetsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetBudgetsQuery, GetBudgetsQueryVariables>(GetBudgetsDocument, options);
        }
export type GetBudgetsQueryHookResult = ReturnType<typeof useGetBudgetsQuery>;
export type GetBudgetsLazyQueryHookResult = ReturnType<typeof useGetBudgetsLazyQuery>;
export type GetBudgetsSuspenseQueryHookResult = ReturnType<typeof useGetBudgetsSuspenseQuery>;
export type GetBudgetsQueryResult = Apollo.QueryResult<GetBudgetsQuery, GetBudgetsQueryVariables>;
export const CreateBudgetDocument = gql`
    mutation CreateBudget($input: BudgetInput!) {
  createBudget(input: $input) {
    id
    seqNo
    budgetName
  }
}
    `;
export type CreateBudgetMutationFn = Apollo.MutationFunction<CreateBudgetMutation, CreateBudgetMutationVariables>;
export function useCreateBudgetMutation(baseOptions?: Apollo.MutationHookOptions<CreateBudgetMutation, CreateBudgetMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateBudgetMutation, CreateBudgetMutationVariables>(CreateBudgetDocument, options);
      }
export type CreateBudgetMutationHookResult = ReturnType<typeof useCreateBudgetMutation>;
export type CreateBudgetMutationResult = Apollo.MutationResult<CreateBudgetMutation>;
export type CreateBudgetMutationOptions = Apollo.BaseMutationOptions<CreateBudgetMutation, CreateBudgetMutationVariables>;
export const UpdateBudgetDocument = gql`
    mutation UpdateBudget($id: ID!, $input: BudgetInput!) {
  updateBudget(id: $id, input: $input) {
    id
    budgetName
  }
}
    `;
export type UpdateBudgetMutationFn = Apollo.MutationFunction<UpdateBudgetMutation, UpdateBudgetMutationVariables>;
export function useUpdateBudgetMutation(baseOptions?: Apollo.MutationHookOptions<UpdateBudgetMutation, UpdateBudgetMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateBudgetMutation, UpdateBudgetMutationVariables>(UpdateBudgetDocument, options);
      }
export type UpdateBudgetMutationHookResult = ReturnType<typeof useUpdateBudgetMutation>;
export type UpdateBudgetMutationResult = Apollo.MutationResult<UpdateBudgetMutation>;
export type UpdateBudgetMutationOptions = Apollo.BaseMutationOptions<UpdateBudgetMutation, UpdateBudgetMutationVariables>;
export const ActivateBudgetDocument = gql`
    mutation ActivateBudget($id: ID!) {
  activateBudget(id: $id) {
    id
    status
  }
}
    `;
export type ActivateBudgetMutationFn = Apollo.MutationFunction<ActivateBudgetMutation, ActivateBudgetMutationVariables>;
export function useActivateBudgetMutation(baseOptions?: Apollo.MutationHookOptions<ActivateBudgetMutation, ActivateBudgetMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ActivateBudgetMutation, ActivateBudgetMutationVariables>(ActivateBudgetDocument, options);
      }
export type ActivateBudgetMutationHookResult = ReturnType<typeof useActivateBudgetMutation>;
export type ActivateBudgetMutationResult = Apollo.MutationResult<ActivateBudgetMutation>;
export type ActivateBudgetMutationOptions = Apollo.BaseMutationOptions<ActivateBudgetMutation, ActivateBudgetMutationVariables>;
export const DeleteBudgetDocument = gql`
    mutation DeleteBudget($id: ID!) {
  deleteBudget(id: $id)
}
    `;
export type DeleteBudgetMutationFn = Apollo.MutationFunction<DeleteBudgetMutation, DeleteBudgetMutationVariables>;
export function useDeleteBudgetMutation(baseOptions?: Apollo.MutationHookOptions<DeleteBudgetMutation, DeleteBudgetMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteBudgetMutation, DeleteBudgetMutationVariables>(DeleteBudgetDocument, options);
      }
export type DeleteBudgetMutationHookResult = ReturnType<typeof useDeleteBudgetMutation>;
export type DeleteBudgetMutationResult = Apollo.MutationResult<DeleteBudgetMutation>;
export type DeleteBudgetMutationOptions = Apollo.BaseMutationOptions<DeleteBudgetMutation, DeleteBudgetMutationVariables>;
export const UpdateChartOfAccountDocument = gql`
    mutation UpdateChartOfAccount($id: ID!, $input: ChartOfAccountsInput!) {
  updateChartOfAccount(id: $id, input: $input) {
    id
    accountCode
    accountName
  }
}
    `;
export type UpdateChartOfAccountMutationFn = Apollo.MutationFunction<UpdateChartOfAccountMutation, UpdateChartOfAccountMutationVariables>;
export function useUpdateChartOfAccountMutation(baseOptions?: Apollo.MutationHookOptions<UpdateChartOfAccountMutation, UpdateChartOfAccountMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateChartOfAccountMutation, UpdateChartOfAccountMutationVariables>(UpdateChartOfAccountDocument, options);
      }
export type UpdateChartOfAccountMutationHookResult = ReturnType<typeof useUpdateChartOfAccountMutation>;
export type UpdateChartOfAccountMutationResult = Apollo.MutationResult<UpdateChartOfAccountMutation>;
export type UpdateChartOfAccountMutationOptions = Apollo.BaseMutationOptions<UpdateChartOfAccountMutation, UpdateChartOfAccountMutationVariables>;
export const DeleteChartOfAccountDocument = gql`
    mutation DeleteChartOfAccount($id: ID!) {
  deleteChartOfAccount(id: $id)
}
    `;
export type DeleteChartOfAccountMutationFn = Apollo.MutationFunction<DeleteChartOfAccountMutation, DeleteChartOfAccountMutationVariables>;
export function useDeleteChartOfAccountMutation(baseOptions?: Apollo.MutationHookOptions<DeleteChartOfAccountMutation, DeleteChartOfAccountMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteChartOfAccountMutation, DeleteChartOfAccountMutationVariables>(DeleteChartOfAccountDocument, options);
      }
export type DeleteChartOfAccountMutationHookResult = ReturnType<typeof useDeleteChartOfAccountMutation>;
export type DeleteChartOfAccountMutationResult = Apollo.MutationResult<DeleteChartOfAccountMutation>;
export type DeleteChartOfAccountMutationOptions = Apollo.BaseMutationOptions<DeleteChartOfAccountMutation, DeleteChartOfAccountMutationVariables>;
export const GetAllocationSchedulesDocument = gql`
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
    `;
export function useGetAllocationSchedulesQuery(baseOptions: Apollo.QueryHookOptions<GetAllocationSchedulesQuery, GetAllocationSchedulesQueryVariables> & ({ variables: GetAllocationSchedulesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllocationSchedulesQuery, GetAllocationSchedulesQueryVariables>(GetAllocationSchedulesDocument, options);
      }
export function useGetAllocationSchedulesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllocationSchedulesQuery, GetAllocationSchedulesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllocationSchedulesQuery, GetAllocationSchedulesQueryVariables>(GetAllocationSchedulesDocument, options);
        }
// @ts-ignore
export function useGetAllocationSchedulesSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetAllocationSchedulesQuery, GetAllocationSchedulesQueryVariables>): Apollo.UseSuspenseQueryResult<GetAllocationSchedulesQuery, GetAllocationSchedulesQueryVariables>;
export function useGetAllocationSchedulesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAllocationSchedulesQuery, GetAllocationSchedulesQueryVariables>): Apollo.UseSuspenseQueryResult<GetAllocationSchedulesQuery | undefined, GetAllocationSchedulesQueryVariables>;
export function useGetAllocationSchedulesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAllocationSchedulesQuery, GetAllocationSchedulesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAllocationSchedulesQuery, GetAllocationSchedulesQueryVariables>(GetAllocationSchedulesDocument, options);
        }
export type GetAllocationSchedulesQueryHookResult = ReturnType<typeof useGetAllocationSchedulesQuery>;
export type GetAllocationSchedulesLazyQueryHookResult = ReturnType<typeof useGetAllocationSchedulesLazyQuery>;
export type GetAllocationSchedulesSuspenseQueryHookResult = ReturnType<typeof useGetAllocationSchedulesSuspenseQuery>;
export type GetAllocationSchedulesQueryResult = Apollo.QueryResult<GetAllocationSchedulesQuery, GetAllocationSchedulesQueryVariables>;
export const CreateAllocationScheduleDocument = gql`
    mutation CreateAllocationSchedule($input: AllocationScheduleInput!) {
  createAllocationSchedule(input: $input) {
    id
    seqNo
    scheduleName
  }
}
    `;
export type CreateAllocationScheduleMutationFn = Apollo.MutationFunction<CreateAllocationScheduleMutation, CreateAllocationScheduleMutationVariables>;
export function useCreateAllocationScheduleMutation(baseOptions?: Apollo.MutationHookOptions<CreateAllocationScheduleMutation, CreateAllocationScheduleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateAllocationScheduleMutation, CreateAllocationScheduleMutationVariables>(CreateAllocationScheduleDocument, options);
      }
export type CreateAllocationScheduleMutationHookResult = ReturnType<typeof useCreateAllocationScheduleMutation>;
export type CreateAllocationScheduleMutationResult = Apollo.MutationResult<CreateAllocationScheduleMutation>;
export type CreateAllocationScheduleMutationOptions = Apollo.BaseMutationOptions<CreateAllocationScheduleMutation, CreateAllocationScheduleMutationVariables>;
export const UpdateAllocationScheduleDocument = gql`
    mutation UpdateAllocationSchedule($id: ID!, $input: AllocationScheduleInput!) {
  updateAllocationSchedule(id: $id, input: $input) {
    id
    scheduleName
  }
}
    `;
export type UpdateAllocationScheduleMutationFn = Apollo.MutationFunction<UpdateAllocationScheduleMutation, UpdateAllocationScheduleMutationVariables>;
export function useUpdateAllocationScheduleMutation(baseOptions?: Apollo.MutationHookOptions<UpdateAllocationScheduleMutation, UpdateAllocationScheduleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateAllocationScheduleMutation, UpdateAllocationScheduleMutationVariables>(UpdateAllocationScheduleDocument, options);
      }
export type UpdateAllocationScheduleMutationHookResult = ReturnType<typeof useUpdateAllocationScheduleMutation>;
export type UpdateAllocationScheduleMutationResult = Apollo.MutationResult<UpdateAllocationScheduleMutation>;
export type UpdateAllocationScheduleMutationOptions = Apollo.BaseMutationOptions<UpdateAllocationScheduleMutation, UpdateAllocationScheduleMutationVariables>;
export const DeleteAllocationScheduleDocument = gql`
    mutation DeleteAllocationSchedule($id: ID!) {
  deleteAllocationSchedule(id: $id)
}
    `;
export type DeleteAllocationScheduleMutationFn = Apollo.MutationFunction<DeleteAllocationScheduleMutation, DeleteAllocationScheduleMutationVariables>;
export function useDeleteAllocationScheduleMutation(baseOptions?: Apollo.MutationHookOptions<DeleteAllocationScheduleMutation, DeleteAllocationScheduleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteAllocationScheduleMutation, DeleteAllocationScheduleMutationVariables>(DeleteAllocationScheduleDocument, options);
      }
export type DeleteAllocationScheduleMutationHookResult = ReturnType<typeof useDeleteAllocationScheduleMutation>;
export type DeleteAllocationScheduleMutationResult = Apollo.MutationResult<DeleteAllocationScheduleMutation>;
export type DeleteAllocationScheduleMutationOptions = Apollo.BaseMutationOptions<DeleteAllocationScheduleMutation, DeleteAllocationScheduleMutationVariables>;
export const GetCurrencyRevaluationsDocument = gql`
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
    `;
export function useGetCurrencyRevaluationsQuery(baseOptions: Apollo.QueryHookOptions<GetCurrencyRevaluationsQuery, GetCurrencyRevaluationsQueryVariables> & ({ variables: GetCurrencyRevaluationsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCurrencyRevaluationsQuery, GetCurrencyRevaluationsQueryVariables>(GetCurrencyRevaluationsDocument, options);
      }
export function useGetCurrencyRevaluationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCurrencyRevaluationsQuery, GetCurrencyRevaluationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCurrencyRevaluationsQuery, GetCurrencyRevaluationsQueryVariables>(GetCurrencyRevaluationsDocument, options);
        }
// @ts-ignore
export function useGetCurrencyRevaluationsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetCurrencyRevaluationsQuery, GetCurrencyRevaluationsQueryVariables>): Apollo.UseSuspenseQueryResult<GetCurrencyRevaluationsQuery, GetCurrencyRevaluationsQueryVariables>;
export function useGetCurrencyRevaluationsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCurrencyRevaluationsQuery, GetCurrencyRevaluationsQueryVariables>): Apollo.UseSuspenseQueryResult<GetCurrencyRevaluationsQuery | undefined, GetCurrencyRevaluationsQueryVariables>;
export function useGetCurrencyRevaluationsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCurrencyRevaluationsQuery, GetCurrencyRevaluationsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCurrencyRevaluationsQuery, GetCurrencyRevaluationsQueryVariables>(GetCurrencyRevaluationsDocument, options);
        }
export type GetCurrencyRevaluationsQueryHookResult = ReturnType<typeof useGetCurrencyRevaluationsQuery>;
export type GetCurrencyRevaluationsLazyQueryHookResult = ReturnType<typeof useGetCurrencyRevaluationsLazyQuery>;
export type GetCurrencyRevaluationsSuspenseQueryHookResult = ReturnType<typeof useGetCurrencyRevaluationsSuspenseQuery>;
export type GetCurrencyRevaluationsQueryResult = Apollo.QueryResult<GetCurrencyRevaluationsQuery, GetCurrencyRevaluationsQueryVariables>;
export const CreateCurrencyRevaluationDocument = gql`
    mutation CreateCurrencyRevaluation($input: CurrencyRevaluationInput!) {
  createCurrencyRevaluation(input: $input) {
    id
    seqNo
  }
}
    `;
export type CreateCurrencyRevaluationMutationFn = Apollo.MutationFunction<CreateCurrencyRevaluationMutation, CreateCurrencyRevaluationMutationVariables>;
export function useCreateCurrencyRevaluationMutation(baseOptions?: Apollo.MutationHookOptions<CreateCurrencyRevaluationMutation, CreateCurrencyRevaluationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateCurrencyRevaluationMutation, CreateCurrencyRevaluationMutationVariables>(CreateCurrencyRevaluationDocument, options);
      }
export type CreateCurrencyRevaluationMutationHookResult = ReturnType<typeof useCreateCurrencyRevaluationMutation>;
export type CreateCurrencyRevaluationMutationResult = Apollo.MutationResult<CreateCurrencyRevaluationMutation>;
export type CreateCurrencyRevaluationMutationOptions = Apollo.BaseMutationOptions<CreateCurrencyRevaluationMutation, CreateCurrencyRevaluationMutationVariables>;
export const PostCurrencyRevaluationDocument = gql`
    mutation PostCurrencyRevaluation($id: ID!) {
  postCurrencyRevaluation(id: $id) {
    id
    status
    postedAt
  }
}
    `;
export type PostCurrencyRevaluationMutationFn = Apollo.MutationFunction<PostCurrencyRevaluationMutation, PostCurrencyRevaluationMutationVariables>;
export function usePostCurrencyRevaluationMutation(baseOptions?: Apollo.MutationHookOptions<PostCurrencyRevaluationMutation, PostCurrencyRevaluationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PostCurrencyRevaluationMutation, PostCurrencyRevaluationMutationVariables>(PostCurrencyRevaluationDocument, options);
      }
export type PostCurrencyRevaluationMutationHookResult = ReturnType<typeof usePostCurrencyRevaluationMutation>;
export type PostCurrencyRevaluationMutationResult = Apollo.MutationResult<PostCurrencyRevaluationMutation>;
export type PostCurrencyRevaluationMutationOptions = Apollo.BaseMutationOptions<PostCurrencyRevaluationMutation, PostCurrencyRevaluationMutationVariables>;
export const DeleteCurrencyRevaluationDocument = gql`
    mutation DeleteCurrencyRevaluation($id: ID!) {
  deleteCurrencyRevaluation(id: $id)
}
    `;
export type DeleteCurrencyRevaluationMutationFn = Apollo.MutationFunction<DeleteCurrencyRevaluationMutation, DeleteCurrencyRevaluationMutationVariables>;
export function useDeleteCurrencyRevaluationMutation(baseOptions?: Apollo.MutationHookOptions<DeleteCurrencyRevaluationMutation, DeleteCurrencyRevaluationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteCurrencyRevaluationMutation, DeleteCurrencyRevaluationMutationVariables>(DeleteCurrencyRevaluationDocument, options);
      }
export type DeleteCurrencyRevaluationMutationHookResult = ReturnType<typeof useDeleteCurrencyRevaluationMutation>;
export type DeleteCurrencyRevaluationMutationResult = Apollo.MutationResult<DeleteCurrencyRevaluationMutation>;
export type DeleteCurrencyRevaluationMutationOptions = Apollo.BaseMutationOptions<DeleteCurrencyRevaluationMutation, DeleteCurrencyRevaluationMutationVariables>;