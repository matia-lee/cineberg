const WatchedIcon = ({ onClick, color = 'rgb(120,123,123)', strokeWidth = '20px', className }) => (
  <svg 
    onClick={onClick}
    className={className}
    width="43" 
    height="43" 
    viewBox="0 0 512 512" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>Eye Icon</title>
    <path d="M255.66,112c-77.94,0-157.89,45.11-220.83,135.33a16,16,0,0,0-.27,17.77C82.92,340.8,161.8,400,255.66,400,348.5,400,429,340.62,477.45,264.75a16.14,16.14,0,0,0,0-17.47C428.89,172.28,347.8,112,255.66,112Z" fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth}/>
    <circle cx="256" cy="256" r="80" fill="none" stroke={color} strokeMiterlimit="10" strokeWidth={strokeWidth}/>
  </svg>
);

export default WatchedIcon;
