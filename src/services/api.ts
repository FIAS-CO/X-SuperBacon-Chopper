import { SessionResult, TweetCheckResult, ShadowBanCheckResult } from "../components/results/StatusComponents";
import { ClientEncryption } from "../components/util/ClientEncryption";
import { solvePoW } from "../components/util/Pow";

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
            sessionResults: data.results.map((result: any): TweetCheckResult => ({
                url: result.url,
                status: result.status
            })),
            sessionId: data.sessionId
        };
    },

    async getHistory(sessionId: string): Promise<{ results: TweetCheckResult[]; timestamp: string }> {
        const response = await fetch(`${API_BASE_URL}/api/get-history-by-session-id?id=${sessionId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch history');
        }
        const { results, timestamp } = await response.json();
        return {
            results: results.map((item: any) => ({
                url: item.url,
                status: item.checkStatus
            })),
            timestamp
        };
    },

    async getOembed(url: string) {
        const response = await fetch(`${API_BASE_URL}/api/oembed?url=${encodeURIComponent(url)}`)
        return response.json()
    },

    async checkByUser(screenName: string, searchban: boolean, repost: boolean, turnstileToken: string): Promise<ShadowBanCheckResult> {
        const key = await _getEncryptedIpAsync()
        const response = await fetch(`${API_BASE_URL}/api/checks-byuser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                screen_name: screenName,
                key: key,
                searchban: searchban,
                repost: repost,
                turnstileToken: turnstileToken
            }),
        });

        if (!response.ok) {
            // エラーレスポンスの解析
            const errorData = await response.json();
            const error = new Error(`Failed to check user status: ${errorData.message || 'Unknown error'}`);
            (error as any).response = {
                status: response.status,
                data: errorData
            };
            throw error;
        }

        const { user, ...checkResult } = await response.json();
        return { screenName, ...checkResult };
    },

    async checkByUserInner(screenName: string, searchban: boolean, repost: boolean): Promise<ShadowBanCheckResult> {
        const key = await _getEncryptedIpAsync()
        const res = await fetch(`${API_BASE_URL}/api/generate-keyvalue`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                screen_name: screenName,
                key: key,
                searchban: searchban,
                repost: repost,
            }),
        });
        const { key: challenge, value: difficultyValue } = await res.json();
        const difficulty = difficultyValue / 123456789;

        const nonce = await solvePoW(challenge, difficulty)

        const response = await fetch(`${API_BASE_URL}/api/check-by-user-inner`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Session-Token': challenge,
                'X-Request-Hash': nonce,
            },
            body: JSON.stringify({
                screen_name: screenName,
                key: key,
                searchban: searchban,
                repost: repost,
            }),
        });

        if (!response.ok) {
            // エラーレスポンスの解析
            const errorData = await response.json();
            const error = new Error(`Failed to check user status: ${errorData.message || 'Unknown error'}`);
            (error as any).response = {
                status: response.status,
                data: errorData
            };
            throw error;
        }

        const { user, ...checkResult } = await response.json();
        return { screenName, ...checkResult };
    },

    async getEncryptedIpAsync(): Promise<string> {
        return await _getEncryptedIpAsync();
    },
}

async function _getEncryptedIpAsync(): Promise<string> {
    const ip = await _getUserIpAsync();
    console.log('User IP:', ip);
    const encryptedKey = await new ClientEncryption().encrypt(ip || '');
    console.log('Encrypted IP:', encryptedKey);

    return encryptedKey;
}

async function _getUserIpAsync(): Promise<string> {
    const ipResponse = await fetch('https://api.ipify.org?format=json');
    const { ip } = await ipResponse.json();

    return ip;
}

