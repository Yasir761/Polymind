"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Activity, 
  Bot, 
  MessageSquare, 
  Users, 
  Settings, 
  Database,
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";

const activities = [
  {
    id: 1,
    type: "agent_created",
    title: "New AI Agent Created",
    description: "Research Assistant v2.0 was successfully deployed",
    user: { name: "Sarah Chen", initials: "SC", avatar: "/avatars/sarah.jpg" },
    timestamp: "2 minutes ago",
    icon: Bot,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10"
  },
  {
    id: 2,
    type: "conversation_started",
    title: "New Conversation Started",
    description: "Code Review Session with 3 participants",
    user: { name: "Alex Johnson", initials: "AJ", avatar: "/avatars/alex.jpg" },
    timestamp: "5 minutes ago",
    icon: MessageSquare,
    color: "text-green-500",
    bgColor: "bg-green-500/10"
  },
  {
    id: 3,
    type: "system_update",
    title: "System Performance Optimized",
    description: "Response time improved by 23% across all agents",
    user: { name: "System", initials: "SY", avatar: null, isSystem: true },
    timestamp: "12 minutes ago",
    icon: Zap,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10"
  },
  {
    id: 4,
    type: "user_joined",
    title: "Team Member Added",
    description: "Emma Davis joined the workspace",
    user: { name: "John Smith", initials: "JS", avatar: "/avatars/john.jpg" },
    timestamp: "1 hour ago",
    icon: Users,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10"
  },
  {
    id: 5,
    type: "memory_updated",
    title: "Knowledge Base Updated",
    description: "127 new entries added to memory system",
    user: { name: "Data Analyst", initials: "DA", avatar: null, isBot: true },
    timestamp: "2 hours ago",
    icon: Database,
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10"
  },
  {
    id: 6,
    type: "settings_changed",
    title: "Security Settings Updated",
    description: "Two-factor authentication enabled for all users",
    user: { name: "Mike Wilson", initials: "MW", avatar: "/avatars/mike.jpg" },
    timestamp: "3 hours ago",
    icon: Settings,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10"
  },
  {
    id: 7,
    type: "error_resolved",
    title: "Issue Resolved",
    description: "Memory synchronization error has been fixed",
    user: { name: "System", initials: "SY", avatar: null, isSystem: true },
    timestamp: "4 hours ago",
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-600/10"
  },
  {
    id: 8,
    type: "warning",
    title: "Performance Alert",
    description: "Agent response time increased by 15% - investigating",
    user: { name: "System", initials: "SY", avatar: null, isSystem: true },
    timestamp: "6 hours ago",
    icon: AlertTriangle,
    color: "text-red-500",
    bgColor: "bg-red-500/10"
  }
];

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center">
          <Activity className="w-5 h-5 mr-2" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-start space-x-4 p-3 rounded-lg hover:bg-muted/30 transition-colors"
            >
              {/* Icon */}
              <div className={`w-10 h-10 rounded-full ${activity.bgColor} flex items-center justify-center flex-shrink-0`}>
                <activity.icon className={`w-5 h-5 ${activity.color}`} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-medium text-foreground">{activity.title}</h4>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="w-3 h-3 mr-1" />
                    {activity.timestamp}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{activity.description}</p>
                
                {/* User Info */}
                <div className="flex items-center space-x-2">
                  <Avatar className="w-6 h-6">
                    {activity.user.isSystem ? (
                      <AvatarFallback className="bg-gradient-to-r from-gray-500 to-gray-600 text-white text-xs">
                        <Settings className="w-3 h-3" />
                      </AvatarFallback>
                    ) : activity.user.isBot ? (
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs">
                        <Bot className="w-3 h-3" />
                      </AvatarFallback>
                    ) : (
                      <>
                        {activity.user.avatar ? (
                          <AvatarImage src={activity.user.avatar} />
                        ) : null}
                        <AvatarFallback className="text-xs">{activity.user.initials}</AvatarFallback>
                      </>
                    )}
                  </Avatar>
                  <span className="text-xs text-muted-foreground">by {activity.user.name}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
