import { Container } from 'react-bootstrap';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import AuthWrapper from 'components/AuthWrapper';
import NavBar from 'components/NavBar';
import HomePage from 'pages/HomePage';
import ItemAddPage from 'pages/ItemAddPage';
import ItemEditPage from 'pages/ItemEditPage';
import ItemsPage from 'pages/ItemsPage';
import LoginPage from 'pages/LoginPage';
import SaleAddPage from 'pages/SaleAddPage';
import SaleEditPage from 'pages/SaleEditPage';
import SalesPage from 'pages/SalesPage';
import UserAddPage from 'pages/UserAddPage';
import UserEditPage from 'pages/UserEditPage';
import UsersPage from 'pages/UsersPage';

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
                        <Route exact path="/items" render={() => <ItemsPage fetchApi={fetchApi} />} />
                        <Route exact path="/items/new" render={() => <ItemAddPage fetchApi={fetchApi} />} />
                        <Route exact path="/items/:id" render={() => <ItemEditPage fetchApi={fetchApi} />} />
                        <Route exact path="/sales" render={() => <SalesPage fetchApi={fetchApi} />} />
                        <Route exact path="/sales/new" render={() => <SaleAddPage fetchApi={fetchApi} />} />
                        <Route exact path="/sales/:id" render={() => <SaleEditPage fetchApi={fetchApi} />} />

                        {user.isAdmin && (
                          <Switch>
                            <Route exact path="/users" render={() => <UsersPage fetchApi={fetchApi} user={user} />} />
                            <Route exact path="/users/new" render={() => <UserAddPage fetchApi={fetchApi} />} />
                            <Route exact path="/users/:id" render={() => <UserEditPage fetchApi={fetchApi} />} />
                          </Switch>
                        )}
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
