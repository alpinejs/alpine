import { morph, morphBetween } from './morph'

export default function (Alpine) {
    Alpine.morph = morph
    Alpine.morphBetween = morphBetween
}

export { morph, morphBetween }
