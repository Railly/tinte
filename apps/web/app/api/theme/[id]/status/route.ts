import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const { isPublic, userId } = (await req.json()) as {
    isPublic: boolean;
    userId: string;
  };

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const theme = await prisma.themes.update({
      where: {
        xata_id: id,
        User: userId,
      },
      data: {
        is_public: isPublic,
      },
    });

    revalidatePath("/");

    return NextResponse.json(theme);
  } catch (error) {
    console.error("Error updating theme public status:", error);
    return NextResponse.json(
      { error: "Failed to update theme public status" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
