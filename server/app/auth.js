const { promisify } = require('util');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { ExtractJwt, Strategy: JwtStrategy } = require('passport-jwt');
const { Strategy: LocalStrategy } = require('passport-local');

const { User } = require('./models/user');

// XXX should obviously be an environment variable but doesn't matter for this project
const TOKEN_SECRET = 'foobar';

passport.use(new LocalStrategy({
  usernameField: 'email',
  session: false
}, async (email, password, done) => {
  try {
    const user = await User.findOne({
      email
    });
    if (!user) {
      done(null, false);
      return;
    }

    const passwordCorrect = await bcrypt.compare(password, user.passwordHash);
    if (!passwordCorrect) {
      done(null, false);
      return;
    }

    done(null, {
      id: user._id.toString(),
      name: user.name,
      email: user.email
    });
  } catch (error) {
    console.error('error while authenticating user', {
      error
    });
    done(error);
  }
}));

passport.use('user', new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: TOKEN_SECRET
}, async (payload, done) => {
  try {
    const user = await User.findById(payload.id);
    done(null, {
      id: user._id.toString(),
      name: user.name,
      email: user.email
    });
  } catch (error) {
    console.error('error while verifying user', {
      error
    });
  }
}));

module.exports.authenticate = () => {
  return passport.authenticate('local', {
    session: false
  });
};

module.exports.decodeToken = async (token) => {
  try {
    const decoded = await promisify(jwt.verify)((token ?? '').replace('Bearer ', ''), TOKEN_SECRET);
    if (!decoded) {
      return null;
    }

    return decoded;
  } catch {
    return null;
  }
};

module.exports.initialise = () => {
  return passport.initialize();
};

module.exports.signUser = async (user) => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    token: await promisify(jwt.sign)({
      id: user.id
    }, TOKEN_SECRET)
  };
};

module.exports.verifyAuthed = () => {
  return passport.authenticate('user', {
    session: false
  });
};
