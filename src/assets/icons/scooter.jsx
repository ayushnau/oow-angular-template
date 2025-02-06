import React from "react";

const Scooter = ({color = "currentColor"}) => {
  return (
    <svg
      width="20"
      height="14"
      viewBox="0 0 20 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="Food delivering">
        <g id="Vector">
          <path
            d="M4 1H7C7.55 1 8 1.45 8 2C8 2.55 7.55 3 7 3H4C3.45 3 3 2.55 3 2C3 1.45 3.45 1 4 1ZM17 8C15.34 8 14 9.34 14 11C14 12.66 15.34 14 17 14C18.66 14 20 12.66 20 11C20 9.34 18.66 8 17 8ZM17 12C16.45 12 16 11.55 16 11C16 10.45 16.45 10 17 10C17.55 10 18 10.45 18 11C18 11.55 17.55 12 17 12Z"
            fill={color}
          />
          <path
            d="M17 2C17 0.9 16.1 0 15 0H13C12.45 0 12 0.45 12 1C12 1.55 12.45 2 13 2H15V4.65L11.52 9H8V5C8 4.45 7.55 4 7 4H4C1.79 4 0 5.79 0 8V10C0 10.55 0.45 11 1 11H2C2 12.66 3.34 14 5 14C6.66 14 8 12.66 8 11H11.52C12.13 11 12.7 10.72 13.08 10.25L16.56 5.9C16.85 5.54 17 5.1 17 4.65V2ZM5 12C4.45 12 4 11.55 4 11H6C6 11.55 5.55 12 5 12Z"
            fill={color}
          />
        </g>
      </g>
    </svg>
  );
};

export default Scooter;
