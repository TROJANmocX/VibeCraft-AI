"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Settings, Save, RefreshCw } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { useTheme } from "next-themes"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [apiKey, setApiKey] = useState("")
  const [saveHistory, setSaveHistory] = useState(true)
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  const [dataCollection, setDataCollection] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const handleSaveSettings = () => {
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast.success("Settings saved successfully")
      
      // In a real app, this would save to a database or API
      localStorage.setItem("moodboard-settings", JSON.stringify({
        apiKey,
        saveHistory,
        notificationsEnabled,
        dataCollection,
        theme
      }))
    }, 1000)
  }

  const handleResetSettings = () => {
    setApiKey("")
    setSaveHistory(true)
    setNotificationsEnabled(false)
    setDataCollection(true)
    setTheme("system")
    toast.info("Settings reset to defaults")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 p-4">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-20 w-64 h-64 bg-purple-200 dark:bg-purple-800 rounded-full opacity-20 blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-blue-200 dark:bg-blue-800 rounded-full opacity-20 blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 80, 0],
          }}
          transition={{
            duration: 25,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto pt-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Settings
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Customize your MoodBoard AI experience
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border-0 shadow-xl overflow-hidden">
            <Tabs defaultValue="general" className="w-full">
              <div className="border-b border-gray-200 dark:border-gray-700">
                <TabsList className="w-full justify-start rounded-none bg-transparent border-b border-gray-200 dark:border-gray-700">
                  <TabsTrigger value="general" className="data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:text-purple-600 dark:data-[state=active]:text-purple-400 rounded-none">
                    General
                  </TabsTrigger>
                  <TabsTrigger value="appearance" className="data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:text-purple-600 dark:data-[state=active]:text-purple-400 rounded-none">
                    Appearance
                  </TabsTrigger>
                  <TabsTrigger value="privacy" className="data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:text-purple-600 dark:data-[state=active]:text-purple-400 rounded-none">
                    Privacy
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="general" className="p-6 space-y-6">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">API Configuration</h2>
                  <div className="space-y-2">
                    <Label htmlFor="api-key">OpenAI API Key (Optional)</Label>
                    <Input
                      id="api-key"
                      type="password"
                      placeholder="sk-..."
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Add your own API key for enhanced AI features. Your key is stored locally and never sent to our servers.
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">History & Storage</h2>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="save-history">Save MoodBoard History</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Store your past MoodBoards locally</p>
                    </div>
                    <Switch
                      id="save-history"
                      checked={saveHistory}
                      onCheckedChange={setSaveHistory}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Notifications</h2>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="notifications">Enable Notifications</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Receive mood check-in reminders</p>
                    </div>
                    <Switch
                      id="notifications"
                      checked={notificationsEnabled}
                      onCheckedChange={setNotificationsEnabled}
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="appearance" className="p-6 space-y-6">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Theme</h2>
                  <div className="grid grid-cols-3 gap-4">
                    <div
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${theme === 'light' ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/30' : 'border-gray-200 dark:border-gray-700'}`}
                      onClick={() => setTheme("light")}
                    >
                      <div className="w-full h-24 bg-white rounded-md border border-gray-200 mb-2"></div>
                      <p className="text-center font-medium">Light</p>
                    </div>
                    <div
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${theme === 'dark' ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/30' : 'border-gray-200 dark:border-gray-700'}`}
                      onClick={() => setTheme("dark")}
                    >
                      <div className="w-full h-24 bg-gray-900 rounded-md border border-gray-700 mb-2"></div>
                      <p className="text-center font-medium">Dark</p>
                    </div>
                    <div
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${theme === 'system' ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/30' : 'border-gray-200 dark:border-gray-700'}`}
                      onClick={() => setTheme("system")}
                    >
                      <div className="w-full h-24 bg-gradient-to-r from-white to-gray-900 rounded-md border border-gray-200 mb-2"></div>
                      <p className="text-center font-medium">System</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="privacy" className="p-6 space-y-6">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Data Collection</h2>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="data-collection">Anonymous Usage Data</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Help us improve by sharing anonymous usage statistics
                      </p>
                    </div>
                    <Switch
                      id="data-collection"
                      checked={dataCollection}
                      onCheckedChange={setDataCollection}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold">Data Management</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Manage your personal data stored in this application
                  </p>
                  <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        toast.info("Data export initiated")
                        // In a real app, this would trigger a data export
                      }}
                    >
                      Export My Data
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        if (confirm("Are you sure you want to delete all your data? This cannot be undone.")) {
                          localStorage.clear()
                          toast.success("All local data has been deleted")
                        }
                      }}
                    >
                      Delete All My Data
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-between">
              <Button
                variant="outline"
                onClick={handleResetSettings}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Reset to Defaults
              </Button>
              
              <Button
                onClick={handleSaveSettings}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 flex items-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className="h-4 w-4 border-2 border-white border-t-transparent rounded-full"
                    />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Settings
                  </>
                )}
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}