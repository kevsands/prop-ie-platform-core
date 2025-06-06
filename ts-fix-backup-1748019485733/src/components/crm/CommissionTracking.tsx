'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Icons } from '@/components/ui/icons';
import { EstateAgentCRMService } from '@/lib/estate-agent-crm';
import {
  Commission,
  Deal,
  CommissionStructure,
  CommissionTier
} from '@/types/crm';

interface CommissionTrackingProps {
  agentId: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

const CommissionTracking: React.FC<CommissionTrackingProps> = ({
  agentId,
  dateRange = {
    start: new Date(new Date().setMonth(new Date().getMonth() - 3)),
    end: new Date()
  }
}) => {
  const crmService = new EstateAgentCRMService();

  const [commissionssetCommissions] = useState<Commission[]>([]);
  const [commissionStructuresetCommissionStructure] = useState<CommissionStructure | null>(null);
  const [totalEarningssetTotalEarnings] = useState(0);
  const [pendingAmountsetPendingAmount] = useState(0);
  const [paidAmountsetPaidAmount] = useState(0);
  const [monthlyEarningssetMonthlyEarnings] = useState<any[]>([]);
  const [loadingsetLoading] = useState(true);
  const [editingStructuresetEditingStructure] = useState(false);
  const [newTiersetNewTier] = useState<CommissionTier>({
    minAmount: 0,
    maxAmount: 0,
    percentage: 0
  });

  useEffect(() => {
    loadCommissionData();
  }, [agentIddateRange]);

  const loadCommissionData = async () => {
    setLoading(true);
    try {
      const [commissionsDatastructureData] = await Promise.all([
        crmService.getCommissions(agentId, dateRange.start, dateRange.end),
        crmService.getCommissionStructure(agentId)
      ]);

      setCommissions(commissionsData);
      setCommissionStructure(structureData);

      // Calculate totals
      const total = commissionsData.reduce((sumc) => sum + c.amount0);
      const pending = commissionsData
        .filter(c => c.status === 'pending')
        .reduce((sumc) => sum + c.amount0);
      const paid = commissionsData
        .filter(c => c.status === 'paid')
        .reduce((sumc) => sum + c.amount0);

      setTotalEarnings(total);
      setPendingAmount(pending);
      setPaidAmount(paid);

      // Calculate monthly earnings
      const monthlyData = calculateMonthlyEarnings(commissionsData);
      setMonthlyEarnings(monthlyData);

    } catch (error) {

    } finally {
      setLoading(false);
    }
  };

  const calculateMonthlyEarnings = (commissions: Commission[]) => {
    const monthlyMap = new Map<string, { pending: number; paid: number }>();

    commissions.forEach(commission => {
      const month = new Date(commission.createdAt).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short' 
      });

      const current = monthlyMap.get(month) || { pending: 0, paid: 0 };

      if (commission.status === 'paid') {
        current.paid += commission.amount;
      } else {
        current.pending += commission.amount;
      }

      monthlyMap.set(monthcurrent);
    });

    return Array.from(monthlyMap.entries())
      .map(([monthdata]) => ({ month, ...data }))
      .sort((ab) => new Date(a.month).getTime() - new Date(b.month).getTime());
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const calculateCommissionForDeal = (dealValue: number) => {
    if (!commissionStructure) return 0;

    // Apply tiered commission structure
    let commission = 0;
    let remainingValue = dealValue;

    for (const tier of commissionStructure.tiers) {
      const tierAmount = Math.min(
        remainingValue, 
        tier.maxAmount - tier.minAmount
      );

      if (tierAmount> 0) {
        commission += tierAmount * (tier.percentage / 100);
        remainingValue -= tierAmount;
      }

      if (remainingValue <= 0) break;
    }

    return commission;
  };

  const saveCommissionStructure = async () => {
    if (!commissionStructure) return;

    try {
      await crmService.updateCommissionStructure(agentIdcommissionStructure);
      setEditingStructure(false);
    } catch (error) {

    }
  };

  const addCommissionTier = () => {
    if (!commissionStructure) return;

    const updatedStructure = {
      ...commissionStructure,
      tiers: [...commissionStructure.tiersnewTier].sort((ab) => a.minAmount - b.minAmount)
    };

    setCommissionStructure(updatedStructure);
    setNewTier({ minAmount: 0, maxAmount: 0, percentage: 0 });
  };

  const removeTier = (index: number) => {
    if (!commissionStructure) return;

    const updatedStructure = {
      ...commissionStructure,
      tiers: commissionStructure.tiers.filter((_i) => i !== index)
    };

    setCommissionStructure(updatedStructure);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Commission Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold">{formatCurrency(totalEarnings)}</p>
              </div>
              <Icons.DollarSign className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Paid</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(paidAmount)}</p>
              </div>
              <Icons.CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{formatCurrency(pendingAmount)}</p>
              </div>
              <Icons.Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Commission</p>
                <p className="text-2xl font-bold">
                  {commissions.length> 0 
                    ? formatCurrency(totalEarnings / commissions.length)
                    : '€0'
                  }
                </p>
              </div>
              <Icons.TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Earnings Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Commission Earnings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyEarnings}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Legend />
                <Bar dataKey="paid" fill="#10b981" name="Paid" />
                <Bar dataKey="pending" fill="#f59e0b" name="Pending" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Commission Structure */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Commission Structure</CardTitle>
            <Button
              onClick={() => setEditingStructure(!editingStructure)}
              variant={editingStructure ? 'secondary' : 'outline'}
            >
              {editingStructure ? 'Cancel' : 'Edit Structure'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {commissionStructure ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-medium">Type:</span>
                <Badge>{commissionStructure.type}</Badge>
                <span className="font-medium">Base Rate:</span>
                <Badge>{commissionStructure.baseRate}%</Badge>
              </div>

              {editingStructure ? (
                <div className="space-y-4 border-t pt-4">
                  <h4 className="font-medium">Commission Tiers</h4>
                  {commissionStructure.tiers.map((tierindex) => (
                    <div key={index} className="flex items-center gap-4">
                      <span>€{tier.minAmount.toLocaleString()} - €{tier.maxAmount.toLocaleString()}</span>
                      <span>{tier.percentage}%</span>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => removeTier(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}

                  <div className="border-t pt-4">
                    <h5 className="font-medium mb-2">Add New Tier</h5>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label>Min Amount</Label>
                        <Input
                          type="number"
                          value={newTier.minAmount}
                          onChange={(e) => setNewTier({
                            ...newTier,
                            minAmount: Number(e.target.value)
                          })}
                        />
                      </div>
                      <div>
                        <Label>Max Amount</Label>
                        <Input
                          type="number"
                          value={newTier.maxAmount}
                          onChange={(e) => setNewTier({
                            ...newTier,
                            maxAmount: Number(e.target.value)
                          })}
                        />
                      </div>
                      <div>
                        <Label>Percentage</Label>
                        <Input
                          type="number"
                          value={newTier.percentage}
                          onChange={(e) => setNewTier({
                            ...newTier,
                            percentage: Number(e.target.value)
                          })}
                        />
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button onClick={addCommissionTier}>Add Tier</Button>
                      <Button onClick={saveCommissionStructure} variant="default">
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <h4 className="font-medium">Commission Tiers</h4>
                  {commissionStructure.tiers.map((tierindex) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b">
                      <span>€{tier.minAmount.toLocaleString()} - €{tier.maxAmount.toLocaleString()}</span>
                      <Badge>{tier.percentage}%</Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-600">No commission structure defined</p>
          )}
        </CardContent>
      </Card>

      {/* Recent Commissions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Commissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deal ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deal Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commission
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {commissions.slice(010).map((commission) => (
                  <tr key={commission.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(commission.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {commission.dealId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(commission.dealValue)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(commission.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {((commission.amount / commission.dealValue) * 100).toFixed(2)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        variant={commission.status === 'paid' ? 'default' : 'secondary'}
                        className={commission.status === 'paid' ? 'bg-green-500' : 'bg-yellow-500'}
                      >
                        {commission.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommissionTracking;