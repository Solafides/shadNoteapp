"use client"

import { UserStats } from '@/components/UserStats';

type MonthlyData = {
  label: string;
  count: number;
};

type TopUser = {
  name: string;
  count: number;
};

type User = {
  id: string;
  email: string;
  role: string;
  createdAt: string;
  notes: Array<{
    id: string | number;
    title: string;
    subject: string;
    content: string;
    createdAt: string;
  }>;
};

type Props = {
  users: User[];
  notesPerMonth: MonthlyData[];
  loginData: MonthlyData[];
  topUsers: TopUser[];
};

export default function ClientOnly({ users, notesPerMonth, loginData, topUsers }: Props) {
  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* <h1 className="text-2xl font-bold mb-4"> Admin Dashboard</h1>
      <button
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        onClick={() => setShowTable((prev) => !prev)}
      >
        {showTable ? "Hide Users data" : "Show Users data"}
      </button>
      {showTable && <UserTable users={usersForTable} />} */}
      <UserStats
        notesPerMonth={notesPerMonth}
        loginsPerMonth={loginData}
        topUsers={topUsers}
        totalUsers={users.length}
        totalVisitors={loginData.reduce((acc, cur) => acc + cur.count, 0)}
        activeUsers={loginData.find(m => m.label === new Date().toLocaleString('default', { month: 'short' }))?.count || 0}
      />
    </div>
  );
}
