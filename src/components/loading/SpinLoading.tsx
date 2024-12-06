"use client";

import React from "react";

export const SpinLoading: React.FC<{ text?: string }> = ({ text }) => {
  return (
    <div className="flex justify-center items-center">
      <span
        className={`animate-spin-fast rounded-full border-t-emerald-800 border-r-emerald-800 border-b-emerald-800 border-slate-100 w-6 h-6 border-4`}
      ></span>
      {text && <span className="ml-2">{text}</span>}
    </div>
  );
};
