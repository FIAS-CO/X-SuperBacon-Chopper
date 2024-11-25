const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
export const apiClient = {
    async checkUrl(url: string, ip: string) {
        console.log(`start checkUrl ${url}`)
        const response = await fetch(`${API_BASE_URL}/api/check?url=${encodeURIComponent(url)}&key=${ip}`)
        return response.json()
    },

    async getOembed(url: string) {
        const response = await fetch(`${API_BASE_URL}/api/oembed?url=${encodeURIComponent(url)}`)
        return response.json()
    }
}
