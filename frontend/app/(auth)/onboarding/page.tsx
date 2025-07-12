'use client'

import React, { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { User, Briefcase, Heart, ArrowRight } from 'lucide-react'

const interestOptions = [
  'Frontend Development',
  'Backend Development',
  'Full Stack Development',
  'Mobile Development',
  'DevOps',
  'Data Science',
  'Machine Learning',
  'AI',
  'UI/UX Design',
  'Database Management',
  'Cloud Computing',
  'Cybersecurity',
  'Game Development',
  'Blockchain',
  'IoT',
  'Web3',
  'React',
  'Node.js',
  'Python',
  'JavaScript',
  'TypeScript',
  'Java',
  'C++',
  'Go',
  'Rust'
]

const occupationOptions = [
  'Student',
  'Junior Developer',
  'Senior Developer',
  'Full Stack Developer',
  'Frontend Developer',
  'Backend Developer',
  'Software Engineer',
  'DevOps Engineer',
  'Data Scientist',
  'Product Manager',
  'Tech Lead',
  'CTO',
  'Freelancer',
  'Entrepreneur',
  'Designer',
  'QA Engineer',
  'System Administrator',
  'Other'
]

export default function OnboardingPage() {
  const { completeOnboarding, user } = useAuth()
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    age: '',
    occupation: '',
    areaofinterest: [] as string[]
  })
  
  const [currentStep, setCurrentStep] = useState(1)
  const [customOccupation, setCustomOccupation] = useState('')
  const [searchInterest, setSearchInterest] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    } else {
      handleSubmit()
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError('')
    
    try {
      const finalData = {
        age: parseInt(formData.age),
        occupation: formData.occupation === 'Other' ? customOccupation : formData.occupation,
        areaofinterest: formData.areaofinterest
      }
      
      const result = await completeOnboarding(finalData)
      
      if (result.success) {
        router.push('/')
      } else {
        setError(result.error || 'Onboarding failed')
      }
    } catch (error) {
      setError('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const addInterest = (interest: string) => {
    if (!formData.areaofinterest.includes(interest) && formData.areaofinterest.length < 10) {
      setFormData({
        ...formData,
        areaofinterest: [...formData.areaofinterest, interest]
      })
    }
  }

  const removeInterest = (interest: string) => {
    setFormData({
      ...formData,
      areaofinterest: formData.areaofinterest.filter(item => item !== interest)
    })
  }

  const filteredInterests = interestOptions.filter(interest =>
    interest.toLowerCase().includes(searchInterest.toLowerCase()) &&
    !formData.areaofinterest.includes(interest)
  )

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.age && parseInt(formData.age) >= 13 && parseInt(formData.age) <= 120
      case 2:
        return formData.occupation && (formData.occupation !== 'Other' || customOccupation.trim())
      case 3:
        return formData.areaofinterest.length > 0
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-[#0D1117] flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-[#161B22] border-[#21262D]">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-[#C9D1D9]">
            Welcome to the Community, {user?.username}!
          </CardTitle>
          <p className="text-[#7D8590]">
            Let's personalize your experience with a few quick questions
          </p>
          
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
          
          {/* Progress indicator */}
          <div className="flex justify-center mt-6">
            <div className="flex space-x-2">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`w-3 h-3 rounded-full ${
                    step <= currentStep ? 'bg-teal-400' : 'bg-[#30363D]'
                  }`}
                />
              ))}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Step 1: Age */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <User className="h-5 w-5 text-teal-400" />
                <h3 className="text-lg font-semibold text-[#C9D1D9]">Tell us about yourself</h3>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="age" className="text-[#C9D1D9]">What's your age?</Label>
                <Input
                  id="age"
                  type="number"
                  min="13"
                  max="120"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="bg-[#0D1117] border-[#30363D] text-[#C9D1D9] focus:border-teal-400"
                  placeholder="Enter your age"
                />
                {formData.age && (parseInt(formData.age) < 13 || parseInt(formData.age) > 120) && (
                  <p className="text-red-400 text-sm">Please enter a valid age between 13 and 120</p>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Occupation */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <Briefcase className="h-5 w-5 text-teal-400" />
                <h3 className="text-lg font-semibold text-[#C9D1D9]">What's your current role?</h3>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {occupationOptions.map((occupation) => (
                  <Button
                    key={occupation}
                    variant={formData.occupation === occupation ? "default" : "outline"}
                    onClick={() => setFormData({ ...formData, occupation })}
                    className={`text-sm h-auto py-2 px-3 ${
                      formData.occupation === occupation
                        ? 'bg-teal-500 text-white border-teal-500'
                        : 'bg-transparent border-[#30363D] text-[#C9D1D9] hover:border-teal-400'
                    }`}
                  >
                    {occupation}
                  </Button>
                ))}
              </div>
              
              {formData.occupation === 'Other' && (
                <div className="mt-4">
                  <Input
                    value={customOccupation}
                    onChange={(e) => setCustomOccupation(e.target.value)}
                    className="bg-[#0D1117] border-[#30363D] text-[#C9D1D9] focus:border-teal-400"
                    placeholder="Please specify your occupation"
                  />
                </div>
              )}
            </div>
          )}

          {/* Step 3: Areas of Interest */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <Heart className="h-5 w-5 text-teal-400" />
                <h3 className="text-lg font-semibold text-[#C9D1D9]">What are you interested in?</h3>
                <span className="text-sm text-[#7D8590]">(Select up to 10)</span>
              </div>
              
              {/* Search for interests */}
              <Input
                value={searchInterest}
                onChange={(e) => setSearchInterest(e.target.value)}
                className="bg-[#0D1117] border-[#30363D] text-[#C9D1D9] focus:border-teal-400"
                placeholder="Search for interests..."
              />
              
              {/* Selected interests */}
              {formData.areaofinterest.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-[#7D8590]">Selected ({formData.areaofinterest.length}/10):</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.areaofinterest.map((interest) => (
                      <Badge
                        key={interest}
                        variant="secondary"
                        className="bg-teal-500/20 text-teal-400 border border-teal-500/30 hover:bg-teal-500/30 cursor-pointer"
                        onClick={() => removeInterest(interest)}
                      >
                        {interest} ×
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Available interests */}
              <div className="space-y-2">
                <p className="text-sm text-[#7D8590]">Available options:</p>
                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                  {filteredInterests.map((interest) => (
                    <Badge
                      key={interest}
                      variant="outline"
                      className="border-[#30363D] text-[#C9D1D9] hover:border-teal-400 cursor-pointer"
                      onClick={() => addInterest(interest)}
                    >
                      {interest} +
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="border-[#30363D] text-[#C9D1D9] hover:border-teal-400"
            >
              Back
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={!canProceed() || isSubmitting}
              className="bg-teal-500 text-white hover:bg-teal-600 disabled:opacity-50"
            >
              {currentStep === 3 ? (
                <>
                  {isSubmitting ? 'Completing...' : 'Complete'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}