"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Bot, 
  MoreHorizontal, 

  Pause,
  Play,
  Settings
} from "lucide-react";

const agents = [
  {
    id: 1,
    name: "Research Assistant",
    status: "active",
    type: "Research",
    conversations: 45,
    lastActive: "2 min ago",
    performance: 98,
    avatar: "🔍"
  },
  {
    id: 2,
    name: "Code Reviewer",
    status: "active", 
    type: "Development",
    conversations: 23,
    lastActive: "5 min ago",
    performance: 95,
    avatar: "💻"
  },
  {
    id: 3,
    name: "Content Creator",
    status: "active",
    type: "Content",
    conversations: 67,
    lastActive: "1 min ago",
    performance: 97,
    avatar: "✍️"
  },
  {
    id: 4,
    name: "Data Analyst",
    status: "idle",
    type: "Analytics",
    conversations: 12,
    lastActive: "1 hour ago",
    performance: 92,
    avatar: "📊"
  }
];

export function AgentOverview() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">AI Agent Overview</CardTitle>
          <Button variant="outline" size="sm">
            <Bot className="w-4 h-4 mr-2" />
            Manage Agents
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {agents.map((agent, index) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="relative overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{agent.avatar}</div>
                      <div>
                        <h3 className="font-semibold text-sm">{agent.name}</h3>
                        <Badge 
                          variant="outline" 
                          className={`text-xs mt-1 ${
                            agent.status === 'active' 
                              ? 'border-green-200 text-green-700 bg-green-50 dark:border-green-800 dark:text-green-400 dark:bg-green-900/20'
                              : 'border-yellow-200 text-yellow-700 bg-yellow-50 dark:border-yellow-800 dark:text-yellow-400 dark:bg-yellow-900/20'
                          }`}
                        >
                          <div className={`w-2 h-2 rounded-full mr-1 ${
                            agent.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'
                          }`}></div>
                          {agent.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Conversations:</span>
                      <span className="font-medium">{agent.conversations}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Performance:</span>
                      <span className="font-medium text-green-600">{agent.performance}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Active:</span>
                      <span className="font-medium">{agent.lastActive}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 mt-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 h-8 text-xs"
                      disabled={agent.status === 'idle'}
                    >
                      {agent.status === 'active' ? (
                        <><Pause className="w-3 h-3 mr-1" /> Pause</>
                      ) : (
                        <><Play className="w-3 h-3 mr-1" /> Start</>
                      )}
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                      <Settings className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
