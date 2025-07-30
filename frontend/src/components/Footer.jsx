import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="flex flex-col items-center justify-center w-full py-20 bg-gradient-to-b from-[#5524B7] to-[#380B60] text-white/70">
      <Link to={"/"}>
    <h1 className="text-3xl font-bold text-white-600">Personalify</h1>
      </Link>
      <p className="mt-4 text-center">
        Copyright © 2025 <Link href="https://prebuiltui.com">Personalify</Link>. All
        rights reservered.
      </p>
      <div className="flex items-center gap-4 mt-5">
       
        <a
          href="https://www.linkedin.com/in/yash-bothra-a66772308/"
          className="hover:-translate-y-0.5 transition-all duration-300"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6M6 9H2v12h4zM4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4"
              stroke="#fff"
              strokeOpacity=".5"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
        
        <a
          href="https://github.com/ycode37"
          className="hover:-translate-y-0.5 transition-all duration-300"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65S8.93 17.38 9 18v4"
              stroke="#fff"
              strokeOpacity=".5"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9 18c-4.51 2-5-2-7-2"
              stroke="#fff"
              strokeOpacity=".5"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>
    </footer>
  );
}
