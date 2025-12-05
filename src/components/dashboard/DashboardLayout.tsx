'use client'

import { useState, useEffect } from 'react'
import DashboardSidebar from './DashboardSidebar'
import DashboardHeader from './DashboardHeader'
import FloatingActions from './FloatingActions'

interface DashboardLayoutProps {
    children: React.ReactNode
    onExportPDF?: () => void
    isGeneratingPDF?: boolean
}

export default function DashboardLayout({ children, onExportPDF, isGeneratingPDF }: DashboardLayoutProps) {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    // Close mobile menu on window resize to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768 && isMobileMenuOpen) {
                setIsMobileMenuOpen(false)
            }
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [isMobileMenuOpen])

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">

            {/* Desktop Sidebar */}
            <div className="hidden md:block">
                <DashboardSidebar
                    isCollapsed={isSidebarCollapsed}
                    onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                />
            </div>

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/50 z-40 md:hidden"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />

                    {/* Sidebar */}
                    <div className="fixed inset-y-0 left-0 z-50 md:hidden">
                        <DashboardSidebar
                            isCollapsed={false}
                            onToggle={() => setIsMobileMenuOpen(false)}
                        />
                    </div>
                </>
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <DashboardHeader
                    onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    showMenuButton={true}
                    onExportPDF={onExportPDF}
                    isGeneratingPDF={isGeneratingPDF}
                />

                <main className="flex-1 overflow-y-auto bg-gradient-to-br from-pink-50 via-purple-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                    <div className="max-w-7xl mx-auto p-4 md:p-6">
                        {children}
                    </div>
                </main>

                {/* Floating Action Button */}
                <FloatingActions />
            </div>
        </div>
    )
}
