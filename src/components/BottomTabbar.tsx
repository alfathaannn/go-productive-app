import React, { useRef, useState } from 'react'
import { Home, Search, Wallet, User } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '@/lib/utils'

const tabs = [
  { id: '/', label: 'Beranda', icon: Home },
  { id: '/search', label: 'Pencarian', icon: Search },
  { id: '/finance', label: 'Keuangan', icon: Wallet },
  { id: '/profile', label: 'Profil', icon: User },
]

export default function BottomTabbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const currentPath = location.pathname

  const containerRef = useRef<HTMLDivElement>(null)
  const [hoveredTab, setHoveredTab] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [optimisticPath, setOptimisticPath] = useState<string | null>(null)
  const [prevPath, setPrevPath] = useState(currentPath)

  // Clear optimistic path when actual path changes
  if (currentPath !== prevPath) {
    setPrevPath(currentPath)
    setOptimisticPath(null)
  }

  // Use the optimistic path if navigating, dragged hovered tab if scrubbing, otherwise actual path
  const activeTabId = optimisticPath || (isDragging ? (hoveredTab || currentPath) : currentPath)

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true)
    e.currentTarget.setPointerCapture(e.pointerId)
    handlePointerMove(e)
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    if (!isDragging && e.type !== 'pointerdown') return
    
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    
    // Clamp the x coordinate to ensure it stays within the container bounds
    const clampedX = Math.max(0, Math.min(x, rect.width - 1))
    const segmentWidth = rect.width / tabs.length
    const index = Math.floor(clampedX / segmentWidth)
    
    const targetTab = tabs[index]?.id
    if (targetTab && targetTab !== hoveredTab) {
      setHoveredTab(targetTab)
    }
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return
    setIsDragging(false)
    e.currentTarget.releasePointerCapture(e.pointerId)
    
    if (hoveredTab && hoveredTab !== currentPath) {
      setOptimisticPath(hoveredTab)
      navigate(hoveredTab)
    }
    setHoveredTab(null)
  }

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-32px)] max-w-[408px] z-50">
      <div 
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{ touchAction: 'none' }} // Prevent scrolling while scrubbing
        className="relative flex items-center justify-between w-full p-1.5 bg-primary/95 backdrop-blur-xl border border-secondary/20 shadow-[0_8px_30px_rgba(27,73,101,0.3)] rounded-full select-none"
      >
        {tabs.map((tab) => {
          const isActive = activeTabId === tab.id
          const Icon = tab.icon
          
          return (
            <div
              key={tab.id}
              className={cn(
                "relative flex flex-col items-center justify-center w-full h-14 rounded-full transition-colors duration-300 z-10 group cursor-pointer",
                isActive ? "text-primary-foreground" : "text-primary-foreground/50 hover:text-primary-foreground/80"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="active-tab-indicator"
                  className="absolute inset-0 bg-secondary/30 border border-secondary/40 rounded-full shadow-sm"
                  transition={{ type: "spring", stiffness: 350, damping: 35 }}
                />
              )}
              
              <motion.div 
                className="relative z-10 flex flex-col items-center justify-center h-full w-full pointer-events-none"
                animate={{ scale: isActive ? 1 : 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              >
                <motion.div
                  animate={{ y: isActive ? -6 : 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className="flex items-center justify-center"
                >
                  <Icon 
                    strokeWidth={isActive ? 2.5 : 2} 
                    className="w-6 h-6 drop-shadow-sm transition-all duration-300" 
                  />
                </motion.div>
                
                <AnimatePresence>
                  {isActive && (
                    <motion.span
                      initial={{ opacity: 0, y: 5, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 5, scale: 0.9 }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      className="absolute bottom-1.5 text-[11px] font-bold tracking-wide"
                    >
                      {tab.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
