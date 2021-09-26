import { Container } from 'react-bootstrap';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import AuthWrapper from 'components/AuthWrapper';
import NavBar from 'components/NavBar';
import HomePage from 'pages/HomePage';
import LoginPage from 'pages/LoginPage';
import SalesAddPage from 'pages/SaleAddPage';
import SalesEditPage from 'pages/SaleEditPage';
import SalesPage from 'pages/SalesPage';

import 'App.scss';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthWrapper>
          {({ fetchApi, onLogin, onLogout, user }) => {
            return (
              <>
                <NavBar onLogout={onLogout} user={user} />
                <Container className="container">
                    {user ? (
                      <Switch>
                        <Route component={HomePage} exact path="/" />
                        <Route exact path="/sales" render={() => <SalesPage fetchApi={fetchApi} />} />
                        <Route exact path="/sales/new" render={() => <SalesAddPage fetchApi={fetchApi} />} />
                        <Route exact path="/sales/:id" render={() => <SalesEditPage fetchApi={fetchApi} />} />
                      </Switch>
                    ) : (
                      <Switch>
                        <Route path="/login" render={() => <LoginPage onLogin={onLogin} />} />
                      </Switch>
                    )}
                </Container>
              </>
            );
          }}
        </AuthWrapper>
      </BrowserRouter>
    </div>
  );
}

export default App;
