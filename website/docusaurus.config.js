// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Ionic Enterprise Starter",
  tagline:
    "The foundation for your next enterprise cross-platform application.",
  url: "https://your-docusaurus-test-site.com",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon-32x32.png",
  organizationName: "ionic-team",
  projectName: "ionic-enterprise-starter",

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl:
            "https://github.com/ionic-team/ionic-enterprise-starter/tree/main/website/",
        },
        blog: false,
        pages: false,
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: "Ionic Enterprise Starter",
        logo: {
          alt: "Ionic Logo",
          // src: "img/logo.svg",
          src: "https://images.prismic.io/ionicframeworkcom/66cfdbef-e59d-463a-8e24-12cb233e9d97_ionic+logo+blue.png",
        },
        items: [
          {
            type: "doc",
            docId: "overview",
            position: "left",
            label: "Tutorial",
          },
          // { to: "/blog", label: "Blog", position: "left" },
          // {
          //   href: "https://github.com/facebook/docusaurus",
          //   label: "GitHub",
          //   position: "right",
          // }
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
      },
    }),
};

module.exports = config;
