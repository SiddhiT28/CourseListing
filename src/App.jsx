import { auth } from './firebase/db';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useStore } from './store/userStore';

import { Input } from './components/ui/input';
import { Toaster } from 'react-hot-toast';

function App() {
  const navigate = useNavigate();
  const logout = useStore((s) => s.userLogout);
  const searchFn = useStore((s) => s.search);

  return (
    <div className="flex flex-col min-h-screen">
      <Toaster />
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link
            to="/"
            className="text-foreground transition-colors hover:text-foreground"
          >
            Courses
          </Link>
        </nav>

        <form className="w-1/2 ml-auto">
          <Input onChange={e => {
            const {value} = e.target
            searchFn(value)
          }} placeholder="Search for courses" />
        </form>

        <div className="ml-auto flex items-center gap-3">
          {auth.currentUser ? (
            <div className="flex items-center gap-3">
              <Link to="/dashboard">
                <Avatar>
                  <AvatarImage src={auth.currentUser.photoURL} />
                  <AvatarFallback>US</AvatarFallback>
                </Avatar>
              </Link>
              <Button
                variant="outline"
                onClick={() => {
                  logout();
                  auth.signOut().then((res) => navigate('/login'));
                }}
              >
                Logout
              </Button>
            </div>
          ) : (
            <Button variant="outline" asChild>
              <Link to="/login">Login</Link>
            </Button>
          )}
        </div>
      </header>
      <main className="mt-4  flex-1  container">
        <Outlet />
      </main>
    </div>
  );
}

export default App;
