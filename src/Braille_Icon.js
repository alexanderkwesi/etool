// FIXED: Proper BrailleIcon component with SVG
export const CustomBrailleIcon = ({ sx, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    style={sx}
    {...props}
    aria-hidden="true"
  >
    <circle cx="8" cy="8" r="2" fill="currentColor" />
    <circle cx="16" cy="8" r="2" fill="currentColor" />
    <circle cx="8" cy="16" r="2" fill="currentColor" />
    <circle cx="16" cy="16" r="2" fill="currentColor" />
  </svg>
);