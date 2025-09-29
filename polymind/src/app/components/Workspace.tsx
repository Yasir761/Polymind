"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Bot, 
  MessageSquare, 
  Users, 
  Clock,
  Brain,
  Activity
} from "lucide-react";

const stats = [
  {
    title: "Active Agents",
    value: "3",
    change: "+2",
    changeType: "positive",
    icon: Bot,
    color: "from-blue-500 to-cyan-500"
  },
  {
    title: "Conversations",
    value: "127",
    change: "+23",
    changeType: "positive", 
    icon: MessageSquare,
    color: "from-purple-500 to-pink-500"
  },
  {
    title: "Team Members",
    value: "8",
    change: "+1",
    changeType: "positive",
    icon: Users,
    color: "from-green-500 to-emerald-500"
  },
  {
    title: "Memory Items",
    value: "1,247",
    change: "+89",
    changeType: "positive",
    icon: Brain,
    color: "from-orange-500 to-red-500"
  },
  {
    title: "Response Time",
    value: "1.2s",
    change: "-0.3s",
    changeType: "positive",
    icon: Clock,
    color: "from-indigo-500 to-purple-500"
  },
  {
    title: "System Health",
    value: "99.2%",
    change: "+0.1%",
    changeType: "positive",
    icon: Activity,
    color: "from-teal-500 to-green-500"
  }
];

export function WorkspaceStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.02, y: -2 }}
        >
          <Card className="relative overflow-hidden">
            <CardContent className="p-6">
              {/* Background Gradient */}
              <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${stat.color} opacity-10 rounded-full blur-lg`}></div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      stat.changeType === 'positive' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' 
                        : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
