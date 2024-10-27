import { Route, Routes, useLocation } from 'react-router-dom';
import suspenseFallbackMap from './suspense-fallback-map';
import { lazy, Suspense } from 'react';
import { AnimatePresence } from 'framer-motion';

import Layout from '@/pages/layout/__layout';
import { SonnerSpinner } from './components/sonner-spinner';

const Loadable =
  (
    Component: React.ComponentType,
    fallback = (
      <div className='flex-1 flex items-center justify-center min-h-screen'>
        <SonnerSpinner className="bg-foreground" scale="2" />
      </div>
    ),
  ) =>
  (props: JSX.IntrinsicAttributes) => (
    <Suspense fallback={fallback}>
      <Component {...props} />
    </Suspense>
  );

// So in the App.tsx we could import css file which is gonna be in multiple
// entries. For example, we could import font.css

const NotFound = Loadable( lazy(() => import('@/pages/layout/__not-found')));

const PagePathsWithComponents: Record<string, any> = import.meta.glob(
  './pages/**/[!_]*.tsx',
);

import.meta.env.DEV &&
  console.log({
    PagePathsWithComponents,
    paths: Object.keys(PagePathsWithComponents),
  });

const routes = Object.keys(PagePathsWithComponents).map(path => {
  const dynamicMatch = path.match(
    /\.\/pages\/(.*?)\/\[(.*?)\](?:\/(.*?)(?:\/(.*?))?)?\.tsx$/,
  );
  import.meta.env.DEV && console.log({ dynamicMatch });
  if (dynamicMatch) {
    const [, routePath, paramName, nestedPath = '', nestedParamName = ''] =
      dynamicMatch;

    const nestedPathToUse = nestedPath === 'index' ? '' : nestedPath;
    const nestedParamToUse = nestedParamName ? `:${nestedParamName}` : '';

    import.meta.env.DEV &&
      console.log({
        path: `${routePath}/:${paramName}${nestedPathToUse ? `/${nestedPathToUse}${nestedParamToUse}` : ''}`,
      });

    return {
      name: `${routePath}/${paramName}${nestedPathToUse ? `/${nestedPathToUse}${nestedParamName}` : ''}`,
      path: `${routePath}/:${paramName}${nestedPathToUse ? `/${nestedPathToUse}${nestedParamToUse}` : ''}`,
      component: Loadable(lazy(PagePathsWithComponents[path])),
    };
  }

  const regularMatch = path.match(/\.\/pages\/(.*?)\/?(index)?\.tsx$/);
  if (regularMatch) {
    const [, name] = regularMatch;
    const lowerName = name.toLowerCase();
    // const fallback = suspenseFallbackMap.get(lowerName) || undefined;
    //
    return {
      name,
      path: lowerName === 'home' ? '/' : `/${lowerName}`,
      component: Loadable(lazy(PagePathsWithComponents[path]), undefined),
    };
  }

  return null; // Ignore invalid paths
});

import.meta.env.DEV && console.log({ routes });

const filteredRoutes = routes.filter(
  (
    route,
  ): route is {
    name: string;
    path: string;
    component: (props: JSX.IntrinsicAttributes) => JSX.Element;
  } => route !== null,
);

const App = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode='wait'>
      <Routes location={location} key={location.pathname}>
        <Route path='/' element={<Layout />}>
          {filteredRoutes.map(({ path, component: ReactComponent }) => (
            <Route key={path} path={path} element={<ReactComponent />} />
          ))}
        </Route>
        <Route path='*' element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

export default App;
