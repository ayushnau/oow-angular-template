import React from "react";

const Outofstock = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill="none"
    >
      <rect
        x="0.5"
        y="0.5"
        width="25"
        height="25"
        rx="6.5"
        fill="white"
        stroke="#DC9203"
      />
      <path
        d="M13 10V15"
        stroke="#DC9203"
        stroke-width="1.5"
        stroke-linecap="round"
      />
      <circle cx="13" cy="18" r="1" fill="#DC9203" />
    </svg>
  );
};

export default Outofstock;
