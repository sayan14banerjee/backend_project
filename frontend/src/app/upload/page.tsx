'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import { useAuth } from '@/store/authStore'
import { Upload, Loader2, Film, Image as ImageIcon } from 'lucide-react'
import toast from 'react-hot-toast'

export default function UploadPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [thumbnail, setThumbnail] = useState<File | null>(null)
  const [videoPreview, setVideoPreview] = useState<string>('')
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  })

  if (!isAuthenticated) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Please login to upload videos</p>
      </div>
    )
  }

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: (file: File | null) => void,
    setPreview: (preview: string) => void,
    isVideo: boolean
  ) => {
    const file = e.target.files?.[0]
    if (file) {
      setFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!videoFile || !thumbnail) {
      toast.error('Please upload both video and thumbnail')
      return
    }

    setIsLoading(true)
    try {
      const uploadFormData = new FormData()
      uploadFormData.append('video', videoFile)
      uploadFormData.append('thumbnail', thumbnail)
      uploadFormData.append('title', formData.title)
      uploadFormData.append('description', formData.description)

      const response = await api.post('/videos/upload', uploadFormData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      toast.success('Video uploaded successfully!')
      router.push(`/video/${response.data.data._id}`)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Upload failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Upload Video</h1>
        <p className="text-muted-foreground">Share your content with the world</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Video File */}
        <div>
          <label htmlFor="video" className="block text-sm font-medium text-foreground mb-3">
            Video File *
          </label>
          <input
            id="video"
            type="file"
            accept="video/*"
            onChange={(e) =>
              handleFileChange(e, setVideoFile, setVideoPreview, true)
            }
            required
            className="hidden"
          />
          <label htmlFor="video" className="block cursor-pointer">
            {videoFile ? (
              <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
                <video
                  src={videoPreview}
                  className="w-full h-full object-cover"
                  controls
                />
              </div>
            ) : (
              <div className="w-full aspect-video border-2 border-dashed border-border rounded-lg flex items-center justify-center hover:border-accent transition-colors hover:bg-muted/50">
                <div className="text-center">
                  <Film className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-foreground font-medium">Click to upload video</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    MP4, WebM or Ogg
                  </p>
                </div>
              </div>
            )}
          </label>
        </div>

        {/* Thumbnail */}
        <div>
          <label htmlFor="thumbnail" className="block text-sm font-medium text-foreground mb-3">
            Thumbnail *
          </label>
          <input
            id="thumbnail"
            type="file"
            accept="image/*"
            onChange={(e) =>
              handleFileChange(e, setThumbnail, setThumbnailPreview, false)
            }
            required
            className="hidden"
          />
          <label htmlFor="thumbnail" className="block cursor-pointer">
            {thumbnailPreview ? (
              <img
                src={thumbnailPreview}
                alt="Thumbnail preview"
                className="w-full h-40 object-cover rounded-lg border border-border"
              />
            ) : (
              <div className="w-full h-40 border-2 border-dashed border-border rounded-lg flex items-center justify-center hover:border-accent transition-colors hover:bg-muted/50">
                <div className="text-center">
                  <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-foreground font-medium">Click to upload thumbnail</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    JPG, PNG or WebP
                  </p>
                </div>
              </div>
            )}
          </label>
        </div>

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
            Video Title *
          </label>
          <input
            id="title"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter video title"
            required
            maxLength={100}
            className="w-full px-4 py-2 bg-muted text-foreground rounded-lg border border-border focus:border-accent focus:outline-none"
          />
          <p className="text-xs text-muted-foreground mt-1">
            {formData.title.length}/100
          </p>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Tell viewers about your video"
            required
            maxLength={5000}
            rows={4}
            className="w-full px-4 py-2 bg-muted text-foreground rounded-lg border border-border focus:border-accent focus:outline-none resize-none"
          />
          <p className="text-xs text-muted-foreground mt-1">
            {formData.description.length}/5000
          </p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading || !videoFile || !thumbnail}
          className="w-full py-3 bg-gradient-to-r from-accent to-accent-hover text-background rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              Publish Video
            </>
          )}
        </button>
      </form>
    </div>
  )
}
