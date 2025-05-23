import React from 'react';
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Search,
  FileText,
  Home,
  Users,
  Calendar,
  Package,
  AlertCircle,
  Plus,
  RefreshCw} from 'lucide-react'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
  secondaryAction?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction}: EmptyStateProps) {
  return (
    <Card className="flex flex-col items-center justify-center p-12 text-center">
      {icon && <div className="mb-4 text-muted-foreground">{icon}</div>}
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-sm">{description}</p>
      <div className="flex gap-2">
        {action && (
          <Button onClick={action.onClick}>{action.label}</Button>
        )}
        {secondaryAction && (
          <Button variant="outline" onClick={secondaryAction.onClick}>
            {secondaryAction.label}
          </Button>
        )}
      </div>
    </Card>
  )
}

// Predefined empty states
export function NoSearchResults({ onClearFilters }: { onClearFilters?: () => void }) {
  return (
    <EmptyState
      icon={<Search className="h-12 w-12" />}
      title="No results found"
      description="Try adjusting your search criteria or filters to find what you're looking for."
      action={
        onClearFilters
          ? { label: 'Clear Filters', onClick: onClearFilters }
          : undefined
      }
    />
  )
}

export function NoProperties({ onAddProperty }: { onAddProperty?: () => void }) {
  return (
    <EmptyState
      icon={<Home className="h-12 w-12" />}
      title="No properties yet"
      description="Start by adding your first property to the platform."
      action={
        onAddProperty
          ? { label: 'Add Property', onClick: onAddProperty }
          : undefined
      }
    />
  )
}

export function NoDocuments({ onUpload }: { onUpload?: () => void }) {
  return (
    <EmptyState
      icon={<FileText className="h-12 w-12" />}
      title="No documents"
      description="Upload documents to keep all your important files in one place."
      action={
        onUpload
          ? { label: 'Upload Document', onClick: onUpload }
          : undefined
      }
    />
  )
}

export function NoTransactions({ onBrowse }: { onBrowse?: () => void }) {
  return (
    <EmptyState
      icon={<Package className="h-12 w-12" />}
      title="No transactions yet"
      description="Your transaction history will appear here once you make your first purchase."
      action={
        onBrowse
          ? { label: 'Browse Properties', onClick: onBrowse }
          : undefined
      }
    />
  )
}

export function NoAppointments({ onSchedule }: { onSchedule?: () => void }) {
  return (
    <EmptyState
      icon={<Calendar className="h-12 w-12" />}
      title="No appointments scheduled"
      description="Schedule viewings to see properties in person."
      action={
        onSchedule
          ? { label: 'Schedule Viewing', onClick: onSchedule }
          : undefined
      }
    />
  )
}

export function NoTeamMembers({ onInvite }: { onInvite?: () => void }) {
  return (
    <EmptyState
      icon={<Users className="h-12 w-12" />}
      title="No team members"
      description="Invite team members to collaborate on your projects."
      action={
        onInvite
          ? { label: 'Invite Team Member', onClick: onInvite }
          : undefined
      }
    />
  )
}

export function ErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <EmptyState
      icon={<AlertCircle className="h-12 w-12 text-destructive" />}
      title="Something went wrong"
      description="We couldn't load the data. Please try again."
      action={
        onRetry
          ? { label: 'Try Again', onClick: onRetry }
          : undefined
      }
    />
  )
}

export function OfflineState() {
  return (
    <EmptyState
      icon={<RefreshCw className="h-12 w-12" />}
      title="You're offline"
      description="Check your internet connection and try again."
      action={
        label: 'Refresh',
        onClick: () => window.location.reload()}
    />
  )
}