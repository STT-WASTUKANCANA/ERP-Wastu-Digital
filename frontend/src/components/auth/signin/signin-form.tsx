"use client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Toast } from "@/components/ui/toast"
import { useSignin } from "@/hooks/features/auth/use-signin"
import Link from "next/link"
import { useState } from "react"

export default function SigninForm() {
  const router = useRouter()
  const { loading, errors, generalError, success, signin } = useSignin()

  const [showToast, setShowToast] = useState(false)
  const [toastTitle, setToastTitle] = useState("")
  const [toastMessage, setToastMessage] = useState("")
  const [toastVariant, setToastVariant] = useState<"success" | "error">("success")

  const TOAST_DURATION = 3000

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const result = await signin({
      email: formData.get("email"),
      password: formData.get("password"),
    })

    const hasFieldErrors = result.data?.errors && Object.keys(result.data.errors).length > 0

    if (result.ok) {
      setToastTitle("Success")
      setToastMessage(result.data?.message || "Sign in successfully")
      setToastVariant("success")

      setShowToast(false)
      setTimeout(() => setShowToast(true), 10)

      setTimeout(() => {
        router.push("/workspace/overview")
      }, TOAST_DURATION)
    } else {
      const message =
        result.data?.error?.toLowerCase().includes("unauthorized") ||
        result.data?.message?.toLowerCase().includes("unauthorized")
          ? "Signin failed, please try again"
          : generalError || "Something went wrong"

      setToastTitle("Error")
      setToastMessage(message)
      setToastVariant("error")

      setShowToast(false)
      setTimeout(() => setShowToast(true), 10)
    }
  }

  return (
    <>
      <div className="space-y-12">
        <div className="space-y-2 text-center">
          <h1 className="font-semibold">Welcome Back</h1>
          <h6 className="text-secondary">
            Enter your email and password to access your account.
          </h6>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 w-[430px]">
          <div>
            <Input
              name="email"
              label="Email"
              type="email"
              placeholder="Enter your email"
              required
            />
            {errors?.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email[0]}</p>
            )}
          </div>

          <div>
            <Input
              name="password"
              label="Password"
              type="password"
              placeholder="Enter your password"
              required
            />
            {errors?.password && (
              <p className="text-sm text-red-500 mt-1">{errors.password[0]}</p>
            )}
          </div>

          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary/20"
              />
              <span className="text-foreground/80">Remember me</span>
            </label>

            <Link
              href="/forgot-password"
              className="text-primary hover:text-primary/80 transition-colors duration-150"
            >
              Forgot password?
            </Link>
          </div>

          <Button type="submit" color="bg-primary" disabled={loading} className="w-full py-3 text-background cursor-pointer">
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </div>

      {showToast && (
        <Toast
          title={toastTitle}
          message={toastMessage}
          variant={toastVariant}
          duration={TOAST_DURATION}
          showProgress={toastVariant === "success"}
        />
      )}
    </>
  )
}
