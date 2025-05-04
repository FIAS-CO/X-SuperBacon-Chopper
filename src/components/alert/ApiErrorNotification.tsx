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
            <AlertTitle className="ml-2 font-semibold">お知らせ(2025/05/04)</AlertTitle>
            <AlertDescription className="ml-7 text-sm">
                いつもご利用いただきありがとうございます。<br />
                現在、多くの皆様にご利用いただいていることで、サーバー負荷によりチェッカーが正常に動かなくなっております。<br />
                安定稼働までしばらくお待ち下さい。<br />
                ※Xポスト検索除外チェッカーは正常に機能しております。<br />
                <br />
                Thank you for using our service.<br />
                Currently, due to high traffic and many users accessing the site, the checker is not functioning properly because of server load.<br />
                Please wait for a while until the service becomes stable.<br />
                *The X Post Exclusion Checker is functioning normally.
            </AlertDescription>
        </Alert>
    );
};