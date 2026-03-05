"use client";
import { useState } from "react";
import useSWR from "swr";
import axios from "axios";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export function useStatistics() {
  const [period, setPeriod] = useState("week"); // week, month, year
  const [view, setView] = useState("quantity"); // quantity, rate

  const { data, isLoading } = useSWR(
    `/api/statistics/todo?type=${period}`,
    fetcher,
  );

  return { period, setPeriod, view, setView, data, isLoading };
}
