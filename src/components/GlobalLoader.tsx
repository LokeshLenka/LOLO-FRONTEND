import React, { useEffect, useRef } from "react";
import LoadingBar, { type LoadingBarRef } from "react-top-loading-bar";
import { useLocation } from "react-router-dom";
import axios from "axios";

export default function GlobalLoader() {
  const ref = useRef<LoadingBarRef>(null);
  const location = useLocation();

  // 1. Trigger on Route Changes
  useEffect(() => {
    ref.current?.continuousStart();
    // A slightly shorter timeout feels snappier
    const timer = setTimeout(() => {
      ref.current?.complete();
    }, 300);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // 2. Trigger on Axios Requests
  useEffect(() => {
    const reqInterceptor = axios.interceptors.request.use(
      (config) => {
        ref.current?.continuousStart();
        return config;
      },
      (error) => {
        ref.current?.complete();
        return Promise.reject(error);
      }
    );

    const resInterceptor = axios.interceptors.response.use(
      (response) => {
        ref.current?.complete();
        return response;
      },
      (error) => {
        ref.current?.complete();
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(reqInterceptor);
      axios.interceptors.response.eject(resInterceptor);
    };
  }, []);

  return (
    <LoadingBar
      // Brand Cyan Color
      color="#03a1b0"
      ref={ref}
      // Slightly thicker for better visibility on high-res screens
      height={3}
      // Custom Shadow for the "Liquid/Neon" Glow effect
      // This creates a cyan glow below the bar
      shadow={true}
      style={{
        boxShadow: "0 0 10px #03a1b0, 0 0 5px #03a1b0",
      }}
      // Ensure z-index is higher than your sticky headers (usually z-40 or z-50)
      containerClassName="z-[99999]"
    />
  );
}
