export interface Project {
  name: string;
  summary: string;
}

export const featuredProjects: Project[] = [
  {
    name: "pyproject-init",
    summary:
      "A command-line tool for creating modern Python projects with a consistent development setup.",
  },
  {
    name: "Game Mechanic Generator",
    summary:
      "A Godot tool for generating combinations of gameplay verbs, constraints, pressures, and goals for game-design practice.",
  },
  {
    name: "filename-manager",
    summary:
      "A Python command-line utility for batch-renaming files using configurable rules.",
  },
];