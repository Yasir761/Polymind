"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, 
  Plus, 
  MoreHorizontal,
  MessageCircle,
  Activity,
  Clock,
  Crown,
  Shield,
  User
} from "lucide-react";
import React from "react";

const teamMembers = [
  {
    id: 1,
    name: "Sarah Chen",
    email: "sarah@polymind.ai",
    role: "Admin",
    status: "online",
    avatar: "/avatars/sarah.jpg",
    initials: "SC",
    lastActive: "now",
    conversations: 15,
    agentsCreated: 3
  },
  {
    id: 2,
    name: "Alex Johnson",
    email: "alex@polymind.ai",
    role: "Developer",
    status: "online",
    avatar: "/avatars/alex.jpg",
    initials: "AJ",
    lastActive: "5 min ago",
    conversations: 23,
    agentsCreated: 2
  },
  {
    id: 3,
    name: "Emma Davis",
    email: "emma@polymind.ai",
    role: "Designer",
    status: "away",
    avatar: "/avatars/emma.jpg",
    initials: "ED",
    lastActive: "1 hour ago",
    conversations: 8,
    agentsCreated: 1
  },
  {
    id: 4,
    name: "Mike Wilson",
    email: "mike@polymind.ai",
    role: "Manager",
    status: "offline",
    avatar: "/avatars/mike.jpg",
    initials: "MW",
    lastActive: "2 hours ago",
    conversations: 12,
    agentsCreated: 0
  },
  {
    id: 5,
    name: "Lisa Park",
    email: "lisa@polymind.ai",
    role: "User",
    status: "online",
    avatar: "/avatars/lisa.jpg",
    initials: "LP",
    lastActive: "just now",
    conversations: 6,
    agentsCreated: 1
  }
] as const;

const getRoleIcon = (role: string) => {
  switch (role) {
    case 'Admin':
      return Crown;
    case 'Manager':
      return Shield;
    default:
      return User;
  }
};

const getRoleColor = (role: string) => {
  switch (role) {
    case 'Admin':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:text-yellow-400 dark:bg-yellow-900/20 dark:border-yellow-800';
    case 'Manager':
      return 'text-purple-600 bg-purple-50 border-purple-200 dark:text-purple-400 dark:bg-purple-900/20 dark:border-purple-800';
    case 'Developer':
      return 'text-blue-600 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-900/20 dark:border-blue-800';
    case 'Designer':
      return 'text-pink-600 bg-pink-50 border-pink-200 dark:text-pink-400 dark:bg-pink-900/20 dark:border-pink-800';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200 dark:text-gray-400 dark:bg-gray-900/20 dark:border-gray-800';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'online':
      return 'bg-green-500';
    case 'away':
      return 'bg-yellow-500';
    case 'offline':
      return 'bg-gray-400';
    default:
      return 'bg-gray-400';
  }
};

export function TeamCollaboration() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Team Collaboration
          </CardTitle>
          <Button variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Invite
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Team Stats */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{teamMembers.length}</div>
              <div className="text-xs text-muted-foreground">Members</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {teamMembers.filter(m => m.status === 'online').length}
              </div>
              <div className="text-xs text-muted-foreground">Online</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {teamMembers.reduce((sum, m) => sum + m.conversations, 0)}
              </div>
              <div className="text-xs text-muted-foreground">Active Chats</div>
            </div>
          </div>

          {/* Team Members List */}
          <div className="space-y-3">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  {/* Avatar with Status */}
                  <div className="relative">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>{member.initials}</AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(member.status)} rounded-full border-2 border-background`}></div>
                  </div>

                  {/* Member Info */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="text-sm font-medium text-foreground">{member.name}</h4>
                      <Badge variant="outline" className={`text-xs ${getRoleColor(member.role)}`}>
                        {getRoleIcon(member.role) && (
                          <span className="inline-block align-middle mr-1">
                            {React.createElement(getRoleIcon(member.role), { className: "w-3 h-3" })}
                          </span>
                        )}
                        {member.role}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="w-3 h-3" />
                        <span>{member.conversations} conversations</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{member.lastActive}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="flex space-x-2 pt-4 border-t border-border">
            <Button variant="outline" size="sm" className="flex-1">
              <Activity className="w-4 h-4 mr-2" />
              Activity
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <Users className="w-4 h-4 mr-2" />
              Manage
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
