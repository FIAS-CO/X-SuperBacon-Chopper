import { useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft, Share } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import pinIcon from '../../assets/pin.svg';
import repostIcon from '../../assets/repost.svg';
import quoteIcon from '../../assets/quote.svg';
import postIcon from '../../assets/post.svg';

// ステータスの型定義
export type Status = 'AVAILABLE' | 'FORBIDDEN' | 'NOT_FOUND' | 'UNKNOWN' | 'INVALID_URL' | 'QUATE_FORBIDDEN';
export type Type = 'POST' | 'REPOST' | 'QUOTE' | 'UNKNOWN';

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

const TYPE_CONFIG = {
    POST: {
        text: 'ポスト',
        className: 'bg-blue-100 text-blue-700',
        icon: postIcon
    },
    REPOST: {
        text: 'リポスト', 
        className: 'bg-purple-100 text-purple-700',
        icon: repostIcon
    },
    QUOTE: {
        text: '引用ポスト',
        className: 'bg-yellow-100 text-yellow-700',
        icon: quoteIcon
    },
    UNKNOWN: {
        text: '不明',
        className: 'bg-gray-100 text-gray-700',
        icon: postIcon
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
    <Card className="w-full max-w-screen-xl mx-auto">
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
                onClick={() => navigate('/tweetcheck')}
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                入力画面に戻る
            </Button>
        </CardHeader>
    );
};

export interface SessionResult {
    sessionId: string;
    sessionResults: TweetCheckResult[];
}

export interface TweetCheckResult {
    url: string;
    status?: Status;
    isPinned?: boolean;
    type: Type;
}

export const ResultList: React.FC<{
    results: TweetCheckResult[];
    filters: {
        searchOk: boolean;
        searchForbidden: boolean;
        quoteForbidden: boolean;
        error: boolean;
    };
    messageForNoData: string;
}> = ({ results, filters, messageForNoData: messageForError }) => {
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
                {messageForError}
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
                    <div className="flex flex-col gap-2 md:flex-1 md:min-w-0">
                        <div className="flex items-center gap-1 text-gray-600 text-sm">
                            {result.isPinned ? (
                                <>
                                    <img src={pinIcon} alt="pin" className="w-4 h-4" />
                                    <span>固定ポスト</span>
                                </>
                            ) : (
                                (() => {
                                    const itemType = result.type;
                                    const icon = TYPE_CONFIG[itemType]?.icon;
                                    const label = TYPE_CONFIG[itemType]?.text ?? '不明';
                                    if (!icon && !label) return null;
                                    return (
                                        <>
                                            {icon && <img src={icon} alt={label} className="w-4 h-4" />}
                                            <span>{label}</span>
                                        </>
                                    );
                                })()
                            )}
                        </div>
                        <a
                            href={result.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline break-all md:flex-1 md:min-w-0"
                        >
                            {result.url}
                        </a>
                    </div>
                    <StatusBadge status={result.status || 'UNKNOWN'} />
                </div>
            ))}
        </div>
    );
};

export const Legend: React.FC = () => (
    <div className="mt-4 text-left text-sm text-slate-500">
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
    results: TweetCheckResult[];
    timestamp: string;
}

export const ShareResults: React.FC<ShareResultsProps> = ({ sessionId, results, timestamp }) => {
    const handleTweet = () => {
        const totalCount = results.length;
        const okCount = results.filter(r => r.status === 'AVAILABLE').length;
        const forbiddenCount = results.filter(r => r.status === 'FORBIDDEN').length;
        const quoteForbiddenCount = results.filter(r => r.status === 'QUATE_FORBIDDEN').length;

        let tweetLines = [
            `${timestamp}に${totalCount}件の投稿をチェックしました！`,
            `✅${okCount}件が検索OKでした`,
            `❌${forbiddenCount}件が検索除外されていました`
        ];

        if (quoteForbiddenCount > 0) {
            tweetLines.push(`🔁${quoteForbiddenCount}件が引用元で検索除外されていました`);
        }
        tweetLines.push(``)
        tweetLines.push(`検索結果URL：https://x-shadowban-checker.fia-s.com/tweetcheck/history/${sessionId}`);
        tweetLines.push('#検索除外チェッカー');

        const tweetText = tweetLines.join('\n');
        const encodedText = encodeURIComponent(tweetText);
        window.open(`https://twitter.com/intent/tweet?text=${encodedText}`, '_blank');
    };

    return (
        <div className="mt-6 space-y-4">
            <Button
                onClick={handleTweet}
                className="w-full"
                variant="twitter"
            >
                <Share className="w-4 h-4 mr-2" />
                結果をポスト
            </Button>
        </div>
    );
};

interface ShareShadowBanProps extends ShadowBanCheckResult {
    screenName: string;
}

export const ShareShadowBanResult: React.FC<ShareShadowBanProps> = (props) => {
    const handleTweet = () => {
        const getStatusIcon = (isBanned?: boolean) => isBanned ? '❌' : '✅';

        let tweetLines = [
            `Check @${props.screenName} Result`,
            `${getStatusIcon(props.search_suggestion_ban)} Search Suggestion Ban`,
            `${getStatusIcon(props.search_ban)} Search Ban`,
            `${getStatusIcon(props.ghost_ban)} Ghost Ban`,
            `${getStatusIcon(props.reply_deboosting)} Reply Deboosting`,
            ``
        ];

        const searchbanDisplayString = (forbiddenCount: number, quoteForbiddenCount: number) => {
            const prefix = '直近20件のポストに';

            if (forbiddenCount === 0 && quoteForbiddenCount === 0) {
                return `${prefix}検索除外はありませんでした`;
            }

            const parts = [];
            if (forbiddenCount > 0) {
                parts.push(`検索除外が${forbiddenCount}件`);
            }
            if (quoteForbiddenCount > 0) {
                parts.push(`引用元検索除外が${quoteForbiddenCount}件`);
            }

            const statusText = parts.length > 1 ? parts.join('、') : parts[0];
            return `${prefix}${statusText}ありました`;
        };

        if (props.tweets && props.tweets.length !== 0) {
            const forbiddenCount = props.tweets ? props.tweets.filter(t => t.status === 'FORBIDDEN').length : 0;
            const quoteForbiddenCount = props.tweets.filter(t => t.status === 'QUATE_FORBIDDEN').length;

            tweetLines.push(searchbanDisplayString(forbiddenCount, quoteForbiddenCount));
            tweetLines.push(``);
        }
        tweetLines.push(`#shadowban`);
        tweetLines.push('https://x-shadowban-checker.fia-s.com/');

        const tweetText = tweetLines.join('\n');
        const encodedText = encodeURIComponent(tweetText);
        window.open(`https://twitter.com/intent/tweet?text=${encodedText}`, '_blank');
    };

    return (
        <div className="mt-6 space-y-4">
            <button
                onClick={handleTweet}
                className="w-full flex items-center justify-center gap-2 bg-black text-white rounded-full py-3 px-4 font-medium text-xl hover:bg-gray-800 transition-colors"
            >
                <XIcon />
                ポストする
            </button>
        </div>

    )
}

const XIcon = () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
        <path d="M14.258 10.152L23.176 0h-2.113l-7.747 8.813L7.133 0H0l9.352 13.328L0 23.973h2.113l8.176-9.309 6.531 9.309h7.133zm-2.895 3.293l-.949-1.328L2.875 1.56h3.246l6.086 8.523.946 1.328 7.91 11.078h-3.246zm0 0" />
    </svg>
);

export interface ShadowBanCheckResult {
    screenName: string;
    not_found: boolean;
    suspend: boolean;
    protect: boolean;
    no_tweet: boolean;
    search_ban: boolean;
    search_suggestion_ban: boolean;
    no_reply: boolean;
    ghost_ban: boolean;
    reply_deboosting: boolean;
    tweets: TweetCheckResult[];
    api_status: {
        userSearchGroup: {
            rate_limit: boolean,
            error: string | undefined
        },
        userTimelineGroup: {
            rate_limit: boolean,
            error: string | undefined
        }
    }
}

export function checkSucceed(result: ShadowBanCheckResult | null): boolean {
    if (!result) return false;
    return !result.not_found && !result.suspend && !result.protect;
}