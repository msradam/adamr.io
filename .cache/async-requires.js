// prefer default export if available
const preferDefault = m => m && m.default || m

exports.components = {
  "component---src-templates-post-js": () => import("./../src/templates/post.js" /* webpackChunkName: "component---src-templates-post-js" */),
  "component---src-templates-page-js": () => import("./../src/templates/page.js" /* webpackChunkName: "component---src-templates-page-js" */),
  "component---src-templates-tag-js": () => import("./../src/templates/tag.js" /* webpackChunkName: "component---src-templates-tag-js" */),
  "component---src-templates-category-js": () => import("./../src/templates/category.js" /* webpackChunkName: "component---src-templates-category-js" */),
  "component---cache-dev-404-page-js": () => import("./dev-404-page.js" /* webpackChunkName: "component---cache-dev-404-page-js" */),
  "component---src-pages-blog-js": () => import("./../src/pages/blog.js" /* webpackChunkName: "component---src-pages-blog-js" */),
  "component---src-pages-categories-js": () => import("./../src/pages/categories.js" /* webpackChunkName: "component---src-pages-categories-js" */),
  "component---src-pages-contact-js": () => import("./../src/pages/contact.js" /* webpackChunkName: "component---src-pages-contact-js" */),
  "component---src-pages-index-js": () => import("./../src/pages/index.js" /* webpackChunkName: "component---src-pages-index-js" */),
  "component---src-pages-tags-js": () => import("./../src/pages/tags.js" /* webpackChunkName: "component---src-pages-tags-js" */)
}

