from django.shortcuts import render, get_object_or_404, redirect
from django.contrib import messages
from django.contrib.auth import logout, authenticate, login
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator
from django.db.models import Q
from django.http import JsonResponse
from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Post, Category, Tag
from .serializers import PostSerializer, CategorySerializer, TagSerializer


# Category Management Views
@login_required
def categories(request):
    """Category management page with AJAX support"""
    if request.method == 'POST':
        action = request.POST.get('action')
        
        try:
            if action == 'add':
                name = request.POST.get('name')
                description = request.POST.get('description', '')
                
                if not name:
                    return JsonResponse({'success': False, 'error': 'Category name is required'})
                
                if Category.objects.filter(name=name).exists():
                    return JsonResponse({'success': False, 'error': 'Category with this name already exists'})
                
                category = Category.objects.create(
                    name=name,
                    description=description
                )
                return JsonResponse({'success': True, 'message': 'Category created successfully'})
            
            elif action == 'edit':
                category_id = request.POST.get('category_id')
                name = request.POST.get('name')
                description = request.POST.get('description', '')
                
                if not name:
                    return JsonResponse({'success': False, 'error': 'Category name is required'})
                
                if not category_id or not category_id.strip():
                    return JsonResponse({'success': False, 'error': 'Category ID is required'})
                
                category = get_object_or_404(Category, id=category_id)
                
                # Check if name already exists (excluding current category)
                if Category.objects.filter(name=name).exclude(id=category_id).exists():
                    return JsonResponse({'success': False, 'error': 'Category with this name already exists'})
                
                category.name = name
                category.description = description
                category.save()
                
                return JsonResponse({'success': True, 'message': 'Category updated successfully'})
            
            elif action == 'delete':
                category_id = request.POST.get('category_id')
                
                if not category_id or not category_id.strip():
                    return JsonResponse({'success': False, 'error': 'Category ID is required'})
                
                category = get_object_or_404(Category, id=category_id)
                
                # Check if category has posts
                if category.posts.exists():
                    return JsonResponse({
                        'success': False, 
                        'error': f'Cannot delete category "{category.name}" because it has {category.posts.count()} posts. Please move or delete the posts first.'
                    })
                
                category.delete()
                return JsonResponse({'success': True, 'message': 'Category deleted successfully'})
            
            else:
                return JsonResponse({'success': False, 'error': 'Invalid action'})
                
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})
    
    # GET request - show categories page
    # Simplified query to debug recursion error
    categories = Category.objects.all().order_by('name')
    
    # Add published_count manually to avoid potential query issues
    for category in categories:
        category.published_count = category.posts.filter(status='published').count()
    
    context = {'categories': categories}
    return render(request, 'blog/categories.html', context)


# Dashboard Views
@login_required
def dashboard(request):
    """Main dashboard view"""
    posts = Post.objects.all().order_by('-created_at')[:10]
    categories = Category.objects.all()
    tags = Tag.objects.all()
    
    # Statistics
    total_posts = Post.objects.count()
    published_posts = Post.objects.filter(status='published').count()
    draft_posts = Post.objects.filter(status='draft').count()
    
    context = {
        'posts': posts,
        'categories': categories,
        'tags': tags,
        'total_posts': total_posts,
        'published_posts': published_posts,
        'draft_posts': draft_posts,
    }
    return render(request, 'blog/dashboard.html', context)


@login_required
def create_post(request):
    """Create new blog post"""
    if request.method == 'POST':
        # Handle form submission
        title = request.POST.get('title')
        content = request.POST.get('content')
        excerpt = request.POST.get('excerpt')
        category_id = request.POST.get('category')
        tag_ids = request.POST.getlist('tags')
        status = request.POST.get('status', 'draft')
        featured_image = request.FILES.get('featured_image')
        
        # Handle empty strings for foreign key fields
        category_id = category_id if category_id and category_id.strip() else None
        tag_ids = [tag_id for tag_id in tag_ids if tag_id and tag_id.strip()]
        
        # Create post
        post = Post.objects.create(
            title=title,
            content=content,
            excerpt=excerpt,
            category_id=category_id,
            status=status,
            featured_image=featured_image,
            author=request.user if request.user.is_authenticated else None
        )
        
        # Add tags
        if tag_ids:
            post.tags.set(tag_ids)
        
        messages.success(request, 'Post created successfully!')
        return redirect('blog:dashboard')
    
    # GET request - show form
    categories = Category.objects.all()
    tags = Tag.objects.all()
    context = {
        'categories': categories,
        'tags': tags,
    }
    return render(request, 'blog/create_post.html', context)


@login_required
def edit_post(request, post_id):
    """Edit existing blog post"""
    post = get_object_or_404(Post, id=post_id)
    
    if request.method == 'POST':
        # Handle form submission
        post.title = request.POST.get('title')
        post.content = request.POST.get('content')
        post.excerpt = request.POST.get('excerpt')
        category_id = request.POST.get('category')
        # Handle empty string for category_id
        post.category_id = category_id if category_id and category_id.strip() else None
        tag_ids = request.POST.getlist('tags')
        # Filter out empty tag IDs
        tag_ids = [tag_id for tag_id in tag_ids if tag_id and tag_id.strip()]
        post.status = request.POST.get('status', 'draft')
        
        if request.FILES.get('featured_image'):
            post.featured_image = request.FILES.get('featured_image')
        
        post.save()
        
        # Update tags
        if tag_ids:
            post.tags.set(tag_ids)
        
        messages.success(request, 'Post updated successfully!')
        return redirect('blog:dashboard')
    
    # GET request - show form
    categories = Category.objects.all()
    tags = Tag.objects.all()
    context = {
        'post': post,
        'categories': categories,
        'tags': tags,
    }
    return render(request, 'blog/edit_post.html', context)


@login_required
def preview_post(request, post_id):
    """Preview blog post"""
    post = get_object_or_404(Post, id=post_id)
    context = {'post': post}
    return render(request, 'blog/preview_post.html', context)


@login_required
def delete_post(request, post_id):
    """Delete blog post"""
    post = get_object_or_404(Post, id=post_id)
    
    if request.method == 'POST':
        post.delete()
        messages.success(request, 'Post deleted successfully!')
        return redirect('blog:dashboard')
    
    context = {'post': post}
    return render(request, 'blog/delete_post.html', context)


# API Views
class PostViewSet(viewsets.ModelViewSet):
    """API ViewSet for Posts"""
    queryset = Post.objects.all().order_by('-created_at')
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        queryset = Post.objects.all().order_by('-created_at')
        status = self.request.query_params.get('status')
        category = self.request.query_params.get('category')
        search = self.request.query_params.get('search')
        
        if status:
            queryset = queryset.filter(status=status)
        if category:
            queryset = queryset.filter(category__slug=category)
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) | 
                Q(content__icontains=search) |
                Q(excerpt__icontains=search)
            )
        
        return queryset
    
    @action(detail=True, methods=['post'])
    def toggle_status(self, request, pk=None):
        """Toggle post status between draft and published"""
        post = self.get_object()
        post.status = 'published' if post.status == 'draft' else 'draft'
        if post.status == 'published':
            post.published_at = timezone.now()
        post.save()
        return Response({'status': post.status})


class CategoryViewSet(viewsets.ModelViewSet):
    """API ViewSet for Categories"""
    queryset = Category.objects.all().order_by('name')
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class TagViewSet(viewsets.ModelViewSet):
    """API ViewSet for Tags"""
    queryset = Tag.objects.all().order_by('name')
    serializer_class = TagSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


@api_view(['POST'])
def upload_image(request):
    """Handle image upload for blog posts"""
    if 'image' not in request.FILES:
        return Response({'error': 'No image provided'}, status=status.HTTP_400_BAD_REQUEST)
    
    image_file = request.FILES['image']
    
    # Validate image
    try:
        img = Image.open(image_file)
        img.verify()
    except Exception:
        return Response({'error': 'Invalid image file'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Save image (you might want to implement proper file handling here)
    # For now, we'll return a mock response
    return Response({
        'url': f'/media/uploads/{image_file.name}',
        'name': image_file.name,
        'size': image_file.size
    })


@api_view(['POST'])
def toggle_post_status(request, post_id):
    """Toggle post status via API"""
    try:
        post = Post.objects.get(id=post_id)
        post.status = 'published' if post.status == 'draft' else 'draft'
        if post.status == 'published':
            post.published_at = timezone.now()
        post.save()
        return Response({'status': post.status, 'message': f'Post {post.status} successfully'})
    except Post.DoesNotExist:
        return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)


# Public Blog Views (for portfolio integration)
def blog_list(request):
    """Public blog listing"""
    posts = Post.objects.filter(status='published').order_by('-published_at')
    
    # Pagination
    paginator = Paginator(posts, 10)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    context = {
        'posts': page_obj,
        'categories': Category.objects.all(),
        'tags': Tag.objects.all(),
    }
    return render(request, 'blog/blog_list.html', context)


def blog_detail(request, slug):
    """Public blog post detail"""
    post = get_object_or_404(Post, slug=slug, status='published')
    
    # Increment views
    post.views += 1
    post.save(update_fields=['views'])
    
    context = {'post': post}
    return render(request, 'blog/blog_detail.html', context)


def blog_by_category(request, category_slug):
    """Blog posts by category"""
    category = get_object_or_404(Category, slug=category_slug)
    posts = Post.objects.filter(category=category, status='published').order_by('-published_at')
    
    paginator = Paginator(posts, 10)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    context = {
        'posts': page_obj,
        'category': category,
        'categories': Category.objects.all(),
    }
    return render(request, 'blog/blog_by_category.html', context)


def blog_by_tag(request, tag_slug):
    """Blog posts by tag"""
    tag = get_object_or_404(Tag, slug=tag_slug)
    posts = Post.objects.filter(tags=tag, status='published').order_by('-published_at')
    
    paginator = Paginator(posts, 10)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    context = {
        'posts': page_obj,
        'tag': tag,
        'tags': Tag.objects.all(),
    }
    return render(request, 'blog/blog_by_tag.html', context)


def login_view(request):
    """Handle user login"""
    if request.user.is_authenticated:
        return redirect('blog:dashboard')
    
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            login(request, user)
            messages.success(request, f'Welcome back, {user.username}!')
            next_url = request.GET.get('next', 'blog:dashboard')
            return redirect(next_url)
        else:
            messages.error(request, 'Invalid username or password.')
    
    return render(request, 'blog/login.html')


def logout_view(request):
    """Handle user logout"""
    logout(request)
    messages.success(request, 'You have been successfully logged out.')
    return redirect('blog:login')


def portfolio_view(request):
    """Serve the portfolio landing page"""
    from django.http import HttpResponse, Http404
    from django.conf import settings
    import os
    
    portfolio_path = os.path.join(settings.BASE_DIR, '..', 'index.html')
    
    try:
        with open(portfolio_path, 'r', encoding='utf-8') as file:
            content = file.read()
            
        # Update the CSS and JS paths to use Django URLs
        content = content.replace('href="styles.css"', 'href="/portfolio/styles.css"')
        content = content.replace('src="script.js"', 'src="/portfolio/script.js"')
        
        return HttpResponse(content, content_type='text/html')
    except FileNotFoundError:
        raise Http404("Portfolio page not found")


def portfolio_static(request, file_path):
    """Serve static files for the portfolio"""
    from django.http import FileResponse, Http404
    from django.conf import settings
    import os
    import mimetypes
    
    # Map file paths to their locations in the static directory
    if file_path == 'styles.css':
        static_file_path = os.path.join(settings.BASE_DIR, 'static', 'css', 'styles.css')
    elif file_path == 'script.js':
        static_file_path = os.path.join(settings.BASE_DIR, 'static', 'js', 'script.js')
    else:
        static_file_path = os.path.join(settings.BASE_DIR, '..', file_path)
    
    if not os.path.exists(static_file_path):
        raise Http404("Static file not found")
    
    # Get the correct content type
    content_type, _ = mimetypes.guess_type(static_file_path)
    if content_type is None:
        content_type = 'application/octet-stream'
    
    try:
        return FileResponse(open(static_file_path, 'rb'), content_type=content_type)
    except FileNotFoundError:
        raise Http404("Static file not found")
