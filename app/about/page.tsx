"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 p-4">
      
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-20 w-64 h-64 bg-purple-200 dark:bg-purple-800 rounded-full opacity-20 blur-3xl"
          animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-blue-200 dark:bg-blue-800 rounded-full opacity-20 blur-3xl"
          animate={{ x: [0, -80, 0], y: [0, 80, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto pt-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            About MoodBoard AI
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover the story behind our emotion-driven content platform
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Mission Card */}
          <Card className="p-8 backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border-0 shadow-xl mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-purple-700 dark:text-purple-400">Our Mission</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              MoodBoard AI was created with a simple yet powerful mission: to help people connect with their emotions
              through technology. We believe that understanding and expressing our feelings is essential for mental
              wellbeing and personal growth.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              By combining cutting-edge AI with thoughtfully curated content, we provide a unique experience that
              responds to your emotional state, offering comfort, inspiration, or motivation exactly when you need it.
            </p>
          </Card>

          {/* How It Works Card */}
          <Card className="p-8 backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border-0 shadow-xl mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-blue-700 dark:text-blue-400">How It Works</h2>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => {
                const steps = [
                  {
                    title: "Emotion Detection",
                    desc: "Using either facial recognition technology or text analysis, we identify your current emotional state.",
                  },
                  {
                    title: "Content Curation",
                    desc: "Our AI selects quotes, music, visuals, and journal prompts specifically tailored to your mood.",
                  },
                  {
                    title: "Personalized Experience",
                    desc: "Your MoodBoard is uniquely yours, designed to resonate with your feelings and provide what you need in the moment.",
                  },
                ];
                return (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-1">{steps[i].title}</h3>
                      <p className="text-gray-700 dark:text-gray-300">{steps[i].desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Team Card */}
          <Card className="p-8 backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border-0 shadow-xl">
            <h2 className="text-2xl font-semibold mb-4 text-indigo-700 dark:text-indigo-400">Our Team</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              MoodBoard AI was developed by a passionate team of developers, designers, and mental health advocates
              who believe in the power of technology to enhance emotional wellbeing.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 mx-auto mb-4"></div>
                <h3 className="font-medium text-lg">Jane Doe</h3>
                <p className="text-gray-600 dark:text-gray-400">Founder & AI Specialist</p>
              </div>
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 mx-auto mb-4"></div>
                <h3 className="font-medium text-lg">John Smith</h3>
                <p className="text-gray-600 dark:text-gray-400">UX Designer & Developer</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
