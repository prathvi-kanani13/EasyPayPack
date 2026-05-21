import React from "react";
import {
  Users,
  CreditCard,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Activity,
  DollarSign,
  ChevronRight,
  Plus,
  FileText,
  Send,
  UserCheck
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const stats = [
    {
      title: "Total Employees",
      value: "1,248",
      change: "+12.5%",
      isPositive: true,
      timeframe: "from last month",
      icon: Users,
      color: "from-blue-500/10 to-indigo-500/10 text-blue-600 dark:text-blue-400",
    },
    {
      title: "Monthly Payroll",
      value: "$342,850",
      change: "+8.2%",
      isPositive: true,
      timeframe: "from last month",
      icon: CreditCard,
      color: "from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "Pending Approvals",
      value: "14",
      change: "-3",
      isPositive: true,
      timeframe: "resolved today",
      icon: Clock,
      color: "from-amber-500/10 to-orange-500/10 text-amber-600 dark:text-amber-400",
    },
    {
      title: "Expense Claims",
      value: "$12,480",
      change: "+24.3%",
      isPositive: false,
      timeframe: "from last week",
      icon: DollarSign,
      color: "from-rose-500/10 to-pink-500/10 text-rose-600 dark:text-rose-400",
    },
  ];

  const recentTransactions = [
    {
      id: "TX-9021",
      employee: {
        name: "Sarah Jenkins",
        role: "Lead UI/UX Designer",
        avatarInitials: "SJ",
        avatarBg: "bg-purple-500",
      },
      amount: "$8,450.00",
      date: "May 20, 2026",
      status: "Success",
      type: "Salary",
    },
    {
      id: "TX-9020",
      employee: {
        name: "Michael Chen",
        role: "Senior Frontend Engineer",
        avatarInitials: "MC",
        avatarBg: "bg-blue-500",
      },
      amount: "$7,200.00",
      date: "May 20, 2026",
      status: "Success",
      type: "Salary",
    },
    {
      id: "TX-9019",
      employee: {
        name: "Emily Watson",
        role: "HR Operations Lead",
        avatarInitials: "EW",
        avatarBg: "bg-emerald-500",
      },
      amount: "$320.50",
      date: "May 19, 2026",
      status: "Pending",
      type: "Expense Claim",
    },
    {
      id: "TX-9018",
      employee: {
        name: "David Ross",
        role: "DevOps Engineer",
        avatarInitials: "DR",
        avatarBg: "bg-orange-500",
      },
      amount: "$6,800.00",
      date: "May 18, 2026",
      status: "Success",
      type: "Salary",
    },
    {
      id: "TX-9017",
      employee: {
        name: "Jessica Taylor",
        role: "Content Strategist",
        avatarInitials: "JT",
        avatarBg: "bg-pink-500",
      },
      amount: "$150.00",
      date: "May 17, 2026",
      status: "Failed",
      type: "Allowance",
    },
  ];

  return (
    // <div className="space-y-8 animate-in fade-in duration-500">
    //   {/* Welcome banner */}
    //   <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
    //     <div>
    //       <h1 className="text-3xl font-extrabold tracking-tight text-[#242664] dark:text-white sm:text-4xl">
    //         Dashboard Overview
    //       </h1>
    //       <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
    //         Welcome back! Here's a brief look at your organization's status for today.
    //       </p>
    //     </div>
    //     <div className="flex flex-wrap items-center gap-3">
    //       <Button variant="outline" className="h-10 rounded-xl bg-white border-gray-100 hover:bg-gray-50 text-gray-700 dark:bg-gray-900 dark:border-gray-800 dark:text-gray-300">
    //         Export Report
    //       </Button>
    //       <Button className="h-10 rounded-xl bg-gradient-to-r from-[#424efa] to-[#7350e7] hover:opacity-95 text-white shadow-md shadow-blue-500/10">
    //         <Plus className="mr-2 h-4 w-4" /> Run Payroll
    //       </Button>
    //     </div>
    //   </div>

    //   {/* Grid: Metrics Cards */}
    //   <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
    //     {stats.map((stat, i) => {
    //       const Icon = stat.icon;
    //       return (
    //         <Card
    //           key={i}
    //           className="overflow-hidden border border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900 shadow-sm hover:shadow-md transition-all duration-300 group rounded-2xl"
    //         >
    //           <CardContent className="p-6">
    //             <div className="flex items-center justify-between">
    //               <span className="text-sm font-semibold text-gray-400 dark:text-gray-500">
    //                 {stat.title}
    //               </span>
    //               <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr ${stat.color} transition-transform duration-300 group-hover:scale-110`}>
    //                 <Icon className="h-5.5 w-5.5" />
    //               </div>
    //             </div>

    //             <div className="mt-4 flex items-baseline gap-2">
    //               <span className="text-3xl font-bold tracking-tight text-gray-950 dark:text-white">
    //                 {stat.value}
    //               </span>
    //               <span
    //                 className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${
    //                   stat.isPositive
    //                     ? "text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/30"
    //                     : "text-rose-700 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/30"
    //                 }`}
    //               >
    //                 {stat.isPositive ? (
    //                   <ArrowUpRight className="mr-0.5 h-3 w-3" />
    //                 ) : (
    //                   <ArrowDownRight className="mr-0.5 h-3 w-3" />
    //                 )}
    //                 {stat.change}
    //               </span>
    //             </div>
    //             <p className="mt-1 text-[11px] text-gray-400 dark:text-gray-500 font-medium">
    //               {stat.timeframe}
    //             </p>
    //           </CardContent>
    //         </Card>
    //       );
    //     })}
    //   </div>

    //   {/* Main Sections Grid */}
    //   <div className="grid gap-6 lg:grid-cols-3">
    //     {/* Left 2 Columns: Chart & Transactions */}
    //     <div className="lg:col-span-2 space-y-6">
    //       {/* Analytics Chart Mock (Beautiful custom SVG & HTML display) */}
    //       <Card className="border border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900 rounded-2xl shadow-sm">
    //         <CardContent className="p-6">
    //           <div className="flex items-center justify-between">
    //             <div>
    //               <h3 className="text-base font-bold text-gray-800 dark:text-white">
    //                 Payroll Outflow Analysis
    //               </h3>
    //               <p className="text-xs text-gray-400 mt-0.5">
    //                 Monthly spending overview across departments
    //               </p>
    //             </div>
    //             <div className="flex items-center gap-4 text-xs font-semibold text-gray-500">
    //               <div className="flex items-center gap-1.5">
    //                 <span className="h-2 w-2 rounded-full bg-[#424efa]" />
    //                 <span>Salaries</span>
    //               </div>
    //               <div className="flex items-center gap-1.5">
    //                 <span className="h-2 w-2 rounded-full bg-[#7350e7]" />
    //                 <span>Claims</span>
    //               </div>
    //             </div>
    //           </div>

    //           {/* High-fidelity custom SVG Chart */}
    //           <div className="mt-8 relative h-64 w-full flex flex-col justify-end">
    //             <svg className="w-full h-48 overflow-visible" viewBox="0 0 500 100" preserveAspectRatio="none">
    //               {/* Grid Lines */}
    //               <line x1="0" y1="0" x2="500" y2="0" stroke="rgba(156,163,175,0.06)" strokeWidth="1" />
    //               <line x1="0" y1="33" x2="500" y2="33" stroke="rgba(156,163,175,0.06)" strokeWidth="1" />
    //               <line x1="0" y1="66" x2="500" y2="66" stroke="rgba(156,163,175,0.06)" strokeWidth="1" />
    //               <line x1="0" y1="100" x2="500" y2="100" stroke="rgba(156,163,175,0.15)" strokeWidth="1" />

    //               {/* Gradient definition */}
    //               <defs>
    //                 <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
    //                   <stop offset="0%" stopColor="#424efa" stopOpacity="0.25" />
    //                   <stop offset="100%" stopColor="#424efa" stopOpacity="0.0" />
    //                 </linearGradient>
    //                 <linearGradient id="chartGradient2" x1="0" y1="0" x2="0" y2="1">
    //                   <stop offset="0%" stopColor="#7350e7" stopOpacity="0.2" />
    //                   <stop offset="100%" stopColor="#7350e7" stopOpacity="0.0" />
    //                 </linearGradient>
    //               </defs>

    //               {/* Area Charts */}
    //               <path
    //                 d="M0,80 Q50,40 100,50 T200,30 T300,60 T400,20 T500,45 L500,100 L0,100 Z"
    //                 fill="url(#chartGradient)"
    //               />
    //               <path
    //                 d="M0,90 Q50,60 100,70 T200,55 T300,75 T400,40 T500,65 L500,100 L0,100 Z"
    //                 fill="url(#chartGradient2)"
    //               />

    //               {/* Line Charts */}
    //               <path
    //                 d="M0,80 Q50,40 100,50 T200,30 T300,60 T400,20 T500,45"
    //                 fill="none"
    //                 stroke="#424efa"
    //                 strokeWidth="3.5"
    //                 strokeLinecap="round"
    //               />
    //               <path
    //                 d="M0,90 Q50,60 100,70 T200,55 T300,75 T400,40 T500,65"
    //                 fill="none"
    //                 stroke="#7350e7"
    //                 strokeWidth="2.5"
    //                 strokeDasharray="4 2"
    //                 strokeLinecap="round"
    //               />

    //               {/* Data Points */}
    //               <circle cx="200" cy="30" r="5" fill="#424efa" stroke="white" strokeWidth="2" className="drop-shadow-md" />
    //               <circle cx="400" cy="20" r="5" fill="#424efa" stroke="white" strokeWidth="2" className="drop-shadow-md" />
    //             </svg>

    //             {/* X Axis Labels */}
    //             <div className="flex justify-between text-[10px] font-bold text-gray-400 mt-4 px-1">
    //               <span>Dec</span>
    //               <span>Jan</span>
    //               <span>Feb</span>
    //               <span>Mar</span>
    //               <span>Apr</span>
    //               <span>May</span>
    //             </div>
    //           </div>
    //         </CardContent>
    //       </Card>

    //       {/* Recent Payroll Transactions */}
    //       <Card className="border border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900 rounded-2xl shadow-sm">
    //         <CardContent className="p-6">
    //           <div className="flex items-center justify-between mb-6">
    //             <div>
    //               <h3 className="text-base font-bold text-gray-800 dark:text-white">
    //                 Recent Payroll History
    //               </h3>
    //               <p className="text-xs text-gray-400 mt-0.5">
    //                 Latest salary transfers and approvals
    //               </p>
    //             </div>
    //             <Button variant="ghost" size="sm" className="text-xs text-[#424efa] hover:bg-blue-50 dark:hover:bg-blue-950/20 font-semibold cursor-pointer">
    //               View All <ChevronRight className="ml-1 h-3.5 w-3.5" />
    //             </Button>
    //           </div>

    //           {/* Transactions Table */}
    //           <div className="overflow-x-auto">
    //             <table className="w-full border-collapse text-left text-sm">
    //               <thead>
    //                 <tr className="border-b border-gray-50 dark:border-gray-800 pb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
    //                   <th className="py-3 pr-4">Employee</th>
    //                   <th className="py-3 px-4">Type</th>
    //                   <th className="py-3 px-4">Amount</th>
    //                   <th className="py-3 px-4">Date</th>
    //                   <th className="py-3 pl-4 text-right">Status</th>
    //                 </tr>
    //               </thead>
    //               <tbody className="divide-y divide-gray-50 dark:divide-gray-800/40">
    //                 {recentTransactions.map((tx) => (
    //                   <tr key={tx.id} className="group hover:bg-gray-50/40 dark:hover:bg-gray-800/20 transition-all duration-150">
    //                     <td className="py-3.5 pr-4 flex items-center gap-3">
    //                       <div className={`flex h-9 w-9 items-center justify-center rounded-xl text-white font-semibold text-xs ${tx.employee.avatarBg} shadow-sm`}>
    //                         {tx.employee.avatarInitials}
    //                       </div>
    //                       <div>
    //                         <span className="font-semibold text-gray-800 dark:text-white block group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-150">
    //                           {tx.employee.name}
    //                         </span>
    //                         <span className="text-[11px] text-gray-400 font-medium">
    //                           {tx.employee.role}
    //                         </span>
    //                       </div>
    //                     </td>
    //                     <td className="py-3.5 px-4 text-gray-500 dark:text-gray-400 font-medium">
    //                       {tx.type}
    //                     </td>
    //                     <td className="py-3.5 px-4 font-bold text-gray-800 dark:text-white">
    //                       {tx.amount}
    //                     </td>
    //                     <td className="py-3.5 px-4 text-gray-400 dark:text-gray-500 text-xs font-medium">
    //                       {tx.date}
    //                     </td>
    //                     <td className="py-3.5 pl-4 text-right">
    //                       <span
    //                         className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
    //                           tx.status === "Success"
    //                             ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
    //                             : tx.status === "Pending"
    //                             ? "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
    //                             : "bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400"
    //                         }`}
    //                       >
    //                         {tx.status}
    //                       </span>
    //                     </td>
    //                   </tr>
    //                 ))}
    //               </tbody>
    //             </table>
    //           </div>
    //         </CardContent>
    //       </Card>
    //     </div>

    //     {/* Right 1 Column: Quick Actions & Alerts */}
    //     <div className="space-y-6">
    //       {/* Quick Actions Panel */}
    //       <Card className="border border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900 rounded-2xl shadow-sm">
    //         <CardContent className="p-6">
    //           <h3 className="text-base font-bold text-gray-800 dark:text-white mb-4">
    //             Quick Actions
    //           </h3>
    //           <div className="grid grid-cols-2 gap-3.5">
    //             <button className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-50 bg-gray-50/50 hover:bg-[#424efa]/5 hover:border-[#424efa]/20 dark:border-gray-800 dark:bg-gray-800/40 dark:hover:bg-blue-500/10 dark:hover:border-blue-500/30 transition-all duration-200 group text-center cursor-pointer">
    //               <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500 text-white shadow-md shadow-blue-500/10 group-hover:scale-110 transition-transform duration-200">
    //                 <Plus className="h-5 w-5" />
    //               </div>
    //               <span className="text-xs font-bold text-gray-700 dark:text-gray-300 mt-2.5">
    //                 Add Employee
    //               </span>
    //             </button>

    //             <button className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-50 bg-gray-50/50 hover:bg-[#424efa]/5 hover:border-[#424efa]/20 dark:border-gray-800 dark:bg-gray-800/40 dark:hover:bg-blue-500/10 dark:hover:border-blue-500/30 transition-all duration-200 group text-center cursor-pointer">
    //               <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500 text-white shadow-md shadow-purple-500/10 group-hover:scale-110 transition-transform duration-200">
    //                 <Send className="h-5 w-5" />
    //               </div>
    //               <span className="text-xs font-bold text-gray-700 dark:text-gray-300 mt-2.5">
    //                 Send Bonus
    //               </span>
    //             </button>

    //             <button className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-50 bg-gray-50/50 hover:bg-[#424efa]/5 hover:border-[#424efa]/20 dark:border-gray-800 dark:bg-gray-800/40 dark:hover:bg-blue-500/10 dark:hover:border-blue-500/30 transition-all duration-200 group text-center cursor-pointer">
    //               <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-white shadow-md shadow-amber-500/10 group-hover:scale-110 transition-transform duration-200">
    //                 <FileText className="h-5 w-5" />
    //               </div>
    //               <span className="text-xs font-bold text-gray-700 dark:text-gray-300 mt-2.5">
    //                 Tax Form 16
    //               </span>
    //             </button>

    //             <button className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-50 bg-gray-50/50 hover:bg-[#424efa]/5 hover:border-[#424efa]/20 dark:border-gray-800 dark:bg-gray-800/40 dark:hover:bg-blue-500/10 dark:hover:border-blue-500/30 transition-all duration-200 group text-center cursor-pointer">
    //               <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-md shadow-emerald-500/10 group-hover:scale-110 transition-transform duration-200">
    //                 <UserCheck className="h-5 w-5" />
    //               </div>
    //               <span className="text-xs font-bold text-gray-700 dark:text-gray-300 mt-2.5">
    //                 Assign Role
    //               </span>
    //             </button>
    //           </div>
    //         </CardContent>
    //       </Card>

    //       {/* High-priority Action items */}
    //       <Card className="border border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900 rounded-2xl shadow-sm">
    //         <CardContent className="p-6">
    //           <div className="flex items-center justify-between mb-4">
    //             <h3 className="text-base font-bold text-gray-800 dark:text-white">
    //               Pending Tasks
    //             </h3>
    //             <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-600 text-[10px] font-bold dark:bg-red-950/40 dark:text-red-400">
    //               3
    //             </span>
    //           </div>

    //           <div className="space-y-3.5">
    //             <div className="p-3.5 rounded-xl border border-rose-100 bg-rose-50/20 dark:border-rose-950/40 dark:bg-rose-950/10 flex items-start gap-3">
    //               <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rose-500 text-white shadow-sm mt-0.5">
    //                 <Clock className="h-4 w-4" />
    //               </div>
    //               <div>
    //                 <h4 className="text-xs font-bold text-gray-800 dark:text-white">
    //                   Approve May Payroll
    //                 </h4>
    //                 <p className="text-[11px] text-gray-400 mt-0.5 font-medium leading-relaxed">
    //                   Approval is due by midnight. 1,248 payouts pending release.
    //                 </p>
    //               </div>
    //             </div>

    //             <div className="p-3.5 rounded-xl border border-amber-100 bg-amber-50/20 dark:border-amber-950/40 dark:bg-amber-950/10 flex items-start gap-3">
    //               <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500 text-white shadow-sm mt-0.5">
    //                 <Users className="h-4 w-4" />
    //               </div>
    //               <div>
    //                 <h4 className="text-xs font-bold text-gray-800 dark:text-white">
    //                   Complete KYC Audits
    //                 </h4>
    //                 <p className="text-[11px] text-gray-400 mt-0.5 font-medium leading-relaxed">
    //                   4 new employees need mandatory KYC details validation.
    //                 </p>
    //               </div>
    //             </div>

    //             <div className="p-3.5 rounded-xl border border-blue-100 bg-blue-50/20 dark:border-blue-950/40 dark:bg-blue-950/10 flex items-start gap-3">
    //               <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500 text-white shadow-sm mt-0.5">
    //                 <FileText className="h-4 w-4" />
    //               </div>
    //               <div>
    //                 <h4 className="text-xs font-bold text-gray-800 dark:text-white">
    //                   Sign Contractor Agrmts.
    //                 </h4>
    //                 <p className="text-[11px] text-gray-400 mt-0.5 font-medium leading-relaxed">
    //                   Digital signature requested for 2 contract engineer extensions.
    //                 </p>
    //               </div>
    //             </div>
    //           </div>
    //         </CardContent>
    //       </Card>
    //     </div>
    //   </div>
    // </div>

    <div>employee dashboard</div>
  );
}
