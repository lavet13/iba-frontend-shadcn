import SparklesText from '@/components/ui/sparkles-text';
import { FC } from 'react';

const Home: FC = () => {
  return (
    <div className='container xl:max-w-screen-xl grow shrink-0 flex flex-col justify-center items-center'>
      <SparklesText text="Джаббаров" />
    </div>
  );
};

export default Home;
