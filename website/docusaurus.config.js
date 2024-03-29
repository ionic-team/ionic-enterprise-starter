// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Ionic Secure Solutions Starter',
  tagline: 'The foundation for your next enterprise cross-platform application.',
  url: 'https://ionic.io',
  trailingSlash: false,
  baseUrl: '/docs/enterprise-starter/',
  baseUrlIssueBanner: false,
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon-32x32.png',
  organizationName: 'ionic-team',
  projectName: 'ionic-enterprise-starter',
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'Ionic Secure Solutions Starter',
        logo: {
          alt: 'Ionic Logo',
          // src: "img/logo.svg",
          src: 'https://images.prismic.io/ionicframeworkcom/66cfdbef-e59d-463a-8e24-12cb233e9d97_ionic+logo+blue.png',
        },
        items: [
          {
            type: 'doc',
            docId: 'overview',
            position: 'left',
            label: 'Tutorial',
          },
          // { to: "/blog", label: "Blog", position: "left" },
          // {
          //   href: "https://github.com/facebook/docusaurus",
          //   label: "GitHub",
          //   position: "right",
          // },
        ],
      },
      // footer: {
      //   style: "dark",
      //   links: [
      //     {
      //       title: "Docs",
      //       items: [
      //         {
      //           label: "Tutorial",
      //           to: "/docs/intro",
      //         },
      //       ],
      //     },
      //     {
      //       title: "Community",
      //       items: [
      //         {
      //           label: "Stack Overflow",
      //           href: "https://stackoverflow.com/questions/tagged/docusaurus",
      //         },
      //         {
      //           label: "Discord",
      //           href: "https://discordapp.com/invite/docusaurus",
      //         },
      //         {
      //           label: "Twitter",
      //           href: "https://twitter.com/docusaurus",
      //         },
      //       ],
      //     },
      //     {
      //       title: "More",
      //       items: [
      //         {
      //           label: "Blog",
      //           to: "/blog",
      //         },
      //         {
      //           label: "GitHub",
      //           href: "https://github.com/facebook/docusaurus",
      //         },
      //       ],
      //     },
      //   ],
      //   copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`,
      // },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: [],
      },
      colorMode: {
        respectPrefersColorScheme: true,
      },
      tagManager: {
        trackingID: 'GTM-TKMGCBC',
      },
    }),
  plugins: ['@ionic-internal/docusaurus-plugin-tag-manager', 'docusaurus-plugin-sass'],
  themes: ['@ionic-internal/docusaurus-theme'],
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: 'https://github.com/ionic-team/ionic-enterprise-starter/tree/main/website/',
        },
        blog: false,
        pages: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};

module.exports = config;
