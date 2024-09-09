"use client";

import { useEffect, useRef } from "react";
import LoadingBar, { LoadingBarRef } from "react-top-loading-bar";
import { useAppSelector } from "@/store/hooks";
import { LOADING_STATES, selectLoadingStatus } from "@/store/LoadingSlice";
import { usePathname } from "next/navigation";

const Loader = () => {
  const pathname = usePathname();
  const loadingRef = useRef<LoadingBarRef>(null);

  const status = useAppSelector(selectLoadingStatus);

  useEffect(() => {
    if (status === LOADING_STATES.LOADING) {
      loadingRef.current?.continuousStart();
    } else {
      loadingRef.current?.complete();
    }
  }, [status]);

  useEffect(() => {
    loadingRef.current?.complete();
  }, [pathname]);

  return <LoadingBar ref={loadingRef} />;
};

export default Loader;
