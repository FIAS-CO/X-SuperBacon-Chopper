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
            <AlertTitle className="ml-2 font-semibold">お知らせ(2025/05/06)</AlertTitle>
            <AlertDescription className="ml-7 text-sm">
                いつもご利用いただきありがとうございます。<br />
                たびたびの障害でご迷惑をおかけして申し訳ありません。<br />
                ゴールデンウィークから大量アクセスによる攻撃でチェックを安定して提供できなくなっております。<br />
                どうにかならないか試しておりますので、様子を見つつご利用いただけますと幸いです。<br />
                <br />
                Thank you for using our service as always.<br />
                We sincerely apologize for the repeated disruptions.<br />
                Since Golden Week, we have been unable to provide stable checks due to attacks involving heavy traffic.<br />
                We are doing our best to find a solution, so we would appreciate it if you could continue to use the service while keeping an eye on the situation.
            </AlertDescription>
        </Alert>
    );
};