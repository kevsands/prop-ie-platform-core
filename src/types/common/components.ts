/**
 * Component Type Definitions
 * 
 * This file defines shared component-related types that are used across the application.
 */

import { ReactNode, CSSProperties, FormEvent } from 'react';
import { ID } from './index';
import { UserRole, Permission } from './user';

/**
 * Common props for all components
 */
export interface BaseComponentProps {
  /** CSS classname */
  className?: string;
  /** Inline styles */
  style?: CSSProperties;
  /** ID for the component */
  id?: string;
  /** Test ID for testing */
  'data-testid'?: string;
}

/**
 * Common props for interactive components
 */
export interface InteractiveComponentProps extends BaseComponentProps {
  /** Whether the component is disabled */
  disabled?: boolean;
  /** Whether the component is in loading state */
  loading?: boolean;
  /** Whether the component is in error state */
  error?: boolean;
  /** Aria label for accessibility */
  'aria-label'?: string;
  /** Aria described by for accessibility */
  'aria-describedby'?: string;
}

/**
 * Context providers wrapper component props
 */
export interface ProvidersWrapperProps {
  /** Children to render */
  children: ReactNode;
  /** Whether to include all providers or only a subset */
  includeAll?: boolean;
  /** Specific providers to include if includeAll is false */
  include?: Array<
    | 'auth'
    | 'theme'
    | 'notifications'
    | 'query'
    | 'htb'
    | 'customization'
    | 'amplify'
    | 'security'
  >
  );
}

/**
 * Authentication-related component props
 */
export interface AuthComponentProps {
  /** Whether to require authentication */
  requireAuth?: boolean;
  /** Specific roles that are allowed to access */
  allowedRoles?: UserRole[];
  /** Specific permissions that are required */
  requiredPermissions?: Permission[];
  /** Path to redirect to if authentication fails */
  redirectTo?: string;
  /** Whether to show a loading state while checking authentication */
  showLoading?: boolean;
  /** Children to render */
  children: ReactNode;
}

/**
 * Form field base props
 */
export interface FormFieldProps extends InteractiveComponentProps {
  /** Field name */
  name: string;
  /** Field label */
  label?: string;
  /** Field value */
  value?: any;
  /** Function to call when the value changes */
  onChange?: (value: any) => void;
  /** Function to call when the field is blurred */
  onBlur?: () => void;
  /** Whether the field is required */
  required?: boolean;
  /** Error message to display */
  errorMessage?: string;
  /** Help text to display */
  helpText?: string;
  /** Placeholder text */
  placeholder?: string;
}

/**
 * Props for forms
 */
export interface FormProps extends BaseComponentProps {
  /** Form ID */
  id?: string;
  /** Initial values for the form */
  initialValues?: Record<string, any>
  );
  /** Function to call when the form is submitted */
  onSubmit: (
    values: Record<string, any>,
    event?: FormEvent<HTMLFormElement>
  ) => void | Promise<void>
  );
  /** Function to call when the form is reset */
  onReset?: () => void;
  /** Whether the form is submitting */
  isSubmitting?: boolean;
  /** Whether the form has been successfully submitted */
  isSubmitSuccessful?: boolean;
  /** Children to render */
  children: ReactNode;
  /** Whether to disable the form */
  disabled?: boolean;
}

/**
 * Props for buttons
 */
export interface ButtonProps extends InteractiveComponentProps {
  /** Button type */
  type?: 'button' | 'submit' | 'reset';
  /** Button variant */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'danger';
  /** Button size */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Function to call when the button is clicked */
  onClick?: () => void;
  /** Button content */
  children: ReactNode;
  /** Icon to display before the button content */
  leftIcon?: ReactNode;
  /** Icon to display after the button content */
  rightIcon?: ReactNode;
  /** Whether the button is in loading state */
  loading?: boolean;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Whether the button should take up the full width */
  fullWidth?: boolean;
}

/**
 * Props for cards
 */
export interface CardProps extends BaseComponentProps {
  /** Card title */
  title?: string | ReactNode;
  /** Card subtitle */
  subtitle?: string | ReactNode;
  /** Card footer */
  footer?: ReactNode;
  /** Card header */
  header?: ReactNode;
  /** Card content */
  children: ReactNode;
  /** Whether the card has a hover effect */
  hoverable?: boolean;
  /** Whether the card has a border */
  bordered?: boolean;
  /** Whether the card has a shadow */
  shadow?: boolean;
  /** Card padding size */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Function to call when the card is clicked */
  onClick?: () => void;
}

/**
 * Props for modals
 */
export interface ModalProps extends BaseComponentProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Function to call when the modal is closed */
  onClose: () => void;
  /** Modal title */
  title?: string | ReactNode;
  /** Whether to show a close button */
  showCloseButton?: boolean;
  /** Modal content */
  children: ReactNode;
  /** Modal footer */
  footer?: ReactNode;
  /** Modal size */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Whether to close the modal when clicking outside */
  closeOnClickOutside?: boolean;
  /** Whether to close the modal when pressing escape */
  closeOnEsc?: boolean;
  /** Initial focus element ref */
  initialFocusRef?: React.RefObject<HTMLElement>
  );
  /** Whether the modal is in loading state */
  loading?: boolean;
}

/**
 * Props for tables
 */
export interface TableProps<T = any> extends BaseComponentProps {
  /** Table data */
  data: T[];
  /** Table columns configuration */
  columns: Array<{
    /** Column key/accessor */
    key: string;
    /** Column header */
    header: string | ReactNode;
    /** Column cell renderer */
    cell?: (value: any, row: T, index: number) => ReactNode;
    /** Whether the column is sortable */
    sortable?: boolean;
    /** Whether the column is filterable */
    filterable?: boolean;
    /** Column width */
    width?: string | number;
    /** Column alignment */
    align?: 'left' | 'center' | 'right';
    /** Whether to hide the column on mobile */
    hideOnMobile?: boolean;
  }>
  );
  /** Whether the table is in loading state */
  loading?: boolean;
  /** Whether the table is in error state */
  error?: any;
  /** Function to call when a row is clicked */
  onRowClick?: (row: T) => void;
  /** Whether to show a loading skeleton */
  showSkeleton?: boolean;
  /** Whether the table is sortable */
  sortable?: boolean;
  /** Default sort column */
  defaultSortColumn?: string;
  /** Default sort direction */
  defaultSortDirection?: 'asc' | 'desc';
  /** Function to call when the sort changes */
  onSortChange?: (column: string, direction: 'asc' | 'desc') => void;
  /** Whether to enable pagination */
  pagination?: boolean;
  /** Pagination props */
  paginationProps?: {
    /** Current page */
    currentPage: number;
    /** Total number of pages */
    totalPages: number;
    /** Function to call when the page changes */
    onPageChange: (page: number) => void;
    /** Number of items per page */
    pageSize: number;
    /** Function to call when the page size changes */
    onPageSizeChange?: (pageSize: number) => void;
    /** Available page sizes */
    pageSizeOptions?: number[];
  };
  /** Whether to enable selection */
  selectable?: boolean;
  /** Selected row IDs */
  selectedRowIds?: ID[];
  /** Function to call when selection changes */
  onSelectionChange?: (selectedRowIds: ID[]) => void;
  /** Empty state component */
  emptyState?: ReactNode;
}

/**
 * Props for tabs
 */
export interface TabsProps extends BaseComponentProps {
  /** The currently active tab */
  activeTab: string;
  /** Function to call when a tab is clicked */
  onTabChange: (tabId: string) => void;
  /** Tabs configuration */
  tabs: Array<{
    /** Tab ID */
    id: string;
    /** Tab label */
    label: string | ReactNode;
    /** Tab content */
    content: ReactNode;
    /** Whether the tab is disabled */
    disabled?: boolean;
    /** Tab icon */
    icon?: ReactNode;
    /** Tab badge count */
    badgeCount?: number;
  }>
  );
  /** Tabs orientation */
  orientation?: 'horizontal' | 'vertical';
  /** Tabs variant */
  variant?: 'default' | 'pills' | 'underlined' | 'enclosed';
  /** Tabs size */
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Props for toast notifications
 */
export interface ToastProps {
  /** Toast ID */
  id: string;
  /** Toast title */
  title?: string;
  /** Toast description */
  description?: string;
  /** Toast type */
  type?: 'info' | 'success' | 'warning' | 'error';
  /** Toast duration in milliseconds */
  duration?: number;
  /** Whether the toast is closable */
  isClosable?: boolean;
  /** Function to call when the toast is closed */
  onClose?: () => void;
  /** Toast position */
  position?:
  | 'top-left'
  | 'top'
  | 'top-right'
  | 'bottom-left'
  | 'bottom'
  | 'bottom-right';
  /** Custom component to render */
  render?: () => ReactNode;
}

/**
 * Props for dashboard layouts
 */
export interface DashboardLayoutProps extends BaseComponentProps {
  /** Whether the navigation is collapsed */
  navCollapsed?: boolean;
  /** Function to toggle navigation collapse */
  toggleNavCollapse?: () => void;
  /** Dashboard header */
  header?: ReactNode;
  /** Dashboard sidebar */
  sidebar?: ReactNode;
  /** Dashboard content */
  children: ReactNode;
  /** Dashboard footer */
  footer?: ReactNode;
  /** Whether to hide the header */
  hideHeader?: boolean;
  /** Whether to hide the sidebar */
  hideSidebar?: boolean;
  /** Whether to hide the footer */
  hideFooter?: boolean;
}

/**
 * Props for page layouts
 */
export interface PageLayoutProps extends BaseComponentProps {
  /** Page title */
  title?: string;
  /** Page description */
  description?: string;
  /** Page breadcrumb items */
  breadcrumbs?: Array<{
    /** Breadcrumb label */
    label: string;
    /** Breadcrumb href */
    href?: string;
    /** Whether this is the current page */
    current?: boolean;
  }>
  );
  /** Page actions */
  actions?: ReactNode;
  /** Page content */
  children: ReactNode;
  /** Whether the page is in loading state */
  loading?: boolean;
  /** Whether the page is in error state */
  error?: any;
}

/**
 * Props for list items
 */
export interface ListItemProps extends BaseComponentProps {
  /** Item title */
  title: string | ReactNode;
  /** Item description */
  description?: string | ReactNode;
  /** Item icon */
  icon?: ReactNode;
  /** Item actions */
  actions?: ReactNode;
  /** Whether the item is selected */
  selected?: boolean;
  /** Whether the item is disabled */
  disabled?: boolean;
  /** Function to call when the item is clicked */
  onClick?: () => void;
  /** Item metadata */
  metadata?: Record<string, any>
  );
}

/**
 * Props for search components
 */
export interface SearchProps extends BaseComponentProps {
  /** Search value */
  value: string;
  /** Function to call when the value changes */
  onChange: (value: string) => void;
  /** Function to call when a search is submitted */
  onSearch: (value: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Whether the search is in loading state */
  loading?: boolean;
  /** Whether to show a clear button */
  showClear?: boolean;
  /** Function to call when the clear button is clicked */
  onClear?: () => void;
  /** Search box size */
  size?: 'sm' | 'md' | 'lg';
  /** Search box variant */
  variant?: 'outline' | 'filled' | 'flushed';
}

/**
 * Props for alert components
 */
export interface AlertProps extends BaseComponentProps {
  /** Alert status */
  status: 'info' | 'success' | 'warning' | 'error';
  /** Alert title */
  title?: string | ReactNode;
  /** Alert description */
  description?: string | ReactNode;
  /** Whether the alert is closable */
  closable?: boolean;
  /** Function to call when the alert is closed */
  onClose?: () => void;
  /** Alert icon */
  icon?: ReactNode;
  /** Whether to show the default icon */
  showIcon?: boolean;
  /** Alert variant */
  variant?: 'solid' | 'subtle' | 'left-accent' | 'top-accent';
}

/**
 * Props for skeleton loaders
 */
export interface SkeletonProps extends BaseComponentProps {
  /** Skeleton height */
  height?: string | number;
  /** Skeleton width */
  width?: string | number;
  /** Whether to show the skeleton */
  isLoaded?: boolean;
  /** Children to render when loaded */
  children?: ReactNode;
  /** Number of skeleton items to render */
  count?: number;
  /** Skeleton variant */
  variant?: 'line' | 'circle' | 'rect';
  /** Animation speed in seconds */
  speed?: number;
}

/**
 * Props for error boundaries
 */
export interface ErrorBoundaryProps {
  /** Children to render */
  children: ReactNode;
  /** Component to render when an error occurs */
  fallback?: ReactNode | ((error: Error, resetErrorBoundary: () => void) => ReactNode);
  /** Function to call when an error occurs */
  onError?: (error: Error, info: { componentStack: string }) => void;
  /** Whether to retry rendering on error */
  retry?: boolean;
}