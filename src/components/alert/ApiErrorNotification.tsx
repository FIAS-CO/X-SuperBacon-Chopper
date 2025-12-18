import React, { useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { apiClient, NotificationSettings } from '../../services/api';

/**
 * システムお知らせを表示するコンポーネント
 * バックエンドAPIからお知らせ設定を取得して表示
 */
export const ApiErrorNotification: React.FC = () => {
    const [notification, setNotification] = useState<NotificationSettings | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        apiClient.getNotificationSettings()
            .then(settings => {
                setNotification(settings);
            })
            .catch(err => {
                console.error('Failed to load notification:', err);
                // エラー時は非表示
                setNotification(null);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    // ローディング中は何も表示しない
    if (isLoading) {
        return null;
    }

    // enabled=false または取得失敗時は表示しない
    if (!notification || !notification.enabled) {
        return null;
    }

    return (
        <Alert variant="destructive" className="mb-6 max-w-screen-xl mx-auto">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle className="ml-2 font-semibold">{notification.title}</AlertTitle>
            <AlertDescription className="ml-7 text-sm" style={{ whiteSpace: 'pre-wrap' }}>
                {notification.message}
            </AlertDescription>
        </Alert>
    );
};