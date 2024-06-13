import '@/styles/globals.css'
import Home from '@/_components/home'

export default function App({ Component, pageProps }) {
  return (

      <Home>
        <Component {...pageProps} />
      </Home>
    
  )
}
