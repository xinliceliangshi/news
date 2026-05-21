const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

const topicSeed = [
  {
    id: 1,
    title: "蛋糕店借地震做520营销，该被立案吗",
    description: "桂林一蛋糕店借柳州5.2级地震做促销文案，被市监局立案调查。消费灾难做营销，底线在哪里？",
    sideALabel: "活该，毫无底线必须严惩",
    sideBLabel: "过度执法，只是文案翻车",
    tags: ["社会", "营销", "法律"],
    hotScore: 96,
    voteCount: 28431,
    publishedAt: new Date("2026-05-21T08:30:00.000Z"),
  },
  {
    id: 2,
    title: "\"盲人女孩盲道被撞\"系摆拍，该不该入刑",
    description: "一条引爆全网同情心的视频被证实为虚假摆拍。利用公众善意博流量，是否应该用刑法打击？",
    sideALabel: "必须入刑，社会信任已被透支",
    sideBLabel: "行政处罚即可，入刑过度",
    tags: ["社会", "法律", "短视频"],
    hotScore: 94,
    voteCount: 25180,
    publishedAt: new Date("2026-05-21T08:00:00.000Z"),
  },
  {
    id: 3,
    title: "\"520是5月折磨20天\"，解构浪漫有错吗",
    description: "一句黑色幽默文案在520当天走红，大量年轻人用它来对抗消费主义营造的甜蜜氛围。",
    sideALabel: "真实表达，凭啥非得过节",
    sideBLabel: "太丧了，生活需要仪式感",
    tags: ["情感", "消费主义", "年轻人"],
    hotScore: 90,
    voteCount: 19866,
    publishedAt: new Date("2026-05-21T07:30:00.000Z"),
  },
  {
    id: 4,
    title: "体育总局点名饭圈乱象，粉丝文化该不该进体育",
    description: "跳水、乒乓球等项目被点名存在拉踩、网暴等饭圈行为。粉丝文化到底是在推动还是伤害体育？",
    sideALabel: "必须清退，体育需要纯粹",
    sideBLabel: "饭圈带来关注和商业价值",
    tags: ["体育", "饭圈", "文化"],
    hotScore: 92,
    voteCount: 17624,
    publishedAt: new Date("2026-05-21T07:00:00.000Z"),
  },
  {
    id: 5,
    title: "Coser被近身围堵拍摄，是自由还是骚扰",
    description: "漫展现场女Coser被几十台镜头几乎贴到身上拍摄。公共场合的拍摄边界到底在哪里？",
    sideALabel: "明显是骚扰，活动方必须管",
    sideBLabel: "既然公开亮相就该接受被拍",
    tags: ["二次元", "隐私", "边界"],
    hotScore: 85,
    voteCount: 14892,
    publishedAt: new Date("2026-05-21T06:40:00.000Z"),
  },
  {
    id: 6,
    title: "服刑人员演自己罪行电影，艺术底线在哪",
    description: "一部由真实罪犯出演并重新包装其经历的电影引发众怒。艺术创作是否可以无底线美化犯罪？",
    sideALabel: "必须封杀，价值观极其扭曲",
    sideBLabel: "艺术有权呈现复杂人性",
    tags: ["电影", "艺术", "法律"],
    hotScore: 89,
    voteCount: 16231,
    publishedAt: new Date("2026-05-21T06:20:00.000Z"),
  },
  {
    id: 7,
    title: "某市地铁女士优先车厢，是真保护还是懒治理",
    description: "有城市试点女士优先车厢，一边说这是安全缓冲带，一边说这是把治理无能包装成照顾。",
    sideALabel: "用空间换安全，现实有效",
    sideBLabel: "懒政思维，把责任甩给乘客",
    tags: ["公共治理", "性别", "地铁"],
    hotScore: 97,
    voteCount: 32407,
    publishedAt: new Date("2026-05-21T06:00:00.000Z"),
  },
  {
    id: 8,
    title: "AI把用户号码标成“卖野猪”，平台该赔偿吗",
    description: "AI产品错误将普通用户电话关联成离谱标签，导致其持续遭遇陌生骚扰。AI犯错该谁买单？",
    sideALabel: "必须赔偿，AI不是免责盾",
    sideBLabel: "新事物难免出错，不必上纲上线",
    tags: ["AI", "科技", "责任"],
    hotScore: 88,
    voteCount: 18902,
    publishedAt: new Date("2026-05-21T05:40:00.000Z"),
  },
  {
    id: 9,
    title: "Linus怒斥AI漏洞报告是垃圾，AI在帮倒忙吗",
    description: "开源维护者批评大量AI生成漏洞报告质量低下，反而消耗了人工审核资源。",
    sideALabel: "AI在制造信息垃圾，帮倒忙",
    sideBLabel: "工具没错，是人用得不对",
    tags: ["AI", "开源", "技术"],
    hotScore: 82,
    voteCount: 11245,
    publishedAt: new Date("2026-05-21T05:10:00.000Z"),
  },
  {
    id: 10,
    title: "林诗栋夺冠后跳球台庆祝，是不尊重还是真性情",
    description: "世乒赛夺冠后的庆祝动作引发国外舆论争议。年轻运动员该如何表达胜利情绪才算得体？",
    sideALabel: "真情流露，年轻人有激情",
    sideBLabel: "不尊重对手和器材，过了",
    tags: ["体育", "礼仪", "国球"],
    hotScore: 86,
    voteCount: 13670,
    publishedAt: new Date("2026-05-21T04:50:00.000Z"),
  },
  {
    id: 11,
    title: "韩国总统公开批评以色列，是外交担当还是战略冒险",
    description: "针对本国公民遭遇和中东局势，总统公开批评盟友式国家，舆论分歧迅速拉大。",
    sideALabel: "硬气护国民，值得点赞",
    sideBLabel: "玩火外交，小国别站错队",
    tags: ["国际", "外交", "政治"],
    hotScore: 80,
    voteCount: 9430,
    publishedAt: new Date("2026-05-21T04:20:00.000Z"),
  },
  {
    id: 12,
    title: "赖清德周年讲话，是加剧对立还是维持现状",
    description: "周年讲话后两岸舆论再次激烈交锋，一方认为挑衅，一方认为只是重复既有立场。",
    sideALabel: "挑衅言论，破坏和平稳定",
    sideBLabel: "正常表达立场，并无不妥",
    tags: ["两岸", "政治", "时事"],
    hotScore: 91,
    voteCount: 17120,
    publishedAt: new Date("2026-05-21T03:50:00.000Z"),
  },
];

async function main() {
  for (const topic of topicSeed) {
    await prisma.topic.upsert({
      where: { id: topic.id },
      update: topic,
      create: topic,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
