import type { Metadata, Site, Socials } from "@types";

export const SITE: Site = {
  TITLE: "adamr.io",
  DESCRIPTION: "Software engineer, designer, and theatermaker.",

  NUM_POSTS_ON_HOMEPAGE: 5,
  NUM_PROJECTS_ON_HOMEPAGE: 3,
};

export const HOME: Metadata = {
  TITLE: "Home",
  DESCRIPTION:
    "Adam M. Rahman – software engineer, designer, and theatermaker.",
};

export const BLOG: Metadata = {
  TITLE: "Writings",
  DESCRIPTION: "Essays and articles on technology, history, and theater.",
};

export const PROJECTS: Metadata = {
  TITLE: "Projects",
  DESCRIPTION:
    "A collection of projects in geospatial AI, mainframe modernization, and computational social justice.",
};

export const DESIGN: Metadata = {
  TITLE: "Design",
  DESCRIPTION: "Graphic design work for theater and film productions.",
};

export const ABOUT: Metadata = {
  TITLE: "About",
  DESCRIPTION: "About Adam M. Rahman.",
};

export const POETRY: Metadata = {
  TITLE: "Poetry",
  DESCRIPTION: "Published poems by Adam M. Rahman.",
};

export const SOCIALS: Socials = [
  {
    NAME: "GitHub",
    HREF: "https://github.com/msradam",
  },
  {
    NAME: "LinkedIn",
    HREF: "https://linkedin.com/in/adamsrahman",
  },
  {
    NAME: "Medium",
    HREF: "https://medium.com/@msradam",
  },
];
