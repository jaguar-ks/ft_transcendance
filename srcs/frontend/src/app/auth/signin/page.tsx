"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';
import { InputField } from '@/components/InputField'
import styles from "./page.module.css";
import loginPlayer from '../../../../assets/loginPlayer.svg';
import OtpForLogin from '../../../components/OtpForLogin/OtpForLogin';
import { Header } from '@/components/Header';
import imageee from '../../../../assets/syberPlayer.png'
interface Errors {
  details: string;
  username: string;
  password: string;
  otp: string;
}

const SignInPage: React.FC = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Errors>({
    details: '',
    username: '',
    password: '',
    otp: '',
  });
  const [username, setUsername]= useState("");
  const [password, setPassword]= useState("");
  


  const router = useRouter();

  // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = event.target;
  //   setFormData(prev => ({ ...prev, [name]: value }));
  //   setErrors(prev => ({ ...prev, details: '', [name]: '' }));
  // };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setErrors({
      details: '',
      username: '',
      password: '',
      otp: '',
    });
    setIsLoading(true);
    
    try {
      await axios.post("http://localhost:8000/api/auth/sign-in/", {username, password},{withCredentials: true});
      console.log("logged");
      
      router.push("/users/home");
    } catch (err: any) {
      console.error("Error:", err.response);
      setErrors({
        details: err.response?.data?.detail || "",
        username: err.response?.data?.username?.[0] || "",
        password: err.response?.data?.password?.[0] || "",
        otp: err.response?.data?.otp_code?.[0] || "",
      });
      console.log(errors);
      
      setIsLoading(false);
    } finally {
    }
  };

  return (
    <div className={styles.pageContainer}>
      <Header forWhat="Sign In"/>
      <main className={styles.main}>
        <div className={styles.formContainer}>
          <div className={styles.formContent}>
            <div className={styles.formSection}>
              <h2 className={styles.subtitle}>Welcome to the Ping Pong World</h2>
              <p className={styles.description}>Please create your account.</p>
              <form onSubmit={handleSubmit} className={styles.form}>
                <InputField
                  label="username"
                  type="text"
                  id="username"
                  name="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  error={errors.username}
                />
                {/* {errors.username ? <p className={styles.error}>{errors.username}</p> : <p className={styles.noError}>"no error"</p>} */}
                <InputField
                  label="password"
                  type="password"
                  id="password"
                  name="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={errors.password}
                  />
                  {errors.details ? <p className={styles.error}>{errors.details}</p> : <p className={styles.noError}>"no error"</p>}
                <div className={styles.submitContainer}>
                  <div className={styles.submitButtonContainer}>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={styles.submitButton}
                      >
                      {isLoading ? 'Loading...' : 'Submit'}
                    </button>
                  </div>
                </div>
              </form>
              <p className={styles.signInText}>
                Already have an account?{' '}
                <button
                  onClick={() => router.push('/auth/signup')}
                  className={styles.signInLink}
                >
                  Sign Up
                </button>
              </p>
            </div>
            <div className={styles.imageSection}>
                <div className={styles.containerImage}>
                <div className={styles.ImageContainer}>
                  <Image
                    src={imageee}
                    alt="Login Player"
                    width={500}
                    height={500}
                    className={styles.image}
                    />
                </div>
                  </div>
              </div>
          </div>
        </div>
      </main>
      {errors.otp && <OtpForLogin setErrors={setErrors}  username={username} password={password}></OtpForLogin>}
    </div>
  );
};

export default SignInPage;