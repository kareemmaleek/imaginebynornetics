import "@/styles/globals.css";
import Home from "@/_components/home";
import { useRouter } from "next/router";
import { AuthProvider } from "@/common/AuthContext";
import SmoothScroll from "@/common/smoothScrolling";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const path = router.pathname;

  return (
    <AuthProvider>
      {path !== "/access" && <SmoothScroll />}

      {path !== "/access" ? (
        <Home>
          <Component {...pageProps} />
        </Home>
      ) : (
        <Component {...pageProps} />
      )}
    </AuthProvider>
  );
}
