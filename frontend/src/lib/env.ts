declare global {
    interface Window {
        __ENV__: {
            KAKAO_CLIENT_ID: string;
            KAKAO_REDIRECT_URI: string;
            GOOGLE_CLIENT_ID: string;
        };
    }
}

export const env = window.__ENV__ ?? {};
