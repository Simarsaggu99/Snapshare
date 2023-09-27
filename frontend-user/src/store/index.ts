import { atom } from "jotai";

export const firstNav = atom<String>("timeline");

export const rightSideBar = atom<boolean>(false);
export const isLoginModal = atom<boolean>(false);
export const isAddPostModal = atom<boolean>(false);
export const isUserDetailsModel = atom<boolean>(false);
export const loggedInUser = atom<any>({});
export const allPosts = atom<any>({});
export const ImageModal = atom<any>({});
export const socket = atom<any>(null);
export const globalSearch = atom<string>("");
export const isGlobalSearchOpen = atom<boolean>(false);
export const isSearchBar = atom<boolean>(false);
export const currentUserDataState = atom<any>({});
export const tagSearchLoading = atom<any>(false);
export const postType = atom<string>("");
export const notificationCount = atom<number>(0);
export const conversationCount = atom<number>(0);
export const conversation_Id = atom<any>("");
export const allPostsData = atom<any[]>([]);
export const postStartIndex = atom<number>(0);
export const postCurrentPage = atom<number>(0);
export const SearchBarOpen = atom<boolean>(false);
export const totalPostCounts = atom<number>(0);
export const isFirstPostIndex = atom(true);
export const addedPost = atom<any>([]);
