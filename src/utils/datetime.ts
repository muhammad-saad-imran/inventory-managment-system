import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

type DateInput = {
  date?: dayjs.ConfigType;
  inputDate?: string;
  outputDate: string;
};

export const formatDate = ({ date, inputDate, outputDate }: DateInput) => {
  return dayjs(date, inputDate).format(outputDate);
};

export const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
