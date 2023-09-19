import Image from "next/image";
import React, { useEffect, useState } from "react";
import tree from "~/images/trees.jpg";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/navigation";
import "swiper/css/scrollbar";
import "swiper/css";
import Button from "@/components/buttons/Button";
import { AddUserIcon } from "@/utils/AppIcons";
import { useFollowUser, useUnfollowUser } from "@/hooks/users/mutation";
import { useRouter } from "next/router";
import { useGetSingleUser } from "@/hooks/user/query";
import { getFirstLetter } from "@/utils/common";
import Link from "next/link";

const SuggestFollowList = ({
  getSuggestedFollowersList,
  getSingleUser,
}: any) => {
  const router = useRouter();

  const followUser = useFollowUser();
  const userId = router.query.id;
  const [suggestedUserList, setSuggestedUserList] = useState([]);
  useEffect(() => {
    if (getSuggestedFollowersList?.data?.length > 0) {
      setSuggestedUserList(getSuggestedFollowersList?.data);
    }
  }, [getSuggestedFollowersList]);

  const [isFollow, setIsFollow] = useState<string[]>([]);
  const unfollowUser = useUnfollowUser();
  

  const feedCollection = [
    { id: 0, img: tree },
    { id: 1, img: tree },
    { id: 2, img: tree },
    { id: 3, img: tree },
    { id: 4, img: tree },
    { id: 5, img: tree },
    { id: 6, img: tree },
  ];

  return (
    <div className="">

    </div>
  );
};


export default SuggestFollowList;
