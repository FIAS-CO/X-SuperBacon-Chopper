import { useState } from "react";

export const HowToUseExpantionButton: React.FC = () => {


    const [isGraphVisible, setIsGraphVisible] = useState(false);
    return (

        <div className="mb-6">
            <button
                onClick={() => setIsGraphVisible(!isGraphVisible)}
                className="w-full bg-white dark:bg-gray-800 rounded-lg shadow p-2 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
                <span className="font-bold dark:text-white flex items-center gap-2">
                    {isGraphVisible ? '▼' : '▶'}
                    How To Use
                </span>
            </button>

            {/* グラフ本体 - アニメーション付きの展開/収納 */}
            <div
                className={`transform transition-all duration-300 ease-in-out overflow-hidden ${isGraphVisible ? 'max-h-[400px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}
            >
                <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h3 className="font-bold text-lg mb-2 text-left">＜使い方＞</h3>
                    <p className="mb-4 text-left">
                        ツイートが検索除外されているかどうか確認できます
                    </p>
                    <p className="mb-4 text-left">
                        ※https://x.com/〇〇/status/XXXXX/photo/1 みたいなURLでもチェックできます
                    </p>
                    <div>
                        <p className="mb-2 text-left">※以下のツイートは判定できず検索除外と判定されます：</p>
                        <ul className="list-disc pl-6 space-y-2 text-left">
                            <li>センシティブラベル、暴力、ヌードのラベルを張ったツイート</li>
                            <li>鍵垢によるツイート</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};