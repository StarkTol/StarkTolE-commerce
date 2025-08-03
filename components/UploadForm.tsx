"use client";

import { useState } from "react";

export default function UploadForm() {
  const [imageUrl, setImageUrl] = useState("");

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (data.url) {
      setImageUrl(data.url);
      console.log("Uploaded URL:", data.url);
      // TODO: Save data.url to your product document in MongoDB here.
    }
  }

  return (
    <div className="space-y-4">
      <input
        type="file"
        onChange={handleUpload}
        className="border p-2"
        accept="image/*"
      />
      {imageUrl && (
        <img
          src={imageUrl}
          alt="Uploaded"
          className="w-48 h-48 object-cover border"
        />
      )}
    </div>
  );
}
