import React from 'react';
import { VictoryPie, VictoryAnimation, VictoryLabel } from 'victory';

const CircularProgressBar = ({ steps }) => {
  const goalSteps = 1000;

  const calculatePercentage = () => {
    return (steps / goalSteps) * 100;
  };

  const percentage = calculatePercentage();

  return (
    <div>
      <svg viewBox="0 0 300 300">
        <VictoryPie
          standalone={false}
          width={280}
          height={280}
          data={[
            { x: 1, y: percentage },
            { x: 2, y: 100 - percentage },
          ]}
          innerRadius={120}
          cornerRadius={0}
          labels={() => null}
          animate={{ duration: 1000 }}
          style={{
            data: {
              fill: ({ datum }) => {
                const color = datum.x === 1 ? '#ffe98a' : '#fff';
                return datum.y === 0 ? 'transparent' : color;
              },
            },
          }}
        />
        <VictoryAnimation duration={1000} data={{ percentage }}>
          {(newProps) => (
            <VictoryLabel className='VICTORY_LABEL'
              textAnchor="middle"
              verticalAnchor="middle"
              x={150}
              y={150}
              text={`${Math.round(newProps.percentage)}%`}
              style={{
                fontSize: 50,
                fontWeight: 'bold',
                fill: 'white',
              }}
            />
          )}
        </VictoryAnimation>
      </svg>
    </div>
  );
};

export default CircularProgressBar;
