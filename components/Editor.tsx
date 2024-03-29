"use client";

import dynamic from "next/dynamic";
import React, { useMemo } from "react";
// Import CSS for the editor
import "react-quill/dist/quill.snow.css";

interface EditorProps {
  onChange: (value: string) => void;
  value: string;
}
/**
 * Component for the rich text editor.
 * @param onChange Function to handle change in editor content.
 * @param value Current value of the editor.
 */
export default function Editor({ onChange, value }: EditorProps) {
  // Dynamically load ReactQuill component to prevent server-side rendering
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill"), { ssr: false }),
    []
  );
  return (
    <div className="bg-white">
      {/* Render ReactQuill component with provided props */}
      <ReactQuill theme="snow" value={value} onChange={onChange}></ReactQuill>
    </div>
  );
}
