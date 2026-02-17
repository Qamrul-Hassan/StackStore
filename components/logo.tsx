"use client";

export function Logo({ size = 40 }: { size?: number }) {
  return (
    <div className="flex items-center gap-3">
      <svg
        width={size}
        height={size}
        viewBox="0 0 56 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_12px_18px_rgba(249,45,10,0.35)]"
      >
        <rect x="2" y="2" width="52" height="52" rx="16" fill="url(#logo_bg)" />
        <rect x="2" y="2" width="52" height="52" rx="16" stroke="#210E14" strokeOpacity="0.2" />

        <path
          d="M16 21C16 17.6863 18.6863 15 22 15H39V23H24C22.8954 23 22 23.8954 22 25C22 26.1046 22.8954 27 24 27H34C37.3137 27 40 29.6863 40 33C40 36.3137 37.3137 39 34 39H17V31H32C33.1046 31 34 30.1046 34 29C34 27.8954 33.1046 27 32 27H22C18.6863 27 16 24.3137 16 21Z"
          fill="url(#s_grad)"
        />
        <path d="M12 15H18V39H12V15Z" fill="#8EB4C2" />

        <circle cx="44" cy="12" r="4" fill="#8EB4C2" fillOpacity="0.45" />

        <defs>
          <linearGradient id="logo_bg" x1="6" y1="6" x2="52" y2="52" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#210E14" />
            <stop offset="55%" stopColor="#28323F" />
            <stop offset="100%" stopColor="#712825" />
          </linearGradient>
          <linearGradient id="s_grad" x1="14" y1="15" x2="43" y2="39" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FB8500" />
            <stop offset="50%" stopColor="#F92D0A" />
            <stop offset="100%" stopColor="#8EB4C2" />
          </linearGradient>
        </defs>
      </svg>

      <div className="flex flex-col leading-tight">
        <span className="font-display text-xl font-extrabold tracking-tight text-[#210E14]">StackStore</span>
        <span className="-mt-0.5 text-[11px] font-medium uppercase tracking-[0.16em] text-[#748692]">
          Next Commerce
        </span>
      </div>
    </div>
  );
}
