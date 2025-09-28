import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <header className="h-16 flex items-center justify-between border-b border-border bg-card/50 backdrop-blur-sm px-6">
            <SidebarTrigger className="text-foreground hover:bg-muted rounded-md p-2" />
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                Bienvenido, Juan Pérez
              </div>
            </div>
          </header>

          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}