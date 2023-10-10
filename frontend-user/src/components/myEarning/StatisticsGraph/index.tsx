import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";

export function StatisticsGraph({ getEarningStatics, statisticsTabs }: any) {
  const [graphData, setGraphData] = useState<any[]>([[]]);
  const [optionValues, setOptionValues] = useState<number[]>([0]);
  let optionNumber = 10;
  useEffect(() => {
    let number = 0;
    let optionVal = [];
    for (let i = 0; i <= optionNumber; i++) {
      optionVal.push(number);
      number = number + 10;
    }
    setOptionValues(optionVal);
    return () => {
      setOptionValues([]);
    };
  }, []);

  const options: any = {
    hAxis: {
      title: "Date",
    },
    vAxis: {
      title: "No.s",
      
    },
    

    series: {
      curveType: "function",
    },
    legend: "none",
  };

  const barOptions = {
    title: "Today's total popularity ",
    chartArea: { width: "50%" },
    isStacked: true,
    hAxis: {
      title: "Today",
      minValue: 0,
    },
    bar: { groupWidth: "15%" },
    vAxis: {
      title: "Popularity",
    },
  };

  useEffect(() => {
    let newData;
    let barData;
    if (statisticsTabs !== "") {
      newData = getEarningStatics?.data?.data?.map((item: any) => {
        return [
          item?.date,
          item?.likes,
          item?.views,
          
          item?.follows,
          item?.totalInvite,
          
        ];
      });
    } else {
      setGraphData(
        getEarningStatics?.data?.data?.map((item: any) => {
          return [
            ["Date", "Like", "View", "Follower", "Invite"],
            [
              item?.date,
              item?.likes,
              item?.views,
              item?.follows,
              item?.totalInvite,
            ],
          ];
        })?.[0]
      );
    }
    if (newData) {
      setGraphData(newData);
    }

    return () => {};
  }, [getEarningStatics, statisticsTabs]);
  return (
    <div>
      {graphData?.length ? (
        <div>
          {statisticsTabs !== "" ? (
            <Chart
              chartType="LineChart"
              width="100%"
              height="400px"
              data={[
                [
                  "date",
                  "Like",
                  "View",
                  "follows",
                  "invite",
                 
                ],
                ...graphData,
              ]}
              options={options}
            />
          ) : (
            <Chart
              chartType="ColumnChart"
              width="100%"
              height="400px"
              data={graphData}
              options={barOptions}
            />
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center text-xl text-primary-600">
          No record found yet!
        </div>
      )}
    </div>
  );
}
