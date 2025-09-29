import React from 'react';
import { Area, Column, Line } from '@ant-design/plots';

export const TimeSeriesArea = ({ data, xField = 'date', yField = 'value', seriesField, height = 260 }) => (
  <Area
    height={height}
    data={data}
    xField={xField}
    yField={yField}
    seriesField={seriesField}
    smooth
    xAxis={{ tickCount: 6 }}
    areaStyle={{ fillOpacity: 0.2 }}
  />
);

export const SimpleColumn = ({ data, xField = 'type', yField = 'value', height = 260 }) => (
  <Column height={height} data={data} xField={xField} yField={yField} label={{ position: 'middle' }} />
);

export const SimpleLine = ({ data, xField = 'date', yField = 'value', height = 260 }) => (
  <Line height={height} data={data} xField={xField} yField={yField} smooth />
);

export default { TimeSeriesArea, SimpleColumn, SimpleLine };
