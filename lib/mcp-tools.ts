import prisma from "./prisma";

export const mcpTools = {
  // Tool tra cứu tài liệu học tập
  query_learning_material: async (userId: number, keyword: string) => {
  console.log("Đang tìm tài liệu với từ khóa:", keyword);

  const cleanKeyword = keyword.replace(/\.(docx|pdf|txt)$/i, "").trim();

  return await prisma.document.findMany({
    where: {
      userId: userId,
      OR: [
        { title: { contains: keyword } },     
        { title: { contains: cleanKeyword } }, 
      ],
    },
    orderBy: { createdAt: "desc" },
    take: 1,
  });
},

  // Tool lấy thống kê cho Admin
  get_system_stats: async (role: string) => {
    if (role !== "Admin") { 
      return { error: "Unauthorized" }; 
    }

    const studentCount = await prisma.user.count({
      where: { vaiTro: "HocVien" }, // Đảm bảo khớp với chữ 'HocVien' trong ảnh
    });

    const docCount = await prisma.document.count();

    return { studentCount, docCount };
  },
};