import Loading from '@/_components/Loading'
import MyCollections from '@/_components/MyCollections'
import ProtectedRoute from '@/common/ProtectedRoute'
import React, { Suspense } from 'react'

function index() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<Loading/>}>
        <MyCollections/>
      </Suspense>
    </ProtectedRoute>
  )
}

export default index