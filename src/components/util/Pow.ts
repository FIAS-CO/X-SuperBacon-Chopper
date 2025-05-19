export async function solvePoW(challenge: string, difficulty: number): Promise<string> {
    const encoder = new TextEncoder()
    const prefix = '0'.repeat(difficulty)

    for (let nonce = 0; nonce < 1e7; nonce++) {
        const data = encoder.encode(challenge + nonce)
        const hashBuffer = await crypto.subtle.digest('SHA-256', data)
        const hashHex = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('')

        if (hashHex.startsWith(prefix)) {
            return nonce.toString()
        }
    }

    throw new Error('Failed to solve PoW')
}