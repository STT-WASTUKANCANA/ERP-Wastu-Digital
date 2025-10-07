import Image from "next/image"
import { PatternLogo } from "@/components/ui/pattern"

export default function AuthLeftBanner() {
  return (
    <div className="relative w-[50%] bg-primary rounded-2xl flex justify-center items-center overflow-hidden p-16">
      <PatternLogo className="opacity-50" style={{ top: '-50px', left: '-60px', transform: 'rotate(-25deg) scale(0.8)' }} />
      <PatternLogo className="opacity-75" style={{ top: '10%', right: '-40px', transform: 'rotate(15deg) scale(1.2)' }} />
      <PatternLogo className="opacity-60" style={{ bottom: '20%', left: '30%', transform: 'rotate(5deg)' }} />
      <PatternLogo className="opacity-50" style={{ bottom: '-80px', right: '10%', transform: 'rotate(-10deg) scale(1.1)' }} />
      <PatternLogo className="opacity-40" style={{ top: '40%', left: '-90px', transform: 'rotate(20deg)' }} />

      <div className="z-10 space-y-8">
        <div className="space-y-4">
          <h1 className="text-background font-semibold">
            Efficiently manage campus operations and resources.
          </h1>
          <h6 className="text-background/60">
            Sign in to access the Campus ERP dashboard and streamline lecturer, staff, and administrative activities.
          </h6>
        </div>
        <Image
          src="/images/image-not-found.png"
          alt="Image Not Found"
          width={0}
          height={400}
          sizes="100vw"
          className="w-[80%] h-auto rounded-lg"
        />
      </div>
    </div>
  )
}
