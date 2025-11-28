import { FloatingPetalsBackground } from "@/components/floating-petals-background";

export default function AuthLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <div className="relative flex items-center justify-center min-h-screen">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FDE7EF] via-[#F9D9E7]/50 to-white dark:from-black dark:to-fuchsia-950/30 -z-10" />
        <FloatingPetalsBackground />
        <div className="relative z-10">
          {children}
        </div>
      </div>
    )
  }
  