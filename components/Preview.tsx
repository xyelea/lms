"use client";

import "react-quill/dist/quill.bubble.css";

import React, { useMemo } from "react";
import dynamic from "next/dynamic";

interface PreviewProps {
  value: string;
}

/**
 * Component for previewing rich text content.
 * @param value The rich text content to preview.
 */
export default function Preview({ value }: PreviewProps) {
  // Dynamically load ReactQuill component to prevent server-side rendering
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill"), { ssr: false }),
    []
  );
  return <ReactQuill theme="bubble" value={value} readOnly />;
}
