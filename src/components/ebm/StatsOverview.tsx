import React from "react";
import { Card, CardBody } from "@heroui/react";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Calendar, CheckCircle2, TrendingUp, Users } from "lucide-react";
import { type DashboardStats } from "../../types/ebm";

interface StatsProps {
  data: DashboardStats;
}

const StatCard = ({
  title,
  value,
  sub,
  icon: Icon,
  color,
  //  trend
}: any) => (
  <Card className="border border-gray-200 dark:border-white/5 bg-white dark:bg-white/1 shadow-sm rounded-lg">
    <CardBody className="p-4">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            {title}
          </p>
          <h3 className="text-2xl font-black text-gray-900 dark:text-white mt-1">
            {value}
          </h3>
          {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
        </div>
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon size={20} />
        </div>
      </div>
    </CardBody>
  </Card>
);

export const StatsOverview: React.FC<StatsProps> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Col: Metric Cards */}
      <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard
          title="Pending Approvals"
          value={data.pending_approvals}
          sub={`${data.approved_today} approved today`}
          icon={CheckCircle2}
          color="bg-orange-500/10 text-orange-600"
        />
        <StatCard
          title="Total Approved"
          value={data.total_approved}
          sub="Lifetime approvals"
          icon={TrendingUp}
          color="bg-green-500/10 text-green-600"
        />
        <StatCard
          title="My Events"
          value={data.created_events}
          sub="Active & Past"
          icon={Calendar}
          color="bg-blue-500/10 text-blue-600"
        />
        <StatCard
          title="My Recruitments"
          value={data.my_registrations}
          sub="Directly registered"
          icon={Users}
          color="bg-purple-500/10 text-purple-600"
        />
      </div>

      {/* Right Col: Trend Chart */}
      <Card className="border border-gray-200 dark:border-white/5 shadow-sm bg-white dark:bg-white/1 rounded-lg">
        <CardBody className="p-5">
          <div className="mb-4">
            <h4 className="text-sm font-bold text-gray-700 dark:text-gray-200">
              Approval Activity
            </h4>
            <p className="text-xs text-gray-500">Last 7 Days Performance</p>
          </div>
          <div className="h-[180px] w-full ">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.approval_trend}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#03a1b0" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#03a1b0" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" hide />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#18181b00",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                  itemStyle={{ color: "#fff" }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#03a1b0"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorCount)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
