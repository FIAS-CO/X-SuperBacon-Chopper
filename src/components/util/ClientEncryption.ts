export class ClientEncryption {
    encrypt(ip: string): string {
        try {
            return btoa(ip)
                .split('').reverse().join('')
                .replace(/=/g, '_');
        } catch (error) {
            console.error('Encryption error:', error);
            return '';
        }
    }
}

export const clientEncryption = new ClientEncryption();
