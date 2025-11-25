"use client";

import { useState, type ReactNode } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { cn } from '@/lib/utils';
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

export default function AppLayout({ children }: { children: ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const isMobile = useIsMobile();

    if (isMobile) {
        return (
             <>
                <Header onMenuClick={() => setIsSidebarOpen(true)} />
                <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                    <SheetContent side="left" className="p-0 w-72">
                        <SheetHeader>
                          <SheetTitle>
                            <VisuallyHidden>Navigation Menu</VisuallyHidden>
                          </SheetTitle>
                        </SheetHeader>
                        <Sidebar isExpanded={true} setExpanded={setIsSidebarOpen} />
                    </SheetContent>
                </Sheet>
                <main className="flex-1 p-4 md:p-6 lg:p-8 mt-14 bg-background">
                    {children}
                </main>
            </>
        )
    }

    return (
        <div className="flex min-h-screen w-full">
            <Sidebar isExpanded={isSidebarOpen} setExpanded={setIsSidebarOpen} />
            <div className={cn("flex flex-1 flex-col transition-all duration-300", isSidebarOpen ? 'sm:ml-64' : 'sm:ml-20')}>
                <Header />
                <main className="flex-1 bg-background p-4 md:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
