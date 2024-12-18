"use client";
import React, { FC, useEffect } from "react";
import Heading from "./utils/heading";


interface Props { }

const Page: FC<Props> = () => {
  return (
    <div>
      <Heading
        title="ELearning"
        description="hello world"
        keywords="test this isnt real"
      />
      </div>
    
  );
};

export default Page;