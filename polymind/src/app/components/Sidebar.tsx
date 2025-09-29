"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  Bot, 
  MessageSquare, 
  Users, 
  Brain, 
  Settings, 
  BarChart3,
  Zap,
  Database,
  Shield,
  LogOut
} from "lucide-react";
import { useState } from "react";
import { useClerk, useUser } from "@clerk/nextjs";

import Link from "next/link";

const navigationItems = [
  { icon: Home, label: "Dashboard", href: "/dashboard", badge: null, active: true },
  { icon: Bot, label: "AI Agents", href: "/agents", badge: "3", active: false },
  { icon: MessageSquare, label: "Conversations", href: "/conversations", badge: "12", active: false },
  { icon: Users, label: "Team", href: "/team", badge: null, active: false },
  { icon: Brain, label: "Memory", href: "/memory", badge: null, active: false },
  { icon: BarChart3, label: "Analytics", href: "/analytics", badge: null, active: false },
  { icon: Database, label: "Knowledge", href: "/knowledge", badge: null, active: false },
  { icon: Shield, label: "Security", href: "/security", badge: null, active: false },
];

const sidebarVariants = {
  hidden: { x: -250, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1, 
    transition: { 
      duration: 0.3, 
      staggerChildren: 0.05 
    } 
  },
};

const itemVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: { x: 0, opacity: 1 },
};

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const { signOut } = useClerk();
  const { user } = useUser();
 

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      
      // Sign out with Clerk and redirect to home page
      await signOut({
        redirectUrl: "/"
      });
      
      // Optional: You can also use router.push if you want more control
      // await signOut();
      // router.push("/");
      
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <motion.aside
      className={`bg-muted/30 border-r border-border backdrop-blur-sm transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
      initial="hidden"
      animate="visible"
      variants={sidebarVariants}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <motion.div 
          className="p-6 border-b border-border"
          variants={itemVariants}
        >
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <Link href="/dashboard" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="font-heading text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                  POLYMIND
                </span>
              </Link>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 hover:bg-muted/60"
            >
              <motion.div
                animate={{ rotate: isCollapsed ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="text-muted-foreground"
              >
                →
              </motion.div>
            </Button>
          </div>
        </motion.div>

        {/* User Info (when not collapsed) */}
        {!isCollapsed && user && (
          <motion.div 
            className="p-4 border-b border-border"
            variants={itemVariants}
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-white">
                  {user.firstName?.charAt(0) || user.emailAddresses[0]?.emailAddress.charAt(0) || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {user.firstName || 'User'}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.emailAddresses[0]?.emailAddress}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {navigationItems.map((item) => (
              <motion.div key={item.label} variants={itemVariants}>
                <Link href={item.href}>
                  <Button
                    variant={item.active ? "secondary" : "ghost"}
                    className={`w-full justify-start h-10 transition-all duration-200 ${
                      isCollapsed ? 'px-2' : 'px-3'
                    } ${item.active ? 'bg-primary/10 text-primary hover:bg-primary/15' : 'hover:bg-muted/60'}`}
                  >
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    {!isCollapsed && (
                      <>
                        <span className="ml-3 flex-1 text-left">{item.label}</span>
                        {item.badge && (
                          <Badge variant="secondary" className="ml-2 text-xs bg-primary/20 text-primary">
                            {item.badge}
                          </Badge>
                        )}
                      </>
                    )}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-border space-y-2">
          {/* Settings */}
          <motion.div variants={itemVariants}>
            <Link href="/settings">
              <Button 
                variant="ghost" 
                className={`w-full justify-start hover:bg-muted/60 transition-all duration-200 ${
                  isCollapsed ? 'px-2' : 'px-3'
                }`}
              >
                <Settings className="w-4 h-4" />
                {!isCollapsed && <span className="ml-3">Settings</span>}
              </Button>
            </Link>
          </motion.div>
          
          {/* Logout with Clerk integration */}
          <motion.div variants={itemVariants}>
            <Button 
              variant="ghost" 
              onClick={handleSignOut}
              disabled={isSigningOut}
              className={`w-full justify-start hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400 transition-all duration-200 ${
                isCollapsed ? 'px-2' : 'px-3'
              } ${isSigningOut ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <LogOut className={`w-4 h-4 ${isSigningOut ? 'animate-spin' : ''}`} />
              {!isCollapsed && (
                <span className="ml-3">
                  {isSigningOut ? 'Signing out...' : 'Logout'}
                </span>
              )}
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.aside>
  );
}
