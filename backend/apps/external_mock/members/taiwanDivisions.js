export const TAIWAN_CITIES = ['台北市','新北市','桃園市','台中市','台南市','高雄市']
export function getDistrictsByCity(city) {
  const map = {
    '台北市': ['中正區','大安區','信義區'],
    '新北市': ['板橋區','新店區','新莊區'],
    '桃園市': ['桃園區','中壢區','龜山區'],
  }
  return map[city] || []
}
