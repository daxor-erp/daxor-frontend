/* eslint-disable */
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
  vendorId?: InputMaybe<Scalars['ID']['input']>;
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

export type CreateOrganizationInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  code?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  phone?: InputMaybe<Scalars['String']['input']>;
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

export type Mutation = {
  __typename?: 'Mutation';
  _empty?: Maybe<Scalars['String']['output']>;
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
  cancelMaterialReceipt: MaterialReceipt;
  cancelReturnAuthorization: ReturnAuthorization;
  cancelStockAdjustment: StockAdjustment;
  cancelStockTransfer: StockTransfer;
  confirmMaterialReceipt: MaterialReceipt;
  confirmStockAdjustment: StockAdjustment;
  confirmStockTransfer: StockTransfer;
  createApplicant: Applicant;
  createAsset: Asset;
  createAttendance: Attendance;
  createBankAccount: BankAccount;
  createBankStatementLine: BankStatementLine;
  createCareer: Career;
  createCashBank: CashBank;
  createChartOfAccount: ChartOfAccounts;
  createClient: Client;
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
  createInternalOrder: InternalOrder;
  createInventoryControl: InventoryControl;
  createInventoryReturn: InventoryReturn;
  createItem: Item;
  createLeaveApplication: LeaveApplication;
  createLeaveEnrollment: LeaveEnrollment;
  createLeaveReinstatement: LeaveReinstatement;
  createLeaveType: LeaveType;
  createMaterialReceipt: MaterialReceipt;
  createOrganization: Organization;
  createPayrollManagement: PayrollManagement;
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
  deleteApplicant: Scalars['Boolean']['output'];
  deleteAsset: Scalars['Boolean']['output'];
  deleteAttendance: Attendance;
  deleteBankStatementLine: Scalars['Boolean']['output'];
  deleteCareer: Scalars['Boolean']['output'];
  deleteChartOfAccount: Scalars['Boolean']['output'];
  deleteClient: Scalars['Boolean']['output'];
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
  deleteInternalOrder: Scalars['Boolean']['output'];
  deleteInventoryReturn: Scalars['Boolean']['output'];
  deleteItem: Item;
  deleteLeaveApplication: LeaveApplication;
  deleteLeaveEnrollment: LeaveEnrollment;
  deleteLeaveReinstatement: LeaveReinstatement;
  deleteLeaveType: LeaveType;
  deleteMaterialReceipt: Scalars['Boolean']['output'];
  deleteOrganization: Organization;
  deletePayrollManagement: Scalars['Boolean']['output'];
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
  postFinanceChargeAssessment: FinanceChargeAssessment;
  receivePurchaseOrder: PurchaseOrder;
  receiveReturnAuthorizationGoods: ReturnAuthorization;
  reconcileCashBank: CashBank;
  refundCashSale: SalesOrder;
  register: AuthPayload;
  rejectLeaveApplication: LeaveApplication;
  rejectLeaveReinstatement: LeaveReinstatement;
  rejectReturnAuthorization: ReturnAuthorization;
  seedIndividualPriceListFromCatalog: IndividualPriceList;
  seedSystemRoles: Array<Role>;
  sendQuotation: SendQuotationResult;
  submitPurchaseOrder: PurchaseOrder;
  transferBankFunds: BankTransferResult;
  updateApplicant: Applicant;
  updateAsset: Asset;
  updateAttendance: Attendance;
  updateBankAccount: BankAccount;
  updateCareer: Career;
  updateChartOfAccount: ChartOfAccounts;
  updateClient: Client;
  updateCustomer: Customer;
  updateCustomerInvoice: CustomerInvoice;
  updateCustomerPayment: CustomerPayment;
  updateDVS: Dvs;
  updateDeliveryChallan: DeliveryChallan;
  updateEPM: Epm;
  updateExciseInvoice: ExciseInvoice;
  updateExtraction: Extraction;
  updateGoodsReceipt: GoodsReceipt;
  updateIPInspection: IpInspection;
  updateInternalOrder: InternalOrder;
  updateInventoryControl: InventoryControl;
  updateInventoryReturn: InventoryReturn;
  updateItem: Item;
  updateLeaveApplication: LeaveApplication;
  updateLeaveEnrollment: LeaveEnrollment;
  updateLeaveReinstatement: LeaveReinstatement;
  updateLeaveType: LeaveType;
  updateMaterialReceipt: MaterialReceipt;
  updateOrganization: Organization;
  updatePayrollManagement: PayrollManagement;
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


export type MutationAdjustStockArgs = {
  binLocation: Scalars['String']['input'];
  itemId: Scalars['String']['input'];
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


export type MutationConfirmMaterialReceiptArgs = {
  id: Scalars['ID']['input'];
};


export type MutationConfirmStockAdjustmentArgs = {
  id: Scalars['ID']['input'];
};


export type MutationConfirmStockTransferArgs = {
  id: Scalars['ID']['input'];
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


export type MutationCreateMaterialReceiptArgs = {
  input: CreateMaterialReceiptInput;
};


export type MutationCreateOrganizationArgs = {
  input: CreateOrganizationInput;
};


export type MutationCreatePayrollManagementArgs = {
  input: PayrollManagementInput;
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


export type MutationDeleteCareerArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteChartOfAccountArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteClientArgs = {
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


export type MutationDeleteInternalOrderArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteInventoryReturnArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteItemArgs = {
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


export type MutationDeleteMaterialReceiptArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteOrganizationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeletePayrollManagementArgs = {
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


export type MutationPostFinanceChargeAssessmentArgs = {
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


export type MutationSeedIndividualPriceListFromCatalogArgs = {
  customerId: Scalars['ID']['input'];
  organizationId: Scalars['String']['input'];
};


export type MutationSendQuotationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationSubmitPurchaseOrderArgs = {
  id: Scalars['ID']['input'];
};


export type MutationTransferBankFundsArgs = {
  input: BankTransferInput;
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


export type MutationUpdateGoodsReceiptArgs = {
  id: Scalars['ID']['input'];
  input: GoodsReceiptInput;
};


export type MutationUpdateIpInspectionArgs = {
  id: Scalars['ID']['input'];
  input: IpInspectionInput;
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


export type MutationUpdateMaterialReceiptArgs = {
  id: Scalars['ID']['input'];
  input: UpdateMaterialReceiptInput;
};


export type MutationUpdateOrganizationArgs = {
  id: Scalars['ID']['input'];
  input: UpdateOrganizationInput;
};


export type MutationUpdatePayrollManagementArgs = {
  id: Scalars['ID']['input'];
  input: PayrollManagementInput;
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

export type Organization = {
  __typename?: 'Organization';
  address?: Maybe<Scalars['String']['output']>;
  code?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  email?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  phone?: Maybe<Scalars['String']['output']>;
  seqNo: Scalars['String']['output'];
  status: Scalars['String']['output'];
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
  status: Scalars['String']['output'];
};

export type PayrollManagementInput = {
  docDate: Scalars['String']['input'];
  organizationId: Scalars['String']['input'];
  status?: InputMaybe<Scalars['String']['input']>;
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
  createdAt: Scalars['String']['output'];
  docDate: Scalars['String']['output'];
  docNumber: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  organizationId: Scalars['String']['output'];
  status: Scalars['String']['output'];
};

export type ProductionPlanningInput = {
  docDate: Scalars['String']['input'];
  organizationId: Scalars['String']['input'];
  status?: InputMaybe<Scalars['String']['input']>;
};

export type Project = {
  __typename?: 'Project';
  createdAt?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  endDate?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
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
  leaveApplication?: Maybe<LeaveApplication>;
  leaveApplications: Array<LeaveApplication>;
  leaveEnrollment?: Maybe<LeaveEnrollment>;
  leaveEnrollments: Array<LeaveEnrollment>;
  leaveReinstatement?: Maybe<LeaveReinstatement>;
  leaveReinstatements: Array<LeaveReinstatement>;
  leaveType?: Maybe<LeaveType>;
  leaveTypes: Array<LeaveType>;
  lowStockItems: Array<InventoryControl>;
  materialreceipt?: Maybe<MaterialReceipt>;
  materialreceipts: Array<MaterialReceipt>;
  materialreceiptsByPO: Array<MaterialReceipt>;
  me?: Maybe<User>;
  organization?: Maybe<Organization>;
  organizations: Array<Organization>;
  outstandingVendorBills: Array<VendorBill>;
  payrollmanagement?: Maybe<PayrollManagement>;
  payrollmanagements: Array<PayrollManagement>;
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
  status: Scalars['String']['output'];
};

export type SalaryProcessingInput = {
  docDate: Scalars['String']['input'];
  organizationId: Scalars['String']['input'];
  status?: InputMaybe<Scalars['String']['input']>;
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
  organizationId: Scalars['String']['input'];
  warehouseId: Scalars['String']['input'];
};

export type WarehouseInput = {
  address: Scalars['String']['input'];
  capacity: Scalars['Float']['input'];
  contactNumber: Scalars['String']['input'];
  location: Scalars['String']['input'];
  managerName: Scalars['String']['input'];
  organizationId: Scalars['String']['input'];
  warehouseCode: Scalars['String']['input'];
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

export type RegisterMutationVariables = Exact<{
  input: RegisterInput;
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'AuthPayload', token: string, user: { __typename?: 'User', id: string, email: string, firstName: string, lastName: string, roles?: Array<string> | null, organizationId?: string | null } } };

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'AuthPayload', token: string, user: { __typename?: 'User', id: string, email: string, firstName: string, lastName: string, roles?: Array<string> | null, organizationId?: string | null } } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: string, email: string, firstName: string, lastName: string, roles?: Array<string> | null, organizationId?: string | null } | null };

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


export type GetUserQuery = { __typename?: 'Query', user?: { __typename?: 'User', id: string, seqNo?: string | null, email: string, firstName: string, lastName: string, userType?: string | null, roles?: Array<string> | null, status: string, organizationId?: string | null, createdAt: string } | null };

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

export type GetOrganizationsQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetOrganizationsQuery = { __typename?: 'Query', organizations: Array<{ __typename?: 'Organization', id: string, seqNo: string, name: string, code?: string | null, address?: string | null, phone?: string | null, email?: string | null, status: string, createdAt: string }> };

export type GetOrganizationQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetOrganizationQuery = { __typename?: 'Query', organization?: { __typename?: 'Organization', id: string, seqNo: string, name: string, code?: string | null, address?: string | null, phone?: string | null, email?: string | null, status: string, createdAt: string } | null };

export type CreateOrganizationMutationVariables = Exact<{
  input: CreateOrganizationInput;
}>;


export type CreateOrganizationMutation = { __typename?: 'Mutation', createOrganization: { __typename?: 'Organization', id: string, name: string, code?: string | null, status: string } };

export type UpdateOrganizationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateOrganizationInput;
}>;


export type UpdateOrganizationMutation = { __typename?: 'Mutation', updateOrganization: { __typename?: 'Organization', id: string, name: string, status: string } };

export type DeleteOrganizationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteOrganizationMutation = { __typename?: 'Mutation', deleteOrganization: { __typename?: 'Organization', id: string } };

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


export type GetVendorsQuery = { __typename?: 'Query', vendors: Array<{ __typename?: 'Vendor', id: string, seqNo?: string | null, name: string, contactPerson?: string | null, email?: string | null, phone?: string | null, address?: string | null, organizationId: string, status: string, createdAt: string }> };

export type GetVendorQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetVendorQuery = { __typename?: 'Query', vendor?: { __typename?: 'Vendor', id: string, seqNo?: string | null, name: string, contactPerson?: string | null, email?: string | null, phone?: string | null, address?: string | null, organizationId: string, status: string, createdAt: string } | null };

export type CreateVendorMutationVariables = Exact<{
  input: CreateVendorInput;
}>;


export type CreateVendorMutation = { __typename?: 'Mutation', createVendor: { __typename?: 'Vendor', id: string, name: string, status: string } };

export type UpdateVendorMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateVendorInput;
}>;


export type UpdateVendorMutation = { __typename?: 'Mutation', updateVendor: { __typename?: 'Vendor', id: string, name: string, status: string } };

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


export type GetProjectsQuery = { __typename?: 'Query', projects: Array<{ __typename?: 'Project', id: string, seqNo?: string | null, name: string, description?: string | null, startDate?: string | null, endDate?: string | null, status: string, organizationId: string, createdAt?: string | null }> };

export type GetProjectQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetProjectQuery = { __typename?: 'Query', project?: { __typename?: 'Project', id: string, seqNo?: string | null, name: string, description?: string | null, startDate?: string | null, endDate?: string | null, status: string, organizationId: string, createdAt?: string | null } | null };

export type CreateProjectMutationVariables = Exact<{
  input: CreateProjectInput;
}>;


export type CreateProjectMutation = { __typename?: 'Mutation', createProject: { __typename?: 'Project', id: string, name: string, status: string } };

export type UpdateProjectMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateProjectInput;
}>;


export type UpdateProjectMutation = { __typename?: 'Mutation', updateProject: { __typename?: 'Project', id: string, name: string, status: string } };

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


export type GetSalesOrdersQuery = { __typename?: 'Query', salesorders: Array<{ __typename?: 'SalesOrder', id: string, seqNo: string, customerId: string, projectId?: string | null, totalAmount: number, status: string, orderDate: string, organizationId: string, cashSale: boolean, refundedAt?: string | null, refundAmount?: number | null, createdAt: string }> };

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


export type GetChartOfAccountsQuery = { __typename?: 'Query', chartOfAccounts: Array<{ __typename?: 'ChartOfAccounts', id: string, accountCode: string, accountName: string, accountType: string, parentAccount?: string | null, level: number, isActive: boolean, createdAt: string }> };

export type CreateGeneralLedgerMutationVariables = Exact<{
  input: GeneralLedgerInput;
}>;


export type CreateGeneralLedgerMutation = { __typename?: 'Mutation', createGeneralLedger: { __typename?: 'GeneralLedger', id: string, transactionNumber: string, status: string } };

export type CreateChartOfAccountMutationVariables = Exact<{
  input: ChartOfAccountsInput;
}>;


export type CreateChartOfAccountMutation = { __typename?: 'Mutation', createChartOfAccount: { __typename?: 'ChartOfAccounts', id: string, accountCode: string, accountName: string } };

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


export type GetInventoryControlsQuery = { __typename?: 'Query', inventoryControls: Array<{ __typename?: 'InventoryControl', id: string, itemId: string, itemName: string, binLocation: string, quantity: number, unit: string, minStockLevel: number, maxStockLevel: number, reorderPoint: number, warehouseId: string, stockStatus: string, createdAt: string }> };

export type GetLowStockItemsQueryVariables = Exact<{
  organizationId: Scalars['String']['input'];
}>;


export type GetLowStockItemsQuery = { __typename?: 'Query', lowStockItems: Array<{ __typename?: 'InventoryControl', id: string, itemId: string, itemName: string, quantity: number, reorderPoint: number, stockStatus: string }> };

export type CreateInventoryControlMutationVariables = Exact<{
  input: InventoryControlInput;
}>;


export type CreateInventoryControlMutation = { __typename?: 'Mutation', createInventoryControl: { __typename?: 'InventoryControl', id: string, itemName: string, quantity: number } };

export type AdjustStockMutationVariables = Exact<{
  itemId: Scalars['String']['input'];
  binLocation: Scalars['String']['input'];
  quantity: Scalars['Float']['input'];
  reason: Scalars['String']['input'];
}>;


export type AdjustStockMutation = { __typename?: 'Mutation', adjustStock: { __typename?: 'InventoryControl', id: string, quantity: number, stockStatus: string } };

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


export type CreateWarehouseMutation = { __typename?: 'Mutation', createWarehouse: { __typename?: 'Warehouse', id: string, warehouseCode: string, warehouseName: string } };

export type UpdateWarehouseMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: WarehouseInput;
}>;


export type UpdateWarehouseMutation = { __typename?: 'Mutation', updateWarehouse: { __typename?: 'Warehouse', id: string, warehouseCode: string, warehouseName: string, location: string, address: string, capacity: number, managerName: string, contactNumber: string, warehouseType: string, isActive: boolean } };

export type CreateWarehouseBinMutationVariables = Exact<{
  input: WarehouseBinInput;
}>;


export type CreateWarehouseBinMutation = { __typename?: 'Mutation', createWarehouseBin: { __typename?: 'WarehouseBin', id: string, binCode: string, binLocation: string } };

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


export type GetProductionPlanningsQuery = { __typename?: 'Query', productionplannings: Array<{ __typename?: 'ProductionPlanning', id: string, docNumber: string, docDate: string, status: string, createdAt: string }> };

export type CreateProductionPlanningMutationVariables = Exact<{
  input: ProductionPlanningInput;
}>;


export type CreateProductionPlanningMutation = { __typename?: 'Mutation', createProductionPlanning: { __typename?: 'ProductionPlanning', id: string, docNumber: string } };

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


export type CreateGoodsReceiptMutation = { __typename?: 'Mutation', createGoodsReceipt: { __typename?: 'GoodsReceipt', id: string, docNumber: string } };

export type GetGrNsQueryVariables = Exact<{
  organizationId: Scalars['ID']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetGrNsQuery = { __typename?: 'Query', grns: Array<{ __typename?: 'GRN', id: string, grnNumber: string, purchaseOrderId?: string | null, vendorId?: string | null, vendorName?: string | null, receivedDate: string, notes?: string | null, status: string, organizationId: string, createdAt?: string | null, lineItems: Array<{ __typename?: 'GRNLineItem', itemDescription: string, orderedQty: number, receivedQty: number, unitPrice?: number | null }> }> };

export type CreateGrnMutationVariables = Exact<{
  input: CreateGrnInput;
}>;


export type CreateGrnMutation = { __typename?: 'Mutation', createGRN: { __typename?: 'GRN', id: string, grnNumber: string } };

export type GetDeliveryChallansQueryVariables = Exact<{
  organizationId: Scalars['String']['input'];
}>;


export type GetDeliveryChallansQuery = { __typename?: 'Query', deliverychallans: Array<{ __typename?: 'DeliveryChallan', id: string, docNumber: string, docDate: string, status: string, createdAt: string }> };

export type CreateDeliveryChallanMutationVariables = Exact<{
  input: DeliveryChallanInput;
}>;


export type CreateDeliveryChallanMutation = { __typename?: 'Mutation', createDeliveryChallan: { __typename?: 'DeliveryChallan', id: string, docNumber: string } };

export type GetSalesReturnsQueryVariables = Exact<{
  organizationId: Scalars['String']['input'];
}>;


export type GetSalesReturnsQuery = { __typename?: 'Query', salesreturns: Array<{ __typename?: 'SalesReturn', id: string, docNumber: string, docDate: string, status: string, createdAt: string }> };

export type CreateSalesReturnMutationVariables = Exact<{
  input: SalesReturnInput;
}>;


export type CreateSalesReturnMutation = { __typename?: 'Mutation', createSalesReturn: { __typename?: 'SalesReturn', id: string, docNumber: string } };

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

export type GetPayrollManagementsQueryVariables = Exact<{
  organizationId: Scalars['String']['input'];
}>;


export type GetPayrollManagementsQuery = { __typename?: 'Query', payrollmanagements: Array<{ __typename?: 'PayrollManagement', id: string, docNumber: string, docDate: string, status: string, createdAt: string }> };

export type CreatePayrollManagementMutationVariables = Exact<{
  input: PayrollManagementInput;
}>;


export type CreatePayrollManagementMutation = { __typename?: 'Mutation', createPayrollManagement: { __typename?: 'PayrollManagement', id: string, docNumber: string } };

export type GetSalaryProcessingsQueryVariables = Exact<{
  organizationId: Scalars['String']['input'];
}>;


export type GetSalaryProcessingsQuery = { __typename?: 'Query', salaryprocessings: Array<{ __typename?: 'SalaryProcessing', id: string, docNumber: string, docDate: string, status: string, createdAt: string }> };

export type CreateSalaryProcessingMutationVariables = Exact<{
  input: SalaryProcessingInput;
}>;


export type CreateSalaryProcessingMutation = { __typename?: 'Mutation', createSalaryProcessing: { __typename?: 'SalaryProcessing', id: string, docNumber: string } };

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

/**
 * __useGetLeaveTypesQuery__
 *
 * To run a query within a React component, call `useGetLeaveTypesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLeaveTypesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLeaveTypesQuery({
 *   variables: {
 *      organizationId: // value for 'organizationId'
 *      activeOnly: // value for 'activeOnly'
 *   },
 * });
 */
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

/**
 * __useCreateLeaveTypeMutation__
 *
 * To run a mutation, you first call `useCreateLeaveTypeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateLeaveTypeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createLeaveTypeMutation, { data, loading, error }] = useCreateLeaveTypeMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
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

/**
 * __useUpdateLeaveTypeMutation__
 *
 * To run a mutation, you first call `useUpdateLeaveTypeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateLeaveTypeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateLeaveTypeMutation, { data, loading, error }] = useUpdateLeaveTypeMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
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

/**
 * __useDeleteLeaveTypeMutation__
 *
 * To run a mutation, you first call `useDeleteLeaveTypeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteLeaveTypeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteLeaveTypeMutation, { data, loading, error }] = useDeleteLeaveTypeMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
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

/**
 * __useGetLeaveEnrollmentsQuery__
 *
 * To run a query within a React component, call `useGetLeaveEnrollmentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLeaveEnrollmentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLeaveEnrollmentsQuery({
 *   variables: {
 *      organizationId: // value for 'organizationId'
 *      userId: // value for 'userId'
 *      calendarYear: // value for 'calendarYear'
 *   },
 * });
 */
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

/**
 * __useCreateLeaveEnrollmentMutation__
 *
 * To run a mutation, you first call `useCreateLeaveEnrollmentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateLeaveEnrollmentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createLeaveEnrollmentMutation, { data, loading, error }] = useCreateLeaveEnrollmentMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
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

/**
 * __useUpdateLeaveEnrollmentMutation__
 *
 * To run a mutation, you first call `useUpdateLeaveEnrollmentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateLeaveEnrollmentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateLeaveEnrollmentMutation, { data, loading, error }] = useUpdateLeaveEnrollmentMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
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

/**
 * __useDeleteLeaveEnrollmentMutation__
 *
 * To run a mutation, you first call `useDeleteLeaveEnrollmentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteLeaveEnrollmentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteLeaveEnrollmentMutation, { data, loading, error }] = useDeleteLeaveEnrollmentMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
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

/**
 * __useGetLeaveApplicationsQuery__
 *
 * To run a query within a React component, call `useGetLeaveApplicationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLeaveApplicationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLeaveApplicationsQuery({
 *   variables: {
 *      organizationId: // value for 'organizationId'
 *      userId: // value for 'userId'
 *      status: // value for 'status'
 *   },
 * });
 */
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

/**
 * __useCreateLeaveApplicationMutation__
 *
 * To run a mutation, you first call `useCreateLeaveApplicationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateLeaveApplicationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createLeaveApplicationMutation, { data, loading, error }] = useCreateLeaveApplicationMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
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

/**
 * __useUpdateLeaveApplicationMutation__
 *
 * To run a mutation, you first call `useUpdateLeaveApplicationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateLeaveApplicationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateLeaveApplicationMutation, { data, loading, error }] = useUpdateLeaveApplicationMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
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

/**
 * __useApproveLeaveApplicationMutation__
 *
 * To run a mutation, you first call `useApproveLeaveApplicationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useApproveLeaveApplicationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [approveLeaveApplicationMutation, { data, loading, error }] = useApproveLeaveApplicationMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
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

/**
 * __useRejectLeaveApplicationMutation__
 *
 * To run a mutation, you first call `useRejectLeaveApplicationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRejectLeaveApplicationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [rejectLeaveApplicationMutation, { data, loading, error }] = useRejectLeaveApplicationMutation({
 *   variables: {
 *      id: // value for 'id'
 *      reason: // value for 'reason'
 *   },
 * });
 */
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

/**
 * __useDeleteLeaveApplicationMutation__
 *
 * To run a mutation, you first call `useDeleteLeaveApplicationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteLeaveApplicationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteLeaveApplicationMutation, { data, loading, error }] = useDeleteLeaveApplicationMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
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

/**
 * __useGetLeaveReinstatementsQuery__
 *
 * To run a query within a React component, call `useGetLeaveReinstatementsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLeaveReinstatementsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLeaveReinstatementsQuery({
 *   variables: {
 *      organizationId: // value for 'organizationId'
 *      userId: // value for 'userId'
 *      status: // value for 'status'
 *   },
 * });
 */
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

/**
 * __useCreateLeaveReinstatementMutation__
 *
 * To run a mutation, you first call `useCreateLeaveReinstatementMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateLeaveReinstatementMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createLeaveReinstatementMutation, { data, loading, error }] = useCreateLeaveReinstatementMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
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

/**
 * __useApproveLeaveReinstatementMutation__
 *
 * To run a mutation, you first call `useApproveLeaveReinstatementMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useApproveLeaveReinstatementMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [approveLeaveReinstatementMutation, { data, loading, error }] = useApproveLeaveReinstatementMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
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

/**
 * __useRejectLeaveReinstatementMutation__
 *
 * To run a mutation, you first call `useRejectLeaveReinstatementMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRejectLeaveReinstatementMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [rejectLeaveReinstatementMutation, { data, loading, error }] = useRejectLeaveReinstatementMutation({
 *   variables: {
 *      id: // value for 'id'
 *      reviewNotes: // value for 'reviewNotes'
 *   },
 * });
 */
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

/**
 * __useDeleteLeaveReinstatementMutation__
 *
 * To run a mutation, you first call `useDeleteLeaveReinstatementMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteLeaveReinstatementMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteLeaveReinstatementMutation, { data, loading, error }] = useDeleteLeaveReinstatementMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteLeaveReinstatementMutation(baseOptions?: Apollo.MutationHookOptions<DeleteLeaveReinstatementMutation, DeleteLeaveReinstatementMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteLeaveReinstatementMutation, DeleteLeaveReinstatementMutationVariables>(DeleteLeaveReinstatementDocument, options);
      }
export type DeleteLeaveReinstatementMutationHookResult = ReturnType<typeof useDeleteLeaveReinstatementMutation>;
export type DeleteLeaveReinstatementMutationResult = Apollo.MutationResult<DeleteLeaveReinstatementMutation>;
export type DeleteLeaveReinstatementMutationOptions = Apollo.BaseMutationOptions<DeleteLeaveReinstatementMutation, DeleteLeaveReinstatementMutationVariables>;
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
    }
  }
}
    `;
export type RegisterMutationFn = Apollo.MutationFunction<RegisterMutation, RegisterMutationVariables>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
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
    }
  }
}
    `;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
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
  }
}
    `;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
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

/**
 * __useGetUsersQuery__
 *
 * To run a query within a React component, call `useGetUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUsersQuery({
 *   variables: {
 *      organizationId: // value for 'organizationId'
 *      page: // value for 'page'
 *      limit: // value for 'limit'
 *      search: // value for 'search'
 *   },
 * });
 */
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
    createdAt
  }
}
    `;

/**
 * __useGetUserQuery__
 *
 * To run a query within a React component, call `useGetUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
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

/**
 * __useCreateUserMutation__
 *
 * To run a mutation, you first call `useCreateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUserMutation, { data, loading, error }] = useCreateUserMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
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

/**
 * __useUpdateUserMutation__
 *
 * To run a mutation, you first call `useUpdateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserMutation, { data, loading, error }] = useUpdateUserMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
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

/**
 * __useDeleteUserMutation__
 *
 * To run a mutation, you first call `useDeleteUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteUserMutation, { data, loading, error }] = useDeleteUserMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteUserMutation(baseOptions?: Apollo.MutationHookOptions<DeleteUserMutation, DeleteUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteUserMutation, DeleteUserMutationVariables>(DeleteUserDocument, options);
      }
export type DeleteUserMutationHookResult = ReturnType<typeof useDeleteUserMutation>;
export type DeleteUserMutationResult = Apollo.MutationResult<DeleteUserMutation>;
export type DeleteUserMutationOptions = Apollo.BaseMutationOptions<DeleteUserMutation, DeleteUserMutationVariables>;
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

/**
 * __useGetOrganizationsQuery__
 *
 * To run a query within a React component, call `useGetOrganizationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetOrganizationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetOrganizationsQuery({
 *   variables: {
 *      page: // value for 'page'
 *      limit: // value for 'limit'
 *      search: // value for 'search'
 *   },
 * });
 */
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
    createdAt
  }
}
    `;

/**
 * __useGetOrganizationQuery__
 *
 * To run a query within a React component, call `useGetOrganizationQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetOrganizationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetOrganizationQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
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

/**
 * __useCreateOrganizationMutation__
 *
 * To run a mutation, you first call `useCreateOrganizationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateOrganizationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createOrganizationMutation, { data, loading, error }] = useCreateOrganizationMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateOrganizationMutation(baseOptions?: Apollo.MutationHookOptions<CreateOrganizationMutation, CreateOrganizationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateOrganizationMutation, CreateOrganizationMutationVariables>(CreateOrganizationDocument, options);
      }
export type CreateOrganizationMutationHookResult = ReturnType<typeof useCreateOrganizationMutation>;
export type CreateOrganizationMutationResult = Apollo.MutationResult<CreateOrganizationMutation>;
export type CreateOrganizationMutationOptions = Apollo.BaseMutationOptions<CreateOrganizationMutation, CreateOrganizationMutationVariables>;
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

/**
 * __useUpdateOrganizationMutation__
 *
 * To run a mutation, you first call `useUpdateOrganizationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateOrganizationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateOrganizationMutation, { data, loading, error }] = useUpdateOrganizationMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
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

/**
 * __useDeleteOrganizationMutation__
 *
 * To run a mutation, you first call `useDeleteOrganizationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteOrganizationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteOrganizationMutation, { data, loading, error }] = useDeleteOrganizationMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteOrganizationMutation(baseOptions?: Apollo.MutationHookOptions<DeleteOrganizationMutation, DeleteOrganizationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteOrganizationMutation, DeleteOrganizationMutationVariables>(DeleteOrganizationDocument, options);
      }
export type DeleteOrganizationMutationHookResult = ReturnType<typeof useDeleteOrganizationMutation>;
export type DeleteOrganizationMutationResult = Apollo.MutationResult<DeleteOrganizationMutation>;
export type DeleteOrganizationMutationOptions = Apollo.BaseMutationOptions<DeleteOrganizationMutation, DeleteOrganizationMutationVariables>;
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

/**
 * __useGetItemsQuery__
 *
 * To run a query within a React component, call `useGetItemsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetItemsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetItemsQuery({
 *   variables: {
 *      organizationId: // value for 'organizationId'
 *      page: // value for 'page'
 *      limit: // value for 'limit'
 *      search: // value for 'search'
 *   },
 * });
 */
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

/**
 * __useGetItemQuery__
 *
 * To run a query within a React component, call `useGetItemQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetItemQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetItemQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
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

/**
 * __useCreateItemMutation__
 *
 * To run a mutation, you first call `useCreateItemMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateItemMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createItemMutation, { data, loading, error }] = useCreateItemMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
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

/**
 * __useUpdateItemMutation__
 *
 * To run a mutation, you first call `useUpdateItemMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateItemMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateItemMutation, { data, loading, error }] = useUpdateItemMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
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

/**
 * __useDeleteItemMutation__
 *
 * To run a mutation, you first call `useDeleteItemMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteItemMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteItemMutation, { data, loading, error }] = useDeleteItemMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
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
    status
    createdAt
  }
}
    `;

/**
 * __useGetVendorsQuery__
 *
 * To run a query within a React component, call `useGetVendorsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetVendorsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetVendorsQuery({
 *   variables: {
 *      organizationId: // value for 'organizationId'
 *      page: // value for 'page'
 *      limit: // value for 'limit'
 *      search: // value for 'search'
 *   },
 * });
 */
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
    organizationId
    status
    createdAt
  }
}
    `;

/**
 * __useGetVendorQuery__
 *
 * To run a query within a React component, call `useGetVendorQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetVendorQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetVendorQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
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
export const CreateVendorDocument = gql`
    mutation CreateVendor($input: CreateVendorInput!) {
  createVendor(input: $input) {
    id
    name
    status
  }
}
    `;
export type CreateVendorMutationFn = Apollo.MutationFunction<CreateVendorMutation, CreateVendorMutationVariables>;

/**
 * __useCreateVendorMutation__
 *
 * To run a mutation, you first call `useCreateVendorMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateVendorMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createVendorMutation, { data, loading, error }] = useCreateVendorMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
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
    status
  }
}
    `;
export type UpdateVendorMutationFn = Apollo.MutationFunction<UpdateVendorMutation, UpdateVendorMutationVariables>;

/**
 * __useUpdateVendorMutation__
 *
 * To run a mutation, you first call `useUpdateVendorMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateVendorMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateVendorMutation, { data, loading, error }] = useUpdateVendorMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateVendorMutation(baseOptions?: Apollo.MutationHookOptions<UpdateVendorMutation, UpdateVendorMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateVendorMutation, UpdateVendorMutationVariables>(UpdateVendorDocument, options);
      }
export type UpdateVendorMutationHookResult = ReturnType<typeof useUpdateVendorMutation>;
export type UpdateVendorMutationResult = Apollo.MutationResult<UpdateVendorMutation>;
export type UpdateVendorMutationOptions = Apollo.BaseMutationOptions<UpdateVendorMutation, UpdateVendorMutationVariables>;
export const DeleteVendorDocument = gql`
    mutation DeleteVendor($id: ID!) {
  deleteVendor(id: $id)
}
    `;
export type DeleteVendorMutationFn = Apollo.MutationFunction<DeleteVendorMutation, DeleteVendorMutationVariables>;

/**
 * __useDeleteVendorMutation__
 *
 * To run a mutation, you first call `useDeleteVendorMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteVendorMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteVendorMutation, { data, loading, error }] = useDeleteVendorMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
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
    status
    organizationId
    createdAt
  }
}
    `;

/**
 * __useGetProjectsQuery__
 *
 * To run a query within a React component, call `useGetProjectsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProjectsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProjectsQuery({
 *   variables: {
 *      organizationId: // value for 'organizationId'
 *      page: // value for 'page'
 *      limit: // value for 'limit'
 *      search: // value for 'search'
 *   },
 * });
 */
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
    status
    organizationId
    createdAt
  }
}
    `;

/**
 * __useGetProjectQuery__
 *
 * To run a query within a React component, call `useGetProjectQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProjectQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProjectQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
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
    status
  }
}
    `;
export type CreateProjectMutationFn = Apollo.MutationFunction<CreateProjectMutation, CreateProjectMutationVariables>;

/**
 * __useCreateProjectMutation__
 *
 * To run a mutation, you first call `useCreateProjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateProjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createProjectMutation, { data, loading, error }] = useCreateProjectMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateProjectMutation(baseOptions?: Apollo.MutationHookOptions<CreateProjectMutation, CreateProjectMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateProjectMutation, CreateProjectMutationVariables>(CreateProjectDocument, options);
      }
export type CreateProjectMutationHookResult = ReturnType<typeof useCreateProjectMutation>;
export type CreateProjectMutationResult = Apollo.MutationResult<CreateProjectMutation>;
export type CreateProjectMutationOptions = Apollo.BaseMutationOptions<CreateProjectMutation, CreateProjectMutationVariables>;
export const UpdateProjectDocument = gql`
    mutation UpdateProject($id: ID!, $input: UpdateProjectInput!) {
  updateProject(id: $id, input: $input) {
    id
    name
    status
  }
}
    `;
export type UpdateProjectMutationFn = Apollo.MutationFunction<UpdateProjectMutation, UpdateProjectMutationVariables>;

/**
 * __useUpdateProjectMutation__
 *
 * To run a mutation, you first call `useUpdateProjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProjectMutation, { data, loading, error }] = useUpdateProjectMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
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

/**
 * __useDeleteProjectMutation__
 *
 * To run a mutation, you first call `useDeleteProjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteProjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteProjectMutation, { data, loading, error }] = useDeleteProjectMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
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

/**
 * __useGetPurchaseOrdersQuery__
 *
 * To run a query within a React component, call `useGetPurchaseOrdersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPurchaseOrdersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPurchaseOrdersQuery({
 *   variables: {
 *      organizationId: // value for 'organizationId'
 *      page: // value for 'page'
 *      limit: // value for 'limit'
 *      status: // value for 'status'
 *   },
 * });
 */
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

/**
 * __useCreatePurchaseOrderMutation__
 *
 * To run a mutation, you first call `useCreatePurchaseOrderMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePurchaseOrderMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPurchaseOrderMutation, { data, loading, error }] = useCreatePurchaseOrderMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
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

/**
 * __useUpdatePurchaseOrderMutation__
 *
 * To run a mutation, you first call `useUpdatePurchaseOrderMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePurchaseOrderMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePurchaseOrderMutation, { data, loading, error }] = useUpdatePurchaseOrderMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
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

/**
 * __useSubmitPurchaseOrderMutation__
 *
 * To run a mutation, you first call `useSubmitPurchaseOrderMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSubmitPurchaseOrderMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [submitPurchaseOrderMutation, { data, loading, error }] = useSubmitPurchaseOrderMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
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

/**
 * __useApprovePurchaseOrderMutation__
 *
 * To run a mutation, you first call `useApprovePurchaseOrderMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useApprovePurchaseOrderMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [approvePurchaseOrderMutation, { data, loading, error }] = useApprovePurchaseOrderMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
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

/**
 * __useReceivePurchaseOrderMutation__
 *
 * To run a mutation, you first call `useReceivePurchaseOrderMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useReceivePurchaseOrderMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [receivePurchaseOrderMutation, { data, loading, error }] = useReceivePurchaseOrderMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
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

/**
 * __useBillPurchaseOrderMutation__
 *
 * To run a mutation, you first call `useBillPurchaseOrderMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useBillPurchaseOrderMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [billPurchaseOrderMutation, { data, loading, error }] = useBillPurchaseOrderMutation({
 *   variables: {
 *      id: // value for 'id'
 *      billDate: // value for 'billDate'
 *      dueDate: // value for 'dueDate'
 *   },
 * });
 */
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

/**
 * __useGetSalesOrdersQuery__
 *
 * To run a query within a React component, call `useGetSalesOrdersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSalesOrdersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSalesOrdersQuery({
 *   variables: {
 *      organizationId: // value for 'organizationId'
 *      page: // value for 'page'
 *      limit: // value for 'limit'
 *      status: // value for 'status'
 *      cashSale: // value for 'cashSale'
 *   },
 * });
 */
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

/**
 * __useGetSalesOrderQuery__
 *
 * To run a query within a React component, call `useGetSalesOrderQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSalesOrderQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSalesOrderQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
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

/**
 * __useCreateSalesOrderMutation__
 *
 * To run a mutation, you first call `useCreateSalesOrderMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSalesOrderMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSalesOrderMutation, { data, loading, error }] = useCreateSalesOrderMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
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

/**
 * __useUpdateSalesOrderMutation__
 *
 * To run a mutation, you first call `useUpdateSalesOrderMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateSalesOrderMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateSalesOrderMutation, { data, loading, error }] = useUpdateSalesOrderMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
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

/**
 * __useGetCustomerInvoicesQuery__
 *
 * To run a query within a React component, call `useGetCustomerInvoicesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCustomerInvoicesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCustomerInvoicesQuery({
 *   variables: {
 *      organizationId: // value for 'organizationId'
 *      page: // value for 'page'
 *      limit: // value for 'limit'
 *      status: // value for 'status'
 *      customerId: // value for 'customerId'
 *   },
 * });
 */
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

/**
 * __useGetCustomerPaymentsQuery__
 *
 * To run a query within a React component, call `useGetCustomerPaymentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCustomerPaymentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCustomerPaymentsQuery({
 *   variables: {
 *      organizationId: // value for 'organizationId'
 *      customerId: // value for 'customerId'
 *      page: // value for 'page'
 *      limit: // value for 'limit'
 *   },
 * });
 */
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

/**
 * __useCreateCustomerPaymentMutation__
 *
 * To run a mutation, you first call `useCreateCustomerPaymentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCustomerPaymentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCustomerPaymentMutation, { data, loading, error }] = useCreateCustomerPaymentMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
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

/**
 * __useCreateCustomerInvoiceMutation__
 *
 * To run a mutation, you first call `useCreateCustomerInvoiceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCustomerInvoiceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCustomerInvoiceMutation, { data, loading, error }] = useCreateCustomerInvoiceMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
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

/**
 * __useCreateCashSaleMutation__
 *
 * To run a mutation, you first call `useCreateCashSaleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCashSaleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCashSaleMutation, { data, loading, error }] = useCreateCashSaleMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
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

/**
 * __useGetCashSalesRefundCandidatesQuery__
 *
 * To run a query within a React component, call `useGetCashSalesRefundCandidatesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCashSalesRefundCandidatesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCashSalesRefundCandidatesQuery({
 *   variables: {
 *      organizationId: // value for 'organizationId'
 *   },
 * });
 */
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

/**
 * __useRefundCashSaleMutation__
 *
 * To run a mutation, you first call `useRefundCashSaleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRefundCashSaleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [refundCashSaleMutation, { data, loading, error }] = useRefundCashSaleMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
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

/**
 * __useUpdateCustomerInvoiceMutation__
 *
 * To run a mutation, you first call `useUpdateCustomerInvoiceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCustomerInvoiceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCustomerInvoiceMutation, { data, loading, error }] = useUpdateCustomerInvoiceMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
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

/**
 * __useGetAttendancesQuery__
 *
 * To run a query within a React component, call `useGetAttendancesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAttendancesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAttendancesQuery({
 *   variables: {
 *      organizationId: // value for 'organizationId'
 *      userId: // value for 'userId'
 *      page: // value for 'page'
 *      limit: // value for 'limit'
 *   },
 * });
 */
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

/**
 * __useCreateAttendanceMutation__
 *
 * To run a mutation, you first call `useCreateAttendanceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateAttendanceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createAttendanceMutation, { data, loading, error }] = useCreateAttendanceMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
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

/**
 * __useGetGeneralLedgersQuery__
 *
 * To run a query within a React component, call `useGetGeneralLedgersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetGeneralLedgersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetGeneralLedgersQuery({
 *   variables: {
 *      organizationId: // value for 'organizationId'
 *      fiscalYear: // value for 'fiscalYear'
 *      status: // value for 'status'
 *   },
 * });
 */
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
    accountName
    accountType
    parentAccount
    level
    isActive
    createdAt
  }
}
    `;

/**
 * __useGetChartOfAccountsQuery__
 *
 * To run a query within a React component, call `useGetChartOfAccountsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetChartOfAccountsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetChartOfAccountsQuery({
 *   variables: {
 *      organizationId: // value for 'organizationId'
 *      accountType: // value for 'accountType'
 *   },
 * });
 */
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

/**
 * __useCreateGeneralLedgerMutation__
 *
 * To run a mutation, you first call `useCreateGeneralLedgerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateGeneralLedgerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createGeneralLedgerMutation, { data, loading, error }] = useCreateGeneralLedgerMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
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
    accountName
  }
}
    `;
export type CreateChartOfAccountMutationFn = Apollo.MutationFunction<CreateChartOfAccountMutation, CreateChartOfAccountMutationVariables>;

/**
 * __useCreateChartOfAccountMutation__
 *
 * To run a mutation, you first call `useCreateChartOfAccountMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateChartOfAccountMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createChartOfAccountMutation, { data, loading, error }] = useCreateChartOfAccountMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
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

/**
 * __useGetCashBanksQuery__
 *
 * To run a query within a React component, call `useGetCashBanksQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCashBanksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCashBanksQuery({
 *   variables: {
 *      organizationId: // value for 'organizationId'
 *      reconciliationStatus: // value for 'reconciliationStatus'
 *      bankAccount: // value for 'bankAccount'
 *   },
 * });
 */
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

/**
 * __useGetBankAccountsQuery__
 *
 * To run a query within a React component, call `useGetBankAccountsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBankAccountsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBankAccountsQuery({
 *   variables: {
 *      organizationId: // value for 'organizationId'
 *   },
 * });
 */
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

/**
 * __useCreateCashBankMutation__
 *
 * To run a mutation, you first call `useCreateCashBankMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCashBankMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCashBankMutation, { data, loading, error }] = useCreateCashBankMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
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

/**
 * __useCreateBankAccountMutation__
 *
 * To run a mutation, you first call `useCreateBankAccountMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateBankAccountMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createBankAccountMutation, { data, loading, error }] = useCreateBankAccountMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
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

/**
 * __useReconcileCashBankMutation__
 *
 * To run a mutation, you first call `useReconcileCashBankMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useReconcileCashBankMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [reconcileCashBankMutation, { data, loading, error }] = useReconcileCashBankMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
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

/**
 * __useGetBankStatementLinesQuery__
 *
 * To run a query within a React component, call `useGetBankStatementLinesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBankStatementLinesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBankStatementLinesQuery({
 *   variables: {
 *      organizationId: // value for 'organizationId'
 *      bankAccount: // value for 'bankAccount'
 *      onlyUnmatched: // value for 'onlyUnmatched'
 *   },
 * });
 */
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

/**
 * __useCreateBankStatementLineMutation__
 *
 * To run a mutation, you first call `useCreateBankStatementLineMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateBankStatementLineMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createBankStatementLineMutation, { data, loading, error }] = useCreateBankStatementLineMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
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

/**
 * __useDeleteBankStatementLineMutation__
 *
 * To run a mutation, you first call `useDeleteBankStatementLineMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteBankStatementLineMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteBankStatementLineMutation, { data, loading, error }] = useDeleteBankStatementLineMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
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

/**
 * __useMatchBankStatementLineToBookMutation__
 *
 * To run a mutation, you first call `useMatchBankStatementLineToBookMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMatchBankStatementLineToBookMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [matchBankStatementLineToBookMutation, { data, loading, error }] = useMatchBankStatementLineToBookMutation({
 *   variables: {
 *      bankStatementLineId: // value for 'bankStatementLineId'
 *      cashBankId: // value for 'cashBankId'
 *   },
 * });
 */
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

/**
 * __useGetReconciliationRulesQuery__
 *
 * To run a query within a React component, call `useGetReconciliationRulesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetReconciliationRulesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetReconciliationRulesQuery({
 *   variables: {
 *      organizationId: // value for 'organizationId'
 *   },
 * });
 */
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

/**
 * __useCreateReconciliationRuleMutation__
 *
 * To run a mutation, you first call `useCreateReconciliationRuleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateReconciliationRuleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createReconciliationRuleMutation, { data, loading, error }] = useCreateReconciliationRuleMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
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

/**
 * __useUpdateReconciliationRuleMutation__
 *
 * To run a mutation, you first call `useUpdateReconciliationRuleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateReconciliationRuleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateReconciliationRuleMutation, { data, loading, error }] = useUpdateReconciliationRuleMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
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

/**
 * __useDeleteReconciliationRuleMutation__
 *
 * To run a mutation, you first call `useDeleteReconciliationRuleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteReconciliationRuleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteReconciliationRuleMutation, { data, loading, error }] = useDeleteReconciliationRuleMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
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

/**
 * __useTransferBankFundsMutation__
 *
 * To run a mutation, you first call `useTransferBankFundsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useTransferBankFundsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [transferBankFundsMutation, { data, loading, error }] = useTransferBankFundsMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
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
    stockStatus
    createdAt
  }
}
    `;

/**
 * __useGetInventoryControlsQuery__
 *
 * To run a query within a React component, call `useGetInventoryControlsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetInventoryControlsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetInventoryControlsQuery({
 *   variables: {
 *      organizationId: // value for 'organizationId'
 *      warehouseId: // value for 'warehouseId'
 *      stockStatus: // value for 'stockStatus'
 *   },
 * });
 */
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

/**
 * __useGetLowStockItemsQuery__
 *
 * To run a query within a React component, call `useGetLowStockItemsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLowStockItemsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLowStockItemsQuery({
 *   variables: {
 *      organizationId: // value for 'organizationId'
 *   },
 * });
 */
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

/**
 * __useCreateInventoryControlMutation__
 *
 * To run a mutation, you first call `useCreateInventoryControlMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateInventoryControlMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createInventoryControlMutation, { data, loading, error }] = useCreateInventoryControlMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateInventoryControlMutation(baseOptions?: Apollo.MutationHookOptions<CreateInventoryControlMutation, CreateInventoryControlMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateInventoryControlMutation, CreateInventoryControlMutationVariables>(CreateInventoryControlDocument, options);
      }
export type CreateInventoryControlMutationHookResult = ReturnType<typeof useCreateInventoryControlMutation>;
export type CreateInventoryControlMutationResult = Apollo.MutationResult<CreateInventoryControlMutation>;
export type CreateInventoryControlMutationOptions = Apollo.BaseMutationOptions<CreateInventoryControlMutation, CreateInventoryControlMutationVariables>;
export const AdjustStockDocument = gql`
    mutation AdjustStock($itemId: String!, $binLocation: String!, $quantity: Float!, $reason: String!) {
  adjustStock(
    itemId: $itemId
    binLocation: $binLocation
    quantity: $quantity
    reason: $reason
  ) {
    id
    quantity
    stockStatus
  }
}
    `;
export type AdjustStockMutationFn = Apollo.MutationFunction<AdjustStockMutation, AdjustStockMutationVariables>;

/**
 * __useAdjustStockMutation__
 *
 * To run a mutation, you first call `useAdjustStockMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAdjustStockMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [adjustStockMutation, { data, loading, error }] = useAdjustStockMutation({
 *   variables: {
 *      itemId: // value for 'itemId'
 *      binLocation: // value for 'binLocation'
 *      quantity: // value for 'quantity'
 *      reason: // value for 'reason'
 *   },
 * });
 */
export function useAdjustStockMutation(baseOptions?: Apollo.MutationHookOptions<AdjustStockMutation, AdjustStockMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AdjustStockMutation, AdjustStockMutationVariables>(AdjustStockDocument, options);
      }
export type AdjustStockMutationHookResult = ReturnType<typeof useAdjustStockMutation>;
export type AdjustStockMutationResult = Apollo.MutationResult<AdjustStockMutation>;
export type AdjustStockMutationOptions = Apollo.BaseMutationOptions<AdjustStockMutation, AdjustStockMutationVariables>;
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

/**
 * __useGetWarehousesQuery__
 *
 * To run a query within a React component, call `useGetWarehousesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetWarehousesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetWarehousesQuery({
 *   variables: {
 *      organizationId: // value for 'organizationId'
 *      isActive: // value for 'isActive'
 *   },
 * });
 */
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

/**
 * __useGetWarehouseBinsQuery__
 *
 * To run a query within a React component, call `useGetWarehouseBinsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetWarehouseBinsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetWarehouseBinsQuery({
 *   variables: {
 *      organizationId: // value for 'organizationId'
 *      warehouseId: // value for 'warehouseId'
 *   },
 * });
 */
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
  }
}
    `;
export type CreateWarehouseMutationFn = Apollo.MutationFunction<CreateWarehouseMutation, CreateWarehouseMutationVariables>;

/**
 * __useCreateWarehouseMutation__
 *
 * To run a mutation, you first call `useCreateWarehouseMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateWarehouseMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createWarehouseMutation, { data, loading, error }] = useCreateWarehouseMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
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

/**
 * __useUpdateWarehouseMutation__
 *
 * To run a mutation, you first call `useUpdateWarehouseMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateWarehouseMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateWarehouseMutation, { data, loading, error }] = useUpdateWarehouseMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
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
    binCode
    binLocation
  }
}
    `;
export type CreateWarehouseBinMutationFn = Apollo.MutationFunction<CreateWarehouseBinMutation, CreateWarehouseBinMutationVariables>;

/**
 * __useCreateWarehouseBinMutation__
 *
 * To run a mutation, you first call `useCreateWarehouseBinMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateWarehouseBinMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createWarehouseBinMutation, { data, loading, error }] = useCreateWarehouseBinMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateWarehouseBinMutation(baseOptions?: Apollo.MutationHookOptions<CreateWarehouseBinMutation, CreateWarehouseBinMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateWarehouseBinMutation, CreateWarehouseBinMutationVariables>(CreateWarehouseBinDocument, options);
      }
export type CreateWarehouseBinMutationHookResult = ReturnType<typeof useCreateWarehouseBinMutation>;
export type CreateWarehouseBinMutationResult = Apollo.MutationResult<CreateWarehouseBinMutation>;
export type CreateWarehouseBinMutationOptions = Apollo.BaseMutationOptions<CreateWarehouseBinMutation, CreateWarehouseBinMutationVariables>;
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

/**
 * __useGetCustomersQuery__
 *
 * To run a query within a React component, call `useGetCustomersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCustomersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCustomersQuery({
 *   variables: {
 *      organizationId: // value for 'organizationId'
 *   },
 * });
 */
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

/**
 * __useCreateCustomerMutation__
 *
 * To run a mutation, you first call `useCreateCustomerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCustomerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCustomerMutation, { data, loading, error }] = useCreateCustomerMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
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

/**
 * __useUpdateCustomerMutation__
 *
 * To run a mutation, you first call `useUpdateCustomerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCustomerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCustomerMutation, { data, loading, error }] = useUpdateCustomerMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
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

/**
 * __useDeleteCustomerMutation__
 *
 * To run a mutation, you first call `useDeleteCustomerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteCustomerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteCustomerMutation, { data, loading, error }] = useDeleteCustomerMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
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

/**
 * __useGetReturnAuthorizationsQuery__
 *
 * To run a query within a React component, call `useGetReturnAuthorizationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetReturnAuthorizationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetReturnAuthorizationsQuery({
 *   variables: {
 *      organizationId: // value for 'organizationId'
 *      status: // value for 'status'
 *      customerId: // value for 'customerId'
 *      receiptComplete: // value for 'receiptComplete'
 *      page: // value for 'page'
 *      limit: // value for 'limit'
 *   },
 * });
 */
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

/**
 * __useApproveReturnAuthorizationMutation__
 *
 * To run a mutation, you first call `useApproveReturnAuthorizationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useApproveReturnAuthorizationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [approveReturnAuthorizationMutation, { data, loading, error }] = useApproveReturnAuthorizationMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
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

/**
 * __useRejectReturnAuthorizationMutation__
 *
 * To run a mutation, you first call `useRejectReturnAuthorizationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRejectReturnAuthorizationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [rejectReturnAuthorizationMutation, { data, loading, error }] = useRejectReturnAuthorizationMutation({
 *   variables: {
 *      id: // value for 'id'
 *      reason: // value for 'reason'
 *   },
 * });
 */
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

/**
 * __useCancelReturnAuthorizationMutation__
 *
 * To run a mutation, you first call `useCancelReturnAuthorizationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCancelReturnAuthorizationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [cancelReturnAuthorizationMutation, { data, loading, error }] = useCancelReturnAuthorizationMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
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

/**
 * __useCreateReturnAuthorizationMutation__
 *
 * To run a mutation, you first call `useCreateReturnAuthorizationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateReturnAuthorizationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createReturnAuthorizationMutation, { data, loading, error }] = useCreateReturnAuthorizationMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
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

/**
 * __useReceiveReturnAuthorizationGoodsMutation__
 *
 * To run a mutation, you first call `useReceiveReturnAuthorizationGoodsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useReceiveReturnAuthorizationGoodsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [receiveReturnAuthorizationGoodsMutation, { data, loading, error }] = useReceiveReturnAuthorizationGoodsMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
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

/**
 * __useGetCustomerRefundsQuery__
 *
 * To run a query within a React component, call `useGetCustomerRefundsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCustomerRefundsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCustomerRefundsQuery({
 *   variables: {
 *      organizationId: // value for 'organizationId'
 *      customerId: // value for 'customerId'
 *      page: // value for 'page'
 *      limit: // value for 'limit'
 *   },
 * });
 */
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

/**
 * __useCreateCustomerRefundMutation__
 *
 * To run a mutation, you first call `useCreateCustomerRefundMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCustomerRefundMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCustomerRefundMutation, { data, loading, error }] = useCreateCustomerRefundMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
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

/**
 * __useCancelCustomerRefundMutation__
 *
 * To run a mutation, you first call `useCancelCustomerRefundMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCancelCustomerRefundMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [cancelCustomerRefundMutation, { data, loading, error }] = useCancelCustomerRefundMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
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

/**
 * __useGetCustomerDepositsQuery__
 *
 * To run a query within a React component, call `useGetCustomerDepositsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCustomerDepositsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCustomerDepositsQuery({
 *   variables: {
 *      organizationId: // value for 'organizationId'
 *      customerId: // value for 'customerId'
 *      page: // value for 'page'
 *      limit: // value for 'limit'
 *   },
 * });
 */
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

/**
 * __useCreateCustomerDepositMutation__
 *
 * To run a mutation, you first call `useCreateCustomerDepositMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCustomerDepositMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCustomerDepositMutation, { data, loading, error }] = useCreateCustomerDepositMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
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

/**
 * __useCancelCustomerDepositMutation__
 *
 * To run a mutation, you first call `useCancelCustomerDepositMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCancelCustomerDepositMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [cancelCustomerDepositMutation, { data, loading, error }] = useCancelCustomerDepositMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
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

/**
 * __useGetFinanceChargeAssessmentsQuery__
 *
 * To run a query within a React component, call `useGetFinanceChargeAssessmentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFinanceChargeAssessmentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFinanceChargeAssessmentsQuery({
 *   variables: {
 *      organizationId: // value for 'organizationId'
 *      status: // value for 'status'
 *      page: // value for 'page'
 *      limit: // value for 'limit'
 *   },
 * });
 */
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

/**
 * __useDraftFinanceChargeAssessmentMutation__
 *
 * To run a mutation, you first call `useDraftFinanceChargeAssessmentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDraftFinanceChargeAssessmentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [draftFinanceChargeAssessmentMutation, { data, loading, error }] = useDraftFinanceChargeAssessmentMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
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

/**
 * __usePostFinanceChargeAssessmentMutation__
 *
 * To run a mutation, you first call `usePostFinanceChargeAssessmentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePostFinanceChargeAssessmentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [postFinanceChargeAssessmentMutation, { data, loading, error }] = usePostFinanceChargeAssessmentMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
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

/**
 * __useCancelFinanceChargeAssessmentMutation__
 *
 * To run a mutation, you first call `useCancelFinanceChargeAssessmentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCancelFinanceChargeAssessmentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [cancelFinanceChargeAssessmentMutation, { data, loading, error }] = useCancelFinanceChargeAssessmentMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
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

/**
 * __useGetPriceListsQuery__
 *
 * To run a query within a React component, call `useGetPriceListsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPriceListsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPriceListsQuery({
 *   variables: {
 *      organizationId: // value for 'organizationId'
 *      page: // value for 'page'
 *      limit: // value for 'limit'
 *   },
 * });
 */
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

/**
 * __useGeneratePriceListMutation__
 *
 * To run a mutation, you first call `useGeneratePriceListMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGeneratePriceListMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [generatePriceListMutation, { data, loading, error }] = useGeneratePriceListMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
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

/**
 * __useGetIndividualPriceListByCustomerQuery__
 *
 * To run a query within a React component, call `useGetIndividualPriceListByCustomerQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetIndividualPriceListByCustomerQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetIndividualPriceListByCustomerQuery({
 *   variables: {
 *      organizationId: // value for 'organizationId'
 *      customerId: // value for 'customerId'
 *   },
 * });
 */
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

/**
 * __useUpsertIndividualPriceListMutation__
 *
 * To run a mutation, you first call `useUpsertIndividualPriceListMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpsertIndividualPriceListMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [upsertIndividualPriceListMutation, { data, loading, error }] = useUpsertIndividualPriceListMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
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

/**
 * __useSeedIndividualPriceListFromCatalogMutation__
 *
 * To run a mutation, you first call `useSeedIndividualPriceListFromCatalogMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSeedIndividualPriceListFromCatalogMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [seedIndividualPriceListFromCatalogMutation, { data, loading, error }] = useSeedIndividualPriceListFromCatalogMutation({
 *   variables: {
 *      organizationId: // value for 'organizationId'
 *      customerId: // value for 'customerId'
 *   },
 * });
 */
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

/**
 * __useGenerateCustomerStatementQuery__
 *
 * To run a query within a React component, call `useGenerateCustomerStatementQuery` and pass it any options that fit your needs.
 * When your component renders, `useGenerateCustomerStatementQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGenerateCustomerStatementQuery({
 *   variables: {
 *      organizationId: // value for 'organizationId'
 *      customerId: // value for 'customerId'
 *      dateFrom: // value for 'dateFrom'
 *      dateTo: // value for 'dateTo'
 *   },
 * });
 */
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
    status
    createdAt
  }
}
    `;

/**
 * __useGetProductionPlanningsQuery__
 *
 * To run a query within a React component, call `useGetProductionPlanningsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProductionPlanningsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProductionPlanningsQuery({
 *   variables: {
 *      organizationId: // value for 'organizationId'
 *   },
 * });
 */
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

/**
 * __useCreateProductionPlanningMutation__
 *
 * To run a mutation, you first call `useCreateProductionPlanningMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateProductionPlanningMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createProductionPlanningMutation, { data, loading, error }] = useCreateProductionPlanningMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateProductionPlanningMutation(baseOptions?: Apollo.MutationHookOptions<CreateProductionPlanningMutation, CreateProductionPlanningMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateProductionPlanningMutation, CreateProductionPlanningMutationVariables>(CreateProductionPlanningDocument, options);
      }
export type CreateProductionPlanningMutationHookResult = ReturnType<typeof useCreateProductionPlanningMutation>;
export type CreateProductionPlanningMutationResult = Apollo.MutationResult<CreateProductionPlanningMutation>;
export type CreateProductionPlanningMutationOptions = Apollo.BaseMutationOptions<CreateProductionPlanningMutation, CreateProductionPlanningMutationVariables>;
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

/**
 * __useGetWorkOrdersQuery__
 *
 * To run a query within a React component, call `useGetWorkOrdersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetWorkOrdersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetWorkOrdersQuery({
 *   variables: {
 *      organizationId: // value for 'organizationId'
 *   },
 * });
 */
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

/**
 * __useCreateWorkOrderMutation__
 *
 * To run a mutation, you first call `useCreateWorkOrderMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateWorkOrderMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createWorkOrderMutation, { data, loading, error }] = useCreateWorkOrderMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
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

/**
 * __useGetVendorPaymentsQuery__
 *
 * To run a query within a React component, call `useGetVendorPaymentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetVendorPaymentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetVendorPaymentsQuery({
 *   variables: {
 *      organizationId: // value for 'organizationId'
 *      vendorId: // value for 'vendorId'
 *      page: // value for 'page'
 *      limit: // value for 'limit'
 *   },
 * });
 */
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

/**
 * __useGetVendorPaymentQuery__
 *
 * To run a query within a React component, call `useGetVendorPaymentQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetVendorPaymentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetVendorPaymentQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
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

/**
 * __useCreateVendorPaymentMutation__
 *
 * To run a mutation, you first call `useCreateVendorPaymentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateVendorPaymentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createVendorPaymentMutation, { data, loading, error }] = useCreateVendorPaymentMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
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

/**
 * __useUpdateVendorPaymentMutation__
 *
 * To run a mutation, you first call `useUpdateVendorPaymentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateVendorPaymentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateVendorPaymentMutation, { data, loading, error }] = useUpdateVendorPaymentMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
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

/**
 * __useDeleteVendorPaymentMutation__
 *
 * To run a mutation, you first call `useDeleteVendorPaymentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteVendorPaymentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteVendorPaymentMutation, { data, loading, error }] = useDeleteVendorPaymentMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
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

/**
 * __useGetVendorBillsQuery__
 *
 * To run a query within a React component, call `useGetVendorBillsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetVendorBillsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetVendorBillsQuery({
 *   variables: {
 *      organizationId: // value for 'organizationId'
 *      vendorId: // value for 'vendorId'
 *      status: // value for 'status'
 *      page: // value for 'page'
 *      limit: // value for 'limit'
 *   },
 * });
 */
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

/**
 * __useGetVendorBillQuery__
 *
 * To run a query within a React component, call `useGetVendorBillQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetVendorBillQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetVendorBillQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
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

/**
 * __useGetOutstandingVendorBillsQuery__
 *
 * To run a query within a React component, call `useGetOutstandingVendorBillsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetOutstandingVendorBillsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetOutstandingVendorBillsQuery({
 *   variables: {
 *      organizationId: // value for 'organizationId'
 *   },
 * });
 */
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

/**
 * __useCreateVendorBillMutation__
 *
 * To run a mutation, you first call `useCreateVendorBillMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateVendorBillMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createVendorBillMutation, { data, loading, error }] = useCreateVendorBillMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
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

/**
 * __useUpdateVendorBillMutation__
 *
 * To run a mutation, you first call `useUpdateVendorBillMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateVendorBillMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateVendorBillMutation, { data, loading, error }] = useUpdateVendorBillMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
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

/**
 * __useApproveVendorBillMutation__
 *
 * To run a mutation, you first call `useApproveVendorBillMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useApproveVendorBillMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [approveVendorBillMutation, { data, loading, error }] = useApproveVendorBillMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useApproveVendorBillMutation(baseOptions?: Apollo.MutationHookOptions<ApproveVendorBillMutation, ApproveVendorBillMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ApproveVendorBillMutation, ApproveVendorBillMutationVariables>(ApproveVendorBillDocument, options);
      }
export type ApproveVendorBillMutationHookResult = ReturnType<typeof useApproveVendorBillMutation>;
export type ApproveVendorBillMutationResult = Apollo.MutationResult<ApproveVendorBillMutation>;
export type ApproveVendorBillMutationOptions = Apollo.BaseMutationOptions<ApproveVendorBillMutation, ApproveVendorBillMutationVariables>;
export const DeleteVendorBillDocument = gql`
    mutation DeleteVendorBill($id: ID!) {
  deleteVendorBill(id: $id)
}
    `;
export type DeleteVendorBillMutationFn = Apollo.MutationFunction<DeleteVendorBillMutation, DeleteVendorBillMutationVariables>;

/**
 * __useDeleteVendorBillMutation__
 *
 * To run a mutation, you first call `useDeleteVendorBillMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteVendorBillMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteVendorBillMutation, { data, loading, error }] = useDeleteVendorBillMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
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

/**
 * __useGetMaterialReceiptsQuery__
 *
 * To run a query within a React component, call `useGetMaterialReceiptsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMaterialReceiptsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMaterialReceiptsQuery({
 *   variables: {
 *      organizationId: // value for 'organizationId'
 *      page: // value for 'page'
 *      limit: // value for 'limit'
 *      status: // value for 'status'
 *   },
 * });
 */
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

/**
 * __useGetMaterialReceiptQuery__
 *
 * To run a query within a React component, call `useGetMaterialReceiptQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMaterialReceiptQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMaterialReceiptQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
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

/**
 * __useCreateMaterialReceiptMutation__
 *
 * To run a mutation, you first call `useCreateMaterialReceiptMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateMaterialReceiptMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createMaterialReceiptMutation, { data, loading, error }] = useCreateMaterialReceiptMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
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

/**
 * __useUpdateMaterialReceiptMutation__
 *
 * To run a mutation, you first call `useUpdateMaterialReceiptMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateMaterialReceiptMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateMaterialReceiptMutation, { data, loading, error }] = useUpdateMaterialReceiptMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
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

/**
 * __useConfirmMaterialReceiptMutation__
 *
 * To run a mutation, you first call `useConfirmMaterialReceiptMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useConfirmMaterialReceiptMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [confirmMaterialReceiptMutation, { data, loading, error }] = useConfirmMaterialReceiptMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
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

/**
 * __useCancelMaterialReceiptMutation__
 *
 * To run a mutation, you first call `useCancelMaterialReceiptMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCancelMaterialReceiptMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [cancelMaterialReceiptMutation, { data, loading, error }] = useCancelMaterialReceiptMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useCancelMaterialReceiptMutation(baseOptions?: Apollo.MutationHookOptions<CancelMaterialReceiptMutation, CancelMaterialReceiptMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CancelMaterialReceiptMutation, CancelMaterialReceiptMutationVariables>(CancelMaterialReceiptDocument, options);
      }
export type CancelMaterialReceiptMutationHookResult = ReturnType<typeof useCancelMaterialReceiptMutation>;
export type CancelMaterialReceiptMutationResult = Apollo.MutationResult<CancelMaterialReceiptMutation>;
export type CancelMaterialReceiptMutationOptions = Apollo.BaseMutationOptions<CancelMaterialReceiptMutation, CancelMaterialReceiptMutationVariables>;
export const DeleteMaterialReceiptDocument = gql`
    mutation DeleteMaterialReceipt($id: ID!) {
  deleteMaterialReceipt(id: $id)
}
    `;
export type DeleteMaterialReceiptMutationFn = Apollo.MutationFunction<DeleteMaterialReceiptMutation, DeleteMaterialReceiptMutationVariables>;

/**
 * __useDeleteMaterialReceiptMutation__
 *
 * To run a mutation, you first call `useDeleteMaterialReceiptMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteMaterialReceiptMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteMaterialReceiptMutation, { data, loading, error }] = useDeleteMaterialReceiptMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
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

/**
 * __useGetGoodsReceiptsQuery__
 *
 * To run a query within a React component, call `useGetGoodsReceiptsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetGoodsReceiptsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetGoodsReceiptsQuery({
 *   variables: {
 *      organizationId: // value for 'organizationId'
 *   },
 * });
 */
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
  }
}
    `;
export type CreateGoodsReceiptMutationFn = Apollo.MutationFunction<CreateGoodsReceiptMutation, CreateGoodsReceiptMutationVariables>;

/**
 * __useCreateGoodsReceiptMutation__
 *
 * To run a mutation, you first call `useCreateGoodsReceiptMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateGoodsReceiptMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createGoodsReceiptMutation, { data, loading, error }] = useCreateGoodsReceiptMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateGoodsReceiptMutation(baseOptions?: Apollo.MutationHookOptions<CreateGoodsReceiptMutation, CreateGoodsReceiptMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateGoodsReceiptMutation, CreateGoodsReceiptMutationVariables>(CreateGoodsReceiptDocument, options);
      }
export type CreateGoodsReceiptMutationHookResult = ReturnType<typeof useCreateGoodsReceiptMutation>;
export type CreateGoodsReceiptMutationResult = Apollo.MutationResult<CreateGoodsReceiptMutation>;
export type CreateGoodsReceiptMutationOptions = Apollo.BaseMutationOptions<CreateGoodsReceiptMutation, CreateGoodsReceiptMutationVariables>;
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

/**
 * __useGetGrNsQuery__
 *
 * To run a query within a React component, call `useGetGrNsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetGrNsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetGrNsQuery({
 *   variables: {
 *      organizationId: // value for 'organizationId'
 *      page: // value for 'page'
 *      limit: // value for 'limit'
 *   },
 * });
 */
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
  }
}
    `;
export type CreateGrnMutationFn = Apollo.MutationFunction<CreateGrnMutation, CreateGrnMutationVariables>;

/**
 * __useCreateGrnMutation__
 *
 * To run a mutation, you first call `useCreateGrnMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateGrnMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createGrnMutation, { data, loading, error }] = useCreateGrnMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateGrnMutation(baseOptions?: Apollo.MutationHookOptions<CreateGrnMutation, CreateGrnMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateGrnMutation, CreateGrnMutationVariables>(CreateGrnDocument, options);
      }
export type CreateGrnMutationHookResult = ReturnType<typeof useCreateGrnMutation>;
export type CreateGrnMutationResult = Apollo.MutationResult<CreateGrnMutation>;
export type CreateGrnMutationOptions = Apollo.BaseMutationOptions<CreateGrnMutation, CreateGrnMutationVariables>;
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

/**
 * __useGetDeliveryChallansQuery__
 *
 * To run a query within a React component, call `useGetDeliveryChallansQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDeliveryChallansQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDeliveryChallansQuery({
 *   variables: {
 *      organizationId: // value for 'organizationId'
 *   },
 * });
 */
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
  }
}
    `;
export type CreateDeliveryChallanMutationFn = Apollo.MutationFunction<CreateDeliveryChallanMutation, CreateDeliveryChallanMutationVariables>;

/**
 * __useCreateDeliveryChallanMutation__
 *
 * To run a mutation, you first call `useCreateDeliveryChallanMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateDeliveryChallanMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createDeliveryChallanMutation, { data, loading, error }] = useCreateDeliveryChallanMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateDeliveryChallanMutation(baseOptions?: Apollo.MutationHookOptions<CreateDeliveryChallanMutation, CreateDeliveryChallanMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateDeliveryChallanMutation, CreateDeliveryChallanMutationVariables>(CreateDeliveryChallanDocument, options);
      }
export type CreateDeliveryChallanMutationHookResult = ReturnType<typeof useCreateDeliveryChallanMutation>;
export type CreateDeliveryChallanMutationResult = Apollo.MutationResult<CreateDeliveryChallanMutation>;
export type CreateDeliveryChallanMutationOptions = Apollo.BaseMutationOptions<CreateDeliveryChallanMutation, CreateDeliveryChallanMutationVariables>;
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

/**
 * __useGetSalesReturnsQuery__
 *
 * To run a query within a React component, call `useGetSalesReturnsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSalesReturnsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSalesReturnsQuery({
 *   variables: {
 *      organizationId: // value for 'organizationId'
 *   },
 * });
 */
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
  }
}
    `;
export type CreateSalesReturnMutationFn = Apollo.MutationFunction<CreateSalesReturnMutation, CreateSalesReturnMutationVariables>;

/**
 * __useCreateSalesReturnMutation__
 *
 * To run a mutation, you first call `useCreateSalesReturnMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSalesReturnMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSalesReturnMutation, { data, loading, error }] = useCreateSalesReturnMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateSalesReturnMutation(baseOptions?: Apollo.MutationHookOptions<CreateSalesReturnMutation, CreateSalesReturnMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateSalesReturnMutation, CreateSalesReturnMutationVariables>(CreateSalesReturnDocument, options);
      }
export type CreateSalesReturnMutationHookResult = ReturnType<typeof useCreateSalesReturnMutation>;
export type CreateSalesReturnMutationResult = Apollo.MutationResult<CreateSalesReturnMutation>;
export type CreateSalesReturnMutationOptions = Apollo.BaseMutationOptions<CreateSalesReturnMutation, CreateSalesReturnMutationVariables>;
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

/**
 * __useGetStockAdjustmentsQuery__
 *
 * To run a query within a React component, call `useGetStockAdjustmentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetStockAdjustmentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetStockAdjustmentsQuery({
 *   variables: {
 *      organizationId: // value for 'organizationId'
 *      page: // value for 'page'
 *      limit: // value for 'limit'
 *   },
 * });
 */
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

/**
 * __useCreateStockAdjustmentMutation__
 *
 * To run a mutation, you first call `useCreateStockAdjustmentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateStockAdjustmentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createStockAdjustmentMutation, { data, loading, error }] = useCreateStockAdjustmentMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
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

/**
 * __useUpdateStockAdjustmentMutation__
 *
 * To run a mutation, you first call `useUpdateStockAdjustmentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateStockAdjustmentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateStockAdjustmentMutation, { data, loading, error }] = useUpdateStockAdjustmentMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
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

/**
 * __useConfirmStockAdjustmentMutation__
 *
 * To run a mutation, you first call `useConfirmStockAdjustmentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useConfirmStockAdjustmentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [confirmStockAdjustmentMutation, { data, loading, error }] = useConfirmStockAdjustmentMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
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

/**
 * __useCancelStockAdjustmentMutation__
 *
 * To run a mutation, you first call `useCancelStockAdjustmentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCancelStockAdjustmentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [cancelStockAdjustmentMutation, { data, loading, error }] = useCancelStockAdjustmentMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
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

/**
 * __useDeleteStockAdjustmentMutation__
 *
 * To run a mutation, you first call `useDeleteStockAdjustmentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteStockAdjustmentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteStockAdjustmentMutation, { data, loading, error }] = useDeleteStockAdjustmentMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
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

/**
 * __useGetStockTransfersQuery__
 *
 * To run a query within a React component, call `useGetStockTransfersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetStockTransfersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetStockTransfersQuery({
 *   variables: {
 *      organizationId: // value for 'organizationId'
 *      page: // value for 'page'
 *      limit: // value for 'limit'
 *   },
 * });
 */
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

/**
 * __useCreateStockTransferMutation__
 *
 * To run a mutation, you first call `useCreateStockTransferMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateStockTransferMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createStockTransferMutation, { data, loading, error }] = useCreateStockTransferMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
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

/**
 * __useUpdateStockTransferMutation__
 *
 * To run a mutation, you first call `useUpdateStockTransferMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateStockTransferMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateStockTransferMutation, { data, loading, error }] = useUpdateStockTransferMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
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

/**
 * __useConfirmStockTransferMutation__
 *
 * To run a mutation, you first call `useConfirmStockTransferMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useConfirmStockTransferMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [confirmStockTransferMutation, { data, loading, error }] = useConfirmStockTransferMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
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

/**
 * __useCancelStockTransferMutation__
 *
 * To run a mutation, you first call `useCancelStockTransferMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCancelStockTransferMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [cancelStockTransferMutation, { data, loading, error }] = useCancelStockTransferMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
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

/**
 * __useDeleteStockTransferMutation__
 *
 * To run a mutation, you first call `useDeleteStockTransferMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteStockTransferMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteStockTransferMutation, { data, loading, error }] = useDeleteStockTransferMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteStockTransferMutation(baseOptions?: Apollo.MutationHookOptions<DeleteStockTransferMutation, DeleteStockTransferMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteStockTransferMutation, DeleteStockTransferMutationVariables>(DeleteStockTransferDocument, options);
      }
export type DeleteStockTransferMutationHookResult = ReturnType<typeof useDeleteStockTransferMutation>;
export type DeleteStockTransferMutationResult = Apollo.MutationResult<DeleteStockTransferMutation>;
export type DeleteStockTransferMutationOptions = Apollo.BaseMutationOptions<DeleteStockTransferMutation, DeleteStockTransferMutationVariables>;
export const GetPayrollManagementsDocument = gql`
    query GetPayrollManagements($organizationId: String!) {
  payrollmanagements(organizationId: $organizationId) {
    id
    docNumber
    docDate
    status
    createdAt
  }
}
    `;

/**
 * __useGetPayrollManagementsQuery__
 *
 * To run a query within a React component, call `useGetPayrollManagementsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPayrollManagementsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPayrollManagementsQuery({
 *   variables: {
 *      organizationId: // value for 'organizationId'
 *   },
 * });
 */
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

/**
 * __useCreatePayrollManagementMutation__
 *
 * To run a mutation, you first call `useCreatePayrollManagementMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePayrollManagementMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPayrollManagementMutation, { data, loading, error }] = useCreatePayrollManagementMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreatePayrollManagementMutation(baseOptions?: Apollo.MutationHookOptions<CreatePayrollManagementMutation, CreatePayrollManagementMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreatePayrollManagementMutation, CreatePayrollManagementMutationVariables>(CreatePayrollManagementDocument, options);
      }
export type CreatePayrollManagementMutationHookResult = ReturnType<typeof useCreatePayrollManagementMutation>;
export type CreatePayrollManagementMutationResult = Apollo.MutationResult<CreatePayrollManagementMutation>;
export type CreatePayrollManagementMutationOptions = Apollo.BaseMutationOptions<CreatePayrollManagementMutation, CreatePayrollManagementMutationVariables>;
export const GetSalaryProcessingsDocument = gql`
    query GetSalaryProcessings($organizationId: String!) {
  salaryprocessings(organizationId: $organizationId) {
    id
    docNumber
    docDate
    status
    createdAt
  }
}
    `;

/**
 * __useGetSalaryProcessingsQuery__
 *
 * To run a query within a React component, call `useGetSalaryProcessingsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSalaryProcessingsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSalaryProcessingsQuery({
 *   variables: {
 *      organizationId: // value for 'organizationId'
 *   },
 * });
 */
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

/**
 * __useCreateSalaryProcessingMutation__
 *
 * To run a mutation, you first call `useCreateSalaryProcessingMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSalaryProcessingMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSalaryProcessingMutation, { data, loading, error }] = useCreateSalaryProcessingMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateSalaryProcessingMutation(baseOptions?: Apollo.MutationHookOptions<CreateSalaryProcessingMutation, CreateSalaryProcessingMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateSalaryProcessingMutation, CreateSalaryProcessingMutationVariables>(CreateSalaryProcessingDocument, options);
      }
export type CreateSalaryProcessingMutationHookResult = ReturnType<typeof useCreateSalaryProcessingMutation>;
export type CreateSalaryProcessingMutationResult = Apollo.MutationResult<CreateSalaryProcessingMutation>;
export type CreateSalaryProcessingMutationOptions = Apollo.BaseMutationOptions<CreateSalaryProcessingMutation, CreateSalaryProcessingMutationVariables>;
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

/**
 * __useGetExtractionsQuery__
 *
 * To run a query within a React component, call `useGetExtractionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetExtractionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetExtractionsQuery({
 *   variables: {
 *      organizationId: // value for 'organizationId'
 *      status: // value for 'status'
 *   },
 * });
 */
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

/**
 * __useCreateExtractionMutation__
 *
 * To run a mutation, you first call `useCreateExtractionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateExtractionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createExtractionMutation, { data, loading, error }] = useCreateExtractionMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
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

/**
 * __useGetRawMaterialRequisitionsQuery__
 *
 * To run a query within a React component, call `useGetRawMaterialRequisitionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRawMaterialRequisitionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRawMaterialRequisitionsQuery({
 *   variables: {
 *      organizationId: // value for 'organizationId'
 *      status: // value for 'status'
 *   },
 * });
 */
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

/**
 * __useCreateRawMaterialRequisitionMutation__
 *
 * To run a mutation, you first call `useCreateRawMaterialRequisitionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateRawMaterialRequisitionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createRawMaterialRequisitionMutation, { data, loading, error }] = useCreateRawMaterialRequisitionMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
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

/**
 * __useGetClientsQuery__
 *
 * To run a query within a React component, call `useGetClientsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetClientsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetClientsQuery({
 *   variables: {
 *      organizationId: // value for 'organizationId'
 *      page: // value for 'page'
 *      limit: // value for 'limit'
 *      status: // value for 'status'
 *      search: // value for 'search'
 *   },
 * });
 */
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

/**
 * __useGetClientQuery__
 *
 * To run a query within a React component, call `useGetClientQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetClientQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetClientQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
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

/**
 * __useGetClientsByOrganizationQuery__
 *
 * To run a query within a React component, call `useGetClientsByOrganizationQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetClientsByOrganizationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetClientsByOrganizationQuery({
 *   variables: {
 *      organizationId: // value for 'organizationId'
 *   },
 * });
 */
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

/**
 * __useCreateClientMutation__
 *
 * To run a mutation, you first call `useCreateClientMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateClientMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createClientMutation, { data, loading, error }] = useCreateClientMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
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

/**
 * __useUpdateClientMutation__
 *
 * To run a mutation, you first call `useUpdateClientMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateClientMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateClientMutation, { data, loading, error }] = useUpdateClientMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
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

/**
 * __useDeleteClientMutation__
 *
 * To run a mutation, you first call `useDeleteClientMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteClientMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteClientMutation, { data, loading, error }] = useDeleteClientMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
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

/**
 * __useGetQuotationsQuery__
 *
 * To run a query within a React component, call `useGetQuotationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetQuotationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetQuotationsQuery({
 *   variables: {
 *   },
 * });
 */
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

/**
 * __useGetQuotationQuery__
 *
 * To run a query within a React component, call `useGetQuotationQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetQuotationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetQuotationQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
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

/**
 * __useGetQuotationsByOrganizationQuery__
 *
 * To run a query within a React component, call `useGetQuotationsByOrganizationQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetQuotationsByOrganizationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetQuotationsByOrganizationQuery({
 *   variables: {
 *      organizationId: // value for 'organizationId'
 *   },
 * });
 */
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

/**
 * __useGetQuotationsByClientQuery__
 *
 * To run a query within a React component, call `useGetQuotationsByClientQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetQuotationsByClientQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetQuotationsByClientQuery({
 *   variables: {
 *      clientId: // value for 'clientId'
 *   },
 * });
 */
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

/**
 * __useCreateQuotationMutation__
 *
 * To run a mutation, you first call `useCreateQuotationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateQuotationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createQuotationMutation, { data, loading, error }] = useCreateQuotationMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
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

/**
 * __useUpdateQuotationMutation__
 *
 * To run a mutation, you first call `useUpdateQuotationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateQuotationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateQuotationMutation, { data, loading, error }] = useUpdateQuotationMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
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

/**
 * __useDeleteQuotationMutation__
 *
 * To run a mutation, you first call `useDeleteQuotationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteQuotationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteQuotationMutation, { data, loading, error }] = useDeleteQuotationMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
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

/**
 * __useSendQuotationMutation__
 *
 * To run a mutation, you first call `useSendQuotationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendQuotationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendQuotationMutation, { data, loading, error }] = useSendQuotationMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
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

/**
 * __useGetProductsQuery__
 *
 * To run a query within a React component, call `useGetProductsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProductsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProductsQuery({
 *   variables: {
 *   },
 * });
 */
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

/**
 * __useGetProductQuery__
 *
 * To run a query within a React component, call `useGetProductQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProductQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProductQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
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

/**
 * __useGetProductsByOrganizationQuery__
 *
 * To run a query within a React component, call `useGetProductsByOrganizationQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProductsByOrganizationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProductsByOrganizationQuery({
 *   variables: {
 *      organizationId: // value for 'organizationId'
 *   },
 * });
 */
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

/**
 * __useCreateProductMutation__
 *
 * To run a mutation, you first call `useCreateProductMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateProductMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createProductMutation, { data, loading, error }] = useCreateProductMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
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

/**
 * __useUpdateProductMutation__
 *
 * To run a mutation, you first call `useUpdateProductMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProductMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProductMutation, { data, loading, error }] = useUpdateProductMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
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

/**
 * __useDeleteProductMutation__
 *
 * To run a mutation, you first call `useDeleteProductMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteProductMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteProductMutation, { data, loading, error }] = useDeleteProductMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
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

/**
 * __useGetVendorCreditsQuery__
 *
 * To run a query within a React component, call `useGetVendorCreditsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetVendorCreditsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetVendorCreditsQuery({
 *   variables: {
 *      organizationId: // value for 'organizationId'
 *      vendorId: // value for 'vendorId'
 *   },
 * });
 */
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

/**
 * __useCreateVendorCreditMutation__
 *
 * To run a mutation, you first call `useCreateVendorCreditMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateVendorCreditMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createVendorCreditMutation, { data, loading, error }] = useCreateVendorCreditMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
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

/**
 * __useDeleteVendorCreditMutation__
 *
 * To run a mutation, you first call `useDeleteVendorCreditMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteVendorCreditMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteVendorCreditMutation, { data, loading, error }] = useDeleteVendorCreditMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
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

/**
 * __useGetVendorPrepaymentsQuery__
 *
 * To run a query within a React component, call `useGetVendorPrepaymentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetVendorPrepaymentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetVendorPrepaymentsQuery({
 *   variables: {
 *      organizationId: // value for 'organizationId'
 *      vendorId: // value for 'vendorId'
 *   },
 * });
 */
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

/**
 * __useCreateVendorPrepaymentMutation__
 *
 * To run a mutation, you first call `useCreateVendorPrepaymentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateVendorPrepaymentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createVendorPrepaymentMutation, { data, loading, error }] = useCreateVendorPrepaymentMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
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

/**
 * __useDeleteVendorPrepaymentMutation__
 *
 * To run a mutation, you first call `useDeleteVendorPrepaymentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteVendorPrepaymentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteVendorPrepaymentMutation, { data, loading, error }] = useDeleteVendorPrepaymentMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
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

/**
 * __useGetPurchaseOrdersForBillingQuery__
 *
 * To run a query within a React component, call `useGetPurchaseOrdersForBillingQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPurchaseOrdersForBillingQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPurchaseOrdersForBillingQuery({
 *   variables: {
 *      organizationId: // value for 'organizationId'
 *   },
 * });
 */
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