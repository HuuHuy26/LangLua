import type { LocalDatabaseSnapshot } from '../types/heritage.js';

export const IMG_HERO_LOOM = '/src/assets/images/hero_vanphuc_loom_1795364489896.jpg';
export const IMG_SILK_SWATCH = '/src/assets/images/silk_van_phuc_swatch_1795364489683.jpg';
export const IMG_ARTISAN_PORTRAIT = '/src/assets/images/artisan_portrait_master_1795364490116.jpg';
export const IMG_DYE_COURTYARD = '/src/assets/images/silk_dyeing_courtyard_1795364490119.jpg';
export const IMG_COCOON_REEL = '/src/assets/images/cocoon_reeling_craft_1795364489815.jpg';

export function createInitialSeedSnapshot(): LocalDatabaseSnapshot {
  return {
    users: [],
    articles: [
      {
        _id: 'art-1',
        slug: 'khoi-nguon-ngan-nam-vo-lang-van-phuc',
        title: {
          vi: 'Khởi nguyên ngàn năm bên dòng sông Nhuệ: Tổ nghề Lã Thị Nga',
          en: 'A Millennium Along the Nhuệ River: Founder Lady Lã Thị Nga',
        },
        category: 'history',
        eraYear: 'Thế kỷ IX – X',
        summary: {
          vi: 'Từ truyền thuyết bà chúa lụa Lã Thị Nga dạy dân trang Vạn Bảo trồng dâu, nuôi tằm, ươm tơ đến sự hình thành thương hiệu lụa Vạn Phúc trứ danh đất Bắc.',
          en: 'From Lady Lã Thị Nga teaching the villagers of Vạn Bảo mulberry cultivation and silk reeling to the rise of Northern Vietnam’s iconic silk center.',
        },
        content: {
          vi: 'Theo ngọc phả lưu giữ tại đình Vạn Phúc, bà Lã Thị Nga — một người phụ nữ tài hoa quê ở Cao Bằng — đã đến trang Vạn Bảo (tên cổ của Vạn Phúc) vào cuối thời Đường – đầu thời kỳ tự chủ. Nhận thấy vùng đất phù sa ven sông Nhuệ màu mỡ thích hợp trồng dâu xanh tốt, bà đã truyền dạy kỹ thuật nuôi tằm nhả tơ và dựng khung cửi dệt nên những tấm lụa đầu tiên mềm mịn như mây.\n\nSau khi bà qua đời, dân làng tôn bà làm Thành hoàng làng và thờ phụng tại đình Vạn Phúc. Từ thế kỷ XI đến XVIII, tiếng thoi đưa lách cách vang vọng khắp ngõ xóm, biến Vạn Phúc thành vùng đất cung tiến tơ lụa thượng hạng cho kinh thành Thăng Long.',
          en: 'According to village chronicles preserved at Vạn Phúc Communal House, Lady Lã Thị Nga—a gifted craftswoman originally from Cao Bằng—settled in ancient Vạn Bảo around the 9th century. Recognizing that the fertile alluvial banks of the Nhuệ River could sustain lush mulberry groves, she taught local households silkworm husbandry, filament reeling, and wooden loom weaving.\n\nRevered after her passing as the village tutelary deity, Lady Lã Thị Nga laid the foundation for a craft lineage that soon supplied royal courts in Thăng Long with luminous silk bolts.',
        },
        imageUrl: IMG_HERO_LOOM,
        readMinutes: 5,
        publishedAt: '2026-03-10',
      },
      {
        _id: 'art-2',
        slug: 'trieu-nguyen-va-buoc-ngoat-trien-lam-paris-1931',
        title: {
          vi: 'Từ lụa tiến vua triều Nguyễn đến giải thưởng tại Paris & Marseille',
          en: 'From Nguyễn Imperial Silk to Paris & Marseille World Exhibitions',
        },
        category: 'history',
        eraYear: '1802 – 1938',
        summary: {
          vi: 'Lụa Vân Vạn Phúc từng được triều đình Huế chọn may hoàng bào và vinh danh trên trường quốc tế tại Hội chợ Marseille (1931) và Paris (1938).',
          en: 'Vạn Phúc Vân silk dressed Nguyễn emperors and won international acclaim at the Colonial Exhibitions in Marseille (1931) and Paris (1938).',
        },
        content: {
          vi: 'Dưới triều Nguyễn, các nghệ nhân Vạn Phúc đạt đến đỉnh cao của kỹ thuật dệt hoa chìm nổi trên lụa Vân và gấm. Những súc lụa mang hoa văn Song Hạc, Tứ Quý, Thọ Đỉnh được tuyển chọn làm phẩm vật tiến vua, may lễ phục cung đình.\n\nBước sang đầu thế kỷ XX, khi lụa Hà Đông được giới thiệu tại Hội chợ Thuộc địa Marseille (1931) và Triển lãm Quốc tế Paris (1938), giới mộ điệu châu Âu kinh ngạc trước độ óng ả tự nhiên, thoáng nhẹ mùa hè mà ấm áp mùa đông của tơ tằm Vạn Phúc. Danh xưng “Lụa Hà Đông” từ đó vang xa khắp năm châu.',
          en: 'During the Nguyễn dynasty, Vạn Phúc weavers perfected intricate relief-jacquard patterns such as Twin Cranes and Four Seasons on Vân silk. Selected for court robes, these textiles established Vạn Phúc as the pinnacle of Vietnamese sericulture.\n\nIn 1931 in Marseille and 1938 in Paris, European textile connoisseurs marveled at Vạn Phúc silk’s airy drape, feather-light warmth, and natural luster—cementing the global reputation of “Hà Đông Silk.”',
        },
        imageUrl: IMG_SILK_SWATCH,
        readMinutes: 6,
        publishedAt: '2026-03-18',
      },
      {
        _id: 'art-3',
        slug: 'hop-tac-xa-det-va-hanh-trinh-di-san-duong-dai',
        title: {
          vi: 'Ký ức hợp tác xã dệt lụa và nỗ lực hồi sinh di sản thế kỷ XXI',
          en: 'Cooperative Years & Twenty-First Century Craft Revival',
        },
        category: 'history',
        eraYear: '1958 – Nay',
        summary: {
          vi: 'Giai đoạn 1958–1988, hơn một nghìn khung cửi xuất khẩu hàng triệu mét lụa sang Đông Âu, trước khi bước vào thời kỳ chuyển mình giữ lửa nghề.',
          en: 'Between 1958 and 1988, over a thousand looms exported silk across Eastern Europe before modern craft preservation initiatives took root.',
        },
        content: {
          vi: 'Giai đoạn 1958–1988, Hợp tác xã dệt lụa Vạn Phúc quy tụ hàng trăm hộ gia đình với tiếng máy dệt vang rền ngày đêm, xuất khẩu lụa sang Liên Xô và Đông Âu. Sau biến động thị trường thập niên 1990, nhiều khung cửi phải ngừng hoạt động trước làn sóng vải công nghiệp giá rẻ.\n\nNhững năm gần đây, cùng danh hiệu Di sản văn hóa phi vật thể quốc gia và việc gia nhập Mạng lưới các Thành phố Thủ công Sáng tạo Thế giới (WCC), thế hệ nghệ nhân và bạn trẻ đang chung tay số hóa mẫu hoa văn cổ, chuẩn hóa nguồn tơ và mở rộng không gian trải nghiệm di sản.',
          en: 'From 1958 to 1988, the Vạn Phúc Silk Cooperative united hundreds of families, exporting millions of meters to Eastern Europe. Market shifts in the 1990s tested the village as cheap synthetic textiles flooded domestic markets.\n\nToday, recognized as National Intangible Cultural Heritage and welcomed into the World Crafts Council creative cities network, Vạn Phúc is digitizing historic motifs, certifying pure mulberry threads, and inviting youth into living workshops.',
        },
        imageUrl: IMG_DYE_COURTYARD,
        readMinutes: 5,
        publishedAt: '2026-04-02',
      },
      {
        _id: 'art-4',
        slug: 'kien-truc-khong-gian-lang-lua-ha-dong',
        title: {
          vi: 'Kiến trúc làng nghề Vạn Phúc: Đình cổ, giếng ngọc và phố lụa',
          en: 'Architecture of the Silk Village: Communal Hall, Ancient Well & Silk Street',
        },
        category: 'heritage',
        eraYear: 'Di sản không gian',
        summary: {
          vi: 'Khám phá cấu trúc không gian văn hóa đặc trưng của làng cổ Vạn Phúc nơi mỗi ngôi nhà mái ngói đều từng là một xưởng dệt thu nhỏ.',
          en: 'Exploring the historic spatial fabric of Vạn Phúc where tiled courtyard homes doubled as multigenerational weaving workshops.',
        },
        content: {
          vi: 'Khác với nhiều làng thuần nông, cấu trúc nhà ở truyền thống tại Vạn Phúc được tổ chức quanh không gian đặt khung cửi có cửa sổ lấy sáng tự nhiên và sân gạch phơi sợi. Từ cổng làng cổ kính đến đình Vạn Phúc, chùa Diên Khánh và con phố Lụa rợp sắc màu, mỗi góc phố đều lưu dấu nhịp sống cần mẫn của người thợ dệt.',
          en: 'Unlike purely agricultural villages, Vạn Phúc courtyard homes were architecturally shaped around tall wooden looms—featuring ventilated lattice windows for natural light and brick yards for sun-drying dyed skeins.',
        },
        imageUrl: IMG_DYE_COURTYARD,
        readMinutes: 4,
        publishedAt: '2026-04-11',
      },
    ],
    artisans: [
      {
        _id: 'artn-1',
        name: 'Triệu Văn Mão',
        honorificTitle: {
          vi: 'Nghệ nhân Nhân dân (Tưởng niệm)',
          en: 'People’s Artisan (In Memoriam)',
        },
        birthYear: 1933,
        yearsOfExperience: 68,
        specialty: {
          vi: 'Phục dựng lụa Vân cổ và kỹ thuật dệt hoa chìm nổi',
          en: 'Revival of antique Vân silk & relief jacquard patterns',
        },
        lineage: {
          vi: 'Truyền nhân đời thứ 5 dòng họ Triệu tại Vạn Phúc',
          en: '5th-generation weaver of the Triệu clan in Vạn Phúc',
        },
        biography: {
          vi: 'Cố Nghệ nhân Nhân dân Triệu Văn Mão là người dành trọn cuộc đời khôi phục hàng chục mẫu hoa văn cổ thời Lý – Trần – Nguyễn như Song Hạc, Thọ Đỉnh, Tứ Quý trên khung cửi thủ công, truyền nghề cho hàng trăm thợ trẻ trong làng.',
          en: 'Late People’s Artisan Triệu Văn Mão dedicated nearly seven decades to reviving dozens of royal Lý–Trần–Nguyễn motifs—including Twin Cranes and Longevity Seals—while mentoring hundreds of younger villagers.',
        },
        quote: {
          vi: 'Sợi tơ mỏng manh nhưng giữ được cả hồn cốt ngàn năm của đất Việt nếu người thợ còn đặt chữ Tâm vào từng nhịp thoi.',
          en: 'A silk thread is delicate, yet it carries a thousand years of Vietnamese soul whenever a weaver places heart and patience into every throw of the shuttle.',
        },
        portraitUrl: IMG_ARTISAN_PORTRAIT,
        featured: true,
      },
      {
        _id: 'artn-2',
        name: 'Nguyễn Thị Tâm',
        honorificTitle: {
          vi: 'Nghệ nhân Ưu tú Dệt lụa truyền thống',
          en: 'Meritorious Master Silk Weaver',
        },
        birthYear: 1954,
        yearsOfExperience: 50,
        specialty: {
          vi: 'Mắc cửi thủ công và dệt lụa The, lụa Lĩnh hai da',
          en: 'Hand-warping & fine The gauze and Lĩnh satin weaving',
        },
        lineage: {
          vi: 'Gia đình 4 đời làm nghề ươm tơ, dệt lụa bên cầu Am',
          en: '4th-generation silk family near Cầu Am',
        },
        biography: {
          vi: 'Với hơn nửa thế kỷ gắn bó cùng khung cửi gỗ, nghệ nhân Nguyễn Thị Tâm nổi tiếng với đôi tay cảm nhận chính xác độ căng của hơn 4.000 sợi dọc mà không cần máy đo điện tử. Bà hiện thường xuyên mở cửa xưởng đón sinh viên mỹ thuật và học sinh đến thực hành.',
          en: 'With over fifty years at the wooden loom, Master Nguyễn Thị Tâm can judge the tension of more than 4,000 warp threads by touch alone. Today she regularly welcomes design students and youth workshops into her courtyard.',
        },
        quote: {
          vi: 'Nhìn một bạn trẻ tự tay quay được con tơ đầu tiên, tôi thấy tiếng khung cửi làng mình vẫn còn vang mãi.',
          en: 'When I watch a young student wind their very first silk bobbin, I know the rhythm of our village looms will endure.',
        },
        portraitUrl: IMG_ARTISAN_PORTRAIT,
        featured: true,
      },
      {
        _id: 'artn-3',
        name: 'Phạm Khắc Hà',
        honorificTitle: {
          vi: 'Nghệ nhân Thiết kế hoa văn & Bảo tồn',
          en: 'Master Pattern Designer & Preservationist',
        },
        birthYear: 1962,
        yearsOfExperience: 42,
        specialty: {
          vi: 'Đục bìa hoa văn cổ và chuẩn hóa chất lượng tơ tằm 100%',
          en: 'Jacquard punch-card drafting & 100% pure mulberry certification',
        },
        lineage: {
          vi: 'Thành viên Ban chấp hành Hiệp hội Làng nghề Vạn Phúc',
          en: 'Executive leader, Vạn Phúc Craft Village Association',
        },
        biography: {
          vi: 'Nghệ nhân Phạm Khắc Hà tiên phong kết hợp kỹ thuật đục bìa mẫu truyền thống với bản vẽ kỹ thuật số, giúp lưu giữ nguyên vẹn hơn 70 bộ mẫu hoa văn cổ Vạn Phúc trước nguy cơ thất truyền.',
          en: 'Master Phạm Khắc Hà pioneered pairing traditional jacquard punch-cards with digital archives, safeguarding more than 70 historic Vạn Phúc textile patterns from being lost.',
        },
        quote: {
          vi: 'Bảo tồn không phải là giữ nguyên trong tủ kính, mà là để tơ lụa Vạn Phúc bước vào đời sống đương đại với chất lượng thật.',
          en: 'Preservation does not mean locking silk behind glass; it means letting authentic Vạn Phúc silk live gracefully in modern life.',
        },
        portraitUrl: IMG_HERO_LOOM,
        featured: true,
      },
      {
        _id: 'artn-4',
        name: 'Lê Thị Minh Ngọc',
        honorificTitle: {
          vi: 'Nghệ nhân trẻ Nhuộm màu tự nhiên',
          en: 'Young Artisan of Botanical Silk Dyeing',
        },
        birthYear: 1989,
        yearsOfExperience: 14,
        specialty: {
          vi: 'Nhuộm thảo mộc: cánh kiến, củ nâu, chàm và lá bàng',
          en: 'Natural botanical dyeing: sticklac crimson, yam brown & indigo',
        },
        lineage: {
          vi: 'Thế hệ kế cận kết nối thủ công truyền thống với thời trang bền vững',
          en: 'Next-generation weaver bridging heritage dyeing with sustainable fashion',
        },
        biography: {
          vi: 'Trở về làng sau khi tốt nghiệp đại học mỹ thuật công nghiệp, chị Ngọc nghiên cứu phục dựng bảng màu nhuộm thực vật an toàn cho môi trường, giúp giảm nước thải hóa chất và thu hút nhiều sinh viên về thực tập tại Vạn Phúc.',
          en: 'Returning to the village after industrial arts university, Ngọc revived eco-friendly botanical dye baths—reducing chemical runoff while mentoring university interns.',
        },
        quote: {
          vi: 'Màu đỏ cánh kiến hay nâu củ nâu thấm vào sợi tơ mang theo cả hương đất và sự kiên nhẫn của người trẻ hôm nay.',
          en: 'Sticklac crimson and yam-root brown sink into mulberry silk carrying both native earth and the patience of a new generation.',
        },
        portraitUrl: IMG_DYE_COURTYARD,
        featured: false,
      },
    ],
    products: [
      {
        _id: 'prod-1',
        accessionCode: 'VP-ARC-001',
        name: {
          vi: 'Lụa Vân Song Hạc (Mây Tương Phùng)',
          en: 'Vân Silk — Twin Cranes & Clouds',
        },
        weaveType: 'van',
        motifMeaning: {
          vi: 'Đôi hạc sải cánh giữa tầng mây ngũ sắc tượng trưng cho trường thọ, thanh cao và hòa hợp.',
          en: 'Paired cranes gliding among auspicious clouds symbolizing longevity, grace, and harmony.',
        },
        material: {
          vi: '100% tơ tằm dâu tự nhiên Bảo Lộc & Đồng Bằng Bắc Bộ',
          en: '100% pure natural mulberry silk filament',
        },
        dimensions: 'Khổ 90 cm · Mật độ 4.200 sợi dọc',
        careGuide: {
          vi: 'Giặt tay nước mát với xà phòng trung tính, phơi bóng râm thoáng gió.',
          en: 'Hand wash in cool water with mild neutral soap; shade dry.',
        },
        description: {
          vi: 'Dòng lụa danh tiếng nhất của Vạn Phúc với kỹ thuật dệt hoa chìm hoa nổi tinh xảo, mặt vải mịn mát, bắt sáng dịu nhẹ theo từng góc nhìn.',
          en: 'Vạn Phúc’s signature jacquard weave featuring recessed and raised cloud-crane motifs that shimmer subtly as light shifts across the drape.',
        },
        imageUrl: IMG_SILK_SWATCH,
        isHeritageHighlight: true,
      },
      {
        _id: 'prod-2',
        accessionCode: 'VP-ARC-002',
        name: {
          vi: 'Lụa The Chữ Thọ Cổ Điển',
          en: 'Sheer The Silk — Longevity Seal',
        },
        weaveType: 'the',
        motifMeaning: {
          vi: 'Họa tiết chữ Thọ triện xen kẽ đường dệt thưa thoáng khí, biểu trưng cho phúc lộc bền lâu.',
          en: 'Repeating archaic Longevity seals woven on an airy semi-sheer gauze ground.',
        },
        material: {
          vi: 'Tơ tằm se mảnh xoắn đôi truyền thống',
          en: 'Fine double-twisted natural mulberry silk',
        },
        dimensions: 'Khổ 90 cm · Trọng lượng 48 gsm',
        careGuide: {
          vi: 'Không vắt xoắn mạnh, ủi hơi ở nhiệt độ lụa khi còn hơi ẩm.',
          en: 'Never wring; steam press gently on low silk setting while slightly damp.',
        },
        description: {
          vi: 'Chất liệu mỏng nhẹ, thông thoáng tuyệt đối rất được ưa chuộng may áo dài truyền thống mùa hạ và khăn choàng nghi lễ.',
          en: 'Feather-light, breathable gauze weave prized for summer traditional áo dài tunics and ceremonial scarves.',
        },
        imageUrl: IMG_SILK_SWATCH,
        isHeritageHighlight: true,
      },
      {
        _id: 'prod-3',
        accessionCode: 'VP-ARC-003',
        name: {
          vi: 'Lụa Lĩnh Đen Bóng Cổ Truyền',
          en: 'Lustrous Black Lĩnh Satin Silk',
        },
        weaveType: 'linh',
        motifMeaning: {
          vi: 'Mặt lụa trơn dày dặn, bóng sâu tôn vinh vẻ đẹp mực thước và trang nghiêm của trang phục Bắc Bộ.',
          en: 'Dense, mirror-smooth satin surface honoring the dignified poise of Northern Vietnamese attire.',
        },
        material: {
          vi: 'Tơ tằm mộc nhuộm mặc nưa & củ nâu nhiều lần',
          en: 'Mulberry silk repeatedly dyed in botanical yam & ebony fruit',
        },
        dimensions: 'Khổ 85 cm · 8 lớp nhuộm thủ công',
        careGuide: {
          vi: 'Giặt riêng bằng nước sạch, tránh ánh nắng trực tiếp gắt.',
          en: 'Rinse separately in cool clear water; avoid harsh direct sunlight.',
        },
        description: {
          vi: 'Kỹ thuật dệt sa tanh kín mặt sợi kết hợp quy trình nhuộm tự nhiên giúp tấm lĩnh vừa bền chắc vừa giữ độ rủ nặng tay sang trọng.',
          en: 'Tight satin-weave structure paired with multi-bath natural dyeing lends remarkable durability and sculptural drape.',
        },
        imageUrl: IMG_HERO_LOOM,
        isHeritageHighlight: true,
      },
      {
        _id: 'prod-4',
        accessionCode: 'VP-ARC-004',
        name: {
          vi: 'Gấm Tứ Quý Sen Hạc',
          en: 'Four-Season Lotus & Crane Brocade',
        },
        weaveType: 'gam',
        motifMeaning: {
          vi: 'Tùng – Cúc – Trúc – Mai kết hợp đài sen biểu đạt vòng tuần hoàn thanh khiết của bốn mùa.',
          en: 'Pine, Chrysanthemum, Bamboo, and Plum motifs celebrating seasonal renewal and integrity.',
        },
        material: {
          vi: 'Tơ tằm se dày dệt hai tầng sợi màu',
          en: 'Heavyweight multi-ply mulberry silk brocade',
        },
        dimensions: 'Khổ 90 cm · Dệt 2 da dày dặn',
        careGuide: {
          vi: 'Giặt khô chuyên dụng hoặc giặt tay nhẹ bằng nước lạnh.',
          en: 'Specialist dry clean or gentle cold hand soak.',
        },
        description: {
          vi: 'Dòng gấm cao cấp từng dùng cho triều phục, có cấu trúc sợi đan chéo dày dặn tạo nên sắc độ lấp lánh trang trọng.',
          en: 'Ceremonial brocade of rich structural weight where overlapping colored silk threads produce a sculptural relief.',
        },
        imageUrl: IMG_DYE_COURTYARD,
        isHeritageHighlight: false,
      },
      {
        _id: 'prod-5',
        accessionCode: 'VP-ARC-005',
        name: {
          vi: 'Lụa Đũi Tơ Mộc Nhuộm Cánh Kiến',
          en: 'Slubbed Đũi Silk — Sticklac Crimson',
        },
        weaveType: 'dui',
        motifMeaning: {
          vi: 'Bề mặt thô mộc tự nhiên từ phần tơ gốc kén, nhuộm sắc đỏ trầm ấm từ nhựa cánh kiến.',
          en: 'Textured raw-slub weave spun from outer cocoon fibers and dyed in warm sticklac crimson.',
        },
        material: {
          vi: '100% tơ đũi xe tay từ kén tằm tự nhiên',
          en: '100% hand-spun organic cocoon slub silk',
        },
        dimensions: 'Khổ 110 cm · Dệt thoi tay mộc',
        careGuide: {
          vi: 'Giặt tay nhẹ, càng mặc càng mềm mượt theo thời gian.',
          en: 'Gentle hand wash; softens naturally with every wear.',
        },
        description: {
          vi: 'Mang vẻ đẹp mộc mạc, thấm hút mồ hôi tốt và thân thiện với làn da, được giới trẻ yêu thích trong thiết kế đương đại.',
          en: 'Earthy, breathable texture favored by young Vietnamese designers for contemporary minimalist garments.',
        },
        imageUrl: IMG_COCOON_REEL,
        isHeritageHighlight: false,
      },
      {
        _id: 'prod-6',
        accessionCode: 'VP-ARC-006',
        name: {
          vi: 'Lụa Vân Hoa Cúc Dây Triều Nguyễn',
          en: 'Vân Silk — Imperial Chrysanthemum Vine',
        },
        weaveType: 'van',
        motifMeaning: {
          vi: 'Dây cúc uốn lượn liên hoàn tượng trưng cho sự tiếp nối bất tận của văn hóa và gia tộc.',
          en: 'Interlocking chrysanthemum tendrils expressing unbroken cultural continuity.',
        },
        material: {
          vi: 'Tơ tằm ươm thủ công sợi mảnh 20/22 denier',
          en: 'Hand-reeled 20/22 denier fine mulberry silk',
        },
        dimensions: 'Khổ 90 cm · Phục dựng mẫu 1924',
        careGuide: {
          vi: 'Bảo quản nơi khô thoáng, lót giấy pơ-luya khi gấp lưu trữ.',
          en: 'Store folded in breathable acid-free tissue away from humidity.',
        },
        description: {
          vi: 'Mẫu lụa được phục dựng trực tiếp từ tấm bìa mẫu đầu thế kỷ XX còn lưu giữ tại gia đình nghệ nhân Vạn Phúc.',
          en: 'Reconstructed directly from early twentieth-century jacquard punch-cards preserved by village elder families.',
        },
        imageUrl: IMG_SILK_SWATCH,
        isHeritageHighlight: false,
      },
    ],
    processes: [
      {
        _id: 'proc-1',
        stepOrder: 1,
        title: {
          vi: 'Trồng dâu & Nuôi tằm',
          en: 'Mulberry Harvest & Sericulture',
        },
        subtitle: {
          vi: 'Bước 01 · Khởi nguồn sinh học của sợi tơ',
          en: 'Stage 01 · Biological Origin of Silk',
        },
        description: {
          vi: 'Lá dâu xanh non ven bãi bồi được hái sạch sương trước khi cho tằm ăn. Sau khoảng 25–28 ngày trải qua 4 kỳ ngủ lột xác, tằm chín nhả ra sợi tơ protein tạo thành kén vàng hoặc trắng tinh.',
          en: 'Fresh riverside mulberry leaves are harvested and fed to silkworms across four molting cycles over 25–28 days until mature larvae spin luminous white or golden cocoons.',
        },
        toolsUsed: {
          vi: 'Nong tre, né lên kén, rổ hái dâu',
          en: 'Woven bamboo trays & cocoon spinning frames',
        },
        artisanTip: {
          vi: 'Lá dâu dính nước mưa hoặc hóa chất sẽ làm tằm yếu, vì vậy lá luôn được lau khô và giữ sạch tuyệt đối.',
          en: 'Damp or impure leaves harm delicate silkworms, so leaves are carefully dried and sorted before every feeding.',
        },
        durationLabel: {
          vi: '28 – 30 ngày',
          en: '28 – 30 days',
        },
        imageUrl: IMG_COCOON_REEL,
      },
      {
        _id: 'proc-2',
        stepOrder: 2,
        title: {
          vi: 'Ươm tơ trong chậu nước nóng',
          en: 'Hot-Water Cocoon Reeling',
        },
        subtitle: {
          vi: 'Bước 02 · Rút mối tơ mảnh mai',
          en: 'Stage 02 · Extracting Continuous Filaments',
        },
        description: {
          vi: 'Kén tằm được thả vào chậu nước ấm khoảng 75–85°C để làm mềm lớp keo sericin tự nhiên. Người thợ dùng đũa tre tìm đầu mối của 6 đến 8 kén, chập lại thành một sợi tơ mộc mảnh dẻ nhưng bền dai.',
          en: 'Cocoons soak in 75–85°C water to soften natural sericin gum. Artisans gather filaments from 6 to 8 cocoons simultaneously, uniting them into a single continuous raw silk strand.',
        },
        toolsUsed: {
          vi: 'Chậu sành đun nóng, đũa tìm mối, guồng ươm tre',
          en: 'Clay heating basin, bamboo filament picks & reel wheel',
        },
        artisanTip: {
          vi: 'Nhiệt độ nước quá cao làm sợi tơ xù lông, quá nguội lại khó tuột kén—người thợ cảm nhận bằng chính đầu ngón tay.',
          en: 'Water too hot frays the silk; water too cool jams the cocoon. Master reelers calibrate heat by fingertip touch.',
        },
        durationLabel: {
          vi: '2 – 4 giờ / mẻ kén',
          en: '2 – 4 hours / batch',
        },
        imageUrl: IMG_COCOON_REEL,
      },
      {
        _id: 'proc-3',
        stepOrder: 3,
        title: {
          vi: 'Quay guồng & Se sợi (Đánh ống)',
          en: 'Spooling & Twisting Threads',
        },
        subtitle: {
          vi: 'Bước 03 · Tạo độ xoắn dẻo dai cho sợi dọc',
          en: 'Stage 03 · Building Tensile Strength',
        },
        description: {
          vi: 'Tơ mộc sau khi ươm được đưa lên guồng gỗ để đánh thành ống nhỏ và xe xoắn 2 hoặc 3 sợi tùy dòng lụa. Độ xoắn chuẩn giúp sợi chịu được lực kéo căng hàng nghìn lần trên khung cửi.',
          en: 'Raw filaments are wound onto wooden bobbins and twisted in 2- or 3-ply configurations depending on the weave, giving warp threads strength to endure loom tension.',
        },
        toolsUsed: {
          vi: 'Guồng quay gỗ, suốt chỉ, máy xe sợi truyền thống',
          en: 'Wooden winding reels, bobbins & traditional twisting frames',
        },
        artisanTip: {
          vi: 'Sợi dọc cần độ xoắn chắc hơn sợi ngang để không bị đứt khi dập lược dệt.',
          en: 'Warp threads receive higher twist than weft threads so they withstand repeated reed beating.',
        },
        durationLabel: {
          vi: '1 – 2 ngày / lô sợi',
          en: '1 – 2 days / batch',
        },
        imageUrl: IMG_HERO_LOOM,
      },
      {
        _id: 'proc-4',
        stepOrder: 4,
        title: {
          vi: 'Mắc cửi & Đan go (Lên khung)',
          en: 'Warping & Heddle Threading',
        },
        subtitle: {
          vi: 'Bước 04 · Sắp xếp hàng nghìn sợi dọc',
          en: 'Stage 04 · Aligning 4,000+ Warp Threads',
        },
        description: {
          vi: 'Đây là công đoạn đòi hỏi sự tập trung cao độ nhất: hàng nghìn sợi tơ dọc dài hàng chục mét được chải thẳng, mắc song song và xỏ qua từng mắt go, từng khe lược thép siêu mảnh.',
          en: 'The most meticulous setup stage: over four thousand parallel silk warp threads are combed smooth and threaded individually through heddle eyes and fine reed dents.',
        },
        toolsUsed: {
          vi: 'Khung mắc cửi, lược dệt, bàn chải tơ, móc xỏ go',
          en: 'Warping frame, steel reed, silk brush & heddle hook',
        },
        artisanTip: {
          vi: 'Chỉ một sợi xỏ nhầm khe go sẽ làm lệch toàn bộ đường hoa văn suốt hàng chục mét lụa.',
          en: 'A single mis-threaded heddle eye breaks symmetry across an entire 20-meter bolt of patterned silk.',
        },
        durationLabel: {
          vi: '3 – 5 ngày / khung mới',
          en: '3 – 5 days / new warp',
        },
        imageUrl: IMG_HERO_LOOM,
      },
      {
        _id: 'proc-5',
        stepOrder: 5,
        title: {
          vi: 'Dệt lụa & Tạo hoa văn Jacquard cổ',
          en: 'Weaving & Jacquard Patterning',
        },
        subtitle: {
          vi: 'Bước 05 · Nhịp thoi đưa dệt nên hoa văn',
          en: 'Stage 05 · Rhythm of Shuttle & Relief Motif',
        },
        description: {
          vi: 'Chân đạp bàn go, tay phóng thoi đưa sợi ngang đan xen qua miệng sợi dọc, kết hợp hệ thống bìa đục lỗ nâng hạ sợi theo mật mã hoa văn Song Hạc, Tứ Quý hay Hoa Cúc. Một ngày thợ lành nghề chỉ dệt được 5–7 mét lụa Vân.',
          en: 'With rhythmic foot pedals and flying wooden shuttles, punched jacquard cards lift selected warp threads to weave recessed and raised motifs. A skilled artisan completes just 5–7 meters of Vân silk per day.',
        },
        toolsUsed: {
          vi: 'Khung cửi gỗ, thoi gỗ trắc, bộ bìa đục lỗ hoa văn',
          en: 'Wooden loom, rosewood shuttle & punched pattern cards',
        },
        artisanTip: {
          vi: 'Lực dập lược phải đều tay như hơi thở; dập mạnh quá lụa cứng, nhẹ quá lụa thưa.',
          en: 'Reed beating must match steady breathing—too hard stiffens the cloth, too soft loosens the weave.',
        },
        durationLabel: {
          vi: '5 – 7 mét / ngày',
          en: '5 – 7 meters / day',
        },
        imageUrl: IMG_HERO_LOOM,
      },
      {
        _id: 'proc-6',
        stepOrder: 6,
        title: {
          vi: 'Chuốt keo (Nấu tơ) & Nhuộm màu',
          en: 'Degumming & Botanical Dyeing',
        },
        subtitle: {
          vi: 'Bước 06 · Đánh thức độ óng ả tiềm ẩn',
          en: 'Stage 06 · Awakening Natural Silk Luster',
        },
        description: {
          vi: 'Tấm lụa mộc còn cứng lớp keo sericin được nấu nhẹ để rũ keo, lộ ra bề mặt trắng ngà mềm mại như nước. Sau đó lụa được nhuộm trong bể thảo mộc cánh kiến, củ nâu, chàm hoặc màu an toàn rồi xả nhiều lần.',
          en: 'Raw woven cloth is gently degummed to shed remaining sericin, revealing luminous ivory softness before immersion in botanical baths of sticklac, yam root, or indigo.',
        },
        toolsUsed: {
          vi: 'Nồi nấu đồng/inox, chum sành nhuộm, sào tre phơi lụa',
          en: 'Degumming vats, ceramic dye jars & bamboo drying poles',
        },
        artisanTip: {
          vi: 'Phơi lụa dưới nắng sớm dịu nhẹ giúp sợi giữ được độ bóng sâu mà không bị giòn gãy.',
          en: 'Drying silk in gentle morning breeze preserves tensile elasticity and deep pearlescent sheen.',
        },
        durationLabel: {
          vi: '1 – 3 ngày tùy màu',
          en: '1 – 3 days per shade',
        },
        imageUrl: IMG_DYE_COURTYARD,
      },
      {
        _id: 'proc-7',
        stepOrder: 7,
        title: {
          vi: 'Căng phơi, kiểm lỗi & Hoàn thiện',
          en: 'Tension Drying & Quality Inspection',
        },
        subtitle: {
          vi: 'Bước 07 · Chuẩn mực súc lụa thành phẩm',
          en: 'Stage 07 · Final Heritage Verification',
        },
        description: {
          vi: 'Lụa sau nhuộm được căng phẳng trên khung gỗ cho thẳng canh sợi, soi dưới ánh sáng tự nhiên để nhặt từng nút tơ thừa trước khi cuộn súc và đóng dấu nhận diện lụa Vạn Phúc chính gốc.',
          en: 'Dyed bolts are tension-stretched on wooden frames, inspected against natural daylight to trim stray knots, and stamped with the village authenticity mark.',
        },
        toolsUsed: {
          vi: 'Khung căng lụa, kéo tỉa tơ, bàn kiểm ánh sáng tự nhiên',
          en: 'Stretching frames, fine trimmers & daylight inspection tables',
        },
        artisanTip: {
          vi: 'Lụa tơ tằm thật khi vò nhẹ trong lòng bàn tay cho cảm giác ấm dịu, không tích điện và đàn hồi tự nhiên.',
          en: 'Authentic mulberry silk feels cool at first touch, warms instantly in the palm, and resists static cling.',
        },
        durationLabel: {
          vi: '1 ngày hoàn thiện',
          en: '1 day finishing',
        },
        imageUrl: IMG_SILK_SWATCH,
      },
    ],
    challenges: [
      {
        _id: 'chal-1',
        title: {
          vi: 'Khủng hoảng thế hệ kế cận và khoảng trống nhân lực trẻ',
          en: 'Generational Succession Gap Among Youth',
        },
        severity: 'critical',
        category: 'succession',
        description: {
          vi: 'Thu nhập từ dệt thủ công đòi hỏi nhiều giờ lao động tỉ mỉ khó cạnh tranh ngay lập tức với công việc văn phòng hay dịch vụ đô thị, khiến phần lớn thợ dệt giàu kinh nghiệm tại Vạn Phúc hiện đều trên 55 tuổi.',
          en: 'Intensive hand-loom hours yield modest early returns compared to urban service jobs, leaving most master weavers in Vạn Phúc over the age of 55 with few full-time apprentices.',
        },
        impactMetric: {
          vi: 'Giảm hơn 75% số hộ trực tiếp đứng khung cửi so với thập niên 1980',
          en: 'Over 75% decline in active loom-weaving households since the 1980s',
        },
        preservationSolution: {
          vi: 'Tổ chức học bổng truyền nghề kết hợp đào tạo thiết kế thời trang đương đại và thương mại số cho thanh niên làng nghề.',
          en: 'Launch paid apprenticeship stipends paired with contemporary fashion design and digital storytelling workshops for youth.',
        },
      },
      {
        _id: 'chal-2',
        title: {
          vi: 'Lụa pha tổng hợp giá rẻ làm xói mòn niềm tin người tiêu dùng',
          en: 'Counterfeit & Synthetic Blends Eroding Trust',
        },
        severity: 'critical',
        category: 'economic',
        description: {
          vi: 'Sự trà trộn của vải polyester hoặc lụa pha công nghiệp giá rẻ gắn mác “lụa Hà Đông” khiến du khách khó phân biệt, gây thiệt hại trực tiếp cho những xưởng dệt 100% tơ tằm chân chính.',
          en: 'Low-cost synthetic polyester blends sold under the “Hà Đông silk” name confuse visitors and undercut honest workshops weaving 100% mulberry silk.',
        },
        impactMetric: {
          vi: 'Chênh lệch giá thành gấp 4–6 lần giữa tơ tằm thật và vải pha công nghiệp',
          en: '4x–6x production cost gap between pure mulberry silk and synthetic imitations',
        },
        preservationSolution: {
          vi: 'Xây dựng bộ nhận diện xuất xứ, hướng dẫn công chúng cách kiểm tra lụa thật (độ bắt sáng, thử nhiệt sợi tơ) và minh bạch quy trình từng xưởng.',
          en: 'Publish origin verification labels, educate visitors on burn/touch authenticity tests, and spotlight certified pure-silk workshops.',
        },
      },
      {
        _id: 'chal-3',
        title: {
          vi: 'Đứt gãy vùng nguyên liệu dâu tằm truyền thống tại Bắc Bộ',
          en: 'Shrinking Northern Mulberry & Raw Silk Supply',
        },
        severity: 'high',
        category: 'supply',
        description: {
          vi: 'Quá trình đô thị hóa ven sông Nhuệ và sông Hồng thu hẹp diện tích trồng dâu nuôi tằm tại địa phương, buộc các hộ dệt Vạn Phúc phải phụ thuộc nguồn tơ vận chuyển từ Lâm Đồng hoặc nhập khẩu biến động giá.',
          en: 'Rapid urbanization along the Nhuệ and Red River basins eliminated local mulberry fields, leaving weavers reliant on distant domestic or volatile imported raw silk.',
        },
        impactMetric: {
          vi: 'Hơn 90% nguyên liệu tơ mộc hiện phải nhập từ các vùng nguyên liệu ngoài Hà Nội',
          en: 'Over 90% of raw silk filament is now sourced outside Hanoi',
        },
        preservationSolution: {
          vi: 'Liên kết chuỗi cung ứng bền vững trực tiếp với các hợp tác xã trồng dâu nuôi tằm Bảo Lộc, Thái Bình và Nam Định.',
          en: 'Establish long-term direct partnerships with ethical mulberry sericulture cooperatives in Bảo Lộc, Thái Bình, and Nam Định.',
        },
      },
      {
        _id: 'chal-4',
        title: {
          vi: 'Áp lực môi trường từ quy trình nhuộm trong khu dân cư đô thị',
          en: 'Urban Environmental Pressure on Dyeing Courtyards',
        },
        severity: 'moderate',
        category: 'environmental',
        description: {
          vi: 'Khi làng cổ nằm gọn trong lòng quận nội đô Hà Đông, việc xử lý nước thải từ công đoạn chuốt keo và nhuộm màu đòi hỏi hạ tầng tách lọc khép kín để vừa giữ nghề vừa bảo vệ môi trường sống.',
          en: 'Surrounded by dense urban Hà Đông neighborhoods, traditional degumming and dye courtyards require closed-loop filtration to balance craft continuity with clean water.',
        },
        impactMetric: {
          vi: 'Cần chuyển đổi sang hệ thống nhuộm thảo mộc & bể lọc tuần hoàn tại cụm sản xuất tập trung',
          en: 'Transitioning to botanical dye baths and centralized wastewater treatment clusters',
        },
        preservationSolution: {
          vi: 'Khuyến khích phục dựng thuốc nhuộm thực vật tự nhiên (cánh kiến, củ nâu, lá chàm) và quy hoạch khu nhuộm tập trung đạt chuẩn môi trường.',
          en: 'Expand natural plant-dye recipes (sticklac, yam root, indigo) and route wet processing through eco-compliant village facilities.',
        },
      },
    ],
    stories: [
      {
        _id: 'story-1',
        slug: 'tieng-thoi-ben-cua-so-go-ky-uc-ba-chieu',
        title: {
          vi: 'Tiếng thoi bên cửa sổ gỗ: Ký ức một đời giữ khung cửi',
          en: 'Shuttle Rhythm by the Wooden Lattice: A Lifetime at the Loom',
        },
        narratorName: 'Nghệ nhân Nguyễn Thị Tâm',
        narratorRole: {
          vi: 'Nghệ nhân Ưu tú · 50 năm tuổi nghề',
          en: 'Meritorious Artisan · 50 Years at the Loom',
        },
        eraContext: {
          vi: 'Làng Vạn Phúc, thập niên 1970 – 2026',
          en: 'Vạn Phúc Village, 1970s – 2026',
        },
        excerpt: {
          vi: 'Từ năm mười sáu tuổi ngồi tập đánh suốt bên mẹ, đến hôm nay mái tóc đã bạc màu tơ trắng, âm thanh lách cách của khung cửi vẫn là nhịp thở thân thuộc nhất mỗi sớm mai.',
          en: 'From winding bobbins beside her mother at sixteen to silver-haired mastery today, the steady clack of the wooden shuttle remains her morning heartbeat.',
        },
        body: {
          vi: 'Ngày ấy, cả xóm tôi không nhà nào tắt đèn trước mười giờ đêm. Mùa đông giá buốt, tay phải ngâm nước ấm nhặt từng mối tơ mảnh hơn sợi tóc, vậy mà hễ nghe tiếng thoi chạy rào rào đều nhịp là lòng lại ấm lên.\n\nCó những năm lụa khó bán, nhiều người hàng xóm buộc phải tháo khung cửi lấy gỗ làm bàn ghế. Tôi giữ lại khung gỗ mít của ông nội, lau dầu mỗi tháng. Giờ đây, mỗi cuối tuần lại có các em sinh viên từ nội thành tìm về, say sưa hỏi cách đan go, đọc hoa văn Song Hạc. Thế là nghề không cô đơn nữa.',
          en: 'Back then, no courtyard in our lane turned off its lantern before ten at night. Even in biting winter air, soaking our fingers to join filaments finer than hair, the rhythmic rush of the shuttle kept our spirits warm.\n\nDuring lean years when many neighbors dismantled looms for timber, I oiled my grandfather’s jackfruit-wood frame every month. Now, every weekend brings university students eager to trace the Twin Cranes pattern—proving the craft is no longer alone.',
        },
        pullQuote: {
          vi: 'Lụa Vạn Phúc không chỉ mặc cho đẹp, mà còn là cách ông cha dệt nắng gió sông Nhuệ vào từng nếp áo.',
          en: 'Vạn Phúc silk is not merely worn for beauty; it weaves the sunlight and river breeze of our ancestors into every fold.',
        },
        coverUrl: IMG_ARTISAN_PORTRAIT,
        publishedAt: '2026-04-05',
      },
      {
        _id: 'story-2',
        slug: 'hanh-trinh-tim-lai-sac-do-canh-kien',
        title: {
          vi: 'Hành trình tìm lại sắc đỏ cánh kiến từ ghi chép của cụ cố',
          en: 'Rediscovering Sticklac Crimson From an Ancestor’s Notebook',
        },
        narratorName: 'Lê Thị Minh Ngọc',
        narratorRole: {
          vi: 'Nghệ nhân trẻ nhuộm màu tự nhiên',
          en: 'Botanical Silk Dyer & Designer',
        },
        eraContext: {
          vi: 'Xưởng nhuộm thảo mộc Vạn Phúc, 2021 – 2026',
          en: 'Botanical Dye Courtyard, 2021 – 2026',
        },
        excerpt: {
          vi: 'Cuốn sổ tay ố vàng ghi tỷ lệ phèn chua, vỏ núc nác và nhựa cánh kiến đã mở ra lối đi xanh cho thế hệ người trẻ yêu lụa truyền thống.',
          en: 'A yellowed notebook recording alum, bark, and sticklac ratios sparked an ecological dye revival led by young village creators.',
        },
        body: {
          vi: 'Khi bắt đầu thử nghiệm nhuộm lại màu đỏ truyền thống bằng cánh kiến tự nhiên, mười mẻ đầu tiên của tôi đều bị xỉn hoặc loang màu. Phải mất gần hai năm điều chỉnh độ pH nguồn nước và thời gian ủ nhiệt, sắc đỏ son ấm sâu mới chịu bám đều lên thớ lụa Vân.\n\nĐiều khiến tôi hạnh phúc nhất là nước xả sau nhuộm hoàn toàn dịu nhẹ với cây cối trong sân, và các bạn trẻ yêu thời trang bền vững đã bắt đầu tìm đến đặt những mét lụa nhuộm thủ công mang dấu ấn thời gian.',
          en: 'When I first attempted traditional sticklac crimson dyeing, ten consecutive batches turned muddy or uneven. It took nearly two years of calibrating water pH and slow simmering before that deep lacquer-red bonded evenly onto Vân jacquard silk.\n\nToday, the leftover botanical bath is gentle enough for our courtyard garden, and young sustainable-fashion designers seek out every hand-dyed bolt.',
        },
        pullQuote: {
          vi: 'Thiên nhiên luôn hào phóng trả lại sắc màu bền bỉ nhất cho những ai chịu khó lắng nghe và chờ đợi.',
          en: 'Nature always rewards patience with colors no synthetic vat can ever imitate.',
        },
        coverUrl: IMG_DYE_COURTYARD,
        publishedAt: '2026-04-14',
      },
      {
        _id: 'story-3',
        slug: 'bo-bia-duc-lo-va-mat-ma-hoa-van-co',
        title: {
          vi: 'Những tấm bìa đục lỗ: Mật mã nhị phân trên khung cửi trăm năm',
          en: 'Punched Jacquard Cards: Binary Heritage on Wooden Looms',
        },
        narratorName: 'Nghệ nhân Phạm Khắc Hà',
        narratorRole: {
          vi: 'Chuyên gia phục dựng hoa văn cổ',
          en: 'Historic Motif Archivist',
        },
        eraContext: {
          vi: 'Kho lưu trữ hoa văn Vạn Phúc',
          en: 'Vạn Phúc Motif Archive',
        },
        excerpt: {
          vi: 'Ít bạn trẻ biết rằng những xấp bìa các-tông đục lỗ treo trên khung cửi Vạn Phúc chính là tiền thân của tư duy lập trình nhị phân.',
          en: 'Few young visitors realize that the hanging punched cards above a Vạn Phúc loom operate on the very logic of binary computing.',
        },
        body: {
          vi: 'Mỗi lỗ thủng trên tấm bìa tương ứng với việc nâng sợi dọc (1), còn phần giấy kín giữ sợi dọc nằm dưới (0). Hàng trăm tấm bìa nối thành vòng tuần hoàn vô tận giúp người thợ dệt tái hiện chính xác từng nét lông cánh hạc hay cánh hoa sen.\n\nViệc số hóa bộ bìa cổ không nhằm thay thế đôi tay nghệ nhân, mà để những mật mã thẩm mỹ của cha ông không bao giờ biến mất nếu tấm giấy cũ bị ẩm mục theo năm tháng.',
          en: 'Each perforation on a hanging jacquard card lifts a warp thread (1), while solid cardboard keeps it lowered (0). Linked into a continuous loop of hundreds of cards, this mechanical memory weaves intricate cranes and lotus blossoms.\n\nDigitizing these historic cards never replaces the weaver’s hand—it ensures ancestral visual code survives beyond fragile paper.',
        },
        pullQuote: {
          vi: 'Mỗi tấm bìa hoa văn là một bản nhạc thị giác mà chỉ tiếng khung cửi mới cất lên trọn vẹn.',
          en: 'Every punched card chain is a visual musical score that only the loom can perform.',
        },
        coverUrl: IMG_SILK_SWATCH,
        publishedAt: '2026-04-19',
      },
    ],
    quizQuestions: [
      {
        _id: 'quiz-1',
        question: {
          vi: 'Làng lụa Vạn Phúc (tên cổ là trang Vạn Bảo) hiện nay thuộc quận/huyện nào của Thủ đô Hà Nội?',
          en: 'Which district of Hanoi is home to the historic Vạn Phúc Silk Village (formerly Vạn Bảo)?',
        },
        options: {
          vi: ['Quận Hà Đông', 'Quận Long Biên', 'Huyện Gia Lâm', 'Quận Tây Hồ'],
          en: ['Hà Đông District', 'Long Biên District', 'Gia Lâm District', 'Tây Hồ District'],
        },
        correctIndex: 0,
        explanation: {
          vi: 'Làng Vạn Phúc nằm bên bờ sông Nhuệ thuộc phường Vạn Phúc, quận Hà Đông, cách trung tâm Hà Nội khoảng 10 km về phía Tây Nam.',
          en: 'Vạn Phúc lies along the Nhuệ River in Hà Đông District, roughly 10 km southwest of central Hanoi.',
        },
        difficulty: 'easy',
        topic: 'history',
      },
      {
        _id: 'quiz-2',
        question: {
          vi: 'Ai là vị Tổ nghề được nhân dân tôn thờ tại đình Vạn Phúc vì có công dạy dân trồng dâu, nuôi tằm, dệt lụa?',
          en: 'Who is revered at Vạn Phúc Communal House as the founder who taught villagers sericulture and weaving?',
        },
        options: {
          vi: ['Bà Lã Thị Nga', 'Bà Triệu Thị Trinh', 'Bà Lê Chân', 'Bà Đoàn Thị Điểm'],
          en: ['Lady Lã Thị Nga', 'Lady Triệu Thị Trinh', 'Lady Lê Chân', 'Poet Đoàn Thị Điểm'],
        },
        correctIndex: 0,
        explanation: {
          vi: 'Tổ nghề Lã Thị Nga (quê Cao Bằng) đã đến trang Vạn Bảo truyền dạy nghề trồng dâu nuôi tằm và dựng khung cửi dệt lụa từ hơn một thiên niên kỷ trước.',
          en: 'Lady Lã Thị Nga taught mulberry cultivation, silkworm care, and loom weaving in ancient Vạn Bảo over a millennium ago.',
        },
        difficulty: 'easy',
        topic: 'history',
      },
      {
        _id: 'quiz-3',
        question: {
          vi: 'Trong quy trình sản xuất lụa, mục đích chính của công đoạn “chuốt keo” (nấu tơ) là gì?',
          en: 'What is the primary purpose of the degumming (“chuốt keo”) stage in silk making?',
        },
        options: {
          vi: [
            'Làm sạch lớp keo sericin để lộ độ mềm mượt và óng ả tự nhiên',
            'Phủ thêm nhựa tổng hợp cho vải cứng cáp hơn',
            'Tẩy trắng vải bằng clo công nghiệp',
            'Kéo giãn sợi tơ dài gấp đôi chiều dài ban đầu',
          ],
          en: [
            'Gently remove sericin gum to reveal silk’s soft, luminous sheen',
            'Coat fabric in synthetic resin for stiffness',
            'Bleach silk using industrial chlorine',
            'Stretch silk filaments to double length',
          ],
        },
        correctIndex: 0,
        explanation: {
          vi: 'Lụa mộc sau khi dệt còn phủ lớp keo sericin tự nhiên khiến vải hơi cứng. Nấu chuốt keo giúp đánh thức độ mềm rủ, thoáng mát và bắt sáng đặc trưng của tơ tằm.',
          en: 'Raw woven silk retains sericin gum that makes it stiff. Gentle degumming washes away this gum, unveiling mulberry silk’s signature drape and glow.',
        },
        difficulty: 'medium',
        topic: 'weaving',
      },
      {
        _id: 'quiz-4',
        question: {
          vi: 'Dòng lụa nào được xem là biểu tượng danh tiếng nhất của Vạn Phúc với hoa văn dệt chìm nổi tinh xảo?',
          en: 'Which traditional weave is Vạn Phúc’s most celebrated signature fabric featuring relief-recessed motifs?',
        },
        options: {
          vi: ['Lụa Vân', 'Vải thô bố', 'Vải lanh thô', 'Vải dạ nỉ'],
          en: ['Vân Silk (Jacquard)', 'Raw Burlap', 'Heavy Hemp Canvas', 'Wool Felt'],
        },
        correctIndex: 0,
        explanation: {
          vi: 'Lụa Vân Vạn Phúc nổi tiếng với mặt lụa bóng mịn điểm xuyết hoa văn chìm nổi Song Hạc, Hoa Cúc, Tứ Quý từng được dùng làm lụa tiến vua và triển lãm tại Paris.',
          en: 'Vân silk is celebrated for luminous recessed-and-raised patterns like Twin Cranes and Chrysanthemums, prized by royal courts and Paris exhibitions.',
        },
        difficulty: 'easy',
        topic: 'motifs',
      },
      {
        _id: 'quiz-5',
        question: {
          vi: 'Mỗi sợi tơ ươm thủ công thường được chập từ bao nhiêu kén tằm trong chậu nước ấm?',
          en: 'Approximately how many cocoons are reeled together simultaneously to form one raw silk thread?',
        },
        options: {
          vi: ['Khoảng 6 đến 8 kén', 'Chỉ đúng 1 kén duy nhất', 'Hơn 100 kén cùng lúc', 'Không cần dùng kén tằm'],
          en: ['About 6 to 8 cocoons', 'Exactly 1 cocoon', 'Over 100 cocoons at once', 'Cocoons are not used'],
        },
        correctIndex: 0,
        explanation: {
          vi: 'Tơ đơn từ 1 kén quá mảnh để dệt. Nghệ nhân thường chập đồng thời 6–8 đầu tơ kén trong nước ấm 75–85°C để tạo thành sợi tơ mộc dẻo dai.',
          en: 'A single cocoon filament is too fine to weave alone; reelers join 6 to 8 filaments in warm water to create one durable raw thread.',
        },
        difficulty: 'medium',
        topic: 'weaving',
      },
      {
        _id: 'quiz-6',
        question: {
          vi: 'Cách nhận biết đơn giản nhất để phân biệt lụa tơ tằm tự nhiên 100% với vải pha sợi tổng hợp là gì?',
          en: 'What is a reliable sensory way to distinguish 100% natural mulberry silk from synthetic polyester imitations?',
        },
        options: {
          vi: [
            'Mềm nhẹ, không tích điện, sờ ban đầu mát tay rồi ấm dần; đốt thử sợi vụn có mùi tóc cháy và tro bóp tan',
            'Vải nặng trịch, bóng loáng chói mắt và tích điện mạnh',
            'Đốt thử sợi vụn vón cục nhựa cứng đen và có mùi khét hóa chất',
            'Vải không bao giờ nhăn dù vò mạnh đến đâu',
          ],
          en: [
            'Feather-light, zero static, warms in palm; burnt loose thread smells like singed hair and crumbles to fine ash',
            'Heavy, mirror-glossy glare with strong static cling',
            'Burnt loose thread melts into a hard plastic bead',
            'Completely crease-proof under heavy crushing',
          ],
        },
        correctIndex: 0,
        explanation: {
          vi: 'Tơ tằm là sợi protein tự nhiên giống cấu trúc tóc người, nên khi thử một sợi tơ thừa nhỏ sẽ tỏa mùi khét hữu cơ nhẹ và bóp thành tro mịn chứ không vón cục nhựa.',
          en: 'Because mulberry silk is a natural protein fiber akin to hair, a single loose test strand burns with an organic scent and crumbles into soft ash rather than melting into plastic.',
        },
        difficulty: 'medium',
        topic: 'preservation',
      },
      {
        _id: 'quiz-7',
        question: {
          vi: 'Hoa văn “Song Hạc” trên lụa Vân Vạn Phúc truyền tải ý nghĩa văn hóa nào?',
          en: 'What cultural symbolism does the traditional “Twin Cranes” (Song Hạc) motif express?',
        },
        options: {
          vi: [
            'Sự trường thọ, thanh cao, thủy chung và hòa hợp',
            'Sức mạnh chinh phục đại dương',
            'Năng suất cơ khí hóa công nghiệp',
            'Biểu tượng mùa đông băng giá',
          ],
          en: [
            'Longevity, nobility, fidelity, and harmony',
            'Maritime conquest',
            'Industrial mechanization',
            'Winter frost',
          ],
        },
        correctIndex: 0,
        explanation: {
          vi: 'Trong mỹ thuật truyền thống Việt Nam, đôi chim hạc bay giữa tầng mây biểu trưng cho khí phách thanh cao, phúc thọ bền lâu và sự gắn bó son sắt.',
          en: 'In Vietnamese visual heritage, paired cranes soaring among clouds embody longevity, noble spirit, and enduring harmony.',
        },
        difficulty: 'easy',
        topic: 'motifs',
      },
      {
        _id: 'quiz-8',
        question: {
          vi: 'Đâu là thách thức lớn nhất hiện nay đối với việc giữ gìn nghề dệt lụa truyền thống Vạn Phúc?',
          en: 'Which challenge currently poses the most urgent threat to sustaining Vạn Phúc’s hand-weaving heritage?',
        },
        options: {
          vi: [
            'Thiếu thế hệ thợ trẻ kế cận và sự cạnh tranh của vải công nghiệp giá rẻ giả danh lụa làng nghề',
            'Khí hậu Việt Nam không thể trồng cây dâu',
            'Không có du khách quốc tế quan tâm đến văn hóa Việt',
            'Khung cửi gỗ không thể dệt được hoa văn',
          ],
          en: [
            'Youth succession gaps and competition from cheap synthetic fabrics mislabeled as craft silk',
            'Mulberry trees cannot grow in Vietnam',
            'Lack of cultural interest from international visitors',
            'Wooden looms are incapable of weaving motifs',
          ],
        },
        correctIndex: 0,
        explanation: {
          vi: 'Sự già hóa đội ngũ nghệ nhân cùng nạn hàng pha giả danh lụa Vạn Phúc là hai bài toán cấp thiết nhất cần sự chung tay của truyền thông, giáo dục và thế hệ trẻ.',
          en: 'An aging master-weaver workforce combined with synthetic lookalikes erodes craft transmission—making youth engagement and transparent verification critical.',
        },
        difficulty: 'hard',
        topic: 'preservation',
      },
    ],
    events: [
      {
        _id: 'evt-1',
        title: {
          vi: 'Workshop Cuối tuần: Tự tay ươm tơ & Dệt khung cửi mini cùng Nghệ nhân',
          en: 'Weekend Workshop: Hand-Reeling Silk & Mini Loom Weaving',
        },
        eventType: 'workshop',
        startDate: '2026-12-06T09:00',
        location: {
          vi: 'Nhà Bảo tồn Lụa cổ, Số 12 Phố Lụa, Vạn Phúc, Hà Đông',
          en: 'Heritage Weaving Courtyard, 12 Silk Street, Vạn Phúc, Hà Đông',
        },
        capacity: 30,
        registeredCount: 18,
        description: {
          vi: 'Trải nghiệm thực tế 3 giờ dành cho học sinh, sinh viên và du khách: tìm hiểu vòng đời tằm dâu, thực hành rút tơ từ kén nước ấm và tự tay dệt một tấm lụa lưu niệm nhỏ.',
          en: 'A 3-hour hands-on session for students and travelers: explore silkworm life cycles, reel raw silk from warm cocoons, and weave a keepsake silk bookmark.',
        },
        registrations: [],
      },
      {
        _id: 'evt-2',
        title: {
          vi: 'Triển lãm Chuyên đề: “Vân Lụa Ngàn Năm — Từ Tiến Vua Đến Thời Trang Trẻ”',
          en: 'Curated Exhibition: “A Millennium of Vân Silk — Royal Heritage to Youth Design”',
        },
        eventType: 'exhibition',
        startDate: '2026-12-14T08:30',
        location: {
          vi: 'Đình Vạn Phúc & Không gian Trưng bày Di sản Hà Đông',
          en: 'Vạn Phúc Communal House & Heritage Gallery',
        },
        capacity: 120,
        registeredCount: 74,
        description: {
          vi: 'Trưng bày hơn 40 mẫu hoa văn lụa Vân cổ được phục dựng, bộ bìa đục lỗ Jacquard đầu thế kỷ XX và các thiết kế áo dài đương đại của sinh viên mỹ thuật.',
          en: 'Showcasing 40+ revived antique Vân patterns, century-old jacquard punch-cards, and contemporary garments created by young design students.',
        },
        registrations: [],
      },
      {
        _id: 'evt-3',
        title: {
          vi: 'Chiến dịch Thanh niên Số hóa Kho Hoa văn & Hướng dẫn Du lịch Xanh',
          en: 'Youth Volunteer Drive: Digitizing Historic Motifs & Eco-Tours',
        },
        eventType: 'volunteer',
        startDate: '2026-12-20T08:00',
        location: {
          vi: 'Trung tâm Sinh hoạt Cộng đồng Làng nghề Vạn Phúc',
          en: 'Vạn Phúc Craft Village Community Hub',
        },
        capacity: 45,
        registeredCount: 29,
        description: {
          vi: 'Mời gọi sinh viên ngành thiết kế, công nghệ thông tin, ngoại ngữ tham gia ghi âm lời kể nghệ nhân, chụp ảnh lưu trữ hoa văn cổ và làm tình nguyện viên thuyết minh song ngữ.',
          en: 'Inviting design, IT, and language students to record elder oral histories, photograph historic pattern cards, and lead bilingual visitor tours.',
        },
        registrations: [],
      },
      {
        _id: 'evt-4',
        title: {
          vi: 'Hành trình Dạo bước Làng Lụa & Thực hành Nhuộm Thảo mộc Cánh kiến',
          en: 'Vạn Phúc Heritage Walk & Botanical Sticklac Dyeing Session',
        },
        eventType: 'tour',
        startDate: '2026-12-27T14:00',
        location: {
          vi: 'Cổng Làng Vạn Phúc — Sân Nhuộm Thảo mộc Bờ Sông Nhuệ',
          en: 'Vạn Phúc Village Gate — Nhuệ River Botanical Dye Yard',
        },
        capacity: 25,
        registeredCount: 11,
        description: {
          vi: 'Tham quan đình cổ, giếng ngọc, xưởng dệt gia truyền 4 đời và trải nghiệm pha màu nhuộm tự nhiên từ cánh kiến, củ nâu trên khăn lụa tơ tằm.',
          en: 'Guided heritage walk past the communal house and 4-generation loom courtyards, concluding with a natural sticklac silk-scarf dyeing session.',
        },
        registrations: [],
      },
    ],
    contacts: [
      {
        _id: 'cnt-1',
        fullName: 'Trần Minh Anh',
        email: 'minhanh.club@hanoi-youth.vn',
        phone: '0912456789',
        inquiryType: 'education',
        message: 'Câu lạc bộ Di sản Sinh viên Trường ĐH KHXH&NV mong muốn đăng ký chuyến tham quan thực tế và giao lưu cùng nghệ nhân cho 40 bạn vào tháng tới.',
        status: 'new',
        createdAt: '2026-11-18T10:15:00.000Z',
      },
    ],
  };
}
