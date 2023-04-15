import axios from 'axios';
import { PopulationType, PrefData, PrefectureType } from 'util/Types';

interface GetPrefecturesRequest {
  prefId: number;
}

type GetPrefecturesResponse = PrefectureType[];

type GetPopulationResponse = PrefData['data'];

const APP_URL = process.env.REACT_APP_API_URL;
const API_KEY = process.env.REACT_APP_API_KEY;

export const prefectureService = () => ({
  /* 都道府県を取得 */
  GetPrefectures: async (): Promise<GetPrefecturesResponse | null> => {
    try {
      const response = await axios.get(`${APP_URL}/api/v1/prefectures`, {
        headers: { 'X-API-KEY': API_KEY },
      });
      return response.data.result;
    } catch (error) {
      console.error('Error fetching prefecture data:', error);
      return null;
    }
  },

  /* 人口を取得 */
  GetPopulation: async (request: GetPrefecturesRequest): Promise<GetPopulationResponse | null> => {
    const { prefId } = request;
    try {
      const response = await axios.get(`${APP_URL}/api/v1/population/composition/perYear`, {
        params: {
          prefCode: prefId,
          cityCode: '-',
        },
        headers: {
          'X-API-KEY': API_KEY,
        },
      });
      const formattedData: PrefData['data'] = response.data.result.data[0].data.map((item: PopulationType) => ({
        year: item.year,
        [`value_${prefId}`]: item.value,
      }));
      return formattedData;
    } catch (error) {
      console.error('Error fetching population data:', error);
      return null;
    }
  },
});
