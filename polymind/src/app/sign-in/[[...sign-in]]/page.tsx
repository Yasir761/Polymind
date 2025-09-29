"use client";

import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, Shield, Zap } from "lucide-react";

export default function SignInPage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.03, 0.05, 0.03],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
            opacity: [0.03, 0.06, 0.03],
          }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-blue-400 to-cyan-400 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-6xl"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left side - Feature highlights */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="hidden md:block space-y-8 px-8"
            >
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                  Welcome back to{" "}
                  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    POLYMIND
                  </span>
                </h2>
                <p className="text-lg text-gray-600">
                  Continue your journey with powerful AI tools designed to enhance your productivity.
                </p>
              </div>

              <div className="space-y-6">
                {[
                  {
                    icon: Zap,
                    title: "Lightning Fast",
                    description: "Access your workspace instantly with seamless performance",
                    color: "from-yellow-400 to-orange-500",
                  },
                  {
                    icon: Shield,
                    title: "Secure & Private",
                    description: "Your data is protected with enterprise-grade encryption",
                    color: "from-green-400 to-emerald-500",
                  },
                  {
                    icon: Sparkles,
                    title: "AI-Powered",
                    description: "Unlock intelligent features that adapt to your workflow",
                    color: "from-purple-400 to-pink-500",
                  },
                ].map((feature, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 + idx * 0.1 }}
                    className="flex gap-4 group"
                  >
                    <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right side - Sign in form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="w-full"
            >
              <div className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl p-8 border border-white/20">
                {/* Back button */}
                <Link
                  href="/"
                  className="inline-flex items-center text-gray-600 hover:text-indigo-600 text-sm font-medium mb-8 group transition-colors duration-200"
                >
                  <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
                  Back to Home
                </Link>

                {/* Heading */}
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Welcome back
                  </h1>
                  <p className="text-gray-600">
                    Sign in to access your AI workspace.
                  </p>
                </div>

                {/* Clerk SignIn */}
                <div className="flex justify-center">
                  <SignIn
                    appearance={{
                      elements: {
                        formButtonPrimary:
                          "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-200",
                        card: "shadow-none bg-transparent",
                        headerTitle: "hidden",
                        headerSubtitle: "hidden",
                        socialButtonsBlockButton:
                          "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all duration-200",
                        formFieldInput:
                          "border-gray-200 focus:border-indigo-500 focus:ring-indigo-500",
                        footerActionLink: "text-indigo-600 hover:text-indigo-700",
                      },
                    }}
                    redirectUrl="/dashboard"
                    signUpUrl="/sign-up"
                  />
                </div>

                {/* Trust indicators */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1, duration: 0.5 }}
                  className="mt-8 pt-6 border-t border-gray-100"
                >
                  <p className="text-xs text-center text-gray-500">
                    Protected by enterprise-grade encryption • 99.9% uptime SLA
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}