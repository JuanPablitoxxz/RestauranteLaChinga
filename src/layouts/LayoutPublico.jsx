import { motion } from 'framer-motion'

const LayoutPublico = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gradient-to-br from-primary-50 to-success-50"
    >
      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
    </motion.div>
  )
}

export default LayoutPublico
