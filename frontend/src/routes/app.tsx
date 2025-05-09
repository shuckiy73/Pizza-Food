import { Route, Routes } from "react-router-dom";
import HomePage from "../pages/homePage";
import Header from "../components/header";
//import CheckoutPage from "../pages/checkoutPage";
//import OrdersPage from "../pages/ordersPage";
//import LoginPage from "../pages/loginPage";
//import RegistrationPage from "../pages/registrationPage";
//import Footer from "../components/footer";
//import AccountActivationPage from "../pages/accountActivationPage";
//import PageNotFound from "../pages/pageNotFound";
//import ResetPasswordPage from "../pages/resetPassowrdPage";
//import ResetPasswordConfirmPage from "../pages/resetPasswordConfirmPage";
//import Profile from "../pages/profilePage";
import { lazy, Suspense } from 'react';
const CheckoutPage = lazy(() => import("../pages/checkoutPage"))
const OrdersPage = lazy(() => import("../pages/ordersPage"))
const LoginPage = lazy(() => import("../pages/loginPage"))
const RegistrationPage = lazy(() => import("../pages/registrationPage"))
const Footer = lazy(() => import("../components/footer"))
const AccountActivationPage = lazy(() => import("../pages/accountActivationPage"))
const PageNotFound = lazy(() => import("../pages/pageNotFound"))
const ResetPasswordPage = lazy(() => import("../pages/resetPassowrdPage"))
const ResetPasswordConfirmPage = lazy(() => import("../pages/resetPasswordConfirmPage"))
const Profile = lazy(() => import(  "../pages/profilePage"))


export default function App() {
    return (
      <>
      <div className="container max-w-[1280px] bg-white h-fit">
        <Header />
        <hr className="mt-[40px]"/>
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/profile" element={<Suspense fallback={<div className="h-screen"></div>}><Profile /></Suspense>} />
          <Route path="/orders" element={<Suspense fallback={<div className="h-screen"></div>}><OrdersPage /></Suspense>} />
          <Route path="/login" element={<Suspense fallback={<div className="h-screen"></div>}><LoginPage /></Suspense>} />
          <Route path="/sign-up" element={<Suspense fallback={<div className="h-screen"></div>}><RegistrationPage /></Suspense>} />
          <Route path="/reset-password/" element={<Suspense fallback={<div className="h-screen"></div>}><ResetPasswordPage /></Suspense>} />
          <Route
            path="/password/reset/confirm/:uid/:token/"
            element={<Suspense fallback={<div className="h-screen"></div>}><ResetPasswordConfirmPage /></Suspense>}
          />
          <Route
            path="/activate/:uid/:token/"
            element={<Suspense fallback={<div className="h-screen"></div>}><AccountActivationPage /></Suspense>}
          />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
      <Footer />
      </>
    )
  }