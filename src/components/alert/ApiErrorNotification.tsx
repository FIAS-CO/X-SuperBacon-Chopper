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
                現在、異常な規模のアクセスによりチェッカーが正常に動かなくなっております。<br />
                安定稼働までしばらくお待ち下さい。<br />
                ※Xポスト検索除外チェッカーは正常に機能しております。<br />
                <br />
                Thank you for using our service.<br />
                Currently, the checker is not functioning properly due to an abnormal amount of access.<br />
                Please wait a while until stable operation resumes.<br />
                ※The X post search exclusion checker is functioning normally.
            </AlertDescription>
        </Alert>
    );
};