export default function Logo(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <rect x="15" y="15" width="20" height="20" rx="4" fill="currentColor" />
            <rect x="65" y="15" width="20" height="20" rx="4" fill="currentColor" />
            <rect x="15" y="65" width="20" height="20" rx="4" fill="currentColor" />
            <rect x="65" y="65" width="20" height="20" rx="4" fill="currentColor" />
            <circle cx="50" cy="50" r="6" fill="currentColor" />
        </svg>
    );
}
