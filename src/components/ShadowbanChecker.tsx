import { useEffect, useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Search, Ban, Check, HelpCircle } from 'lucide-react';
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
            title: "検索候補からの除外",
            description: "検索画面において、検索候補から該当のアカウントが表示されなくなります。",
            status: getAdjustedStatus(results?.search_suggestion_ban)
        },
        {
            id: "search-ban",
            title: "検索結果からの除外",
            description: "検索結果から、該当のアカウントのツイートやアカウントが表示されなくなります。",
            status: getAdjustedStatus(results?.search_ban)
        },
        {
            id: "ghost-ban",
            title: "返信一覧からの除外",
            description: "ポストに対する返信が返信一覧から表示されなくなり、ポスト投稿主への通知もされなくなります。",
            status: getAdjustedStatus(results?.ghost_ban)
        },
        {
            id: "reply-deboosting",
            title: "返信一覧での表示順の低下",
            description: "ポストに対する返信が返信一覧にて、下部に表示されるようになります。また、「さらに返信を表示する」をタップするまで返信が表示されなくなる場合があります。",
            status: getAdjustedStatus(results?.reply_deboosting)
        }
    ];

    const stateMessage = getUserStateMessage();

    useEffect(() => {
        loadAd()
    }, []);

    return (
        <>
            <h1 className="text-4xl font-bold text-center mb-8">
                Xシャドウバンチェッカー
            </h1>
            <Card className="w-full max-w-2xl mx-auto">
                <TopPageAdsense1 />
                <CardContent className="p-6">
                    <div className="space-y-4">
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <span className="text-gray-500 text-xl">@</span>
                                </div>
                                <Input
                                    placeholder="ユーザー名を入力"
                                    value={screenName}
                                    onChange={(e) => setScreenName(e.target.value)}
                                    className="pl-8 text-xl h-12"
                                />
                            </div>
                            <Button
                                onClick={handleCheck}
                                disabled={!screenName || loading}
                                className="text-xl h-12"
                            >
                                <Search className="w-5 h-5" />
                            </Button>
                        </div>

                        {!results && (
                            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                <p>シャドウバンとは、X (Twitter) において、アカウントがロックや凍結されていないにも関わらず、検索結果や返信一覧に表示されなく(ずらく)なる状態のことです。</p>
                            </div>
                        )}
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
                                    <AccordionContent>
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
                        </CardContent>
                        <Legend />
                    </>
                }
                <TopPageAdsense2 />
            </Card>
        </>
    );
};

export default ShadowbanChecker;