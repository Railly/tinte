import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const upload = createUploadthing();

export const uploadRouter = {
  refImage: upload({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 3,
    },
  })
    .middleware(async () => {
      const { userId } = await auth();
      if (!userId) {
        throw new Error("Unauthorized");
      }
      return { userId };
    })
    .onUploadComplete(({ file, metadata }) => ({
      url: file.ufsUrl,
      name: file.name,
      key: file.key,
      userId: metadata.userId,
    })),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;
