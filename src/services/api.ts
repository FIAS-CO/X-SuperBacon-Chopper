import { SessionResult, StatusResult } from "../components/results/StatusComponents";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
export const apiClient = {
    // encryptedKey = 暗号化されたIP
    async checkUrlBatch(urls: string[], encryptedKey: string): Promise<SessionResult> {
        const response = await fetch(`${API_BASE_URL}/api/check-batch`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                urls,
                key: encryptedKey
            }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        return {
            sessionResults: data.results.map((result: any): StatusResult => ({
                url: result.url,
                status: result.status
            })),
            sessionId: data.sessionId
        };
    },

    async getHistory(sessionId: string): Promise<StatusResult[]> {
        const response = await fetch(`${API_BASE_URL}/api/get-history-by-session-id?id=${sessionId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch history');
        }
        const data = await response.json();
        return data.map((item: any) => ({
            url: item.url,
            status: item.checkStatus
        }));
    },

    async getOembed(url: string) {
        const response = await fetch(`${API_BASE_URL}/api/oembed?url=${encodeURIComponent(url)}`)
        return response.json()
    }
}
