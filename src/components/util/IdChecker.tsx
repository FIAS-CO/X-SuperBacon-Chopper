export class IdChecker {
    /**
     * ユーザー名のバリデーションを行う
     * @param screenName 検証するユーザー名
     * @returns バリデーション結果と、エラーがある場合はエラーメッセージ
     */
    static validateScreenName(screenName: string): { isValid: boolean; errorMessage: string } {
        // 空のユーザー名は画面側でボタンが押せないのでチェック無し

        // 長さのチェック
        if (screenName.length < 5 || screenName.length > 15) {
            return { isValid: false, errorMessage: 'ユーザー名は5〜15文字にしてください' };
        }

        // 半角英数字とアンダースコアのみ許可する正規表現
        const validCharsRegex = /^[a-zA-Z0-9_]+$/;
        if (!validCharsRegex.test(screenName)) {
            return { isValid: false, errorMessage: 'ユーザー名には半角英数字とアンダースコア(_)のみ使用できます' };
        }

        return { isValid: true, errorMessage: '' };
    }
}