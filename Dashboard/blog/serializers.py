from rest_framework import serializers
from .models import Post, Category, Tag


class CategorySerializer(serializers.ModelSerializer):
    post_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'post_count', 'created_at']
        read_only_fields = ['slug', 'created_at']
    
    def get_post_count(self, obj):
        return obj.posts.count()


class TagSerializer(serializers.ModelSerializer):
    post_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Tag
        fields = ['id', 'name', 'slug', 'post_count', 'created_at']
        read_only_fields = ['slug', 'created_at']
    
    def get_post_count(self, obj):
        return obj.posts.count()


class PostSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.username', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    tag_names = serializers.SerializerMethodField()
    reading_time = serializers.ReadOnlyField()
    featured_image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Post
        fields = [
            'id', 'title', 'slug', 'excerpt', 'content', 'status',
            'featured_image', 'featured_image_url', 'author', 'author_name',
            'category', 'category_name', 'tags', 'tag_names',
            'views', 'reading_time', 'created_at', 'updated_at', 'published_at'
        ]
        read_only_fields = ['slug', 'author', 'views', 'created_at', 'updated_at', 'published_at']
    
    def get_tag_names(self, obj):
        return [tag.name for tag in obj.tags.all()]
    
    def get_featured_image_url(self, obj):
        if obj.featured_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.featured_image.url)
            return obj.featured_image.url
        return None
    
    def create(self, validated_data):
        # Set author from request user
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            validated_data['author'] = request.user
        return super().create(validated_data)


class PostListSerializer(serializers.ModelSerializer):
    """Simplified serializer for post listings"""
    author_name = serializers.CharField(source='author.username', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    tag_count = serializers.SerializerMethodField()
    featured_image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Post
        fields = [
            'id', 'title', 'slug', 'excerpt', 'status',
            'featured_image_url', 'author_name', 'category_name',
            'tag_count', 'views', 'reading_time', 'created_at', 'updated_at'
        ]
    
    def get_tag_count(self, obj):
        return obj.tags.count()
    
    def get_featured_image_url(self, obj):
        if obj.featured_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.featured_image.url)
            return obj.featured_image.url
        return None