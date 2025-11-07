import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import {
  Settings as SettingsIcon,
  Bell,
  Eye,
  Shield,
  Mail,
  Smartphone,
  Save
} from 'lucide-react'

interface SwitchProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}

const Switch: React.FC<SwitchProps> = ({ checked, onCheckedChange }) => (
  <button
    role="switch"
    aria-checked={checked}
    onClick={() => onCheckedChange(!checked)}
    className={`
      relative inline-flex h-6 w-11 sm:h-7 sm:w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent
      transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2
      focus-visible:ring-ring focus-visible:ring-offset-2 touch-target
      ${checked ? 'bg-blue-600' : 'bg-gray-300'}
    `}
  >
    <span
      className={`
        pointer-events-none inline-block h-5 w-5 sm:h-6 sm:w-6 transform rounded-full bg-white shadow-lg
        ring-0 transition duration-200 ease-in-out
        ${checked ? 'translate-x-5 sm:translate-x-5' : 'translate-x-0'}
      `}
    />
  </button>
)

const Settings: React.FC = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    jobAlerts: true,
    weeklyDigest: true,
    messages: true,
  })

  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    showEmail: false,
    showPhone: false,
    allowMessages: true,
  })

  const [hasChanges, setHasChanges] = useState(false)

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications({ ...notifications, [key]: value })
    setHasChanges(true)
  }

  const handlePrivacyChange = (key: string, value: boolean) => {
    setPrivacy({ ...privacy, [key]: value })
    setHasChanges(true)
  }

  const handleSave = () => {
    setHasChanges(false)
    // Save logic here
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="glass-nav sticky top-0 z-50 border-b">
        <div className="container-padding py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-responsive-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Settings
              </h1>
              <p className="text-responsive-sm text-muted-foreground mt-1">
                Manage your account preferences and settings
              </p>
            </div>
            {hasChanges && (
              <Button variant="primary" size="lg" onClick={handleSave} className="w-full sm:w-auto">
                <Save className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Save Changes
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-padding section-padding">
        <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
          {/* Account Settings */}
          <Card glass className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                Account Settings
              </CardTitle>
              <CardDescription>Update your account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Address</label>
                  <Input type="email" defaultValue="john.doe@example.com" glass />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone Number</label>
                  <Input type="tel" defaultValue="+1 (555) 123-4567" glass />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Current Password</label>
                <Input type="password" placeholder="Enter current password" glass />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">New Password</label>
                  <Input type="password" placeholder="Enter new password" glass />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Confirm Password</label>
                  <Input type="password" placeholder="Confirm new password" glass />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card glass className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 sm:h-6 sm:w-6" />
                Notifications
              </CardTitle>
              <CardDescription>Manage how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              {/* Notification Channels */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Notification Channels</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 sm:p-4 rounded-lg bg-white/50">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm sm:text-base font-medium">Email Notifications</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">Receive updates via email</p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.email}
                      onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 sm:p-4 rounded-lg bg-white/50">
                    <div className="flex items-center gap-3">
                      <Bell className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="text-sm sm:text-base font-medium">Push Notifications</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">Get browser notifications</p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.push}
                      onCheckedChange={(checked) => handleNotificationChange('push', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 sm:p-4 rounded-lg bg-white/50">
                    <div className="flex items-center gap-3">
                      <Smartphone className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-sm sm:text-base font-medium">SMS Notifications</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">Text message updates</p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.sms}
                      onCheckedChange={(checked) => handleNotificationChange('sms', checked)}
                    />
                  </div>
                </div>
              </div>

              {/* Notification Types */}
              <div className="space-y-4 pt-4 border-t">
                <h4 className="text-sm font-medium">What to Notify</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 sm:p-4 rounded-lg bg-white/50">
                    <div>
                      <p className="text-sm sm:text-base font-medium">Job Alerts</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">New job recommendations</p>
                    </div>
                    <Switch
                      checked={notifications.jobAlerts}
                      onCheckedChange={(checked) => handleNotificationChange('jobAlerts', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 sm:p-4 rounded-lg bg-white/50">
                    <div>
                      <p className="text-sm sm:text-base font-medium">Weekly Digest</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">Summary of your week</p>
                    </div>
                    <Switch
                      checked={notifications.weeklyDigest}
                      onCheckedChange={(checked) => handleNotificationChange('weeklyDigest', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 sm:p-4 rounded-lg bg-white/50">
                    <div>
                      <p className="text-sm sm:text-base font-medium">Messages</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">New messages from coaches</p>
                    </div>
                    <Switch
                      checked={notifications.messages}
                      onCheckedChange={(checked) => handleNotificationChange('messages', checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card glass className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 sm:h-6 sm:w-6" />
                Privacy & Security
              </CardTitle>
              <CardDescription>Control your privacy and security preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 sm:p-4 rounded-lg bg-white/50">
                <div className="flex items-center gap-3">
                  <Eye className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm sm:text-base font-medium">Profile Visibility</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">Make profile visible to recruiters</p>
                  </div>
                </div>
                <Switch
                  checked={privacy.profileVisible}
                  onCheckedChange={(checked) => handlePrivacyChange('profileVisible', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-3 sm:p-4 rounded-lg bg-white/50">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm sm:text-base font-medium">Show Email</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">Display email on profile</p>
                  </div>
                </div>
                <Switch
                  checked={privacy.showEmail}
                  onCheckedChange={(checked) => handlePrivacyChange('showEmail', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-3 sm:p-4 rounded-lg bg-white/50">
                <div className="flex items-center gap-3">
                  <Smartphone className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm sm:text-base font-medium">Show Phone</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">Display phone on profile</p>
                  </div>
                </div>
                <Switch
                  checked={privacy.showPhone}
                  onCheckedChange={(checked) => handlePrivacyChange('showPhone', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-3 sm:p-4 rounded-lg bg-white/50">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="text-sm sm:text-base font-medium">Allow Messages</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">Let others message you</p>
                  </div>
                </div>
                <Switch
                  checked={privacy.allowMessages}
                  onCheckedChange={(checked) => handlePrivacyChange('allowMessages', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card glass className="border-destructive/50 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>Irreversible actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-destructive/5 border border-destructive/20">
                <div>
                  <p className="font-medium text-sm sm:text-base">Delete Account</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Permanently delete your account and all data
                  </p>
                </div>
                <Button variant="destructive" size="sm" className="w-full sm:w-auto shrink-0">
                  Delete Account
                </Button>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                <div>
                  <p className="font-medium text-sm sm:text-base">Deactivate Account</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Temporarily deactivate your account
                  </p>
                </div>
                <Button variant="outline" size="sm" className="w-full sm:w-auto shrink-0">
                  Deactivate
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Settings
