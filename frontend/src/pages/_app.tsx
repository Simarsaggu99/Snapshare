import { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "@/styles/globals.css";
// !STARTERCONF This is for demo purposes, remove @/styles/colors.css import immediately
import "@/styles/colors.css";
import Layout from "@/components/layout/Layout";
import { useAtom } from "jotai";
import {
  conversation_Id,
  conversationCount,
  loggedInUser,
  notificationCount,
  postType,
  socket,
} from "@/store";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { currentUser as getCurrentUser } from "@/services/user/index";
import { useRouter } from "next/router";
// import GoogleAnalytics from "@/components/GoogleAnalytics";
import * as gtag from "@/components/lib/gtag";
import Seo from "@/components/Seo";

/**
 * !STARTERCONF info
 * ? `Layout` component is called in every page using `np` snippets. If you have consistent layout across all page, you can add it here too
 */
export const queryClient = new QueryClient();

export default function MyApp({ Component, pageProps }: AppProps) {
  const screenWidth = typeof window !== "undefined" ? window.screen.width : 768;
  const router = useRouter();
  const [currentUser, setCurrentUser] = useAtom(loggedInUser);
  const [socketIO, setSocketIO] = useAtom(socket);
  const [postTypes, setPostTypes] = useAtom(postType);
  const [notificationsCounts, setNotificationsCounts] =
    useAtom(notificationCount);
  const [__, setConversationCounts] = useAtom(conversationCount);
  const [isLoading, setIsloading] = useState(false);
  useEffect(() => {
    if (
      router.asPath === "/" ||
      router.asPath.includes("/profile") ||
      router.asPath.includes("/open-post")
    ) {
      const handleStart = (url: any) => {
        url !== router.asPath && setIsloading(true);
      };
      const handleComplete = (url: any) => {
        url === router.asPath && setIsloading(false);
      };

      router.events.on("routeChangeStart", handleStart);
      router.events.on("routeChangeError", handleComplete);
      router.events.on("routeChangeComplete", handleComplete);
      return () => {
        router.events.off("routeChangeStart", handleStart);
        router.events.off("routeChangeError", handleComplete);
        router.events.off("routeChangeComplete", handleComplete);
      };
    }
  }, [router.asPath]);
  const notifySuccess = (message: any) => {
    toast(<p style={{ fontSize: 16 }}>{message?.message}</p>, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      rtl: false,
      pauseOnFocusLoss: true,
      draggable: true,
      pauseOnHover: true,
      type: "success",
    });
  };
  const notifyWarning = (message: any) => {
    toast(<p style={{ fontSize: 16 }}>{message?.message}</p>, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      rtl: false,
      pauseOnFocusLoss: true,
      draggable: true,
      pauseOnHover: true,
      type: "warning",
    });
  };

  useEffect(() => {
    if (socketIO) {
      socketIO.on("new-notification", (data: any) => {
        if (
          data?.verb === "report-post" ||
          data?.message?.includes("Your transaction has been rejected")
        ) {
          notifyWarning(data);
        } else if (data?.verb === "new-message") {
          getCurrentUser().then((res: any) => {
            if (
              typeof window !== "undefined" &&
              window?.location?.pathname?.includes("/messages")
            ) {
              if (
                typeof window !== "undefined" &&
                window?.location?.pathname?.split("/")[2]?.trim() !=
                  data?.conversationId
              ) {
                notifySuccess(data);
                setConversationCounts(res?.data?.unreadConversationsCount);
                setNotificationsCounts(res?.data?.notificationCount);
              }
            } else {
              notifySuccess(data);
              setConversationCounts(res?.data?.unreadConversationsCount);
              setNotificationsCounts(res?.data?.notificationCount);
            }
            // }, 500);
          });
        } else {
          notifySuccess(data);
        }
        if (data?.verb !== "new-message") {
          getCurrentUser().then((res: any) => {
            setNotificationsCounts(res?.data?.notificationCount);
          });
        }
      });
      socketIO.on("new-warning", (data: any) => {
        notifyWarning(data);
        getCurrentUser().then((res: any) => {
          setNotificationsCounts(res?.data?.notificationCount);
        });
      });
    }
  }, [socketIO, currentUser?.data]);

  useEffect(() => {
    let socket: any, handleConnect: any;

    if (currentUser?.data?._id && typeof window !== "undefined") {
      let hostUrl = "";
      if (process.browser) {
        switch (window.location.hostname) {
          case "localhost": // dev
            hostUrl = "http://localhost:5000";
            break;
          default:
            hostUrl = "http://localhost:5000";
            break;
        }
      }
      socket = io("http://localhost:5000");

      handleConnect = () => {
        socket.emit("join", currentUser?.data?._id);
        setSocketIO(socket);
      };
      socket.on("connect", handleConnect);
    }
    return () => {
      if (socket) {
        socket.off("connect", handleConnect);
        socket.disconnect();
      }
    };
  }, [currentUser, currentUser?.data?._id]);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const popularStoreType = window.localStorage.getItem("postTypes");
      if (popularStoreType) {
        setPostTypes(popularStoreType);
      } else {
        setPostTypes("popular");
      }
    }
  }, []);

  // const onNewConversationMessage = (data: any) => {

  //   if (data?.conversation?.id !== currentUser?.data?._id) {
  //     setCurrentUser({
  //       data: {
  //         ...currentUser?.data,
  //         messageCount: currentUser?.data?.messageCount + 1,
  //       },
  //     });
  //   }
  // };
  // useEffect(() => {
  //   let interval: any = null;
  //   if (currentUser) {
  //     if (socketIO) {
  //       interval = setInterval(() => {
  //         socketIO.emit("heartbeat", {
  //           userId: currentUser?.data?._id,
  //         });
  //       }, 5000);
  //     }
  //   }
  //   return () => {
  //     if (interval) {
  //       clearInterval(interval);
  //     }
  //   };
  // }, [socketIO]);

  useEffect(() => {
    let interval: any;
    if (currentUser) {
      if (socketIO) {
        interval = setInterval(() => {
          socketIO.emit("heartbeat", {
            userId: currentUser?.data?._id,
          });
        }, 10000);
      }
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [socketIO]);
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      gtag.pageview(url);
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <div>
      <Seo />
      <QueryClientProvider client={queryClient}>
        <Layout>
          {/* <GoogleAnalytics /> */}
          <Component {...pageProps} />
        </Layout>
        <ToastContainer />
      </QueryClientProvider>
    </div>
  );
}
