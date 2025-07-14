import React, { Suspense } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ProfileScreen from './screens/ProfileScreen';
import ShippingScreen from './screens/ShippingScreen';
import PaymentScreen from './screens/PaymentScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import UserListScreen from './screens/UserListScreen';
import UserEditScreen from './screens/UserEditScreen';
import ProductListScreen from './screens/ProductListScreen';
import ProductEditScreen from './screens/ProductEditScreen';
import OrderListScreen from './screens/OrderListScreen';
import OAuthCallbackScreen from './screens/OAuthCallbackScreen';
import AdminDashboardScreen from './screens/AdminDashboardScreen';
import { ThemeToggle } from './components/ui/theme-provider';
import { StagewiseToolbar } from '@stagewise/toolbar-react';
import ReactPlugin from '@stagewise-plugins/react';

// Error Fallback Component
const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4">
      <div className="max-w-md w-full p-6 bg-card rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
        <p className="mb-4">The application encountered an error and couldn't continue.</p>
        <p className="text-sm bg-muted p-2 rounded mb-4 overflow-auto max-h-40">
          {error.message}
        </p>
        <button 
          onClick={resetErrorBoundary} 
          className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

// Loading fallback
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="animate-pulse">
      <div className="h-12 w-12 bg-primary/30 rounded-full"></div>
    </div>
  </div>
);

function App() {
  return (
    <ErrorBoundary 
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.reload()}
    >
      <Suspense fallback={<LoadingFallback />}>
      <Router>
          <div className="flex flex-col min-h-screen bg-background text-foreground">
          <Header />
          <main className="container mx-auto px-4 py-8 flex-grow">
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/search/:keyword" element={<HomeScreen />} />
              <Route path="/page/:pageNumber" element={<HomeScreen />} />
              <Route path="/search/:keyword/page/:pageNumber" element={<HomeScreen />} />
              <Route path="/category/:category" element={<HomeScreen />} />
              <Route path="/category/:category/page/:pageNumber" element={<HomeScreen />} />
              <Route path="/product/:id" element={<ProductScreen />} />
              <Route path="/cart" element={<CartScreen />} />
              <Route path="/cart/:id" element={<CartScreen />} />
              <Route path="/login" element={<LoginScreen />} />
              <Route path="/register" element={<RegisterScreen />} />
              <Route path="/profile" element={<ProfileScreen />} />
              <Route path="/shipping" element={<ShippingScreen />} />
              <Route path="/payment" element={<PaymentScreen />} />
              <Route path="/placeorder" element={<PlaceOrderScreen />} />
              <Route path="/order/:id" element={<OrderScreen />} />
              <Route path="/oauth-callback" element={<OAuthCallbackScreen />} />
              <Route path="/admin/userlist" element={<UserListScreen />} />
              <Route path="/admin/user/:id/edit" element={<UserEditScreen />} />
              <Route path="/admin/productlist" element={<ProductListScreen />} />
              <Route path="/admin/productlist/:pageNumber" element={<ProductListScreen />} />
              <Route path="/admin/product/:id/edit" element={<ProductEditScreen />} />
              <Route path="/admin/orderlist" element={<OrderListScreen />} />
              <Route path="/admin/dashboard" element={<AdminDashboardScreen />} />
            </Routes>
          </main>
          <Footer />
            
            {/* Theme Toggle Button - Fixed at bottom right */}
            <div className="fixed bottom-6 right-6 z-50">
              <ThemeToggle className="bg-background shadow-lg rounded-full p-3 hover:shadow-xl transition-all duration-300" />
            </div>
            <StagewiseToolbar config={{ plugins: [ReactPlugin] }} />
        </div>
      </Router>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
