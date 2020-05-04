export function handleWingDirective(component, el) {
    // Source: ASCII Art Starwars - T-65B X-wing Space Superiority Starfighter
    // https://textart.io/art/_jOJdyj1DR77sIUdJZHWCweF/starwars-t-65b-x-wing-space-superiority-starfighter\
    let wing =
`
 ‏‎          ·                            ·                      ·
  ·                  ·             -)------+====+       ·
                           -)----====    ,'   ,'   ·                 ·‏‎ ‎‏‎ ‎
              ·                  \`.  \`.,;___,'                ·
                                   \`, |____l_\\
                     _,....------c==]""______ |
    ·      ·        "-:_____________  |____l_|]              ·     ·
                                  ,'"",'.   \`.
         ·                 -)-----====   \`.   \`.
                     ·            -)-------+====+       ·            ·‏‎ ‎‏‎ ‎
             ·                               ·

  // MAY THE FOURTH BE WITH YOU \\\\

`
    el.innerHTML = wing.replace(/ /gi, '&nbsp;').replace(/\n/gi, '<br>')

    el.style.backgroundColor = '#000'
    el.style.color = '#ffe81f'
}
