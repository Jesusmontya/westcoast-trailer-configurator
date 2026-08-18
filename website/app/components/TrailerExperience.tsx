"use client";

import dynamic from "next/dynamic";

const TrailerExperience3D = dynamic(() => import("./TrailerExperience3D"), { ssr: false });

export default function TrailerExperience() {
  return <TrailerExperience3D />;
}
