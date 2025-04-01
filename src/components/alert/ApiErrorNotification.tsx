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
                X（旧Twitter）に一時的な障害が発生しているため、チェックにエラーが頻発しております。<br />
                障害が復旧するまでご迷惑をおかけしますが、しばらくお待ち下さい。<br />
                Due to a temporary outage on X (formerly Twitter), frequent errors are occurring during checks.<br />
                We apologize for the inconvenience, but please wait for a while until the outage is restored.
            </AlertDescription>
        </Alert>
    );
};