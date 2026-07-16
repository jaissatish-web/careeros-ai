import { signIn } from '@/lib/auth'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Button from '@/components/ui/Button'
import { BrandGithub, ChromeIcon } from 'lucide-react'

export default function SignInPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center pt-24 px-4">
        <div className="glass-card rounded-2xl p-8 max-w-md w-full">
          <h1 className="text-3xl font-bold font-heading text-center mb-2">
            Welcome to <span className="text-[#D4AF37]">CareerOS AI</span>
          </h1>
          <p className="text-gray-400 text-center mb-8">
            Sign in to access your Gulf career dashboard
          </p>
          
          <div className="space-y-4">
            <form
              action={async () => {
                'use server'
                await signIn('google')
              }}
            >
              <Button variant="primary" className="w-full justify-center">
                <ChromeIcon className="w-5 h-5 mr-2" />
                Continue with Google
              </Button>
            </form>
            
            <form
              action={async () => {
                'use server'
                await signIn('github')
              }}
            >
              <Button variant="secondary" className="w-full justify-center">
                <BrandGithub className="w-5 h-5 mr-2" />
                Continue with GitHub
              </Button>
            </form>
          </div>
          
          <div className="mt-8 pt-6 border-t border-white/[0.06]">
            <p className="text-xs text-gray-500 text-center">
              By signing in, you agree to our{' '}
              <a href="/terms" className="text-blue-400 hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" className="text-blue-400 hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}