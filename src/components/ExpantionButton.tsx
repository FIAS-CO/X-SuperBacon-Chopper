import { useState } from "react";

export const HowToUseExpantionButton: React.FC = () => {
    return (
        <ExpantionButton label="使い方">
            <p className="mb-4 text-left">
                ポスト(ツイート)のURLをテキストボックスに入れることでポストが検索除外されているかどうか確認できます
            </p>
            <p className="mb-4 text-left">
                ※https://x.com/〇〇/status/XXXXX/photo/1 みたいなURLでもチェックできます
            </p>
            <div>
                <p className="mb-2 text-left">※以下のツイートは判定できず検索除外と判定されます：</p>
                <ul className="list-disc pl-6 space-y-2 text-left">
                    <li>センシティブラベル、暴力、ヌードのラベルを張ったツイート</li>
                    <li>鍵垢によるツイート</li>
                    <li>重度のシャドウバンを受けているユーザーのポスト全般</li>
                </ul>
            </div>
        </ExpantionButton>
    )
}

export const CautionExpantionButton: React.FC = () => {
    return (
        <ExpantionButton label="注意事項">
            <div>
                <ul className="list-disc pl-6 space-y-2 text-left">
                    <li>このツールの検出結果は100％保証するものではありません。<br />
                        X(Twitter)の仕様が変わるとこのツールも使えなるかもしれません。</li>
                    <li>誤作動があっても温かい目で見てください。</li>
                </ul>
            </div>
        </ExpantionButton>
    )
}

export const ContactUsExpantionButton: React.FC = () => {
    return (
        <ExpantionButton label="問い合わせ先">
            <p className="mb-4 text-left">
                <a href="https://x.com/TAIYO_SUN_2024" target="_blank">タイヨー(@TAIYO_SUN_2024)</a>までDMかリプください。
            </p>
        </ExpantionButton >
    )
}

export const WhatIsShadowbanExpantionButton: React.FC = () => {
    return (
        <ExpantionButton label="Shadowbanとは">
            <p className="mb-4 text-left">
                <p>SNSアカウントや投稿が他のユーザーに表示されにくくなる、または表示されない現象を指す通称です。</p>
                <p>本サイトはX（Twitter）におけるアカウントがシャドウバン状態でないかをチェックするものです。</p>
                <br />
                <p>ただし、X（Twitter）社は公式にはシャドウバンを行っていないと明言しています。</p>
                <p>本サイトで確認できる4種類のBANは公式の名称ではなく、ネットを中心に呼称される俗称を採用したものとなります。</p>            </p>
        </ExpantionButton >
    )
}

interface ExpantionButtonProps {
    label: string;
    children: React.ReactNode;
}


export const ExpantionButton: React.FC<ExpantionButtonProps> = ({ label, children }) => {


    const [isGraphVisible, setIsGraphVisible] = useState(false);
    return (

        <div className="mb-6">
            <button
                onClick={() => setIsGraphVisible(!isGraphVisible)}
                className="w-full bg-white dark:bg-gray-800 rounded-lg shadow p-2 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
                <span className="font-bold dark:text-white flex items-center gap-2">
                    {isGraphVisible ? '▼' : '▶'}
                    {label}
                </span>
            </button>

            {/* グラフ本体 - アニメーション付きの展開/収納 */}
            <div
                className={`transform transition-all duration-300 ease-in-out overflow-hidden ${isGraphVisible ? 'max-h-[400px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}
            >
                <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    {children}
                </div>
            </div>
        </div>
    );
};