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
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
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
      <g clipPath="url(#clip0_935_5)">
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
      <g clipPath="url(#clip0_934_13)">
        <path
          d="M45.5063 78.6549C43.463 81.228 39.3199 79.8182 39.2707 76.5326L38.5508 28.4766H70.8636C76.7163 28.4766 79.9805 35.2365 76.3412 39.8202L45.5063 78.6549Z"
          fill="url(#paint0_linear_934_13)"
        />
        <path
          d="M45.5063 78.6549C43.463 81.228 39.3199 79.8182 39.2707 76.5326L38.5508 28.4766H70.8636C76.7163 28.4766 79.9805 35.2365 76.3412 39.8202L45.5063 78.6549Z"
          fill="url(#paint1_linear_934_13)"
          fillOpacity="0.2"
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
          <stop stopColor="#249361" />
          <stop offset="1" stopColor="#3ECF8E" />
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
          <stop offset="1" stopOpacity="0" />
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
      <g clipPath="url(#clip0_934_21)">
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
          <stop stopColor="#2298BD" />
          <stop offset="1" stopColor="#0ED7B5" />
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
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
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

function IconUser({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-4", className)}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      {...props}
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function IconBrush({ className, ...props }: React.ComponentProps<"svg">) {
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
      <path d="M9.06 11.9l8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08" />
      <path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z" />
    </svg>
  );
}
function IconGlobe({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-4", className)}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  );
}

function IconPalette({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-4", className)}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      {...props}
    >
      <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
      <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
      <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
      <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
    </svg>
  );
}

function IconGitHub({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-4", className)}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      {...props}
    >
      <path d="M128.001 0C57.317 0 0 57.307 0 128.001c0 56.554 36.676 104.535 87.535 121.46 6.397 1.185 8.746-2.777 8.746-6.158 0-3.052-.12-13.135-.174-23.83-35.61 7.742-43.124-15.103-43.124-15.103-5.823-14.795-14.213-18.73-14.213-18.73-11.613-7.944.876-7.78.876-7.78 12.853.902 19.621 13.19 19.621 13.19 11.417 19.568 29.945 13.911 37.249 10.64 1.149-8.272 4.466-13.92 8.127-17.116-28.431-3.236-58.318-14.212-58.318-63.258 0-13.975 5-25.394 13.188-34.358-1.329-3.224-5.71-16.242 1.24-33.874 0 0 10.749-3.44 35.21 13.121 10.21-2.836 21.16-4.258 32.038-4.307 10.878.049 21.837 1.47 32.066 4.307 24.431-16.56 35.165-13.12 35.165-13.12 6.967 17.63 2.584 30.65 1.255 33.873 8.207 8.964 13.173 20.383 13.173 34.358 0 49.163-29.944 59.988-58.447 63.157 4.591 3.972 8.682 11.762 8.682 23.704 0 17.126-.148 30.91-.148 35.126 0 3.407 2.304 7.398 8.792 6.14C219.37 232.5 256 184.537 256 128.002 256 57.307 198.691 0 128.001 0Zm-80.06 182.34c-.282.636-1.283.827-2.194.39-.929-.417-1.45-1.284-1.15-1.922.276-.655 1.279-.838 2.205-.399.93.418 1.46 1.293 1.139 1.931Zm6.296 5.618c-.61.566-1.804.303-2.614-.591-.837-.892-.994-2.086-.375-2.66.63-.566 1.787-.301 2.626.591.838.903 1 2.088.363 2.66Zm4.32 7.188c-.785.545-2.067.034-2.86-1.104-.784-1.138-.784-2.503.017-3.05.795-.547 2.058-.055 2.861 1.075.782 1.157.782 2.522-.019 3.08Zm7.304 8.325c-.701.774-2.196.566-3.29-.49-1.119-1.032-1.43-2.496-.726-3.27.71-.776 2.213-.558 3.315.49 1.11 1.03 1.45 2.505.701 3.27Zm9.442 2.81c-.31 1.003-1.75 1.459-3.199 1.033-1.448-.439-2.395-1.613-2.103-2.626.301-1.01 1.747-1.484 3.207-1.028 1.446.436 2.396 1.602 2.095 2.622Zm10.744 1.193c.036 1.055-1.193 1.93-2.715 1.95-1.53.034-2.769-.82-2.786-1.86 0-1.065 1.202-1.932 2.733-1.958 1.522-.03 2.768.818 2.768 1.868Zm10.555-.405c.182 1.03-.875 2.088-2.387 2.37-1.485.271-2.861-.365-3.05-1.386-.184-1.056.893-2.114 2.376-2.387 1.514-.263 2.868.356 3.061 1.403Z" />
    </svg>
  );
}

function IconCommand({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-4", className)}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      {...props}
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="m10 8 4 4-4 4" />
    </svg>
  );
}

function IconTwitter({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-4", className)}
      fill="none"
      viewBox="0 0 1200 1227"
      stroke="currentColor"
      {...props}
    >
      <path
        fill="currentColor"
        d="M714.163 519.284 1160.89 0h-105.86L667.137 450.887 357.328 0H0l468.492 681.821L0 1226.37h105.866l409.625-476.152 327.181 476.152H1200L714.137 519.284h.026ZM569.165 687.828l-47.468-67.894-377.686-540.24h162.604l304.797 435.991 47.468 67.894 396.2 566.721H892.476L569.165 687.854v-.026Z"
      />
    </svg>
  );
}

function IconWhatsApp({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-4", className)}
      fill="none"
      viewBox="0 0 256 259"
      stroke="currentColor"
      {...props}
    >
      <path
        d="m67.663 221.823 4.185 2.093c17.44 10.463 36.971 15.346 56.503 15.346 61.385 0 111.609-50.224 111.609-111.609 0-29.297-11.859-57.897-32.785-78.824-20.927-20.927-48.83-32.785-78.824-32.785-61.385 0-111.61 50.224-110.912 112.307 0 20.926 6.278 41.156 16.741 58.594l2.79 4.186-11.16 41.156 41.853-10.464Z"
        fill="#00E676"
      />
      <path
        d="M219.033 37.668C195.316 13.254 162.531 0 129.048 0 57.898 0 .698 57.897 1.395 128.35c0 22.322 6.278 43.947 16.742 63.478L0 258.096l67.663-17.439c18.834 10.464 39.76 15.347 60.688 15.347 70.453 0 127.653-57.898 127.653-128.35 0-34.181-13.254-66.269-36.97-89.986ZM129.048 234.38c-18.834 0-37.668-4.882-53.712-14.648l-4.185-2.093-40.458 10.463 10.463-39.76-2.79-4.186C7.673 134.63 22.322 69.058 72.546 38.365c50.224-30.692 115.097-16.043 145.79 34.181 30.692 50.224 16.043 115.097-34.18 145.79-16.045 10.463-35.576 16.043-55.108 16.043Zm61.385-77.428-7.673-3.488s-11.16-4.883-18.136-8.371c-.698 0-1.395-.698-2.093-.698-2.093 0-3.488.698-4.883 1.396 0 0-.697.697-10.463 11.858-.698 1.395-2.093 2.093-3.488 2.093h-.698c-.697 0-2.092-.698-2.79-1.395l-3.488-1.395c-7.673-3.488-14.648-7.674-20.229-13.254-1.395-1.395-3.488-2.79-4.883-4.185-4.883-4.883-9.766-10.464-13.253-16.742l-.698-1.395c-.697-.698-.697-1.395-1.395-2.79 0-1.395 0-2.79.698-3.488 0 0 2.79-3.488 4.882-5.58 1.396-1.396 2.093-3.488 3.488-4.883 1.395-2.093 2.093-4.883 1.395-6.976-.697-3.488-9.068-22.322-11.16-26.507-1.396-2.093-2.79-2.79-4.883-3.488H83.01c-1.396 0-2.79.698-4.186.698l-.698.697c-1.395.698-2.79 2.093-4.185 2.79-1.395 1.396-2.093 2.79-3.488 4.186-4.883 6.278-7.673 13.951-7.673 21.624 0 5.58 1.395 11.161 3.488 16.044l.698 2.093c6.278 13.253 14.648 25.112 25.81 35.575l2.79 2.79c2.092 2.093 4.185 3.488 5.58 5.58 14.649 12.557 31.39 21.625 50.224 26.508 2.093.697 4.883.697 6.976 1.395h6.975c3.488 0 7.673-1.395 10.464-2.79 2.092-1.395 3.487-1.395 4.882-2.79l1.396-1.396c1.395-1.395 2.79-2.092 4.185-3.487 1.395-1.395 2.79-2.79 3.488-4.186 1.395-2.79 2.092-6.278 2.79-9.765v-4.883s-.698-.698-2.093-1.395Z"
        fill="#FFF"
      />
    </svg>
  );
}

function IconEye({ className, ...props }: React.ComponentProps<"svg">) {
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
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
function IconDotsVertical({
  className,
  ...props
}: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-4", className)}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      {...props}
    >
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="5" r="1" />
      <circle cx="12" cy="19" r="1" />
    </svg>
  );
}

function IconReset({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-4", className)}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      {...props}
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}

function IconCode({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-4", className)}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      {...props}
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function IconVSCode({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-4", className)}
      fill="none"
      viewBox="0 0 256 256"
      stroke="currentColor"
      {...props}
    >
      <defs>
        <path
          d="M180.82764,252.605272 C184.843951,254.170159 189.42406,254.069552 193.478224,252.11917 L245.979142,226.856851 C251.495593,224.202221 255.003889,218.618034 255.003889,212.49296 L255.003889,41.1971845 C255.003889,35.0719113 251.495593,29.4886211 245.979142,26.8339907 L193.478224,1.57068551 C188.158006,-0.989256713 181.931329,-0.362230036 177.262566,3.0323459 C176.595173,3.51727166 175.959655,4.05869672 175.363982,4.65536598 L74.8565893,96.3498444 L31.0778002,63.1181557 C27.0024197,60.0246398 21.3020866,60.2780499 17.5170718,63.7211005 L3.47578059,76.4937075 C-1.15402423,80.7052561 -1.15933349,87.9889043 3.46431538,92.2072265 L41.430759,126.844525 L3.46431538,161.482221 C-1.15933349,165.700742 -1.15402423,172.984291 3.47578059,177.19584 L17.5170718,189.967949 C21.3020866,193.411497 27.0024197,193.664509 31.0778002,190.571591 L74.8565893,157.339404 L175.363982,249.034221 C176.953772,250.625007 178.82048,251.823326 180.82764,252.605272 Z M191.291764,68.9559518 L115.029663,126.844525 L191.291764,184.733396 L191.291764,68.9559518 Z"
          id="path-1"
        />
        <linearGradient
          x1="50.0000484%"
          y1="-3.91645412e-07%"
          x2="50.0000484%"
          y2="99.999921%"
          id="linearGradient-3"
        >
          <stop stopColor="#FFFFFF" offset="0%" />
          <stop stopColor="#FFFFFF" stopOpacity="0" offset="100%" />
        </linearGradient>
      </defs>
      <g>
        <mask id="mask-2" fill="white">
          <use xlinkHref="#path-1" />
        </mask>
        <g />
        <path
          d="M246.134784,26.873337 L193.593025,1.57523773 C187.51178,-1.35300582 180.243173,-0.117807811 175.469819,4.65514684 L3.46641717,161.482221 C-1.16004072,165.700742 -1.1547215,172.984291 3.47789235,177.19584 L17.5276804,189.967949 C21.3150858,193.411497 27.0189053,193.664509 31.0966765,190.571591 L238.228667,33.4363005 C245.177523,28.1646927 255.158535,33.1209324 255.158535,41.8432608 L255.158535,41.2332436 C255.158535,35.11066 251.651235,29.5293619 246.134784,26.873337 Z"
          fill="#0065A9"
          fillRule="nonzero"
          mask="url(#mask-2)"
        />
        <path
          d="M246.134784,226.816011 L193.593025,252.11419 C187.51178,255.041754 180.243173,253.806579 175.469819,249.034221 L3.46641717,92.2070273 C-1.16004072,87.9888047 -1.1547215,80.7049573 3.47789235,76.4935082 L17.5276804,63.7209012 C21.3150858,60.2778506 27.0189053,60.0243409 31.0966765,63.1179565 L238.228667,220.252649 C245.177523,225.524058 255.158535,220.568416 255.158535,211.84549 L255.158535,212.456104 C255.158535,218.57819 251.651235,224.159388 246.134784,226.816011 Z"
          fill="#007ACC"
          fillRule="nonzero"
          mask="url(#mask-2)"
        />
        <path
          d="M193.428324,252.134497 C187.345086,255.060069 180.076479,253.823898 175.303125,249.050544 C181.184153,254.931571 191.240868,250.765843 191.240868,242.448334 L191.240868,11.2729623 C191.240868,2.95542269 181.184153,-1.21005093 175.303125,4.67135981 C180.076479,-0.102038107 187.345086,-1.3389793 193.428324,1.58667934 L245.961117,26.8500144 C251.481553,29.5046448 254.991841,35.0879351 254.991841,41.2132082 L254.991841,212.509283 C254.991841,218.634357 251.481553,224.217548 245.961117,226.872178 L193.428324,252.134497 Z"
          fill="#1F9CF0"
          fillRule="nonzero"
          mask="url(#mask-2)"
        />
        <path
          d="M180.827889,252.605272 C184.8442,254.169163 189.424309,254.069552 193.477476,252.11917 L245.978395,226.855855 C251.495842,224.201225 255.004138,218.618034 255.004138,212.49296 L255.004138,41.1969853 C255.004138,35.0717121 251.495842,29.4884219 245.979391,26.8337915 L193.477476,1.57052613 C188.158255,-0.989423064 181.931578,-0.362396387 177.261819,3.03217656 C176.595422,3.51710232 175.959904,4.05852738 175.363235,4.65519664 L74.8565395,96.3496452 L31.0777504,63.1179565 C27.0024695,60.0244405 21.3020368,60.2779503 17.517022,63.7209012 L3.4757806,76.4935082 C-1.15402423,80.7050569 -1.15933349,87.9888047 3.46431539,92.2071269 L41.4308088,126.844525 L3.46431539,161.482221 C-1.15933349,165.700742 -1.15402423,172.984291 3.4757806,177.19584 L17.517022,189.967949 C21.3020368,193.411497 27.0024695,193.664509 31.0777504,190.571591 L74.8565395,157.339404 L175.363235,249.034221 C176.953025,250.625007 178.820729,251.823326 180.827889,252.605272 Z M191.292013,68.9557526 L115.029912,126.844525 L191.292013,184.733396 L191.292013,68.9557526 Z"
          fillOpacity="0.25"
          fillRule="nonzero"
          mask="url(#mask-2)"
        />
      </g>
    </svg>
  );
}

function IconShadcn({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-4", className)}
      fill="none"
      viewBox="0 0 256 256"
      stroke="currentColor"
      {...props}
    >
      <line
        x1="208"
        y1="128"
        x2="128"
        y2="208"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="16"
      ></line>
      <line
        x1="192"
        y1="40"
        x2="40"
        y2="192"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="16"
      ></line>
    </svg>
  );
}

function IconJetBrains({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-4", className)}
      fill="none"
      viewBox="0 0 256 256"
      stroke="currentColor"
      {...props}
    >
      <title>JetBrains</title>
      <defs>
        <linearGradient
          x1="25.1768046%"
          y1="43.3091462%"
          x2="99.1720575%"
          y2="67.4338046%"
          id="jetbrainsLinearGradient-1"
        >
          <stop stopColor="#FE2857" offset="21%" />
          <stop stopColor="#293896" offset="100%" />
        </linearGradient>
        <linearGradient
          x1="2.27834696%"
          y1="77.1495472%"
          x2="90.6955004%"
          y2="24.0933671%"
          id="jetbrainsLinearGradient-2"
        >
          <stop stopColor="#FE2857" offset="0%" />
          <stop stopColor="#FE2857" offset="1%" />
          <stop stopColor="#FF318C" offset="86%" />
        </linearGradient>
        <linearGradient
          x1="6.29867254%"
          y1="13.9182513%"
          x2="94.6438712%"
          y2="87.6937925%"
          id="jetbrainsLinearGradient-3"
        >
          <stop stopColor="#FF318C" offset="2%" />
          <stop stopColor="#FE2857" offset="21%" />
          <stop stopColor="#FDB60D" offset="86%" />
        </linearGradient>
        <linearGradient
          x1="91.0869055%"
          y1="27.7208436%"
          x2="1.96658946%"
          y2="68.6215164%"
          id="jetbrainsLinearGradient-4"
        >
          <stop stopColor="#FDB60D" offset="1%" />
          <stop stopColor="#FCF84A" offset="86%" />
        </linearGradient>
      </defs>
      <g>
        <g>
          <path
            d="M112.662631,117.374211 L42.0528349,57.6077575 C34.1665834,51.0082976 23.0981193,49.7649243 13.9442018,54.450181 C4.79028433,59.1354378 -0.67422973,68.8408981 0.0669357723,79.0974331 C0.808101274,89.353968 7.61124146,98.1729338 17.3436753,101.493411 L17.5998173,101.493411 L18.2657863,101.698324 L107.334879,128.832294 C107.981188,129.065811 108.66267,129.187092 109.349862,129.190893 C112.195364,129.176089 114.685853,127.275658 115.451331,124.535011 C116.216808,121.794364 115.07155,118.878449 112.645555,117.391287 L112.662631,117.374211 Z"
            fill="url(#jetbrainsLinearGradient-1)"
          />
          <path
            d="M126.819084,18.7083342 C126.860142,11.8597565 123.133799,5.54273474 117.119717,2.26622003 C111.105635,-1.01029467 103.777351,-0.715911985 98.045464,3.03244722 L11.8110093,55.3878607 C3.82067811,60.5958428 -0.614253841,69.8120835 0.301518051,79.3057567 C1.21728994,88.79943 7.33207983,96.998031 16.1705599,100.582684 C25.00904,104.167338 35.1072297,102.544292 42.3772814,96.3705718 L119.68092,33.3767296 L120.295661,32.8644457 C124.430582,29.3229537 126.813075,24.1525703 126.819084,18.7083342 L126.819084,18.7083342 Z"
            fill="url(#jetbrainsLinearGradient-2)"
          />
          <path
            d="M252.225838,131.530323 L121.388533,5.52556215 C116.563795,0.683561503 109.474882,-1.1274542 102.918926,0.807102986 C96.3629699,2.74166017 91.3928906,8.11109084 89.9697746,14.7967328 C88.5466585,21.4823748 90.8990651,28.4104811 96.0987852,32.8473696 L96.337851,33.0522831 L235.337546,150.16038 C239.082023,153.301341 244.307832,153.986676 248.735594,151.917458 C253.163356,149.848239 255.989992,145.399768 255.982602,140.512367 C255.982602,137.136371 254.629145,133.901286 252.225838,131.530323 Z"
            fill="url(#jetbrainsLinearGradient-3)"
          />
          <path
            d="M256,140.563595 C256.03427,135.827579 253.399946,131.475383 249.187901,129.309807 C244.975855,127.144231 239.903452,127.534099 236.07182,130.317918 L77.759022,207.672785 C69.1532274,211.99698 63.70047,220.7831 63.645133,230.414058 C63.5906332,240.045016 68.9428375,248.892749 77.4987585,253.314805 C86.0546795,257.736861 96.367984,256.985715 104.192871,251.370601 L250.58653,150.894654 C253.978569,148.549385 256.002093,144.687454 256,140.563595 L256,140.563595 Z"
            fill="url(#jetbrainsLinearGradient-4)"
          />
        </g>
        <polygon
          fill="#000000"
          points="75.8464955 76.8867079 178.303273 76.8867079 178.303273 179.343486 75.8464955 179.343486"
        />
        <path
          d="M86.9972081,160.13284 L125.4185,160.13284 L125.4185,166.536389 L86.9972081,166.536389 L86.9972081,160.13284 Z M85.3920519,103.30348 L88.2437656,100.605452 C88.7942375,101.474141 89.7275688,102.02652 90.7539566,102.091075 C91.8468289,102.091075 92.5640264,101.322649 92.5640264,99.8370261 L92.5640264,89.7279574 L96.9696678,89.7279574 L96.9696678,99.8711784 C97.102829,101.522755 96.5322879,103.153758 95.3986639,104.3622 C94.3189201,105.416715 92.8856502,106.023206 91.3861792,106.069874 L91.0100986,106.069813 C88.9202599,106.153996 86.9241408,105.236588 85.6269391,103.61559 L85.3920519,103.30348 Z M98.9504989,89.7279574 L111.808824,89.7279574 L111.808824,93.4676298 L103.27076,93.4676298 L103.27076,95.9095163 L110.937942,95.9095163 L110.937942,99.3247423 L103.339064,99.3247423 L103.339064,101.869086 L111.877129,101.869086 L111.877129,105.625834 L98.8992705,105.625834 L98.9504989,89.7279574 Z M118.075764,93.6042388 L113.294448,93.6042388 L113.294448,89.7279574 L127.31395,89.7279574 L127.31395,93.6042388 L122.515558,93.6042388 L122.515558,105.711215 L118.075764,105.711215 L118.075764,93.6042388 Z M87.1679694,112.029383 L94.7156187,112.029383 C96.2983735,111.89921 97.8671392,112.409828 99.0700318,113.446701 C99.7559089,114.134147 100.132043,115.0714 100.111676,116.042273 C100.137884,117.640042 99.1414409,119.076294 97.6356369,119.611184 C99.5125338,119.955225 100.85988,121.614056 100.811797,123.521618 C100.811797,126.407484 98.574824,128.115097 94.749771,128.115097 L87.1679694,128.115097 L87.1679694,112.029383 Z M95.7060342,116.964384 C95.7060342,116.076425 94.9888368,115.598294 93.6910509,115.598294 L91.4882302,115.598294 L91.4882302,118.398779 L93.6227464,118.398779 C94.9546845,118.398779 95.7401865,117.937724 95.7401865,117.015613 L95.7060342,116.964384 Z M94.1691826,121.506635 L91.4882302,121.506635 L91.4882302,124.460805 L94.2545632,124.460805 C95.6206536,124.460805 96.3720033,123.931445 96.3720033,122.992258 C96.3401278,122.147559 95.772745,121.585488 94.4893688,121.5143 L94.1691826,121.506635 Z M111.347769,128.115097 L108.12038,123.265476 L106.634757,123.265476 L106.634757,128.115097 L102.194963,128.115097 L102.229116,112.029383 L109.31571,112.029383 C111.210776,111.875054 113.088123,112.490578 114.523929,113.736996 C115.412255,114.64457 115.917741,115.853428 115.945572,117.114543 L115.941248,117.459592 C116.004326,119.638178 114.68206,121.618152 112.645555,122.394593 L115.765364,127.0615 L122.105731,111.90985 L126.374763,111.90985 L133.205215,128.029716 L128.440975,128.029716 L127.296874,125.14385 L121.098239,125.14385 L119.954138,128.115097 L111.347769,128.115097 Z M124.206095,117.169298 L122.396025,121.694472 L125.999088,121.694472 L124.206095,117.169298 Z M109.042491,115.871512 L106.668909,115.871512 L106.668909,119.747793 L109.059568,119.713641 C110.545191,119.713641 111.450226,118.979367 111.450226,117.801115 C111.450226,116.520405 110.511039,115.871512 109.042491,115.871512 Z M133.905336,111.978154 L138.34513,111.978154 L138.34513,127.978488 L133.905336,127.978488 L133.905336,111.978154 Z M139.984438,111.978154 L144.151014,111.978154 L149.90567,120.516219 L149.90567,111.978154 L154.294235,111.978154 L154.294235,127.978488 L150.417954,127.978488 L144.39008,119.201357 L144.39008,127.978488 L139.984438,127.978488 L139.984438,111.978154 Z M155.028509,125.604906 L157.487471,122.650735 C158.927696,123.854822 160.733605,124.535048 162.61031,124.580338 C163.822715,124.580338 164.454532,124.153435 164.454532,123.47039 C164.454532,122.954511 164.176395,122.633328 163.14875,122.295067 L162.661068,122.148435 C162.571682,122.123616 162.478128,122.098556 162.380234,122.073177 L161.739428,121.916462 L161.739428,121.916462 L161.389065,121.834624 L161.389065,121.834624 L160.7073,121.665823 L160.7073,121.665823 L160.053782,121.48652 C157.500953,120.742432 155.711554,119.640626 155.711554,116.913156 C155.711554,113.941909 158.06806,111.790317 161.910189,111.790317 C164.285183,111.701326 166.614747,112.457678 168.484499,113.924833 L166.349983,116.964384 C165.058255,115.988337 163.494409,115.4392 161.876037,115.39338 C160.80024,115.39338 160.27088,115.820283 160.27088,116.417948 C160.27088,116.958992 160.56756,117.277525 161.618627,117.605818 L162.116606,117.74779 C162.207745,117.771777 162.303067,117.795983 162.402738,117.820494 L163.05429,117.971876 C166.725657,118.774454 168.996783,119.969783 168.996783,122.958106 C168.996783,126.110928 166.587322,127.955302 162.92526,128.074757 L162.542006,128.080945 C159.989865,128.18961 157.482622,127.422716 155.432348,125.91606 L155.028509,125.604906 Z"
          fill="#FFFFFF"
        />
      </g>
    </svg>
  );
}

function IconNeovim({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-4", className)}
      viewBox="0 0 122 148"
      {...props}
    >
      <defs>
        <linearGradient
          id="neovim-a"
          x1="70.751%"
          y1="12.284%"
          x2="30.886%"
          y2="83.792%"
        >
          <stop offset="0%" stopColor="#16B0ED" />
          <stop offset="100%" stopColor="#0F59B2" />
        </linearGradient>
        <linearGradient
          id="neovim-b"
          x1="70.751%"
          y1="12.284%"
          x2="30.886%"
          y2="83.792%"
        >
          <stop offset="0%" stopColor="#7DB643" />
          <stop offset="48.57%" stopColor="#367533" />
          <stop offset="100%" stopColor="#0F6A1D" />
        </linearGradient>
        <linearGradient
          id="neovim-c"
          x1="70.751%"
          y1="12.284%"
          x2="30.886%"
          y2="83.792%"
        >
          <stop offset="0%" stopColor="#88C649" />
          <stop offset="100%" stopColor="#439240" />
        </linearGradient>
      </defs>
      <g fill="none" fillRule="evenodd">
        <path
          fill="url(#neovim-a)"
          d="M0.0188037914,32.1877871 L31.3322156,0.572985361 L31.332215,147.571242 L0.0188037914,116.321577 L0.0188037914,32.1877871 Z"
        />
        <path
          fill="url(#neovim-b)"
          d="M89.4837594,32.4862691 L121.226122,0.590059535 L120.582695,147.571242 L89.269284,116.321577 L89.4837594,32.4862691 Z"
          transform="matrix(-1 0 0 1 210.495 0)"
        />
        <path
          fill="url(#neovim-c)"
          d="M31.3113362,0.598133687 L112.722926,124.829189 L89.9415068,147.610037 L8.48731391,23.6539656 L31.3113362,0.598133687 Z"
        />
        <path
          fill="#000000"
          fillOpacity="0.13"
          d="M31.3393522,58.2198072 L31.2960504,63.112906 L6.15984438,26.0032984 L8.48731391,23.6323156 L31.3393522,58.2198072 Z"
        />
      </g>
    </svg>
  );
}

export {
  IconNeovim,
  IconJetBrains,
  IconShadcn,
  IconVSCode,
  IconCode,
  IconReset,
  IconDotsVertical,
  IconEye,
  IconWhatsApp,
  IconTwitter,
  IconCommand,
  IconGitHub,
  IconPalette,
  IconGlobe,
  IconBrush,
  IconUser,
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
