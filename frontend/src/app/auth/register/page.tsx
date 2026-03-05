'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/store/authStore'
import { Loader2, User, Mail, Lock, Image as ImageIcon } from 'lucide-react'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const router = useRouter()
  const { register, isLoading, error } = useAuth()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
  })
  const [avatar, setAvatar] = useState<File | null>(null)
  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string>('')
  const [coverPreview, setCoverPreview] = useState<string>('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: (file: File | null) => void,
    setPreview: (preview: string) => void
  ) => {
    const file = e.target.files?.[0]
    if (file) {
      setFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (!avatar) {
      toast.error('Please upload an avatar')
      return
    }

    try {
      await register(
        formData.username,
        formData.email,
        formData.password,
        formData.fullName,
        avatar,
        coverImage || undefined
      )
      toast.success('Account created successfully!')
      router.push('/')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Registration failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-br from-background via-muted to-background">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-accent to-accent-hover rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-background font-bold text-2xl">VH</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Join VideoHub</h1>
          <p className="text-muted-foreground mt-2">Create your account and start sharing</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-foreground mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <input
                id="fullName"
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                required
                className="w-full pl-10 pr-4 py-2 bg-muted text-foreground rounded-lg border border-border focus:border-accent focus:outline-none"
              />
            </div>
          </div>

          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-foreground mb-2">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <input
                id="username"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="johndoe"
                required
                className="w-full pl-10 pr-4 py-2 bg-muted text-foreground rounded-lg border border-border focus:border-accent focus:outline-none"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full pl-10 pr-4 py-2 bg-muted text-foreground rounded-lg border border-border focus:border-accent focus:outline-none"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-2 bg-muted text-foreground rounded-lg border border-border focus:border-accent focus:outline-none"
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-2 bg-muted text-foreground rounded-lg border border-border focus:border-accent focus:outline-none"
              />
            </div>
          </div>

          {/* Avatar */}
          <div>
            <label htmlFor="avatar" className="block text-sm font-medium text-foreground mb-2">
              Profile Picture *
            </label>
            <div className="relative">
              <input
                id="avatar"
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleFileChange(e, setAvatar, setAvatarPreview)
                }
                required
                className="hidden"
              />
              <label htmlFor="avatar" className="block cursor-pointer">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    className="w-full h-24 object-cover rounded-lg border border-border"
                  />
                ) : (
                  <div className="w-full h-24 border-2 border-dashed border-border rounded-lg flex items-center justify-center hover:border-accent transition-colors">
                    <div className="text-center">
                      <ImageIcon className="w-6 h-6 text-muted-foreground mx-auto mb-1" />
                      <p className="text-xs text-muted-foreground">Click to upload</p>
                    </div>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Cover Image */}
          <div>
            <label htmlFor="coverImage" className="block text-sm font-medium text-foreground mb-2">
              Cover Image (Optional)
            </label>
            <div className="relative">
              <input
                id="coverImage"
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleFileChange(e, setCoverImage, setCoverPreview)
                }
                className="hidden"
              />
              <label htmlFor="coverImage" className="block cursor-pointer">
                {coverPreview ? (
                  <img
                    src={coverPreview}
                    alt="Cover preview"
                    className="w-full h-24 object-cover rounded-lg border border-border"
                  />
                ) : (
                  <div className="w-full h-24 border-2 border-dashed border-border rounded-lg flex items-center justify-center hover:border-accent transition-colors">
                    <div className="text-center">
                      <ImageIcon className="w-6 h-6 text-muted-foreground mx-auto mb-1" />
                      <p className="text-xs text-muted-foreground">Click to upload</p>
                    </div>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 bg-gradient-to-r from-accent to-accent-hover text-background rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Login link */}
        <p className="text-center text-muted-foreground mt-6">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-accent hover:text-accent-hover font-semibold">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
