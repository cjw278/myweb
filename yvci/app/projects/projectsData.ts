export interface Project {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  coverImage: string;
  techStack: string[];
  links: {
    github?: string;
    gitee?: string;
    live?: string;
    docs?: string;
  };
  featured?: boolean;
  status: "active" | "archived" | "developing";
  statusLabel: string;
}

// 示例数据：请替换为你自己的项目。封面图放在 yvci/public/images/ 下并修改 coverImage 路径。
export const projects: Project[] = [
  {
    id: "example-project-a",
    name: "示例项目 A",
    description: "示例项目描述（占位，请替换）",
    longDescription:
      "这是示例项目的详细介绍，请替换为你自己的项目说明，介绍它解决了什么问题、用了哪些技术。",
    coverImage: "/images/2.webp",
    techStack: ["React", "TypeScript", "Node.js"],
    links: {
      github: "https://github.com/cjw278",
    },
    featured: true,
    status: "developing",
    statusLabel: "开发中",
  },
  {
    id: "example-project-b",
    name: "示例项目 B",
    description: "另一个示例项目（占位，请替换）",
    longDescription:
      "这是第二个示例项目，用于展示项目卡片的排版效果。替换成你自己的内容即可。",
    coverImage: "/images/1.webp",
    techStack: ["Vue", "Python", "FastAPI"],
    links: {
      live: "https://yvci.site",
    },
    featured: false,
    status: "active",
    statusLabel: "已上线",
  },
  {
    id: "example-project-c",
    name: "示例项目 C",
    description: "第三个示例项目（占位，请替换）",
    longDescription:
      "这是第三个示例项目，展示归档状态的项目卡片样式。",
    coverImage: "/images/55.webp",
    techStack: ["Go", "Docker", "PostgreSQL"],
    links: {
      docs: "https://yvci.site",
    },
    featured: false,
    status: "archived",
    statusLabel: "已归档",
  },
];
