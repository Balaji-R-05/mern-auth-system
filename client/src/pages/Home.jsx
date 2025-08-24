// import React from 'react';
// import Navbar from '../components/Navbar';
// import Header from '../components/Header';

// const Home = () => {
//     return (
//         <div className='flex flex-col items-center justify-center min-h-screen bg-[url("/bg_img.png")]
//         bg-cover bg-center'>
//             <Navbar/>
//             <Header />
//         </div>
//     )
// }

// export default Home;

import React from 'react';
import Navbar from '../components/Navbar';
import Header from '../components/Header';

const Home = () => {
  return (
    <div
      className='flex flex-col items-center justify-center min-h-screen 
      bg-[linear-gradient(to_bottom,rgba(189,195,199,0.3),rgba(44,62,80,0.7)),url("/bg_img.png")] 
      bg-cover bg-center bg-no-repeat'
    >
      <Navbar />
      <Header />
    </div>
  )
}

export default Home;
