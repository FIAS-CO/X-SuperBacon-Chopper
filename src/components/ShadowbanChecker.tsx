import { useEffect, useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Search, Ban, Check, HelpCircle, X } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "./ui/accordion";
import { apiClient } from '../services/api';
import { FilterCheckbox, Legend, ResultList, ShadowBanCheckResult } from './results/StatusComponents';
import { loadAd, TopPageAdsense1, TopPageAdsense2 } from './adsense/AdSenseUtil';
import { CautionExpantionButton, ContactUsExpantionButton } from './ExpantionButton';

const ShadowbanChecker = () => {
    const [screenName, setScreenName] = useState('');
    const [results, setResults] = useState<ShadowBanCheckResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [filters, setFilters] = useState({
        searchOk: true,
        searchForbidden: true,
        quoteForbidden: true,
        error: true
    });

    const handleCheck = async () => {
        if (!screenName) return;

        setLoading(true);
        setError('');
        try {
            const checkResults = await apiClient.checkByUser(screenName);
            setResults(checkResults);
        } catch (err) {
            setError('チェック中にエラーが発生しました。しばらく待ってから再度お試しください。');
        } finally {
            setLoading(false);
        }
    };

    const StatusIcon = (props: { status: boolean | undefined }) => {
        if (props.status === true) return <Ban className="h-5 w-5 text-destructive" />;
        if (props.status === false) return <Check className="h-5 w-5 text-green-500" />;
        return <HelpCircle className="h-5 w-5 text-blue-500" />;
    };

    // ユーザーの状態に応じてメッセージを生成
    const getUserStateMessage = () => {
        if (!results) return null;
        if (results.not_found) {
            return {
                title: "ユーザーが見つかりません",
                description: "指定されたユーザー名のアカウントが存在しないか、削除された可能性があります。"
            };
        }
        if (results.suspend) {
            return {
                title: "凍結されたユーザーかもしれません",
                description: "このアカウントは凍結されている可能性があります。"
            };
        }
        return null;
    };

    // ユーザーの状態に応じてステータスを調整
    const getAdjustedStatus = (originalStatus: boolean | undefined) => {
        if (results?.not_found || results?.suspend) {
            return undefined;
        }
        return originalStatus;
    };

    const items = [
        {
            id: "search-suggestion",
            title: "Search Suggestion Ban",
            description: "検索画面において候補から当該アカウントが表示されなくなる場合があります。",
            status: getAdjustedStatus(results?.search_suggestion_ban)
        },
        {
            id: "search-ban",
            title: "Search Ban",
            description: "検索結果からアカウントやツイートが表示されなくなります。\n※ハッシュタグなど利用しても表示されません。\nまた「おすすめ」欄にも表示されにくくなる場合があります。",
            status: getAdjustedStatus(results?.search_ban)
        },
        {
            id: "ghost-ban",
            title: "Ghost Ban",
            description: "リプライが表示されない場合があります。\n（ポスト投稿主にも表示されない場合があります）",
            status: getAdjustedStatus(results?.ghost_ban)
        },
        {
            id: "reply-deboosting",
            title: "Reply Deboosting",
            description: "リプライが「さらに返信を表示する」をタップしないと表示されなくなる場合があります。",
            status: getAdjustedStatus(results?.reply_deboosting)
        }
    ];

    const stateMessage = getUserStateMessage();

    useEffect(() => {
        loadAd()
        document.title = 'X（Twitter）Shadowban Checker F（シャドウバンチェッカー エフ）';
    }, []);

    return (
        <>
            <h1 className="text-4xl font-bold text-center mb-8">
                X（Twitter）Shadowban Checker F
            </h1>
            <Card className="w-full max-w-2xl mx-auto">
                <TopPageAdsense1 />
                <CardContent className="p-6">
                    <div className="space-y-4">
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <span className="text-xl">@</span>
                                </div>
                                <Input
                                    placeholder="Username"
                                    value={screenName}
                                    onChange={(e) => setScreenName(e.target.value)}
                                    className="pl-8 text-xl h-12"
                                    onKeyDown={e => {
                                        if (e.key == 'Enter' && screenName) {
                                            handleCheck()
                                        }
                                    }
                                    }
                                />
                                {screenName && (
                                    <button
                                        type="button"
                                        onClick={() => setScreenName('')}
                                        className="absolute right-0 top-1/2 -translate-y-1/2 px-2 text-gray-400 hover:text-gray-600 bg-transparent border-0 cursor-pointer"
                                        aria-label="入力をクリア"
                                    >
                                        <X className="h-6 w-6" />
                                    </button>
                                )}
                            </div>
                            <Button
                                onClick={handleCheck}
                                disabled={!screenName || loading}
                                className="text-xl h-12"
                            >
                                <Search className="w-5 h-5" />
                            </Button>
                        </div>

                        {!results && !loading && (
                            <div className="mt-4 p-7 bg-gray-50 rounded-lg text-left">
                                <p>＜Shadowbanとは＞</p>
                                <p>SNSアカウントや投稿が他のユーザーに表示されにくくなる、または表示されない現象を指す通称です。</p>
                                <p>本サイトはX（Twitter）におけるアカウントがシャドウバン状態でないかをチェックするものです。</p>
                                <br />
                                <p>ただし、X（Twitter）社は公式にはシャドウバンを行っていないと明言しています。</p>
                                <p>本サイトで確認できる4種類のBANは公式の名称ではなく、ネットを中心に呼称される俗称を採用したものとなります。</p>
                            </div>
                        )}
                        {loading && (
                            <div className="mt-4 p-7 bg-gray-50 rounded-lg text-left">
                                <p>只今チェック中です。10秒ほどお待ちください...</p>
                            </div>
                        )
                        }
                        {stateMessage && (
                            <Alert variant="destructive">
                                <AlertTitle>{stateMessage.title}</AlertTitle>
                                <AlertDescription>{stateMessage.description}</AlertDescription>
                            </Alert>
                        )}

                        {error && (
                            <Alert variant="destructive">
                                <AlertTitle>エラー</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <Accordion type="multiple" className="w-full">
                            {items.map(item => (
                                <AccordionItem key={item.id} value={item.id}>
                                    <AccordionTrigger className="hover:no-underline">
                                        <div className="flex items-center gap-2">
                                            <StatusIcon status={item.status} />
                                            <span>{item.title}</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className='whitespace-pre-wrap'>
                                        {item.description}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </CardContent>
                {results?.tweets &&
                    <>
                        <CardContent>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                                <FilterCheckbox
                                    id="searchOk"
                                    label="検索OK"
                                    checked={filters.searchOk}
                                    onChange={(checked) => setFilters(prev => ({ ...prev, searchOk: checked }))}
                                />
                                <FilterCheckbox
                                    id="searchForbidden"
                                    label="検索除外"
                                    checked={filters.searchForbidden}
                                    onChange={(checked) => setFilters(prev => ({ ...prev, searchForbidden: checked }))}
                                />
                                <FilterCheckbox
                                    id="quoteForbidden"
                                    label="引用元除外"
                                    checked={filters.quoteForbidden}
                                    onChange={(checked) => setFilters(prev => ({ ...prev, quoteForbidden: checked }))}
                                />
                                <FilterCheckbox
                                    id="error"
                                    label="エラー"
                                    checked={filters.error}
                                    onChange={(checked) => setFilters(prev => ({ ...prev, error: checked }))}
                                />
                            </div>
                            <ResultList results={results?.tweets} filters={filters} />
                            <Legend />
                        </CardContent>
                    </>
                }
                <CardContent className='mt-3'>
                    <CautionExpantionButton />
                    <ContactUsExpantionButton />
                </CardContent>
                <TopPageAdsense2 />
            </Card>
        </>
    );
};

export default ShadowbanChecker;