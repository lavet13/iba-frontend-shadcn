import { ScrollArea } from '@/components/ui/scroll-area';
import { FC } from 'react';

const Home: FC = () => {
  return (
    <div className='container xl:max-w-screen-xl grow shrink-0 flex flex-col justify-center'>
      <div className='relative py-6 lg:gap-10 lg:py-8 lg:grid lg:grid-cols-[1fr_500px]'>
        <div className="flex flex-col justify-center">
          <h1 className='scroll-m-20 text-4xl mb-3 font-extrabold tracking-tight lg:text-5xl'>
            Скиндер Павел Павлович
          </h1>
          <div className='pl-3 space-y-2'>
            <blockquote className='mt-6 border-l-2 pl-6'>
              <h4 className='scroll-m-20 text-xl font-light tracking-tight'>
                Факультет компьютерных наук и технологий
              </h4>
              <h4 className='scroll-m-20 text-xl font-light tracking-tight'>
                Кафедра компьютерной инженерии
              </h4>
              <h4 className='scroll-m-20 text-xl font-light tracking-tight'>
                Специальность «Компьютерные системы и сети»
              </h4>
            </blockquote>
          </div>

          <h3 className='mt-8 mb-3 scroll-m-20 text-3xl font-black tracking-tight'>
            Оптимизация аппаратурных затрат в логических схемах устройств
            управления
          </h3>
          <blockquote className='ml-3 mt-6 border-l-2 pl-6'>
            <h4 className='scroll-m-20 text-xl font-light tracking-tight'>
              Научный руководитель: д.т.н., проф. Петров Петр Петрович
            </h4>
          </blockquote>
        </div>

        <div className='hidden text-sm lg:block'>
          <div className='sticky top-16 -mt-10 w-full max-w-[350px] h-auto pt-4'>
            <ScrollArea className='h-full pb-10'>
              <div className='flex justify-center items-center h-full'>
                <img
                  src='/images/chel.jpg'
                  className='aspect-[3/4.5] max-h-full w-auto object-cover grayscale rounded-md'
                />
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
