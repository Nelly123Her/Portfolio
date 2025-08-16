// Blog Dashboard JavaScript
class BlogDashboard {
    constructor() {
        this.blogs = JSON.parse(localStorage.getItem('blogs')) || [];
        this.currentBlog = null;
        this.currentSection = 'upload';
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadBlogs();
        this.setupEditor();
        this.showSection('upload');
    }

    bindEvents() {
        // Navigation
        document.querySelectorAll('.nav-item a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.currentTarget.dataset.section;
                this.showSection(section);
            });
        });

        // File upload
        const imageUpload = document.getElementById('image-upload');
        const featuredImage = document.getElementById('featured-image');
        
        imageUpload.addEventListener('click', () => featuredImage.click());
        imageUpload.addEventListener('dragover', this.handleDragOver.bind(this));
        imageUpload.addEventListener('drop', this.handleDrop.bind(this));
        featuredImage.addEventListener('change', this.handleImageSelect.bind(this));

        // Editor toolbar
        document.querySelectorAll('.editor-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const command = e.currentTarget.dataset.command;
                this.executeCommand(command);
            });
        });

        // Form buttons
        document.getElementById('save-draft').addEventListener('click', () => this.saveBlog('draft'));
        document.getElementById('publish-blog').addEventListener('click', () => this.saveBlog('published'));

        // Search and filter
        document.getElementById('search-blogs').addEventListener('input', this.filterBlogs.bind(this));
        document.getElementById('filter-category').addEventListener('change', this.filterBlogs.bind(this));

        // Settings
        document.getElementById('export-json').addEventListener('click', this.exportData.bind(this));
        document.getElementById('import-json').addEventListener('click', () => {
            document.getElementById('import-file').click();
        });
        document.getElementById('import-file').addEventListener('change', this.importData.bind(this));
        document.getElementById('clear-all').addEventListener('click', this.clearAllData.bind(this));

        // Modal
        document.querySelector('.close').addEventListener('click', this.closeModal.bind(this));
        document.getElementById('modal-cancel').addEventListener('click', this.closeModal.bind(this));
        document.getElementById('modal-confirm').addEventListener('click', this.confirmAction.bind(this));

        // Auto-save
        setInterval(() => {
            if (this.currentSection === 'upload' && this.hasUnsavedChanges()) {
                this.autoSave();
            }
        }, 30000); // Auto-save every 30 seconds
    }

    showSection(sectionName) {
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
        document.querySelector(`[data-section="${sectionName}"]`).parentElement.classList.add('active');

        // Update content
        document.querySelectorAll('.content-section').forEach(section => section.classList.remove('active'));
        document.getElementById(`${sectionName}-section`).classList.add('active');

        // Update page title
        const titles = {
            upload: 'Upload New Blog',
            manage: 'Manage Blogs',
            preview: 'Blog Preview',
            settings: 'Dashboard Settings'
        };
        document.getElementById('page-title').textContent = titles[sectionName];

        this.currentSection = sectionName;

        // Load section-specific content
        if (sectionName === 'manage') {
            this.renderBlogsList();
        } else if (sectionName === 'preview') {
            this.renderPreview();
        }
    }

    setupEditor() {
        const editor = document.getElementById('blog-content');
        editor.addEventListener('paste', (e) => {
            e.preventDefault();
            const text = e.clipboardData.getData('text/plain');
            document.execCommand('insertText', false, text);
        });
    }

    executeCommand(command) {
        if (command === 'createLink') {
            const url = prompt('Enter the URL:');
            if (url) {
                document.execCommand(command, false, url);
            }
        } else {
            document.execCommand(command, false, null);
        }
        document.getElementById('blog-content').focus();
    }

    handleDragOver(e) {
        e.preventDefault();
        e.currentTarget.style.borderColor = '#5a67d8';
        e.currentTarget.style.backgroundColor = '#f0f2ff';
    }

    handleDrop(e) {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (files.length > 0 && files[0].type.startsWith('image/')) {
            this.processImage(files[0]);
        }
        e.currentTarget.style.borderColor = '#667eea';
        e.currentTarget.style.backgroundColor = '#f8f9ff';
    }

    handleImageSelect(e) {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            this.processImage(file);
        }
    }

    processImage(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const preview = document.getElementById('image-preview');
            preview.innerHTML = `<img src="${e.target.result}" alt="Featured Image">`;
            preview.classList.remove('hidden');
            document.getElementById('image-upload').style.display = 'none';
        };
        reader.readAsDataURL(file);
    }

    saveBlog(status = 'draft') {
        const blogData = this.getBlogFormData();
        
        if (!blogData.title.trim()) {
            this.showNotification('Please enter a blog title', 'error');
            return;
        }

        if (!blogData.content.trim()) {
            this.showNotification('Please enter blog content', 'error');
            return;
        }

        blogData.status = status;
        blogData.id = this.currentBlog ? this.currentBlog.id : Date.now().toString();
        blogData.createdAt = this.currentBlog ? this.currentBlog.createdAt : new Date().toISOString();
        blogData.updatedAt = new Date().toISOString();

        if (this.currentBlog) {
            const index = this.blogs.findIndex(blog => blog.id === this.currentBlog.id);
            this.blogs[index] = blogData;
        } else {
            this.blogs.push(blogData);
        }

        this.saveToStorage();
        this.showNotification(`Blog ${status === 'published' ? 'published' : 'saved as draft'} successfully!`, 'success');
        
        if (status === 'published') {
            this.clearForm();
            this.currentBlog = null;
        }
    }

    getBlogFormData() {
        const imagePreview = document.querySelector('#image-preview img');
        return {
            title: document.getElementById('blog-title').value,
            category: document.getElementById('blog-category').value,
            tags: document.getElementById('blog-tags').value.split(',').map(tag => tag.trim()).filter(tag => tag),
            excerpt: document.getElementById('blog-excerpt').value,
            content: document.getElementById('blog-content').innerHTML,
            featuredImage: imagePreview ? imagePreview.src : null
        };
    }

    clearForm() {
        document.getElementById('blog-title').value = '';
        document.getElementById('blog-category').value = '';
        document.getElementById('blog-tags').value = '';
        document.getElementById('blog-excerpt').value = '';
        document.getElementById('blog-content').innerHTML = '';
        document.getElementById('image-preview').classList.add('hidden');
        document.getElementById('image-upload').style.display = 'block';
        document.getElementById('featured-image').value = '';
    }

    loadBlogs() {
        this.renderBlogsList();
    }

    renderBlogsList() {
        const container = document.getElementById('blogs-list');
        const searchTerm = document.getElementById('search-blogs').value.toLowerCase();
        const categoryFilter = document.getElementById('filter-category').value;

        let filteredBlogs = this.blogs.filter(blog => {
            const matchesSearch = blog.title.toLowerCase().includes(searchTerm) || 
                                blog.content.toLowerCase().includes(searchTerm) ||
                                blog.tags.some(tag => tag.toLowerCase().includes(searchTerm));
            const matchesCategory = !categoryFilter || blog.category === categoryFilter;
            return matchesSearch && matchesCategory;
        });

        if (filteredBlogs.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: #666;">
                    <i class="fas fa-blog" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.3;"></i>
                    <h3>No blogs found</h3>
                    <p>Start by creating your first blog post!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = filteredBlogs.map(blog => `
            <div class="blog-card">
                <div class="blog-card-image" style="${blog.featuredImage ? `background-image: url(${blog.featuredImage})` : ''}">
                    ${!blog.featuredImage ? '<i class="fas fa-image fa-2x"></i>' : ''}
                </div>
                <div class="blog-card-content">
                    <h3 class="blog-card-title">${blog.title}</h3>
                    <p class="blog-card-excerpt">${blog.excerpt || this.extractExcerpt(blog.content)}</p>
                    <div class="blog-card-meta">
                        <span class="blog-card-category">${blog.category || 'Uncategorized'}</span>
                        <span>${new Date(blog.updatedAt).toLocaleDateString()}</span>
                    </div>
                    <div class="blog-card-actions">
                        <button class="btn btn-primary btn-small" onclick="dashboard.editBlog('${blog.id}')">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-outline btn-small" onclick="dashboard.previewBlog('${blog.id}')">
                            <i class="fas fa-eye"></i> Preview
                        </button>
                        <button class="btn btn-danger btn-small" onclick="dashboard.deleteBlog('${blog.id}')">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    extractExcerpt(content) {
        const text = content.replace(/<[^>]*>/g, '');
        return text.length > 150 ? text.substring(0, 150) + '...' : text;
    }

    editBlog(id) {
        const blog = this.blogs.find(b => b.id === id);
        if (!blog) return;

        this.currentBlog = blog;
        this.populateForm(blog);
        this.showSection('upload');
    }

    populateForm(blog) {
        document.getElementById('blog-title').value = blog.title;
        document.getElementById('blog-category').value = blog.category || '';
        document.getElementById('blog-tags').value = blog.tags.join(', ');
        document.getElementById('blog-excerpt').value = blog.excerpt || '';
        document.getElementById('blog-content').innerHTML = blog.content;
        
        if (blog.featuredImage) {
            const preview = document.getElementById('image-preview');
            preview.innerHTML = `<img src="${blog.featuredImage}" alt="Featured Image">`;
            preview.classList.remove('hidden');
            document.getElementById('image-upload').style.display = 'none';
        }
    }

    previewBlog(id) {
        const blog = this.blogs.find(b => b.id === id);
        if (!blog) return;

        this.currentBlog = blog;
        this.showSection('preview');
    }

    renderPreview() {
        const container = document.getElementById('blog-preview');
        
        if (!this.currentBlog) {
            container.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: #666;">
                    <i class="fas fa-eye" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.3;"></i>
                    <h2>Blog Preview</h2>
                    <p>Select a blog to preview or create a new one.</p>
                </div>
            `;
            return;
        }

        const blog = this.currentBlog;
        container.innerHTML = `
            <article>
                ${blog.featuredImage ? `<img src="${blog.featuredImage}" alt="${blog.title}" style="width: 100%; max-height: 300px; object-fit: cover; border-radius: 8px; margin-bottom: 2rem;">` : ''}
                <h1>${blog.title}</h1>
                <div class="meta">
                    <span><i class="fas fa-calendar"></i> ${new Date(blog.updatedAt).toLocaleDateString()}</span>
                    ${blog.category ? `<span><i class="fas fa-folder"></i> ${blog.category}</span>` : ''}
                    ${blog.tags.length ? `<span><i class="fas fa-tags"></i> ${blog.tags.join(', ')}</span>` : ''}
                </div>
                ${blog.excerpt ? `<div class="excerpt" style="font-style: italic; color: #666; margin-bottom: 2rem;">${blog.excerpt}</div>` : ''}
                <div class="content">${blog.content}</div>
            </article>
        `;
    }

    deleteBlog(id) {
        const blog = this.blogs.find(b => b.id === id);
        if (!blog) return;

        this.showModal(
            'Delete Blog',
            `Are you sure you want to delete "${blog.title}"? This action cannot be undone.`,
            () => {
                this.blogs = this.blogs.filter(b => b.id !== id);
                this.saveToStorage();
                this.renderBlogsList();
                this.showNotification('Blog deleted successfully', 'success');
            }
        );
    }

    filterBlogs() {
        this.renderBlogsList();
    }

    exportData() {
        const data = {
            blogs: this.blogs,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `blog-dashboard-export-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.showNotification('Data exported successfully', 'success');
    }

    importData(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (data.blogs && Array.isArray(data.blogs)) {
                    this.blogs = data.blogs;
                    this.saveToStorage();
                    this.renderBlogsList();
                    this.showNotification('Data imported successfully', 'success');
                } else {
                    throw new Error('Invalid file format');
                }
            } catch (error) {
                this.showNotification('Error importing data. Please check the file format.', 'error');
            }
        };
        reader.readAsText(file);
    }

    clearAllData() {
        this.showModal(
            'Clear All Data',
            'Are you sure you want to delete all blogs? This action cannot be undone.',
            () => {
                this.blogs = [];
                this.saveToStorage();
                this.renderBlogsList();
                this.clearForm();
                this.currentBlog = null;
                this.showNotification('All data cleared successfully', 'success');
            }
        );
    }

    showModal(title, message, confirmCallback) {
        document.getElementById('modal-title').textContent = title;
        document.getElementById('modal-message').textContent = message;
        document.getElementById('modal').classList.remove('hidden');
        this.modalConfirmCallback = confirmCallback;
    }

    closeModal() {
        document.getElementById('modal').classList.add('hidden');
        this.modalConfirmCallback = null;
    }

    confirmAction() {
        if (this.modalConfirmCallback) {
            this.modalConfirmCallback();
        }
        this.closeModal();
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Add notification styles if not already added
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 1rem 1.5rem;
                    border-radius: 8px;
                    color: white;
                    z-index: 3000;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    animation: slideIn 0.3s ease;
                }
                .notification-success { background: #28a745; }
                .notification-error { background: #dc3545; }
                .notification-info { background: #17a2b8; }
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    saveToStorage() {
        localStorage.setItem('blogs', JSON.stringify(this.blogs));
    }

    hasUnsavedChanges() {
        const formData = this.getBlogFormData();
        return formData.title || formData.content || formData.excerpt;
    }

    autoSave() {
        const formData = this.getBlogFormData();
        if (formData.title || formData.content) {
            localStorage.setItem('autosave', JSON.stringify({
                ...formData,
                timestamp: Date.now()
            }));
        }
    }

    loadAutoSave() {
        const autosave = localStorage.getItem('autosave');
        if (autosave) {
            const data = JSON.parse(autosave);
            // Only load if autosave is less than 24 hours old
            if (Date.now() - data.timestamp < 24 * 60 * 60 * 1000) {
                this.populateForm(data);
                this.showNotification('Auto-saved content restored', 'info');
            }
            localStorage.removeItem('autosave');
        }
    }
}

// Initialize the dashboard when the page loads
let dashboard;
document.addEventListener('DOMContentLoaded', () => {
    dashboard = new BlogDashboard();
    dashboard.loadAutoSave();
});

// Handle page unload
window.addEventListener('beforeunload', (e) => {
    if (dashboard && dashboard.hasUnsavedChanges()) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        dashboard.autoSave();
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
            case 's':
                e.preventDefault();
                if (dashboard) dashboard.saveBlog('draft');
                break;
            case 'Enter':
                if (e.shiftKey) {
                    e.preventDefault();
                    if (dashboard) dashboard.saveBlog('published');
                }
                break;
        }
    }
});

// Export dashboard for global access
window.dashboard = dashboard;