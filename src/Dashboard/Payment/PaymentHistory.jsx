    import { useEffect, useState } from 'react';
    import { 
    CreditCard, 
    User, 
    Package, 
    Calendar, 
    DollarSign, 
    Search, 
    Hash, 
    Copy, 
    Check, 
    XCircle,
    TrendingUp,
    Receipt,
    Loader2
    } from 'lucide-react';

    const PaymentHistory = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [copiedId, setCopiedId] = useState(null);

    useEffect(() => {
        fetch('http://localhost:5000/all-payments')
        .then(res => res.json())
        .then(data => {
            // Sort by paid_at descending (latest first) for better UX
            const sorted = [...data].sort((a, b) => 
            new Date(b.paid_at) - new Date(a.paid_at)
            );
            setPayments(sorted);
            setLoading(false);
        })
        .catch(err => {
            console.error(err);
            setLoading(false);
        });
    }, []);

    // Filter payments based on search term (customer email, item name, transaction ID)
    const filteredPayments = payments.filter(payment => {
        const searchLower = searchTerm.toLowerCase();
        return (
        payment.userEmail?.toLowerCase().includes(searchLower) ||
        payment.parcelName?.toLowerCase().includes(searchLower) ||
        payment.documentName?.toLowerCase().includes(searchLower) ||
        payment.transactionId?.toLowerCase().includes(searchLower)
        );
    });

    const totalRevenue = payments.reduce((acc, curr) => acc + (curr.cost || 0), 0);
    const totalTransactions = payments.length;
    const averageTransaction = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

    const copyToClipboard = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
        });
    };

    if (loading) {
        return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
                <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
                <p className="text-gray-500 font-medium animate-pulse">
                Loading secure transactions...
                </p>
            </div>
            </div>
        </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            
            {/* Header Section */}
            <div className="mb-8 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                <div className="flex items-center gap-3 mb-1">
                    <div className="p-2.5 bg-indigo-100 rounded-xl shadow-sm">
                    <CreditCard className="w-7 h-7 text-indigo-600" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                    Transaction Ledger
                    </h1>
                </div>
                <p className="text-gray-500 text-sm sm:text-base ml-1">
                    Complete history of all system payments and transactions
                </p>
                </div>
                
                {/* Search Bar */}
                {/* <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search by email, item, or TXN ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
                />
                {searchTerm && (
                    <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                    <XCircle className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                    </button>
                )}
                </div> */}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4 transition-all hover:shadow-md">
                <div className="p-3 bg-emerald-100 rounded-xl">
                    <DollarSign className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">
                    {totalRevenue.toLocaleString()} <span className="text-sm font-normal">BDT</span>
                    </p>
                </div>
                </div>
                
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4 transition-all hover:shadow-md">
                <div className="p-3 bg-blue-100 rounded-xl">
                    <Receipt className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Total Transactions</p>
                    <p className="text-2xl font-bold text-gray-900">{totalTransactions}</p>
                </div>
                </div>
                
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4 transition-all hover:shadow-md">
                <div className="p-3 bg-purple-100 rounded-xl">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Average Transaction</p>
                    <p className="text-2xl font-bold text-gray-900">
                    {Math.round(averageTransaction).toLocaleString()} <span className="text-sm font-normal">BDT</span>
                    </p>
                </div>
                </div>
            </div>
            </div>

            {/* Payments Grid - Card Based, No Horizontal Scroll */}
            {filteredPayments.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 py-16 px-4 text-center">
                <div className="inline-flex p-4 bg-gray-100 rounded-full mb-4">
                <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-1">No transactions found</h3>
                <p className="text-gray-400">
                {searchTerm ? 'Try adjusting your search terms' : 'No payment records available yet'}
                </p>
            </div>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredPayments.map((payment, index) => {
                const itemName = payment.parcelName || payment.documentName || "Unnamed Item";
                const transactionId = payment.transactionId || 'N/A';
                const isCopied = copiedId === payment._id;
                
                return (
                    <div
                    key={payment._id}
                    className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
                    >
                    {/* Card Header */}
                    <div className="px-5 pt-5 pb-3 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                        <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-indigo-50 rounded-lg">
                            <Hash className="w-3.5 h-3.5 text-indigo-500" />
                            </div>
                            <span className="text-xs font-mono text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                            {transactionId.length > 20 ? `${transactionId.slice(0, 20)}...` : transactionId}
                            </span>
                            {transactionId !== 'N/A' && (
                            <button
                                onClick={() => copyToClipboard(transactionId, payment._id)}
                                className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                                title="Copy transaction ID"
                            >
                                {isCopied ? (
                                <Check className="w-3.5 h-3.5 text-green-500" />
                                ) : (
                                <Copy className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600" />
                                )}
                            </button>
                            )}
                        </div>
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                            Paid
                        </span>
                        </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 space-y-4">
                        {/* Customer */}
                        <div className="flex items-start gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg shrink-0">
                            <User className="w-4 h-4 text-gray-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs text-gray-500 uppercase tracking-wide">Customer</p>
                            <p className="text-sm font-medium text-gray-800 truncate" title={payment.userEmail}>
                            {payment.userEmail}
                            </p>
                        </div>
                        </div>

                        {/* Item */}
                        <div className="flex items-start gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg shrink-0">
                            <Package className="w-4 h-4 text-gray-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs text-gray-500 uppercase tracking-wide">Item / Service</p>
                            <p className="text-sm font-medium text-gray-800 truncate" title={itemName}>
                            {itemName}
                            </p>
                        </div>
                        </div>

                        {/* Amount & Date */}
                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-emerald-50 rounded-lg">
                            <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                            </div>
                            <span className="text-lg font-bold text-emerald-600">
                            {payment.cost?.toLocaleString()} <span className="text-xs font-normal">BDT</span>
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-400">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{formatDate(payment.paid_at)}</span>
                        </div>
                        </div>
                    </div>
                    </div>
                );
                })}
            </div>
            )}

            {/* Footer note */}
            <div className="mt-8 text-center text-xs text-gray-400">
            Showing {filteredPayments.length} of {totalTransactions} total transactions
            </div>
        </div>
        </div>
    );
    };

    export default PaymentHistory;