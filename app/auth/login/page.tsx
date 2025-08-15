import LoginForm from '@/components/auth/LoginForm'
import GoogleSignInButton from '@/components/auth/GoogleSignInButton'

export default function LoginPage() {

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        
        <div className="mt-8 space-y-6">
          <GoogleSignInButton />
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">Or continue with</span>
            </div>
          </div>
          
          <LoginForm />
          
          <div className="text-center">
            <a href="/auth/register" className="text-event-blue hover:opacity-80 transition-all">
              Don't have an account? Sign up
            </a>
          </div>
        </div>
        
      </div>
    </div>
  )
}