import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { auth } from "../firebase";
import { useState } from "react";

const Wrapper = styled.div`
    gap: 20px;
    height: 100%;
    padding: 50px 0;
    width: 100%;
    max-width: 860px;
`;
const Horizontal = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`;
const Profile = styled.div`
    gap: 20px;
    width: 300px;
    height: 120px;
    display: flex;
    align-items: center;
`;
const AvatarUpload = styled.label`
    width: 60px;
    overflow: hidden;
    height: 60px;
    border-radius: 50%;
    background-color: #1d9bf0;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    svg {
        width: 50px;
    }
`;
const AvatarImg = styled.img`
    width: 100%;
`;
const AvatarInput = styled.input`
    display: none;
`;
const Name = styled.span`
    font-size: 22px;
`;
const Menu = styled.div`
    display: flex;
    gap: 20px;
    height: 60px;
    justify-content: flex-end;
`;
const MenuItem = styled.div`
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid white;
    height: 50px;
    width: 50px;
    border-radius: 50%;
    svg {
        width: 30px;
        fill: white;
        color: white;
    }
    &.log-out {
        border-color: tomato;
        svg {
            fill: tomato
        }
    }
`;

export default function Layout() {
    const user = auth.currentUser;
    const navigate = useNavigate();
    const location = useLocation();
    const [avatar] = useState(user?.photoURL || '');
    const onLogOut = async () => {
        const ok = confirm('로그아웃 하시겠습니까?');
        if (ok) {
            await auth.signOut();
            navigate('/login');
        }
    }
    return (
        <Wrapper>
            <Horizontal>
                <Profile>
                    <AvatarUpload htmlFor="avatar">
                        {
                            Boolean(avatar) ? 
                                <AvatarImg src={avatar} /> : 
                                    <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                        <path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z"></path>
                                    </svg>
                        }
                    </AvatarUpload>
                    <AvatarInput 
                        id="avatar" 
                        type="file" 
                        accept="image/*" 
                        // onChange={onAvatarChange}
                    />
                    <Name>
                        {
                            user?.displayName ?? 'Anonymous'
                        }
                    </Name>
                </Profile>
                <Menu>
                    {
                        location.pathname.indexOf('/write') < 0 && 
                            <Link to="/write">
                                <MenuItem>
                                    <svg data-slot="icon" fill="none" strokeWidth="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"></path>
                                    </svg>
                                </MenuItem>
                            </Link>
                    }
                    <Link to="/list">
                        <MenuItem>
                            <svg fill="currentColor" strokeWidth="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"></path>
                            </svg>
                        </MenuItem>
                    </Link>
                    <Link to="/">
                        <MenuItem>
                            <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path clipRule="evenodd" fillRule="evenodd" d="M9.293 2.293a1 1 0 0 1 1.414 0l7 7A1 1 0 0 1 17 11h-1v6a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6H3a1 1 0 0 1-.707-1.707l7-7Z" />
                            </svg>
                        </MenuItem>
                    </Link>
                    <MenuItem className="log-out" onClick={onLogOut}>
                        <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path clipRule="evenodd" fillRule="evenodd" d="M17 4.25A2.25 2.25 0 0 0 14.75 2h-5.5A2.25 2.25 0 0 0 7 4.25v2a.75.75 0 0 0 1.5 0v-2a.75.75 0 0 1 .75-.75h5.5a.75.75 0 0 1 .75.75v11.5a.75.75 0 0 1-.75.75h-5.5a.75.75 0 0 1-.75-.75v-2a.75.75 0 0 0-1.5 0v2A2.25 2.25 0 0 0 9.25 18h5.5A2.25 2.25 0 0 0 17 15.75V4.25Z" />
                            <path clipRule="evenodd" fillRule="evenodd" d="M14 10a.75.75 0 0 0-.75-.75H3.704l1.048-.943a.75.75 0 1 0-1.004-1.114l-2.5 2.25a.75.75 0 0 0 0 1.114l2.5 2.25a.75.75 0 1 0 1.004-1.114l-1.048-.943h9.546A.75.75 0 0 0 14 10Z" />
                        </svg>
                    </MenuItem>
                </Menu>
            </Horizontal>
            <Outlet />
        </Wrapper>
    )
}