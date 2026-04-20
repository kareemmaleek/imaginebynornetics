import UploadArts from '@/_components/UploadArts'
import ProtectedRoute from '@/common/ProtectedRoute'
import React from 'react'

function index() {
  return (
    <ProtectedRoute>
      <UploadArts/>
    </ProtectedRoute>
  )
}

export default index