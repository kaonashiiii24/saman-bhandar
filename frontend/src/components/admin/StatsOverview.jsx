import { Users, Building2, BarChart3, DollarSign } from 'lucide-react'
import StatCard from '../common/StatCard'

export default function StatsOverview({ stats }) {
  const data = stats || { total_users: 0, total_listings: 0, total_bookings: 0, total_revenue: 0 }
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard label="Total Users" value={data.total_users} icon={Users} change="All time" color="blue" delay={0} />
      <StatCard label="Active Listings" value={data.total_listings} icon={Building2} change="All time" color="green" delay={50} />
      <StatCard label="Total Bookings" value={data.total_bookings} icon={BarChart3} change="All time" color="purple" delay={100} />
      <StatCard label="Revenue" value={`Rs ${Number(data.total_revenue).toLocaleString()}`} icon={DollarSign} change="All time" color="orange" delay={150} />
    </div>
  )
}