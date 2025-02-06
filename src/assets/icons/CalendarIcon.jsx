const CalendarIcon = () => {
  return (
    <svg
      width="15"
      height="14"
      viewBox="0 0 15 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mx-2"
      style={{
        stroke: "var(--temp-back)", // Apply the CSS variable directly to stroke
      }}
    >
      <path
        d="M1.5 6.08333H13.5M10.8333 0.75V3.41667M4.16667 0.75V3.41667M10.8333 2.08333H4.16667C3.45942 2.08333 2.78115 2.36428 2.28105 2.86438C1.78095 3.36448 1.5 4.04276 1.5 4.75V10.5833C1.5 11.2906 1.78095 11.9689 2.28105 12.469C2.78115 12.969 3.45942 13.25 4.16667 13.25H10.8333C11.5406 13.25 12.2189 12.969 12.719 12.469C13.219 11.9689 13.5 11.2906 13.5 10.5833V4.75C13.5 4.04276 13.219 3.36448 12.719 2.86438C12.2189 2.36428 11.5406 2.08333 10.8333 2.08333Z"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
export default CalendarIcon;
