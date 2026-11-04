import React, { useMemo } from "react";
import { FooterLink2 } from "../../data/footer-links";
import { Link } from "react-router-dom";

// Images
import Logo from "../navbar/Logo";

// Icons
import { FaFacebook, FaGoogle, FaTwitter, FaYoutube } from "react-icons/fa";

const BottomFooter = ["Privacy Policy", "Cookie Policy", "Terms"];
const Resources = [
  "Articles",
  "Blog",
  "Chart Sheet",
  "Code challenges",
  "Docs",
  "Projects",
  "Videos",
  "Workspaces",
];
const Plans = ["Paid memberships", "For students", "Business solutions"];
const Community = ["Forums", "Chapters", "Events"];

const Footer = React.memo(() => {
  const companyLinks = useMemo(() => ["About", "Careers", "Affiliates"], []);
  return (
    <footer className="bg-surface border-t border-border text-muted transition-colors duration-200">
      <div className="flex flex-col lg:flex-row gap-8 items-center justify-between w-11/12 max-w-maxContent leading-6 mx-auto relative py-12">
        <div className="border-b w-full flex flex-col lg:flex-row pb-8 border-border">
          {/* Section 1 */}
          <div className="lg:w-[50%] flex flex-wrap flex-row justify-between lg:border-r lg:border-border pl-3 lg:pr-5 gap-3">
            <div className="w-[30%] flex flex-col gap-3 lg:w-[30%] mb-7 lg:pl-0">
              <Logo />
              <h4 className="text-text font-semibold text-sm mt-4">
                Company
              </h4>
              <div className="flex flex-col gap-2">
                {companyLinks.map((ele, i) => {
                  return (
                    <div
                      key={i}
                      className="text-xs cursor-pointer hover:text-text transition-colors duration-150"
                    >
                      <Link to={ele.toLowerCase()}>{ele}</Link>
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-4 text-base text-muted mt-2">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Visit our Facebook page" className="hover:text-text transition-colors">
                  <FaFacebook />
                </a>
                <a href="https://google.com" target="_blank" rel="noopener noreferrer" aria-label="Visit our Google page" className="hover:text-text transition-colors">
                  <FaGoogle />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Visit our Twitter page" className="hover:text-text transition-colors">
                  <FaTwitter />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="Visit our YouTube channel" className="hover:text-text transition-colors">
                  <FaYoutube />
                </a>
              </div>
            </div>

            <div className="w-[48%] lg:w-[30%] mb-7 lg:pl-0">
              <h4 className="text-text font-semibold text-sm">
                Resources
              </h4>

              <div className="flex flex-col gap-2 mt-2">
                {Resources.map((ele, index) => {
                  return (
                    <div
                      key={index}
                      className="text-xs cursor-pointer hover:text-text transition-colors duration-150"
                    >
                      <Link to={ele.split(" ").join("-").toLowerCase()}>
                        {ele}
                      </Link>
                    </div>
                  );
                })}
              </div>

              <h4 className="text-text font-semibold text-sm mt-5">
                Support
              </h4>
              <div className="text-xs cursor-pointer hover:text-text transition-colors duration-150 mt-2">
                <Link to={"/support/help-center"}>Help Center</Link>
              </div>
            </div>

            <div className="w-[48%] lg:w-[30%] mb-7 lg:pl-0">
              <h4 className="text-text font-semibold text-sm">
                Plans
              </h4>

              <div className="flex flex-col gap-2 mt-2">
                {Plans.map((ele, index) => {
                  return (
                    <div
                      key={index}
                      className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200"
                    >
                      <Link to={ele.split(" ").join("-").toLowerCase()}>
                        {ele}
                      </Link>
                    </div>
                  );
                })}
              </div>
              <h1 className="text-richblack-50 font-semibold text-[16px] mt-7">
                Community
              </h1>

              <div className="flex flex-col gap-2 mt-2">
                {Community.map((ele, index) => {
                  return (
                    <div
                      key={index}
                      className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200"
                    >
                      <Link to={ele.split(" ").join("-").toLowerCase()}>
                        {ele}
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="lg:w-[50%] flex flex-wrap flex-col lg:flex-row justify-between pl-3 lg:pl-5 gap-3">
            {FooterLink2.map((ele, i) => {
              return (
                <div key={i} className="w-[48%] lg:w-[30%] mb-7 lg:pl-0">
                  <h4 className="text-text font-semibold text-sm">
                    {ele.title}
                  </h4>
                  <div className="flex flex-col gap-2 mt-2">
                    {ele.links.map((link, index) => {
                      return (
                        <div
                          key={index}
                          className="text-xs cursor-pointer hover:text-text transition-colors duration-150"
                        >
                          <Link to={link.link}>{link.title}</Link>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex flex-row items-center justify-between w-11/12 max-w-maxContent text-muted mx-auto pb-10 text-xs">
        {/* Section 1 */}
        <div className="flex justify-between lg:items-start items-center flex-col lg:flex-row gap-3 w-full border-t border-border pt-6">
          <div className="flex flex-row flex-wrap">
            {BottomFooter.map((ele, i) => {
              return (
                <div
                  key={i}
                  className={` ${
                    BottomFooter.length - 1 === i
                      ? ""
                      : "border-r border-border"
                  } px-3 text-xs text-muted hover:text-text transition-colors duration-150 `}
                >
                  <Link to={ele.split(" ").join("-").toLowerCase()}>
                    {ele}
                  </Link>
                </div>
              );
            })}
          </div>

          <div className="text-center font-medium text-xs text-muted">
            EduTech Platform © {new Date().getFullYear()} — Computer Science & Engineering Academy
          </div>
        </div>
      </div>
    </footer>
  );
});

export default Footer;