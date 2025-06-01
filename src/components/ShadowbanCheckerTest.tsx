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
import { checkSucceed, FilterCheckbox, Legend, ResultList, ShadowBanCheckResult, ShareShadowBanResult } from './results/StatusComponents';
import { loadAd, TopPageAdsense1, TopPageAdsense2 } from './adsense/AdSenseUtil';
import { CautionExpantionButton, ContactUsExpantionButton, WhatIsShadowbanExpantionButton } from './ExpantionButton';
import TabNavigation from './results/TabNavigation';
import { ResponsiveDMMAd } from './adsense/DMMAffiliate';
import { IdChecker } from './util/IdChecker';
import { ApiErrorNotification } from './alert/ApiErrorNotification';

const ShadowbanCheckerTest = () => {
    const [screenName, setScreenName] = useState('');
    const [results, setResults] = useState<ShadowBanCheckResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [checkSearchban, setCheckSearchban] = useState(true);
    const [checkRepost, setCheckRepost] = useState(true);

    const [filters, setFilters] = useState({
        searchOk: true,
        searchForbidden: true,
        quoteForbidden: true,
        error: true
    });

    const handleCheck = async () => {
        try {
            setError('');

            const validation = IdChecker.validateScreenName(screenName);

            if (!validation.isValid) {
                setError(validation.errorMessage);
                return;
            }

            setLoading(true);
            const checkResults = await apiClient.checkByUserInner(screenName, checkSearchban, checkRepost);
            setResults(checkResults);
            if (checkResults?.api_status.userSearchGroup.rate_limit) {
                setError('サーバー負荷により取得できませんでした。時間帯をずらして再度実施いただきますようお願いいたします。')
            }
        } catch (err) {
            if (err instanceof Error) {
                // エラーオブジェクトにresponseプロパティが存在するか確認
                const apiError = err as any;
                if (apiError.response && apiError.response.data && apiError.response.data.code) {
                    // const errorData = apiError.response.data;
                    setError('Xのエラーによりチェックが失敗しました。しばらくたってから改めてお試しください。');
                } else {
                    setError('Xのエラーによりチェックが失敗しました。しばらくたってから改めてお試しください。');
                }
            } else {
                setError('Xのエラーによりチェックが失敗しました。しばらくたってから改めてお試しください。');
            }
        } finally {
            setLoading(false);
        }
    };

    const StatusIcon = (props: { status: boolean | undefined }) => {
        if (props.status === true) return <Ban className="h-5 w-5 text-destructive" />;
        if (props.status === false) return <Check className="h-5 w-5 text-green-500" />;
        return <HelpCircle className="h-5 w-5 text-blue-500" />;
    };

    const messageForNoData = () => {
        if (results?.no_tweet) return 'No Data.';
        if (results?.api_status.userTimelineGroup.rate_limit) return 'サーバー負荷により取得できませんでした。時間帯をずらして再度実施いただきますようお願いいたします。';
        return '取得に失敗しました。'
    }

    // ユーザーの状態に応じてメッセージを生成
    const getUserStateMessage = () => {
        if (!results) return null;
        if (results.not_found) {
            return {
                title: "ユーザーが見つかりません",
                description: "指定されたユーザー名のアカウントが存在しないか削除されているため、チェックすることができません。"
            };
        }
        if (results.suspend) {
            return {
                title: "凍結されたアカウントです",
                description: "このアカウントは現在凍結されているため、チェックすることができません。"
            };
        }
        if (results.protect) {
            return {
                title: "非公開アカウントです",
                description: "このアカウントは非公開設定となっているため、チェックすることができません。"
            };
        }
        if (results.no_tweet) {
            return {
                title: "ポストが存在しません",
                description: "このアカウントはまだポストを投稿していません。"
            };
        }
        return null;
    };

    // ユーザーの状態に応じてステータスを調整
    const getAdjustedStatus = (originalStatus: boolean | undefined) => {
        if (results?.not_found || results?.suspend || results?.protect || results?.api_status.userSearchGroup.rate_limit) {
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
        loadAd();
        document.title = 'X（Twitter）Shadowban Checker F（シャドウバンチェッカー エフ）';
    }, []);

    return (
        <>
            <TabNavigation isShadowbanTab={true} />
            <h1 className="text-4xl font-bold text-center mb-8 mx-auto max-w-screen-xl px-4">
                X（Twitter）Shadowban Checker F
            </h1>

            {/* <ApiErrorNotification /> */}
            <Card className="w-full mx-auto">
                <CardContent className="p-6">
                    <TopPageAdsense1 />
                    <div className="space-y-4 mt-6">
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
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="searchban-check"
                                checked={checkSearchban}
                                onChange={(e) => setCheckSearchban(e.target.checked)}
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label htmlFor="searchban-check" className="text-sm text-gray-600">
                                直近20件のポストが検索除外(Postban)されているかチェックする
                            </label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="repost-check"
                                checked={checkRepost}
                                onChange={(e) => setCheckRepost(e.target.checked)}
                                className={`w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500  ${!checkSearchban ? 'opacity-50 pointer-events-none' : ''}`}
                            />
                            <label htmlFor="repost-check" className={`text-sm text-gray-600 ${!checkSearchban ? 'opacity-50 pointer-events-none' : ''}`}>
                                リポスト、引用ポストも含めてチェックする
                            </label>
                        </div>

                        {loading && (
                            <div className="mt-4 p-7 bg-gray-50 rounded-lg text-left">
                                <p>{checkSearchban ? "チェック中。10秒ほどお待ちください..." : "チェック中..."}</p>
                            </div>
                        )
                        }
                        {!loading && stateMessage && (
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
                    {checkSucceed(results) && <ShareShadowBanResult {...results!} />}
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
                            <ResultList results={results?.tweets} filters={filters} messageForNoData={messageForNoData()} />
                            <Legend />
                            {results.tweets?.length !== 0 && <ShareShadowBanResult {...results!} />}

                        </CardContent>
                    </>
                }
                <CardContent className='mt-3'>
                    <ResponsiveDMMAd />
                    <WhatIsShadowbanExpantionButton />
                    <CautionExpantionButton />
                    <ContactUsExpantionButton />
                    <TopPageAdsense2 />
                </CardContent>
            </Card>
        </>
    );
};

export default ShadowbanCheckerTest;