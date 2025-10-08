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
            <AlertTitle className="ml-2 font-semibold">お知らせ(2025/05/08)</AlertTitle>
            <AlertDescription className="ml-7 text-sm">
                いつもご利用いただきありがとうございます。<br />
                諸事情により、現在シャドウバンチェッカーのメンテナンスを実施中のためチェックがエラーとなります。<br />
                再開までしばらくお待ち下さい。<br />
                <br />
                ご迷惑をおかけして申し訳ありません。<br />
                <br />
                Thank you for using our service.<br />
                Due to various circumstances, the Shadowban Checker is currently under maintenance and checks will result in errors.<br />
                Please wait for a while until it resumes.<br />
                <br />
                We apologize for any inconvenience caused.
            </AlertDescription>
        </Alert>
    );
};