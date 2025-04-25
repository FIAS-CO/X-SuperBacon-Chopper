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
            <AlertTitle className="ml-2 font-semibold">お知らせ(2025/04/01 9:49)</AlertTitle>
            <AlertDescription className="ml-7 text-sm">
                Xの仕様変更に伴いシャドウバンチェッカーが正常に動作しなくなっております。<br />
                ※Xポスト検索除外チェッカーは正常に機能しております。<br />
                復旧するまでご迷惑をおかけしますが、しばらくお待ち下さい。<br />
                <br />
                Due to X's specification changes, the shadow ban checker is not functioning properly.<br />
                * The X post search exclusion checker is functioning normally.<br />
                We apologize for the inconvenience until it is restored. Please wait for a while.
            </AlertDescription>
        </Alert>
    );
};