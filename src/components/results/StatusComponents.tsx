
import { useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft, Share } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';

// ステータスの型定義
export type Status = 'AVAILABLE' | 'FORBIDDEN' | 'NOT_FOUND' | 'UNKNOWN' | 'INVALID_URL' | 'QUATE_FORBIDDEN';

// ステータスに関する情報を一元管理するオブジェクト
const STATUS_CONFIG = {
    AVAILABLE: {
        text: '検索OK',
        className: 'bg-green-100 text-green-700'
    },
    FORBIDDEN: {
        text: '検索除外',
        className: 'bg-red-100 text-red-700'
    },
    NOT_FOUND: {
        text: 'エラー',
        className: 'bg-gray-100 text-gray-700'
    },
    UNKNOWN: {
        text: 'エラー',
        className: 'bg-gray-100 text-gray-700'
    },
    INVALID_URL: {
        text: 'エラー',
        className: 'bg-gray-100 text-gray-700'
    },
    QUATE_FORBIDDEN: {
        text: '引用元除外',
        className: 'bg-red-100 text-red-700'
    }
} as const;

// ステータス表示用のコンポーネント
export const StatusBadge: React.FC<{ status: Status }> = ({ status }) => {
    const config = STATUS_CONFIG[status];

    return (
        <div className={`px-3 py-1 rounded-md inline-flex items-center w-fit ${config.className}`}>
            {config.text}
        </div>
    );
};

export const FilterCheckbox: React.FC<{
    id: string;
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}> = ({ id, label, checked, onChange }) => {
    return (
        <label className="flex items-center cursor-pointer">
            <input
                type="checkbox"
                id={id}
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">{label}</span>
        </label>
    );
};

export const LoadingCard: React.FC<{ message: string }> = ({ message }) => (
    <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="ml-2">{message}</span>
        </CardContent>
    </Card>
);

export const StatusHeader: React.FC<{
    title: string;
}> = ({ title }) => {
    const navigate = useNavigate();

    return (
        <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{title}</CardTitle>
            <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/')}
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                入力画面に戻る
            </Button>
        </CardHeader>
    );
};

export interface SessionResult {
    sessionId: string;
    sessionResults: StatusResult[];
}

export interface StatusResult {
    url: string;
    status?: Status;
}

export const ResultList: React.FC<{
    results: StatusResult[];
    filters: {
        searchOk: boolean;
        searchForbidden: boolean;
        quoteForbidden: boolean;
        error: boolean;
    };
}> = ({ results, filters }) => {
    const filteredResults = results.filter(result => {
        const status = result.status;
        if (!status) return false;
        if (status === 'AVAILABLE') return filters.searchOk;
        if (status === 'FORBIDDEN') return filters.searchForbidden;
        if (status === 'QUATE_FORBIDDEN') return filters.quoteForbidden;
        return filters.error; // NOT_FOUND, UNKNOWN, INVALID_URLはすべてerrorとして扱う
    });

    if (results.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                No Data.
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {filteredResults.map((result, index) => (
                <div
                    key={index}
                    className="flex flex-col text-left md:flex-row md:items-center md:justify-between p-4 rounded-lg border gap-2 md:gap-4"
                >
                    <a
                        href={result.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline break-all md:flex-1 md:min-w-0"
                    >
                        {result.url}
                    </a>
                    <StatusBadge status={result.status || 'UNKNOWN'} />
                </div>
            ))}
        </div>
    );
};

export const Legend: React.FC = () => (
    <div className="ml-7 mt-4 text-left text-sm text-slate-500">
        <p className="mb-2">＜凡例＞</p>
        <div className="space-y-2">
            <p>
                <span className="inline-flex items-center px-2 py-1 rounded-md bg-green-100 text-green-700 text-xs mr-2">検索OK</span>
                検索除外されていないポストです。
            </p>
            <p>
                <span className="inline-flex items-center px-2 py-1 rounded-md bg-red-100 text-red-700 text-xs mr-2">検索除外</span>
                検索除外されているポストです。
            </p>
            <p>
                <span className="inline-flex items-center px-2 py-1 rounded-md bg-red-100 text-red-700 text-xs mr-2">引用元除外</span>
                引用元が検索除外されているポストです。
            </p>
            <p>
                <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-gray-700 text-xs mr-2">エラー</span>
                ポストが存在しない、URLが間違っているなどです。
            </p>
        </div>
    </div>
);

interface ShareResultsProps {
    sessionId: string;
    results: StatusResult[];
    timestamp: string;
}

export const ShareResults: React.FC<ShareResultsProps> = ({ sessionId, results, timestamp }) => {
    const baseUrl = 'https://x-searchban-checker.fia-s.com';
    const historyUrl = `${baseUrl}/history/${sessionId}`;

    const handleTweet = () => {
        const totalCount = results.length;
        const forbiddenCount = results.filter(r =>
            r.status === 'FORBIDDEN' || r.status === 'QUATE_FORBIDDEN'
        ).length;

        const tweetText = `${timestamp}に${totalCount}件の投稿をチェックし${forbiddenCount}件が検索除外されていました`;
        const encodedText = encodeURIComponent(`${tweetText}\n${historyUrl}\n#検索除外チェッカー`);
        window.open(`https://twitter.com/intent/tweet?text=${encodedText}`, '_blank');
    };

    return (
        <div className="mt-6 space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg break-all">
                <p className="text-sm text-gray-600 mb-2">履歴ページ:</p>
                <a
                    href={historyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                >
                    {historyUrl}
                </a>
            </div>

            <Button
                onClick={handleTweet}
                className="w-full"
            >
                <Share className="w-4 h-4 mr-2" />
                結果をポスト
            </Button>
        </div>
    );
};