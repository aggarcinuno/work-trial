"use client";

import { Button } from "@/components/ui/button";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadItemProgress,
  FileUploadList,
  type FileUploadProps,
  FileUploadTrigger,
} from "@/components/ui/file-upload";
import { uploadImage } from "@/lib/actions/upload-image";
import { Upload, X } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

export function FileUploadDirectUploadDemo({
  onImageUpload,
}: {
  onImageUpload?: (url: string) => void;
}) {
  const [files, setFiles] = React.useState<File[]>([]);

  const onUpload: NonNullable<FileUploadProps["onUpload"]> = React.useCallback(
    async (files, { onProgress, onSuccess, onError }) => {
      try {
        // Process each file individually
        const uploadPromises = files.map(async (file) => {
          try {
            // Create FormData for the server action
            const formData = new FormData();
            formData.append("image", file);

            // Start the upload
            onProgress(file, 0);

            // Call the server action
            const imageUrl = await uploadImage(formData);
            console.log("imageUrl", imageUrl);

            // Update progress to 100% and mark as success
            onProgress(file, 100);
            onSuccess(file);
            
            // Call the onImageUpload callback with the URL
            onImageUpload?.(imageUrl);
          } catch (error) {
            onError(
              file,
              error instanceof Error ? error : new Error("Upload failed")
            );
          }
        });

        // Wait for all uploads to complete
        await Promise.all(uploadPromises);
        toast.success("Success", {
          description: "Files uploaded successfully",
        });
      } catch (error) {
        console.error("Unexpected error during upload:", error);
        toast.error("Error", {
          description: "Failed to upload files",
        });
      }
    },
    []
  );

  const onFileReject = React.useCallback((file: File, message: string) => {
    toast(message, {
      description: `"${
        file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name
      }" has been rejected`,
    });
  }, []);

  return (
    <FileUpload
      value={files}
      onValueChange={setFiles}
      onUpload={onUpload}
      onFileReject={onFileReject}
      maxFiles={1}
      className="w-full"
      disabled={files.length > 0}
    >
      <FileUploadDropzone>
        <div className="flex flex-col items-center gap-1 text-center">
          <div className="flex items-center justify-center rounded-full border p-2.5">
            <Upload className="size-6 text-muted-foreground" />
          </div>
          <p className="font-medium text-sm">
            {files.length > 0 ? "File uploaded" : "Drag & drop file here"}
          </p>
          <p className="text-muted-foreground text-xs">
            {files.length > 0 ? "Remove existing file to upload a new one" : "Or click to browse (max 1 file)"}
          </p>
        </div>
        <FileUploadTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2 w-fit"
            disabled={files.length > 0}
          >
            Browse files
          </Button>
        </FileUploadTrigger>
      </FileUploadDropzone>
      <FileUploadList>
        {files.map((file, index) => (
          <FileUploadItem key={index} value={file} className="flex-col">
            <div className="flex w-full items-center gap-2">
              <FileUploadItemPreview />
              <FileUploadItemMetadata />
              <FileUploadItemDelete asChild>
                <Button variant="ghost" size="icon" className="size-7">
                  <X />
                </Button>
              </FileUploadItemDelete>
            </div>
            <FileUploadItemProgress />
          </FileUploadItem>
        ))}
      </FileUploadList>
    </FileUpload>
  );
}
