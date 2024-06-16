import '@/styles/globals.css'
import Home from '@/_components/home'
import { useRouter } from 'next/router'

export default function App({ Component, pageProps }) {

  const router = useRouter();
  const path = router.pathname

  return (

    <>
      {path !== '/access' ? (
        <Home>
          <Component {...pageProps} />
        </Home>
      ) : (
        <Component {...pageProps} />
      )}
      
    </>

  )
}
