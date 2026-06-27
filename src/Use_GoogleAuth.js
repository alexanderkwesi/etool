import AuthHeader from './Use_LoginHeader';
import AuthPage from './Use_Login';

const AuthPageWithHeader = ({ isLogin }) => {
  return (
    <div>
      <AuthHeader />
      <AuthPage isLogin={isLogin} />
    </div>
  );
};


export default AuthPageWithHeader;
