import { useState } from "react";
import { supabase } from "../config/supabaseClient";
import toast from "react-hot-toast";

const docTypeMap = {
  idProof: "id",
  qualification: "qualification_certificate",
  resume: "resume",
  portfolio: "portfolio",
};

export const useInstructorDocumentUpload = (user) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadDocument = async (file, type) => {
    try {
      setUploading(true);
      setProgress(0);

      if (!file) {
        throw new Error("No file selected");
      }

      if (!user?.id) {
        throw new Error("User not authenticated");
      }

      // File validation
      const allowedTypes = [
        "application/pdf",
        "image/png",
        "image/jpeg",
        "image/webp",
      ];
      
      if (!allowedTypes.includes(file.type)) {
        throw new Error("Invalid file type. Only PDF, PNG, JPG, WEBP allowed.");
      }

      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        throw new Error("File size too large. Max 10MB allowed.");
      }

      const dbDocType = docTypeMap[type];
      if (!dbDocType) {
        throw new Error("Invalid document type");
      }

      // Simulate progress
      const interval = setInterval(() => {
        setProgress((p) => Math.min(p + Math.random() * 20, 90));
      }, 200);

      // File name and path
      const fileExt = file.name.split(".").pop();
      const fileName = `${dbDocType}_${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      // Upload to storage
      const { error: storageError } = await supabase.storage
        .from("instructor-documents")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      clearInterval(interval);
      setProgress(100);

      if (storageError) {
        console.error("Storage Error:", storageError);
        throw storageError;
      }

      // Insert into database
      const { data: documentData, error: dbError } = await supabase
        .from("instructor_documents")
        .insert([
          {
            user_id: user.id,
            doc_type: dbDocType,
            storage_bucket: "instructor-documents",
            storage_object: filePath,
            original_filename: file.name,
            mime_type: file.type,
            file_size_bytes: file.size,
            status: "uploaded",
          },
        ])
        .select()
        .single();

      if (dbError) {
        console.error("DB ERROR:", dbError);
        throw dbError;
      }

      toast.success("Document uploaded successfully! 📎");

      return documentData;
    } catch (err) {
      console.error("[useInstructorDocumentUpload] Error:", err);
      toast.error(err.message || "Upload failed");
      return null;
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 1500);
    }
  };

  return {
    uploading,
    progress,
    uploadDocument,
  };
};
