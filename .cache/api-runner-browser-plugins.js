module.exports = [{
      plugin: require('../node_modules/gatsby-plugin-twitter/gatsby-browser.js'),
      options: {"plugins":[]},
    },{
      plugin: require('../node_modules/gatsby-plugin-typography/gatsby-browser.js'),
      options: {"plugins":[],"pathToConfigModule":"/home/msradam/adamr.io/src/utils/typography.js"},
    },{
      plugin: require('../node_modules/gatsby-remark-images/gatsby-browser.js'),
      options: {"plugins":[],"maxWidth":850},
    },{
      plugin: require('../node_modules/gatsby-remark-autolink-headers/gatsby-browser.js'),
      options: {"plugins":[],"offsetY":"100","maintainCase":false,"removeAccents":true},
    },{
      plugin: require('../node_modules/gatsby-plugin-google-analytics/gatsby-browser.js'),
      options: {"plugins":[],"trackingId":"UA-42068444-1"},
    },{
      plugin: require('../node_modules/gatsby-plugin-nprogress/gatsby-browser.js'),
      options: {"plugins":[],"color":"#3F80FF"},
    },{
      plugin: require('../node_modules/gatsby-plugin-catch-links/gatsby-browser.js'),
      options: {"plugins":[]},
    },{
      plugin: require('../node_modules/gatsby-plugin-manifest/gatsby-browser.js'),
      options: {"plugins":[],"name":"Adam Rahman","short_name":"Adam Rahman","description":"Adam Rahman is an aspiring software engineer with interests in data science and backend development.","start_url":"/adamr.io","background_color":"#ffffff","theme_color":"#3F80FF","display":"minimal-ui","icons":[{"src":"/logos/logo-48.png","sizes":"48x48","type":"image/png"},{"src":"/logos/logo-1024.png","sizes":"1024x1024","type":"image/png"}]},
    },{
      plugin: require('../gatsby-browser.js'),
      options: {"plugins":[]},
    }]
