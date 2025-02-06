import React from "react";

const Exclamation = ({ color = "currentColor" }) => {
  return (
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="3"
        height="15"
        viewBox="0 0 3 11"
        fill={color}
      >
        <path
          d="M1.25 10.421C0.559625 10.421 0 9.8614 0 9.17102V1.67102C0 0.980646 0.559625 0.421021 1.25 0.421021C1.94037 0.421021 2.5 0.980646 2.5 1.67102V9.17102C2.5 9.8614 1.94037 10.421 1.25 10.421Z"
          fill={color}
        />
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="3"
        height="3"
        viewBox="0 0 3 3"
        fill="none"
      >
        <path
          d="M1.25 2.92102C1.94036 2.92102 2.5 2.36138 2.5 1.67102C2.5 0.980665 1.94036 0.421021 1.25 0.421021C0.559644 0.421021 0 0.980665 0 1.67102C0 2.36138 0.559644 2.92102 1.25 2.92102Z"
          fill={color}
        />
      </svg>
    </div>
  );
};

export default Exclamation;
