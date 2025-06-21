import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Filter, 
  Download, 
  CreditCard, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Eye,
  UserCheck,
  DollarSign,
  Calendar,
  TrendingDown
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { clsx } from 'clsx';
import { format, parseISO } from 'date-fns';

interface Loan {
  id: string;
  memberId: string;
  memberNumber: string;
  memberName: string;
  loanType: 'emergency' | 'development' | 'education' | 'business';
  principalAmount: number;
  interestRate: number;
  termMonths: number;
  monthlyPayment: number;
  outstandingBalance: number;
  applicationDate: string;
  approvalDate?: string;
  disbursementDate?: string;
  status: 'pending' | 'approved' | 'disbursed' | 'active' | 'completed' | 'defaulted' | 'rejected';
  nextPaymentDate: string;
  guarantors: string[];
  purpose: string;
  collateralRequired: boolean;
  phoneNumber: string;
  nationalId: string;
}

const mockLoans: Loan[] = [
  {
    id: '1',
    memberId: 'mem1',
    memberNumber: 'KS001',
    memberName: 'John Mukasa',
    nationalId: 'CM90123456ABCD',
    phoneNumber: '+256701234567',
    loanType: 'development',
    principalAmount: 10000000,
    interestRate: 15.0,
    termMonths: 24,
    monthlyPayment: 520833,
    outstandingBalance: 7500000,
    applicationDate: '2024-05-15',
    approvalDate: '2024-05-20',
    disbursementDate: '2024-05-25',
    status: 'active',
    nextPaymentDate: '2025-07-10',
    guarantors: ['Sarah Nakato', 'Robert Mugisha'],
    purpose: 'Farm expansion and equipment purchase',
    collateralRequired: true,
  },
  {
    id: '2',
    memberId: 'mem2',
    memberNumber: 'KS002',
    memberName: 'Sarah Nakato',
    nationalId: 'CM85098765WXYZ',
    phoneNumber: '+256772345678',
    loanType: 'emergency',
    principalAmount: 2000000,
    interestRate: 12.0,
    termMonths: 12,
    monthlyPayment: 177698,
    outstandingBalance: 1500000,
    applicationDate: '2025-06-10',
    approvalDate: '2025-06-12',
    disbursementDate: '2025-06-15',
    status: 'active',
    nextPaymentDate: '2025-07-15',
    guarantors: ['John Mukasa'],
    purpose: 'Medical emergency expenses',
    collateralRequired: false,
  },
  {
    id: '3',
    memberId: 'mem3',
    memberNumber: 'KS003',
    memberName: 'Robert Mugisha',
    nationalId: 'CM92112233EFGH',
    phoneNumber: '+256753456789',
    loanType: 'business',
    principalAmount: 5000000,
    interestRate: 18.0,
    termMonths: 18,
    monthlyPayment: 350000,
    outstandingBalance: 0,
    applicationDate: '2024-03-20',
    approvalDate: '2024-03-25',
    disbursementDate: '2024-04-01',
    status: 'completed',
    nextPaymentDate: '',
    guarantors: ['Grace Auma', 'David Okello'],
    purpose: 'Retail shop expansion',
    collateralRequired: true,
  },
  {
    id: '4',
    memberId: 'mem4',
    memberNumber: 'KS004',
    memberName: 'Grace Auma',
    nationalId: 'CM88076543IJKL',
    phoneNumber: '+256784567890',
    loanType: 'education',
    principalAmount: 3000000,
    interestRate: 10.0,
    termMonths: 36,
    monthlyPayment: 105000,
    outstandingBalance: 2800000,
    applicationDate: '2025-06-15',
    status: 'pending',
    nextPaymentDate: '',
    guarantors: ['John Mukasa', 'Sarah Nakato'],
    purpose: 'University tuition fees',
    collateralRequired: false,
  },
  {
    id: '5',
    memberId: 'mem5',
    memberNumber: 'KS005',
    memberName: 'David Okello',
    nationalId: 'CM95031122MNOP',
    phoneNumber: '+256712345678',
    loanType: 'development',
    principalAmount: 8000000,
    interestRate: 16.0,
    termMonths: 30,
    monthlyPayment: 350000,
    outstandingBalance: 6500000,
    applicationDate: '2025-04-10',
    approvalDate: '2025-04-15',
    disbursementDate: '2025-04-20',
    status: 'defaulted',
    nextPaymentDate: '2025-06-10',
    guarantors: ['Robert Mugisha'],
    purpose: 'Construction project',
    collateralRequired: true,
  },
];

export const LoansPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loanTypeFilter, setLoanTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [nextPaymentFilter, setNextPaymentFilter] = useState<string>('');
  const [disbursementFilter, setDisbursementFilter] = useState<string>('');
  const [portfolioRiskFilter, setPortfolioRiskFilter] = useState<string>('all');
  
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [showLoanModal, setShowLoanModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showNewApplicationModal, setShowNewApplicationModal] = useState(false);

  // New loan application form state
  const [newLoanApplication, setNewLoanApplication] = useState({
    memberNumber: '',
    loanType: 'development',
    principalAmount: '',
    purpose: '',
    guarantor1: '',
    guarantor2: '',
    termMonths: '24',
  });

  useEffect(() => {
    setTimeout(() => {
      setLoans(mockLoans);
      setIsLoading(false);
    }, 800);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'disbursed': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'defaulted': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLoanTypeColor = (type: string) => {
    switch (type) {
      case 'emergency': return 'bg-red-100 text-red-800';
      case 'development': return 'bg-blue-100 text-blue-800';
      case 'education': return 'bg-green-100 text-green-800';
      case 'business': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredLoans = useMemo(() => loans.filter(loan => {
    const matchesSearch = 
      loan.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.memberNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLoanType = loanTypeFilter === 'all' || loan.loanType === loanTypeFilter;
    const matchesStatus = statusFilter === 'all' || loan.status === statusFilter;
    
    const matchesNextPayment = !nextPaymentFilter || 
      (loan.nextPaymentDate && format(parseISO(loan.nextPaymentDate), 'yyyy-MM') === nextPaymentFilter);
    
    const matchesDisbursement = !disbursementFilter || 
      (loan.disbursementDate && format(parseISO(loan.disbursementDate), 'yyyy-MM') === disbursementFilter);
    
    const riskRatio = loan.outstandingBalance / loan.principalAmount;
    const matchesRisk = portfolioRiskFilter === 'all' || 
      (portfolioRiskFilter === 'high' && loan.status === 'defaulted') ||
      (portfolioRiskFilter === 'medium' && riskRatio > 0.3 && riskRatio <= 0.7) ||
      (portfolioRiskFilter === 'low' && riskRatio <= 0.3);
    
    return matchesSearch && matchesLoanType && matchesStatus && matchesNextPayment && matchesDisbursement && matchesRisk;
  }), [loans, searchTerm, loanTypeFilter, statusFilter, nextPaymentFilter, disbursementFilter, portfolioRiskFilter]);

  const handleApprove = (loan: Loan) => {
    setLoans(loans.map(l => 
      l.id === loan.id 
        ? { ...l, status: 'approved', approvalDate: new Date().toISOString() }
        : l
    ));
    setShowApprovalModal(false);
  };

  const handleReject = (loan: Loan) => {
    setLoans(loans.map(l => 
      l.id === loan.id 
        ? { ...l, status: 'rejected' }
        : l
    ));
    setShowApprovalModal(false);
  };

  const handleExport = () => {
    const csvContent = [
      ['Member Name', 'Member Number', 'Loan Type', 'Principal Amount', 'Outstanding Balance', 'Status', 'Next Payment Date'],
      ...filteredLoans.map(loan => [
        `"${loan.memberName}"`,
        loan.memberNumber,
        loan.loanType,
        loan.principalAmount.toString(),
        loan.outstandingBalance.toString(),
        loan.status,
        loan.nextPaymentDate ? format(parseISO(loan.nextPaymentDate), 'yyyy-MM-dd') : 'N/A'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `loans-export-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleNewApplicationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newLoan: Loan = {
      id: `loan-${Date.now()}`,
      memberId: `mem-${Date.now()}`,
      memberNumber: newLoanApplication.memberNumber,
      memberName: 'New Applicant', // In a real app, you'd fetch this
      nationalId: 'CM12345678ABCD',
      phoneNumber: '+256700000000',
      loanType: newLoanApplication.loanType as any,
      principalAmount: parseFloat(newLoanApplication.principalAmount),
      interestRate: 15.0,
      termMonths: parseInt(newLoanApplication.termMonths),
      monthlyPayment: parseFloat(newLoanApplication.principalAmount) / parseInt(newLoanApplication.termMonths),
      outstandingBalance: parseFloat(newLoanApplication.principalAmount),
      applicationDate: new Date().toISOString(),
      status: 'pending',
      nextPaymentDate: '',
      guarantors: [newLoanApplication.guarantor1, newLoanApplication.guarantor2].filter(Boolean),
      purpose: newLoanApplication.purpose,
      collateralRequired: newLoanApplication.loanType === 'development' || newLoanApplication.loanType === 'business',
    };
    
    setLoans([newLoan, ...loans]);
    setShowNewApplicationModal(false);
    setNewLoanApplication({
      memberNumber: '',
      loanType: 'development',
      principalAmount: '',
      purpose: '',
      guarantor1: '',
      guarantor2: '',
      termMonths: '24',
    });
  };

  const totalActiveLoans = loans.filter(l => l.status === 'active').length;
  const totalOutstanding = loans.reduce((sum, loan) => 
    loan.status === 'active' ? sum + loan.outstandingBalance : sum, 0
  );
  const pendingApplications = loans.filter(l => l.status === 'pending').length;
  const defaultedLoans = loans.filter(l => l.status === 'defaulted').length;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-secondary-900">Enhanced Loan Management</h1>
        <p className="text-secondary-600 mt-1">
          Comprehensive loan lifecycle management with approvals, disbursements, and collections
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <div className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Active Loans</p>
                {isLoading ? <Skeleton height={30} width={60} /> : <p className="text-2xl font-bold text-green-600 mt-1">{totalActiveLoans}</p>}
              </div>
              <div className="bg-green-50 p-3 rounded-full"><CreditCard className="h-6 w-6 text-green-600" /></div>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Outstanding Balance</p>
                {isLoading ? <Skeleton height={30} width={120} /> : <p className="text-2xl font-bold text-blue-600 mt-1">{formatCurrency(totalOutstanding)}</p>}
              </div>
              <div className="bg-blue-50 p-3 rounded-full"><DollarSign className="h-6 w-6 text-blue-600" /></div>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Pending Applications</p>
                {isLoading ? <Skeleton height={30} width={60} /> : <p className="text-2xl font-bold text-yellow-600 mt-1">{pendingApplications}</p>}
              </div>
              <div className="bg-yellow-50 p-3 rounded-full"><Clock className="h-6 w-6 text-yellow-600" /></div>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Defaulted Loans</p>
                {isLoading ? <Skeleton height={30} width={60} /> : <p className="text-2xl font-bold text-red-600 mt-1">{defaultedLoans}</p>}
              </div>
              <div className="bg-red-50 p-3 rounded-full"><AlertTriangle className="h-6 w-6 text-red-600" /></div>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card className="mb-6">
        <div className="p-4 flex flex-col gap-4">
          {/* First row - Search and main filters */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search loans by member name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <select
                value={loanTypeFilter}
                onChange={(e) => setLoanTypeFilter(e.target.value)}
                className="px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Loan Types</option>
                <option value="emergency">Emergency</option>
                <option value="development">Development</option>
                <option value="education">Education</option>
                <option value="business">Business</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="defaulted">Defaulted</option>
              </select>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />Export
              </Button>
              <Button onClick={() => setShowNewApplicationModal(true)}>
                <Plus className="h-4 w-4 mr-2" />New Application
              </Button>
            </div>
          </div>
          
          {/* Second row - Advanced filters */}
          <div className="flex flex-col md:flex-row gap-4 border-t border-secondary-200 pt-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-secondary-500" />
              <label className="text-sm font-medium text-secondary-700">Next Payments:</label>
              <input
                type="month"
                value={nextPaymentFilter}
                onChange={(e) => setNextPaymentFilter(e.target.value)}
                className="px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-secondary-500" />
              <label className="text-sm font-medium text-secondary-700">Disbursed:</label>
              <input
                type="month"
                value={disbursementFilter}
                onChange={(e) => setDisbursementFilter(e.target.value)}
                className="px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-secondary-500" />
              <label className="text-sm font-medium text-secondary-700">Portfolio at Risk:</label>
              <select
                value={portfolioRiskFilter}
                onChange={(e) => setPortfolioRiskFilter(e.target.value)}
                className="px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Risk Levels</option>
                <option value="low">Low Risk (≤30%)</option>
                <option value="medium">Medium Risk (31-70%)</option>
                <option value="high">High Risk (Defaulted)</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Loans Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-secondary-200">
            <thead className="bg-secondary-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Member</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Loan Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Outstanding</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-secondary-200">
              {isLoading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4"><Skeleton height={40} width={150} /></td>
                    <td className="px-6 py-4"><Skeleton height={40} width={120} /></td>
                    <td className="px-6 py-4"><Skeleton height={40} width={100} /></td>
                    <td className="px-6 py-4"><Skeleton height={40} width={100} /></td>
                    <td className="px-6 py-4"><Skeleton height={40} width={80} /></td>
                    <td className="px-6 py-4"><Skeleton height={40} width={100} /></td>
                  </tr>
                ))
              ) : (
                filteredLoans.map((loan) => (
                  <tr key={loan.id} className="hover:bg-secondary-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="font-medium text-secondary-900">{loan.memberName}</p>
                        <p className="text-sm text-secondary-500">{loan.memberNumber} • {loan.phoneNumber}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getLoanTypeColor(loan.loanType)}`}>
                          {loan.loanType}
                        </span>
                        <p className="text-sm text-secondary-600 mt-1">{loan.interestRate}% • {loan.termMonths} months</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="font-medium text-secondary-900">{formatCurrency(loan.principalAmount)}</p>
                      <p className="text-sm text-secondary-600">{formatCurrency(loan.monthlyPayment)}/month</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="font-medium text-secondary-900">{formatCurrency(loan.outstandingBalance)}</p>
                      {loan.nextPaymentDate && (
                        <p className="text-sm text-secondary-600">Due: {format(new Date(loan.nextPaymentDate), 'MMM dd, yyyy')}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(loan.status)}`}>
                        {loan.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => { setSelectedLoan(loan); setShowLoanModal(true); }}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        {loan.status === 'pending' && (
                          <Button size="sm" variant="success" onClick={() => { setSelectedLoan(loan); setShowApprovalModal(true); }}>
                            <UserCheck className="h-4 w-4" />
                          </Button>
                        )}
                        {loan.status === 'active' && (
                          <Button size="sm" onClick={() => { setSelectedLoan(loan); setShowPaymentModal(true); }}>
                            <DollarSign className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* New Application Modal */}
      {showNewApplicationModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-screen overflow-y-auto">
            <form onSubmit={handleNewApplicationSubmit}>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">New Loan Application</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">Member Number *</label>
                    <input
                      type="text"
                      value={newLoanApplication.memberNumber}
                      onChange={(e) => setNewLoanApplication({...newLoanApplication, memberNumber: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="e.g., KS006"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">Loan Type *</label>
                    <select
                      value={newLoanApplication.loanType}
                      onChange={(e) => setNewLoanApplication({...newLoanApplication, loanType: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="emergency">Emergency</option>
                      <option value="development">Development</option>
                      <option value="education">Education</option>
                      <option value="business">Business</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">Principal Amount (UGX) *</label>
                    <input
                      type="number"
                      value={newLoanApplication.principalAmount}
                      onChange={(e) => setNewLoanApplication({...newLoanApplication, principalAmount: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="e.g., 5000000"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">Term (Months) *</label>
                    <select
                      value={newLoanApplication.termMonths}
                      onChange={(e) => setNewLoanApplication({...newLoanApplication, termMonths: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="12">12 months</option>
                      <option value="18">18 months</option>
                      <option value="24">24 months</option>
                      <option value="36">36 months</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-secondary-700 mb-1">Purpose *</label>
                    <textarea
                      value={newLoanApplication.purpose}
                      onChange={(e) => setNewLoanApplication({...newLoanApplication, purpose: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      rows={3}
                      placeholder="Describe the purpose of the loan..."
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">Guarantor 1 *</label>
                    <input
                      type="text"
                      value={newLoanApplication.guarantor1}
                      onChange={(e) => setNewLoanApplication({...newLoanApplication, guarantor1: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="First guarantor name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">Guarantor 2</label>
                    <input
                      type="text"
                      value={newLoanApplication.guarantor2}
                      onChange={(e) => setNewLoanApplication({...newLoanApplication, guarantor2: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Second guarantor name (optional)"
                    />
                  </div>
                </div>
              </div>
              <div className="bg-secondary-50 p-4 flex justify-end gap-2">
                <Button variant="outline" type="button" onClick={() => setShowNewApplicationModal(false)}>Cancel</Button>
                <Button type="submit">Submit Application</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Loan Details Modal */}
      {showLoanModal && selectedLoan && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Loan Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-secondary-700 mb-2">Member Information</h4>
                  <p><span className="text-secondary-600">Name:</span> {selectedLoan.memberName}</p>
                  <p><span className="text-secondary-600">Member #:</span> {selectedLoan.memberNumber}</p>
                  <p><span className="text-secondary-600">Phone:</span> {selectedLoan.phoneNumber}</p>
                  <p><span className="text-secondary-600">National ID:</span> {selectedLoan.nationalId}</p>
                </div>
                <div>
                  <h4 className="font-medium text-secondary-700 mb-2">Loan Information</h4>
                  <p><span className="text-secondary-600">Type:</span> {selectedLoan.loanType}</p>
                  <p><span className="text-secondary-600">Amount:</span> {formatCurrency(selectedLoan.principalAmount)}</p>
                  <p><span className="text-secondary-600">Interest:</span> {selectedLoan.interestRate}%</p>
                  <p><span className="text-secondary-600">Term:</span> {selectedLoan.termMonths} months</p>
                </div>
                <div className="md:col-span-2">
                  <h4 className="font-medium text-secondary-700 mb-2">Purpose</h4>
                  <p className="text-secondary-900">{selectedLoan.purpose}</p>
                </div>
                <div className="md:col-span-2">
                  <h4 className="font-medium text-secondary-700 mb-2">Guarantors</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedLoan.guarantors.map((guarantor, i) => (
                      <span key={i} className="px-2 py-1 bg-primary-100 text-primary-800 rounded-full text-sm">
                        {guarantor}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-secondary-50 p-4 flex justify-end">
              <Button variant="outline" onClick={() => setShowLoanModal(false)}>Close</Button>
            </div>
          </Card>
        </div>
      )}

      {/* Approval Modal */}
      {showApprovalModal && selectedLoan && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <div className="p-6 text-center">
              <UserCheck className="mx-auto h-12 w-12 text-blue-500" />
              <h3 className="text-lg font-semibold mt-4">Approve Loan Application</h3>
              <p className="text-secondary-600 mt-2">
                Are you sure you want to approve the loan of <span className="font-bold">{formatCurrency(selectedLoan.principalAmount)}</span> for {selectedLoan.memberName}?
              </p>
            </div>
            <div className="bg-secondary-50 p-4 flex justify-center gap-2">
              <Button variant="outline" onClick={() => setShowApprovalModal(false)}>Cancel</Button>
              <Button variant="success" onClick={() => handleApprove(selectedLoan)}>Approve</Button>
              <Button variant="danger" onClick={() => handleReject(selectedLoan)}>Reject</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
