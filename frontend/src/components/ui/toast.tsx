// Toast.tsx
"use client"
import React, { useEffect, useState } from "react"
import { FaCheckCircle, FaTimesCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from "react-icons/fa"

type ToastVariant = "success" | "error" | "warning" | "info"

interface ToastProps {
        variant?: ToastVariant
        title: string
        message: string
        duration?: number
        showProgress?: boolean
}

export const Toast: React.FC<ToastProps> = ({
        variant = "success",
        title,
        message,
        duration,
        showProgress = false,
}) => {
        const [visible, setVisible] = useState(true)
        const [progress, setProgress] = useState(100)

        const variantStyles = {
                success: { icon: <FaCheckCircle className="text-success" />, gradient: "from-success/10 to-background" },
                error: { icon: <FaTimesCircle className="text-red-500" />, gradient: "from-danger/10 to-background" },
                warning: { icon: <FaExclamationCircle className="text-yellow-500" />, gradient: "from-warning/10 to-background" },
                info: { icon: <FaInfoCircle className="text-electric" />, gradient: "from-electric/10 to-background" },
        }[variant]

        useEffect(() => {
                if (showProgress && duration && isFinite(duration)) {
                        const interval = setInterval(() => {
                                setProgress((prev) => (prev > 0 ? prev - 1 : 0))
                        }, duration / 100)
                        return () => clearInterval(interval)
                }
        }, [showProgress, duration])

        useEffect(() => {
                if (duration && isFinite(duration)) {
                        const timer = setTimeout(() => setVisible(false), duration)
                        return () => clearTimeout(timer)
                }
        }, [duration])

        if (!visible) return null

        return (
                <div className={`fixed top-5 right-4 w-[400px] rounded-xl bg-gradient-to-r ${variantStyles.gradient} shadow-2xl border border-secondary/10 overflow-hidden`}>
                        <div className="flex items-start justify-between gap-3 p-6">
                                <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 flex items-center justify-center">{variantStyles.icon}</div>
                                        <div className="leading-tight">
                                                <span className="font-semibold text-foreground block">{title}</span>
                                                <span className="text-sm text-secondary">{message}</span>
                                        </div>
                                </div>

                                {!showProgress && (
                                        <button onClick={() => setVisible(false)} className="text-secondary hover:text-foreground transition-colors duration-150">
                                                <FaTimes className="w-4 h-4" />
                                        </button>
                                )}
                        </div>

                        {showProgress && (
                                <div className="w-full h-1 bg-secondary/10">
                                        <div
                                                className={`h-1 transition-all duration-100 ease-linear ${variant === "error" ? "bg-red-500" :
                                                                variant === "warning" ? "bg-yellow-500" :
                                                                        variant === "info" ? "bg-electric" :
                                                                                "bg-success"
                                                        }`}
                                                style={{ width: `${progress}%` }}
                                        ></div>
                                </div>
                        )}
                </div>
        )
}
