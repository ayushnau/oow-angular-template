import React from "react";

const HeartSvg = ({ isActive, isHovered, handleClick, handleMouseEnter, handleMouseLeave }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
      className={`cursor-pointer ${isHovered ? "text-red-600" : ""}`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <path
        d="M20.8405 4.77676C20.3297 4.26576 19.7233 3.8604 19.0558 3.58384C18.3884 3.30728 17.673 3.16493 16.9505 3.16493C16.228 3.16493 15.5126 3.30728 14.8451 3.58384C14.1777 3.8604 13.5712 4.26576 13.0605 4.77676L12.0005 5.83676L10.9405 4.77676C9.90879 3.74507 8.50952 3.16547 7.05049 3.16547C5.59145 3.16547 4.19218 3.74507 3.16049 4.77676C2.12879 5.80845 1.54919 7.20772 1.54919 8.66676C1.54919 10.1258 2.12879 11.5251 3.16049 12.5568L4.22048 13.6168L12.0005 21.3968L19.7805 13.6168L20.8405 12.5568C21.3515 12.046 21.7568 11.4396 22.0334 10.7721C22.31 10.1047 22.4523 9.38925 22.4523 8.66676C22.4523 7.94427 22.31 7.22886 22.0334 6.5614C21.7568 5.89394 21.3515 5.28751 20.8405 4.77676V4.77676Z"
        stroke={isActive ? "red" : isHovered ? "red" : "#748BA0"}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={`${isActive ? "red" : "none"}`}
      />
    </svg>
  );
};

export default HeartSvg;
