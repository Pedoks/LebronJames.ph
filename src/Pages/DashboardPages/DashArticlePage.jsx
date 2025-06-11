import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, Search, Filter, AlertTriangle } from 'lucide-react';
import { fetchArticles, createArticle, updateArticle, deleteArticle } from '../../services/articleService';


function DashArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
const [articleToDelete, setArticleToDelete] = useState(null);
const [deleteLoading, setDeleteLoading] = useState(false);
const [showUpdateModal, setShowUpdateModal] = useState(false);
const [updateLoading, setUpdateLoading] = useState(false);
const [originalFormData, setOriginalFormData] = useState(null);
  const [formData, setFormData] = useState({
    articleName: '',
    title: '',
    text: '',
    author: '',
    image: '',
    status: 'active'
  });

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      setLoading(true);
      const response = await fetchArticles();
      setArticles(response.data);
    } catch (error) {
      console.error('Error loading articles:', error);
    } finally {
      setLoading(false);
    }
  };

const handleSubmit = async () => {
  try {
    if (editingArticle) {
      // Check if there are changes before showing confirmation
      if (!hasChanges()) {
        setShowModal(false);
        setEditingArticle(null);
        setFormData({ articleName: '', title: '', text: '', author: '', image: '', status: 'active' });
        return;
      }
      
      // Hide main modal and show update confirmation modal
      setShowModal(false);
      setShowUpdateModal(true);
      return;
    }
    
    // For new articles, proceed directly
    await createArticle(formData);
    setShowModal(false);
    setEditingArticle(null);
    setFormData({ articleName: '', title: '', text: '', author: '', image: '', status: 'active' });
    loadArticles();
  } catch (error) {
    console.error('Error saving article:', error);
  }
};

const confirmUpdateArticle = async () => {
  try {
    setUpdateLoading(true);
    await updateArticle(editingArticle._id, formData);
    setShowUpdateModal(false);
    setEditingArticle(null);
    setOriginalFormData(null);
    setFormData({ articleName: '', title: '', text: '', author: '', image: '', status: 'active' });
    loadArticles();
  } catch (error) {
    console.error('Error updating article:', error);
  } finally {
    setUpdateLoading(false);
  }
};

  const hasChanges = () => {
  if (!originalFormData) return false;
  
  return JSON.stringify(formData) !== JSON.stringify(originalFormData);
};

const handleEdit = (article) => {
  setEditingArticle(article);
  const editFormData = {
    articleName: article.articleName,
    title: article.title,
    text: article.text,
    author: article.author,
    image: article.image || '',
    status: article.status
  };
  setFormData(editFormData);
  setOriginalFormData(editFormData); // Store original data for comparison
  setShowModal(true);
};

const handleDelete = (article) => {
  setArticleToDelete(article);
  setShowDeleteModal(true);
};

const confirmDeleteArticle = async () => {
  if (!articleToDelete) return;
  
  try {
    setDeleteLoading(true);
    await deleteArticle(articleToDelete._id);
    loadArticles();
    setShowDeleteModal(false);
    setArticleToDelete(null);
  } catch (error) {
    console.error('Error deleting article:', error);
  } finally {
    setDeleteLoading(false);
  }
};

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.articleName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || article.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#552583]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#552583]">Articles Management</h1>
          <p className="text-gray-600">Manage your articles and content</p>
        </div>
        <button
          onClick={() => {
            setEditingArticle(null);
            setFormData({ articleName: '', title: '', text: '', author: '', image: '', status: 'active' });
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-[#552583] text-white px-4 py-2 rounded-lg hover:bg-[#3a1c6b] transition-colors"
        >
          <Plus size={20} />
          Add Article
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#552583] focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#552583] focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((article) => (
          <div key={article._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            {/* Article Image */}
            {article.image && (
              <div className="h-48 overflow-hidden rounded-t-lg">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-[#552583] mb-1">{article.title}</h3>
                  <p className="text-sm text-gray-500 mb-2">{article.articleName}</p>
                  <p className="text-sm text-gray-600">By {article.author}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  article.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {article.status}
                </span>
              </div>
              
              <p className="text-gray-700 mb-4 line-clamp-3">
                {article.text.substring(0, 100)}...
              </p>
              
              <div className="text-xs text-gray-500 mb-4">
                Created: {new Date(article.createdAt).toLocaleDateString()}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(article)}
                  className="flex items-center gap-1 px-3 py-1 bg-[#FDB927] text-[#552583] rounded hover:bg-[#ffd343] transition-colors text-sm font-medium"
                >
                  <Edit size={14} />
                  Edit
                </button>
<button
  onClick={() => handleDelete(article)}
  className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors text-sm font-medium"
>
  <Trash2 size={14} />
  Delete
</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No articles found</p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
{showDeleteModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Delete Article</h3>
            <p className="text-sm text-gray-500">This action cannot be undone</p>
          </div>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-700">
            Are you sure you want to delete the article{' '}
            <span className="font-semibold">
              "{articleToDelete?.title}"
            </span>
            ? This will permanently remove the article and all its content.
          </p>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={() => {
              setShowDeleteModal(false);
              setArticleToDelete(null);
            }}
            disabled={deleteLoading}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={confirmDeleteArticle}
            disabled={deleteLoading}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            {deleteLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Deleting...
              </>
            ) : (
              'Delete Article'
            )}
          </button>
        </div>
      </div>
    </div>
  </div>
)}

{/* Update Confirmation Modal */}
{showUpdateModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
            <Edit className="h-6 w-6 text-yellow-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Update Article</h3>
            <p className="text-sm text-gray-500">Confirm your changes</p>
          </div>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-700">
            Are you sure you want to update the article{' '}
            <span className="font-semibold">
              "{originalFormData?.title}"
            </span>
            ? Your changes will be saved permanently.
          </p>
        </div>
        
        <div className="flex space-x-3">
<button
  onClick={() => {
    setShowUpdateModal(false);
    setShowModal(true); // Show main modal again
  }}
  disabled={updateLoading}
  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
>
  Cancel
</button>
          <button
            onClick={confirmUpdateArticle}
            disabled={updateLoading}
            className="flex-1 px-4 py-2 bg-[#552583] text-white rounded-md hover:bg-[#3a1c6b] transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            {updateLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Updating...
              </>
            ) : (
              'Update Article'
            )}
          </button>
        </div>
      </div>
    </div>
  </div>
)}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-[#552583] mb-6">
              {editingArticle ? 'Edit Article' : 'Add New Article'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Article Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.articleName}
                  onChange={(e) => setFormData({ ...formData, articleName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#552583] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#552583] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Author *
                </label>
                <input
                  type="text"
                  required
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#552583] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL (Optional)
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#552583] focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter a valid image URL (Google Drive, Imgur, etc.)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#552583] focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Text *
                </label>
                <textarea
                  required
                  rows={6}
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#552583] focus:border-transparent"
                  placeholder="Write your article content here..."
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="flex-1 bg-[#552583] text-white py-2 px-4 rounded-lg hover:bg-[#3a1c6b] transition-colors font-medium"
                >
                  {editingArticle ? 'Update Article' : 'Create Article'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingArticle(null);
                    setFormData({ articleName: '', title: '', text: '', author: '', image: '', status: 'active' });
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashArticlesPage;