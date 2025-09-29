"use client"

// import { auth } from "@clerk/nextjs/server";
// import { redirect } from "next/navigation";
import { motion } from "framer-motion";
import { Sidebar } from "@/app/components/Sidebar";
import { DashboardHeader } from "@/app/components/Header";
import { AgentOverview } from "@/app/components/Agent";
import { ActiveConversations } from "@/app/components/ActiveCoversations";
import { WorkspaceStats } from "@/app/components/Workspace";
import { RecentActivity } from "@/app/components/RecentActivity";
import { MemoryInsights } from "@/app/components/MemoryInsights";
import { TeamCollaboration } from "@/app/components/TeamCollaboration";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.6, 
      staggerChildren: 0.1 
    } 
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Dashboard() {
    // const  userId  = auth();
    // if (!userId) {
    //   redirect("/sign-in");
    // }
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <DashboardHeader />
        
        {/* Dashboard Content */}
        <main className="flex-1 p-6 space-y-6 overflow-auto">
          <motion.div
            className="space-y-6"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {/* Welcome Section */}
            <motion.div variants={itemVariants}>
              <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back!</h1>
              <p className="text-muted-foreground">
                Monitor your AI agents, track conversations, and manage your workspace.
              </p>
            </motion.div>

            {/* Top Stats Row */}
            <motion.div variants={itemVariants}>
              <WorkspaceStats />
            </motion.div>

            {/* Agent Overview */}
            <motion.div variants={itemVariants}>
              <AgentOverview />
            </motion.div>

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - 2/3 width */}
              <div className="lg:col-span-2 space-y-6">
                <motion.div variants={itemVariants}>
                  <ActiveConversations />
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <RecentActivity />
                </motion.div>
              </div>

              {/* Right Column - 1/3 width */}
              <div className="space-y-6">
                <motion.div variants={itemVariants}>
                  <MemoryInsights />
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <TeamCollaboration />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
