import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";

import Layout from "../components/Layout";
import Transition from "../components/Transition";

import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const plainPage = router.pathname.startsWith("/admin") || router.pathname.startsWith("/debug");

  const page = (
    <AnimatePresence mode="wait">
      <motion.div key={router.route} className="h-full">
        {!plainPage && <Transition />}
        <Component {...pageProps} />
      </motion.div>
    </AnimatePresence>
  );

  if (plainPage) return page;
  return <Layout>{page}</Layout>;
}

export default MyApp;
