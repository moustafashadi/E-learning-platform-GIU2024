'use client'
import Image from "next/image";
import Heading from './utils/heading';
import Header from './components/Header';
import { useState } from 'react';
interface Props {}

export default function Home(props: Props) {
  const [route, setRoute] = useState('login');
  const [activeItem, setActiveItem] = useState(0);
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Heading
        title="E-learning2"
        description="Learn from anywhere"
        keywords='Programming, E-learning, Online learning, Web development'
      />
<p>Home</p>
      <Header
        open={open}
        setOpen={setOpen}
        activeItem={activeItem}
        setRoute={setRoute}
        route={route}
      />
    </div>
  )
}


