const router = require("express").Router();

// bring in models and controllers
const createPost = require("../../controllers/post/createPost");
const getPosts = require("../../controllers/post/getPosts");
const getFeed = require("../../controllers/post/getFeed");
const getPost = require("../../controllers/post/getPostfans");
const getReportedPost = require("../../controllers/post/getReportedPost");
const createReport = require("../../controllers/post/createReport");
const getBookMarkedPosts = require("../../controllers/post/bookmarkedPosts");
const getComments = require("../../controllers/post/getComments");
const updatePost = require("../../controllers/post/updatePost");
const deletePost = require("../../controllers/post/deletePost");
const deletePostByAdmain = require("../../controllers/post/deletePostByAdmin");
const rePost = require("../../controllers/post/rePost");
const postLike = require("../../controllers/post/postLike");
const postDisLike = require("../../controllers/post/postDisLike");
const deleteComment = require("../../controllers/post/deleteComment");
const postComment = require("../../controllers/post/postComment");
const updateComment = require("../../controllers/post/updateComment");
const addBookmark = require("../../controllers/post/addBookmark");
const removeBookmark = require("../../controllers/post/removeBookmark");
const purchasePost = require("../../controllers/post/purchasePost");
const getHighlights = require("../../controllers/post/getHighlights");
const getRePosts = require("../../controllers/post/getRePosts");
const addToHighlights = require("../../controllers/post/addToHighlights");
const removeFromHighlights = require("../../controllers/post/removeFromHighlights");
const getStats = require("../../controllers/post/stats/getStats");
const postShare = require("../../controllers/post/PostShare");
const postView = require("../../controllers/post/postView");
const getAllReportPost = require("../../controllers/post/getAllReportedPosts");
const CheckPosts = require("../../controllers/post/checkpost");
const restorePost = require("../../controllers/admin/restorePost");
const getSingleReports = require("../../controllers/post/getSingleReportedPost");
const syncViewCount = require("../../controllers/post/helper/syncPostViewCount");
// const searchFilter = require("../../controllers/post/searchPostAndTags");

// Get all posts
router.get("/", getPosts);

// get bookMarkedPosts ,
router.get("/bookmark", getBookMarkedPosts);

// get highlights
router.get("/highlights", getHighlights);

// get highlights
router.post("/:id/highlights", addToHighlights);

// post rePost
router.post("/:id/rePost", rePost);

// post rePort
router.post("/:id/report", createReport);

// get reported Post
router.get("/reported", getReportedPost);

// get Repost
router.get("/rePosts", getRePosts);

// get highlights
router.delete("/:id/highlights", removeFromHighlights);

// get Post and comments , a particular post with comments
router.get("/:id", getPost);

// get comments , a particular post with comments
router.get("/:id/comments", getComments);

// router.get("/search/filter", searchFilter);

// register a user
router.post("/create", createPost);

// post comment
router.post("/:id/comment", postComment);

// post like
router.post("/:id/like", postLike);

// delete like
router.delete("/:id/dislike", postDisLike);

// delete post
router.delete("/:id", deletePost);

// delete comment on post
router.delete("/comment/:commentId", deleteComment);

// update post
router.put("/:id", updatePost);

// update post comment , a particular comment on post
router.put("/comment/:commentId", updateComment);

// bookmark a post
router.post("/:id/bookmark", addBookmark);

// remove a post bookmark
router.delete("/:id/addPostInFolder", removeBookmark);

// purchase a post
router.post("/:id/purchase", purchasePost, getPost);

// get post stats
router.get("/:id/stats", getStats);

// get feed
router.post("/feed", getFeed);

// is post share
router.post("/share/:id", postShare);

router.get("/all/reported", getAllReportPost);

router.post("/view/:id", postView);

// check today's post
router.get("/check/todayPost", CheckPosts);

// delete reported posts by admin
router.delete("/del/:id", deletePostByAdmain);

router.post("/restore/reported/:id", restorePost);

router.post("/sync-view-count", syncViewCount);

// get single Reported post
router.get("/reportedPost/:id", getSingleReports);

module.exports = router;
