import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileSpreadsheet,
  Download,
  Calendar,
  Users,
  CreditCard,
  LifeBuoy,
  CheckCircle2,
  Filter,
  Layers,
  ArrowRight
} from 'lucide-react';

export const AdminReports: React.FC = () => {
  const { bookings, users, payouts, grievances, showToast } = useApp();

  const [reportType, setReportType] = useState<'financial' | 'bookings' | 'users' | 'grievances'>('financial');

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    const timestamp = new Date().toISOString().split('T')[0];
    const fileName = `BookMyStar_${reportType}_report_${timestamp}.csv`;

    if (reportType === 'financial') {
      csvContent = "BookingRef,TransactionID,PayerName,InfluencerName,CallType,GrossAmountINR,CommissionINR,InfluencerEarningsINR,PaymentMethod,Status,Date\n";
      bookings.forEach(b => {
        csvContent += `"${b.bookingRef}","${b.transactionId}","${b.userName}","${b.influencerName}","${b.callType}",${b.amount},${b.commissionAmount},${b.influencerEarnings},"${b.paymentMethod}","${b.paymentStatus}","${b.scheduledDate}"\n`;
      });
    } else if (reportType === 'bookings') {
      csvContent = "BookingRef,UserName,UserEmail,InfluencerName,CallType,DurationMins,ScheduledDate,ScheduledTime,Status,PaymentStatus\n";
      bookings.forEach(b => {
        csvContent += `"${b.bookingRef}","${b.userName}","${b.userEmail}","${b.influencerName}","${b.callType}",${b.durationMinutes},"${b.scheduledDate}","${b.scheduledTime}","${b.bookingStatus}","${b.paymentStatus}"\n`;
      });
    } else if (reportType === 'users') {
      csvContent = "ID,Name,Email,Phone,Role,TotalSpentINR,TotalBookings,Status,JoinedDate\n";
      users.forEach(u => {
        csvContent += `"${u.id}","${u.name}","${u.email}","${u.phone}","${u.role}",${u.totalSpent},${u.totalBookings},"${u.status}","${u.createdAt}"\n`;
      });
    } else if (reportType === 'grievances') {
      csvContent = "TicketRef,RaisedBy,SubmitterName,Category,Priority,Status,Subject,Date\n";
      grievances.forEach(g => {
        csvContent += `"${g.ticketRef}","${g.raisedBy}","${g.submitterName}","${g.category}","${g.priority}","${g.status}","${g.subject}","${g.createdAt}"\n`;
      });
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Exported ${fileName} successfully!`);
  };

  return (
    <div className="space-y-8 pb-16 max-w-5xl">

      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Reports & Financial Analytics Center</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Generate and export auditable transaction logs, commission balances, user activity, and compliance records
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 py-2.5 px-5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-sm transition-all"
        >
          <Download className="w-4 h-4" />
          <span>Export {reportType.toUpperCase()} to CSV</span>
        </button>
      </div>

      {/* Report Selector Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setReportType('financial')}
          className={`p-4 rounded-2xl border text-left space-y-1 transition-all ${reportType === 'financial'
            ? 'bg-white border-2 border-amber-500 text-slate-900 shadow-md ring-1 ring-amber-500/20'
            : 'bg-white border border-slate-200/90 shadow-sm hover:shadow-md ring-1 ring-slate-900/5 hover:border-slate-300 text-slate-700'
            }`}
        >
          <CreditCard className="w-5 h-5 mb-1 text-emerald-600" />
          <div className="font-bold text-xs text-slate-900">Financial & Revenue Ledger</div>
          <div className="text-[10px] text-slate-500">Gross, commissions & GST</div>
        </button>

        <button
          onClick={() => setReportType('bookings')}
          className={`p-4 rounded-2xl border text-left space-y-1 transition-all ${reportType === 'bookings'
            ? 'bg-white border-2 border-amber-500 text-slate-900 shadow-md ring-1 ring-amber-500/20'
            : 'bg-white border border-slate-200/90 shadow-sm hover:shadow-md ring-1 ring-slate-900/5 hover:border-slate-300 text-slate-700'
            }`}
        >
          <Calendar className="w-5 h-5 mb-1 text-sky-600" />
          <div className="font-bold text-xs text-slate-900">Booking & Call Status Report</div>
          <div className="text-[10px] text-slate-500">Voice vs Video sessions</div>
        </button>

        <button
          onClick={() => setReportType('users')}
          className={`p-4 rounded-2xl border text-left space-y-1 transition-all ${reportType === 'users'
            ? 'bg-white border-2 border-amber-500 text-slate-900 shadow-md ring-1 ring-amber-500/20'
            : 'bg-white border border-slate-200/90 shadow-sm hover:shadow-md ring-1 ring-slate-900/5 hover:border-slate-300 text-slate-700'
            }`}
        >
          <Users className="w-5 h-5 mb-1 text-purple-600" />
          <div className="font-bold text-xs text-slate-900">User & Creator Roster</div>
          <div className="text-[10px] text-slate-500">Registration & status</div>
        </button>

        <button
          onClick={() => setReportType('grievances')}
          className={`p-4 rounded-2xl border text-left space-y-1 transition-all ${reportType === 'grievances'
            ? 'bg-white border-2 border-amber-500 text-slate-900 shadow-md ring-1 ring-amber-500/20'
            : 'bg-white border border-slate-200/90 shadow-sm hover:shadow-md ring-1 ring-slate-900/5 hover:border-slate-300 text-slate-700'
            }`}
        >
          <LifeBuoy className="w-5 h-5 mb-1 text-rose-600" />
          <div className="font-bold text-xs text-slate-900">Grievance & Incident Report</div>
          <div className="text-[10px] text-slate-500">Refunds & disputes</div>
        </button>
      </div>

      {/* Report Preview Data Table Section Box */}
      <div className="rounded-2xl bg-white border border-slate-200/90 p-6 space-y-4 shadow-sm hover:shadow-md ring-1 ring-slate-900/5 transition-shadow">
        <div className="flex items-center justify-between pb-1">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Live Preview: {reportType.toUpperCase()} DATASET
            </h3>
            <p className="text-xs text-slate-500">Displaying formatted records ready for CSV download</p>
          </div>
          <span className="text-xs font-mono text-emerald-600 font-semibold">UTF-8 Encoded</span>
        </div>

        {reportType === 'financial' && (
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-600 text-[10px] uppercase font-bold border-b border-slate-100">
                <tr>
                  <th className="py-2.5 px-3">Booking Ref</th>
                  <th className="py-2.5 px-3">Payer</th>
                  <th className="py-2.5 px-3">Creator</th>
                  <th className="py-2.5 px-3 text-right">Gross (₹)</th>
                  <th className="py-2.5 px-3 text-right">Commission (₹)</th>
                  <th className="py-2.5 px-3 text-right">Net Creator (₹)</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {bookings.map(b => (
                  <tr key={b.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-bold text-amber-700">{b.bookingRef}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{b.userName}</td>
                    <td className="py-2.5 px-3 text-purple-600">{b.influencerName}</td>
                    <td className="py-2.5 px-3 text-right font-extrabold text-slate-900">₹{b.amount}</td>
                    <td className="py-2.5 px-3 text-right text-emerald-600 font-bold">₹{b.commissionAmount}</td>
                    <td className="py-2.5 px-3 text-right text-slate-700">₹{b.influencerEarnings}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                        {b.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {reportType === 'bookings' && (
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-600 text-[10px] uppercase font-bold border-b border-slate-100">
                <tr>
                  <th className="py-2.5 px-3">Booking Ref</th>
                  <th className="py-2.5 px-3">User</th>
                  <th className="py-2.5 px-3">Influencer</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Date & Time</th>
                  <th className="py-2.5 px-3 text-right">Amount (₹)</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {bookings.map(b => (
                  <tr key={b.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-bold text-amber-700">{b.bookingRef}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{b.userName}</td>
                    <td className="py-2.5 px-3 text-purple-600">{b.influencerName}</td>
                    <td className="py-2.5 px-3 capitalize">{b.callType} ({b.durationMinutes}m)</td>
                    <td className="py-2.5 px-3 text-slate-600">{b.scheduledDate} {b.scheduledTime}</td>
                    <td className="py-2.5 px-3 text-right font-extrabold text-slate-900">₹{b.amount}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 uppercase">
                        {b.bookingStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {reportType === 'users' && (
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-600 text-[10px] uppercase font-bold border-b border-slate-100">
                <tr>
                  <th className="py-2.5 px-3">User Name</th>
                  <th className="py-2.5 px-3">Email</th>
                  <th className="py-2.5 px-3">Phone</th>
                  <th className="py-2.5 px-3 text-right">Total Spent (₹)</th>
                  <th className="py-2.5 px-3 text-center">Bookings Count</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-slate-900">{u.name}</td>
                    <td className="py-2.5 px-3 text-slate-600">{u.email}</td>
                    <td className="py-2.5 px-3 text-slate-600">{u.phone}</td>
                    <td className="py-2.5 px-3 text-right font-extrabold text-emerald-600">₹{u.totalSpent}</td>
                    <td className="py-2.5 px-3 text-center font-bold text-slate-900">{u.totalBookings}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                        {u.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {reportType === 'grievances' && (
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-600 text-[10px] uppercase font-bold border-b border-slate-100">
                <tr>
                  <th className="py-2.5 px-3">Ticket Ref</th>
                  <th className="py-2.5 px-3">Submitter</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Subject</th>
                  <th className="py-2.5 px-3 text-center">Priority</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {grievances.map(g => (
                  <tr key={g.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-bold text-amber-700">{g.ticketRef}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{g.submitterName} ({g.raisedBy})</td>
                    <td className="py-2.5 px-3 capitalize font-medium text-slate-700">{g.category}</td>
                    <td className="py-2.5 px-3 text-slate-800 line-clamp-1">{g.subject}</td>
                    <td className="py-2.5 px-3 text-center uppercase font-bold text-[10px] text-rose-600">{g.priority}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 uppercase">
                        {g.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

    </div>
  );
};
