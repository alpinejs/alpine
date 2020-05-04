export function handleWingDirective(component, el) {
    // Source: ASCII Art Starwars - T-65B X-wing Space Superiority Starfighter
    // https://textart.io/art/_jOJdyj1DR77sIUdJZHWCweF/starwars-t-65b-x-wing-space-superiority-starfighter\
    el.innerHTML =
`
 ‏‎          ·                            ·                      ·
  ·                  ·             -)------+====+       ·
                           -)----====    ,'   ,'   ·                 ·‏‎ ‎‏‎ ‎
              ·                  \`.  \`.,;___,'                ·
                                   \`, |____l_\\
                     _,....------c==]""______ |
    ·      ·        "-:_____________  |____l_|]              ·     ·
                                  ,'"",'.   \`.
         ·                 -)-----====   \`.   \`.              LS
                     ·            -)-------+====+       ·            ·‏‎ ‎‏‎ ‎
             ·                               ·

  // MAY THE FOURTH BE WITH YOU \\\\

`
    el.style.backgroundColor = '#000'
    el.style.color = '#ffe81f'

}
