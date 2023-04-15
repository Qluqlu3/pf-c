import axios from 'axios';
import { PopulationType } from 'util/Types';

interface GetPrefecturesRequest {
  prefId: number;
}

const APP_URL = process.env.REACT_APP_API_URL;
const API_KEY = process.env.REACT_APP_API_KEY;

export const prefectureService = () => ({
  /* 都道府県を取得 */
  GetPrefectures: async () => {
    try {
      const response = await axios.get(`${APP_URL}/api/v1/prefectures`, {
        headers: { 'X-API-KEY': API_KEY },
      });
      return response.data.result;
    } catch (error) {
      console.error('Error fetching prefecture data:', error);
    }
  },

  /* 人口を取得 */
  GetPopulation: async (request: GetPrefecturesRequest) => {
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
      const formattedData = response.data.result.data[0].data.map((item: PopulationType) => ({
        year: item.year,
        [`value_${prefId}`]: item.value,
      }));
      return formattedData;
    } catch (error) {
      console.error('Error fetching population data:', error);
    }
  },
});
