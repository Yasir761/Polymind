import { motion, easeInOut, AnimatePresence } from "framer-motion";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Menu, X } from "lucide-react";

const navVariants = {
  hidden: { y: -50, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: easeInOut } },
};

const logoVariants = {
  hover: { 
    scale: 1.05,
    transition: { duration: 0.3, ease: easeInOut }
  },
};

const buttonVariants = {
  hover: { 
    scale: 1.02,
    y: -1,
    transition: { duration: 0.2, ease: easeInOut }
  },
  tap: { scale: 0.98 }
};

const mobileMenuVariants = {
  hidden: { 
    opacity: 0, 
    y: -20,
    transition: { duration: 0.2 }
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3, ease: easeInOut }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.2 }
  }
};

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <motion.nav
        className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-xl border-b border-border/50 supports-[backdrop-filter]:bg-background/80"
        initial="hidden"
        animate="visible"
        variants={navVariants}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Logo */}
            <motion.div className="flex-shrink-0">
              <motion.span
                className="font-heading text-xl sm:text-2xl font-bold cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #06b6d4 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
                variants={logoVariants}
                whileHover="hover"
              >
                POLYMIND
              </motion.span>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2">
              {/* Login Button */}
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-muted-foreground hover:text-foreground hover:bg-muted/80 font-medium px-3 lg:px-4 py-2 h-8 lg:h-9 text-sm rounded-lg transition-all duration-200"
                >
                  Login
                </Button>
              </motion.div>

              {/* Sign Up Button */}
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Button 
                  size="sm"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium px-4 lg:px-6 py-2 h-8 lg:h-9 text-sm rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 border-0"
                >
                  Sign Up
                </Button>
              </motion.div>

              {/* Vertical Separator */}
              <div className="h-6 w-px bg-border mx-2" />

              {/* Theme Toggle */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ThemeToggle />
              </motion.div>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden flex items-center gap-2">
              {/* Theme Toggle - Mobile */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ThemeToggle />
              </motion.div>

              {/* Mobile Menu Button */}
              <motion.button
                onClick={toggleMobileMenu}
                className="p-2 rounded-lg hover:bg-muted/80 transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isMobileMenuOpen ? (
                    <X className="h-5 w-5 text-foreground" />
                  ) : (
                    <Menu className="h-5 w-5 text-foreground" />
                  )}
                </motion.div>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden fixed inset-x-0 top-14 sm:top-16 z-40 bg-background/95 backdrop-blur-xl border-b border-border/50"
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="px-4 py-6 space-y-4">
              {/* Mobile Login Button */}
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="w-full"
              >
                <Button 
                  variant="ghost" 
                  className="w-full text-muted-foreground hover:text-foreground hover:bg-muted/80 font-medium py-3 h-12 text-base rounded-lg transition-all duration-200 justify-center"
                >
                  Login
                </Button>
              </motion.div>

              {/* Mobile Sign Up Button */}
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="w-full"
              >
                <Button 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 h-12 text-base rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 border-0"
                >
                  Sign Up
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Shadcn Separator */}
      <Separator className="bg-gradient-to-r from-transparent via-border/60 to-transparent h-px" />
    </>
  );
};
