import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, User, Users as UsersIcon, Edit, X, Check, Loader, Download } from 'lucide-react';
import { fetchPortalUsers, updatePortalUser, fetchCustomers, fetchVendors, PortalUser } from '../../api';

type UserView = 'DASHBOARD' | 'PORTAL_USERS_LIST' | 'PORTAL_USER_EDIT' | 'CONTACTS_LIST' | 'CONTACT_EDIT';

export const VendorUsers: React.FC = () => {
    const [view, setView] = useState<UserView>('DASHBOARD');
    const [portalUsers, setPortalUsers] = useState<PortalUser[]>([]);
    const [customers, setCustomers] = useState<PortalUser[]>([]);
    const [vendors, setVendors] = useState<PortalUser[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedUser, setSelectedUser] = useState<PortalUser | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editData, setEditData] = useState<Partial<PortalUser>>({});
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string>('');
    const [contactTab, setContactTab] = useState<'ALL' | 'CUSTOMERS' | 'VENDORS'>('ALL');
    const [portalUserCount, setPortalUserCount] = useState(354);

    useEffect(() => {
        if (view === 'PORTAL_USERS_LIST') {
            loadPortalUsers();
        }
    }, [view]);

    useEffect(() => {
        if (view === 'CONTACTS_LIST') {
            loadContacts();
        }
    }, [view]);

    const loadPortalUsers = async () => {
        setLoading(true);
        setError('');
        try {
            const users = await fetchPortalUsers();
            setPortalUsers(users);
            setPortalUserCount(users.length);
        } catch (err: any) {
            setError(err.message || 'Failed to load portal users');
        } finally {
            setLoading(false);
        }
    };

    const loadContacts = async () => {
        setLoading(true);
        setError('');
        try {
            const [customersData, vendorsData] = await Promise.all([
                fetchCustomers(),
                fetchVendors(),
            ]);
            setCustomers(customersData);
            setVendors(vendorsData);
        } catch (err: any) {
            setError(err.message || 'Failed to load contacts');
        } finally {
            setLoading(false);
        }
    };

    const handleEditStart = (user: PortalUser) => {
        setSelectedUser(user);
        setEditingId(user.contact_id);
        setEditData({ ...user });
    };

    const handleEditCancel = () => {
        setEditingId(null);
        setEditData({});
        setSelectedUser(null);
    };

    const handleEditSave = async () => {
        if (!selectedUser) return;
        setSaving(true);
        setError('');
        try {
            const updated = await updatePortalUser(selectedUser.contact_id, editData);
            
            // Update appropriate list
            if (view === 'PORTAL_USER_EDIT') {
                setPortalUsers(portalUsers.map(u => u.contact_id === updated.contact_id ? updated : u));
                setView('PORTAL_USERS_LIST');
            } else if (view === 'CONTACT_EDIT') {
                setCustomers(customers.map(u => u.contact_id === updated.contact_id ? updated : u));
                setVendors(vendors.map(u => u.contact_id === updated.contact_id ? updated : u));
                setView('CONTACTS_LIST');
            }
            
            setEditingId(null);
            setEditData({});
            setSelectedUser(null);
        } catch (err: any) {
            setError(err.message || 'Failed to update contact');
        } finally {
            setSaving(false);
        }
    };

    const handleEditChange = (field: keyof PortalUser, value: any) => {
        setEditData(prev => ({ ...prev, [field]: value }));
    };

    const getContactsToDisplay = (): PortalUser[] => {
        if (contactTab === 'CUSTOMERS') return customers;
        if (contactTab === 'VENDORS') return vendors;
        return [...customers, ...vendors];
    };

    const getContactsCount = (type: 'CUSTOMERS' | 'VENDORS' | 'ALL'): number => {
        if (type === 'CUSTOMERS') return customers.length;
        if (type === 'VENDORS') return vendors.length;
        return customers.length + vendors.length;
    };

    // Dashboard View
    if (view === 'DASHBOARD') {
        return (
            <div className="p-12 h-full flex flex-col items-center justify-center animate-[fadeIn_0.5s_ease-out]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-4xl">
                    {/* Portal Users Card */}
                    <div 
                        onClick={() => setView('PORTAL_USERS_LIST')}
                        className="bg-white p-10 rounded-xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all cursor-pointer group hover:-translate-y-1 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                            <User size={100} />
                        </div>
                        <h2 className="font-anton text-3xl mb-8 uppercase tracking-wide group-hover:text-[#488C5C] transition-colors">Portal Users</h2>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500 font-bold uppercase tracking-wider text-[10px]">Total Portal Users</span>
                                <span className="font-bold text-lg">{portalUserCount}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500 font-bold uppercase tracking-wider text-[10px]">Active</span>
                                <span className="font-bold text-lg">{portalUsers.filter(u => u.is_active).length}</span>
                            </div>
                        </div>
                    </div>

                    {/* Contacts Card */}
                    <div 
                        onClick={() => setView('CONTACTS_LIST')}
                        className="bg-white p-10 rounded-xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all cursor-pointer group hover:-translate-y-1 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                            <UsersIcon size={100} />
                        </div>
                        <h2 className="font-anton text-3xl mb-8 uppercase tracking-wide group-hover:text-[#c9b52e] transition-colors">Contacts</h2>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-sm border-b border-gray-100 pb-2">
                                <span className="text-gray-500 font-bold uppercase tracking-wider text-[10px]">Customers</span>
                                <span className="font-bold text-lg">{customers.length}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500 font-bold uppercase tracking-wider text-[10px]">Vendors</span>
                                <span className="font-bold text-lg">{vendors.length}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Portal Users List View
    if (view === 'PORTAL_USERS_LIST') {
        return (
            <div className="p-8 h-full flex flex-col animate-[fadeIn_0.3s_ease-out]">
                <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-6">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setView('DASHBOARD')} className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-[#111111]">
                            &larr; Back
                        </button>
                        <h2 className="font-anton text-2xl uppercase tracking-wide">Portal Users</h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={loadPortalUsers}
                            disabled={loading}
                            className="px-4 py-1.5 border border-gray-200 hover:border-[#111111] hover:bg-[#111111] hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest disabled:opacity-50"
                        >
                            {loading ? 'Loading...' : 'Refresh'}
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="mb-4 p-4 bg-red-100 border border-red-300 text-red-700 text-sm rounded">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="flex items-center justify-center h-96">
                        <Loader size={32} className="animate-spin text-[#488C5C]" />
                    </div>
                ) : (
                    <div className="flex-1 overflow-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200 sticky top-0 bg-white">
                                    <th className="text-left px-4 py-3 font-bold text-[10px] uppercase tracking-wider text-gray-500">Name</th>
                                    <th className="text-left px-4 py-3 font-bold text-[10px] uppercase tracking-wider text-gray-500">Email</th>
                                    <th className="text-left px-4 py-3 font-bold text-[10px] uppercase tracking-wider text-gray-500">Mobile</th>
                                    <th className="text-left px-4 py-3 font-bold text-[10px] uppercase tracking-wider text-gray-500">City</th>
                                    <th className="text-left px-4 py-3 font-bold text-[10px] uppercase tracking-wider text-gray-500">Status</th>
                                    <th className="text-center px-4 py-3 font-bold text-[10px] uppercase tracking-wider text-gray-500">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {portalUsers.map((user) => (
                                    <tr key={user.contact_id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3 font-medium">{user.contact_name}</td>
                                        <td className="px-4 py-3 text-gray-600">{user.email}</td>
                                        <td className="px-4 py-3 text-gray-600">{user.mobile || '—'}</td>
                                        <td className="px-4 py-3 text-gray-600">{user.city || '—'}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded ${user.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                                {user.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <button 
                                                onClick={() => { handleEditStart(user); setView('PORTAL_USER_EDIT'); }}
                                                className="p-2 hover:bg-[#488C5C] hover:text-white transition-colors rounded inline-flex items-center gap-1"
                                                title="Edit user"
                                            >
                                                <Edit size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {portalUsers.length === 0 && (
                            <div className="text-center py-12 text-gray-400">
                                No portal users found
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    // Portal User Edit View
    if (view === 'PORTAL_USER_EDIT' && selectedUser) {
        return (
            <div className="p-8 h-full flex flex-col animate-[fadeIn_0.3s_ease-out] overflow-auto">
                <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-6">
                    <div className="flex items-center gap-4">
                        <button onClick={handleEditCancel} className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-[#111111]">
                            &larr; Back
                        </button>
                        <h2 className="font-anton text-2xl uppercase tracking-wide">Edit Portal User</h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={handleEditCancel}
                            disabled={saving}
                            className="px-4 py-1.5 border border-gray-200 hover:border-red-300 hover:bg-red-50 hover:text-red-700 transition-colors text-[10px] font-bold uppercase tracking-widest disabled:opacity-50"
                        >
                            <X size={14} className="inline mr-2" /> Cancel
                        </button>
                        <button 
                            onClick={handleEditSave}
                            disabled={saving}
                            className="px-4 py-1.5 border border-[#488C5C] bg-[#488C5C] text-white hover:bg-[#3a7047] transition-colors text-[10px] font-bold uppercase tracking-widest disabled:opacity-50"
                        >
                            {saving ? <Loader size={14} className="inline animate-spin mr-2" /> : <Check size={14} className="inline mr-2" />}
                            {saving ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="mb-4 p-4 bg-red-100 border border-red-300 text-red-700 text-sm rounded">
                        {error}
                    </div>
                )}

                <div className="max-w-3xl space-y-6">
                    <div className="group">
                        <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Contact Name</label>
                        <input 
                            type="text" 
                            value={editData.contact_name || ''} 
                            onChange={(e) => handleEditChange('contact_name', e.target.value)}
                            className="w-full border-b border-gray-200 py-2 text-lg focus:border-[#111111] bg-transparent outline-none transition-colors" 
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <div className="group">
                            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Email</label>
                            <input 
                                type="email" 
                                value={editData.email || ''}
                                onChange={(e) => handleEditChange('email', e.target.value)}
                                className="w-full border-b border-gray-200 py-2 text-sm focus:border-[#111111] bg-transparent outline-none transition-colors" 
                            />
                        </div>
                        <div className="group">
                            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Mobile</label>
                            <input 
                                type="tel" 
                                value={editData.mobile || ''}
                                onChange={(e) => handleEditChange('mobile', e.target.value)}
                                className="w-full border-b border-gray-200 py-2 text-sm focus:border-[#111111] bg-transparent outline-none transition-colors" 
                            />
                        </div>
                    </div>

                    <div className="group">
                        <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Address</label>
                        <div className="space-y-2">
                            <input 
                                type="text" 
                                placeholder="Street Address" 
                                value={editData.address_line1 || ''}
                                onChange={(e) => handleEditChange('address_line1', e.target.value)}
                                className="w-full border-b border-gray-200 py-2 text-sm focus:border-[#111111] bg-transparent outline-none transition-colors" 
                            />
                            <input 
                                type="text" 
                                placeholder="Street Address 2 (Optional)" 
                                value={editData.address_line2 || ''}
                                onChange={(e) => handleEditChange('address_line2', e.target.value)}
                                className="w-full border-b border-gray-200 py-2 text-sm focus:border-[#111111] bg-transparent outline-none transition-colors" 
                            />
                            <div className="grid grid-cols-3 gap-4">
                                <input 
                                    type="text" 
                                    placeholder="City" 
                                    value={editData.city || ''}
                                    onChange={(e) => handleEditChange('city', e.target.value)}
                                    className="w-full border-b border-gray-200 py-2 text-sm focus:border-[#111111] bg-transparent outline-none transition-colors" 
                                />
                                <input 
                                    type="text" 
                                    placeholder="State" 
                                    value={editData.state || ''}
                                    onChange={(e) => handleEditChange('state', e.target.value)}
                                    className="w-full border-b border-gray-200 py-2 text-sm focus:border-[#111111] bg-transparent outline-none transition-colors" 
                                />
                                <input 
                                    type="text" 
                                    placeholder="Pincode" 
                                    value={editData.pincode || ''}
                                    onChange={(e) => handleEditChange('pincode', e.target.value)}
                                    className="w-full border-b border-gray-200 py-2 text-sm focus:border-[#111111] bg-transparent outline-none transition-colors" 
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <div className="group">
                            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Country</label>
                            <input 
                                type="text" 
                                value={editData.country || ''}
                                onChange={(e) => handleEditChange('country', e.target.value)}
                                className="w-full border-b border-gray-200 py-2 text-sm focus:border-[#111111] bg-transparent outline-none transition-colors" 
                            />
                        </div>
                        <div className="group">
                            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Status</label>
                            <select 
                                value={editData.is_active ? 'active' : 'inactive'}
                                onChange={(e) => handleEditChange('is_active', e.target.value === 'active')}
                                className="w-full border-b border-gray-200 py-2 text-sm bg-transparent focus:border-[#111111] outline-none transition-colors" 
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Contacts List View
    if (view === 'CONTACTS_LIST') {
        const displayContacts = getContactsToDisplay();
        return (
            <div className="p-8 h-full flex flex-col animate-[fadeIn_0.3s_ease-out]">
                <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-6">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setView('DASHBOARD')} className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-[#111111]">
                            &larr; Back
                        </button>
                        <h2 className="font-anton text-2xl uppercase tracking-wide">Contacts</h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={loadContacts}
                            disabled={loading}
                            className="px-4 py-1.5 border border-gray-200 hover:border-[#111111] hover:bg-[#111111] hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest disabled:opacity-50 flex items-center gap-2"
                        >
                            <Download size={14} /> {loading ? 'Loading...' : 'Refresh'}
                        </button>
                    </div>
                </div>

                {/* Contact Type Tabs */}
                <div className="flex gap-4 mb-8 border-b border-gray-200">
                    <button
                        onClick={() => setContactTab('ALL')}
                        className={`px-4 py-3 text-[10px] font-bold uppercase tracking-widest transition-all border-b-2 ${
                            contactTab === 'ALL' 
                            ? 'text-[#488C5C] border-b-[#488C5C]' 
                            : 'text-gray-400 border-b-transparent hover:text-[#111111]'
                        }`}
                    >
                        All Contacts ({getContactsCount('ALL')})
                    </button>
                    <button
                        onClick={() => setContactTab('CUSTOMERS')}
                        className={`px-4 py-3 text-[10px] font-bold uppercase tracking-widest transition-all border-b-2 ${
                            contactTab === 'CUSTOMERS' 
                            ? 'text-[#488C5C] border-b-[#488C5C]' 
                            : 'text-gray-400 border-b-transparent hover:text-[#111111]'
                        }`}
                    >
                        Customers ({getContactsCount('CUSTOMERS')})
                    </button>
                    <button
                        onClick={() => setContactTab('VENDORS')}
                        className={`px-4 py-3 text-[10px] font-bold uppercase tracking-widest transition-all border-b-2 ${
                            contactTab === 'VENDORS' 
                            ? 'text-[#488C5C] border-b-[#488C5C]' 
                            : 'text-gray-400 border-b-transparent hover:text-[#111111]'
                        }`}
                    >
                        Vendors ({getContactsCount('VENDORS')})
                    </button>
                </div>

                {error && (
                    <div className="mb-4 p-4 bg-red-100 border border-red-300 text-red-700 text-sm rounded">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="flex items-center justify-center h-96">
                        <Loader size={32} className="animate-spin text-[#488C5C]" />
                    </div>
                ) : (
                    <div className="flex-1 overflow-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200 sticky top-0 bg-white">
                                    <th className="text-left px-4 py-3 font-bold text-[10px] uppercase tracking-wider text-gray-500">Name</th>
                                    <th className="text-left px-4 py-3 font-bold text-[10px] uppercase tracking-wider text-gray-500">Type</th>
                                    <th className="text-left px-4 py-3 font-bold text-[10px] uppercase tracking-wider text-gray-500">Email</th>
                                    <th className="text-left px-4 py-3 font-bold text-[10px] uppercase tracking-wider text-gray-500">Mobile</th>
                                    <th className="text-left px-4 py-3 font-bold text-[10px] uppercase tracking-wider text-gray-500">City</th>
                                    <th className="text-left px-4 py-3 font-bold text-[10px] uppercase tracking-wider text-gray-500">Status</th>
                                    <th className="text-center px-4 py-3 font-bold text-[10px] uppercase tracking-wider text-gray-500">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayContacts.map((contact) => (
                                    <tr key={contact.contact_id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3 font-medium">{contact.contact_name}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded ${
                                                contact.contact_type === 'customer' ? 'bg-blue-100 text-blue-700' :
                                                contact.contact_type === 'vendor' ? 'bg-purple-100 text-purple-700' :
                                                'bg-indigo-100 text-indigo-700'
                                            }`}>
                                                {contact.contact_type}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">{contact.email}</td>
                                        <td className="px-4 py-3 text-gray-600">{contact.mobile || '—'}</td>
                                        <td className="px-4 py-3 text-gray-600">{contact.city || '—'}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded ${contact.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                                {contact.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <button 
                                                onClick={() => { handleEditStart(contact); setView('CONTACT_EDIT'); }}
                                                className="p-2 hover:bg-[#488C5C] hover:text-white transition-colors rounded inline-flex items-center gap-1"
                                                title="Edit contact"
                                            >
                                                <Edit size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {displayContacts.length === 0 && (
                            <div className="text-center py-12 text-gray-400">
                                No {contactTab === 'CUSTOMERS' ? 'customers' : contactTab === 'VENDORS' ? 'vendors' : 'contacts'} found
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    // Contact Edit View
    if (view === 'CONTACT_EDIT' && selectedUser) {
        return (
            <div className="p-8 h-full flex flex-col animate-[fadeIn_0.3s_ease-out] overflow-auto">
                <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-6">
                    <div className="flex items-center gap-4">
                        <button onClick={handleEditCancel} className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-[#111111]">
                            &larr; Back
                        </button>
                        <h2 className="font-anton text-2xl uppercase tracking-wide">Edit Contact</h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={handleEditCancel}
                            disabled={saving}
                            className="px-4 py-1.5 border border-gray-200 hover:border-red-300 hover:bg-red-50 hover:text-red-700 transition-colors text-[10px] font-bold uppercase tracking-widest disabled:opacity-50"
                        >
                            <X size={14} className="inline mr-2" /> Cancel
                        </button>
                        <button 
                            onClick={handleEditSave}
                            disabled={saving}
                            className="px-4 py-1.5 border border-[#488C5C] bg-[#488C5C] text-white hover:bg-[#3a7047] transition-colors text-[10px] font-bold uppercase tracking-widest disabled:opacity-50"
                        >
                            {saving ? <Loader size={14} className="inline animate-spin mr-2" /> : <Check size={14} className="inline mr-2" />}
                            {saving ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="mb-4 p-4 bg-red-100 border border-red-300 text-red-700 text-sm rounded">
                        {error}
                    </div>
                )}

                <div className="max-w-3xl space-y-6">
                    <div className="group">
                        <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Contact Name</label>
                        <input 
                            type="text" 
                            value={editData.contact_name || ''} 
                            onChange={(e) => handleEditChange('contact_name', e.target.value)}
                            className="w-full border-b border-gray-200 py-2 text-lg focus:border-[#111111] bg-transparent outline-none transition-colors" 
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <div className="group">
                            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Email</label>
                            <input 
                                type="email" 
                                value={editData.email || ''}
                                onChange={(e) => handleEditChange('email', e.target.value)}
                                className="w-full border-b border-gray-200 py-2 text-sm focus:border-[#111111] bg-transparent outline-none transition-colors" 
                            />
                        </div>
                        <div className="group">
                            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Mobile</label>
                            <input 
                                type="tel" 
                                value={editData.mobile || ''}
                                onChange={(e) => handleEditChange('mobile', e.target.value)}
                                className="w-full border-b border-gray-200 py-2 text-sm focus:border-[#111111] bg-transparent outline-none transition-colors" 
                            />
                        </div>
                    </div>

                    <div className="group">
                        <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Address</label>
                        <div className="space-y-2">
                            <input 
                                type="text" 
                                placeholder="Street Address" 
                                value={editData.address_line1 || ''}
                                onChange={(e) => handleEditChange('address_line1', e.target.value)}
                                className="w-full border-b border-gray-200 py-2 text-sm focus:border-[#111111] bg-transparent outline-none transition-colors" 
                            />
                            <input 
                                type="text" 
                                placeholder="Street Address 2 (Optional)" 
                                value={editData.address_line2 || ''}
                                onChange={(e) => handleEditChange('address_line2', e.target.value)}
                                className="w-full border-b border-gray-200 py-2 text-sm focus:border-[#111111] bg-transparent outline-none transition-colors" 
                            />
                            <div className="grid grid-cols-3 gap-4">
                                <input 
                                    type="text" 
                                    placeholder="City" 
                                    value={editData.city || ''}
                                    onChange={(e) => handleEditChange('city', e.target.value)}
                                    className="w-full border-b border-gray-200 py-2 text-sm focus:border-[#111111] bg-transparent outline-none transition-colors" 
                                />
                                <input 
                                    type="text" 
                                    placeholder="State" 
                                    value={editData.state || ''}
                                    onChange={(e) => handleEditChange('state', e.target.value)}
                                    className="w-full border-b border-gray-200 py-2 text-sm focus:border-[#111111] bg-transparent outline-none transition-colors" 
                                />
                                <input 
                                    type="text" 
                                    placeholder="Pincode" 
                                    value={editData.pincode || ''}
                                    onChange={(e) => handleEditChange('pincode', e.target.value)}
                                    className="w-full border-b border-gray-200 py-2 text-sm focus:border-[#111111] bg-transparent outline-none transition-colors" 
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <div className="group">
                            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Country</label>
                            <input 
                                type="text" 
                                value={editData.country || ''}
                                onChange={(e) => handleEditChange('country', e.target.value)}
                                className="w-full border-b border-gray-200 py-2 text-sm focus:border-[#111111] bg-transparent outline-none transition-colors" 
                            />
                        </div>
                        <div className="group">
                            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Status</label>
                            <select 
                                value={editData.is_active ? 'active' : 'inactive'}
                                onChange={(e) => handleEditChange('is_active', e.target.value === 'active')}
                                className="w-full border-b border-gray-200 py-2 text-sm bg-transparent focus:border-[#111111] outline-none transition-colors" 
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};