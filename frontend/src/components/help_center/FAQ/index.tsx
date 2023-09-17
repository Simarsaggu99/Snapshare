import Link from "next/link";
import React from "react";

const FAQ = () => {
  return (
    <div>
      <div className="">
        <div className="mb-8 text-center  text-2xl font-semibold text-gray-800 xs:text-3xl">
          Frequently Asked Questions
        </div>
        <div className="space-y-7 ">
          <h4 className=" start flex p-2 text-[#2D2525]">What is Snapshare?</h4>
          <p className="px-3 text-left text-[#858585]">
          Snapshare is a platform, exclusively designed for people who love to
            create, watch and share memes with their friends. The aim is to
            create the largest directory of memes and gifs on the internet. Not
            only this, people can also earn handsome rewards by publishing
            content and participating in several activities. Yes, we reward you
            on the basis of your performance.{" "}
          </p>
          <h4 className=" start flex p-2 text-[#2D2525]">
            How do I earn money with Snapshare?
          </h4>
          <p className="px-3 text-left text-[#858585]"></p>
          <p className="px-3 text-left text-[#858585]">
            When you participate by sharing posts, inviting friends and
            completing bounty tasks, you are rewarded with Meme Coins. Later you
            can redeem Meme Coins in exchange for money.
          </p>
          <h4 className=" start flex p-2 text-[#2D2525]">
            What are MemeCoins?
          </h4>
          <p className="px-3 text-left text-[#858585]">
            Meme Coin i.e. MC is a virtual currency of our platform which
            enables you to buy items in our Marketplace or exchange for cash.
          </p>
          <h4 className=" start flex p-2 text-[#2D2525]">
            How can I Earn MemeCoins?
          </h4>
          <p className="px-3 text-left text-[#858585]">
            You can earn Meme Coins by publishing content on our platform. Every
            time someone views or likes your posts, you will be rewarded with
            the Meme Coins. You can also earn Meme Coins by completing bonus
            tasks like inviting friends etc on the{" "}
            <Link href={"/bounty"}>
              <span className="cursor-pointer text-blue-500 underline">
                bounty page
              </span>
            </Link>
          </p>
          <h4 className=" start flex p-2 text-[#2D2525]">
            Where is my MemeCoin balance displayed?
          </h4>
          <p className="px-3 text-left text-[#858585]">
            When you click on the main menu(top right corner), you will find “My
            Earnings” where your total balance is displayed. You can click on My
            Earning to see stats and details about your earning and expenditure.
          </p>
          <h4 className=" start flex p-2 text-[#2D2525]">
            Where can I spend MemeCoins?
          </h4>
          <p className="px-3 text-left text-[#858585]">
            You can spend your Meme Coins in our exclusive Marketplace, or if
            you wish to exchange them for money, that is also possible. You just
            need to provide your account details, and the value in exchange of
            redeemed coins will be added to your account directly. Rest assured
            that the information you provide is safe with us.
          </p>
          <h4 className=" start flex p-2 text-[#2D2525]">
            When will the Marketplace unlock?
          </h4>
          <p className="px-3 text-left text-[#858585]">
            Once you have 100 followers and 2500 overall views on your posts,
            you will reach crux 6, which will unlock the Marketplace.
          </p>
          <h4 className=" start flex p-2 text-[#2D2525]">
            How do I earn from Bounty Programs?
          </h4>
          <p className="px-3 text-left text-[#858585]">
            There is a bounty page on the main menu. You will find several tasks
            there which you can perform and earn bounty. However, Android and
            iOs apps have more bounty programs than on the website.
          </p>
          <h4 className=" start flex p-2 text-[#2D2525]">
            Where can I view my previous transactions?
          </h4>
          <p className="px-3 text-left text-[#858585]">
            You will find your last 2 transactions on the earnings page, and if
            you need to check all transactions, click on show more button, right
            below the transactions.
          </p>
          <h4 className=" start flex p-2 text-[#2D2525]">
            Where do I check my order status?
          </h4>
          <p className="px-3 text-left text-[#858585]">
            Your order status is visible in the transaction detail.
          </p>
          <h4 className=" start flex p-2 text-[#2D2525]">
            Can I transfer Meme Coins to another account?
          </h4>
          <p className="px-3 text-left text-[#858585]">
            No, you can&apos;t share your coins with other users.
          </p>
          <h4 className=" start flex p-2 text-[#2D2525]">
            What is the eligibility criteria for redeeming Meme Coins?
          </h4>
          <p className="px-3 text-left text-[#858585]">
            To ensure that you&apos;re serious about participating and working
            with all your heart, we&apos;ve a little eligibility criteria.
          </p>
          <p className="px-3 text-left text-[#858585]">
            You need to have at least 500 followers to enable Redeeming options.
            Although, your balance will keep on rising with your activity..
          </p>{" "}
          <p className="px-3 text-left text-[#858585]">
            You must have published 500 posts with at least 10,000 overall
            views.
          </p>
          <p className="px-3 text-left text-[#858585]">
            Soon as you reach Crux 11, the redeeming option will be opened for
            you.
          </p>
          <h4 className=" start flex p-2 text-[#2D2525]">
            How can I check my overall performance?{" "}
          </h4>
          <p className="px-3 text-left text-[#858585]">
            Go to My Earnings page from the main menu, there you’ll find useful
            stats where you can understand your overall performance.
          </p>
          <h4 className=" start flex p-2 text-[#2D2525]">
            How can I view or edit my profile?
          </h4>
          <p className="px-3 text-left text-[#858585]">
            By clicking the main menu on the top right corner, you will get to
            click on profile. There you can visit your profile, and click on the
            profile pic to upload a new pic. To edit the description, click on
            the edit button next to it. However, if you want to change your
            username, you have to go to settings and from account settings,
            you’ll be able to change the username.
          </p>
          <h4 className=" start flex p-2 text-[#2D2525]">
            How can I change the Email for my account?{" "}
          </h4>
          <p className="px-3 text-left text-[#858585]">
            To keep our platform safe from harmful activities, we only accept
            Social Logins from trusted partners. Currently it only supports
            Google as well as FB login.
          </p>
          <h4 className=" start flex p-2 text-[#2D2525]">
            How can I publish a Meme or Gif?
          </h4>
          <p className="px-3 text-left text-[#858585]">
            There is a publish button before the notification button. Once you
            click on it, you get to select a file you want to publish, alongside
            you can write its description as well as provide the Hashtags you
            want to use.
          </p>
          <h4 className=" start flex p-2 text-[#2D2525]">
            What formats are allowed to publish?{" "}
          </h4>
          <p className="px-3 text-left text-[#858585]">
            Since the platform is exclusively built for images and gifs, only 3
            formats are allowed. Png, Jpeg and Gif.
          </p>
          <h4 className=" start flex p-2 text-[#2D2525]">
            How can I like or comment on a post?
          </h4>
          <p className="px-3 text-left text-[#858585]">
            ust below the post you will find a like button and a comment section
            underneath, where you can add a comment quickly.
          </p>
          <h4 className=" start flex p-2 text-[#2D2525]">
            How can I repost another user’s post on my timeline?
          </h4>
          <p className="px-3 text-left text-[#858585]">
            When you click on the share button, you’ll find a repost option
            there.
          </p>
          <h4 className=" start flex p-2 text-[#2D2525]">
            How can I share a post outside Snapshare.com?
          </h4>
          <p className="px-3 text-left text-[#858585]">
            When you click on the share button you’ll find options to select
            from 3rd party apps and you can also copy the link and share
            wherever you want.
          </p>
          <h4 className=" start flex p-2 text-[#2D2525]">
            Can I publish someone else’s meme or gif?
          </h4>
          <p className="px-3 text-left text-[#858585]">
            If you’re giving proper credits, there is no harm as such. But you
            may have to remove it under special cases.
          </p>
          <h4 className=" start flex p-2 text-[#2D2525]">
            How can I save someone&apos;s post in my collection?
          </h4>
          <p className="px-3 text-left text-[#858585]">
            Click on the 3 dot menu on the top right corner of the post. You
            will get an option to add it to collections.
          </p>
          <h4 className=" start flex p-2 text-[#2D2525]">
            How can I message someone?
          </h4>
          <p className="px-3 text-left text-[#858585]">
            When you visit someone’s account you will find a message button
            there. Otherwise, you can go to the main menu and go to the messages
            page. There you can search for the user you want to message and
            there you go.
          </p>
          <h4 className=" start flex p-2 text-[#2D2525]">
            How can I block someone?
          </h4>
          <p className="px-3 text-left text-[#858585]">
            There is a block button on the profile of the user you want to
            block, click it. Or when you’re scrolling through the posts, you can
            also block them from the menu of their post.
          </p>
          <h4 className=" start flex p-2 text-[#2D2525]">
            How can I report sexual, pirated, duplicate or prohibited content?
          </h4>
          <p className="px-3 text-left text-[#858585]">
            It is necessary to report this type of content to make this platform
            friendly for all. If you find any such content, just click on the
            post menu and click on Report content while selecting the
            appropriate option. Note- Unnecessary reporting may lead to
            suspension of your account.
          </p>
          <h4 className=" start flex p-2 text-[#2D2525]">
            What are the terms of using Snapshare?{" "}
          </h4>
          <p className="px-3 text-left text-[#858585]">
            For using Snapshare there here are several Terms and Conditions which
            you can find{" "}
            <Link href={"/help-center?tab=terms_and_conditions"}>
              <span className="cursor-pointer text-blue-500 underline">
                here
              </span>
            </Link>
          </p>
          <h4 className=" start flex p-2 text-[#2D2525]">
            Where can I find the Privacy Policy of Snapshare?
          </h4>
          <p className="px-3 text-left text-[#858585]">
            Click here to read the{" "}
            <Link href={"/help-center?tab=privacy_policy"}>
              <span className="cursor-pointer text-blue-500 underline">
                privacy policy
              </span>
            </Link>{" "}
            of Snapshare
          </p>
          <h4 className=" start flex p-2 text-[#2D2525]">
            What happens if someone steals my content?
          </h4>
          <p className="px-3 text-left text-[#858585]">
            You can ask them to give credits or content removal. If they
            don&apos;t listen please inform Snapshare by contacting us.
          </p>
          <h4 className=" start flex p-2 text-[#2D2525]">
            Why is my account disabled?
          </h4>
          <p className="px-3 text-left text-[#858585]">
            There are several reasons your account can be suspended, while
            important ones are necessary to know. 1. Posting inappropriate
            content. 2. Not following community guidelines. 3. Inappropriate use
            of app. 4. Trying unauthorised methods to earn coins. 5. Unnecessary
            reporting content. 6. Receiving 3 final warnings called spankees.
            Etc
          </p>
          <h4 className=" start flex p-2 text-[#2D2525]">What is a warning?</h4>
          <p className="px-3 text-left text-[#858585]">
            You may receive warnings from time to time for any unusual activity
            so that you don’t repeat mistakes again. Otherwise, there are
            spankees.
          </p>{" "}
          <h4 className=" start flex p-2 text-[#2D2525]">What is a spankee?</h4>
          <p className="px-3 text-left text-[#858585]">
            It is termed as a final warning to the users, and after receiving 3
            spankees, your account will be permanently banned from our platform.
          </p>{" "}
          <h4 className=" start flex p-2 text-[#2D2525]">
            What happens when my account is disabled?
          </h4>
          <p className="px-3 text-left text-[#858585]">
            You can almost never recover it.
          </p>
          <h4 className=" start flex p-2 text-[#2D2525]">
            Can I Signup with the same email which got disabled earlier?
          </h4>
          <p className="px-3 text-left text-[#858585]">
            You may apply for a new account with the same Email and hope for
            your chance again.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
