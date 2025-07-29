
'use client'

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend, RadialBarChart, RadialBar, PolarRadiusAxis, PolarGrid, Label,
} from 'recharts'
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
} from '@/components/ui/card'
import { TrendingUp } from "lucide-react"
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem
} from '@/components/ui/select'

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
  selectedRange?: string
  onRangeChange?: (range: string) => void
}

export function UserStats({
  notesPerMonth,
  loginsPerMonth,
  topUsers,
  selectedRange = "6",
  onRangeChange,
}: Props) {
  const radialChartData = [
    { browser: 'safari', visitors: loginsPerMonth.reduce((acc, _cur) => acc + _cur.count, 0), fill: '#6366F1' },
  ];

  // Example: total users, replace with actual prop or fetch if needed
  const totalUsers = topUsers.reduce((acc, _) => acc + 1, 0); // Replace with real total users count
  const userRadialChartData = [
    { name: 'Total Users', value: totalUsers, fill: '#3b82f6' },
  ];

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

      {/* First Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visitor Radial Chart */}
        <Card className="flex flex-col">
          <CardHeader className="items-center pb-0">
            <CardTitle>Visitor Summary</CardTitle>
            <CardDescription>Summary from selected range</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ResponsiveContainer width="100%" height={250}>
              <RadialBarChart
                data={radialChartData}
                endAngle={100}
                innerRadius={80}
                outerRadius={140}
              >
                <PolarGrid gridType="circle" radialLines={false} stroke="none" polarRadius={[86, 74]} />
                <RadialBar dataKey="visitors" background />
                <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                            <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-4xl font-bold">
                              {radialChartData[0].visitors.toLocaleString()}
                            </tspan>
                            <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                              Visitors
                            </tspan>
                          </text>
                        )
                      }
                      return null
                    }}
                  />
                </PolarRadiusAxis>
              </RadialBarChart>
            </ResponsiveContainer>
          </CardContent>
          <CardFooter className="flex-col gap-2 text-sm">
            {/* <div className="flex items-center gap-2 leading-none font-medium">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div> */}
            <div className="text-muted-foreground leading-none">
              Showing total visitors for selected range
            </div>
          </CardFooter>
        </Card>

        {/* Total Users Radial Chart */}
        <Card className="flex flex-col">
          <CardHeader className="items-center pb-0">
            <CardTitle>Total Users</CardTitle>
            <CardDescription>All registered users</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ResponsiveContainer width="100%" height={250}>
              <RadialBarChart
                data={userRadialChartData}
                endAngle={100}
                innerRadius={80}
                outerRadius={140}
              >
                <PolarGrid gridType="circle" radialLines={false} stroke="none" polarRadius={[86, 74]} />
                <RadialBar dataKey="value" background />
                <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                            <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-4xl font-bold">
                              {userRadialChartData[0].value.toLocaleString()}
                            </tspan>
                            <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                              Users
                            </tspan>
                          </text>
                        )
                      }
                      return null
                    }}
                  />
                </PolarRadiusAxis>
              </RadialBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

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
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Logins Line Chart */}
        <Card>
          <CardHeader>
            <CardTitle> User Logins</CardTitle>
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
        </Card>

        {/* Top Users */}
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
      </div>
    </div>
  )
}
