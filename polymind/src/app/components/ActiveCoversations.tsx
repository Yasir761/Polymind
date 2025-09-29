"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  MessageSquare, 
  MoreHorizontal, 
  ExternalLink,
  Users,
  Bot,
  Clock,
  ArrowRight
} from "lucide-react";

const conversations = [
  {
    id: 1,
    title: "Product Roadmap Discussion",
    participants: [
      { name: "Sarah Chen", avatar: "/avatars/sarah.jpg", initials: "SC" },
      { name: "Research Assistant", avatar: null, initials: "RA", isBot: true }
    ],
    lastMessage: "Can you analyze the market trends for Q4?",
    timestamp: "2 min ago",
    status: "active",
    messageCount: 23,
    agent: "Research Assistant"
  },
  {
    id: 2,
    title: "Code Review Session",
    participants: [
      { name: "Alex Johnson", avatar: "/avatars/alex.jpg", initials: "AJ" },
      { name: "Mike Wilson", avatar: "/avatars/mike.jpg", initials: "MW" },
      { name: "Code Reviewer", avatar: null, initials: "CR", isBot: true }
    ],
    lastMessage: "The implementation looks good, but we should optimize the database queries.",
    timestamp: "5 min ago",
    status: "active",
    messageCount: 47,
    agent: "Code Reviewer"
  },
  {
    id: 3,
    title: "Content Strategy Planning",
    participants: [
      { name: "Emma Davis", avatar: "/avatars/emma.jpg", initials: "ED" },
      { name: "Content Creator", avatar: null, initials: "CC", isBot: true }
    ],
    lastMessage: "I'll generate 5 blog post ideas based on current trends.",
    timestamp: "8 min ago",
    status: "active",
    messageCount: 15,
    agent: "Content Creator"
  },
  {
    id: 4,
    title: "Data Analysis Report",
    participants: [
      { name: "John Smith", avatar: "/avatars/john.jpg", initials: "JS" },
      { name: "Data Analyst", avatar: null, initials: "DA", isBot: true }
    ],
    lastMessage: "The quarterly metrics show a 23% improvement in user engagement.",
    timestamp: "12 min ago",
    status: "waiting",
    messageCount: 8,
    agent: "Data Analyst"
  },
  {
    id: 5,
    title: "UI/UX Design Review",
    participants: [
      { name: "Lisa Park", avatar: "/avatars/lisa.jpg", initials: "LP" },
      { name: "Design Assistant", avatar: null, initials: "DA", isBot: true }
    ],
    lastMessage: "Let me create some wireframe variations for the new dashboard.",
    timestamp: "15 min ago",
    status: "paused",
    messageCount: 31,
    agent: "Design Assistant"
  }
];

export function ActiveConversations() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold flex items-center">
            <MessageSquare className="w-5 h-5 mr-2" />
            Active Conversations
          </CardTitle>
          <Button variant="outline" size="sm">
            View All
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {conversations.map((conversation, index) => (
            <motion.div
              key={conversation.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.01 }}
              className="p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-medium text-foreground">{conversation.title}</h3>
                      <Badge 
                        variant="outline"
                        className={`text-xs ${
                          conversation.status === 'active' 
                            ? 'border-green-200 text-green-700 bg-green-50 dark:border-green-800 dark:text-green-400 dark:bg-green-900/20'
                            : conversation.status === 'waiting'
                            ? 'border-yellow-200 text-yellow-700 bg-yellow-50 dark:border-yellow-800 dark:text-yellow-400 dark:bg-yellow-900/20'
                            : 'border-gray-200 text-gray-700 bg-gray-50 dark:border-gray-800 dark:text-gray-400 dark:bg-gray-900/20'
                        }`}
                      >
                        {conversation.status}
                      </Badge>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Participants */}
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="flex -space-x-2">
                      {conversation.participants.map((participant, idx) => (
                        <div key={idx} className="relative">
                          <Avatar className="w-8 h-8 border-2 border-background">
                            {participant.isBot ? (
                              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs">
                                <Bot className="w-4 h-4" />
                              </AvatarFallback>
                            ) : (
                              <>
                                <AvatarImage src={participant.avatar ?? undefined} />
                                <AvatarFallback className="text-xs">{participant.initials}</AvatarFallback>
                              </>
                            )}
                          </Avatar>
                          {participant.isBot && (
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-background"></div>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <Users className="w-3 h-3" />
                      <span>{conversation.participants.length} participants</span>
                      <span>•</span>
                      <span>{conversation.messageCount} messages</span>
                    </div>
                  </div>

                  {/* Last Message */}
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {conversation.lastMessage}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>{conversation.timestamp}</span>
                      <span>•</span>
                      <Bot className="w-3 h-3" />
                      <span>{conversation.agent}</span>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 text-xs">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Join
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
