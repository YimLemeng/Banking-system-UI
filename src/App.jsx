import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Toast from './components/Toast';

// Modals
import DepositModal from './components/modals/DepositModal';
import WithdrawModal from './components/modals/WithdrawModal';
import TransferModal from './components/modals/TransferModal';
import OpenAccountModal from './components/modals/OpenAccountModal';
import CreateCustomerModal from './components/modals/CreateCustomerModal';
import EditCustomerModal from './components/modals/EditCustomerModal';
import ViewCustomerModal from './components/modals/ViewCustomerModal';
import LogoutConfirmModal from './components/modals/LogoutConfirmModal';

// Pages
import Dashboard from './pages/Dashboard';
import TellerCounter from './pages/TellerCounter';
import CustomerAccounts from './pages/CustomerAccounts';
import CustomerKYC from './pages/CustomerKYC';
import AuditTrail from './pages/AuditTrail';
import Statements from './pages/Statements';
import LoginPage from './pages/LoginPage';
import SystemUsers from './pages/SystemUsers';
import StaffProfile from './pages/StaffProfile';

import { accountService, customerService, auditService } from './services/api';
import { useAuth } from './context/AuthContext';
import { useLoading } from './context/LoadingContext';

const VALID_TABS = ['overview', 'counter', 'accounts', 'statements', 'kyc', 'users', 'audit', 'profile'];

const getInitialTab = () => {
  const rawPath = window.location.pathname.replace(/^\/+/, '').split('/')[0].toLowerCase();
  if (VALID_TABS.includes(rawPath)) {
    return rawPath;
  }
  const saved = localStorage.getItem('trustbank_active_tab');
  if (VALID_TABS.includes(saved)) {
    return saved;
  }
  return 'overview';
};

export default function App() {
  const { lang, logout, isAdmin, isAuthenticated } = useAuth();
  const { withLoading } = useLoading();

  const [activeTab, setActiveTab] = useState(getInitialTab);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [loading, setLoading] = useState(false);

  // Synchronize URL and localStorage with active tab
  useEffect(() => {
    if (!isAuthenticated) return;

    localStorage.setItem('trustbank_active_tab', activeTab);
    const targetPath = activeTab === 'overview' ? '/' : `/${activeTab}`;
    if (window.location.pathname !== targetPath) {
      window.history.replaceState({ page: activeTab }, '', targetPath);
    }
  }, [activeTab, isAuthenticated]);

  // Browser History Guard (Handles tab navigation and prevents escaping to login)
  useEffect(() => {
    if (!isAuthenticated) return;

    const targetPath = activeTab === 'overview' ? '/' : `/${activeTab}`;
    window.history.replaceState({ page: activeTab }, '', targetPath);

    const handlePopState = () => {
      const path = window.location.pathname.replace(/^\/+/, '').split('/')[0].toLowerCase();
      if (VALID_TABS.includes(path)) {
        setActiveTab(path);
      } else {
        const fallbackPath = activeTab === 'overview' ? '/' : `/${activeTab}`;
        window.history.pushState({ page: activeTab }, '', fallbackPath);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isAuthenticated, activeTab]);

  // Security Guard: restrict System Users and Audit Trail to Admin only
  useEffect(() => {
    if (!isAdmin && (activeTab === 'users' || activeTab === 'audit')) {
      setActiveTab('overview');
    }
  }, [isAdmin, activeTab]);

  // Core Data - 100% Live from Database
  const [accounts, setAccounts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  // Dynamic live stats calculated from real database
  const stats = useMemo(() => {
    const usdVault = accounts.reduce((sum, a) => sum + (parseFloat(a.balance) || 0), 0);
    const khrVault = Math.round(usdVault * 4100);
    return {
      usdVault,
      khrVault,
      activeAccounts: accounts.length,
      kycClients: customers.length,
    };
  }, [accounts, customers]);

  // Modals
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showCreateAccountModal, setShowCreateAccountModal] = useState(false);
  const [selectedCustomerForAccount, setSelectedCustomerForAccount] = useState(null);
  const [showCreateCustomerModal, setShowCreateCustomerModal] = useState(false);
  const [showEditCustomerModal, setShowEditCustomerModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [showViewCustomerModal, setShowViewCustomerModal] = useState(false);
  const [viewingCustomer, setViewingCustomer] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [tabLoading, setTabLoading] = useState(false);

  // Teller Counter Active Operation & Account for Direct Sidebar Navigation
  const [tellerState, setTellerState] = useState({
    operation: 'DEPOSIT',
    sourceAccount: '',
    targetAccount: '',
  });
  const [tellerResetKey, setTellerResetKey] = useState(0);

  const handleTabChange = (newTab, options = {}) => {
    // Whenever clicking any sidebar item or navigating tabs, clear teller counter input fields
    if (!options.preserveTeller) {
      setTellerState({
        operation: 'DEPOSIT',
        sourceAccount: '',
        targetAccount: '',
      });
      setTellerResetKey((prev) => prev + 1);
    }

    if (newTab === activeTab) return;
    setActiveTab(newTab);
    const targetPath = newTab === 'overview' ? '/' : `/${newTab}`;
    window.history.pushState({ page: newTab }, '', targetPath);
    localStorage.setItem('trustbank_active_tab', newTab);
  };

  const navigateToTeller = (operation, accountNum = '') => {
    setTellerState({
      operation: operation || 'DEPOSIT',
      sourceAccount: operation === 'DEPOSIT' ? '' : (accountNum || ''),
      targetAccount: operation === 'DEPOSIT' ? (accountNum || '') : '',
    });
    setTellerResetKey((prev) => prev + 1);
    handleTabChange('counter', { preserveTeller: true });
  };

  // Toast
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const showNotification = (message, type = 'success') => {
    setToast({ message, type });
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(prev => !prev);
  };

  // Fetch real data from backend in parallel
  const fetchAllData = useCallback(async () => {
    setLoading(true);
    let onlineStatus = false;

    try {
      const requests = [
        accountService.getAll(0, 100),
        customerService.getAll('', 0, 100),
      ];

      // Only fetch audit logs if admin to prevent 403 Forbidden latency
      if (isAdmin) {
        requests.push(auditService.getAll(0, 100));
      }

      const results = await Promise.allSettled(requests);
      const [accResult, custResult, auditResult] = results;

      if (accResult && accResult.status === 'fulfilled') {
        const accContent = accResult.value?.data?.content || accResult.value?.data;
        if (Array.isArray(accContent)) {
          setAccounts(accContent);
          onlineStatus = true;
        }
      }

      if (custResult && custResult.status === 'fulfilled') {
        const custContent = custResult.value?.data?.content || custResult.value?.data;
        if (Array.isArray(custContent)) {
          setCustomers(custContent);
          onlineStatus = true;
        }
      }

      if (auditResult && auditResult.status === 'fulfilled') {
        const auditContent = auditResult.value?.data?.content || auditResult.value?.data;
        if (Array.isArray(auditContent)) {
          setAuditLogs(auditContent);
          onlineStatus = true;
        }
      }
    } catch (e) {
      console.warn('Could not load core banking data:', e);
    } finally {
      setIsOnline(onlineStatus);
      setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllData();
    }
  }, [fetchAllData, isAuthenticated]);

  const handleRefresh = async () => {
    await fetchAllData();
  };

  // Handlers for real transaction & entity updates from database
  const handleTransactionSuccess = (msg) => {
    showNotification(msg, 'success');
    fetchAllData();
  };

  const handleAccountCreated = (msg) => {
    showNotification(msg, 'success');
    fetchAllData();
  };

  const handleCustomerCreated = (msg) => {
    showNotification(msg, 'success');
    fetchAllData();
  };

  const handleCustomerUpdated = (msg) => {
    showNotification(msg, 'success');
    fetchAllData();
  };

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    logout();
    localStorage.removeItem('trustbank_active_tab');
    window.history.replaceState({ page: 'login' }, '', '/');
    showNotification(lang === 'kh' ? 'បានចាកចេញពីស្ថានីយដោយជោគជ័យ' : 'Signed out from Core Banking Terminal', 'success');
  };

  // If not authenticated, always show LoginPage (Refresh on login page stays on login page!)
  if (!isAuthenticated) {
    return (
      <LoginPage
        onLoginSuccess={(msg) => {
          showNotification(msg, 'success');
          fetchAllData();
          const targetPath = activeTab === 'overview' ? '/' : `/${activeTab}`;
          window.history.replaceState({ page: activeTab }, '', targetPath);
        }}
      />
    );
  }

  return (
    <div className="h-screen max-h-screen bg-[#070a13] text-slate-100 flex flex-col font-sans overflow-hidden relative">
      {/* Top Fixed Header with Sidebar Toggle */}
      <Header 
        isOnline={isOnline}
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={toggleSidebar}
        onOpenProfile={() => switchTab('profile')}
      />

      {/* Top Loading Progress Bar */}
      {tabLoading && (
        <div className="fixed top-16 left-0 right-0 z-50 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 animate-pulse shadow-md shadow-blue-500/50 pointer-events-none" />
      )}

      <div className="flex-1 flex w-full min-h-0 overflow-hidden">
        {/* Left Sidebar with Collapse state & Logout button */}
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={handleTabChange}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={toggleSidebar}
          onLogout={() => setShowLogoutModal(true)}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-5 sm:p-6 lg:p-8 min-w-0 overflow-y-auto h-full">
          {activeTab === 'overview' && (
            <Dashboard
              accounts={accounts}
              customers={customers}
              stats={stats}
              loading={loading}
              onRefresh={() => handleRefresh(lang === 'kh' ? 'កំពុងទាញយកទិន្នន័យសមតុល្យ & គណនី...' : 'Refreshing Depository Ledger & Accounts...')}
              onOpenDeposit={(accNum) => navigateToTeller('DEPOSIT', typeof accNum === 'string' ? accNum : '')}
              onOpenWithdraw={(accNum) => navigateToTeller('WITHDRAW', typeof accNum === 'string' ? accNum : '')}
              onOpenTransfer={(accNum) => navigateToTeller('TRANSFER', typeof accNum === 'string' ? accNum : '')}
              onOpenCreateAccount={() => handleTabChange('accounts')}
              onOpenCreateCustomer={() => handleTabChange('kyc')}
            />
          )}

          {activeTab === 'counter' && (
            <TellerCounter
              key={`teller-counter-${tellerResetKey}`}
              accounts={accounts}
              onRefresh={() => {
                setTellerState({ operation: 'DEPOSIT', sourceAccount: '', targetAccount: '' });
                setTellerResetKey((prev) => prev + 1);
                handleRefresh(lang === 'kh' ? 'កំពុងទាញយកទិន្នន័យសមតុល្យ & គណនី...' : 'Refreshing Depository Ledger & Accounts...');
              }}
              onSuccess={handleTransactionSuccess}
              initialOperation={tellerState.operation}
              initialSourceAccount={tellerState.sourceAccount}
              initialTargetAccount={tellerState.targetAccount}
            />
          )}

          {activeTab === 'accounts' && (
            <CustomerAccounts
              accounts={accounts}
              onRefresh={() => handleRefresh(lang === 'kh' ? 'កំពុងទាញយកទិន្នន័យសមតុល្យ & គណនី...' : 'Refreshing Depository Ledger & Accounts...')}
              onOpenDeposit={(accNum) => navigateToTeller('DEPOSIT', typeof accNum === 'string' ? accNum : '')}
              onOpenWithdraw={(accNum) => navigateToTeller('WITHDRAW', typeof accNum === 'string' ? accNum : '')}
              onOpenTransfer={(accNum) => navigateToTeller('TRANSFER', typeof accNum === 'string' ? accNum : '')}
              onOpenCreateAccount={() => {
                setSelectedCustomerForAccount(null);
                setShowCreateAccountModal(true);
              }}
            />
          )}

          {activeTab === 'statements' && (
            <Statements
              accounts={accounts}
              onRefresh={() => handleRefresh(lang === 'kh' ? 'កំពុងទាញយកទិន្នន័យរបាយការណ៍គណនី...' : 'Refreshing Account Statements & History...')}
            />
          )}

          {activeTab === 'kyc' && (
            <CustomerKYC
              customers={customers}
              onRefresh={() => handleRefresh(lang === 'kh' ? 'កំពុងទាញយកទិន្នន័យ KYC & Profiles...' : 'Refreshing Customer KYC & Profiles...')}
              onOpenCreateCustomer={() => setShowCreateCustomerModal(true)}
              onOpenCreateAccount={(targetCust) => {
                setSelectedCustomerForAccount(targetCust || null);
                setShowCreateAccountModal(true);
              }}
              onOpenEditCustomer={(cust) => {
                setEditingCustomer(cust);
                setShowEditCustomerModal(true);
              }}
              onOpenViewCustomer={(cust) => {
                setViewingCustomer(cust);
                setShowViewCustomerModal(true);
              }}
            />
          )}

          {activeTab === 'audit' && isAdmin && (
            <AuditTrail
              auditLogs={auditLogs}
              onRefresh={() => handleRefresh(lang === 'kh' ? 'កំពុងទាញយកកំណត់ត្រា Audit ថ្មី...' : 'Refreshing Security Audit Trail...')}
              loading={loading}
            />
          )}

          {activeTab === 'users' && isAdmin && (
            <SystemUsers
              onRefresh={() => handleRefresh(lang === 'kh' ? 'កំពុងទាញយកទិន្នន័យអ្នកប្រើប្រាស់ប្រព័ន្ធ...' : 'Refreshing System Users Directory...')}
            />
          )}

          {activeTab === 'profile' && <StaffProfile onNotify={showNotification} />}
        </main>
      </div>

      {/* Modals */}
      <DepositModal
        isOpen={showDepositModal}
        onClose={() => setShowDepositModal(false)}
        accounts={accounts}
        onSuccess={handleTransactionSuccess}
      />

      <WithdrawModal
        isOpen={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        accounts={accounts}
        onSuccess={handleTransactionSuccess}
      />

      <TransferModal
        isOpen={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        accounts={accounts}
        onSuccess={handleTransactionSuccess}
      />

      <OpenAccountModal
        isOpen={showCreateAccountModal}
        onClose={() => {
          setShowCreateAccountModal(false);
          setSelectedCustomerForAccount(null);
        }}
        customers={customers}
        selectedCustomer={selectedCustomerForAccount}
        onSuccess={handleAccountCreated}
      />

      <CreateCustomerModal
        isOpen={showCreateCustomerModal}
        onClose={() => setShowCreateCustomerModal(false)}
        onSuccess={handleCustomerCreated}
      />

      <EditCustomerModal
        isOpen={showEditCustomerModal}
        customer={editingCustomer}
        onClose={() => {
          setShowEditCustomerModal(false);
          setEditingCustomer(null);
        }}
        onSuccess={handleCustomerUpdated}
      />

      <ViewCustomerModal
        isOpen={showViewCustomerModal}
        customer={viewingCustomer}
        accounts={accounts}
        onClose={() => {
          setShowViewCustomerModal(false);
          setViewingCustomer(null);
        }}
        onOpenEdit={(cust) => {
          setShowViewCustomerModal(false);
          setEditingCustomer(cust);
          setShowEditCustomerModal(true);
        }}
        onOpenCreateAccount={(cust) => {
          setShowViewCustomerModal(false);
          setSelectedCustomerForAccount(cust || null);
          setShowCreateAccountModal(true);
        }}
      />

      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout}
      />

      {/* Global Toast */}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />
    </div>
  );
}
