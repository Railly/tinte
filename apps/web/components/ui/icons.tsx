import { cn } from "@/lib/utils";

function IconMoon({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      fill="currentColor"
      className={cn("size-4", className)}
      {...props}
    >
      <path d="M233.54 142.23a8 8 0 0 0-8-2 88.08 88.08 0 0 1-109.8-109.8 8 8 0 0 0-10-10 104.84 104.84 0 0 0-52.91 37A104 104 0 0 0 136 224a103.09 103.09 0 0 0 62.52-20.88 104.84 104.84 0 0 0 37-52.91 8 8 0 0 0-1.98-7.98Zm-44.64 48.11A88 88 0 0 1 65.66 67.11a89 89 0 0 1 31.4-26A106 106 0 0 0 96 56a104.11 104.11 0 0 0 104 104 106 106 0 0 0 14.92-1.06 89 89 0 0 1-26.02 31.4Z" />
    </svg>
  );
}

function IconSun({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      fill="currentColor"
      className={cn("size-4", className)}
      {...props}
    >
      <path d="M120 40V16a8 8 0 0 1 16 0v24a8 8 0 0 1-16 0Zm72 88a64 64 0 1 1-64-64 64.07 64.07 0 0 1 64 64Zm-16 0a48 48 0 1 0-48 48 48.05 48.05 0 0 0 48-48ZM58.34 69.66a8 8 0 0 0 11.32-11.32l-16-16a8 8 0 0 0-11.32 11.32Zm0 116.68-16 16a8 8 0 0 0 11.32 11.32l16-16a8 8 0 0 0-11.32-11.32ZM192 72a8 8 0 0 0 5.66-2.34l16-16a8 8 0 0 0-11.32-11.32l-16 16A8 8 0 0 0 192 72Zm5.66 114.34a8 8 0 0 0-11.32 11.32l16 16a8 8 0 0 0 11.32-11.32ZM48 128a8 8 0 0 0-8-8H16a8 8 0 0 0 0 16h24a8 8 0 0 0 8-8Zm80 80a8 8 0 0 0-8 8v24a8 8 0 0 0 16 0v-24a8 8 0 0 0-8-8Zm112-88h-24a8 8 0 0 0 0 16h24a8 8 0 0 0 0-16Z" />
    </svg>
  );
}
function IconComputer({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-4", className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="18" height="12" x="3" y="4" rx="2" ry="2" />
      <line x1="2" x2="22" y1="20" y2="20" />
    </svg>
  );
}
function IconPipette({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-4", className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m2 22 1-1h3l9-9" />
      <path d="M3 21v-3l9-9" />
      <path d="m15 6 3.4-3.4a2.1 2.1 0 1 1 3 3L18 9l.4.4a2.1 2.1 0 1 1-3 3l-3.8-3.8a2.1 2.1 0 1 1 3-3l.4.4Z" />
    </svg>
  );
}

function IconTinte({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      className={cn("size-6", className)}
      viewBox="0 0 1000 1000"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect width="1000" height="1000" rx="500" className="fill-foreground" />
      <path
        d="M482.372 360.458C491.341 321.22 502.508 282.568 513.532 243.874C516.502 233.45 517.465 222.777 515.616 211.956C512.937 196.275 501.226 188.801 485.825 193.289C476.039 196.14 468.37 202.304 461.815 209.854C440.994 233.836 431.499 262.958 424.209 293.028C415.667 328.26 409.809 364.009 404.032 399.76C402.912 406.691 399.771 410.476 393.08 412.78C382.026 416.586 371.255 421.232 360.454 425.737C324.553 440.709 289.698 457.671 257.778 480.119C250.429 485.286 243.589 491.125 238.772 498.769C231.309 510.613 235.17 521.722 248.146 523.046C265.866 524.854 283.775 525.837 301.156 519.418C329.239 509.048 356.215 496.257 383.081 483.176C385.877 481.815 388.41 478.725 393.146 480.841C390.226 494.767 386.975 508.719 384.406 522.794C374.806 575.401 364.702 628.004 372.476 681.903C377.695 718.09 391.541 749.848 420.844 773.339C458.297 803.364 501.529 812.495 548.43 807.862C616.8 801.108 673.858 772.012 719.88 721.242C721.787 719.138 724.496 717.28 723.74 712.776C720.514 714.929 717.981 716.551 715.52 718.276C703.397 726.772 691.052 734.926 677.165 740.317C622.574 761.509 567.509 760.274 512.45 742.697C479.344 732.127 451.359 713.718 430.849 685.126C427.99 681.141 424.79 677.108 425.17 671.304C426.51 671.761 427.27 671.783 427.583 672.167C428.938 673.831 430.29 675.521 431.413 677.342C442.88 695.947 458.827 709.795 478.165 719.509C548.588 754.885 618.66 751.081 685.511 711.966C727.289 687.522 755.717 650.579 764.513 601.233C765.424 596.118 766.499 590.962 763.873 583.439C750.244 621.98 728.465 652.046 697.444 674.941C666.311 697.919 630.923 710.481 592.284 710.027C554.311 709.58 518.427 700.086 487.856 675.29C545.082 706.228 602.354 705.222 659.025 675.338C711.051 647.904 767.236 567.842 758.355 535.716C757.809 535.876 756.952 535.873 756.768 536.222C755.488 538.652 754.248 541.112 753.178 543.64C746.168 560.194 737.628 575.98 724.741 588.619C677.388 635.059 620.351 653.939 554.893 643.64C518.617 637.933 491.962 617.454 479.611 581.76C463.315 534.662 463.039 486.614 472.233 438.075C473.549 431.128 476.793 427.564 483.081 424.905C510.082 413.491 537.869 404.365 565.908 395.972C623.874 378.622 683.172 367.584 742.984 358.941C750.354 357.876 758.224 358.234 766 353.676C763.689 352.808 762.372 352.163 760.981 351.827C759.194 351.396 757.357 351.12 755.525 350.935C713.219 346.671 671.203 350.802 629.287 355.821C585.535 361.061 542.568 370.854 499.382 379.339C476.985 383.74 476.974 383.68 482.372 360.458Z"
        className="fill-background"
      />
    </svg>
  );
}

function IconGithub({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 438.549 438.549"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("size-4", className)}
      {...props}
    >
      <path
        fill="currentColor"
        d="M409.132 114.573c-19.608-33.596-46.205-60.194-79.798-79.8-33.598-19.607-70.277-29.408-110.063-29.408-39.781 0-76.472 9.804-110.063 29.408-33.596 19.605-60.192 46.204-79.8 79.8C9.803 148.168 0 184.854 0 224.63c0 47.78 13.94 90.745 41.827 128.906 27.884 38.164 63.906 64.572 108.063 79.227 5.14.954 8.945.283 11.419-1.996 2.475-2.282 3.711-5.14 3.711-8.562 0-.571-.049-5.708-.144-15.417a2549.81 2549.81 0 01-.144-25.406l-6.567 1.136c-4.187.767-9.469 1.092-15.846 1-6.374-.089-12.991-.757-19.842-1.999-6.854-1.231-13.229-4.086-19.13-8.559-5.898-4.473-10.085-10.328-12.56-17.556l-2.855-6.57c-1.903-4.374-4.899-9.233-8.992-14.559-4.093-5.331-8.232-8.945-12.419-10.848l-1.999-1.431c-1.332-.951-2.568-2.098-3.711-3.429-1.142-1.331-1.997-2.663-2.568-3.997-.572-1.335-.098-2.43 1.427-3.289 1.525-.859 4.281-1.276 8.28-1.276l5.708.853c3.807.763 8.516 3.042 14.133 6.851 5.614 3.806 10.229 8.754 13.846 14.842 4.38 7.806 9.657 13.754 15.846 17.847 6.184 4.093 12.419 6.136 18.699 6.136 6.28 0 11.704-.476 16.274-1.423 4.565-.952 8.848-2.383 12.847-4.285 1.713-12.758 6.377-22.559 13.988-29.41-10.848-1.14-20.601-2.857-29.264-5.14-8.658-2.286-17.605-5.996-26.835-11.14-9.235-5.137-16.896-11.516-22.985-19.126-6.09-7.614-11.088-17.61-14.987-29.979-3.901-12.374-5.852-26.648-5.852-42.826 0-23.035 7.52-42.637 22.557-58.817-7.044-17.318-6.379-36.732 1.997-58.24 5.52-1.715 13.706-.428 24.554 3.853 10.85 4.283 18.794 7.952 23.84 10.994 5.046 3.041 9.089 5.618 12.135 7.708 17.705-4.947 35.976-7.421 54.818-7.421s37.117 2.474 54.823 7.421l10.849-6.849c7.419-4.57 16.18-8.758 26.262-12.565 10.088-3.805 17.802-4.853 23.134-3.138 8.562 21.509 9.325 40.922 2.279 58.24 15.036 16.18 22.559 35.787 22.559 58.817 0 16.178-1.958 30.497-5.853 42.966-3.9 12.471-8.941 22.457-15.125 29.979-6.191 7.521-13.901 13.85-23.131 18.986-9.232 5.14-18.182 8.85-26.84 11.136-8.662 2.286-18.415 4.004-29.263 5.146 9.894 8.562 14.842 22.077 14.842 40.539v60.237c0 3.422 1.19 6.279 3.572 8.562 2.379 2.279 6.136 2.95 11.276 1.995 44.163-14.653 80.185-41.062 108.068-79.226 27.88-38.161 41.825-81.126 41.825-128.906-.01-39.771-9.818-76.454-29.414-110.049z"
      ></path>
    </svg>
  );
}

function IconRH({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      className={cn("size-4", className)}
      width="219"
      height="249"
      viewBox="0 0 219 249"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M104.586 8.32431C107.627 6.55857 111.373 6.55856 114.414 8.32431L207.086 62.1319C210.127 63.8977 212 67.1609 212 70.6924V178.308C212 181.839 210.127 185.102 207.086 186.868L114.414 240.676C111.373 242.441 107.627 242.441 104.586 240.676L11.9145 186.868C8.87339 185.102 7 181.839 7 178.308V70.6924C7 67.1609 8.87339 63.8977 11.9145 62.1319L104.586 8.32431Z"
        stroke="currentColor"
        stroke-width="13"
      />
      <path
        d="M108.5 13.5C154.5 52.3333 218.9 151.3 108.5 236.5"
        stroke="currentColor"
        stroke-width="10"
        stroke-linecap="round"
      />
      <path
        d="M12.5 68L105.5 233"
        stroke="currentColor"
        stroke-width="10"
        stroke-linecap="round"
      />
      <path
        d="M12 183L105 18"
        stroke="currentColor"
        stroke-width="10"
        stroke-linecap="round"
      />
    </svg>
  );
}

function IconInfo({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("size-4", className)}
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
}
function IconHeart({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("size-4", className)}
      {...props}
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

function IconLoading({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("size-4 animate-spin", className)}
      {...props}
    >
      <path d="M12 2v4" />
      <path d="m16.2 7.8 2.9-2.9" />
      <path d="M18 12h4" />
      <path d="m16.2 16.2 2.9 2.9" />
      <path d="M12 18v4" />
      <path d="m4.9 19.1 2.9-2.9" />
      <path d="M2 12h4" />
      <path d="m4.9 4.9 2.9 2.9" />
    </svg>
  );
}

function IconCopy({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("size-4", className)}
      {...props}
    >
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );
}

function IconDownload({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("size-4", className)}
      {...props}
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" x2="12" y1="15" y2="3" />
    </svg>
  );
}

function IconVercel({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 93 80"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("size-4", className)}
      {...props}
    >
      <g clip-path="url(#clip0_935_5)">
        <path d="M46.1261 0L92.2523 79.8937H0L46.1261 0Z" fill="currentColor" />
      </g>
    </svg>
  );
}

function IconSupabase({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 78 80"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("size-4", className)}
      {...props}
    >
      <g clip-path="url(#clip0_934_13)">
        <path
          d="M45.5063 78.6549C43.463 81.228 39.3199 79.8182 39.2707 76.5326L38.5508 28.4766H70.8636C76.7163 28.4766 79.9805 35.2365 76.3412 39.8202L45.5063 78.6549Z"
          fill="url(#paint0_linear_934_13)"
        />
        <path
          d="M45.5063 78.6549C43.463 81.228 39.3199 79.8182 39.2707 76.5326L38.5508 28.4766H70.8636C76.7163 28.4766 79.9805 35.2365 76.3412 39.8202L45.5063 78.6549Z"
          fill="url(#paint1_linear_934_13)"
          fill-opacity="0.2"
        />
        <path
          d="M32.3647 1.329C34.408 -1.24447 38.5511 0.165607 38.6004 3.45126L38.9159 51.5072H7.00745C1.15455 51.5072 -2.10971 44.7473 1.52979 40.1636L32.3647 1.329Z"
          fill="#3ECF8E"
        />
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_934_13"
          x1="858.836"
          y1="1094"
          x2="2711.69"
          y2="1871.08"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#249361" />
          <stop offset="1" stop-color="#3ECF8E" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_934_13"
          x1="116.844"
          y1="-649.275"
          x2="1306.29"
          y2="1589.79"
          gradientUnits="userSpaceOnUse"
        >
          <stop />
          <stop offset="1" stop-opacity="0" />
        </linearGradient>
        <clipPath id="clip0_934_13">
          <rect width="77.8707" height="80" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

function IconTailwind({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 133 80"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("size-4", className)}
      {...props}
    >
      <g clip-path="url(#clip0_934_21)">
        <path
          d="M66.4935 0C48.7619 0 37.6797 8.8658 33.2468 26.5974C39.8961 17.7316 47.6537 14.4069 56.5195 16.6234C61.5779 17.888 65.1934 21.5577 69.1954 25.6199C75.7147 32.2373 83.26 39.8961 99.7403 39.8961C117.472 39.8961 128.554 31.0303 132.987 13.2987C126.338 22.1645 118.58 25.4892 109.714 23.2727C104.656 22.0081 101.04 18.3384 97.0384 14.2762C90.5191 7.65882 82.9738 0 66.4935 0ZM33.2468 39.8961C15.5152 39.8961 4.4329 48.7619 0 66.4935C6.64935 57.6277 14.4069 54.303 23.2727 56.5195C28.3312 57.7841 31.9467 61.4538 35.9486 65.5161C42.4679 72.1334 50.0132 79.7922 66.4935 79.7922C84.2251 79.7922 95.3074 70.9264 99.7403 53.1948C93.0909 62.0606 85.3333 65.3853 76.4675 63.1688C71.4091 61.9042 67.7936 58.2345 63.7917 54.1723C57.2723 47.5549 49.727 39.8961 33.2468 39.8961Z"
          fill="url(#paint0_linear_934_21)"
        />
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_934_21"
          x1="-369.408"
          y1="2553.35"
          x2="11116.2"
          y2="9175.68"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#2298BD" />
          <stop offset="1" stop-color="#0ED7B5" />
        </linearGradient>
        <clipPath id="clip0_934_21">
          <rect width="132.987" height="80" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

function IconSparkles({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-4", className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
      <path d="M20 3v4" />
      <path d="M22 5h-4" />
      <path d="M4 17v2" />
      <path d="M5 18H3" />
    </svg>
  );
}

function IconSend({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-4", className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m3 3 3 9-3 9 19-9Z" />
      <path d="M6 12h16" />
    </svg>
  );
}

function IconPlus({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-4", className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <line x1="12" x2="12" y1="5" y2="19" />
      <line x1="5" x2="19" y1="12" y2="12" />
    </svg>
  );
}

function IconSave({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-4", className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
      <path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7" />
      <path d="M7 3v4a1 1 0 0 0 1 1h7" />
    </svg>
  );
}

function IconGenerate({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-4", className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72" />
      <path d="m14 7 3 3" />
      <path d="M5 6v4" />
      <path d="M19 14v4" />
      <path d="M10 2v2" />
      <path d="M7 8H3" />
      <path d="M21 16h-4" />
      <path d="M11 3H9" />
    </svg>
  );
}

function IconExport({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-4", className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" x2="12" y1="15" y2="3" />
    </svg>
  );
}

function IconShare({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-4", className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M13 4v4c-6.575 1.028 -9.02 6.788 -10 12c-.037 .206 5.384 -5.962 10 -6v4l8 -7l-8 -7z" />
    </svg>
  );
}

function IconChevronDown({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-4", className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function IconEdit({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-4", className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
      <path d="m15 5 4 4" />
    </svg>
  );
}

function IconRandom({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-4", className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22" />
      <path d="m18 2 4 4-4 4" />
      <path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2" />
      <path d="M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8" />
      <path d="m18 14 4 4-4 4" />
    </svg>
  );
}

function IconLock({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-4", className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function IconSpace({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-4", className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M22 17v1c0 .5-.5 1-1 1H3c-.5 0-1-.5-1-1v-1" />
    </svg>
  );
}

function IconCheck({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-4", className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <path d="m9 11 3 3L22 4" />
    </svg>
  );
}

function IconClick({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-4", className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m4 4 7.07 17 2.51-7.39L21 11.07z" />
    </svg>
  );
}

function IconGrid({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-4", className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="7" height="7" x="3" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="14" rx="1" />
      <rect width="7" height="7" x="3" y="14" rx="1" />
    </svg>
  );
}

function IconZap({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-4", className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
    </svg>
  );
}

function IconTrash({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-4", className)}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      {...props}
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}

function IconUsers({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-4", className)}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      {...props}
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

export {
  IconUsers,
  IconTrash,
  IconZap,
  IconGrid,
  IconClick,
  IconCheck,
  IconSpace,
  IconLock,
  IconRandom,
  IconEdit,
  IconChevronDown,
  IconShare,
  IconExport,
  IconGenerate,
  IconSave,
  IconSparkles,
  IconSend,
  IconPlus,
  IconTailwind,
  IconSupabase,
  IconVercel,
  IconCopy,
  IconDownload,
  IconLoading,
  IconHeart,
  IconInfo,
  IconMoon,
  IconSun,
  IconComputer,
  IconPipette,
  IconTinte,
  IconGithub,
  IconRH,
};
