// 全站内容数据：五个模块 · 子模块 · 条目
const img = (p) => import.meta.env.BASE_URL + "images/" + p;

export const MODULES = [
  {
    id: "racing",
    theme: "garage",
    issue: "卷一",
    zh: "赛道竞速",
    en: "Racing",
    tagline: "车库里的速度信仰",
    desc: "F1 与 GT3，追过的车队与车手",
    cover: img("racing/f1/mercedes-spray.jpg"),
    accentWord: "GARAGE",
  },
  {
    id: "cars",
    theme: "showroom",
    issue: "卷二",
    zh: "性能街车",
    en: "Performance",
    tagline: "展厅中央的机械艺术品",
    desc: "德系高性能、超跑与北欧的沃尔沃",
    cover: img("cars/amg/amg-gt-black.jpg"),
    accentWord: "SHOWROOM",
  },
  {
    id: "bikes",
    theme: "peloton",
    issue: "卷三",
    zh: "公路自行车",
    en: "Cycling",
    tagline: "两轮之上的轻与快",
    desc: "近两年各大品牌的旗舰公路车",
    cover: img("bikes/bike-tarmac-sl8.jpg"),
    accentWord: "PELOTON",
  },
  {
    id: "photo",
    theme: "gallery",
    issue: "卷四",
    zh: "摄影",
    en: "Photography",
    tagline: "取景框里的世界",
    desc: "尼康微单与胶片相机，以及我的作品",
    cover: img("photos/wildlife/flamingo.jpg"),
    accentWord: "GALLERY",
  },
  {
    id: "aqua",
    theme: "underwater",
    issue: "卷五",
    zh: "观赏鱼",
    en: "Aquarium",
    tagline: "一方水族的小宇宙",
    desc: "灯科鱼、异形鱼与南美缸造景",
    cover: img("fish/aquascape/aquascape-south-american-1.jpg"),
    accentWord: "AQUARIUM",
  },
];

export const RACING = {
  heroImage: img("racing/f1/redbull-donut.jpg"),
  intro:
    "从周末清晨的排位赛到耐力赛的漫长黄昏，方程式与 GT 是同一件事的两面：极致的工程，与极致的人。",
  f1: {
    cars: [
      { name: "Red Bull RB20", team: "Oracle Red Bull Racing", img: img("racing/f1/f1-redbull-car.jpg"), note: "2024 赛季统治级赛车" },
      { name: "Ferrari SF-24", team: "Scuderia Ferrari", img: img("racing/f1/f1-ferrari-car.jpg"), note: "跃马红色风暴，勒克莱尔座驾" },
      { name: "McLaren MCL38", team: "McLaren F1 Team", img: img("racing/f1/f1-mclaren-car.jpg"), note: "木瓜橙的复兴之作" },
      { name: "Mercedes W 系", team: "Mercedes-AMG Petronas", img: img("racing/f1/mercedes-track.jpg"), note: "银箭涂装，混合动力时代的主旋律" },
      { name: "双雄插画", team: "Verstappen & Hamilton", img: img("racing/f1/art-verstappen-hamilton.jpg"), note: "水彩风格的围场双雄" },
      { name: "Halo 座舱", team: "安全结构细节", img: img("racing/f1/mercedes-halo-detail.jpg"), note: "安全与美学的平衡之作" },
      { name: "雨中银箭", team: "Wet Conditions", img: img("racing/f1/mercedes-spray.jpg"), note: "雨雾里最迷人的水花" },
      { name: "夜赛灯光下", team: "Night Race", img: img("racing/f1/mercedes-night.jpg"), note: "新加坡式夜赛的光影" },
      { name: "速度的残影", team: "Panning Shot", img: img("racing/f1/mercedes-blur.jpg"), note: "慢门追随拍摄的流动感" },
    ],
    drivers: [
      { name: "Lewis Hamilton", zh: "刘易斯·汉密尔顿", img: img("racing/drivers/hamilton-portrait.jpg"), facts: ["F1 史上胜场最多", "7 届世界冠军", "梅赛德斯白银时代核心"] },
      { name: "Max Verstappen", zh: "马克斯·维斯塔潘", img: img("racing/f1/f1-verstappen-portrait.jpg"), facts: ["连续四年世界冠军", "红牛王朝的绝对核心"] },
      { name: "Charles Leclerc", zh: "夏尔·勒克莱尔", img: img("racing/f1/f1-leclerc-portrait.jpg"), facts: ["法拉利主场之子", "摩纳哥周末的王者"] },
      { name: "Lando Norris", zh: "兰多·诺里斯", img: img("racing/f1/f1-norris-portrait.jpg"), facts: ["迈凯伦复兴的旗手", "木瓜橙的新时代"] },
      { name: "Kimi Antonelli", zh: "基米·安东内利", img: img("racing/f1/f1-antonelli-portrait.jpg"), facts: ["梅赛德斯青训天才", "F1 史上最年轻分站冠军挑战者"] },
      { name: "George Russell", zh: "乔治·拉塞尔", img: img("racing/drivers/russell-paddock.jpg"), facts: ["梅赛德斯现任主力", "稳定的圈速机器"] },
      { name: "100 WINS", zh: "百胜纪念", img: img("racing/drivers/hamilton-100wins.jpg"), facts: ["2021 年俄罗斯站", "F1 首位百胜车手"] },
      { name: "Classic Era", zh: "经典年代", img: img("racing/drivers/vintage-warsteiner.jpg"), facts: ["旧日车手服与赞助商徽章", "F1 的黄金岁月"] },
    ],
  },
  gt3: {
    cars: [
      { name: "Porsche 911 GT3", img: img("racing/gt3/porsche-911gt3-rear.jpg"), note: "街道与赛道双栖的图腾" },
      { name: "911 GT3 R", img: img("racing/gt3/gt3-porsche-911r.jpg"), note: "夜赛里的保时捷客户赛车" },
      { name: "Mercedes-AMG GT3", img: img("racing/gt3/gt3-amg.jpg"), note: "V8 咆哮的耐力传奇" },
      { name: "BMW M4 GT3", img: img("racing/gt3/gt3-bmw-m4.jpg"), note: "大鼻孔的新一代战车" },
      { name: "Ferrari 296 GT3", img: img("racing/gt3/gt3-ferrari-296.jpg"), note: "混动时代的跃马回归" },
      { name: "Aston Martin Vantage GT3", img: img("racing/gt3/gt3-aston-martin.jpg"), note: "英国绿的性能美学" },
      { name: "911 GT3 插画", img: img("racing/gt3/porsche-911gt3-art.jpg"), note: "蓝涂装的经典侧影" },
      { name: "GT 赛道航拍", img: img("racing/gt3/gt-car-aerial.jpg"), note: "俯瞰赛道的几何美感" },
    ],
    atmosphere: img("racing/gt3/gt3-race-atmosphere.jpg"),
  },
};

export const CARS = {
  heroImage: img("cars/amg/amg-gt-black.jpg"),
  intro:
    "德系工程师把性能车做成日常可用的精密仪器，超跑是想象力的上限，而沃尔沃证明了性能之外还有一种冷静的豪华。",
  german: [
    {
      brand: "Mercedes-AMG",
      slogan: "One Man, One Engine",
      cars: [
        { name: "AMG GT 黑武士", img: img("cars/amg/amg-gt-black.jpg"), note: "前中置 V8，双门旗舰" },
        { name: "AMG C63", img: img("cars/amg/amg-c63.jpg"), note: "高性能轿车的标尺" },
        { name: "AMG GT 四门", img: img("cars/amg/amg-gt63.jpg"), note: "四门轿跑的性能天花板" },
        { name: "AMG A45 S", img: img("cars/amg/amg-a45.jpg"), note: "最凶的小钢炮之一" },
      ],
    },
    {
      brand: "BMW M",
      slogan: "Sheer Driving Pleasure",
      cars: [
        { name: "M3 (G80)", img: img("cars/bmw-m/bmw-m3-g80.jpg"), note: "大嘴格栅与直六咆哮" },
        { name: "M4 (G82)", img: img("cars/bmw-m/bmw-m4-g82.jpg"), note: "双门轿跑的锋利线条" },
        { name: "M5 (G90)", img: img("cars/bmw-m/bmw-m5-g90.jpg"), note: "混动时代的超级行政车" },
      ],
    },
    {
      brand: "Audi RS",
      slogan: "Vorsprung durch Technik",
      cars: [
        { name: "RS7 Sportback", img: img("cars/audi-rs/rs7-sunset.jpg"), note: "夕阳下的溜背绅士" },
        { name: "ABT 改 RS", img: img("cars/audi-rs/abt-rs-grey.jpg"), note: "德国改装厂的性能加成" },
        { name: "ABT 前脸细节", img: img("cars/audi-rs/abt-front-detail.jpg"), note: "蜂窝格栅与红色卡钳" },
        { name: "RS6 Avant", img: img("cars/audi-rs/audi-rs6-avant.jpg"), note: "地表最强旅行车" },
        { name: "RS3", img: img("cars/audi-rs/audi-rs3.jpg"), note: "五缸机最后的坚守" },
        { name: "RS e-tron GT", img: img("cars/audi-rs/audi-etron-gt.jpg"), note: "电动四门 GT 的新答案" },
      ],
    },
    {
      brand: "VW GTI",
      slogan: "Der Klassiker",
      cars: [
        { name: "Golf GTI Mk8", img: img("cars/gti/golf-gti-mk8.jpg"), note: "钢炮鼻祖的当代形态" },
        { name: "Golf GTI Clubsport", img: img("cars/gti/golf-gti-clubsport.jpg"), note: "更接近赛道的版本" },
      ],
    },
  ],
  supercars: [
    { name: "Ferrari SF90", img: img("cars/supercar/ferrari-sf90.jpg"), note: "插混时代的跃马旗舰" },
    { name: "Lamborghini Huracán STO", img: img("cars/supercar/lamborghini-revuelto.jpg"), note: "V10 自吸的赛道化终极形态" },
    { name: "McLaren 750S", img: img("cars/supercar/mclaren-750s.jpg"), note: "轻量与空气动力学的偏执" },
    { name: "Porsche 911 GT3 RS", img: img("cars/supercar/porsche-911-gt3rs.jpg"), note: "最接近赛车的街车" },
    { name: "Koenigsegg", img: img("cars/supercar/koenigsegg-jesko.jpg"), note: "极速纪录的挑战者" },
  ],
  volvo: [
    { name: "Volvo XC90", img: img("cars/volvo/volvo-xc90.jpg"), note: "北欧旗舰 SUV，安全的同义词" },
    { name: "Volvo V60 / Polestar", img: img("cars/volvo/volvo-v60-or-polestar.jpg"), note: "旅行车与瑞典性能基因" },
    { name: "Volvo 240 Turbo", img: img("cars/volvo/volvo-240-classic.jpg"), note: "砖头车传奇，Group A 涡轮黄金年代" },
  ],
};

export const BIKES = {
  heroImage: img("bikes/bike-tarmac-sl8.jpg"),
  intro:
    "近两年是公路车的「全能化」时代：气动车越来越轻，爬坡车越来越快，旗舰之间的界限正在消失。以下是我关注的各家旗舰。",
  list: [
    { brand: "Specialized", model: "S-Works Tarmac SL8", year: "2024", type: "全能轻量", weight: "6.6 kg", note: "把爬坡车做出气动性能的新标杆", img: img("bikes/bike-tarmac-sl8.jpg") },
    { brand: "Cervélo", model: "S5", year: "2024", type: "气动", weight: "7.2 kg", note: "环法冠军车，气动整合的教科书", img: img("bikes/bike-cervelo-s5.jpg") },
    { brand: "Pinarello", model: "Dogma F", year: "2024", type: "全能气动", weight: "6.9 kg", note: "意大利工艺的当代答卷", img: img("bikes/bike-dogma-f.jpg") },
    { brand: "Trek", model: "Madone SLR Gen 7", year: "2024", type: "气动", weight: "7.1 kg", note: "IsoFlow 座管孔洞的标志性设计", img: img("bikes/bike-madone-gen7.jpg") },
    { brand: "Canyon", model: "Aeroad CFR", year: "2024", type: "气动", weight: "6.8 kg", note: "直供职业队的气动战车", img: img("bikes/bike-aeroad-cfr.jpg") },
    { brand: "BMC", model: "Teammachine SLR01", year: "2024", type: "全能", weight: "6.8 kg", note: "职业车队口碑之作，爬坡与气动的平衡", img: img("bikes/bike-bmc-r01.jpg") },
    { brand: "Colnago", model: "V4Rs", year: "2024", type: "全能气动", weight: "7.0 kg", note: "环法冠军同款座驾", img: img("bikes/bike-colnago-v4rs.jpg") },
    { brand: "Giant", model: "Propel", year: "2025", type: "气动", weight: "7.2 kg", note: "大厂的均衡之作", img: img("bikes/bike-propel.jpg") },
    { brand: "Scott", model: "Foil RC", year: "2025", type: "气动", weight: "6.9 kg", note: "整合把立的气动旗舰", img: img("bikes/bike-foil-rc.jpg") },
    { brand: "ENVE", model: "Melee", year: "2024", type: "全能", weight: "6.6 kg", note: "碳纤大厂自制车架的诚意", img: img("bikes/bike-enve-melee.jpg") },
    { brand: "Wilier", model: "Filante SLR", year: "2024", type: "气动", weight: "6.9 kg", note: "意式美学与轻量兼得", img: img("bikes/bike-wilier-filante.jpg") },
  ],
};

export const CAMERAS = {
  nikon: [
    { name: "Nikon Z9", role: "全画幅旗舰", img: img("cameras/nikon/nikon-z9.jpg"), desc: "无机械快门的集成旗舰，野生动物与体育的可靠兵器" },
    { name: "Nikon Z8", role: "全能次旗舰", img: img("cameras/nikon/nikon-z8.jpg"), desc: "Z9 的浓缩版，日常创作的绝对主力" },
    { name: "Nikon Z6III", role: "均衡水桶机", img: img("cameras/nikon/nikon-z6iii.jpg"), desc: "部分堆叠式传感器，视频照片两开花" },
    { name: "Nikon Zf", role: "复古全画幅", img: img("cameras/nikon/nikon-zf.jpg"), desc: "致敬 FM2 的拨盘设计，现代内核" },
    { name: "Nikon Z50II", role: "APS-C 轻旗舰", img: img("cameras/nikon/nikon-z50ii.jpg"), desc: "轻便的高颜值旅拍搭档" },
  ],
  film: [
    { name: "Konica Hexar AF", maker: "柯尼卡", img: img("cameras/film/konica-hexar.jpg"), desc: "35mm 定焦旁轴的「隐形旗舰」，静音快门出名" },
    { name: "Konica Pop", maker: "柯尼卡", img: img("cameras/film/konica-pop.jpg"), desc: "八十年代的彩色塑料傻瓜机，纯粹的胶片快乐" },
    { name: "Kodak Ektar H35", maker: "柯达", img: img("cameras/film/kodak-ektar-h35.jpg"), desc: "半格胶片机，一卷 135 拍 72 张" },
    { name: "Kodak Retina", maker: "柯达", img: img("cameras/film/kodak-retina.jpg"), desc: "折叠皮腔时代的经典血统" },
    { name: "Hasselblad 500C/M", maker: "哈苏", img: img("cameras/film/hasselblad-500cm.jpg"), desc: "中画幅的机械美学巅峰，蔡司镜头的经典搭档" },
    { name: "Hasselblad 500 EL", maker: "哈苏", img: img("cameras/film/hasselblad-500el.jpg"), desc: "电机驱动版，阿波罗登月任务的相机同门" },
    { name: "海鸥 4A", maker: "海鸥", img: img("cameras/film/seagull-4a.jpg"), desc: "国产双反的代表作，腰平取景的独特视角" },
    { name: "海鸥 DF", maker: "海鸥", img: img("cameras/film/seagull-df.jpg"), desc: "国产单反的启蒙记忆" },
  ],
};

export const WORKS = [
  { title: "白头海雕", cat: "野生动物", img: img("photos/wildlife/eagle.jpg"), tall: true },
  { title: "非洲象", cat: "野生动物", img: img("photos/wildlife/elephant.jpg"), tall: true },
  { title: "羽落黑潭", cat: "野生动物", img: img("photos/wildlife/swan.jpg") },
  { title: "环尾狐猴", cat: "野生动物", img: img("photos/wildlife/lemur.jpg") },
  { title: "火烈鸟的私语", cat: "野生动物", img: img("photos/wildlife/flamingo.jpg") },
  { title: "涉水", cat: "野生动物", img: img("photos/wildlife/crane.jpg") },
  { title: "蓝色镭射", cat: "演唱会", img: img("photos/concert/concert-laser.jpg") },
  { title: "舞台全景", cat: "演唱会", img: img("photos/concert/concert-stage.jpg") },
  { title: "碎光时刻", cat: "演唱会", img: img("photos/concert/concert-splash.jpg") },
  { title: "白色钢琴", cat: "演唱会", img: img("photos/concert/concert-piano.jpg") },
  { title: "金色琴键", cat: "演唱会", img: img("photos/concert/concert-piano-gold.jpg") },
  { title: "G.E.M. 霓虹", cat: "演唱会", img: img("photos/concert/concert-gem-neon.jpg") },
  { title: "城市暮色", cat: "城市", img: img("photos/city/city-dusk.jpg") },
  { title: "天际线黄昏", cat: "城市", img: img("photos/city/skyline-dusk.jpg") },
  { title: "塔楼夜色", cat: "城市", img: img("photos/city/tower-night.jpg"), tall: true },
  { title: "绿意天际线", cat: "城市", img: img("photos/city/green-skyline.jpg") },
  { title: "街景巴士", cat: "城市", img: img("photos/city/street-bus.jpg"), tall: true },
  { title: "夜色楼群", cat: "城市", img: img("photos/city/night-towers.jpg") },
  { title: "教堂广场", cat: "城市", img: img("photos/city/cathedral.jpg") },
  { title: "星轨摩天轮", cat: "风景", img: img("photos/night/ferris-stars.jpg") },
  { title: "檐角与云", cat: "风景", img: img("photos/scenery/cloud-eave.jpg") },
  { title: "夕照亭台", cat: "风景", img: img("photos/scenery/sunset-pavilion.jpg") },
  { title: "积云", cat: "风景", img: img("photos/scenery/cumulus.jpg") },
  { title: "秋湖晨光", cat: "风景", img: img("photos/scenery/autumn-lake.jpg") },
  { title: "花见", cat: "风景", img: img("photos/scenery/blossom-sun.jpg") },
  { title: "古刹檐下", cat: "风景", img: img("photos/scenery/temple-sky.jpg") },
  { title: "夜市烟火", cat: "风景", img: img("photos/night/night-market.jpg") },
  { title: "灯河", cat: "风景", img: img("photos/night/night-lights.jpg") },
  { title: "手中星火", cat: "风景", img: img("photos/night/sparkler.jpg") },
  { title: "波斯菊花田", cat: "花卉", img: img("photos/flowers/cosmos-field.jpg") },
  { title: "白波斯菊", cat: "花卉", img: img("photos/flowers/white-cosmos.jpg") },
  { title: "百日菊的调色盘", cat: "花卉", img: img("photos/flowers/zinnia-mix.jpg") },
  { title: "五色花海", cat: "花卉", img: img("photos/flowers/zinnia-colors.jpg") },
  { title: "金色万寿菊", cat: "花卉", img: img("photos/flowers/marigold-gold.jpg") },
  { title: "郁金香微距", cat: "花卉", img: img("photos/flowers/tulip-macro.jpg"), tall: true },
  { title: "粉色郁金香", cat: "花卉", img: img("photos/flowers/tulips-pink.jpg") },
  { title: "涂鸦墙前", cat: "花卉", img: img("photos/flowers/graffiti-day.jpg") },
  { title: "粉色虚化", cat: "花卉", img: img("photos/flowers/bokeh-pink.jpg") },
];

export const FISH = {
  heroImage: img("fish/aquascape/aquascape-south-american-1.jpg"),
  intro:
    "一只缸就是一个完整的小宇宙：灯科鱼的群游是流动的光，异形鱼是水底的铠甲骑士，南美造景则是把雨林支流搬回家。",
  tetra: [
    { name: "红绿灯鱼", en: "Neon Tetra", img: img("fish/tetra/tetra-neon.jpg"), desc: "蓝色霓虹带与红色侧线，群游起来像水流过的光" },
    { name: "宝莲灯", en: "Cardinal Tetra", img: img("fish/tetra/tetra-cardinal.jpg"), desc: "比红绿灯更大更艳，蓝色贯穿全身的灯科之王" },
    { name: "红鼻剪刀", en: "Rummy-nose Tetra", img: img("fish/tetra/tetra-rummynose.jpg"), desc: "红鼻与黑白格尾鳍，水质状态的活体指示灯" },
    { name: "头尾灯", en: "Head-and-tail Light Tetra", img: img("fish/tetra/tetra-glowlight.jpg"), desc: "身体中一条发光的橙线，低调而精致" },
    { name: "蓝三角", en: "Harlequin Rasbora", img: img("fish/tetra/tetra-harlequin.jpg"), desc: "金橙色身体上的黑色三角，温和的群游担当" },
    { name: "柠檬灯", en: "Lemon Tetra", img: img("fish/tetra/tetra-lemon.jpg"), desc: "通透的黄与黑色鳍边，水草缸里的点缀" },
  ],
  pleco: [
    { name: "胡子异形", en: "Bristlenose Pleco", img: img("fish/pleco/pleco-bristlenose.jpg"), desc: "白点的亲民工具鱼，除藻小能手" },
    { name: "L134 豹纹橙鳍", en: "Leopard Frog Pleco", img: img("fish/pleco/pleco-l134.jpg"), desc: "黄黑条纹配橙色鳍边，异形入门经典" },
    { name: "熊猫异形 L46", en: "Zebra Pleco", img: img("fish/pleco/pleco-zebra.jpg"), desc: "黑白熊猫纹，异形界的顶流" },
    { name: "黄金达摩", en: "Gold Nugget Pleco", img: img("fish/pleco/pleco-gold-nugget.jpg"), desc: "金点黑底与金色鳍边，最华丽的大型异形" },
    { name: "皇家异形", en: "Royal Pleco", img: img("fish/pleco/pleco-royal.jpg"), desc: "灰蓝底色的大块头，沉木的忠实消费者" },
  ],
  aquascape: [
    { name: "南美支流", en: "South American Biotope", img: img("fish/aquascape/aquascape-south-american-1.jpg"), desc: "沉木、落叶与灯科群游，还原亚马逊支流的水下森林" },
    { name: "黑水缸", en: "Blackwater", img: img("fish/aquascape/aquascape-south-american-2.jpg"), desc: "榄仁叶染出的琥珀色水体，异形与鼠鱼的故乡" },
    { name: "水草景观", en: "Planted Landscape", img: img("fish/aquascape/aquascape-south-american-3.jpg"), desc: "大景深的水下园林，石头与矮草的构图游戏" },
  ],
};
