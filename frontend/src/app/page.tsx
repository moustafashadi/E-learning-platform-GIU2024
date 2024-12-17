'use client'
import React, { FC, useState } from 'react';
import Heading from './utils/heading';

interface Props {

}

const Page: FC<Props> = (props) => {

  return (
    <div>
      <Heading
        title="E-learning"
        description="Learn from anywhere"
        keywords='Programming, E-learning, Online learning, Web development'
      />
    </div>
  )
}

export default Page;