import DetailsImage from "@/_components/DetailsImage";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

function imgDetails() {
  const router = useRouter();
  const [id, setID] = useState("");

  useEffect(() => {
    if (router.isReady) setID(router.query.id);
  }, [router.isReady]);

  return <>{id !== "" ? <DetailsImage img_id={id} /> : null}</>;
}

export default imgDetails;
