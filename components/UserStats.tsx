'use client'

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend
} from 'recharts'
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent
} from '@/components/ui/card'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { TrendingUp } from 'lucide-react'

type MonthlyData = {
  label: string
  count: number
}

type TopUser = {
  name: string
  count: number
}

type Props = {
  notesPerMonth: MonthlyData[]
  loginsPerMonth: MonthlyData[]
  topUsers: TopUser[]
  totalUsers: number
  totalVisitors: number
  activeUsers: number
  selectedRange?: string
  onRangeChange?: (range: string) => void
}

export function UserStats({
  notesPerMonth,
  loginsPerMonth,
  topUsers,
  totalUsers,
  totalVisitors,
  activeUsers,
  selectedRange = "6",
  onRangeChange,
}: Props) {
  return (
    <div className="mt-6">
      <div className="flex justify-end mb-4">
        <Select defaultValue={selectedRange} onValueChange={onRangeChange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3">Last 3 Months</SelectItem>
            <SelectItem value="6">Last 6 Months</SelectItem>
            <SelectItem value="12">Last 12 Months</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
            <CardDescription>All registered accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{totalUsers.toLocaleString()}</p>
            <p className="text-muted-foreground text-sm">Across all time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Visitors</CardTitle>
            <CardDescription>Total visits (login sessions)</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{totalVisitors.toLocaleString()}</p>
            <p className="text-muted-foreground text-sm">Tracked in selected range</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Users</CardTitle>
            <CardDescription>Users who logged in this month</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{activeUsers.toLocaleString()}</p>
            <p className="text-muted-foreground text-sm">Engaged this month</p>
          </CardContent>
        </Card>
      </div>

      {/* First Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Notes Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Notes Created</CardTitle>
            <CardDescription>Monthly breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={notesPerMonth} barSize={30}>
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>🏆 Top Note Creators</CardTitle>
            <CardDescription>Users with the most notes</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={topUsers} barSize={30}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Logins Line Chart */}
        {/* <Card>
          <CardHeader>
            <CardTitle>User Logins</CardTitle>
            <CardDescription>Monthly trend</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={loginsPerMonth}>
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <CartesianGrid strokeDasharray="3 3" />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#3b82f6" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card> */}
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Top Users */}
        
      </div>
    </div>
  )
}
