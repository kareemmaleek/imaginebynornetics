import DetailsImage from "@/_components/DetailsImage";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

function imgDetails() {
  const router = useRouter();
  const [uid, setUID] = useState("");

  useEffect(() => {
    if (router.isReady) setUID(router.query.uid);
  }, [router.isReady]);

  return <>{uid !== "" ? <DetailsImage img_id={uid} /> : null}</>;
}

export default imgDetails;
