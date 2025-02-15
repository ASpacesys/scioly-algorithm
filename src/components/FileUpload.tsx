"use client";  // This tells Next.js this is a client-side component

import { useState } from "react";
import { useDropzone } from "react-dropzone";

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [downloadLink, setDownloadLink] = useState<string | null>(null);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"]
    },
    onDrop: (acceptedFiles) => {
      setFile(acceptedFiles[0]);
    }
  });

const handleUpload = async () => {
  if (!file) {
    console.error("No file selected");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);  // ✅ Key must match FastAPI

  try {
    const response = await fetch("https://so-algorithm-keh0ay60d-aspacesys-projects.vercel.app/", {
      method: "POST",
      body: formData,  // ✅ Sends file as FormData
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Upload failed:", errorText);
      return;
    }

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    setDownloadLink(downloadUrl);
  } catch (error) {
    console.error("Error uploading file:", error);
  }
};

  return (
    <div className="flex flex-col items-center gap-4 p-5 border border-gray-300 rounded-lg">
      <div {...getRootProps()} className="p-6 border-2 border-dashed cursor-pointer">
        <input {...getInputProps()} />
        {file ? <p>{file.name}</p> : <p>Drag & drop a file, or click to select one</p>}
      </div>
      <button
        onClick={handleUpload}
        className="px-4 py-2 bg-blue-500 text-white rounded-md"
      >
        Upload File
      </button>
      {downloadLink && (
        <a href={downloadLink} download="team_assignments.xlsx" className="text-blue-600">
          Download Output File
        </a>
      )}
    </div>
  );
}
