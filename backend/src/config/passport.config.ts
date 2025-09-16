import {
  Strategy as JwtStrategy,
  ExtractJwt,
  StrategyOptions,
} from "passport-jwt";
import passport from "passport";
import { ENV_VARS } from "./env.config";
import { findByIdUserService } from "../services/user.service";

interface JwtPayload {
  userId: string;
}

const options: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: ENV_VARS.JWT_SECRET,
  audience: ["user"],
  algorithms: ["HS256"],
};

passport.use(
  new JwtStrategy(options, async (payload: JwtPayload, done) => {
    try {
      if (!payload.userId) {
        return done(null, false);
      }

      const user = await findByIdUserService(payload.userId);
      if (!user) return done(null, false);

      return done(null, user);
    } catch (error) {
      return done(null, false);
    }
  }),
);

passport.serializeUser((user:any,done)=>done(null,user));
passport.deserializeUser((user:any,done)=>done(null,user));

export const passportAuthenticateJwt = passport.authenticate("jwt", {
  session: false,
});

