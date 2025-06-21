import React from 'react';
import { Users, CreditCard, TrendingUp, DollarSign, UserPlus, AlertTriangle } from 'lucide-react';
import { StatCard } from '../../components/charts/StatCard';
import { AreaChart } from '../../components/charts/AreaChart';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { mockDashboardStats } from '../../data/mockData';

const monthlyDepositsData = [
  { name: 'Jan', value: 1200000 },
  { name: 'Feb', value: 1350000 },
  { name: 'Mar', value: 1500000 },
  { name: 'Apr', value: 1400000 },
  { name: 'May', value: 1650000 },
  { name: 'Jun', value: 1800000 },
];

const monthlyLoansData = [
  { name: 'Jan', value: 800000 },
  { name: 'Feb', value: 900000 },
  { name: 'Mar', value: 1100000 },
  { name: 'Apr', value: 950000 },
  { name: 'May', value: 1200000 },
  { name: 'Jun', value: 1350000 },
];

const recentActivities = [
  { 
    id: 1, 
    type: 'New Member', 
    description: 'Sarah Nakato joined the SACCO', 
    time: '2 hours ago',
    status: 'success'
  },
  { 
    id: 2, 
    type: 'Loan Approved', 
    description: 'Business loan for UGX 5,000,000 approved', 
    time: '4 hours ago',
    status: 'success'
  },
  { 
    id: 3, 
    type: 'Large Deposit', 
    description: 'UGX 2,000,000 deposited by John Doe', 
    time: '6 hours ago',
    status: 'success'
  },
  { 
    id: 4, 
    type: 'Fine Issued', 
    description: 'Late payment fine issued to Peter Ssali', 
    time: '1 day ago',
    status: 'warning'
  },
];

const quickActions = [
  { icon: UserPlus, label: 'Register New Member', color: 'text-green-600' },
  { icon: CreditCard, label: 'Approve Loan Application', color: 'text-blue-600' },
  { icon: DollarSign, label: 'Process Bulk Deposits', color: 'text-purple-600' },
  { icon: TrendingUp, label: 'Generate Monthly Report', color: 'text-orange-600' },
];

export const AdminDashboard: React.FC = () => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-UG').format(num);
  };

  return (
    <div className="p-6">
      {/* Header Card with modern gradient & glow */}
      <Card
        variant="gradient"
        interactive
        glow
        gradientDirection="diagonal"
        className="flex items-center justify-between mb-6"
        padding="lg"
      >
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Admin Dashboard</h1>
          <p className="text-secondary-600 mt-1">
            Welcome back! Here's what's happening at Kawempe SACCO today.
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="success" size="sm">
            <UserPlus className="h-4 w-4 mr-2" />
            Add Member
          </Button>
          <Button variant="info" size="sm">
            <TrendingUp className="h-4 w-4 mr-2" />
            View Reports
          </Button>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Total Members"
          value={formatNumber(mockDashboardStats.totalMembers)}
          change="+12.5% from last month"
          changeType="positive"
          icon={Users}
          iconColor="text-green-600"
        />
        <StatCard
          title="Active Loans"
          value={formatNumber(mockDashboardStats.activeLoans)}
          change="+8.2% from last month"
          changeType="positive"
          icon={CreditCard}
          iconColor="text-blue-600"
        />
        <StatCard
          title="Total Deposits"
          value={formatCurrency(mockDashboardStats.totalDeposits)}
          change="+15.7% from last month"
          changeType="positive"
          icon={DollarSign}
          iconColor="text-purple-600"
        />
        <StatCard
          title="Total Investments"
          value={formatCurrency(mockDashboardStats.totalInvestments)}
          change="+6.3% from last month"
          changeType="positive"
          icon={TrendingUp}
          iconColor="text-orange-600"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <AreaChart
            data={monthlyDepositsData}
            dataKey="value"
            color="#22c55e"
            title="Monthly Deposits Growth"
          />
        </Card>
        <Card>
          <AreaChart
            data={monthlyLoansData}
            dataKey="value"
            color="#3b82f6"
            title="Monthly Loans Disbursed"
          />
        </Card>
      </div>

      {/* Quick Actions & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Quick Actions */}
        <Card>
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            {quickActions.map((action, index) => (
              <Button 
                key={index}
                variant="outline" 
                className="w-full justify-start hover:bg-secondary-50 py-3"
                size="sm"
              >
                <action.icon className={`h-5 w-5 mr-3 ${action.color}`} />
                {action.label}
              </Button>
            ))}
          </div>
        </Card>

        {/* Recent Activities */}
        <Card>
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Recent Activities</h3>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 bg-secondary-50 rounded-lg">
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                  activity.status === 'success' ? 'bg-green-500' : 'bg-yellow-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-secondary-900">
                    {activity.type}
                  </p>
                  <p className="text-sm text-secondary-600">
                    {activity.description}
                  </p>
                  <p className="text-xs text-secondary-500 mt-1">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Alerts */}
      <Card className="border-l-4 border-l-yellow-500 bg-yellow-50">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-secondary-900">Pending Actions Required</h4>
            <ul className="mt-2 text-sm text-secondary-700 space-y-1">
              <li>• {mockDashboardStats.pendingApplications} loan applications pending approval</li>
              <li>• 5 members have overdue loan payments</li>
              <li>• 2 investment certificates expiring this month</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};
