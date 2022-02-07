import React, { useEffect } from "react";
// @ts-ignore
import { useLocation } from "react-router";

const UseRedirectToHttps = () => {
  let location = useLocation();
  useEffect(() => {
    if (
      window.location.protocol !== "https:" &&
      (window.location.hostname === "master-herd-web.herokuapp.com" ||
        window.location.hostname === "www.master-herd-web.herokuapp.com")
    ) {
      window.location.replace(
        "https://master-herd-web.herokuapp.com" + location.pathname
      );
    }
  });
};

export default UseRedirectToHttps;
