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
            <AlertTitle className="ml-2 font-semibold">お知らせ(2025/11/19)</AlertTitle>
            <AlertDescription className="ml-7 text-sm">
                いつもご利用いただきありがとうございます。<br />
                現在、チェックが正常に動作しなくなっています。<br />
                復旧までしばらくお待ち下さい。<br />
                <br />
                Thank you for using our service.<br />
                The shadowban check is currently unavailable.<br />
                Please wait for a while until it is restored.
            </AlertDescription>
        </Alert>
    );
};