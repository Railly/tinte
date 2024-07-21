import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const PATCH = async (
  req: Request,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  const { displayName, userId } = (await req.json()) as {
    displayName: string;
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
        name: displayName.toLocaleLowerCase().replace(/\s/g, "-"),
        display_name: displayName,
      },
    });

    revalidatePath("/", "page");

    return NextResponse.json(theme);
  } catch (error) {
    console.error("Error updating theme name:", error);
    return NextResponse.json(
      { error: "Failed to update theme name" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
};
