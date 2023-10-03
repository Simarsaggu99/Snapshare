import { useEffect, useState } from "react";
import Image from "next/image";
import personWithlaptop from "~/images/personWithlaptop.png";
// import useState from 'react'
// import Advertisement from "@/components/advertisement";
import TermsOfservices from "@/components/terms of services";
import PrivacyPolicy from "@/components/help_center/PrivacyPolicy";
import AboutUs from "@/components/help_center/AboutUs";
import CommunityGuidelines from "@/components/help_center/CommunityGuidelines";
import { useRouter } from "next/router";
import ContactUs from "@/components/contactUs";
import FAQ from "@/components/help_center/FAQ";
const ContactSection = () => {
  // const [isOpen, setIsOpen] = useState('about')
  const router = useRouter();
  const tab = router.query.tab;
  const [openTab, setOpenTab] = useState<any>(tab || "about");
  useEffect(() => {
    if (!(tab && openTab)) {
      router.push("?tab=about");
    }
  }, []);
  useEffect(() => {
    setOpenTab(tab);
  }, [tab]);

  return (
    <div className="lg:mx-28 2xl:mx-44">
      <div className="mx-auto flex   w-full  gap-4   text-black sm:text-center ">
        <div className="   mx-auto  w-full   md:h-full lg:mt-5 lg:w-[80%] xl:mt-5 xl:w-3/5 ">
          
          <div className=" relative">
            <ul
              className=" border-b  text-sm  font-medium  md:flex md:flex-wrap md:justify-between "
              role="tablist"
            >
              <li className="mr-2 border-b">
                <a
                  aria-current="page"
                  className={
                    "inline-block w-full rounded-t-md p-4 font-semibold" +
                    (openTab === "about"
                      ? "text-blueGray-600  w-[100%] bg-[#d5d4d4] md:w-max"
                      : "bg-blueGray-600")
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    router.push("?tab=about");

                    setOpenTab("about");
                  }}
                  data-toggle="tab"
                  href="#link1"
                  role="tablist"
                >
                  About
                </a>
              </li>
              <li className="mr-2 border-b">
                <a
                  className={
                    "inline-block w-full rounded-t-md p-4 font-semibold" +
                    (openTab === "contact-us"
                      ? "text-blueGray-600 w-[100%] bg-[#d5d4d4] md:w-max"
                      : " bg-blueGray-600")
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    router.push("?tab=contact-us");

                    setOpenTab("contact-us");
                  }}
                  data-toggle="tab"
                  href="#link7"
                  role="tablist"
                >
                  Contact Us
                </a>
              </li>
              {/* <li className="mr-2 border-b">
                <a
                  className={
                    "inline-block w-full rounded-t-md p-4 font-semibold" +
                    (openTab === "faq"
                      ? "text-blueGray-600 w-[100%] bg-[#d5d4d4] md:w-max"
                      : " bg-blueGray-600")
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    router.push("?tab=faq");

                    setOpenTab("faq");
                  }}
                  data-toggle="tab"
                  href="#link2"
                  role="tablist"
                >
                  FAQ
                </a>
              </li> */}
              {/* <li className="mr-2 border-b">
                <a
                  className={
                    "inline-block w-full rounded-t-md p-4 font-semibold " +
                    (openTab === "terms_and_conditions"
                      ? "text-blueGray-600 w-[100%] bg-[#d5d4d4] md:w-max "
                      : " bg-blueGray-600")
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    router.push("?tab=terms_and_conditions");
                    if (openTab === "terms_and_conditions") {
                      setOpenTab("");
                    } else {
                      setOpenTab("terms_and_conditions");
                    }
                  }}
                  data-toggle="tab"
                  href="#link3"
                  role="tablist"
                >
                  Terms and Conditions
                </a>
              </li> */}
              {/* <li className="mr-2 border-b">
                <a
                  className={
                    "inline-block w-full rounded-t-md p-4 font-semibold" +
                    (openTab === "privacy_policy"
                      ? "text-blueGray-600 w-[100%] bg-[#d5d4d4] md:w-max"
                      : " bg-blueGray-600")
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    router.push("?tab=privacy_policy");
                    if (openTab === "privacy_policy") {
                      setOpenTab("");
                    } else {
                      setOpenTab("privacy_policy");
                    }
                  }}
                  data-toggle="tab"
                  href="#link4"
                  role="tablist"
                >
                  Privacy Policy
                </a>
              </li> */}
              <li>
                <a
                  className={
                    "inline-block w-full rounded-t-md p-4 font-semibold" +
                    (openTab === "community_guidelines"
                      ? "text-blueGray-600 w-[100%] bg-[#d5d4d4] md:w-max "
                      : " bg-blueGray-600")
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenTab("community_guidelines");
                    router.push("?tab=community_guidelines");
                  }}
                  data-toggle="tab"
                  href="./contact/faq"
                  role="tablist"
                >
                  Community Guidelines
                </a>
              </li>
            </ul>
            <div className="relative block  h-screen  w-full min-w-0 flex-col overflow-auto  break-words rounded bg-white shadow-lg ">
              <div className=" px-4 py-5 ">
                <div className="tab-content tab-space">
                  <div
                    className={openTab === "about" ? "block" : "hidden"}
                    id="link1"
                  >
                    <AboutUs />
                  </div>
                  <div
                    className={openTab === "faq" ? "block" : "hidden"}
                    id="link2"
                  >
                    <FAQ />
                  </div>
                  {/* <div
                    className={
                      openTab === "terms_and_conditions" ? "block" : "hidden"
                    }
                    id="link3"
                  >
                    <TermsOfservices />
                  </div> */}
                  {/* <div
                    className={
                      openTab === "privacy_policy" ? "block" : "hidden"
                    }
                    id="link4"
                  >
                    <PrivacyPolicy />
                  </div> */}
                  <div
                    className={
                      openTab === "community_guidelines" ? "block" : "hidden"
                    }
                    id="link5"
                  >
                    <CommunityGuidelines />
                  </div>
                  <div
                    className={openTab === "contact-us" ? "block" : "hidden"}
                    id="link5"
                  >
                    {/* <div className="flex w-full flex-row"> */}
                    <ContactUs />
                    {/* </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <div className=" mt-5  hidden w-[20%] md:hidden lg:mr-20 lg:block xl:mr-20 2xl:mr-40 ">
          <Advertisement />
        </div> */}
      </div>
    </div>
  );
};

export default ContactSection;
