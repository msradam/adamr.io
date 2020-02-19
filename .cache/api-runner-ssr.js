var plugins = [{
      plugin: require('/home/msradam/adamr.io/node_modules/gatsby-plugin-react-helmet/gatsby-ssr'),
      options: {"plugins":[]},
    },{
      plugin: require('/home/msradam/adamr.io/node_modules/gatsby-plugin-typography/gatsby-ssr'),
      options: {"plugins":[],"pathToConfigModule":"/home/msradam/adamr.io/src/utils/typography.js"},
    },{
      plugin: require('/home/msradam/adamr.io/node_modules/gatsby-remark-images/gatsby-ssr'),
      options: {"plugins":[],"maxWidth":850},
    },{
      plugin: require('/home/msradam/adamr.io/node_modules/gatsby-remark-autolink-headers/gatsby-ssr'),
      options: {"plugins":[],"offsetY":"100","maintainCase":false,"removeAccents":true},
    },{
      plugin: require('/home/msradam/adamr.io/node_modules/gatsby-plugin-google-analytics/gatsby-ssr'),
      options: {"plugins":[],"trackingId":"UA-42068444-1"},
    },{
      plugin: require('/home/msradam/adamr.io/node_modules/gatsby-plugin-sitemap/gatsby-ssr'),
      options: {"plugins":[]},
    },{
      plugin: require('/home/msradam/adamr.io/node_modules/gatsby-plugin-manifest/gatsby-ssr'),
      options: {"plugins":[],"name":"Adam Rahman","short_name":"Adam Rahman","description":"Adam Rahman is an aspiring software engineer with interests in data science and backend development.","start_url":"/adamr.io","background_color":"#ffffff","theme_color":"#3F80FF","display":"minimal-ui","icons":[{"src":"/logos/logo-48.png","sizes":"48x48","type":"image/png"},{"src":"/logos/logo-1024.png","sizes":"1024x1024","type":"image/png"}]},
    },{
      plugin: require('/home/msradam/adamr.io/node_modules/gatsby-plugin-feed/gatsby-ssr'),
      options: {"plugins":[],"query":"\n        {\n          site {\n            siteMetadata {\n              rssMetadata {\n                site_url\n                feed_url\n                title\n                description\n                image_url\n              }\n            }\n          }\n        }\n      ","feeds":[{"query":"\n            {\n              allMarkdownRemark(\n                limit: 1000,\n                sort: { order: DESC, fields: [fields___date] },\n                filter: { frontmatter: { template: { eq: \"post\" } } }\n              ) {\n                edges {\n                  node {\n                    excerpt(pruneLength: 180)\n                    html\n                    timeToRead\n                    fields {\n                      slug\n                      date\n                    }\n                    frontmatter {\n                      title\n                      date\n                      categories\n                      tags\n                      template\n                    }\n                  }\n                }\n              }\n            }\n          ","output":"/rss.xml"}]},
    }]
// During bootstrap, we write requires at top of this file which looks like:
// var plugins = [
//   {
//     plugin: require("/path/to/plugin1/gatsby-ssr.js"),
//     options: { ... },
//   },
//   {
//     plugin: require("/path/to/plugin2/gatsby-ssr.js"),
//     options: { ... },
//   },
// ]

const apis = require(`./api-ssr-docs`)

// Run the specified API in any plugins that have implemented it
module.exports = (api, args, defaultReturn, argTransform) => {
  if (!apis[api]) {
    console.log(`This API doesn't exist`, api)
  }

  // Run each plugin in series.
  // eslint-disable-next-line no-undef
  let results = plugins.map(plugin => {
    if (!plugin.plugin[api]) {
      return undefined
    }
    const result = plugin.plugin[api](args, plugin.options)
    if (result && argTransform) {
      args = argTransform({ args, result })
    }
    return result
  })

  // Filter out undefined results.
  results = results.filter(result => typeof result !== `undefined`)

  if (results.length > 0) {
    return results
  } else {
    return [defaultReturn]
  }
}
