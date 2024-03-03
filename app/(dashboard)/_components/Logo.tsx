import Image from "next/image";
import React from "react";

export default function Logo() {
  return (
    <div className="flex items-center text-4xl font-mono font-extrabold underline">
      <Image height={50} width={50} alt="logo" src="/logo.svg" /> odekan
    </div>
  );
}
