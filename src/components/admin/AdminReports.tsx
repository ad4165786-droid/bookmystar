import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  FileText, 
  Download, 
  Calendar, 
  Filter, 
  CheckCircle2, 
  TrendingUp, 
  Users, 
  CreditCard,
  LifeBuoy
} from 'lucide-react';

export const AdminReports: React.FC = () => {
  const { users, influencers, bookings, payouts, grievances, showToast } = useApp();

  const [reportType, setReportType] = useState<'financial' | 'bookings' | 'users' | 'grievances'>('financial');
  const [dateRange, setDateRange] = useState('30d');

  // CSV Generator Utility
  const handleExportCSV = () => {
    let csvContent = '';
    let fileName = `BookMyStar_${reportType}_report.csv`;

    if (reportType === 'financial') {
      csvContent = "BookingRef,Payer,Creator,AmountINR,CommissionINR,InfluencerEarningsINR,PaymentMethod,PaymentStatus,Date\n";
      bookings.forEach(b => {
        csvContent += `"${b.bookingRef}","${b.userName}","${b.influencerName}",${b.amount},${b.commissionAmount},${b.influencerEarnings},"${b.paymentMethod}","${b.paymentStatus}","${b.paidAt}"\n`;
      });
    } else if (reportType === 'bookings') {
      csvContent = "BookingRef,User,Creator,Category,CallType,DurationMin,Date,Time,Status,AmountINR\n";
      bookings.forEach(b => {
        csvContent += `"${b.bookingRef}","${b.userName}","${b.influencerName}","${b.influencerCategory}","${b.callType}",${b.durationMinutes},"${b.scheduledDate}","${b.scheduledTime}","${b.bookingStatus}",${b.amount}\n`;
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white">Reports & Financial Analytics Center</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Generate and export auditable transaction logs, commission balances, user activity, and compliance records
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 py-2.5 px-5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs shadow-glow transition-all"
        >
          <Download className="w-4 h-4" />
          <span>Export {reportType.toUpperCase()} to CSV</span>
        </button>
      </div>

      {/* Report Selector Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setReportType('financial')}
          className={`p-4 rounded-xl border text-left space-y-1 transition-all ${
            reportType === 'financial'
              ? 'bg-amber-950/40 border-amber-500 text-white shadow-glow'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <CreditCard className="w-5 h-5 mb-1 text-emerald-400" />
          <div className="font-bold text-xs">Financial & Revenue Ledger</div>
          <div className="text-[10px] text-slate-500">Gross, commissions & GST</div>
        </button>

        <button
          onClick={() => setReportType('bookings')}
          className={`p-4 rounded-xl border text-left space-y-1 transition-all ${
            reportType === 'bookings'
              ? 'bg-amber-950/40 border-amber-500 text-white shadow-glow'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Calendar className="w-5 h-5 mb-1 text-sky-400" />
          <div className="font-bold text-xs">Booking & Call Status Report</div>
          <div className="text-[10px] text-slate-500">Voice vs Video sessions</div>
        </button>

        <button
          onClick={() => setReportType('users')}
          className={`p-4 rounded-xl border text-left space-y-1 transition-all ${
            reportType === 'users'
              ? 'bg-amber-950/40 border-amber-500 text-white shadow-glow'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-5 h-5 mb-1 text-purple-400" />
          <div className="font-bold text-xs">User & Creator Roster</div>
          <div className="text-[10px] text-slate-500">Registration & status</div>
        </button>

        <button
          onClick={() => setReportType('grievances')}
          className={`p-4 rounded-xl border text-left space-y-1 transition-all ${
            reportType === 'grievances'
              ? 'bg-amber-950/40 border-amber-500 text-white shadow-glow'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <LifeBuoy className="w-5 h-5 mb-1 text-rose-400" />
          <div className="font-bold text-xs">Grievance & Incident Report</div>
          <div className="text-[10px] text-slate-500">Refunds & disputes</div>
        </button>
      </div>

      {/* Report Preview Data Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Live Preview: {reportType.toUpperCase()} DATASET
            </h3>
            <p className="text-xs text-slate-400">Displaying formatted records ready for CSV download</p>
          </div>
          <span className="text-xs font-mono text-emerald-400">UTF-8 Encoded</span>
        </div>

        {reportType === 'financial' && (
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-950/70 text-slate-400 text-[10px] uppercase font-bold">
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
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                {bookings.map(b => (
                  <tr key={b.id}>
                    <td className="py-2.5 px-3 font-mono font-bold text-amber-300">{b.bookingRef}</td>
                    <td className="py-2.5 px-3 font-semibold text-white">{b.userName}</td>
                    <td className="py-2.5 px-3 text-purple-300">{b.influencerName}</td>
                    <td className="py-2.5 px-3 text-right font-extrabold text-white">₹{b.amount}</td>
                    <td className="py-2.5 px-3 text-right text-emerald-400 font-bold">₹{b.commissionAmount}</td>
                    <td className="py-2.5 px-3 text-right text-slate-300">₹{b.influencerEarnings}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 uppercase">
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
              <thead className="bg-slate-950/70 text-slate-400 text-[10px] uppercase font-bold">
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
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                {bookings.map(b => (
                  <tr key={b.id}>
                    <td className="py-2.5 px-3 font-mono font-bold text-amber-300">{b.bookingRef}</td>
                    <td className="py-2.5 px-3 font-semibold text-white">{b.userName}</td>
                    <td className="py-2.5 px-3 text-purple-300">{b.influencerName}</td>
                    <td className="py-2.5 px-3 capitalize">{b.callType} ({b.durationMinutes}m)</td>
                    <td className="py-2.5 px-3">{b.scheduledDate} {b.scheduledTime}</td>
                    <td className="py-2.5 px-3 text-right font-extrabold text-white">₹{b.amount}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 uppercase">
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
              <thead className="bg-slate-950/70 text-slate-400 text-[10px] uppercase font-bold">
                <tr>
                  <th className="py-2.5 px-3">User Name</th>
                  <th className="py-2.5 px-3">Email</th>
                  <th className="py-2.5 px-3">Phone</th>
                  <th className="py-2.5 px-3 text-right">Total Spent (₹)</th>
                  <th className="py-2.5 px-3 text-center">Bookings Count</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                {users.map(u => (
                  <tr key={u.id}>
                    <td className="py-2.5 px-3 font-bold text-white">{u.name}</td>
                    <td className="py-2.5 px-3 text-slate-400">{u.email}</td>
                    <td className="py-2.5 px-3 text-slate-400">{u.phone}</td>
                    <td className="py-2.5 px-3 text-right font-extrabold text-emerald-400">₹{u.totalSpent}</td>
                    <td className="py-2.5 px-3 text-center font-bold text-white">{u.totalBookings}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 uppercase">
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
              <thead className="bg-slate-950/70 text-slate-400 text-[10px] uppercase font-bold">
                <tr>
                  <th className="py-2.5 px-3">Ticket Ref</th>
                  <th className="py-2.5 px-3">Submitter</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Subject</th>
                  <th className="py-2.5 px-3 text-center">Priority</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                {grievances.map(g => (
                  <tr key={g.id}>
                    <td className="py-2.5 px-3 font-mono font-bold text-amber-300">{g.ticketRef}</td>
                    <td className="py-2.5 px-3 font-semibold text-white">{g.submitterName} ({g.raisedBy})</td>
                    <td className="py-2.5 px-3 capitalize font-medium text-slate-300">{g.category}</td>
                    <td className="py-2.5 px-3 text-slate-200 line-clamp-1">{g.subject}</td>
                    <td className="py-2.5 px-3 text-center uppercase font-bold text-[10px] text-rose-400">{g.priority}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 uppercase">
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

