// siteConfig.ts - 全站配置中心

export const siteConfig = {
  // 网站标题与博主信息
  title: "羽辞の小站",
  url: "https://yvci.site",
  authorName: "羽辞",
  bio: "我们的愿望是~世界和平~",

  // 头像设置
  avatarUrl: "/images/avatar.jpg",

  // 背景设置
  useGradient: false,
  themeColors: ["#a18cd1", "#fbc2eb", "#a1c4fd", "#c2e9fb"],
  bgImages: [
    "/images/1.webp",
    "/images/42.webp",
    "/images/20.webp",
    "/images/36.webp",
    "/images/39.webp",
    "/images/41.webp",
  ],

  // 默认封面图
  defaultPostCover: "/images/2.webp",

  // 照片墙预览图
  photoWallImage: "/images/1.webp",

  // 云音乐配置（网易云音乐）
  // 填歌单 ID 则自动拉取整个歌单，填歌曲 ID 列表则只播放指定歌曲
  cloudMusicPlaylistId: "17663407281",  // 歌单 ID（优先）
  cloudMusicIds: [],                     // 歌曲 ID 列表（歌单为空时使用）

  // 后端 API 地址（留空，开发通过 next.config.ts rewrites 代理，生产通过 Nginx 反代）
  apiBaseUrl: "",

  // 社交链接
  social: {
    github: "https://github.com/cjw278/myweb",
    gitee: "https://gitee.com/yvciaaa/myweb.git",
    google: "mailto:2517361789@qq.com",
    email: "2517361789@qq.com",
    qq: "2517361789",
    wechat: "16673281631",
  },

  // 站点信息
  buildDate: "2026-08-13T09:00:00",
  footerBadges: [
    { name: "Next.js 15", color: "text-sky-500" },
    { name: "React 19", color: "text-cyan-400" },
    { name: "Tailwind 4", color: "text-teal-400" },
  ],
  icpConfig: {
    name: "湘ICP备2026010021号-1",
    link: "https://beian.miit.gov.cn/",
  },
  moeIcpConfig: {
    name: "",
    link: "",
  },

  // 分类标题
  chatterTitle: "留言",
  chatterDescription: "生活、技术、随想的碎片记录",
};
