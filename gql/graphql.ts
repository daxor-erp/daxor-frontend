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
  amount: Scalars['Float']['output'];
  costCenter?: Maybe<Scalars['String']['output']>;
  destinationAccount: Scalars['String']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  percentage: Scalars['Float']['output'];
  targetOrganizationId: Scalars['ID']['output'];
  targetOrganizationName?: Maybe<Scalars['String']['output']>;
};

export type AllocationLineInput = {
  amount?: InputMaybe<Scalars['Float']['input']>;
  costCenter?: InputMaybe<Scalars['String']['input']>;
  destinationAccount: Scalars['String']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  percentage: Scalars['Float']['input'];
  targetOrganizationId: Scalars['ID']['input'];
  targetOrganizationName?: InputMaybe<Scalars['String']['input']>;
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
  /** Hydrated assignee name for timelines and inbox previews. */
  assigneeDisplayName?: Maybe<Scalars['String']['output']>;
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

export type ApprovalRequestRole =
  | 'ANY'
  | 'APPROVER'
  | 'REQUESTER';

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

export type AssetMaintenance = {
  __typename?: 'AssetMaintenance';
  actionsTaken?: Maybe<Scalars['String']['output']>;
  assetCode?: Maybe<Scalars['String']['output']>;
  assetId: Scalars['ID']['output'];
  assetName?: Maybe<Scalars['String']['output']>;
  assignedToName?: Maybe<Scalars['String']['output']>;
  assignedToUserId?: Maybe<Scalars['ID']['output']>;
  completedAt?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  description: Scalars['String']['output'];
  docNumber: Scalars['String']['output'];
  downtimeHours: Scalars['Float']['output'];
  findings?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  intervalDays?: Maybe<Scalars['Int']['output']>;
  laborCost: Scalars['Float']['output'];
  laborHours: Scalars['Float']['output'];
  laborRate: Scalars['Float']['output'];
  maintenanceType: Scalars['String']['output'];
  nextScheduledDate?: Maybe<Scalars['String']['output']>;
  notes?: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['ID']['output'];
  partsCost: Scalars['Float']['output'];
  partsUsed: Array<MaintenancePart>;
  priority: Scalars['String']['output'];
  scheduledDate: Scalars['String']['output'];
  startedAt?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  totalCost: Scalars['Float']['output'];
  updatedAt: Scalars['String']['output'];
  vendorId?: Maybe<Scalars['ID']['output']>;
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

export type AuditLog = {
  __typename?: 'AuditLog';
  action: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  entityId?: Maybe<Scalars['ID']['output']>;
  entityType: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  ipAddress?: Maybe<Scalars['String']['output']>;
  newValuesJson?: Maybe<Scalars['String']['output']>;
  oldValuesJson?: Maybe<Scalars['String']['output']>;
  userAgent?: Maybe<Scalars['String']['output']>;
  userId?: Maybe<Scalars['ID']['output']>;
};

export type AuditLogPage = {
  __typename?: 'AuditLogPage';
  data: Array<AuditLog>;
  page: Scalars['Int']['output'];
  pages: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type AuthPayload = {
  __typename?: 'AuthPayload';
  token: Scalars['String']['output'];
  user: User;
};

export type BomComponent = {
  __typename?: 'BOMComponent';
  itemId?: Maybe<Scalars['ID']['output']>;
  itemName: Scalars['String']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  quantity: Scalars['Float']['output'];
  scrapPercent: Scalars['Float']['output'];
  standardCost: Scalars['Float']['output'];
  unit: Scalars['String']['output'];
};

export type BomComponentInput = {
  itemId?: InputMaybe<Scalars['ID']['input']>;
  itemName: Scalars['String']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  quantity: Scalars['Float']['input'];
  scrapPercent?: InputMaybe<Scalars['Float']['input']>;
  standardCost?: InputMaybe<Scalars['Float']['input']>;
  unit?: InputMaybe<Scalars['String']['input']>;
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
  /** Initial balance for the account. Used as currentBalance on create. */
  openingBalance?: InputMaybe<Scalars['Float']['input']>;
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

export type BillOfMaterials = {
  __typename?: 'BillOfMaterials';
  bomCode: Scalars['String']['output'];
  components: Array<BomComponent>;
  createdAt: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  laborCost: Scalars['Float']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['ID']['output'];
  overheadCost: Scalars['Float']['output'];
  parentItemId: Scalars['ID']['output'];
  parentItemName: Scalars['String']['output'];
  quantityProduced: Scalars['Float']['output'];
  status: Scalars['String']['output'];
  totalCost: Scalars['Float']['output'];
  totalMaterialCost: Scalars['Float']['output'];
  unit: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
  version: Scalars['String']['output'];
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
  accountNumber?: Maybe<Scalars['String']['output']>;
  accountType: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  level: Scalars['Int']['output'];
  organizationId: Scalars['String']['output'];
  parentAccount?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['String']['output'];
};

export type ChartOfAccountsInput = {
  /** accountCode is generated server-side based on accountType. Ignored if supplied. */
  accountCode?: InputMaybe<Scalars['String']['input']>;
  accountName: Scalars['String']['input'];
  /** Optional human-entered identifier (e.g. legacy ledger number). */
  accountNumber?: InputMaybe<Scalars['String']['input']>;
  accountType: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
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

export type CompleteMaintenanceInput = {
  actionsTaken?: InputMaybe<Scalars['String']['input']>;
  downtimeHours?: InputMaybe<Scalars['Float']['input']>;
  findings?: InputMaybe<Scalars['String']['input']>;
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

export type CreateAssetMaintenanceInput = {
  actionsTaken?: InputMaybe<Scalars['String']['input']>;
  assetCode?: InputMaybe<Scalars['String']['input']>;
  assetId: Scalars['ID']['input'];
  assetName?: InputMaybe<Scalars['String']['input']>;
  assignedToName?: InputMaybe<Scalars['String']['input']>;
  assignedToUserId?: InputMaybe<Scalars['ID']['input']>;
  description: Scalars['String']['input'];
  docNumber: Scalars['String']['input'];
  findings?: InputMaybe<Scalars['String']['input']>;
  intervalDays?: InputMaybe<Scalars['Int']['input']>;
  laborHours?: InputMaybe<Scalars['Float']['input']>;
  laborRate?: InputMaybe<Scalars['Float']['input']>;
  maintenanceType?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['ID']['input'];
  partsUsed?: InputMaybe<Array<MaintenancePartInput>>;
  priority?: InputMaybe<Scalars['String']['input']>;
  scheduledDate: Scalars['String']['input'];
  status?: InputMaybe<Scalars['String']['input']>;
  vendorId?: InputMaybe<Scalars['ID']['input']>;
};

export type CreateAttendanceInput = {
  checkIn?: InputMaybe<Scalars['String']['input']>;
  checkOut?: InputMaybe<Scalars['String']['input']>;
  date: Scalars['String']['input'];
  organizationId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};

export type CreateBomInput = {
  bomCode: Scalars['String']['input'];
  components: Array<BomComponentInput>;
  description?: InputMaybe<Scalars['String']['input']>;
  laborCost?: InputMaybe<Scalars['Float']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['ID']['input'];
  overheadCost?: InputMaybe<Scalars['Float']['input']>;
  parentItemId: Scalars['ID']['input'];
  parentItemName: Scalars['String']['input'];
  quantityProduced?: InputMaybe<Scalars['Float']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  unit?: InputMaybe<Scalars['String']['input']>;
  version?: InputMaybe<Scalars['String']['input']>;
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

export type CreateDeliveryOrderInput = {
  carrier?: InputMaybe<Scalars['String']['input']>;
  customerId?: InputMaybe<Scalars['ID']['input']>;
  customerName?: InputMaybe<Scalars['String']['input']>;
  deliveryDate: Scalars['String']['input'];
  docNumber: Scalars['String']['input'];
  driverName?: InputMaybe<Scalars['String']['input']>;
  driverPhone?: InputMaybe<Scalars['String']['input']>;
  expectedArrival?: InputMaybe<Scalars['String']['input']>;
  items: Array<DeliveryItemInput>;
  notes?: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['ID']['input'];
  salesOrderId?: InputMaybe<Scalars['ID']['input']>;
  shippingAddress?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  trackingNumber?: InputMaybe<Scalars['String']['input']>;
  vehicleNumber?: InputMaybe<Scalars['String']['input']>;
};

export type CreateEmployeeMasterInput = {
  aadhaarNumber?: InputMaybe<Scalars['String']['input']>;
  address?: InputMaybe<Scalars['String']['input']>;
  alternatePhone?: InputMaybe<Scalars['String']['input']>;
  bankDetails?: InputMaybe<EmployeeBankInput>;
  basicSalary?: InputMaybe<Scalars['Float']['input']>;
  bloodGroup?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  dateOfBirth?: InputMaybe<Scalars['String']['input']>;
  dateOfConfirmation?: InputMaybe<Scalars['String']['input']>;
  dateOfJoining: Scalars['String']['input'];
  department?: InputMaybe<Scalars['String']['input']>;
  designation?: InputMaybe<Scalars['String']['input']>;
  emergencyContact?: InputMaybe<EmployeeEmergencyContactInput>;
  employeeCode: Scalars['String']['input'];
  employmentType?: InputMaybe<Scalars['String']['input']>;
  esiNumber?: InputMaybe<Scalars['String']['input']>;
  firstName: Scalars['String']['input'];
  gender?: InputMaybe<Scalars['String']['input']>;
  lastName: Scalars['String']['input'];
  maritalStatus?: InputMaybe<Scalars['String']['input']>;
  nationality?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['ID']['input'];
  panNumber?: InputMaybe<Scalars['String']['input']>;
  personalEmail?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  pincode?: InputMaybe<Scalars['String']['input']>;
  reportsToUserId?: InputMaybe<Scalars['ID']['input']>;
  shiftMasterId?: InputMaybe<Scalars['ID']['input']>;
  state?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  uanNumber?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['ID']['input']>;
  workEmail?: InputMaybe<Scalars['String']['input']>;
  workLocation?: InputMaybe<Scalars['String']['input']>;
};

export type CreateFixedAssetInput = {
  acquisitionCost: Scalars['Float']['input'];
  assetCode: Scalars['String']['input'];
  assignedToUserId?: InputMaybe<Scalars['ID']['input']>;
  barcode?: InputMaybe<Scalars['String']['input']>;
  category?: InputMaybe<Scalars['String']['input']>;
  commissionedDate?: InputMaybe<Scalars['String']['input']>;
  depreciationMethod?: InputMaybe<Scalars['String']['input']>;
  depreciationRatePercent?: InputMaybe<Scalars['Float']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['ID']['input'];
  purchaseDate: Scalars['String']['input'];
  salvageValue?: InputMaybe<Scalars['Float']['input']>;
  serialNumber?: InputMaybe<Scalars['String']['input']>;
  siteLocationId?: InputMaybe<Scalars['ID']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  usefulLifeMonths: Scalars['Int']['input'];
  vendorId?: InputMaybe<Scalars['ID']['input']>;
  warrantyExpiryDate?: InputMaybe<Scalars['String']['input']>;
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

export type CreateHrMasterInput = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  code: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  kind: Scalars['String']['input'];
  metadataJson?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  organizationId: Scalars['ID']['input'];
  sortOrder?: InputMaybe<Scalars['Int']['input']>;
};

export type CreateIntercompanyAllocationInput = {
  allocationMethod?: InputMaybe<Scalars['String']['input']>;
  basisAmount: Scalars['Float']['input'];
  basisDate: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  lines: Array<AllocationLineInput>;
  name: Scalars['String']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['ID']['input'];
  scheduleCode: Scalars['String']['input'];
  sourceAccount: Scalars['String']['input'];
  status?: InputMaybe<Scalars['String']['input']>;
};

export type CreateIntercompanyJournalInput = {
  allocationId?: InputMaybe<Scalars['ID']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  docNumber: Scalars['String']['input'];
  entryDate: Scalars['String']['input'];
  lines: Array<IntercompanyJournalLineInput>;
  notes?: InputMaybe<Scalars['String']['input']>;
  originatingOrganizationId: Scalars['ID']['input'];
  status?: InputMaybe<Scalars['String']['input']>;
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

export type CreateQcInspectionInput = {
  batchNumber?: InputMaybe<Scalars['String']['input']>;
  defects?: InputMaybe<Array<QcDefectInput>>;
  docNumber: Scalars['String']['input'];
  inspectionDate: Scalars['String']['input'];
  inspectorName?: InputMaybe<Scalars['String']['input']>;
  inspectorUserId?: InputMaybe<Scalars['ID']['input']>;
  itemId?: InputMaybe<Scalars['ID']['input']>;
  itemName: Scalars['String']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['ID']['input'];
  outcome?: InputMaybe<Scalars['String']['input']>;
  quantityFailed?: InputMaybe<Scalars['Float']['input']>;
  quantityInspected: Scalars['Float']['input'];
  quantityPassed?: InputMaybe<Scalars['Float']['input']>;
  quantityReworked?: InputMaybe<Scalars['Float']['input']>;
  sourceId?: InputMaybe<Scalars['ID']['input']>;
  sourceModule: Scalars['String']['input'];
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

export type CreateTaxRateInput = {
  appliesTo?: InputMaybe<Scalars['String']['input']>;
  code: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  effectiveFrom?: InputMaybe<Scalars['String']['input']>;
  effectiveTo?: InputMaybe<Scalars['String']['input']>;
  hsnSacCode?: InputMaybe<Scalars['String']['input']>;
  isCompound?: InputMaybe<Scalars['Boolean']['input']>;
  isInclusive?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
  organizationId: Scalars['ID']['input'];
  ratePercent: Scalars['Float']['input'];
  status?: InputMaybe<Scalars['String']['input']>;
  taxType?: InputMaybe<Scalars['String']['input']>;
};

export type CreateTimesheetEntryInput = {
  billRate?: InputMaybe<Scalars['Float']['input']>;
  billable?: InputMaybe<Scalars['Boolean']['input']>;
  costRate?: InputMaybe<Scalars['Float']['input']>;
  employeeUserId: Scalars['ID']['input'];
  entryDate: Scalars['String']['input'];
  hours: Scalars['Float']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['ID']['input'];
  projectId?: InputMaybe<Scalars['ID']['input']>;
  taskName?: InputMaybe<Scalars['String']['input']>;
  workOrderId?: InputMaybe<Scalars['ID']['input']>;
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

export type DashboardPreferences = {
  __typename?: 'DashboardPreferences';
  admin?: Maybe<DashboardWidgetPreferences>;
  erp?: Maybe<DashboardWidgetPreferences>;
  orgAdmin?: Maybe<DashboardWidgetPreferences>;
};

export type DashboardWidgetPreferences = {
  __typename?: 'DashboardWidgetPreferences';
  hiddenWidgets: Array<Scalars['String']['output']>;
  widgetOrder: Array<Scalars['String']['output']>;
};

export type DashboardWidgetPreferencesInput = {
  hiddenWidgets: Array<Scalars['String']['input']>;
  widgetOrder: Array<Scalars['String']['input']>;
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

export type DeliveryItem = {
  __typename?: 'DeliveryItem';
  itemId?: Maybe<Scalars['ID']['output']>;
  itemName: Scalars['String']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  quantity: Scalars['Float']['output'];
  unit: Scalars['String']['output'];
};

export type DeliveryItemInput = {
  itemId?: InputMaybe<Scalars['ID']['input']>;
  itemName: Scalars['String']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  quantity: Scalars['Float']['input'];
  unit?: InputMaybe<Scalars['String']['input']>;
};

export type DeliveryOrder = {
  __typename?: 'DeliveryOrder';
  actualArrival?: Maybe<Scalars['String']['output']>;
  carrier?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  customerId?: Maybe<Scalars['ID']['output']>;
  customerName?: Maybe<Scalars['String']['output']>;
  deliveredAt?: Maybe<Scalars['String']['output']>;
  deliveryDate: Scalars['String']['output'];
  dispatchedAt?: Maybe<Scalars['String']['output']>;
  docNumber: Scalars['String']['output'];
  driverName?: Maybe<Scalars['String']['output']>;
  driverPhone?: Maybe<Scalars['String']['output']>;
  expectedArrival?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  items: Array<DeliveryItem>;
  notes?: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['ID']['output'];
  salesOrderId?: Maybe<Scalars['ID']['output']>;
  shippingAddress?: Maybe<Scalars['String']['output']>;
  signedAt?: Maybe<Scalars['String']['output']>;
  signedBy?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  totalQuantity: Scalars['Float']['output'];
  trackingNumber?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['String']['output'];
  vehicleNumber?: Maybe<Scalars['String']['output']>;
};

export type DepreciationEntry = {
  __typename?: 'DepreciationEntry';
  accumulatedDepreciation: Scalars['Float']['output'];
  amount: Scalars['Float']['output'];
  bookValue: Scalars['Float']['output'];
  method: Scalars['String']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  periodEndDate: Scalars['String']['output'];
  postedAt: Scalars['String']['output'];
};

export type Document = {
  __typename?: 'Document';
  category?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  downloadUrl: Scalars['String']['output'];
  filename: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  mimeType?: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['ID']['output'];
  parentId: Scalars['ID']['output'];
  parentModule: Scalars['String']['output'];
  sizeBytes: Scalars['Int']['output'];
  updatedAt: Scalars['String']['output'];
  uploadedByUserId?: Maybe<Scalars['ID']['output']>;
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

export type EmployeeBank = {
  __typename?: 'EmployeeBank';
  accountNumber?: Maybe<Scalars['String']['output']>;
  bankName?: Maybe<Scalars['String']['output']>;
  branchName?: Maybe<Scalars['String']['output']>;
  ifscCode?: Maybe<Scalars['String']['output']>;
};

export type EmployeeBankInput = {
  accountNumber?: InputMaybe<Scalars['String']['input']>;
  bankName?: InputMaybe<Scalars['String']['input']>;
  branchName?: InputMaybe<Scalars['String']['input']>;
  ifscCode?: InputMaybe<Scalars['String']['input']>;
};

export type EmployeeEmergencyContact = {
  __typename?: 'EmployeeEmergencyContact';
  name?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  relation?: Maybe<Scalars['String']['output']>;
};

export type EmployeeEmergencyContactInput = {
  name?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  relation?: InputMaybe<Scalars['String']['input']>;
};

export type EmployeeMaster = {
  __typename?: 'EmployeeMaster';
  aadhaarNumber?: Maybe<Scalars['String']['output']>;
  address?: Maybe<Scalars['String']['output']>;
  alternatePhone?: Maybe<Scalars['String']['output']>;
  bankDetails?: Maybe<EmployeeBank>;
  basicSalary: Scalars['Float']['output'];
  bloodGroup?: Maybe<Scalars['String']['output']>;
  city?: Maybe<Scalars['String']['output']>;
  country?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  currency: Scalars['String']['output'];
  dateOfBirth?: Maybe<Scalars['String']['output']>;
  dateOfConfirmation?: Maybe<Scalars['String']['output']>;
  dateOfJoining: Scalars['String']['output'];
  dateOfRelieving?: Maybe<Scalars['String']['output']>;
  department?: Maybe<Scalars['String']['output']>;
  designation?: Maybe<Scalars['String']['output']>;
  emergencyContact?: Maybe<EmployeeEmergencyContact>;
  employeeCode: Scalars['String']['output'];
  employmentType?: Maybe<Scalars['String']['output']>;
  esiNumber?: Maybe<Scalars['String']['output']>;
  firstName: Scalars['String']['output'];
  gender?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  lastName: Scalars['String']['output'];
  maritalStatus?: Maybe<Scalars['String']['output']>;
  nationality?: Maybe<Scalars['String']['output']>;
  notes?: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['ID']['output'];
  panNumber?: Maybe<Scalars['String']['output']>;
  personalEmail?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  pincode?: Maybe<Scalars['String']['output']>;
  reportsToUserId?: Maybe<Scalars['ID']['output']>;
  shiftMasterId?: Maybe<Scalars['ID']['output']>;
  state?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  uanNumber?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['String']['output'];
  userId?: Maybe<Scalars['ID']['output']>;
  workEmail?: Maybe<Scalars['String']['output']>;
  workLocation?: Maybe<Scalars['String']['output']>;
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

export type FixedAsset = {
  __typename?: 'FixedAsset';
  accumulatedDepreciation: Scalars['Float']['output'];
  acquisitionCost: Scalars['Float']['output'];
  assetCode: Scalars['String']['output'];
  assignedToUserId?: Maybe<Scalars['ID']['output']>;
  barcode?: Maybe<Scalars['String']['output']>;
  bookValue: Scalars['Float']['output'];
  category: Scalars['String']['output'];
  commissionedDate?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  depreciationHistory: Array<DepreciationEntry>;
  depreciationMethod: Scalars['String']['output'];
  depreciationRatePercent?: Maybe<Scalars['Float']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  disposalDate?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['ID']['output'];
  purchaseDate: Scalars['String']['output'];
  salvageValue: Scalars['Float']['output'];
  serialNumber?: Maybe<Scalars['String']['output']>;
  siteLocationId?: Maybe<Scalars['ID']['output']>;
  status: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
  usefulLifeMonths: Scalars['Int']['output'];
  vendorId?: Maybe<Scalars['ID']['output']>;
  warrantyExpiryDate?: Maybe<Scalars['String']['output']>;
};

export type FixedAssetCategorySummary = {
  __typename?: 'FixedAssetCategorySummary';
  accumulatedDepreciation: Scalars['Float']['output'];
  acquisitionCost: Scalars['Float']['output'];
  bookValue: Scalars['Float']['output'];
  category: Scalars['String']['output'];
  count: Scalars['Int']['output'];
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

export type HrMaster = {
  __typename?: 'HrMaster';
  active: Scalars['Boolean']['output'];
  code: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  kind: Scalars['String']['output'];
  metadataJson?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  organizationId: Scalars['ID']['output'];
  sortOrder: Scalars['Int']['output'];
  updatedAt: Scalars['String']['output'];
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

export type IntercompanyAllocation = {
  __typename?: 'IntercompanyAllocation';
  allocationMethod: Scalars['String']['output'];
  basisAmount: Scalars['Float']['output'];
  basisDate: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  journalEntryId?: Maybe<Scalars['ID']['output']>;
  lines: Array<AllocationLine>;
  name: Scalars['String']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['ID']['output'];
  postedAt?: Maybe<Scalars['String']['output']>;
  postedByUserId?: Maybe<Scalars['ID']['output']>;
  scheduleCode: Scalars['String']['output'];
  sourceAccount: Scalars['String']['output'];
  status: Scalars['String']['output'];
  totalAllocated: Scalars['Float']['output'];
  updatedAt: Scalars['String']['output'];
};

export type IntercompanyJournalEntry = {
  __typename?: 'IntercompanyJournalEntry';
  allocationId?: Maybe<Scalars['ID']['output']>;
  createdAt: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  docNumber: Scalars['String']['output'];
  entryDate: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lines: Array<IntercompanyJournalLine>;
  notes?: Maybe<Scalars['String']['output']>;
  originatingOrganizationId: Scalars['ID']['output'];
  postedAt?: Maybe<Scalars['String']['output']>;
  postedByUserId?: Maybe<Scalars['ID']['output']>;
  reversalOfId?: Maybe<Scalars['ID']['output']>;
  status: Scalars['String']['output'];
  totalCredit: Scalars['Float']['output'];
  totalDebit: Scalars['Float']['output'];
  updatedAt: Scalars['String']['output'];
};

export type IntercompanyJournalLine = {
  __typename?: 'IntercompanyJournalLine';
  account: Scalars['String']['output'];
  accountName?: Maybe<Scalars['String']['output']>;
  costCenter?: Maybe<Scalars['String']['output']>;
  credit: Scalars['Float']['output'];
  debit: Scalars['Float']['output'];
  description?: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['ID']['output'];
};

export type IntercompanyJournalLineInput = {
  account: Scalars['String']['input'];
  accountName?: InputMaybe<Scalars['String']['input']>;
  costCenter?: InputMaybe<Scalars['String']['input']>;
  credit?: InputMaybe<Scalars['Float']['input']>;
  debit?: InputMaybe<Scalars['Float']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['ID']['input'];
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

export type MaintenancePart = {
  __typename?: 'MaintenancePart';
  costPerUnit: Scalars['Float']['output'];
  itemId?: Maybe<Scalars['ID']['output']>;
  itemName: Scalars['String']['output'];
  lineTotal: Scalars['Float']['output'];
  quantity: Scalars['Float']['output'];
  unit: Scalars['String']['output'];
};

export type MaintenancePartInput = {
  costPerUnit?: InputMaybe<Scalars['Float']['input']>;
  itemId?: InputMaybe<Scalars['ID']['input']>;
  itemName: Scalars['String']['input'];
  quantity: Scalars['Float']['input'];
  unit?: InputMaybe<Scalars['String']['input']>;
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
  submoduleKey?: Maybe<Scalars['String']['output']>;
};

export type ModulePermissionInput = {
  canCreate: Scalars['Boolean']['input'];
  canDelete: Scalars['Boolean']['input'];
  canUpdate: Scalars['Boolean']['input'];
  canView: Scalars['Boolean']['input'];
  moduleKey: Scalars['String']['input'];
  submoduleKey?: InputMaybe<Scalars['String']['input']>;
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
  archiveAllNotifications: Scalars['Int']['output'];
  archiveNotification: Notification;
  billPurchaseOrder: VendorBill;
  cancelCustomerDeposit: CustomerDeposit;
  cancelCustomerRefund: CustomerRefund;
  cancelFinanceChargeAssessment: FinanceChargeAssessment;
  cancelIntercompanyTransfer: IntercompanyTransfer;
  cancelMaterialReceipt: MaterialReceipt;
  cancelReturnAuthorization: ReturnAuthorization;
  cancelStockAdjustment: StockAdjustment;
  cancelStockTransfer: StockTransfer;
  completeAssetMaintenance: AssetMaintenance;
  confirmIntercompanyTransfer: IntercompanyTransfer;
  confirmMaterialReceipt: MaterialReceipt;
  confirmStockAdjustment: StockAdjustment;
  confirmStockTransfer: StockTransfer;
  convertLeadToOpportunity: Scalars['ID']['output'];
  createAllocationSchedule: AllocationSchedule;
  createApplicant: Applicant;
  createAsset: Asset;
  createAssetMaintenance: AssetMaintenance;
  createAttendance: Attendance;
  createBankAccount: BankAccount;
  createBankStatementLine: BankStatementLine;
  createBillOfMaterials: BillOfMaterials;
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
  createDeliveryOrder: DeliveryOrder;
  createEPM: Epm;
  createEmployeeMaster: EmployeeMaster;
  createExciseInvoice: ExciseInvoice;
  createExtraction: Extraction;
  createFixedAsset: FixedAsset;
  createGRN: Grn;
  createGeneralLedger: GeneralLedger;
  createGoodsReceipt: GoodsReceipt;
  createHrMaster: HrMaster;
  createIPInspection: IpInspection;
  createIntercompanyAllocation: IntercompanyAllocation;
  createIntercompanyJournalEntry: IntercompanyJournalEntry;
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
  createQCInspection: QcInspection;
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
  createTaxRate: TaxRate;
  createTimesheetEntry: TimesheetEntry;
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
  deleteAssetMaintenance: AssetMaintenance;
  deleteAttendance: Attendance;
  deleteBankStatementLine: Scalars['Boolean']['output'];
  deleteBillOfMaterials: BillOfMaterials;
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
  deleteDeliveryOrder: DeliveryOrder;
  deleteDocument: Document;
  deleteEPM: Scalars['Boolean']['output'];
  deleteEmployeeMaster: EmployeeMaster;
  deleteExciseInvoice: Scalars['Boolean']['output'];
  deleteExtraction: Scalars['Boolean']['output'];
  deleteFinanceChargeAssessment: Scalars['Boolean']['output'];
  deleteFixedAsset: FixedAsset;
  deleteGRN: Scalars['Boolean']['output'];
  deleteGoodsReceipt: Scalars['Boolean']['output'];
  deleteHrMaster: HrMaster;
  deleteIPInspection: Scalars['Boolean']['output'];
  deleteIndividualPriceList: Scalars['Boolean']['output'];
  deleteIntercompanyAllocation: IntercompanyAllocation;
  deleteIntercompanyJournalEntry: IntercompanyJournalEntry;
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
  deleteQCInspection: QcInspection;
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
  deleteTaxRate: TaxRate;
  deleteTimesheetEntry: TimesheetEntry;
  deleteUser: User;
  deleteVendor: Scalars['Boolean']['output'];
  deleteVendorBill: Scalars['Boolean']['output'];
  deleteVendorCredit: Scalars['Boolean']['output'];
  deleteVendorPayment: Scalars['Boolean']['output'];
  deleteVendorPrepayment: Scalars['Boolean']['output'];
  deleteWorkOrder: Scalars['Boolean']['output'];
  disposeFixedAsset: FixedAsset;
  draftFinanceChargeAssessment: FinanceChargeAssessment;
  generatePriceList: PriceList;
  login: AuthPayload;
  markAllNotificationsRead: Scalars['Int']['output'];
  markNotificationRead: Notification;
  matchBankStatementLineToBook: BankStatementLine;
  postCurrencyRevaluation: CurrencyRevaluation;
  postFinanceChargeAssessment: FinanceChargeAssessment;
  postFixedAssetDepreciation: FixedAsset;
  postIntercompanyAllocation: IntercompanyAllocation;
  postIntercompanyJournalEntry: IntercompanyJournalEntry;
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
  resolveTimesheetEntry: TimesheetEntry;
  reverseIntercompanyAllocation: IntercompanyAllocation;
  reverseIntercompanyJournalEntry: IntercompanyJournalEntry;
  seedIndividualPriceListFromCatalog: IndividualPriceList;
  seedSystemRoles: Array<Role>;
  /**
   * Send a notification (broadcast/maintenance/announcement/alert).
   * Super admin can target all org admins or specific users in any org.
   * Org admin can target all users in their own org or specific users in their own org.
   * Returns the number of notifications created.
   */
  sendNotification: Scalars['Int']['output'];
  sendQuotation: SendQuotationResult;
  /** Replace module-level approver assignments for an organization (org admin: own org only). */
  setOrganizationModuleApprovers: Organization;
  setQCInspectionOutcome: QcInspection;
  setUserModulePermissions: User;
  startAssetMaintenance: AssetMaintenance;
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
  submitTimesheetEntry: TimesheetEntry;
  submitVendorBillForApproval: VendorBill;
  /**
   * Sends a vendor master record for enterprise approval routing.
   * When assigneeApproverUserIds is omitted, all vendors-module approvers receive a parallel task (legacy FAB).
   * Otherwise only the selected IDs are used (must be a subset of org-configured vendors approvers).
   */
  submitVendorForApproval: Vendor;
  transferBankFunds: BankTransferResult;
  transitionDeliveryOrderStatus: DeliveryOrder;
  updateAllocationSchedule: AllocationSchedule;
  updateApplicant: Applicant;
  updateAsset: Asset;
  updateAssetMaintenance: AssetMaintenance;
  updateAttendance: Attendance;
  updateBankAccount: BankAccount;
  updateBillOfMaterials: BillOfMaterials;
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
  updateDeliveryOrder: DeliveryOrder;
  updateEPM: Epm;
  updateEmployeeMaster: EmployeeMaster;
  updateExciseInvoice: ExciseInvoice;
  updateExtraction: Extraction;
  updateFixedAsset: FixedAsset;
  updateGRN: Grn;
  updateGoodsReceipt: GoodsReceipt;
  updateHrMaster: HrMaster;
  updateIPInspection: IpInspection;
  updateIntercompanyAllocation: IntercompanyAllocation;
  updateIntercompanyJournalEntry: IntercompanyJournalEntry;
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
  updateMyDashboardPreferences: User;
  updateOpportunity: Opportunity;
  updateOrganization: Organization;
  updatePayrollManagement: PayrollManagement;
  updatePayrollUiRecord: PayrollUiRecord;
  updateProduct: Product;
  updateProductionPlanning: ProductionPlanning;
  updateProject: Project;
  updatePurchaseOrder: PurchaseOrder;
  updateQCInspection: QcInspection;
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
  updateTaxRate: TaxRate;
  updateTimesheetEntry: TimesheetEntry;
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


export type MutationArchiveNotificationArgs = {
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


export type MutationCompleteAssetMaintenanceArgs = {
  id: Scalars['ID']['input'];
  input: CompleteMaintenanceInput;
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


export type MutationCreateAssetMaintenanceArgs = {
  input: CreateAssetMaintenanceInput;
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


export type MutationCreateBillOfMaterialsArgs = {
  input: CreateBomInput;
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


export type MutationCreateDeliveryOrderArgs = {
  input: CreateDeliveryOrderInput;
};


export type MutationCreateEpmArgs = {
  input: EpmInput;
};


export type MutationCreateEmployeeMasterArgs = {
  input: CreateEmployeeMasterInput;
};


export type MutationCreateExciseInvoiceArgs = {
  input: ExciseInvoiceInput;
};


export type MutationCreateExtractionArgs = {
  input: ExtractionInput;
};


export type MutationCreateFixedAssetArgs = {
  input: CreateFixedAssetInput;
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


export type MutationCreateHrMasterArgs = {
  input: CreateHrMasterInput;
};


export type MutationCreateIpInspectionArgs = {
  input: IpInspectionInput;
};


export type MutationCreateIntercompanyAllocationArgs = {
  input: CreateIntercompanyAllocationInput;
};


export type MutationCreateIntercompanyJournalEntryArgs = {
  input: CreateIntercompanyJournalInput;
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


export type MutationCreateQcInspectionArgs = {
  input: CreateQcInspectionInput;
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


export type MutationCreateTaxRateArgs = {
  input: CreateTaxRateInput;
};


export type MutationCreateTimesheetEntryArgs = {
  input: CreateTimesheetEntryInput;
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


export type MutationDeleteAssetMaintenanceArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteAttendanceArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteBankStatementLineArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteBillOfMaterialsArgs = {
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


export type MutationDeleteDeliveryOrderArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteDocumentArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteEpmArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteEmployeeMasterArgs = {
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


export type MutationDeleteFixedAssetArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteGrnArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteGoodsReceiptArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteHrMasterArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteIpInspectionArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteIndividualPriceListArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteIntercompanyAllocationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteIntercompanyJournalEntryArgs = {
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


export type MutationDeleteQcInspectionArgs = {
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


export type MutationDeleteTaxRateArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteTimesheetEntryArgs = {
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


export type MutationDisposeFixedAssetArgs = {
  disposalDate: Scalars['String']['input'];
  id: Scalars['ID']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
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


export type MutationMarkNotificationReadArgs = {
  id: Scalars['ID']['input'];
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


export type MutationPostFixedAssetDepreciationArgs = {
  id: Scalars['ID']['input'];
  input: PostDepreciationInput;
};


export type MutationPostIntercompanyAllocationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationPostIntercompanyJournalEntryArgs = {
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


export type MutationResolveTimesheetEntryArgs = {
  decision: Scalars['String']['input'];
  id: Scalars['ID']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
};


export type MutationReverseIntercompanyAllocationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationReverseIntercompanyJournalEntryArgs = {
  id: Scalars['ID']['input'];
};


export type MutationSeedIndividualPriceListFromCatalogArgs = {
  customerId: Scalars['ID']['input'];
  organizationId: Scalars['String']['input'];
};


export type MutationSendNotificationArgs = {
  input: SendNotificationInput;
};


export type MutationSendQuotationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationSetOrganizationModuleApproversArgs = {
  assignments: Array<OrganizationModuleApproverInput>;
  organizationId: Scalars['ID']['input'];
};


export type MutationSetQcInspectionOutcomeArgs = {
  id: Scalars['ID']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  outcome: Scalars['String']['input'];
};


export type MutationSetUserModulePermissionsArgs = {
  permissions: Array<ModulePermissionInput>;
  userId: Scalars['ID']['input'];
};


export type MutationStartAssetMaintenanceArgs = {
  id: Scalars['ID']['input'];
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


export type MutationSubmitTimesheetEntryArgs = {
  id: Scalars['ID']['input'];
};


export type MutationSubmitVendorBillForApprovalArgs = {
  id: Scalars['ID']['input'];
};


export type MutationSubmitVendorForApprovalArgs = {
  assigneeApproverUserIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  id: Scalars['ID']['input'];
};


export type MutationTransferBankFundsArgs = {
  input: BankTransferInput;
};


export type MutationTransitionDeliveryOrderStatusArgs = {
  id: Scalars['ID']['input'];
  signedBy?: InputMaybe<Scalars['String']['input']>;
  status: Scalars['String']['input'];
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


export type MutationUpdateAssetMaintenanceArgs = {
  id: Scalars['ID']['input'];
  input: UpdateAssetMaintenanceInput;
};


export type MutationUpdateAttendanceArgs = {
  id: Scalars['ID']['input'];
  input: UpdateAttendanceInput;
};


export type MutationUpdateBankAccountArgs = {
  id: Scalars['ID']['input'];
  input: BankAccountInput;
};


export type MutationUpdateBillOfMaterialsArgs = {
  id: Scalars['ID']['input'];
  input: UpdateBomInput;
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


export type MutationUpdateDeliveryOrderArgs = {
  id: Scalars['ID']['input'];
  input: UpdateDeliveryOrderInput;
};


export type MutationUpdateEpmArgs = {
  id: Scalars['ID']['input'];
  input: EpmInput;
};


export type MutationUpdateEmployeeMasterArgs = {
  id: Scalars['ID']['input'];
  input: UpdateEmployeeMasterInput;
};


export type MutationUpdateExciseInvoiceArgs = {
  id: Scalars['ID']['input'];
  input: ExciseInvoiceInput;
};


export type MutationUpdateExtractionArgs = {
  id: Scalars['ID']['input'];
  input: ExtractionInput;
};


export type MutationUpdateFixedAssetArgs = {
  id: Scalars['ID']['input'];
  input: UpdateFixedAssetInput;
};


export type MutationUpdateGrnArgs = {
  id: Scalars['ID']['input'];
  input: UpdateGrnInput;
};


export type MutationUpdateGoodsReceiptArgs = {
  id: Scalars['ID']['input'];
  input: GoodsReceiptInput;
};


export type MutationUpdateHrMasterArgs = {
  id: Scalars['ID']['input'];
  input: UpdateHrMasterInput;
};


export type MutationUpdateIpInspectionArgs = {
  id: Scalars['ID']['input'];
  input: IpInspectionInput;
};


export type MutationUpdateIntercompanyAllocationArgs = {
  id: Scalars['ID']['input'];
  input: UpdateIntercompanyAllocationInput;
};


export type MutationUpdateIntercompanyJournalEntryArgs = {
  id: Scalars['ID']['input'];
  input: UpdateIntercompanyJournalInput;
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


export type MutationUpdateMyDashboardPreferencesArgs = {
  dashboard: Scalars['String']['input'];
  input: DashboardWidgetPreferencesInput;
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


export type MutationUpdateQcInspectionArgs = {
  id: Scalars['ID']['input'];
  input: UpdateQcInspectionInput;
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


export type MutationUpdateTaxRateArgs = {
  id: Scalars['ID']['input'];
  input: UpdateTaxRateInput;
};


export type MutationUpdateTimesheetEntryArgs = {
  id: Scalars['ID']['input'];
  input: UpdateTimesheetEntryInput;
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

export type Notification = {
  __typename?: 'Notification';
  actorUserId?: Maybe<Scalars['ID']['output']>;
  archivedAt?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isRead: Scalars['Boolean']['output'];
  kind: NotificationKind;
  link?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  moduleKey?: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['ID']['output'];
  readAt?: Maybe<Scalars['String']['output']>;
  recipientUserId: Scalars['ID']['output'];
  referenceId?: Maybe<Scalars['ID']['output']>;
  referenceModule?: Maybe<Scalars['String']['output']>;
  severity: NotificationSeverity;
  title: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type NotificationKind =
  | 'ALERT'
  | 'ANNOUNCEMENT'
  | 'APPROVAL_APPROVED'
  | 'APPROVAL_REJECTED'
  | 'APPROVAL_REQUEST'
  | 'BILL_DUE'
  | 'BROADCAST'
  | 'INVOICE_OVERDUE'
  | 'LOW_STOCK'
  | 'MAINTENANCE'
  | 'MENTION'
  | 'NEW_LEAD'
  | 'SYSTEM';

export type NotificationSeverity =
  | 'DANGER'
  | 'INFO'
  | 'SUCCESS'
  | 'WARNING';

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
  /** Legacy primary approver — mirrors first entry in approverUserIds when present. */
  approverUserId?: Maybe<Scalars['ID']['output']>;
  /** All users designated by org admin who may approve this module (currently used for vendors; extensible elsewhere). */
  approverUserIds: Array<Scalars['ID']['output']>;
  moduleKey: Scalars['String']['output'];
};

export type OrganizationModuleApproverInput = {
  /** Set to omit or empty to clear the approver for this module. */
  approverUserId?: InputMaybe<Scalars['ID']['input']>;
  /** Replace the full approver set for this module (non-null array, possibly empty clears all). */
  approverUserIds?: InputMaybe<Array<Scalars['ID']['input']>>;
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

export type PostDepreciationInput = {
  amount?: InputMaybe<Scalars['Float']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  periodEndDate: Scalars['String']['input'];
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

export type QcDefect = {
  __typename?: 'QCDefect';
  code: Scalars['String']['output'];
  correctiveAction?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  quantity: Scalars['Float']['output'];
  rootCause?: Maybe<Scalars['String']['output']>;
  severity: Scalars['String']['output'];
};

export type QcDefectInput = {
  code: Scalars['String']['input'];
  correctiveAction?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  quantity?: InputMaybe<Scalars['Float']['input']>;
  rootCause?: InputMaybe<Scalars['String']['input']>;
  severity?: InputMaybe<Scalars['String']['input']>;
};

export type QcInspection = {
  __typename?: 'QCInspection';
  batchNumber?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  defects: Array<QcDefect>;
  docNumber: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  inspectionDate: Scalars['String']['output'];
  inspectorName?: Maybe<Scalars['String']['output']>;
  inspectorUserId?: Maybe<Scalars['ID']['output']>;
  itemId?: Maybe<Scalars['ID']['output']>;
  itemName: Scalars['String']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['ID']['output'];
  outcome: Scalars['String']['output'];
  quantityFailed: Scalars['Float']['output'];
  quantityInspected: Scalars['Float']['output'];
  quantityPassed: Scalars['Float']['output'];
  quantityReworked: Scalars['Float']['output'];
  sourceId?: Maybe<Scalars['ID']['output']>;
  sourceModule: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type QcOutcomeSummary = {
  __typename?: 'QCOutcomeSummary';
  count: Scalars['Int']['output'];
  outcome: Scalars['String']['output'];
  quantityFailed: Scalars['Float']['output'];
  quantityInspected: Scalars['Float']['output'];
  quantityPassed: Scalars['Float']['output'];
};

export type Query = {
  __typename?: 'Query';
  _empty?: Maybe<Scalars['String']['output']>;
  allocationSchedule?: Maybe<AllocationSchedule>;
  allocationSchedules: Array<AllocationSchedule>;
  applicant?: Maybe<Applicant>;
  applicants: Array<Applicant>;
  asset?: Maybe<Asset>;
  assetMaintenance?: Maybe<AssetMaintenance>;
  assetMaintenances: Array<AssetMaintenance>;
  assets: Array<Asset>;
  attendance?: Maybe<Attendance>;
  attendances: Array<Attendance>;
  auditLogs: AuditLogPage;
  availableVendorCredits: Array<VendorCredit>;
  availableVendorPrepayments: Array<VendorPrepayment>;
  bankAccount?: Maybe<BankAccount>;
  bankAccounts: Array<BankAccount>;
  bankStatementLines: Array<BankStatementLine>;
  billOfMaterials?: Maybe<BillOfMaterials>;
  billsOfMaterials: Array<BillOfMaterials>;
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
  deliveryOrder?: Maybe<DeliveryOrder>;
  deliveryOrders: Array<DeliveryOrder>;
  deliverychallan?: Maybe<DeliveryChallan>;
  deliverychallans: Array<DeliveryChallan>;
  document?: Maybe<Document>;
  documents: Array<Document>;
  dvs?: Maybe<Dvs>;
  dvsRecords: Array<Dvs>;
  employeeMaster?: Maybe<EmployeeMaster>;
  employeeMasters: Array<EmployeeMaster>;
  epm?: Maybe<Epm>;
  epms: Array<Epm>;
  exciseinvoice?: Maybe<ExciseInvoice>;
  exciseinvoices: Array<ExciseInvoice>;
  extraction?: Maybe<Extraction>;
  extractions: Array<Extraction>;
  financeChargeAssessment?: Maybe<FinanceChargeAssessment>;
  financeChargeAssessments: Array<FinanceChargeAssessment>;
  fixedAsset?: Maybe<FixedAsset>;
  fixedAssetSummaryByCategory: Array<FixedAssetCategorySummary>;
  fixedAssets: Array<FixedAsset>;
  generalLedger?: Maybe<GeneralLedger>;
  generalLedgers: Array<GeneralLedger>;
  generateCustomerStatement: CustomerStatement;
  /** Cross-collection search inside the current organization. */
  globalSearch: Array<SearchHit>;
  goodsreceipt?: Maybe<GoodsReceipt>;
  goodsreceipts: Array<GoodsReceipt>;
  grn?: Maybe<Grn>;
  grns: Array<Grn>;
  grnsByPO: Array<Grn>;
  hrMaster?: Maybe<HrMaster>;
  hrMasters: Array<HrMaster>;
  individualPriceList?: Maybe<IndividualPriceList>;
  individualPriceListByCustomer?: Maybe<IndividualPriceList>;
  individualPriceLists: Array<IndividualPriceList>;
  intercompanyAllocation?: Maybe<IntercompanyAllocation>;
  intercompanyAllocations: Array<IntercompanyAllocation>;
  intercompanyJournalEntries: Array<IntercompanyJournalEntry>;
  intercompanyJournalEntry?: Maybe<IntercompanyJournalEntry>;
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
  /**
   * Approval requests the current user is involved in, either as requester
   * or as assigned approver. Filter by status and/or role.
   */
  myApprovalRequests: Array<ApprovalRequest>;
  /** Notifications addressed to the current user (newest first). */
  myNotifications: Array<Notification>;
  /** Approval tasks assigned to the current user (same organization). */
  myPendingApprovalRequests: Array<ApprovalRequest>;
  /** Unread count for the current user. */
  myUnreadNotificationCount: Scalars['Int']['output'];
  opportunities: Array<Opportunity>;
  opportunity?: Maybe<Opportunity>;
  organization?: Maybe<Organization>;
  organizationDocuments: Array<Document>;
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
  qcInspection?: Maybe<QcInspection>;
  qcInspections: Array<QcInspection>;
  qcOutcomeSummary: Array<QcOutcomeSummary>;
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
  taxRate?: Maybe<TaxRate>;
  taxRates: Array<TaxRate>;
  timesheetEntries: Array<TimesheetEntry>;
  timesheetEntry?: Maybe<TimesheetEntry>;
  timesheetWeeklySummary: TimesheetWeeklySummary;
  upcomingMaintenance: Array<AssetMaintenance>;
  user?: Maybe<User>;
  userByEmail?: Maybe<User>;
  usersByOrganization: UserList;
  usersByRole: Array<User>;
  vendor?: Maybe<Vendor>;
  /** Queued / historical approval-request rows for a vendor master record (same org only). */
  vendorApprovalRequests: Array<ApprovalRequest>;
  vendorBill?: Maybe<VendorBill>;
  vendorBills: Array<VendorBill>;
  vendorBillsByVendor: Array<VendorBill>;
  vendorCredit?: Maybe<VendorCredit>;
  vendorCredits: Array<VendorCredit>;
  /** Users designated as vendors approvers via org-admin Approvals routing (permission-based). */
  vendorEligibleApprovers: Array<User>;
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


export type QueryAssetMaintenanceArgs = {
  id: Scalars['ID']['input'];
};


export type QueryAssetMaintenancesArgs = {
  assetId?: InputMaybe<Scalars['ID']['input']>;
  maintenanceType?: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['ID']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
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


export type QueryAuditLogsArgs = {
  action?: InputMaybe<Scalars['String']['input']>;
  entityId?: InputMaybe<Scalars['ID']['input']>;
  entityType?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
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


export type QueryBillOfMaterialsArgs = {
  id: Scalars['ID']['input'];
};


export type QueryBillsOfMaterialsArgs = {
  organizationId: Scalars['ID']['input'];
  parentItemId?: InputMaybe<Scalars['ID']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
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


export type QueryDeliveryOrderArgs = {
  id: Scalars['ID']['input'];
};


export type QueryDeliveryOrdersArgs = {
  customerId?: InputMaybe<Scalars['ID']['input']>;
  organizationId: Scalars['ID']['input'];
  salesOrderId?: InputMaybe<Scalars['ID']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};


export type QueryDeliverychallanArgs = {
  id: Scalars['ID']['input'];
};


export type QueryDeliverychallansArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['String']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryDocumentArgs = {
  id: Scalars['ID']['input'];
};


export type QueryDocumentsArgs = {
  parentId: Scalars['ID']['input'];
  parentModule: Scalars['String']['input'];
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


export type QueryEmployeeMasterArgs = {
  id: Scalars['ID']['input'];
};


export type QueryEmployeeMastersArgs = {
  department?: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['ID']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
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


export type QueryFixedAssetArgs = {
  id: Scalars['ID']['input'];
};


export type QueryFixedAssetSummaryByCategoryArgs = {
  organizationId: Scalars['ID']['input'];
};


export type QueryFixedAssetsArgs = {
  category?: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['ID']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
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


export type QueryGlobalSearchArgs = {
  limitPerKind?: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['ID']['input'];
  query: Scalars['String']['input'];
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


export type QueryHrMasterArgs = {
  id: Scalars['ID']['input'];
};


export type QueryHrMastersArgs = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  kind: Scalars['String']['input'];
  organizationId: Scalars['ID']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
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


export type QueryIntercompanyAllocationArgs = {
  id: Scalars['ID']['input'];
};


export type QueryIntercompanyAllocationsArgs = {
  organizationId: Scalars['ID']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};


export type QueryIntercompanyJournalEntriesArgs = {
  allocationId?: InputMaybe<Scalars['ID']['input']>;
  originatingOrganizationId: Scalars['ID']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};


export type QueryIntercompanyJournalEntryArgs = {
  id: Scalars['ID']['input'];
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


export type QueryMyApprovalRequestsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  role?: InputMaybe<ApprovalRequestRole>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<ApprovalRequestStatus>;
};


export type QueryMyNotificationsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  unreadOnly?: InputMaybe<Scalars['Boolean']['input']>;
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


export type QueryOrganizationDocumentsArgs = {
  organizationId: Scalars['ID']['input'];
  parentModule?: InputMaybe<Scalars['String']['input']>;
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


export type QueryQcInspectionArgs = {
  id: Scalars['ID']['input'];
};


export type QueryQcInspectionsArgs = {
  organizationId: Scalars['ID']['input'];
  outcome?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  sourceId?: InputMaybe<Scalars['ID']['input']>;
  sourceModule?: InputMaybe<Scalars['String']['input']>;
};


export type QueryQcOutcomeSummaryArgs = {
  organizationId: Scalars['ID']['input'];
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


export type QueryTaxRateArgs = {
  id: Scalars['ID']['input'];
};


export type QueryTaxRatesArgs = {
  appliesTo?: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['ID']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};


export type QueryTimesheetEntriesArgs = {
  billable?: InputMaybe<Scalars['Boolean']['input']>;
  employeeUserId?: InputMaybe<Scalars['ID']['input']>;
  endDate?: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['ID']['input'];
  projectId?: InputMaybe<Scalars['ID']['input']>;
  startDate?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};


export type QueryTimesheetEntryArgs = {
  id: Scalars['ID']['input'];
};


export type QueryTimesheetWeeklySummaryArgs = {
  employeeUserId: Scalars['ID']['input'];
  organizationId: Scalars['ID']['input'];
  weekEnd: Scalars['String']['input'];
  weekStart: Scalars['String']['input'];
};


export type QueryUpcomingMaintenanceArgs = {
  days?: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['ID']['input'];
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


export type QueryVendorApprovalRequestsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  vendorId: Scalars['ID']['input'];
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


export type QueryVendorEligibleApproversArgs = {
  organizationId: Scalars['ID']['input'];
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

export type SearchHit = {
  __typename?: 'SearchHit';
  id: Scalars['ID']['output'];
  kind: Scalars['String']['output'];
  link: Scalars['String']['output'];
  matchedField?: Maybe<Scalars['String']['output']>;
  subtitle?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
};

/** Audience for a manual sendNotification call. Exactly one field should be set. */
export type SendNotificationAudienceInput = {
  /** Send to every active ORG_ADMIN across all organizations (super admin only). */
  allOrgAdmins?: InputMaybe<Scalars['Boolean']['input']>;
  /** Send to every active user in the given organization (org admin: own org only). */
  allUsersInOrganizationId?: InputMaybe<Scalars['ID']['input']>;
  /** Send to one or more specific user IDs. */
  userIds?: InputMaybe<Array<Scalars['ID']['input']>>;
};

export type SendNotificationInput = {
  audience: SendNotificationAudienceInput;
  kind: NotificationKind;
  link?: InputMaybe<Scalars['String']['input']>;
  message?: InputMaybe<Scalars['String']['input']>;
  severity?: InputMaybe<NotificationSeverity>;
  title: Scalars['String']['input'];
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

export type TaxRate = {
  __typename?: 'TaxRate';
  appliesTo: Scalars['String']['output'];
  code: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  effectiveFrom?: Maybe<Scalars['String']['output']>;
  effectiveTo?: Maybe<Scalars['String']['output']>;
  hsnSacCode?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isCompound: Scalars['Boolean']['output'];
  isInclusive: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  organizationId: Scalars['ID']['output'];
  ratePercent: Scalars['Float']['output'];
  status: Scalars['String']['output'];
  taxType: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type TimesheetEntry = {
  __typename?: 'TimesheetEntry';
  approvedAt?: Maybe<Scalars['String']['output']>;
  approvedByUserId?: Maybe<Scalars['ID']['output']>;
  billRate: Scalars['Float']['output'];
  billable: Scalars['Boolean']['output'];
  costRate: Scalars['Float']['output'];
  createdAt: Scalars['String']['output'];
  employeeUserId: Scalars['ID']['output'];
  entryDate: Scalars['String']['output'];
  hours: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['ID']['output'];
  projectId?: Maybe<Scalars['ID']['output']>;
  rejectionReason?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  submittedAt?: Maybe<Scalars['String']['output']>;
  taskName?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['String']['output'];
  workOrderId?: Maybe<Scalars['ID']['output']>;
};

export type TimesheetWeeklySummary = {
  __typename?: 'TimesheetWeeklySummary';
  approvedHours: Scalars['Float']['output'];
  billableHours: Scalars['Float']['output'];
  draft: Scalars['Float']['output'];
  pending: Scalars['Float']['output'];
  totalHours: Scalars['Float']['output'];
};

export type UpdateAssetMaintenanceInput = {
  actionsTaken?: InputMaybe<Scalars['String']['input']>;
  assetId?: InputMaybe<Scalars['ID']['input']>;
  assignedToName?: InputMaybe<Scalars['String']['input']>;
  assignedToUserId?: InputMaybe<Scalars['ID']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  docNumber?: InputMaybe<Scalars['String']['input']>;
  findings?: InputMaybe<Scalars['String']['input']>;
  intervalDays?: InputMaybe<Scalars['Int']['input']>;
  laborHours?: InputMaybe<Scalars['Float']['input']>;
  laborRate?: InputMaybe<Scalars['Float']['input']>;
  maintenanceType?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  partsUsed?: InputMaybe<Array<MaintenancePartInput>>;
  priority?: InputMaybe<Scalars['String']['input']>;
  scheduledDate?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  vendorId?: InputMaybe<Scalars['ID']['input']>;
};

export type UpdateAttendanceInput = {
  checkIn?: InputMaybe<Scalars['String']['input']>;
  checkOut?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateBomInput = {
  bomCode?: InputMaybe<Scalars['String']['input']>;
  components?: InputMaybe<Array<BomComponentInput>>;
  description?: InputMaybe<Scalars['String']['input']>;
  laborCost?: InputMaybe<Scalars['Float']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  overheadCost?: InputMaybe<Scalars['Float']['input']>;
  parentItemId?: InputMaybe<Scalars['ID']['input']>;
  parentItemName?: InputMaybe<Scalars['String']['input']>;
  quantityProduced?: InputMaybe<Scalars['Float']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  unit?: InputMaybe<Scalars['String']['input']>;
  version?: InputMaybe<Scalars['String']['input']>;
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

export type UpdateDeliveryOrderInput = {
  carrier?: InputMaybe<Scalars['String']['input']>;
  customerId?: InputMaybe<Scalars['ID']['input']>;
  customerName?: InputMaybe<Scalars['String']['input']>;
  deliveryDate?: InputMaybe<Scalars['String']['input']>;
  docNumber?: InputMaybe<Scalars['String']['input']>;
  driverName?: InputMaybe<Scalars['String']['input']>;
  driverPhone?: InputMaybe<Scalars['String']['input']>;
  expectedArrival?: InputMaybe<Scalars['String']['input']>;
  items?: InputMaybe<Array<DeliveryItemInput>>;
  notes?: InputMaybe<Scalars['String']['input']>;
  salesOrderId?: InputMaybe<Scalars['ID']['input']>;
  shippingAddress?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  trackingNumber?: InputMaybe<Scalars['String']['input']>;
  vehicleNumber?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateEmployeeMasterInput = {
  aadhaarNumber?: InputMaybe<Scalars['String']['input']>;
  address?: InputMaybe<Scalars['String']['input']>;
  alternatePhone?: InputMaybe<Scalars['String']['input']>;
  bankDetails?: InputMaybe<EmployeeBankInput>;
  basicSalary?: InputMaybe<Scalars['Float']['input']>;
  bloodGroup?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  dateOfBirth?: InputMaybe<Scalars['String']['input']>;
  dateOfConfirmation?: InputMaybe<Scalars['String']['input']>;
  dateOfJoining?: InputMaybe<Scalars['String']['input']>;
  dateOfRelieving?: InputMaybe<Scalars['String']['input']>;
  department?: InputMaybe<Scalars['String']['input']>;
  designation?: InputMaybe<Scalars['String']['input']>;
  emergencyContact?: InputMaybe<EmployeeEmergencyContactInput>;
  employeeCode?: InputMaybe<Scalars['String']['input']>;
  employmentType?: InputMaybe<Scalars['String']['input']>;
  esiNumber?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  gender?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  maritalStatus?: InputMaybe<Scalars['String']['input']>;
  nationality?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  panNumber?: InputMaybe<Scalars['String']['input']>;
  personalEmail?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  pincode?: InputMaybe<Scalars['String']['input']>;
  reportsToUserId?: InputMaybe<Scalars['ID']['input']>;
  shiftMasterId?: InputMaybe<Scalars['ID']['input']>;
  state?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  uanNumber?: InputMaybe<Scalars['String']['input']>;
  workEmail?: InputMaybe<Scalars['String']['input']>;
  workLocation?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateFixedAssetInput = {
  acquisitionCost?: InputMaybe<Scalars['Float']['input']>;
  assetCode?: InputMaybe<Scalars['String']['input']>;
  assignedToUserId?: InputMaybe<Scalars['ID']['input']>;
  barcode?: InputMaybe<Scalars['String']['input']>;
  category?: InputMaybe<Scalars['String']['input']>;
  commissionedDate?: InputMaybe<Scalars['String']['input']>;
  depreciationMethod?: InputMaybe<Scalars['String']['input']>;
  depreciationRatePercent?: InputMaybe<Scalars['Float']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  purchaseDate?: InputMaybe<Scalars['String']['input']>;
  salvageValue?: InputMaybe<Scalars['Float']['input']>;
  serialNumber?: InputMaybe<Scalars['String']['input']>;
  siteLocationId?: InputMaybe<Scalars['ID']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  usefulLifeMonths?: InputMaybe<Scalars['Int']['input']>;
  vendorId?: InputMaybe<Scalars['ID']['input']>;
  warrantyExpiryDate?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateGrnInput = {
  notes?: InputMaybe<Scalars['String']['input']>;
  receivedDate?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateHrMasterInput = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  code?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  metadataJson?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  sortOrder?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateIntercompanyAllocationInput = {
  allocationMethod?: InputMaybe<Scalars['String']['input']>;
  basisAmount?: InputMaybe<Scalars['Float']['input']>;
  basisDate?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  lines?: InputMaybe<Array<AllocationLineInput>>;
  name?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  scheduleCode?: InputMaybe<Scalars['String']['input']>;
  sourceAccount?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateIntercompanyJournalInput = {
  allocationId?: InputMaybe<Scalars['ID']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  docNumber?: InputMaybe<Scalars['String']['input']>;
  entryDate?: InputMaybe<Scalars['String']['input']>;
  lines?: InputMaybe<Array<IntercompanyJournalLineInput>>;
  notes?: InputMaybe<Scalars['String']['input']>;
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

export type UpdateQcInspectionInput = {
  batchNumber?: InputMaybe<Scalars['String']['input']>;
  defects?: InputMaybe<Array<QcDefectInput>>;
  docNumber?: InputMaybe<Scalars['String']['input']>;
  inspectionDate?: InputMaybe<Scalars['String']['input']>;
  inspectorName?: InputMaybe<Scalars['String']['input']>;
  inspectorUserId?: InputMaybe<Scalars['ID']['input']>;
  itemId?: InputMaybe<Scalars['ID']['input']>;
  itemName?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  outcome?: InputMaybe<Scalars['String']['input']>;
  quantityFailed?: InputMaybe<Scalars['Float']['input']>;
  quantityInspected?: InputMaybe<Scalars['Float']['input']>;
  quantityPassed?: InputMaybe<Scalars['Float']['input']>;
  quantityReworked?: InputMaybe<Scalars['Float']['input']>;
  sourceId?: InputMaybe<Scalars['ID']['input']>;
  sourceModule?: InputMaybe<Scalars['String']['input']>;
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

export type UpdateTaxRateInput = {
  appliesTo?: InputMaybe<Scalars['String']['input']>;
  code?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  effectiveFrom?: InputMaybe<Scalars['String']['input']>;
  effectiveTo?: InputMaybe<Scalars['String']['input']>;
  hsnSacCode?: InputMaybe<Scalars['String']['input']>;
  isCompound?: InputMaybe<Scalars['Boolean']['input']>;
  isInclusive?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  ratePercent?: InputMaybe<Scalars['Float']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  taxType?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateTimesheetEntryInput = {
  billRate?: InputMaybe<Scalars['Float']['input']>;
  billable?: InputMaybe<Scalars['Boolean']['input']>;
  costRate?: InputMaybe<Scalars['Float']['input']>;
  entryDate?: InputMaybe<Scalars['String']['input']>;
  hours?: InputMaybe<Scalars['Float']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  projectId?: InputMaybe<Scalars['ID']['input']>;
  taskName?: InputMaybe<Scalars['String']['input']>;
  workOrderId?: InputMaybe<Scalars['ID']['input']>;
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
  dashboardPreferences?: Maybe<DashboardPreferences>;
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
  createdBy?: Maybe<User>;
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

export type GetLeaveTypesQueryVariables = Exact<{
  organizationId: Scalars['ID']['input'];
  activeOnly?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type GetLeaveTypesQuery = { __typename?: 'Query', leaveTypes: Array<{ __typename?: 'LeaveType', id: string, code: string, name: string, paid: boolean, defaultDaysPerYear: number, allowCarryForward: boolean, maxCarryForwardDays?: number | null, organizationId: string, active: boolean, createdAt: string, updatedAt: string }> };

export type CreateLeaveTypeMutationVariables = Exact<{
  input: CreateLeaveTypeInput;
}>;


export type CreateLeaveTypeMutation = { __typename?: 'Mutation', createLeaveType: { __typename?: 'LeaveType', id: string, code: string, name: string } };

export type UpdateLeaveTypeMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateLeaveTypeInput;
}>;


export type UpdateLeaveTypeMutation = { __typename?: 'Mutation', updateLeaveType: { __typename?: 'LeaveType', id: string, code: string, name: string, active: boolean } };

export type DeleteLeaveTypeMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteLeaveTypeMutation = { __typename?: 'Mutation', deleteLeaveType: { __typename?: 'LeaveType', id: string } };

export type GetLeaveEnrollmentsQueryVariables = Exact<{
  organizationId: Scalars['ID']['input'];
  userId?: InputMaybe<Scalars['ID']['input']>;
  calendarYear?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetLeaveEnrollmentsQuery = { __typename?: 'Query', leaveEnrollments: Array<{ __typename?: 'LeaveEnrollment', id: string, userId: string, leaveTypeId: string, calendarYear: number, entitledDays: number, usedDays: number, carriedForward: number, organizationId: string, notes?: string | null, createdAt: string, updatedAt: string }> };

export type CreateLeaveEnrollmentMutationVariables = Exact<{
  input: CreateLeaveEnrollmentInput;
}>;


export type CreateLeaveEnrollmentMutation = { __typename?: 'Mutation', createLeaveEnrollment: { __typename?: 'LeaveEnrollment', id: string, userId: string, leaveTypeId: string, calendarYear: number, entitledDays: number, usedDays: number } };

export type UpdateLeaveEnrollmentMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateLeaveEnrollmentInput;
}>;


export type UpdateLeaveEnrollmentMutation = { __typename?: 'Mutation', updateLeaveEnrollment: { __typename?: 'LeaveEnrollment', id: string, entitledDays: number, usedDays: number, carriedForward: number } };

export type DeleteLeaveEnrollmentMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteLeaveEnrollmentMutation = { __typename?: 'Mutation', deleteLeaveEnrollment: { __typename?: 'LeaveEnrollment', id: string } };

export type GetLeaveApplicationsQueryVariables = Exact<{
  organizationId: Scalars['ID']['input'];
  userId?: InputMaybe<Scalars['ID']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetLeaveApplicationsQuery = { __typename?: 'Query', leaveApplications: Array<{ __typename?: 'LeaveApplication', id: string, userId: string, leaveTypeId: string, startDate: string, endDate: string, totalDays: number, reason?: string | null, status: string, approvedBy?: string | null, approvedAt?: string | null, rejectedReason?: string | null, organizationId: string, createdAt: string, updatedAt: string }> };

export type CreateLeaveApplicationMutationVariables = Exact<{
  input: CreateLeaveApplicationInput;
}>;


export type CreateLeaveApplicationMutation = { __typename?: 'Mutation', createLeaveApplication: { __typename?: 'LeaveApplication', id: string, status: string, totalDays: number, startDate: string, endDate: string } };

export type UpdateLeaveApplicationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateLeaveApplicationInput;
}>;


export type UpdateLeaveApplicationMutation = { __typename?: 'Mutation', updateLeaveApplication: { __typename?: 'LeaveApplication', id: string, status: string } };

export type ApproveLeaveApplicationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type ApproveLeaveApplicationMutation = { __typename?: 'Mutation', approveLeaveApplication: { __typename?: 'LeaveApplication', id: string, status: string, approvedAt?: string | null } };

export type RejectLeaveApplicationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  reason: Scalars['String']['input'];
}>;


export type RejectLeaveApplicationMutation = { __typename?: 'Mutation', rejectLeaveApplication: { __typename?: 'LeaveApplication', id: string, status: string, rejectedReason?: string | null } };

export type DeleteLeaveApplicationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteLeaveApplicationMutation = { __typename?: 'Mutation', deleteLeaveApplication: { __typename?: 'LeaveApplication', id: string } };

export type GetLeaveReinstatementsQueryVariables = Exact<{
  organizationId: Scalars['ID']['input'];
  userId?: InputMaybe<Scalars['ID']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetLeaveReinstatementsQuery = { __typename?: 'Query', leaveReinstatements: Array<{ __typename?: 'LeaveReinstatement', id: string, userId: string, leaveTypeId: string, calendarYear: number, daysRestored: number, reason: string, leaveApplicationId?: string | null, status: string, reviewedBy?: string | null, reviewedAt?: string | null, reviewNotes?: string | null, organizationId: string, createdAt: string, updatedAt: string }> };

export type CreateLeaveReinstatementMutationVariables = Exact<{
  input: CreateLeaveReinstatementInput;
}>;


export type CreateLeaveReinstatementMutation = { __typename?: 'Mutation', createLeaveReinstatement: { __typename?: 'LeaveReinstatement', id: string, status: string, daysRestored: number } };

export type ApproveLeaveReinstatementMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type ApproveLeaveReinstatementMutation = { __typename?: 'Mutation', approveLeaveReinstatement: { __typename?: 'LeaveReinstatement', id: string, status: string, reviewedAt?: string | null } };

export type RejectLeaveReinstatementMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  reviewNotes?: InputMaybe<Scalars['String']['input']>;
}>;


export type RejectLeaveReinstatementMutation = { __typename?: 'Mutation', rejectLeaveReinstatement: { __typename?: 'LeaveReinstatement', id: string, status: string } };

export type DeleteLeaveReinstatementMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteLeaveReinstatementMutation = { __typename?: 'Mutation', deleteLeaveReinstatement: { __typename?: 'LeaveReinstatement', id: string } };

export type MyNotificationsQueryVariables = Exact<{
  unreadOnly?: InputMaybe<Scalars['Boolean']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
}>;


export type MyNotificationsQuery = { __typename?: 'Query', myNotifications: Array<{ __typename?: 'Notification', id: string, organizationId: string, recipientUserId: string, actorUserId?: string | null, kind: NotificationKind, severity: NotificationSeverity, title: string, message?: string | null, link?: string | null, referenceModule?: string | null, referenceId?: string | null, moduleKey?: string | null, isRead: boolean, readAt?: string | null, archivedAt?: string | null, createdAt: string }> };

export type MyUnreadNotificationCountQueryVariables = Exact<{ [key: string]: never; }>;


export type MyUnreadNotificationCountQuery = { __typename?: 'Query', myUnreadNotificationCount: number };

export type MarkNotificationReadMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type MarkNotificationReadMutation = { __typename?: 'Mutation', markNotificationRead: { __typename?: 'Notification', id: string, isRead: boolean, readAt?: string | null } };

export type MarkAllNotificationsReadMutationVariables = Exact<{ [key: string]: never; }>;


export type MarkAllNotificationsReadMutation = { __typename?: 'Mutation', markAllNotificationsRead: number };

export type ArchiveNotificationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type ArchiveNotificationMutation = { __typename?: 'Mutation', archiveNotification: { __typename?: 'Notification', id: string, archivedAt?: string | null } };

export type ArchiveAllNotificationsMutationVariables = Exact<{ [key: string]: never; }>;


export type ArchiveAllNotificationsMutation = { __typename?: 'Mutation', archiveAllNotifications: number };

export type GetTaxRatesQueryVariables = Exact<{
  organizationId: Scalars['ID']['input'];
  status?: InputMaybe<Scalars['String']['input']>;
  appliesTo?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetTaxRatesQuery = { __typename?: 'Query', taxRates: Array<{ __typename?: 'TaxRate', id: string, name: string, code: string, ratePercent: number, taxType: string, appliesTo: string, hsnSacCode?: string | null, description?: string | null, isCompound: boolean, isInclusive: boolean, status: string, effectiveFrom?: string | null, effectiveTo?: string | null, createdAt: string }> };

export type CreateTaxRateMutationVariables = Exact<{
  input: CreateTaxRateInput;
}>;


export type CreateTaxRateMutation = { __typename?: 'Mutation', createTaxRate: { __typename?: 'TaxRate', id: string, name: string, code: string, ratePercent: number } };

export type UpdateTaxRateMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateTaxRateInput;
}>;


export type UpdateTaxRateMutation = { __typename?: 'Mutation', updateTaxRate: { __typename?: 'TaxRate', id: string, name: string, ratePercent: number, status: string } };

export type DeleteTaxRateMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteTaxRateMutation = { __typename?: 'Mutation', deleteTaxRate: { __typename?: 'TaxRate', id: string } };

export type GetFixedAssetsQueryVariables = Exact<{
  organizationId: Scalars['ID']['input'];
  status?: InputMaybe<Scalars['String']['input']>;
  category?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetFixedAssetsQuery = { __typename?: 'Query', fixedAssets: Array<{ __typename?: 'FixedAsset', id: string, assetCode: string, name: string, category: string, status: string, purchaseDate: string, acquisitionCost: number, accumulatedDepreciation: number, bookValue: number, usefulLifeMonths: number, depreciationMethod: string, depreciationRatePercent?: number | null, serialNumber?: string | null, barcode?: string | null, assignedToUserId?: string | null, siteLocationId?: string | null, vendorId?: string | null, warrantyExpiryDate?: string | null, createdAt: string }> };

export type GetFixedAssetQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetFixedAssetQuery = { __typename?: 'Query', fixedAsset?: { __typename?: 'FixedAsset', id: string, organizationId: string, assetCode: string, name: string, description?: string | null, category: string, status: string, assignedToUserId?: string | null, siteLocationId?: string | null, vendorId?: string | null, purchaseDate: string, commissionedDate?: string | null, disposalDate?: string | null, acquisitionCost: number, salvageValue: number, usefulLifeMonths: number, depreciationMethod: string, depreciationRatePercent?: number | null, accumulatedDepreciation: number, bookValue: number, serialNumber?: string | null, barcode?: string | null, warrantyExpiryDate?: string | null, notes?: string | null, createdAt: string, updatedAt: string, depreciationHistory: Array<{ __typename?: 'DepreciationEntry', periodEndDate: string, amount: number, accumulatedDepreciation: number, bookValue: number, method: string, notes?: string | null, postedAt: string }> } | null };

export type GetFixedAssetSummaryQueryVariables = Exact<{
  organizationId: Scalars['ID']['input'];
}>;


export type GetFixedAssetSummaryQuery = { __typename?: 'Query', fixedAssetSummaryByCategory: Array<{ __typename?: 'FixedAssetCategorySummary', category: string, count: number, acquisitionCost: number, accumulatedDepreciation: number, bookValue: number }> };

export type CreateFixedAssetMutationVariables = Exact<{
  input: CreateFixedAssetInput;
}>;


export type CreateFixedAssetMutation = { __typename?: 'Mutation', createFixedAsset: { __typename?: 'FixedAsset', id: string, assetCode: string, name: string } };

export type UpdateFixedAssetMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateFixedAssetInput;
}>;


export type UpdateFixedAssetMutation = { __typename?: 'Mutation', updateFixedAsset: { __typename?: 'FixedAsset', id: string, name: string, status: string } };

export type DeleteFixedAssetMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteFixedAssetMutation = { __typename?: 'Mutation', deleteFixedAsset: { __typename?: 'FixedAsset', id: string } };

export type PostFixedAssetDepreciationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: PostDepreciationInput;
}>;


export type PostFixedAssetDepreciationMutation = { __typename?: 'Mutation', postFixedAssetDepreciation: { __typename?: 'FixedAsset', id: string, accumulatedDepreciation: number, bookValue: number } };

export type DisposeFixedAssetMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  disposalDate: Scalars['String']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
}>;


export type DisposeFixedAssetMutation = { __typename?: 'Mutation', disposeFixedAsset: { __typename?: 'FixedAsset', id: string, status: string, disposalDate?: string | null } };

export type GlobalSearchQueryVariables = Exact<{
  organizationId: Scalars['ID']['input'];
  query: Scalars['String']['input'];
  limitPerKind?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GlobalSearchQuery = { __typename?: 'Query', globalSearch: Array<{ __typename?: 'SearchHit', id: string, kind: string, title: string, subtitle?: string | null, link: string, matchedField?: string | null }> };

export type GetHrMastersQueryVariables = Exact<{
  organizationId: Scalars['ID']['input'];
  kind: Scalars['String']['input'];
  active?: InputMaybe<Scalars['Boolean']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetHrMastersQuery = { __typename?: 'Query', hrMasters: Array<{ __typename?: 'HrMaster', id: string, code: string, name: string, description?: string | null, metadataJson?: string | null, active: boolean, sortOrder: number, createdAt: string }> };

export type CreateHrMasterMutationVariables = Exact<{
  input: CreateHrMasterInput;
}>;


export type CreateHrMasterMutation = { __typename?: 'Mutation', createHrMaster: { __typename?: 'HrMaster', id: string, code: string, name: string } };

export type UpdateHrMasterMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateHrMasterInput;
}>;


export type UpdateHrMasterMutation = { __typename?: 'Mutation', updateHrMaster: { __typename?: 'HrMaster', id: string, code: string, name: string, active: boolean } };

export type DeleteHrMasterMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteHrMasterMutation = { __typename?: 'Mutation', deleteHrMaster: { __typename?: 'HrMaster', id: string } };

export type GetEmployeeMastersQueryVariables = Exact<{
  organizationId: Scalars['ID']['input'];
  status?: InputMaybe<Scalars['String']['input']>;
  department?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetEmployeeMastersQuery = { __typename?: 'Query', employeeMasters: Array<{ __typename?: 'EmployeeMaster', id: string, employeeCode: string, firstName: string, lastName: string, designation?: string | null, department?: string | null, workEmail?: string | null, phone?: string | null, dateOfJoining: string, employmentType?: string | null, basicSalary: number, status: string, createdAt: string }> };

export type GetEmployeeMasterQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetEmployeeMasterQuery = { __typename?: 'Query', employeeMaster?: { __typename?: 'EmployeeMaster', id: string, employeeCode: string, firstName: string, lastName: string, dateOfBirth?: string | null, gender?: string | null, bloodGroup?: string | null, nationality?: string | null, maritalStatus?: string | null, personalEmail?: string | null, workEmail?: string | null, phone?: string | null, alternatePhone?: string | null, address?: string | null, city?: string | null, state?: string | null, country?: string | null, pincode?: string | null, designation?: string | null, department?: string | null, reportsToUserId?: string | null, dateOfJoining: string, dateOfConfirmation?: string | null, dateOfRelieving?: string | null, employmentType?: string | null, workLocation?: string | null, basicSalary: number, currency: string, panNumber?: string | null, aadhaarNumber?: string | null, uanNumber?: string | null, esiNumber?: string | null, status: string, notes?: string | null, createdAt: string, updatedAt: string, bankDetails?: { __typename?: 'EmployeeBank', bankName?: string | null, accountNumber?: string | null, ifscCode?: string | null, branchName?: string | null } | null, emergencyContact?: { __typename?: 'EmployeeEmergencyContact', name?: string | null, relation?: string | null, phone?: string | null } | null } | null };

export type CreateEmployeeMasterMutationVariables = Exact<{
  input: CreateEmployeeMasterInput;
}>;


export type CreateEmployeeMasterMutation = { __typename?: 'Mutation', createEmployeeMaster: { __typename?: 'EmployeeMaster', id: string, employeeCode: string, firstName: string, lastName: string } };

export type UpdateEmployeeMasterMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateEmployeeMasterInput;
}>;


export type UpdateEmployeeMasterMutation = { __typename?: 'Mutation', updateEmployeeMaster: { __typename?: 'EmployeeMaster', id: string, status: string } };

export type DeleteEmployeeMasterMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteEmployeeMasterMutation = { __typename?: 'Mutation', deleteEmployeeMaster: { __typename?: 'EmployeeMaster', id: string } };

export type GetDeliveryOrdersQueryVariables = Exact<{
  organizationId: Scalars['ID']['input'];
  status?: InputMaybe<Scalars['String']['input']>;
  customerId?: InputMaybe<Scalars['ID']['input']>;
  salesOrderId?: InputMaybe<Scalars['ID']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetDeliveryOrdersQuery = { __typename?: 'Query', deliveryOrders: Array<{ __typename?: 'DeliveryOrder', id: string, docNumber: string, customerName?: string | null, deliveryDate: string, carrier?: string | null, trackingNumber?: string | null, totalQuantity: number, status: string, createdAt: string }> };

export type CreateDeliveryOrderMutationVariables = Exact<{
  input: CreateDeliveryOrderInput;
}>;


export type CreateDeliveryOrderMutation = { __typename?: 'Mutation', createDeliveryOrder: { __typename?: 'DeliveryOrder', id: string, docNumber: string } };

export type UpdateDeliveryOrderMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateDeliveryOrderInput;
}>;


export type UpdateDeliveryOrderMutation = { __typename?: 'Mutation', updateDeliveryOrder: { __typename?: 'DeliveryOrder', id: string, status: string } };

export type DeleteDeliveryOrderMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteDeliveryOrderMutation = { __typename?: 'Mutation', deleteDeliveryOrder: { __typename?: 'DeliveryOrder', id: string } };

export type TransitionDeliveryOrderStatusMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  status: Scalars['String']['input'];
  signedBy?: InputMaybe<Scalars['String']['input']>;
}>;


export type TransitionDeliveryOrderStatusMutation = { __typename?: 'Mutation', transitionDeliveryOrderStatus: { __typename?: 'DeliveryOrder', id: string, status: string } };

export type GetIntercompanyAllocationsQueryVariables = Exact<{
  organizationId: Scalars['ID']['input'];
  status?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetIntercompanyAllocationsQuery = { __typename?: 'Query', intercompanyAllocations: Array<{ __typename?: 'IntercompanyAllocation', id: string, scheduleCode: string, name: string, sourceAccount: string, basisAmount: number, basisDate: string, allocationMethod: string, totalAllocated: number, status: string, createdAt: string, lines: Array<{ __typename?: 'AllocationLine', targetOrganizationId: string, targetOrganizationName?: string | null, percentage: number, amount: number }> }> };

export type CreateIntercompanyAllocationMutationVariables = Exact<{
  input: CreateIntercompanyAllocationInput;
}>;


export type CreateIntercompanyAllocationMutation = { __typename?: 'Mutation', createIntercompanyAllocation: { __typename?: 'IntercompanyAllocation', id: string, scheduleCode: string } };

export type UpdateIntercompanyAllocationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateIntercompanyAllocationInput;
}>;


export type UpdateIntercompanyAllocationMutation = { __typename?: 'Mutation', updateIntercompanyAllocation: { __typename?: 'IntercompanyAllocation', id: string, status: string } };

export type DeleteIntercompanyAllocationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteIntercompanyAllocationMutation = { __typename?: 'Mutation', deleteIntercompanyAllocation: { __typename?: 'IntercompanyAllocation', id: string } };

export type PostIntercompanyAllocationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type PostIntercompanyAllocationMutation = { __typename?: 'Mutation', postIntercompanyAllocation: { __typename?: 'IntercompanyAllocation', id: string, status: string, postedAt?: string | null } };

export type GetIntercompanyJournalsQueryVariables = Exact<{
  originatingOrganizationId: Scalars['ID']['input'];
  status?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetIntercompanyJournalsQuery = { __typename?: 'Query', intercompanyJournalEntries: Array<{ __typename?: 'IntercompanyJournalEntry', id: string, docNumber: string, entryDate: string, description?: string | null, totalDebit: number, totalCredit: number, status: string, postedAt?: string | null, createdAt: string, lines: Array<{ __typename?: 'IntercompanyJournalLine', organizationId: string, account: string, debit: number, credit: number }> }> };

export type CreateIntercompanyJournalMutationVariables = Exact<{
  input: CreateIntercompanyJournalInput;
}>;


export type CreateIntercompanyJournalMutation = { __typename?: 'Mutation', createIntercompanyJournalEntry: { __typename?: 'IntercompanyJournalEntry', id: string, docNumber: string } };

export type PostIntercompanyJournalMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type PostIntercompanyJournalMutation = { __typename?: 'Mutation', postIntercompanyJournalEntry: { __typename?: 'IntercompanyJournalEntry', id: string, status: string, postedAt?: string | null } };

export type ReverseIntercompanyJournalMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type ReverseIntercompanyJournalMutation = { __typename?: 'Mutation', reverseIntercompanyJournalEntry: { __typename?: 'IntercompanyJournalEntry', id: string, status: string } };

export type GetQcInspectionsQueryVariables = Exact<{
  organizationId: Scalars['ID']['input'];
  outcome?: InputMaybe<Scalars['String']['input']>;
  sourceModule?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetQcInspectionsQuery = { __typename?: 'Query', qcInspections: Array<{ __typename?: 'QCInspection', id: string, docNumber: string, inspectionDate: string, sourceModule: string, itemName: string, batchNumber?: string | null, quantityInspected: number, quantityPassed: number, quantityFailed: number, outcome: string, createdAt: string, defects: Array<{ __typename?: 'QCDefect', code: string, severity: string, quantity: number }> }> };

export type GetQcOutcomeSummaryQueryVariables = Exact<{
  organizationId: Scalars['ID']['input'];
}>;


export type GetQcOutcomeSummaryQuery = { __typename?: 'Query', qcOutcomeSummary: Array<{ __typename?: 'QCOutcomeSummary', outcome: string, count: number, quantityInspected: number, quantityPassed: number, quantityFailed: number }> };

export type CreateQcInspectionMutationVariables = Exact<{
  input: CreateQcInspectionInput;
}>;


export type CreateQcInspectionMutation = { __typename?: 'Mutation', createQCInspection: { __typename?: 'QCInspection', id: string, docNumber: string, outcome: string } };

export type SetQcInspectionOutcomeMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  outcome: Scalars['String']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
}>;


export type SetQcInspectionOutcomeMutation = { __typename?: 'Mutation', setQCInspectionOutcome: { __typename?: 'QCInspection', id: string, outcome: string } };

export type DeleteQcInspectionMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteQcInspectionMutation = { __typename?: 'Mutation', deleteQCInspection: { __typename?: 'QCInspection', id: string } };

export type GetAssetMaintenancesQueryVariables = Exact<{
  organizationId: Scalars['ID']['input'];
  status?: InputMaybe<Scalars['String']['input']>;
  assetId?: InputMaybe<Scalars['ID']['input']>;
  maintenanceType?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetAssetMaintenancesQuery = { __typename?: 'Query', assetMaintenances: Array<{ __typename?: 'AssetMaintenance', id: string, docNumber: string, assetId: string, assetName?: string | null, maintenanceType: string, priority: string, scheduledDate: string, completedAt?: string | null, description: string, partsCost: number, laborCost: number, totalCost: number, status: string, createdAt: string }> };

export type GetUpcomingMaintenanceQueryVariables = Exact<{
  organizationId: Scalars['ID']['input'];
  days?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetUpcomingMaintenanceQuery = { __typename?: 'Query', upcomingMaintenance: Array<{ __typename?: 'AssetMaintenance', id: string, docNumber: string, assetName?: string | null, maintenanceType: string, priority: string, scheduledDate: string, status: string }> };

export type CreateAssetMaintenanceMutationVariables = Exact<{
  input: CreateAssetMaintenanceInput;
}>;


export type CreateAssetMaintenanceMutation = { __typename?: 'Mutation', createAssetMaintenance: { __typename?: 'AssetMaintenance', id: string, docNumber: string } };

export type UpdateAssetMaintenanceMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateAssetMaintenanceInput;
}>;


export type UpdateAssetMaintenanceMutation = { __typename?: 'Mutation', updateAssetMaintenance: { __typename?: 'AssetMaintenance', id: string, status: string } };

export type DeleteAssetMaintenanceMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteAssetMaintenanceMutation = { __typename?: 'Mutation', deleteAssetMaintenance: { __typename?: 'AssetMaintenance', id: string } };

export type StartAssetMaintenanceMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type StartAssetMaintenanceMutation = { __typename?: 'Mutation', startAssetMaintenance: { __typename?: 'AssetMaintenance', id: string, status: string, startedAt?: string | null } };

export type CompleteAssetMaintenanceMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: CompleteMaintenanceInput;
}>;


export type CompleteAssetMaintenanceMutation = { __typename?: 'Mutation', completeAssetMaintenance: { __typename?: 'AssetMaintenance', id: string, status: string, completedAt?: string | null } };

export type GetDocumentsQueryVariables = Exact<{
  parentModule: Scalars['String']['input'];
  parentId: Scalars['ID']['input'];
}>;


export type GetDocumentsQuery = { __typename?: 'Query', documents: Array<{ __typename?: 'Document', id: string, filename: string, mimeType?: string | null, sizeBytes: number, category?: string | null, description?: string | null, downloadUrl: string, uploadedByUserId?: string | null, createdAt: string }> };

export type GetOrgDocumentsQueryVariables = Exact<{
  organizationId: Scalars['ID']['input'];
  parentModule?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetOrgDocumentsQuery = { __typename?: 'Query', organizationDocuments: Array<{ __typename?: 'Document', id: string, filename: string, mimeType?: string | null, sizeBytes: number, parentModule: string, parentId: string, category?: string | null, downloadUrl: string, createdAt: string }> };

export type DeleteDocumentMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteDocumentMutation = { __typename?: 'Mutation', deleteDocument: { __typename?: 'Document', id: string } };

export type GetTimesheetsQueryVariables = Exact<{
  organizationId: Scalars['ID']['input'];
  employeeUserId?: InputMaybe<Scalars['ID']['input']>;
  projectId?: InputMaybe<Scalars['ID']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['String']['input']>;
  billable?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type GetTimesheetsQuery = { __typename?: 'Query', timesheetEntries: Array<{ __typename?: 'TimesheetEntry', id: string, employeeUserId: string, projectId?: string | null, workOrderId?: string | null, taskName?: string | null, entryDate: string, hours: number, billable: boolean, billRate: number, costRate: number, notes?: string | null, status: string, submittedAt?: string | null, approvedAt?: string | null, approvedByUserId?: string | null, rejectionReason?: string | null, createdAt: string }> };

export type GetTimesheetWeeklySummaryQueryVariables = Exact<{
  organizationId: Scalars['ID']['input'];
  employeeUserId: Scalars['ID']['input'];
  weekStart: Scalars['String']['input'];
  weekEnd: Scalars['String']['input'];
}>;


export type GetTimesheetWeeklySummaryQuery = { __typename?: 'Query', timesheetWeeklySummary: { __typename?: 'TimesheetWeeklySummary', totalHours: number, billableHours: number, approvedHours: number, pending: number, draft: number } };

export type CreateTimesheetEntryMutationVariables = Exact<{
  input: CreateTimesheetEntryInput;
}>;


export type CreateTimesheetEntryMutation = { __typename?: 'Mutation', createTimesheetEntry: { __typename?: 'TimesheetEntry', id: string, hours: number, status: string } };

export type UpdateTimesheetEntryMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateTimesheetEntryInput;
}>;


export type UpdateTimesheetEntryMutation = { __typename?: 'Mutation', updateTimesheetEntry: { __typename?: 'TimesheetEntry', id: string, hours: number, status: string } };

export type DeleteTimesheetEntryMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteTimesheetEntryMutation = { __typename?: 'Mutation', deleteTimesheetEntry: { __typename?: 'TimesheetEntry', id: string } };

export type SubmitTimesheetEntryMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type SubmitTimesheetEntryMutation = { __typename?: 'Mutation', submitTimesheetEntry: { __typename?: 'TimesheetEntry', id: string, status: string } };

export type ResolveTimesheetEntryMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  decision: Scalars['String']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
}>;


export type ResolveTimesheetEntryMutation = { __typename?: 'Mutation', resolveTimesheetEntry: { __typename?: 'TimesheetEntry', id: string, status: string } };

export type GetBoMsQueryVariables = Exact<{
  organizationId: Scalars['ID']['input'];
  status?: InputMaybe<Scalars['String']['input']>;
  parentItemId?: InputMaybe<Scalars['ID']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetBoMsQuery = { __typename?: 'Query', billsOfMaterials: Array<{ __typename?: 'BillOfMaterials', id: string, parentItemId: string, parentItemName: string, bomCode: string, version: string, quantityProduced: number, unit: string, laborCost: number, overheadCost: number, totalMaterialCost: number, totalCost: number, status: string, createdAt: string, components: Array<{ __typename?: 'BOMComponent', itemId?: string | null, itemName: string, quantity: number, unit: string, scrapPercent: number, standardCost: number }> }> };

export type GetBomQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetBomQuery = { __typename?: 'Query', billOfMaterials?: { __typename?: 'BillOfMaterials', id: string, organizationId: string, parentItemId: string, parentItemName: string, bomCode: string, version: string, description?: string | null, quantityProduced: number, unit: string, laborCost: number, overheadCost: number, totalMaterialCost: number, totalCost: number, status: string, notes?: string | null, createdAt: string, updatedAt: string, components: Array<{ __typename?: 'BOMComponent', itemId?: string | null, itemName: string, quantity: number, unit: string, scrapPercent: number, standardCost: number, notes?: string | null }> } | null };

export type CreateBomMutationVariables = Exact<{
  input: CreateBomInput;
}>;


export type CreateBomMutation = { __typename?: 'Mutation', createBillOfMaterials: { __typename?: 'BillOfMaterials', id: string, bomCode: string, totalCost: number } };

export type UpdateBomMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateBomInput;
}>;


export type UpdateBomMutation = { __typename?: 'Mutation', updateBillOfMaterials: { __typename?: 'BillOfMaterials', id: string, totalCost: number, status: string } };

export type DeleteBomMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteBomMutation = { __typename?: 'Mutation', deleteBillOfMaterials: { __typename?: 'BillOfMaterials', id: string } };

export type GetAuditLogsQueryVariables = Exact<{
  entityType?: InputMaybe<Scalars['String']['input']>;
  entityId?: InputMaybe<Scalars['ID']['input']>;
  userId?: InputMaybe<Scalars['ID']['input']>;
  action?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetAuditLogsQuery = { __typename?: 'Query', auditLogs: { __typename?: 'AuditLogPage', total: number, page: number, pages: number, data: Array<{ __typename?: 'AuditLog', id: string, userId?: string | null, action: string, entityType: string, entityId?: string | null, oldValuesJson?: string | null, newValuesJson?: string | null, ipAddress?: string | null, userAgent?: string | null, createdAt: string }> } };

export type RegisterMutationVariables = Exact<{
  input: RegisterInput;
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'AuthPayload', token: string, user: { __typename?: 'User', id: string, email: string, firstName: string, lastName: string, roles?: Array<string> | null, organizationId?: string | null, modulePermissions?: Array<{ __typename?: 'ModulePermission', moduleKey: string, canCreate: boolean, canUpdate: boolean, canDelete: boolean, canView: boolean }> | null } } };

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'AuthPayload', token: string, user: { __typename?: 'User', id: string, email: string, firstName: string, lastName: string, roles?: Array<string> | null, organizationId?: string | null, modulePermissions?: Array<{ __typename?: 'ModulePermission', moduleKey: string, canCreate: boolean, canUpdate: boolean, canDelete: boolean, canView: boolean }> | null } } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: string, email: string, firstName: string, lastName: string, roles?: Array<string> | null, organizationId?: string | null, modulePermissions?: Array<{ __typename?: 'ModulePermission', moduleKey: string, submoduleKey?: string | null, canCreate: boolean, canUpdate: boolean, canDelete: boolean, canView: boolean }> | null, dashboardPreferences?: { __typename?: 'DashboardPreferences', erp?: { __typename?: 'DashboardWidgetPreferences', hiddenWidgets: Array<string>, widgetOrder: Array<string> } | null, admin?: { __typename?: 'DashboardWidgetPreferences', hiddenWidgets: Array<string>, widgetOrder: Array<string> } | null, orgAdmin?: { __typename?: 'DashboardWidgetPreferences', hiddenWidgets: Array<string>, widgetOrder: Array<string> } | null } | null } | null };

export type UpdateMyDashboardPreferencesMutationVariables = Exact<{
  dashboard: Scalars['String']['input'];
  input: DashboardWidgetPreferencesInput;
}>;


export type UpdateMyDashboardPreferencesMutation = { __typename?: 'Mutation', updateMyDashboardPreferences: { __typename?: 'User', id: string, dashboardPreferences?: { __typename?: 'DashboardPreferences', erp?: { __typename?: 'DashboardWidgetPreferences', hiddenWidgets: Array<string>, widgetOrder: Array<string> } | null, admin?: { __typename?: 'DashboardWidgetPreferences', hiddenWidgets: Array<string>, widgetOrder: Array<string> } | null, orgAdmin?: { __typename?: 'DashboardWidgetPreferences', hiddenWidgets: Array<string>, widgetOrder: Array<string> } | null } | null } };

export type GetUsersQueryVariables = Exact<{
  organizationId: Scalars['ID']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetUsersQuery = { __typename?: 'Query', usersByOrganization: { __typename?: 'UserList', total: number, page: number, limit: number, users: Array<{ __typename?: 'User', id: string, seqNo?: string | null, email: string, firstName: string, lastName: string, userType?: string | null, roles?: Array<string> | null, status: string, organizationId?: string | null, createdAt: string }> } };

export type GetUserQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetUserQuery = { __typename?: 'Query', user?: { __typename?: 'User', id: string, seqNo?: string | null, email: string, firstName: string, lastName: string, userType?: string | null, roles?: Array<string> | null, status: string, organizationId?: string | null, createdAt: string, modulePermissions?: Array<{ __typename?: 'ModulePermission', moduleKey: string, submoduleKey?: string | null, canCreate: boolean, canUpdate: boolean, canDelete: boolean, canView: boolean }> | null } | null };

export type SetUserModulePermissionsMutationVariables = Exact<{
  userId: Scalars['ID']['input'];
  permissions: Array<ModulePermissionInput> | ModulePermissionInput;
}>;


export type SetUserModulePermissionsMutation = { __typename?: 'Mutation', setUserModulePermissions: { __typename?: 'User', id: string, modulePermissions?: Array<{ __typename?: 'ModulePermission', moduleKey: string, submoduleKey?: string | null, canCreate: boolean, canUpdate: boolean, canDelete: boolean, canView: boolean }> | null } };

export type CreateUserMutationVariables = Exact<{
  input: CreateUserInput;
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser: { __typename?: 'User', id: string, seqNo?: string | null, email: string, firstName: string, lastName: string, status: string } };

export type UpdateUserMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateUserInput;
}>;


export type UpdateUserMutation = { __typename?: 'Mutation', updateUser: { __typename?: 'User', id: string, firstName: string, lastName: string, status: string } };

export type DeleteUserMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteUserMutation = { __typename?: 'Mutation', deleteUser: { __typename?: 'User', id: string } };

export type RolesByOrganizationQueryVariables = Exact<{
  organizationId: Scalars['ID']['input'];
}>;


export type RolesByOrganizationQuery = { __typename?: 'Query', rolesByOrganization: Array<{ __typename?: 'Role', id: string, name: string, displayName: string, description?: string | null, isSystemRole: boolean, organizationId?: string | null, permissions: Array<{ __typename?: 'Permission', resource: string, actions: Array<string> }> }> };

export type CreateRoleMutationVariables = Exact<{
  input: CreateRoleInput;
}>;


export type CreateRoleMutation = { __typename?: 'Mutation', createRole: { __typename?: 'Role', id: string, name: string, displayName: string, isSystemRole: boolean } };

export type DeleteRoleMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteRoleMutation = { __typename?: 'Mutation', deleteRole: boolean };

export type GetOrganizationsQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetOrganizationsQuery = { __typename?: 'Query', organizations: Array<{ __typename?: 'Organization', id: string, seqNo: string, name: string, code?: string | null, address?: string | null, phone?: string | null, email?: string | null, status: string, createdAt: string }> };

export type GetOrganizationQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetOrganizationQuery = { __typename?: 'Query', organization?: { __typename?: 'Organization', id: string, seqNo: string, name: string, code?: string | null, address?: string | null, phone?: string | null, email?: string | null, status: string, createdAt: string, moduleApprovers: Array<{ __typename?: 'OrganizationModuleApprover', moduleKey: string, approverUserId?: string | null, approverUserIds: Array<string> }> } | null };

export type SetOrganizationModuleApproversMutationVariables = Exact<{
  organizationId: Scalars['ID']['input'];
  assignments: Array<OrganizationModuleApproverInput> | OrganizationModuleApproverInput;
}>;


export type SetOrganizationModuleApproversMutation = { __typename?: 'Mutation', setOrganizationModuleApprovers: { __typename?: 'Organization', id: string, moduleApprovers: Array<{ __typename?: 'OrganizationModuleApprover', moduleKey: string, approverUserId?: string | null, approverUserIds: Array<string> }> } };

export type CreateOrganizationMutationVariables = Exact<{
  input: CreateOrganizationInput;
}>;


export type CreateOrganizationMutation = { __typename?: 'Mutation', createOrganization: { __typename?: 'Organization', id: string, name: string, code?: string | null, status: string } };

export type CreateOrganizationWithOrgAdminMutationVariables = Exact<{
  input: CreateOrganizationWithOrgAdminInput;
}>;


export type CreateOrganizationWithOrgAdminMutation = { __typename?: 'Mutation', createOrganizationWithOrgAdmin: { __typename?: 'Organization', id: string, name: string, code?: string | null, status: string } };

export type UpdateOrganizationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateOrganizationInput;
}>;


export type UpdateOrganizationMutation = { __typename?: 'Mutation', updateOrganization: { __typename?: 'Organization', id: string, name: string, status: string } };

export type DeleteOrganizationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteOrganizationMutation = { __typename?: 'Mutation', deleteOrganization: { __typename?: 'Organization', id: string } };

export type SendNotificationMutationVariables = Exact<{
  input: SendNotificationInput;
}>;


export type SendNotificationMutation = { __typename?: 'Mutation', sendNotification: number };

export type MyPendingApprovalRequestsQueryVariables = Exact<{ [key: string]: never; }>;


export type MyPendingApprovalRequestsQuery = { __typename?: 'Query', myPendingApprovalRequests: Array<{ __typename?: 'ApprovalRequest', id: string, organizationId: string, moduleKey: string, entityType: string, entityId: string, title: string, status: ApprovalRequestStatus, requesterDisplayName?: string | null, createdAt?: string | null }> };

export type ResolveApprovalRequestMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  decision: ApprovalDecision;
  note?: InputMaybe<Scalars['String']['input']>;
}>;


export type ResolveApprovalRequestMutation = { __typename?: 'Mutation', resolveApprovalRequest: { __typename?: 'ApprovalRequest', id: string, status: ApprovalRequestStatus, decidedAt?: string | null } };

export type MyApprovalRequestsQueryVariables = Exact<{
  status?: InputMaybe<ApprovalRequestStatus>;
  role?: InputMaybe<ApprovalRequestRole>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
}>;


export type MyApprovalRequestsQuery = { __typename?: 'Query', myApprovalRequests: Array<{ __typename?: 'ApprovalRequest', id: string, organizationId: string, moduleKey: string, entityType: string, entityId: string, title: string, status: ApprovalRequestStatus, requesterUserId: string, requesterDisplayName?: string | null, assigneeApproverUserId: string, resolutionNote?: string | null, decidedByUserId?: string | null, decidedAt?: string | null, createdAt?: string | null, updatedAt?: string | null }> };

export type ModuleWorkspaceRecordsQueryVariables = Exact<{
  organizationId: Scalars['ID']['input'];
  routePath: Scalars['String']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type ModuleWorkspaceRecordsQuery = { __typename?: 'Query', moduleWorkspaceRecords: Array<{ __typename?: 'ModuleWorkspaceRecord', id: string, routePath: string, approvalModuleKey: string, title: string, detail?: string | null, snapshot?: string | null, status: ModuleWorkspaceStatus, createdAt?: string | null, updatedAt?: string | null }> };

export type CreateModuleWorkspaceRecordMutationVariables = Exact<{
  input: CreateModuleWorkspaceRecordInput;
}>;


export type CreateModuleWorkspaceRecordMutation = { __typename?: 'Mutation', createModuleWorkspaceRecord: { __typename?: 'ModuleWorkspaceRecord', id: string, title: string, status: ModuleWorkspaceStatus, routePath: string, approvalModuleKey: string, createdAt?: string | null } };

export type SubmitModuleWorkspaceRecordForApprovalMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type SubmitModuleWorkspaceRecordForApprovalMutation = { __typename?: 'Mutation', submitModuleWorkspaceRecordForApproval: { __typename?: 'ModuleWorkspaceRecord', id: string, title: string, status: ModuleWorkspaceStatus, updatedAt?: string | null } };

export type SalesEnquiriesQueryVariables = Exact<{
  organizationId: Scalars['ID']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
}>;


export type SalesEnquiriesQuery = { __typename?: 'Query', salesEnquiries: Array<{ __typename?: 'SalesEnquiry', id: string, enquiryNumber: string, subject?: string | null, status: string, approvalStatus: RecordApprovalWorkflowStatus, approvalRequestedAt?: string | null, approvedAt?: string | null, approvedBy?: string | null, priority: string, createdAt: string, updatedAt: string }> };

export type SubmitSalesEnquiryForApprovalMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type SubmitSalesEnquiryForApprovalMutation = { __typename?: 'Mutation', submitSalesEnquiryForApproval: { __typename?: 'SalesEnquiry', id: string, enquiryNumber: string, subject?: string | null, status: string, approvalStatus: RecordApprovalWorkflowStatus, approvalRequestedAt?: string | null, approvedAt?: string | null, approvedBy?: string | null } };

export type SubmitSalesOrderMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type SubmitSalesOrderMutation = { __typename?: 'Mutation', submitSalesOrder: { __typename?: 'SalesOrder', id: string, status: string, seqNo: string } };

export type SubmitQuotationForApprovalMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type SubmitQuotationForApprovalMutation = { __typename?: 'Mutation', submitQuotationForApproval: { __typename?: 'Quotation', id: string, quotationNumber: string, status: string } };

export type SubmitCustomerInvoiceForApprovalMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type SubmitCustomerInvoiceForApprovalMutation = { __typename?: 'Mutation', submitCustomerInvoiceForApproval: { __typename?: 'CustomerInvoice', id: string, seqNo: string, status: string } };

export type SubmitLeadForApprovalMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type SubmitLeadForApprovalMutation = { __typename?: 'Mutation', submitLeadForApproval: { __typename?: 'Lead', id: string, seqNo?: string | null, status: string } };

export type SubmitPayrollUiRecordForApprovalMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type SubmitPayrollUiRecordForApprovalMutation = { __typename?: 'Mutation', submitPayrollUiRecordForApproval: { __typename?: 'PayrollUiRecord', id: string, approvalStatus: string, category: string } };

export type GetItemsQueryVariables = Exact<{
  organizationId: Scalars['ID']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetItemsQuery = { __typename?: 'Query', items: Array<{ __typename?: 'Item', id: string, seqNo?: string | null, name: string, description?: string | null, category?: string | null, unit?: string | null, rate?: number | null, organizationId: string, status: string, createdAt: string }> };

export type GetItemQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetItemQuery = { __typename?: 'Query', item?: { __typename?: 'Item', id: string, seqNo?: string | null, name: string, description?: string | null, category?: string | null, unit?: string | null, rate?: number | null, organizationId: string, status: string, createdAt: string } | null };

export type CreateItemMutationVariables = Exact<{
  input: CreateItemInput;
}>;


export type CreateItemMutation = { __typename?: 'Mutation', createItem: { __typename?: 'Item', id: string, name: string, category?: string | null, status: string } };

export type UpdateItemMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateItemInput;
}>;


export type UpdateItemMutation = { __typename?: 'Mutation', updateItem: { __typename?: 'Item', id: string, name: string, status: string } };

export type DeleteItemMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteItemMutation = { __typename?: 'Mutation', deleteItem: { __typename?: 'Item', id: string } };

export type GetVendorsQueryVariables = Exact<{
  organizationId: Scalars['ID']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetVendorsQuery = { __typename?: 'Query', vendors: Array<{ __typename?: 'Vendor', id: string, seqNo?: string | null, name: string, contactPerson?: string | null, email?: string | null, phone?: string | null, address?: string | null, organizationId: string, orgApprovalStatus: string, status: string, createdAt: string }> };

export type GetVendorQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetVendorQuery = { __typename?: 'Query', vendor?: { __typename?: 'Vendor', id: string, seqNo?: string | null, name: string, contactPerson?: string | null, email?: string | null, phone?: string | null, address?: string | null, city?: string | null, state?: string | null, country?: string | null, zipCode?: string | null, taxNumber?: string | null, paymentTerms?: string | null, notes?: string | null, organizationId: string, orgApprovalStatus: string, status: string, createdAt: string, updatedAt: string, createdBy?: { __typename?: 'User', id: string, firstName: string, lastName: string, email: string } | null } | null };

export type VendorEligibleApproversQueryVariables = Exact<{
  organizationId: Scalars['ID']['input'];
}>;


export type VendorEligibleApproversQuery = { __typename?: 'Query', vendorEligibleApprovers: Array<{ __typename?: 'User', id: string, firstName: string, lastName: string, email: string }> };

export type VendorApprovalRequestsQueryVariables = Exact<{
  vendorId: Scalars['ID']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type VendorApprovalRequestsQuery = { __typename?: 'Query', vendorApprovalRequests: Array<{ __typename?: 'ApprovalRequest', id: string, title: string, status: ApprovalRequestStatus, assigneeApproverUserId: string, assigneeDisplayName?: string | null, requesterDisplayName?: string | null, createdAt?: string | null, decidedAt?: string | null, resolutionNote?: string | null, moduleKey: string }> };

export type CreateVendorMutationVariables = Exact<{
  input: CreateVendorInput;
}>;


export type CreateVendorMutation = { __typename?: 'Mutation', createVendor: { __typename?: 'Vendor', id: string, name: string, orgApprovalStatus: string, status: string } };

export type UpdateVendorMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateVendorInput;
}>;


export type UpdateVendorMutation = { __typename?: 'Mutation', updateVendor: { __typename?: 'Vendor', id: string, name: string, orgApprovalStatus: string, status: string } };

export type SubmitVendorForApprovalMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  assigneeApproverUserIds?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
}>;


export type SubmitVendorForApprovalMutation = { __typename?: 'Mutation', submitVendorForApproval: { __typename?: 'Vendor', id: string, seqNo?: string | null, orgApprovalStatus: string, status: string } };

export type DeleteVendorMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteVendorMutation = { __typename?: 'Mutation', deleteVendor: boolean };

export type GetProjectsQueryVariables = Exact<{
  organizationId: Scalars['ID']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetProjectsQuery = { __typename?: 'Query', projects: Array<{ __typename?: 'Project', id: string, seqNo?: string | null, name: string, description?: string | null, startDate?: string | null, endDate?: string | null, orgApprovalStatus: string, status: string, organizationId: string, createdAt?: string | null }> };

export type GetProjectQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetProjectQuery = { __typename?: 'Query', project?: { __typename?: 'Project', id: string, seqNo?: string | null, name: string, description?: string | null, startDate?: string | null, endDate?: string | null, orgApprovalStatus: string, status: string, organizationId: string, createdAt?: string | null } | null };

export type CreateProjectMutationVariables = Exact<{
  input: CreateProjectInput;
}>;


export type CreateProjectMutation = { __typename?: 'Mutation', createProject: { __typename?: 'Project', id: string, name: string, orgApprovalStatus: string, status: string } };

export type SubmitProjectForApprovalMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type SubmitProjectForApprovalMutation = { __typename?: 'Mutation', submitProjectForApproval: { __typename?: 'Project', id: string, seqNo?: string | null, orgApprovalStatus: string, status: string } };

export type UpdateProjectMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateProjectInput;
}>;


export type UpdateProjectMutation = { __typename?: 'Mutation', updateProject: { __typename?: 'Project', id: string, name: string, orgApprovalStatus: string, status: string } };

export type DeleteProjectMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteProjectMutation = { __typename?: 'Mutation', deleteProject: { __typename?: 'Project', id: string } };

export type GetPurchaseOrdersQueryVariables = Exact<{
  organizationId: Scalars['ID']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetPurchaseOrdersQuery = { __typename?: 'Query', purchaseorders: Array<{ __typename?: 'PurchaseOrder', id: string, seqNo?: string | null, vendorId?: string | null, vendorName?: string | null, projectId?: string | null, projectName?: string | null, deliveryDate?: string | null, subtotal?: number | null, taxAmount?: number | null, totalAmount?: number | null, status: string, orderDate?: string | null, notes?: string | null, organizationId: string, createdAt?: string | null, items?: Array<{ __typename?: 'POLineItem', itemDescription?: string | null, quantity?: number | null, unitPrice?: number | null, lineTotal?: number | null }> | null }> };

export type CreatePurchaseOrderMutationVariables = Exact<{
  input: CreatePurchaseOrderInput;
}>;


export type CreatePurchaseOrderMutation = { __typename?: 'Mutation', createPurchaseOrder: { __typename?: 'PurchaseOrder', id: string, seqNo?: string | null, status: string, totalAmount?: number | null } };

export type UpdatePurchaseOrderMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdatePurchaseOrderInput;
}>;


export type UpdatePurchaseOrderMutation = { __typename?: 'Mutation', updatePurchaseOrder: { __typename?: 'PurchaseOrder', id: string, seqNo?: string | null, status: string, totalAmount?: number | null } };

export type SubmitPurchaseOrderMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type SubmitPurchaseOrderMutation = { __typename?: 'Mutation', submitPurchaseOrder: { __typename?: 'PurchaseOrder', id: string, status: string } };

export type ApprovePurchaseOrderMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type ApprovePurchaseOrderMutation = { __typename?: 'Mutation', approvePurchaseOrder: { __typename?: 'PurchaseOrder', id: string, status: string } };

export type ReceivePurchaseOrderMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type ReceivePurchaseOrderMutation = { __typename?: 'Mutation', receivePurchaseOrder: { __typename?: 'PurchaseOrder', id: string, status: string } };

export type BillPurchaseOrderMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  billDate: Scalars['String']['input'];
  dueDate: Scalars['String']['input'];
}>;


export type BillPurchaseOrderMutation = { __typename?: 'Mutation', billPurchaseOrder: { __typename?: 'VendorBill', id: string, billNumber: string, status: string, totalAmount: number } };

export type GetSalesOrdersQueryVariables = Exact<{
  organizationId: Scalars['ID']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  cashSale?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type GetSalesOrdersQuery = { __typename?: 'Query', salesorders: Array<{ __typename?: 'SalesOrder', id: string, seqNo: string, quotationId?: string | null, quotationStatus?: string | null, customerId: string, projectId?: string | null, totalAmount: number, status: string, orderDate: string, organizationId: string, cashSale: boolean, refundedAt?: string | null, refundAmount?: number | null, createdAt: string }> };

export type GetSalesOrderQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetSalesOrderQuery = { __typename?: 'Query', salesorder?: { __typename?: 'SalesOrder', id: string, seqNo: string, customerId: string, projectId?: string | null, totalAmount: number, status: string, orderDate: string, organizationId: string, createdAt: string } | null };

export type CreateSalesOrderMutationVariables = Exact<{
  input: CreateSalesOrderInput;
}>;


export type CreateSalesOrderMutation = { __typename?: 'Mutation', createSalesOrder: { __typename?: 'SalesOrder', id: string, seqNo: string, status: string } };

export type UpdateSalesOrderMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateSalesOrderInput;
}>;


export type UpdateSalesOrderMutation = { __typename?: 'Mutation', updateSalesOrder: { __typename?: 'SalesOrder', id: string, seqNo: string, status: string } };

export type GetCustomerInvoicesQueryVariables = Exact<{
  organizationId: Scalars['ID']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  customerId?: InputMaybe<Scalars['ID']['input']>;
}>;


export type GetCustomerInvoicesQuery = { __typename?: 'Query', customerinvoices: Array<{ __typename?: 'CustomerInvoice', id: string, seqNo: string, customerId: string, salesOrderId?: string | null, invoiceDate: string, dueDate?: string | null, totalAmount: number, paidAmount?: number | null, outstandingAmount: number, status: string, organizationId: string, createdAt: string }> };

export type GetCustomerPaymentsQueryVariables = Exact<{
  organizationId: Scalars['ID']['input'];
  customerId?: InputMaybe<Scalars['ID']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetCustomerPaymentsQuery = { __typename?: 'Query', customerPayments: Array<{ __typename?: 'CustomerPayment', id: string, paymentNumber: string, paymentDate: string, paymentMethod: string, referenceNumber?: string | null, totalAmount: number, status: string, createdAt: string, customer?: { __typename?: 'Customer', id: string, name: string, docNumber: string } | null }> };

export type CreateCustomerPaymentMutationVariables = Exact<{
  input: CreateCustomerPaymentInput;
}>;


export type CreateCustomerPaymentMutation = { __typename?: 'Mutation', createCustomerPayment: { __typename?: 'CustomerPayment', id: string, paymentNumber: string, totalAmount: number } };

export type CreateCustomerInvoiceMutationVariables = Exact<{
  input: CreateCustomerInvoiceInput;
}>;


export type CreateCustomerInvoiceMutation = { __typename?: 'Mutation', createCustomerInvoice: { __typename?: 'CustomerInvoice', id: string, seqNo: string, status: string } };

export type CreateCashSaleMutationVariables = Exact<{
  input: CreateSalesOrderInput;
}>;


export type CreateCashSaleMutation = { __typename?: 'Mutation', createSalesOrder: { __typename?: 'SalesOrder', id: string, seqNo: string, status: string, totalAmount: number, orderDate: string, cashSale: boolean } };

export type GetCashSalesRefundCandidatesQueryVariables = Exact<{
  organizationId: Scalars['ID']['input'];
}>;


export type GetCashSalesRefundCandidatesQuery = { __typename?: 'Query', cashSalesRefundCandidates: Array<{ __typename?: 'SalesOrder', id: string, seqNo: string, customerId: string, totalAmount: number, status: string, orderDate: string, cashSale: boolean }> };

export type RefundCashSaleMutationVariables = Exact<{
  input: RefundCashSaleInput;
}>;


export type RefundCashSaleMutation = { __typename?: 'Mutation', refundCashSale: { __typename?: 'SalesOrder', id: string, seqNo: string, status: string, totalAmount: number, refundedAt?: string | null, refundAmount?: number | null, refundMethod?: string | null } };

export type UpdateCustomerInvoiceMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateCustomerInvoiceInput;
}>;


export type UpdateCustomerInvoiceMutation = { __typename?: 'Mutation', updateCustomerInvoice: { __typename?: 'CustomerInvoice', id: string, seqNo: string, status: string, paidAmount?: number | null, totalAmount: number } };

export type GetAttendancesQueryVariables = Exact<{
  organizationId: Scalars['ID']['input'];
  userId?: InputMaybe<Scalars['ID']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetAttendancesQuery = { __typename?: 'Query', attendances: Array<{ __typename?: 'Attendance', id: string, userId: string, date: string, checkIn?: string | null, checkOut?: string | null, status: string, organizationId: string, createdAt: string }> };

export type CreateAttendanceMutationVariables = Exact<{
  input: CreateAttendanceInput;
}>;


export type CreateAttendanceMutation = { __typename?: 'Mutation', createAttendance: { __typename?: 'Attendance', id: string, status: string } };

export type GetGeneralLedgersQueryVariables = Exact<{
  organizationId: Scalars['String']['input'];
  fiscalYear?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetGeneralLedgersQuery = { __typename?: 'Query', generalLedgers: Array<{ __typename?: 'GeneralLedger', id: string, transactionNumber: string, transactionDate: string, transactionType: string, referenceModule: string, referenceId: string, debitAccount: string, creditAccount: string, amount: number, currency: string, description: string, fiscalYear: string, fiscalPeriod: string, status: string, createdAt: string }> };

export type GetChartOfAccountsQueryVariables = Exact<{
  organizationId: Scalars['String']['input'];
  accountType?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetChartOfAccountsQuery = { __typename?: 'Query', chartOfAccounts: Array<{ __typename?: 'ChartOfAccounts', id: string, accountCode: string, accountNumber?: string | null, accountName: string, accountType: string, parentAccount?: string | null, level: number, isActive: boolean, description?: string | null, createdAt: string }> };

export type CreateGeneralLedgerMutationVariables = Exact<{
  input: GeneralLedgerInput;
}>;


export type CreateGeneralLedgerMutation = { __typename?: 'Mutation', createGeneralLedger: { __typename?: 'GeneralLedger', id: string, transactionNumber: string, status: string } };

export type CreateChartOfAccountMutationVariables = Exact<{
  input: ChartOfAccountsInput;
}>;


export type CreateChartOfAccountMutation = { __typename?: 'Mutation', createChartOfAccount: { __typename?: 'ChartOfAccounts', id: string, accountCode: string, accountNumber?: string | null, accountName: string } };

export type GetCashBanksQueryVariables = Exact<{
  organizationId: Scalars['String']['input'];
  reconciliationStatus?: InputMaybe<Scalars['String']['input']>;
  bankAccount?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetCashBanksQuery = { __typename?: 'Query', cashBanks: Array<{ __typename?: 'CashBank', id: string, transactionNumber: string, transactionDate: string, transactionType: string, bankAccount: string, referenceModule: string, referenceId: string, amount: number, currency: string, paymentMethod: string, chequeNumber?: string | null, description: string, reconciliationStatus: string, reconciliationDate?: string | null, organizationId: string, createdAt: string }> };

export type GetBankAccountsQueryVariables = Exact<{
  organizationId: Scalars['String']['input'];
}>;


export type GetBankAccountsQuery = { __typename?: 'Query', bankAccounts: Array<{ __typename?: 'BankAccount', id: string, accountNumber: string, accountName: string, accountHolder?: string | null, bankName: string, branchName: string, accountType: string, currency: string, currentBalance: number, isActive: boolean, organizationId: string, createdAt: string }> };

export type CreateCashBankMutationVariables = Exact<{
  input: CashBankInput;
}>;


export type CreateCashBankMutation = { __typename?: 'Mutation', createCashBank: { __typename?: 'CashBank', id: string, transactionNumber: string } };

export type CreateBankAccountMutationVariables = Exact<{
  input: BankAccountInput;
}>;


export type CreateBankAccountMutation = { __typename?: 'Mutation', createBankAccount: { __typename?: 'BankAccount', id: string, accountNumber: string, accountName: string, accountHolder?: string | null } };

export type ReconcileCashBankMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type ReconcileCashBankMutation = { __typename?: 'Mutation', reconcileCashBank: { __typename?: 'CashBank', id: string, transactionNumber: string, reconciliationStatus: string, reconciliationDate?: string | null } };

export type GetBankStatementLinesQueryVariables = Exact<{
  organizationId: Scalars['String']['input'];
  bankAccount: Scalars['String']['input'];
  onlyUnmatched?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type GetBankStatementLinesQuery = { __typename?: 'Query', bankStatementLines: Array<{ __typename?: 'BankStatementLine', id: string, lineDate: string, amount: number, lineKind: string, description: string, bankReference?: string | null, bankAccount: string, organizationId: string, isMatched: boolean, matchedCashBankId?: string | null, createdAt: string }> };

export type CreateBankStatementLineMutationVariables = Exact<{
  input: BankStatementLineInput;
}>;


export type CreateBankStatementLineMutation = { __typename?: 'Mutation', createBankStatementLine: { __typename?: 'BankStatementLine', id: string, lineDate: string, amount: number, lineKind: string } };

export type DeleteBankStatementLineMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteBankStatementLineMutation = { __typename?: 'Mutation', deleteBankStatementLine: boolean };

export type MatchBankStatementLineToBookMutationVariables = Exact<{
  bankStatementLineId: Scalars['ID']['input'];
  cashBankId: Scalars['ID']['input'];
}>;


export type MatchBankStatementLineToBookMutation = { __typename?: 'Mutation', matchBankStatementLineToBook: { __typename?: 'BankStatementLine', id: string, isMatched: boolean, matchedCashBankId?: string | null } };

export type GetReconciliationRulesQueryVariables = Exact<{
  organizationId: Scalars['String']['input'];
}>;


export type GetReconciliationRulesQuery = { __typename?: 'Query', reconciliationRules: Array<{ __typename?: 'ReconciliationRule', id: string, name: string, organizationId: string, bankAccount?: string | null, priority: number, isActive: boolean, bankLineTextContains: string, bookLineTextContains: string, amountTolerance: number, notes?: string | null, createdAt: string, updatedAt?: string | null }> };

export type CreateReconciliationRuleMutationVariables = Exact<{
  input: ReconciliationRuleInput;
}>;


export type CreateReconciliationRuleMutation = { __typename?: 'Mutation', createReconciliationRule: { __typename?: 'ReconciliationRule', id: string, name: string, priority: number } };

export type UpdateReconciliationRuleMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: ReconciliationRulePatch;
}>;


export type UpdateReconciliationRuleMutation = { __typename?: 'Mutation', updateReconciliationRule: { __typename?: 'ReconciliationRule', id: string, name: string, priority: number, isActive: boolean } };

export type DeleteReconciliationRuleMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteReconciliationRuleMutation = { __typename?: 'Mutation', deleteReconciliationRule: boolean };

export type TransferBankFundsMutationVariables = Exact<{
  input: BankTransferInput;
}>;


export type TransferBankFundsMutation = { __typename?: 'Mutation', transferBankFunds: { __typename?: 'BankTransferResult', transferId: string, fromCashBankId: string, toCashBankId: string, fromTransactionNumber: string, toTransactionNumber: string } };

export type GetInventoryControlsQueryVariables = Exact<{
  organizationId: Scalars['String']['input'];
  warehouseId?: InputMaybe<Scalars['String']['input']>;
  stockStatus?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetInventoryControlsQuery = { __typename?: 'Query', inventoryControls: Array<{ __typename?: 'InventoryControl', id: string, itemId: string, itemName: string, binLocation: string, quantity: number, unit: string, minStockLevel: number, maxStockLevel: number, reorderPoint: number, warehouseId: string, lastStockDate: string, stockStatus: string, createdAt: string }> };

export type GetLowStockItemsQueryVariables = Exact<{
  organizationId: Scalars['String']['input'];
}>;


export type GetLowStockItemsQuery = { __typename?: 'Query', lowStockItems: Array<{ __typename?: 'InventoryControl', id: string, itemId: string, itemName: string, quantity: number, reorderPoint: number, stockStatus: string }> };

export type CreateInventoryControlMutationVariables = Exact<{
  input: InventoryControlInput;
}>;


export type CreateInventoryControlMutation = { __typename?: 'Mutation', createInventoryControl: { __typename?: 'InventoryControl', id: string, itemName: string, quantity: number } };

export type UpdateInventoryControlMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: InventoryControlInput;
}>;


export type UpdateInventoryControlMutation = { __typename?: 'Mutation', updateInventoryControl: { __typename?: 'InventoryControl', id: string, itemName: string, quantity: number, stockStatus: string, lastStockDate: string } };

export type AdjustStockMutationVariables = Exact<{
  itemId: Scalars['String']['input'];
  binLocation: Scalars['String']['input'];
  quantity: Scalars['Float']['input'];
  reason: Scalars['String']['input'];
  organizationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type AdjustStockMutation = { __typename?: 'Mutation', adjustStock: { __typename?: 'InventoryControl', id: string, quantity: number, stockStatus: string } };

export type GetStockMovementsQueryVariables = Exact<{
  organizationId: Scalars['String']['input'];
  itemId?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetStockMovementsQuery = { __typename?: 'Query', stockMovements: Array<{ __typename?: 'StockMovement', id: string, itemId: string, movementType: string, fromLocation: string, toLocation: string, quantity: number, unit: string, referenceModule: string, referenceId: string, movementDate: string, notes?: string | null, organizationId: string, createdAt: string }> };

export type GetWarehousesQueryVariables = Exact<{
  organizationId: Scalars['String']['input'];
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type GetWarehousesQuery = { __typename?: 'Query', warehouses: Array<{ __typename?: 'Warehouse', id: string, warehouseCode: string, warehouseName: string, location: string, address: string, capacity: number, currentUtilization: number, managerName: string, contactNumber: string, warehouseType: string, isActive: boolean, createdAt: string }> };

export type GetWarehouseBinsQueryVariables = Exact<{
  organizationId: Scalars['String']['input'];
  warehouseId?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetWarehouseBinsQuery = { __typename?: 'Query', warehouseBins: Array<{ __typename?: 'WarehouseBin', id: string, warehouseId: string, binCode: string, binLocation: string, binType: string, capacity: number, currentStock: number, isAvailable: boolean, createdAt: string }> };

export type CreateWarehouseMutationVariables = Exact<{
  input: WarehouseInput;
}>;


export type CreateWarehouseMutation = { __typename?: 'Mutation', createWarehouse: { __typename?: 'Warehouse', id: string, warehouseCode: string, warehouseName: string, location: string, address: string, capacity: number, currentUtilization: number, managerName: string, contactNumber: string, warehouseType: string, isActive: boolean, createdAt: string } };

export type UpdateWarehouseMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: WarehouseInput;
}>;


export type UpdateWarehouseMutation = { __typename?: 'Mutation', updateWarehouse: { __typename?: 'Warehouse', id: string, warehouseCode: string, warehouseName: string, location: string, address: string, capacity: number, managerName: string, contactNumber: string, warehouseType: string, isActive: boolean } };

export type CreateWarehouseBinMutationVariables = Exact<{
  input: WarehouseBinInput;
}>;


export type CreateWarehouseBinMutation = { __typename?: 'Mutation', createWarehouseBin: { __typename?: 'WarehouseBin', id: string, warehouseId: string, binCode: string, binLocation: string, binType: string, capacity: number, currentStock: number, isAvailable: boolean, createdAt: string } };

export type UpdateWarehouseBinMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: WarehouseBinInput;
}>;


export type UpdateWarehouseBinMutation = { __typename?: 'Mutation', updateWarehouseBin: { __typename?: 'WarehouseBin', id: string, warehouseId: string, binCode: string, binLocation: string, binType: string, capacity: number, currentStock: number, isAvailable: boolean, createdAt: string } };

export type GetCustomersQueryVariables = Exact<{
  organizationId: Scalars['String']['input'];
}>;


export type GetCustomersQuery = { __typename?: 'Query', customers: Array<{ __typename?: 'Customer', id: string, docNumber: string, name: string, contactPerson?: string | null, email?: string | null, phone?: string | null, address?: string | null, city?: string | null, state?: string | null, country?: string | null, zipCode?: string | null, taxNumber?: string | null, paymentTerms?: string | null, notes?: string | null, status: string, invoiceBillable: boolean, createdAt: string }> };

export type CreateCustomerMutationVariables = Exact<{
  input: CreateCustomerInput;
}>;


export type CreateCustomerMutation = { __typename?: 'Mutation', createCustomer: { __typename?: 'Customer', id: string, docNumber: string, name: string, status: string } };

export type UpdateCustomerMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateCustomerInput;
}>;


export type UpdateCustomerMutation = { __typename?: 'Mutation', updateCustomer: { __typename?: 'Customer', id: string, name: string, status: string, invoiceBillable: boolean } };

export type DeleteCustomerMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteCustomerMutation = { __typename?: 'Mutation', deleteCustomer: boolean };

export type GetReturnAuthorizationsQueryVariables = Exact<{
  organizationId: Scalars['String']['input'];
  status?: InputMaybe<Scalars['String']['input']>;
  customerId?: InputMaybe<Scalars['ID']['input']>;
  receiptComplete?: InputMaybe<Scalars['Boolean']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetReturnAuthorizationsQuery = { __typename?: 'Query', returnAuthorizations: Array<{ __typename?: 'ReturnAuthorization', id: string, raNumber: string, customerId: string, reason?: string | null, notes?: string | null, status: string, requestedDate: string, rejectionReason?: string | null, approvedAt?: string | null, goodsReceivedAt?: string | null, receiptComplete: boolean, receiptNotes?: string | null, createdAt: string, customer?: { __typename?: 'Customer', id: string, name: string, docNumber: string } | null, lines: Array<{ __typename?: 'ReturnAuthorizationLine', id: string, itemId?: string | null, description: string, quantity: number, quantityReceived: number }> }> };

export type ApproveReturnAuthorizationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type ApproveReturnAuthorizationMutation = { __typename?: 'Mutation', approveReturnAuthorization: { __typename?: 'ReturnAuthorization', id: string, raNumber: string, status: string } };

export type RejectReturnAuthorizationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
}>;


export type RejectReturnAuthorizationMutation = { __typename?: 'Mutation', rejectReturnAuthorization: { __typename?: 'ReturnAuthorization', id: string, raNumber: string, status: string } };

export type CancelReturnAuthorizationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type CancelReturnAuthorizationMutation = { __typename?: 'Mutation', cancelReturnAuthorization: { __typename?: 'ReturnAuthorization', id: string, raNumber: string, status: string } };

export type CreateReturnAuthorizationMutationVariables = Exact<{
  input: CreateReturnAuthorizationInput;
}>;


export type CreateReturnAuthorizationMutation = { __typename?: 'Mutation', createReturnAuthorization: { __typename?: 'ReturnAuthorization', id: string, raNumber: string, customerId: string, salesOrderId?: string | null, reason?: string | null, notes?: string | null, status: string, requestedDate: string, createdAt: string, lines: Array<{ __typename?: 'ReturnAuthorizationLine', id: string, itemId?: string | null, description: string, quantity: number, quantityReceived: number }> } };

export type ReceiveReturnAuthorizationGoodsMutationVariables = Exact<{
  input: ReceiveReturnAuthorizationGoodsInput;
}>;


export type ReceiveReturnAuthorizationGoodsMutation = { __typename?: 'Mutation', receiveReturnAuthorizationGoods: { __typename?: 'ReturnAuthorization', id: string, raNumber: string, status: string, receiptComplete: boolean, goodsReceivedAt?: string | null, receiptNotes?: string | null, lines: Array<{ __typename?: 'ReturnAuthorizationLine', id: string, description: string, quantity: number, quantityReceived: number }> } };

export type GetCustomerRefundsQueryVariables = Exact<{
  organizationId: Scalars['ID']['input'];
  customerId?: InputMaybe<Scalars['ID']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetCustomerRefundsQuery = { __typename?: 'Query', customerRefunds: Array<{ __typename?: 'CustomerRefund', id: string, refundNumber: string, customerId: string, refundDate: string, refundMethod: string, referenceNumber?: string | null, amount: number, customerInvoiceId?: string | null, notes?: string | null, status: string, createdAt: string, customer?: { __typename?: 'Customer', id: string, name: string, docNumber: string } | null, invoice?: { __typename?: 'CustomerInvoice', id: string, seqNo: string } | null }> };

export type CreateCustomerRefundMutationVariables = Exact<{
  input: CreateCustomerRefundInput;
}>;


export type CreateCustomerRefundMutation = { __typename?: 'Mutation', createCustomerRefund: { __typename?: 'CustomerRefund', id: string, refundNumber: string, refundDate: string, refundMethod: string, amount: number, status: string, createdAt: string } };

export type CancelCustomerRefundMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type CancelCustomerRefundMutation = { __typename?: 'Mutation', cancelCustomerRefund: { __typename?: 'CustomerRefund', id: string, refundNumber: string, status: string } };

export type GetCustomerDepositsQueryVariables = Exact<{
  organizationId: Scalars['ID']['input'];
  customerId?: InputMaybe<Scalars['ID']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetCustomerDepositsQuery = { __typename?: 'Query', customerDeposits: Array<{ __typename?: 'CustomerDeposit', id: string, depositNumber: string, customerId: string, depositDate: string, depositMethod: string, referenceNumber?: string | null, amount: number, notes?: string | null, status: string, createdAt: string, customer?: { __typename?: 'Customer', id: string, name: string, docNumber: string } | null }> };

export type CreateCustomerDepositMutationVariables = Exact<{
  input: CreateCustomerDepositInput;
}>;


export type CreateCustomerDepositMutation = { __typename?: 'Mutation', createCustomerDeposit: { __typename?: 'CustomerDeposit', id: string, depositNumber: string, depositDate: string, amount: number, status: string, createdAt: string } };

export type CancelCustomerDepositMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type CancelCustomerDepositMutation = { __typename?: 'Mutation', cancelCustomerDeposit: { __typename?: 'CustomerDeposit', id: string, depositNumber: string, status: string } };

export type GetFinanceChargeAssessmentsQueryVariables = Exact<{
  organizationId: Scalars['String']['input'];
  status?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetFinanceChargeAssessmentsQuery = { __typename?: 'Query', financeChargeAssessments: Array<{ __typename?: 'FinanceChargeAssessment', id: string, assessmentNumber: string, asOfDate: string, annualRatePercent: number, status: string, totalChargeAmount: number, postedAt?: string | null, createdAt: string }> };

export type DraftFinanceChargeAssessmentMutationVariables = Exact<{
  input: DraftFinanceChargeAssessmentInput;
}>;


export type DraftFinanceChargeAssessmentMutation = { __typename?: 'Mutation', draftFinanceChargeAssessment: { __typename?: 'FinanceChargeAssessment', id: string, assessmentNumber: string, asOfDate: string, annualRatePercent: number, status: string, totalChargeAmount: number, lines: Array<{ __typename?: 'FinanceChargeLine', invoiceId: string, invoiceNumber?: string | null, customerId: string, daysOverdue: number, outstandingBefore: number, chargeAmount: number, customer?: { __typename?: 'Customer', id: string, name: string, docNumber: string } | null }> } };

export type PostFinanceChargeAssessmentMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type PostFinanceChargeAssessmentMutation = { __typename?: 'Mutation', postFinanceChargeAssessment: { __typename?: 'FinanceChargeAssessment', id: string, assessmentNumber: string, status: string, postedAt?: string | null, totalChargeAmount: number } };

export type CancelFinanceChargeAssessmentMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type CancelFinanceChargeAssessmentMutation = { __typename?: 'Mutation', cancelFinanceChargeAssessment: { __typename?: 'FinanceChargeAssessment', id: string, status: string } };

export type GetPriceListsQueryVariables = Exact<{
  organizationId: Scalars['String']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetPriceListsQuery = { __typename?: 'Query', priceLists: Array<{ __typename?: 'PriceList', id: string, listNumber: string, title: string, categoryFilter?: string | null, generatedAt: string, createdAt: string, lines: Array<{ __typename?: 'PriceListLine', itemId: string, seqNo?: string | null, name: string, unit?: string | null, rate?: number | null, category?: string | null }> }> };

export type GeneratePriceListMutationVariables = Exact<{
  input: GeneratePriceListInput;
}>;


export type GeneratePriceListMutation = { __typename?: 'Mutation', generatePriceList: { __typename?: 'PriceList', id: string, listNumber: string, title: string, categoryFilter?: string | null, generatedAt: string, createdAt: string, lines: Array<{ __typename?: 'PriceListLine', itemId: string, seqNo?: string | null, name: string, unit?: string | null, rate?: number | null, category?: string | null }> } };

export type GetIndividualPriceListByCustomerQueryVariables = Exact<{
  organizationId: Scalars['String']['input'];
  customerId: Scalars['ID']['input'];
}>;


export type GetIndividualPriceListByCustomerQuery = { __typename?: 'Query', individualPriceListByCustomer?: { __typename?: 'IndividualPriceList', id: string, listNumber: string, title: string, notes?: string | null, createdAt: string, updatedAt: string, lines: Array<{ __typename?: 'IndividualPriceListLine', itemId: string, seqNo?: string | null, name: string, unit?: string | null, category?: string | null, standardRate?: number | null, customerRate?: number | null }> } | null };

export type UpsertIndividualPriceListMutationVariables = Exact<{
  input: UpsertIndividualPriceListInput;
}>;


export type UpsertIndividualPriceListMutation = { __typename?: 'Mutation', upsertIndividualPriceList: { __typename?: 'IndividualPriceList', id: string, listNumber: string, title: string, notes?: string | null, updatedAt: string, lines: Array<{ __typename?: 'IndividualPriceListLine', itemId: string, seqNo?: string | null, name: string, unit?: string | null, category?: string | null, standardRate?: number | null, customerRate?: number | null }> } };

export type SeedIndividualPriceListFromCatalogMutationVariables = Exact<{
  organizationId: Scalars['String']['input'];
  customerId: Scalars['ID']['input'];
}>;


export type SeedIndividualPriceListFromCatalogMutation = { __typename?: 'Mutation', seedIndividualPriceListFromCatalog: { __typename?: 'IndividualPriceList', id: string, listNumber: string, title: string, updatedAt: string, lines: Array<{ __typename?: 'IndividualPriceListLine', itemId: string, seqNo?: string | null, name: string, unit?: string | null, category?: string | null, standardRate?: number | null, customerRate?: number | null }> } };

export type GenerateCustomerStatementQueryVariables = Exact<{
  organizationId: Scalars['String']['input'];
  customerId: Scalars['ID']['input'];
  dateFrom: Scalars['String']['input'];
  dateTo: Scalars['String']['input'];
}>;


export type GenerateCustomerStatementQuery = { __typename?: 'Query', generateCustomerStatement: { __typename?: 'CustomerStatement', customerId: string, dateFrom: string, dateTo: string, periodInvoicesTotal: number, periodPaymentsTotal: number, currentBalance: number, customer?: { __typename?: 'Customer', id: string, name: string, docNumber: string } | null, lines: Array<{ __typename?: 'CustomerStatementLine', date: string, kind: string, reference: string, description?: string | null, debit?: number | null, credit?: number | null }> } };

export type GetProductionPlanningsQueryVariables = Exact<{
  organizationId: Scalars['String']['input'];
}>;


export type GetProductionPlanningsQuery = { __typename?: 'Query', productionplannings: Array<{ __typename?: 'ProductionPlanning', id: string, docNumber: string, docDate: string, projectId?: string | null, managerId?: string | null, budget?: number | null, actualCost?: number | null, progress?: number | null, status: string, createdAt: string, tasks?: Array<{ __typename?: 'Task', id: string, name: string, description?: string | null, assignedTo?: string | null, status: string, priority: string, startDate?: string | null, dueDate?: string | null, completedAt?: string | null }> | null, milestones?: Array<{ __typename?: 'Milestone', id: string, name: string, description?: string | null, dueDate?: string | null, status: string, completedAt?: string | null }> | null }> };

export type CreateProductionPlanningMutationVariables = Exact<{
  input: ProductionPlanningInput;
}>;


export type CreateProductionPlanningMutation = { __typename?: 'Mutation', createProductionPlanning: { __typename?: 'ProductionPlanning', id: string, docNumber: string } };

export type UpdateProductionPlanningMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: ProductionPlanningInput;
}>;


export type UpdateProductionPlanningMutation = { __typename?: 'Mutation', updateProductionPlanning: { __typename?: 'ProductionPlanning', id: string, docNumber: string } };

export type DeleteProductionPlanningMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteProductionPlanningMutation = { __typename?: 'Mutation', deleteProductionPlanning: boolean };

export type GetWorkOrdersQueryVariables = Exact<{
  organizationId: Scalars['String']['input'];
}>;


export type GetWorkOrdersQuery = { __typename?: 'Query', workorders: Array<{ __typename?: 'WorkOrder', id: string, docNumber: string, docDate: string, status: string, createdAt: string }> };

export type CreateWorkOrderMutationVariables = Exact<{
  input: WorkOrderInput;
}>;


export type CreateWorkOrderMutation = { __typename?: 'Mutation', createWorkOrder: { __typename?: 'WorkOrder', id: string, docNumber: string } };

export type GetVendorPaymentsQueryVariables = Exact<{
  organizationId: Scalars['ID']['input'];
  vendorId?: InputMaybe<Scalars['ID']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetVendorPaymentsQuery = { __typename?: 'Query', vendorPayments: Array<{ __typename?: 'VendorPayment', id: string, paymentNumber: string, vendorId: string, paymentDate: string, paymentMethod: string, referenceNumber?: string | null, totalAmount: number, notes?: string | null, status: string, organizationId: string, createdAt: string, vendor?: { __typename?: 'Vendor', id: string, name: string } | null, allocations: Array<{ __typename?: 'VendorPaymentAllocation', billId: string, amount: number }> }> };

export type GetVendorPaymentQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetVendorPaymentQuery = { __typename?: 'Query', vendorPayment?: { __typename?: 'VendorPayment', id: string, paymentNumber: string, vendorId: string, paymentDate: string, paymentMethod: string, referenceNumber?: string | null, totalAmount: number, notes?: string | null, status: string, organizationId: string, createdAt: string, vendor?: { __typename?: 'Vendor', id: string, name: string } | null, allocations: Array<{ __typename?: 'VendorPaymentAllocation', billId: string, billNumber?: string | null, amount: number }> } | null };

export type CreateVendorPaymentMutationVariables = Exact<{
  input: CreateVendorPaymentInput;
}>;


export type CreateVendorPaymentMutation = { __typename?: 'Mutation', createVendorPayment: { __typename?: 'VendorPayment', id: string, paymentNumber: string, status: string } };

export type UpdateVendorPaymentMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateVendorPaymentInput;
}>;


export type UpdateVendorPaymentMutation = { __typename?: 'Mutation', updateVendorPayment: { __typename?: 'VendorPayment', id: string, paymentNumber: string, status: string } };

export type DeleteVendorPaymentMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteVendorPaymentMutation = { __typename?: 'Mutation', deleteVendorPayment: boolean };

export type GetVendorBillsQueryVariables = Exact<{
  organizationId: Scalars['ID']['input'];
  vendorId?: InputMaybe<Scalars['ID']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetVendorBillsQuery = { __typename?: 'Query', vendorBills: Array<{ __typename?: 'VendorBill', id: string, billNumber: string, vendorId: string, billDate: string, dueDate: string, subtotal: number, discountAmount?: number | null, taxAmount?: number | null, totalAmount: number, paidAmount: number, outstandingAmount: number, notes?: string | null, status: string, organizationId: string, createdAt?: string | null, vendor?: { __typename?: 'Vendor', id: string, name: string } | null }> };

export type GetVendorBillQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetVendorBillQuery = { __typename?: 'Query', vendorBill?: { __typename?: 'VendorBill', id: string, billNumber: string, vendorId: string, purchaseOrderId?: string | null, billDate: string, dueDate: string, subtotal: number, discountAmount?: number | null, taxAmount?: number | null, totalAmount: number, paidAmount: number, outstandingAmount: number, notes?: string | null, status: string, organizationId: string, createdAt?: string | null, vendor?: { __typename?: 'Vendor', id: string, name: string, email?: string | null } | null, lineItems: Array<{ __typename?: 'VendorBillLineItem', description: string, quantity: number, unitPrice: number, discount?: number | null, tax?: number | null, total: number }> } | null };

export type GetOutstandingVendorBillsQueryVariables = Exact<{
  organizationId: Scalars['ID']['input'];
}>;


export type GetOutstandingVendorBillsQuery = { __typename?: 'Query', outstandingVendorBills: Array<{ __typename?: 'VendorBill', id: string, billNumber: string, vendorId: string, dueDate: string, totalAmount: number, paidAmount: number, outstandingAmount: number, status: string, vendor?: { __typename?: 'Vendor', id: string, name: string } | null }> };

export type CreateVendorBillMutationVariables = Exact<{
  input: CreateVendorBillInput;
}>;


export type CreateVendorBillMutation = { __typename?: 'Mutation', createVendorBill: { __typename?: 'VendorBill', id: string, billNumber: string, status: string } };

export type UpdateVendorBillMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateVendorBillInput;
}>;


export type UpdateVendorBillMutation = { __typename?: 'Mutation', updateVendorBill: { __typename?: 'VendorBill', id: string, billNumber: string, status: string } };

export type ApproveVendorBillMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type ApproveVendorBillMutation = { __typename?: 'Mutation', approveVendorBill: { __typename?: 'VendorBill', id: string, billNumber: string, status: string } };

export type SubmitVendorBillForApprovalMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type SubmitVendorBillForApprovalMutation = { __typename?: 'Mutation', submitVendorBillForApproval: { __typename?: 'VendorBill', id: string, billNumber: string, status: string } };

export type DeleteVendorBillMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteVendorBillMutation = { __typename?: 'Mutation', deleteVendorBill: boolean };

export type GetMaterialReceiptsQueryVariables = Exact<{
  organizationId: Scalars['ID']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetMaterialReceiptsQuery = { __typename?: 'Query', materialreceipts: Array<{ __typename?: 'MaterialReceipt', id: string, mrnNumber: string, purchaseOrderId?: string | null, purchaseOrderNumber?: string | null, vendorId?: string | null, vendorName?: string | null, receiptDate: string, warehouseId?: string | null, warehouseName?: string | null, totalAmount: number, status: string, notes?: string | null, organizationId: string, createdAt?: string | null, updatedAt?: string | null, lineItems: Array<{ __typename?: 'MRNLineItem', itemDescription: string, orderedQty: number, receivedQty: number, rejectedQty?: number | null, unit?: string | null, unitPrice: number, lineTotal: number }> }> };

export type GetMaterialReceiptQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetMaterialReceiptQuery = { __typename?: 'Query', materialreceipt?: { __typename?: 'MaterialReceipt', id: string, mrnNumber: string, purchaseOrderId?: string | null, purchaseOrderNumber?: string | null, vendorId?: string | null, vendorName?: string | null, receiptDate: string, warehouseId?: string | null, warehouseName?: string | null, totalAmount: number, status: string, notes?: string | null, organizationId: string, createdAt?: string | null, updatedAt?: string | null, lineItems: Array<{ __typename?: 'MRNLineItem', itemId?: string | null, itemDescription: string, orderedQty: number, receivedQty: number, rejectedQty?: number | null, unit?: string | null, unitPrice: number, lineTotal: number }> } | null };

export type CreateMaterialReceiptMutationVariables = Exact<{
  input: CreateMaterialReceiptInput;
}>;


export type CreateMaterialReceiptMutation = { __typename?: 'Mutation', createMaterialReceipt: { __typename?: 'MaterialReceipt', id: string, mrnNumber: string, status: string } };

export type UpdateMaterialReceiptMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateMaterialReceiptInput;
}>;


export type UpdateMaterialReceiptMutation = { __typename?: 'Mutation', updateMaterialReceipt: { __typename?: 'MaterialReceipt', id: string, mrnNumber: string, status: string } };

export type ConfirmMaterialReceiptMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type ConfirmMaterialReceiptMutation = { __typename?: 'Mutation', confirmMaterialReceipt: { __typename?: 'MaterialReceipt', id: string, mrnNumber: string, status: string } };

export type CancelMaterialReceiptMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type CancelMaterialReceiptMutation = { __typename?: 'Mutation', cancelMaterialReceipt: { __typename?: 'MaterialReceipt', id: string, mrnNumber: string, status: string } };

export type SubmitMaterialReceiptForApprovalMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type SubmitMaterialReceiptForApprovalMutation = { __typename?: 'Mutation', submitMaterialReceiptForApproval: { __typename?: 'MaterialReceipt', id: string, mrnNumber: string, status: string } };

export type DeleteMaterialReceiptMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteMaterialReceiptMutation = { __typename?: 'Mutation', deleteMaterialReceipt: boolean };

export type GetGoodsReceiptsQueryVariables = Exact<{
  organizationId: Scalars['String']['input'];
}>;


export type GetGoodsReceiptsQuery = { __typename?: 'Query', goodsreceipts: Array<{ __typename?: 'GoodsReceipt', id: string, docNumber: string, docDate: string, status: string, createdAt: string }> };

export type CreateGoodsReceiptMutationVariables = Exact<{
  input: GoodsReceiptInput;
}>;


export type CreateGoodsReceiptMutation = { __typename?: 'Mutation', createGoodsReceipt: { __typename?: 'GoodsReceipt', id: string, docNumber: string, docDate: string, status: string, createdAt: string } };

export type UpdateGoodsReceiptMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: GoodsReceiptInput;
}>;


export type UpdateGoodsReceiptMutation = { __typename?: 'Mutation', updateGoodsReceipt: { __typename?: 'GoodsReceipt', id: string, docNumber: string, docDate: string, status: string, createdAt: string } };

export type DeleteGoodsReceiptMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteGoodsReceiptMutation = { __typename?: 'Mutation', deleteGoodsReceipt: boolean };

export type GetGrNsQueryVariables = Exact<{
  organizationId: Scalars['ID']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetGrNsQuery = { __typename?: 'Query', grns: Array<{ __typename?: 'GRN', id: string, grnNumber: string, purchaseOrderId?: string | null, vendorId?: string | null, vendorName?: string | null, receivedDate: string, notes?: string | null, status: string, organizationId: string, createdAt?: string | null, lineItems: Array<{ __typename?: 'GRNLineItem', itemDescription: string, orderedQty: number, receivedQty: number, unitPrice?: number | null }> }> };

export type CreateGrnMutationVariables = Exact<{
  input: CreateGrnInput;
}>;


export type CreateGrnMutation = { __typename?: 'Mutation', createGRN: { __typename?: 'GRN', id: string, grnNumber: string, receivedDate: string, status: string, lineItems: Array<{ __typename?: 'GRNLineItem', itemDescription: string, orderedQty: number, receivedQty: number, unitPrice?: number | null }> } };

export type UpdateGrnMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateGrnInput;
}>;


export type UpdateGrnMutation = { __typename?: 'Mutation', updateGRN: { __typename?: 'GRN', id: string, grnNumber: string, receivedDate: string, status: string, notes?: string | null, lineItems: Array<{ __typename?: 'GRNLineItem', itemDescription: string, orderedQty: number, receivedQty: number, unitPrice?: number | null }> } };

export type SubmitGrnForApprovalMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type SubmitGrnForApprovalMutation = { __typename?: 'Mutation', submitGRNForApproval: { __typename?: 'GRN', id: string, grnNumber: string, status: string } };

export type DeleteGrnMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteGrnMutation = { __typename?: 'Mutation', deleteGRN: boolean };

export type GetDeliveryChallansQueryVariables = Exact<{
  organizationId: Scalars['String']['input'];
}>;


export type GetDeliveryChallansQuery = { __typename?: 'Query', deliverychallans: Array<{ __typename?: 'DeliveryChallan', id: string, docNumber: string, docDate: string, status: string, createdAt: string }> };

export type CreateDeliveryChallanMutationVariables = Exact<{
  input: DeliveryChallanInput;
}>;


export type CreateDeliveryChallanMutation = { __typename?: 'Mutation', createDeliveryChallan: { __typename?: 'DeliveryChallan', id: string, docNumber: string, status: string } };

export type SubmitDeliveryChallanForApprovalMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type SubmitDeliveryChallanForApprovalMutation = { __typename?: 'Mutation', submitDeliveryChallanForApproval: { __typename?: 'DeliveryChallan', id: string, docNumber: string, status: string } };

export type GetSalesReturnsQueryVariables = Exact<{
  organizationId: Scalars['String']['input'];
}>;


export type GetSalesReturnsQuery = { __typename?: 'Query', salesreturns: Array<{ __typename?: 'SalesReturn', id: string, docNumber: string, docDate: string, status: string, createdAt: string }> };

export type CreateSalesReturnMutationVariables = Exact<{
  input: SalesReturnInput;
}>;


export type CreateSalesReturnMutation = { __typename?: 'Mutation', createSalesReturn: { __typename?: 'SalesReturn', id: string, docNumber: string, status: string } };

export type SubmitSalesReturnForApprovalMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type SubmitSalesReturnForApprovalMutation = { __typename?: 'Mutation', submitSalesReturnForApproval: { __typename?: 'SalesReturn', id: string, docNumber: string, status: string } };

export type GetStockAdjustmentsQueryVariables = Exact<{
  organizationId: Scalars['ID']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetStockAdjustmentsQuery = { __typename?: 'Query', stockadjustments: Array<{ __typename?: 'StockAdjustment', id: string, adjNumber: string, adjDate: string, warehouseId?: string | null, warehouseName?: string | null, adjustmentType: string, reason?: string | null, status: string, notes?: string | null, organizationId: string, createdAt?: string | null, lineItems: Array<{ __typename?: 'SALineItem', itemDescription: string, currentQty: number, adjustedQty: number, difference: number, unit?: string | null }> }> };

export type CreateStockAdjustmentMutationVariables = Exact<{
  input: CreateStockAdjustmentInput;
}>;


export type CreateStockAdjustmentMutation = { __typename?: 'Mutation', createStockAdjustment: { __typename?: 'StockAdjustment', id: string, adjNumber: string, status: string } };

export type UpdateStockAdjustmentMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateStockAdjustmentInput;
}>;


export type UpdateStockAdjustmentMutation = { __typename?: 'Mutation', updateStockAdjustment: { __typename?: 'StockAdjustment', id: string, adjNumber: string, status: string } };

export type ConfirmStockAdjustmentMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type ConfirmStockAdjustmentMutation = { __typename?: 'Mutation', confirmStockAdjustment: { __typename?: 'StockAdjustment', id: string, adjNumber: string, status: string } };

export type CancelStockAdjustmentMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type CancelStockAdjustmentMutation = { __typename?: 'Mutation', cancelStockAdjustment: { __typename?: 'StockAdjustment', id: string, adjNumber: string, status: string } };

export type DeleteStockAdjustmentMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteStockAdjustmentMutation = { __typename?: 'Mutation', deleteStockAdjustment: boolean };

export type GetStockTransfersQueryVariables = Exact<{
  organizationId: Scalars['ID']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetStockTransfersQuery = { __typename?: 'Query', stocktransfers: Array<{ __typename?: 'StockTransfer', id: string, transferNumber: string, transferDate: string, fromWarehouseId?: string | null, fromWarehouseName?: string | null, toWarehouseId?: string | null, toWarehouseName?: string | null, status: string, notes?: string | null, organizationId: string, createdAt?: string | null, lineItems: Array<{ __typename?: 'STLineItem', itemDescription: string, qty: number, unit?: string | null }> }> };

export type CreateStockTransferMutationVariables = Exact<{
  input: CreateStockTransferInput;
}>;


export type CreateStockTransferMutation = { __typename?: 'Mutation', createStockTransfer: { __typename?: 'StockTransfer', id: string, transferNumber: string, status: string } };

export type UpdateStockTransferMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateStockTransferInput;
}>;


export type UpdateStockTransferMutation = { __typename?: 'Mutation', updateStockTransfer: { __typename?: 'StockTransfer', id: string, transferNumber: string, status: string } };

export type ConfirmStockTransferMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type ConfirmStockTransferMutation = { __typename?: 'Mutation', confirmStockTransfer: { __typename?: 'StockTransfer', id: string, transferNumber: string, status: string } };

export type CancelStockTransferMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type CancelStockTransferMutation = { __typename?: 'Mutation', cancelStockTransfer: { __typename?: 'StockTransfer', id: string, transferNumber: string, status: string } };

export type DeleteStockTransferMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteStockTransferMutation = { __typename?: 'Mutation', deleteStockTransfer: boolean };

export type GetAssetsQueryVariables = Exact<{
  organizationId: Scalars['String']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  assetType?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetAssetsQuery = { __typename?: 'Query', assets: Array<{ __typename?: 'Asset', id: string, assetNumber: string, assetName: string, assetType: string, category: string, purchaseDate: string, purchasePrice: number, currentValue: number, depreciationMethod: string, usefulLife: number, location: string, assignedTo?: string | null, status: string, serialNumber?: string | null, manufacturer?: string | null, warrantyExpiry?: string | null, organizationId: string, createdAt: string, updatedAt: string }> };

export type CreateAssetMutationVariables = Exact<{
  input: AssetInput;
}>;


export type CreateAssetMutation = { __typename?: 'Mutation', createAsset: { __typename?: 'Asset', id: string, assetNumber: string, assetName: string, status: string } };

export type UpdateAssetMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: AssetInput;
}>;


export type UpdateAssetMutation = { __typename?: 'Mutation', updateAsset: { __typename?: 'Asset', id: string, assetNumber: string, assetName: string, status: string } };

export type DeleteAssetMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteAssetMutation = { __typename?: 'Mutation', deleteAsset: boolean };

export type GetIntercompanyTransfersQueryVariables = Exact<{
  organizationId: Scalars['ID']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetIntercompanyTransfersQuery = { __typename?: 'Query', intercompanyTransfers: Array<{ __typename?: 'IntercompanyTransfer', id: string, transferNumber: string, transferDate: string, fromOrganizationId: string, fromOrganizationName?: string | null, toOrganizationId: string, toOrganizationName?: string | null, status: string, notes?: string | null, organizationId: string, createdAt?: string | null, lineItems: Array<{ __typename?: 'ICTLineItem', itemDescription: string, qty: number, unit?: string | null }> }> };

export type CreateIntercompanyTransferMutationVariables = Exact<{
  input: CreateIntercompanyTransferInput;
}>;


export type CreateIntercompanyTransferMutation = { __typename?: 'Mutation', createIntercompanyTransfer: { __typename?: 'IntercompanyTransfer', id: string, transferNumber: string, status: string } };

export type UpdateIntercompanyTransferMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateIntercompanyTransferInput;
}>;


export type UpdateIntercompanyTransferMutation = { __typename?: 'Mutation', updateIntercompanyTransfer: { __typename?: 'IntercompanyTransfer', id: string, transferNumber: string, status: string } };

export type ConfirmIntercompanyTransferMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type ConfirmIntercompanyTransferMutation = { __typename?: 'Mutation', confirmIntercompanyTransfer: { __typename?: 'IntercompanyTransfer', id: string, transferNumber: string, status: string } };

export type CancelIntercompanyTransferMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type CancelIntercompanyTransferMutation = { __typename?: 'Mutation', cancelIntercompanyTransfer: { __typename?: 'IntercompanyTransfer', id: string, transferNumber: string, status: string } };

export type DeleteIntercompanyTransferMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteIntercompanyTransferMutation = { __typename?: 'Mutation', deleteIntercompanyTransfer: boolean };

export type GetPayrollManagementsQueryVariables = Exact<{
  organizationId: Scalars['String']['input'];
}>;


export type GetPayrollManagementsQuery = { __typename?: 'Query', payrollmanagements: Array<{ __typename?: 'PayrollManagement', id: string, docNumber: string, docDate: string, status: string, organizationId: string, createdAt: string, title?: string | null, remarks?: string | null, payPeriodStart?: string | null, payPeriodEnd?: string | null }> };

export type CreatePayrollManagementMutationVariables = Exact<{
  input: PayrollManagementInput;
}>;


export type CreatePayrollManagementMutation = { __typename?: 'Mutation', createPayrollManagement: { __typename?: 'PayrollManagement', id: string, docNumber: string } };

export type UpdatePayrollManagementMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: PayrollManagementInput;
}>;


export type UpdatePayrollManagementMutation = { __typename?: 'Mutation', updatePayrollManagement: { __typename?: 'PayrollManagement', id: string, docNumber: string } };

export type DeletePayrollManagementMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeletePayrollManagementMutation = { __typename?: 'Mutation', deletePayrollManagement: boolean };

export type SubmitPayrollManagementForApprovalMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type SubmitPayrollManagementForApprovalMutation = { __typename?: 'Mutation', submitPayrollManagementForApproval: { __typename?: 'PayrollManagement', id: string, docNumber: string, status: string } };

export type GetSalaryProcessingsQueryVariables = Exact<{
  organizationId: Scalars['String']['input'];
}>;


export type GetSalaryProcessingsQuery = { __typename?: 'Query', salaryprocessings: Array<{ __typename?: 'SalaryProcessing', id: string, docNumber: string, docDate: string, status: string, organizationId: string, createdAt: string, title?: string | null, remarks?: string | null, payPeriodStart?: string | null, payPeriodEnd?: string | null }> };

export type CreateSalaryProcessingMutationVariables = Exact<{
  input: SalaryProcessingInput;
}>;


export type CreateSalaryProcessingMutation = { __typename?: 'Mutation', createSalaryProcessing: { __typename?: 'SalaryProcessing', id: string, docNumber: string } };

export type UpdateSalaryProcessingMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: SalaryProcessingInput;
}>;


export type UpdateSalaryProcessingMutation = { __typename?: 'Mutation', updateSalaryProcessing: { __typename?: 'SalaryProcessing', id: string, docNumber: string } };

export type DeleteSalaryProcessingMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteSalaryProcessingMutation = { __typename?: 'Mutation', deleteSalaryProcessing: boolean };

export type GetLoanRepaymentsQueryVariables = Exact<{
  organizationId: Scalars['String']['input'];
}>;


export type GetLoanRepaymentsQuery = { __typename?: 'Query', loanrepayments: Array<{ __typename?: 'LoanRepayment', id: string, docNumber: string, docDate: string, status: string, organizationId: string, createdAt: string, title?: string | null, remarks?: string | null, payPeriodStart?: string | null, payPeriodEnd?: string | null, employeeNo?: string | null, employeeName?: string | null, loanReference?: string | null, repaymentAmount: number }> };

export type CreateLoanRepaymentMutationVariables = Exact<{
  input: LoanRepaymentInput;
}>;


export type CreateLoanRepaymentMutation = { __typename?: 'Mutation', createLoanRepayment: { __typename?: 'LoanRepayment', id: string, docNumber: string } };

export type UpdateLoanRepaymentMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: LoanRepaymentInput;
}>;


export type UpdateLoanRepaymentMutation = { __typename?: 'Mutation', updateLoanRepayment: { __typename?: 'LoanRepayment', id: string, docNumber: string } };

export type DeleteLoanRepaymentMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteLoanRepaymentMutation = { __typename?: 'Mutation', deleteLoanRepayment: boolean };

export type GetSiteLocationsQueryVariables = Exact<{
  organizationId: Scalars['String']['input'];
}>;


export type GetSiteLocationsQuery = { __typename?: 'Query', siteLocations: Array<{ __typename?: 'SiteLocation', id: string, seqNo?: string | null, name: string, address?: string | null, city?: string | null, state?: string | null, country?: string | null, zipCode?: string | null, contactPerson?: string | null, phone?: string | null, email?: string | null, status: string, createdAt: string }> };

export type CreateSiteLocationMutationVariables = Exact<{
  input: SiteLocationInput;
}>;


export type CreateSiteLocationMutation = { __typename?: 'Mutation', createSiteLocation: { __typename?: 'SiteLocation', id: string, seqNo?: string | null, name: string } };

export type UpdateSiteLocationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: SiteLocationInput;
}>;


export type UpdateSiteLocationMutation = { __typename?: 'Mutation', updateSiteLocation: { __typename?: 'SiteLocation', id: string, name: string } };

export type DeleteSiteLocationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteSiteLocationMutation = { __typename?: 'Mutation', deleteSiteLocation: boolean };

export type GetContractorsQueryVariables = Exact<{
  organizationId: Scalars['String']['input'];
}>;


export type GetContractorsQuery = { __typename?: 'Query', contractors: Array<{ __typename?: 'Contractor', id: string, seqNo?: string | null, name: string, contactPerson?: string | null, email?: string | null, phone?: string | null, address?: string | null, specialty?: string | null, status: string, createdAt: string }> };

export type CreateContractorMutationVariables = Exact<{
  input: ContractorInput;
}>;


export type CreateContractorMutation = { __typename?: 'Mutation', createContractor: { __typename?: 'Contractor', id: string, seqNo?: string | null, name: string } };

export type UpdateContractorMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: ContractorInput;
}>;


export type UpdateContractorMutation = { __typename?: 'Mutation', updateContractor: { __typename?: 'Contractor', id: string, name: string } };

export type DeleteContractorMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteContractorMutation = { __typename?: 'Mutation', deleteContractor: boolean };

export type GetLeadsQueryVariables = Exact<{
  organizationId: Scalars['String']['input'];
  status?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetLeadsQuery = { __typename?: 'Query', leads: Array<{ __typename?: 'Lead', id: string, seqNo?: string | null, firstName: string, lastName: string, company?: string | null, title?: string | null, email?: string | null, phone?: string | null, source?: string | null, status: string, rating?: string | null, estimatedValue?: number | null, expectedCloseDate?: string | null, assignedTo?: string | null, notes?: string | null, createdAt: string }> };

export type CreateLeadMutationVariables = Exact<{
  input: LeadInput;
}>;


export type CreateLeadMutation = { __typename?: 'Mutation', createLead: { __typename?: 'Lead', id: string, seqNo?: string | null } };

export type UpdateLeadMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: LeadInput;
}>;


export type UpdateLeadMutation = { __typename?: 'Mutation', updateLead: { __typename?: 'Lead', id: string } };

export type DeleteLeadMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteLeadMutation = { __typename?: 'Mutation', deleteLead: boolean };

export type ConvertLeadToOpportunityMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type ConvertLeadToOpportunityMutation = { __typename?: 'Mutation', convertLeadToOpportunity: string };

export type GetOpportunitiesQueryVariables = Exact<{
  organizationId: Scalars['String']['input'];
  stage?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetOpportunitiesQuery = { __typename?: 'Query', opportunities: Array<{ __typename?: 'Opportunity', id: string, seqNo?: string | null, name: string, accountName?: string | null, contactName?: string | null, email?: string | null, phone?: string | null, amount?: number | null, closeDate?: string | null, stage: string, probability?: number | null, leadSource?: string | null, nextStep?: string | null, description?: string | null, assignedTo?: string | null, createdAt: string }> };

export type CreateOpportunityMutationVariables = Exact<{
  input: OpportunityInput;
}>;


export type CreateOpportunityMutation = { __typename?: 'Mutation', createOpportunity: { __typename?: 'Opportunity', id: string, seqNo?: string | null } };

export type UpdateOpportunityMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: OpportunityInput;
}>;


export type UpdateOpportunityMutation = { __typename?: 'Mutation', updateOpportunity: { __typename?: 'Opportunity', id: string } };

export type DeleteOpportunityMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteOpportunityMutation = { __typename?: 'Mutation', deleteOpportunity: boolean };

export type GetPayrollUiRecordsQueryVariables = Exact<{
  organizationId: Scalars['String']['input'];
  category: Scalars['String']['input'];
}>;


export type GetPayrollUiRecordsQuery = { __typename?: 'Query', payrolluirecords: Array<{ __typename?: 'PayrollUiRecord', id: string, organizationId: string, category: string, code?: string | null, data: string, approvalStatus: string, createdAt: string, updatedAt: string }> };

export type CreatePayrollUiRecordMutationVariables = Exact<{
  input: PayrollUiRecordInput;
}>;


export type CreatePayrollUiRecordMutation = { __typename?: 'Mutation', createPayrollUiRecord: { __typename?: 'PayrollUiRecord', id: string, category: string, code?: string | null } };

export type UpdatePayrollUiRecordMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: PayrollUiRecordInput;
}>;


export type UpdatePayrollUiRecordMutation = { __typename?: 'Mutation', updatePayrollUiRecord: { __typename?: 'PayrollUiRecord', id: string, category: string, code?: string | null } };

export type DeletePayrollUiRecordMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeletePayrollUiRecordMutation = { __typename?: 'Mutation', deletePayrollUiRecord: boolean };

export type GetExtractionsQueryVariables = Exact<{
  organizationId: Scalars['String']['input'];
  status?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetExtractionsQuery = { __typename?: 'Query', extractions: Array<{ __typename?: 'Extraction', id: string, extractionNumber: string, extractionDate: string, rawMaterialId: string, rawMaterialName: string, quantity: number, unit: string, sourceLocation: string, extractionType: string, status: string, createdAt: string }> };

export type CreateExtractionMutationVariables = Exact<{
  input: ExtractionInput;
}>;


export type CreateExtractionMutation = { __typename?: 'Mutation', createExtraction: { __typename?: 'Extraction', id: string, extractionNumber: string } };

export type GetRawMaterialRequisitionsQueryVariables = Exact<{
  organizationId: Scalars['String']['input'];
  status?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetRawMaterialRequisitionsQuery = { __typename?: 'Query', rawMaterialRequisitions: Array<{ __typename?: 'RawMaterialRequisition', id: string, requisitionNumber: string, requisitionDate: string, requiredDate: string, rawMaterialId: string, requestedQuantity: number, unit: string, purpose: string, status: string, createdAt: string }> };

export type CreateRawMaterialRequisitionMutationVariables = Exact<{
  input: RawMaterialRequisitionInput;
}>;


export type CreateRawMaterialRequisitionMutation = { __typename?: 'Mutation', createRawMaterialRequisition: { __typename?: 'RawMaterialRequisition', id: string, requisitionNumber: string } };

export type GetClientsQueryVariables = Exact<{
  organizationId?: InputMaybe<Scalars['ID']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetClientsQuery = { __typename?: 'Query', clients: Array<{ __typename?: 'Client', id: string, seqNo?: string | null, name: string, email: string, phone?: string | null, company?: string | null, address?: string | null, city?: string | null, state?: string | null, country?: string | null, zipCode?: string | null, website?: string | null, industry?: string | null, notes?: string | null, status: string, organizationId: string, createdAt: string }> };

export type GetClientQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetClientQuery = { __typename?: 'Query', client?: { __typename?: 'Client', id: string, seqNo?: string | null, name: string, email: string, phone?: string | null, company?: string | null, address?: string | null, city?: string | null, state?: string | null, country?: string | null, zipCode?: string | null, website?: string | null, industry?: string | null, notes?: string | null, status: string, organizationId: string, createdAt: string } | null };

export type GetClientsByOrganizationQueryVariables = Exact<{
  organizationId: Scalars['ID']['input'];
}>;


export type GetClientsByOrganizationQuery = { __typename?: 'Query', clientsByOrganization: Array<{ __typename?: 'Client', id: string, name: string, email: string, phone?: string | null, company?: string | null, status: string }> };

export type CreateClientMutationVariables = Exact<{
  input: CreateClientInput;
}>;


export type CreateClientMutation = { __typename?: 'Mutation', createClient: { __typename?: 'Client', id: string, name: string, email: string, status: string } };

export type UpdateClientMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateClientInput;
}>;


export type UpdateClientMutation = { __typename?: 'Mutation', updateClient: { __typename?: 'Client', id: string, name: string, email: string, status: string } };

export type DeleteClientMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteClientMutation = { __typename?: 'Mutation', deleteClient: boolean };

export type GetQuotationsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetQuotationsQuery = { __typename?: 'Query', quotations: Array<{ __typename?: 'Quotation', id: string, seqNo?: string | null, quotationNumber: string, subject: string, quotationDate: string, validUntil: string, subtotal: number, taxAmount?: number | null, discountAmount?: number | null, totalAmount: number, terms?: string | null, notes?: string | null, status: string, sentAt?: string | null, sentBy?: string | null, organizationId: string, createdAt: string, clientId: { __typename?: 'ClientRef', id: string, name: string, email?: string | null }, lineItems: Array<{ __typename?: 'QuotationLineItem', itemId?: string | null, description: string, quantity: number, unitPrice: number, discount?: number | null, tax?: number | null, total: number }> }> };

export type GetQuotationQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetQuotationQuery = { __typename?: 'Query', quotation?: { __typename?: 'Quotation', id: string, seqNo?: string | null, quotationNumber: string, subject: string, quotationDate: string, validUntil: string, subtotal: number, taxAmount?: number | null, discountAmount?: number | null, totalAmount: number, terms?: string | null, notes?: string | null, status: string, sentAt?: string | null, sentBy?: string | null, organizationId: string, createdAt: string, clientId: { __typename?: 'ClientRef', id: string, name: string, email?: string | null }, lineItems: Array<{ __typename?: 'QuotationLineItem', itemId?: string | null, description: string, quantity: number, unitPrice: number, discount?: number | null, tax?: number | null, total: number }> } | null };

export type GetQuotationsByOrganizationQueryVariables = Exact<{
  organizationId: Scalars['ID']['input'];
}>;


export type GetQuotationsByOrganizationQuery = { __typename?: 'Query', quotationsByOrganization: Array<{ __typename?: 'Quotation', id: string, quotationNumber: string, subject: string, quotationDate: string, validUntil: string, totalAmount: number, status: string, sentAt?: string | null, clientId: { __typename?: 'ClientRef', id: string, name: string, email?: string | null } }> };

export type GetQuotationsByClientQueryVariables = Exact<{
  clientId: Scalars['ID']['input'];
}>;


export type GetQuotationsByClientQuery = { __typename?: 'Query', quotationsByClient: Array<{ __typename?: 'Quotation', id: string, quotationNumber: string, subject: string, quotationDate: string, validUntil: string, totalAmount: number, status: string, sentAt?: string | null }> };

export type CreateQuotationMutationVariables = Exact<{
  input: CreateQuotationInput;
}>;


export type CreateQuotationMutation = { __typename?: 'Mutation', createQuotation: { __typename?: 'Quotation', id: string, quotationNumber: string, status: string } };

export type UpdateQuotationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateQuotationInput;
}>;


export type UpdateQuotationMutation = { __typename?: 'Mutation', updateQuotation: { __typename?: 'Quotation', id: string, quotationNumber: string, status: string } };

export type DeleteQuotationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteQuotationMutation = { __typename?: 'Mutation', deleteQuotation: boolean };

export type SendQuotationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type SendQuotationMutation = { __typename?: 'Mutation', sendQuotation: { __typename?: 'SendQuotationResult', emailSent: boolean, quotation: { __typename?: 'Quotation', id: string, quotationNumber: string, status: string, sentAt?: string | null, sentBy?: string | null } } };

export type GetProductsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetProductsQuery = { __typename?: 'Query', products: Array<{ __typename?: 'Product', id: string, seqNo?: string | null, name: string, sku: string, description?: string | null, category?: string | null, brand?: string | null, unit: string, price: number, costPrice?: number | null, taxRate?: number | null, minStockLevel?: number | null, maxStockLevel?: number | null, reorderPoint?: number | null, barcode?: string | null, status: string, organizationId: string, createdAt: string }> };

export type GetProductQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetProductQuery = { __typename?: 'Query', product?: { __typename?: 'Product', id: string, seqNo?: string | null, name: string, sku: string, description?: string | null, category?: string | null, brand?: string | null, unit: string, price: number, costPrice?: number | null, taxRate?: number | null, minStockLevel?: number | null, maxStockLevel?: number | null, reorderPoint?: number | null, barcode?: string | null, status: string, organizationId: string, createdAt: string } | null };

export type GetProductsByOrganizationQueryVariables = Exact<{
  organizationId: Scalars['ID']['input'];
}>;


export type GetProductsByOrganizationQuery = { __typename?: 'Query', productsByOrganization: Array<{ __typename?: 'Product', id: string, name: string, sku: string, price: number, status: string }> };

export type CreateProductMutationVariables = Exact<{
  input: CreateProductInput;
}>;


export type CreateProductMutation = { __typename?: 'Mutation', createProduct: { __typename?: 'Product', id: string, name: string, sku: string } };

export type UpdateProductMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateProductInput;
}>;


export type UpdateProductMutation = { __typename?: 'Mutation', updateProduct: { __typename?: 'Product', id: string, name: string, sku: string } };

export type DeleteProductMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteProductMutation = { __typename?: 'Mutation', deleteProduct: boolean };

export type GetVendorCreditsQueryVariables = Exact<{
  organizationId: Scalars['ID']['input'];
  vendorId?: InputMaybe<Scalars['ID']['input']>;
}>;


export type GetVendorCreditsQuery = { __typename?: 'Query', vendorCredits: Array<{ __typename?: 'VendorCredit', id: string, creditNumber: string, vendorId: string, creditDate: string, totalAmount: number, appliedAmount: number, remainingAmount: number, reason?: string | null, notes?: string | null, status: string, organizationId: string, createdAt?: string | null, vendor?: { __typename?: 'Vendor', id: string, name: string } | null }> };

export type CreateVendorCreditMutationVariables = Exact<{
  input: CreateVendorCreditInput;
}>;


export type CreateVendorCreditMutation = { __typename?: 'Mutation', createVendorCredit: { __typename?: 'VendorCredit', id: string, creditNumber: string, status: string } };

export type DeleteVendorCreditMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteVendorCreditMutation = { __typename?: 'Mutation', deleteVendorCredit: boolean };

export type GetVendorPrepaymentsQueryVariables = Exact<{
  organizationId: Scalars['ID']['input'];
  vendorId?: InputMaybe<Scalars['ID']['input']>;
}>;


export type GetVendorPrepaymentsQuery = { __typename?: 'Query', vendorPrepayments: Array<{ __typename?: 'VendorPrepayment', id: string, prepaymentNumber: string, vendorId: string, prepaymentDate: string, amount: number, appliedAmount: number, remainingAmount: number, paymentMethod: string, referenceNumber?: string | null, notes?: string | null, status: string, organizationId: string, createdAt?: string | null, vendor?: { __typename?: 'Vendor', id: string, name: string } | null }> };

export type CreateVendorPrepaymentMutationVariables = Exact<{
  input: CreateVendorPrepaymentInput;
}>;


export type CreateVendorPrepaymentMutation = { __typename?: 'Mutation', createVendorPrepayment: { __typename?: 'VendorPrepayment', id: string, prepaymentNumber: string, status: string } };

export type DeleteVendorPrepaymentMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteVendorPrepaymentMutation = { __typename?: 'Mutation', deleteVendorPrepayment: boolean };

export type GetPurchaseOrdersForBillingQueryVariables = Exact<{
  organizationId: Scalars['ID']['input'];
}>;


export type GetPurchaseOrdersForBillingQuery = { __typename?: 'Query', purchaseorders: Array<{ __typename?: 'PurchaseOrder', id: string, seqNo?: string | null, vendorId?: string | null, vendorName?: string | null, projectId?: string | null, projectName?: string | null, totalAmount?: number | null, status: string, orderDate?: string | null, organizationId: string }> };

export type GetJournalEntriesQueryVariables = Exact<{
  organizationId: Scalars['String']['input'];
  status?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetJournalEntriesQuery = { __typename?: 'Query', journalEntries: Array<{ __typename?: 'JournalEntry', id: string, seqNo?: string | null, entryNumber: string, entryDate: string, referenceNumber?: string | null, description: string, totalDebit: number, totalCredit: number, status: string, postedAt?: string | null, createdAt: string, lines: Array<{ __typename?: 'JournalEntryLine', accountCode: string, accountName: string, debit: number, credit: number, description?: string | null }> }> };

export type CreateJournalEntryMutationVariables = Exact<{
  input: JournalEntryInput;
}>;


export type CreateJournalEntryMutation = { __typename?: 'Mutation', createJournalEntry: { __typename?: 'JournalEntry', id: string, seqNo?: string | null, entryNumber: string } };

export type UpdateJournalEntryMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: JournalEntryInput;
}>;


export type UpdateJournalEntryMutation = { __typename?: 'Mutation', updateJournalEntry: { __typename?: 'JournalEntry', id: string, entryNumber: string } };

export type PostJournalEntryMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type PostJournalEntryMutation = { __typename?: 'Mutation', postJournalEntry: { __typename?: 'JournalEntry', id: string, status: string, postedAt?: string | null } };

export type DeleteJournalEntryMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteJournalEntryMutation = { __typename?: 'Mutation', deleteJournalEntry: boolean };

export type GetBudgetsQueryVariables = Exact<{
  organizationId: Scalars['String']['input'];
  fiscalYear?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetBudgetsQuery = { __typename?: 'Query', budgets: Array<{ __typename?: 'Budget', id: string, seqNo?: string | null, budgetName: string, fiscalYear: string, startDate: string, endDate: string, totalAmount: number, status: string, createdAt: string, lines: Array<{ __typename?: 'BudgetLine', accountCode: string, accountName: string, period: string, amount: number }> }> };

export type CreateBudgetMutationVariables = Exact<{
  input: BudgetInput;
}>;


export type CreateBudgetMutation = { __typename?: 'Mutation', createBudget: { __typename?: 'Budget', id: string, seqNo?: string | null, budgetName: string } };

export type UpdateBudgetMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: BudgetInput;
}>;


export type UpdateBudgetMutation = { __typename?: 'Mutation', updateBudget: { __typename?: 'Budget', id: string, budgetName: string } };

export type ActivateBudgetMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type ActivateBudgetMutation = { __typename?: 'Mutation', activateBudget: { __typename?: 'Budget', id: string, status: string } };

export type DeleteBudgetMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteBudgetMutation = { __typename?: 'Mutation', deleteBudget: boolean };

export type UpdateChartOfAccountMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: ChartOfAccountsInput;
}>;


export type UpdateChartOfAccountMutation = { __typename?: 'Mutation', updateChartOfAccount: { __typename?: 'ChartOfAccounts', id: string, accountCode: string, accountName: string } };

export type DeleteChartOfAccountMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteChartOfAccountMutation = { __typename?: 'Mutation', deleteChartOfAccount: boolean };

export type GetAllocationSchedulesQueryVariables = Exact<{
  organizationId: Scalars['String']['input'];
}>;


export type GetAllocationSchedulesQuery = { __typename?: 'Query', allocationSchedules: Array<{ __typename?: 'AllocationSchedule', id: string, seqNo?: string | null, scheduleName: string, sourceAccount: string, allocationMethod: string, isActive: boolean, createdAt: string, lines: Array<{ __typename?: 'AllocationLine', destinationAccount: string, percentage: number, amount: number }> }> };

export type CreateAllocationScheduleMutationVariables = Exact<{
  input: AllocationScheduleInput;
}>;


export type CreateAllocationScheduleMutation = { __typename?: 'Mutation', createAllocationSchedule: { __typename?: 'AllocationSchedule', id: string, seqNo?: string | null, scheduleName: string } };

export type UpdateAllocationScheduleMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: AllocationScheduleInput;
}>;


export type UpdateAllocationScheduleMutation = { __typename?: 'Mutation', updateAllocationSchedule: { __typename?: 'AllocationSchedule', id: string, scheduleName: string } };

export type DeleteAllocationScheduleMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteAllocationScheduleMutation = { __typename?: 'Mutation', deleteAllocationSchedule: boolean };

export type GetCurrencyRevaluationsQueryVariables = Exact<{
  organizationId: Scalars['String']['input'];
}>;


export type GetCurrencyRevaluationsQuery = { __typename?: 'Query', currencyRevaluations: Array<{ __typename?: 'CurrencyRevaluation', id: string, seqNo?: string | null, revaluationDate: string, baseCurrency: string, totalGainLoss: number, status: string, postedAt?: string | null, createdAt: string, lines: Array<{ __typename?: 'CurrencyRevaluationLine', accountCode: string, accountName: string, currency: string, originalAmount: number, revaluedAmount: number, gainLoss: number }> }> };

export type CreateCurrencyRevaluationMutationVariables = Exact<{
  input: CurrencyRevaluationInput;
}>;


export type CreateCurrencyRevaluationMutation = { __typename?: 'Mutation', createCurrencyRevaluation: { __typename?: 'CurrencyRevaluation', id: string, seqNo?: string | null } };

export type PostCurrencyRevaluationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type PostCurrencyRevaluationMutation = { __typename?: 'Mutation', postCurrencyRevaluation: { __typename?: 'CurrencyRevaluation', id: string, status: string, postedAt?: string | null } };

export type DeleteCurrencyRevaluationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteCurrencyRevaluationMutation = { __typename?: 'Mutation', deleteCurrencyRevaluation: boolean };


export const GetLeaveTypesDocument = gql`
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
    `;
export function useGetLeaveTypesQuery(baseOptions: Apollo.QueryHookOptions<GetLeaveTypesQuery, GetLeaveTypesQueryVariables> & ({ variables: GetLeaveTypesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetLeaveTypesQuery, GetLeaveTypesQueryVariables>(GetLeaveTypesDocument, options);
      }
export function useGetLeaveTypesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetLeaveTypesQuery, GetLeaveTypesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetLeaveTypesQuery, GetLeaveTypesQueryVariables>(GetLeaveTypesDocument, options);
        }
// @ts-ignore
export function useGetLeaveTypesSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetLeaveTypesQuery, GetLeaveTypesQueryVariables>): Apollo.UseSuspenseQueryResult<GetLeaveTypesQuery, GetLeaveTypesQueryVariables>;
export function useGetLeaveTypesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetLeaveTypesQuery, GetLeaveTypesQueryVariables>): Apollo.UseSuspenseQueryResult<GetLeaveTypesQuery | undefined, GetLeaveTypesQueryVariables>;
export function useGetLeaveTypesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetLeaveTypesQuery, GetLeaveTypesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetLeaveTypesQuery, GetLeaveTypesQueryVariables>(GetLeaveTypesDocument, options);
        }
export type GetLeaveTypesQueryHookResult = ReturnType<typeof useGetLeaveTypesQuery>;
export type GetLeaveTypesLazyQueryHookResult = ReturnType<typeof useGetLeaveTypesLazyQuery>;
export type GetLeaveTypesSuspenseQueryHookResult = ReturnType<typeof useGetLeaveTypesSuspenseQuery>;
export type GetLeaveTypesQueryResult = Apollo.QueryResult<GetLeaveTypesQuery, GetLeaveTypesQueryVariables>;
export const CreateLeaveTypeDocument = gql`
    mutation CreateLeaveType($input: CreateLeaveTypeInput!) {
  createLeaveType(input: $input) {
    id
    code
    name
  }
}
    `;
export type CreateLeaveTypeMutationFn = Apollo.MutationFunction<CreateLeaveTypeMutation, CreateLeaveTypeMutationVariables>;
export function useCreateLeaveTypeMutation(baseOptions?: Apollo.MutationHookOptions<CreateLeaveTypeMutation, CreateLeaveTypeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateLeaveTypeMutation, CreateLeaveTypeMutationVariables>(CreateLeaveTypeDocument, options);
      }
export type CreateLeaveTypeMutationHookResult = ReturnType<typeof useCreateLeaveTypeMutation>;
export type CreateLeaveTypeMutationResult = Apollo.MutationResult<CreateLeaveTypeMutation>;
export type CreateLeaveTypeMutationOptions = Apollo.BaseMutationOptions<CreateLeaveTypeMutation, CreateLeaveTypeMutationVariables>;
export const UpdateLeaveTypeDocument = gql`
    mutation UpdateLeaveType($id: ID!, $input: UpdateLeaveTypeInput!) {
  updateLeaveType(id: $id, input: $input) {
    id
    code
    name
    active
  }
}
    `;
export type UpdateLeaveTypeMutationFn = Apollo.MutationFunction<UpdateLeaveTypeMutation, UpdateLeaveTypeMutationVariables>;
export function useUpdateLeaveTypeMutation(baseOptions?: Apollo.MutationHookOptions<UpdateLeaveTypeMutation, UpdateLeaveTypeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateLeaveTypeMutation, UpdateLeaveTypeMutationVariables>(UpdateLeaveTypeDocument, options);
      }
export type UpdateLeaveTypeMutationHookResult = ReturnType<typeof useUpdateLeaveTypeMutation>;
export type UpdateLeaveTypeMutationResult = Apollo.MutationResult<UpdateLeaveTypeMutation>;
export type UpdateLeaveTypeMutationOptions = Apollo.BaseMutationOptions<UpdateLeaveTypeMutation, UpdateLeaveTypeMutationVariables>;
export const DeleteLeaveTypeDocument = gql`
    mutation DeleteLeaveType($id: ID!) {
  deleteLeaveType(id: $id) {
    id
  }
}
    `;
export type DeleteLeaveTypeMutationFn = Apollo.MutationFunction<DeleteLeaveTypeMutation, DeleteLeaveTypeMutationVariables>;
export function useDeleteLeaveTypeMutation(baseOptions?: Apollo.MutationHookOptions<DeleteLeaveTypeMutation, DeleteLeaveTypeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteLeaveTypeMutation, DeleteLeaveTypeMutationVariables>(DeleteLeaveTypeDocument, options);
      }
export type DeleteLeaveTypeMutationHookResult = ReturnType<typeof useDeleteLeaveTypeMutation>;
export type DeleteLeaveTypeMutationResult = Apollo.MutationResult<DeleteLeaveTypeMutation>;
export type DeleteLeaveTypeMutationOptions = Apollo.BaseMutationOptions<DeleteLeaveTypeMutation, DeleteLeaveTypeMutationVariables>;
export const GetLeaveEnrollmentsDocument = gql`
    query GetLeaveEnrollments($organizationId: ID!, $userId: ID, $calendarYear: Int) {
  leaveEnrollments(
    organizationId: $organizationId
    userId: $userId
    calendarYear: $calendarYear
  ) {
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
    `;
export function useGetLeaveEnrollmentsQuery(baseOptions: Apollo.QueryHookOptions<GetLeaveEnrollmentsQuery, GetLeaveEnrollmentsQueryVariables> & ({ variables: GetLeaveEnrollmentsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetLeaveEnrollmentsQuery, GetLeaveEnrollmentsQueryVariables>(GetLeaveEnrollmentsDocument, options);
      }
export function useGetLeaveEnrollmentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetLeaveEnrollmentsQuery, GetLeaveEnrollmentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetLeaveEnrollmentsQuery, GetLeaveEnrollmentsQueryVariables>(GetLeaveEnrollmentsDocument, options);
        }
// @ts-ignore
export function useGetLeaveEnrollmentsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetLeaveEnrollmentsQuery, GetLeaveEnrollmentsQueryVariables>): Apollo.UseSuspenseQueryResult<GetLeaveEnrollmentsQuery, GetLeaveEnrollmentsQueryVariables>;
export function useGetLeaveEnrollmentsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetLeaveEnrollmentsQuery, GetLeaveEnrollmentsQueryVariables>): Apollo.UseSuspenseQueryResult<GetLeaveEnrollmentsQuery | undefined, GetLeaveEnrollmentsQueryVariables>;
export function useGetLeaveEnrollmentsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetLeaveEnrollmentsQuery, GetLeaveEnrollmentsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetLeaveEnrollmentsQuery, GetLeaveEnrollmentsQueryVariables>(GetLeaveEnrollmentsDocument, options);
        }
export type GetLeaveEnrollmentsQueryHookResult = ReturnType<typeof useGetLeaveEnrollmentsQuery>;
export type GetLeaveEnrollmentsLazyQueryHookResult = ReturnType<typeof useGetLeaveEnrollmentsLazyQuery>;
export type GetLeaveEnrollmentsSuspenseQueryHookResult = ReturnType<typeof useGetLeaveEnrollmentsSuspenseQuery>;
export type GetLeaveEnrollmentsQueryResult = Apollo.QueryResult<GetLeaveEnrollmentsQuery, GetLeaveEnrollmentsQueryVariables>;
export const CreateLeaveEnrollmentDocument = gql`
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
    `;
export type CreateLeaveEnrollmentMutationFn = Apollo.MutationFunction<CreateLeaveEnrollmentMutation, CreateLeaveEnrollmentMutationVariables>;
export function useCreateLeaveEnrollmentMutation(baseOptions?: Apollo.MutationHookOptions<CreateLeaveEnrollmentMutation, CreateLeaveEnrollmentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateLeaveEnrollmentMutation, CreateLeaveEnrollmentMutationVariables>(CreateLeaveEnrollmentDocument, options);
      }
export type CreateLeaveEnrollmentMutationHookResult = ReturnType<typeof useCreateLeaveEnrollmentMutation>;
export type CreateLeaveEnrollmentMutationResult = Apollo.MutationResult<CreateLeaveEnrollmentMutation>;
export type CreateLeaveEnrollmentMutationOptions = Apollo.BaseMutationOptions<CreateLeaveEnrollmentMutation, CreateLeaveEnrollmentMutationVariables>;
export const UpdateLeaveEnrollmentDocument = gql`
    mutation UpdateLeaveEnrollment($id: ID!, $input: UpdateLeaveEnrollmentInput!) {
  updateLeaveEnrollment(id: $id, input: $input) {
    id
    entitledDays
    usedDays
    carriedForward
  }
}
    `;
export type UpdateLeaveEnrollmentMutationFn = Apollo.MutationFunction<UpdateLeaveEnrollmentMutation, UpdateLeaveEnrollmentMutationVariables>;
export function useUpdateLeaveEnrollmentMutation(baseOptions?: Apollo.MutationHookOptions<UpdateLeaveEnrollmentMutation, UpdateLeaveEnrollmentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateLeaveEnrollmentMutation, UpdateLeaveEnrollmentMutationVariables>(UpdateLeaveEnrollmentDocument, options);
      }
export type UpdateLeaveEnrollmentMutationHookResult = ReturnType<typeof useUpdateLeaveEnrollmentMutation>;
export type UpdateLeaveEnrollmentMutationResult = Apollo.MutationResult<UpdateLeaveEnrollmentMutation>;
export type UpdateLeaveEnrollmentMutationOptions = Apollo.BaseMutationOptions<UpdateLeaveEnrollmentMutation, UpdateLeaveEnrollmentMutationVariables>;
export const DeleteLeaveEnrollmentDocument = gql`
    mutation DeleteLeaveEnrollment($id: ID!) {
  deleteLeaveEnrollment(id: $id) {
    id
  }
}
    `;
export type DeleteLeaveEnrollmentMutationFn = Apollo.MutationFunction<DeleteLeaveEnrollmentMutation, DeleteLeaveEnrollmentMutationVariables>;
export function useDeleteLeaveEnrollmentMutation(baseOptions?: Apollo.MutationHookOptions<DeleteLeaveEnrollmentMutation, DeleteLeaveEnrollmentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteLeaveEnrollmentMutation, DeleteLeaveEnrollmentMutationVariables>(DeleteLeaveEnrollmentDocument, options);
      }
export type DeleteLeaveEnrollmentMutationHookResult = ReturnType<typeof useDeleteLeaveEnrollmentMutation>;
export type DeleteLeaveEnrollmentMutationResult = Apollo.MutationResult<DeleteLeaveEnrollmentMutation>;
export type DeleteLeaveEnrollmentMutationOptions = Apollo.BaseMutationOptions<DeleteLeaveEnrollmentMutation, DeleteLeaveEnrollmentMutationVariables>;
export const GetLeaveApplicationsDocument = gql`
    query GetLeaveApplications($organizationId: ID!, $userId: ID, $status: String) {
  leaveApplications(
    organizationId: $organizationId
    userId: $userId
    status: $status
  ) {
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
    `;
export function useGetLeaveApplicationsQuery(baseOptions: Apollo.QueryHookOptions<GetLeaveApplicationsQuery, GetLeaveApplicationsQueryVariables> & ({ variables: GetLeaveApplicationsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetLeaveApplicationsQuery, GetLeaveApplicationsQueryVariables>(GetLeaveApplicationsDocument, options);
      }
export function useGetLeaveApplicationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetLeaveApplicationsQuery, GetLeaveApplicationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetLeaveApplicationsQuery, GetLeaveApplicationsQueryVariables>(GetLeaveApplicationsDocument, options);
        }
// @ts-ignore
export function useGetLeaveApplicationsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetLeaveApplicationsQuery, GetLeaveApplicationsQueryVariables>): Apollo.UseSuspenseQueryResult<GetLeaveApplicationsQuery, GetLeaveApplicationsQueryVariables>;
export function useGetLeaveApplicationsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetLeaveApplicationsQuery, GetLeaveApplicationsQueryVariables>): Apollo.UseSuspenseQueryResult<GetLeaveApplicationsQuery | undefined, GetLeaveApplicationsQueryVariables>;
export function useGetLeaveApplicationsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetLeaveApplicationsQuery, GetLeaveApplicationsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetLeaveApplicationsQuery, GetLeaveApplicationsQueryVariables>(GetLeaveApplicationsDocument, options);
        }
export type GetLeaveApplicationsQueryHookResult = ReturnType<typeof useGetLeaveApplicationsQuery>;
export type GetLeaveApplicationsLazyQueryHookResult = ReturnType<typeof useGetLeaveApplicationsLazyQuery>;
export type GetLeaveApplicationsSuspenseQueryHookResult = ReturnType<typeof useGetLeaveApplicationsSuspenseQuery>;
export type GetLeaveApplicationsQueryResult = Apollo.QueryResult<GetLeaveApplicationsQuery, GetLeaveApplicationsQueryVariables>;
export const CreateLeaveApplicationDocument = gql`
    mutation CreateLeaveApplication($input: CreateLeaveApplicationInput!) {
  createLeaveApplication(input: $input) {
    id
    status
    totalDays
    startDate
    endDate
  }
}
    `;
export type CreateLeaveApplicationMutationFn = Apollo.MutationFunction<CreateLeaveApplicationMutation, CreateLeaveApplicationMutationVariables>;
export function useCreateLeaveApplicationMutation(baseOptions?: Apollo.MutationHookOptions<CreateLeaveApplicationMutation, CreateLeaveApplicationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateLeaveApplicationMutation, CreateLeaveApplicationMutationVariables>(CreateLeaveApplicationDocument, options);
      }
export type CreateLeaveApplicationMutationHookResult = ReturnType<typeof useCreateLeaveApplicationMutation>;
export type CreateLeaveApplicationMutationResult = Apollo.MutationResult<CreateLeaveApplicationMutation>;
export type CreateLeaveApplicationMutationOptions = Apollo.BaseMutationOptions<CreateLeaveApplicationMutation, CreateLeaveApplicationMutationVariables>;
export const UpdateLeaveApplicationDocument = gql`
    mutation UpdateLeaveApplication($id: ID!, $input: UpdateLeaveApplicationInput!) {
  updateLeaveApplication(id: $id, input: $input) {
    id
    status
  }
}
    `;
export type UpdateLeaveApplicationMutationFn = Apollo.MutationFunction<UpdateLeaveApplicationMutation, UpdateLeaveApplicationMutationVariables>;
export function useUpdateLeaveApplicationMutation(baseOptions?: Apollo.MutationHookOptions<UpdateLeaveApplicationMutation, UpdateLeaveApplicationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateLeaveApplicationMutation, UpdateLeaveApplicationMutationVariables>(UpdateLeaveApplicationDocument, options);
      }
export type UpdateLeaveApplicationMutationHookResult = ReturnType<typeof useUpdateLeaveApplicationMutation>;
export type UpdateLeaveApplicationMutationResult = Apollo.MutationResult<UpdateLeaveApplicationMutation>;
export type UpdateLeaveApplicationMutationOptions = Apollo.BaseMutationOptions<UpdateLeaveApplicationMutation, UpdateLeaveApplicationMutationVariables>;
export const ApproveLeaveApplicationDocument = gql`
    mutation ApproveLeaveApplication($id: ID!) {
  approveLeaveApplication(id: $id) {
    id
    status
    approvedAt
  }
}
    `;
export type ApproveLeaveApplicationMutationFn = Apollo.MutationFunction<ApproveLeaveApplicationMutation, ApproveLeaveApplicationMutationVariables>;
export function useApproveLeaveApplicationMutation(baseOptions?: Apollo.MutationHookOptions<ApproveLeaveApplicationMutation, ApproveLeaveApplicationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ApproveLeaveApplicationMutation, ApproveLeaveApplicationMutationVariables>(ApproveLeaveApplicationDocument, options);
      }
export type ApproveLeaveApplicationMutationHookResult = ReturnType<typeof useApproveLeaveApplicationMutation>;
export type ApproveLeaveApplicationMutationResult = Apollo.MutationResult<ApproveLeaveApplicationMutation>;
export type ApproveLeaveApplicationMutationOptions = Apollo.BaseMutationOptions<ApproveLeaveApplicationMutation, ApproveLeaveApplicationMutationVariables>;
export const RejectLeaveApplicationDocument = gql`
    mutation RejectLeaveApplication($id: ID!, $reason: String!) {
  rejectLeaveApplication(id: $id, reason: $reason) {
    id
    status
    rejectedReason
  }
}
    `;
export type RejectLeaveApplicationMutationFn = Apollo.MutationFunction<RejectLeaveApplicationMutation, RejectLeaveApplicationMutationVariables>;
export function useRejectLeaveApplicationMutation(baseOptions?: Apollo.MutationHookOptions<RejectLeaveApplicationMutation, RejectLeaveApplicationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RejectLeaveApplicationMutation, RejectLeaveApplicationMutationVariables>(RejectLeaveApplicationDocument, options);
      }
export type RejectLeaveApplicationMutationHookResult = ReturnType<typeof useRejectLeaveApplicationMutation>;
export type RejectLeaveApplicationMutationResult = Apollo.MutationResult<RejectLeaveApplicationMutation>;
export type RejectLeaveApplicationMutationOptions = Apollo.BaseMutationOptions<RejectLeaveApplicationMutation, RejectLeaveApplicationMutationVariables>;
export const DeleteLeaveApplicationDocument = gql`
    mutation DeleteLeaveApplication($id: ID!) {
  deleteLeaveApplication(id: $id) {
    id
  }
}
    `;
export type DeleteLeaveApplicationMutationFn = Apollo.MutationFunction<DeleteLeaveApplicationMutation, DeleteLeaveApplicationMutationVariables>;
export function useDeleteLeaveApplicationMutation(baseOptions?: Apollo.MutationHookOptions<DeleteLeaveApplicationMutation, DeleteLeaveApplicationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteLeaveApplicationMutation, DeleteLeaveApplicationMutationVariables>(DeleteLeaveApplicationDocument, options);
      }
export type DeleteLeaveApplicationMutationHookResult = ReturnType<typeof useDeleteLeaveApplicationMutation>;
export type DeleteLeaveApplicationMutationResult = Apollo.MutationResult<DeleteLeaveApplicationMutation>;
export type DeleteLeaveApplicationMutationOptions = Apollo.BaseMutationOptions<DeleteLeaveApplicationMutation, DeleteLeaveApplicationMutationVariables>;
export const GetLeaveReinstatementsDocument = gql`
    query GetLeaveReinstatements($organizationId: ID!, $userId: ID, $status: String) {
  leaveReinstatements(
    organizationId: $organizationId
    userId: $userId
    status: $status
  ) {
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
    `;
export function useGetLeaveReinstatementsQuery(baseOptions: Apollo.QueryHookOptions<GetLeaveReinstatementsQuery, GetLeaveReinstatementsQueryVariables> & ({ variables: GetLeaveReinstatementsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetLeaveReinstatementsQuery, GetLeaveReinstatementsQueryVariables>(GetLeaveReinstatementsDocument, options);
      }
export function useGetLeaveReinstatementsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetLeaveReinstatementsQuery, GetLeaveReinstatementsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetLeaveReinstatementsQuery, GetLeaveReinstatementsQueryVariables>(GetLeaveReinstatementsDocument, options);
        }
// @ts-ignore
export function useGetLeaveReinstatementsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetLeaveReinstatementsQuery, GetLeaveReinstatementsQueryVariables>): Apollo.UseSuspenseQueryResult<GetLeaveReinstatementsQuery, GetLeaveReinstatementsQueryVariables>;
export function useGetLeaveReinstatementsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetLeaveReinstatementsQuery, GetLeaveReinstatementsQueryVariables>): Apollo.UseSuspenseQueryResult<GetLeaveReinstatementsQuery | undefined, GetLeaveReinstatementsQueryVariables>;
export function useGetLeaveReinstatementsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetLeaveReinstatementsQuery, GetLeaveReinstatementsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetLeaveReinstatementsQuery, GetLeaveReinstatementsQueryVariables>(GetLeaveReinstatementsDocument, options);
        }
export type GetLeaveReinstatementsQueryHookResult = ReturnType<typeof useGetLeaveReinstatementsQuery>;
export type GetLeaveReinstatementsLazyQueryHookResult = ReturnType<typeof useGetLeaveReinstatementsLazyQuery>;
export type GetLeaveReinstatementsSuspenseQueryHookResult = ReturnType<typeof useGetLeaveReinstatementsSuspenseQuery>;
export type GetLeaveReinstatementsQueryResult = Apollo.QueryResult<GetLeaveReinstatementsQuery, GetLeaveReinstatementsQueryVariables>;
export const CreateLeaveReinstatementDocument = gql`
    mutation CreateLeaveReinstatement($input: CreateLeaveReinstatementInput!) {
  createLeaveReinstatement(input: $input) {
    id
    status
    daysRestored
  }
}
    `;
export type CreateLeaveReinstatementMutationFn = Apollo.MutationFunction<CreateLeaveReinstatementMutation, CreateLeaveReinstatementMutationVariables>;
export function useCreateLeaveReinstatementMutation(baseOptions?: Apollo.MutationHookOptions<CreateLeaveReinstatementMutation, CreateLeaveReinstatementMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateLeaveReinstatementMutation, CreateLeaveReinstatementMutationVariables>(CreateLeaveReinstatementDocument, options);
      }
export type CreateLeaveReinstatementMutationHookResult = ReturnType<typeof useCreateLeaveReinstatementMutation>;
export type CreateLeaveReinstatementMutationResult = Apollo.MutationResult<CreateLeaveReinstatementMutation>;
export type CreateLeaveReinstatementMutationOptions = Apollo.BaseMutationOptions<CreateLeaveReinstatementMutation, CreateLeaveReinstatementMutationVariables>;
export const ApproveLeaveReinstatementDocument = gql`
    mutation ApproveLeaveReinstatement($id: ID!) {
  approveLeaveReinstatement(id: $id) {
    id
    status
    reviewedAt
  }
}
    `;
export type ApproveLeaveReinstatementMutationFn = Apollo.MutationFunction<ApproveLeaveReinstatementMutation, ApproveLeaveReinstatementMutationVariables>;
export function useApproveLeaveReinstatementMutation(baseOptions?: Apollo.MutationHookOptions<ApproveLeaveReinstatementMutation, ApproveLeaveReinstatementMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ApproveLeaveReinstatementMutation, ApproveLeaveReinstatementMutationVariables>(ApproveLeaveReinstatementDocument, options);
      }
export type ApproveLeaveReinstatementMutationHookResult = ReturnType<typeof useApproveLeaveReinstatementMutation>;
export type ApproveLeaveReinstatementMutationResult = Apollo.MutationResult<ApproveLeaveReinstatementMutation>;
export type ApproveLeaveReinstatementMutationOptions = Apollo.BaseMutationOptions<ApproveLeaveReinstatementMutation, ApproveLeaveReinstatementMutationVariables>;
export const RejectLeaveReinstatementDocument = gql`
    mutation RejectLeaveReinstatement($id: ID!, $reviewNotes: String) {
  rejectLeaveReinstatement(id: $id, reviewNotes: $reviewNotes) {
    id
    status
  }
}
    `;
export type RejectLeaveReinstatementMutationFn = Apollo.MutationFunction<RejectLeaveReinstatementMutation, RejectLeaveReinstatementMutationVariables>;
export function useRejectLeaveReinstatementMutation(baseOptions?: Apollo.MutationHookOptions<RejectLeaveReinstatementMutation, RejectLeaveReinstatementMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RejectLeaveReinstatementMutation, RejectLeaveReinstatementMutationVariables>(RejectLeaveReinstatementDocument, options);
      }
export type RejectLeaveReinstatementMutationHookResult = ReturnType<typeof useRejectLeaveReinstatementMutation>;
export type RejectLeaveReinstatementMutationResult = Apollo.MutationResult<RejectLeaveReinstatementMutation>;
export type RejectLeaveReinstatementMutationOptions = Apollo.BaseMutationOptions<RejectLeaveReinstatementMutation, RejectLeaveReinstatementMutationVariables>;
export const DeleteLeaveReinstatementDocument = gql`
    mutation DeleteLeaveReinstatement($id: ID!) {
  deleteLeaveReinstatement(id: $id) {
    id
  }
}
    `;
export type DeleteLeaveReinstatementMutationFn = Apollo.MutationFunction<DeleteLeaveReinstatementMutation, DeleteLeaveReinstatementMutationVariables>;
export function useDeleteLeaveReinstatementMutation(baseOptions?: Apollo.MutationHookOptions<DeleteLeaveReinstatementMutation, DeleteLeaveReinstatementMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteLeaveReinstatementMutation, DeleteLeaveReinstatementMutationVariables>(DeleteLeaveReinstatementDocument, options);
      }
export type DeleteLeaveReinstatementMutationHookResult = ReturnType<typeof useDeleteLeaveReinstatementMutation>;
export type DeleteLeaveReinstatementMutationResult = Apollo.MutationResult<DeleteLeaveReinstatementMutation>;
export type DeleteLeaveReinstatementMutationOptions = Apollo.BaseMutationOptions<DeleteLeaveReinstatementMutation, DeleteLeaveReinstatementMutationVariables>;
export const MyNotificationsDocument = gql`
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
    `;
export function useMyNotificationsQuery(baseOptions?: Apollo.QueryHookOptions<MyNotificationsQuery, MyNotificationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MyNotificationsQuery, MyNotificationsQueryVariables>(MyNotificationsDocument, options);
      }
export function useMyNotificationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MyNotificationsQuery, MyNotificationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MyNotificationsQuery, MyNotificationsQueryVariables>(MyNotificationsDocument, options);
        }
// @ts-ignore
export function useMyNotificationsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<MyNotificationsQuery, MyNotificationsQueryVariables>): Apollo.UseSuspenseQueryResult<MyNotificationsQuery, MyNotificationsQueryVariables>;
export function useMyNotificationsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MyNotificationsQuery, MyNotificationsQueryVariables>): Apollo.UseSuspenseQueryResult<MyNotificationsQuery | undefined, MyNotificationsQueryVariables>;
export function useMyNotificationsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MyNotificationsQuery, MyNotificationsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MyNotificationsQuery, MyNotificationsQueryVariables>(MyNotificationsDocument, options);
        }
export type MyNotificationsQueryHookResult = ReturnType<typeof useMyNotificationsQuery>;
export type MyNotificationsLazyQueryHookResult = ReturnType<typeof useMyNotificationsLazyQuery>;
export type MyNotificationsSuspenseQueryHookResult = ReturnType<typeof useMyNotificationsSuspenseQuery>;
export type MyNotificationsQueryResult = Apollo.QueryResult<MyNotificationsQuery, MyNotificationsQueryVariables>;
export const MyUnreadNotificationCountDocument = gql`
    query MyUnreadNotificationCount {
  myUnreadNotificationCount
}
    `;
export function useMyUnreadNotificationCountQuery(baseOptions?: Apollo.QueryHookOptions<MyUnreadNotificationCountQuery, MyUnreadNotificationCountQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MyUnreadNotificationCountQuery, MyUnreadNotificationCountQueryVariables>(MyUnreadNotificationCountDocument, options);
      }
export function useMyUnreadNotificationCountLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MyUnreadNotificationCountQuery, MyUnreadNotificationCountQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MyUnreadNotificationCountQuery, MyUnreadNotificationCountQueryVariables>(MyUnreadNotificationCountDocument, options);
        }
// @ts-ignore
export function useMyUnreadNotificationCountSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<MyUnreadNotificationCountQuery, MyUnreadNotificationCountQueryVariables>): Apollo.UseSuspenseQueryResult<MyUnreadNotificationCountQuery, MyUnreadNotificationCountQueryVariables>;
export function useMyUnreadNotificationCountSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MyUnreadNotificationCountQuery, MyUnreadNotificationCountQueryVariables>): Apollo.UseSuspenseQueryResult<MyUnreadNotificationCountQuery | undefined, MyUnreadNotificationCountQueryVariables>;
export function useMyUnreadNotificationCountSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MyUnreadNotificationCountQuery, MyUnreadNotificationCountQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MyUnreadNotificationCountQuery, MyUnreadNotificationCountQueryVariables>(MyUnreadNotificationCountDocument, options);
        }
export type MyUnreadNotificationCountQueryHookResult = ReturnType<typeof useMyUnreadNotificationCountQuery>;
export type MyUnreadNotificationCountLazyQueryHookResult = ReturnType<typeof useMyUnreadNotificationCountLazyQuery>;
export type MyUnreadNotificationCountSuspenseQueryHookResult = ReturnType<typeof useMyUnreadNotificationCountSuspenseQuery>;
export type MyUnreadNotificationCountQueryResult = Apollo.QueryResult<MyUnreadNotificationCountQuery, MyUnreadNotificationCountQueryVariables>;
export const MarkNotificationReadDocument = gql`
    mutation MarkNotificationRead($id: ID!) {
  markNotificationRead(id: $id) {
    id
    isRead
    readAt
  }
}
    `;
export type MarkNotificationReadMutationFn = Apollo.MutationFunction<MarkNotificationReadMutation, MarkNotificationReadMutationVariables>;
export function useMarkNotificationReadMutation(baseOptions?: Apollo.MutationHookOptions<MarkNotificationReadMutation, MarkNotificationReadMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<MarkNotificationReadMutation, MarkNotificationReadMutationVariables>(MarkNotificationReadDocument, options);
      }
export type MarkNotificationReadMutationHookResult = ReturnType<typeof useMarkNotificationReadMutation>;
export type MarkNotificationReadMutationResult = Apollo.MutationResult<MarkNotificationReadMutation>;
export type MarkNotificationReadMutationOptions = Apollo.BaseMutationOptions<MarkNotificationReadMutation, MarkNotificationReadMutationVariables>;
export const MarkAllNotificationsReadDocument = gql`
    mutation MarkAllNotificationsRead {
  markAllNotificationsRead
}
    `;
export type MarkAllNotificationsReadMutationFn = Apollo.MutationFunction<MarkAllNotificationsReadMutation, MarkAllNotificationsReadMutationVariables>;
export function useMarkAllNotificationsReadMutation(baseOptions?: Apollo.MutationHookOptions<MarkAllNotificationsReadMutation, MarkAllNotificationsReadMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<MarkAllNotificationsReadMutation, MarkAllNotificationsReadMutationVariables>(MarkAllNotificationsReadDocument, options);
      }
export type MarkAllNotificationsReadMutationHookResult = ReturnType<typeof useMarkAllNotificationsReadMutation>;
export type MarkAllNotificationsReadMutationResult = Apollo.MutationResult<MarkAllNotificationsReadMutation>;
export type MarkAllNotificationsReadMutationOptions = Apollo.BaseMutationOptions<MarkAllNotificationsReadMutation, MarkAllNotificationsReadMutationVariables>;
export const ArchiveNotificationDocument = gql`
    mutation ArchiveNotification($id: ID!) {
  archiveNotification(id: $id) {
    id
    archivedAt
  }
}
    `;
export type ArchiveNotificationMutationFn = Apollo.MutationFunction<ArchiveNotificationMutation, ArchiveNotificationMutationVariables>;
export function useArchiveNotificationMutation(baseOptions?: Apollo.MutationHookOptions<ArchiveNotificationMutation, ArchiveNotificationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ArchiveNotificationMutation, ArchiveNotificationMutationVariables>(ArchiveNotificationDocument, options);
      }
export type ArchiveNotificationMutationHookResult = ReturnType<typeof useArchiveNotificationMutation>;
export type ArchiveNotificationMutationResult = Apollo.MutationResult<ArchiveNotificationMutation>;
export type ArchiveNotificationMutationOptions = Apollo.BaseMutationOptions<ArchiveNotificationMutation, ArchiveNotificationMutationVariables>;
export const ArchiveAllNotificationsDocument = gql`
    mutation ArchiveAllNotifications {
  archiveAllNotifications
}
    `;
export type ArchiveAllNotificationsMutationFn = Apollo.MutationFunction<ArchiveAllNotificationsMutation, ArchiveAllNotificationsMutationVariables>;
export function useArchiveAllNotificationsMutation(baseOptions?: Apollo.MutationHookOptions<ArchiveAllNotificationsMutation, ArchiveAllNotificationsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ArchiveAllNotificationsMutation, ArchiveAllNotificationsMutationVariables>(ArchiveAllNotificationsDocument, options);
      }
export type ArchiveAllNotificationsMutationHookResult = ReturnType<typeof useArchiveAllNotificationsMutation>;
export type ArchiveAllNotificationsMutationResult = Apollo.MutationResult<ArchiveAllNotificationsMutation>;
export type ArchiveAllNotificationsMutationOptions = Apollo.BaseMutationOptions<ArchiveAllNotificationsMutation, ArchiveAllNotificationsMutationVariables>;
export const GetTaxRatesDocument = gql`
    query GetTaxRates($organizationId: ID!, $status: String, $appliesTo: String, $search: String) {
  taxRates(
    organizationId: $organizationId
    status: $status
    appliesTo: $appliesTo
    search: $search
  ) {
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
    `;
export function useGetTaxRatesQuery(baseOptions: Apollo.QueryHookOptions<GetTaxRatesQuery, GetTaxRatesQueryVariables> & ({ variables: GetTaxRatesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTaxRatesQuery, GetTaxRatesQueryVariables>(GetTaxRatesDocument, options);
      }
export function useGetTaxRatesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTaxRatesQuery, GetTaxRatesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTaxRatesQuery, GetTaxRatesQueryVariables>(GetTaxRatesDocument, options);
        }
// @ts-ignore
export function useGetTaxRatesSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetTaxRatesQuery, GetTaxRatesQueryVariables>): Apollo.UseSuspenseQueryResult<GetTaxRatesQuery, GetTaxRatesQueryVariables>;
export function useGetTaxRatesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetTaxRatesQuery, GetTaxRatesQueryVariables>): Apollo.UseSuspenseQueryResult<GetTaxRatesQuery | undefined, GetTaxRatesQueryVariables>;
export function useGetTaxRatesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetTaxRatesQuery, GetTaxRatesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetTaxRatesQuery, GetTaxRatesQueryVariables>(GetTaxRatesDocument, options);
        }
export type GetTaxRatesQueryHookResult = ReturnType<typeof useGetTaxRatesQuery>;
export type GetTaxRatesLazyQueryHookResult = ReturnType<typeof useGetTaxRatesLazyQuery>;
export type GetTaxRatesSuspenseQueryHookResult = ReturnType<typeof useGetTaxRatesSuspenseQuery>;
export type GetTaxRatesQueryResult = Apollo.QueryResult<GetTaxRatesQuery, GetTaxRatesQueryVariables>;
export const CreateTaxRateDocument = gql`
    mutation CreateTaxRate($input: CreateTaxRateInput!) {
  createTaxRate(input: $input) {
    id
    name
    code
    ratePercent
  }
}
    `;
export type CreateTaxRateMutationFn = Apollo.MutationFunction<CreateTaxRateMutation, CreateTaxRateMutationVariables>;
export function useCreateTaxRateMutation(baseOptions?: Apollo.MutationHookOptions<CreateTaxRateMutation, CreateTaxRateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTaxRateMutation, CreateTaxRateMutationVariables>(CreateTaxRateDocument, options);
      }
export type CreateTaxRateMutationHookResult = ReturnType<typeof useCreateTaxRateMutation>;
export type CreateTaxRateMutationResult = Apollo.MutationResult<CreateTaxRateMutation>;
export type CreateTaxRateMutationOptions = Apollo.BaseMutationOptions<CreateTaxRateMutation, CreateTaxRateMutationVariables>;
export const UpdateTaxRateDocument = gql`
    mutation UpdateTaxRate($id: ID!, $input: UpdateTaxRateInput!) {
  updateTaxRate(id: $id, input: $input) {
    id
    name
    ratePercent
    status
  }
}
    `;
export type UpdateTaxRateMutationFn = Apollo.MutationFunction<UpdateTaxRateMutation, UpdateTaxRateMutationVariables>;
export function useUpdateTaxRateMutation(baseOptions?: Apollo.MutationHookOptions<UpdateTaxRateMutation, UpdateTaxRateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateTaxRateMutation, UpdateTaxRateMutationVariables>(UpdateTaxRateDocument, options);
      }
export type UpdateTaxRateMutationHookResult = ReturnType<typeof useUpdateTaxRateMutation>;
export type UpdateTaxRateMutationResult = Apollo.MutationResult<UpdateTaxRateMutation>;
export type UpdateTaxRateMutationOptions = Apollo.BaseMutationOptions<UpdateTaxRateMutation, UpdateTaxRateMutationVariables>;
export const DeleteTaxRateDocument = gql`
    mutation DeleteTaxRate($id: ID!) {
  deleteTaxRate(id: $id) {
    id
  }
}
    `;
export type DeleteTaxRateMutationFn = Apollo.MutationFunction<DeleteTaxRateMutation, DeleteTaxRateMutationVariables>;
export function useDeleteTaxRateMutation(baseOptions?: Apollo.MutationHookOptions<DeleteTaxRateMutation, DeleteTaxRateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteTaxRateMutation, DeleteTaxRateMutationVariables>(DeleteTaxRateDocument, options);
      }
export type DeleteTaxRateMutationHookResult = ReturnType<typeof useDeleteTaxRateMutation>;
export type DeleteTaxRateMutationResult = Apollo.MutationResult<DeleteTaxRateMutation>;
export type DeleteTaxRateMutationOptions = Apollo.BaseMutationOptions<DeleteTaxRateMutation, DeleteTaxRateMutationVariables>;
export const GetFixedAssetsDocument = gql`
    query GetFixedAssets($organizationId: ID!, $status: String, $category: String, $search: String) {
  fixedAssets(
    organizationId: $organizationId
    status: $status
    category: $category
    search: $search
  ) {
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
    `;
export function useGetFixedAssetsQuery(baseOptions: Apollo.QueryHookOptions<GetFixedAssetsQuery, GetFixedAssetsQueryVariables> & ({ variables: GetFixedAssetsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetFixedAssetsQuery, GetFixedAssetsQueryVariables>(GetFixedAssetsDocument, options);
      }
export function useGetFixedAssetsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFixedAssetsQuery, GetFixedAssetsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetFixedAssetsQuery, GetFixedAssetsQueryVariables>(GetFixedAssetsDocument, options);
        }
// @ts-ignore
export function useGetFixedAssetsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetFixedAssetsQuery, GetFixedAssetsQueryVariables>): Apollo.UseSuspenseQueryResult<GetFixedAssetsQuery, GetFixedAssetsQueryVariables>;
export function useGetFixedAssetsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetFixedAssetsQuery, GetFixedAssetsQueryVariables>): Apollo.UseSuspenseQueryResult<GetFixedAssetsQuery | undefined, GetFixedAssetsQueryVariables>;
export function useGetFixedAssetsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetFixedAssetsQuery, GetFixedAssetsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetFixedAssetsQuery, GetFixedAssetsQueryVariables>(GetFixedAssetsDocument, options);
        }
export type GetFixedAssetsQueryHookResult = ReturnType<typeof useGetFixedAssetsQuery>;
export type GetFixedAssetsLazyQueryHookResult = ReturnType<typeof useGetFixedAssetsLazyQuery>;
export type GetFixedAssetsSuspenseQueryHookResult = ReturnType<typeof useGetFixedAssetsSuspenseQuery>;
export type GetFixedAssetsQueryResult = Apollo.QueryResult<GetFixedAssetsQuery, GetFixedAssetsQueryVariables>;
export const GetFixedAssetDocument = gql`
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
    `;
export function useGetFixedAssetQuery(baseOptions: Apollo.QueryHookOptions<GetFixedAssetQuery, GetFixedAssetQueryVariables> & ({ variables: GetFixedAssetQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetFixedAssetQuery, GetFixedAssetQueryVariables>(GetFixedAssetDocument, options);
      }
export function useGetFixedAssetLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFixedAssetQuery, GetFixedAssetQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetFixedAssetQuery, GetFixedAssetQueryVariables>(GetFixedAssetDocument, options);
        }
// @ts-ignore
export function useGetFixedAssetSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetFixedAssetQuery, GetFixedAssetQueryVariables>): Apollo.UseSuspenseQueryResult<GetFixedAssetQuery, GetFixedAssetQueryVariables>;
export function useGetFixedAssetSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetFixedAssetQuery, GetFixedAssetQueryVariables>): Apollo.UseSuspenseQueryResult<GetFixedAssetQuery | undefined, GetFixedAssetQueryVariables>;
export function useGetFixedAssetSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetFixedAssetQuery, GetFixedAssetQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetFixedAssetQuery, GetFixedAssetQueryVariables>(GetFixedAssetDocument, options);
        }
export type GetFixedAssetQueryHookResult = ReturnType<typeof useGetFixedAssetQuery>;
export type GetFixedAssetLazyQueryHookResult = ReturnType<typeof useGetFixedAssetLazyQuery>;
export type GetFixedAssetSuspenseQueryHookResult = ReturnType<typeof useGetFixedAssetSuspenseQuery>;
export type GetFixedAssetQueryResult = Apollo.QueryResult<GetFixedAssetQuery, GetFixedAssetQueryVariables>;
export const GetFixedAssetSummaryDocument = gql`
    query GetFixedAssetSummary($organizationId: ID!) {
  fixedAssetSummaryByCategory(organizationId: $organizationId) {
    category
    count
    acquisitionCost
    accumulatedDepreciation
    bookValue
  }
}
    `;
export function useGetFixedAssetSummaryQuery(baseOptions: Apollo.QueryHookOptions<GetFixedAssetSummaryQuery, GetFixedAssetSummaryQueryVariables> & ({ variables: GetFixedAssetSummaryQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetFixedAssetSummaryQuery, GetFixedAssetSummaryQueryVariables>(GetFixedAssetSummaryDocument, options);
      }
export function useGetFixedAssetSummaryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFixedAssetSummaryQuery, GetFixedAssetSummaryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetFixedAssetSummaryQuery, GetFixedAssetSummaryQueryVariables>(GetFixedAssetSummaryDocument, options);
        }
// @ts-ignore
export function useGetFixedAssetSummarySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetFixedAssetSummaryQuery, GetFixedAssetSummaryQueryVariables>): Apollo.UseSuspenseQueryResult<GetFixedAssetSummaryQuery, GetFixedAssetSummaryQueryVariables>;
export function useGetFixedAssetSummarySuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetFixedAssetSummaryQuery, GetFixedAssetSummaryQueryVariables>): Apollo.UseSuspenseQueryResult<GetFixedAssetSummaryQuery | undefined, GetFixedAssetSummaryQueryVariables>;
export function useGetFixedAssetSummarySuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetFixedAssetSummaryQuery, GetFixedAssetSummaryQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetFixedAssetSummaryQuery, GetFixedAssetSummaryQueryVariables>(GetFixedAssetSummaryDocument, options);
        }
export type GetFixedAssetSummaryQueryHookResult = ReturnType<typeof useGetFixedAssetSummaryQuery>;
export type GetFixedAssetSummaryLazyQueryHookResult = ReturnType<typeof useGetFixedAssetSummaryLazyQuery>;
export type GetFixedAssetSummarySuspenseQueryHookResult = ReturnType<typeof useGetFixedAssetSummarySuspenseQuery>;
export type GetFixedAssetSummaryQueryResult = Apollo.QueryResult<GetFixedAssetSummaryQuery, GetFixedAssetSummaryQueryVariables>;
export const CreateFixedAssetDocument = gql`
    mutation CreateFixedAsset($input: CreateFixedAssetInput!) {
  createFixedAsset(input: $input) {
    id
    assetCode
    name
  }
}
    `;
export type CreateFixedAssetMutationFn = Apollo.MutationFunction<CreateFixedAssetMutation, CreateFixedAssetMutationVariables>;
export function useCreateFixedAssetMutation(baseOptions?: Apollo.MutationHookOptions<CreateFixedAssetMutation, CreateFixedAssetMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateFixedAssetMutation, CreateFixedAssetMutationVariables>(CreateFixedAssetDocument, options);
      }
export type CreateFixedAssetMutationHookResult = ReturnType<typeof useCreateFixedAssetMutation>;
export type CreateFixedAssetMutationResult = Apollo.MutationResult<CreateFixedAssetMutation>;
export type CreateFixedAssetMutationOptions = Apollo.BaseMutationOptions<CreateFixedAssetMutation, CreateFixedAssetMutationVariables>;
export const UpdateFixedAssetDocument = gql`
    mutation UpdateFixedAsset($id: ID!, $input: UpdateFixedAssetInput!) {
  updateFixedAsset(id: $id, input: $input) {
    id
    name
    status
  }
}
    `;
export type UpdateFixedAssetMutationFn = Apollo.MutationFunction<UpdateFixedAssetMutation, UpdateFixedAssetMutationVariables>;
export function useUpdateFixedAssetMutation(baseOptions?: Apollo.MutationHookOptions<UpdateFixedAssetMutation, UpdateFixedAssetMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateFixedAssetMutation, UpdateFixedAssetMutationVariables>(UpdateFixedAssetDocument, options);
      }
export type UpdateFixedAssetMutationHookResult = ReturnType<typeof useUpdateFixedAssetMutation>;
export type UpdateFixedAssetMutationResult = Apollo.MutationResult<UpdateFixedAssetMutation>;
export type UpdateFixedAssetMutationOptions = Apollo.BaseMutationOptions<UpdateFixedAssetMutation, UpdateFixedAssetMutationVariables>;
export const DeleteFixedAssetDocument = gql`
    mutation DeleteFixedAsset($id: ID!) {
  deleteFixedAsset(id: $id) {
    id
  }
}
    `;
export type DeleteFixedAssetMutationFn = Apollo.MutationFunction<DeleteFixedAssetMutation, DeleteFixedAssetMutationVariables>;
export function useDeleteFixedAssetMutation(baseOptions?: Apollo.MutationHookOptions<DeleteFixedAssetMutation, DeleteFixedAssetMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteFixedAssetMutation, DeleteFixedAssetMutationVariables>(DeleteFixedAssetDocument, options);
      }
export type DeleteFixedAssetMutationHookResult = ReturnType<typeof useDeleteFixedAssetMutation>;
export type DeleteFixedAssetMutationResult = Apollo.MutationResult<DeleteFixedAssetMutation>;
export type DeleteFixedAssetMutationOptions = Apollo.BaseMutationOptions<DeleteFixedAssetMutation, DeleteFixedAssetMutationVariables>;
export const PostFixedAssetDepreciationDocument = gql`
    mutation PostFixedAssetDepreciation($id: ID!, $input: PostDepreciationInput!) {
  postFixedAssetDepreciation(id: $id, input: $input) {
    id
    accumulatedDepreciation
    bookValue
  }
}
    `;
export type PostFixedAssetDepreciationMutationFn = Apollo.MutationFunction<PostFixedAssetDepreciationMutation, PostFixedAssetDepreciationMutationVariables>;
export function usePostFixedAssetDepreciationMutation(baseOptions?: Apollo.MutationHookOptions<PostFixedAssetDepreciationMutation, PostFixedAssetDepreciationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PostFixedAssetDepreciationMutation, PostFixedAssetDepreciationMutationVariables>(PostFixedAssetDepreciationDocument, options);
      }
export type PostFixedAssetDepreciationMutationHookResult = ReturnType<typeof usePostFixedAssetDepreciationMutation>;
export type PostFixedAssetDepreciationMutationResult = Apollo.MutationResult<PostFixedAssetDepreciationMutation>;
export type PostFixedAssetDepreciationMutationOptions = Apollo.BaseMutationOptions<PostFixedAssetDepreciationMutation, PostFixedAssetDepreciationMutationVariables>;
export const DisposeFixedAssetDocument = gql`
    mutation DisposeFixedAsset($id: ID!, $disposalDate: String!, $notes: String) {
  disposeFixedAsset(id: $id, disposalDate: $disposalDate, notes: $notes) {
    id
    status
    disposalDate
  }
}
    `;
export type DisposeFixedAssetMutationFn = Apollo.MutationFunction<DisposeFixedAssetMutation, DisposeFixedAssetMutationVariables>;
export function useDisposeFixedAssetMutation(baseOptions?: Apollo.MutationHookOptions<DisposeFixedAssetMutation, DisposeFixedAssetMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DisposeFixedAssetMutation, DisposeFixedAssetMutationVariables>(DisposeFixedAssetDocument, options);
      }
export type DisposeFixedAssetMutationHookResult = ReturnType<typeof useDisposeFixedAssetMutation>;
export type DisposeFixedAssetMutationResult = Apollo.MutationResult<DisposeFixedAssetMutation>;
export type DisposeFixedAssetMutationOptions = Apollo.BaseMutationOptions<DisposeFixedAssetMutation, DisposeFixedAssetMutationVariables>;
export const GlobalSearchDocument = gql`
    query GlobalSearch($organizationId: ID!, $query: String!, $limitPerKind: Int) {
  globalSearch(
    organizationId: $organizationId
    query: $query
    limitPerKind: $limitPerKind
  ) {
    id
    kind
    title
    subtitle
    link
    matchedField
  }
}
    `;
export function useGlobalSearchQuery(baseOptions: Apollo.QueryHookOptions<GlobalSearchQuery, GlobalSearchQueryVariables> & ({ variables: GlobalSearchQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GlobalSearchQuery, GlobalSearchQueryVariables>(GlobalSearchDocument, options);
      }
export function useGlobalSearchLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GlobalSearchQuery, GlobalSearchQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GlobalSearchQuery, GlobalSearchQueryVariables>(GlobalSearchDocument, options);
        }
// @ts-ignore
export function useGlobalSearchSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GlobalSearchQuery, GlobalSearchQueryVariables>): Apollo.UseSuspenseQueryResult<GlobalSearchQuery, GlobalSearchQueryVariables>;
export function useGlobalSearchSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GlobalSearchQuery, GlobalSearchQueryVariables>): Apollo.UseSuspenseQueryResult<GlobalSearchQuery | undefined, GlobalSearchQueryVariables>;
export function useGlobalSearchSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GlobalSearchQuery, GlobalSearchQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GlobalSearchQuery, GlobalSearchQueryVariables>(GlobalSearchDocument, options);
        }
export type GlobalSearchQueryHookResult = ReturnType<typeof useGlobalSearchQuery>;
export type GlobalSearchLazyQueryHookResult = ReturnType<typeof useGlobalSearchLazyQuery>;
export type GlobalSearchSuspenseQueryHookResult = ReturnType<typeof useGlobalSearchSuspenseQuery>;
export type GlobalSearchQueryResult = Apollo.QueryResult<GlobalSearchQuery, GlobalSearchQueryVariables>;
export const GetHrMastersDocument = gql`
    query GetHrMasters($organizationId: ID!, $kind: String!, $active: Boolean, $search: String) {
  hrMasters(
    organizationId: $organizationId
    kind: $kind
    active: $active
    search: $search
  ) {
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
    `;
export function useGetHrMastersQuery(baseOptions: Apollo.QueryHookOptions<GetHrMastersQuery, GetHrMastersQueryVariables> & ({ variables: GetHrMastersQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetHrMastersQuery, GetHrMastersQueryVariables>(GetHrMastersDocument, options);
      }
export function useGetHrMastersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetHrMastersQuery, GetHrMastersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetHrMastersQuery, GetHrMastersQueryVariables>(GetHrMastersDocument, options);
        }
// @ts-ignore
export function useGetHrMastersSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetHrMastersQuery, GetHrMastersQueryVariables>): Apollo.UseSuspenseQueryResult<GetHrMastersQuery, GetHrMastersQueryVariables>;
export function useGetHrMastersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetHrMastersQuery, GetHrMastersQueryVariables>): Apollo.UseSuspenseQueryResult<GetHrMastersQuery | undefined, GetHrMastersQueryVariables>;
export function useGetHrMastersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetHrMastersQuery, GetHrMastersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetHrMastersQuery, GetHrMastersQueryVariables>(GetHrMastersDocument, options);
        }
export type GetHrMastersQueryHookResult = ReturnType<typeof useGetHrMastersQuery>;
export type GetHrMastersLazyQueryHookResult = ReturnType<typeof useGetHrMastersLazyQuery>;
export type GetHrMastersSuspenseQueryHookResult = ReturnType<typeof useGetHrMastersSuspenseQuery>;
export type GetHrMastersQueryResult = Apollo.QueryResult<GetHrMastersQuery, GetHrMastersQueryVariables>;
export const CreateHrMasterDocument = gql`
    mutation CreateHrMaster($input: CreateHrMasterInput!) {
  createHrMaster(input: $input) {
    id
    code
    name
  }
}
    `;
export type CreateHrMasterMutationFn = Apollo.MutationFunction<CreateHrMasterMutation, CreateHrMasterMutationVariables>;
export function useCreateHrMasterMutation(baseOptions?: Apollo.MutationHookOptions<CreateHrMasterMutation, CreateHrMasterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateHrMasterMutation, CreateHrMasterMutationVariables>(CreateHrMasterDocument, options);
      }
export type CreateHrMasterMutationHookResult = ReturnType<typeof useCreateHrMasterMutation>;
export type CreateHrMasterMutationResult = Apollo.MutationResult<CreateHrMasterMutation>;
export type CreateHrMasterMutationOptions = Apollo.BaseMutationOptions<CreateHrMasterMutation, CreateHrMasterMutationVariables>;
export const UpdateHrMasterDocument = gql`
    mutation UpdateHrMaster($id: ID!, $input: UpdateHrMasterInput!) {
  updateHrMaster(id: $id, input: $input) {
    id
    code
    name
    active
  }
}
    `;
export type UpdateHrMasterMutationFn = Apollo.MutationFunction<UpdateHrMasterMutation, UpdateHrMasterMutationVariables>;
export function useUpdateHrMasterMutation(baseOptions?: Apollo.MutationHookOptions<UpdateHrMasterMutation, UpdateHrMasterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateHrMasterMutation, UpdateHrMasterMutationVariables>(UpdateHrMasterDocument, options);
      }
export type UpdateHrMasterMutationHookResult = ReturnType<typeof useUpdateHrMasterMutation>;
export type UpdateHrMasterMutationResult = Apollo.MutationResult<UpdateHrMasterMutation>;
export type UpdateHrMasterMutationOptions = Apollo.BaseMutationOptions<UpdateHrMasterMutation, UpdateHrMasterMutationVariables>;
export const DeleteHrMasterDocument = gql`
    mutation DeleteHrMaster($id: ID!) {
  deleteHrMaster(id: $id) {
    id
  }
}
    `;
export type DeleteHrMasterMutationFn = Apollo.MutationFunction<DeleteHrMasterMutation, DeleteHrMasterMutationVariables>;
export function useDeleteHrMasterMutation(baseOptions?: Apollo.MutationHookOptions<DeleteHrMasterMutation, DeleteHrMasterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteHrMasterMutation, DeleteHrMasterMutationVariables>(DeleteHrMasterDocument, options);
      }
export type DeleteHrMasterMutationHookResult = ReturnType<typeof useDeleteHrMasterMutation>;
export type DeleteHrMasterMutationResult = Apollo.MutationResult<DeleteHrMasterMutation>;
export type DeleteHrMasterMutationOptions = Apollo.BaseMutationOptions<DeleteHrMasterMutation, DeleteHrMasterMutationVariables>;
export const GetEmployeeMastersDocument = gql`
    query GetEmployeeMasters($organizationId: ID!, $status: String, $department: String, $search: String) {
  employeeMasters(
    organizationId: $organizationId
    status: $status
    department: $department
    search: $search
  ) {
    id
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
    `;
export function useGetEmployeeMastersQuery(baseOptions: Apollo.QueryHookOptions<GetEmployeeMastersQuery, GetEmployeeMastersQueryVariables> & ({ variables: GetEmployeeMastersQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetEmployeeMastersQuery, GetEmployeeMastersQueryVariables>(GetEmployeeMastersDocument, options);
      }
export function useGetEmployeeMastersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetEmployeeMastersQuery, GetEmployeeMastersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetEmployeeMastersQuery, GetEmployeeMastersQueryVariables>(GetEmployeeMastersDocument, options);
        }
// @ts-ignore
export function useGetEmployeeMastersSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetEmployeeMastersQuery, GetEmployeeMastersQueryVariables>): Apollo.UseSuspenseQueryResult<GetEmployeeMastersQuery, GetEmployeeMastersQueryVariables>;
export function useGetEmployeeMastersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetEmployeeMastersQuery, GetEmployeeMastersQueryVariables>): Apollo.UseSuspenseQueryResult<GetEmployeeMastersQuery | undefined, GetEmployeeMastersQueryVariables>;
export function useGetEmployeeMastersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetEmployeeMastersQuery, GetEmployeeMastersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetEmployeeMastersQuery, GetEmployeeMastersQueryVariables>(GetEmployeeMastersDocument, options);
        }
export type GetEmployeeMastersQueryHookResult = ReturnType<typeof useGetEmployeeMastersQuery>;
export type GetEmployeeMastersLazyQueryHookResult = ReturnType<typeof useGetEmployeeMastersLazyQuery>;
export type GetEmployeeMastersSuspenseQueryHookResult = ReturnType<typeof useGetEmployeeMastersSuspenseQuery>;
export type GetEmployeeMastersQueryResult = Apollo.QueryResult<GetEmployeeMastersQuery, GetEmployeeMastersQueryVariables>;
export const GetEmployeeMasterDocument = gql`
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
    bankDetails {
      bankName
      accountNumber
      ifscCode
      branchName
    }
    emergencyContact {
      name
      relation
      phone
    }
    status
    notes
    createdAt
    updatedAt
  }
}
    `;
export function useGetEmployeeMasterQuery(baseOptions: Apollo.QueryHookOptions<GetEmployeeMasterQuery, GetEmployeeMasterQueryVariables> & ({ variables: GetEmployeeMasterQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetEmployeeMasterQuery, GetEmployeeMasterQueryVariables>(GetEmployeeMasterDocument, options);
      }
export function useGetEmployeeMasterLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetEmployeeMasterQuery, GetEmployeeMasterQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetEmployeeMasterQuery, GetEmployeeMasterQueryVariables>(GetEmployeeMasterDocument, options);
        }
// @ts-ignore
export function useGetEmployeeMasterSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetEmployeeMasterQuery, GetEmployeeMasterQueryVariables>): Apollo.UseSuspenseQueryResult<GetEmployeeMasterQuery, GetEmployeeMasterQueryVariables>;
export function useGetEmployeeMasterSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetEmployeeMasterQuery, GetEmployeeMasterQueryVariables>): Apollo.UseSuspenseQueryResult<GetEmployeeMasterQuery | undefined, GetEmployeeMasterQueryVariables>;
export function useGetEmployeeMasterSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetEmployeeMasterQuery, GetEmployeeMasterQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetEmployeeMasterQuery, GetEmployeeMasterQueryVariables>(GetEmployeeMasterDocument, options);
        }
export type GetEmployeeMasterQueryHookResult = ReturnType<typeof useGetEmployeeMasterQuery>;
export type GetEmployeeMasterLazyQueryHookResult = ReturnType<typeof useGetEmployeeMasterLazyQuery>;
export type GetEmployeeMasterSuspenseQueryHookResult = ReturnType<typeof useGetEmployeeMasterSuspenseQuery>;
export type GetEmployeeMasterQueryResult = Apollo.QueryResult<GetEmployeeMasterQuery, GetEmployeeMasterQueryVariables>;
export const CreateEmployeeMasterDocument = gql`
    mutation CreateEmployeeMaster($input: CreateEmployeeMasterInput!) {
  createEmployeeMaster(input: $input) {
    id
    employeeCode
    firstName
    lastName
  }
}
    `;
export type CreateEmployeeMasterMutationFn = Apollo.MutationFunction<CreateEmployeeMasterMutation, CreateEmployeeMasterMutationVariables>;
export function useCreateEmployeeMasterMutation(baseOptions?: Apollo.MutationHookOptions<CreateEmployeeMasterMutation, CreateEmployeeMasterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateEmployeeMasterMutation, CreateEmployeeMasterMutationVariables>(CreateEmployeeMasterDocument, options);
      }
export type CreateEmployeeMasterMutationHookResult = ReturnType<typeof useCreateEmployeeMasterMutation>;
export type CreateEmployeeMasterMutationResult = Apollo.MutationResult<CreateEmployeeMasterMutation>;
export type CreateEmployeeMasterMutationOptions = Apollo.BaseMutationOptions<CreateEmployeeMasterMutation, CreateEmployeeMasterMutationVariables>;
export const UpdateEmployeeMasterDocument = gql`
    mutation UpdateEmployeeMaster($id: ID!, $input: UpdateEmployeeMasterInput!) {
  updateEmployeeMaster(id: $id, input: $input) {
    id
    status
  }
}
    `;
export type UpdateEmployeeMasterMutationFn = Apollo.MutationFunction<UpdateEmployeeMasterMutation, UpdateEmployeeMasterMutationVariables>;
export function useUpdateEmployeeMasterMutation(baseOptions?: Apollo.MutationHookOptions<UpdateEmployeeMasterMutation, UpdateEmployeeMasterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateEmployeeMasterMutation, UpdateEmployeeMasterMutationVariables>(UpdateEmployeeMasterDocument, options);
      }
export type UpdateEmployeeMasterMutationHookResult = ReturnType<typeof useUpdateEmployeeMasterMutation>;
export type UpdateEmployeeMasterMutationResult = Apollo.MutationResult<UpdateEmployeeMasterMutation>;
export type UpdateEmployeeMasterMutationOptions = Apollo.BaseMutationOptions<UpdateEmployeeMasterMutation, UpdateEmployeeMasterMutationVariables>;
export const DeleteEmployeeMasterDocument = gql`
    mutation DeleteEmployeeMaster($id: ID!) {
  deleteEmployeeMaster(id: $id) {
    id
  }
}
    `;
export type DeleteEmployeeMasterMutationFn = Apollo.MutationFunction<DeleteEmployeeMasterMutation, DeleteEmployeeMasterMutationVariables>;
export function useDeleteEmployeeMasterMutation(baseOptions?: Apollo.MutationHookOptions<DeleteEmployeeMasterMutation, DeleteEmployeeMasterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteEmployeeMasterMutation, DeleteEmployeeMasterMutationVariables>(DeleteEmployeeMasterDocument, options);
      }
export type DeleteEmployeeMasterMutationHookResult = ReturnType<typeof useDeleteEmployeeMasterMutation>;
export type DeleteEmployeeMasterMutationResult = Apollo.MutationResult<DeleteEmployeeMasterMutation>;
export type DeleteEmployeeMasterMutationOptions = Apollo.BaseMutationOptions<DeleteEmployeeMasterMutation, DeleteEmployeeMasterMutationVariables>;
export const GetDeliveryOrdersDocument = gql`
    query GetDeliveryOrders($organizationId: ID!, $status: String, $customerId: ID, $salesOrderId: ID, $search: String) {
  deliveryOrders(
    organizationId: $organizationId
    status: $status
    customerId: $customerId
    salesOrderId: $salesOrderId
    search: $search
  ) {
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
    `;
export function useGetDeliveryOrdersQuery(baseOptions: Apollo.QueryHookOptions<GetDeliveryOrdersQuery, GetDeliveryOrdersQueryVariables> & ({ variables: GetDeliveryOrdersQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetDeliveryOrdersQuery, GetDeliveryOrdersQueryVariables>(GetDeliveryOrdersDocument, options);
      }
export function useGetDeliveryOrdersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetDeliveryOrdersQuery, GetDeliveryOrdersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetDeliveryOrdersQuery, GetDeliveryOrdersQueryVariables>(GetDeliveryOrdersDocument, options);
        }
// @ts-ignore
export function useGetDeliveryOrdersSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetDeliveryOrdersQuery, GetDeliveryOrdersQueryVariables>): Apollo.UseSuspenseQueryResult<GetDeliveryOrdersQuery, GetDeliveryOrdersQueryVariables>;
export function useGetDeliveryOrdersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetDeliveryOrdersQuery, GetDeliveryOrdersQueryVariables>): Apollo.UseSuspenseQueryResult<GetDeliveryOrdersQuery | undefined, GetDeliveryOrdersQueryVariables>;
export function useGetDeliveryOrdersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetDeliveryOrdersQuery, GetDeliveryOrdersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetDeliveryOrdersQuery, GetDeliveryOrdersQueryVariables>(GetDeliveryOrdersDocument, options);
        }
export type GetDeliveryOrdersQueryHookResult = ReturnType<typeof useGetDeliveryOrdersQuery>;
export type GetDeliveryOrdersLazyQueryHookResult = ReturnType<typeof useGetDeliveryOrdersLazyQuery>;
export type GetDeliveryOrdersSuspenseQueryHookResult = ReturnType<typeof useGetDeliveryOrdersSuspenseQuery>;
export type GetDeliveryOrdersQueryResult = Apollo.QueryResult<GetDeliveryOrdersQuery, GetDeliveryOrdersQueryVariables>;
export const CreateDeliveryOrderDocument = gql`
    mutation CreateDeliveryOrder($input: CreateDeliveryOrderInput!) {
  createDeliveryOrder(input: $input) {
    id
    docNumber
  }
}
    `;
export type CreateDeliveryOrderMutationFn = Apollo.MutationFunction<CreateDeliveryOrderMutation, CreateDeliveryOrderMutationVariables>;
export function useCreateDeliveryOrderMutation(baseOptions?: Apollo.MutationHookOptions<CreateDeliveryOrderMutation, CreateDeliveryOrderMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateDeliveryOrderMutation, CreateDeliveryOrderMutationVariables>(CreateDeliveryOrderDocument, options);
      }
export type CreateDeliveryOrderMutationHookResult = ReturnType<typeof useCreateDeliveryOrderMutation>;
export type CreateDeliveryOrderMutationResult = Apollo.MutationResult<CreateDeliveryOrderMutation>;
export type CreateDeliveryOrderMutationOptions = Apollo.BaseMutationOptions<CreateDeliveryOrderMutation, CreateDeliveryOrderMutationVariables>;
export const UpdateDeliveryOrderDocument = gql`
    mutation UpdateDeliveryOrder($id: ID!, $input: UpdateDeliveryOrderInput!) {
  updateDeliveryOrder(id: $id, input: $input) {
    id
    status
  }
}
    `;
export type UpdateDeliveryOrderMutationFn = Apollo.MutationFunction<UpdateDeliveryOrderMutation, UpdateDeliveryOrderMutationVariables>;
export function useUpdateDeliveryOrderMutation(baseOptions?: Apollo.MutationHookOptions<UpdateDeliveryOrderMutation, UpdateDeliveryOrderMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateDeliveryOrderMutation, UpdateDeliveryOrderMutationVariables>(UpdateDeliveryOrderDocument, options);
      }
export type UpdateDeliveryOrderMutationHookResult = ReturnType<typeof useUpdateDeliveryOrderMutation>;
export type UpdateDeliveryOrderMutationResult = Apollo.MutationResult<UpdateDeliveryOrderMutation>;
export type UpdateDeliveryOrderMutationOptions = Apollo.BaseMutationOptions<UpdateDeliveryOrderMutation, UpdateDeliveryOrderMutationVariables>;
export const DeleteDeliveryOrderDocument = gql`
    mutation DeleteDeliveryOrder($id: ID!) {
  deleteDeliveryOrder(id: $id) {
    id
  }
}
    `;
export type DeleteDeliveryOrderMutationFn = Apollo.MutationFunction<DeleteDeliveryOrderMutation, DeleteDeliveryOrderMutationVariables>;
export function useDeleteDeliveryOrderMutation(baseOptions?: Apollo.MutationHookOptions<DeleteDeliveryOrderMutation, DeleteDeliveryOrderMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteDeliveryOrderMutation, DeleteDeliveryOrderMutationVariables>(DeleteDeliveryOrderDocument, options);
      }
export type DeleteDeliveryOrderMutationHookResult = ReturnType<typeof useDeleteDeliveryOrderMutation>;
export type DeleteDeliveryOrderMutationResult = Apollo.MutationResult<DeleteDeliveryOrderMutation>;
export type DeleteDeliveryOrderMutationOptions = Apollo.BaseMutationOptions<DeleteDeliveryOrderMutation, DeleteDeliveryOrderMutationVariables>;
export const TransitionDeliveryOrderStatusDocument = gql`
    mutation TransitionDeliveryOrderStatus($id: ID!, $status: String!, $signedBy: String) {
  transitionDeliveryOrderStatus(id: $id, status: $status, signedBy: $signedBy) {
    id
    status
  }
}
    `;
export type TransitionDeliveryOrderStatusMutationFn = Apollo.MutationFunction<TransitionDeliveryOrderStatusMutation, TransitionDeliveryOrderStatusMutationVariables>;
export function useTransitionDeliveryOrderStatusMutation(baseOptions?: Apollo.MutationHookOptions<TransitionDeliveryOrderStatusMutation, TransitionDeliveryOrderStatusMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<TransitionDeliveryOrderStatusMutation, TransitionDeliveryOrderStatusMutationVariables>(TransitionDeliveryOrderStatusDocument, options);
      }
export type TransitionDeliveryOrderStatusMutationHookResult = ReturnType<typeof useTransitionDeliveryOrderStatusMutation>;
export type TransitionDeliveryOrderStatusMutationResult = Apollo.MutationResult<TransitionDeliveryOrderStatusMutation>;
export type TransitionDeliveryOrderStatusMutationOptions = Apollo.BaseMutationOptions<TransitionDeliveryOrderStatusMutation, TransitionDeliveryOrderStatusMutationVariables>;
export const GetIntercompanyAllocationsDocument = gql`
    query GetIntercompanyAllocations($organizationId: ID!, $status: String, $search: String) {
  intercompanyAllocations(
    organizationId: $organizationId
    status: $status
    search: $search
  ) {
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
    `;
export function useGetIntercompanyAllocationsQuery(baseOptions: Apollo.QueryHookOptions<GetIntercompanyAllocationsQuery, GetIntercompanyAllocationsQueryVariables> & ({ variables: GetIntercompanyAllocationsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetIntercompanyAllocationsQuery, GetIntercompanyAllocationsQueryVariables>(GetIntercompanyAllocationsDocument, options);
      }
export function useGetIntercompanyAllocationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetIntercompanyAllocationsQuery, GetIntercompanyAllocationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetIntercompanyAllocationsQuery, GetIntercompanyAllocationsQueryVariables>(GetIntercompanyAllocationsDocument, options);
        }
// @ts-ignore
export function useGetIntercompanyAllocationsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetIntercompanyAllocationsQuery, GetIntercompanyAllocationsQueryVariables>): Apollo.UseSuspenseQueryResult<GetIntercompanyAllocationsQuery, GetIntercompanyAllocationsQueryVariables>;
export function useGetIntercompanyAllocationsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetIntercompanyAllocationsQuery, GetIntercompanyAllocationsQueryVariables>): Apollo.UseSuspenseQueryResult<GetIntercompanyAllocationsQuery | undefined, GetIntercompanyAllocationsQueryVariables>;
export function useGetIntercompanyAllocationsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetIntercompanyAllocationsQuery, GetIntercompanyAllocationsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetIntercompanyAllocationsQuery, GetIntercompanyAllocationsQueryVariables>(GetIntercompanyAllocationsDocument, options);
        }
export type GetIntercompanyAllocationsQueryHookResult = ReturnType<typeof useGetIntercompanyAllocationsQuery>;
export type GetIntercompanyAllocationsLazyQueryHookResult = ReturnType<typeof useGetIntercompanyAllocationsLazyQuery>;
export type GetIntercompanyAllocationsSuspenseQueryHookResult = ReturnType<typeof useGetIntercompanyAllocationsSuspenseQuery>;
export type GetIntercompanyAllocationsQueryResult = Apollo.QueryResult<GetIntercompanyAllocationsQuery, GetIntercompanyAllocationsQueryVariables>;
export const CreateIntercompanyAllocationDocument = gql`
    mutation CreateIntercompanyAllocation($input: CreateIntercompanyAllocationInput!) {
  createIntercompanyAllocation(input: $input) {
    id
    scheduleCode
  }
}
    `;
export type CreateIntercompanyAllocationMutationFn = Apollo.MutationFunction<CreateIntercompanyAllocationMutation, CreateIntercompanyAllocationMutationVariables>;
export function useCreateIntercompanyAllocationMutation(baseOptions?: Apollo.MutationHookOptions<CreateIntercompanyAllocationMutation, CreateIntercompanyAllocationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateIntercompanyAllocationMutation, CreateIntercompanyAllocationMutationVariables>(CreateIntercompanyAllocationDocument, options);
      }
export type CreateIntercompanyAllocationMutationHookResult = ReturnType<typeof useCreateIntercompanyAllocationMutation>;
export type CreateIntercompanyAllocationMutationResult = Apollo.MutationResult<CreateIntercompanyAllocationMutation>;
export type CreateIntercompanyAllocationMutationOptions = Apollo.BaseMutationOptions<CreateIntercompanyAllocationMutation, CreateIntercompanyAllocationMutationVariables>;
export const UpdateIntercompanyAllocationDocument = gql`
    mutation UpdateIntercompanyAllocation($id: ID!, $input: UpdateIntercompanyAllocationInput!) {
  updateIntercompanyAllocation(id: $id, input: $input) {
    id
    status
  }
}
    `;
export type UpdateIntercompanyAllocationMutationFn = Apollo.MutationFunction<UpdateIntercompanyAllocationMutation, UpdateIntercompanyAllocationMutationVariables>;
export function useUpdateIntercompanyAllocationMutation(baseOptions?: Apollo.MutationHookOptions<UpdateIntercompanyAllocationMutation, UpdateIntercompanyAllocationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateIntercompanyAllocationMutation, UpdateIntercompanyAllocationMutationVariables>(UpdateIntercompanyAllocationDocument, options);
      }
export type UpdateIntercompanyAllocationMutationHookResult = ReturnType<typeof useUpdateIntercompanyAllocationMutation>;
export type UpdateIntercompanyAllocationMutationResult = Apollo.MutationResult<UpdateIntercompanyAllocationMutation>;
export type UpdateIntercompanyAllocationMutationOptions = Apollo.BaseMutationOptions<UpdateIntercompanyAllocationMutation, UpdateIntercompanyAllocationMutationVariables>;
export const DeleteIntercompanyAllocationDocument = gql`
    mutation DeleteIntercompanyAllocation($id: ID!) {
  deleteIntercompanyAllocation(id: $id) {
    id
  }
}
    `;
export type DeleteIntercompanyAllocationMutationFn = Apollo.MutationFunction<DeleteIntercompanyAllocationMutation, DeleteIntercompanyAllocationMutationVariables>;
export function useDeleteIntercompanyAllocationMutation(baseOptions?: Apollo.MutationHookOptions<DeleteIntercompanyAllocationMutation, DeleteIntercompanyAllocationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteIntercompanyAllocationMutation, DeleteIntercompanyAllocationMutationVariables>(DeleteIntercompanyAllocationDocument, options);
      }
export type DeleteIntercompanyAllocationMutationHookResult = ReturnType<typeof useDeleteIntercompanyAllocationMutation>;
export type DeleteIntercompanyAllocationMutationResult = Apollo.MutationResult<DeleteIntercompanyAllocationMutation>;
export type DeleteIntercompanyAllocationMutationOptions = Apollo.BaseMutationOptions<DeleteIntercompanyAllocationMutation, DeleteIntercompanyAllocationMutationVariables>;
export const PostIntercompanyAllocationDocument = gql`
    mutation PostIntercompanyAllocation($id: ID!) {
  postIntercompanyAllocation(id: $id) {
    id
    status
    postedAt
  }
}
    `;
export type PostIntercompanyAllocationMutationFn = Apollo.MutationFunction<PostIntercompanyAllocationMutation, PostIntercompanyAllocationMutationVariables>;
export function usePostIntercompanyAllocationMutation(baseOptions?: Apollo.MutationHookOptions<PostIntercompanyAllocationMutation, PostIntercompanyAllocationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PostIntercompanyAllocationMutation, PostIntercompanyAllocationMutationVariables>(PostIntercompanyAllocationDocument, options);
      }
export type PostIntercompanyAllocationMutationHookResult = ReturnType<typeof usePostIntercompanyAllocationMutation>;
export type PostIntercompanyAllocationMutationResult = Apollo.MutationResult<PostIntercompanyAllocationMutation>;
export type PostIntercompanyAllocationMutationOptions = Apollo.BaseMutationOptions<PostIntercompanyAllocationMutation, PostIntercompanyAllocationMutationVariables>;
export const GetIntercompanyJournalsDocument = gql`
    query GetIntercompanyJournals($originatingOrganizationId: ID!, $status: String, $search: String) {
  intercompanyJournalEntries(
    originatingOrganizationId: $originatingOrganizationId
    status: $status
    search: $search
  ) {
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
    `;
export function useGetIntercompanyJournalsQuery(baseOptions: Apollo.QueryHookOptions<GetIntercompanyJournalsQuery, GetIntercompanyJournalsQueryVariables> & ({ variables: GetIntercompanyJournalsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetIntercompanyJournalsQuery, GetIntercompanyJournalsQueryVariables>(GetIntercompanyJournalsDocument, options);
      }
export function useGetIntercompanyJournalsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetIntercompanyJournalsQuery, GetIntercompanyJournalsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetIntercompanyJournalsQuery, GetIntercompanyJournalsQueryVariables>(GetIntercompanyJournalsDocument, options);
        }
// @ts-ignore
export function useGetIntercompanyJournalsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetIntercompanyJournalsQuery, GetIntercompanyJournalsQueryVariables>): Apollo.UseSuspenseQueryResult<GetIntercompanyJournalsQuery, GetIntercompanyJournalsQueryVariables>;
export function useGetIntercompanyJournalsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetIntercompanyJournalsQuery, GetIntercompanyJournalsQueryVariables>): Apollo.UseSuspenseQueryResult<GetIntercompanyJournalsQuery | undefined, GetIntercompanyJournalsQueryVariables>;
export function useGetIntercompanyJournalsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetIntercompanyJournalsQuery, GetIntercompanyJournalsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetIntercompanyJournalsQuery, GetIntercompanyJournalsQueryVariables>(GetIntercompanyJournalsDocument, options);
        }
export type GetIntercompanyJournalsQueryHookResult = ReturnType<typeof useGetIntercompanyJournalsQuery>;
export type GetIntercompanyJournalsLazyQueryHookResult = ReturnType<typeof useGetIntercompanyJournalsLazyQuery>;
export type GetIntercompanyJournalsSuspenseQueryHookResult = ReturnType<typeof useGetIntercompanyJournalsSuspenseQuery>;
export type GetIntercompanyJournalsQueryResult = Apollo.QueryResult<GetIntercompanyJournalsQuery, GetIntercompanyJournalsQueryVariables>;
export const CreateIntercompanyJournalDocument = gql`
    mutation CreateIntercompanyJournal($input: CreateIntercompanyJournalInput!) {
  createIntercompanyJournalEntry(input: $input) {
    id
    docNumber
  }
}
    `;
export type CreateIntercompanyJournalMutationFn = Apollo.MutationFunction<CreateIntercompanyJournalMutation, CreateIntercompanyJournalMutationVariables>;
export function useCreateIntercompanyJournalMutation(baseOptions?: Apollo.MutationHookOptions<CreateIntercompanyJournalMutation, CreateIntercompanyJournalMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateIntercompanyJournalMutation, CreateIntercompanyJournalMutationVariables>(CreateIntercompanyJournalDocument, options);
      }
export type CreateIntercompanyJournalMutationHookResult = ReturnType<typeof useCreateIntercompanyJournalMutation>;
export type CreateIntercompanyJournalMutationResult = Apollo.MutationResult<CreateIntercompanyJournalMutation>;
export type CreateIntercompanyJournalMutationOptions = Apollo.BaseMutationOptions<CreateIntercompanyJournalMutation, CreateIntercompanyJournalMutationVariables>;
export const PostIntercompanyJournalDocument = gql`
    mutation PostIntercompanyJournal($id: ID!) {
  postIntercompanyJournalEntry(id: $id) {
    id
    status
    postedAt
  }
}
    `;
export type PostIntercompanyJournalMutationFn = Apollo.MutationFunction<PostIntercompanyJournalMutation, PostIntercompanyJournalMutationVariables>;
export function usePostIntercompanyJournalMutation(baseOptions?: Apollo.MutationHookOptions<PostIntercompanyJournalMutation, PostIntercompanyJournalMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PostIntercompanyJournalMutation, PostIntercompanyJournalMutationVariables>(PostIntercompanyJournalDocument, options);
      }
export type PostIntercompanyJournalMutationHookResult = ReturnType<typeof usePostIntercompanyJournalMutation>;
export type PostIntercompanyJournalMutationResult = Apollo.MutationResult<PostIntercompanyJournalMutation>;
export type PostIntercompanyJournalMutationOptions = Apollo.BaseMutationOptions<PostIntercompanyJournalMutation, PostIntercompanyJournalMutationVariables>;
export const ReverseIntercompanyJournalDocument = gql`
    mutation ReverseIntercompanyJournal($id: ID!) {
  reverseIntercompanyJournalEntry(id: $id) {
    id
    status
  }
}
    `;
export type ReverseIntercompanyJournalMutationFn = Apollo.MutationFunction<ReverseIntercompanyJournalMutation, ReverseIntercompanyJournalMutationVariables>;
export function useReverseIntercompanyJournalMutation(baseOptions?: Apollo.MutationHookOptions<ReverseIntercompanyJournalMutation, ReverseIntercompanyJournalMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ReverseIntercompanyJournalMutation, ReverseIntercompanyJournalMutationVariables>(ReverseIntercompanyJournalDocument, options);
      }
export type ReverseIntercompanyJournalMutationHookResult = ReturnType<typeof useReverseIntercompanyJournalMutation>;
export type ReverseIntercompanyJournalMutationResult = Apollo.MutationResult<ReverseIntercompanyJournalMutation>;
export type ReverseIntercompanyJournalMutationOptions = Apollo.BaseMutationOptions<ReverseIntercompanyJournalMutation, ReverseIntercompanyJournalMutationVariables>;
export const GetQcInspectionsDocument = gql`
    query GetQCInspections($organizationId: ID!, $outcome: String, $sourceModule: String, $search: String) {
  qcInspections(
    organizationId: $organizationId
    outcome: $outcome
    sourceModule: $sourceModule
    search: $search
  ) {
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
    defects {
      code
      severity
      quantity
    }
    createdAt
  }
}
    `;
export function useGetQcInspectionsQuery(baseOptions: Apollo.QueryHookOptions<GetQcInspectionsQuery, GetQcInspectionsQueryVariables> & ({ variables: GetQcInspectionsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetQcInspectionsQuery, GetQcInspectionsQueryVariables>(GetQcInspectionsDocument, options);
      }
export function useGetQcInspectionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetQcInspectionsQuery, GetQcInspectionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetQcInspectionsQuery, GetQcInspectionsQueryVariables>(GetQcInspectionsDocument, options);
        }
// @ts-ignore
export function useGetQcInspectionsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetQcInspectionsQuery, GetQcInspectionsQueryVariables>): Apollo.UseSuspenseQueryResult<GetQcInspectionsQuery, GetQcInspectionsQueryVariables>;
export function useGetQcInspectionsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetQcInspectionsQuery, GetQcInspectionsQueryVariables>): Apollo.UseSuspenseQueryResult<GetQcInspectionsQuery | undefined, GetQcInspectionsQueryVariables>;
export function useGetQcInspectionsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetQcInspectionsQuery, GetQcInspectionsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetQcInspectionsQuery, GetQcInspectionsQueryVariables>(GetQcInspectionsDocument, options);
        }
export type GetQcInspectionsQueryHookResult = ReturnType<typeof useGetQcInspectionsQuery>;
export type GetQcInspectionsLazyQueryHookResult = ReturnType<typeof useGetQcInspectionsLazyQuery>;
export type GetQcInspectionsSuspenseQueryHookResult = ReturnType<typeof useGetQcInspectionsSuspenseQuery>;
export type GetQcInspectionsQueryResult = Apollo.QueryResult<GetQcInspectionsQuery, GetQcInspectionsQueryVariables>;
export const GetQcOutcomeSummaryDocument = gql`
    query GetQCOutcomeSummary($organizationId: ID!) {
  qcOutcomeSummary(organizationId: $organizationId) {
    outcome
    count
    quantityInspected
    quantityPassed
    quantityFailed
  }
}
    `;
export function useGetQcOutcomeSummaryQuery(baseOptions: Apollo.QueryHookOptions<GetQcOutcomeSummaryQuery, GetQcOutcomeSummaryQueryVariables> & ({ variables: GetQcOutcomeSummaryQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetQcOutcomeSummaryQuery, GetQcOutcomeSummaryQueryVariables>(GetQcOutcomeSummaryDocument, options);
      }
export function useGetQcOutcomeSummaryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetQcOutcomeSummaryQuery, GetQcOutcomeSummaryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetQcOutcomeSummaryQuery, GetQcOutcomeSummaryQueryVariables>(GetQcOutcomeSummaryDocument, options);
        }
// @ts-ignore
export function useGetQcOutcomeSummarySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetQcOutcomeSummaryQuery, GetQcOutcomeSummaryQueryVariables>): Apollo.UseSuspenseQueryResult<GetQcOutcomeSummaryQuery, GetQcOutcomeSummaryQueryVariables>;
export function useGetQcOutcomeSummarySuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetQcOutcomeSummaryQuery, GetQcOutcomeSummaryQueryVariables>): Apollo.UseSuspenseQueryResult<GetQcOutcomeSummaryQuery | undefined, GetQcOutcomeSummaryQueryVariables>;
export function useGetQcOutcomeSummarySuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetQcOutcomeSummaryQuery, GetQcOutcomeSummaryQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetQcOutcomeSummaryQuery, GetQcOutcomeSummaryQueryVariables>(GetQcOutcomeSummaryDocument, options);
        }
export type GetQcOutcomeSummaryQueryHookResult = ReturnType<typeof useGetQcOutcomeSummaryQuery>;
export type GetQcOutcomeSummaryLazyQueryHookResult = ReturnType<typeof useGetQcOutcomeSummaryLazyQuery>;
export type GetQcOutcomeSummarySuspenseQueryHookResult = ReturnType<typeof useGetQcOutcomeSummarySuspenseQuery>;
export type GetQcOutcomeSummaryQueryResult = Apollo.QueryResult<GetQcOutcomeSummaryQuery, GetQcOutcomeSummaryQueryVariables>;
export const CreateQcInspectionDocument = gql`
    mutation CreateQCInspection($input: CreateQCInspectionInput!) {
  createQCInspection(input: $input) {
    id
    docNumber
    outcome
  }
}
    `;
export type CreateQcInspectionMutationFn = Apollo.MutationFunction<CreateQcInspectionMutation, CreateQcInspectionMutationVariables>;
export function useCreateQcInspectionMutation(baseOptions?: Apollo.MutationHookOptions<CreateQcInspectionMutation, CreateQcInspectionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateQcInspectionMutation, CreateQcInspectionMutationVariables>(CreateQcInspectionDocument, options);
      }
export type CreateQcInspectionMutationHookResult = ReturnType<typeof useCreateQcInspectionMutation>;
export type CreateQcInspectionMutationResult = Apollo.MutationResult<CreateQcInspectionMutation>;
export type CreateQcInspectionMutationOptions = Apollo.BaseMutationOptions<CreateQcInspectionMutation, CreateQcInspectionMutationVariables>;
export const SetQcInspectionOutcomeDocument = gql`
    mutation SetQCInspectionOutcome($id: ID!, $outcome: String!, $notes: String) {
  setQCInspectionOutcome(id: $id, outcome: $outcome, notes: $notes) {
    id
    outcome
  }
}
    `;
export type SetQcInspectionOutcomeMutationFn = Apollo.MutationFunction<SetQcInspectionOutcomeMutation, SetQcInspectionOutcomeMutationVariables>;
export function useSetQcInspectionOutcomeMutation(baseOptions?: Apollo.MutationHookOptions<SetQcInspectionOutcomeMutation, SetQcInspectionOutcomeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SetQcInspectionOutcomeMutation, SetQcInspectionOutcomeMutationVariables>(SetQcInspectionOutcomeDocument, options);
      }
export type SetQcInspectionOutcomeMutationHookResult = ReturnType<typeof useSetQcInspectionOutcomeMutation>;
export type SetQcInspectionOutcomeMutationResult = Apollo.MutationResult<SetQcInspectionOutcomeMutation>;
export type SetQcInspectionOutcomeMutationOptions = Apollo.BaseMutationOptions<SetQcInspectionOutcomeMutation, SetQcInspectionOutcomeMutationVariables>;
export const DeleteQcInspectionDocument = gql`
    mutation DeleteQCInspection($id: ID!) {
  deleteQCInspection(id: $id) {
    id
  }
}
    `;
export type DeleteQcInspectionMutationFn = Apollo.MutationFunction<DeleteQcInspectionMutation, DeleteQcInspectionMutationVariables>;
export function useDeleteQcInspectionMutation(baseOptions?: Apollo.MutationHookOptions<DeleteQcInspectionMutation, DeleteQcInspectionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteQcInspectionMutation, DeleteQcInspectionMutationVariables>(DeleteQcInspectionDocument, options);
      }
export type DeleteQcInspectionMutationHookResult = ReturnType<typeof useDeleteQcInspectionMutation>;
export type DeleteQcInspectionMutationResult = Apollo.MutationResult<DeleteQcInspectionMutation>;
export type DeleteQcInspectionMutationOptions = Apollo.BaseMutationOptions<DeleteQcInspectionMutation, DeleteQcInspectionMutationVariables>;
export const GetAssetMaintenancesDocument = gql`
    query GetAssetMaintenances($organizationId: ID!, $status: String, $assetId: ID, $maintenanceType: String, $search: String) {
  assetMaintenances(
    organizationId: $organizationId
    status: $status
    assetId: $assetId
    maintenanceType: $maintenanceType
    search: $search
  ) {
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
    `;
export function useGetAssetMaintenancesQuery(baseOptions: Apollo.QueryHookOptions<GetAssetMaintenancesQuery, GetAssetMaintenancesQueryVariables> & ({ variables: GetAssetMaintenancesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAssetMaintenancesQuery, GetAssetMaintenancesQueryVariables>(GetAssetMaintenancesDocument, options);
      }
export function useGetAssetMaintenancesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAssetMaintenancesQuery, GetAssetMaintenancesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAssetMaintenancesQuery, GetAssetMaintenancesQueryVariables>(GetAssetMaintenancesDocument, options);
        }
// @ts-ignore
export function useGetAssetMaintenancesSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetAssetMaintenancesQuery, GetAssetMaintenancesQueryVariables>): Apollo.UseSuspenseQueryResult<GetAssetMaintenancesQuery, GetAssetMaintenancesQueryVariables>;
export function useGetAssetMaintenancesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAssetMaintenancesQuery, GetAssetMaintenancesQueryVariables>): Apollo.UseSuspenseQueryResult<GetAssetMaintenancesQuery | undefined, GetAssetMaintenancesQueryVariables>;
export function useGetAssetMaintenancesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAssetMaintenancesQuery, GetAssetMaintenancesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAssetMaintenancesQuery, GetAssetMaintenancesQueryVariables>(GetAssetMaintenancesDocument, options);
        }
export type GetAssetMaintenancesQueryHookResult = ReturnType<typeof useGetAssetMaintenancesQuery>;
export type GetAssetMaintenancesLazyQueryHookResult = ReturnType<typeof useGetAssetMaintenancesLazyQuery>;
export type GetAssetMaintenancesSuspenseQueryHookResult = ReturnType<typeof useGetAssetMaintenancesSuspenseQuery>;
export type GetAssetMaintenancesQueryResult = Apollo.QueryResult<GetAssetMaintenancesQuery, GetAssetMaintenancesQueryVariables>;
export const GetUpcomingMaintenanceDocument = gql`
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
    `;
export function useGetUpcomingMaintenanceQuery(baseOptions: Apollo.QueryHookOptions<GetUpcomingMaintenanceQuery, GetUpcomingMaintenanceQueryVariables> & ({ variables: GetUpcomingMaintenanceQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUpcomingMaintenanceQuery, GetUpcomingMaintenanceQueryVariables>(GetUpcomingMaintenanceDocument, options);
      }
export function useGetUpcomingMaintenanceLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUpcomingMaintenanceQuery, GetUpcomingMaintenanceQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUpcomingMaintenanceQuery, GetUpcomingMaintenanceQueryVariables>(GetUpcomingMaintenanceDocument, options);
        }
// @ts-ignore
export function useGetUpcomingMaintenanceSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetUpcomingMaintenanceQuery, GetUpcomingMaintenanceQueryVariables>): Apollo.UseSuspenseQueryResult<GetUpcomingMaintenanceQuery, GetUpcomingMaintenanceQueryVariables>;
export function useGetUpcomingMaintenanceSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUpcomingMaintenanceQuery, GetUpcomingMaintenanceQueryVariables>): Apollo.UseSuspenseQueryResult<GetUpcomingMaintenanceQuery | undefined, GetUpcomingMaintenanceQueryVariables>;
export function useGetUpcomingMaintenanceSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUpcomingMaintenanceQuery, GetUpcomingMaintenanceQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUpcomingMaintenanceQuery, GetUpcomingMaintenanceQueryVariables>(GetUpcomingMaintenanceDocument, options);
        }
export type GetUpcomingMaintenanceQueryHookResult = ReturnType<typeof useGetUpcomingMaintenanceQuery>;
export type GetUpcomingMaintenanceLazyQueryHookResult = ReturnType<typeof useGetUpcomingMaintenanceLazyQuery>;
export type GetUpcomingMaintenanceSuspenseQueryHookResult = ReturnType<typeof useGetUpcomingMaintenanceSuspenseQuery>;
export type GetUpcomingMaintenanceQueryResult = Apollo.QueryResult<GetUpcomingMaintenanceQuery, GetUpcomingMaintenanceQueryVariables>;
export const CreateAssetMaintenanceDocument = gql`
    mutation CreateAssetMaintenance($input: CreateAssetMaintenanceInput!) {
  createAssetMaintenance(input: $input) {
    id
    docNumber
  }
}
    `;
export type CreateAssetMaintenanceMutationFn = Apollo.MutationFunction<CreateAssetMaintenanceMutation, CreateAssetMaintenanceMutationVariables>;
export function useCreateAssetMaintenanceMutation(baseOptions?: Apollo.MutationHookOptions<CreateAssetMaintenanceMutation, CreateAssetMaintenanceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateAssetMaintenanceMutation, CreateAssetMaintenanceMutationVariables>(CreateAssetMaintenanceDocument, options);
      }
export type CreateAssetMaintenanceMutationHookResult = ReturnType<typeof useCreateAssetMaintenanceMutation>;
export type CreateAssetMaintenanceMutationResult = Apollo.MutationResult<CreateAssetMaintenanceMutation>;
export type CreateAssetMaintenanceMutationOptions = Apollo.BaseMutationOptions<CreateAssetMaintenanceMutation, CreateAssetMaintenanceMutationVariables>;
export const UpdateAssetMaintenanceDocument = gql`
    mutation UpdateAssetMaintenance($id: ID!, $input: UpdateAssetMaintenanceInput!) {
  updateAssetMaintenance(id: $id, input: $input) {
    id
    status
  }
}
    `;
export type UpdateAssetMaintenanceMutationFn = Apollo.MutationFunction<UpdateAssetMaintenanceMutation, UpdateAssetMaintenanceMutationVariables>;
export function useUpdateAssetMaintenanceMutation(baseOptions?: Apollo.MutationHookOptions<UpdateAssetMaintenanceMutation, UpdateAssetMaintenanceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateAssetMaintenanceMutation, UpdateAssetMaintenanceMutationVariables>(UpdateAssetMaintenanceDocument, options);
      }
export type UpdateAssetMaintenanceMutationHookResult = ReturnType<typeof useUpdateAssetMaintenanceMutation>;
export type UpdateAssetMaintenanceMutationResult = Apollo.MutationResult<UpdateAssetMaintenanceMutation>;
export type UpdateAssetMaintenanceMutationOptions = Apollo.BaseMutationOptions<UpdateAssetMaintenanceMutation, UpdateAssetMaintenanceMutationVariables>;
export const DeleteAssetMaintenanceDocument = gql`
    mutation DeleteAssetMaintenance($id: ID!) {
  deleteAssetMaintenance(id: $id) {
    id
  }
}
    `;
export type DeleteAssetMaintenanceMutationFn = Apollo.MutationFunction<DeleteAssetMaintenanceMutation, DeleteAssetMaintenanceMutationVariables>;
export function useDeleteAssetMaintenanceMutation(baseOptions?: Apollo.MutationHookOptions<DeleteAssetMaintenanceMutation, DeleteAssetMaintenanceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteAssetMaintenanceMutation, DeleteAssetMaintenanceMutationVariables>(DeleteAssetMaintenanceDocument, options);
      }
export type DeleteAssetMaintenanceMutationHookResult = ReturnType<typeof useDeleteAssetMaintenanceMutation>;
export type DeleteAssetMaintenanceMutationResult = Apollo.MutationResult<DeleteAssetMaintenanceMutation>;
export type DeleteAssetMaintenanceMutationOptions = Apollo.BaseMutationOptions<DeleteAssetMaintenanceMutation, DeleteAssetMaintenanceMutationVariables>;
export const StartAssetMaintenanceDocument = gql`
    mutation StartAssetMaintenance($id: ID!) {
  startAssetMaintenance(id: $id) {
    id
    status
    startedAt
  }
}
    `;
export type StartAssetMaintenanceMutationFn = Apollo.MutationFunction<StartAssetMaintenanceMutation, StartAssetMaintenanceMutationVariables>;
export function useStartAssetMaintenanceMutation(baseOptions?: Apollo.MutationHookOptions<StartAssetMaintenanceMutation, StartAssetMaintenanceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<StartAssetMaintenanceMutation, StartAssetMaintenanceMutationVariables>(StartAssetMaintenanceDocument, options);
      }
export type StartAssetMaintenanceMutationHookResult = ReturnType<typeof useStartAssetMaintenanceMutation>;
export type StartAssetMaintenanceMutationResult = Apollo.MutationResult<StartAssetMaintenanceMutation>;
export type StartAssetMaintenanceMutationOptions = Apollo.BaseMutationOptions<StartAssetMaintenanceMutation, StartAssetMaintenanceMutationVariables>;
export const CompleteAssetMaintenanceDocument = gql`
    mutation CompleteAssetMaintenance($id: ID!, $input: CompleteMaintenanceInput!) {
  completeAssetMaintenance(id: $id, input: $input) {
    id
    status
    completedAt
  }
}
    `;
export type CompleteAssetMaintenanceMutationFn = Apollo.MutationFunction<CompleteAssetMaintenanceMutation, CompleteAssetMaintenanceMutationVariables>;
export function useCompleteAssetMaintenanceMutation(baseOptions?: Apollo.MutationHookOptions<CompleteAssetMaintenanceMutation, CompleteAssetMaintenanceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CompleteAssetMaintenanceMutation, CompleteAssetMaintenanceMutationVariables>(CompleteAssetMaintenanceDocument, options);
      }
export type CompleteAssetMaintenanceMutationHookResult = ReturnType<typeof useCompleteAssetMaintenanceMutation>;
export type CompleteAssetMaintenanceMutationResult = Apollo.MutationResult<CompleteAssetMaintenanceMutation>;
export type CompleteAssetMaintenanceMutationOptions = Apollo.BaseMutationOptions<CompleteAssetMaintenanceMutation, CompleteAssetMaintenanceMutationVariables>;
export const GetDocumentsDocument = gql`
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
    `;
export function useGetDocumentsQuery(baseOptions: Apollo.QueryHookOptions<GetDocumentsQuery, GetDocumentsQueryVariables> & ({ variables: GetDocumentsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetDocumentsQuery, GetDocumentsQueryVariables>(GetDocumentsDocument, options);
      }
export function useGetDocumentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetDocumentsQuery, GetDocumentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetDocumentsQuery, GetDocumentsQueryVariables>(GetDocumentsDocument, options);
        }
// @ts-ignore
export function useGetDocumentsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetDocumentsQuery, GetDocumentsQueryVariables>): Apollo.UseSuspenseQueryResult<GetDocumentsQuery, GetDocumentsQueryVariables>;
export function useGetDocumentsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetDocumentsQuery, GetDocumentsQueryVariables>): Apollo.UseSuspenseQueryResult<GetDocumentsQuery | undefined, GetDocumentsQueryVariables>;
export function useGetDocumentsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetDocumentsQuery, GetDocumentsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetDocumentsQuery, GetDocumentsQueryVariables>(GetDocumentsDocument, options);
        }
export type GetDocumentsQueryHookResult = ReturnType<typeof useGetDocumentsQuery>;
export type GetDocumentsLazyQueryHookResult = ReturnType<typeof useGetDocumentsLazyQuery>;
export type GetDocumentsSuspenseQueryHookResult = ReturnType<typeof useGetDocumentsSuspenseQuery>;
export type GetDocumentsQueryResult = Apollo.QueryResult<GetDocumentsQuery, GetDocumentsQueryVariables>;
export const GetOrgDocumentsDocument = gql`
    query GetOrgDocuments($organizationId: ID!, $parentModule: String) {
  organizationDocuments(
    organizationId: $organizationId
    parentModule: $parentModule
  ) {
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
    `;
export function useGetOrgDocumentsQuery(baseOptions: Apollo.QueryHookOptions<GetOrgDocumentsQuery, GetOrgDocumentsQueryVariables> & ({ variables: GetOrgDocumentsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetOrgDocumentsQuery, GetOrgDocumentsQueryVariables>(GetOrgDocumentsDocument, options);
      }
export function useGetOrgDocumentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetOrgDocumentsQuery, GetOrgDocumentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetOrgDocumentsQuery, GetOrgDocumentsQueryVariables>(GetOrgDocumentsDocument, options);
        }
// @ts-ignore
export function useGetOrgDocumentsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetOrgDocumentsQuery, GetOrgDocumentsQueryVariables>): Apollo.UseSuspenseQueryResult<GetOrgDocumentsQuery, GetOrgDocumentsQueryVariables>;
export function useGetOrgDocumentsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetOrgDocumentsQuery, GetOrgDocumentsQueryVariables>): Apollo.UseSuspenseQueryResult<GetOrgDocumentsQuery | undefined, GetOrgDocumentsQueryVariables>;
export function useGetOrgDocumentsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetOrgDocumentsQuery, GetOrgDocumentsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetOrgDocumentsQuery, GetOrgDocumentsQueryVariables>(GetOrgDocumentsDocument, options);
        }
export type GetOrgDocumentsQueryHookResult = ReturnType<typeof useGetOrgDocumentsQuery>;
export type GetOrgDocumentsLazyQueryHookResult = ReturnType<typeof useGetOrgDocumentsLazyQuery>;
export type GetOrgDocumentsSuspenseQueryHookResult = ReturnType<typeof useGetOrgDocumentsSuspenseQuery>;
export type GetOrgDocumentsQueryResult = Apollo.QueryResult<GetOrgDocumentsQuery, GetOrgDocumentsQueryVariables>;
export const DeleteDocumentDocument = gql`
    mutation DeleteDocument($id: ID!) {
  deleteDocument(id: $id) {
    id
  }
}
    `;
export type DeleteDocumentMutationFn = Apollo.MutationFunction<DeleteDocumentMutation, DeleteDocumentMutationVariables>;
export function useDeleteDocumentMutation(baseOptions?: Apollo.MutationHookOptions<DeleteDocumentMutation, DeleteDocumentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteDocumentMutation, DeleteDocumentMutationVariables>(DeleteDocumentDocument, options);
      }
export type DeleteDocumentMutationHookResult = ReturnType<typeof useDeleteDocumentMutation>;
export type DeleteDocumentMutationResult = Apollo.MutationResult<DeleteDocumentMutation>;
export type DeleteDocumentMutationOptions = Apollo.BaseMutationOptions<DeleteDocumentMutation, DeleteDocumentMutationVariables>;
export const GetTimesheetsDocument = gql`
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
    `;
export function useGetTimesheetsQuery(baseOptions: Apollo.QueryHookOptions<GetTimesheetsQuery, GetTimesheetsQueryVariables> & ({ variables: GetTimesheetsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTimesheetsQuery, GetTimesheetsQueryVariables>(GetTimesheetsDocument, options);
      }
export function useGetTimesheetsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTimesheetsQuery, GetTimesheetsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTimesheetsQuery, GetTimesheetsQueryVariables>(GetTimesheetsDocument, options);
        }
// @ts-ignore
export function useGetTimesheetsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetTimesheetsQuery, GetTimesheetsQueryVariables>): Apollo.UseSuspenseQueryResult<GetTimesheetsQuery, GetTimesheetsQueryVariables>;
export function useGetTimesheetsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetTimesheetsQuery, GetTimesheetsQueryVariables>): Apollo.UseSuspenseQueryResult<GetTimesheetsQuery | undefined, GetTimesheetsQueryVariables>;
export function useGetTimesheetsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetTimesheetsQuery, GetTimesheetsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetTimesheetsQuery, GetTimesheetsQueryVariables>(GetTimesheetsDocument, options);
        }
export type GetTimesheetsQueryHookResult = ReturnType<typeof useGetTimesheetsQuery>;
export type GetTimesheetsLazyQueryHookResult = ReturnType<typeof useGetTimesheetsLazyQuery>;
export type GetTimesheetsSuspenseQueryHookResult = ReturnType<typeof useGetTimesheetsSuspenseQuery>;
export type GetTimesheetsQueryResult = Apollo.QueryResult<GetTimesheetsQuery, GetTimesheetsQueryVariables>;
export const GetTimesheetWeeklySummaryDocument = gql`
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
    `;
export function useGetTimesheetWeeklySummaryQuery(baseOptions: Apollo.QueryHookOptions<GetTimesheetWeeklySummaryQuery, GetTimesheetWeeklySummaryQueryVariables> & ({ variables: GetTimesheetWeeklySummaryQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTimesheetWeeklySummaryQuery, GetTimesheetWeeklySummaryQueryVariables>(GetTimesheetWeeklySummaryDocument, options);
      }
export function useGetTimesheetWeeklySummaryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTimesheetWeeklySummaryQuery, GetTimesheetWeeklySummaryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTimesheetWeeklySummaryQuery, GetTimesheetWeeklySummaryQueryVariables>(GetTimesheetWeeklySummaryDocument, options);
        }
// @ts-ignore
export function useGetTimesheetWeeklySummarySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetTimesheetWeeklySummaryQuery, GetTimesheetWeeklySummaryQueryVariables>): Apollo.UseSuspenseQueryResult<GetTimesheetWeeklySummaryQuery, GetTimesheetWeeklySummaryQueryVariables>;
export function useGetTimesheetWeeklySummarySuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetTimesheetWeeklySummaryQuery, GetTimesheetWeeklySummaryQueryVariables>): Apollo.UseSuspenseQueryResult<GetTimesheetWeeklySummaryQuery | undefined, GetTimesheetWeeklySummaryQueryVariables>;
export function useGetTimesheetWeeklySummarySuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetTimesheetWeeklySummaryQuery, GetTimesheetWeeklySummaryQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetTimesheetWeeklySummaryQuery, GetTimesheetWeeklySummaryQueryVariables>(GetTimesheetWeeklySummaryDocument, options);
        }
export type GetTimesheetWeeklySummaryQueryHookResult = ReturnType<typeof useGetTimesheetWeeklySummaryQuery>;
export type GetTimesheetWeeklySummaryLazyQueryHookResult = ReturnType<typeof useGetTimesheetWeeklySummaryLazyQuery>;
export type GetTimesheetWeeklySummarySuspenseQueryHookResult = ReturnType<typeof useGetTimesheetWeeklySummarySuspenseQuery>;
export type GetTimesheetWeeklySummaryQueryResult = Apollo.QueryResult<GetTimesheetWeeklySummaryQuery, GetTimesheetWeeklySummaryQueryVariables>;
export const CreateTimesheetEntryDocument = gql`
    mutation CreateTimesheetEntry($input: CreateTimesheetEntryInput!) {
  createTimesheetEntry(input: $input) {
    id
    hours
    status
  }
}
    `;
export type CreateTimesheetEntryMutationFn = Apollo.MutationFunction<CreateTimesheetEntryMutation, CreateTimesheetEntryMutationVariables>;
export function useCreateTimesheetEntryMutation(baseOptions?: Apollo.MutationHookOptions<CreateTimesheetEntryMutation, CreateTimesheetEntryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTimesheetEntryMutation, CreateTimesheetEntryMutationVariables>(CreateTimesheetEntryDocument, options);
      }
export type CreateTimesheetEntryMutationHookResult = ReturnType<typeof useCreateTimesheetEntryMutation>;
export type CreateTimesheetEntryMutationResult = Apollo.MutationResult<CreateTimesheetEntryMutation>;
export type CreateTimesheetEntryMutationOptions = Apollo.BaseMutationOptions<CreateTimesheetEntryMutation, CreateTimesheetEntryMutationVariables>;
export const UpdateTimesheetEntryDocument = gql`
    mutation UpdateTimesheetEntry($id: ID!, $input: UpdateTimesheetEntryInput!) {
  updateTimesheetEntry(id: $id, input: $input) {
    id
    hours
    status
  }
}
    `;
export type UpdateTimesheetEntryMutationFn = Apollo.MutationFunction<UpdateTimesheetEntryMutation, UpdateTimesheetEntryMutationVariables>;
export function useUpdateTimesheetEntryMutation(baseOptions?: Apollo.MutationHookOptions<UpdateTimesheetEntryMutation, UpdateTimesheetEntryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateTimesheetEntryMutation, UpdateTimesheetEntryMutationVariables>(UpdateTimesheetEntryDocument, options);
      }
export type UpdateTimesheetEntryMutationHookResult = ReturnType<typeof useUpdateTimesheetEntryMutation>;
export type UpdateTimesheetEntryMutationResult = Apollo.MutationResult<UpdateTimesheetEntryMutation>;
export type UpdateTimesheetEntryMutationOptions = Apollo.BaseMutationOptions<UpdateTimesheetEntryMutation, UpdateTimesheetEntryMutationVariables>;
export const DeleteTimesheetEntryDocument = gql`
    mutation DeleteTimesheetEntry($id: ID!) {
  deleteTimesheetEntry(id: $id) {
    id
  }
}
    `;
export type DeleteTimesheetEntryMutationFn = Apollo.MutationFunction<DeleteTimesheetEntryMutation, DeleteTimesheetEntryMutationVariables>;
export function useDeleteTimesheetEntryMutation(baseOptions?: Apollo.MutationHookOptions<DeleteTimesheetEntryMutation, DeleteTimesheetEntryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteTimesheetEntryMutation, DeleteTimesheetEntryMutationVariables>(DeleteTimesheetEntryDocument, options);
      }
export type DeleteTimesheetEntryMutationHookResult = ReturnType<typeof useDeleteTimesheetEntryMutation>;
export type DeleteTimesheetEntryMutationResult = Apollo.MutationResult<DeleteTimesheetEntryMutation>;
export type DeleteTimesheetEntryMutationOptions = Apollo.BaseMutationOptions<DeleteTimesheetEntryMutation, DeleteTimesheetEntryMutationVariables>;
export const SubmitTimesheetEntryDocument = gql`
    mutation SubmitTimesheetEntry($id: ID!) {
  submitTimesheetEntry(id: $id) {
    id
    status
  }
}
    `;
export type SubmitTimesheetEntryMutationFn = Apollo.MutationFunction<SubmitTimesheetEntryMutation, SubmitTimesheetEntryMutationVariables>;
export function useSubmitTimesheetEntryMutation(baseOptions?: Apollo.MutationHookOptions<SubmitTimesheetEntryMutation, SubmitTimesheetEntryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SubmitTimesheetEntryMutation, SubmitTimesheetEntryMutationVariables>(SubmitTimesheetEntryDocument, options);
      }
export type SubmitTimesheetEntryMutationHookResult = ReturnType<typeof useSubmitTimesheetEntryMutation>;
export type SubmitTimesheetEntryMutationResult = Apollo.MutationResult<SubmitTimesheetEntryMutation>;
export type SubmitTimesheetEntryMutationOptions = Apollo.BaseMutationOptions<SubmitTimesheetEntryMutation, SubmitTimesheetEntryMutationVariables>;
export const ResolveTimesheetEntryDocument = gql`
    mutation ResolveTimesheetEntry($id: ID!, $decision: String!, $reason: String) {
  resolveTimesheetEntry(id: $id, decision: $decision, reason: $reason) {
    id
    status
  }
}
    `;
export type ResolveTimesheetEntryMutationFn = Apollo.MutationFunction<ResolveTimesheetEntryMutation, ResolveTimesheetEntryMutationVariables>;
export function useResolveTimesheetEntryMutation(baseOptions?: Apollo.MutationHookOptions<ResolveTimesheetEntryMutation, ResolveTimesheetEntryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ResolveTimesheetEntryMutation, ResolveTimesheetEntryMutationVariables>(ResolveTimesheetEntryDocument, options);
      }
export type ResolveTimesheetEntryMutationHookResult = ReturnType<typeof useResolveTimesheetEntryMutation>;
export type ResolveTimesheetEntryMutationResult = Apollo.MutationResult<ResolveTimesheetEntryMutation>;
export type ResolveTimesheetEntryMutationOptions = Apollo.BaseMutationOptions<ResolveTimesheetEntryMutation, ResolveTimesheetEntryMutationVariables>;
export const GetBoMsDocument = gql`
    query GetBOMs($organizationId: ID!, $status: String, $parentItemId: ID, $search: String) {
  billsOfMaterials(
    organizationId: $organizationId
    status: $status
    parentItemId: $parentItemId
    search: $search
  ) {
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
    `;
export function useGetBoMsQuery(baseOptions: Apollo.QueryHookOptions<GetBoMsQuery, GetBoMsQueryVariables> & ({ variables: GetBoMsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetBoMsQuery, GetBoMsQueryVariables>(GetBoMsDocument, options);
      }
export function useGetBoMsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetBoMsQuery, GetBoMsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetBoMsQuery, GetBoMsQueryVariables>(GetBoMsDocument, options);
        }
// @ts-ignore
export function useGetBoMsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetBoMsQuery, GetBoMsQueryVariables>): Apollo.UseSuspenseQueryResult<GetBoMsQuery, GetBoMsQueryVariables>;
export function useGetBoMsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetBoMsQuery, GetBoMsQueryVariables>): Apollo.UseSuspenseQueryResult<GetBoMsQuery | undefined, GetBoMsQueryVariables>;
export function useGetBoMsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetBoMsQuery, GetBoMsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetBoMsQuery, GetBoMsQueryVariables>(GetBoMsDocument, options);
        }
export type GetBoMsQueryHookResult = ReturnType<typeof useGetBoMsQuery>;
export type GetBoMsLazyQueryHookResult = ReturnType<typeof useGetBoMsLazyQuery>;
export type GetBoMsSuspenseQueryHookResult = ReturnType<typeof useGetBoMsSuspenseQuery>;
export type GetBoMsQueryResult = Apollo.QueryResult<GetBoMsQuery, GetBoMsQueryVariables>;
export const GetBomDocument = gql`
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
    `;
export function useGetBomQuery(baseOptions: Apollo.QueryHookOptions<GetBomQuery, GetBomQueryVariables> & ({ variables: GetBomQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetBomQuery, GetBomQueryVariables>(GetBomDocument, options);
      }
export function useGetBomLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetBomQuery, GetBomQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetBomQuery, GetBomQueryVariables>(GetBomDocument, options);
        }
// @ts-ignore
export function useGetBomSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetBomQuery, GetBomQueryVariables>): Apollo.UseSuspenseQueryResult<GetBomQuery, GetBomQueryVariables>;
export function useGetBomSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetBomQuery, GetBomQueryVariables>): Apollo.UseSuspenseQueryResult<GetBomQuery | undefined, GetBomQueryVariables>;
export function useGetBomSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetBomQuery, GetBomQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetBomQuery, GetBomQueryVariables>(GetBomDocument, options);
        }
export type GetBomQueryHookResult = ReturnType<typeof useGetBomQuery>;
export type GetBomLazyQueryHookResult = ReturnType<typeof useGetBomLazyQuery>;
export type GetBomSuspenseQueryHookResult = ReturnType<typeof useGetBomSuspenseQuery>;
export type GetBomQueryResult = Apollo.QueryResult<GetBomQuery, GetBomQueryVariables>;
export const CreateBomDocument = gql`
    mutation CreateBOM($input: CreateBOMInput!) {
  createBillOfMaterials(input: $input) {
    id
    bomCode
    totalCost
  }
}
    `;
export type CreateBomMutationFn = Apollo.MutationFunction<CreateBomMutation, CreateBomMutationVariables>;
export function useCreateBomMutation(baseOptions?: Apollo.MutationHookOptions<CreateBomMutation, CreateBomMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateBomMutation, CreateBomMutationVariables>(CreateBomDocument, options);
      }
export type CreateBomMutationHookResult = ReturnType<typeof useCreateBomMutation>;
export type CreateBomMutationResult = Apollo.MutationResult<CreateBomMutation>;
export type CreateBomMutationOptions = Apollo.BaseMutationOptions<CreateBomMutation, CreateBomMutationVariables>;
export const UpdateBomDocument = gql`
    mutation UpdateBOM($id: ID!, $input: UpdateBOMInput!) {
  updateBillOfMaterials(id: $id, input: $input) {
    id
    totalCost
    status
  }
}
    `;
export type UpdateBomMutationFn = Apollo.MutationFunction<UpdateBomMutation, UpdateBomMutationVariables>;
export function useUpdateBomMutation(baseOptions?: Apollo.MutationHookOptions<UpdateBomMutation, UpdateBomMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateBomMutation, UpdateBomMutationVariables>(UpdateBomDocument, options);
      }
export type UpdateBomMutationHookResult = ReturnType<typeof useUpdateBomMutation>;
export type UpdateBomMutationResult = Apollo.MutationResult<UpdateBomMutation>;
export type UpdateBomMutationOptions = Apollo.BaseMutationOptions<UpdateBomMutation, UpdateBomMutationVariables>;
export const DeleteBomDocument = gql`
    mutation DeleteBOM($id: ID!) {
  deleteBillOfMaterials(id: $id) {
    id
  }
}
    `;
export type DeleteBomMutationFn = Apollo.MutationFunction<DeleteBomMutation, DeleteBomMutationVariables>;
export function useDeleteBomMutation(baseOptions?: Apollo.MutationHookOptions<DeleteBomMutation, DeleteBomMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteBomMutation, DeleteBomMutationVariables>(DeleteBomDocument, options);
      }
export type DeleteBomMutationHookResult = ReturnType<typeof useDeleteBomMutation>;
export type DeleteBomMutationResult = Apollo.MutationResult<DeleteBomMutation>;
export type DeleteBomMutationOptions = Apollo.BaseMutationOptions<DeleteBomMutation, DeleteBomMutationVariables>;
export const GetAuditLogsDocument = gql`
    query GetAuditLogs($entityType: String, $entityId: ID, $userId: ID, $action: String, $page: Int, $limit: Int) {
  auditLogs(
    entityType: $entityType
    entityId: $entityId
    userId: $userId
    action: $action
    page: $page
    limit: $limit
  ) {
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
    `;
export function useGetAuditLogsQuery(baseOptions?: Apollo.QueryHookOptions<GetAuditLogsQuery, GetAuditLogsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAuditLogsQuery, GetAuditLogsQueryVariables>(GetAuditLogsDocument, options);
      }
export function useGetAuditLogsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAuditLogsQuery, GetAuditLogsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAuditLogsQuery, GetAuditLogsQueryVariables>(GetAuditLogsDocument, options);
        }
// @ts-ignore
export function useGetAuditLogsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetAuditLogsQuery, GetAuditLogsQueryVariables>): Apollo.UseSuspenseQueryResult<GetAuditLogsQuery, GetAuditLogsQueryVariables>;
export function useGetAuditLogsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAuditLogsQuery, GetAuditLogsQueryVariables>): Apollo.UseSuspenseQueryResult<GetAuditLogsQuery | undefined, GetAuditLogsQueryVariables>;
export function useGetAuditLogsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAuditLogsQuery, GetAuditLogsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAuditLogsQuery, GetAuditLogsQueryVariables>(GetAuditLogsDocument, options);
        }
export type GetAuditLogsQueryHookResult = ReturnType<typeof useGetAuditLogsQuery>;
export type GetAuditLogsLazyQueryHookResult = ReturnType<typeof useGetAuditLogsLazyQuery>;
export type GetAuditLogsSuspenseQueryHookResult = ReturnType<typeof useGetAuditLogsSuspenseQuery>;
export type GetAuditLogsQueryResult = Apollo.QueryResult<GetAuditLogsQuery, GetAuditLogsQueryVariables>;
export const RegisterDocument = gql`
    mutation Register($input: RegisterInput!) {
  register(input: $input) {
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
    `;
export type RegisterMutationFn = Apollo.MutationFunction<RegisterMutation, RegisterMutationVariables>;
export function useRegisterMutation(baseOptions?: Apollo.MutationHookOptions<RegisterMutation, RegisterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, options);
      }
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<RegisterMutation, RegisterMutationVariables>;
export const LoginDocument = gql`
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
    `;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const MeDocument = gql`
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
    `;
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
// @ts-ignore
export function useMeSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<MeQuery, MeQueryVariables>): Apollo.UseSuspenseQueryResult<MeQuery, MeQueryVariables>;
export function useMeSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MeQuery, MeQueryVariables>): Apollo.UseSuspenseQueryResult<MeQuery | undefined, MeQueryVariables>;
export function useMeSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeSuspenseQueryHookResult = ReturnType<typeof useMeSuspenseQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
export const UpdateMyDashboardPreferencesDocument = gql`
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
    `;
export type UpdateMyDashboardPreferencesMutationFn = Apollo.MutationFunction<UpdateMyDashboardPreferencesMutation, UpdateMyDashboardPreferencesMutationVariables>;
export function useUpdateMyDashboardPreferencesMutation(baseOptions?: Apollo.MutationHookOptions<UpdateMyDashboardPreferencesMutation, UpdateMyDashboardPreferencesMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateMyDashboardPreferencesMutation, UpdateMyDashboardPreferencesMutationVariables>(UpdateMyDashboardPreferencesDocument, options);
      }
export type UpdateMyDashboardPreferencesMutationHookResult = ReturnType<typeof useUpdateMyDashboardPreferencesMutation>;
export type UpdateMyDashboardPreferencesMutationResult = Apollo.MutationResult<UpdateMyDashboardPreferencesMutation>;
export type UpdateMyDashboardPreferencesMutationOptions = Apollo.BaseMutationOptions<UpdateMyDashboardPreferencesMutation, UpdateMyDashboardPreferencesMutationVariables>;
export const GetUsersDocument = gql`
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
    `;
export function useGetUsersQuery(baseOptions: Apollo.QueryHookOptions<GetUsersQuery, GetUsersQueryVariables> & ({ variables: GetUsersQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUsersQuery, GetUsersQueryVariables>(GetUsersDocument, options);
      }
export function useGetUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUsersQuery, GetUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUsersQuery, GetUsersQueryVariables>(GetUsersDocument, options);
        }
// @ts-ignore
export function useGetUsersSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetUsersQuery, GetUsersQueryVariables>): Apollo.UseSuspenseQueryResult<GetUsersQuery, GetUsersQueryVariables>;
export function useGetUsersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUsersQuery, GetUsersQueryVariables>): Apollo.UseSuspenseQueryResult<GetUsersQuery | undefined, GetUsersQueryVariables>;
export function useGetUsersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUsersQuery, GetUsersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUsersQuery, GetUsersQueryVariables>(GetUsersDocument, options);
        }
export type GetUsersQueryHookResult = ReturnType<typeof useGetUsersQuery>;
export type GetUsersLazyQueryHookResult = ReturnType<typeof useGetUsersLazyQuery>;
export type GetUsersSuspenseQueryHookResult = ReturnType<typeof useGetUsersSuspenseQuery>;
export type GetUsersQueryResult = Apollo.QueryResult<GetUsersQuery, GetUsersQueryVariables>;
export const GetUserDocument = gql`
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
    `;
export function useGetUserQuery(baseOptions: Apollo.QueryHookOptions<GetUserQuery, GetUserQueryVariables> & ({ variables: GetUserQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, options);
      }
export function useGetUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserQuery, GetUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, options);
        }
// @ts-ignore
export function useGetUserSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetUserQuery, GetUserQueryVariables>): Apollo.UseSuspenseQueryResult<GetUserQuery, GetUserQueryVariables>;
export function useGetUserSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUserQuery, GetUserQueryVariables>): Apollo.UseSuspenseQueryResult<GetUserQuery | undefined, GetUserQueryVariables>;
export function useGetUserSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUserQuery, GetUserQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, options);
        }
export type GetUserQueryHookResult = ReturnType<typeof useGetUserQuery>;
export type GetUserLazyQueryHookResult = ReturnType<typeof useGetUserLazyQuery>;
export type GetUserSuspenseQueryHookResult = ReturnType<typeof useGetUserSuspenseQuery>;
export type GetUserQueryResult = Apollo.QueryResult<GetUserQuery, GetUserQueryVariables>;
export const SetUserModulePermissionsDocument = gql`
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
    `;
export type SetUserModulePermissionsMutationFn = Apollo.MutationFunction<SetUserModulePermissionsMutation, SetUserModulePermissionsMutationVariables>;
export function useSetUserModulePermissionsMutation(baseOptions?: Apollo.MutationHookOptions<SetUserModulePermissionsMutation, SetUserModulePermissionsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SetUserModulePermissionsMutation, SetUserModulePermissionsMutationVariables>(SetUserModulePermissionsDocument, options);
      }
export type SetUserModulePermissionsMutationHookResult = ReturnType<typeof useSetUserModulePermissionsMutation>;
export type SetUserModulePermissionsMutationResult = Apollo.MutationResult<SetUserModulePermissionsMutation>;
export type SetUserModulePermissionsMutationOptions = Apollo.BaseMutationOptions<SetUserModulePermissionsMutation, SetUserModulePermissionsMutationVariables>;
export const CreateUserDocument = gql`
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
    `;
export type CreateUserMutationFn = Apollo.MutationFunction<CreateUserMutation, CreateUserMutationVariables>;
export function useCreateUserMutation(baseOptions?: Apollo.MutationHookOptions<CreateUserMutation, CreateUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateUserMutation, CreateUserMutationVariables>(CreateUserDocument, options);
      }
export type CreateUserMutationHookResult = ReturnType<typeof useCreateUserMutation>;
export type CreateUserMutationResult = Apollo.MutationResult<CreateUserMutation>;
export type CreateUserMutationOptions = Apollo.BaseMutationOptions<CreateUserMutation, CreateUserMutationVariables>;
export const UpdateUserDocument = gql`
    mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
  updateUser(id: $id, input: $input) {
    id
    firstName
    lastName
    status
  }
}
    `;
export type UpdateUserMutationFn = Apollo.MutationFunction<UpdateUserMutation, UpdateUserMutationVariables>;
export function useUpdateUserMutation(baseOptions?: Apollo.MutationHookOptions<UpdateUserMutation, UpdateUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateUserMutation, UpdateUserMutationVariables>(UpdateUserDocument, options);
      }
export type UpdateUserMutationHookResult = ReturnType<typeof useUpdateUserMutation>;
export type UpdateUserMutationResult = Apollo.MutationResult<UpdateUserMutation>;
export type UpdateUserMutationOptions = Apollo.BaseMutationOptions<UpdateUserMutation, UpdateUserMutationVariables>;
export const DeleteUserDocument = gql`
    mutation DeleteUser($id: ID!) {
  deleteUser(id: $id) {
    id
  }
}
    `;
export type DeleteUserMutationFn = Apollo.MutationFunction<DeleteUserMutation, DeleteUserMutationVariables>;
export function useDeleteUserMutation(baseOptions?: Apollo.MutationHookOptions<DeleteUserMutation, DeleteUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteUserMutation, DeleteUserMutationVariables>(DeleteUserDocument, options);
      }
export type DeleteUserMutationHookResult = ReturnType<typeof useDeleteUserMutation>;
export type DeleteUserMutationResult = Apollo.MutationResult<DeleteUserMutation>;
export type DeleteUserMutationOptions = Apollo.BaseMutationOptions<DeleteUserMutation, DeleteUserMutationVariables>;
export const RolesByOrganizationDocument = gql`
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
    `;
export function useRolesByOrganizationQuery(baseOptions: Apollo.QueryHookOptions<RolesByOrganizationQuery, RolesByOrganizationQueryVariables> & ({ variables: RolesByOrganizationQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<RolesByOrganizationQuery, RolesByOrganizationQueryVariables>(RolesByOrganizationDocument, options);
      }
export function useRolesByOrganizationLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RolesByOrganizationQuery, RolesByOrganizationQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<RolesByOrganizationQuery, RolesByOrganizationQueryVariables>(RolesByOrganizationDocument, options);
        }
// @ts-ignore
export function useRolesByOrganizationSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<RolesByOrganizationQuery, RolesByOrganizationQueryVariables>): Apollo.UseSuspenseQueryResult<RolesByOrganizationQuery, RolesByOrganizationQueryVariables>;
export function useRolesByOrganizationSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<RolesByOrganizationQuery, RolesByOrganizationQueryVariables>): Apollo.UseSuspenseQueryResult<RolesByOrganizationQuery | undefined, RolesByOrganizationQueryVariables>;
export function useRolesByOrganizationSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<RolesByOrganizationQuery, RolesByOrganizationQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<RolesByOrganizationQuery, RolesByOrganizationQueryVariables>(RolesByOrganizationDocument, options);
        }
export type RolesByOrganizationQueryHookResult = ReturnType<typeof useRolesByOrganizationQuery>;
export type RolesByOrganizationLazyQueryHookResult = ReturnType<typeof useRolesByOrganizationLazyQuery>;
export type RolesByOrganizationSuspenseQueryHookResult = ReturnType<typeof useRolesByOrganizationSuspenseQuery>;
export type RolesByOrganizationQueryResult = Apollo.QueryResult<RolesByOrganizationQuery, RolesByOrganizationQueryVariables>;
export const CreateRoleDocument = gql`
    mutation CreateRole($input: CreateRoleInput!) {
  createRole(input: $input) {
    id
    name
    displayName
    isSystemRole
  }
}
    `;
export type CreateRoleMutationFn = Apollo.MutationFunction<CreateRoleMutation, CreateRoleMutationVariables>;
export function useCreateRoleMutation(baseOptions?: Apollo.MutationHookOptions<CreateRoleMutation, CreateRoleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateRoleMutation, CreateRoleMutationVariables>(CreateRoleDocument, options);
      }
export type CreateRoleMutationHookResult = ReturnType<typeof useCreateRoleMutation>;
export type CreateRoleMutationResult = Apollo.MutationResult<CreateRoleMutation>;
export type CreateRoleMutationOptions = Apollo.BaseMutationOptions<CreateRoleMutation, CreateRoleMutationVariables>;
export const DeleteRoleDocument = gql`
    mutation DeleteRole($id: ID!) {
  deleteRole(id: $id)
}
    `;
export type DeleteRoleMutationFn = Apollo.MutationFunction<DeleteRoleMutation, DeleteRoleMutationVariables>;
export function useDeleteRoleMutation(baseOptions?: Apollo.MutationHookOptions<DeleteRoleMutation, DeleteRoleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteRoleMutation, DeleteRoleMutationVariables>(DeleteRoleDocument, options);
      }
export type DeleteRoleMutationHookResult = ReturnType<typeof useDeleteRoleMutation>;
export type DeleteRoleMutationResult = Apollo.MutationResult<DeleteRoleMutation>;
export type DeleteRoleMutationOptions = Apollo.BaseMutationOptions<DeleteRoleMutation, DeleteRoleMutationVariables>;
export const GetOrganizationsDocument = gql`
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
    createdAt
  }
}
    `;
export function useGetOrganizationsQuery(baseOptions?: Apollo.QueryHookOptions<GetOrganizationsQuery, GetOrganizationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetOrganizationsQuery, GetOrganizationsQueryVariables>(GetOrganizationsDocument, options);
      }
export function useGetOrganizationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetOrganizationsQuery, GetOrganizationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetOrganizationsQuery, GetOrganizationsQueryVariables>(GetOrganizationsDocument, options);
        }
// @ts-ignore
export function useGetOrganizationsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetOrganizationsQuery, GetOrganizationsQueryVariables>): Apollo.UseSuspenseQueryResult<GetOrganizationsQuery, GetOrganizationsQueryVariables>;
export function useGetOrganizationsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetOrganizationsQuery, GetOrganizationsQueryVariables>): Apollo.UseSuspenseQueryResult<GetOrganizationsQuery | undefined, GetOrganizationsQueryVariables>;
export function useGetOrganizationsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetOrganizationsQuery, GetOrganizationsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetOrganizationsQuery, GetOrganizationsQueryVariables>(GetOrganizationsDocument, options);
        }
export type GetOrganizationsQueryHookResult = ReturnType<typeof useGetOrganizationsQuery>;
export type GetOrganizationsLazyQueryHookResult = ReturnType<typeof useGetOrganizationsLazyQuery>;
export type GetOrganizationsSuspenseQueryHookResult = ReturnType<typeof useGetOrganizationsSuspenseQuery>;
export type GetOrganizationsQueryResult = Apollo.QueryResult<GetOrganizationsQuery, GetOrganizationsQueryVariables>;
export const GetOrganizationDocument = gql`
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
    moduleApprovers {
      moduleKey
      approverUserId
      approverUserIds
    }
    createdAt
  }
}
    `;
export function useGetOrganizationQuery(baseOptions: Apollo.QueryHookOptions<GetOrganizationQuery, GetOrganizationQueryVariables> & ({ variables: GetOrganizationQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetOrganizationQuery, GetOrganizationQueryVariables>(GetOrganizationDocument, options);
      }
export function useGetOrganizationLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetOrganizationQuery, GetOrganizationQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetOrganizationQuery, GetOrganizationQueryVariables>(GetOrganizationDocument, options);
        }
// @ts-ignore
export function useGetOrganizationSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetOrganizationQuery, GetOrganizationQueryVariables>): Apollo.UseSuspenseQueryResult<GetOrganizationQuery, GetOrganizationQueryVariables>;
export function useGetOrganizationSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetOrganizationQuery, GetOrganizationQueryVariables>): Apollo.UseSuspenseQueryResult<GetOrganizationQuery | undefined, GetOrganizationQueryVariables>;
export function useGetOrganizationSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetOrganizationQuery, GetOrganizationQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetOrganizationQuery, GetOrganizationQueryVariables>(GetOrganizationDocument, options);
        }
export type GetOrganizationQueryHookResult = ReturnType<typeof useGetOrganizationQuery>;
export type GetOrganizationLazyQueryHookResult = ReturnType<typeof useGetOrganizationLazyQuery>;
export type GetOrganizationSuspenseQueryHookResult = ReturnType<typeof useGetOrganizationSuspenseQuery>;
export type GetOrganizationQueryResult = Apollo.QueryResult<GetOrganizationQuery, GetOrganizationQueryVariables>;
export const SetOrganizationModuleApproversDocument = gql`
    mutation SetOrganizationModuleApprovers($organizationId: ID!, $assignments: [OrganizationModuleApproverInput!]!) {
  setOrganizationModuleApprovers(
    organizationId: $organizationId
    assignments: $assignments
  ) {
    id
    moduleApprovers {
      moduleKey
      approverUserId
      approverUserIds
    }
  }
}
    `;
export type SetOrganizationModuleApproversMutationFn = Apollo.MutationFunction<SetOrganizationModuleApproversMutation, SetOrganizationModuleApproversMutationVariables>;
export function useSetOrganizationModuleApproversMutation(baseOptions?: Apollo.MutationHookOptions<SetOrganizationModuleApproversMutation, SetOrganizationModuleApproversMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SetOrganizationModuleApproversMutation, SetOrganizationModuleApproversMutationVariables>(SetOrganizationModuleApproversDocument, options);
      }
export type SetOrganizationModuleApproversMutationHookResult = ReturnType<typeof useSetOrganizationModuleApproversMutation>;
export type SetOrganizationModuleApproversMutationResult = Apollo.MutationResult<SetOrganizationModuleApproversMutation>;
export type SetOrganizationModuleApproversMutationOptions = Apollo.BaseMutationOptions<SetOrganizationModuleApproversMutation, SetOrganizationModuleApproversMutationVariables>;
export const CreateOrganizationDocument = gql`
    mutation CreateOrganization($input: CreateOrganizationInput!) {
  createOrganization(input: $input) {
    id
    name
    code
    status
  }
}
    `;
export type CreateOrganizationMutationFn = Apollo.MutationFunction<CreateOrganizationMutation, CreateOrganizationMutationVariables>;
export function useCreateOrganizationMutation(baseOptions?: Apollo.MutationHookOptions<CreateOrganizationMutation, CreateOrganizationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateOrganizationMutation, CreateOrganizationMutationVariables>(CreateOrganizationDocument, options);
      }
export type CreateOrganizationMutationHookResult = ReturnType<typeof useCreateOrganizationMutation>;
export type CreateOrganizationMutationResult = Apollo.MutationResult<CreateOrganizationMutation>;
export type CreateOrganizationMutationOptions = Apollo.BaseMutationOptions<CreateOrganizationMutation, CreateOrganizationMutationVariables>;
export const CreateOrganizationWithOrgAdminDocument = gql`
    mutation CreateOrganizationWithOrgAdmin($input: CreateOrganizationWithOrgAdminInput!) {
  createOrganizationWithOrgAdmin(input: $input) {
    id
    name
    code
    status
  }
}
    `;
export type CreateOrganizationWithOrgAdminMutationFn = Apollo.MutationFunction<CreateOrganizationWithOrgAdminMutation, CreateOrganizationWithOrgAdminMutationVariables>;
export function useCreateOrganizationWithOrgAdminMutation(baseOptions?: Apollo.MutationHookOptions<CreateOrganizationWithOrgAdminMutation, CreateOrganizationWithOrgAdminMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateOrganizationWithOrgAdminMutation, CreateOrganizationWithOrgAdminMutationVariables>(CreateOrganizationWithOrgAdminDocument, options);
      }
export type CreateOrganizationWithOrgAdminMutationHookResult = ReturnType<typeof useCreateOrganizationWithOrgAdminMutation>;
export type CreateOrganizationWithOrgAdminMutationResult = Apollo.MutationResult<CreateOrganizationWithOrgAdminMutation>;
export type CreateOrganizationWithOrgAdminMutationOptions = Apollo.BaseMutationOptions<CreateOrganizationWithOrgAdminMutation, CreateOrganizationWithOrgAdminMutationVariables>;
export const UpdateOrganizationDocument = gql`
    mutation UpdateOrganization($id: ID!, $input: UpdateOrganizationInput!) {
  updateOrganization(id: $id, input: $input) {
    id
    name
    status
  }
}
    `;
export type UpdateOrganizationMutationFn = Apollo.MutationFunction<UpdateOrganizationMutation, UpdateOrganizationMutationVariables>;
export function useUpdateOrganizationMutation(baseOptions?: Apollo.MutationHookOptions<UpdateOrganizationMutation, UpdateOrganizationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateOrganizationMutation, UpdateOrganizationMutationVariables>(UpdateOrganizationDocument, options);
      }
export type UpdateOrganizationMutationHookResult = ReturnType<typeof useUpdateOrganizationMutation>;
export type UpdateOrganizationMutationResult = Apollo.MutationResult<UpdateOrganizationMutation>;
export type UpdateOrganizationMutationOptions = Apollo.BaseMutationOptions<UpdateOrganizationMutation, UpdateOrganizationMutationVariables>;
export const DeleteOrganizationDocument = gql`
    mutation DeleteOrganization($id: ID!) {
  deleteOrganization(id: $id) {
    id
  }
}
    `;
export type DeleteOrganizationMutationFn = Apollo.MutationFunction<DeleteOrganizationMutation, DeleteOrganizationMutationVariables>;
export function useDeleteOrganizationMutation(baseOptions?: Apollo.MutationHookOptions<DeleteOrganizationMutation, DeleteOrganizationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteOrganizationMutation, DeleteOrganizationMutationVariables>(DeleteOrganizationDocument, options);
      }
export type DeleteOrganizationMutationHookResult = ReturnType<typeof useDeleteOrganizationMutation>;
export type DeleteOrganizationMutationResult = Apollo.MutationResult<DeleteOrganizationMutation>;
export type DeleteOrganizationMutationOptions = Apollo.BaseMutationOptions<DeleteOrganizationMutation, DeleteOrganizationMutationVariables>;
export const SendNotificationDocument = gql`
    mutation SendNotification($input: SendNotificationInput!) {
  sendNotification(input: $input)
}
    `;
export type SendNotificationMutationFn = Apollo.MutationFunction<SendNotificationMutation, SendNotificationMutationVariables>;
export function useSendNotificationMutation(baseOptions?: Apollo.MutationHookOptions<SendNotificationMutation, SendNotificationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SendNotificationMutation, SendNotificationMutationVariables>(SendNotificationDocument, options);
      }
export type SendNotificationMutationHookResult = ReturnType<typeof useSendNotificationMutation>;
export type SendNotificationMutationResult = Apollo.MutationResult<SendNotificationMutation>;
export type SendNotificationMutationOptions = Apollo.BaseMutationOptions<SendNotificationMutation, SendNotificationMutationVariables>;
export const MyPendingApprovalRequestsDocument = gql`
    query MyPendingApprovalRequests {
  myPendingApprovalRequests {
    id
    organizationId
    moduleKey
    entityType
    entityId
    title
    status
    requesterDisplayName
    createdAt
  }
}
    `;
export function useMyPendingApprovalRequestsQuery(baseOptions?: Apollo.QueryHookOptions<MyPendingApprovalRequestsQuery, MyPendingApprovalRequestsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MyPendingApprovalRequestsQuery, MyPendingApprovalRequestsQueryVariables>(MyPendingApprovalRequestsDocument, options);
      }
export function useMyPendingApprovalRequestsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MyPendingApprovalRequestsQuery, MyPendingApprovalRequestsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MyPendingApprovalRequestsQuery, MyPendingApprovalRequestsQueryVariables>(MyPendingApprovalRequestsDocument, options);
        }
// @ts-ignore
export function useMyPendingApprovalRequestsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<MyPendingApprovalRequestsQuery, MyPendingApprovalRequestsQueryVariables>): Apollo.UseSuspenseQueryResult<MyPendingApprovalRequestsQuery, MyPendingApprovalRequestsQueryVariables>;
export function useMyPendingApprovalRequestsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MyPendingApprovalRequestsQuery, MyPendingApprovalRequestsQueryVariables>): Apollo.UseSuspenseQueryResult<MyPendingApprovalRequestsQuery | undefined, MyPendingApprovalRequestsQueryVariables>;
export function useMyPendingApprovalRequestsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MyPendingApprovalRequestsQuery, MyPendingApprovalRequestsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MyPendingApprovalRequestsQuery, MyPendingApprovalRequestsQueryVariables>(MyPendingApprovalRequestsDocument, options);
        }
export type MyPendingApprovalRequestsQueryHookResult = ReturnType<typeof useMyPendingApprovalRequestsQuery>;
export type MyPendingApprovalRequestsLazyQueryHookResult = ReturnType<typeof useMyPendingApprovalRequestsLazyQuery>;
export type MyPendingApprovalRequestsSuspenseQueryHookResult = ReturnType<typeof useMyPendingApprovalRequestsSuspenseQuery>;
export type MyPendingApprovalRequestsQueryResult = Apollo.QueryResult<MyPendingApprovalRequestsQuery, MyPendingApprovalRequestsQueryVariables>;
export const ResolveApprovalRequestDocument = gql`
    mutation ResolveApprovalRequest($id: ID!, $decision: ApprovalDecision!, $note: String) {
  resolveApprovalRequest(id: $id, decision: $decision, note: $note) {
    id
    status
    decidedAt
  }
}
    `;
export type ResolveApprovalRequestMutationFn = Apollo.MutationFunction<ResolveApprovalRequestMutation, ResolveApprovalRequestMutationVariables>;
export function useResolveApprovalRequestMutation(baseOptions?: Apollo.MutationHookOptions<ResolveApprovalRequestMutation, ResolveApprovalRequestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ResolveApprovalRequestMutation, ResolveApprovalRequestMutationVariables>(ResolveApprovalRequestDocument, options);
      }
export type ResolveApprovalRequestMutationHookResult = ReturnType<typeof useResolveApprovalRequestMutation>;
export type ResolveApprovalRequestMutationResult = Apollo.MutationResult<ResolveApprovalRequestMutation>;
export type ResolveApprovalRequestMutationOptions = Apollo.BaseMutationOptions<ResolveApprovalRequestMutation, ResolveApprovalRequestMutationVariables>;
export const MyApprovalRequestsDocument = gql`
    query MyApprovalRequests($status: ApprovalRequestStatus, $role: ApprovalRequestRole, $limit: Int, $skip: Int) {
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
    `;
export function useMyApprovalRequestsQuery(baseOptions?: Apollo.QueryHookOptions<MyApprovalRequestsQuery, MyApprovalRequestsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MyApprovalRequestsQuery, MyApprovalRequestsQueryVariables>(MyApprovalRequestsDocument, options);
      }
export function useMyApprovalRequestsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MyApprovalRequestsQuery, MyApprovalRequestsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MyApprovalRequestsQuery, MyApprovalRequestsQueryVariables>(MyApprovalRequestsDocument, options);
        }
// @ts-ignore
export function useMyApprovalRequestsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<MyApprovalRequestsQuery, MyApprovalRequestsQueryVariables>): Apollo.UseSuspenseQueryResult<MyApprovalRequestsQuery, MyApprovalRequestsQueryVariables>;
export function useMyApprovalRequestsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MyApprovalRequestsQuery, MyApprovalRequestsQueryVariables>): Apollo.UseSuspenseQueryResult<MyApprovalRequestsQuery | undefined, MyApprovalRequestsQueryVariables>;
export function useMyApprovalRequestsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MyApprovalRequestsQuery, MyApprovalRequestsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MyApprovalRequestsQuery, MyApprovalRequestsQueryVariables>(MyApprovalRequestsDocument, options);
        }
export type MyApprovalRequestsQueryHookResult = ReturnType<typeof useMyApprovalRequestsQuery>;
export type MyApprovalRequestsLazyQueryHookResult = ReturnType<typeof useMyApprovalRequestsLazyQuery>;
export type MyApprovalRequestsSuspenseQueryHookResult = ReturnType<typeof useMyApprovalRequestsSuspenseQuery>;
export type MyApprovalRequestsQueryResult = Apollo.QueryResult<MyApprovalRequestsQuery, MyApprovalRequestsQueryVariables>;
export const ModuleWorkspaceRecordsDocument = gql`
    query ModuleWorkspaceRecords($organizationId: ID!, $routePath: String!, $limit: Int) {
  moduleWorkspaceRecords(
    organizationId: $organizationId
    routePath: $routePath
    limit: $limit
  ) {
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
    `;
export function useModuleWorkspaceRecordsQuery(baseOptions: Apollo.QueryHookOptions<ModuleWorkspaceRecordsQuery, ModuleWorkspaceRecordsQueryVariables> & ({ variables: ModuleWorkspaceRecordsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ModuleWorkspaceRecordsQuery, ModuleWorkspaceRecordsQueryVariables>(ModuleWorkspaceRecordsDocument, options);
      }
export function useModuleWorkspaceRecordsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ModuleWorkspaceRecordsQuery, ModuleWorkspaceRecordsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ModuleWorkspaceRecordsQuery, ModuleWorkspaceRecordsQueryVariables>(ModuleWorkspaceRecordsDocument, options);
        }
// @ts-ignore
export function useModuleWorkspaceRecordsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<ModuleWorkspaceRecordsQuery, ModuleWorkspaceRecordsQueryVariables>): Apollo.UseSuspenseQueryResult<ModuleWorkspaceRecordsQuery, ModuleWorkspaceRecordsQueryVariables>;
export function useModuleWorkspaceRecordsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ModuleWorkspaceRecordsQuery, ModuleWorkspaceRecordsQueryVariables>): Apollo.UseSuspenseQueryResult<ModuleWorkspaceRecordsQuery | undefined, ModuleWorkspaceRecordsQueryVariables>;
export function useModuleWorkspaceRecordsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ModuleWorkspaceRecordsQuery, ModuleWorkspaceRecordsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ModuleWorkspaceRecordsQuery, ModuleWorkspaceRecordsQueryVariables>(ModuleWorkspaceRecordsDocument, options);
        }
export type ModuleWorkspaceRecordsQueryHookResult = ReturnType<typeof useModuleWorkspaceRecordsQuery>;
export type ModuleWorkspaceRecordsLazyQueryHookResult = ReturnType<typeof useModuleWorkspaceRecordsLazyQuery>;
export type ModuleWorkspaceRecordsSuspenseQueryHookResult = ReturnType<typeof useModuleWorkspaceRecordsSuspenseQuery>;
export type ModuleWorkspaceRecordsQueryResult = Apollo.QueryResult<ModuleWorkspaceRecordsQuery, ModuleWorkspaceRecordsQueryVariables>;
export const CreateModuleWorkspaceRecordDocument = gql`
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
    `;
export type CreateModuleWorkspaceRecordMutationFn = Apollo.MutationFunction<CreateModuleWorkspaceRecordMutation, CreateModuleWorkspaceRecordMutationVariables>;
export function useCreateModuleWorkspaceRecordMutation(baseOptions?: Apollo.MutationHookOptions<CreateModuleWorkspaceRecordMutation, CreateModuleWorkspaceRecordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateModuleWorkspaceRecordMutation, CreateModuleWorkspaceRecordMutationVariables>(CreateModuleWorkspaceRecordDocument, options);
      }
export type CreateModuleWorkspaceRecordMutationHookResult = ReturnType<typeof useCreateModuleWorkspaceRecordMutation>;
export type CreateModuleWorkspaceRecordMutationResult = Apollo.MutationResult<CreateModuleWorkspaceRecordMutation>;
export type CreateModuleWorkspaceRecordMutationOptions = Apollo.BaseMutationOptions<CreateModuleWorkspaceRecordMutation, CreateModuleWorkspaceRecordMutationVariables>;
export const SubmitModuleWorkspaceRecordForApprovalDocument = gql`
    mutation SubmitModuleWorkspaceRecordForApproval($id: ID!) {
  submitModuleWorkspaceRecordForApproval(id: $id) {
    id
    title
    status
    updatedAt
  }
}
    `;
export type SubmitModuleWorkspaceRecordForApprovalMutationFn = Apollo.MutationFunction<SubmitModuleWorkspaceRecordForApprovalMutation, SubmitModuleWorkspaceRecordForApprovalMutationVariables>;
export function useSubmitModuleWorkspaceRecordForApprovalMutation(baseOptions?: Apollo.MutationHookOptions<SubmitModuleWorkspaceRecordForApprovalMutation, SubmitModuleWorkspaceRecordForApprovalMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SubmitModuleWorkspaceRecordForApprovalMutation, SubmitModuleWorkspaceRecordForApprovalMutationVariables>(SubmitModuleWorkspaceRecordForApprovalDocument, options);
      }
export type SubmitModuleWorkspaceRecordForApprovalMutationHookResult = ReturnType<typeof useSubmitModuleWorkspaceRecordForApprovalMutation>;
export type SubmitModuleWorkspaceRecordForApprovalMutationResult = Apollo.MutationResult<SubmitModuleWorkspaceRecordForApprovalMutation>;
export type SubmitModuleWorkspaceRecordForApprovalMutationOptions = Apollo.BaseMutationOptions<SubmitModuleWorkspaceRecordForApprovalMutation, SubmitModuleWorkspaceRecordForApprovalMutationVariables>;
export const SalesEnquiriesDocument = gql`
    query SalesEnquiries($organizationId: ID!, $page: Int, $limit: Int, $status: String, $search: String) {
  salesEnquiries(
    organizationId: $organizationId
    page: $page
    limit: $limit
    status: $status
    search: $search
  ) {
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
    `;
export function useSalesEnquiriesQuery(baseOptions: Apollo.QueryHookOptions<SalesEnquiriesQuery, SalesEnquiriesQueryVariables> & ({ variables: SalesEnquiriesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SalesEnquiriesQuery, SalesEnquiriesQueryVariables>(SalesEnquiriesDocument, options);
      }
export function useSalesEnquiriesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SalesEnquiriesQuery, SalesEnquiriesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SalesEnquiriesQuery, SalesEnquiriesQueryVariables>(SalesEnquiriesDocument, options);
        }
// @ts-ignore
export function useSalesEnquiriesSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<SalesEnquiriesQuery, SalesEnquiriesQueryVariables>): Apollo.UseSuspenseQueryResult<SalesEnquiriesQuery, SalesEnquiriesQueryVariables>;
export function useSalesEnquiriesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<SalesEnquiriesQuery, SalesEnquiriesQueryVariables>): Apollo.UseSuspenseQueryResult<SalesEnquiriesQuery | undefined, SalesEnquiriesQueryVariables>;
export function useSalesEnquiriesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<SalesEnquiriesQuery, SalesEnquiriesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<SalesEnquiriesQuery, SalesEnquiriesQueryVariables>(SalesEnquiriesDocument, options);
        }
export type SalesEnquiriesQueryHookResult = ReturnType<typeof useSalesEnquiriesQuery>;
export type SalesEnquiriesLazyQueryHookResult = ReturnType<typeof useSalesEnquiriesLazyQuery>;
export type SalesEnquiriesSuspenseQueryHookResult = ReturnType<typeof useSalesEnquiriesSuspenseQuery>;
export type SalesEnquiriesQueryResult = Apollo.QueryResult<SalesEnquiriesQuery, SalesEnquiriesQueryVariables>;
export const SubmitSalesEnquiryForApprovalDocument = gql`
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
    `;
export type SubmitSalesEnquiryForApprovalMutationFn = Apollo.MutationFunction<SubmitSalesEnquiryForApprovalMutation, SubmitSalesEnquiryForApprovalMutationVariables>;
export function useSubmitSalesEnquiryForApprovalMutation(baseOptions?: Apollo.MutationHookOptions<SubmitSalesEnquiryForApprovalMutation, SubmitSalesEnquiryForApprovalMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SubmitSalesEnquiryForApprovalMutation, SubmitSalesEnquiryForApprovalMutationVariables>(SubmitSalesEnquiryForApprovalDocument, options);
      }
export type SubmitSalesEnquiryForApprovalMutationHookResult = ReturnType<typeof useSubmitSalesEnquiryForApprovalMutation>;
export type SubmitSalesEnquiryForApprovalMutationResult = Apollo.MutationResult<SubmitSalesEnquiryForApprovalMutation>;
export type SubmitSalesEnquiryForApprovalMutationOptions = Apollo.BaseMutationOptions<SubmitSalesEnquiryForApprovalMutation, SubmitSalesEnquiryForApprovalMutationVariables>;
export const SubmitSalesOrderDocument = gql`
    mutation SubmitSalesOrder($id: ID!) {
  submitSalesOrder(id: $id) {
    id
    status
    seqNo
  }
}
    `;
export type SubmitSalesOrderMutationFn = Apollo.MutationFunction<SubmitSalesOrderMutation, SubmitSalesOrderMutationVariables>;
export function useSubmitSalesOrderMutation(baseOptions?: Apollo.MutationHookOptions<SubmitSalesOrderMutation, SubmitSalesOrderMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SubmitSalesOrderMutation, SubmitSalesOrderMutationVariables>(SubmitSalesOrderDocument, options);
      }
export type SubmitSalesOrderMutationHookResult = ReturnType<typeof useSubmitSalesOrderMutation>;
export type SubmitSalesOrderMutationResult = Apollo.MutationResult<SubmitSalesOrderMutation>;
export type SubmitSalesOrderMutationOptions = Apollo.BaseMutationOptions<SubmitSalesOrderMutation, SubmitSalesOrderMutationVariables>;
export const SubmitQuotationForApprovalDocument = gql`
    mutation SubmitQuotationForApproval($id: ID!) {
  submitQuotationForApproval(id: $id) {
    id
    quotationNumber
    status
  }
}
    `;
export type SubmitQuotationForApprovalMutationFn = Apollo.MutationFunction<SubmitQuotationForApprovalMutation, SubmitQuotationForApprovalMutationVariables>;
export function useSubmitQuotationForApprovalMutation(baseOptions?: Apollo.MutationHookOptions<SubmitQuotationForApprovalMutation, SubmitQuotationForApprovalMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SubmitQuotationForApprovalMutation, SubmitQuotationForApprovalMutationVariables>(SubmitQuotationForApprovalDocument, options);
      }
export type SubmitQuotationForApprovalMutationHookResult = ReturnType<typeof useSubmitQuotationForApprovalMutation>;
export type SubmitQuotationForApprovalMutationResult = Apollo.MutationResult<SubmitQuotationForApprovalMutation>;
export type SubmitQuotationForApprovalMutationOptions = Apollo.BaseMutationOptions<SubmitQuotationForApprovalMutation, SubmitQuotationForApprovalMutationVariables>;
export const SubmitCustomerInvoiceForApprovalDocument = gql`
    mutation SubmitCustomerInvoiceForApproval($id: ID!) {
  submitCustomerInvoiceForApproval(id: $id) {
    id
    seqNo
    status
  }
}
    `;
export type SubmitCustomerInvoiceForApprovalMutationFn = Apollo.MutationFunction<SubmitCustomerInvoiceForApprovalMutation, SubmitCustomerInvoiceForApprovalMutationVariables>;
export function useSubmitCustomerInvoiceForApprovalMutation(baseOptions?: Apollo.MutationHookOptions<SubmitCustomerInvoiceForApprovalMutation, SubmitCustomerInvoiceForApprovalMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SubmitCustomerInvoiceForApprovalMutation, SubmitCustomerInvoiceForApprovalMutationVariables>(SubmitCustomerInvoiceForApprovalDocument, options);
      }
export type SubmitCustomerInvoiceForApprovalMutationHookResult = ReturnType<typeof useSubmitCustomerInvoiceForApprovalMutation>;
export type SubmitCustomerInvoiceForApprovalMutationResult = Apollo.MutationResult<SubmitCustomerInvoiceForApprovalMutation>;
export type SubmitCustomerInvoiceForApprovalMutationOptions = Apollo.BaseMutationOptions<SubmitCustomerInvoiceForApprovalMutation, SubmitCustomerInvoiceForApprovalMutationVariables>;
export const SubmitLeadForApprovalDocument = gql`
    mutation SubmitLeadForApproval($id: ID!) {
  submitLeadForApproval(id: $id) {
    id
    seqNo
    status
  }
}
    `;
export type SubmitLeadForApprovalMutationFn = Apollo.MutationFunction<SubmitLeadForApprovalMutation, SubmitLeadForApprovalMutationVariables>;
export function useSubmitLeadForApprovalMutation(baseOptions?: Apollo.MutationHookOptions<SubmitLeadForApprovalMutation, SubmitLeadForApprovalMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SubmitLeadForApprovalMutation, SubmitLeadForApprovalMutationVariables>(SubmitLeadForApprovalDocument, options);
      }
export type SubmitLeadForApprovalMutationHookResult = ReturnType<typeof useSubmitLeadForApprovalMutation>;
export type SubmitLeadForApprovalMutationResult = Apollo.MutationResult<SubmitLeadForApprovalMutation>;
export type SubmitLeadForApprovalMutationOptions = Apollo.BaseMutationOptions<SubmitLeadForApprovalMutation, SubmitLeadForApprovalMutationVariables>;
export const SubmitPayrollUiRecordForApprovalDocument = gql`
    mutation SubmitPayrollUiRecordForApproval($id: ID!) {
  submitPayrollUiRecordForApproval(id: $id) {
    id
    approvalStatus
    category
  }
}
    `;
export type SubmitPayrollUiRecordForApprovalMutationFn = Apollo.MutationFunction<SubmitPayrollUiRecordForApprovalMutation, SubmitPayrollUiRecordForApprovalMutationVariables>;
export function useSubmitPayrollUiRecordForApprovalMutation(baseOptions?: Apollo.MutationHookOptions<SubmitPayrollUiRecordForApprovalMutation, SubmitPayrollUiRecordForApprovalMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SubmitPayrollUiRecordForApprovalMutation, SubmitPayrollUiRecordForApprovalMutationVariables>(SubmitPayrollUiRecordForApprovalDocument, options);
      }
export type SubmitPayrollUiRecordForApprovalMutationHookResult = ReturnType<typeof useSubmitPayrollUiRecordForApprovalMutation>;
export type SubmitPayrollUiRecordForApprovalMutationResult = Apollo.MutationResult<SubmitPayrollUiRecordForApprovalMutation>;
export type SubmitPayrollUiRecordForApprovalMutationOptions = Apollo.BaseMutationOptions<SubmitPayrollUiRecordForApprovalMutation, SubmitPayrollUiRecordForApprovalMutationVariables>;
export const GetItemsDocument = gql`
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
    `;
export function useGetItemsQuery(baseOptions: Apollo.QueryHookOptions<GetItemsQuery, GetItemsQueryVariables> & ({ variables: GetItemsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetItemsQuery, GetItemsQueryVariables>(GetItemsDocument, options);
      }
export function useGetItemsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetItemsQuery, GetItemsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetItemsQuery, GetItemsQueryVariables>(GetItemsDocument, options);
        }
// @ts-ignore
export function useGetItemsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetItemsQuery, GetItemsQueryVariables>): Apollo.UseSuspenseQueryResult<GetItemsQuery, GetItemsQueryVariables>;
export function useGetItemsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetItemsQuery, GetItemsQueryVariables>): Apollo.UseSuspenseQueryResult<GetItemsQuery | undefined, GetItemsQueryVariables>;
export function useGetItemsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetItemsQuery, GetItemsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetItemsQuery, GetItemsQueryVariables>(GetItemsDocument, options);
        }
export type GetItemsQueryHookResult = ReturnType<typeof useGetItemsQuery>;
export type GetItemsLazyQueryHookResult = ReturnType<typeof useGetItemsLazyQuery>;
export type GetItemsSuspenseQueryHookResult = ReturnType<typeof useGetItemsSuspenseQuery>;
export type GetItemsQueryResult = Apollo.QueryResult<GetItemsQuery, GetItemsQueryVariables>;
export const GetItemDocument = gql`
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
    `;
export function useGetItemQuery(baseOptions: Apollo.QueryHookOptions<GetItemQuery, GetItemQueryVariables> & ({ variables: GetItemQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetItemQuery, GetItemQueryVariables>(GetItemDocument, options);
      }
export function useGetItemLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetItemQuery, GetItemQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetItemQuery, GetItemQueryVariables>(GetItemDocument, options);
        }
// @ts-ignore
export function useGetItemSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetItemQuery, GetItemQueryVariables>): Apollo.UseSuspenseQueryResult<GetItemQuery, GetItemQueryVariables>;
export function useGetItemSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetItemQuery, GetItemQueryVariables>): Apollo.UseSuspenseQueryResult<GetItemQuery | undefined, GetItemQueryVariables>;
export function useGetItemSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetItemQuery, GetItemQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetItemQuery, GetItemQueryVariables>(GetItemDocument, options);
        }
export type GetItemQueryHookResult = ReturnType<typeof useGetItemQuery>;
export type GetItemLazyQueryHookResult = ReturnType<typeof useGetItemLazyQuery>;
export type GetItemSuspenseQueryHookResult = ReturnType<typeof useGetItemSuspenseQuery>;
export type GetItemQueryResult = Apollo.QueryResult<GetItemQuery, GetItemQueryVariables>;
export const CreateItemDocument = gql`
    mutation CreateItem($input: CreateItemInput!) {
  createItem(input: $input) {
    id
    name
    category
    status
  }
}
    `;
export type CreateItemMutationFn = Apollo.MutationFunction<CreateItemMutation, CreateItemMutationVariables>;
export function useCreateItemMutation(baseOptions?: Apollo.MutationHookOptions<CreateItemMutation, CreateItemMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateItemMutation, CreateItemMutationVariables>(CreateItemDocument, options);
      }
export type CreateItemMutationHookResult = ReturnType<typeof useCreateItemMutation>;
export type CreateItemMutationResult = Apollo.MutationResult<CreateItemMutation>;
export type CreateItemMutationOptions = Apollo.BaseMutationOptions<CreateItemMutation, CreateItemMutationVariables>;
export const UpdateItemDocument = gql`
    mutation UpdateItem($id: ID!, $input: UpdateItemInput!) {
  updateItem(id: $id, input: $input) {
    id
    name
    status
  }
}
    `;
export type UpdateItemMutationFn = Apollo.MutationFunction<UpdateItemMutation, UpdateItemMutationVariables>;
export function useUpdateItemMutation(baseOptions?: Apollo.MutationHookOptions<UpdateItemMutation, UpdateItemMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateItemMutation, UpdateItemMutationVariables>(UpdateItemDocument, options);
      }
export type UpdateItemMutationHookResult = ReturnType<typeof useUpdateItemMutation>;
export type UpdateItemMutationResult = Apollo.MutationResult<UpdateItemMutation>;
export type UpdateItemMutationOptions = Apollo.BaseMutationOptions<UpdateItemMutation, UpdateItemMutationVariables>;
export const DeleteItemDocument = gql`
    mutation DeleteItem($id: ID!) {
  deleteItem(id: $id) {
    id
  }
}
    `;
export type DeleteItemMutationFn = Apollo.MutationFunction<DeleteItemMutation, DeleteItemMutationVariables>;
export function useDeleteItemMutation(baseOptions?: Apollo.MutationHookOptions<DeleteItemMutation, DeleteItemMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteItemMutation, DeleteItemMutationVariables>(DeleteItemDocument, options);
      }
export type DeleteItemMutationHookResult = ReturnType<typeof useDeleteItemMutation>;
export type DeleteItemMutationResult = Apollo.MutationResult<DeleteItemMutation>;
export type DeleteItemMutationOptions = Apollo.BaseMutationOptions<DeleteItemMutation, DeleteItemMutationVariables>;
export const GetVendorsDocument = gql`
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
    `;
export function useGetVendorsQuery(baseOptions: Apollo.QueryHookOptions<GetVendorsQuery, GetVendorsQueryVariables> & ({ variables: GetVendorsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetVendorsQuery, GetVendorsQueryVariables>(GetVendorsDocument, options);
      }
export function useGetVendorsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetVendorsQuery, GetVendorsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetVendorsQuery, GetVendorsQueryVariables>(GetVendorsDocument, options);
        }
// @ts-ignore
export function useGetVendorsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetVendorsQuery, GetVendorsQueryVariables>): Apollo.UseSuspenseQueryResult<GetVendorsQuery, GetVendorsQueryVariables>;
export function useGetVendorsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetVendorsQuery, GetVendorsQueryVariables>): Apollo.UseSuspenseQueryResult<GetVendorsQuery | undefined, GetVendorsQueryVariables>;
export function useGetVendorsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetVendorsQuery, GetVendorsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetVendorsQuery, GetVendorsQueryVariables>(GetVendorsDocument, options);
        }
export type GetVendorsQueryHookResult = ReturnType<typeof useGetVendorsQuery>;
export type GetVendorsLazyQueryHookResult = ReturnType<typeof useGetVendorsLazyQuery>;
export type GetVendorsSuspenseQueryHookResult = ReturnType<typeof useGetVendorsSuspenseQuery>;
export type GetVendorsQueryResult = Apollo.QueryResult<GetVendorsQuery, GetVendorsQueryVariables>;
export const GetVendorDocument = gql`
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
    `;
export function useGetVendorQuery(baseOptions: Apollo.QueryHookOptions<GetVendorQuery, GetVendorQueryVariables> & ({ variables: GetVendorQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetVendorQuery, GetVendorQueryVariables>(GetVendorDocument, options);
      }
export function useGetVendorLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetVendorQuery, GetVendorQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetVendorQuery, GetVendorQueryVariables>(GetVendorDocument, options);
        }
// @ts-ignore
export function useGetVendorSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetVendorQuery, GetVendorQueryVariables>): Apollo.UseSuspenseQueryResult<GetVendorQuery, GetVendorQueryVariables>;
export function useGetVendorSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetVendorQuery, GetVendorQueryVariables>): Apollo.UseSuspenseQueryResult<GetVendorQuery | undefined, GetVendorQueryVariables>;
export function useGetVendorSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetVendorQuery, GetVendorQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetVendorQuery, GetVendorQueryVariables>(GetVendorDocument, options);
        }
export type GetVendorQueryHookResult = ReturnType<typeof useGetVendorQuery>;
export type GetVendorLazyQueryHookResult = ReturnType<typeof useGetVendorLazyQuery>;
export type GetVendorSuspenseQueryHookResult = ReturnType<typeof useGetVendorSuspenseQuery>;
export type GetVendorQueryResult = Apollo.QueryResult<GetVendorQuery, GetVendorQueryVariables>;
export const VendorEligibleApproversDocument = gql`
    query VendorEligibleApprovers($organizationId: ID!) {
  vendorEligibleApprovers(organizationId: $organizationId) {
    id
    firstName
    lastName
    email
  }
}
    `;
export function useVendorEligibleApproversQuery(baseOptions: Apollo.QueryHookOptions<VendorEligibleApproversQuery, VendorEligibleApproversQueryVariables> & ({ variables: VendorEligibleApproversQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<VendorEligibleApproversQuery, VendorEligibleApproversQueryVariables>(VendorEligibleApproversDocument, options);
      }
export function useVendorEligibleApproversLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<VendorEligibleApproversQuery, VendorEligibleApproversQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<VendorEligibleApproversQuery, VendorEligibleApproversQueryVariables>(VendorEligibleApproversDocument, options);
        }
// @ts-ignore
export function useVendorEligibleApproversSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<VendorEligibleApproversQuery, VendorEligibleApproversQueryVariables>): Apollo.UseSuspenseQueryResult<VendorEligibleApproversQuery, VendorEligibleApproversQueryVariables>;
export function useVendorEligibleApproversSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<VendorEligibleApproversQuery, VendorEligibleApproversQueryVariables>): Apollo.UseSuspenseQueryResult<VendorEligibleApproversQuery | undefined, VendorEligibleApproversQueryVariables>;
export function useVendorEligibleApproversSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<VendorEligibleApproversQuery, VendorEligibleApproversQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<VendorEligibleApproversQuery, VendorEligibleApproversQueryVariables>(VendorEligibleApproversDocument, options);
        }
export type VendorEligibleApproversQueryHookResult = ReturnType<typeof useVendorEligibleApproversQuery>;
export type VendorEligibleApproversLazyQueryHookResult = ReturnType<typeof useVendorEligibleApproversLazyQuery>;
export type VendorEligibleApproversSuspenseQueryHookResult = ReturnType<typeof useVendorEligibleApproversSuspenseQuery>;
export type VendorEligibleApproversQueryResult = Apollo.QueryResult<VendorEligibleApproversQuery, VendorEligibleApproversQueryVariables>;
export const VendorApprovalRequestsDocument = gql`
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
    `;
export function useVendorApprovalRequestsQuery(baseOptions: Apollo.QueryHookOptions<VendorApprovalRequestsQuery, VendorApprovalRequestsQueryVariables> & ({ variables: VendorApprovalRequestsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<VendorApprovalRequestsQuery, VendorApprovalRequestsQueryVariables>(VendorApprovalRequestsDocument, options);
      }
export function useVendorApprovalRequestsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<VendorApprovalRequestsQuery, VendorApprovalRequestsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<VendorApprovalRequestsQuery, VendorApprovalRequestsQueryVariables>(VendorApprovalRequestsDocument, options);
        }
// @ts-ignore
export function useVendorApprovalRequestsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<VendorApprovalRequestsQuery, VendorApprovalRequestsQueryVariables>): Apollo.UseSuspenseQueryResult<VendorApprovalRequestsQuery, VendorApprovalRequestsQueryVariables>;
export function useVendorApprovalRequestsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<VendorApprovalRequestsQuery, VendorApprovalRequestsQueryVariables>): Apollo.UseSuspenseQueryResult<VendorApprovalRequestsQuery | undefined, VendorApprovalRequestsQueryVariables>;
export function useVendorApprovalRequestsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<VendorApprovalRequestsQuery, VendorApprovalRequestsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<VendorApprovalRequestsQuery, VendorApprovalRequestsQueryVariables>(VendorApprovalRequestsDocument, options);
        }
export type VendorApprovalRequestsQueryHookResult = ReturnType<typeof useVendorApprovalRequestsQuery>;
export type VendorApprovalRequestsLazyQueryHookResult = ReturnType<typeof useVendorApprovalRequestsLazyQuery>;
export type VendorApprovalRequestsSuspenseQueryHookResult = ReturnType<typeof useVendorApprovalRequestsSuspenseQuery>;
export type VendorApprovalRequestsQueryResult = Apollo.QueryResult<VendorApprovalRequestsQuery, VendorApprovalRequestsQueryVariables>;
export const CreateVendorDocument = gql`
    mutation CreateVendor($input: CreateVendorInput!) {
  createVendor(input: $input) {
    id
    name
    orgApprovalStatus
    status
  }
}
    `;
export type CreateVendorMutationFn = Apollo.MutationFunction<CreateVendorMutation, CreateVendorMutationVariables>;
export function useCreateVendorMutation(baseOptions?: Apollo.MutationHookOptions<CreateVendorMutation, CreateVendorMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateVendorMutation, CreateVendorMutationVariables>(CreateVendorDocument, options);
      }
export type CreateVendorMutationHookResult = ReturnType<typeof useCreateVendorMutation>;
export type CreateVendorMutationResult = Apollo.MutationResult<CreateVendorMutation>;
export type CreateVendorMutationOptions = Apollo.BaseMutationOptions<CreateVendorMutation, CreateVendorMutationVariables>;
export const UpdateVendorDocument = gql`
    mutation UpdateVendor($id: ID!, $input: UpdateVendorInput!) {
  updateVendor(id: $id, input: $input) {
    id
    name
    orgApprovalStatus
    status
  }
}
    `;
export type UpdateVendorMutationFn = Apollo.MutationFunction<UpdateVendorMutation, UpdateVendorMutationVariables>;
export function useUpdateVendorMutation(baseOptions?: Apollo.MutationHookOptions<UpdateVendorMutation, UpdateVendorMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateVendorMutation, UpdateVendorMutationVariables>(UpdateVendorDocument, options);
      }
export type UpdateVendorMutationHookResult = ReturnType<typeof useUpdateVendorMutation>;
export type UpdateVendorMutationResult = Apollo.MutationResult<UpdateVendorMutation>;
export type UpdateVendorMutationOptions = Apollo.BaseMutationOptions<UpdateVendorMutation, UpdateVendorMutationVariables>;
export const SubmitVendorForApprovalDocument = gql`
    mutation SubmitVendorForApproval($id: ID!, $assigneeApproverUserIds: [ID!]) {
  submitVendorForApproval(
    id: $id
    assigneeApproverUserIds: $assigneeApproverUserIds
  ) {
    id
    seqNo
    orgApprovalStatus
    status
  }
}
    `;
export type SubmitVendorForApprovalMutationFn = Apollo.MutationFunction<SubmitVendorForApprovalMutation, SubmitVendorForApprovalMutationVariables>;
export function useSubmitVendorForApprovalMutation(baseOptions?: Apollo.MutationHookOptions<SubmitVendorForApprovalMutation, SubmitVendorForApprovalMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SubmitVendorForApprovalMutation, SubmitVendorForApprovalMutationVariables>(SubmitVendorForApprovalDocument, options);
      }
export type SubmitVendorForApprovalMutationHookResult = ReturnType<typeof useSubmitVendorForApprovalMutation>;
export type SubmitVendorForApprovalMutationResult = Apollo.MutationResult<SubmitVendorForApprovalMutation>;
export type SubmitVendorForApprovalMutationOptions = Apollo.BaseMutationOptions<SubmitVendorForApprovalMutation, SubmitVendorForApprovalMutationVariables>;
export const DeleteVendorDocument = gql`
    mutation DeleteVendor($id: ID!) {
  deleteVendor(id: $id)
}
    `;
export type DeleteVendorMutationFn = Apollo.MutationFunction<DeleteVendorMutation, DeleteVendorMutationVariables>;
export function useDeleteVendorMutation(baseOptions?: Apollo.MutationHookOptions<DeleteVendorMutation, DeleteVendorMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteVendorMutation, DeleteVendorMutationVariables>(DeleteVendorDocument, options);
      }
export type DeleteVendorMutationHookResult = ReturnType<typeof useDeleteVendorMutation>;
export type DeleteVendorMutationResult = Apollo.MutationResult<DeleteVendorMutation>;
export type DeleteVendorMutationOptions = Apollo.BaseMutationOptions<DeleteVendorMutation, DeleteVendorMutationVariables>;
export const GetProjectsDocument = gql`
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
    `;
export function useGetProjectsQuery(baseOptions: Apollo.QueryHookOptions<GetProjectsQuery, GetProjectsQueryVariables> & ({ variables: GetProjectsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetProjectsQuery, GetProjectsQueryVariables>(GetProjectsDocument, options);
      }
export function useGetProjectsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetProjectsQuery, GetProjectsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetProjectsQuery, GetProjectsQueryVariables>(GetProjectsDocument, options);
        }
// @ts-ignore
export function useGetProjectsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetProjectsQuery, GetProjectsQueryVariables>): Apollo.UseSuspenseQueryResult<GetProjectsQuery, GetProjectsQueryVariables>;
export function useGetProjectsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetProjectsQuery, GetProjectsQueryVariables>): Apollo.UseSuspenseQueryResult<GetProjectsQuery | undefined, GetProjectsQueryVariables>;
export function useGetProjectsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetProjectsQuery, GetProjectsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetProjectsQuery, GetProjectsQueryVariables>(GetProjectsDocument, options);
        }
export type GetProjectsQueryHookResult = ReturnType<typeof useGetProjectsQuery>;
export type GetProjectsLazyQueryHookResult = ReturnType<typeof useGetProjectsLazyQuery>;
export type GetProjectsSuspenseQueryHookResult = ReturnType<typeof useGetProjectsSuspenseQuery>;
export type GetProjectsQueryResult = Apollo.QueryResult<GetProjectsQuery, GetProjectsQueryVariables>;
export const GetProjectDocument = gql`
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
    `;
export function useGetProjectQuery(baseOptions: Apollo.QueryHookOptions<GetProjectQuery, GetProjectQueryVariables> & ({ variables: GetProjectQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetProjectQuery, GetProjectQueryVariables>(GetProjectDocument, options);
      }
export function useGetProjectLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetProjectQuery, GetProjectQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetProjectQuery, GetProjectQueryVariables>(GetProjectDocument, options);
        }
// @ts-ignore
export function useGetProjectSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetProjectQuery, GetProjectQueryVariables>): Apollo.UseSuspenseQueryResult<GetProjectQuery, GetProjectQueryVariables>;
export function useGetProjectSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetProjectQuery, GetProjectQueryVariables>): Apollo.UseSuspenseQueryResult<GetProjectQuery | undefined, GetProjectQueryVariables>;
export function useGetProjectSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetProjectQuery, GetProjectQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetProjectQuery, GetProjectQueryVariables>(GetProjectDocument, options);
        }
export type GetProjectQueryHookResult = ReturnType<typeof useGetProjectQuery>;
export type GetProjectLazyQueryHookResult = ReturnType<typeof useGetProjectLazyQuery>;
export type GetProjectSuspenseQueryHookResult = ReturnType<typeof useGetProjectSuspenseQuery>;
export type GetProjectQueryResult = Apollo.QueryResult<GetProjectQuery, GetProjectQueryVariables>;
export const CreateProjectDocument = gql`
    mutation CreateProject($input: CreateProjectInput!) {
  createProject(input: $input) {
    id
    name
    orgApprovalStatus
    status
  }
}
    `;
export type CreateProjectMutationFn = Apollo.MutationFunction<CreateProjectMutation, CreateProjectMutationVariables>;
export function useCreateProjectMutation(baseOptions?: Apollo.MutationHookOptions<CreateProjectMutation, CreateProjectMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateProjectMutation, CreateProjectMutationVariables>(CreateProjectDocument, options);
      }
export type CreateProjectMutationHookResult = ReturnType<typeof useCreateProjectMutation>;
export type CreateProjectMutationResult = Apollo.MutationResult<CreateProjectMutation>;
export type CreateProjectMutationOptions = Apollo.BaseMutationOptions<CreateProjectMutation, CreateProjectMutationVariables>;
export const SubmitProjectForApprovalDocument = gql`
    mutation SubmitProjectForApproval($id: ID!) {
  submitProjectForApproval(id: $id) {
    id
    seqNo
    orgApprovalStatus
    status
  }
}
    `;
export type SubmitProjectForApprovalMutationFn = Apollo.MutationFunction<SubmitProjectForApprovalMutation, SubmitProjectForApprovalMutationVariables>;
export function useSubmitProjectForApprovalMutation(baseOptions?: Apollo.MutationHookOptions<SubmitProjectForApprovalMutation, SubmitProjectForApprovalMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SubmitProjectForApprovalMutation, SubmitProjectForApprovalMutationVariables>(SubmitProjectForApprovalDocument, options);
      }
export type SubmitProjectForApprovalMutationHookResult = ReturnType<typeof useSubmitProjectForApprovalMutation>;
export type SubmitProjectForApprovalMutationResult = Apollo.MutationResult<SubmitProjectForApprovalMutation>;
export type SubmitProjectForApprovalMutationOptions = Apollo.BaseMutationOptions<SubmitProjectForApprovalMutation, SubmitProjectForApprovalMutationVariables>;
export const UpdateProjectDocument = gql`
    mutation UpdateProject($id: ID!, $input: UpdateProjectInput!) {
  updateProject(id: $id, input: $input) {
    id
    name
    orgApprovalStatus
    status
  }
}
    `;
export type UpdateProjectMutationFn = Apollo.MutationFunction<UpdateProjectMutation, UpdateProjectMutationVariables>;
export function useUpdateProjectMutation(baseOptions?: Apollo.MutationHookOptions<UpdateProjectMutation, UpdateProjectMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateProjectMutation, UpdateProjectMutationVariables>(UpdateProjectDocument, options);
      }
export type UpdateProjectMutationHookResult = ReturnType<typeof useUpdateProjectMutation>;
export type UpdateProjectMutationResult = Apollo.MutationResult<UpdateProjectMutation>;
export type UpdateProjectMutationOptions = Apollo.BaseMutationOptions<UpdateProjectMutation, UpdateProjectMutationVariables>;
export const DeleteProjectDocument = gql`
    mutation DeleteProject($id: ID!) {
  deleteProject(id: $id) {
    id
  }
}
    `;
export type DeleteProjectMutationFn = Apollo.MutationFunction<DeleteProjectMutation, DeleteProjectMutationVariables>;
export function useDeleteProjectMutation(baseOptions?: Apollo.MutationHookOptions<DeleteProjectMutation, DeleteProjectMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteProjectMutation, DeleteProjectMutationVariables>(DeleteProjectDocument, options);
      }
export type DeleteProjectMutationHookResult = ReturnType<typeof useDeleteProjectMutation>;
export type DeleteProjectMutationResult = Apollo.MutationResult<DeleteProjectMutation>;
export type DeleteProjectMutationOptions = Apollo.BaseMutationOptions<DeleteProjectMutation, DeleteProjectMutationVariables>;
export const GetPurchaseOrdersDocument = gql`
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
    `;
export function useGetPurchaseOrdersQuery(baseOptions: Apollo.QueryHookOptions<GetPurchaseOrdersQuery, GetPurchaseOrdersQueryVariables> & ({ variables: GetPurchaseOrdersQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPurchaseOrdersQuery, GetPurchaseOrdersQueryVariables>(GetPurchaseOrdersDocument, options);
      }
export function useGetPurchaseOrdersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPurchaseOrdersQuery, GetPurchaseOrdersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPurchaseOrdersQuery, GetPurchaseOrdersQueryVariables>(GetPurchaseOrdersDocument, options);
        }
// @ts-ignore
export function useGetPurchaseOrdersSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetPurchaseOrdersQuery, GetPurchaseOrdersQueryVariables>): Apollo.UseSuspenseQueryResult<GetPurchaseOrdersQuery, GetPurchaseOrdersQueryVariables>;
export function useGetPurchaseOrdersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPurchaseOrdersQuery, GetPurchaseOrdersQueryVariables>): Apollo.UseSuspenseQueryResult<GetPurchaseOrdersQuery | undefined, GetPurchaseOrdersQueryVariables>;
export function useGetPurchaseOrdersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPurchaseOrdersQuery, GetPurchaseOrdersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPurchaseOrdersQuery, GetPurchaseOrdersQueryVariables>(GetPurchaseOrdersDocument, options);
        }
export type GetPurchaseOrdersQueryHookResult = ReturnType<typeof useGetPurchaseOrdersQuery>;
export type GetPurchaseOrdersLazyQueryHookResult = ReturnType<typeof useGetPurchaseOrdersLazyQuery>;
export type GetPurchaseOrdersSuspenseQueryHookResult = ReturnType<typeof useGetPurchaseOrdersSuspenseQuery>;
export type GetPurchaseOrdersQueryResult = Apollo.QueryResult<GetPurchaseOrdersQuery, GetPurchaseOrdersQueryVariables>;
export const CreatePurchaseOrderDocument = gql`
    mutation CreatePurchaseOrder($input: CreatePurchaseOrderInput!) {
  createPurchaseOrder(input: $input) {
    id
    seqNo
    status
    totalAmount
  }
}
    `;
export type CreatePurchaseOrderMutationFn = Apollo.MutationFunction<CreatePurchaseOrderMutation, CreatePurchaseOrderMutationVariables>;
export function useCreatePurchaseOrderMutation(baseOptions?: Apollo.MutationHookOptions<CreatePurchaseOrderMutation, CreatePurchaseOrderMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreatePurchaseOrderMutation, CreatePurchaseOrderMutationVariables>(CreatePurchaseOrderDocument, options);
      }
export type CreatePurchaseOrderMutationHookResult = ReturnType<typeof useCreatePurchaseOrderMutation>;
export type CreatePurchaseOrderMutationResult = Apollo.MutationResult<CreatePurchaseOrderMutation>;
export type CreatePurchaseOrderMutationOptions = Apollo.BaseMutationOptions<CreatePurchaseOrderMutation, CreatePurchaseOrderMutationVariables>;
export const UpdatePurchaseOrderDocument = gql`
    mutation UpdatePurchaseOrder($id: ID!, $input: UpdatePurchaseOrderInput!) {
  updatePurchaseOrder(id: $id, input: $input) {
    id
    seqNo
    status
    totalAmount
  }
}
    `;
export type UpdatePurchaseOrderMutationFn = Apollo.MutationFunction<UpdatePurchaseOrderMutation, UpdatePurchaseOrderMutationVariables>;
export function useUpdatePurchaseOrderMutation(baseOptions?: Apollo.MutationHookOptions<UpdatePurchaseOrderMutation, UpdatePurchaseOrderMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdatePurchaseOrderMutation, UpdatePurchaseOrderMutationVariables>(UpdatePurchaseOrderDocument, options);
      }
export type UpdatePurchaseOrderMutationHookResult = ReturnType<typeof useUpdatePurchaseOrderMutation>;
export type UpdatePurchaseOrderMutationResult = Apollo.MutationResult<UpdatePurchaseOrderMutation>;
export type UpdatePurchaseOrderMutationOptions = Apollo.BaseMutationOptions<UpdatePurchaseOrderMutation, UpdatePurchaseOrderMutationVariables>;
export const SubmitPurchaseOrderDocument = gql`
    mutation SubmitPurchaseOrder($id: ID!) {
  submitPurchaseOrder(id: $id) {
    id
    status
  }
}
    `;
export type SubmitPurchaseOrderMutationFn = Apollo.MutationFunction<SubmitPurchaseOrderMutation, SubmitPurchaseOrderMutationVariables>;
export function useSubmitPurchaseOrderMutation(baseOptions?: Apollo.MutationHookOptions<SubmitPurchaseOrderMutation, SubmitPurchaseOrderMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SubmitPurchaseOrderMutation, SubmitPurchaseOrderMutationVariables>(SubmitPurchaseOrderDocument, options);
      }
export type SubmitPurchaseOrderMutationHookResult = ReturnType<typeof useSubmitPurchaseOrderMutation>;
export type SubmitPurchaseOrderMutationResult = Apollo.MutationResult<SubmitPurchaseOrderMutation>;
export type SubmitPurchaseOrderMutationOptions = Apollo.BaseMutationOptions<SubmitPurchaseOrderMutation, SubmitPurchaseOrderMutationVariables>;
export const ApprovePurchaseOrderDocument = gql`
    mutation ApprovePurchaseOrder($id: ID!) {
  approvePurchaseOrder(id: $id) {
    id
    status
  }
}
    `;
export type ApprovePurchaseOrderMutationFn = Apollo.MutationFunction<ApprovePurchaseOrderMutation, ApprovePurchaseOrderMutationVariables>;
export function useApprovePurchaseOrderMutation(baseOptions?: Apollo.MutationHookOptions<ApprovePurchaseOrderMutation, ApprovePurchaseOrderMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ApprovePurchaseOrderMutation, ApprovePurchaseOrderMutationVariables>(ApprovePurchaseOrderDocument, options);
      }
export type ApprovePurchaseOrderMutationHookResult = ReturnType<typeof useApprovePurchaseOrderMutation>;
export type ApprovePurchaseOrderMutationResult = Apollo.MutationResult<ApprovePurchaseOrderMutation>;
export type ApprovePurchaseOrderMutationOptions = Apollo.BaseMutationOptions<ApprovePurchaseOrderMutation, ApprovePurchaseOrderMutationVariables>;
export const ReceivePurchaseOrderDocument = gql`
    mutation ReceivePurchaseOrder($id: ID!) {
  receivePurchaseOrder(id: $id) {
    id
    status
  }
}
    `;
export type ReceivePurchaseOrderMutationFn = Apollo.MutationFunction<ReceivePurchaseOrderMutation, ReceivePurchaseOrderMutationVariables>;
export function useReceivePurchaseOrderMutation(baseOptions?: Apollo.MutationHookOptions<ReceivePurchaseOrderMutation, ReceivePurchaseOrderMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ReceivePurchaseOrderMutation, ReceivePurchaseOrderMutationVariables>(ReceivePurchaseOrderDocument, options);
      }
export type ReceivePurchaseOrderMutationHookResult = ReturnType<typeof useReceivePurchaseOrderMutation>;
export type ReceivePurchaseOrderMutationResult = Apollo.MutationResult<ReceivePurchaseOrderMutation>;
export type ReceivePurchaseOrderMutationOptions = Apollo.BaseMutationOptions<ReceivePurchaseOrderMutation, ReceivePurchaseOrderMutationVariables>;
export const BillPurchaseOrderDocument = gql`
    mutation BillPurchaseOrder($id: ID!, $billDate: String!, $dueDate: String!) {
  billPurchaseOrder(id: $id, billDate: $billDate, dueDate: $dueDate) {
    id
    billNumber
    status
    totalAmount
  }
}
    `;
export type BillPurchaseOrderMutationFn = Apollo.MutationFunction<BillPurchaseOrderMutation, BillPurchaseOrderMutationVariables>;
export function useBillPurchaseOrderMutation(baseOptions?: Apollo.MutationHookOptions<BillPurchaseOrderMutation, BillPurchaseOrderMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<BillPurchaseOrderMutation, BillPurchaseOrderMutationVariables>(BillPurchaseOrderDocument, options);
      }
export type BillPurchaseOrderMutationHookResult = ReturnType<typeof useBillPurchaseOrderMutation>;
export type BillPurchaseOrderMutationResult = Apollo.MutationResult<BillPurchaseOrderMutation>;
export type BillPurchaseOrderMutationOptions = Apollo.BaseMutationOptions<BillPurchaseOrderMutation, BillPurchaseOrderMutationVariables>;
export const GetSalesOrdersDocument = gql`
    query GetSalesOrders($organizationId: ID!, $page: Int, $limit: Int, $status: String, $cashSale: Boolean) {
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
    `;
export function useGetSalesOrdersQuery(baseOptions: Apollo.QueryHookOptions<GetSalesOrdersQuery, GetSalesOrdersQueryVariables> & ({ variables: GetSalesOrdersQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSalesOrdersQuery, GetSalesOrdersQueryVariables>(GetSalesOrdersDocument, options);
      }
export function useGetSalesOrdersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSalesOrdersQuery, GetSalesOrdersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSalesOrdersQuery, GetSalesOrdersQueryVariables>(GetSalesOrdersDocument, options);
        }
// @ts-ignore
export function useGetSalesOrdersSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetSalesOrdersQuery, GetSalesOrdersQueryVariables>): Apollo.UseSuspenseQueryResult<GetSalesOrdersQuery, GetSalesOrdersQueryVariables>;
export function useGetSalesOrdersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetSalesOrdersQuery, GetSalesOrdersQueryVariables>): Apollo.UseSuspenseQueryResult<GetSalesOrdersQuery | undefined, GetSalesOrdersQueryVariables>;
export function useGetSalesOrdersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetSalesOrdersQuery, GetSalesOrdersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetSalesOrdersQuery, GetSalesOrdersQueryVariables>(GetSalesOrdersDocument, options);
        }
export type GetSalesOrdersQueryHookResult = ReturnType<typeof useGetSalesOrdersQuery>;
export type GetSalesOrdersLazyQueryHookResult = ReturnType<typeof useGetSalesOrdersLazyQuery>;
export type GetSalesOrdersSuspenseQueryHookResult = ReturnType<typeof useGetSalesOrdersSuspenseQuery>;
export type GetSalesOrdersQueryResult = Apollo.QueryResult<GetSalesOrdersQuery, GetSalesOrdersQueryVariables>;
export const GetSalesOrderDocument = gql`
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
    `;
export function useGetSalesOrderQuery(baseOptions: Apollo.QueryHookOptions<GetSalesOrderQuery, GetSalesOrderQueryVariables> & ({ variables: GetSalesOrderQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSalesOrderQuery, GetSalesOrderQueryVariables>(GetSalesOrderDocument, options);
      }
export function useGetSalesOrderLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSalesOrderQuery, GetSalesOrderQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSalesOrderQuery, GetSalesOrderQueryVariables>(GetSalesOrderDocument, options);
        }
// @ts-ignore
export function useGetSalesOrderSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetSalesOrderQuery, GetSalesOrderQueryVariables>): Apollo.UseSuspenseQueryResult<GetSalesOrderQuery, GetSalesOrderQueryVariables>;
export function useGetSalesOrderSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetSalesOrderQuery, GetSalesOrderQueryVariables>): Apollo.UseSuspenseQueryResult<GetSalesOrderQuery | undefined, GetSalesOrderQueryVariables>;
export function useGetSalesOrderSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetSalesOrderQuery, GetSalesOrderQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetSalesOrderQuery, GetSalesOrderQueryVariables>(GetSalesOrderDocument, options);
        }
export type GetSalesOrderQueryHookResult = ReturnType<typeof useGetSalesOrderQuery>;
export type GetSalesOrderLazyQueryHookResult = ReturnType<typeof useGetSalesOrderLazyQuery>;
export type GetSalesOrderSuspenseQueryHookResult = ReturnType<typeof useGetSalesOrderSuspenseQuery>;
export type GetSalesOrderQueryResult = Apollo.QueryResult<GetSalesOrderQuery, GetSalesOrderQueryVariables>;
export const CreateSalesOrderDocument = gql`
    mutation CreateSalesOrder($input: CreateSalesOrderInput!) {
  createSalesOrder(input: $input) {
    id
    seqNo
    status
  }
}
    `;
export type CreateSalesOrderMutationFn = Apollo.MutationFunction<CreateSalesOrderMutation, CreateSalesOrderMutationVariables>;
export function useCreateSalesOrderMutation(baseOptions?: Apollo.MutationHookOptions<CreateSalesOrderMutation, CreateSalesOrderMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateSalesOrderMutation, CreateSalesOrderMutationVariables>(CreateSalesOrderDocument, options);
      }
export type CreateSalesOrderMutationHookResult = ReturnType<typeof useCreateSalesOrderMutation>;
export type CreateSalesOrderMutationResult = Apollo.MutationResult<CreateSalesOrderMutation>;
export type CreateSalesOrderMutationOptions = Apollo.BaseMutationOptions<CreateSalesOrderMutation, CreateSalesOrderMutationVariables>;
export const UpdateSalesOrderDocument = gql`
    mutation UpdateSalesOrder($id: ID!, $input: UpdateSalesOrderInput!) {
  updateSalesOrder(id: $id, input: $input) {
    id
    seqNo
    status
  }
}
    `;
export type UpdateSalesOrderMutationFn = Apollo.MutationFunction<UpdateSalesOrderMutation, UpdateSalesOrderMutationVariables>;
export function useUpdateSalesOrderMutation(baseOptions?: Apollo.MutationHookOptions<UpdateSalesOrderMutation, UpdateSalesOrderMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateSalesOrderMutation, UpdateSalesOrderMutationVariables>(UpdateSalesOrderDocument, options);
      }
export type UpdateSalesOrderMutationHookResult = ReturnType<typeof useUpdateSalesOrderMutation>;
export type UpdateSalesOrderMutationResult = Apollo.MutationResult<UpdateSalesOrderMutation>;
export type UpdateSalesOrderMutationOptions = Apollo.BaseMutationOptions<UpdateSalesOrderMutation, UpdateSalesOrderMutationVariables>;
export const GetCustomerInvoicesDocument = gql`
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
    `;
export function useGetCustomerInvoicesQuery(baseOptions: Apollo.QueryHookOptions<GetCustomerInvoicesQuery, GetCustomerInvoicesQueryVariables> & ({ variables: GetCustomerInvoicesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCustomerInvoicesQuery, GetCustomerInvoicesQueryVariables>(GetCustomerInvoicesDocument, options);
      }
export function useGetCustomerInvoicesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCustomerInvoicesQuery, GetCustomerInvoicesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCustomerInvoicesQuery, GetCustomerInvoicesQueryVariables>(GetCustomerInvoicesDocument, options);
        }
// @ts-ignore
export function useGetCustomerInvoicesSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetCustomerInvoicesQuery, GetCustomerInvoicesQueryVariables>): Apollo.UseSuspenseQueryResult<GetCustomerInvoicesQuery, GetCustomerInvoicesQueryVariables>;
export function useGetCustomerInvoicesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCustomerInvoicesQuery, GetCustomerInvoicesQueryVariables>): Apollo.UseSuspenseQueryResult<GetCustomerInvoicesQuery | undefined, GetCustomerInvoicesQueryVariables>;
export function useGetCustomerInvoicesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCustomerInvoicesQuery, GetCustomerInvoicesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCustomerInvoicesQuery, GetCustomerInvoicesQueryVariables>(GetCustomerInvoicesDocument, options);
        }
export type GetCustomerInvoicesQueryHookResult = ReturnType<typeof useGetCustomerInvoicesQuery>;
export type GetCustomerInvoicesLazyQueryHookResult = ReturnType<typeof useGetCustomerInvoicesLazyQuery>;
export type GetCustomerInvoicesSuspenseQueryHookResult = ReturnType<typeof useGetCustomerInvoicesSuspenseQuery>;
export type GetCustomerInvoicesQueryResult = Apollo.QueryResult<GetCustomerInvoicesQuery, GetCustomerInvoicesQueryVariables>;
export const GetCustomerPaymentsDocument = gql`
    query GetCustomerPayments($organizationId: ID!, $customerId: ID, $page: Int, $limit: Int) {
  customerPayments(
    organizationId: $organizationId
    customerId: $customerId
    page: $page
    limit: $limit
  ) {
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
    `;
export function useGetCustomerPaymentsQuery(baseOptions: Apollo.QueryHookOptions<GetCustomerPaymentsQuery, GetCustomerPaymentsQueryVariables> & ({ variables: GetCustomerPaymentsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCustomerPaymentsQuery, GetCustomerPaymentsQueryVariables>(GetCustomerPaymentsDocument, options);
      }
export function useGetCustomerPaymentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCustomerPaymentsQuery, GetCustomerPaymentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCustomerPaymentsQuery, GetCustomerPaymentsQueryVariables>(GetCustomerPaymentsDocument, options);
        }
// @ts-ignore
export function useGetCustomerPaymentsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetCustomerPaymentsQuery, GetCustomerPaymentsQueryVariables>): Apollo.UseSuspenseQueryResult<GetCustomerPaymentsQuery, GetCustomerPaymentsQueryVariables>;
export function useGetCustomerPaymentsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCustomerPaymentsQuery, GetCustomerPaymentsQueryVariables>): Apollo.UseSuspenseQueryResult<GetCustomerPaymentsQuery | undefined, GetCustomerPaymentsQueryVariables>;
export function useGetCustomerPaymentsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCustomerPaymentsQuery, GetCustomerPaymentsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCustomerPaymentsQuery, GetCustomerPaymentsQueryVariables>(GetCustomerPaymentsDocument, options);
        }
export type GetCustomerPaymentsQueryHookResult = ReturnType<typeof useGetCustomerPaymentsQuery>;
export type GetCustomerPaymentsLazyQueryHookResult = ReturnType<typeof useGetCustomerPaymentsLazyQuery>;
export type GetCustomerPaymentsSuspenseQueryHookResult = ReturnType<typeof useGetCustomerPaymentsSuspenseQuery>;
export type GetCustomerPaymentsQueryResult = Apollo.QueryResult<GetCustomerPaymentsQuery, GetCustomerPaymentsQueryVariables>;
export const CreateCustomerPaymentDocument = gql`
    mutation CreateCustomerPayment($input: CreateCustomerPaymentInput!) {
  createCustomerPayment(input: $input) {
    id
    paymentNumber
    totalAmount
  }
}
    `;
export type CreateCustomerPaymentMutationFn = Apollo.MutationFunction<CreateCustomerPaymentMutation, CreateCustomerPaymentMutationVariables>;
export function useCreateCustomerPaymentMutation(baseOptions?: Apollo.MutationHookOptions<CreateCustomerPaymentMutation, CreateCustomerPaymentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateCustomerPaymentMutation, CreateCustomerPaymentMutationVariables>(CreateCustomerPaymentDocument, options);
      }
export type CreateCustomerPaymentMutationHookResult = ReturnType<typeof useCreateCustomerPaymentMutation>;
export type CreateCustomerPaymentMutationResult = Apollo.MutationResult<CreateCustomerPaymentMutation>;
export type CreateCustomerPaymentMutationOptions = Apollo.BaseMutationOptions<CreateCustomerPaymentMutation, CreateCustomerPaymentMutationVariables>;
export const CreateCustomerInvoiceDocument = gql`
    mutation CreateCustomerInvoice($input: CreateCustomerInvoiceInput!) {
  createCustomerInvoice(input: $input) {
    id
    seqNo
    status
  }
}
    `;
export type CreateCustomerInvoiceMutationFn = Apollo.MutationFunction<CreateCustomerInvoiceMutation, CreateCustomerInvoiceMutationVariables>;
export function useCreateCustomerInvoiceMutation(baseOptions?: Apollo.MutationHookOptions<CreateCustomerInvoiceMutation, CreateCustomerInvoiceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateCustomerInvoiceMutation, CreateCustomerInvoiceMutationVariables>(CreateCustomerInvoiceDocument, options);
      }
export type CreateCustomerInvoiceMutationHookResult = ReturnType<typeof useCreateCustomerInvoiceMutation>;
export type CreateCustomerInvoiceMutationResult = Apollo.MutationResult<CreateCustomerInvoiceMutation>;
export type CreateCustomerInvoiceMutationOptions = Apollo.BaseMutationOptions<CreateCustomerInvoiceMutation, CreateCustomerInvoiceMutationVariables>;
export const CreateCashSaleDocument = gql`
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
    `;
export type CreateCashSaleMutationFn = Apollo.MutationFunction<CreateCashSaleMutation, CreateCashSaleMutationVariables>;
export function useCreateCashSaleMutation(baseOptions?: Apollo.MutationHookOptions<CreateCashSaleMutation, CreateCashSaleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateCashSaleMutation, CreateCashSaleMutationVariables>(CreateCashSaleDocument, options);
      }
export type CreateCashSaleMutationHookResult = ReturnType<typeof useCreateCashSaleMutation>;
export type CreateCashSaleMutationResult = Apollo.MutationResult<CreateCashSaleMutation>;
export type CreateCashSaleMutationOptions = Apollo.BaseMutationOptions<CreateCashSaleMutation, CreateCashSaleMutationVariables>;
export const GetCashSalesRefundCandidatesDocument = gql`
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
    `;
export function useGetCashSalesRefundCandidatesQuery(baseOptions: Apollo.QueryHookOptions<GetCashSalesRefundCandidatesQuery, GetCashSalesRefundCandidatesQueryVariables> & ({ variables: GetCashSalesRefundCandidatesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCashSalesRefundCandidatesQuery, GetCashSalesRefundCandidatesQueryVariables>(GetCashSalesRefundCandidatesDocument, options);
      }
export function useGetCashSalesRefundCandidatesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCashSalesRefundCandidatesQuery, GetCashSalesRefundCandidatesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCashSalesRefundCandidatesQuery, GetCashSalesRefundCandidatesQueryVariables>(GetCashSalesRefundCandidatesDocument, options);
        }
// @ts-ignore
export function useGetCashSalesRefundCandidatesSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetCashSalesRefundCandidatesQuery, GetCashSalesRefundCandidatesQueryVariables>): Apollo.UseSuspenseQueryResult<GetCashSalesRefundCandidatesQuery, GetCashSalesRefundCandidatesQueryVariables>;
export function useGetCashSalesRefundCandidatesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCashSalesRefundCandidatesQuery, GetCashSalesRefundCandidatesQueryVariables>): Apollo.UseSuspenseQueryResult<GetCashSalesRefundCandidatesQuery | undefined, GetCashSalesRefundCandidatesQueryVariables>;
export function useGetCashSalesRefundCandidatesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCashSalesRefundCandidatesQuery, GetCashSalesRefundCandidatesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCashSalesRefundCandidatesQuery, GetCashSalesRefundCandidatesQueryVariables>(GetCashSalesRefundCandidatesDocument, options);
        }
export type GetCashSalesRefundCandidatesQueryHookResult = ReturnType<typeof useGetCashSalesRefundCandidatesQuery>;
export type GetCashSalesRefundCandidatesLazyQueryHookResult = ReturnType<typeof useGetCashSalesRefundCandidatesLazyQuery>;
export type GetCashSalesRefundCandidatesSuspenseQueryHookResult = ReturnType<typeof useGetCashSalesRefundCandidatesSuspenseQuery>;
export type GetCashSalesRefundCandidatesQueryResult = Apollo.QueryResult<GetCashSalesRefundCandidatesQuery, GetCashSalesRefundCandidatesQueryVariables>;
export const RefundCashSaleDocument = gql`
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
    `;
export type RefundCashSaleMutationFn = Apollo.MutationFunction<RefundCashSaleMutation, RefundCashSaleMutationVariables>;
export function useRefundCashSaleMutation(baseOptions?: Apollo.MutationHookOptions<RefundCashSaleMutation, RefundCashSaleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RefundCashSaleMutation, RefundCashSaleMutationVariables>(RefundCashSaleDocument, options);
      }
export type RefundCashSaleMutationHookResult = ReturnType<typeof useRefundCashSaleMutation>;
export type RefundCashSaleMutationResult = Apollo.MutationResult<RefundCashSaleMutation>;
export type RefundCashSaleMutationOptions = Apollo.BaseMutationOptions<RefundCashSaleMutation, RefundCashSaleMutationVariables>;
export const UpdateCustomerInvoiceDocument = gql`
    mutation UpdateCustomerInvoice($id: ID!, $input: UpdateCustomerInvoiceInput!) {
  updateCustomerInvoice(id: $id, input: $input) {
    id
    seqNo
    status
    paidAmount
    totalAmount
  }
}
    `;
export type UpdateCustomerInvoiceMutationFn = Apollo.MutationFunction<UpdateCustomerInvoiceMutation, UpdateCustomerInvoiceMutationVariables>;
export function useUpdateCustomerInvoiceMutation(baseOptions?: Apollo.MutationHookOptions<UpdateCustomerInvoiceMutation, UpdateCustomerInvoiceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateCustomerInvoiceMutation, UpdateCustomerInvoiceMutationVariables>(UpdateCustomerInvoiceDocument, options);
      }
export type UpdateCustomerInvoiceMutationHookResult = ReturnType<typeof useUpdateCustomerInvoiceMutation>;
export type UpdateCustomerInvoiceMutationResult = Apollo.MutationResult<UpdateCustomerInvoiceMutation>;
export type UpdateCustomerInvoiceMutationOptions = Apollo.BaseMutationOptions<UpdateCustomerInvoiceMutation, UpdateCustomerInvoiceMutationVariables>;
export const GetAttendancesDocument = gql`
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
    `;
export function useGetAttendancesQuery(baseOptions: Apollo.QueryHookOptions<GetAttendancesQuery, GetAttendancesQueryVariables> & ({ variables: GetAttendancesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAttendancesQuery, GetAttendancesQueryVariables>(GetAttendancesDocument, options);
      }
export function useGetAttendancesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAttendancesQuery, GetAttendancesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAttendancesQuery, GetAttendancesQueryVariables>(GetAttendancesDocument, options);
        }
// @ts-ignore
export function useGetAttendancesSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetAttendancesQuery, GetAttendancesQueryVariables>): Apollo.UseSuspenseQueryResult<GetAttendancesQuery, GetAttendancesQueryVariables>;
export function useGetAttendancesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAttendancesQuery, GetAttendancesQueryVariables>): Apollo.UseSuspenseQueryResult<GetAttendancesQuery | undefined, GetAttendancesQueryVariables>;
export function useGetAttendancesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAttendancesQuery, GetAttendancesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAttendancesQuery, GetAttendancesQueryVariables>(GetAttendancesDocument, options);
        }
export type GetAttendancesQueryHookResult = ReturnType<typeof useGetAttendancesQuery>;
export type GetAttendancesLazyQueryHookResult = ReturnType<typeof useGetAttendancesLazyQuery>;
export type GetAttendancesSuspenseQueryHookResult = ReturnType<typeof useGetAttendancesSuspenseQuery>;
export type GetAttendancesQueryResult = Apollo.QueryResult<GetAttendancesQuery, GetAttendancesQueryVariables>;
export const CreateAttendanceDocument = gql`
    mutation CreateAttendance($input: CreateAttendanceInput!) {
  createAttendance(input: $input) {
    id
    status
  }
}
    `;
export type CreateAttendanceMutationFn = Apollo.MutationFunction<CreateAttendanceMutation, CreateAttendanceMutationVariables>;
export function useCreateAttendanceMutation(baseOptions?: Apollo.MutationHookOptions<CreateAttendanceMutation, CreateAttendanceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateAttendanceMutation, CreateAttendanceMutationVariables>(CreateAttendanceDocument, options);
      }
export type CreateAttendanceMutationHookResult = ReturnType<typeof useCreateAttendanceMutation>;
export type CreateAttendanceMutationResult = Apollo.MutationResult<CreateAttendanceMutation>;
export type CreateAttendanceMutationOptions = Apollo.BaseMutationOptions<CreateAttendanceMutation, CreateAttendanceMutationVariables>;
export const GetGeneralLedgersDocument = gql`
    query GetGeneralLedgers($organizationId: String!, $fiscalYear: String, $status: String) {
  generalLedgers(
    organizationId: $organizationId
    fiscalYear: $fiscalYear
    status: $status
  ) {
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
    `;
export function useGetGeneralLedgersQuery(baseOptions: Apollo.QueryHookOptions<GetGeneralLedgersQuery, GetGeneralLedgersQueryVariables> & ({ variables: GetGeneralLedgersQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetGeneralLedgersQuery, GetGeneralLedgersQueryVariables>(GetGeneralLedgersDocument, options);
      }
export function useGetGeneralLedgersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetGeneralLedgersQuery, GetGeneralLedgersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetGeneralLedgersQuery, GetGeneralLedgersQueryVariables>(GetGeneralLedgersDocument, options);
        }
// @ts-ignore
export function useGetGeneralLedgersSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetGeneralLedgersQuery, GetGeneralLedgersQueryVariables>): Apollo.UseSuspenseQueryResult<GetGeneralLedgersQuery, GetGeneralLedgersQueryVariables>;
export function useGetGeneralLedgersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetGeneralLedgersQuery, GetGeneralLedgersQueryVariables>): Apollo.UseSuspenseQueryResult<GetGeneralLedgersQuery | undefined, GetGeneralLedgersQueryVariables>;
export function useGetGeneralLedgersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetGeneralLedgersQuery, GetGeneralLedgersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetGeneralLedgersQuery, GetGeneralLedgersQueryVariables>(GetGeneralLedgersDocument, options);
        }
export type GetGeneralLedgersQueryHookResult = ReturnType<typeof useGetGeneralLedgersQuery>;
export type GetGeneralLedgersLazyQueryHookResult = ReturnType<typeof useGetGeneralLedgersLazyQuery>;
export type GetGeneralLedgersSuspenseQueryHookResult = ReturnType<typeof useGetGeneralLedgersSuspenseQuery>;
export type GetGeneralLedgersQueryResult = Apollo.QueryResult<GetGeneralLedgersQuery, GetGeneralLedgersQueryVariables>;
export const GetChartOfAccountsDocument = gql`
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
    `;
export function useGetChartOfAccountsQuery(baseOptions: Apollo.QueryHookOptions<GetChartOfAccountsQuery, GetChartOfAccountsQueryVariables> & ({ variables: GetChartOfAccountsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetChartOfAccountsQuery, GetChartOfAccountsQueryVariables>(GetChartOfAccountsDocument, options);
      }
export function useGetChartOfAccountsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetChartOfAccountsQuery, GetChartOfAccountsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetChartOfAccountsQuery, GetChartOfAccountsQueryVariables>(GetChartOfAccountsDocument, options);
        }
// @ts-ignore
export function useGetChartOfAccountsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetChartOfAccountsQuery, GetChartOfAccountsQueryVariables>): Apollo.UseSuspenseQueryResult<GetChartOfAccountsQuery, GetChartOfAccountsQueryVariables>;
export function useGetChartOfAccountsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetChartOfAccountsQuery, GetChartOfAccountsQueryVariables>): Apollo.UseSuspenseQueryResult<GetChartOfAccountsQuery | undefined, GetChartOfAccountsQueryVariables>;
export function useGetChartOfAccountsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetChartOfAccountsQuery, GetChartOfAccountsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetChartOfAccountsQuery, GetChartOfAccountsQueryVariables>(GetChartOfAccountsDocument, options);
        }
export type GetChartOfAccountsQueryHookResult = ReturnType<typeof useGetChartOfAccountsQuery>;
export type GetChartOfAccountsLazyQueryHookResult = ReturnType<typeof useGetChartOfAccountsLazyQuery>;
export type GetChartOfAccountsSuspenseQueryHookResult = ReturnType<typeof useGetChartOfAccountsSuspenseQuery>;
export type GetChartOfAccountsQueryResult = Apollo.QueryResult<GetChartOfAccountsQuery, GetChartOfAccountsQueryVariables>;
export const CreateGeneralLedgerDocument = gql`
    mutation CreateGeneralLedger($input: GeneralLedgerInput!) {
  createGeneralLedger(input: $input) {
    id
    transactionNumber
    status
  }
}
    `;
export type CreateGeneralLedgerMutationFn = Apollo.MutationFunction<CreateGeneralLedgerMutation, CreateGeneralLedgerMutationVariables>;
export function useCreateGeneralLedgerMutation(baseOptions?: Apollo.MutationHookOptions<CreateGeneralLedgerMutation, CreateGeneralLedgerMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateGeneralLedgerMutation, CreateGeneralLedgerMutationVariables>(CreateGeneralLedgerDocument, options);
      }
export type CreateGeneralLedgerMutationHookResult = ReturnType<typeof useCreateGeneralLedgerMutation>;
export type CreateGeneralLedgerMutationResult = Apollo.MutationResult<CreateGeneralLedgerMutation>;
export type CreateGeneralLedgerMutationOptions = Apollo.BaseMutationOptions<CreateGeneralLedgerMutation, CreateGeneralLedgerMutationVariables>;
export const CreateChartOfAccountDocument = gql`
    mutation CreateChartOfAccount($input: ChartOfAccountsInput!) {
  createChartOfAccount(input: $input) {
    id
    accountCode
    accountNumber
    accountName
  }
}
    `;
export type CreateChartOfAccountMutationFn = Apollo.MutationFunction<CreateChartOfAccountMutation, CreateChartOfAccountMutationVariables>;
export function useCreateChartOfAccountMutation(baseOptions?: Apollo.MutationHookOptions<CreateChartOfAccountMutation, CreateChartOfAccountMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateChartOfAccountMutation, CreateChartOfAccountMutationVariables>(CreateChartOfAccountDocument, options);
      }
export type CreateChartOfAccountMutationHookResult = ReturnType<typeof useCreateChartOfAccountMutation>;
export type CreateChartOfAccountMutationResult = Apollo.MutationResult<CreateChartOfAccountMutation>;
export type CreateChartOfAccountMutationOptions = Apollo.BaseMutationOptions<CreateChartOfAccountMutation, CreateChartOfAccountMutationVariables>;
export const GetCashBanksDocument = gql`
    query GetCashBanks($organizationId: String!, $reconciliationStatus: String, $bankAccount: String) {
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
    `;
export function useGetCashBanksQuery(baseOptions: Apollo.QueryHookOptions<GetCashBanksQuery, GetCashBanksQueryVariables> & ({ variables: GetCashBanksQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCashBanksQuery, GetCashBanksQueryVariables>(GetCashBanksDocument, options);
      }
export function useGetCashBanksLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCashBanksQuery, GetCashBanksQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCashBanksQuery, GetCashBanksQueryVariables>(GetCashBanksDocument, options);
        }
// @ts-ignore
export function useGetCashBanksSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetCashBanksQuery, GetCashBanksQueryVariables>): Apollo.UseSuspenseQueryResult<GetCashBanksQuery, GetCashBanksQueryVariables>;
export function useGetCashBanksSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCashBanksQuery, GetCashBanksQueryVariables>): Apollo.UseSuspenseQueryResult<GetCashBanksQuery | undefined, GetCashBanksQueryVariables>;
export function useGetCashBanksSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCashBanksQuery, GetCashBanksQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCashBanksQuery, GetCashBanksQueryVariables>(GetCashBanksDocument, options);
        }
export type GetCashBanksQueryHookResult = ReturnType<typeof useGetCashBanksQuery>;
export type GetCashBanksLazyQueryHookResult = ReturnType<typeof useGetCashBanksLazyQuery>;
export type GetCashBanksSuspenseQueryHookResult = ReturnType<typeof useGetCashBanksSuspenseQuery>;
export type GetCashBanksQueryResult = Apollo.QueryResult<GetCashBanksQuery, GetCashBanksQueryVariables>;
export const GetBankAccountsDocument = gql`
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
    `;
export function useGetBankAccountsQuery(baseOptions: Apollo.QueryHookOptions<GetBankAccountsQuery, GetBankAccountsQueryVariables> & ({ variables: GetBankAccountsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetBankAccountsQuery, GetBankAccountsQueryVariables>(GetBankAccountsDocument, options);
      }
export function useGetBankAccountsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetBankAccountsQuery, GetBankAccountsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetBankAccountsQuery, GetBankAccountsQueryVariables>(GetBankAccountsDocument, options);
        }
// @ts-ignore
export function useGetBankAccountsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetBankAccountsQuery, GetBankAccountsQueryVariables>): Apollo.UseSuspenseQueryResult<GetBankAccountsQuery, GetBankAccountsQueryVariables>;
export function useGetBankAccountsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetBankAccountsQuery, GetBankAccountsQueryVariables>): Apollo.UseSuspenseQueryResult<GetBankAccountsQuery | undefined, GetBankAccountsQueryVariables>;
export function useGetBankAccountsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetBankAccountsQuery, GetBankAccountsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetBankAccountsQuery, GetBankAccountsQueryVariables>(GetBankAccountsDocument, options);
        }
export type GetBankAccountsQueryHookResult = ReturnType<typeof useGetBankAccountsQuery>;
export type GetBankAccountsLazyQueryHookResult = ReturnType<typeof useGetBankAccountsLazyQuery>;
export type GetBankAccountsSuspenseQueryHookResult = ReturnType<typeof useGetBankAccountsSuspenseQuery>;
export type GetBankAccountsQueryResult = Apollo.QueryResult<GetBankAccountsQuery, GetBankAccountsQueryVariables>;
export const CreateCashBankDocument = gql`
    mutation CreateCashBank($input: CashBankInput!) {
  createCashBank(input: $input) {
    id
    transactionNumber
  }
}
    `;
export type CreateCashBankMutationFn = Apollo.MutationFunction<CreateCashBankMutation, CreateCashBankMutationVariables>;
export function useCreateCashBankMutation(baseOptions?: Apollo.MutationHookOptions<CreateCashBankMutation, CreateCashBankMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateCashBankMutation, CreateCashBankMutationVariables>(CreateCashBankDocument, options);
      }
export type CreateCashBankMutationHookResult = ReturnType<typeof useCreateCashBankMutation>;
export type CreateCashBankMutationResult = Apollo.MutationResult<CreateCashBankMutation>;
export type CreateCashBankMutationOptions = Apollo.BaseMutationOptions<CreateCashBankMutation, CreateCashBankMutationVariables>;
export const CreateBankAccountDocument = gql`
    mutation CreateBankAccount($input: BankAccountInput!) {
  createBankAccount(input: $input) {
    id
    accountNumber
    accountName
    accountHolder
  }
}
    `;
export type CreateBankAccountMutationFn = Apollo.MutationFunction<CreateBankAccountMutation, CreateBankAccountMutationVariables>;
export function useCreateBankAccountMutation(baseOptions?: Apollo.MutationHookOptions<CreateBankAccountMutation, CreateBankAccountMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateBankAccountMutation, CreateBankAccountMutationVariables>(CreateBankAccountDocument, options);
      }
export type CreateBankAccountMutationHookResult = ReturnType<typeof useCreateBankAccountMutation>;
export type CreateBankAccountMutationResult = Apollo.MutationResult<CreateBankAccountMutation>;
export type CreateBankAccountMutationOptions = Apollo.BaseMutationOptions<CreateBankAccountMutation, CreateBankAccountMutationVariables>;
export const ReconcileCashBankDocument = gql`
    mutation ReconcileCashBank($id: ID!) {
  reconcileCashBank(id: $id) {
    id
    transactionNumber
    reconciliationStatus
    reconciliationDate
  }
}
    `;
export type ReconcileCashBankMutationFn = Apollo.MutationFunction<ReconcileCashBankMutation, ReconcileCashBankMutationVariables>;
export function useReconcileCashBankMutation(baseOptions?: Apollo.MutationHookOptions<ReconcileCashBankMutation, ReconcileCashBankMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ReconcileCashBankMutation, ReconcileCashBankMutationVariables>(ReconcileCashBankDocument, options);
      }
export type ReconcileCashBankMutationHookResult = ReturnType<typeof useReconcileCashBankMutation>;
export type ReconcileCashBankMutationResult = Apollo.MutationResult<ReconcileCashBankMutation>;
export type ReconcileCashBankMutationOptions = Apollo.BaseMutationOptions<ReconcileCashBankMutation, ReconcileCashBankMutationVariables>;
export const GetBankStatementLinesDocument = gql`
    query GetBankStatementLines($organizationId: String!, $bankAccount: String!, $onlyUnmatched: Boolean) {
  bankStatementLines(
    organizationId: $organizationId
    bankAccount: $bankAccount
    onlyUnmatched: $onlyUnmatched
  ) {
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
    `;
export function useGetBankStatementLinesQuery(baseOptions: Apollo.QueryHookOptions<GetBankStatementLinesQuery, GetBankStatementLinesQueryVariables> & ({ variables: GetBankStatementLinesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetBankStatementLinesQuery, GetBankStatementLinesQueryVariables>(GetBankStatementLinesDocument, options);
      }
export function useGetBankStatementLinesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetBankStatementLinesQuery, GetBankStatementLinesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetBankStatementLinesQuery, GetBankStatementLinesQueryVariables>(GetBankStatementLinesDocument, options);
        }
// @ts-ignore
export function useGetBankStatementLinesSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetBankStatementLinesQuery, GetBankStatementLinesQueryVariables>): Apollo.UseSuspenseQueryResult<GetBankStatementLinesQuery, GetBankStatementLinesQueryVariables>;
export function useGetBankStatementLinesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetBankStatementLinesQuery, GetBankStatementLinesQueryVariables>): Apollo.UseSuspenseQueryResult<GetBankStatementLinesQuery | undefined, GetBankStatementLinesQueryVariables>;
export function useGetBankStatementLinesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetBankStatementLinesQuery, GetBankStatementLinesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetBankStatementLinesQuery, GetBankStatementLinesQueryVariables>(GetBankStatementLinesDocument, options);
        }
export type GetBankStatementLinesQueryHookResult = ReturnType<typeof useGetBankStatementLinesQuery>;
export type GetBankStatementLinesLazyQueryHookResult = ReturnType<typeof useGetBankStatementLinesLazyQuery>;
export type GetBankStatementLinesSuspenseQueryHookResult = ReturnType<typeof useGetBankStatementLinesSuspenseQuery>;
export type GetBankStatementLinesQueryResult = Apollo.QueryResult<GetBankStatementLinesQuery, GetBankStatementLinesQueryVariables>;
export const CreateBankStatementLineDocument = gql`
    mutation CreateBankStatementLine($input: BankStatementLineInput!) {
  createBankStatementLine(input: $input) {
    id
    lineDate
    amount
    lineKind
  }
}
    `;
export type CreateBankStatementLineMutationFn = Apollo.MutationFunction<CreateBankStatementLineMutation, CreateBankStatementLineMutationVariables>;
export function useCreateBankStatementLineMutation(baseOptions?: Apollo.MutationHookOptions<CreateBankStatementLineMutation, CreateBankStatementLineMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateBankStatementLineMutation, CreateBankStatementLineMutationVariables>(CreateBankStatementLineDocument, options);
      }
export type CreateBankStatementLineMutationHookResult = ReturnType<typeof useCreateBankStatementLineMutation>;
export type CreateBankStatementLineMutationResult = Apollo.MutationResult<CreateBankStatementLineMutation>;
export type CreateBankStatementLineMutationOptions = Apollo.BaseMutationOptions<CreateBankStatementLineMutation, CreateBankStatementLineMutationVariables>;
export const DeleteBankStatementLineDocument = gql`
    mutation DeleteBankStatementLine($id: ID!) {
  deleteBankStatementLine(id: $id)
}
    `;
export type DeleteBankStatementLineMutationFn = Apollo.MutationFunction<DeleteBankStatementLineMutation, DeleteBankStatementLineMutationVariables>;
export function useDeleteBankStatementLineMutation(baseOptions?: Apollo.MutationHookOptions<DeleteBankStatementLineMutation, DeleteBankStatementLineMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteBankStatementLineMutation, DeleteBankStatementLineMutationVariables>(DeleteBankStatementLineDocument, options);
      }
export type DeleteBankStatementLineMutationHookResult = ReturnType<typeof useDeleteBankStatementLineMutation>;
export type DeleteBankStatementLineMutationResult = Apollo.MutationResult<DeleteBankStatementLineMutation>;
export type DeleteBankStatementLineMutationOptions = Apollo.BaseMutationOptions<DeleteBankStatementLineMutation, DeleteBankStatementLineMutationVariables>;
export const MatchBankStatementLineToBookDocument = gql`
    mutation MatchBankStatementLineToBook($bankStatementLineId: ID!, $cashBankId: ID!) {
  matchBankStatementLineToBook(
    bankStatementLineId: $bankStatementLineId
    cashBankId: $cashBankId
  ) {
    id
    isMatched
    matchedCashBankId
  }
}
    `;
export type MatchBankStatementLineToBookMutationFn = Apollo.MutationFunction<MatchBankStatementLineToBookMutation, MatchBankStatementLineToBookMutationVariables>;
export function useMatchBankStatementLineToBookMutation(baseOptions?: Apollo.MutationHookOptions<MatchBankStatementLineToBookMutation, MatchBankStatementLineToBookMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<MatchBankStatementLineToBookMutation, MatchBankStatementLineToBookMutationVariables>(MatchBankStatementLineToBookDocument, options);
      }
export type MatchBankStatementLineToBookMutationHookResult = ReturnType<typeof useMatchBankStatementLineToBookMutation>;
export type MatchBankStatementLineToBookMutationResult = Apollo.MutationResult<MatchBankStatementLineToBookMutation>;
export type MatchBankStatementLineToBookMutationOptions = Apollo.BaseMutationOptions<MatchBankStatementLineToBookMutation, MatchBankStatementLineToBookMutationVariables>;
export const GetReconciliationRulesDocument = gql`
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
    `;
export function useGetReconciliationRulesQuery(baseOptions: Apollo.QueryHookOptions<GetReconciliationRulesQuery, GetReconciliationRulesQueryVariables> & ({ variables: GetReconciliationRulesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetReconciliationRulesQuery, GetReconciliationRulesQueryVariables>(GetReconciliationRulesDocument, options);
      }
export function useGetReconciliationRulesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetReconciliationRulesQuery, GetReconciliationRulesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetReconciliationRulesQuery, GetReconciliationRulesQueryVariables>(GetReconciliationRulesDocument, options);
        }
// @ts-ignore
export function useGetReconciliationRulesSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetReconciliationRulesQuery, GetReconciliationRulesQueryVariables>): Apollo.UseSuspenseQueryResult<GetReconciliationRulesQuery, GetReconciliationRulesQueryVariables>;
export function useGetReconciliationRulesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetReconciliationRulesQuery, GetReconciliationRulesQueryVariables>): Apollo.UseSuspenseQueryResult<GetReconciliationRulesQuery | undefined, GetReconciliationRulesQueryVariables>;
export function useGetReconciliationRulesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetReconciliationRulesQuery, GetReconciliationRulesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetReconciliationRulesQuery, GetReconciliationRulesQueryVariables>(GetReconciliationRulesDocument, options);
        }
export type GetReconciliationRulesQueryHookResult = ReturnType<typeof useGetReconciliationRulesQuery>;
export type GetReconciliationRulesLazyQueryHookResult = ReturnType<typeof useGetReconciliationRulesLazyQuery>;
export type GetReconciliationRulesSuspenseQueryHookResult = ReturnType<typeof useGetReconciliationRulesSuspenseQuery>;
export type GetReconciliationRulesQueryResult = Apollo.QueryResult<GetReconciliationRulesQuery, GetReconciliationRulesQueryVariables>;
export const CreateReconciliationRuleDocument = gql`
    mutation CreateReconciliationRule($input: ReconciliationRuleInput!) {
  createReconciliationRule(input: $input) {
    id
    name
    priority
  }
}
    `;
export type CreateReconciliationRuleMutationFn = Apollo.MutationFunction<CreateReconciliationRuleMutation, CreateReconciliationRuleMutationVariables>;
export function useCreateReconciliationRuleMutation(baseOptions?: Apollo.MutationHookOptions<CreateReconciliationRuleMutation, CreateReconciliationRuleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateReconciliationRuleMutation, CreateReconciliationRuleMutationVariables>(CreateReconciliationRuleDocument, options);
      }
export type CreateReconciliationRuleMutationHookResult = ReturnType<typeof useCreateReconciliationRuleMutation>;
export type CreateReconciliationRuleMutationResult = Apollo.MutationResult<CreateReconciliationRuleMutation>;
export type CreateReconciliationRuleMutationOptions = Apollo.BaseMutationOptions<CreateReconciliationRuleMutation, CreateReconciliationRuleMutationVariables>;
export const UpdateReconciliationRuleDocument = gql`
    mutation UpdateReconciliationRule($id: ID!, $input: ReconciliationRulePatch!) {
  updateReconciliationRule(id: $id, input: $input) {
    id
    name
    priority
    isActive
  }
}
    `;
export type UpdateReconciliationRuleMutationFn = Apollo.MutationFunction<UpdateReconciliationRuleMutation, UpdateReconciliationRuleMutationVariables>;
export function useUpdateReconciliationRuleMutation(baseOptions?: Apollo.MutationHookOptions<UpdateReconciliationRuleMutation, UpdateReconciliationRuleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateReconciliationRuleMutation, UpdateReconciliationRuleMutationVariables>(UpdateReconciliationRuleDocument, options);
      }
export type UpdateReconciliationRuleMutationHookResult = ReturnType<typeof useUpdateReconciliationRuleMutation>;
export type UpdateReconciliationRuleMutationResult = Apollo.MutationResult<UpdateReconciliationRuleMutation>;
export type UpdateReconciliationRuleMutationOptions = Apollo.BaseMutationOptions<UpdateReconciliationRuleMutation, UpdateReconciliationRuleMutationVariables>;
export const DeleteReconciliationRuleDocument = gql`
    mutation DeleteReconciliationRule($id: ID!) {
  deleteReconciliationRule(id: $id)
}
    `;
export type DeleteReconciliationRuleMutationFn = Apollo.MutationFunction<DeleteReconciliationRuleMutation, DeleteReconciliationRuleMutationVariables>;
export function useDeleteReconciliationRuleMutation(baseOptions?: Apollo.MutationHookOptions<DeleteReconciliationRuleMutation, DeleteReconciliationRuleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteReconciliationRuleMutation, DeleteReconciliationRuleMutationVariables>(DeleteReconciliationRuleDocument, options);
      }
export type DeleteReconciliationRuleMutationHookResult = ReturnType<typeof useDeleteReconciliationRuleMutation>;
export type DeleteReconciliationRuleMutationResult = Apollo.MutationResult<DeleteReconciliationRuleMutation>;
export type DeleteReconciliationRuleMutationOptions = Apollo.BaseMutationOptions<DeleteReconciliationRuleMutation, DeleteReconciliationRuleMutationVariables>;
export const TransferBankFundsDocument = gql`
    mutation TransferBankFunds($input: BankTransferInput!) {
  transferBankFunds(input: $input) {
    transferId
    fromCashBankId
    toCashBankId
    fromTransactionNumber
    toTransactionNumber
  }
}
    `;
export type TransferBankFundsMutationFn = Apollo.MutationFunction<TransferBankFundsMutation, TransferBankFundsMutationVariables>;
export function useTransferBankFundsMutation(baseOptions?: Apollo.MutationHookOptions<TransferBankFundsMutation, TransferBankFundsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<TransferBankFundsMutation, TransferBankFundsMutationVariables>(TransferBankFundsDocument, options);
      }
export type TransferBankFundsMutationHookResult = ReturnType<typeof useTransferBankFundsMutation>;
export type TransferBankFundsMutationResult = Apollo.MutationResult<TransferBankFundsMutation>;
export type TransferBankFundsMutationOptions = Apollo.BaseMutationOptions<TransferBankFundsMutation, TransferBankFundsMutationVariables>;
export const GetInventoryControlsDocument = gql`
    query GetInventoryControls($organizationId: String!, $warehouseId: String, $stockStatus: String) {
  inventoryControls(
    organizationId: $organizationId
    warehouseId: $warehouseId
    stockStatus: $stockStatus
  ) {
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
    `;
export function useGetInventoryControlsQuery(baseOptions: Apollo.QueryHookOptions<GetInventoryControlsQuery, GetInventoryControlsQueryVariables> & ({ variables: GetInventoryControlsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetInventoryControlsQuery, GetInventoryControlsQueryVariables>(GetInventoryControlsDocument, options);
      }
export function useGetInventoryControlsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetInventoryControlsQuery, GetInventoryControlsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetInventoryControlsQuery, GetInventoryControlsQueryVariables>(GetInventoryControlsDocument, options);
        }
// @ts-ignore
export function useGetInventoryControlsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetInventoryControlsQuery, GetInventoryControlsQueryVariables>): Apollo.UseSuspenseQueryResult<GetInventoryControlsQuery, GetInventoryControlsQueryVariables>;
export function useGetInventoryControlsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetInventoryControlsQuery, GetInventoryControlsQueryVariables>): Apollo.UseSuspenseQueryResult<GetInventoryControlsQuery | undefined, GetInventoryControlsQueryVariables>;
export function useGetInventoryControlsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetInventoryControlsQuery, GetInventoryControlsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetInventoryControlsQuery, GetInventoryControlsQueryVariables>(GetInventoryControlsDocument, options);
        }
export type GetInventoryControlsQueryHookResult = ReturnType<typeof useGetInventoryControlsQuery>;
export type GetInventoryControlsLazyQueryHookResult = ReturnType<typeof useGetInventoryControlsLazyQuery>;
export type GetInventoryControlsSuspenseQueryHookResult = ReturnType<typeof useGetInventoryControlsSuspenseQuery>;
export type GetInventoryControlsQueryResult = Apollo.QueryResult<GetInventoryControlsQuery, GetInventoryControlsQueryVariables>;
export const GetLowStockItemsDocument = gql`
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
    `;
export function useGetLowStockItemsQuery(baseOptions: Apollo.QueryHookOptions<GetLowStockItemsQuery, GetLowStockItemsQueryVariables> & ({ variables: GetLowStockItemsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetLowStockItemsQuery, GetLowStockItemsQueryVariables>(GetLowStockItemsDocument, options);
      }
export function useGetLowStockItemsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetLowStockItemsQuery, GetLowStockItemsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetLowStockItemsQuery, GetLowStockItemsQueryVariables>(GetLowStockItemsDocument, options);
        }
// @ts-ignore
export function useGetLowStockItemsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetLowStockItemsQuery, GetLowStockItemsQueryVariables>): Apollo.UseSuspenseQueryResult<GetLowStockItemsQuery, GetLowStockItemsQueryVariables>;
export function useGetLowStockItemsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetLowStockItemsQuery, GetLowStockItemsQueryVariables>): Apollo.UseSuspenseQueryResult<GetLowStockItemsQuery | undefined, GetLowStockItemsQueryVariables>;
export function useGetLowStockItemsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetLowStockItemsQuery, GetLowStockItemsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetLowStockItemsQuery, GetLowStockItemsQueryVariables>(GetLowStockItemsDocument, options);
        }
export type GetLowStockItemsQueryHookResult = ReturnType<typeof useGetLowStockItemsQuery>;
export type GetLowStockItemsLazyQueryHookResult = ReturnType<typeof useGetLowStockItemsLazyQuery>;
export type GetLowStockItemsSuspenseQueryHookResult = ReturnType<typeof useGetLowStockItemsSuspenseQuery>;
export type GetLowStockItemsQueryResult = Apollo.QueryResult<GetLowStockItemsQuery, GetLowStockItemsQueryVariables>;
export const CreateInventoryControlDocument = gql`
    mutation CreateInventoryControl($input: InventoryControlInput!) {
  createInventoryControl(input: $input) {
    id
    itemName
    quantity
  }
}
    `;
export type CreateInventoryControlMutationFn = Apollo.MutationFunction<CreateInventoryControlMutation, CreateInventoryControlMutationVariables>;
export function useCreateInventoryControlMutation(baseOptions?: Apollo.MutationHookOptions<CreateInventoryControlMutation, CreateInventoryControlMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateInventoryControlMutation, CreateInventoryControlMutationVariables>(CreateInventoryControlDocument, options);
      }
export type CreateInventoryControlMutationHookResult = ReturnType<typeof useCreateInventoryControlMutation>;
export type CreateInventoryControlMutationResult = Apollo.MutationResult<CreateInventoryControlMutation>;
export type CreateInventoryControlMutationOptions = Apollo.BaseMutationOptions<CreateInventoryControlMutation, CreateInventoryControlMutationVariables>;
export const UpdateInventoryControlDocument = gql`
    mutation UpdateInventoryControl($id: ID!, $input: InventoryControlInput!) {
  updateInventoryControl(id: $id, input: $input) {
    id
    itemName
    quantity
    stockStatus
    lastStockDate
  }
}
    `;
export type UpdateInventoryControlMutationFn = Apollo.MutationFunction<UpdateInventoryControlMutation, UpdateInventoryControlMutationVariables>;
export function useUpdateInventoryControlMutation(baseOptions?: Apollo.MutationHookOptions<UpdateInventoryControlMutation, UpdateInventoryControlMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateInventoryControlMutation, UpdateInventoryControlMutationVariables>(UpdateInventoryControlDocument, options);
      }
export type UpdateInventoryControlMutationHookResult = ReturnType<typeof useUpdateInventoryControlMutation>;
export type UpdateInventoryControlMutationResult = Apollo.MutationResult<UpdateInventoryControlMutation>;
export type UpdateInventoryControlMutationOptions = Apollo.BaseMutationOptions<UpdateInventoryControlMutation, UpdateInventoryControlMutationVariables>;
export const AdjustStockDocument = gql`
    mutation AdjustStock($itemId: String!, $binLocation: String!, $quantity: Float!, $reason: String!, $organizationId: String) {
  adjustStock(
    itemId: $itemId
    binLocation: $binLocation
    quantity: $quantity
    reason: $reason
    organizationId: $organizationId
  ) {
    id
    quantity
    stockStatus
  }
}
    `;
export type AdjustStockMutationFn = Apollo.MutationFunction<AdjustStockMutation, AdjustStockMutationVariables>;
export function useAdjustStockMutation(baseOptions?: Apollo.MutationHookOptions<AdjustStockMutation, AdjustStockMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AdjustStockMutation, AdjustStockMutationVariables>(AdjustStockDocument, options);
      }
export type AdjustStockMutationHookResult = ReturnType<typeof useAdjustStockMutation>;
export type AdjustStockMutationResult = Apollo.MutationResult<AdjustStockMutation>;
export type AdjustStockMutationOptions = Apollo.BaseMutationOptions<AdjustStockMutation, AdjustStockMutationVariables>;
export const GetStockMovementsDocument = gql`
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
    `;
export function useGetStockMovementsQuery(baseOptions: Apollo.QueryHookOptions<GetStockMovementsQuery, GetStockMovementsQueryVariables> & ({ variables: GetStockMovementsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetStockMovementsQuery, GetStockMovementsQueryVariables>(GetStockMovementsDocument, options);
      }
export function useGetStockMovementsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetStockMovementsQuery, GetStockMovementsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetStockMovementsQuery, GetStockMovementsQueryVariables>(GetStockMovementsDocument, options);
        }
// @ts-ignore
export function useGetStockMovementsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetStockMovementsQuery, GetStockMovementsQueryVariables>): Apollo.UseSuspenseQueryResult<GetStockMovementsQuery, GetStockMovementsQueryVariables>;
export function useGetStockMovementsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetStockMovementsQuery, GetStockMovementsQueryVariables>): Apollo.UseSuspenseQueryResult<GetStockMovementsQuery | undefined, GetStockMovementsQueryVariables>;
export function useGetStockMovementsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetStockMovementsQuery, GetStockMovementsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetStockMovementsQuery, GetStockMovementsQueryVariables>(GetStockMovementsDocument, options);
        }
export type GetStockMovementsQueryHookResult = ReturnType<typeof useGetStockMovementsQuery>;
export type GetStockMovementsLazyQueryHookResult = ReturnType<typeof useGetStockMovementsLazyQuery>;
export type GetStockMovementsSuspenseQueryHookResult = ReturnType<typeof useGetStockMovementsSuspenseQuery>;
export type GetStockMovementsQueryResult = Apollo.QueryResult<GetStockMovementsQuery, GetStockMovementsQueryVariables>;
export const GetWarehousesDocument = gql`
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
    `;
export function useGetWarehousesQuery(baseOptions: Apollo.QueryHookOptions<GetWarehousesQuery, GetWarehousesQueryVariables> & ({ variables: GetWarehousesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetWarehousesQuery, GetWarehousesQueryVariables>(GetWarehousesDocument, options);
      }
export function useGetWarehousesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetWarehousesQuery, GetWarehousesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetWarehousesQuery, GetWarehousesQueryVariables>(GetWarehousesDocument, options);
        }
// @ts-ignore
export function useGetWarehousesSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetWarehousesQuery, GetWarehousesQueryVariables>): Apollo.UseSuspenseQueryResult<GetWarehousesQuery, GetWarehousesQueryVariables>;
export function useGetWarehousesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetWarehousesQuery, GetWarehousesQueryVariables>): Apollo.UseSuspenseQueryResult<GetWarehousesQuery | undefined, GetWarehousesQueryVariables>;
export function useGetWarehousesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetWarehousesQuery, GetWarehousesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetWarehousesQuery, GetWarehousesQueryVariables>(GetWarehousesDocument, options);
        }
export type GetWarehousesQueryHookResult = ReturnType<typeof useGetWarehousesQuery>;
export type GetWarehousesLazyQueryHookResult = ReturnType<typeof useGetWarehousesLazyQuery>;
export type GetWarehousesSuspenseQueryHookResult = ReturnType<typeof useGetWarehousesSuspenseQuery>;
export type GetWarehousesQueryResult = Apollo.QueryResult<GetWarehousesQuery, GetWarehousesQueryVariables>;
export const GetWarehouseBinsDocument = gql`
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
    `;
export function useGetWarehouseBinsQuery(baseOptions: Apollo.QueryHookOptions<GetWarehouseBinsQuery, GetWarehouseBinsQueryVariables> & ({ variables: GetWarehouseBinsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetWarehouseBinsQuery, GetWarehouseBinsQueryVariables>(GetWarehouseBinsDocument, options);
      }
export function useGetWarehouseBinsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetWarehouseBinsQuery, GetWarehouseBinsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetWarehouseBinsQuery, GetWarehouseBinsQueryVariables>(GetWarehouseBinsDocument, options);
        }
// @ts-ignore
export function useGetWarehouseBinsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetWarehouseBinsQuery, GetWarehouseBinsQueryVariables>): Apollo.UseSuspenseQueryResult<GetWarehouseBinsQuery, GetWarehouseBinsQueryVariables>;
export function useGetWarehouseBinsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetWarehouseBinsQuery, GetWarehouseBinsQueryVariables>): Apollo.UseSuspenseQueryResult<GetWarehouseBinsQuery | undefined, GetWarehouseBinsQueryVariables>;
export function useGetWarehouseBinsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetWarehouseBinsQuery, GetWarehouseBinsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetWarehouseBinsQuery, GetWarehouseBinsQueryVariables>(GetWarehouseBinsDocument, options);
        }
export type GetWarehouseBinsQueryHookResult = ReturnType<typeof useGetWarehouseBinsQuery>;
export type GetWarehouseBinsLazyQueryHookResult = ReturnType<typeof useGetWarehouseBinsLazyQuery>;
export type GetWarehouseBinsSuspenseQueryHookResult = ReturnType<typeof useGetWarehouseBinsSuspenseQuery>;
export type GetWarehouseBinsQueryResult = Apollo.QueryResult<GetWarehouseBinsQuery, GetWarehouseBinsQueryVariables>;
export const CreateWarehouseDocument = gql`
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
    `;
export type CreateWarehouseMutationFn = Apollo.MutationFunction<CreateWarehouseMutation, CreateWarehouseMutationVariables>;
export function useCreateWarehouseMutation(baseOptions?: Apollo.MutationHookOptions<CreateWarehouseMutation, CreateWarehouseMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateWarehouseMutation, CreateWarehouseMutationVariables>(CreateWarehouseDocument, options);
      }
export type CreateWarehouseMutationHookResult = ReturnType<typeof useCreateWarehouseMutation>;
export type CreateWarehouseMutationResult = Apollo.MutationResult<CreateWarehouseMutation>;
export type CreateWarehouseMutationOptions = Apollo.BaseMutationOptions<CreateWarehouseMutation, CreateWarehouseMutationVariables>;
export const UpdateWarehouseDocument = gql`
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
    `;
export type UpdateWarehouseMutationFn = Apollo.MutationFunction<UpdateWarehouseMutation, UpdateWarehouseMutationVariables>;
export function useUpdateWarehouseMutation(baseOptions?: Apollo.MutationHookOptions<UpdateWarehouseMutation, UpdateWarehouseMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateWarehouseMutation, UpdateWarehouseMutationVariables>(UpdateWarehouseDocument, options);
      }
export type UpdateWarehouseMutationHookResult = ReturnType<typeof useUpdateWarehouseMutation>;
export type UpdateWarehouseMutationResult = Apollo.MutationResult<UpdateWarehouseMutation>;
export type UpdateWarehouseMutationOptions = Apollo.BaseMutationOptions<UpdateWarehouseMutation, UpdateWarehouseMutationVariables>;
export const CreateWarehouseBinDocument = gql`
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
    `;
export type CreateWarehouseBinMutationFn = Apollo.MutationFunction<CreateWarehouseBinMutation, CreateWarehouseBinMutationVariables>;
export function useCreateWarehouseBinMutation(baseOptions?: Apollo.MutationHookOptions<CreateWarehouseBinMutation, CreateWarehouseBinMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateWarehouseBinMutation, CreateWarehouseBinMutationVariables>(CreateWarehouseBinDocument, options);
      }
export type CreateWarehouseBinMutationHookResult = ReturnType<typeof useCreateWarehouseBinMutation>;
export type CreateWarehouseBinMutationResult = Apollo.MutationResult<CreateWarehouseBinMutation>;
export type CreateWarehouseBinMutationOptions = Apollo.BaseMutationOptions<CreateWarehouseBinMutation, CreateWarehouseBinMutationVariables>;
export const UpdateWarehouseBinDocument = gql`
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
    `;
export type UpdateWarehouseBinMutationFn = Apollo.MutationFunction<UpdateWarehouseBinMutation, UpdateWarehouseBinMutationVariables>;
export function useUpdateWarehouseBinMutation(baseOptions?: Apollo.MutationHookOptions<UpdateWarehouseBinMutation, UpdateWarehouseBinMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateWarehouseBinMutation, UpdateWarehouseBinMutationVariables>(UpdateWarehouseBinDocument, options);
      }
export type UpdateWarehouseBinMutationHookResult = ReturnType<typeof useUpdateWarehouseBinMutation>;
export type UpdateWarehouseBinMutationResult = Apollo.MutationResult<UpdateWarehouseBinMutation>;
export type UpdateWarehouseBinMutationOptions = Apollo.BaseMutationOptions<UpdateWarehouseBinMutation, UpdateWarehouseBinMutationVariables>;
export const GetCustomersDocument = gql`
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
    `;
export function useGetCustomersQuery(baseOptions: Apollo.QueryHookOptions<GetCustomersQuery, GetCustomersQueryVariables> & ({ variables: GetCustomersQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCustomersQuery, GetCustomersQueryVariables>(GetCustomersDocument, options);
      }
export function useGetCustomersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCustomersQuery, GetCustomersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCustomersQuery, GetCustomersQueryVariables>(GetCustomersDocument, options);
        }
// @ts-ignore
export function useGetCustomersSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetCustomersQuery, GetCustomersQueryVariables>): Apollo.UseSuspenseQueryResult<GetCustomersQuery, GetCustomersQueryVariables>;
export function useGetCustomersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCustomersQuery, GetCustomersQueryVariables>): Apollo.UseSuspenseQueryResult<GetCustomersQuery | undefined, GetCustomersQueryVariables>;
export function useGetCustomersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCustomersQuery, GetCustomersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCustomersQuery, GetCustomersQueryVariables>(GetCustomersDocument, options);
        }
export type GetCustomersQueryHookResult = ReturnType<typeof useGetCustomersQuery>;
export type GetCustomersLazyQueryHookResult = ReturnType<typeof useGetCustomersLazyQuery>;
export type GetCustomersSuspenseQueryHookResult = ReturnType<typeof useGetCustomersSuspenseQuery>;
export type GetCustomersQueryResult = Apollo.QueryResult<GetCustomersQuery, GetCustomersQueryVariables>;
export const CreateCustomerDocument = gql`
    mutation CreateCustomer($input: CreateCustomerInput!) {
  createCustomer(input: $input) {
    id
    docNumber
    name
    status
  }
}
    `;
export type CreateCustomerMutationFn = Apollo.MutationFunction<CreateCustomerMutation, CreateCustomerMutationVariables>;
export function useCreateCustomerMutation(baseOptions?: Apollo.MutationHookOptions<CreateCustomerMutation, CreateCustomerMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateCustomerMutation, CreateCustomerMutationVariables>(CreateCustomerDocument, options);
      }
export type CreateCustomerMutationHookResult = ReturnType<typeof useCreateCustomerMutation>;
export type CreateCustomerMutationResult = Apollo.MutationResult<CreateCustomerMutation>;
export type CreateCustomerMutationOptions = Apollo.BaseMutationOptions<CreateCustomerMutation, CreateCustomerMutationVariables>;
export const UpdateCustomerDocument = gql`
    mutation UpdateCustomer($id: ID!, $input: UpdateCustomerInput!) {
  updateCustomer(id: $id, input: $input) {
    id
    name
    status
    invoiceBillable
  }
}
    `;
export type UpdateCustomerMutationFn = Apollo.MutationFunction<UpdateCustomerMutation, UpdateCustomerMutationVariables>;
export function useUpdateCustomerMutation(baseOptions?: Apollo.MutationHookOptions<UpdateCustomerMutation, UpdateCustomerMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateCustomerMutation, UpdateCustomerMutationVariables>(UpdateCustomerDocument, options);
      }
export type UpdateCustomerMutationHookResult = ReturnType<typeof useUpdateCustomerMutation>;
export type UpdateCustomerMutationResult = Apollo.MutationResult<UpdateCustomerMutation>;
export type UpdateCustomerMutationOptions = Apollo.BaseMutationOptions<UpdateCustomerMutation, UpdateCustomerMutationVariables>;
export const DeleteCustomerDocument = gql`
    mutation DeleteCustomer($id: ID!) {
  deleteCustomer(id: $id)
}
    `;
export type DeleteCustomerMutationFn = Apollo.MutationFunction<DeleteCustomerMutation, DeleteCustomerMutationVariables>;
export function useDeleteCustomerMutation(baseOptions?: Apollo.MutationHookOptions<DeleteCustomerMutation, DeleteCustomerMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteCustomerMutation, DeleteCustomerMutationVariables>(DeleteCustomerDocument, options);
      }
export type DeleteCustomerMutationHookResult = ReturnType<typeof useDeleteCustomerMutation>;
export type DeleteCustomerMutationResult = Apollo.MutationResult<DeleteCustomerMutation>;
export type DeleteCustomerMutationOptions = Apollo.BaseMutationOptions<DeleteCustomerMutation, DeleteCustomerMutationVariables>;
export const GetReturnAuthorizationsDocument = gql`
    query GetReturnAuthorizations($organizationId: String!, $status: String, $customerId: ID, $receiptComplete: Boolean, $page: Int, $limit: Int) {
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
    `;
export function useGetReturnAuthorizationsQuery(baseOptions: Apollo.QueryHookOptions<GetReturnAuthorizationsQuery, GetReturnAuthorizationsQueryVariables> & ({ variables: GetReturnAuthorizationsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetReturnAuthorizationsQuery, GetReturnAuthorizationsQueryVariables>(GetReturnAuthorizationsDocument, options);
      }
export function useGetReturnAuthorizationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetReturnAuthorizationsQuery, GetReturnAuthorizationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetReturnAuthorizationsQuery, GetReturnAuthorizationsQueryVariables>(GetReturnAuthorizationsDocument, options);
        }
// @ts-ignore
export function useGetReturnAuthorizationsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetReturnAuthorizationsQuery, GetReturnAuthorizationsQueryVariables>): Apollo.UseSuspenseQueryResult<GetReturnAuthorizationsQuery, GetReturnAuthorizationsQueryVariables>;
export function useGetReturnAuthorizationsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetReturnAuthorizationsQuery, GetReturnAuthorizationsQueryVariables>): Apollo.UseSuspenseQueryResult<GetReturnAuthorizationsQuery | undefined, GetReturnAuthorizationsQueryVariables>;
export function useGetReturnAuthorizationsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetReturnAuthorizationsQuery, GetReturnAuthorizationsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetReturnAuthorizationsQuery, GetReturnAuthorizationsQueryVariables>(GetReturnAuthorizationsDocument, options);
        }
export type GetReturnAuthorizationsQueryHookResult = ReturnType<typeof useGetReturnAuthorizationsQuery>;
export type GetReturnAuthorizationsLazyQueryHookResult = ReturnType<typeof useGetReturnAuthorizationsLazyQuery>;
export type GetReturnAuthorizationsSuspenseQueryHookResult = ReturnType<typeof useGetReturnAuthorizationsSuspenseQuery>;
export type GetReturnAuthorizationsQueryResult = Apollo.QueryResult<GetReturnAuthorizationsQuery, GetReturnAuthorizationsQueryVariables>;
export const ApproveReturnAuthorizationDocument = gql`
    mutation ApproveReturnAuthorization($id: ID!) {
  approveReturnAuthorization(id: $id) {
    id
    raNumber
    status
  }
}
    `;
export type ApproveReturnAuthorizationMutationFn = Apollo.MutationFunction<ApproveReturnAuthorizationMutation, ApproveReturnAuthorizationMutationVariables>;
export function useApproveReturnAuthorizationMutation(baseOptions?: Apollo.MutationHookOptions<ApproveReturnAuthorizationMutation, ApproveReturnAuthorizationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ApproveReturnAuthorizationMutation, ApproveReturnAuthorizationMutationVariables>(ApproveReturnAuthorizationDocument, options);
      }
export type ApproveReturnAuthorizationMutationHookResult = ReturnType<typeof useApproveReturnAuthorizationMutation>;
export type ApproveReturnAuthorizationMutationResult = Apollo.MutationResult<ApproveReturnAuthorizationMutation>;
export type ApproveReturnAuthorizationMutationOptions = Apollo.BaseMutationOptions<ApproveReturnAuthorizationMutation, ApproveReturnAuthorizationMutationVariables>;
export const RejectReturnAuthorizationDocument = gql`
    mutation RejectReturnAuthorization($id: ID!, $reason: String) {
  rejectReturnAuthorization(id: $id, reason: $reason) {
    id
    raNumber
    status
  }
}
    `;
export type RejectReturnAuthorizationMutationFn = Apollo.MutationFunction<RejectReturnAuthorizationMutation, RejectReturnAuthorizationMutationVariables>;
export function useRejectReturnAuthorizationMutation(baseOptions?: Apollo.MutationHookOptions<RejectReturnAuthorizationMutation, RejectReturnAuthorizationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RejectReturnAuthorizationMutation, RejectReturnAuthorizationMutationVariables>(RejectReturnAuthorizationDocument, options);
      }
export type RejectReturnAuthorizationMutationHookResult = ReturnType<typeof useRejectReturnAuthorizationMutation>;
export type RejectReturnAuthorizationMutationResult = Apollo.MutationResult<RejectReturnAuthorizationMutation>;
export type RejectReturnAuthorizationMutationOptions = Apollo.BaseMutationOptions<RejectReturnAuthorizationMutation, RejectReturnAuthorizationMutationVariables>;
export const CancelReturnAuthorizationDocument = gql`
    mutation CancelReturnAuthorization($id: ID!) {
  cancelReturnAuthorization(id: $id) {
    id
    raNumber
    status
  }
}
    `;
export type CancelReturnAuthorizationMutationFn = Apollo.MutationFunction<CancelReturnAuthorizationMutation, CancelReturnAuthorizationMutationVariables>;
export function useCancelReturnAuthorizationMutation(baseOptions?: Apollo.MutationHookOptions<CancelReturnAuthorizationMutation, CancelReturnAuthorizationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CancelReturnAuthorizationMutation, CancelReturnAuthorizationMutationVariables>(CancelReturnAuthorizationDocument, options);
      }
export type CancelReturnAuthorizationMutationHookResult = ReturnType<typeof useCancelReturnAuthorizationMutation>;
export type CancelReturnAuthorizationMutationResult = Apollo.MutationResult<CancelReturnAuthorizationMutation>;
export type CancelReturnAuthorizationMutationOptions = Apollo.BaseMutationOptions<CancelReturnAuthorizationMutation, CancelReturnAuthorizationMutationVariables>;
export const CreateReturnAuthorizationDocument = gql`
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
    `;
export type CreateReturnAuthorizationMutationFn = Apollo.MutationFunction<CreateReturnAuthorizationMutation, CreateReturnAuthorizationMutationVariables>;
export function useCreateReturnAuthorizationMutation(baseOptions?: Apollo.MutationHookOptions<CreateReturnAuthorizationMutation, CreateReturnAuthorizationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateReturnAuthorizationMutation, CreateReturnAuthorizationMutationVariables>(CreateReturnAuthorizationDocument, options);
      }
export type CreateReturnAuthorizationMutationHookResult = ReturnType<typeof useCreateReturnAuthorizationMutation>;
export type CreateReturnAuthorizationMutationResult = Apollo.MutationResult<CreateReturnAuthorizationMutation>;
export type CreateReturnAuthorizationMutationOptions = Apollo.BaseMutationOptions<CreateReturnAuthorizationMutation, CreateReturnAuthorizationMutationVariables>;
export const ReceiveReturnAuthorizationGoodsDocument = gql`
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
    `;
export type ReceiveReturnAuthorizationGoodsMutationFn = Apollo.MutationFunction<ReceiveReturnAuthorizationGoodsMutation, ReceiveReturnAuthorizationGoodsMutationVariables>;
export function useReceiveReturnAuthorizationGoodsMutation(baseOptions?: Apollo.MutationHookOptions<ReceiveReturnAuthorizationGoodsMutation, ReceiveReturnAuthorizationGoodsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ReceiveReturnAuthorizationGoodsMutation, ReceiveReturnAuthorizationGoodsMutationVariables>(ReceiveReturnAuthorizationGoodsDocument, options);
      }
export type ReceiveReturnAuthorizationGoodsMutationHookResult = ReturnType<typeof useReceiveReturnAuthorizationGoodsMutation>;
export type ReceiveReturnAuthorizationGoodsMutationResult = Apollo.MutationResult<ReceiveReturnAuthorizationGoodsMutation>;
export type ReceiveReturnAuthorizationGoodsMutationOptions = Apollo.BaseMutationOptions<ReceiveReturnAuthorizationGoodsMutation, ReceiveReturnAuthorizationGoodsMutationVariables>;
export const GetCustomerRefundsDocument = gql`
    query GetCustomerRefunds($organizationId: ID!, $customerId: ID, $page: Int, $limit: Int) {
  customerRefunds(
    organizationId: $organizationId
    customerId: $customerId
    page: $page
    limit: $limit
  ) {
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
    `;
export function useGetCustomerRefundsQuery(baseOptions: Apollo.QueryHookOptions<GetCustomerRefundsQuery, GetCustomerRefundsQueryVariables> & ({ variables: GetCustomerRefundsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCustomerRefundsQuery, GetCustomerRefundsQueryVariables>(GetCustomerRefundsDocument, options);
      }
export function useGetCustomerRefundsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCustomerRefundsQuery, GetCustomerRefundsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCustomerRefundsQuery, GetCustomerRefundsQueryVariables>(GetCustomerRefundsDocument, options);
        }
// @ts-ignore
export function useGetCustomerRefundsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetCustomerRefundsQuery, GetCustomerRefundsQueryVariables>): Apollo.UseSuspenseQueryResult<GetCustomerRefundsQuery, GetCustomerRefundsQueryVariables>;
export function useGetCustomerRefundsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCustomerRefundsQuery, GetCustomerRefundsQueryVariables>): Apollo.UseSuspenseQueryResult<GetCustomerRefundsQuery | undefined, GetCustomerRefundsQueryVariables>;
export function useGetCustomerRefundsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCustomerRefundsQuery, GetCustomerRefundsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCustomerRefundsQuery, GetCustomerRefundsQueryVariables>(GetCustomerRefundsDocument, options);
        }
export type GetCustomerRefundsQueryHookResult = ReturnType<typeof useGetCustomerRefundsQuery>;
export type GetCustomerRefundsLazyQueryHookResult = ReturnType<typeof useGetCustomerRefundsLazyQuery>;
export type GetCustomerRefundsSuspenseQueryHookResult = ReturnType<typeof useGetCustomerRefundsSuspenseQuery>;
export type GetCustomerRefundsQueryResult = Apollo.QueryResult<GetCustomerRefundsQuery, GetCustomerRefundsQueryVariables>;
export const CreateCustomerRefundDocument = gql`
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
    `;
export type CreateCustomerRefundMutationFn = Apollo.MutationFunction<CreateCustomerRefundMutation, CreateCustomerRefundMutationVariables>;
export function useCreateCustomerRefundMutation(baseOptions?: Apollo.MutationHookOptions<CreateCustomerRefundMutation, CreateCustomerRefundMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateCustomerRefundMutation, CreateCustomerRefundMutationVariables>(CreateCustomerRefundDocument, options);
      }
export type CreateCustomerRefundMutationHookResult = ReturnType<typeof useCreateCustomerRefundMutation>;
export type CreateCustomerRefundMutationResult = Apollo.MutationResult<CreateCustomerRefundMutation>;
export type CreateCustomerRefundMutationOptions = Apollo.BaseMutationOptions<CreateCustomerRefundMutation, CreateCustomerRefundMutationVariables>;
export const CancelCustomerRefundDocument = gql`
    mutation CancelCustomerRefund($id: ID!) {
  cancelCustomerRefund(id: $id) {
    id
    refundNumber
    status
  }
}
    `;
export type CancelCustomerRefundMutationFn = Apollo.MutationFunction<CancelCustomerRefundMutation, CancelCustomerRefundMutationVariables>;
export function useCancelCustomerRefundMutation(baseOptions?: Apollo.MutationHookOptions<CancelCustomerRefundMutation, CancelCustomerRefundMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CancelCustomerRefundMutation, CancelCustomerRefundMutationVariables>(CancelCustomerRefundDocument, options);
      }
export type CancelCustomerRefundMutationHookResult = ReturnType<typeof useCancelCustomerRefundMutation>;
export type CancelCustomerRefundMutationResult = Apollo.MutationResult<CancelCustomerRefundMutation>;
export type CancelCustomerRefundMutationOptions = Apollo.BaseMutationOptions<CancelCustomerRefundMutation, CancelCustomerRefundMutationVariables>;
export const GetCustomerDepositsDocument = gql`
    query GetCustomerDeposits($organizationId: ID!, $customerId: ID, $page: Int, $limit: Int) {
  customerDeposits(
    organizationId: $organizationId
    customerId: $customerId
    page: $page
    limit: $limit
  ) {
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
    `;
export function useGetCustomerDepositsQuery(baseOptions: Apollo.QueryHookOptions<GetCustomerDepositsQuery, GetCustomerDepositsQueryVariables> & ({ variables: GetCustomerDepositsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCustomerDepositsQuery, GetCustomerDepositsQueryVariables>(GetCustomerDepositsDocument, options);
      }
export function useGetCustomerDepositsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCustomerDepositsQuery, GetCustomerDepositsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCustomerDepositsQuery, GetCustomerDepositsQueryVariables>(GetCustomerDepositsDocument, options);
        }
// @ts-ignore
export function useGetCustomerDepositsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetCustomerDepositsQuery, GetCustomerDepositsQueryVariables>): Apollo.UseSuspenseQueryResult<GetCustomerDepositsQuery, GetCustomerDepositsQueryVariables>;
export function useGetCustomerDepositsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCustomerDepositsQuery, GetCustomerDepositsQueryVariables>): Apollo.UseSuspenseQueryResult<GetCustomerDepositsQuery | undefined, GetCustomerDepositsQueryVariables>;
export function useGetCustomerDepositsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCustomerDepositsQuery, GetCustomerDepositsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCustomerDepositsQuery, GetCustomerDepositsQueryVariables>(GetCustomerDepositsDocument, options);
        }
export type GetCustomerDepositsQueryHookResult = ReturnType<typeof useGetCustomerDepositsQuery>;
export type GetCustomerDepositsLazyQueryHookResult = ReturnType<typeof useGetCustomerDepositsLazyQuery>;
export type GetCustomerDepositsSuspenseQueryHookResult = ReturnType<typeof useGetCustomerDepositsSuspenseQuery>;
export type GetCustomerDepositsQueryResult = Apollo.QueryResult<GetCustomerDepositsQuery, GetCustomerDepositsQueryVariables>;
export const CreateCustomerDepositDocument = gql`
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
    `;
export type CreateCustomerDepositMutationFn = Apollo.MutationFunction<CreateCustomerDepositMutation, CreateCustomerDepositMutationVariables>;
export function useCreateCustomerDepositMutation(baseOptions?: Apollo.MutationHookOptions<CreateCustomerDepositMutation, CreateCustomerDepositMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateCustomerDepositMutation, CreateCustomerDepositMutationVariables>(CreateCustomerDepositDocument, options);
      }
export type CreateCustomerDepositMutationHookResult = ReturnType<typeof useCreateCustomerDepositMutation>;
export type CreateCustomerDepositMutationResult = Apollo.MutationResult<CreateCustomerDepositMutation>;
export type CreateCustomerDepositMutationOptions = Apollo.BaseMutationOptions<CreateCustomerDepositMutation, CreateCustomerDepositMutationVariables>;
export const CancelCustomerDepositDocument = gql`
    mutation CancelCustomerDeposit($id: ID!) {
  cancelCustomerDeposit(id: $id) {
    id
    depositNumber
    status
  }
}
    `;
export type CancelCustomerDepositMutationFn = Apollo.MutationFunction<CancelCustomerDepositMutation, CancelCustomerDepositMutationVariables>;
export function useCancelCustomerDepositMutation(baseOptions?: Apollo.MutationHookOptions<CancelCustomerDepositMutation, CancelCustomerDepositMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CancelCustomerDepositMutation, CancelCustomerDepositMutationVariables>(CancelCustomerDepositDocument, options);
      }
export type CancelCustomerDepositMutationHookResult = ReturnType<typeof useCancelCustomerDepositMutation>;
export type CancelCustomerDepositMutationResult = Apollo.MutationResult<CancelCustomerDepositMutation>;
export type CancelCustomerDepositMutationOptions = Apollo.BaseMutationOptions<CancelCustomerDepositMutation, CancelCustomerDepositMutationVariables>;
export const GetFinanceChargeAssessmentsDocument = gql`
    query GetFinanceChargeAssessments($organizationId: String!, $status: String, $page: Int, $limit: Int) {
  financeChargeAssessments(
    organizationId: $organizationId
    status: $status
    page: $page
    limit: $limit
  ) {
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
    `;
export function useGetFinanceChargeAssessmentsQuery(baseOptions: Apollo.QueryHookOptions<GetFinanceChargeAssessmentsQuery, GetFinanceChargeAssessmentsQueryVariables> & ({ variables: GetFinanceChargeAssessmentsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetFinanceChargeAssessmentsQuery, GetFinanceChargeAssessmentsQueryVariables>(GetFinanceChargeAssessmentsDocument, options);
      }
export function useGetFinanceChargeAssessmentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFinanceChargeAssessmentsQuery, GetFinanceChargeAssessmentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetFinanceChargeAssessmentsQuery, GetFinanceChargeAssessmentsQueryVariables>(GetFinanceChargeAssessmentsDocument, options);
        }
// @ts-ignore
export function useGetFinanceChargeAssessmentsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetFinanceChargeAssessmentsQuery, GetFinanceChargeAssessmentsQueryVariables>): Apollo.UseSuspenseQueryResult<GetFinanceChargeAssessmentsQuery, GetFinanceChargeAssessmentsQueryVariables>;
export function useGetFinanceChargeAssessmentsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetFinanceChargeAssessmentsQuery, GetFinanceChargeAssessmentsQueryVariables>): Apollo.UseSuspenseQueryResult<GetFinanceChargeAssessmentsQuery | undefined, GetFinanceChargeAssessmentsQueryVariables>;
export function useGetFinanceChargeAssessmentsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetFinanceChargeAssessmentsQuery, GetFinanceChargeAssessmentsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetFinanceChargeAssessmentsQuery, GetFinanceChargeAssessmentsQueryVariables>(GetFinanceChargeAssessmentsDocument, options);
        }
export type GetFinanceChargeAssessmentsQueryHookResult = ReturnType<typeof useGetFinanceChargeAssessmentsQuery>;
export type GetFinanceChargeAssessmentsLazyQueryHookResult = ReturnType<typeof useGetFinanceChargeAssessmentsLazyQuery>;
export type GetFinanceChargeAssessmentsSuspenseQueryHookResult = ReturnType<typeof useGetFinanceChargeAssessmentsSuspenseQuery>;
export type GetFinanceChargeAssessmentsQueryResult = Apollo.QueryResult<GetFinanceChargeAssessmentsQuery, GetFinanceChargeAssessmentsQueryVariables>;
export const DraftFinanceChargeAssessmentDocument = gql`
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
    `;
export type DraftFinanceChargeAssessmentMutationFn = Apollo.MutationFunction<DraftFinanceChargeAssessmentMutation, DraftFinanceChargeAssessmentMutationVariables>;
export function useDraftFinanceChargeAssessmentMutation(baseOptions?: Apollo.MutationHookOptions<DraftFinanceChargeAssessmentMutation, DraftFinanceChargeAssessmentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DraftFinanceChargeAssessmentMutation, DraftFinanceChargeAssessmentMutationVariables>(DraftFinanceChargeAssessmentDocument, options);
      }
export type DraftFinanceChargeAssessmentMutationHookResult = ReturnType<typeof useDraftFinanceChargeAssessmentMutation>;
export type DraftFinanceChargeAssessmentMutationResult = Apollo.MutationResult<DraftFinanceChargeAssessmentMutation>;
export type DraftFinanceChargeAssessmentMutationOptions = Apollo.BaseMutationOptions<DraftFinanceChargeAssessmentMutation, DraftFinanceChargeAssessmentMutationVariables>;
export const PostFinanceChargeAssessmentDocument = gql`
    mutation PostFinanceChargeAssessment($id: ID!) {
  postFinanceChargeAssessment(id: $id) {
    id
    assessmentNumber
    status
    postedAt
    totalChargeAmount
  }
}
    `;
export type PostFinanceChargeAssessmentMutationFn = Apollo.MutationFunction<PostFinanceChargeAssessmentMutation, PostFinanceChargeAssessmentMutationVariables>;
export function usePostFinanceChargeAssessmentMutation(baseOptions?: Apollo.MutationHookOptions<PostFinanceChargeAssessmentMutation, PostFinanceChargeAssessmentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PostFinanceChargeAssessmentMutation, PostFinanceChargeAssessmentMutationVariables>(PostFinanceChargeAssessmentDocument, options);
      }
export type PostFinanceChargeAssessmentMutationHookResult = ReturnType<typeof usePostFinanceChargeAssessmentMutation>;
export type PostFinanceChargeAssessmentMutationResult = Apollo.MutationResult<PostFinanceChargeAssessmentMutation>;
export type PostFinanceChargeAssessmentMutationOptions = Apollo.BaseMutationOptions<PostFinanceChargeAssessmentMutation, PostFinanceChargeAssessmentMutationVariables>;
export const CancelFinanceChargeAssessmentDocument = gql`
    mutation CancelFinanceChargeAssessment($id: ID!) {
  cancelFinanceChargeAssessment(id: $id) {
    id
    status
  }
}
    `;
export type CancelFinanceChargeAssessmentMutationFn = Apollo.MutationFunction<CancelFinanceChargeAssessmentMutation, CancelFinanceChargeAssessmentMutationVariables>;
export function useCancelFinanceChargeAssessmentMutation(baseOptions?: Apollo.MutationHookOptions<CancelFinanceChargeAssessmentMutation, CancelFinanceChargeAssessmentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CancelFinanceChargeAssessmentMutation, CancelFinanceChargeAssessmentMutationVariables>(CancelFinanceChargeAssessmentDocument, options);
      }
export type CancelFinanceChargeAssessmentMutationHookResult = ReturnType<typeof useCancelFinanceChargeAssessmentMutation>;
export type CancelFinanceChargeAssessmentMutationResult = Apollo.MutationResult<CancelFinanceChargeAssessmentMutation>;
export type CancelFinanceChargeAssessmentMutationOptions = Apollo.BaseMutationOptions<CancelFinanceChargeAssessmentMutation, CancelFinanceChargeAssessmentMutationVariables>;
export const GetPriceListsDocument = gql`
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
    `;
export function useGetPriceListsQuery(baseOptions: Apollo.QueryHookOptions<GetPriceListsQuery, GetPriceListsQueryVariables> & ({ variables: GetPriceListsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPriceListsQuery, GetPriceListsQueryVariables>(GetPriceListsDocument, options);
      }
export function useGetPriceListsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPriceListsQuery, GetPriceListsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPriceListsQuery, GetPriceListsQueryVariables>(GetPriceListsDocument, options);
        }
// @ts-ignore
export function useGetPriceListsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetPriceListsQuery, GetPriceListsQueryVariables>): Apollo.UseSuspenseQueryResult<GetPriceListsQuery, GetPriceListsQueryVariables>;
export function useGetPriceListsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPriceListsQuery, GetPriceListsQueryVariables>): Apollo.UseSuspenseQueryResult<GetPriceListsQuery | undefined, GetPriceListsQueryVariables>;
export function useGetPriceListsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPriceListsQuery, GetPriceListsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPriceListsQuery, GetPriceListsQueryVariables>(GetPriceListsDocument, options);
        }
export type GetPriceListsQueryHookResult = ReturnType<typeof useGetPriceListsQuery>;
export type GetPriceListsLazyQueryHookResult = ReturnType<typeof useGetPriceListsLazyQuery>;
export type GetPriceListsSuspenseQueryHookResult = ReturnType<typeof useGetPriceListsSuspenseQuery>;
export type GetPriceListsQueryResult = Apollo.QueryResult<GetPriceListsQuery, GetPriceListsQueryVariables>;
export const GeneratePriceListDocument = gql`
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
    `;
export type GeneratePriceListMutationFn = Apollo.MutationFunction<GeneratePriceListMutation, GeneratePriceListMutationVariables>;
export function useGeneratePriceListMutation(baseOptions?: Apollo.MutationHookOptions<GeneratePriceListMutation, GeneratePriceListMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<GeneratePriceListMutation, GeneratePriceListMutationVariables>(GeneratePriceListDocument, options);
      }
export type GeneratePriceListMutationHookResult = ReturnType<typeof useGeneratePriceListMutation>;
export type GeneratePriceListMutationResult = Apollo.MutationResult<GeneratePriceListMutation>;
export type GeneratePriceListMutationOptions = Apollo.BaseMutationOptions<GeneratePriceListMutation, GeneratePriceListMutationVariables>;
export const GetIndividualPriceListByCustomerDocument = gql`
    query GetIndividualPriceListByCustomer($organizationId: String!, $customerId: ID!) {
  individualPriceListByCustomer(
    organizationId: $organizationId
    customerId: $customerId
  ) {
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
    `;
export function useGetIndividualPriceListByCustomerQuery(baseOptions: Apollo.QueryHookOptions<GetIndividualPriceListByCustomerQuery, GetIndividualPriceListByCustomerQueryVariables> & ({ variables: GetIndividualPriceListByCustomerQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetIndividualPriceListByCustomerQuery, GetIndividualPriceListByCustomerQueryVariables>(GetIndividualPriceListByCustomerDocument, options);
      }
export function useGetIndividualPriceListByCustomerLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetIndividualPriceListByCustomerQuery, GetIndividualPriceListByCustomerQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetIndividualPriceListByCustomerQuery, GetIndividualPriceListByCustomerQueryVariables>(GetIndividualPriceListByCustomerDocument, options);
        }
// @ts-ignore
export function useGetIndividualPriceListByCustomerSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetIndividualPriceListByCustomerQuery, GetIndividualPriceListByCustomerQueryVariables>): Apollo.UseSuspenseQueryResult<GetIndividualPriceListByCustomerQuery, GetIndividualPriceListByCustomerQueryVariables>;
export function useGetIndividualPriceListByCustomerSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetIndividualPriceListByCustomerQuery, GetIndividualPriceListByCustomerQueryVariables>): Apollo.UseSuspenseQueryResult<GetIndividualPriceListByCustomerQuery | undefined, GetIndividualPriceListByCustomerQueryVariables>;
export function useGetIndividualPriceListByCustomerSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetIndividualPriceListByCustomerQuery, GetIndividualPriceListByCustomerQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetIndividualPriceListByCustomerQuery, GetIndividualPriceListByCustomerQueryVariables>(GetIndividualPriceListByCustomerDocument, options);
        }
export type GetIndividualPriceListByCustomerQueryHookResult = ReturnType<typeof useGetIndividualPriceListByCustomerQuery>;
export type GetIndividualPriceListByCustomerLazyQueryHookResult = ReturnType<typeof useGetIndividualPriceListByCustomerLazyQuery>;
export type GetIndividualPriceListByCustomerSuspenseQueryHookResult = ReturnType<typeof useGetIndividualPriceListByCustomerSuspenseQuery>;
export type GetIndividualPriceListByCustomerQueryResult = Apollo.QueryResult<GetIndividualPriceListByCustomerQuery, GetIndividualPriceListByCustomerQueryVariables>;
export const UpsertIndividualPriceListDocument = gql`
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
    `;
export type UpsertIndividualPriceListMutationFn = Apollo.MutationFunction<UpsertIndividualPriceListMutation, UpsertIndividualPriceListMutationVariables>;
export function useUpsertIndividualPriceListMutation(baseOptions?: Apollo.MutationHookOptions<UpsertIndividualPriceListMutation, UpsertIndividualPriceListMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpsertIndividualPriceListMutation, UpsertIndividualPriceListMutationVariables>(UpsertIndividualPriceListDocument, options);
      }
export type UpsertIndividualPriceListMutationHookResult = ReturnType<typeof useUpsertIndividualPriceListMutation>;
export type UpsertIndividualPriceListMutationResult = Apollo.MutationResult<UpsertIndividualPriceListMutation>;
export type UpsertIndividualPriceListMutationOptions = Apollo.BaseMutationOptions<UpsertIndividualPriceListMutation, UpsertIndividualPriceListMutationVariables>;
export const SeedIndividualPriceListFromCatalogDocument = gql`
    mutation SeedIndividualPriceListFromCatalog($organizationId: String!, $customerId: ID!) {
  seedIndividualPriceListFromCatalog(
    organizationId: $organizationId
    customerId: $customerId
  ) {
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
    `;
export type SeedIndividualPriceListFromCatalogMutationFn = Apollo.MutationFunction<SeedIndividualPriceListFromCatalogMutation, SeedIndividualPriceListFromCatalogMutationVariables>;
export function useSeedIndividualPriceListFromCatalogMutation(baseOptions?: Apollo.MutationHookOptions<SeedIndividualPriceListFromCatalogMutation, SeedIndividualPriceListFromCatalogMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SeedIndividualPriceListFromCatalogMutation, SeedIndividualPriceListFromCatalogMutationVariables>(SeedIndividualPriceListFromCatalogDocument, options);
      }
export type SeedIndividualPriceListFromCatalogMutationHookResult = ReturnType<typeof useSeedIndividualPriceListFromCatalogMutation>;
export type SeedIndividualPriceListFromCatalogMutationResult = Apollo.MutationResult<SeedIndividualPriceListFromCatalogMutation>;
export type SeedIndividualPriceListFromCatalogMutationOptions = Apollo.BaseMutationOptions<SeedIndividualPriceListFromCatalogMutation, SeedIndividualPriceListFromCatalogMutationVariables>;
export const GenerateCustomerStatementDocument = gql`
    query GenerateCustomerStatement($organizationId: String!, $customerId: ID!, $dateFrom: String!, $dateTo: String!) {
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
    `;
export function useGenerateCustomerStatementQuery(baseOptions: Apollo.QueryHookOptions<GenerateCustomerStatementQuery, GenerateCustomerStatementQueryVariables> & ({ variables: GenerateCustomerStatementQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GenerateCustomerStatementQuery, GenerateCustomerStatementQueryVariables>(GenerateCustomerStatementDocument, options);
      }
export function useGenerateCustomerStatementLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GenerateCustomerStatementQuery, GenerateCustomerStatementQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GenerateCustomerStatementQuery, GenerateCustomerStatementQueryVariables>(GenerateCustomerStatementDocument, options);
        }
// @ts-ignore
export function useGenerateCustomerStatementSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GenerateCustomerStatementQuery, GenerateCustomerStatementQueryVariables>): Apollo.UseSuspenseQueryResult<GenerateCustomerStatementQuery, GenerateCustomerStatementQueryVariables>;
export function useGenerateCustomerStatementSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GenerateCustomerStatementQuery, GenerateCustomerStatementQueryVariables>): Apollo.UseSuspenseQueryResult<GenerateCustomerStatementQuery | undefined, GenerateCustomerStatementQueryVariables>;
export function useGenerateCustomerStatementSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GenerateCustomerStatementQuery, GenerateCustomerStatementQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GenerateCustomerStatementQuery, GenerateCustomerStatementQueryVariables>(GenerateCustomerStatementDocument, options);
        }
export type GenerateCustomerStatementQueryHookResult = ReturnType<typeof useGenerateCustomerStatementQuery>;
export type GenerateCustomerStatementLazyQueryHookResult = ReturnType<typeof useGenerateCustomerStatementLazyQuery>;
export type GenerateCustomerStatementSuspenseQueryHookResult = ReturnType<typeof useGenerateCustomerStatementSuspenseQuery>;
export type GenerateCustomerStatementQueryResult = Apollo.QueryResult<GenerateCustomerStatementQuery, GenerateCustomerStatementQueryVariables>;
export const GetProductionPlanningsDocument = gql`
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
    `;
export function useGetProductionPlanningsQuery(baseOptions: Apollo.QueryHookOptions<GetProductionPlanningsQuery, GetProductionPlanningsQueryVariables> & ({ variables: GetProductionPlanningsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetProductionPlanningsQuery, GetProductionPlanningsQueryVariables>(GetProductionPlanningsDocument, options);
      }
export function useGetProductionPlanningsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetProductionPlanningsQuery, GetProductionPlanningsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetProductionPlanningsQuery, GetProductionPlanningsQueryVariables>(GetProductionPlanningsDocument, options);
        }
// @ts-ignore
export function useGetProductionPlanningsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetProductionPlanningsQuery, GetProductionPlanningsQueryVariables>): Apollo.UseSuspenseQueryResult<GetProductionPlanningsQuery, GetProductionPlanningsQueryVariables>;
export function useGetProductionPlanningsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetProductionPlanningsQuery, GetProductionPlanningsQueryVariables>): Apollo.UseSuspenseQueryResult<GetProductionPlanningsQuery | undefined, GetProductionPlanningsQueryVariables>;
export function useGetProductionPlanningsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetProductionPlanningsQuery, GetProductionPlanningsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetProductionPlanningsQuery, GetProductionPlanningsQueryVariables>(GetProductionPlanningsDocument, options);
        }
export type GetProductionPlanningsQueryHookResult = ReturnType<typeof useGetProductionPlanningsQuery>;
export type GetProductionPlanningsLazyQueryHookResult = ReturnType<typeof useGetProductionPlanningsLazyQuery>;
export type GetProductionPlanningsSuspenseQueryHookResult = ReturnType<typeof useGetProductionPlanningsSuspenseQuery>;
export type GetProductionPlanningsQueryResult = Apollo.QueryResult<GetProductionPlanningsQuery, GetProductionPlanningsQueryVariables>;
export const CreateProductionPlanningDocument = gql`
    mutation CreateProductionPlanning($input: ProductionPlanningInput!) {
  createProductionPlanning(input: $input) {
    id
    docNumber
  }
}
    `;
export type CreateProductionPlanningMutationFn = Apollo.MutationFunction<CreateProductionPlanningMutation, CreateProductionPlanningMutationVariables>;
export function useCreateProductionPlanningMutation(baseOptions?: Apollo.MutationHookOptions<CreateProductionPlanningMutation, CreateProductionPlanningMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateProductionPlanningMutation, CreateProductionPlanningMutationVariables>(CreateProductionPlanningDocument, options);
      }
export type CreateProductionPlanningMutationHookResult = ReturnType<typeof useCreateProductionPlanningMutation>;
export type CreateProductionPlanningMutationResult = Apollo.MutationResult<CreateProductionPlanningMutation>;
export type CreateProductionPlanningMutationOptions = Apollo.BaseMutationOptions<CreateProductionPlanningMutation, CreateProductionPlanningMutationVariables>;
export const UpdateProductionPlanningDocument = gql`
    mutation UpdateProductionPlanning($id: ID!, $input: ProductionPlanningInput!) {
  updateProductionPlanning(id: $id, input: $input) {
    id
    docNumber
  }
}
    `;
export type UpdateProductionPlanningMutationFn = Apollo.MutationFunction<UpdateProductionPlanningMutation, UpdateProductionPlanningMutationVariables>;
export function useUpdateProductionPlanningMutation(baseOptions?: Apollo.MutationHookOptions<UpdateProductionPlanningMutation, UpdateProductionPlanningMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateProductionPlanningMutation, UpdateProductionPlanningMutationVariables>(UpdateProductionPlanningDocument, options);
      }
export type UpdateProductionPlanningMutationHookResult = ReturnType<typeof useUpdateProductionPlanningMutation>;
export type UpdateProductionPlanningMutationResult = Apollo.MutationResult<UpdateProductionPlanningMutation>;
export type UpdateProductionPlanningMutationOptions = Apollo.BaseMutationOptions<UpdateProductionPlanningMutation, UpdateProductionPlanningMutationVariables>;
export const DeleteProductionPlanningDocument = gql`
    mutation DeleteProductionPlanning($id: ID!) {
  deleteProductionPlanning(id: $id)
}
    `;
export type DeleteProductionPlanningMutationFn = Apollo.MutationFunction<DeleteProductionPlanningMutation, DeleteProductionPlanningMutationVariables>;
export function useDeleteProductionPlanningMutation(baseOptions?: Apollo.MutationHookOptions<DeleteProductionPlanningMutation, DeleteProductionPlanningMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteProductionPlanningMutation, DeleteProductionPlanningMutationVariables>(DeleteProductionPlanningDocument, options);
      }
export type DeleteProductionPlanningMutationHookResult = ReturnType<typeof useDeleteProductionPlanningMutation>;
export type DeleteProductionPlanningMutationResult = Apollo.MutationResult<DeleteProductionPlanningMutation>;
export type DeleteProductionPlanningMutationOptions = Apollo.BaseMutationOptions<DeleteProductionPlanningMutation, DeleteProductionPlanningMutationVariables>;
export const GetWorkOrdersDocument = gql`
    query GetWorkOrders($organizationId: String!) {
  workorders(organizationId: $organizationId) {
    id
    docNumber
    docDate
    status
    createdAt
  }
}
    `;
export function useGetWorkOrdersQuery(baseOptions: Apollo.QueryHookOptions<GetWorkOrdersQuery, GetWorkOrdersQueryVariables> & ({ variables: GetWorkOrdersQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetWorkOrdersQuery, GetWorkOrdersQueryVariables>(GetWorkOrdersDocument, options);
      }
export function useGetWorkOrdersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetWorkOrdersQuery, GetWorkOrdersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetWorkOrdersQuery, GetWorkOrdersQueryVariables>(GetWorkOrdersDocument, options);
        }
// @ts-ignore
export function useGetWorkOrdersSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetWorkOrdersQuery, GetWorkOrdersQueryVariables>): Apollo.UseSuspenseQueryResult<GetWorkOrdersQuery, GetWorkOrdersQueryVariables>;
export function useGetWorkOrdersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetWorkOrdersQuery, GetWorkOrdersQueryVariables>): Apollo.UseSuspenseQueryResult<GetWorkOrdersQuery | undefined, GetWorkOrdersQueryVariables>;
export function useGetWorkOrdersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetWorkOrdersQuery, GetWorkOrdersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetWorkOrdersQuery, GetWorkOrdersQueryVariables>(GetWorkOrdersDocument, options);
        }
export type GetWorkOrdersQueryHookResult = ReturnType<typeof useGetWorkOrdersQuery>;
export type GetWorkOrdersLazyQueryHookResult = ReturnType<typeof useGetWorkOrdersLazyQuery>;
export type GetWorkOrdersSuspenseQueryHookResult = ReturnType<typeof useGetWorkOrdersSuspenseQuery>;
export type GetWorkOrdersQueryResult = Apollo.QueryResult<GetWorkOrdersQuery, GetWorkOrdersQueryVariables>;
export const CreateWorkOrderDocument = gql`
    mutation CreateWorkOrder($input: WorkOrderInput!) {
  createWorkOrder(input: $input) {
    id
    docNumber
  }
}
    `;
export type CreateWorkOrderMutationFn = Apollo.MutationFunction<CreateWorkOrderMutation, CreateWorkOrderMutationVariables>;
export function useCreateWorkOrderMutation(baseOptions?: Apollo.MutationHookOptions<CreateWorkOrderMutation, CreateWorkOrderMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateWorkOrderMutation, CreateWorkOrderMutationVariables>(CreateWorkOrderDocument, options);
      }
export type CreateWorkOrderMutationHookResult = ReturnType<typeof useCreateWorkOrderMutation>;
export type CreateWorkOrderMutationResult = Apollo.MutationResult<CreateWorkOrderMutation>;
export type CreateWorkOrderMutationOptions = Apollo.BaseMutationOptions<CreateWorkOrderMutation, CreateWorkOrderMutationVariables>;
export const GetVendorPaymentsDocument = gql`
    query GetVendorPayments($organizationId: ID!, $vendorId: ID, $page: Int, $limit: Int) {
  vendorPayments(
    organizationId: $organizationId
    vendorId: $vendorId
    page: $page
    limit: $limit
  ) {
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
    `;
export function useGetVendorPaymentsQuery(baseOptions: Apollo.QueryHookOptions<GetVendorPaymentsQuery, GetVendorPaymentsQueryVariables> & ({ variables: GetVendorPaymentsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetVendorPaymentsQuery, GetVendorPaymentsQueryVariables>(GetVendorPaymentsDocument, options);
      }
export function useGetVendorPaymentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetVendorPaymentsQuery, GetVendorPaymentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetVendorPaymentsQuery, GetVendorPaymentsQueryVariables>(GetVendorPaymentsDocument, options);
        }
// @ts-ignore
export function useGetVendorPaymentsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetVendorPaymentsQuery, GetVendorPaymentsQueryVariables>): Apollo.UseSuspenseQueryResult<GetVendorPaymentsQuery, GetVendorPaymentsQueryVariables>;
export function useGetVendorPaymentsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetVendorPaymentsQuery, GetVendorPaymentsQueryVariables>): Apollo.UseSuspenseQueryResult<GetVendorPaymentsQuery | undefined, GetVendorPaymentsQueryVariables>;
export function useGetVendorPaymentsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetVendorPaymentsQuery, GetVendorPaymentsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetVendorPaymentsQuery, GetVendorPaymentsQueryVariables>(GetVendorPaymentsDocument, options);
        }
export type GetVendorPaymentsQueryHookResult = ReturnType<typeof useGetVendorPaymentsQuery>;
export type GetVendorPaymentsLazyQueryHookResult = ReturnType<typeof useGetVendorPaymentsLazyQuery>;
export type GetVendorPaymentsSuspenseQueryHookResult = ReturnType<typeof useGetVendorPaymentsSuspenseQuery>;
export type GetVendorPaymentsQueryResult = Apollo.QueryResult<GetVendorPaymentsQuery, GetVendorPaymentsQueryVariables>;
export const GetVendorPaymentDocument = gql`
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
    `;
export function useGetVendorPaymentQuery(baseOptions: Apollo.QueryHookOptions<GetVendorPaymentQuery, GetVendorPaymentQueryVariables> & ({ variables: GetVendorPaymentQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetVendorPaymentQuery, GetVendorPaymentQueryVariables>(GetVendorPaymentDocument, options);
      }
export function useGetVendorPaymentLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetVendorPaymentQuery, GetVendorPaymentQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetVendorPaymentQuery, GetVendorPaymentQueryVariables>(GetVendorPaymentDocument, options);
        }
// @ts-ignore
export function useGetVendorPaymentSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetVendorPaymentQuery, GetVendorPaymentQueryVariables>): Apollo.UseSuspenseQueryResult<GetVendorPaymentQuery, GetVendorPaymentQueryVariables>;
export function useGetVendorPaymentSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetVendorPaymentQuery, GetVendorPaymentQueryVariables>): Apollo.UseSuspenseQueryResult<GetVendorPaymentQuery | undefined, GetVendorPaymentQueryVariables>;
export function useGetVendorPaymentSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetVendorPaymentQuery, GetVendorPaymentQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetVendorPaymentQuery, GetVendorPaymentQueryVariables>(GetVendorPaymentDocument, options);
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