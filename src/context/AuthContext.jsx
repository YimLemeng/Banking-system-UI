import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// Khmer & English UI dictionary
export const translations = {
  en: {
    terminalTitle: 'CORE BANKING TERMINAL',
    brandName: 'TRUST BANK',
    welcomeBack: 'Welcome back,',
    branchInfo: 'Main Branch • Cash Vault Operations • Terminal #TB-0492',
    tellerOps: 'TELLER OPERATIONS',
    branchMgmt: 'BRANCH MANAGEMENT',
    staffBadge: 'STAFF',
    overview: 'Branch Overview',
    tellerCounter: 'Teller Counter (Cash & Pay)',
    customerAccounts: 'Customer Accounts',
    accountStatements: 'Account Statements',
    customerKYC: 'Customer KYC & Moderation',
    systemUsers: 'System Users',
    auditTrail: 'Audit Trail',
    staffProfile: 'Staff Profile & Security',
    logout: 'Logout',
    login: 'Teller Login',
    usdBalance: 'USD Vault Balance',
    khrBalance: 'KHR Vault Balance',
    customerAccountsCount: 'Customer Accounts',
    registeredClients: 'Registered Clients',
    vsYesterday: 'vs yesterday',
    thisWeek: 'this week',
    kycCompliance: 'KYC verified rate',
    counterQuickActions: 'Counter Quick Actions',
    instantOperations: 'Instant teller service operations & transactions',
    cashDeposit: 'Cash Deposit',
    cashDepositDesc: 'Credit funds to client account instantly with audit slip',
    cashWithdraw: 'Cash Withdrawal',
    cashWithdrawDesc: 'Debit funds with teller verification & KYC checks',
    accountTransfer: 'Account Transfer',
    accountTransferDesc: 'Direct inter-account funds movement with instant clearing',
    openAccount: 'Open Client Account',
    openAccountDesc: 'Generate new checking or savings account with initial deposit',
    recentAccounts: 'Recent Customer Accounts',
    recentAccountsDesc: 'Live depository balance and ledger status',
    accountNumber: 'Account Number',
    clientName: 'Client Name',
    type: 'Type',
    balance: 'Balance',
    status: 'Status',
    createdAt: 'Created At',
    actions: 'Actions',
    active: 'ACTIVE',
    openDeposit: 'Open Deposit Form',
    openWithdraw: 'Open Withdrawal Form',
    initiateTransfer: 'Initiate Transfer',
    createNewAccount: 'Create New Account',
    refreshData: 'Refresh Ledger',
    apiStatusOnline: 'API Connected • Live',
    apiStatusOffline: 'Standalone System Mode',
    depositModalTitle: 'Counter Cash Deposit',
    withdrawModalTitle: 'Counter Cash Withdrawal',
    transferModalTitle: 'Inter-Account Transfer',
    openAccountModalTitle: 'Open New Client Account',
    newCustomerModalTitle: 'Register KYC Customer Profile',
    sourceAccount: 'Source Account Number',
    targetAccount: 'Target Account Number',
    amount: 'Amount (USD)',
    description: 'Transaction Description / Memo',
    confirm: 'Confirm Transaction',
    cancel: 'Cancel',
    processing: 'Processing...',
  },
  kh: {
    terminalTitle: 'ប្រព័ន្ធប្រតិបត្តិការធនាគារស្នូល',
    brandName: 'ត្រាស់ ប៊ែងក៍',
    welcomeBack: 'សូមស្វាគមន៍,',
    branchInfo: 'ការិយាល័យកណ្តាល • ប្រតិបត្តិការតុបេឡា • ស្ថានីយ #TB-0492',
    tellerOps: 'ប្រតិបត្តិការបេឡា',
    branchMgmt: 'ការគ្រប់គ្រងសាខា',
    staffBadge: 'បុគ្គលិក',
    overview: 'ទិដ្ឋភាពទូទៅនៃសាខា',
    tellerCounter: 'បញ្ជរបេឡា (Cash & Pay)',
    customerAccounts: 'គណនីអតិថិជន',
    accountStatements: 'របាយការណ៍គណនី',
    customerKYC: 'ផ្ទៀងផ្ទាត់ KYC & អតិថិជន',
    systemUsers: 'អ្នកប្រើប្រាស់ប្រព័ន្ធ',
    auditTrail: 'កំណត់ត្រាត្រួតពិនិត្យ (Audit)',
    staffProfile: 'ប្រវត្តិរូបបុគ្គលិក & សុវត្ថិភាព',
    logout: 'ចាកចេញពីស្ថានីយ',
    login: 'ចូលប្រើប្រាស់',
    usdBalance: 'សមតុល្យបម្រុងប្រាក់ដុល្លារ (USD)',
    khrBalance: 'សមតុល្យបម្រុងប្រាក់រៀល (KHR)',
    customerAccountsCount: 'គណនីអតិថិជនសរុប',
    registeredClients: 'អតិថិជនបានចុះឈ្មោះ',
    vsYesterday: 'ធៀបនឹងម្សិលមិញ',
    thisWeek: 'ក្នុងសប្តាហ៍នេះ',
    kycCompliance: 'អត្រាផ្ទៀងផ្ទាត់ KYC ជោគជ័យ',
    counterQuickActions: 'ប្រតិបត្តិការរហ័សនៅបញ្ជរ',
    instantOperations: 'សេវាប្រតិបត្តិការសាច់ប្រាក់រហ័ស និងមានសុវត្ថិភាពខ្ពស់',
    cashDeposit: 'ដាក់ប្រាក់ចូលគណនី',
    cashDepositDesc: 'បញ្ចូលសាច់ប្រាក់ភ្លាមៗជាមួយវិក្កយបត្របញ្ជាក់',
    cashWithdraw: 'ដកប្រាក់ពីគណនី',
    cashWithdrawDesc: 'ដកសាច់ប្រាក់ជាមួយការផ្ទៀងផ្ទាត់លេខកូដ និង KYC',
    accountTransfer: 'ផ្ទេរប្រាក់រវាងគណនី',
    accountTransferDesc: 'ផ្ទេរសាច់ប្រាក់ភ្លាមៗរវាងគណនីដោយគ្មានថ្លៃសេវា',
    openAccount: 'បើកគណនីថ្មីជូនអតិថិជន',
    openAccountDesc: 'បង្កើតគណនីសន្សំ ឬចរន្តថ្មីជាមួយប្រាក់តម្កល់ដំបូង',
    recentAccounts: 'គណនីអតិថិជនថ្មីៗ',
    recentAccountsDesc: 'សមតុល្យបច្ចុប្បន្នភាព និងស្ថានភាពគណនីតាមពេលវេលាជាក់ស្តែង',
    accountNumber: 'លេខគណនី',
    clientName: 'ឈ្មោះអតិថិជន',
    type: 'ប្រភេទគណនី',
    balance: 'សមតុល្យ',
    status: 'ស្ថានភាព',
    createdAt: 'កាលបរិច្ឆេទបង្កើត',
    actions: 'សកម្មភាព',
    active: 'សកម្ម',
    openDeposit: 'បើកទម្រង់ដាក់ប្រាក់',
    openWithdraw: 'បើកទម្រង់ដកប្រាក់',
    initiateTransfer: 'ចាប់ផ្តើមផ្ទេរប្រាក់',
    createNewAccount: 'បង្កើតគណនីថ្មី',
    refreshData: 'ទាញទិន្នន័យថ្មី',
    apiStatusOnline: 'ភ្ជាប់ API ដោយជោគជ័យ',
    apiStatusOffline: 'ប្រព័ន្ធប្រតិបត្តិការឯករាជ្យ',
    depositModalTitle: 'ប្រតិបត្តិការដាក់ប្រាក់នៅបញ្ជរ',
    withdrawModalTitle: 'ប្រតិបត្តិការដកប្រាក់ពីបញ្ជរ',
    transferModalTitle: 'ប្រតិបត្តិការផ្ទេរប្រាក់រវាងគណនី',
    openAccountModalTitle: 'បើកគណនីធនាគារថ្មីជូនអតិថិជន',
    newCustomerModalTitle: 'ចុះឈ្មោះអតិថិជន KYC ថ្មី',
    sourceAccount: 'លេខគណនីប្រភព (អ្នកផ្ញើ)',
    targetAccount: 'លេខគណនីគោលដៅ (អ្នកទទួល)',
    amount: 'ចំនួនទឹកប្រាក់ (USD)',
    description: 'ពិពណ៌នាប្រតិបត្តិការ / សម្គាល់',
    confirm: 'បញ្ជាក់ប្រតិបត្តិការ',
    cancel: 'បោះបង់',
    processing: 'កំពុងដំណើរការ...',
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('trustbank_token') || '');
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('trustbank_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [lang, setLang] = useState(() => localStorage.getItem('trustbank_lang') || 'en');

  useEffect(() => {
    localStorage.setItem('trustbank_lang', lang);
  }, [lang]);

  const login = (tokenData, userData) => {
    setToken(tokenData);
    setUser(userData);
    localStorage.setItem('trustbank_token', tokenData);
    localStorage.setItem('trustbank_user', JSON.stringify(userData));
  };

  const logout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('trustbank_token');
    localStorage.removeItem('trustbank_user');
  };

  const isAuthenticated = Boolean(token && user);

  const t = translations[lang] || translations.en;

  const isAdmin = Boolean(
    isAuthenticated && (
      user?.role === 'ROLE_ADMIN' || 
      user?.role === 'ADMIN' || 
      user?.username?.toLowerCase() === 'admin' ||
      user?.username?.toLowerCase().includes('admin')
    )
  );

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated, isAdmin, login, logout, lang, setLang, t }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
