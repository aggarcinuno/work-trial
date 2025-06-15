"use server";

import { revalidatePath } from "next/cache";
import { v2 as cloudinary } from "cloudinary";

export async function uploadImage(formData: FormData) {
  console.log("uploadasdadadImage", formData);
  const file = formData.get("image") as File;
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const result = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          tags: ["testing"],
        },
        function (error, result) {
          if (error) {
            reject(error);
            return;
          }
          resolve(result);
        }
      )
      .end(buffer);
  });

  revalidatePath("/");
  return (result as any).secure_url;
}
