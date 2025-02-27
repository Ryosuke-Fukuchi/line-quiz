import { motion } from "framer-motion";

export const ScreenLoading: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.1 }}
      className="absolute inset-0 flex items-center justify-center bg-gray-900/40"
    >
      <div className="relative flex flex-col items-center">
        <motion.div className="relative w-16 h-16 flex items-center justify-center">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-4 h-4 bg-green-600 rounded-full"
              style={{ transform: `rotate(${i * 60}deg) translate(24px)` }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
            />
          ))}
        </motion.div>
        <motion.p
          className="mt-2 text-lg font-semibold text-white tracking-wide"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.6, 0.8, 0.6],
          }}
          transition={{ repeat: Infinity, duration: 1.3 }}
        >
          Loading...
        </motion.p>
      </div>
    </motion.div>
  );
};
