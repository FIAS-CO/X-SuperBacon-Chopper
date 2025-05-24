export class ClientEncryption {
    private async getKey(): Promise<CryptoKey> {
        const part1 = import.meta.env.VITE_KEY_PART_1;
        const part2 = import.meta.env.VITE_KEY_PART_2;
        const part3 = import.meta.env.VITE_KEY_PART_3;
        const part4 = import.meta.env.VITE_KEY_PART_4;

        if (!part1 || !part2 || !part3 || !part4) {
            throw new Error('暗号鍵の一部が未定義です');
        }

        // 🔐 難読化構成（合計32文字）
        const combinedKey = part1.slice(0, 6) + part4 + part3.slice(0, 6) + part2 + part3.slice(6) + part1.slice(6);

        const rawKey = new TextEncoder().encode(combinedKey);
        return crypto.subtle.importKey('raw', rawKey, 'AES-CBC', false, ['encrypt']);
    }

    public async encrypt(ip: string): Promise<string> {
        try {
            const key = await this.getKey();
            const iv = crypto.getRandomValues(new Uint8Array(16));
            const encodedIp = new TextEncoder().encode(ip);

            const encryptedBuffer = await crypto.subtle.encrypt(
                { name: 'AES-CBC', iv },
                key,
                encodedIp
            );

            const encryptedBytes = new Uint8Array(encryptedBuffer);
            const combined = new Uint8Array(iv.length + encryptedBytes.length);
            combined.set(iv, 0);
            combined.set(encryptedBytes, iv.length);

            return btoa(String.fromCharCode(...combined));
        } catch (error) {
            console.error('Encryption error:', error);
            return '';
        }
    }
}

export const clientEncryption = new ClientEncryption();