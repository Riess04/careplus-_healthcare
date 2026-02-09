"use client";

import { convertFileToUrl } from "@/lib/utils";
import Image from "next/image";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { MAX_FILE_SIZE } from "@/lib/validation";

type FileUploaderProps = {
  files: File[] | undefined;
  onChange: (files: File[]) => void;
};

const FileUploader = ({ files, onChange }: FileUploaderProps) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onChange(acceptedFiles);
    },
    [onChange]
  );

  const { getRootProps, getInputProps, fileRejections } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "images/png": [".png"],
      "application/pdf": [".pdf"],
    },
    maxSize: MAX_FILE_SIZE,
    maxFiles: 1,
    multiple: false,
  });

  return (
    <div {...getRootProps()} className="file-upload">
      <input {...getInputProps()} />

      {/* show rejection errors immediately */}
      {fileRejections.length > 0 && (
        <p className="text-red-500 text-sm">
          {fileRejections[0].errors[0].message}
        </p>
      )}

      {files && files?.length > 0 ? (
        <Image
          src={convertFileToUrl(files[0])}
          width={1000}
          height={1000}
          alt="Uploaded image"
          className="max-h-[400px] overflow-hidden object-cover"
        />
      ) : (
        <>
          <Image
            src="/assets/icons/upload.svg"
            width={40}
            height={40}
            alt="upload"
          />
          <div className="file-upload_label">
            <p className="text-14-regular">
              <span className="text-green-500">Click to Upload </span>
              or drag and drop
            </p>
            <p className="text-12-regular">
              PNG,JPG or PDF (max file size: 5MB)
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default FileUploader;
