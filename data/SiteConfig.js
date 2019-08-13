const config = {
  siteTitle: 'Adam Rahman',
  siteTitleShort: 'Adam Rahman',
  siteTitleAlt: 'Adam Rahman',
  siteLogo: '/logos/tania.jpg',
  siteUrl: 'https://www.adamr.io',
  repo: 'https://github.com/msradam/adamr.io',
  pathPrefix: '/adamr.io',
  dateFromFormat: 'YYYY-MM-DD',
  dateFormat: 'MMMM Do, YYYY',
  siteDescription:
    'Adam Rahman is an aspiring software engineer with interests in data science and backend development.',
  siteRss: '/rss.xml',
  googleAnalyticsID: 'UA-42068444-1',
  disqusShortname: 'adamrahman',
  postDefaultCategoryID: 'Tech',
  userName: 'Adam',
  userEmail: 'mrahmanadam@gmail.com',
  userTwitter: 'taniarascia',
  userLocation: 'Chicago, IL',
  userAvatar: 'https://api.adorable.io/avatars/150/test.png',
  userDescription: 'I love software development!',
  menuLinks: [
    { name: 'Home', link: '/' },
    {
      name: 'Me',
      link: '/me/'
    },
    {
      name: 'Resume',
      link: '/resume/'
    },
    {
      name: 'Articles',
      link: '/blog/'
    },
    {
      name: 'Contact',
      link: '/contact/'
    }
  ],
  themeColor: '#3F80FF', // Used for setting manifest and progress theme colors.
  backgroundColor: '#ffffff'
};

// Make sure pathPrefix is empty if not needed
if (config.pathPrefix === '/') {
  config.pathPrefix = '';
} else {
  // Make sure pathPrefix only contains the first forward slash
  config.pathPrefix = `/${config.pathPrefix.replace(/^\/|\/$/g, '')}`;
}

// Make sure siteUrl doesn't have an ending forward slash
if (config.siteUrl.substr(-1) === '/')
  config.siteUrl = config.siteUrl.slice(0, -1);

// Make sure siteRss has a starting forward slash
if (config.siteRss && config.siteRss[0] !== '/')
  config.siteRss = `/${config.siteRss}`;

module.exports = config;
