"use client";
import React from "react";
import liff from "@line/liff";

export const ButtonArea: React.FC = () => {
  const handleClose = () => {
    liff.closeWindow();
  };

  return (
    <div>
      <button
        className="border-2 border-cyan-800 text-white rounded-md bg-cyan-800 hover:border-cyan-800 hover:bg-white 
    hover:text-cyan-800 font-semibold text-xl tracking-wide shadow-md shadow-cyan-900/40 active:shadow-none py-2 px-6"
        onClick={handleClose}
      >
        画面を閉じる
      </button>
    </div>
  );
};
