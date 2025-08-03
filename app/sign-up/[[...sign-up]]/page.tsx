import { SignUp } from '@clerk/nextjs';

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Join StarkTol
          </h1>
          <p className="text-gray-600">
            Create your account and start shopping
          </p>
        </div>
        <SignUp 
          appearance={{
            baseTheme: undefined,
            variables: {
              colorPrimary: '#ea580c',
              colorText: '#1f2937',
            },
            elements: {
              formButtonPrimary: 'bg-orange-600 hover:bg-orange-700',
              card: 'shadow-lg border-0',
              headerTitle: 'hidden',
              headerSubtitle: 'hidden',
            },
          }}
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
          redirectUrl="/"
        />
      </div>
    </div>
  );
}
