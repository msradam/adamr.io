import type { Metadata, Site, Socials } from "@types";

export const SITE: Site = {
  TITLE: "adamr.io",
  DESCRIPTION:
    "Adam M. Rahman: Senior Software Engineer on the AI/ML team at Grafana Labs, previously enterprise resiliency testing on IBM Z. Civic-AI and geospatial tools, poetry, theater, and design.",

  NUM_POSTS_ON_HOMEPAGE: 4,
  NUM_PROJECTS_ON_HOMEPAGE: 3,
};

export const HOME: Metadata = {
  TITLE: "Home",
  DESCRIPTION:
    "Adam M. Rahman: Senior Software Engineer on the AI/ML team at Grafana Labs. Civic-AI and geospatial tools, poetry, theater, and design.",
};

export const BLOG: Metadata = {
  TITLE: "Blog",
  DESCRIPTION:
    "Essays on AI infrastructure, observability, and mainframe engineering by Adam M. Rahman.",
};

export const PROJECTS: Metadata = {
  TITLE: "Dev",
  DESCRIPTION:
    "Software projects by Adam M. Rahman: civic-AI tools, mainframe load-testing extensions, and geospatial systems.",
};

export const DESIGN: Metadata = {
  TITLE: "Design",
  DESCRIPTION:
    "Graphic design for theater and film productions at Wesleyan University, plus product and interface design work.",
};

export const ABOUT: Metadata = {
  TITLE: "About",
  DESCRIPTION:
    "About Adam M. Rahman: Senior Software Engineer on the AI/ML team at Grafana Labs, previously enterprise resiliency testing and automation on IBM Z where he ported Grafana k6 to the mainframe upstream, NYU Tandon M.S. student, builder of civic-AI and geospatial tools for humanitarian use, poet and theatermaker.",
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
  {
    NAME: "Devpost",
    HREF: "https://devpost.com/msradam",
  },
];
