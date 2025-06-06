"use client";

import { useState } from "react";
import { useAuth0 } from "@/hooks/useAuth0";
import { Dialog } from "@/components/ui/dialog";
import "./auth0-styles.css";

interface AuthModalProps {
  type: "login" | "signup" | null;
  onClose: () => void;
  onSwitchType: (type: "login" | "signup") => void;
}

const AuthModal = ({ type, onClose, _onSwitchType }: AuthModalProps & { _onSwitchType?: (type: "login" | "signup") => void }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const isOpen = type !== null;
  
  const { loginWithRedirect, isLoading } = useAuth0();

  // Store return path based on auth type (login vs signup)  
  const storeReturnPath = (authType: 'login' | 'signup') => {
    // For new signups, always go to payment
    // For logins, let the API determine based on payment status
    const returnPath = authType === 'signup' ? '/payment' : '/';
    localStorage.setItem('auth_return_path', returnPath);
  };

  // Login with email/password
  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    storeReturnPath('login');
    loginWithRedirect({
      authorizationParams: {
        screen_hint: "login",
      },
      loginHint: email,
    });
  };

  // Social logins
  const handleGoogleLogin = () => {
    storeReturnPath(type as 'login' | 'signup');
    loginWithRedirect({
      authorizationParams: {
        screen_hint: type,
        connection: "google-oauth2",
        // Add return path as a URL parameter
        // The API will extract this and use it for redirection
        return_path: type === 'signup' ? '/payment' : '/'
      }
    });
  };

  const handleFacebookLogin = () => {
    storeReturnPath(type as 'login' | 'signup');
    loginWithRedirect({
      authorizationParams: {
        screen_hint: type,
        connection: "facebook",
        return_path: type === 'signup' ? '/payment' : '/'
      }
    });
  };

  const handleAppleLogin = () => {
    storeReturnPath(type as 'login' | 'signup');
    loginWithRedirect({
      authorizationParams: {
        screen_hint: type,
        connection: "apple",
        return_path: type === 'signup' ? '/payment' : '/'
      }
    });
  };

  const handleSignup = () => {
    storeReturnPath('signup');
    loginWithRedirect({
      authorizationParams: {
        screen_hint: "signup",
        return_path: '/payment'
      },
      loginHint: email,
    });
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <main className="c633902b8 login">
        <section className="cae3413dc _prompt-box-outer">
          <div className="ce204bcb9 c7d82ce88">
            <div className="c805ffa16 show">
              <span id="alert-trigger"></span>
              <div className="ce7d0ce20">
                <ul className="c12692252">
                  <li>
                    <h2 className="c7d536026">Alerts</h2>
                  </li>
                  <li className="c7a9b3e70">
                    <span className="c9f2dc785">
                      <span className="c30eb6583 cf1be2816"></span>
                    </span>
                    <h3 className="c948ee97d">Dev Keys</h3>
                    <p className="cd96c2d4c">One or more of your connections are currently using Auth0 development keys and should not be used in production.</p>
                    <a className="c70dd064f c92ff1d1c c3ebcfad9" href="https://auth0.com/docs/connections/social/devkeys" target="_blank" rel="noopener noreferrer">Learn More</a>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="c1e11856b">
              <header className="ca3d4e5e6 c42c4b9f9">
                <div 
                  title="dev-l1xgk0jrahgc55wv" 
                  id="custom-prompt-logo" 
                  style={{
                    width: "auto", 
                    height: "60px", 
                    position: "static", 
                    margin: "auto", 
                    padding: 0, 
                    backgroundColor: "transparent", 
                    backgroundPosition: "center", 
                    backgroundSize: "contain", 
                    backgroundRepeat: "no-repeat"
                  }}
                ></div>
                <img 
                  className="c50cfd605 c63f9d186" 
                  id="prompt-logo-center" 
                  src="https://cdn.auth0.com/quantum-assets/dist/latest/logos/auth0/auth0-icon-onlight.svg" 
                  alt="dev-l1xgk0jrahgc55wv"
                />
                <h1 className="cc1bd00fe cf4bb9070">Welcome</h1>
                <div className="cd421dff5 c3889d626">
                  <p className="c45f31184 ca3398b0a">Log in to dev-l1xgk0jrahgc55wv to continue to My Appdidi6373.</p>
                </div>
              </header>

              <div className="cfcc07aed c07419955">
                <form method="POST" onSubmit={handleEmailLogin} className="cc3f2d70c ceecbd693" data-form-primary="true">
                  <div className="c70a5071f c14212349">
                    <div className="c96c93a41">
                      <div className="input-wrapper _input-wrapper">
                        <div className="cd2c25b7e c4e79ceaf text ce618ca20 c7e0fe4c8">
                          <label className="c450395c0 no-js c837a9c4b c469bbeec" htmlFor="username">Email address</label>
                          <input 
                            className="input c2053dbb5 c10f8401f" 
                            inputMode="email" 
                            name="username" 
                            id="username" 
                            type="text" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required 
                            autoComplete="email" 
                            autoCapitalize="none" 
                            spellCheck="false" 
                            autoFocus
                          />
                          <div className="c450395c0 js-required c837a9c4b c469bbeec" data-dynamic-label-for="username" aria-hidden="true">Email address*</div>
                        </div>
                      </div>

                      <div className="input-wrapper _input-wrapper">
                        <div style={{ position: 'relative' }}>
                          <label htmlFor="password" style={{ display: 'block', marginBottom: '6px', fontSize: '14px' }}>Password</label>
                          <input 
                            style={{
                              width: '100%',
                              padding: '10px 40px 10px 10px',
                              border: '1px solid #d4d4d4',
                              borderRadius: '3px',
                              fontSize: '14px',
                              height: '40px',
                              boxSizing: 'border-box'
                            }}
                            name="password" 
                            id="password" 
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                            autoComplete="current-password" 
                          />
                          <button 
                            type="button" 
                            onClick={togglePasswordVisibility}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            style={{
                              position: 'absolute',
                              right: '8px',
                              top: '33px',
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              padding: '5px',
                              fontSize: '12px',
                              color: '#666'
                            }}
                          >
                            {showPassword ? "Hide" : "Show"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="c8fdce3c3 c2bd9edda">
                    <a 
                      className="c70dd064f c32590db8 c3ebcfad9" 
                      href="/u/login/password-reset-start/Username-Password-Authentication"
                    >
                      Forgot password?
                    </a>
                  </p>

                  <div className="c5d45fb63">
                    <button 
                      type="submit" 
                      name="action" 
                      value="default" 
                      className="c89213e2d cec57cc42 c4630d56b c7da8bd2b c4af8768b" 
                      disabled={isLoading}
                    >
                      Continue
                    </button>
                  </div>
                </form>

                <div className="ulp-alternate-action _alternate-action __s16nu9">
                  <p className="c45f31184 ca3398b0a c0db53cd4">
                    Don't have an account?<a 
                      className="c70dd064f c3ebcfad9" 
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleSignup();
                      }}
                    >Sign up</a>
                  </p>
                </div>
                
                <div className="cf427ce24 c31c578a3">
                  <span>Or</span>
                </div>

                <div className="c3e2f4433 ce8299bbd">
                  <div className="social-button-container">
                    <button 
                      className="social-button google-button" 
                      onClick={handleGoogleLogin}
                      disabled={isLoading}
                    >
                      <div className="social-icon google-icon"></div>
                      <span>Continue with Google</span>
                    </button>
                  </div>

                  <div className="social-button-container">
                    <button 
                      className="social-button facebook-button" 
                      onClick={handleFacebookLogin}
                      disabled={isLoading}
                    >
                      <div className="social-icon facebook-icon"></div>
                      <span>Continue with Facebook</span>
                    </button>
                  </div>

                  <div className="social-button-container">
                    <button 
                      className="social-button apple-button" 
                      onClick={handleAppleLogin}
                      disabled={isLoading}
                    >
                      <div className="social-icon apple-icon"></div>
                      <span>Continue with Apple</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Dialog>
  );
};

export default AuthModal;
