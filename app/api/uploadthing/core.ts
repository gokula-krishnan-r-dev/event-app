import { createUploadthing, type FileRouter } from "uploadthing/next";
import AWS from "aws-sdk";
import { Request } from "express";
const f = createUploadthing();
const region = "ap-south-1";
const auth = (req: Request) => ({ id: "fakeId" }); // Fake auth function
const bucketName = "room-booking-infygru";
const accessKeyId = "AKIA6ODU53WQ46ZSEA4Z";
const secretAccessKey = "7uIrpurffO4UdlRbVh/e0G290uDtBME18EkEF6v+";
const s3 = new AWS.S3({
  region,
  accessKeyId,
  secretAccessKey,
  signatureVersion: "v4",
});
// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .middleware(async ({ req }: any) => {
      const user = await auth(req);

      if (!user) throw new Error("Unauthorized");

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }: any) => {
      const params = {
        Bucket: bucketName,
        Key: `uploads/`, // Adjust the key as needed
        Body: file.buffer,
        ContentType: file.mimetype,
      };

      // Upload the file to S3
      const uploadResult = await s3.upload(params).promise();

      console.log("Upload complete for userId:", metadata.userId);
      console.log("File URL:", uploadResult.Location);

      // Return S3 URL to be sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId, fileUrl: uploadResult.Location };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
