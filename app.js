'use strict';
const fs = require('fs'); // ファイルを扱うためのモジュール
const readline = require('readline'); // 1行ずつ読み込む
const rs = fs.createReadStream('./popu-pref.csv'); // Streamを生成
// Streamをreadlineオブジェクトのinputとして設定
const rl = readline.createInterface({ input: rs });
// key: 都道府県 value: 集計データのオブジェクト
const prefectureDataMap= new Map();
rl.on('line', lineString => {
  const columns = lineString.split(','); // 文字列
  const year = parseInt(columns[0]); // 年を整数値に変換する
  const prefecture = columns[1];
  const popu = parseInt(columns[3]); // 人口を整数値に変換する
  if (year === 2010 || year === 2015) {
    let value = null;
    if (prefectureDataMap.has(prefecture)) {
      value = prefectureDataMap.get(prefecture);
    } else {
      value = {
        popu10: 0,
        popu15: 0,
        change:null
      };
    }
    if (year === 2010) {
      value.popu10 = popu;
    }
    if (year === 2015) {
      value.popu15 = popu;
    }
    prefectureDataMap.set(prefecture,value);
  }
});
rl.on('close', () => {
  for (const [key, value] of prefectureDataMap) {
    value.change = value.popu15 / value.popu10;
  }
  const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) => {
    return pair2[1].change - pair1[1].change;
  });
  const rankingStrings = rankingArray.map(([key, value]) => {
    return `${key}: ${value.popu10}=>${value.popu15} 変化率: ${value.change}`;
  });
  console.log(rankingStrings);
});