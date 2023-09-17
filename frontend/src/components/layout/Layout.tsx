import { useCurrentUser } from "@/hooks/user/query";
import { loggedInUser } from "@/store";
import { useAtom } from "jotai";
import { useRouter } from "next/router";
import * as React from "react";
import LoginModal from "../loginModal";
import Header from "./Header";
import { currentUser as getCurrentUser } from "@/services/user/index";
import BottomFooter from "./BottomFooter";

export default function Layout({ children }: { children: React.ReactNode }) {
  // Put Header or Footer Here
  const router = useRouter();
  const [currentUser, setCurrentUser] = useAtom(loggedInUser);
  React.useEffect(() => {
    if (router?.query?.userId) {
      window.localStorage.setItem("reffereceId", `${router?.query?.userId}`);
      setTimeout(() => {
        router.push("/");
      }, 50);
    }
  }, [router.query]);

  return (
    <div>
      <Header />
      <div className="">{children}</div>
      <LoginModal />
      {/* {currentUser?.data?._id && (
        <div className="h-10 lg:h-0">
          <BottomFooter />
        </div>
      )} */}
    </div>
  );
}
