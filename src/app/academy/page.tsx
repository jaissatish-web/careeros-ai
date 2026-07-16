import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { BookOpen, FileText, Users, ShieldCheck, Briefcase, MapPin, Award, ChevronRight } from 'lucide-react'
import Link from 'next/link'

const CATEGORIES = [
  { id: 'visa', label: 'Visa Guides', icon: ShieldCheck, description: 'Work permits, residency, and immigration processes for Gulf countries' },
  { id: 'labor-law', label: 'Labor Laws', icon: FileText, description: 'Employment rights, working hours, and regulations by country' },
  { id: 'culture', label: 'Work Culture', icon: Users, description: 'Gulf business etiquette, customs, and cultural adaptation' },
  { id: 'salary', label: 'Salary Guides', icon: Briefcase, description: 'Compensation benchmarks for Engineering, Tech, Oil & Gas' },
  { id: 'interview', label: 'Interview Guides', icon: Award, description: 'Country-specific interview preparation for Gulf employers' },
  { id: 'tax', label: 'Tax Information', icon: FileText, description: 'Tax obligations for expatriates in the Gulf region' },
]

const GULF_COUNTRIES = [
  { code: 'sa', name: 'Saudi Arabia', flag: '🇸🇦', articleCount: 42 },
  { code: 'ae', name: 'UAE', flag: '🇦🇪', articleCount: 38 },
  { code: 'qa', name: 'Qatar', flag: '🇶🇦', articleCount: 24 },
  { code: 'kw', name: 'Kuwait', flag: '🇰🇼', articleCount: 18 },
  { code: 'bh', name: 'Bahrain', flag: '🇧🇭', articleCount: 12 },
  { code: 'om', name: 'Oman', flag: '🇴🇲', articleCount: 15 },
]

export default function CareerAcademyPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-24 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm text-blue-400 mb-6">
              <BookOpen className="w-4 h-4" /> Gulf Career Academy
            </div>
            <h1 className="text-4xl md:text-6xl font-bold font-heading mb-4">
              Master the Gulf Job Market
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Comprehensive guides for visas, labor laws, culture, salaries, and interviews across Saudi Arabia, UAE, Qatar, Kuwait, Bahrain, and Oman.
            </p>
          </div>

          {/* Country Selector */}
          <div className="glass-card rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-heading font-semibold mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-400" /> Select Your Target Country
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {GULF_COUNTRIES.map((country) => (
                <Link
                  key={country.code}
                  href={`/academy/${country.code}`}
                  className="flex flex-col items-center p-4 rounded-xl glass hover:bg-white/10 transition-all text-center"
                >
                  <span className="text-2xl mb-2">{country.flag}</span>
                  <span className="text-sm font-medium">{country.name}</span>
                  <span className="text-xs text-gray-500">{country.articleCount} guides</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CATEGORIES.map((category) => (
              <Link
                key={category.id}
                href={`/academy/${category.id}`}
                className="glass-card rounded-2xl p-6 hover:translate-y-[-2px] transition-all block"
              >
                <category.icon className="w-8 h-8 text-blue-400 mb-4" />
                <h3 className="text-lg font-heading font-semibold mb-2">{category.label}</h3>
                <p className="text-sm text-gray-400 mb-4">{category.description}</p>
                <div className="flex items-center text-sm text-blue-400">
                  Explore articles
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </Link>
            ))}
          </div>

          {/* Popular Resources */}
          <div className="mt-12">
            <h2 className="text-2xl font-heading font-semibold mb-6">Popular Resources</h2>
            <div className="glass-card rounded-2xl p-6">
              <ul className="space-y-4">
                <li className="flex items-start gap-3 pb-4 border-b border-white/5">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <Link href="/academy/saudi-visa-nitaqat" className="text-sm font-medium text-white hover:text-blue-400">
                      Saudi Arabia Nitaqat System Explained
                    </Link>
                    <p className="text-xs text-gray-500 mt-1">Understanding visa quotas and requirements for expat workers</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 pb-4 border-b border-white/5">
                  <Briefcase className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <Link href="/academy/uae-salary-2025" className="text-sm font-medium text-white hover:text-blue-400">
                      UAE Salary Benchmarks 2025
                    </Link>
                    <p className="text-xs text-gray-500 mt-1">Tech, Engineering, and Oil & Gas compensation by level</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 pb-4 border-b border-white/5">
                  <Award className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <Link href="/academy/qatar-interview-guide" className="text-sm font-medium text-white hover:text-blue-400">
                      Qatar Interview Guide for Expats
                    </Link>
                    <p className="text-xs text-gray-500 mt-1">Questions, expectations, and cultural fit assessment</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <Link href="/academy/gulf-labor-law-summary" className="text-sm font-medium text-white hover:text-blue-400">
                      Gulf Labor Laws at a Glance
                    </Link>
                    <p className="text-xs text-gray-500 mt-1">Working hours, leave, and end-of-service benefits</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}