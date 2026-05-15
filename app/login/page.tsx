"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Shield } from "lucide-react"
import { toast } from "sonner"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async () => {
    setIsLoading(true)

    try {
      // Simulate login API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Redirect to home page on success
      router.push("/")
      toast.success("Login successful")
    } catch (err) {
      console.error("Login failed", err)
      toast.error("Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Light Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100">
        {/* Soft Gradient Orbs */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-400/5 rounded-full blur-3xl opacity-60" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary/3 to-blue-400/3 rounded-full blur-3xl" />
        
        {/* Subtle Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      {/* Login Card */}
      <Card className="relative w-full max-w-md rounded-2xl shadow-xl border-border/30 bg-white/90 backdrop-blur-sm">
        <CardHeader className="p-10 pb-6 space-y-6">
          {/* Logo - Same as Sidebar */}
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="Lenovo"
                className="h-8 w-auto object-contain"
              />
              <div className="h-8 w-px bg-border/50" />
              <div className="flex flex-col">
                <span className="text-lg font-bold text-foreground leading-tight">Lenovo</span>
                <span className="text-xs text-muted-foreground leading-tight">Dynamic Part</span>
              </div>
            </div>
          </div>
          
          {/* Title */}
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-center text-foreground">
              Welcome Back
            </h1>
            <CardDescription className="text-center text-sm text-muted-foreground">
              Sign in to access your account
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="px-10 pb-10 space-y-6">
          {/* Login Button */}
          <Button
            onClick={handleLogin}
            className="w-full h-12 rounded-xl transition-all duration-200 text-base font-medium"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Authenticating...
              </>
            ) : (
              <>
                <Shield className="mr-2 h-5 w-5" />
                Login with ITcode
              </>
            )}
          </Button>

          {/* Security Note */}
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Secure authentication via corporate SSO</span>
          </div>

          {/* Help Text */}
          <div className="pt-4 border-t border-border/30">
            <p className="text-xs text-center text-muted-foreground">
              Contact your administrator for access permissions
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Version */}
      <div className="absolute bottom-6 text-xs text-muted-foreground/40">
        v1.0.0
      </div>
    </div>
  )
}
