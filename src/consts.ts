import type { Metadata, Site, Socials } from "@types";

export const SITE: Site = {
  TITLE: "adamr.io",
  DESCRIPTION:
    "Adam M. Rahman works on who gets seen, who gets counted, and the dignity of people who can't opt out, across software engineering, civic-AI, poetry, theater, and design. Senior engineer at IBM (enterprise resiliency testing and automation on IBM Z, Grafana k6 on z/OS upstream).",

  NUM_POSTS_ON_HOMEPAGE: 4,
  NUM_PROJECTS_ON_HOMEPAGE: 3,
};

export const HOME: Metadata = {
  TITLE: "Home",
  DESCRIPTION:
    "Engineer, civic-AI builder, poet, theatermaker, and designer. Adam M. Rahman works on who gets seen, who gets counted, and the dignity of people who can't opt out. Senior engineer at IBM (enterprise resiliency testing and automation on IBM Z, Grafana k6 on z/OS upstream).",
};

export const BLOG: Metadata = {
  TITLE: "Blog",
  DESCRIPTION:
    "Writing on mainframe engineering, load testing, AI infrastructure, and observability by Adam M. Rahman.",
};

export const PROJECTS: Metadata = {
  TITLE: "Dev",
  DESCRIPTION:
    "Software projects by Adam M. Rahman: civic-AI briefing systems, mainframe load-testing extensions, geospatial AI tools, and hackathon winners.",
};

export const DESIGN: Metadata = {
  TITLE: "Design",
  DESCRIPTION:
    "Graphic design for theater and film productions at Wesleyan University, plus product and interface design work.",
};

export const ABOUT: Metadata = {
  TITLE: "About",
  DESCRIPTION:
    "About Adam M. Rahman: software engineer who works on enterprise resiliency testing and automation on IBM Z and ported Grafana k6 to the mainframe upstream, NYU Tandon M.S. student, builder of civic-AI and geospatial tools for humanitarian use, poet and theatermaker.",
};

export const POETRY: Metadata = {
  TITLE: "Poetry",
  DESCRIPTION:
    "Published poems by Adam M. Rahman. Work has appeared in Barzakh Magazine, Collide-oscope (Heart on Our Sleeves Press), and Four Tulips.",
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
