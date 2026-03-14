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
  accountName: Scalars['String']['input'];
  accountNumber: Scalars['String']['input'];
  accountType: Scalars['String']['input'];
  bankName: Scalars['String']['input'];
  branchName: Scalars['String']['input'];
  currency?: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['String']['input'];
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

export type CreateCustomerInvoiceInput = {
  customerId: Scalars['ID']['input'];
  dueDate?: InputMaybe<Scalars['String']['input']>;
  invoiceDate: Scalars['String']['input'];
  organizationId: Scalars['ID']['input'];
  salesOrderId?: InputMaybe<Scalars['ID']['input']>;
  totalAmount: Scalars['Float']['input'];
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
  orderDate: Scalars['String']['input'];
  organizationId: Scalars['ID']['input'];
  projectId?: InputMaybe<Scalars['ID']['input']>;
  totalAmount: Scalars['Float']['input'];
  vendorId: Scalars['ID']['input'];
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

export type CreateUserInput = {
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  organizationId: Scalars['ID']['input'];
  password?: InputMaybe<Scalars['String']['input']>;
  roles?: InputMaybe<Array<Scalars['String']['input']>>;
  userType?: InputMaybe<Scalars['String']['input']>;
};

export type CreateVendorInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  contactPerson?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  organizationId: Scalars['ID']['input'];
  phone?: InputMaybe<Scalars['String']['input']>;
};

export type Customer = {
  __typename?: 'Customer';
  createdAt: Scalars['String']['output'];
  docDate: Scalars['String']['output'];
  docNumber: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  organizationId: Scalars['String']['output'];
  status: Scalars['String']['output'];
};

export type CustomerInput = {
  docDate: Scalars['String']['input'];
  organizationId: Scalars['String']['input'];
  status?: InputMaybe<Scalars['String']['input']>;
};

export type CustomerInvoice = {
  __typename?: 'CustomerInvoice';
  createdAt: Scalars['String']['output'];
  customerId: Scalars['ID']['output'];
  dueDate?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  invoiceDate: Scalars['String']['output'];
  organizationId: Scalars['ID']['output'];
  paidAmount?: Maybe<Scalars['Float']['output']>;
  salesOrderId?: Maybe<Scalars['ID']['output']>;
  seqNo: Scalars['String']['output'];
  status: Scalars['String']['output'];
  totalAmount: Scalars['Float']['output'];
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

export type Grn = {
  __typename?: 'GRN';
  createdAt: Scalars['String']['output'];
  docDate: Scalars['String']['output'];
  docNumber: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  organizationId: Scalars['String']['output'];
  status: Scalars['String']['output'];
};

export type GrnInput = {
  docDate: Scalars['String']['input'];
  organizationId: Scalars['String']['input'];
  status?: InputMaybe<Scalars['String']['input']>;
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
  seqNo: Scalars['String']['output'];
  status: Scalars['String']['output'];
  unit?: Maybe<Scalars['String']['output']>;
};

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type MaterialReceipt = {
  __typename?: 'MaterialReceipt';
  createdAt: Scalars['String']['output'];
  docDate: Scalars['String']['output'];
  docNumber: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  organizationId: Scalars['String']['output'];
  status: Scalars['String']['output'];
};

export type MaterialReceiptInput = {
  docDate: Scalars['String']['input'];
  organizationId: Scalars['String']['input'];
  status?: InputMaybe<Scalars['String']['input']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  _empty?: Maybe<Scalars['String']['output']>;
  adjustStock: InventoryControl;
  createApplicant: Applicant;
  createAsset: Asset;
  createAttendance: Attendance;
  createBankAccount: BankAccount;
  createCareer: Career;
  createCashBank: CashBank;
  createChartOfAccount: ChartOfAccounts;
  createClient: Client;
  createCustomer: Customer;
  createCustomerInvoice: CustomerInvoice;
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
  createMaterialReceipt: MaterialReceipt;
  createOrganization: Organization;
  createPayrollManagement: PayrollManagement;
  createProduct: Product;
  createProductionPlanning: ProductionPlanning;
  createProject: Project;
  createPurchaseOrder: PurchaseOrder;
  createQuotation: Quotation;
  createRawMaterialRequisition: RawMaterialRequisition;
  createRecruitment: Recruitment;
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
  createVendorPayment: VendorPayment;
  createWarehouse: Warehouse;
  createWarehouseBin: WarehouseBin;
  createWorkOrder: WorkOrder;
  deleteApplicant: Scalars['Boolean']['output'];
  deleteAsset: Scalars['Boolean']['output'];
  deleteAttendance: Attendance;
  deleteCareer: Scalars['Boolean']['output'];
  deleteChartOfAccount: Scalars['Boolean']['output'];
  deleteClient: Scalars['Boolean']['output'];
  deleteCustomer: Scalars['Boolean']['output'];
  deleteCustomerInvoice: CustomerInvoice;
  deleteDVS: Scalars['Boolean']['output'];
  deleteDeliveryChallan: Scalars['Boolean']['output'];
  deleteEPM: Scalars['Boolean']['output'];
  deleteExciseInvoice: Scalars['Boolean']['output'];
  deleteExtraction: Scalars['Boolean']['output'];
  deleteGRN: Scalars['Boolean']['output'];
  deleteGoodsReceipt: Scalars['Boolean']['output'];
  deleteIPInspection: Scalars['Boolean']['output'];
  deleteInternalOrder: Scalars['Boolean']['output'];
  deleteInventoryReturn: Scalars['Boolean']['output'];
  deleteItem: Item;
  deleteMaterialReceipt: Scalars['Boolean']['output'];
  deleteOrganization: Organization;
  deletePayrollManagement: Scalars['Boolean']['output'];
  deleteProduct: Scalars['Boolean']['output'];
  deleteProductionPlanning: Scalars['Boolean']['output'];
  deleteProject: Project;
  deletePurchaseOrder: PurchaseOrder;
  deleteQuotation: Scalars['Boolean']['output'];
  deleteRole: Scalars['Boolean']['output'];
  deleteSalaryProcessing: Scalars['Boolean']['output'];
  deleteSalesEnquiry: SalesEnquiry;
  deleteSalesOrder: SalesOrder;
  deleteSalesQuotation: SalesQuotation;
  deleteSalesReturn: Scalars['Boolean']['output'];
  deleteStockAdjustment: Scalars['Boolean']['output'];
  deleteStockTransfer: Scalars['Boolean']['output'];
  deleteUser: User;
  deleteVendor: Vendor;
  deleteVendorPayment: Scalars['Boolean']['output'];
  deleteWorkOrder: Scalars['Boolean']['output'];
  login: AuthPayload;
  reconcileCashBank: CashBank;
  register: AuthPayload;
  seedSystemRoles: Array<Role>;
  sendQuotation: Quotation;
  updateApplicant: Applicant;
  updateAsset: Asset;
  updateAttendance: Attendance;
  updateBankAccount: BankAccount;
  updateCareer: Career;
  updateChartOfAccount: ChartOfAccounts;
  updateClient: Client;
  updateCustomer: Customer;
  updateCustomerInvoice: CustomerInvoice;
  updateDVS: Dvs;
  updateDeliveryChallan: DeliveryChallan;
  updateEPM: Epm;
  updateExciseInvoice: ExciseInvoice;
  updateExtraction: Extraction;
  updateGRN: Grn;
  updateGoodsReceipt: GoodsReceipt;
  updateIPInspection: IpInspection;
  updateInternalOrder: InternalOrder;
  updateInventoryControl: InventoryControl;
  updateInventoryReturn: InventoryReturn;
  updateItem: Item;
  updateMaterialReceipt: MaterialReceipt;
  updateOrganization: Organization;
  updatePayrollManagement: PayrollManagement;
  updateProduct: Product;
  updateProductionPlanning: ProductionPlanning;
  updateProject: Project;
  updatePurchaseOrder: PurchaseOrder;
  updateQuotation: Quotation;
  updateRawMaterialRequisition: RawMaterialRequisition;
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
  updateVendorPayment: VendorPayment;
  updateWarehouse: Warehouse;
  updateWarehouseBin: WarehouseBin;
  updateWorkOrder: WorkOrder;
};


export type MutationAdjustStockArgs = {
  binLocation: Scalars['String']['input'];
  itemId: Scalars['String']['input'];
  quantity: Scalars['Float']['input'];
  reason: Scalars['String']['input'];
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
  input: CustomerInput;
};


export type MutationCreateCustomerInvoiceArgs = {
  input: CreateCustomerInvoiceInput;
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
  input: GrnInput;
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


export type MutationCreateMaterialReceiptArgs = {
  input: MaterialReceiptInput;
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


export type MutationCreateRecruitmentArgs = {
  input: RecruitmentInput;
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
  input: StockAdjustmentInput;
};


export type MutationCreateStockMovementArgs = {
  input: StockMovementInput;
};


export type MutationCreateStockTransferArgs = {
  input: StockTransferInput;
};


export type MutationCreateUserArgs = {
  input: CreateUserInput;
};


export type MutationCreateVendorArgs = {
  input: CreateVendorInput;
};


export type MutationCreateVendorPaymentArgs = {
  input: VendorPaymentInput;
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


export type MutationDeleteGrnArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteGoodsReceiptArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteIpInspectionArgs = {
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


export type MutationDeleteVendorPaymentArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteWorkOrderArgs = {
  id: Scalars['ID']['input'];
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationReconcileCashBankArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRegisterArgs = {
  input: RegisterInput;
};


export type MutationSendQuotationArgs = {
  id: Scalars['ID']['input'];
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
  input: CustomerInput;
};


export type MutationUpdateCustomerInvoiceArgs = {
  id: Scalars['ID']['input'];
  input: UpdateCustomerInvoiceInput;
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
  input: GrnInput;
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


export type MutationUpdateMaterialReceiptArgs = {
  id: Scalars['ID']['input'];
  input: MaterialReceiptInput;
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
  input: StockAdjustmentInput;
};


export type MutationUpdateStockTransferArgs = {
  id: Scalars['ID']['input'];
  input: StockTransferInput;
};


export type MutationUpdateUserArgs = {
  id: Scalars['ID']['input'];
  input: UpdateUserInput;
};


export type MutationUpdateVendorArgs = {
  id: Scalars['ID']['input'];
  input: UpdateVendorInput;
};


export type MutationUpdateVendorPaymentArgs = {
  id: Scalars['ID']['input'];
  input: VendorPaymentInput;
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
  createdAt: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  endDate?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  organizationId: Scalars['ID']['output'];
  seqNo: Scalars['String']['output'];
  startDate?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
};

export type PurchaseOrder = {
  __typename?: 'PurchaseOrder';
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  orderDate: Scalars['String']['output'];
  organizationId: Scalars['ID']['output'];
  projectId?: Maybe<Scalars['ID']['output']>;
  seqNo: Scalars['String']['output'];
  status: Scalars['String']['output'];
  totalAmount: Scalars['Float']['output'];
  vendorId: Scalars['ID']['output'];
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
  bankAccount?: Maybe<BankAccount>;
  bankAccounts: Array<BankAccount>;
  career?: Maybe<Career>;
  careers: Array<Career>;
  cashBank?: Maybe<CashBank>;
  cashBanks: Array<CashBank>;
  chartOfAccount?: Maybe<ChartOfAccounts>;
  chartOfAccounts: Array<ChartOfAccounts>;
  client?: Maybe<Client>;
  clients: Array<Client>;
  clientsByOrganization: Array<Client>;
  clientsByStatus: Array<Client>;
  customer?: Maybe<Customer>;
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
  generalLedger?: Maybe<GeneralLedger>;
  generalLedgers: Array<GeneralLedger>;
  goodsreceipt?: Maybe<GoodsReceipt>;
  goodsreceipts: Array<GoodsReceipt>;
  grn?: Maybe<Grn>;
  grns: Array<Grn>;
  internalorder?: Maybe<InternalOrder>;
  internalorders: Array<InternalOrder>;
  inventoryControl?: Maybe<InventoryControl>;
  inventoryControls: Array<InventoryControl>;
  inventoryreturn?: Maybe<InventoryReturn>;
  inventoryreturns: Array<InventoryReturn>;
  ipinspection?: Maybe<IpInspection>;
  ipinspections: Array<IpInspection>;
  item?: Maybe<Item>;
  items: Array<Item>;
  lowStockItems: Array<InventoryControl>;
  materialreceipt?: Maybe<MaterialReceipt>;
  materialreceipts: Array<MaterialReceipt>;
  me?: Maybe<User>;
  organization?: Maybe<Organization>;
  organizations: Array<Organization>;
  payrollmanagement?: Maybe<PayrollManagement>;
  payrollmanagements: Array<PayrollManagement>;
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
  recruitment?: Maybe<Recruitment>;
  recruitments: Array<Recruitment>;
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
  vendorpayment?: Maybe<VendorPayment>;
  vendorpayments: Array<VendorPayment>;
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


export type QueryBankAccountArgs = {
  id: Scalars['ID']['input'];
};


export type QueryBankAccountsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['String']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
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
  limit?: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['String']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  reconciliationStatus?: InputMaybe<Scalars['String']['input']>;
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


export type QueryCustomerinvoiceArgs = {
  id: Scalars['ID']['input'];
};


export type QueryCustomerinvoicesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['ID']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};


export type QueryCustomersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['String']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
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


export type QueryLowStockItemsArgs = {
  organizationId: Scalars['String']['input'];
};


export type QueryMaterialreceiptArgs = {
  id: Scalars['ID']['input'];
};


export type QueryMaterialreceiptsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['String']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryOrganizationArgs = {
  id: Scalars['ID']['input'];
};


export type QueryOrganizationsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryPayrollmanagementArgs = {
  id: Scalars['ID']['input'];
};


export type QueryPayrollmanagementsArgs = {
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


export type QueryRecruitmentArgs = {
  id: Scalars['ID']['input'];
};


export type QueryRecruitmentsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['String']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
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
  organizationId: Scalars['String']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryStocktransferArgs = {
  id: Scalars['ID']['input'];
};


export type QueryStocktransfersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['String']['input'];
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


export type QueryVendorpaymentArgs = {
  id: Scalars['ID']['input'];
};


export type QueryVendorpaymentsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['String']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryVendorsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['ID']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
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
  clientId: Client;
  createdAt: Scalars['String']['output'];
  discountAmount?: Maybe<Scalars['Float']['output']>;
  id: Scalars['ID']['output'];
  lineItems: Array<QuotationLineItem>;
  notes?: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['ID']['output'];
  quotationDate: Scalars['String']['output'];
  quotationNumber: Scalars['String']['output'];
  sentAt?: Maybe<Scalars['String']['output']>;
  sentBy?: Maybe<User>;
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

export type RegisterInput = {
  email: Scalars['String']['input'];
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  organizationId?: InputMaybe<Scalars['ID']['input']>;
  password: Scalars['String']['input'];
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
  createdAt: Scalars['String']['output'];
  customerId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  orderDate: Scalars['String']['output'];
  organizationId: Scalars['ID']['output'];
  projectId?: Maybe<Scalars['ID']['output']>;
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

export type StockAdjustment = {
  __typename?: 'StockAdjustment';
  createdAt: Scalars['String']['output'];
  docDate: Scalars['String']['output'];
  docNumber: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  organizationId: Scalars['String']['output'];
  status: Scalars['String']['output'];
};

export type StockAdjustmentInput = {
  docDate: Scalars['String']['input'];
  organizationId: Scalars['String']['input'];
  status?: InputMaybe<Scalars['String']['input']>;
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
  createdAt: Scalars['String']['output'];
  docDate: Scalars['String']['output'];
  docNumber: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  organizationId: Scalars['String']['output'];
  status: Scalars['String']['output'];
};

export type StockTransferInput = {
  docDate: Scalars['String']['input'];
  organizationId: Scalars['String']['input'];
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

export type UpdateCustomerInvoiceInput = {
  customerId?: InputMaybe<Scalars['ID']['input']>;
  dueDate?: InputMaybe<Scalars['String']['input']>;
  invoiceDate?: InputMaybe<Scalars['String']['input']>;
  paidAmount?: InputMaybe<Scalars['Float']['input']>;
  salesOrderId?: InputMaybe<Scalars['ID']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  totalAmount?: InputMaybe<Scalars['Float']['input']>;
};

export type UpdateItemInput = {
  category?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  rate?: InputMaybe<Scalars['Float']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  unit?: InputMaybe<Scalars['String']['input']>;
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
  projectId?: InputMaybe<Scalars['ID']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
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

export type UpdateUserInput = {
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  roles?: InputMaybe<Array<Scalars['String']['input']>>;
  status?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateVendorInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  contactPerson?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
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
  contactPerson?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  email?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  organizationId: Scalars['ID']['output'];
  phone?: Maybe<Scalars['String']['output']>;
  seqNo: Scalars['String']['output'];
  status: Scalars['String']['output'];
};

export type VendorPayment = {
  __typename?: 'VendorPayment';
  createdAt: Scalars['String']['output'];
  docDate: Scalars['String']['output'];
  docNumber: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  organizationId: Scalars['String']['output'];
  status: Scalars['String']['output'];
};

export type VendorPaymentInput = {
  docDate: Scalars['String']['input'];
  organizationId: Scalars['String']['input'];
  status?: InputMaybe<Scalars['String']['input']>;
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
