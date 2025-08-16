from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Create a router for API endpoints
router = DefaultRouter()
router.register(r'posts', views.PostViewSet)
router.register(r'categories', views.CategoryViewSet)
router.register(r'tags', views.TagViewSet)

app_name = 'blog'

urlpatterns = [
    # Portfolio landing page
    path('portfolio/', views.portfolio_view, name='portfolio'),
    path('portfolio/styles.css', views.portfolio_static, {'file_path': 'styles.css'}, name='portfolio_css'),
    path('portfolio/script.js', views.portfolio_static, {'file_path': 'script.js'}, name='portfolio_js'),
    
    # Authentication views
    path('login/', views.login_view, name='login'),
    
    # Dashboard views
    path('', views.dashboard, name='dashboard'),
    path('create/', views.create_post, name='create_post'),
    path('edit/<int:post_id>/', views.edit_post, name='edit_post'),
    path('preview/<int:post_id>/', views.preview_post, name='preview_post'),
    path('delete/<int:post_id>/', views.delete_post, name='delete_post'),
    path('categories/', views.categories, name='categories'),
    path('logout/', views.logout_view, name='logout'),
    
    # API endpoints
    path('api/', include(router.urls)),
    path('api/upload-image/', views.upload_image, name='upload_image'),
    path('api/posts/<int:post_id>/toggle-status/', views.toggle_post_status, name='toggle_post_status'),
    
    # Public blog views (for portfolio integration)
    path('blog/', views.blog_list, name='blog_list'),
    path('blog/<slug:slug>/', views.blog_detail, name='blog_detail'),
    path('blog/category/<slug:category_slug>/', views.blog_by_category, name='blog_by_category'),
    path('blog/tag/<slug:tag_slug>/', views.blog_by_tag, name='blog_by_tag'),
]