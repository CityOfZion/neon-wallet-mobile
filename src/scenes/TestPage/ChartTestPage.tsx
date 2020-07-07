import React from 'react'
import {LineChart} from 'react-native-chart-kit'
import styled from 'styled-components/native'
import {color, ColorProps} from 'styled-system'

import {Facade} from '~src/app/Facade'

export default function ChartTestPage() {
  const mockData = [null, Array(30)].map((x) => Math.random() * 100)

  return (
    <ChartView bg="background.0">
      <LineChart
        data={{
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [
            {
              data: mockData,
            },
          ],
        }}
        width={Facade.app.windowWidth - 16} // from react-native
        height={260}
        yAxisSuffix={' GAS'}
        chartConfig={{
          backgroundColor: '#fff',
          backgroundGradientFrom: '#111',
          backgroundGradientTo: 'rgba(230, 230, 230, 0.28)',
          decimalPlaces: 1, // optional, defaults to 2dp
          strokeWidth: 4,
          fillShadowGradientOpacity: 0.2,
          color: (opacity = 255) => `rgba(63, 208, 174, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(123, 208, 124, ${opacity})`,
          propsForDots: {
            r: '4',
            strokeWidth: '1',
            stroke: '#394152',
          },
          style: {
            borderRadius: 16,
          },
        }}
        bezier
        style={{
          marginVertical: 8,
          paddingHorizontal: 32,
          borderRadius: 16,
        }}
      />
    </ChartView>
  )
}

const ChartView = styled.View<ColorProps>`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  ${color}
`
