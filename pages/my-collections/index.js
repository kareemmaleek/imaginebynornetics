
import Loading from '@/_components/Loading'
import MyCollections from '@/_components/MyCollections'
import React, { Suspense, useEffect, useState } from 'react'

function index() {

  return (
    <Suspense fallback={<Loading/>}>
    <MyCollections/>
    </Suspense>
  )
}

export default index