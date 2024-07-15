import { motion } from "framer-motion";

const transition = (OgComponent) => {
    return () => (
        <>
        <OgComponent />
        <motion.div
        className="slide-in"
        initial={{scaleX: 0}}
        animate={{scaleX: 0}}
        exit={{scaleX: 1}}
        transition={{ 
            duration: 2, 
            ease: [0.420, 0.000, 1.000, 1.000] }}
        />
       <motion.div
        className="slide-out"
        initial={{scaleX: 1}}
        animate={{scaleX: 0}}
        exit={{scaleX: 0}}
        transition={{
             duration: 1.5, 
             ease: [0.420, 0.000, 1.000, 1.000] }}
        />
        </>
    )
}

export default transition;
