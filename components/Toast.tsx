"use client";

import { useEffect, useState } from "react";

interface Props {
  message: string;
  visible: boolean;
}

export default function Toast({ message, visible }: Props) {
  return (
    <div
      className={`fixed bottom-24 left-1/2 -translate-x-1/2 bg-primary text-white px-5 py-2.5 rounded-full text-sm shadow-lg z-50 transition-all duration-300 whitespace-nowrap pointer-events-none ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
      }`}
    >
      {message}
    </div>
  );
}
