"use client"

import { useState } from "react"
import {
  User,
  Edit3,
  Camera,
  Award,
  MessageSquare,
  ArrowUp,
  Calendar,
  MapPin,
  LinkIcon,
  Bell,
  Shield,
  Key,
  Save,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const userProfile = {
  name: "John Doe",
  username: "johndoe_dev",
  email: "john.doe@example.com",
  bio: "Full-stack developer passionate about React, Node.js, and building scalable web applications. Always learning and sharing knowledge with the community.",
  location: "San Francisco, CA",
  website: "https://johndoe.dev",
  joinDate: "January 2023",
  avatar: "/placeholder.svg?height=120&width=120",
  reputation: 2847,
  badges: [
    { name: "Top Contributor", icon: "🏆", color: "gold", description: "Earned 100+ upvotes" },
    { name: "Helpful", icon: "🤝", color: "blue", description: "Provided 50+ helpful answers" },
    { name: "Expert", icon: "⭐", color: "purple", description: "Recognized expertise in React" },
    { name: "Mentor", icon: "👨‍🏫", color: "green", description: "Helped 25+ new developers" },
  ],
  stats: {
    questionsAsked: 24,
    answersProvided: 89,
    commentsPosted: 156,
    upvotesReceived: 342,
  },
}

const recentActivity = [
  {
    id: 1,
    type: "answer",
    title: "How to implement server-side rendering with Next.js 14?",
    action: "answered",
    time: "2 hours ago",
    votes: 15,
  },
  {
    id: 2,
    type: "question",
    title: "Best practices for React state management in 2024?",
    action: "asked",
    time: "1 day ago",
    votes: 8,
  },
  {
    id: 3,
    type: "comment",
    title: "TypeScript generic constraints not working as expected",
    action: "commented on",
    time: "2 days ago",
    votes: 3,
  },
  {
    id: 4,
    type: "answer",
    title: "How to optimize database queries in PostgreSQL?",
    action: "answered",
    time: "3 days ago",
    votes: 22,
  },
]

export function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState(userProfile)
  const [activeTab, setActiveTab] = useState("overview")

  const handleSave = () => {
    // In a real app, this would save to the server
    setIsEditing(false)
    console.log("Saving profile:", editedProfile)
  }

  const handleCancel = () => {
    setEditedProfile(userProfile)
    setIsEditing(false)
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-[#161B22] rounded-xl border border-[#21262D] p-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          {/* Profile Info */}
          <div className="flex flex-col sm:flex-row items-start gap-6">
            {/* Avatar */}
            <div className="relative group">
              <Avatar className="h-24 w-24 border-4 border-[#30363D] transition-all duration-300 group-hover:border-teal-400">
                <AvatarImage src={userProfile.avatar || "/placeholder.svg"} alt={userProfile.name} />
                <AvatarFallback className="bg-[#21262D] text-[#C9D1D9] text-2xl">
                  {userProfile.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button
                  size="sm"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-teal-500 hover:bg-teal-600 text-white p-0"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* User Details */}
            <div className="flex-1 space-y-3">
              {isEditing ? (
                <div className="space-y-3">
                  <Input
                    value={editedProfile.name}
                    onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                    className="bg-[#0D1117] border-[#30363D] text-[#C9D1D9] text-xl font-bold"
                    placeholder="Full Name"
                  />
                  <Input
                    value={editedProfile.username}
                    onChange={(e) => setEditedProfile({ ...editedProfile, username: e.target.value })}
                    className="bg-[#0D1117] border-[#30363D] text-[#7D8590]"
                    placeholder="Username"
                  />
                  <Textarea
                    value={editedProfile.bio}
                    onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                    className="bg-[#0D1117] border-[#30363D] text-[#C9D1D9] resize-none"
                    placeholder="Bio"
                    rows={3}
                  />
                </div>
              ) : (
                <>
                  <div>
                    <h1 className="text-2xl font-bold text-[#C9D1D9]">{userProfile.name}</h1>
                    <p className="text-[#7D8590]">@{userProfile.username}</p>
                  </div>
                  <p className="text-[#C9D1D9] leading-relaxed max-w-2xl">{userProfile.bio}</p>
                </>
              )}

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-[#7D8590]">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {userProfile.joinDate}</span>
                </div>
                {userProfile.location && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{userProfile.location}</span>
                  </div>
                )}
                {userProfile.website && (
                  <div className="flex items-center space-x-1">
                    <LinkIcon className="h-4 w-4" />
                    <a href={userProfile.website} className="text-teal-400 hover:underline">
                      {userProfile.website.replace("https://", "")}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            {isEditing ? (
              <>
                <Button
                  onClick={handleSave}
                  className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white rounded-lg transition-all duration-300 hover:scale-105"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="border-[#30363D] text-[#7D8590] hover:bg-[#161B22] hover:text-[#C9D1D9] transition-all duration-200 bg-transparent"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-[#21262D] text-[#C9D1D9] border border-[#30363D] hover:bg-[#30363D] transition-all duration-300 hover:scale-105"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-[#21262D]">
          <div className="text-center">
            <div className="text-2xl font-bold text-teal-400">{userProfile.reputation}</div>
            <div className="text-xs text-[#7D8590]">Reputation</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{userProfile.stats.questionsAsked}</div>
            <div className="text-xs text-[#7D8590]">Questions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{userProfile.stats.answersProvided}</div>
            <div className="text-xs text-[#7D8590]">Answers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">{userProfile.stats.upvotesReceived}</div>
            <div className="text-xs text-[#7D8590]">Upvotes</div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-[#161B22] border border-[#21262D] p-1 rounded-lg">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-teal-500/20 data-[state=active]:text-teal-400 data-[state=active]:border-teal-500/30 text-[#7D8590] hover:text-[#C9D1D9] transition-all duration-200"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="activity"
            className="data-[state=active]:bg-teal-500/20 data-[state=active]:text-teal-400 data-[state=active]:border-teal-500/30 text-[#7D8590] hover:text-[#C9D1D9] transition-all duration-200"
          >
            Activity
          </TabsTrigger>
          <TabsTrigger
            value="badges"
            className="data-[state=active]:bg-teal-500/20 data-[state=active]:text-teal-400 data-[state=active]:border-teal-500/30 text-[#7D8590] hover:text-[#C9D1D9] transition-all duration-200"
          >
            Badges
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="data-[state=active]:bg-teal-500/20 data-[state=active]:text-teal-400 data-[state=active]:border-teal-500/30 text-[#7D8590] hover:text-[#C9D1D9] transition-all duration-200"
          >
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <Card className="bg-[#161B22] border-[#21262D]">
              <CardHeader>
                <CardTitle className="text-[#C9D1D9] flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2 text-teal-400" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.slice(0, 3).map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start space-x-3 p-3 rounded-lg bg-[#0D1117] border border-[#21262D]"
                  >
                    <div
                      className={`p-1.5 rounded-lg ${
                        activity.type === "answer"
                          ? "bg-blue-500/20 text-blue-400"
                          : activity.type === "question"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-purple-500/20 text-purple-400"
                      }`}
                    >
                      {activity.type === "answer" ? (
                        <MessageSquare className="h-3 w-3" />
                      ) : activity.type === "question" ? (
                        <MessageSquare className="h-3 w-3" />
                      ) : (
                        <MessageSquare className="h-3 w-3" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#C9D1D9] font-medium truncate">{activity.title}</p>
                      <p className="text-xs text-[#7D8590]">
                        {activity.action} • {activity.time} • {activity.votes} votes
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Top Badges */}
            <Card className="bg-[#161B22] border-[#21262D]">
              <CardHeader>
                <CardTitle className="text-[#C9D1D9] flex items-center">
                  <Award className="h-5 w-5 mr-2 text-teal-400" />
                  Top Badges
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {userProfile.badges.slice(0, 3).map((badge, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-3 rounded-lg bg-[#0D1117] border border-[#21262D]"
                  >
                    <div className="text-2xl">{badge.icon}</div>
                    <div>
                      <p className="font-medium text-[#C9D1D9]">{badge.name}</p>
                      <p className="text-xs text-[#7D8590]">{badge.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-6">
          <Card className="bg-[#161B22] border-[#21262D]">
            <CardHeader>
              <CardTitle className="text-[#C9D1D9]">All Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start space-x-4 p-4 rounded-lg bg-[#0D1117] border border-[#21262D] hover:border-[#30363D] transition-colors duration-200"
                >
                  <div
                    className={`p-2 rounded-lg ${
                      activity.type === "answer"
                        ? "bg-blue-500/20 text-blue-400"
                        : activity.type === "question"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-purple-500/20 text-purple-400"
                    }`}
                  >
                    <MessageSquare className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-[#C9D1D9] mb-1">{activity.title}</h3>
                    <p className="text-sm text-[#7D8590] mb-2">
                      You {activity.action} this • {activity.time}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-[#7D8590]">
                      <div className="flex items-center space-x-1">
                        <ArrowUp className="h-3 w-3" />
                        <span>{activity.votes} votes</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Badges Tab */}
        <TabsContent value="badges" className="space-y-6">
          <Card className="bg-[#161B22] border-[#21262D]">
            <CardHeader>
              <CardTitle className="text-[#C9D1D9]">Earned Badges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userProfile.badges.map((badge, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-4 rounded-lg bg-[#0D1117] border border-[#21262D] hover:border-[#30363D] transition-all duration-200 hover:scale-[1.02]"
                  >
                    <div className="text-3xl">{badge.icon}</div>
                    <div>
                      <h3 className="font-medium text-[#C9D1D9]">{badge.name}</h3>
                      <p className="text-sm text-[#7D8590]">{badge.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Account Settings */}
            <Card className="bg-[#161B22] border-[#21262D]">
              <CardHeader>
                <CardTitle className="text-[#C9D1D9] flex items-center">
                  <User className="h-5 w-5 mr-2 text-teal-400" />
                  Account Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[#C9D1D9]">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    value={userProfile.email}
                    className="bg-[#0D1117] border-[#30363D] text-[#C9D1D9]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-[#C9D1D9]">
                    Location
                  </Label>
                  <Input
                    id="location"
                    value={userProfile.location}
                    className="bg-[#0D1117] border-[#30363D] text-[#C9D1D9]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website" className="text-[#C9D1D9]">
                    Website
                  </Label>
                  <Input
                    id="website"
                    value={userProfile.website}
                    className="bg-[#0D1117] border-[#30363D] text-[#C9D1D9]"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card className="bg-[#161B22] border-[#21262D]">
              <CardHeader>
                <CardTitle className="text-[#C9D1D9] flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-teal-400" />
                  Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full border-[#30363D] text-[#C9D1D9] hover:bg-[#21262D] justify-start bg-transparent"
                >
                  <Key className="h-4 w-4 mr-2" />
                  Change Password
                </Button>
                <div className="flex items-center justify-between p-3 rounded-lg bg-[#0D1117] border border-[#21262D]">
                  <div>
                    <p className="text-sm font-medium text-[#C9D1D9]">Two-Factor Authentication</p>
                    <p className="text-xs text-[#7D8590]">Add an extra layer of security</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card className="bg-[#161B22] border-[#21262D] lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-[#C9D1D9] flex items-center">
                  <Bell className="h-5 w-5 mr-2 text-teal-400" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      label: "Email notifications for new answers",
                      description: "Get notified when someone answers your question",
                    },
                    {
                      label: "Email notifications for upvotes",
                      description: "Get notified when your content is upvoted",
                    },
                    { label: "Weekly digest", description: "Receive a weekly summary of platform activity" },
                    { label: "Live thread notifications", description: "Get notified about new live discussions" },
                  ].map((setting, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-[#0D1117] border border-[#21262D]"
                    >
                      <div>
                        <p className="text-sm font-medium text-[#C9D1D9]">{setting.label}</p>
                        <p className="text-xs text-[#7D8590]">{setting.description}</p>
                      </div>
                      <Switch defaultChecked={index < 2} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
