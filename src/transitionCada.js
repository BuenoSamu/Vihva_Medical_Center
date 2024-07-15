import { motion } from "framer-motion";

const transitionCada = (OComponent) => {
    return () => (
        <>
        <OComponent />
        <motion.div
        className="slide-in-verted"
        initial={{scaleX: 1}}
        animate={{scaleX: 0}}
        exit={{scaleX: 0}}
        transition={{ 
            duration: 2, 
            ease: [0.420, 0.000, 1.000, 1.000] }}
        />
       <motion.div
        className="slide-out-inverted"
        initial={{scaleX: 0}}
        animate={{scaleX: 0}}
        exit={{scaleX: 1}}
        transition={{
            duration: 1.5, 
            ease: [0.420, 0.000, 1.000, 1.000] }}
       />
        </>
    )
}

export default transitionCada;
