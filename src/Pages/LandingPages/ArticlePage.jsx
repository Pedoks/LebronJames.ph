import React, { useState, useEffect } from 'react'
import { CalendarDays, Clock } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { fetchArticles } from '../../services/articleService'

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
}

function ArticlePage() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadArticles()
  }, [])

  const loadArticles = async () => {
    try {
      setLoading(true)
      const response = await fetchArticles()
      // Filter only active articles for public display
      const activeArticles = response.data.filter(article => article.status === 'active')
      setArticles(activeArticles)
    } catch (error) {
      console.error('Error loading articles:', error)
      setError('Failed to load articles. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="px-6 py-12 md:px-12 lg:px-24 bg-gradient-to-b from-[#2d1155] to-[#552583] min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FDB927]"></div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="px-6 py-12 md:px-12 lg:px-24 bg-gradient-to-b from-[#2d1155] to-[#552583] min-h-screen">
        <div className="text-center py-12">
          <p className="text-red-400 text-lg">{error}</p>
          <button 
            onClick={loadArticles}
            className="mt-4 px-6 py-2 bg-[#FDB927] text-[#552583] rounded-lg hover:bg-[#ffd343] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="px-6 py-12 md:px-12 lg:px-24 bg-gradient-to-b from-[#2d1155] to-[#552583] min-h-screen">
      {/* Hero Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-[#FDB927] mb-4">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FDB927] to-[#f8d56a]">
            LeDaddy Chronicles
          </span>
        </h1>
        <p className="text-lg text-[#FDB927]/90 max-w-2xl mx-auto">
          Exclusive stories about LeBron's legacy in purple and gold
        </p>
      </motion.div>

      {/* Article Grid */}
      {articles.length > 0 ? (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.15
              }
            }
          }}
        >
          {articles.map((article, index) => (
            <motion.div
              key={article._id}
              variants={cardVariants}
              whileHover={{ y: -5 }}
            >
              <Link to={`/articles/${article._id}`}>
                <div className="group bg-white/5 backdrop-blur-sm border border-[#FDB927]/20 rounded-xl overflow-hidden shadow-2xl hover:shadow-[0_20px_50px_rgba(253,_185,_39,_0.3)] transition-all duration-300">
                  <div className="relative h-60 overflow-hidden">
                    {/* Default image if none provided */}
                    <img
                      src={article.image || `https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      onError={(e) => {
                        e.target.src = `https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`
                      }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <span className="inline-block px-3 py-1 bg-[#FDB927] text-[#552583] text-xs font-bold rounded-full">
                        {article.category || 'Article'}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center text-sm text-[#FDB927]/80 mb-3 gap-2">
                      <CalendarDays className="w-4 h-4" />
                      {new Date(article.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                      <span className="flex items-center ml-auto">
                        <Clock className="w-4 h-4 mr-1" />
                        {article.readTime || '5 min read'}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2 group-hover:text-[#FDB927] transition">
                      {article.title}
                    </h2>
                    <p className="text-[#FDB927]/70 text-sm leading-relaxed">
                      {article.text.length > 120 
                        ? `${article.text.substring(0, 120)}...` 
                        : article.text
                      }
                    </p>
                    <div className="mt-4 text-xs text-[#FDB927]/60">
                      By {article.author}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-12">
          <p className="text-[#FDB927]/70 text-lg">No articles available at the moment.</p>
        </div>
      )}
    </div>
  )
}

export default ArticlePage