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
                シャドウバンチェッカーを暫定的に再開いたしました。<br />
                何か問題があったらごめんなさい。<br />
                <br />
                Thanks as always for using the site!<br />
                The Shadowban Checker is back up for now.<br />
                Sorry if anything's not working quite right!
            </AlertDescription>
        </Alert>
    );
};