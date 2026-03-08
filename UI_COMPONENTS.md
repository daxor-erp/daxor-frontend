# Daxor Frontend - Complete UI Components

## ✅ All UI Components Available (49 components)

### Form Components
- ✅ **input.tsx** - Text input fields
- ✅ **select.tsx** - Dropdown select
- ✅ **textarea.tsx** - Multi-line text input
- ✅ **checkbox.tsx** - Checkboxes
- ✅ **radio-group.tsx** - Radio buttons
- ✅ **switch.tsx** - Toggle switches
- ✅ **slider.tsx** - Range sliders
- ✅ **form.tsx** - Form wrapper with react-hook-form
- ✅ **label.tsx** - Form labels
- ✅ **input-otp.tsx** - OTP input

### Layout Components
- ✅ **card.tsx** - Card containers
- ✅ **separator.tsx** - Dividers
- ✅ **scroll-area.tsx** - Scrollable areas
- ✅ **sidebar.tsx** - Sidebar navigation
- ✅ **sheet.tsx** - Side panels
- ✅ **tabs.tsx** - Tab navigation
- ✅ **accordion.tsx** - Collapsible sections
- ✅ **collapsible.tsx** - Expandable content
- ✅ **resizable.tsx** - Resizable panels

### Data Display
- ✅ **table.tsx** - Data tables
- ✅ **badge.tsx** - Status badges
- ✅ **avatar.tsx** - User avatars
- ✅ **skeleton.tsx** - Loading skeletons
- ✅ **progress.tsx** - Progress bars
- ✅ **chart.tsx** - Charts
- ✅ **calendar.tsx** - Date picker

### Feedback Components
- ✅ **alert.tsx** - Alert messages
- ✅ **alert-dialog.tsx** - Confirmation dialogs
- ✅ **dialog.tsx** - Modal dialogs
- ✅ **toast.tsx** - Toast notifications
- ✅ **toaster.tsx** - Toast container
- ✅ **sonner.tsx** - Sonner toast
- ✅ **use-toast.ts** - Toast hook

### Navigation
- ✅ **button.tsx** - Buttons
- ✅ **dropdown-menu.tsx** - Dropdown menus
- ✅ **navigation-menu.tsx** - Navigation menus
- ✅ **menubar.tsx** - Menu bars
- ✅ **context-menu.tsx** - Right-click menus
- ✅ **breadcrumb.tsx** - Breadcrumb navigation
- ✅ **pagination.tsx** - Pagination controls
- ✅ **command.tsx** - Command palette

### Overlay Components
- ✅ **popover.tsx** - Popovers
- ✅ **tooltip.tsx** - Tooltips
- ✅ **hover-card.tsx** - Hover cards
- ✅ **drawer.tsx** - Drawer panels

### Other
- ✅ **toggle.tsx** - Toggle buttons
- ✅ **toggle-group.tsx** - Toggle button groups
- ✅ **aspect-ratio.tsx** - Aspect ratio containers
- ✅ **carousel.tsx** - Image carousels

## ✅ Custom UI Atoms (Business Components)

### `/components/ui-atoms/`
- ✅ **Table.tsx** - Reusable data table with columns
- ✅ **PageHeader.tsx** - Page header with title and action button
- ✅ **StatusBadge.tsx** - Status badge with color coding
- ✅ **KPICard.tsx** - KPI metric cards with icons and trends

## ✅ Complete Architecture

```
daxor-frontend/
├── app/
│   ├── (public)/login/          # Login page
│   ├── (protected)/             # Protected routes
│   │   ├── dashboard/           # Dashboard with KPI cards
│   │   ├── organizations/       # Organizations CRUD
│   │   ├── users/               # Users CRUD
│   │   ├── items/               # Items CRUD
│   │   ├── vendors/             # Vendors CRUD
│   │   ├── projects/            # Projects CRUD
│   │   ├── purchase-orders/     # Purchase Orders
│   │   ├── sales-orders/        # Sales Orders
│   │   ├── customer-invoices/   # Customer Invoices
│   │   └── attendance/          # Attendance
│   ├── layout.tsx               # Root layout
│   ├── providers.tsx            # Apollo + Theme providers
│   └── globals.css              # Global styles
├── components/
│   ├── ui/                      # 49 shadcn/ui components
│   └── ui-atoms/                # 4 custom business components
├── contexts/
│   └── AuthContext.tsx          # Authentication context
├── gql/
│   └── queries.ts               # All GraphQL queries/mutations
├── utils/
│   └── apollo-client.ts         # Apollo Client setup
└── hooks/                       # Custom hooks
```

## ✅ All Features Ready

1. **Authentication** - Login, JWT tokens, protected routes
2. **GraphQL Integration** - Apollo Client, queries, mutations
3. **Form Handling** - react-hook-form + zod validation
4. **Data Tables** - Sortable, filterable tables
5. **CRUD Operations** - Create, Read, Update, Delete for all entities
6. **Responsive Design** - Mobile-friendly layouts
7. **Dark Mode** - Theme switching support
8. **Toast Notifications** - Success/error messages
9. **Loading States** - Skeletons and spinners
10. **Status Badges** - Color-coded status indicators

## 🚀 Ready to Run

```bash
cd /Users/sandeepv/Desktop/daxor/daxor-frontend
bun install
bun run dev
```

Frontend: http://localhost:3000
Backend: http://localhost:4000/graphql

## 📝 Example Usage

### Using Select Component
```tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select status" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="active">Active</SelectItem>
    <SelectItem value="inactive">Inactive</SelectItem>
  </SelectContent>
</Select>
```

### Using Form with Input
```tsx
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'

const form = useForm()

<Form {...form}>
  <FormField
    control={form.control}
    name="email"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Email</FormLabel>
        <FormControl>
          <Input {...field} type="email" />
        </FormControl>
      </FormItem>
    )}
  />
</Form>
```

### Using Custom Table
```tsx
import { Table } from '@/components/ui-atoms'

<Table
  data={users}
  columns={[
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'status', header: 'Status', render: (user) => <StatusBadge status={user.status} /> }
  ]}
  loading={loading}
  onRowClick={(user) => console.log(user)}
/>
```

All components are ready to use! 🎉
