import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  Lock, 
  Key, 
  UserCheck, 
  ListFilter, 
  FileText, 
  Terminal, 
  Clock, 
  Plus, 
  AlertCircle 
} from 'lucide-react';

interface StaffAccount {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Support Lead' | 'Content Moderator' | 'Finance Officer';
  permissions: string[];
  status: 'active' | 'inactive';
}

const INITIAL_STAFF: StaffAccount[] = [
  {
    id: 'stf-1',
    name: 'Rajesh Verma',
    email: 'rajesh.verma@bookmystar.in',
    role: 'Super Admin',
    permissions: ['Full Root Access', 'Escrow Refunds', 'Disbursal Authorize', 'Staff Provisioning'],
    status: 'active'
  },
  {
    id: 'stf-2',
    name: 'Neha Roy',
    email: 'neha.r@bookmystar.in',
    role: 'Support Lead',
    permissions: ['Grievance Adjudication', 'User Suspension', 'Diagnostic Inspection'],
    status: 'active'
  },
  {
    id: 'stf-3',
    name: 'Arjun Das',
    email: 'arjun.d@bookmystar.in',
    role: 'Content Moderator',
    permissions: ['Media Inspection', 'Review Takedown', 'Creator Profile Audit'],
    status: 'active'
  }
];

export const AdminAuditRoles: React.FC = () => {
  const { auditLogs, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'audit' | 'roles'>('audit');
  const [staffList, setStaffList] = useState<StaffAccount[]>(INITIAL_STAFF);
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffRole, setNewStaffRole] = useState<StaffAccount['role']>('Support Lead');

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName.trim() || !newStaffEmail.trim()) return;

    const newStaff: StaffAccount = {
      id: `stf-${Date.now()}`,
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white">Security, RBAC & Immutable Audit Logs</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Role-Based Access Control (RBAC), least-privilege security matrix, and tamper-resistant administrative ledger
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('audit')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'audit'
                ? 'bg-amber-600 text-white shadow-glow'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Audit Trail ({auditLogs.length} Events)</span>
          </button>

          <button
            onClick={() => setActiveTab('roles')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'roles'
                ? 'bg-slate-700 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
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
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>
                <strong>Compliance Standard:</strong> Every sensitive approval, suspension, refund, payout decision, and rate modification is cryptographically recorded.
              </span>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/70 text-slate-400 text-[10px] uppercase font-bold border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Timestamp & IP</th>
                    <th className="py-3 px-4">Admin Operator</th>
                    <th className="py-3 px-4">Action Type</th>
                    <th className="py-3 px-4">Entity Target</th>
                    <th className="py-3 px-4">Operation Details & Justification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  {auditLogs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-mono text-white text-[11px]">{log.timestamp}</div>
                        <div className="text-[10px] text-slate-500 font-mono">IP: {log.ipAddress}</div>
                      </td>

                      <td className="py-3 px-4 font-semibold text-white">
                        {log.adminName}
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-[10px] px-2 py-0.5 rounded bg-amber-950/70 text-amber-300 border border-amber-500/30">
                          {log.action}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="text-white font-semibold">{log.targetType}</div>
                        <div className="font-mono text-[10px] text-slate-400">{log.targetId}</div>
                      </td>

                      <td className="py-3 px-4 max-w-sm">
                        <div className="text-slate-200">{log.details}</div>
                        {log.reason && (
                          <div className="text-[10px] text-amber-400 mt-0.5 italic">
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
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Authorized Administrative Operators</h3>
            <button
              onClick={() => setShowAddStaffModal(true)}
              className="flex items-center gap-1.5 py-2 px-3.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-md transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Provision Staff Account</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {staffList.map(stf => (
              <div key={stf.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-amber-300 uppercase">
                      {stf.role}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  </div>

                  <h4 className="text-sm font-bold text-white mt-3">{stf.name}</h4>
                  <p className="text-xs text-slate-400">{stf.email}</p>

                  <div className="mt-3 space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Privilege Scope:</span>
                    <div className="flex flex-wrap gap-1">
                      {stf.permissions.map(perm => (
                        <span key={perm} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
                          {perm}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 text-[10px] text-slate-500 flex justify-between items-center">
                  <span>2FA Authenticator: Active</span>
                  <span className="text-emerald-400 font-semibold">Authorized</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Staff Modal */}
      {showAddStaffModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">Provision Administrative Staff Member</h3>

            <form onSubmit={handleAddStaff} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Operator Name</label>
                <input
                  type="text"
                  value={newStaffName}
                  onChange={e => setNewStaffName(e.target.value)}
                  placeholder="e.g. Priyanshu Sen"
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Official Work Email</label>
                <input
                  type="email"
                  value={newStaffEmail}
                  onChange={e => setNewStaffEmail(e.target.value)}
                  placeholder="operator@bookmystar.in"
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Assigned Role</label>
                <select
                  value={newStaffRole}
                  onChange={e => setNewStaffRole(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none"
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
                  className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md"
                >
                  Issue Credentials
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddStaffModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
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

