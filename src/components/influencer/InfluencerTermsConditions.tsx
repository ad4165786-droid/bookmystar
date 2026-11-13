import React, { useState } from 'react';
import {
  FileText,
  ShieldAlert,
  Scale,
  CreditCard,
  Calendar,
  AlertOctagon,
  UserCheck,
  Lock,
  Search,
  CheckCircle2,
  Info,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Printer,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface TermSection {
  id: string;
  number: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
  summary: string;
  clauses: {
    title: string;
    description: string;
    points: string[];
  }[];
}

export const InfluencerTermsConditions: React.FC = () => {
  const { currentInfluencer, showToast } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (id: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const sections: TermSection[] = [
    {
      id: 'platform-usage',
      number: '01',
      title: 'Platform Usage & Eligibility',
      icon: UserCheck,
      tag: 'Eligibility',
      summary: 'Rules governing registration, creator eligibility criteria, KYC authentication, and authorized use of BookMyStar services.',
      clauses: [
        {
          title: 'Clause 1.1: Creator Eligibility & Onboarding',
          description: '[PLACEHOLDER] To register and offer video calls, audio interactions, or fan services on BookMyStar, creators must meet minimum age and verification standards.',
          points: [
            '[Placeholder] The creator must be at least 18 years of age or possess formal parental/guardian consent in accordance with applicable local laws.',
            '[Placeholder] Submission of valid government-issued photo identification (Aadhaar, Passport, PAN, or National ID) is mandatory for creator studio activation.',
            '[Placeholder] BookMyStar reserves the right to reject or suspend creator profiles that misrepresent their identity, follower metrics, or commercial representations.'
          ]
        },
        {
          title: 'Clause 1.2: Permitted Platform Usage',
          description: '[PLACEHOLDER] The creator agrees to utilize BookMyStar exclusively for legitimate fan interactions, personal brand engagement, and creative consultancy.',
          points: [
            '[Placeholder] Sub-licensing, renting, sharing, or transferring creator studio access credentials to unapproved third parties is strictly prohibited.',
            '[Placeholder] Automated bots, scrapers, or unauthorized API integrations targeting user data or slot schedules are prohibited.'
          ]
        }
      ]
    },
    {
      id: 'creator-responsibilities',
      number: '02',
      title: 'Creator Responsibilities & Service Delivery',
      icon: Scale,
      tag: 'Service Standards',
      summary: 'Professional conduct expectations, punctual attendance, broadcast quality standards, and truthful profile presentation.',
      clauses: [
        {
          title: 'Clause 2.1: Punctuality and Live Session Attendance',
          description: '[PLACEHOLDER] Creators are expected to join scheduled sessions promptly at the confirmed start time.',
          points: [
            '[Placeholder] Creators must connect to the live call room within 5 minutes of the scheduled appointment time.',
            '[Placeholder] In the event of an unavoidable emergency, the creator must provide advance notice and propose reschedule options through the portal.',
            '[Placeholder] Unexcused creator no-shows may incur rating penalties, temporary slot suspension, and mandatory 100% full fan refunds.'
          ]
        },
        {
          title: 'Clause 2.2: Broadcast Quality & Technical Environment',
          description: '[PLACEHOLDER] Creators are responsible for maintaining reasonable technical standards to ensure satisfactory session delivery.',
          points: [
            '[Placeholder] Adequate internet bandwidth (minimum 5 Mbps stable upload/download) and functional camera/microphone hardware are required.',
            '[Placeholder] Sessions must be hosted in a quiet, well-lit, private environment free of distracting background hazards or offensive signage.'
          ]
        }
      ]
    },
    {
      id: 'bookings-governance',
      number: '03',
      title: 'Fan Bookings & Session Governance',
      icon: Calendar,
      tag: 'Bookings',
      summary: 'Slot reservation mechanisms, session duration tracking, buffer rules, and recorded content boundaries.',
      clauses: [
        {
          title: 'Clause 3.1: Session Booking and Scheduling',
          description: '[PLACEHOLDER] All interaction requests are scheduled strictly according to creator-defined calendar availability and slot duration rules.',
          points: [
            '[Placeholder] Bookings are confirmed upon successful escrow authorization or payment capture by the platform payment processor.',
            '[Placeholder] Neither the fan nor the creator may unilaterally extend session time beyond the booked duration without platform billing confirmation.',
            '[Placeholder] Creators maintain full autonomy to set buffer times (e.g., 5 to 30 minutes) between sessions to manage transition periods.'
          ]
        },
        {
          title: 'Clause 3.2: Interaction Recording & Privacy Consent',
          description: '[PLACEHOLDER] Clear boundaries regarding video/audio recording apply during private fan sessions.',
          points: [
            '[Placeholder] Neither party may record, screen-capture, or rebroadcast session media without explicit prior mutual consent.',
            '[Placeholder] BookMyStar may retain automated encrypted session telemetry (metadata, connection logs, duration) for dispute arbitration and safety monitoring.'
          ]
        }
      ]
    },
    {
      id: 'cancellations-refunds',
      number: '04',
      title: 'Cancellations, Rescheduling & Refund Handling',
      icon: ClockIconFallback,
      tag: 'Refunds & Changes',
      summary: 'Timelines and penalty structures governing creator or fan cancellations, rescheduling allowances, and automated refund triggers.',
      clauses: [
        {
          title: 'Clause 4.1: Fan-Initiated Cancellations',
          description: '[PLACEHOLDER] Refund percentages for cancellations requested by fans depend on the advance notice period established by the creator policy tier.',
          points: [
            '[Placeholder] Cancellations made more than 24 hours prior to the slot time qualify for a full (100%) or partial refund based on the active creator policy tier.',
            '[Placeholder] Cancellations made with less than 2 hours notice or fan no-shows are deemed non-refundable, with creator earnings credited normally.',
            '[Placeholder] Platform processing fees may be retained in specific non-fault cancellation scenarios.'
          ]
        },
        {
          title: 'Clause 4.2: Creator-Initiated Rescheduling & Cancellations',
          description: '[PLACEHOLDER] In cases where a creator is unable to honor a booking due to schedule conflicts or unforeseen events.',
          points: [
            '[Placeholder] Creators may request to reschedule a session up to 4 hours before session start without penalty, subject to fan acceptance.',
            '[Placeholder] If a fan rejects the rescheduled proposal or if the creator cancels outright, the fan receives an immediate 100% refund.',
            '[Placeholder] Frequent creator cancellations (>10% monthly threshold) will trigger a Trust & Safety account audit.'
          ]
        }
      ]
    },
    {
      id: 'payments-commission',
      number: '05',
      title: 'Payments, Platform Commission & Payouts',
      icon: CreditCard,
      tag: 'Financials',
      summary: 'Pricing autonomy, platform revenue share, escrow holding periods, payment thresholds, and bank disbursement schedules.',
      clauses: [
        {
          title: 'Clause 5.1: Pricing Autonomy & Platform Commission',
          description: '[PLACEHOLDER] Creators retain sole discretion over their session pricing structure across voice, video, and direct messaging services.',
          points: [
            '[Placeholder] BookMyStar deducts a standardized platform service commission (typically 20% or as specified in creator tier agreements) from the gross booking fee.',
            '[Placeholder] Applicable statutory taxes (such as GST or TDS as mandated by Indian tax law) will be deducted at source or invoiced as required.'
          ]
        },
        {
          title: 'Clause 5.2: Disbursal Cycle & Escrow Holds',
          description: '[PLACEHOLDER] Safeguards to ensure complete session delivery before funds are released to the creator balance.',
          points: [
            '[Placeholder] Booking revenues are credited to pending balance immediately upon call completion and cleared after a standard 24-hour grievance review window.',
            '[Placeholder] Creators may initiate payout requests to their verified bank account or UPI ID once the minimum threshold (₹500 / ₹1,000) is reached.',
            '[Placeholder] Payout requests are processed within 2 to 3 business banking days via NEFT/IMPS or automated UPI gateway.'
          ]
        }
      ]
    },
    {
      id: 'prohibited-activities',
      number: '06',
      title: 'Prohibited Activities & Conduct Standards',
      icon: AlertOctagon,
      tag: 'Zero Tolerance',
      summary: 'Strict prohibitions against harassment, hate speech, inappropriate content, off-platform payment solicitation, and exploitation.',
      clauses: [
        {
          title: 'Clause 6.1: Zero-Tolerance Harassment and Harm Policy',
          description: '[PLACEHOLDER] BookMyStar maintains a strict zero-tolerance enforcement stance toward abusive behavior.',
          points: [
            '[Placeholder] Absolute prohibition of explicit sexual content, nudity, cyber-bullying, hate speech, intimidation, or harassment.',
            '[Placeholder] Immediate termination rights: Creators or fans may disconnect immediately if the other party displays inappropriate conduct, retaining full review rights.',
            '[Placeholder] Serious safety incidents are escalated to law enforcement authorities where legally mandated.'
          ]
        },
        {
          title: 'Clause 6.2: Prohibition of Off-Platform Transactions (Disintermediation)',
          description: '[PLACEHOLDER] All monetary transactions for BookMyStar connections must be processed via the platform checkout gateway.',
          points: [
            '[Placeholder] Requesting, soliciting, or accepting offline payments (cash, private bank transfers, crypto, external payment links) is strictly prohibited.',
            '[Placeholder] Directing fans off-platform to avoid service commission will result in permanent creator account termination and forfeiture of pending balances.'
          ]
        }
      ]
    },
    {
      id: 'account-policies',
      number: '07',
      title: 'Account Policies, Suspension & Termination',
      icon: ShieldAlert,
      tag: 'Enforcement',
      summary: 'Conditions under which creator privileges may be limited, suspended, or permanently terminated, and the formal appeal process.',
      clauses: [
        {
          title: 'Clause 7.1: Grounds for Suspension and Penalties',
          description: '[PLACEHOLDER] Violations of BookMyStar community rules or persistent negative fan dispute rates will result in tiered enforcement action.',
          points: [
            '[Placeholder] Tier 1 Warning: Issued for minor infractions or isolated unexcused tardiness.',
            '[Placeholder] Tier 2 Suspension: 7 to 30 day temporary profile freeze, during which no new bookings can be made.',
            '[Placeholder] Tier 3 Permanent Termination: Full revocation of studio access, removal from creator marketplace, and potential legal remedies.'
          ]
        },
        {
          title: 'Clause 7.2: Dispute Resolution & Appeals Mechanism',
          description: '[PLACEHOLDER] Creators maintain the right to appeal adverse moderation findings or review flags.',
          points: [
            '[Placeholder] Appeals must be formally submitted within 14 calendar days via the Reviews & Grievances portal.',
            '[Placeholder] All formal grievances are evaluated by an independent trust, safety, and compliance panel within 5 business days.'
          ]
        }
      ]
    },
    {
      id: 'intellectual-property',
      number: '08',
      title: 'Intellectual Property, Publicity & Data Privacy',
      icon: Lock,
      tag: 'Intellectual Property',
      summary: 'Ownership of creator trademarks, likeness rights, user personal information protection, and privacy compliance.',
      clauses: [
        {
          title: 'Clause 8.1: Creator Content & Likeness Rights',
          description: '[PLACEHOLDER] Creators retain all ownership, copyrights, and intellectual property rights to their personal brand and creative identity.',
          points: [
            '[Placeholder] The creator grants BookMyStar a non-exclusive, revocable, royalty-free license to display their name, avatar, bio, and showcase media on the marketplace solely for promotion and booking facilitation.',
            '[Placeholder] BookMyStar will never claim ownership over creator personal intellectual property or likeness.'
          ]
        },
        {
          title: 'Clause 8.2: Data Protection & Fan Confidentiality',
          description: '[PLACEHOLDER] Both BookMyStar and registered creators are bound by data privacy legislation and confidentiality obligations.',
          points: [
            '[Placeholder] Creators must never disclose, sell, or publicly share personal fan information (names, contact numbers, email addresses, personal confessions) obtained during sessions.',
            '[Placeholder] Handling of user data complies with the Digital Personal Data Protection (DPDP) Act and international privacy best practices.'
          ]
        }
      ]
    }
  ];

  const filteredSections = sections.filter(sec => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      sec.title.toLowerCase().includes(q) ||
      sec.summary.toLowerCase().includes(q) ||
      sec.clauses.some(
        c => c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.points.some(p => p.toLowerCase().includes(q))
      )
    );
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-6 max-w-5xl mx-auto font-sans">

      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 border border-brand-200/80 flex items-center justify-center shrink-0 shadow-xs">
            <FileText className="w-6 h-6 text-brand-600" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Terms & Conditions
              </h1>
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[11px] font-bold border border-amber-200">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Creator Agreement • v0.9 Draft</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              Platform terms of service, creator obligations, booking governance, payout agreements, and dispute resolution guidelines for BookMyStar creators.
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2 self-start md:self-auto shrink-0 flex-wrap">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold transition-all cursor-pointer"
            title="Print or save as PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print / Save PDF</span>
            <span className="sm:hidden">Print</span>
          </button>
          <button
            type="button"
            onClick={() => showToast('Official legal agreement download will be available upon formal rollout.')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold transition-all shadow-sm shadow-brand-500/25 cursor-pointer"
          >
            <span>Legal Status</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Prominent Placeholder Notice Alert (Clearly marked placeholder content) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-50/90 via-amber-50/40 to-slate-50 border border-amber-200/90 text-xs text-amber-900 space-y-2 shadow-2xs">
        <div className="flex items-center gap-2 font-black text-amber-950 text-sm">
          <Info className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Notice: Placeholder Policy Document</span>
        </div>
        <p className="text-amber-800 leading-relaxed text-[11px] sm:text-xs">
          <strong>Important:</strong> The clauses and articles displayed below represent standard operational draft placeholder guidelines for creators utilizing BookMyStar. Official legally approved and certified terms of service will be formally provided and executed by platform legal counsel prior to commercial rollout.
        </p>
        <div className="pt-2 flex flex-wrap items-center gap-4 text-[11px] font-semibold text-amber-900/80">
          <span>• Jurisdiction: Republic of India</span>
          <span>• Last Review: November 2026</span>
          <span>• Creator Account: {currentInfluencer?.name || 'Verified Creator'} ({currentInfluencer?.handle || '@creator'})</span>
          <span>• Status: Operational Draft Placeholder</span>
        </div>
      </div>

      {/* Search and Navigation Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search terms (e.g. cancellations, payments, conduct)..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end text-xs font-bold text-slate-500">
          <span>Showing {filteredSections.length} of {sections.length} policy sections</span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-brand-600 hover:text-brand-700 text-xs font-bold underline cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Policy Sections List */}
      <div className="space-y-4">
        {filteredSections.map(section => {
          const SectionIcon = section.icon;
          const isCollapsed = !!collapsedSections[section.id];

          return (
            <div
              key={section.id}
              id={section.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition-all hover:border-slate-300"
            >
              {/* Section Accordion Header */}
              <div
                onClick={() => toggleSection(section.id)}
                className="p-5 sm:p-6 flex items-start sm:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/60 transition-colors select-none"
              >
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center shrink-0 font-mono text-xs font-bold">
                    {section.number}
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                        <SectionIcon className="w-4 h-4 text-brand-600 shrink-0" />
                        <span>{section.title}</span>
                      </h2>
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200 uppercase tracking-wider">
                        {section.tag}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 sm:line-clamp-1">
                      {section.summary}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 pt-1 sm:pt-0">
                  <span className="text-xs font-bold text-slate-400 hidden md:inline">
                    {isCollapsed ? 'Expand' : 'Collapse'}
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                    {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {/* Section Body */}
              {!isCollapsed && (
                <div className="px-5 pb-6 sm:px-6 pt-0 border-t border-slate-100 divide-y divide-slate-100 animate-fadeIn">
                  {section.clauses.map((clause, idx) => (
                    <div key={idx} className="py-4 first:pt-4 last:pb-1 space-y-2.5">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0" />
                        <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                          {clause.title}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed pl-3.5">
                        {clause.description}
                      </p>
                      <div className="pl-3.5 space-y-1.5">
                        {clause.points.map((point, pIdx) => (
                          <div key={pIdx} className="flex items-start gap-2 text-xs text-slate-600">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                            <span className="leading-relaxed">{point}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {filteredSections.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
            <FileText className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">No policy sections match your search</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Try searching for common terms like "payouts", "refunds", "camera", "prohibited", or "conduct".
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="px-4 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
            >
              Reset Search Filter
            </button>
          </div>
        )}
      </div>

      {/* Support & Grievance Contact Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="text-xs sm:text-sm font-extrabold text-slate-900">
            Have questions about these platform policies?
          </h4>
          <p className="text-xs text-slate-500">
            Our creator compliance team is available to assist with questions regarding rights, rates, or account safety.
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <a
            href="mailto:support@bookmystar.in"
            className="px-4 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition-colors"
          >
            Email Support
          </a>
          <button
            type="button"
            onClick={() => showToast('You can file a formal grievance via the Reviews & Grievances tab.')}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
          >
            File Safety Ticket
          </button>
        </div>
      </div>

    </div>
  );
};

// Fallback Clock icon helper
function ClockIconFallback(props: { className?: string }) {
  return <Calendar {...props} />;
}

