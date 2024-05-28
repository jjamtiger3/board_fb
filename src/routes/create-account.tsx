import { useState } from "react";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { Form, Input, Wrapper, Title, Switcher, Error } from "../components/auth-components";
import GithubButton from "../components/github-btns";
import GoogleButton from "../components/google-btns";

export default function CreateAccount() {
    const navigate = useNavigate();
    const [isLoading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { target: { name, value } } = e;
        switch(name) {
            case 'name':
                setName(value);
                break;
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
        if (isLoading || !name || !email || !password) {
            return;
        }
        try {
            setLoading(true);
            const credentials = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            await updateProfile(credentials.user, {
                displayName: name,
            });
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
        <Title>Join X</Title>
        <Form onSubmit={onSubmit}>
            <Input 
                onChange={onChange}
                name='name' 
                value={name} 
                placeholder="Name" 
                type="text" 
                required
            />
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
            <Input type="submit" value={isLoading ? 'Loading...' : 'Create Account'} />
        </Form>
        {
            error ? <Error>{error}</Error> : null
        }
        <Switcher>
            이미 계정이 있으신가요? <Link to="/login">Log In &rarr;</Link>
        </Switcher>
        <GithubButton />
        <GoogleButton />
    </Wrapper>
}