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
      // ticks: optionValues?.map((item) => {
      //   return { v: item, f: `${item}` };
      // }),
    },
    // tooltip: { isHtml: true, trigger: "visible" },

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
          // item?.shares,
          item?.follows,
          item?.totalInvite,
          // `
          // <div class='text-center border-b px-1'>${item?.date}</div>
          // <div class="flex gap-2 px-3 pt-1">
          // <p class="mt-1 h-4 w-4 rounded bg-[#157EE0]"> </p>
          // <p>Likes${item?.likes}</p>
          // </div>
          // <div class="flex gap-2 px-3">
          // <p class="mt-1 h-4 w-4 rounded bg-[#04B100]"> </p>
          // <p>Share${item?.shares}</p>
          // </div>
          // <div class="flex gap-2 px-3">
          // <p class="mt-1 h-4 w-4 rounded bg-[#ff9900]"> </p>
          // <p>Followers${item?.follows}</p>
          // </div>
          // <div class="flex gap-2 px-3 pb-2">
          // <p class="mt-1 h-4 w-4 rounded bg-[#E80000]"> </p>
          // <p>View${item?.views}</p>
          // </div>`,
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
                  // { role: "tooltip", type: "string", p: { html: true } },
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
