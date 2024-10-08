

// import { ToastContainer } from 'react-toastify';
import './App.css';
import StyleGlobal from './components/StyleGlobal';
import AppRouter from './routes/Router';
import { useEffect } from 'react';
import { userStore } from './zustand/store';
import { authAPI } from './service/auth';


function App() {
  const user = userStore((state) => state.user);
  const setUser = userStore((state) => state.setUser)
  useEffect(() => {
    const loginWithToken = async () => {
      const res = await authAPI.loginWithToken();

      if (res.status == 200) {
        if (res.user.avatar == null) {

          const newUser = {
            ...res.user,
            avatar: " "
          }
          setUser(newUser);
          return;
        }
        setUser(res.user)

      }
    }
    if (Object.keys(user).length === 0) {
      loginWithToken()
    }


  }, [])
  return (
    <StyleGlobal>
      <div className='App'>
        <AppRouter />

      </div>
    </StyleGlobal>
  );
}

export default App;
