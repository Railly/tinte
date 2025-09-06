export default function TweakCNIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      width="1em"
      height="1em"
      className={className}
    >
      <path fill="none" d="M0 0h256v256H0z"></path>
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="24"
        d="m208 128-.2.2M168.2 167.8 128 208M192 40l-76.2 76.2M76.2 155.8 40 192"
      ></path>
      <circle
        cx="188"
        cy="148"
        r="24"
        fill="none"
        stroke="currentColor"
        strokeWidth="24"
      ></circle>
      <circle
        cx="96"
        cy="136"
        r="24"
        fill="none"
        stroke="currentColor"
        strokeWidth="24"
      ></circle>
    </svg>
  );
}
