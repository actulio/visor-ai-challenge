import React from 'react';
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Login from './Login';
import Chat from './Chat';
import Register from './Register';
import { checkAuth } from '../utils/checkAuth';

const variants = {
  initial: {
    opacity: 0,
  },
  in: {
    opacity: 1,
  },
  out: {
    opacity: 0,
  },
};

const transition = {
  type: 'tween',
  ease: 'linear',
  duration: 0.3,
};

const AnimationLayout: React.FC = () => {
  const { pathname } = useLocation();
  return (
    <motion.div
      key={pathname}
      initial="initial"
      animate="in"
      variants={variants}
      transition={transition}
    >
      <Outlet />
    </motion.div>
  );
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = checkAuth();

  if (user) return children;
  return <Navigate to="/login" replace />;
};

const RoutesWithAnimation = () => {
  return (
    <Routes>
      <Route element={<AnimationLayout />}>
        {/* <Route path="/" element={<Home />} /> */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Route>
    </Routes>
  );
};

export default RoutesWithAnimation;
