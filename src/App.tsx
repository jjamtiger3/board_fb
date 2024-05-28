import { RouterProvider, createBrowserRouter } from "react-router-dom"
import Layout from "./components/layout";
import Home from "./routes/home";
import Login from "./routes/login";
import styled, { createGlobalStyle } from "styled-components";
import CreateAccount from "./routes/create-account";
import List from "./routes/list";
import Write from "./routes/write";
import ProtectedRoute from "./routes/ProtectedRoute";
import { useEffect, useState } from "react";
import { auth } from "./firebase";
import LoadingScreen from "./components/loading-screen";


const router = createBrowserRouter([
  {
    path: '/',
    element: <ProtectedRoute><Layout /></ProtectedRoute>,
    children: [
      {
        path: '',
        element: <Home />
      },
      {
        path: '/list',
        element: <List />
      },
      {
        path: '/write/:id?',
        element: <Write />
      },
    ]
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/create-account',
    element: <CreateAccount />
  },
]);

const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
  }
  body {
    background-color: black;
    color: white;
    font-family: system-ui, sans-serif;
  }
`;

const Wrapper = styled.div`
    height: 100vh;
    display: flex;
    justify-content: center;
`;

function App() {
  const [isLoading, setLoading] = useState(true);
  const init = async() => {
    await auth.authStateReady();
    setLoading(false);
  }

  useEffect(() => {
    init();
  }, []);
  return (
    <Wrapper>
      <GlobalStyles />
      {
        isLoading ? <LoadingScreen /> : <RouterProvider router={router} />
      }
    </Wrapper>
  )
}

export default App
