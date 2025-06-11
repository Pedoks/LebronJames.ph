import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { CalendarDays, Clock, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import { fetchArticleById } from '../../services/articleService'
import NotFoundPage from './NotFoundPage'
import { Link } from 'react-router-dom'

function ArticleListPage() {
  const { id } = useParams()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadArticle()
  }, [id])

  const loadArticle = async () => {
    try {
      setLoading(true)
      const response = await fetchArticleById(id)
      
      // Check if article is active (for public display)
      if (response.data.status !== 'active') {
        setError('Article not found or not available')
        return
      }
      
      setArticle(response.data)
    } catch (error) {
      console.error('Error loading article:', error)
      if (error.response?.status === 404) {
        setError('Article not found')
      } else {
        setError('Failed to load article. Please try again later.')
      }
    } finally {
      setLoading(false)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1a0a2e] to-[#552583]">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FDB927]"></div>
        </div>
      </div>
    )
  }

  // Error state or article not found
  if (error || !article) {
    return <NotFoundPage />
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-b from-[#1a0a2e] to-[#552583]"
    >
      {/* Back Button */}
      <div className="container mx-auto px-6 pt-8">
        <Link to="/articles" className="inline-flex items-center text-[#FDB927] hover:text-white transition">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Articles
        </Link>
      </div>

      {/* Article Container */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Meta Data */}
        <div className="flex flex-wrap items-center gap-4 mb-8 text-[#FDB927]">
          <span className="flex items-center">
            <CalendarDays className="w-5 h-5 mr-2" />
            {new Date(article.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
          <span className="flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            {article.readTime || '5 min read'}
          </span>
          <span className="px-3 py-1 bg-[#FDB927] text-[#552583] text-sm font-bold rounded-full">
            {article.category || 'Article'}
          </span>
        </div>

        {/* Article Header */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight"
        >
          {article.title}
        </motion.h1>

        {/* Author */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <p className="text-[#FDB927]/80 text-lg">
            By <span className="font-semibold text-[#FDB927]">{article.author}</span>
          </p>
        </motion.div>

        {/* Featured Image */}
        {article.image && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-12 rounded-xl overflow-hidden shadow-2xl border-2 border-[#FDB927]/30"
          >
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-auto max-h-[500px] object-cover"
              onError={(e) => {
                e.target.style.display = 'none'
              }}
            />
          </motion.div>
        )}

        {/* Article Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="prose prose-lg max-w-none text-white"
        >
          <div className="text-lg leading-relaxed text-white/90 whitespace-pre-line">
            {article.text}
          </div>
          
          {/* Article Footer */}
          <div className="mt-12 pt-8 border-t border-[#FDB927]/20">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="text-sm text-[#FDB927]/70">
                Published on {new Date(article.createdAt).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              {article.updatedAt !== article.createdAt && (
                <div className="text-sm text-[#FDB927]/70">
                  Last updated: {new Date(article.updatedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Back to Articles Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center"
        >
          <Link 
            to="/articles"
            className="inline-flex items-center px-6 py-3 bg-[#FDB927] text-[#552583] font-semibold rounded-lg hover:bg-[#ffd343] transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to All Articles
          </Link>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default ArticleListPage