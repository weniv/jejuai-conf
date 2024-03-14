const ArrowSVG = ({ color = "#8D9299" }: { color?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill={color}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.97554 5.37569C3.20985 5.14137 3.58975 5.14137 3.82407 5.37569L8.19981 9.75142L12.5755 5.37569C12.8099 5.14137 13.1898 5.14137 13.4241 5.37569C13.6584 5.61 13.6584 5.9899 13.4241 6.22421L8.62407 11.0242C8.38975 11.2585 8.00986 11.2585 7.77554 11.0242L2.97554 6.22422C2.74123 5.9899 2.74123 5.61 2.97554 5.37569Z"
      />
    </svg>
  );
};

export default ArrowSVG;
