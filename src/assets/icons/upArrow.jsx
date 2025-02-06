const UpArrow = ({color}) => {
  return (
    <svg
      width="12"
      height="8"
      viewBox="0 0 12 8"
      fill={color || null}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.599927 6.99625C0.866626 7.26791 1.29903 7.26791 1.56573 6.99625L5.9999 2.47945L10.4341 6.99625C10.7008 7.26791 11.1332 7.26791 11.3999 6.99625C11.6666 6.72458 11.6666 6.28411 11.3999 6.01244L6.4828 1.00375C6.21611 0.732079 5.7837 0.732079 5.517 1.00375L0.599927 6.01244C0.333227 6.28411 0.333227 6.72458 0.599927 6.99625Z"
        fill={color || "#0C1D2E"}
      />
    </svg>
  );
};

export default UpArrow