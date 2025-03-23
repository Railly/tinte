export default function ShadcnPage() {
  return (
    <div>
      <header
        className="flex sticky top-0 items-center justify-between py-2 px-4 h-14 border-b bg-background z-[25]"
        style={{ opacity: 1, willChange: "auto", transform: "none" }}
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3.5 px-1">
            <a
              className="flex items-center justify-center h-14"
              href="https://railly.dev"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 219 249"
              >
                <path
                  stroke="currentColor"
                  stroke-width="13"
                  d="M104.586 8.324a9.78 9.78 0 0 1 9.828 0l92.672 53.808a9.9 9.9 0 0 1 4.914 8.56v107.616a9.9 9.9 0 0 1-4.914 8.56l-92.672 53.808a9.78 9.78 0 0 1-9.828 0l-92.671-53.808A9.9 9.9 0 0 1 7 178.308V70.692a9.9 9.9 0 0 1 4.915-8.56z"
                ></path>
                <path
                  stroke="currentcolor"
                  stroke-linecap="round"
                  stroke-width="10"
                  d="M108.5 13.5c46 38.833 110.4 137.8 0 223"
                ></path>
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-width="10"
                  d="m12.5 68 93 165M12 183l93-165"
                ></path>
              </svg>
            </a>
            <span>/</span>
            <a className="flex items-center gap-2" href="/">
              <svg
                className="size-6"
                viewBox="0 0 1000 1000"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  width="1000"
                  height="1000"
                  rx="500"
                  className="fill-foreground"
                ></rect>
                <path
                  d="M482.372 360.458C491.341 321.22 502.508 282.568 513.532 243.874C516.502 233.45 517.465 222.777 515.616 211.956C512.937 196.275 501.226 188.801 485.825 193.289C476.039 196.14 468.37 202.304 461.815 209.854C440.994 233.836 431.499 262.958 424.209 293.028C415.667 328.26 409.809 364.009 404.032 399.76C402.912 406.691 399.771 410.476 393.08 412.78C382.026 416.586 371.255 421.232 360.454 425.737C324.553 440.709 289.698 457.671 257.778 480.119C250.429 485.286 243.589 491.125 238.772 498.769C231.309 510.613 235.17 521.722 248.146 523.046C265.866 524.854 283.775 525.837 301.156 519.418C329.239 509.048 356.215 496.257 383.081 483.176C385.877 481.815 388.41 478.725 393.146 480.841C390.226 494.767 386.975 508.719 384.406 522.794C374.806 575.401 364.702 628.004 372.476 681.903C377.695 718.09 391.541 749.848 420.844 773.339C458.297 803.364 501.529 812.495 548.43 807.862C616.8 801.108 673.858 772.012 719.88 721.242C721.787 719.138 724.496 717.28 723.74 712.776C720.514 714.929 717.981 716.551 715.52 718.276C703.397 726.772 691.052 734.926 677.165 740.317C622.574 761.509 567.509 760.274 512.45 742.697C479.344 732.127 451.359 713.718 430.849 685.126C427.99 681.141 424.79 677.108 425.17 671.304C426.51 671.761 427.27 671.783 427.583 672.167C428.938 673.831 430.29 675.521 431.413 677.342C442.88 695.947 458.827 709.795 478.165 719.509C548.588 754.885 618.66 751.081 685.511 711.966C727.289 687.522 755.717 650.579 764.513 601.233C765.424 596.118 766.499 590.962 763.873 583.439C750.244 621.98 728.465 652.046 697.444 674.941C666.311 697.919 630.923 710.481 592.284 710.027C554.311 709.58 518.427 700.086 487.856 675.29C545.082 706.228 602.354 705.222 659.025 675.338C711.051 647.904 767.236 567.842 758.355 535.716C757.809 535.876 756.952 535.873 756.768 536.222C755.488 538.652 754.248 541.112 753.178 543.64C746.168 560.194 737.628 575.98 724.741 588.619C677.388 635.059 620.351 653.939 554.893 643.64C518.617 637.933 491.962 617.454 479.611 581.76C463.315 534.662 463.039 486.614 472.233 438.075C473.549 431.128 476.793 427.564 483.081 424.905C510.082 413.491 537.869 404.365 565.908 395.972C623.874 378.622 683.172 367.584 742.984 358.941C750.354 357.876 758.224 358.234 766 353.676C763.689 352.808 762.372 352.163 760.981 351.827C759.194 351.396 757.357 351.12 755.525 350.935C713.219 346.671 671.203 350.802 629.287 355.821C585.535 361.061 542.568 370.854 499.382 379.339C476.985 383.74 476.974 383.68 482.372 360.458Z"
                  className   ="fill-background"
                ></path>
              </svg>
              <h1 className="text-md font-bold">tinte</h1>
            </a>
          </div>
          <div
            data-orientation="vertical"
            role="none"
            className="shrink-0 bg-border w-[1px] h-4 hidden md:block"
          ></div>
          <div className="hidden md:flex items-center gap-4">
            <div className="inline-flex items-center gap-2 w-full">
              <a className="w-full" href="/vscode">
                <span
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 underline-offset-4 hover:underline h-8 px-0 text-muted-foreground hover:text-foreground relative w-full"
                  tabIndex={0}
                  style={{ willChange: "transform", transform: "none" }}
                >
                  VS Code
                </span>
              </a>
              <div></div>
            </div>
            <div className="inline-flex items-center gap-2 w-full">
              <a className="w-full" href="/shadcn">
                <span
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 underline-offset-4 hover:underline h-8 px-0 text-muted-foreground hover:text-foreground relative w-full"
                  tabIndex={0}
                  style={{ willChange: "auto", transform: "none" }}
                >
                  Shadcn UI
                </span>
              </a>
              <div>
                <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent shadow text-xs bg-emerald-500 hover:bg-emerald-600 text-white">
                  New
                </div>
              </div>
            </div>
            <div className="inline-flex items-center gap-2 w-full">
              <a className="w-full" href="https://github.com/Railly/tinte">
                <span
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 underline-offset-4 hover:underline h-8 px-0 text-muted-foreground hover:text-foreground relative w-full"
                  tabIndex={0}
                  style={{ willChange: "transform", transform: "none" }}
                >
                  Repository
                </span>
              </a>
              <div></div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <button
              className="justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9 flex items-center"
              data-state="closed"
              type="button"
              id="radix-:r0:"
              aria-haspopup="menu"
              aria-expanded="false"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 256 256"
                fill="currentColor"
                className="size-4 h-4 w-4 sm:mr-0 mr-2"
              >
                <path d="M120 40V16a8 8 0 0 1 16 0v24a8 8 0 0 1-16 0Zm72 88a64 64 0 1 1-64-64 64.07 64.07 0 0 1 64 64Zm-16 0a48 48 0 1 0-48 48 48.05 48.05 0 0 0 48-48ZM58.34 69.66a8 8 0 0 0 11.32-11.32l-16-16a8 8 0 0 0-11.32 11.32Zm0 116.68-16 16a8 8 0 0 0 11.32 11.32l16-16a8 8 0 0 0-11.32-11.32ZM192 72a8 8 0 0 0 5.66-2.34l16-16a8 8 0 0 0-11.32-11.32l-16 16A8 8 0 0 0 192 72Zm5.66 114.34a8 8 0 0 0-11.32 11.32l16 16a8 8 0 0 0 11.32-11.32ZM48 128a8 8 0 0 0-8-8H16a8 8 0 0 0 0 16h24a8 8 0 0 0 8-8Zm80 80a8 8 0 0 0-8 8v24a8 8 0 0 0 16 0v-24a8 8 0 0 0-8-8Zm112-88h-24a8 8 0 0 0 0 16h24a8 8 0 0 0 0-16Z"></path>
              </svg>
              <span className="sm:hidden">Light</span>
            </button>
          </div>
          <div
            data-orientation="vertical"
            role="none"
            className="shrink-0 bg-border w-[1px] h-4 mx-2 hidden md:block"
          ></div>
          <div className="flex justify-center items-center"></div>
          <div className="md:hidden">
            <button
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9"
              type="button"
              aria-haspopup="dialog"
              aria-expanded="false"
              aria-controls="radix-:R2qj7rroqcq:"
              data-state="closed"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="size-4"
              >
                <path
                  d="M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1 7.5C1 7.22386 1.22386 7 1.5 7H13.5C13.7761 7 14 7.22386 14 7.5C14 7.77614 13.7761 8 13.5 8H1.5C1.22386 8 1 7.77614 1 7.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z"
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </header>
    </div>
  );
}
