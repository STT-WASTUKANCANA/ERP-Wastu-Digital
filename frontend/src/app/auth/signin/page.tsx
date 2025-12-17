import AuthLeftBanner from "@/components/auth/signin/auth-left-banner";
import SigninForm from "@/components/auth/signin/signin-form";


export default function SigninPage() {
  return (
    <div className="p-4 md:p-8 flex flex-col lg:flex-row justify-center items-center lg:items-stretch lg:justify-between min-h-screen gap-4 lg:gap-6">
      <AuthLeftBanner />
      <div className="w-full lg:w-1/2 flex justify-center items-center">
        <SigninForm />
      </div>
    </div>
  )
}
