import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Users, Building2, FileText, BarChart3, MessageCircle, Calendar, Search, Filter } from 'lucide-react'
import Button from '@/components/ui/Button'

const GULF_COMPANIES = [
  { id: 1, name: 'Saudi Aramco', country: 'sa', industry: 'Oil & Gas', jobs: 127, avgSalary: '$12,000', verified: true },
  { id: 2, name: 'Emirates Group', country: 'ae', industry: 'Aviation', jobs: 84, avgSalary: '$8,500', verified: true },
  { id: 3, name: 'QatarEnergy', country: 'qa', industry: 'Oil & Gas', jobs: 63, avgSalary: '$9,200', verified: true },
  { id: 4, name: 'Kuwait Petroleum', country: 'kw', industry: 'Oil & Gas', jobs: 42, avgSalary: '$7,800', verified: true },
  { id: 5, name: 'National Bank of Bahrain', country: 'bh', industry: 'Finance', jobs: 31, avgSalary: '$6,200', verified: true },
  { id: 6, name: 'PDO Oman', country: 'om', industry: 'Oil & Gas', jobs: 28, avgSalary: '$7,500', verified: true },
]

export default function RecruiterDashboardPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-24 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold font-heading mb-2">
                Recruiter Dashboard
              </h1>
              <p className="text-gray-400">Manage job postings and find qualified Gulf talent</p>
            </div>
            <Button variant="primary" className="mt-4 md:mt-0">
              <Building2 className="w-4 h-4 mr-2" /> Post New Job
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="glass-card rounded-xl p-5">
              <p className="text-3xl font-bold font-heading mb-1">127</p>
              <p className="text-sm text-gray-400">Active Jobs</p>
            </div>
            <div className="glass-card rounded-xl p-5">
              <p className="text-3xl font-bold font-heading mb-1">1,243</p>
              <p className="text-sm text-gray-400">Applications</p>
            </div>
            <div className="glass-card rounded-xl p-5">
              <p className="text-3xl font-bold font-heading mb-1">86%</p>
              <p className="text-sm text-gray-400">Match Rate</p>
            </div>
            <div className="glass-card rounded-xl p-5">
              <p className="text-3xl font-bold font-heading mb-1">$8.4k</p>
              <p className="text-sm text-gray-400">Avg Salary</p>
            </div>
          </div>

          {/* Company Profile Section */}
          <div className="glass-card rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-heading font-semibold mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-400" /> Company Profile
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <p className="text-xs text-gray-500 mb-1">Company Name</p>
                <p className="text-sm font-medium">Your Company</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Country</p>
                <p className="text-sm font-medium">UAE</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Industry</p>
                <p className="text-sm font-medium">Technology</p>
              </div>
            </div>
          </div>

          {/* Gulf Employers */}
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-xl font-heading font-semibold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" /> Gulf Employers on CareerOS AI
            </h2>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  placeholder="Search employers..."
                  className="w-full pl-10 pr-4 py-2 bg-white/[0.03] border border-white/10 rounded-lg text-sm focus:outline-none focus:border-blue-500/50"
                />
              </div>
              <Button variant="secondary" size="sm">
                <Filter className="w-4 h-4 mr-1" /> Filter
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left text-xs text-gray-500 pb-3">Company</th>
                    <th className="text-left text-xs text-gray-500 pb-3">Country</th>
                    <th className="text-left text-xs text-gray-500 pb-3">Industry</th>
                    <th className="text-left text-xs text-gray-500 pb-3">Jobs</th>
                    <th className="text-left text-xs text-gray-500 pb-3">Avg Salary</th>
                    <th className="text-left text-xs text-gray-500 pb-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {GULF_COMPANIES.map((company) => (
                    <tr key={company.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-all">
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white">{company.name}</span>
                          {company.verified && <span className="text-blue-400 text-xs">✓ Verified</span>}
                        </div>
                      </td>
                      <td className="py-4 text-sm text-gray-300">
                        {{ sa: '🇸🇦', ae: '🇦🇪', qa: '🇶🇦', kw: '🇰🇼', bh: '🇧🇭', om: '🇴🇲' }[company.country]}
                      </td>
                      <td className="py-4 text-sm text-gray-300">{company.industry}</td>
                      <td className="py-4 text-sm text-gray-300">{company.jobs}</td>
                      <td className="py-4 text-sm text-gray-300">{company.avgSalary}</td>
                      <td className="py-4">
                        <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}