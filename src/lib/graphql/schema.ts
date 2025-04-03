import { builder } from './builder';

// Import all type definitions
import './types/User';
import './types/Recipe';
import './types/Product';
import './types/Order';
import './types/Subscription';
import './types/Query';

export const schema = builder.toSchema(); 