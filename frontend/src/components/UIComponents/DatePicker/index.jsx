import dayjs from "dayjs";
import React, { useState } from "react";
const CustomDatepicker = () => {
  const [dropDown, setDropDown] = useState(false);
  const [selectedDate, setSelectedDate] = useState({
    day: "",
    date: "",
    year: "",
  });
  const months = [
    {
      id: "January",
      val: "January",
    },
    {
      id: "February",
      val: "February",
    },
    {
      id: "March",
      val: "March",
    },
    {
      id: "April",
      val: "April",
    },
    {
      id: "May",
      val: "May",
    },
    {
      id: "June",
      val: "June",
    },
    {
      id: "July",
      val: "July",
    },
    {
      id: "August",
      val: "August",
    },
    {
      id: "September",
      val: "September",
    },
    {
      id: "October",
      val: "October",
    },
    {
      id: "November",
      val: "November",
    },
    {
      id: "December",
      val: "December",
    },
  ];
  var startYear = 1995;
  var endYear = dayjs(Date()).format("YYYY");

  var yearsList = [];

  for (var year = startYear; year <= endYear; year++) {
    yearsList.push(year);
  }
  var dates = [];

  const isLeapYear = (year) => {
    if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
      return true;
    } else {
      return false;
    }
  };
  const checkMonthlyDates = () => {
    var monthlyDate = 31;
    if (selectedDate?.month === 2) {
      if (isLeapYear(selectedDate?.year)) {
        return 29;
      } else {
        return (monthlyDate = 28);
      }
    } else if (selectedDate?.month % 2 === 0) {
      return (monthlyDate = 30);
    } else {
      return (monthlyDate = 31);
    }
  };

  // if(selectedDate?.month % 2 === 0){
  //   return 30;
  // }
  for (var date = 1; date <= checkMonthlyDates(); date++) {
    dates.push(date);
  }
  const presentDate = dayjs(Date()).format("DD/MM/YYYY");
  return (
    <div className=" relative bg-gray-200">
      <div
        className="mx-auto mt-8 flex h-12  w-full cursor-pointer items-center rounded-lg border bg-white text-lg "
        onClick={() => {
          !dropDown ? setDropDown("year") : setDropDown(false);
        }}
      >
        {selectedDate?.date
          ? selectedDate?.date +
            "/" +
            selectedDate?.month +
            "/" +
            selectedDate?.year
          : presentDate}
      </div>
      {dropDown === "year" && (
        <div className="container absolute top-0 left-0 mx-auto h-48 cursor-pointer overflow-y-scroll">
          {yearsList.map((val) => (
            <div
              key={val}
              onClick={() => {
                setSelectedDate({ ...selectedDate, year: val });
                setDropDown("month");
              }}
              className="border-b p-1 text-lg text-black last:border-none"
            >
              {val}
            </div>
          ))}
        </div>
      )}
      {dropDown === "month" && (
        <div className="container absolute top-0 mx-auto h-48 cursor-pointer overflow-y-scroll">
          {months.map((e, idx) => (
            <div
              key={e?.id}
              onClick={() => {
                setSelectedDate({
                  ...selectedDate,
                  month: idx + 1,
                  monthI: e?.val,
                });
                setDropDown("date");
              }}
              className="border-b p-1 text-lg text-black  last:border-none"
            >
              {e?.val}
            </div>
          ))}
        </div>
      )}
      {dropDown === "date" && (
        <div className=" mt- top-8 left-1 flex w-full cursor-pointer     justify-start rounded-lg bg-gray-100">
          {/* <div className="flex flex-col"> */}
          {/* <div className="title mx-auto w-min rounded-xl bg-white px-4 py-1 text-2xl">
              {selectedDate?.monthI}
            </div> */}
          <div className="dates mx-auto h-48  w-full  overflow-y-scroll p-2">
            {dates?.map((e) => (
              <div
                key={e}
                className="mx-auto w-full hover:rounded-lg hover:bg-white hover:text-orange-500 "
                onClick={() => {
                  setSelectedDate({ ...selectedDate, date: e });
                  setDropDown(false);
                }}
              >
                {e}
              </div>
            ))}
          </div>
          {/* <div className="dates mx-auto grid w-48 grid-cols-7 ">
              {dates?.map((e) => (
                <div
                  key={e}
                  className="mx-auto hover:rounded-lg hover:bg-white hover:text-orange-500 "
                  onClick={() => {
                    setSelectedDate({ ...selectedDate, date: e });
                    setDropDown(false);
                  }}
                >
                  {e}
                </div>
              ))}
            </div> */}
          {/* </div> */}
        </div>
      )}
      {/* <div>
        {selectedDate?.year}
        {selectedDate?.month}

        {selectedDate?.date}
      </div> */}
    </div>
  );
};

export default CustomDatepicker;
