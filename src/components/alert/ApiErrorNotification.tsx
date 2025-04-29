import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

/**
 * X（旧Twitter）APIの障害を通知するコンポーネント
 * ShadowbanCheckerとTwitterStatusCheckerの両方で使用
 */
export const ApiErrorNotification: React.FC = () => {
    return (
        <Alert variant="destructive" className="mb-6 max-w-screen-xl mx-auto">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle className="ml-2 font-semibold">お知らせ(2025/04/30)</AlertTitle>
            <AlertDescription className="ml-7 text-sm">
                Xの仕様変更に対応し、シャドウバンチェックを復活いたしました。<br />
                ただ、申し訳ありませんが「直近20件のポストが検索除外されているかチェックする」機能は引き続き復旧対応中です。<br />
                復旧するまでご迷惑をおかけしますが、しばらくお待ち下さい。<br />
                引き続き"X（Twitter）Shadowban Checker F"をよろしくお願いいたします。<br />
                <br />
                We have updated the system to accommodate X's specification changes, and the shadowban check feature has been restored.<br />
                However, we apologize that the function to "check whether the latest 20 posts are excluded from search results" is still under restoration.<br />
                We apologize for the inconvenience and appreciate your patience until it is fully restored.<br />
                Thank you for your continued support of the "X (Twitter) Shadowban Checker F".<br />
            </AlertDescription>
        </Alert>
    );
};