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

  const TOAST_DURATION = 1500

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
      setToastMessage(result.data?.message || "Berhasil masuk")
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
          ? "Gagal masuk, silakan coba lagi."
          : generalError || "Terjadi kesalahan, silakan coba lagi."

      setToastTitle("Error")
      setToastMessage(message)
      setToastVariant("error")

      setShowToast(false)
      setTimeout(() => setShowToast(true), 10)
    }
  }

  return (
    <>
      <div className="w-full max-w-md space-y-8 md:space-y-12 px-4 md:px-0">
        <div className="space-y-2 text-center">
          <h1 className="font-semibold text-2xl md:text-3xl lg:text-4xl">Selamat Datang Kembali</h1>
          <h6 className="text-secondary text-sm md:text-base">
            Masukkan email dan kata sandi untuk mengakses akun Anda.
          </h6>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 w-full">
          <div>
            <Input
              name="email"
              label="Email"
              type="email"
              placeholder="Masukkan email Anda"
              required
            />
            {errors?.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email[0]}</p>
            )}
          </div>

          <div>
            <Input
              name="password"
              label="Kata Sandi"
              type="password"
              placeholder="Masukkan kata sandi Anda"
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
              <span className="text-foreground/80">Ingat saya</span>
            </label>

            <Link
              href="/forgot-password"
              className="text-primary hover:text-primary/80 transition-colors duration-150"
            >
              Lupa kata sandi?
            </Link>
          </div>

          <Button type="submit" color="bg-primary" disabled={loading} className="w-full py-3 text-background cursor-pointer">
            {loading ? "Memproses..." : "Masuk"}
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
