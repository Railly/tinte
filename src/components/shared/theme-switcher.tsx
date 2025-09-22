"use client";

import { useThemeContext } from "@/providers/theme";

export function ThemeSwitcher() {
  const { mounted, isDark, toggleTheme } = useThemeContext();

  if (!mounted) {
    return (
      <button
        type="button"
        role="switch"
        aria-checked="false"
        data-state="unchecked"
        value="on"
        data-slot="switch"
        className="peer data-[state=checked]:bg-secondary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
        disabled
      >
        <span
          data-state="unchecked"
          data-slot="switch-thumb"
          className="bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none flex size-4 items-center justify-between rounded-full text-black ring-0 transition-transform duration-300 data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0"
        >
          <svg
            height="18"
            width="18"
            viewBox="0 0 18 18"
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto size-2.5"
          >
            <g fill="currentColor">
              <path
                d="M9 0.5C9.41421 0.5 9.75 0.835786 9.75 1.25V2.25C9.75 2.66421 9.41421 3 9 3C8.58579 3 8.25 2.66421 8.25 2.25V1.25C8.25 0.835786 8.58579 0.5 9 0.5Z"
                fill="currentColor"
                fillRule="evenodd"
              ></path>
              <path
                d="M15.0103 2.98966C15.3032 3.28255 15.3032 3.75743 15.0103 4.05032L14.3033 4.75732C14.0104 5.05021 13.5356 5.05021 13.2427 4.75732C12.9498 4.46443 12.9498 3.98955 13.2427 3.69666L13.9497 2.98966C14.2426 2.69677 14.7174 2.69677 15.0103 2.98966Z"
                fill="currentColor"
                fillRule="evenodd"
              ></path>
              <path
                d="M15 9C15 8.58579 15.3358 8.25 15.75 8.25H16.75C17.1642 8.25 17.5 8.58579 17.5 9C17.5 9.41421 17.1642 9.75 16.75 9.75H15.75C15.3358 9.75 15 9.41421 15 9Z"
                fill="currentColor"
                fillRule="evenodd"
              ></path>
              <path
                d="M13.2427 13.2427C13.5356 12.9498 14.0104 12.9498 14.3033 13.2427L15.0103 13.9497C15.3032 14.2426 15.3032 14.7174 15.0103 15.0103C14.7174 15.3032 14.2426 15.3032 13.9497 15.0103L13.2427 14.3033C12.9498 14.0104 12.9498 13.5356 13.2427 13.2427Z"
                fill="currentColor"
                fillRule="evenodd"
              ></path>
              <path
                d="M9 15C9.41421 15 9.75 15.3358 9.75 15.75V16.75C9.75 17.1642 9.41421 17.5 9 17.5C8.58579 17.5 8.25 17.1642 8.25 16.75V15.75C8.25 15.3358 8.58579 15 9 15Z"
                fill="currentColor"
                fillRule="evenodd"
              ></path>
              <path
                d="M4.75735 13.2427C5.05024 13.5356 5.05024 14.0104 4.75735 14.3033L4.05035 15.0103C3.75746 15.3032 3.28258 15.3032 2.98969 15.0103C2.6968 14.7174 2.6968 14.2426 2.98969 13.9497L3.69669 13.2427C3.98958 12.9498 4.46446 12.9498 4.75735 13.2427Z"
                fill="currentColor"
                fillRule="evenodd"
              ></path>
              <path
                d="M0.5 9C0.5 8.58579 0.835786 8.25 1.25 8.25H2.25C2.66421 8.25 3 8.58579 3 9C3 9.41421 2.66421 9.75 2.25 9.75H1.25C0.835786 9.75 0.5 9.41421 0.5 9Z"
                fill="currentColor"
                fillRule="evenodd"
              ></path>
              <path
                d="M2.98969 2.98966C3.28258 2.69677 3.75746 2.69677 4.05035 2.98966L4.75735 3.69666C5.05024 3.98955 5.05024 4.46443 4.75735 4.75732C4.46446 5.05021 3.98958 5.05021 3.69669 4.75732L2.98969 4.05032C2.6968 3.75743 2.6968 3.28255 2.98969 2.98966Z"
                fill="currentColor"
                fillRule="evenodd"
              ></path>
              <path
                d="M9 13.25C11.3472 13.25 13.25 11.347 13.25 9C13.25 6.653 11.3472 4.75 9 4.75C6.6528 4.75 4.75 6.653 4.75 9C4.75 11.347 6.6528 13.25 9 13.25Z"
                fill="currentColor"
                fillOpacity="0.4"
              ></path>
            </g>
          </svg>
        </span>
      </button>
    );
  }

  const cycleTheme = (event: React.MouseEvent) => {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const coords = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };

    toggleTheme(coords);
  };

  return (
    <div className="flex items-center gap-2">
      {/* Theme switcher button */}
      <button
        type="button"
        role="switch"
        aria-checked={isDark}
        data-state={isDark ? "checked" : "unchecked"}
        value="on"
        data-slot="switch"
        className="peer data-[state=checked]:bg-secondary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
        onClick={cycleTheme}
      >
        <span
          data-state={isDark ? "checked" : "unchecked"}
          data-slot="switch-thumb"
          className="bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none flex size-4 items-center justify-between rounded-full text-foreground ring-0 transition-transform duration-300 data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0"
        >
          {isDark ? (
            <svg
              height="18"
              width="18"
              viewBox="0 0 18 18"
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto size-2.5"
            >
              <g fill="currentColor">
                <path
                  d="M8.54419 1.47446C8.70875 1.73227 8.70028 2.06417 8.52278 2.31324C7.88003 3.21522 7.5 4.31129 7.5 5.49999C7.5 8.53778 9.96222 11 13 11C14.0509 11 15.029 10.7009 15.8667 10.1868C16.1275 10.0267 16.4594 10.0412 16.7053 10.2233C16.9513 10.4054 17.0619 10.7186 16.9848 11.0148C16.0904 14.4535 12.9735 17 9.25 17C4.83179 17 1.25 13.4182 1.25 8.99999C1.25 5.08453 4.06262 1.83365 7.77437 1.14073C8.07502 1.0846 8.37963 1.21666 8.54419 1.47446Z"
                  fill="currentColor"
                  fillRule="evenodd"
                ></path>
              </g>
            </svg>
          ) : (
            <svg
              height="18"
              width="18"
              viewBox="0 0 18 18"
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto size-2.5"
            >
              <g fill="currentColor">
                <path
                  d="M9 0.5C9.41421 0.5 9.75 0.835786 9.75 1.25V2.25C9.75 2.66421 9.41421 3 9 3C8.58579 3 8.25 2.66421 8.25 2.25V1.25C8.25 0.835786 8.58579 0.5 9 0.5Z"
                  fill="currentColor"
                  fillRule="evenodd"
                ></path>
                <path
                  d="M15.0103 2.98966C15.3032 3.28255 15.3032 3.75743 15.0103 4.05032L14.3033 4.75732C14.0104 5.05021 13.5356 5.05021 13.2427 4.75732C12.9498 4.46443 12.9498 3.98955 13.2427 3.69666L13.9497 2.98966C14.2426 2.69677 14.7174 2.69677 15.0103 2.98966Z"
                  fill="currentColor"
                  fillRule="evenodd"
                ></path>
                <path
                  d="M15 9C15 8.58579 15.3358 8.25 15.75 8.25H16.75C17.1642 8.25 17.5 8.58579 17.5 9C17.5 9.41421 17.1642 9.75 16.75 9.75H15.75C15.3358 9.75 15 9.41421 15 9Z"
                  fill="currentColor"
                  fillRule="evenodd"
                ></path>
                <path
                  d="M13.2427 13.2427C13.5356 12.9498 14.0104 12.9498 14.3033 13.2427L15.0103 13.9497C15.3032 14.2426 15.3032 14.7174 15.0103 15.0103C14.7174 15.3032 14.2426 15.3032 13.9497 15.0103L13.2427 14.3033C12.9498 14.0104 12.9498 13.5356 13.2427 13.2427Z"
                  fill="currentColor"
                  fillRule="evenodd"
                ></path>
                <path
                  d="M9 15C9.41421 15 9.75 15.3358 9.75 15.75V16.75C9.75 17.1642 9.41421 17.5 9 17.5C8.58579 17.5 8.25 17.1642 8.25 16.75V15.75C8.25 15.3358 8.58579 15 9 15Z"
                  fill="currentColor"
                  fillRule="evenodd"
                ></path>
                <path
                  d="M4.75735 13.2427C5.05024 13.5356 5.05024 14.0104 4.75735 14.3033L4.05035 15.0103C3.75746 15.3032 3.28258 15.3032 2.98969 15.0103C2.6968 14.7174 2.6968 14.2426 2.98969 13.9497L3.69669 13.2427C3.98958 12.9498 4.46446 12.9498 4.75735 13.2427Z"
                  fill="currentColor"
                  fillRule="evenodd"
                ></path>
                <path
                  d="M0.5 9C0.5 8.58579 0.835786 8.25 1.25 8.25H2.25C2.66421 8.25 3 8.58579 3 9C3 9.41421 2.66421 9.75 2.25 9.75H1.25C0.835786 9.75 0.5 9.41421 0.5 9Z"
                  fill="currentColor"
                  fillRule="evenodd"
                ></path>
                <path
                  d="M2.98969 2.98966C3.28258 2.69677 3.75746 2.69677 4.05035 2.98966L4.75735 3.69666C5.05024 3.98955 5.05024 4.46443 4.75735 4.75732C4.46446 5.05021 3.98958 5.05021 3.69669 4.75732L2.98969 4.05032C2.6968 3.75743 2.6968 3.28255 2.98969 2.98966Z"
                  fill="currentColor"
                  fillRule="evenodd"
                ></path>
                <path
                  d="M9 13.25C11.3472 13.25 13.25 11.347 13.25 9C13.25 6.653 11.3472 4.75 9 4.75C6.6528 4.75 4.75 6.653 4.75 9C4.75 11.347 6.6528 13.25 9 13.25Z"
                  fill="currentColor"
                ></path>
              </g>
            </svg>
          )}
        </span>
      </button>
    </div>
  );
}
