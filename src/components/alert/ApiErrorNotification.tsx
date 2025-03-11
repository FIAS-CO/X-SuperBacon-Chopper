import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

/**
 * X（旧Twitter）APIの障害を通知するコンポーネント
 * ShadowbanCheckerとTwitterStatusCheckerの両方で使用
 */
export const ApiErrorNotification: React.FC = () => {
    return (
        <Alert variant="destructive" className="mb-6 max-w-2xl mx-auto">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle className="ml-2 font-semibold">お知らせ</AlertTitle>
            <AlertDescription className="ml-7 text-sm">
                X（旧Twitter）の公式APIに一時的な障害が発生しているため、一部のポスト情報が正常に取得できない場合がございます
            </AlertDescription>
        </Alert>
    );
};