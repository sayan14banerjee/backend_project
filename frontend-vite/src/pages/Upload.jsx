import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { useToast } from '../context/ToastContext';
import { Upload, Loader } from 'lucide-react';

const UploadPage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [video, setVideo] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    isPublished: true,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideo(file);
      setVideoPreview(file.name);
    }
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!video) {
      addToast('Please select a video file', 'error');
      return;
    }

    if (!thumbnail) {
      addToast('Please select a thumbnail', 'error');
      return;
    }

    if (!formData.title.trim()) {
      addToast('Please enter a title', 'error');
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append('videoFile', video);
      data.append('thumbnail', thumbnail);
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('isPublished', formData.isPublished);

      const response = await api.post('/videos', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        },
      });

      addToast('Video uploaded successfully!', 'success');
      navigate(`/video/${response.data.data._id}`);
    } catch (error) {
      addToast(
        error.response?.data?.message || 'Upload failed. Please try again.',
        'error'
      );
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Upload Video</h1>
        <p className="text-muted-foreground">Share your content with the world</p>
      </div>

      <div className="bg-card rounded-lg border border-muted p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Video File */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-4">
              Video File
            </label>
            <label className="flex flex-col items-center justify-center w-full p-8 border-2 border-dashed border-muted rounded-lg cursor-pointer hover:border-accent hover:bg-secondary/50 transition">
              <Upload className="w-12 h-12 text-muted-foreground mb-2" />
              <span className="text-foreground font-semibold">Click to upload video</span>
              <span className="text-muted-foreground text-sm">or drag and drop</span>
              {videoPreview && (
                <span className="text-accent text-sm mt-2">{videoPreview}</span>
              )}
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoChange}
                className="hidden"
                required
              />
            </label>
          </div>

          {/* Thumbnail */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-4">
              Thumbnail
            </label>
            <div className="flex items-center gap-4">
              {thumbnailPreview && (
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail Preview"
                  className="w-24 h-24 rounded-lg object-cover"
                />
              )}
              <label className="flex-1 flex flex-col items-center justify-center p-8 border-2 border-dashed border-muted rounded-lg cursor-pointer hover:border-accent hover:bg-secondary/50 transition">
                <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                <span className="text-foreground font-semibold text-sm">Upload Thumbnail</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="hidden"
                  required
                />
              </label>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter video title..."
              maxLength="100"
              required
              className="w-full bg-secondary text-foreground placeholder-muted-foreground rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {formData.title.length}/100
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter video description..."
              maxLength="5000"
              rows="6"
              className="w-full bg-secondary text-foreground placeholder-muted-foreground rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-accent resize-none"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {formData.description.length}/5000
            </p>
          </div>

          {/* Publish Status */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isPublished"
              name="isPublished"
              checked={formData.isPublished}
              onChange={handleInputChange}
              className="w-4 h-4 rounded border-muted"
            />
            <label htmlFor="isPublished" className="font-semibold text-foreground">
              Publish this video
            </label>
          </div>

          {/* Progress Bar */}
          {loading && uploadProgress > 0 && (
            <div>
              <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                <div
                  className="bg-accent h-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground text-center mt-2">
                {uploadProgress}% uploaded
              </p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-accent-foreground font-semibold py-3 rounded-lg hover:bg-accent/90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading && <Loader size={18} className="animate-spin" />}
            {loading ? 'Uploading...' : 'Upload Video'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadPage;
