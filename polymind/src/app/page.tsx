"use client";

import { motion, easeInOut } from "framer-motion";
import { Navbar } from "./components/Navbar";

import { Button } from "@/components/ui/button";
import {  Zap, Play, ArrowRight } from "lucide-react";
import Lottie from "lottie-react";
import { useEffect, useState } from "react";

const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeInOut } },
};

const buttonVariants = {
  hover: { 
    scale: 1.05, 
    boxShadow: "0 20px 40px rgba(59, 130, 246, 0.15)",
    transition: { duration: 0.3 } 
  },
  tap: { scale: 0.95 },
};

const floatingVariants = {
  animate: {
    y: [-8, 8, -8],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: easeInOut
    }
  }
};

const badgeVariants = {
  hover: { 
    scale: 1.05,
    y: -2,
    transition: { duration: 0.2 }
  }
};

export default function Home() {
  const [animationData, setAnimationData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const techStack = [
    { name: "Cerebras", icon: "🧠", color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
    { name: "LLaMA", icon: "🦙", color: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
    { name: "Docker", icon: "🐳", color: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20" },
  ];

  // Load Lottie animation data
  useEffect(() => {
    const loadAnimation = async () => {
      try {
        const response = await fetch('/assets/Anima Bot.json');
        const data = await response.json();
        setAnimationData(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading Lottie animation:', error);
        setIsLoading(false);
      }
    };

    loadAnimation();
  }, []);

  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background via-background to-background/98 overflow-hidden">
        {/* Enhanced Background Effects */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:20px_20px]"></div>
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl"></div>
        
        <motion.div
          className="max-w-6xl mx-auto relative z-10 w-full"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Status Badge */}
          <motion.div
            className="flex justify-center mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            {/* <Badge className="bg-gradient-to-r from-green-500/10 to-blue-500/10 text-green-600 border-green-500/20 px-4 py-2 text-sm font-medium">
              <Sparkles className="w-4 h-4 mr-2" />
              Hackathon Project - Live Demo Available
            </Badge> */}
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <motion.div
              className="space-y-8 lg:text-left text-center"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              {/* Main Headline */}
              <div className="space-y-6">
                <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                  <span 
                    className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent"
                  >
                    POLYMIND
                  </span>
                </h1>
                <p className="font-body text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  A multi-agent AI workspace that thinks, remembers, and collaborates with your team in real-time
                </p>
              </div>

              {/* CTA Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl border-0 w-full sm:w-auto">
                    Try Live Demo
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </motion.div>
                
                <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                  <Button variant="outline" size="lg" className="border-2 hover:bg-muted px-8 py-6 text-lg font-semibold rounded-xl w-full sm:w-auto">
                    <Play className="mr-2 w-5 h-5" />
                    Watch Pitch
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Right Column - Lottie Animation */}
            <motion.div
              className="flex justify-center lg:justify-end"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <motion.div
                className="relative w-80 h-80 sm:w-96 sm:h-96 lg:w-[500px] lg:h-[500px]"
                variants={floatingVariants}
                animate="animate"
              >
                {/* Lottie Animation Container */}
                <div className="relative h-full flex items-center justify-center">
                  <div className="w-full h-full relative">
                    {!isLoading && animationData ? (
                      <Lottie
                        animationData={animationData}
                        loop={true}
                        autoplay={true}
                        className="w-full h-full lottie-animation-clean"
                        style={{
                          background: 'transparent',
                          mixBlendMode: 'normal',
                        }}
                      />
                    ) : (
                      /* Loading/Fallback */
                      <div className="flex flex-col items-center justify-center h-full text-center">
                        <motion.div 
                          className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4 shadow-lg"
                          animate={{ 
                            scale: [1, 1.1, 1],
                            rotate: [0, 10, -10, 0]
                          }}
                          transition={{ 
                            duration: 2, 
                            repeat: Infinity, 
                            ease: "easeInOut" 
                          }}
                        >
                          <span className="text-3xl">🤖</span>
                        </motion.div>
                        <p className="text-foreground/80 font-medium mb-2">
                          {isLoading ? "Loading AI Agent..." : "AI Agent Active"}
                        </p>
                        <div className="flex space-x-1">
                          <motion.div 
                            className="w-2 h-2 bg-blue-500 rounded-full"
                            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                          />
                          <motion.div 
                            className="w-2 h-2 bg-purple-500 rounded-full"
                            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                          />
                          <motion.div 
                            className="w-2 h-2 bg-cyan-500 rounded-full"
                            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Subtle Professional Overlay Effects */}
                <div className="absolute inset-0 pointer-events-none">
                  <motion.div 
                    className="absolute top-4 left-4 w-1.5 h-1.5 bg-blue-500/30 rounded-full"
                    animate={{ 
                      y: [-3, 3, -3],
                      opacity: [0.3, 0.6, 0.3],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.div 
                    className="absolute bottom-4 right-4 w-2 h-2 bg-purple-500/30 rounded-full"
                    animate={{ 
                      y: [3, -3, 3],
                      opacity: [0.2, 0.5, 0.2],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  />
                  <motion.div 
                    className="absolute top-8 right-8 w-1 h-1 bg-cyan-500/40 rounded-full"
                    animate={{ 
                      y: [-2, 2, -2],
                      x: [-1, 1, -1],
                      opacity: [0.4, 0.7, 0.4]
                    }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-background/80 rounded-full border border-border/50 backdrop-blur-sm mb-8">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium text-muted-foreground mr-2">Powered by</span>
              <div className="flex items-center gap-3 flex-wrap">
                {techStack.map((tech, index) => (
                  <motion.div
                    key={tech.name}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${tech.color}`}
                    variants={badgeVariants}
                    whileHover="hover"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                  >
                    <span className="text-sm">{tech.icon}</span>
                    <span>{tech.name}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Key Features
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover what makes POLYMIND the ultimate AI workspace for your team
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {[
              { title: "Multi-Agent", desc: "Collaborative AI agents working together seamlessly", icon: "🤝" },
              { title: "Memory", desc: "Context-aware AI that remembers your conversations", icon: "🧠" },
              { title: "Real-time", desc: "Instant responses and live collaboration", icon: "⚡" }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                className="p-6 bg-muted/30 rounded-xl border border-border/50 backdrop-blur-sm hover:bg-muted/40 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Lottie-specific CSS */}
      <style jsx>{`
        .lottie-animation-clean {
          background: transparent !important;
          filter: contrast(1.05) saturate(1.1) brightness(1.0);
        }
        
        @media (prefers-color-scheme: dark) {
          .lottie-animation-clean {
            filter: contrast(1.08) saturate(1.05) brightness(1.05);
          }
        }
        
        @media (prefers-color-scheme: light) {
          .lottie-animation-clean {
            filter: contrast(1.03) saturate(1.15) brightness(0.98);
          }
        }

        .lottie-animation-clean svg {
          background: transparent !important;
        }

        .lottie-animation-clean canvas {
          background: transparent !important;
        }
      `}</style>
    </>
  );
}
