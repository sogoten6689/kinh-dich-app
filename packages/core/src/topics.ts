import { elementRelation } from "./elements";
import type { Hexagram } from "./hexagrams";
import type { MeihuaResult } from "./meihua";
import type { Reading } from "./reading";

export type Topic = "general" | "love" | "career" | "fortune";
export type SubjectTopic = Exclude<Topic, "general">;

/** Mức tốt xấu chung của quẻ theo cách hiểu truyền thống. */
export type Luck = "cat" | "binh" | "hung";

export const LUCK_LABEL: Readonly<Record<Luck, string>> = { cat: "Cát", binh: "Bình", hung: "Hung" };

export const TOPICS: readonly { id: Topic; name: string; hint: string }[] = [
  { id: "general", name: "Tổng quát", hint: "Luận chung: tình thế, chiều hướng, diễn biến bên trong." },
  { id: "love", name: "Tình duyên", hint: "Chuyện tình cảm, hôn nhân, mối quan hệ đôi lứa." },
  { id: "career", name: "Công việc", hint: "Sự nghiệp, kinh doanh, học hành, quan hệ đồng nghiệp." },
  { id: "fortune", name: "Vận mệnh", hint: "Vận thế chung của bản thân trong thời gian tới." },
];

export function topicName(t: Topic): string {
  return TOPICS.find((x) => x.id === t)!.name;
}

/** [mức, tình duyên, công việc, vận mệnh] theo thứ tự Văn Vương (chỉ số 0 = quẻ 1). */
const DATA: readonly (readonly [Luck, string, string, string])[] = [
  ["cat", "Chủ động, mạnh mẽ nhưng dễ cứng nhắc; cần mềm mỏng và tôn trọng đối phương.", "Thời vận hanh thông, hợp khởi sự và giữ vai trò dẫn dắt; tránh tự cao.", "Năng lượng dồi dào, bền bỉ tiến lên thì thành; đầy quá dễ tràn."],
  ["cat", "Hợp với sự dịu dàng, bao dung; thuận theo nhau hơn là áp đặt thì duyên tốt.", "Làm tốt vai trò hỗ trợ, theo người dẫn dắt sẽ có kết quả; chưa nên đứng đầu.", "Vững chãi, tích lũy dần; nhẫn nại và khiêm nhường đem lại phúc."],
  ["hung", "Khởi đầu nhiều trắc trở, hiểu lầm; kiên nhẫn vun đắp, chưa nên vội cưới hỏi.", "Việc mới gặp khó, thiếu người giúp; nên tìm cộng sự và đi từng bước nhỏ.", "Giai đoạn gian nan ban đầu; vượt qua được thì mở ra cơ hội lớn."],
  ["binh", "Tình cảm còn non nớt, chưa hiểu nhau; cần chân thành và học cách lắng nghe.", "Cần học hỏi, tìm người thầy giỏi; chưa đủ kinh nghiệm để quyết việc lớn.", "Còn mơ hồ, chưa rõ hướng; chịu khó học hỏi thì dần sáng tỏ."],
  ["binh", "Duyên đến nhưng cần chờ đợi; đừng thúc ép, đến lúc chín muồi sẽ thành.", "Chưa đến lúc hành động; chuẩn bị kỹ, giữ sức chờ thời.", "Kiên nhẫn chờ đợi thì có lộc, an vui; nóng vội dễ gặp hiểm."],
  ["hung", "Dễ cãi vã, tranh hơn thua; nhường nhịn một bước để giữ hòa khí.", "Có tranh chấp, kiện tụng, hợp đồng trục trặc; nên hòa giải, tránh theo đến cùng.", "Thị phi vây quanh; biết dừng đúng lúc thì tránh được tổn thất."],
  ["binh", "Tình cảm cần trách nhiệm và sự rõ ràng; đề phòng cạnh tranh hay người thứ ba.", "Hợp làm việc tập thể có tổ chức; cần người lãnh đạo chính trực, nghiêm minh.", "Phải dấn thân, vất vả mới thành; giữ chính đạo thì không lỗi."],
  ["cat", "Gần gũi, hòa hợp, dễ gặp người hợp ý; đừng chần chừ kẻo lỡ duyên.", "Được người giúp đỡ, hợp tác thuận lợi; chọn đúng người để gắn bó.", "Nhân hòa, có quý nhân; thân thiện và thành thật đem lại may mắn."],
  ["binh", "Tình cảm vướng trở ngại nhỏ, chậm tiến triển; nhẹ nhàng thuyết phục dần.", "Bị kìm hãm tạm thời; tích lũy từng chút, chưa thể làm lớn.", "Mây dày mà chưa mưa; tích tiểu thành đại, đợi thời."],
  ["binh", "Cần cư xử đúng mực, tôn trọng; tránh chạm vào điểm nhạy cảm của đối phương.", "Làm việc với người khó tính hay cấp trên mạnh; lễ độ, cẩn trọng thì an toàn.", "Như giẫm đuôi hổ; thận trọng từng bước thì qua được nguy."],
  ["cat", "Âm dương giao hòa, tình cảm thuận lợi, hợp cưới hỏi.", "Mọi việc hanh thông, hợp mở rộng và hợp tác.", "Thời kỳ thịnh vượng, trên dưới thông suốt; nhớ phòng lúc thịnh cực sinh suy."],
  ["hung", "Hai bên khó thông cảm, xa cách; giữ mình và chờ thời cơ khác.", "Bế tắc, trên dưới không thông; nên thu mình, giữ sức.", "Vận bĩ tắc; kiên trì giữ mình, bĩ cực rồi sẽ thái lai."],
  ["cat", "Hợp nhau về chí hướng, dễ thành đôi; tránh khép kín và thiên vị.", "Hợp làm việc nhóm, liên kết rộng; công khai minh bạch thì thành.", "Được mọi người ủng hộ; mở lòng với người thì đường rộng."],
  ["cat", "Tình cảm đầy đủ, viên mãn; có nhiều người để ý, cần giữ chung thủy.", "Thành công lớn, tài lộc dồi dào; giữ khiêm tốn để bền lâu.", "Vận sáng như mặt trời giữa trưa; có nhiều nên biết chia sẻ."],
  ["cat", "Khiêm nhường, chân thành khiến đối phương cảm mến; tình bền.", "Khiêm tốn được trọng dụng, việc thành mà không gây đố kỵ.", "Khiêm thì được phúc; sáu hào đều tốt, đi đâu cũng thuận."],
  ["cat", "Vui vẻ, hứng khởi, dễ có tin vui; tránh mải vui mà buông thả.", "Có chuẩn bị, lòng người hưởng ứng; hợp ra mắt, khởi động dự án.", "An hòa vui vẻ; lo trước tính sau thì vui được lâu."],
  ["cat", "Thuận theo nhau thì hòa hợp; chọn người đáng theo, đừng theo cảm xúc nhất thời.", "Linh hoạt theo thời thế, đi theo người giỏi sẽ được lợi.", "Biết tùy thời mà biến thì thuận; giữ chính để không lạc đường."],
  ["binh", "Có vấn đề tồn đọng, chuyện cũ chưa giải quyết; thẳng thắn sửa chữa mới tiến được.", "Tiếp quản việc đổ nát, cần cải tổ; vất vả nhưng làm được sẽ có công.", "Sửa lỗi cũ, dọn dẹp hậu quả; tính kỹ trước và sau khi làm."],
  ["cat", "Tình cảm đang đến gần, thuận lợi; nên nắm lấy thời cơ.", "Cơ hội tới, được giao việc, thăng tiến; thời tốt không kéo dài mãi.", "Vận đang lên; tận dụng ngay, đồng thời phòng lúc suy."],
  ["binh", "Nên quan sát, tìm hiểu kỹ trước khi quyết; giữ hình ảnh chân thành.", "Hợp nghiên cứu, đánh giá, tư vấn; làm gương cho người khác.", "Lúc nên nhìn lại mình và quan sát thời cuộc, chưa nên làm lớn."],
  ["binh", "Có vật cản giữa hai người như hiểu lầm hay người thứ ba; cần dứt khoát giải quyết.", "Phải xử lý trở ngại, chuyện pháp lý, kỷ luật; quyết đoán thì thông.", "Cắn vỡ chướng ngại thì hợp được; xử sự công minh."],
  ["binh", "Bề ngoài đẹp đẽ, lãng mạn; cần chú trọng thực chất bên trong.", "Hợp việc thẩm mỹ, trình bày; việc nhỏ thì lợi, việc lớn cần thực lực.", "Tốt đẹp bên ngoài; đừng chạy theo hình thức."],
  ["hung", "Tình cảm hao mòn, có nguy cơ rạn vỡ; giữ mình, đừng cố níu kéo.", "Suy thoái, bị lấn át, dễ mất vị trí; không nên tiến, hãy chờ thời.", "Vận suy, tiểu nhân lấn lướt; giữ gốc, đợi phục hồi."],
  ["cat", "Tình cũ quay lại hoặc tình cảm hồi phục; bắt đầu lại từ từ.", "Khởi sắc trở lại sau giai đoạn khó; làm lại từ đầu thì thuận.", "Một hào dương sinh lại, vận hồi phục; quay về đường đúng sẽ tốt."],
  ["binh", "Chân thành tự nhiên thì tốt; tính toán, mưu cầu dễ gặp chuyện bất ngờ.", "Làm đúng bổn phận, không đầu cơ; tránh việc trái lẽ.", "Có thể gặp chuyện bất ngờ; sống ngay thẳng thì không lỗi."],
  ["cat", "Tình cảm bền, tích lũy lâu dài; hợp tính chuyện lâu dài.", "Tích lũy thực lực lớn, hợp đầu tư, làm việc lớn, đi xa làm ăn.", "Dưỡng sức, tích đức; lợi cho việc lớn."],
  ["binh", "Chăm sóc lẫn nhau; chú ý lời nói và cách đối đãi.", "Hợp nghề nuôi dưỡng, giáo dục, ăn uống; tự lực, đừng trông chờ người.", "Giữ gìn lời ăn tiếng nói và sức khỏe; tự nuôi mình bằng chính đạo."],
  ["hung", "Tình cảm quá đà hoặc chênh lệch lớn; cần cân bằng, tránh quyết định cực đoan.", "Gánh nặng quá sức, cơ cấu sắp đổ; cần thay đổi mạnh nhưng khéo léo.", "Áp lực vượt ngưỡng; biết lượng sức và tìm chỗ dựa."],
  ["hung", "Nhiều trắc trở, lo âu; giữ lòng tin vào nhau để vượt qua.", "Hiểm nguy chồng chất; giữ nguyên tắc, kiên trì, không mạo hiểm thêm.", "Rơi vào chỗ hiểm; giữ lòng thành và bình tĩnh thì thoát."],
  ["cat", "Nồng nhiệt, rực rỡ nhưng dễ bốc đồng; cần dựa vào điều đúng đắn.", "Hợp việc văn hóa, truyền thông, cần sự sáng suốt; dựa vào người có năng lực.", "Sáng sủa, được chú ý; giữ ngọn lửa đều, đừng cháy quá nhanh."],
  ["cat", "Cảm ứng mạnh, tình cảm đôi lứa rất tốt, hợp cưới hỏi.", "Dễ thuyết phục, được cảm tình; hợp đàm phán, hợp tác.", "Lòng người cảm thông; chân thành thì được đáp lại."],
  ["cat", "Tình bền lâu, hợp hôn nhân; giữ sự kiên định.", "Kiên trì với hướng đã chọn sẽ thành; tránh thay đổi liên tục.", "Bền bỉ thì lâu dài; giữ đạo thường."],
  ["binh", "Nên lùi một bước, giữ khoảng cách; không hợp theo đuổi lúc này.", "Rút lui chiến lược, tránh tiểu nhân; giữ sức cho sau.", "Thời nên ẩn; lui đúng lúc là khôn ngoan."],
  ["cat", "Mạnh mẽ, chủ động; tránh áp đặt, nóng nảy làm hỏng chuyện.", "Thế mạnh, hợp tiến lên; giữ chính, đừng cậy sức.", "Vận mạnh; mạnh mà biết dừng mới bền."],
  ["cat", "Tình cảm tiến triển tốt, được gia đình bạn bè ủng hộ.", "Thăng tiến, được trọng dụng, công việc phát triển.", "Như mặt trời mọc, ngày càng sáng."],
  ["hung", "Tình cảm bị che khuất, nỗi lòng khó bày tỏ; cần nhẫn nại.", "Bị chèn ép, tài năng bị che lấp; giấu tài, giữ mình.", "Vận tối; giữ sáng bên trong, chờ bình minh."],
  ["cat", "Hợp xây dựng gia đình; vai trò rõ ràng, trên kính dưới nhường.", "Nội bộ ổn định là gốc; hợp quản trị nội bộ, việc gia đình.", "Lấy nhà làm gốc; gia đạo yên thì mọi việc yên."],
  ["binh", "Bất đồng, mỗi người một hướng; tìm điểm chung nhỏ để hòa.", "Mâu thuẫn ý kiến; việc nhỏ được, việc lớn khó.", "Trái ngược nhưng có thể dung hòa; tìm cái chung trong cái khác."],
  ["hung", "Gặp trở ngại, khó tiến tới; quay về tự xét và tìm người giúp.", "Khó khăn chặn trước; không nên mạo hiểm, nên tìm quý nhân.", "Đường đi gập ghềnh; dừng lại, sửa mình."],
  ["cat", "Hiểu lầm được hóa giải, quan hệ nhẹ nhõm hơn.", "Khó khăn được tháo gỡ; hành động nhanh gọn.", "Thoát khỏi bế tắc; tha thứ và bước tiếp."],
  ["binh", "Cần hy sinh, bớt cái tôi để vun đắp.", "Cắt giảm, tinh gọn; bớt chi phí để lợi về sau.", "Bớt ở chỗ này để thêm chỗ khác; giảm đúng chỗ là được."],
  ["cat", "Tình cảm được vun đắp, cùng nhau tiến bộ.", "Được lợi, hợp đầu tư, mở rộng, làm việc lớn.", "Vận tăng tiến; giúp người thì mình được lợi."],
  ["binh", "Cần thẳng thắn, dứt khoát giải quyết vấn đề; tránh nóng giận.", "Quyết đoán loại bỏ cái xấu; công khai, đừng dùng sức ép.", "Lúc phải quyết; quyết mà vẫn giữ cảnh giác."],
  ["binh", "Gặp gỡ bất ngờ, có sức hút nhưng cần thận trọng, chưa nên vội gắn bó.", "Cơ hội đến bất ngờ; cẩn thận với đối tác, đề phòng tiểu nhân.", "Gặp gỡ tình cờ; phòng cái xấu nhỏ lớn dần."],
  ["cat", "Hội tụ, dễ gặp gỡ, có tiệc vui; hợp ra mắt gia đình.", "Tập hợp nhân lực, nguồn lực; hợp tổ chức sự kiện.", "Mọi người tụ về; chuẩn bị phòng bất trắc."],
  ["cat", "Tình cảm tiến dần lên; kiên trì sẽ tốt.", "Thăng tiến từng bước, được cất nhắc; nên gặp người có quyền.", "Đi lên đều đặn như cây mọc."],
  ["hung", "Bế tắc, thiếu thốn; lời nói ít được tin, nên giữ lòng.", "Khốn đốn, nguồn lực cạn; giữ khí tiết, bớt nói làm nhiều.", "Vận khốn; giữ vững chí hướng thì qua được."],
  ["binh", "Tình cảm bền nhưng bình lặng; cần làm mới và chăm sóc.", "Ổn định, phục vụ người khác; cần cải tiến công cụ, kỹ năng.", "Như giếng nước không cạn; giữ nguồn, sửa giếng."],
  ["binh", "Thay đổi lớn trong tình cảm; đổi mới đúng lúc thì tốt.", "Cải cách, đổi việc, đổi phương pháp; cần đủ thời và lòng tin.", "Thời thay đổi; bỏ cũ theo mới."],
  ["cat", "Ổn định, hợp tiến tới hôn nhân; nuôi dưỡng tình cảm.", "Vị thế vững, được trọng dụng; hợp xây dựng tổ chức.", "Đã có nền tảng; dùng đúng người thì rất tốt."],
  ["binh", "Có chuyện làm xáo động, bất ngờ; bình tĩnh sẽ qua.", "Biến động mạnh, tin bất ngờ; giữ vững tinh thần để hành động.", "Biến cố làm sợ hãi rồi qua; tỉnh táo thì vững."],
  ["binh", "Tạm dừng, chưa phải lúc tiến tới; giữ bình tĩnh.", "Nên dừng, tránh mở rộng; tập trung việc hiện tại.", "Biết dừng đúng chỗ là an."],
  ["cat", "Tình cảm tiến dần, rất hợp cưới hỏi theo đúng lễ.", "Thăng tiến từ từ, vững chắc.", "Từng bước mà lên, không vội."],
  ["hung", "Tình cảm vội vàng hoặc không đúng danh phận; dễ chịu thiệt.", "Ở vị trí phụ, không chủ động; tránh hành động vội.", "Đi sai thứ tự dễ hỏng; cần kiên nhẫn đợi."],
  ["cat", "Tình cảm thăng hoa, sung mãn; thịnh rồi thì phòng suy.", "Đỉnh cao thành công; tận dụng nhưng chuẩn bị cho lúc thoái.", "Thịnh lớn như mặt trời giữa trưa; qua trưa là xế."],
  ["binh", "Tình cảm xa cách hoặc chưa ổn định; cẩn thận khi ở nơi xa.", "Đi xa, công tác, chưa ổn định; khiêm nhường, cẩn trọng.", "Như khách lữ hành; việc nhỏ tốt, giữ mình."],
  ["binh", "Mềm mỏng, khéo léo thì hòa hợp; tránh do dự quá lâu.", "Thâm nhập dần, thuyết phục bằng sự kiên nhẫn; hợp buôn bán.", "Thuận theo như gió; nên tìm người có tầm giúp đỡ."],
  ["cat", "Vui vẻ, hòa hợp, lời nói ngọt ngào; giữ sự chân thành.", "Hợp giao tiếp, bán hàng, đàm phán; được lòng người.", "Vui vẻ hanh thông; vui đúng lẽ thì bền."],
  ["binh", "Có khoảng cách, lạnh nhạt; cần hàn gắn, gắn kết lại.", "Tan rã hoặc phân tán; cần tập hợp lại, tìm điểm chung.", "Tan rồi lại hợp; xóa bỏ ngăn cách."],
  ["binh", "Cần tiết chế, biết giới hạn trong tình cảm.", "Kiểm soát chi tiêu, kế hoạch; tiết chế vừa phải thì tốt.", "Có chừng mực thì thuận; quá khắt khe thì khổ."],
  ["cat", "Thành tâm, chung thủy, được tin yêu.", "Uy tín cao, giữ chữ tín thì thành; hợp ký kết.", "Lòng thành cảm được người; vượt được khó."],
  ["binh", "Chú ý chuyện nhỏ, đừng đòi hỏi lớn.", "Việc nhỏ được, việc lớn không; hạ thấp mục tiêu.", "Hơi quá một chút; nên khiêm hạ, đừng vươn cao."],
  ["binh", "Đã thành đôi; cần giữ gìn kẻo về sau rối.", "Việc đã hoàn thành; đề phòng lơ là sinh lỗi.", "Đầu tốt, cuối dễ loạn; phòng bị khi đã xong."],
  ["binh", "Chưa thành, còn cần thời gian và nỗ lực.", "Việc chưa xong; chuẩn bị kỹ, cẩn trọng ở bước cuối.", "Đang chuyển từ rối sang yên; còn nhiều hy vọng."],
];

export interface HexagramTopics {
  luck: Luck;
  love: string;
  career: string;
  fortune: string;
}

export function hexagramTopics(h: Hexagram): HexagramTopics {
  const [luck, love, career, fortune] = DATA[h.number - 1]!;
  return { luck, love, career, fortune };
}

/** Ai/điều gì ứng với nội quái (dưới) và ngoại quái (trên) theo từng chủ đề. */
const SIDES: Readonly<Record<SubjectTopic, { inner: string; outer: string; yong: string }>> = {
  love: { inner: "cảm xúc và cách cư xử của bạn", outer: "người ấy và gia đình hai bên", yong: "người ấy / mối quan hệ" },
  career: { inner: "năng lực của bạn và nội bộ", outer: "cấp trên, đối tác, thị trường", yong: "công việc" },
  fortune: { inner: "nội tâm, sức khỏe, gia đạo", outer: "hoàn cảnh, thời thế bên ngoài", yong: "sự việc" },
};

const LUCK_SCORE: Readonly<Record<Luck, number>> = { hung: 0, binh: 1, cat: 2 };

export type Trend = "up" | "down" | "same" | "still";

export const TREND_LABEL: Readonly<Record<Trend, string>> = {
  up: "Chuyển biến tốt lên",
  down: "Cần đề phòng xấu đi",
  same: "Giữ nhịp như hiện tại",
  still: "Đứng yên, ít biến chuyển",
};

export interface TopicSection {
  key: "now" | "future" | "focus" | "tiyong" | "advice";
  title: string;
  body: string;
}

export interface TopicReading {
  topic: SubjectTopic;
  title: string;
  now: Luck;
  future: Luck | null;
  trend: Trend;
  sections: TopicSection[];
}

/** Luận một lần gieo theo chủ đề: tình duyên, công việc hoặc vận mệnh. */
export function readTopic(r: Reading, topic: SubjectTopic, meihua?: MeihuaResult | null): TopicReading {
  const now = hexagramTopics(r.primary);
  const future = r.transformed ? hexagramTopics(r.transformed) : null;
  const trend: Trend = !future
    ? "still"
    : LUCK_SCORE[future.luck] > LUCK_SCORE[now.luck]
      ? "up"
      : LUCK_SCORE[future.luck] < LUCK_SCORE[now.luck]
        ? "down"
        : "same";
  const side = SIDES[topic];

  const sections: TopicSection[] = [
    { key: "now", title: "Hiện tại", body: `${r.primary.fullName} (${LUCK_LABEL[now.luck]}): ${now[topic]}` },
  ];
  if (r.transformed && future) {
    sections.push({ key: "future", title: "Chiều hướng", body: `${r.transformed.fullName} (${LUCK_LABEL[future.luck]}): ${future[topic]}` });
  }

  const inner = r.changingLines.some((p) => p <= 3);
  const outer = r.changingLines.some((p) => p >= 4);
  const focus =
    inner && outer
      ? `Hào động ở cả hai phía: thay đổi đến từ cả hai phía — ${side.inner} lẫn ${side.outer}.`
      : inner
        ? `Hào động nằm ở nội quái: thay đổi bắt đầu từ phía bạn (${side.inner}). Chủ động điều chỉnh bản thân là chìa khóa.`
        : outer
          ? `Hào động nằm ở ngoại quái: thay đổi đến từ bên ngoài (${side.outer}). Quan sát và ứng xử khéo léo.`
          : `Không có hào động: nội quái là ${side.inner}, ngoại quái là ${side.outer}; cả hai đang ổn định.`;
  sections.push({ key: "focus", title: "Thay đổi đến từ đâu", body: focus });

  if (meihua) {
    const rel = elementRelation(meihua.ti.element, meihua.yong.element);
    const who = topic === "love" ? "người ấy" : topic === "career" ? "công việc" : "sự việc";
    const meaning =
      rel === "same" || rel === "b-generates-a"
        ? `${who} đang ủng hộ bạn`
        : rel === "a-overcomes-b"
          ? `bạn nắm thế chủ động với ${who}, nhưng phải bỏ công sức`
          : rel === "a-generates-b"
            ? `bạn đang dồn nhiều tâm sức cho ${who}, dễ hao tổn`
            : `${who} đang gây áp lực lên bạn`;
    sections.push({
      key: "tiyong",
      title: "Thể – Dụng",
      body: `Thể là bạn, Dụng là ${side.yong}. ${meihua.verdict.label}: ${meaning}.`,
    });
  }

  const advice =
    trend === "up"
      ? "Tình thế đang mở ra; kiên trì với hướng hiện tại và đón nhận cơ hội."
      : trend === "down"
        ? "Đang thuận lúc này nhưng có dấu hiệu chững lại; giữ những gì đã có, tránh quyết định vội."
        : trend === "same"
          ? now.luck === "hung"
            ? "Khó khăn còn kéo dài; nhẫn nại, giữ sức và tìm người giúp đỡ."
            : "Mọi thứ diễn tiến đều đặn; giữ nhịp và làm tốt phần việc của mình."
          : now.luck === "hung"
            ? "Tình thế khó nhưng chưa biến động; giữ mình, đừng mạo hiểm."
            : "Tình thế ổn định; lời của quẻ chủ là kim chỉ nam lúc này.";
  sections.push({ key: "advice", title: "Lời khuyên", body: advice });

  return { topic, title: topicName(topic), now: now.luck, future: future?.luck ?? null, trend, sections };
}
