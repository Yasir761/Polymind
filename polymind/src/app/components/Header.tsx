"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Bell, 
  Plus, 
  User,
  ChevronDown,
  Settings,
  LogOut
} from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { useUser, useClerk } from "@clerk/nextjs";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

export function DashboardHeader() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await signOut({
        redirectUrl: "/"
      });
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsSigningOut(false);
    }
  };

  const getUserInitials = () => {
    if (!user) return 'U';
    if (user.firstName && user.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
    }
    if (user.firstName) {
      return user.firstName.charAt(0);
    }
    if (user.emailAddresses && user.emailAddresses[0]) {
      return user.emailAddresses[0].emailAddress.charAt(0).toUpperCase();
    }
    return 'U';
  };

  const getUserDisplayName = () => {
    if (!user) return 'Loading...';
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user.firstName) {
      return user.firstName;
    }
    if (user.username) {
      return user.username;
    }
    if (user.emailAddresses && user.emailAddresses[0]) {
      return user.emailAddresses[0].emailAddress.split('@')[0];
    }
    return 'User';
  };

  return (
    <motion.header
      className="bg-background/80 backdrop-blur-xl border-b border-border px-6 py-4"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        {/* Left - Search */}
        <div className="flex items-center space-x-4">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search agents, conversations, or commands..."
              className="pl-10 bg-muted/30 border-border focus:ring-2 focus:ring-primary/20 transition-all duration-200"
            />
          </div>
        </div>

        {/* Right - Actions */}
        <div className="flex items-center space-x-4">
          {/* Status Indicator */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-muted-foreground">3 Agents Active</span>
            </div>
          </div>

          {/* New Agent Button */}
          <Button 
            size="sm" 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Agent
          </Button>

          {/* Notifications */}
          <div className="relative">
            <Button 
              variant="ghost" 
              size="sm" 
              className="relative hover:bg-muted/60 transition-all duration-200"
            >
              <Bell className="w-4 h-4" />
              <Badge className="absolute -top-1 -right-1 w-5 h-5 text-xs bg-red-500 hover:bg-red-600 text-white border-0 transition-colors">
                3
              </Badge>
            </Button>
          </div>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Profile Dropdown */}
          {isLoaded ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex items-center space-x-2 hover:bg-muted/60 transition-all duration-200 px-3"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-sm font-semibold text-white">
                      {getUserInitials()}
                    </span>
                  </div>
                  <div className="hidden md:flex items-center space-x-1">
                    <span className="text-sm font-medium">{getUserDisplayName()}</span>
                    <ChevronDown className="w-3 h-3 text-muted-foreground" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent 
                align="end" 
                className="w-56 bg-background/95 backdrop-blur-xl border-border shadow-xl"
              >
                <DropdownMenuLabel className="flex flex-col space-y-1">
                  <span className="text-sm font-medium text-foreground">
                    {getUserDisplayName()}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {user?.emailAddresses?.[0]?.emailAddress}
                  </span>
                </DropdownMenuLabel>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem 
                  onClick={() => router.push('/profile')}
                  className="flex items-center space-x-2 cursor-pointer hover:bg-muted/60 transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                
                <DropdownMenuItem 
                  onClick={() => router.push('/settings')}
                  className="flex items-center space-x-2 cursor-pointer hover:bg-muted/60 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem 
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="flex items-center space-x-2 cursor-pointer text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors focus:bg-red-50 dark:focus:bg-red-950/30"
                >
                  <LogOut className={`w-4 h-4 ${isSigningOut ? 'animate-spin' : ''}`} />
                  <span>{isSigningOut ? 'Signing out...' : 'Logout'}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            // Loading state
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-muted rounded-full animate-pulse"></div>
              <div className="hidden md:block w-20 h-4 bg-muted rounded animate-pulse"></div>
            </div>
          )}
        </div>
      </div>
    </motion.header>
  );
}
