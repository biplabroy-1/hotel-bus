import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

const page = async () => {
  if ((await auth()).sessionClaims?.metadata.onboardingComplete === true) {
    redirect("/admin");
  }
  return <div>page</div>;
};

export default page;
