const { hot } = require("react-hot-loader/root")

// prefer default export if available
const preferDefault = m => m && m.default || m


exports.components = {
  "component---src-templates-page-js": hot(preferDefault(require("/home/msradam/adamr.io/src/templates/page.js"))),
  "component---src-templates-post-js": hot(preferDefault(require("/home/msradam/adamr.io/src/templates/post.js"))),
  "component---src-templates-tag-js": hot(preferDefault(require("/home/msradam/adamr.io/src/templates/tag.js"))),
  "component---src-templates-category-js": hot(preferDefault(require("/home/msradam/adamr.io/src/templates/category.js"))),
  "component---cache-dev-404-page-js": hot(preferDefault(require("/home/msradam/adamr.io/.cache/dev-404-page.js"))),
  "component---src-pages-blog-js": hot(preferDefault(require("/home/msradam/adamr.io/src/pages/blog.js"))),
  "component---src-pages-categories-js": hot(preferDefault(require("/home/msradam/adamr.io/src/pages/categories.js"))),
  "component---src-pages-contact-js": hot(preferDefault(require("/home/msradam/adamr.io/src/pages/contact.js"))),
  "component---src-pages-index-js": hot(preferDefault(require("/home/msradam/adamr.io/src/pages/index.js"))),
  "component---src-pages-tags-js": hot(preferDefault(require("/home/msradam/adamr.io/src/pages/tags.js")))
}

