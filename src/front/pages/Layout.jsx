import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import ScrollToTop from "../components/ScrollToTop";
import { Footer } from "../components/Footer";

export const Layout = () => {
  const location = useLocation();

  return (
    <ScrollToTop>
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}  
          exit={{}}                        
          transition={{ duration: 0.5 }}  
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>
      <Footer />
    </ScrollToTop>
  );
};