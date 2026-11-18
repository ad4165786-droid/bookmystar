import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Lock,
  UserCheck,
  Users,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Key,
  Search,
  Eye,
  X
} from 'lucide-react';

type AdminRoleType = 'Super Admin' | 'Support Lead' | 'Content Moderator' | 'Finance Officer';

interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: AdminRoleType;
  permissions: string[];
  status: 'active' | 'suspended';
}

export const AdminAuditRoles: React.FC = () => {
  const { auditLogs, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'audit' | 'roles'>('audit');
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffRole, setNewStaffRole] = useState<AdminRoleType>('Support Lead');

  const [staffList, setStaffList] = useState<StaffUser[]>([
    {
      id: 'adm_1',
      name: 'Priyanshu Sen',
      email: 'priyanshu@bookmystar.in',
      role: 'Super Admin',
      permissions: ['User Suspend/Activate', 'Creator KYC Approval', 'Dispute Resolution', 'Financial Ledger Export', 'Full Root Access'],
      status: 'active'
    },
    {
      id: 'adm_2',
      name: 'Aditi Sharma',
      email: 'aditi.safety@bookmystar.in',
      role: 'Support Lead',
      permissions: ['Grievance Ticket Response', 'Call Reschedule Handling', 'Escrow Refund Authorization'],
      status: 'active'
    },
    {
      id: 'adm_3',
      name: 'Vikram Patel',
      email: 'vikram.mod@bookmystar.in',
      role: 'Content Moderator',
      permissions: ['Media Gallery Moderation', 'Review Disputes', 'Creator Profile Inspection'],
      status: 'active'
    },
    {
      id: 'adm_4',
      name: 'Neha Kapoor',
      email: 'neha.finance@bookmystar.in',
      role: 'Finance Officer',
      permissions: ['Payout Approval', 'Bank UTR Generation', 'Tax Invoice Audits', 'Commission Rate Config View'],
      status: 'active'
    }
  ]);

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName.trim() || !newStaffEmail.trim()) {
      showToast('Please provide valid name and email.');
      return;
    }

    const newStaff: StaffUser = {
      id: `adm_${Date.now()}`,
      name: newStaffName.trim(),
      email: newStaffEmail.trim(),
      role: newStaffRole,
      permissions: newStaffRole === 'Super Admin' ? ['Full Root Access'] : ['Standard Support Operations'],
      status: 'active'
    };

    setStaffList([...staffList, newStaff]);
    setNewStaffName('');
    setNewStaffEmail('');
    setShowAddStaffModal(false);
    showToast(`Staff account for ${newStaff.name} provisioned with ${newStaffRole} credentials.`);
  };

  return (
    <div className="space-y-6 pb-16 max-w-5xl">

      {/* Title & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Security, RBAC & Immutable Audit Logs</h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('audit')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${activeTab === 'audit'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 border border-slate-200/90 shadow-sm'
              }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Audit Trail ({auditLogs.length} Events)</span>
          </button>

          <button
            onClick={() => setActiveTab('roles')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${activeTab === 'roles'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 border border-slate-200/90 shadow-sm'
              }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Admin Staff & RBAC ({staffList.length})</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Audit Log Table */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-white border border-emerald-200/90 shadow-sm ring-1 ring-emerald-500/10 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>
                <strong className="text-slate-900">Compliance Standard:</strong> Every sensitive approval, suspension, refund, payout decision, and rate modification is cryptographically recorded.
              </span>
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md ring-1 ring-slate-900/5 overflow-hidden transition-shadow">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 text-[10px] uppercase font-bold border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-4">Timestamp & IP</th>
                    <th className="py-3 px-4">Admin Operator</th>
                    <th className="py-3 px-4">Action Type</th>
                    <th className="py-3 px-4">Entity Target</th>
                    <th className="py-3 px-4">Operation Details & Justification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {auditLogs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-mono text-slate-900 text-[11px] font-semibold">{log.timestamp}</div>
                        <div className="text-[10px] text-slate-400 font-mono">IP: {log.ipAddress}</div>
                      </td>

                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {log.adminName}
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-[10px] px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                          {log.action}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="text-slate-900 font-semibold">{log.targetType}</div>
                        <div className="font-mono text-[10px] text-slate-400">{log.targetId}</div>
                      </td>

                      <td className="py-3 px-4 max-w-sm">
                        <div className="text-slate-700">{log.details}</div>
                        {log.reason && (
                          <div className="text-[10px] text-amber-700 mt-0.5 italic font-medium">
                            Reason: {log.reason}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Admin Roles & Staff */}
      {activeTab === 'roles' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Authorized Administrative Operators</h3>
            <button
              onClick={() => setShowAddStaffModal(true)}
              className="flex items-center gap-1.5 py-2 px-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Provision Staff Account</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {staffList.map(stf => (
              <div key={stf.id} className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md ring-1 ring-slate-900/5 space-y-3 flex flex-col justify-between transition-shadow">
                <div>
                  <div className="flex items-center justify-between pb-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 uppercase">
                      {stf.role}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 mt-2">{stf.name}</h4>
                  <p className="text-xs text-slate-500">{stf.email}</p>

                  <div className="mt-3 space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Privilege Scope:</span>
                    <div className="flex flex-wrap gap-1">
                      {stf.permissions.map(perm => (
                        <span key={perm} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-50 text-slate-700 border border-slate-200">
                          {perm}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-between items-center text-[10px] text-slate-500">
                  <span>2FA Authenticator: Active</span>
                  <span className="text-emerald-600 font-semibold">Authorized</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Staff Modal */}
      {showAddStaffModal && (
        <div
          onClick={e => { if (e.target === e.currentTarget) setShowAddStaffModal(false); }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn"
        >
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200/90 p-6 space-y-4 shadow-2xl ring-1 ring-slate-900/10">
            <h3 className="text-base font-bold text-slate-900">Provision Administrative Staff Member</h3>

            <form onSubmit={handleAddStaff} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Operator Name</label>
                <input
                  type="text"
                  value={newStaffName}
                  onChange={e => setNewStaffName(e.target.value)}
                  placeholder="e.g. Priyanshu Sen"
                  className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Official Work Email</label>
                <input
                  type="email"
                  value={newStaffEmail}
                  onChange={e => setNewStaffEmail(e.target.value)}
                  placeholder="operator@bookmystar.in"
                  className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Assigned Role</label>
                <select
                  value={newStaffRole}
                  onChange={e => setNewStaffRole(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-amber-500"
                >
                  <option value="Support Lead">Support Lead (Grievances & Calls)</option>
                  <option value="Content Moderator">Content Moderator (Media & Reviews)</option>
                  <option value="Finance Officer">Finance Officer (Payouts & Refunds)</option>
                  <option value="Super Admin">Super Admin (Full Root Permissions)</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-sm"
                >
                  Issue Credentials
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddStaffModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
