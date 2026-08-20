import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
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

export type AgedPayableBillLine = {
  __typename?: 'AgedPayableBillLine';
  billDate: Scalars['String']['output'];
  billId: Scalars['ID']['output'];
  billNumber: Scalars['String']['output'];
  daysOverdue: Scalars['Int']['output'];
  dueDate: Scalars['String']['output'];
  outstandingAmount: Scalars['Float']['output'];
  status: Scalars['String']['output'];
  totalAmount: Scalars['Float']['output'];
};

export type AgedPayableRow = {
  __typename?: 'AgedPayableRow';
  bills: Array<AgedPayableBillLine>;
  /** Not yet due */
  current: Scalars['Float']['output'];
  /** 1–30 days overdue */
  days30: Scalars['Float']['output'];
  /** 31–60 days overdue */
  days60: Scalars['Float']['output'];
  /** 61–90 days overdue */
  days90: Scalars['Float']['output'];
  /** Over 90 days overdue */
  over90: Scalars['Float']['output'];
  total: Scalars['Float']['output'];
  vendorId: Scalars['ID']['output'];
  vendorName: Scalars['String']['output'];
};

export type AgedReceivableInvoiceLine = {
  __typename?: 'AgedReceivableInvoiceLine';
  daysOverdue: Scalars['Int']['output'];
  dueDate: Scalars['String']['output'];
  invoiceDate: Scalars['String']['output'];
  invoiceId: Scalars['ID']['output'];
  invoiceNumber: Scalars['String']['output'];
  outstandingAmount: Scalars['Float']['output'];
  status: Scalars['String']['output'];
  totalAmount: Scalars['Float']['output'];
};

export type AgedReceivableRow = {
  __typename?: 'AgedReceivableRow';
  current: Scalars['Float']['output'];
  customerId: Scalars['ID']['output'];
  customerName: Scalars['String']['output'];
  days30: Scalars['Float']['output'];
  days60: Scalars['Float']['output'];
  days90: Scalars['Float']['output'];
  invoices: Array<AgedReceivableInvoiceLine>;
  over90: Scalars['Float']['output'];
  total: Scalars['Float']['output'];
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

export type Appraisal = {
  __typename?: 'Appraisal';
  createdAt: Scalars['String']['output'];
  cycle: Scalars['String']['output'];
  employeeId: Scalars['String']['output'];
  finalizedAt?: Maybe<Scalars['String']['output']>;
  goals: Array<AppraisalGoal>;
  id: Scalars['ID']['output'];
  managerReview?: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['String']['output'];
  overallRating?: Maybe<Scalars['Float']['output']>;
  periodEnd: Scalars['String']['output'];
  periodStart: Scalars['String']['output'];
  recommendedHikePercent?: Maybe<Scalars['Float']['output']>;
  reviewerId?: Maybe<Scalars['String']['output']>;
  selfReview?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
};

export type AppraisalGoal = {
  __typename?: 'AppraisalGoal';
  comments?: Maybe<Scalars['String']['output']>;
  managerRating?: Maybe<Scalars['Float']['output']>;
  selfRating?: Maybe<Scalars['Float']['output']>;
  title: Scalars['String']['output'];
  weight: Scalars['Float']['output'];
};

export type AppraisalGoalInput = {
  comments?: InputMaybe<Scalars['String']['input']>;
  managerRating?: InputMaybe<Scalars['Float']['input']>;
  selfRating?: InputMaybe<Scalars['Float']['input']>;
  title: Scalars['String']['input'];
  weight?: InputMaybe<Scalars['Float']['input']>;
};

export type AppraisalInput = {
  cycle: Scalars['String']['input'];
  employeeId: Scalars['String']['input'];
  goals?: InputMaybe<Array<AppraisalGoalInput>>;
  managerReview?: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['String']['input'];
  overallRating?: InputMaybe<Scalars['Float']['input']>;
  periodEnd: Scalars['String']['input'];
  periodStart: Scalars['String']['input'];
  recommendedHikePercent?: InputMaybe<Scalars['Float']['input']>;
  reviewerId?: InputMaybe<Scalars['String']['input']>;
  selfReview?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
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

/** Reusable product attribute (e.g. Make, Model, Size) with a reusable list of values. */
export type Attribute = {
  __typename?: 'Attribute';
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  organizationId: Scalars['ID']['output'];
  updatedAt: Scalars['String']['output'];
  values: Array<AttributeValue>;
};

export type AttributeValue = {
  __typename?: 'AttributeValue';
  id: Scalars['ID']['output'];
  value: Scalars['String']['output'];
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
  user?: Maybe<User>;
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

export type BalanceSheetReport = {
  __typename?: 'BalanceSheetReport';
  assetLines: Array<FinancialStatementLine>;
  balanced: Scalars['Boolean']['output'];
  equityLines: Array<FinancialStatementLine>;
  liabilityLines: Array<FinancialStatementLine>;
  totalAssets: Scalars['Float']['output'];
  totalEquity: Scalars['Float']['output'];
  totalLiabilities: Scalars['Float']['output'];
  totalLiabilitiesAndEquity: Scalars['Float']['output'];
};

/** Master bank record (the bank itself — not a specific account). */
export type Bank = {
  __typename?: 'Bank';
  address?: Maybe<Scalars['String']['output']>;
  bankIdentifierCode?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  email?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  organizationId: Scalars['ID']['output'];
  phone?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['String']['output'];
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

export type BlanketOrder = {
  __typename?: 'BlanketOrder';
  agreementType: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  currency: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lines: Array<BlanketOrderLine>;
  notes?: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['ID']['output'];
  seqNo?: Maybe<Scalars['String']['output']>;
  /** draft | open | closed | cancelled */
  status: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
  validityEnd?: Maybe<Scalars['String']['output']>;
  validityStart?: Maybe<Scalars['String']['output']>;
  vendorId: Scalars['ID']['output'];
  vendorName?: Maybe<Scalars['String']['output']>;
};

export type BlanketOrderLine = {
  __typename?: 'BlanketOrderLine';
  id: Scalars['ID']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  orderedQty: Scalars['Float']['output'];
  productId?: Maybe<Scalars['ID']['output']>;
  productName?: Maybe<Scalars['String']['output']>;
  quantity: Scalars['Float']['output'];
  unitPrice: Scalars['Float']['output'];
  uomId?: Maybe<Scalars['ID']['output']>;
};

export type BlanketOrderLineInput = {
  notes?: InputMaybe<Scalars['String']['input']>;
  productId?: InputMaybe<Scalars['ID']['input']>;
  productName?: InputMaybe<Scalars['String']['input']>;
  quantity: Scalars['Float']['input'];
  unitPrice: Scalars['Float']['input'];
  uomId?: InputMaybe<Scalars['ID']['input']>;
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
  /** asset | liability | equity | revenue | expense | bank | receivable | payable | other */
  accountType: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  level: Scalars['Int']['output'];
  organizationId: Scalars['String']['output'];
  parentAccount?: Maybe<Scalars['String']['output']>;
  /** ObjectId reference to parent ChartOfAccounts for tree structure. */
  parentAccountId?: Maybe<Scalars['ID']['output']>;
  updatedAt: Scalars['String']['output'];
};

export type ChartOfAccountsInput = {
  /** accountCode is generated server-side based on accountType. Ignored if supplied. */
  accountCode?: InputMaybe<Scalars['String']['input']>;
  accountName: Scalars['String']['input'];
  /** Optional human-entered identifier (e.g. legacy ledger number). */
  accountNumber?: InputMaybe<Scalars['String']['input']>;
  /** asset | liability | equity | revenue | expense | bank | receivable | payable | other */
  accountType: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  level?: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['String']['input'];
  /** ID of parent ChartOfAccounts document (for tree structure). */
  parentAccountId?: InputMaybe<Scalars['ID']['input']>;
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

export type CreateAttributeInput = {
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
  organizationId: Scalars['ID']['input'];
  values?: InputMaybe<Array<Scalars['String']['input']>>;
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

/** Nested "Create Bank" master-record modal, used when the bank isn't found in the bank picker. */
export type CreateBankInline = {
  address?: InputMaybe<Scalars['String']['input']>;
  bankIdentifierCode?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  phone?: InputMaybe<Scalars['String']['input']>;
};

export type CreateBankInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  bankIdentifierCode?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  organizationId: Scalars['ID']['input'];
  phone?: InputMaybe<Scalars['String']['input']>;
};

export type CreateBlanketOrderInput = {
  agreementType?: InputMaybe<Scalars['String']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  lines: Array<BlanketOrderLineInput>;
  notes?: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['ID']['input'];
  validityEnd?: InputMaybe<Scalars['String']['input']>;
  validityStart?: InputMaybe<Scalars['String']['input']>;
  vendorId: Scalars['ID']['input'];
  vendorName?: InputMaybe<Scalars['String']['input']>;
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
  bankAccountNumber?: InputMaybe<Scalars['String']['input']>;
  bankBranch?: InputMaybe<Scalars['String']['input']>;
  bankIfsc?: InputMaybe<Scalars['String']['input']>;
  bankName?: InputMaybe<Scalars['String']['input']>;
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
  employeeCode?: InputMaybe<Scalars['String']['input']>;
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

export type CreatePackageInput = {
  durationDays: Scalars['Int']['input'];
  externalName: Scalars['String']['input'];
  packageName: Scalars['String']['input'];
  price: Scalars['Float']['input'];
};

export type CreatePaymentTermInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  dueDays?: InputMaybe<Scalars['Int']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
  organizationId: Scalars['ID']['input'];
};

export type CreateProductCategoryInput = {
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
  organizationId: Scalars['ID']['input'];
  parentId?: InputMaybe<Scalars['ID']['input']>;
};

export type CreateProductInput = {
  attributeLines?: InputMaybe<Array<ProductAttributeLineInput>>;
  barcode?: InputMaybe<Scalars['String']['input']>;
  canBeExpensed?: InputMaybe<Scalars['Boolean']['input']>;
  canBePurchased?: InputMaybe<Scalars['Boolean']['input']>;
  canBeSold?: InputMaybe<Scalars['Boolean']['input']>;
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  costPrice?: InputMaybe<Scalars['Float']['input']>;
  expenseAccount?: InputMaybe<Scalars['String']['input']>;
  hsnSac?: InputMaybe<Scalars['String']['input']>;
  images?: InputMaybe<Array<Scalars['String']['input']>>;
  incomeAccount?: InputMaybe<Scalars['String']['input']>;
  /** Auto-generated from seqNo when omitted. */
  internalReference?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['ID']['input'];
  packagings?: InputMaybe<Array<ProductPackagingLineInput>>;
  productType?: InputMaybe<Scalars['String']['input']>;
  purchaseTaxIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  purchaseUomId?: InputMaybe<Scalars['ID']['input']>;
  reorderingRules?: InputMaybe<Array<ProductReorderingRuleInput>>;
  salesPrice?: InputMaybe<Scalars['Float']['input']>;
  salesTaxIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  status?: InputMaybe<Scalars['String']['input']>;
  stockAccount?: InputMaybe<Scalars['String']['input']>;
  trackInventory?: InputMaybe<Scalars['Boolean']['input']>;
  trackingMethod?: InputMaybe<Scalars['String']['input']>;
  uomId?: InputMaybe<Scalars['ID']['input']>;
  vendorPricelist?: InputMaybe<Array<VendorPricelistLineInput>>;
};

export type CreateProjectInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  organizationId: Scalars['ID']['input'];
  startDate?: InputMaybe<Scalars['String']['input']>;
};

export type CreatePurchaseOrderInput = {
  agreement?: InputMaybe<Scalars['String']['input']>;
  askConfirmation?: InputMaybe<Scalars['Boolean']['input']>;
  /** ordered_quantities | received_quantities — controls when a vendor bill can be created. Defaults to received_quantities. */
  billControlPolicy?: InputMaybe<Scalars['String']['input']>;
  buyerId?: InputMaybe<Scalars['ID']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  deliverToLocationId?: InputMaybe<Scalars['ID']['input']>;
  deliveryDate?: InputMaybe<Scalars['String']['input']>;
  deliveryTerms?: InputMaybe<Scalars['String']['input']>;
  /** Foreign-currency units per 1 INR. Defaults to 1 (base currency). */
  exchangeRate?: InputMaybe<Scalars['Float']['input']>;
  expectedArrival?: InputMaybe<Scalars['String']['input']>;
  fiscalPosition?: InputMaybe<Scalars['String']['input']>;
  gstTreatment?: InputMaybe<Scalars['String']['input']>;
  incoterms?: InputMaybe<Scalars['String']['input']>;
  items: Array<PoLineItemInput>;
  notes?: InputMaybe<Scalars['String']['input']>;
  orderDate: Scalars['String']['input'];
  orderDeadline?: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['ID']['input'];
  paymentTerms?: InputMaybe<Scalars['ID']['input']>;
  projectId?: InputMaybe<Scalars['ID']['input']>;
  sourceDocument?: InputMaybe<Scalars['String']['input']>;
  vendorId?: InputMaybe<Scalars['ID']['input']>;
  vendorReference?: InputMaybe<Scalars['String']['input']>;
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
  /** Deprecated: use customerId. */
  clientId?: InputMaybe<Scalars['ID']['input']>;
  customerId: Scalars['ID']['input'];
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
  customerId?: InputMaybe<Scalars['ID']['input']>;
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
  /** ordered_quantities | delivered_quantities. Defaults to ordered_quantities. */
  invoicingPolicy?: InputMaybe<Scalars['String']['input']>;
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

/** Inline "Create Tag" during vendor tagging (Step 4). */
export type CreateTagInline = {
  category?: InputMaybe<Scalars['String']['input']>;
  color?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type CreateTagInput = {
  category?: InputMaybe<Scalars['String']['input']>;
  color?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
  organizationId: Scalars['ID']['input'];
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

export type CreateUomInput = {
  category: Scalars['String']['input'];
  gstUqc?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
  organizationId: Scalars['ID']['input'];
  ratio?: InputMaybe<Scalars['Float']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
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

export type CreateVendorDebitNoteInput = {
  debitDate: Scalars['String']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['ID']['input'];
  purchaseOrderId?: InputMaybe<Scalars['ID']['input']>;
  reason?: InputMaybe<Scalars['String']['input']>;
  totalAmount: Scalars['Float']['input'];
  /** If set, auto-allocates debit note to this bill after posting. */
  vendorBillId?: InputMaybe<Scalars['ID']['input']>;
  vendorId: Scalars['ID']['input'];
};

export type CreateVendorInput = {
  accounting?: InputMaybe<VendorAccountingInfoInput>;
  address?: InputMaybe<VendorAddressInput>;
  bankAccounts?: InputMaybe<Array<VendorBankAccountInput>>;
  city?: InputMaybe<Scalars['String']['input']>;
  contactPerson?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  createTags?: InputMaybe<Array<CreateTagInline>>;
  email?: InputMaybe<Scalars['String']['input']>;
  gstTreatment?: InputMaybe<Scalars['String']['input']>;
  gstin?: InputMaybe<Scalars['String']['input']>;
  internalNotes?: InputMaybe<Scalars['String']['input']>;
  inventory?: InputMaybe<VendorInventoryInfoInput>;
  misc?: InputMaybe<VendorMiscInfoInput>;
  mobile?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['ID']['input'];
  pan?: InputMaybe<Scalars['String']['input']>;
  paymentTerms?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  purchase?: InputMaybe<VendorPurchaseInfoInput>;
  sales?: InputMaybe<VendorSalesInfoInput>;
  state?: InputMaybe<Scalars['String']['input']>;
  tags?: InputMaybe<Array<VendorTagInput>>;
  taxNumber?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  warnings?: InputMaybe<VendorWarningsInput>;
  website?: InputMaybe<Scalars['String']['input']>;
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
  bankAccountNumber?: Maybe<Scalars['String']['output']>;
  bankBranch?: Maybe<Scalars['String']['output']>;
  bankIfsc?: Maybe<Scalars['String']['output']>;
  bankName?: Maybe<Scalars['String']['output']>;
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

export type CustomerRef = {
  __typename?: 'CustomerRef';
  docNumber?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
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

export type EmployeeSalaryStructure = {
  __typename?: 'EmployeeSalaryStructure';
  basicMonthly: Scalars['Float']['output'];
  components: Array<StructureComponent>;
  createdAt: Scalars['String']['output'];
  ctcAnnual: Scalars['Float']['output'];
  effectiveFrom: Scalars['String']['output'];
  effectiveTo?: Maybe<Scalars['String']['output']>;
  employeeId: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  organizationId: Scalars['String']['output'];
  status: Scalars['String']['output'];
  statutory: StatutoryOverrides;
};

export type EmployeeSalaryStructureInput = {
  basicMonthly?: InputMaybe<Scalars['Float']['input']>;
  components?: InputMaybe<Array<StructureComponentInput>>;
  ctcAnnual?: InputMaybe<Scalars['Float']['input']>;
  effectiveFrom: Scalars['String']['input'];
  effectiveTo?: InputMaybe<Scalars['String']['input']>;
  employeeId: Scalars['String']['input'];
  organizationId: Scalars['String']['input'];
  status?: InputMaybe<Scalars['String']['input']>;
  statutory?: InputMaybe<StatutoryOverridesInput>;
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

export type FinancialStatementLine = {
  __typename?: 'FinancialStatementLine';
  accountCode: Scalars['String']['output'];
  accountName: Scalars['String']['output'];
  amount: Scalars['Float']['output'];
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

/** Result of validating a GSTIN against the configured provider (mock until live credentials are set). */
export type GstinCheckResult = {
  __typename?: 'GstinCheckResult';
  gstTreatment?: Maybe<Scalars['String']['output']>;
  gstin: Scalars['String']['output'];
  legalName?: Maybe<Scalars['String']['output']>;
  message: Scalars['String']['output'];
  registrationDate?: Maybe<Scalars['String']['output']>;
  /** MOCK while no live GSTN/KYC-aggregator credentials are configured; LIVE once wired. */
  source: Scalars['String']['output'];
  stateCode?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  tradeName?: Maybe<Scalars['String']['output']>;
  valid: Scalars['Boolean']['output'];
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

export type IncomeStatementReport = {
  __typename?: 'IncomeStatementReport';
  cogsLines: Array<FinancialStatementLine>;
  expenseLines: Array<FinancialStatementLine>;
  grossProfit: Scalars['Float']['output'];
  netIncome: Scalars['Float']['output'];
  revenueLines: Array<FinancialStatementLine>;
  totalCogs: Scalars['Float']['output'];
  totalOperatingExpense: Scalars['Float']['output'];
  totalRevenue: Scalars['Float']['output'];
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

export type LotSerialTraceEvent = {
  __typename?: 'LotSerialTraceEvent';
  date: Scalars['String']['output'];
  documentId: Scalars['ID']['output'];
  documentNumber: Scalars['String']['output'];
  documentType: Scalars['String']['output'];
  eventType: Scalars['String']['output'];
  itemDescription?: Maybe<Scalars['String']['output']>;
  location?: Maybe<Scalars['String']['output']>;
  quantity?: Maybe<Scalars['Float']['output']>;
  referenceModule?: Maybe<Scalars['String']['output']>;
};

export type LotSerialTraceResult = {
  __typename?: 'LotSerialTraceResult';
  events: Array<LotSerialTraceEvent>;
  lotOrSerial: Scalars['String']['output'];
  totalEventsFound: Scalars['Int']['output'];
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
  addAttributeValue: Attribute;
  /** Add a bank account to an existing vendor (Step 6 nested "Create Bank Account" modal). */
  addVendorBankAccount: Vendor;
  adjustStock: InventoryControl;
  /** Issue credit memo: reverse AR/revenue and update invoice balance. */
  applyCustomerCreditMemo: CustomerInvoice;
  /** Apply a debit note / vendor credit against an approved bill — reduces outstanding balance (Odoo: Outstanding Credits). */
  applyVendorCredit: VendorBill;
  applyVendorDebitNoteToBill: VendorDebitNote;
  approveLeaveApplication: LeaveApplication;
  approveLeaveReinstatement: LeaveReinstatement;
  /** vendorId is optional — assigns/changes the vendor when approving a requisition raised without one. */
  approvePurchaseOrder: PurchaseOrder;
  approveReturnAuthorization: ReturnAuthorization;
  approveVendorBill: VendorBill;
  archiveAllNotifications: Scalars['Int']['output'];
  archiveNotification: Notification;
  /**
   * Bills the received-but-unbilled quantity by default (3-way match: capped at qtyReceived - qtyBilled per line).
   * Omit `lines` to bill every line's full receivable-but-unbilled quantity. Supports multiple partial bills per PO.
   */
  billPurchaseOrder: VendorBill;
  cancelBlanketOrder: BlanketOrder;
  cancelCustomerDeposit: CustomerDeposit;
  cancelCustomerRefund: CustomerRefund;
  /** Cancel a delivery order. If it was already DISPATCHED, stock deduction is reversed. */
  cancelDeliveryOrder: DeliveryOrder;
  cancelFinanceChargeAssessment: FinanceChargeAssessment;
  cancelIntercompanyTransfer: IntercompanyTransfer;
  cancelMaterialReceipt: MaterialReceipt;
  cancelPurchaseOrder: PurchaseOrder;
  cancelReturnAuthorization: ReturnAuthorization;
  cancelStockAdjustment: StockAdjustment;
  cancelStockTransfer: StockTransfer;
  closeBlanketOrder: BlanketOrder;
  /** Marks a PO line as closed for further receiving (e.g. vendor confirmed no more stock coming) — 'backorder' cancel. */
  closePurchaseOrderLine: PurchaseOrder;
  completeAssetMaintenance: AssetMaintenance;
  computePayrollRun: Array<Payslip>;
  confirmBlanketOrder: BlanketOrder;
  confirmIntercompanyTransfer: IntercompanyTransfer;
  confirmMaterialReceipt: MaterialReceipt;
  /** Approved RFQ -> formal Purchase Order (assigns confirmationDate). */
  confirmPurchaseOrder: PurchaseOrder;
  confirmStockAdjustment: StockAdjustment;
  confirmStockTransfer: StockTransfer;
  convertLeadToOpportunity: Scalars['ID']['output'];
  createAllocationSchedule: AllocationSchedule;
  createApplicant: Applicant;
  createAppraisal: Appraisal;
  createAsset: Asset;
  createAssetMaintenance: AssetMaintenance;
  createAttendance: Attendance;
  createAttribute: Attribute;
  createBank: Bank;
  createBankAccount: BankAccount;
  createBankStatementLine: BankStatementLine;
  createBillOfMaterials: BillOfMaterials;
  createBlanketOrder: BlanketOrder;
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
  createEmployeeSalaryStructure: EmployeeSalaryStructure;
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
  /**
   * Create a Customer Invoice from a Sales Order, enforcing the SO's invoicingPolicy:
   *   ordered_quantities   → invoice immediately on SO confirm (no delivery required).
   *   delivered_quantities → blocks invoice creation until at least some quantity has been delivered
   *                          (deliveredQuantity > 0). Raises an error if nothing has been delivered yet.
   */
  createInvoiceFromSalesOrder: CustomerInvoice;
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
  createOnboarding: Onboarding;
  createOpportunity: Opportunity;
  createOrganization: Organization;
  createOrganizationWithOrgAdmin: Organization;
  createPackage: Package;
  createPaymentTerm: PaymentTerm;
  createPayrollManagement: PayrollManagement;
  createPayrollUiRecord: PayrollUiRecord;
  createProduct: Product;
  createProductCategory: ProductCategory;
  createProductionPlanning: ProductionPlanning;
  createProject: Project;
  createPurchaseOrder: PurchaseOrder;
  createPurchaseRequisition: PurchaseOrder;
  createQCInspection: QcInspection;
  createQuotation: Quotation;
  createRawMaterialRequisition: RawMaterialRequisition;
  createReconciliationRule: ReconciliationRule;
  createRecruitment: Recruitment;
  createReturnAuthorization: ReturnAuthorization;
  createRole: Role;
  /** Convert an approved/accepted quotation into a Sales Order (Odoo: Confirm button). */
  createSOFromQuotation: SalesOrder;
  createSalaryProcessing: SalaryProcessing;
  createSalesEnquiry: SalesEnquiry;
  createSalesOrder: SalesOrder;
  createSalesQuotation: SalesQuotation;
  createSalesReturn: SalesReturn;
  createSiteLocation: SiteLocation;
  createStockAdjustment: StockAdjustment;
  createStockMovement: StockMovement;
  createStockTransfer: StockTransfer;
  /** ORG_ADMIN of a tenant with allowSubTenants creates a child tenant + its admin. */
  createSubTenantWithAdmin: Organization;
  createTag: Tag;
  createTaxRate: TaxRate;
  createTimesheetEntry: TimesheetEntry;
  createUom: Uom;
  createUser: User;
  createVendor: Vendor;
  createVendorBill: VendorBill;
  createVendorCredit: VendorCredit;
  createVendorDebitNote: VendorDebitNote;
  createVendorPayment: VendorPayment;
  createVendorPrepayment: VendorPrepayment;
  createWarehouse: Warehouse;
  createWarehouseBin: WarehouseBin;
  createWorkOrder: WorkOrder;
  /** Deactivate an approved vendor (blocks if open POs exist). Sets status = inactive. */
  deactivateVendor: Vendor;
  deleteAllocationSchedule: Scalars['Boolean']['output'];
  deleteApplicant: Scalars['Boolean']['output'];
  deleteAppraisal: Scalars['Boolean']['output'];
  deleteAsset: Scalars['Boolean']['output'];
  deleteAssetMaintenance: AssetMaintenance;
  deleteAttendance: Attendance;
  deleteAttribute: Scalars['Boolean']['output'];
  deleteBank: Scalars['Boolean']['output'];
  deleteBankStatementLine: Scalars['Boolean']['output'];
  deleteBillOfMaterials: BillOfMaterials;
  deleteBlanketOrder: Scalars['Boolean']['output'];
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
  deleteEmployeeSalaryStructure: Scalars['Boolean']['output'];
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
  deleteOnboarding: Scalars['Boolean']['output'];
  deleteOpportunity: Scalars['Boolean']['output'];
  deleteOrganization: Organization;
  deletePackageModuleAssignment: Scalars['Boolean']['output'];
  deletePaymentTerm: Scalars['Boolean']['output'];
  deletePayrollManagement: Scalars['Boolean']['output'];
  deletePayrollUiRecord: Scalars['Boolean']['output'];
  deletePayslip: Scalars['Boolean']['output'];
  deleteProduct: Scalars['Boolean']['output'];
  deleteProductCategory: Scalars['Boolean']['output'];
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
  deleteTag: Scalars['Boolean']['output'];
  deleteTaxRate: TaxRate;
  deleteTimesheetEntry: TimesheetEntry;
  deleteUom: Scalars['Boolean']['output'];
  deleteUser: User;
  deleteVendor: Scalars['Boolean']['output'];
  deleteVendorBill: Scalars['Boolean']['output'];
  deleteVendorCredit: Scalars['Boolean']['output'];
  deleteVendorDebitNote: Scalars['Boolean']['output'];
  deleteVendorPayment: Scalars['Boolean']['output'];
  deleteVendorPrepayment: Scalars['Boolean']['output'];
  deleteWorkOrder: Scalars['Boolean']['output'];
  disposeFixedAsset: FixedAsset;
  draftFinanceChargeAssessment: FinanceChargeAssessment;
  /** Duplicates an existing PO/RFQ into a brand-new draft RFQ with the same vendor/lines (qty/received/billed reset). */
  duplicatePurchaseOrder: PurchaseOrder;
  /** Idempotent: seeds Due on Receipt / Net 15 / 30 / 45 / 60 for orgs with none configured yet. */
  ensureDefaultPaymentTerms: Array<PaymentTerm>;
  /** Idempotent: seeds Nos/Box/kg/g/Litre/Meter with GST UQC codes for orgs with none configured yet. */
  ensureDefaultUoms: Array<Uom>;
  exportPayrollRunNeft: Scalars['String']['output'];
  generatePriceList: PriceList;
  /** Move received goods into QC inspection hold (not yet available stock). */
  holdProductForQc: Product;
  lockPurchaseOrder: PurchaseOrder;
  login: AuthPayload;
  markAllNotificationsRead: Scalars['Int']['output'];
  markNotificationRead: Notification;
  /** Standalone 'Print RFQ' action — records that the RFQ was printed without emailing or changing status. */
  markPurchaseOrderPrinted: PurchaseOrder;
  /** Optional 'Print RFQ / Send by Email' step prior to formal submission — rfq -> rfq_sent. */
  markPurchaseOrderRfqSent: PurchaseOrder;
  matchBankStatementLineToBook: BankStatementLine;
  postCurrencyRevaluation: CurrencyRevaluation;
  postFinanceChargeAssessment: FinanceChargeAssessment;
  postFixedAssetDepreciation: FixedAsset;
  postIntercompanyAllocation: IntercompanyAllocation;
  postIntercompanyJournalEntry: IntercompanyJournalEntry;
  postJournalEntry: JournalEntry;
  /** Reactivate an inactive vendor. Sets status = active. */
  reactivateVendor: Vendor;
  /** Omit `lines` to receive every line's remaining quantity in full (legacy one-click behavior). */
  receivePurchaseOrder: PurchaseOrder;
  receiveReturnAuthorizationGoods: ReturnAuthorization;
  reconcileCashBank: CashBank;
  /** Move invoice from in_payment to paid — call after bank statement line is matched (reconciliation step). */
  reconcileCustomerInvoice: CustomerInvoice;
  /** Move bill from in_payment to paid — call after bank statement line is matched (reconciliation step). */
  reconcileVendorBill: VendorBill;
  refundCashSale: SalesOrder;
  rejectLeaveApplication: LeaveApplication;
  rejectLeaveReinstatement: LeaveReinstatement;
  rejectReturnAuthorization: ReturnAuthorization;
  /** Release goods from QC hold. decision: 'pass' moves to available stock; 'fail' scraps/returns. */
  releaseProductFromQc: Product;
  removeVendorBankAccount: Vendor;
  /** Creates a draft RFQ for this product using the cheapest vendor pricelist entry. */
  replenishProduct: ReplenishResult;
  resolveApprovalRequest: ApprovalRequest;
  resolveTimesheetEntry: TimesheetEntry;
  reverseIntercompanyAllocation: IntercompanyAllocation;
  reverseIntercompanyJournalEntry: IntercompanyJournalEntry;
  /**
   * Manually trigger the reorder scheduler for an organization.
   * Scans all products with reorderingRules where onHandQty < minQty and creates draft RFQs.
   * Safe to call multiple times — only creates new RFQs, never modifies existing ones.
   */
  runReorderScheduler: ReorderSchedulerResult;
  seedIndividualPriceListFromCatalog: IndividualPriceList;
  seedSystemRoles: Array<Role>;
  /**
   * Send a notification (broadcast/maintenance/announcement/alert).
   * Super admin can target all org admins or specific users in any org.
   * Org admin can target all users in their own org or specific users in their own org.
   * Returns the number of notifications created.
   */
  sendNotification: Scalars['Int']['output'];
  /** Emails the vendor with the PO PDF attached, then marks the PO as sent. */
  sendPurchaseOrderByEmail: PurchaseOrder;
  sendQuotation: SendQuotationResult;
  /** Replace module-level approver assignments for an organization (org admin: own org only). */
  setOrganizationModuleApprovers: Organization;
  setPackageModuleAssignment: PackageModuleAssignment;
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
  /** Post revenue/AR journal and GL for an approved invoice (safe to retry). */
  syncCustomerInvoiceAccounting: CustomerInvoice;
  /** Post expense/AP journal and GL for an approved bill (safe to retry). */
  syncVendorBillAccounting: VendorBill;
  toggleOnboardingTask: Onboarding;
  transferBankFunds: BankTransferResult;
  transitionAppraisal: Appraisal;
  transitionDeliveryOrderStatus: DeliveryOrder;
  /** Unlock a locked PO to allow edits — mirrors Odoo's Unlock button on confirmed orders. */
  unlockPurchaseOrder: PurchaseOrder;
  updateAllocationSchedule: AllocationSchedule;
  updateApplicant: Applicant;
  updateAppraisal: Appraisal;
  updateAsset: Asset;
  updateAssetMaintenance: AssetMaintenance;
  updateAttendance: Attendance;
  updateAttribute: Attribute;
  updateBank: Bank;
  updateBankAccount: BankAccount;
  updateBillOfMaterials: BillOfMaterials;
  updateBlanketOrder: BlanketOrder;
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
  updateEmployeeSalaryStructure: EmployeeSalaryStructure;
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
  updateOnboarding: Onboarding;
  updateOpportunity: Opportunity;
  updateOrganization: Organization;
  updatePackage: Package;
  updatePaymentTerm: PaymentTerm;
  updatePayrollManagement: PayrollManagement;
  updatePayrollUiRecord: PayrollUiRecord;
  updateProduct: Product;
  updateProductCategory: ProductCategory;
  /** Sets on-hand quantity for a product (optionally scoped to a warehouse) to an absolute value. */
  updateProductQuantity: Product;
  updateProductVariant: ProductVariant;
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
  updateTag: Tag;
  updateTaxRate: TaxRate;
  updateTimesheetEntry: TimesheetEntry;
  updateUom: Uom;
  updateUser: User;
  updateVendor: Vendor;
  updateVendorBill: VendorBill;
  updateVendorCredit: VendorCredit;
  updateVendorDebitNote: VendorDebitNote;
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


export type MutationAddAttributeValueArgs = {
  id: Scalars['ID']['input'];
  value: Scalars['String']['input'];
};


export type MutationAddVendorBankAccountArgs = {
  input: VendorBankAccountInput;
  vendorId: Scalars['ID']['input'];
};


export type MutationAdjustStockArgs = {
  binLocation: Scalars['String']['input'];
  itemId: Scalars['String']['input'];
  organizationId?: InputMaybe<Scalars['String']['input']>;
  quantity: Scalars['Float']['input'];
  reason: Scalars['String']['input'];
};


export type MutationApplyCustomerCreditMemoArgs = {
  creditAmount: Scalars['Float']['input'];
  id: Scalars['ID']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
};


export type MutationApplyVendorCreditArgs = {
  amount: Scalars['Float']['input'];
  id: Scalars['ID']['input'];
};


export type MutationApplyVendorDebitNoteToBillArgs = {
  amount: Scalars['Float']['input'];
  billId: Scalars['ID']['input'];
  debitNoteId: Scalars['ID']['input'];
};


export type MutationApproveLeaveApplicationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationApproveLeaveReinstatementArgs = {
  id: Scalars['ID']['input'];
};


export type MutationApprovePurchaseOrderArgs = {
  id: Scalars['ID']['input'];
  vendorId?: InputMaybe<Scalars['ID']['input']>;
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
  lines?: InputMaybe<Array<PoBillLineInput>>;
};


export type MutationCancelBlanketOrderArgs = {
  id: Scalars['ID']['input'];
};


export type MutationCancelCustomerDepositArgs = {
  id: Scalars['ID']['input'];
};


export type MutationCancelCustomerRefundArgs = {
  id: Scalars['ID']['input'];
};


export type MutationCancelDeliveryOrderArgs = {
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


export type MutationCancelPurchaseOrderArgs = {
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


export type MutationCloseBlanketOrderArgs = {
  id: Scalars['ID']['input'];
};


export type MutationClosePurchaseOrderLineArgs = {
  id: Scalars['ID']['input'];
  lineId: Scalars['ID']['input'];
};


export type MutationCompleteAssetMaintenanceArgs = {
  id: Scalars['ID']['input'];
  input: CompleteMaintenanceInput;
};


export type MutationComputePayrollRunArgs = {
  payrollRunId: Scalars['ID']['input'];
};


export type MutationConfirmBlanketOrderArgs = {
  id: Scalars['ID']['input'];
};


export type MutationConfirmIntercompanyTransferArgs = {
  id: Scalars['ID']['input'];
};


export type MutationConfirmMaterialReceiptArgs = {
  id: Scalars['ID']['input'];
};


export type MutationConfirmPurchaseOrderArgs = {
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


export type MutationCreateAppraisalArgs = {
  input: AppraisalInput;
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


export type MutationCreateAttributeArgs = {
  input: CreateAttributeInput;
};


export type MutationCreateBankArgs = {
  input: CreateBankInput;
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


export type MutationCreateBlanketOrderArgs = {
  input: CreateBlanketOrderInput;
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


export type MutationCreateEmployeeSalaryStructureArgs = {
  input: EmployeeSalaryStructureInput;
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


export type MutationCreateInvoiceFromSalesOrderArgs = {
  dueDate?: InputMaybe<Scalars['String']['input']>;
  invoiceDate: Scalars['String']['input'];
  salesOrderId: Scalars['ID']['input'];
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


export type MutationCreateOnboardingArgs = {
  input: OnboardingInput;
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


export type MutationCreatePackageArgs = {
  input: CreatePackageInput;
};


export type MutationCreatePaymentTermArgs = {
  input: CreatePaymentTermInput;
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


export type MutationCreateProductCategoryArgs = {
  input: CreateProductCategoryInput;
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


export type MutationCreatePurchaseRequisitionArgs = {
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


export type MutationCreateSoFromQuotationArgs = {
  quotationId: Scalars['ID']['input'];
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


export type MutationCreateSubTenantWithAdminArgs = {
  input: CreateOrganizationWithOrgAdminInput;
};


export type MutationCreateTagArgs = {
  input: CreateTagInput;
};


export type MutationCreateTaxRateArgs = {
  input: CreateTaxRateInput;
};


export type MutationCreateTimesheetEntryArgs = {
  input: CreateTimesheetEntryInput;
};


export type MutationCreateUomArgs = {
  input: CreateUomInput;
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


export type MutationCreateVendorDebitNoteArgs = {
  input: CreateVendorDebitNoteInput;
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


export type MutationDeactivateVendorArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteAllocationScheduleArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteApplicantArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteAppraisalArgs = {
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


export type MutationDeleteAttributeArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteBankArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteBankStatementLineArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteBillOfMaterialsArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteBlanketOrderArgs = {
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


export type MutationDeleteEmployeeSalaryStructureArgs = {
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


export type MutationDeleteOnboardingArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteOpportunityArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteOrganizationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeletePackageModuleAssignmentArgs = {
  organizationId: Scalars['ID']['input'];
  packageId: Scalars['ID']['input'];
};


export type MutationDeletePaymentTermArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeletePayrollManagementArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeletePayrollUiRecordArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeletePayslipArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteProductArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteProductCategoryArgs = {
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


export type MutationDeleteTagArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteTaxRateArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteTimesheetEntryArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteUomArgs = {
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


export type MutationDeleteVendorDebitNoteArgs = {
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


export type MutationDuplicatePurchaseOrderArgs = {
  id: Scalars['ID']['input'];
};


export type MutationEnsureDefaultPaymentTermsArgs = {
  organizationId: Scalars['ID']['input'];
};


export type MutationEnsureDefaultUomsArgs = {
  organizationId: Scalars['ID']['input'];
};


export type MutationExportPayrollRunNeftArgs = {
  payrollRunId: Scalars['ID']['input'];
};


export type MutationGeneratePriceListArgs = {
  input: GeneratePriceListInput;
};


export type MutationHoldProductForQcArgs = {
  productId: Scalars['ID']['input'];
  quantity: Scalars['Float']['input'];
  referenceId?: InputMaybe<Scalars['ID']['input']>;
  warehouseId?: InputMaybe<Scalars['ID']['input']>;
};


export type MutationLockPurchaseOrderArgs = {
  id: Scalars['ID']['input'];
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationMarkNotificationReadArgs = {
  id: Scalars['ID']['input'];
};


export type MutationMarkPurchaseOrderPrintedArgs = {
  id: Scalars['ID']['input'];
};


export type MutationMarkPurchaseOrderRfqSentArgs = {
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


export type MutationReactivateVendorArgs = {
  id: Scalars['ID']['input'];
};


export type MutationReceivePurchaseOrderArgs = {
  id: Scalars['ID']['input'];
  lines?: InputMaybe<Array<PoReceiveLineInput>>;
};


export type MutationReceiveReturnAuthorizationGoodsArgs = {
  input: ReceiveReturnAuthorizationGoodsInput;
};


export type MutationReconcileCashBankArgs = {
  id: Scalars['ID']['input'];
};


export type MutationReconcileCustomerInvoiceArgs = {
  id: Scalars['ID']['input'];
};


export type MutationReconcileVendorBillArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRefundCashSaleArgs = {
  input: RefundCashSaleInput;
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


export type MutationReleaseProductFromQcArgs = {
  decision: Scalars['String']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  productId: Scalars['ID']['input'];
  quantity: Scalars['Float']['input'];
  warehouseId?: InputMaybe<Scalars['ID']['input']>;
};


export type MutationRemoveVendorBankAccountArgs = {
  bankAccountId: Scalars['ID']['input'];
  vendorId: Scalars['ID']['input'];
};


export type MutationReplenishProductArgs = {
  productId: Scalars['ID']['input'];
  quantity?: InputMaybe<Scalars['Float']['input']>;
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


export type MutationRunReorderSchedulerArgs = {
  organizationId: Scalars['ID']['input'];
};


export type MutationSeedIndividualPriceListFromCatalogArgs = {
  customerId: Scalars['ID']['input'];
  organizationId: Scalars['String']['input'];
};


export type MutationSendNotificationArgs = {
  input: SendNotificationInput;
};


export type MutationSendPurchaseOrderByEmailArgs = {
  id: Scalars['ID']['input'];
};


export type MutationSendQuotationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationSetOrganizationModuleApproversArgs = {
  assignments: Array<OrganizationModuleApproverInput>;
  organizationId: Scalars['ID']['input'];
};


export type MutationSetPackageModuleAssignmentArgs = {
  enabledModules: Array<PackageEnabledModuleInput>;
  organizationId: Scalars['ID']['input'];
  packageId: Scalars['ID']['input'];
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


export type MutationSyncCustomerInvoiceAccountingArgs = {
  id: Scalars['ID']['input'];
};


export type MutationSyncVendorBillAccountingArgs = {
  id: Scalars['ID']['input'];
};


export type MutationToggleOnboardingTaskArgs = {
  done: Scalars['Boolean']['input'];
  id: Scalars['ID']['input'];
  index: Scalars['Int']['input'];
};


export type MutationTransferBankFundsArgs = {
  input: BankTransferInput;
};


export type MutationTransitionAppraisalArgs = {
  id: Scalars['ID']['input'];
  status: Scalars['String']['input'];
};


export type MutationTransitionDeliveryOrderStatusArgs = {
  id: Scalars['ID']['input'];
  signedBy?: InputMaybe<Scalars['String']['input']>;
  status: Scalars['String']['input'];
};


export type MutationUnlockPurchaseOrderArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUpdateAllocationScheduleArgs = {
  id: Scalars['ID']['input'];
  input: AllocationScheduleInput;
};


export type MutationUpdateApplicantArgs = {
  id: Scalars['ID']['input'];
  input: ApplicantInput;
};


export type MutationUpdateAppraisalArgs = {
  id: Scalars['ID']['input'];
  input: AppraisalInput;
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


export type MutationUpdateAttributeArgs = {
  id: Scalars['ID']['input'];
  input: UpdateAttributeInput;
};


export type MutationUpdateBankArgs = {
  id: Scalars['ID']['input'];
  input: UpdateBankInput;
};


export type MutationUpdateBankAccountArgs = {
  id: Scalars['ID']['input'];
  input: BankAccountInput;
};


export type MutationUpdateBillOfMaterialsArgs = {
  id: Scalars['ID']['input'];
  input: UpdateBomInput;
};


export type MutationUpdateBlanketOrderArgs = {
  id: Scalars['ID']['input'];
  input: UpdateBlanketOrderInput;
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


export type MutationUpdateEmployeeSalaryStructureArgs = {
  id: Scalars['ID']['input'];
  input: EmployeeSalaryStructureInput;
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


export type MutationUpdateOnboardingArgs = {
  id: Scalars['ID']['input'];
  input: OnboardingInput;
};


export type MutationUpdateOpportunityArgs = {
  id: Scalars['ID']['input'];
  input: OpportunityInput;
};


export type MutationUpdateOrganizationArgs = {
  id: Scalars['ID']['input'];
  input: UpdateOrganizationInput;
};


export type MutationUpdatePackageArgs = {
  id: Scalars['ID']['input'];
  input: UpdatePackageInput;
};


export type MutationUpdatePaymentTermArgs = {
  id: Scalars['ID']['input'];
  input: UpdatePaymentTermInput;
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


export type MutationUpdateProductCategoryArgs = {
  id: Scalars['ID']['input'];
  input: UpdateProductCategoryInput;
};


export type MutationUpdateProductQuantityArgs = {
  notes?: InputMaybe<Scalars['String']['input']>;
  productId: Scalars['ID']['input'];
  quantity: Scalars['Float']['input'];
  warehouseId?: InputMaybe<Scalars['ID']['input']>;
};


export type MutationUpdateProductVariantArgs = {
  id: Scalars['ID']['input'];
  input: UpdateProductVariantInput;
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


export type MutationUpdateTagArgs = {
  id: Scalars['ID']['input'];
  input: UpdateTagInput;
};


export type MutationUpdateTaxRateArgs = {
  id: Scalars['ID']['input'];
  input: UpdateTaxRateInput;
};


export type MutationUpdateTimesheetEntryArgs = {
  id: Scalars['ID']['input'];
  input: UpdateTimesheetEntryInput;
};


export type MutationUpdateUomArgs = {
  id: Scalars['ID']['input'];
  input: UpdateUomInput;
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


export type MutationUpdateVendorDebitNoteArgs = {
  id: Scalars['ID']['input'];
  input: UpdateVendorDebitNoteInput;
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

export type Onboarding = {
  __typename?: 'Onboarding';
  completedAt?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  employeeId: Scalars['String']['output'];
  expectedCompletionDate?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  organizationId: Scalars['String']['output'];
  startedAt: Scalars['String']['output'];
  status: Scalars['String']['output'];
  tasks: Array<OnboardingTask>;
};

export type OnboardingInput = {
  employeeId: Scalars['String']['input'];
  expectedCompletionDate?: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['String']['input'];
  startedAt?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  tasks?: InputMaybe<Array<OnboardingTaskInput>>;
};

export type OnboardingTask = {
  __typename?: 'OnboardingTask';
  done: Scalars['Boolean']['output'];
  doneAt?: Maybe<Scalars['String']['output']>;
  notes?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
};

export type OnboardingTaskInput = {
  done?: InputMaybe<Scalars['Boolean']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
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
  allowSubTenants: Scalars['Boolean']['output'];
  code?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  email?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  moduleApprovers: Array<OrganizationModuleApprover>;
  name: Scalars['String']['output'];
  packageId?: Maybe<Scalars['ID']['output']>;
  parentOrganizationId?: Maybe<Scalars['ID']['output']>;
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
  /** True when the vendor confirmed no further delivery is expected on this line (backorder closed). */
  closedForReceiving: Scalars['Boolean']['output'];
  discountPercent: Scalars['Float']['output'];
  hsnSac?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  itemDescription?: Maybe<Scalars['String']['output']>;
  /** Legacy (pre-catalog-rework) fields — retained for backward-compatible reads only. */
  itemId?: Maybe<Scalars['ID']['output']>;
  lineTax: Scalars['Float']['output'];
  lineTotal: Scalars['Float']['output'];
  /** product (default) | section | note — mixed catalog/section/note line types. */
  lineType: Scalars['String']['output'];
  lineUntaxed: Scalars['Float']['output'];
  /** Free text — populated for section headers and note lines (lineType != 'product'). */
  note?: Maybe<Scalars['String']['output']>;
  packaging?: Maybe<ProductPackagingLine>;
  packagingId?: Maybe<Scalars['ID']['output']>;
  packagingQty: Scalars['Float']['output'];
  product?: Maybe<Product>;
  productId?: Maybe<Scalars['ID']['output']>;
  /** Denormalized display name — kept in sync with the linked Product/Variant. */
  productName?: Maybe<Scalars['String']['output']>;
  qtyBilled: Scalars['Float']['output'];
  qtyReceived: Scalars['Float']['output'];
  quantity?: Maybe<Scalars['Float']['output']>;
  taxIds: Array<Scalars['ID']['output']>;
  taxes: Array<TaxRate>;
  unitPrice?: Maybe<Scalars['Float']['output']>;
  uom?: Maybe<Uom>;
  uomId?: Maybe<Scalars['ID']['output']>;
  variant?: Maybe<ProductVariant>;
  variantId?: Maybe<Scalars['ID']['output']>;
};

export type PoLineItemInput = {
  discountPercent?: InputMaybe<Scalars['Float']['input']>;
  hsnSac?: InputMaybe<Scalars['String']['input']>;
  itemDescription?: InputMaybe<Scalars['String']['input']>;
  /** Legacy passthrough — only used when migrating/reading old free-text lines. */
  itemId?: InputMaybe<Scalars['ID']['input']>;
  lineType?: InputMaybe<Scalars['String']['input']>;
  note?: InputMaybe<Scalars['String']['input']>;
  packagingId?: InputMaybe<Scalars['ID']['input']>;
  packagingQty?: InputMaybe<Scalars['Float']['input']>;
  productId?: InputMaybe<Scalars['ID']['input']>;
  productName?: InputMaybe<Scalars['String']['input']>;
  quantity?: InputMaybe<Scalars['Float']['input']>;
  taxIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  unitPrice?: InputMaybe<Scalars['Float']['input']>;
  uomId?: InputMaybe<Scalars['ID']['input']>;
  variantId?: InputMaybe<Scalars['ID']['input']>;
};

export type Package = {
  __typename?: 'Package';
  createdAt: Scalars['String']['output'];
  durationDays: Scalars['Int']['output'];
  externalName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  packageName: Scalars['String']['output'];
  price: Scalars['Float']['output'];
  updatedAt: Scalars['String']['output'];
};

export type PackageEnabledModule = {
  __typename?: 'PackageEnabledModule';
  moduleKey: Scalars['String']['output'];
  submoduleKey: Scalars['String']['output'];
};

export type PackageEnabledModuleInput = {
  moduleKey: Scalars['String']['input'];
  submoduleKey: Scalars['String']['input'];
};

export type PackageModuleAssignment = {
  __typename?: 'PackageModuleAssignment';
  createdAt: Scalars['String']['output'];
  enabledModules: Array<PackageEnabledModule>;
  id: Scalars['ID']['output'];
  organizationId: Scalars['ID']['output'];
  organizationName: Scalars['String']['output'];
  packageId: Scalars['ID']['output'];
  updatedAt: Scalars['String']['output'];
};

export type PanLookupResult = {
  __typename?: 'PanLookupResult';
  holderType?: Maybe<Scalars['String']['output']>;
  message: Scalars['String']['output'];
  nameOnRecord?: Maybe<Scalars['String']['output']>;
  pan: Scalars['String']['output'];
  source: Scalars['String']['output'];
  valid: Scalars['Boolean']['output'];
};

export type PaymentTerm = {
  __typename?: 'PaymentTerm';
  createdAt: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  dueDays: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  organizationId: Scalars['ID']['output'];
  updatedAt: Scalars['String']['output'];
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

export type Payslip = {
  __typename?: 'Payslip';
  createdAt: Scalars['String']['output'];
  deductions: Array<PayslipLine>;
  earnings: Array<PayslipLine>;
  employeeCode: Scalars['String']['output'];
  employeeId: Scalars['String']['output'];
  employeeName: Scalars['String']['output'];
  esiEmployee: Scalars['Float']['output'];
  esiEmployer: Scalars['Float']['output'];
  grossEarnings: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  lopDays: Scalars['Float']['output'];
  netPay: Scalars['Float']['output'];
  organizationId: Scalars['String']['output'];
  paidDays: Scalars['Float']['output'];
  payPeriodEnd: Scalars['String']['output'];
  payPeriodStart: Scalars['String']['output'];
  payoutId?: Maybe<Scalars['String']['output']>;
  payoutStatus?: Maybe<Scalars['String']['output']>;
  payrollRunId: Scalars['String']['output'];
  pfEmployee: Scalars['Float']['output'];
  pfEmployer: Scalars['Float']['output'];
  status: Scalars['String']['output'];
  tds: Scalars['Float']['output'];
  totalDeductions: Scalars['Float']['output'];
  workingDays: Scalars['Float']['output'];
};

export type PayslipLine = {
  __typename?: 'PayslipLine';
  amount: Scalars['Float']['output'];
  code: Scalars['String']['output'];
  name: Scalars['String']['output'];
  type: Scalars['String']['output'];
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

/** Partial-bill line input for billPurchaseOrder; omit to bill every line's full received-but-unbilled quantity. */
export type PoBillLineInput = {
  lineId: Scalars['ID']['input'];
  quantity: Scalars['Float']['input'];
};

/** Partial-receipt line input for receivePurchaseOrder; omit to receive every line's remaining quantity. */
export type PoReceiveLineInput = {
  /** Set true to record more than the ordered quantity (vendor over-shipment). Defaults to false (over-receipt is capped/rejected). */
  allowOverReceipt?: InputMaybe<Scalars['Boolean']['input']>;
  lineId: Scalars['ID']['input'];
  /** Lot/batch number or list of serial numbers for this receipt. Required when the product has trackingMethod: lot/serial. */
  lotSerialNumbers?: InputMaybe<Array<Scalars['String']['input']>>;
  qtyReceived: Scalars['Float']['input'];
};

/** Header-level GST split, computed from the aggregate tax amount and fiscalPosition. */
export type PoTaxBreakdown = {
  __typename?: 'PoTaxBreakdown';
  cgst: Scalars['Float']['output'];
  igst: Scalars['Float']['output'];
  sgst: Scalars['Float']['output'];
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
  attributeLines: Array<ProductAttributeLine>;
  barcode?: Maybe<Scalars['String']['output']>;
  canBeExpensed: Scalars['Boolean']['output'];
  canBePurchased: Scalars['Boolean']['output'];
  canBeSold: Scalars['Boolean']['output'];
  category?: Maybe<ProductCategory>;
  categoryId?: Maybe<Scalars['ID']['output']>;
  costPrice: Scalars['Float']['output'];
  createdAt: Scalars['String']['output'];
  expenseAccount?: Maybe<Scalars['String']['output']>;
  forecastedQty: Scalars['Float']['output'];
  hsnSac?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  images: Array<Scalars['String']['output']>;
  incomeAccount?: Maybe<Scalars['String']['output']>;
  internalReference?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  /** Smart buttons — real stock/purchase data, computed after save. */
  onHandQty: Scalars['Float']['output'];
  organizationId: Scalars['ID']['output'];
  packagings: Array<ProductPackagingLine>;
  productType: Scalars['String']['output'];
  purchaseTaxIds: Array<Scalars['ID']['output']>;
  purchaseTaxes: Array<TaxRate>;
  purchaseUom?: Maybe<Uom>;
  purchaseUomId?: Maybe<Scalars['ID']['output']>;
  purchasedQty: Scalars['Float']['output'];
  /** Quantity currently held in QC inspection (received but not cleared for available use). */
  qcHoldQty: Scalars['Float']['output'];
  reorderingRules: Array<ProductReorderingRule>;
  salesPrice: Scalars['Float']['output'];
  salesTaxIds: Array<Scalars['ID']['output']>;
  salesTaxes: Array<TaxRate>;
  seqNo?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  stockAccount?: Maybe<Scalars['String']['output']>;
  trackInventory: Scalars['Boolean']['output'];
  trackingMethod: Scalars['String']['output'];
  uom?: Maybe<Uom>;
  uomId?: Maybe<Scalars['ID']['output']>;
  updatedAt: Scalars['String']['output'];
  variants: Array<ProductVariant>;
  vendorPricelist: Array<VendorPricelistLine>;
};

export type ProductAttributeLine = {
  __typename?: 'ProductAttributeLine';
  attribute?: Maybe<Attribute>;
  attributeId: Scalars['ID']['output'];
  valueIds: Array<Scalars['ID']['output']>;
};

export type ProductAttributeLineInput = {
  attributeId: Scalars['ID']['input'];
  valueIds: Array<Scalars['ID']['input']>;
};

/** Hierarchical product category (e.g. All -> Tools -> Tools Consumables). */
export type ProductCategory = {
  __typename?: 'ProductCategory';
  createdAt: Scalars['String']['output'];
  /** Denormalized breadcrumb, e.g. "All / Tools / Tools Consumables". */
  fullPath: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  organizationId: Scalars['ID']['output'];
  parentId?: Maybe<Scalars['ID']['output']>;
  updatedAt: Scalars['String']['output'];
};

export type ProductPackagingLine = {
  __typename?: 'ProductPackagingLine';
  barcode?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  qtyPerPackage: Scalars['Float']['output'];
};

export type ProductPackagingLineInput = {
  barcode?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  qtyPerPackage: Scalars['Float']['input'];
};

export type ProductReorderingRule = {
  __typename?: 'ProductReorderingRule';
  id: Scalars['ID']['output'];
  maxQty: Scalars['Float']['output'];
  minQty: Scalars['Float']['output'];
  warehouse?: Maybe<Warehouse>;
  warehouseId?: Maybe<Scalars['ID']['output']>;
};

export type ProductReorderingRuleInput = {
  maxQty: Scalars['Float']['input'];
  minQty: Scalars['Float']['input'];
  warehouseId?: InputMaybe<Scalars['ID']['input']>;
};

/** A generated combination of a product's attribute-line values (e.g. Make=NAKSHTRA, Model=250MIG/ARC, Size=0.8mm). */
export type ProductVariant = {
  __typename?: 'ProductVariant';
  attributeValues: Array<VariantAttributeValue>;
  barcode?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  displayName: Scalars['String']['output'];
  extraPrice: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  organizationId: Scalars['ID']['output'];
  productId: Scalars['ID']['output'];
  sku?: Maybe<Scalars['String']['output']>;
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
  agreement?: Maybe<Scalars['String']['output']>;
  askConfirmation: Scalars['Boolean']['output'];
  /** ordered_quantities: bill on PO confirm (Odoo default for services). received_quantities: bill only after receipt (default for goods). */
  billControlPolicy: Scalars['String']['output'];
  billingStatus: Scalars['String']['output'];
  buyer?: Maybe<User>;
  buyerId?: Maybe<Scalars['ID']['output']>;
  confirmationDate?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  currency: Scalars['String']['output'];
  deliverToLocation?: Maybe<Warehouse>;
  deliverToLocationId?: Maybe<Scalars['ID']['output']>;
  /** Legacy alias for expectedArrival. */
  deliveryDate?: Maybe<Scalars['String']['output']>;
  deliveryTerms?: Maybe<Scalars['String']['output']>;
  /** Foreign-currency units per 1 INR (base). 1.0 for INR POs. Snapshotted at create/update. */
  exchangeRate: Scalars['Float']['output'];
  expectedArrival?: Maybe<Scalars['String']['output']>;
  fiscalPosition?: Maybe<Scalars['String']['output']>;
  gstTreatment?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  incoterms?: Maybe<Scalars['String']['output']>;
  items?: Maybe<Array<PoLineItem>>;
  lastPrintedAt?: Maybe<Scalars['String']['output']>;
  notes?: Maybe<Scalars['String']['output']>;
  orderDate?: Maybe<Scalars['String']['output']>;
  orderDeadline?: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['ID']['output'];
  paymentTerms?: Maybe<Scalars['ID']['output']>;
  paymentTermsInfo?: Maybe<PaymentTerm>;
  projectId?: Maybe<Scalars['ID']['output']>;
  projectName?: Maybe<Scalars['String']['output']>;
  receiptStatus: Scalars['String']['output'];
  seqNo?: Maybe<Scalars['String']['output']>;
  sourceDocument?: Maybe<Scalars['String']['output']>;
  /** rfq | rfq_sent | submitted | approved | purchase_order | sent | received | partially_received | billed | partially_billed | debited | cancelled | rejected | locked */
  status: Scalars['String']['output'];
  /** Legacy alias for untaxedAmount. */
  subtotal?: Maybe<Scalars['Float']['output']>;
  taxAmount?: Maybe<Scalars['Float']['output']>;
  taxBreakdown: PoTaxBreakdown;
  totalAmount?: Maybe<Scalars['Float']['output']>;
  /** totalAmount converted to base currency (INR) using exchangeRate — used for accounting/reporting. */
  totalAmountBaseCurrency: Scalars['Float']['output'];
  untaxedAmount?: Maybe<Scalars['Float']['output']>;
  updatedAt?: Maybe<Scalars['String']['output']>;
  vendor?: Maybe<Vendor>;
  vendorId?: Maybe<Scalars['ID']['output']>;
  vendorName?: Maybe<Scalars['String']['output']>;
  vendorReference?: Maybe<Scalars['String']['output']>;
  /** Optimistic-concurrency version counter — pass as expectedVersion in updatePurchaseOrder to detect conflicting edits. */
  version: Scalars['Int']['output'];
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
  activeSalaryStructureForEmployee?: Maybe<EmployeeSalaryStructure>;
  /** Aged Payable report — outstanding vendor bills bucketed by days overdue (0 / 1-30 / 31-60 / 61-90 / 90+). */
  agedPayable: Array<AgedPayableRow>;
  /** Aged Receivable report — outstanding customer invoices bucketed by days overdue. */
  agedReceivable: Array<AgedReceivableRow>;
  allocationSchedule?: Maybe<AllocationSchedule>;
  allocationSchedules: Array<AllocationSchedule>;
  applicant?: Maybe<Applicant>;
  applicants: Array<Applicant>;
  appraisal?: Maybe<Appraisal>;
  appraisals: Array<Appraisal>;
  asset?: Maybe<Asset>;
  assetMaintenance?: Maybe<AssetMaintenance>;
  assetMaintenances: Array<AssetMaintenance>;
  assets: Array<Asset>;
  attendance?: Maybe<Attendance>;
  attendances: Array<Attendance>;
  attribute?: Maybe<Attribute>;
  attributes: Array<Attribute>;
  auditLogs: AuditLogPage;
  availableVendorCredits: Array<VendorCredit>;
  availableVendorPrepayments: Array<VendorPrepayment>;
  balanceSheet: BalanceSheetReport;
  bank?: Maybe<Bank>;
  bankAccount?: Maybe<BankAccount>;
  bankAccounts: Array<BankAccount>;
  bankStatementLines: Array<BankStatementLine>;
  banks: Array<Bank>;
  billOfMaterials?: Maybe<BillOfMaterials>;
  billsOfMaterials: Array<BillOfMaterials>;
  blanketOrder?: Maybe<BlanketOrder>;
  blanketOrders: Array<BlanketOrder>;
  budget?: Maybe<Budget>;
  budgets: Array<Budget>;
  career?: Maybe<Career>;
  careers: Array<Career>;
  cashBank?: Maybe<CashBank>;
  cashBanks: Array<CashBank>;
  cashSalesRefundCandidates: Array<SalesOrder>;
  chartOfAccount?: Maybe<ChartOfAccounts>;
  chartOfAccounts: Array<ChartOfAccounts>;
  /** Vendor form 'Check Status' action — validates a GSTIN before save. */
  checkGstinStatus: GstinCheckResult;
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
  employeeSalaryStructure?: Maybe<EmployeeSalaryStructure>;
  employeeSalaryStructures: Array<EmployeeSalaryStructure>;
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
  incomeStatement: IncomeStatementReport;
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
  /** Vendor form PAN lookup/verification action. */
  lookupPan: PanLookupResult;
  /**
   * Lot/Serial Traceability Report — forward and backward trace.
   * Given a lot or serial number, returns every document where it appears:
   * GRN receipts (where it entered), stock movements, and delivery orders (where it left).
   */
  lotSerialTrace: LotSerialTraceResult;
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
  onboarding?: Maybe<Onboarding>;
  onboardingForEmployee?: Maybe<Onboarding>;
  onboardings: Array<Onboarding>;
  opportunities: Array<Opportunity>;
  opportunity?: Maybe<Opportunity>;
  organization?: Maybe<Organization>;
  organizationDocuments: Array<Document>;
  organizations: Array<Organization>;
  outstandingVendorBills: Array<VendorBill>;
  packageModuleAssignment?: Maybe<PackageModuleAssignment>;
  /** All tenant/sub-tenant assignments saved for a package. */
  packageModuleAssignments: Array<PackageModuleAssignment>;
  packages: Array<Package>;
  paymentTerm?: Maybe<PaymentTerm>;
  paymentTerms: Array<PaymentTerm>;
  payrollmanagement?: Maybe<PayrollManagement>;
  payrollmanagements: Array<PayrollManagement>;
  payrolluirecord?: Maybe<PayrollUiRecord>;
  payrolluirecords: Array<PayrollUiRecord>;
  payslip?: Maybe<Payslip>;
  payslipsByEmployee: Array<Payslip>;
  payslipsByRun: Array<Payslip>;
  priceList?: Maybe<PriceList>;
  priceLists: Array<PriceList>;
  product?: Maybe<Product>;
  productCategories: Array<ProductCategory>;
  productCategory?: Maybe<ProductCategory>;
  productVariant?: Maybe<ProductVariant>;
  productVariantsByProduct: Array<ProductVariant>;
  productionplanning?: Maybe<ProductionPlanning>;
  productionplannings: Array<ProductionPlanning>;
  products: Array<Product>;
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
  quotationsByCustomer: Array<Quotation>;
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
  /** Direct child tenants of a parent (one level deep). */
  subTenants: Array<Organization>;
  /** Vendor form PAN autocomplete-as-you-type suggestions. */
  suggestPan: Array<Scalars['String']['output']>;
  systemRoles: Array<Role>;
  tag?: Maybe<Tag>;
  tags: Array<Tag>;
  taxRate?: Maybe<TaxRate>;
  taxRates: Array<TaxRate>;
  timesheetEntries: Array<TimesheetEntry>;
  timesheetEntry?: Maybe<TimesheetEntry>;
  timesheetWeeklySummary: TimesheetWeeklySummary;
  trialBalance: Array<TrialBalanceLine>;
  uom?: Maybe<Uom>;
  uoms: Array<Uom>;
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
  vendorDebitNote?: Maybe<VendorDebitNote>;
  vendorDebitNotes: Array<VendorDebitNote>;
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


export type QueryActiveSalaryStructureForEmployeeArgs = {
  employeeId: Scalars['String']['input'];
};


export type QueryAgedPayableArgs = {
  organizationId: Scalars['String']['input'];
};


export type QueryAgedReceivableArgs = {
  organizationId: Scalars['String']['input'];
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


export type QueryAppraisalArgs = {
  id: Scalars['ID']['input'];
};


export type QueryAppraisalsArgs = {
  organizationId: Scalars['String']['input'];
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


export type QueryAttributeArgs = {
  id: Scalars['ID']['input'];
};


export type QueryAttributesArgs = {
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  organizationId: Scalars['ID']['input'];
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


export type QueryBalanceSheetArgs = {
  organizationId: Scalars['String']['input'];
};


export type QueryBankArgs = {
  id: Scalars['ID']['input'];
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


export type QueryBanksArgs = {
  organizationId: Scalars['ID']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
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


export type QueryBlanketOrderArgs = {
  id: Scalars['ID']['input'];
};


export type QueryBlanketOrdersArgs = {
  organizationId: Scalars['ID']['input'];
  status?: InputMaybe<Scalars['String']['input']>;
  vendorId?: InputMaybe<Scalars['ID']['input']>;
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


export type QueryCheckGstinStatusArgs = {
  gstin: Scalars['String']['input'];
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


export type QueryEmployeeSalaryStructureArgs = {
  id: Scalars['ID']['input'];
};


export type QueryEmployeeSalaryStructuresArgs = {
  organizationId: Scalars['String']['input'];
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


export type QueryIncomeStatementArgs = {
  organizationId: Scalars['String']['input'];
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


export type QueryLookupPanArgs = {
  pan: Scalars['String']['input'];
};


export type QueryLotSerialTraceArgs = {
  lotOrSerial: Scalars['String']['input'];
  organizationId: Scalars['ID']['input'];
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


export type QueryOnboardingArgs = {
  id: Scalars['ID']['input'];
};


export type QueryOnboardingForEmployeeArgs = {
  employeeId: Scalars['String']['input'];
};


export type QueryOnboardingsArgs = {
  organizationId: Scalars['String']['input'];
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


export type QueryPackageModuleAssignmentArgs = {
  organizationId: Scalars['ID']['input'];
  packageId: Scalars['ID']['input'];
};


export type QueryPackageModuleAssignmentsArgs = {
  packageId: Scalars['ID']['input'];
};


export type QueryPaymentTermArgs = {
  id: Scalars['ID']['input'];
};


export type QueryPaymentTermsArgs = {
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
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


export type QueryPayslipArgs = {
  id: Scalars['ID']['input'];
};


export type QueryPayslipsByEmployeeArgs = {
  employeeId: Scalars['String']['input'];
};


export type QueryPayslipsByRunArgs = {
  payrollRunId: Scalars['String']['input'];
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


export type QueryProductCategoriesArgs = {
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  organizationId: Scalars['ID']['input'];
};


export type QueryProductCategoryArgs = {
  id: Scalars['ID']['input'];
};


export type QueryProductVariantArgs = {
  id: Scalars['ID']['input'];
};


export type QueryProductVariantsByProductArgs = {
  productId: Scalars['ID']['input'];
};


export type QueryProductionplanningArgs = {
  id: Scalars['ID']['input'];
};


export type QueryProductionplanningsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['String']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryProductsArgs = {
  canBePurchased?: InputMaybe<Scalars['Boolean']['input']>;
  canBeSold?: InputMaybe<Scalars['Boolean']['input']>;
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  organizationId: Scalars['ID']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
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


export type QueryQuotationsByCustomerArgs = {
  customerId: Scalars['ID']['input'];
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


export type QuerySubTenantsArgs = {
  parentOrganizationId: Scalars['ID']['input'];
};


export type QuerySuggestPanArgs = {
  partial: Scalars['String']['input'];
};


export type QueryTagArgs = {
  id: Scalars['ID']['input'];
};


export type QueryTagsArgs = {
  category?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  organizationId: Scalars['ID']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
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


export type QueryTrialBalanceArgs = {
  organizationId: Scalars['String']['input'];
};


export type QueryUomArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUomsArgs = {
  category?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  organizationId: Scalars['ID']['input'];
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


export type QueryVendorDebitNoteArgs = {
  id: Scalars['ID']['input'];
};


export type QueryVendorDebitNotesArgs = {
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
  /** Deprecated alias for customerId (legacy quotations). */
  clientId: CustomerRef;
  createdAt: Scalars['String']['output'];
  createdBy?: Maybe<Scalars['ID']['output']>;
  customerId: CustomerRef;
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

export type ReorderSchedulerProductResult = {
  __typename?: 'ReorderSchedulerProductResult';
  error?: Maybe<Scalars['String']['output']>;
  maxQty: Scalars['Float']['output'];
  minQty: Scalars['Float']['output'];
  onHandQty: Scalars['Float']['output'];
  poCreated: Scalars['Boolean']['output'];
  poId?: Maybe<Scalars['ID']['output']>;
  productId: Scalars['ID']['output'];
  productName: Scalars['String']['output'];
  qtyToOrder: Scalars['Float']['output'];
  unitPrice: Scalars['Float']['output'];
  vendorId: Scalars['ID']['output'];
};

export type ReorderSchedulerResult = {
  __typename?: 'ReorderSchedulerResult';
  products: Array<ReorderSchedulerProductResult>;
  replenished: Scalars['Int']['output'];
  scanned: Scalars['Int']['output'];
  triggered: Scalars['Boolean']['output'];
};

/** Result of the Replenish action — the draft RFQ created from the product's cheapest vendor pricelist entry. */
export type ReplenishResult = {
  __typename?: 'ReplenishResult';
  purchaseOrder: PurchaseOrder;
  quantity: Scalars['Float']['output'];
  unitPrice: Scalars['Float']['output'];
  vendorId: Scalars['ID']['output'];
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
  /** Deprecated alias for customerId. */
  clientId: Scalars['ID']['output'];
  createdAt: Scalars['String']['output'];
  createdBy?: Maybe<Scalars['ID']['output']>;
  currency?: Maybe<Scalars['String']['output']>;
  customerId: Scalars['ID']['output'];
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
  /** Running total of quantity delivered — used to gate invoice creation under delivered_quantities policy. */
  deliveredQuantity: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  /** ordered_quantities: invoice on SO confirm. delivered_quantities: invoice only after delivery validated. */
  invoicingPolicy: Scalars['String']['output'];
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
  cogsAmount?: Maybe<Scalars['Float']['output']>;
  createdAt: Scalars['String']['output'];
  customerId?: Maybe<Scalars['ID']['output']>;
  customerInvoiceId?: Maybe<Scalars['ID']['output']>;
  docDate: Scalars['String']['output'];
  docNumber: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  organizationId: Scalars['String']['output'];
  reason?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  totalAmount?: Maybe<Scalars['Float']['output']>;
};

export type SalesReturnInput = {
  cogsAmount?: InputMaybe<Scalars['Float']['input']>;
  customerId?: InputMaybe<Scalars['ID']['input']>;
  customerInvoiceId?: InputMaybe<Scalars['ID']['input']>;
  docDate: Scalars['String']['input'];
  organizationId: Scalars['String']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  totalAmount?: InputMaybe<Scalars['Float']['input']>;
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

export type StatutoryOverrides = {
  __typename?: 'StatutoryOverrides';
  esiOptIn: Scalars['Boolean']['output'];
  oldRegimeDeductions?: Maybe<Scalars['Float']['output']>;
  pfOptIn: Scalars['Boolean']['output'];
  pfRate: Scalars['Float']['output'];
  pfWageCeiling?: Maybe<Scalars['Float']['output']>;
  tdsMonthlyOverride?: Maybe<Scalars['Float']['output']>;
  tdsRegime: Scalars['String']['output'];
};

export type StatutoryOverridesInput = {
  esiOptIn?: InputMaybe<Scalars['Boolean']['input']>;
  oldRegimeDeductions?: InputMaybe<Scalars['Float']['input']>;
  pfOptIn?: InputMaybe<Scalars['Boolean']['input']>;
  pfRate?: InputMaybe<Scalars['Float']['input']>;
  pfWageCeiling?: InputMaybe<Scalars['Float']['input']>;
  tdsMonthlyOverride?: InputMaybe<Scalars['Float']['input']>;
  tdsRegime?: InputMaybe<Scalars['String']['input']>;
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

export type StructureComponent = {
  __typename?: 'StructureComponent';
  amount: Scalars['Float']['output'];
  payComponentId: Scalars['String']['output'];
};

export type StructureComponentInput = {
  amount: Scalars['Float']['input'];
  payComponentId: Scalars['String']['input'];
};

export type Tag = {
  __typename?: 'Tag';
  category?: Maybe<Scalars['String']['output']>;
  color: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  organizationId: Scalars['ID']['output'];
  updatedAt: Scalars['String']['output'];
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

export type TrialBalanceLine = {
  __typename?: 'TrialBalanceLine';
  accountCode: Scalars['String']['output'];
  accountName: Scalars['String']['output'];
  accountType: Scalars['String']['output'];
  credit: Scalars['Float']['output'];
  debit: Scalars['Float']['output'];
  net: Scalars['Float']['output'];
};

/** Unit of Measure master, e.g. Nos, Box, kg — with GST UQC for HSN/GST filing. */
export type Uom = {
  __typename?: 'Uom';
  category: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  /** Indian GST Unit Quantity Code, e.g. NOS, BOX, KGS. */
  gstUqc?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  organizationId: Scalars['ID']['output'];
  /** Ratio relative to the category's reference unit (1 for the reference unit itself). */
  ratio: Scalars['Float']['output'];
  type: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
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

export type UpdateAttributeInput = {
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['String']['input']>>;
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

export type UpdateBankInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  bankIdentifierCode?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateBlanketOrderInput = {
  currency?: InputMaybe<Scalars['String']['input']>;
  lines?: InputMaybe<Array<BlanketOrderLineInput>>;
  notes?: InputMaybe<Scalars['String']['input']>;
  validityEnd?: InputMaybe<Scalars['String']['input']>;
  validityStart?: InputMaybe<Scalars['String']['input']>;
  vendorId?: InputMaybe<Scalars['ID']['input']>;
  vendorName?: InputMaybe<Scalars['String']['input']>;
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
  allowSubTenants?: InputMaybe<Scalars['Boolean']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};

export type UpdatePackageInput = {
  durationDays: Scalars['Int']['input'];
  externalName: Scalars['String']['input'];
  packageName: Scalars['String']['input'];
  price: Scalars['Float']['input'];
};

export type UpdatePaymentTermInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  dueDays?: InputMaybe<Scalars['Int']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateProductCategoryInput = {
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  parentId?: InputMaybe<Scalars['ID']['input']>;
};

export type UpdateProductInput = {
  attributeLines?: InputMaybe<Array<ProductAttributeLineInput>>;
  barcode?: InputMaybe<Scalars['String']['input']>;
  canBeExpensed?: InputMaybe<Scalars['Boolean']['input']>;
  canBePurchased?: InputMaybe<Scalars['Boolean']['input']>;
  canBeSold?: InputMaybe<Scalars['Boolean']['input']>;
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  costPrice?: InputMaybe<Scalars['Float']['input']>;
  expenseAccount?: InputMaybe<Scalars['String']['input']>;
  hsnSac?: InputMaybe<Scalars['String']['input']>;
  images?: InputMaybe<Array<Scalars['String']['input']>>;
  incomeAccount?: InputMaybe<Scalars['String']['input']>;
  internalReference?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  packagings?: InputMaybe<Array<ProductPackagingLineInput>>;
  productType?: InputMaybe<Scalars['String']['input']>;
  purchaseTaxIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  purchaseUomId?: InputMaybe<Scalars['ID']['input']>;
  reorderingRules?: InputMaybe<Array<ProductReorderingRuleInput>>;
  salesPrice?: InputMaybe<Scalars['Float']['input']>;
  salesTaxIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  status?: InputMaybe<Scalars['String']['input']>;
  stockAccount?: InputMaybe<Scalars['String']['input']>;
  trackInventory?: InputMaybe<Scalars['Boolean']['input']>;
  trackingMethod?: InputMaybe<Scalars['String']['input']>;
  uomId?: InputMaybe<Scalars['ID']['input']>;
  vendorPricelist?: InputMaybe<Array<VendorPricelistLineInput>>;
};

export type UpdateProductVariantInput = {
  barcode?: InputMaybe<Scalars['String']['input']>;
  extraPrice?: InputMaybe<Scalars['Float']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  sku?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateProjectInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};

export type UpdatePurchaseOrderInput = {
  agreement?: InputMaybe<Scalars['String']['input']>;
  askConfirmation?: InputMaybe<Scalars['Boolean']['input']>;
  /** ordered_quantities | received_quantities — controls when a vendor bill can be created. */
  billControlPolicy?: InputMaybe<Scalars['String']['input']>;
  buyerId?: InputMaybe<Scalars['ID']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  deliverToLocationId?: InputMaybe<Scalars['ID']['input']>;
  deliveryDate?: InputMaybe<Scalars['String']['input']>;
  deliveryTerms?: InputMaybe<Scalars['String']['input']>;
  exchangeRate?: InputMaybe<Scalars['Float']['input']>;
  expectedArrival?: InputMaybe<Scalars['String']['input']>;
  /** Current version value from the client — if provided and mismatched, the update is rejected (optimistic concurrency). */
  expectedVersion?: InputMaybe<Scalars['Int']['input']>;
  fiscalPosition?: InputMaybe<Scalars['String']['input']>;
  gstTreatment?: InputMaybe<Scalars['String']['input']>;
  incoterms?: InputMaybe<Scalars['String']['input']>;
  items?: InputMaybe<Array<PoLineItemInput>>;
  notes?: InputMaybe<Scalars['String']['input']>;
  orderDeadline?: InputMaybe<Scalars['String']['input']>;
  paymentTerms?: InputMaybe<Scalars['ID']['input']>;
  projectId?: InputMaybe<Scalars['ID']['input']>;
  sourceDocument?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  vendorId?: InputMaybe<Scalars['ID']['input']>;
  vendorReference?: InputMaybe<Scalars['String']['input']>;
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
  customerId?: InputMaybe<Scalars['ID']['input']>;
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
  customerId?: InputMaybe<Scalars['ID']['input']>;
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
  /** Updated when a delivery order is dispatched/delivered — tracks total quantity fulfilled. */
  deliveredQuantity?: InputMaybe<Scalars['Float']['input']>;
  /** ordered_quantities | delivered_quantities. */
  invoicingPolicy?: InputMaybe<Scalars['String']['input']>;
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

export type UpdateTagInput = {
  category?: InputMaybe<Scalars['String']['input']>;
  color?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
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

export type UpdateUomInput = {
  category?: InputMaybe<Scalars['String']['input']>;
  gstUqc?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  ratio?: InputMaybe<Scalars['Float']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateUserInput = {
  currency?: InputMaybe<Scalars['String']['input']>;
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

export type UpdateVendorDebitNoteInput = {
  notes?: InputMaybe<Scalars['String']['input']>;
  reason?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateVendorInput = {
  accounting?: InputMaybe<VendorAccountingInfoInput>;
  address?: InputMaybe<VendorAddressInput>;
  bankAccounts?: InputMaybe<Array<VendorBankAccountInput>>;
  city?: InputMaybe<Scalars['String']['input']>;
  contactPerson?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  createTags?: InputMaybe<Array<CreateTagInline>>;
  email?: InputMaybe<Scalars['String']['input']>;
  gstTreatment?: InputMaybe<Scalars['String']['input']>;
  gstin?: InputMaybe<Scalars['String']['input']>;
  internalNotes?: InputMaybe<Scalars['String']['input']>;
  inventory?: InputMaybe<VendorInventoryInfoInput>;
  misc?: InputMaybe<VendorMiscInfoInput>;
  mobile?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  pan?: InputMaybe<Scalars['String']['input']>;
  paymentTerms?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  purchase?: InputMaybe<VendorPurchaseInfoInput>;
  sales?: InputMaybe<VendorSalesInfoInput>;
  state?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  tags?: InputMaybe<Array<VendorTagInput>>;
  taxNumber?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  warnings?: InputMaybe<VendorWarningsInput>;
  website?: InputMaybe<Scalars['String']['input']>;
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
  currency?: Maybe<Scalars['String']['output']>;
  dashboardPreferences?: Maybe<DashboardPreferences>;
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastName: Scalars['String']['output'];
  modulePermissions?: Maybe<Array<ModulePermission>>;
  organizationId?: Maybe<Scalars['ID']['output']>;
  /** Modules enabled for the user's organization via their assigned package. */
  packageEnabledModules: Array<PackageEnabledModule>;
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

export type VariantAttributeValue = {
  __typename?: 'VariantAttributeValue';
  attributeId: Scalars['ID']['output'];
  attributeName: Scalars['String']['output'];
  value: Scalars['String']['output'];
  valueId: Scalars['ID']['output'];
};

export type Vendor = {
  __typename?: 'Vendor';
  accounting?: Maybe<VendorAccountingInfo>;
  address?: Maybe<VendorAddress>;
  bankAccounts: Array<VendorBankAccount>;
  city?: Maybe<Scalars['String']['output']>;
  /** Legacy flat fields — retained for backward compatibility with existing reports/PDF templates. */
  contactPerson?: Maybe<Scalars['String']['output']>;
  country?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  createdBy?: Maybe<User>;
  email?: Maybe<Scalars['String']['output']>;
  gstTreatment: Scalars['String']['output'];
  gstin?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  internalNotes?: Maybe<Scalars['String']['output']>;
  inventory?: Maybe<VendorInventoryInfo>;
  misc?: Maybe<VendorMiscInfo>;
  mobile?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  /** draft | submitted | approval_declined | approved — omitted on legacy rows means approved */
  orgApprovalStatus: Scalars['String']['output'];
  organizationId: Scalars['ID']['output'];
  pan?: Maybe<Scalars['String']['output']>;
  paymentTerms?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  purchase?: Maybe<VendorPurchaseInfo>;
  sales?: Maybe<VendorSalesInfo>;
  seqNo?: Maybe<Scalars['String']['output']>;
  state?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  tags: Array<VendorTag>;
  taxNumber?: Maybe<Scalars['String']['output']>;
  type: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
  warnings?: Maybe<VendorWarnings>;
  website?: Maybe<Scalars['String']['output']>;
  zipCode?: Maybe<Scalars['String']['output']>;
};

export type VendorAccountingInfo = {
  __typename?: 'VendorAccountingInfo';
  accountPayable?: Maybe<Scalars['String']['output']>;
  accountReceivable?: Maybe<Scalars['String']['output']>;
  /** How invoices/bills should be sent to this vendor by default: email | postal | manual. */
  invoiceSendingPreference: Scalars['String']['output'];
};

export type VendorAccountingInfoInput = {
  accountPayable?: InputMaybe<Scalars['String']['input']>;
  accountReceivable?: InputMaybe<Scalars['String']['input']>;
  invoiceSendingPreference?: InputMaybe<Scalars['String']['input']>;
};

export type VendorAddress = {
  __typename?: 'VendorAddress';
  city?: Maybe<Scalars['String']['output']>;
  country?: Maybe<Scalars['String']['output']>;
  street?: Maybe<Scalars['String']['output']>;
  zip?: Maybe<Scalars['String']['output']>;
};

export type VendorAddressInput = {
  city?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  street?: InputMaybe<Scalars['String']['input']>;
  zip?: InputMaybe<Scalars['String']['input']>;
};

export type VendorBankAccount = {
  __typename?: 'VendorBankAccount';
  accountHolder?: Maybe<Scalars['String']['output']>;
  accountNumber: Scalars['String']['output'];
  bank?: Maybe<Bank>;
  bankId?: Maybe<Scalars['ID']['output']>;
  bankName?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  currency: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  sendMoney: Scalars['Boolean']['output'];
};

/** Nested "Create Bank Account" modal (Step 6). If bankId is omitted, provide newBank to create the master Bank record inline. */
export type VendorBankAccountInput = {
  /** Defaults to the vendor's name when omitted. */
  accountHolder?: InputMaybe<Scalars['String']['input']>;
  accountNumber: Scalars['String']['input'];
  bankId?: InputMaybe<Scalars['ID']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  newBank?: InputMaybe<CreateBankInline>;
  sendMoney?: InputMaybe<Scalars['Boolean']['input']>;
};

export type VendorBill = {
  __typename?: 'VendorBill';
  billDate: Scalars['String']['output'];
  billNumber: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  debitNotesApplied: Scalars['Float']['output'];
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

export type VendorDebitNote = {
  __typename?: 'VendorDebitNote';
  appliedAmount: Scalars['Float']['output'];
  billAllocations: Array<VendorDebitNoteBillAllocation>;
  createdAt?: Maybe<Scalars['String']['output']>;
  debitDate: Scalars['String']['output'];
  debitNumber: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['ID']['output'];
  purchaseOrderId?: Maybe<Scalars['ID']['output']>;
  reason?: Maybe<Scalars['String']['output']>;
  remainingAmount: Scalars['Float']['output'];
  status: Scalars['String']['output'];
  totalAmount: Scalars['Float']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  vendor?: Maybe<Vendor>;
  vendorBillId?: Maybe<Scalars['ID']['output']>;
  vendorId: Scalars['ID']['output'];
};

export type VendorDebitNoteBillAllocation = {
  __typename?: 'VendorDebitNoteBillAllocation';
  amount: Scalars['Float']['output'];
  appliedAt?: Maybe<Scalars['String']['output']>;
  billId: Scalars['ID']['output'];
};

export type VendorInventoryInfo = {
  __typename?: 'VendorInventoryInfo';
  customerLocation?: Maybe<Scalars['String']['output']>;
  subcontractingLocation?: Maybe<Scalars['String']['output']>;
  vendorLocation?: Maybe<Scalars['String']['output']>;
};

export type VendorInventoryInfoInput = {
  customerLocation?: InputMaybe<Scalars['String']['input']>;
  subcontractingLocation?: InputMaybe<Scalars['String']['input']>;
  vendorLocation?: InputMaybe<Scalars['String']['input']>;
};

export type VendorMiscInfo = {
  __typename?: 'VendorMiscInfo';
  /** Free-text display name of the operating company, independent of the linked Organization record. */
  company?: Maybe<Scalars['String']['output']>;
  companyId?: Maybe<Scalars['ID']['output']>;
  reference?: Maybe<Scalars['String']['output']>;
  slaPolicies?: Maybe<Scalars['String']['output']>;
};

export type VendorMiscInfoInput = {
  company?: InputMaybe<Scalars['String']['input']>;
  companyId?: InputMaybe<Scalars['ID']['input']>;
  reference?: InputMaybe<Scalars['String']['input']>;
  slaPolicies?: InputMaybe<Scalars['String']['input']>;
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

export type VendorPricelistLine = {
  __typename?: 'VendorPricelistLine';
  id: Scalars['ID']['output'];
  leadTimeDays: Scalars['Int']['output'];
  minQty: Scalars['Float']['output'];
  price: Scalars['Float']['output'];
  vendor?: Maybe<Vendor>;
  vendorId: Scalars['ID']['output'];
};

export type VendorPricelistLineInput = {
  leadTimeDays?: InputMaybe<Scalars['Int']['input']>;
  minQty?: InputMaybe<Scalars['Float']['input']>;
  price: Scalars['Float']['input'];
  vendorId: Scalars['ID']['input'];
};

export type VendorPurchaseInfo = {
  __typename?: 'VendorPurchaseInfo';
  buyer?: Maybe<Scalars['ID']['output']>;
  fiscalPosition?: Maybe<Scalars['String']['output']>;
  /** Bank account id (within this vendor's bankAccounts[]) used as the default payment method. */
  paymentMethod?: Maybe<Scalars['ID']['output']>;
  paymentTerms?: Maybe<Scalars['ID']['output']>;
};

export type VendorPurchaseInfoInput = {
  buyer?: InputMaybe<Scalars['ID']['input']>;
  fiscalPosition?: InputMaybe<Scalars['String']['input']>;
  paymentMethod?: InputMaybe<Scalars['ID']['input']>;
  paymentTerms?: InputMaybe<Scalars['ID']['input']>;
};

export type VendorSalesInfo = {
  __typename?: 'VendorSalesInfo';
  deliveryMethod?: Maybe<Scalars['String']['output']>;
  paymentMethod?: Maybe<Scalars['String']['output']>;
  paymentTerms?: Maybe<Scalars['ID']['output']>;
  priceList?: Maybe<Scalars['ID']['output']>;
  salesperson?: Maybe<Scalars['ID']['output']>;
};

export type VendorSalesInfoInput = {
  deliveryMethod?: InputMaybe<Scalars['String']['input']>;
  paymentMethod?: InputMaybe<Scalars['String']['input']>;
  paymentTerms?: InputMaybe<Scalars['ID']['input']>;
  priceList?: InputMaybe<Scalars['ID']['input']>;
  salesperson?: InputMaybe<Scalars['ID']['input']>;
};

export type VendorTag = {
  __typename?: 'VendorTag';
  category?: Maybe<Scalars['String']['output']>;
  color: Scalars['String']['output'];
  name: Scalars['String']['output'];
  tagId: Scalars['ID']['output'];
};

export type VendorTagInput = {
  tagId: Scalars['ID']['input'];
};

/** No Message / Warning / Blocking Message. */
export type VendorWarnings = {
  __typename?: 'VendorWarnings';
  picking: Scalars['String']['output'];
  purchaseOrder: Scalars['String']['output'];
  salesOrder: Scalars['String']['output'];
};

export type VendorWarningsInput = {
  picking?: InputMaybe<Scalars['String']['input']>;
  purchaseOrder?: InputMaybe<Scalars['String']['input']>;
  salesOrder?: InputMaybe<Scalars['String']['input']>;
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