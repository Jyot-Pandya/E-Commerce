import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useRecoilValue, useRecoilCallback, useSetRecoilState } from 'recoil';
import { userInfoState, userLoginLoadingState, userLoginErrorState } from '../state/userState';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { FaGoogle, FaGithub, FaEnvelope, FaLock } from 'react-icons/fa';
import { Skeleton } from '@/components/ui/skeleton';
import axios from 'axios';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();

  const loading = useRecoilValue(userLoginLoadingState);
  const error = useRecoilValue(userLoginErrorState);
  const userInfo = useRecoilValue(userInfoState);
  const setError = useSetRecoilState(userLoginErrorState);


  const redirect = location.search ? location.search.split('=')[1] : '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
    
    return () => {
        setError(null);
    };
  }, [navigate, userInfo, redirect, setError]);

  const validateForm = () => {
    let isValid = true;
    
    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Email is invalid');
      isValid = false;
    } else {
      setEmailError('');
    }
    
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    } else {
      setPasswordError('');
    }
    
    return isValid;
  };

  const submitHandler = useRecoilCallback(({ set }) => async (e) => {
    e.preventDefault();
    if (validateForm()) {
        set(userLoginLoadingState, true);
        set(userLoginErrorState, null);
        try {
            const config = {
                headers: { 'Content-Type': 'application/json' },
            };
            const { data } = await axios.post('/api/users/login', { email, password }, config);
            set(userInfoState, data);
            set(userLoginLoadingState, false);
        } catch (error) {
            const message = error.response && error.response.data.message ? error.response.data.message : error.message;
            set(userLoginErrorState, message);
            set(userLoginLoadingState, false);
        }
    }
  });

  // Function to handle OAuth login
  const handleOAuthLogin = (provider) => {
    window.location.href = `/api/auth/${provider}`;
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh] animate-fade-in">
      <Card className="w-full max-w-md shadow-lg" variant="default" animation="hover">
        <CardHeader className="space-y-1 text-center bg-primary/5 rounded-t-lg pb-6">
          <CardTitle className="text-3xl font-bold">Sign In</CardTitle>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to access your account
          </p>
        </CardHeader>
        
        <CardContent className="p-6 pt-8">
          {error && (
            <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg mb-6 animate-slide-in-bottom">
              {error}
            </div>
          )}
          
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full rounded-md" />
              <Skeleton className="h-10 w-full rounded-md" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          ) : (
            <form onSubmit={submitHandler} className="space-y-4">
              <Input
                type="email"
                label="Email Address"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={emailError}
                icon={<FaEnvelope />}
                required
              />

              <Input
                type="password"
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={passwordError}
                icon={<FaLock />}
                required
              />

              <Button type="submit" className="w-full" size="lg">
                Sign In
              </Button>
              
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-muted"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-background text-muted-foreground">Or sign in with</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleOAuthLogin('google')}
                  leftIcon={<FaGoogle />}
                >
                  Google
                </Button>
                <Button
                  type="button"
                  disabled
                  variant="outline"
                  title="GitHub login coming soon"
                  leftIcon={<FaGithub />}
                >
                  GitHub
                </Button>
              </div>
            </form>
          )}
        </CardContent>

        <CardFooter className="p-6 pt-0 text-center border-t">
          <p className="text-sm text-muted-foreground">
            New Customer?{' '}
            <Link
              to={redirect ? `/register?redirect=${redirect}` : '/register'}
              className="text-primary hover:underline font-medium"
            >
              Create an account
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginScreen; 