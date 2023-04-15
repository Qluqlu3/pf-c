import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import throttle from 'lodash/throttle';
import { Color } from './util/Color';
import { PrefectureType, PrefDate } from 'util/Types';
import { Checkbox } from 'components/Checkbox';
import { prefectureService } from 'api/prefectureService';

const Main = styled.main`
  max-width: 100vw;
  height: 100%;
  padding: 40px;
  background: ${Color.gray100};
`;

const CheckboxWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
`;

const LineChartWrapper = styled.div`
  max-width: 90%;
  height: 300px;
  margin-top: 32px;
`;

export const App: React.FC = () => {
  const [prefectures, setPrefectures] = useState<PrefectureType[]>([]);
  const [selectedPrefData, setSelectedPrefData] = useState<PrefDate[]>([]);
  const [width, setWidth] = useState(window.innerWidth);

  const mainRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchPrefectures = async () => {
      const response = await prefectureService().GetPrefectures();
      setPrefectures(response);
    };

    fetchPrefectures();
  }, []);

  useEffect(() => {
    const handleResize = throttle(() => {
      if (mainRef.current) setWidth(mainRef.current.getBoundingClientRect().width);
    }, 100);

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [prefectures, width]);

  const onClickCheckbox = useCallback(
    async (prefId: number) => {
      if (selectedPrefData.some((pref) => pref.id === prefId)) {
        setSelectedPrefData(selectedPrefData.filter((pref) => pref.id !== prefId));
        return;
      }
      const response = await prefectureService().GetPopulation({ prefId });

      setSelectedPrefData([...selectedPrefData, { id: prefId, data: response }]);
    },
    [selectedPrefData]
  );

  return (
    <Main ref={mainRef}>
      <h1>都道府県別人口グラフ</h1>
      <CheckboxWrapper>
        {prefectures.map((prefecture) => (
          <Checkbox
            key={prefecture.prefCode}
            label={prefecture.prefName}
            checked={selectedPrefData.some((selectedPref) => selectedPref.id === prefecture.prefCode)}
            fill={Color.prefecture[prefecture.prefCode - 1]}
            onClickCheckbox={() => onClickCheckbox(prefecture.prefCode)}
          />
        ))}
      </CheckboxWrapper>
      <LineChartWrapper>
        <LineChart width={width - 100} height={400} data={selectedPrefData}>
          <XAxis label={{ value: '年度', position: 'insideBottomRight' }} dataKey='year' stroke={Color.gray800} type='number' domain={[1990, 2045]} height={50} />
          <YAxis label={{ value: '人口(人)', angle: -90, position: 'insideLeft' }} type='number' domain={[10000, 1000000]} stroke={Color.gray800} width={100} />
          <CartesianGrid strokeDasharray='3 3' />
          <Tooltip />
          <Legend />
          {selectedPrefData.map((pref) => (
            <Line
              key={pref.id}
              type='monotone'
              name={prefectures[pref.id - 1].prefName}
              data={pref.data}
              dataKey={`value_${pref.id}`}
              stroke={Color.prefecture[pref.id - 1]}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      </LineChartWrapper>
    </Main>
  );
};
