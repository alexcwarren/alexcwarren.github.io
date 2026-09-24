export interface Project {
  name: string;
  slug: string;
  summary: string;
  tech: string[];
  status: string;
  repositoryUrl: string;
  featured: boolean;
  hasCaseStudy: boolean;
}

export const projects: Project[] = [
  {
    name: "pyproject-init",
    slug: "pyproject-init",
    summary:
      "A command-line tool for creating modern Python projects with a consistent development setup.",
    tech: ["Python", "Click", "Cookiecutter", "uv"],
    status: "Active",
    repositoryUrl: "https://github.com/alexcwarren/pyproject-init",
    featured: true,
    hasCaseStudy: true,
  },
  {
    name: "Game Mechanic Generator",
    slug: "game-mechanic-generator",
    summary:
      "A Godot tool for generating combinations of gameplay verbs, constraints, pressures, and goals for game-design practice.",
    tech: ["Godot", "GDScript"],
    status: "Active",
    repositoryUrl: "https://github.com/alexcwarren/game-mechanic-generator",
    featured: true,
    hasCaseStudy: false,
  },
  {
    name: "filename-manager",
    slug: "filename-manager",
    summary:
      "A Python command-line utility for batch-renaming files using configurable rules.",
    tech: ["Python", "CLI"],
    status: "Released",
    repositoryUrl: "https://github.com/alexcwarren/filename-manager",
    featured: true,
    hasCaseStudy: false,
  },
];

export const featuredProjects = projects.filter((project) => project.featured);