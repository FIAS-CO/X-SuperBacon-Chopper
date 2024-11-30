const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
export const apiClient = {
    // encryptedKey = 暗号化されたIP
    async checkUrlBatch(urls: string[], encryptedKey: string) {
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

        return response.json();
    },

    async getOembed(url: string) {
        const response = await fetch(`${API_BASE_URL}/api/oembed?url=${encodeURIComponent(url)}`)
        return response.json()
    }
}
