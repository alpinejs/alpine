import { magic } from '../magics';
import { closestRoot } from '../lifecycle';

magic('root', el => closestRoot(el))
