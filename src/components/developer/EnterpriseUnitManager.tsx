'use client'

/**
 * Enterprise Unit Manager - Comprehensive Unit Management System
 * Full CRUD operations, real-time updates, and business logic
 * 
 * @fileoverview Enterprise-grade unit management with real business logic
 * @version 3.0.0
 * @author Property Development Platform Team
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import { 
  Building2, 
  Search, 
  Filter, 
  Euro, 
  Calendar, 
  User, 
  FileText, 
  Eye, 
  Edit, 
  Save, 
  X, 
  Plus,
  ArrowUp,
  ArrowDown,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Clock,
  AlertTriangle,
  Home,
  MapPin,
  Layers,
  DollarSign,
  Users,
  Target,
  Activity,
  BarChart3
} from 'lucide-react'
import { unifiedProjectService, UnitData, ProjectData } from '@/services/UnifiedProjectService'

// =============================================================================
// INTERFACES
// =============================================================================

interface EnterpriseUnitManagerProps {
  projectId: string
  onUnitUpdate?: (unitId: string, updates: Partial<UnitData>) => Promise<boolean>
}

interface UnitFilters {
  status: string
  type: string
  phase: string
  building: string
  priceRange: { min: number; max: number }
  searchTerm: string
}

interface UnitMetrics {
  totalUnits: number
  soldUnits: number
  reservedUnits: number
  availableUnits: number
  constructionUnits: number
  totalValue: number
  averagePrice: number
  salesVelocity: number
  conversionRate: number
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function EnterpriseUnitManager({ projectId, onUnitUpdate }: EnterpriseUnitManagerProps) {
  const { toast } = useToast()
  
  // Core state
  const [project, setProject] = useState<ProjectData | null>(null)
  const [units, setUnits] = useState<UnitData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // UI state
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'analytics'>('grid')
  const [selectedUnit, setSelectedUnit] = useState<UnitData | null>(null)
  const [showUnitModal, setShowUnitModal] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingUnit, setEditingUnit] = useState<Partial<UnitData> | null>(null)
  
  // Filtering and sorting
  const [filters, setFilters] = useState<UnitFilters>({
    status: 'all',
    type: 'all',
    phase: 'all',
    building: 'all',
    priceRange: { min: 0, max: 1000000 },
    searchTerm: ''
  })
  const [sortBy, setSortBy] = useState<'number' | 'price' | 'status' | 'phase'>('number')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  // =============================================================================
  // DATA LOADING AND MANAGEMENT
  // =============================================================================

  const loadProjectData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const projectData = await unifiedProjectService.getProject(projectId)
      if (!projectData) {
        throw new Error('Project not found')
      }

      setProject(projectData)
      setUnits(projectData.units)
      
      console.log('✅ Loaded project data:', projectData.name, `(${projectData.units.length} units)`)
    } catch (err) {
      console.error('❌ Failed to load project data:', err)
      setError(err instanceof Error ? err.message : 'Failed to load project')
    } finally {
      setIsLoading(false)
    }
  }, [projectId])

  useEffect(() => {
    loadProjectData()

    // Set up real-time updates
    const handleUnitUpdate = (data: any) => {
      if (data.projectId === projectId) {
        loadProjectData()
      }
    }

    unifiedProjectService.onUnitUpdate(handleUnitUpdate)

    return () => {
      unifiedProjectService.removeAllListeners()
    }
  }, [loadProjectData, projectId])

  // =============================================================================
  // COMPUTED VALUES AND METRICS
  // =============================================================================

  const filteredAndSortedUnits = useMemo(() => {
    const filtered = units.filter(unit => {
      // Status filter
      if (filters.status !== 'all' && unit.status !== filters.status) return false
      
      // Type filter
      if (filters.type !== 'all' && unit.type !== filters.type) return false
      
      // Phase filter
      if (filters.phase !== 'all' && unit.construction.phaseId !== filters.phase) return false
      
      // Building filter
      if (filters.building !== 'all' && unit.physical.building !== filters.building) return false
      
      // Price range filter
      if (unit.pricing.currentPrice < filters.priceRange.min || 
          unit.pricing.currentPrice > filters.priceRange.max) return false
      
      // Search term filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase()
        return (
          unit.number.toLowerCase().includes(searchLower) ||
          unit.type.toLowerCase().includes(searchLower) ||
          unit.physical.building.toLowerCase().includes(searchLower) ||
          unit.sale.buyerId?.toLowerCase().includes(searchLower)
        )
      }
      
      return true
    })

    // Sort units
    filtered.sort((a, b) => {
      let comparison = 0
      
      switch (sortBy) {
        case 'number':
          comparison = parseInt(a.number) - parseInt(b.number)
          break
        case 'price':
          comparison = a.pricing.currentPrice - b.pricing.currentPrice
          break
        case 'status':
          comparison = a.status.localeCompare(b.status)
          break
        case 'phase':
          comparison = a.construction.phaseId.localeCompare(b.construction.phaseId)
          break
      }
      
      return sortOrder === 'asc' ? comparison : -comparison
    })

    return filtered
  }, [units, filters, sortBy, sortOrder])

  const metrics = useMemo((): UnitMetrics => {
    const totalUnits = units.length
    const soldUnits = units.filter(unit => unit.status === 'sold').length
    const reservedUnits = units.filter(unit => unit.status === 'reserved').length
    const availableUnits = units.filter(unit => unit.status === 'available').length
    const constructionUnits = units.filter(unit => unit.status === 'construction').length
    
    const totalValue = units.reduce((sum, unit) => sum + unit.pricing.currentPrice, 0)
    const soldValue = units
      .filter(unit => unit.status === 'sold')
      .reduce((sum, unit) => sum + unit.pricing.currentPrice, 0)
    
    const averagePrice = totalUnits > 0 ? totalValue / totalUnits : 0
    const conversionRate = totalUnits > 0 ? (soldUnits / totalUnits) * 100 : 0
    
    // Calculate sales velocity (units sold per month)
    const soldUnitsWithDates = units.filter(unit => unit.status === 'sold' && unit.sale.saleDate)
    let salesVelocity = 0
    
    if (soldUnitsWithDates.length > 0) {
      const dates = soldUnitsWithDates.map(unit => new Date(unit.sale.saleDate!).getTime())
      const minDate = Math.min(...dates)
      const maxDate = Math.max(...dates)
      const monthsSpan = (maxDate - minDate) / (1000 * 60 * 60 * 24 * 30.44)
      salesVelocity = monthsSpan > 0 ? soldUnitsWithDates.length / monthsSpan : 0
    }

    return {
      totalUnits,
      soldUnits,
      reservedUnits,
      availableUnits,
      constructionUnits,
      totalValue: soldValue,
      averagePrice,
      salesVelocity,
      conversionRate
    }
  }, [units])

  const uniqueValues = useMemo(() => ({
    statuses: [...new Set(units.map(unit => unit.status))],
    types: [...new Set(units.map(unit => unit.type))],
    phases: [...new Set(units.map(unit => unit.construction.phaseId))],
    buildings: [...new Set(units.map(unit => unit.physical.building))]
  }), [units])

  // =============================================================================
  // UNIT OPERATIONS
  // =============================================================================

  const handleStatusUpdate = async (unitId: string, newStatus: string) => {
    try {
      const success = await unifiedProjectService.updateUnit(projectId, unitId, {
        status: newStatus as any,
        sale: {
          ...units.find(u => u.id === unitId)?.sale,
          reservationDate: newStatus === 'reserved' ? new Date().toISOString() : undefined,
          saleDate: newStatus === 'sold' ? new Date().toISOString() : undefined
        }
      })

      if (success) {
        if (onUnitUpdate) {
          await onUnitUpdate(unitId, { status: newStatus as any })
        }
        await loadProjectData()
        toast({
          title: "Unit Updated",
          description: `Unit ${units.find(u => u.id === unitId)?.number} status changed to ${newStatus}`,
        })
      } else {
        throw new Error('Failed to update unit status')
      }
    } catch (error) {
      console.error('Failed to update unit status:', error)
      toast({
        title: "Update Failed",
        description: "Failed to update unit status. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handlePriceUpdate = async (unitId: string, newPrice: number, reason: string) => {
    try {
      const unit = units.find(u => u.id === unitId)
      if (!unit) return

      const priceHistory = [
        ...unit.pricing.priceHistory,
        {
          price: newPrice,
          date: new Date().toISOString(),
          reason,
          modifiedBy: 'developer'
        }
      ]

      const success = await unifiedProjectService.updateUnit(projectId, unitId, {
        pricing: {
          ...unit.pricing,
          currentPrice: newPrice,
          priceHistory,
          lastPriceUpdate: new Date().toISOString()
        }
      })

      if (success) {
        if (onUnitUpdate) {
          await onUnitUpdate(unitId, { 
            pricing: { 
              ...unit.pricing, 
              currentPrice: newPrice 
            } 
          })
        }
        await loadProjectData()
        toast({
          title: "Price Updated",
          description: `Unit ${unit.number} price updated to €${newPrice.toLocaleString()}`,
        })
      } else {
        throw new Error('Failed to update unit price')
      }
    } catch (error) {
      console.error('Failed to update unit price:', error)
      toast({
        title: "Update Failed",
        description: "Failed to update unit price. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleUnitSave = async () => {
    if (!editingUnit || !selectedUnit) return

    try {
      const success = await unifiedProjectService.updateUnit(projectId, selectedUnit.id, editingUnit)

      if (success) {
        if (onUnitUpdate) {
          await onUnitUpdate(selectedUnit.id, editingUnit)
        }
        await loadProjectData()
        setIsEditMode(false)
        setEditingUnit(null)
        toast({
          title: "Unit Saved",
          description: `Unit ${selectedUnit.number} has been updated successfully`,
        })
      } else {
        throw new Error('Failed to save unit')
      }
    } catch (error) {
      console.error('Failed to save unit:', error)
      toast({
        title: "Save Failed",
        description: "Failed to save unit changes. Please try again.",
        variant: "destructive"
      })
    }
  }

  // =============================================================================
  // RENDER HELPERS
  // =============================================================================

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sold': return 'bg-green-100 text-green-800'
      case 'reserved': return 'bg-amber-100 text-amber-800'
      case 'available': return 'bg-blue-100 text-blue-800'
      case 'construction': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sold': return <CheckCircle size={16} className="text-green-600" />
      case 'reserved': return <Clock size={16} className="text-amber-600" />
      case 'available': return <Home size={16} className="text-blue-600" />
      case 'construction': return <Activity size={16} className="text-purple-600" />
      default: return <AlertTriangle size={16} className="text-gray-600" />
    }
  }

  const formatPrice = (price: number) => `€${price.toLocaleString()}`

  const renderUnitCard = (unit: UnitData) => (
    <Card key={unit.id} className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => {
            setSelectedUnit(unit)
            setShowUnitModal(true)
          }}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Unit {unit.number}</CardTitle>
          <Badge className={getStatusColor(unit.status)}>
            {getStatusIcon(unit.status)}
            <span className="ml-1 capitalize">{unit.status}</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Type</p>
              <p className="font-medium capitalize">{unit.type}</p>
            </div>
            <div>
              <p className="text-gray-600">Price</p>
              <p className="font-medium">{formatPrice(unit.pricing.currentPrice)}</p>
            </div>
            <div>
              <p className="text-gray-600">Bedrooms</p>
              <p className="font-medium">{unit.physical.bedrooms}</p>
            </div>
            <div>
              <p className="text-gray-600">Floor</p>
              <p className="font-medium">{unit.physical.floor}</p>
            </div>
          </div>
          
          <div className="pt-2 border-t">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Phase:</span>
              <span className="font-medium">{unit.construction.phaseId}</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-gray-600">Building:</span>
              <span className="font-medium">{unit.physical.building}</span>
            </div>
          </div>

          {unit.status === 'construction' && (
            <div className="pt-2">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-600">Progress</span>
                <span className="font-medium">{unit.construction.progressPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${unit.construction.progressPercentage}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )

  const renderListItem = (unit: UnitData) => (
    <div key={unit.id} 
         className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
         onClick={() => {
           setSelectedUnit(unit)
           setShowUnitModal(true)
         }}>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          <Building2 size={20} className="text-blue-600" />
        </div>
        <div>
          <h3 className="font-medium">Unit {unit.number}</h3>
          <p className="text-sm text-gray-600 capitalize">{unit.type} • {unit.physical.bedrooms} bed • {unit.physical.building}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="text-right">
          <p className="font-medium">{formatPrice(unit.pricing.currentPrice)}</p>
          <p className="text-sm text-gray-600">{unit.physical.sqft} sq ft</p>
        </div>
        
        <Badge className={getStatusColor(unit.status)}>
          {getStatusIcon(unit.status)}
          <span className="ml-1 capitalize">{unit.status}</span>
        </Badge>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={(e) => {
            e.stopPropagation()
            setSelectedUnit(unit)
            setEditingUnit({ ...unit })
            setIsEditMode(true)
            setShowUnitModal(true)
          }}>
            <Edit size={14} />
          </Button>
        </div>
      </div>
    </div>
  )

  // =============================================================================
  // LOADING AND ERROR STATES
  // =============================================================================

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading unit data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">Error: {error}</p>
          <Button onClick={loadProjectData} className="mt-4">Try Again</Button>
        </div>
      </div>
    )
  }

  // =============================================================================
  // MAIN RENDER
  // =============================================================================

  return (
    <div className="space-y-6">
      {/* Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Units</p>
                <p className="text-2xl font-bold">{metrics.totalUnits}</p>
              </div>
              <Building2 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Units Sold</p>
                <p className="text-2xl font-bold text-green-600">{metrics.soldUnits}</p>
                <p className="text-xs text-gray-500">{metrics.conversionRate.toFixed(1)}% conversion</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-purple-600">{formatPrice(metrics.totalValue)}</p>
                <p className="text-xs text-gray-500">From sold units</p>
              </div>
              <Euro className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Sales Velocity</p>
                <p className="text-2xl font-bold text-orange-600">{metrics.salesVelocity.toFixed(1)}</p>
                <p className="text-xs text-gray-500">units/month</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Unit Management</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Layers size={16} />
                Grid
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <FileText size={16} />
                List
              </Button>
              <Button
                variant={viewMode === 'analytics' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('analytics')}
              >
                <BarChart3 size={16} />
                Analytics
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
            <div>
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <Input
                  id="search"
                  placeholder="Search units..."
                  value={filters.searchTerm}
                  onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {uniqueValues.statuses.map(status => (
                    <SelectItem key={status} value={status} className="capitalize">{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="type">Type</Label>
              <Select value={filters.type} onValueChange={(value) => setFilters({ ...filters, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {uniqueValues.types.map(type => (
                    <SelectItem key={type} value={type} className="capitalize">{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="phase">Phase</Label>
              <Select value={filters.phase} onValueChange={(value) => setFilters({ ...filters, phase: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Phases</SelectItem>
                  {uniqueValues.phases.map(phase => (
                    <SelectItem key={phase} value={phase}>{phase}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="sortBy">Sort By</Label>
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="number">Unit Number</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                  <SelectItem value="phase">Phase</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="sortOrder">Order</Label>
              <Select value={sortOrder} onValueChange={(value: any) => setSortOrder(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">
                    <ArrowUp size={16} className="inline mr-2" />
                    Ascending
                  </SelectItem>
                  <SelectItem value="desc">
                    <ArrowDown size={16} className="inline mr-2" />
                    Descending
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600">
              Showing {filteredAndSortedUnits.length} of {units.length} units
            </p>
            <Button onClick={() => setFilters({
              status: 'all',
              type: 'all',
              phase: 'all',
              building: 'all',
              priceRange: { min: 0, max: 1000000 },
              searchTerm: ''
            })}>
              Clear Filters
            </Button>
          </div>

          {/* Unit Display */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredAndSortedUnits.map(renderUnitCard)}
            </div>
          )}

          {viewMode === 'list' && (
            <div className="space-y-2">
              {filteredAndSortedUnits.map(renderListItem)}
            </div>
          )}

          {viewMode === 'analytics' && (
            <div className="space-y-6">
              {/* Phase Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>Phase Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {project?.phases.map(phase => {
                      const phaseUnits = units.filter(unit => unit.construction.phaseId === phase.id)
                      const phaseSold = phaseUnits.filter(unit => unit.status === 'sold').length
                      const phaseRevenue = phaseUnits
                        .filter(unit => unit.status === 'sold')
                        .reduce((sum, unit) => sum + unit.pricing.currentPrice, 0)
                      
                      return (
                        <div key={phase.id} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium">{phase.name}</h3>
                            <Badge className={phase.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 
                                           phase.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' : 
                                           'bg-gray-100 text-gray-800'}>
                              {phase.status}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Units</p>
                              <p className="font-medium">{phaseUnits.length}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Sold</p>
                              <p className="font-medium">{phaseSold}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Revenue</p>
                              <p className="font-medium">{formatPrice(phaseRevenue)}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Progress</p>
                              <p className="font-medium">{phase.progress.completionPercentage}%</p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Unit Type Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle>Unit Type Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {uniqueValues.types.map(type => {
                      const typeUnits = units.filter(unit => unit.type === type)
                      const typeSold = typeUnits.filter(unit => unit.status === 'sold').length
                      const typeAvgPrice = typeUnits.length > 0 ? 
                        typeUnits.reduce((sum, unit) => sum + unit.pricing.currentPrice, 0) / typeUnits.length : 0
                      
                      return (
                        <div key={type} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium capitalize">{type}</h3>
                          </div>
                          <div className="grid grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Total Units</p>
                              <p className="font-medium">{typeUnits.length}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Sold</p>
                              <p className="font-medium">{typeSold}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Avg Price</p>
                              <p className="font-medium">{formatPrice(typeAvgPrice)}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Conversion</p>
                              <p className="font-medium">{typeUnits.length > 0 ? ((typeSold / typeUnits.length) * 100).toFixed(1) : 0}%</p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {filteredAndSortedUnits.length === 0 && (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No units match your current filters</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Unit Detail Modal */}
      {showUnitModal && selectedUnit && (
        <Dialog open={showUnitModal} onOpenChange={setShowUnitModal}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>Unit {selectedUnit.number} - {selectedUnit.type}</span>
                <div className="flex items-center gap-2">
                  {!isEditMode && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsEditMode(true)
                        setEditingUnit({ ...selectedUnit })
                      }}
                    >
                      <Edit size={16} />
                      Edit
                    </Button>
                  )}
                  {isEditMode && (
                    <>
                      <Button size="sm" onClick={handleUnitSave}>
                        <Save size={16} />
                        Save
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setIsEditMode(false)
                          setEditingUnit(null)
                        }}
                      >
                        <X size={16} />
                        Cancel
                      </Button>
                    </>
                  )}
                </div>
              </DialogTitle>
            </DialogHeader>

            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="pricing">Pricing</TabsTrigger>
                <TabsTrigger value="construction">Construction</TabsTrigger>
                <TabsTrigger value="sale">Sale Info</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Unit Number</Label>
                    <Input
                      value={isEditMode ? editingUnit?.number || '' : selectedUnit.number}
                      onChange={(e) => isEditMode && setEditingUnit({ ...editingUnit, number: e.target.value })}
                      readOnly={!isEditMode}
                    />
                  </div>
                  <div>
                    <Label>Type</Label>
                    <Select
                      value={isEditMode ? editingUnit?.type || selectedUnit.type : selectedUnit.type}
                      onValueChange={(value) => isEditMode && setEditingUnit({ ...editingUnit, type: value as any })}
                      disabled={!isEditMode}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="apartment">Apartment</SelectItem>
                        <SelectItem value="house">House</SelectItem>
                        <SelectItem value="penthouse">Penthouse</SelectItem>
                        <SelectItem value="studio">Studio</SelectItem>
                        <SelectItem value="duplex">Duplex</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Bedrooms</Label>
                    <Input
                      type="number"
                      value={isEditMode ? editingUnit?.physical?.bedrooms || selectedUnit.physical.bedrooms : selectedUnit.physical.bedrooms}
                      onChange={(e) => isEditMode && setEditingUnit({ 
                        ...editingUnit, 
                        physical: { ...editingUnit?.physical || selectedUnit.physical, bedrooms: parseInt(e.target.value) }
                      })}
                      readOnly={!isEditMode}
                    />
                  </div>
                  <div>
                    <Label>Bathrooms</Label>
                    <Input
                      type="number"
                      value={isEditMode ? editingUnit?.physical?.bathrooms || selectedUnit.physical.bathrooms : selectedUnit.physical.bathrooms}
                      onChange={(e) => isEditMode && setEditingUnit({ 
                        ...editingUnit, 
                        physical: { ...editingUnit?.physical || selectedUnit.physical, bathrooms: parseInt(e.target.value) }
                      })}
                      readOnly={!isEditMode}
                    />
                  </div>
                  <div>
                    <Label>Square Feet</Label>
                    <Input
                      type="number"
                      value={isEditMode ? editingUnit?.physical?.sqft || selectedUnit.physical.sqft : selectedUnit.physical.sqft}
                      onChange={(e) => isEditMode && setEditingUnit({ 
                        ...editingUnit, 
                        physical: { ...editingUnit?.physical || selectedUnit.physical, sqft: parseInt(e.target.value) }
                      })}
                      readOnly={!isEditMode}
                    />
                  </div>
                  <div>
                    <Label>Floor</Label>
                    <Input
                      type="number"
                      value={isEditMode ? editingUnit?.physical?.floor || selectedUnit.physical.floor : selectedUnit.physical.floor}
                      onChange={(e) => isEditMode && setEditingUnit({ 
                        ...editingUnit, 
                        physical: { ...editingUnit?.physical || selectedUnit.physical, floor: parseInt(e.target.value) }
                      })}
                      readOnly={!isEditMode}
                    />
                  </div>
                  <div>
                    <Label>Building</Label>
                    <Input
                      value={isEditMode ? editingUnit?.physical?.building || selectedUnit.physical.building : selectedUnit.physical.building}
                      onChange={(e) => isEditMode && setEditingUnit({ 
                        ...editingUnit, 
                        physical: { ...editingUnit?.physical || selectedUnit.physical, building: e.target.value }
                      })}
                      readOnly={!isEditMode}
                    />
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Select
                      value={isEditMode ? editingUnit?.status || selectedUnit.status : selectedUnit.status}
                      onValueChange={(value) => {
                        if (isEditMode) {
                          setEditingUnit({ ...editingUnit, status: value as any })
                        } else {
                          handleStatusUpdate(selectedUnit.id, value)
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="reserved">Reserved</SelectItem>
                        <SelectItem value="sold">Sold</SelectItem>
                        <SelectItem value="construction">Construction</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="pricing" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Current Price</Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        value={isEditMode ? editingUnit?.pricing?.currentPrice || selectedUnit.pricing.currentPrice : selectedUnit.pricing.currentPrice}
                        onChange={(e) => isEditMode && setEditingUnit({ 
                          ...editingUnit, 
                          pricing: { ...editingUnit?.pricing || selectedUnit.pricing, currentPrice: parseInt(e.target.value) }
                        })}
                        readOnly={!isEditMode}
                      />
                      {!isEditMode && (
                        <Button
                          variant="outline"
                          onClick={() => {
                            const newPrice = prompt('Enter new price:', selectedUnit.pricing.currentPrice.toString())
                            const reason = prompt('Reason for price change:')
                            if (newPrice && reason) {
                              handlePriceUpdate(selectedUnit.id, parseInt(newPrice), reason)
                            }
                          }}
                        >
                          Update
                        </Button>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label>Base Price</Label>
                    <Input
                      type="number"
                      value={selectedUnit.pricing.basePrice}
                      readOnly
                    />
                  </div>
                  <div>
                    <Label>Reservation Deposit</Label>
                    <Input
                      type="number"
                      value={isEditMode ? editingUnit?.pricing?.reservationDeposit || selectedUnit.pricing.reservationDeposit : selectedUnit.pricing.reservationDeposit}
                      onChange={(e) => isEditMode && setEditingUnit({ 
                        ...editingUnit, 
                        pricing: { ...editingUnit?.pricing || selectedUnit.pricing, reservationDeposit: parseInt(e.target.value) }
                      })}
                      readOnly={!isEditMode}
                    />
                  </div>
                  <div>
                    <Label>Last Price Update</Label>
                    <Input
                      value={new Date(selectedUnit.pricing.lastPriceUpdate).toLocaleDateString()}
                      readOnly
                    />
                  </div>
                </div>

                {/* Price History */}
                <div>
                  <Label>Price History</Label>
                  <div className="border rounded-lg p-4 max-h-48 overflow-y-auto">
                    {selectedUnit.pricing.priceHistory.map((entry, index) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                        <div>
                          <p className="font-medium">{formatPrice(entry.price)}</p>
                          <p className="text-sm text-gray-600">{entry.reason}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm">{new Date(entry.date).toLocaleDateString()}</p>
                          <p className="text-xs text-gray-500">by {entry.modifiedBy}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="construction" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Phase</Label>
                    <Input value={selectedUnit.construction.phaseId} readOnly />
                  </div>
                  <div>
                    <Label>Progress</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={isEditMode ? editingUnit?.construction?.progressPercentage || selectedUnit.construction.progressPercentage : selectedUnit.construction.progressPercentage}
                        onChange={(e) => isEditMode && setEditingUnit({ 
                          ...editingUnit, 
                          construction: { ...editingUnit?.construction || selectedUnit.construction, progressPercentage: parseInt(e.target.value) }
                        })}
                        readOnly={!isEditMode}
                      />
                      <span className="text-sm text-gray-600">%</span>
                    </div>
                  </div>
                  <div>
                    <Label>Start Date</Label>
                    <Input
                      type="date"
                      value={selectedUnit.construction.startDate || ''}
                      readOnly={!isEditMode}
                    />
                  </div>
                  <div>
                    <Label>Estimated Completion</Label>
                    <Input
                      type="date"
                      value={selectedUnit.construction.estimatedCompletion}
                      readOnly={!isEditMode}
                    />
                  </div>
                  {selectedUnit.construction.actualCompletion && (
                    <div>
                      <Label>Actual Completion</Label>
                      <Input
                        type="date"
                        value={selectedUnit.construction.actualCompletion}
                        readOnly={!isEditMode}
                      />
                    </div>
                  )}
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span>Construction Progress</span>
                    <span>{selectedUnit.construction.progressPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${selectedUnit.construction.progressPercentage}%` }}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="sale" className="space-y-4">
                {selectedUnit.sale.buyerId ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Buyer ID</Label>
                        <Input value={selectedUnit.sale.buyerId} readOnly />
                      </div>
                      <div>
                        <Label>Reservation Date</Label>
                        <Input 
                          value={selectedUnit.sale.reservationDate ? new Date(selectedUnit.sale.reservationDate).toLocaleDateString() : ''} 
                          readOnly 
                        />
                      </div>
                      <div>
                        <Label>Sale Date</Label>
                        <Input 
                          value={selectedUnit.sale.saleDate ? new Date(selectedUnit.sale.saleDate).toLocaleDateString() : ''} 
                          readOnly 
                        />
                      </div>
                      <div>
                        <Label>Legal Stage</Label>
                        <Input value={selectedUnit.sale.legalStatus.stage} readOnly />
                      </div>
                    </div>

                    {/* Legal Progress */}
                    <div>
                      <Label>Legal Progress</Label>
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        <div className="flex items-center gap-2">
                          {selectedUnit.sale.legalStatus.solicitorPackSent ? (
                            <CheckCircle size={16} className="text-green-500" />
                          ) : (
                            <Clock size={16} className="text-gray-400" />
                          )}
                          <span className="text-sm">Solicitor Pack Sent</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {selectedUnit.sale.legalStatus.contractSigned ? (
                            <CheckCircle size={16} className="text-green-500" />
                          ) : (
                            <Clock size={16} className="text-gray-400" />
                          )}
                          <span className="text-sm">Contract Signed</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {selectedUnit.sale.legalStatus.depositPaid ? (
                            <CheckCircle size={16} className="text-green-500" />
                          ) : (
                            <Clock size={16} className="text-gray-400" />
                          )}
                          <span className="text-sm">Deposit Paid</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {selectedUnit.sale.legalStatus.mortgageApproved ? (
                            <CheckCircle size={16} className="text-green-500" />
                          ) : (
                            <Clock size={16} className="text-gray-400" />
                          )}
                          <span className="text-sm">Mortgage Approved</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {selectedUnit.sale.legalStatus.exchangeCompleted ? (
                            <CheckCircle size={16} className="text-green-500" />
                          ) : (
                            <Clock size={16} className="text-gray-400" />
                          )}
                          <span className="text-sm">Exchange Completed</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {selectedUnit.sale.legalStatus.completionCompleted ? (
                            <CheckCircle size={16} className="text-green-500" />
                          ) : (
                            <Clock size={16} className="text-gray-400" />
                          )}
                          <span className="text-sm">Completion</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No buyer assigned to this unit</p>
                    <Button className="mt-4">
                      <Plus size={16} />
                      Assign Buyer
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}