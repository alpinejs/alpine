import { useState } from '../useState'
import { magic } from '../magics'

magic('useState', (initialValue) => useState(initialValue))
