# Blog Search

Tab: Resources
Source: https://app.getguru.com/folders/c57G5aoi/Webflow?activeCard=2fa02ec6-6e23-49a0-a434-3c3b3aba94f6
Updated: 2026-05-13T05:55:40.826Z

## Overview
This setup enables **client-side blog filtering and pagination** using Vue.js in a Webflow page. It loads blogs from multiple `Collection Lists`, pushes them into a global `allBlogs` array, and dynamically renders paginated results based on the search query.

## Components Breakdown

### 1. **Blog Data Collection (allBlogs)**
- Use **20 Collection Lists** (100 items each) so total of 2000 collection item to cover all CMS blogs and future blogs that will be added.
- 
- Each Collection Item includes a `<script>` tag that pushes its data into the global `allBlogs` array:
- 

### 2. **Vue Root Component**

```

const { createApp } = Vue;

const RootComponent = {
  data() {
    return {
      allBlogs: allBlogs,
      searchQuery: "",
      currentPage: 1,
      pageSize: 20
    };
  },
  computed: {
    filteredBlogs() {
      if (!this.searchQuery.trim()) {
        return this.allBlogs;
      }

      const queryWords = this.searchQuery
        .toLowerCase()
        .split(" ")
        .filter(word => word);

      return this.allBlogs
        .map(blog => {
          const combinedText = `${blog.title} ${blog.summary} ${blog.category}`.toLowerCase();  
          const matchCount = queryWords.reduce((count, word) => {
            return combinedText.includes(word) ? count + 1 : count;
          }, 0);
          return { blog, matchCount };
        })
        .filter(entry => entry.matchCount > 0)
        .sort((a, b) => b.matchCount - a.matchCount)
        .map(entry => entry.blog);
    },
    totalPages() {
      return Math.ceil(this.filteredBlogs.length / this.pageSize);
    },
    paginatedBlogs() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.filteredBlogs.slice(start, start + this.pageSize);
    }
  },
  methods: {
    updateUrlParams() {
      const params = new URLSearchParams();
      if (this.searchQuery.trim()) {
        params.set("q", this.searchQuery.trim());
      }
      if (this.currentPage > 1) {
        params.set("page", this.currentPage.toString());
      }
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState({}, "", newUrl);
    },
    searchBlog() {
      this.currentPage = 1;
      this.updateUrlParams();
    },
    goToPage(page) {
      if (page >= 1 && page  1) {
        this.currentPage--;
        this.updateUrlParams();
      }
    },
    generateBlogLink(blog) {
      return `/blog/${blog.slug}`;  
    },
    generateBlogCategoryLink(blog) {
      return `/blog-categories/${blog.categorySlug}`; 
    }
  },
  mounted() {
    this.$watch("currentPage", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    const page = parseInt(params.get("page"), 10);

    if (q) {
      this.searchQuery = q;
    }
    if (!isNaN(page) && page > 0) {
      this.currentPage = page;
    }
  }
};

createApp(RootComponent).mount("#blog-search-app");

```

### 3. **Search Field (HTML Embed)**
For the search query and search field added this html is custom code.

```

## Search results for "{{searchQuery}}"

```

### 4. **Blog Results DOM (Rendered by Vue)**

```

  
    
    
      [
        
        
          {{ blog.category }}
        
      ](generateBlogLink(blog))
      
      
## 
        [
          {{ blog.title }}
        ](generateBlogLink(blog))
      

    

    
    
      
      
## 
        [
          {{ blog.title }}
        ](generateBlogLink(blog))
      

      

      [
        Read Article
      ](generateBlogLink(blog))
    
  

 1"
>
  
  
    
      
    
    Previous
  

  
  
    
      {{ page }}
    
  

  
  
    Next
    
      
    
  

```

### 5. **Pagination Navigation**

```

 1"
>
  
  
    
      
    
    Previous
  

  
  
    
      {{ page }}
    
  

  
  
    Next
    
      
    
  

```
