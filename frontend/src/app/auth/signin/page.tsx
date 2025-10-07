import AuthLeftBanner from "@/components/auth/signin/auth-left-banner";
import SigninForm from "@/components/auth/signin/signin-form";


export default function SigninPage() {
  return (
    <div className="p-8 flex justify-between min-h-screen gap-4">
      <AuthLeftBanner />
      <div className="w-[50%] flex justify-center items-center">
        <SigninForm />
      </div>
    </div>
  )
}
