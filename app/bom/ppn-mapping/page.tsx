"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { Construction } from "lucide-react"

export default function PpnMappingPage() {
  return (
    <MainLayout>
      <div className="h-full flex flex-col items-center justify-center bg-background">
        <div className="text-center animate-in fade-in zoom-in duration-500">
          <div className="mb-6 flex justify-center">
            <div className="p-6 bg-primary/10 rounded-full">
              <Construction className="h-16 w-16 text-primary" />
            </div>
          </div>
          <h3 className="text-2xl font-semibold text-foreground mb-3">
            PPN Mapping
          </h3>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            This module is currently under construction. Please check back later.
          </p>
          <div className="mt-8 flex justify-center gap-2">
            <div className="w-2 h-2 bg-primary/30 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="w-2 h-2 bg-primary/70 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
