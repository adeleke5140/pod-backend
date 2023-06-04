import mongoose from 'mongoose';
// import { redis } from '../src/config/redis';

afterAll(() => {
  mongoose.disconnect();
  // redis.disconnect();
});
