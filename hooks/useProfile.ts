import { useState, useEffect } from 'react'
import { profileAPI } from '@/lib/api'
import { Profile, CreateProfileRequest, UpdateProfileRequest, UpdateProfilePictureRequest } from '@/types/api'

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await profileAPI.me()
      setProfile(response.data.data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch profile')
    } finally {
      setLoading(false)
    }
  }

  const createProfile = async (data: CreateProfileRequest) => {
    try {
      setLoading(true)
      setError(null)
      const formData = new FormData()
      
      if (data.displayPicture) {
        formData.append('displayPicture', data.displayPicture)
      }
      if (data.bio) {
        formData.append('bio', data.bio)
      }
      if (data.city) {
        formData.append('city', data.city)
      }
      if (data.country) {
        formData.append('country', data.country)
      }
      if (data.skills) {
        data.skills.forEach((skill, index) => {
          formData.append(`skills[${index}]`, skill)
        })
      }
      if (data.gender) {
        formData.append('gender', data.gender)
      }

      const response = await profileAPI.create(formData)
      setProfile(response.data.data)
      return response.data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create profile')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (id: string, data: UpdateProfileRequest) => {
    try {
      setLoading(true)
      setError(null)
      const formData = new FormData()
      
      if (data.bio) {
        formData.append('bio', data.bio)
      }
      if (data.city) {
        formData.append('city', data.city)
      }
      if (data.country) {
        formData.append('country', data.country)
      }
      if (data.skills) {
        data.skills.forEach((skill, index) => {
          formData.append(`skills[${index}]`, skill)
        })
      }
      if (data.gender) {
        formData.append('gender', data.gender)
      }

      const response = await profileAPI.update(id, formData)
      setProfile(response.data.data)
      return response.data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateProfilePicture = async (id: string, data: UpdateProfilePictureRequest) => {
    try {
      setLoading(true)
      setError(null)
      const formData = new FormData()
      formData.append('displayPicture', data.displayPicture)

      const response = await profileAPI.updateDisplayPicture(id, formData)
      setProfile(response.data.data)
      return response.data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile picture')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const removeProfilePicture = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = await profileAPI.removeDisplayPicture(id)
      if (profile) {
        setProfile({ ...profile, displayPicture: undefined })
      }
      return response.data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to remove profile picture')
      throw err
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  return {
    profile,
    loading,
    error,
    fetchProfile,
    createProfile,
    updateProfile,
    updateProfilePicture,
    removeProfilePicture,
  }
}
