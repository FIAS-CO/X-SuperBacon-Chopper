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
                ポストの検索除外チェックが高確率でエラーになる不具合が発生しています。<br />
                X側のAPI障害が原因と考えられますので、回復まで気長にお待ち下さい。<br />
                <br />
                Thank you for using our service.<br />
                We are currently experiencing frequent errors in the postban check.<br />
                This issue appears to be caused by an API outage on X's side.<br />
                We appreciate your patience while the service recovers.<br />
            </AlertDescription>
        </Alert>
    );
};