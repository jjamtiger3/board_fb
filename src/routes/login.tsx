import { useState } from "react";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Form, Input, Wrapper, Title, Switcher, Error } from "../components/auth-components";
import GithubButton from "../components/github-btns";
import GoogleButton from "../components/google-btns";

export default function Login() {
    const navigate = useNavigate();
    const [isLoading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { target: { name, value } } = e;
        switch(name) {
            case 'email':
                setEmail(value);
                break;
            case 'password':
                setPassword(value);
                break;
            default:
                break;
        }
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        if (isLoading || !email || !password) {
            return;
        }
        try {
            setLoading(true);
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/');
        } catch(e) {
            if (e instanceof FirebaseError) {
                const errorMsg = {
                    'auth/email-already-in-use': '이메일이 이미 사용중입니다'
                }[e.code] || e.message;
                setError(errorMsg);
            }
        } finally {
            setLoading(false)
        }
    }
    
    return <Wrapper>
        <Title>Login</Title>
        <Form onSubmit={onSubmit}>
            <Input 
                onChange={onChange}
                name='email' 
                value={email} 
                placeholder="Email" 
                type="email" 
                required
            />
            <Input 
                onChange={onChange}
                name='password' 
                value={password} 
                placeholder="password" 
                type="password" 
                required
            />
            <Input type="submit" value={isLoading ? 'Loading...' : 'LogIn'} />
        </Form>
        {
            error ? <Error>{error}</Error> : null
        }
        <Switcher>
            계정이 없으신가요? <Link to="/create-account">Create one &rarr;</Link>
        </Switcher>
        <GithubButton />
        <GoogleButton />
    </Wrapper>
}