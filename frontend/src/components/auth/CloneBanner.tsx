import { useState } from 'react';

export default function CloneBanner() {
    const [visible, setVisible] = useState(true);

    if (!visible) return null;

    return (
        <div className="w-full bg-base-200 text-sm text-base-content px-4 py-2 flex justify-between items-center shadow">
            <p className="text-sm">
                This is a <strong>personal portfolio project</strong>. It is not an actual service or a commercial product.
            </p>

            <button
                onClick={() => setVisible(false)}
                className="btn btn-xs btn-ghost"
                aria-label="Close banner"
            >
                ✕
            </button>
        </div>
    );
}
