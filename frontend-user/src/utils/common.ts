import dayjs from "dayjs";

export const getInitials = (name: any) => {
  if (name) {
    let initials = name.match(/\b\w/g) || [];
    initials = (
      (initials.shift() || "") + (initials.pop() || "")
    ).toUpperCase();
    return initials;
  }
};
export const getFirstLetter = (name: any) => {
  if (name) {
    let firstLetter = name.charAt(0).toUpperCase();
    return firstLetter;
  }
};
export const getFormattedDate = (time: string) => {
  if (dayjs(time).format("DD/MM/YYYY") === dayjs().format("DD/MM/YYYY")) {
    return "Today";
  } else if (
    dayjs(time).format("DD/MM/YYYY") ===
    dayjs(time).subtract(1, "d").format("DD/MM/YYYY")
  )
    return "Yesterday";
  else return dayjs(time).format("DD/MM/YYYY");
};
export const NumberFormatter = (num: number) => {
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "k" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "B" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  const item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value;
    });
  return item
    ? (num / item.value).toFixed(0).replace(rx, "$1") + item.symbol
    : "0";
};
