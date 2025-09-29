"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  
  Database, 
  Search,
  Tag,
 
  
  Clock,
  BarChart3
} from "lucide-react";

const memoryStats = [
  {
    label: "Total Memories",
    value: "1,247",
    change: "+89",
    changeType: "positive"
  },
  {
    label: "Knowledge Graphs",
    value: "23",
    change: "+3",
    changeType: "positive"
  },
  {
    label: "Context Links",
    value: "5,432",
    change: "+234",
    changeType: "positive"
  },
  {
    label: "Retrieval Accuracy",
    value: "94.2%",
    change: "+2.1%",
    changeType: "positive"
  }
];

const topCategories = [
  { name: "Product Development", count: 342, percentage: 27, color: "bg-blue-500" },
  { name: "Customer Support", count: 198, percentage: 16, color: "bg-green-500" },
  { name: "Marketing", count: 156, percentage: 13, color: "bg-purple-500" },
  { name: "Sales", count: 143, percentage: 11, color: "bg-orange-500" },
  { name: "Engineering", count: 128, percentage: 10, color: "bg-cyan-500" },
  { name: "Other", count: 280, percentage: 23, color: "bg-gray-500" }
];

const recentQueries = [
  {
    query: "Customer feedback on new features",
    results: 23,
    accuracy: 96,
    timestamp: "2 min ago"
  },
  {
    query: "Q3 revenue analysis insights",
    results: 15,
    accuracy: 94,
    timestamp: "8 min ago"
  },
  {
    query: "Team collaboration best practices",
    results: 31,
    accuracy: 98,
    timestamp: "15 min ago"
  },
  {
    query: "API documentation updates",
    results: 12,
    accuracy: 92,
    timestamp: "23 min ago"
  }
];

export function MemoryInsights() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center">
          <Brain className="w-5 h-5 mr-2" />
          Memory Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {memoryStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="p-3 bg-muted/30 rounded-lg"
            >
              <div className="text-xs text-muted-foreground mb-1">{stat.label}</div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-foreground">{stat.value}</span>
                <Badge variant="outline" className="text-xs text-green-600 border-green-200 bg-green-50 dark:text-green-400 dark:border-green-800 dark:bg-green-900/20">
                  {stat.change}
                </Badge>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Knowledge Categories */}
        <div>
          <h4 className="text-sm font-medium text-foreground mb-3 flex items-center">
            <Tag className="w-4 h-4 mr-2" />
            Knowledge Categories
          </h4>
          <div className="space-y-3">
            {topCategories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-3 flex-1">
                  <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                  <span className="text-sm text-foreground">{category.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-muted-foreground">{category.count}</span>
                  <div className="w-16">
                    <Progress value={category.percentage} className="h-2" />
                  </div>
                  <span className="text-xs text-muted-foreground w-8">{category.percentage}%</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent Queries */}
        <div>
          <h4 className="text-sm font-medium text-foreground mb-3 flex items-center">
            <Search className="w-4 h-4 mr-2" />
            Recent Queries
          </h4>
          <div className="space-y-3">
            {recentQueries.map((query, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-3 border border-border rounded-lg hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <p className="text-sm text-foreground font-medium">{query.query}</p>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="w-3 h-3 mr-1" />
                    {query.timestamp}
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{query.results} results found</span>
                  <div className="flex items-center space-x-2">
                    <span>Accuracy:</span>
                    <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 dark:text-green-400 dark:border-green-800 dark:bg-green-900/20">
                      {query.accuracy}%
                    </Badge>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="flex-1">
            <Database className="w-4 h-4 mr-2" />
            Manage
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
