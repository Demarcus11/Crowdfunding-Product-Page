/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                "primary-400": "hsl(176, 50%, 47%)",
                "primary-500": "hsl(176, 72%, 28%)",
                "nuetral-100": "hsl(0, 0%, 100%)",
                "nuetral-700": "hsl(0, 0%, 48%)",
                "nuetral-900": "hsl(0, 0%, 0%)",
            },
            fontFamily: {
                primary: ["Commissioner", "sans-serif"],
            },
            fontWeight: {
                regular: 400,
                medium: 500,
                bold: 700,
            },
            fontSize: {
                400: "1rem",
            },
            backgroundImage: {
                "primary-header-mobile":
                    "url('/public/images/image-hero-mobile.jpg')",
                "primary-header-desktop":
                    "url('/public/images/image-hero-desktop.jpg')",
            },
            screens: {
                desktop: "70em",
                // >= 1120px @media (min-width: 70em) { ... }
            },
        },
    },
    plugins: [],
};
