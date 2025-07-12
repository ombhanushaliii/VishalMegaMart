"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { 
  Users, 
  MessageSquare, 
  Flag, 
  Shield, 
  Trash2, 
  Eye, 
  EyeOff,
  BarChart3,
  Calendar,
  TrendingUp
} from 'lucide-react'

const API_BASE_URL = 'https://vishalmegamart.onrender.com/api/v1'

interface AdminStats {
  overview: {
    totalUsers: number
    totalQuestions: number
    totalAnswers: number
    pendingReports: number
  }
  recentActivity: {
    recentUsers: number
    recentQuestions: number
    recentAnswers: number
  }
  topUsers: Array<{
    _id: string
    questionCount: number
    user: {
      username: string
      email: string
    }
  }>
}

interface User {
  _id: string
  username: string
  email: string
  createdAt: string
  needsOnboarding: boolean
}

interface Question {
  _id: string
  title: string
  description: string
  userId: {
    username: string
    email: string
  }
  tags: string[]
  views: number
  isActive: boolean
  createdAt: string
}

interface Report {
  _id: string
  reportedBy: {
    username: string
    email: string
  }
  contentType: string
  contentId: {
    _id: string
    title?: string // For questions
    description?: string // For questions
    answer?: string // For answers
    username?: string // For users
    email?: string // For users
    userId?: {
      username: string
      email: string
    }
  }
  reason: string
  description: string
  status: string
  reviewedBy?: {
    username: string
    email: string
  }
  reviewedAt?: string
  adminNotes?: string
  createdAt: string
}

export function AdminPanel() {
  const [adminToken, setAdminToken] = useState<string | null>(null)
  const [loginForm, setLoginForm] = useState({ username: '', password: '' })
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [questions, setQuestions] = useState<Question[]>([])
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [reportFilter, setReportFilter] = useState<'all' | 'pending' | 'resolved' | 'dismissed' | 'reviewed'>('all')

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${API_BASE_URL}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginForm)
      })

      const data = await response.json()

      if (response.ok) {
        setAdminToken(data.token)
        localStorage.setItem('adminToken', data.token)
        await fetchDashboardStats(data.token)
      } else {
        setError(data.message || 'Login failed')
      }
    } catch (error) {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  const fetchDashboardStats = async (token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/dashboard/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const fetchUsers = async () => {
    if (!adminToken) return

    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/admin/users`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchQuestions = async () => {
    if (!adminToken) return

    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/admin/questions`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setQuestions(data.questions)
      }
    } catch (error) {
      console.error('Error fetching questions:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchReports = async (status: string = 'all') => {
    if (!adminToken) return

    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/admin/reports`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        let filteredReports = data.reports
        
        if (status !== 'all') {
          filteredReports = data.reports.filter((report: any) => report.status === status)
        }
        
        setReports(filteredReports)
      }
    } catch (error) {
      console.error('Error fetching reports:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleQuestionStatus = async (questionId: string) => {
    if (!adminToken) return

    try {
      const response = await fetch(`${API_BASE_URL}/admin/questions/${questionId}/toggle-status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      })

      if (response.ok) {
        await fetchQuestions()
      }
    } catch (error) {
      console.error('Error toggling question status:', error)
    }
  }

  const deleteQuestion = async (questionId: string) => {
    if (!adminToken) return

    try {
      const response = await fetch(`${API_BASE_URL}/admin/questions/${questionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      })

      if (response.ok) {
        await fetchQuestions()
      }
    } catch (error) {
      console.error('Error deleting question:', error)
    }
  }

  const updateReportStatus = async (reportId: string, status: string, adminNotes?: string) => {
    if (!adminToken) return

    try {
      const response = await fetch(`${API_BASE_URL}/admin/reports/${reportId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ status, adminNotes })
      })

      if (response.ok) {
        // Refresh reports list with current filter
        fetchReports(reportFilter)
      } else {
        console.error('Failed to update report status')
      }
    } catch (error) {
      console.error('Error updating report status:', error)
    }
  }

  const deleteReport = async (reportId: string) => {
    if (!adminToken) return

    try {
      const response = await fetch(`${API_BASE_URL}/admin/reports/${reportId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      })

      if (response.ok) {
        // Refresh reports list with current filter
        fetchReports(reportFilter)
      } else {
        console.error('Failed to delete report')
      }
    } catch (error) {
      console.error('Error deleting report:', error)
    }
  }

  const getContentPreview = (report: Report): string => {
    if (report.contentType === 'question') {
      return report.contentId.title || 'No title'
    } else if (report.contentType === 'answer') {
      return report.contentId.answer?.substring(0, 100) + '...' || 'No content'
    } else if (report.contentType === 'user') {
      return report.contentId.username || 'No username'
    }
    return 'Unknown content'
  }

  const getContentAuthor = (report: Report): string => {
    if (report.contentType === 'user') {
      return report.contentId.username || 'Unknown user'
    } else if (report.contentId.userId) {
      return report.contentId.userId.username || 'Unknown user'
    }
    return 'Unknown author'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const logout = () => {
    setAdminToken(null)
    localStorage.removeItem('adminToken')
    setStats(null)
    setUsers([])
    setQuestions([])
    setReports([])
    setReportFilter('all')
  }

  useEffect(() => {
    const savedToken = localStorage.getItem('adminToken')
    if (savedToken) {
      setAdminToken(savedToken)
      fetchDashboardStats(savedToken)
    }
  }, [])

  if (!adminToken) {
    return (
      <div className="min-h-screen bg-[#0D1117] flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-[#161B22] border-[#21262D]">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-[#C9D1D9] flex items-center justify-center gap-2">
              <Shield className="h-6 w-6 text-teal-400" />
              Admin Login
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#C9D1D9] mb-2">
                  Username
                </label>
                <Input
                  type="text"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                  className="bg-[#0D1117] border-[#30363D] text-[#C9D1D9] focus:border-teal-400"
                  placeholder="Enter admin username"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#C9D1D9] mb-2">
                  Password
                </label>
                <Input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  className="bg-[#0D1117] border-[#30363D] text-[#C9D1D9] focus:border-teal-400"
                  placeholder="Enter admin password"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-teal-500 text-white hover:bg-teal-600 disabled:opacity-50"
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </form>

            <div className="mt-4 p-3 bg-[#0D1117] border border-[#30363D] rounded-lg">
              <p className="text-xs text-[#7D8590] mb-1">Test Credentials:</p>
              <p className="text-xs text-[#C9D1D9]">Username: admin</p>
              <p className="text-xs text-[#C9D1D9]">Password: admin123</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0D1117] text-[#C9D1D9]">
      {/* Header */}
      <header className="border-b border-[#21262D] bg-[#161B22] p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#C9D1D9] flex items-center gap-2">
            <Shield className="h-6 w-6 text-teal-400" />
            Admin Dashboard
          </h1>
          <Button onClick={logout} variant="outline" className="border-[#30363D] text-[#C9D1D9]">
            Logout
          </Button>
        </div>
      </header>

      <div className="p-6">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-[#161B22] border-[#21262D]">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Users className="h-8 w-8 text-blue-400" />
                  <div>
                    <p className="text-2xl font-bold text-[#C9D1D9]">{stats.overview.totalUsers}</p>
                    <p className="text-sm text-[#7D8590]">Total Users</p>
                    <p className="text-xs text-green-400">+{stats.recentActivity.recentUsers} this week</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#161B22] border-[#21262D]">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-8 w-8 text-teal-400" />
                  <div>
                    <p className="text-2xl font-bold text-[#C9D1D9]">{stats.overview.totalQuestions}</p>
                    <p className="text-sm text-[#7D8590]">Total Questions</p>
                    <p className="text-xs text-green-400">+{stats.recentActivity.recentQuestions} this week</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#161B22] border-[#21262D]">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <BarChart3 className="h-8 w-8 text-purple-400" />
                  <div>
                    <p className="text-2xl font-bold text-[#C9D1D9]">{stats.overview.totalAnswers}</p>
                    <p className="text-sm text-[#7D8590]">Total Answers</p>
                    <p className="text-xs text-green-400">+{stats.recentActivity.recentAnswers} this week</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#161B22] border-[#21262D]">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Flag className="h-8 w-8 text-red-400" />
                  <div>
                    <p className="text-2xl font-bold text-[#C9D1D9]">{stats.overview.pendingReports}</p>
                    <p className="text-sm text-[#7D8590]">Pending Reports</p>
                    <p className="text-xs text-yellow-400">Needs attention</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Management Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="bg-[#161B22] border border-[#21262D]">
            <TabsTrigger 
              value="users" 
              onClick={fetchUsers}
              className="data-[state=active]:bg-teal-500 data-[state=active]:text-white"
            >
              Users
            </TabsTrigger>
            <TabsTrigger 
              value="questions" 
              onClick={fetchQuestions}
              className="data-[state=active]:bg-teal-500 data-[state=active]:text-white"
            >
              Questions
            </TabsTrigger>
            <TabsTrigger 
              value="reports" 
              onClick={() => fetchReports(reportFilter)}
              className="data-[state=active]:bg-teal-500 data-[state=active]:text-white"
            >
              Reports
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card className="bg-[#161B22] border-[#21262D]">
              <CardHeader>
                <CardTitle className="text-[#C9D1D9]">User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-[#21262D]">
                      <TableHead className="text-[#C9D1D9]">Username</TableHead>
                      <TableHead className="text-[#C9D1D9]">Email</TableHead>
                      <TableHead className="text-[#C9D1D9]">Joined</TableHead>
                      <TableHead className="text-[#C9D1D9]">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user._id} className="border-[#21262D]">
                        <TableCell className="text-[#C9D1D9]">{user.username}</TableCell>
                        <TableCell className="text-[#7D8590]">{user.email}</TableCell>
                        <TableCell className="text-[#7D8590]">{formatDate(user.createdAt)}</TableCell>
                        <TableCell>
                          <Badge className={user.needsOnboarding ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'}>
                            {user.needsOnboarding ? 'Onboarding' : 'Active'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Questions Tab */}
          <TabsContent value="questions">
            <Card className="bg-[#161B22] border-[#21262D]">
              <CardHeader>
                <CardTitle className="text-[#C9D1D9]">Question Management</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-[#21262D]">
                      <TableHead className="text-[#C9D1D9]">Title</TableHead>
                      <TableHead className="text-[#C9D1D9]">Author</TableHead>
                      <TableHead className="text-[#C9D1D9]">Views</TableHead>
                      <TableHead className="text-[#C9D1D9]">Status</TableHead>
                      <TableHead className="text-[#C9D1D9]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {questions.map((question) => (
                      <TableRow key={question._id} className="border-[#21262D]">
                        <TableCell className="text-[#C9D1D9] max-w-md truncate">
                          {question.title}
                        </TableCell>
                        <TableCell className="text-[#7D8590]">{question.userId.username}</TableCell>
                        <TableCell className="text-[#7D8590]">{question.views}</TableCell>
                        <TableCell>
                          <Badge className={question.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                            {question.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => toggleQuestionStatus(question._id)}
                              className="border-[#30363D] text-[#C9D1D9] hover:bg-[#21262D]"
                            >
                              {question.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm" variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="bg-[#161B22] border-[#21262D]">
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="text-[#C9D1D9]">Delete Question</AlertDialogTitle>
                                  <AlertDialogDescription className="text-[#7D8590]">
                                    This will permanently delete the question and all its answers. This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="border-[#30363D] text-[#C9D1D9]">Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => deleteQuestion(question._id)}
                                    className="bg-red-500 text-white hover:bg-red-600"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports">
            <Card className="bg-[#161B22] border-[#21262D]">
              <CardHeader>
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <CardTitle className="text-[#C9D1D9] flex items-center gap-2">
                    <Flag className="h-5 w-5" />
                    Report Management
                  </CardTitle>
                  
                  {/* Report Filter Buttons */}
                  <div className="flex gap-2 bg-[#0D1117] p-1 rounded-lg border border-[#21262D]">
                    {(['all', 'pending', 'reviewed', 'resolved', 'dismissed'] as const).map((status) => (
                      <Button
                        key={status}
                        variant={reportFilter === status ? "default" : "ghost"}
                        size="sm"
                        onClick={() => {
                          setReportFilter(status)
                          fetchReports(status)
                        }}
                        className={`${
                          reportFilter === status
                            ? "bg-teal-500 text-white hover:bg-teal-600"
                            : "text-[#7D8590] hover:text-[#C9D1D9] hover:bg-[#21262D]"
                        } text-xs whitespace-nowrap`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {reports.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-[#7D8590]">No reports found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reports.map((report) => (
                      <Card key={report._id} className="bg-[#0D1117] border-[#21262D]">
                        <CardContent className="pt-6">
                          <div className="flex flex-col lg:flex-row gap-4">
                            {/* Report Info */}
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <Badge className={
                                    report.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                                    report.status === 'resolved' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                                    report.status === 'dismissed' ? 'bg-gray-500/20 text-gray-400 border-gray-500/30' :
                                    'bg-blue-500/20 text-blue-400 border-blue-500/30'
                                  }>
                                    {report.status.toUpperCase()}
                                  </Badge>
                                  <p className="text-sm text-[#7D8590] mt-1">
                                    Reported by {report.reportedBy.username} on {formatDate(report.createdAt)}
                                  </p>
                                </div>
                                <Badge variant="outline" className="text-[#C9D1D9] border-[#30363D]">
                                  {report.contentType.toUpperCase()}
                                </Badge>
                              </div>

                              <div className="mb-3">
                                <h4 className="font-medium text-[#C9D1D9] mb-1">Reason: {report.reason}</h4>
                                {report.description && (
                                  <p className="text-sm text-[#7D8590] mb-2">{report.description}</p>
                                )}
                              </div>

                              <div className="bg-[#161B22] border border-[#21262D] rounded-lg p-3 mb-3">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-medium text-[#C9D1D9]">Reported Content:</span>
                                  <span className="text-xs text-[#7D8590]">
                                    By: {getContentAuthor(report)}
                                  </span>
                                </div>
                                <p className="text-sm text-[#7D8590]">{getContentPreview(report)}</p>
                                {report.contentType === 'question' && report.contentId.description && (
                                  <p className="text-xs text-[#7D8590] mt-1 line-clamp-2">
                                    {report.contentId.description.substring(0, 150)}...
                                  </p>
                                )}
                              </div>

                              {report.reviewedBy && (
                                <div className="text-sm text-[#7D8590]">
                                  <p>Reviewed by {report.reviewedBy.username} on {formatDate(report.reviewedAt!)}</p>
                                  {report.adminNotes && (
                                    <p className="mt-1 text-[#C9D1D9]">Notes: {report.adminNotes}</p>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Actions */}
                            <div className="lg:w-48 flex lg:flex-col gap-2">
                              {report.status === 'pending' && (
                                <>
                                  <Button
                                    size="sm"
                                    onClick={() => updateReportStatus(report._id, 'resolved', 'Content removed/action taken')}
                                    className="bg-green-600 hover:bg-green-700 text-white flex-1 lg:w-full"
                                  >
                                    Resolve
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => updateReportStatus(report._id, 'dismissed', 'No action needed')}
                                    className="border-[#30363D] text-[#C9D1D9] hover:bg-[#21262D] flex-1 lg:w-full"
                                  >
                                    Dismiss
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => updateReportStatus(report._id, 'reviewed', 'Under review')}
                                    className="border-[#30363D] text-[#C9D1D9] hover:bg-[#21262D] flex-1 lg:w-full"
                                  >
                                    Mark Reviewed
                                  </Button>
                                </>
                              )}
                              
                              {/* View Content Button */}
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  if (report.contentType === 'question') {
                                    window.open(`/questions/${report.contentId._id}`, '_blank')
                                  }
                                  // Add logic for other content types as needed
                                }}
                                className="text-[#7D8590] hover:text-[#C9D1D9] hover:bg-[#21262D] flex-1 lg:w-full"
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View Content
                              </Button>
                              
                              {/* Delete Report Button */}
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="border-red-500/30 text-red-400 hover:bg-red-500/10 flex-1 lg:w-full"
                                  >
                                    <Trash2 className="h-4 w-4 mr-1" />
                                    Delete
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="bg-[#161B22] border-[#21262D]">
                                  <AlertDialogHeader>
                                    <AlertDialogTitle className="text-[#C9D1D9]">Delete Report</AlertDialogTitle>
                                    <AlertDialogDescription className="text-[#7D8590]">
                                      This will permanently delete this report. This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel className="border-[#30363D] text-[#C9D1D9]">Cancel</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => deleteReport(report._id)}
                                      className="bg-red-500 text-white hover:bg-red-600"
                                    >
                                      Delete Report
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
