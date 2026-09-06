# Alpine.js

Go to the Alpine docs for most things: [Alpine Docs](https://alpinejs.dev)

You are welcome to submit updates to the docs by submitting a PR to this repo. Docs are located in the [`/packages/docs`](/packages/docs) directory.

Stay here for contribution-related information.

> Looking for V2 docs? [here they are](https://github.com/alpinejs/alpine/tree/v2.8.2)

<p align="center"><a href="https://alpinejs.dev/patterns"><img src="/hero.jpg" alt="Alpine Component Patterns"></a></p>

## Contribution Guide:

### Quickstart

* clone this repo locally
* run `npm install` & `npm run build`
* Include the `/packages/alpinejs/dist/cdn.js` file from a `<script>` tag on a webpage and you're good to go!

### Brief Tour
You can get everything installed with: `npm install` in the root directory of this repo after cloning it locally.

This repo is a "mono-repo" using npm workspaces for managing the packages. Each package has its own folder in the `/packages` directory.

Rather than having to run separate builds for each package, all package bundles are handled with the same command: `npm run build`

Here's a brief look at each package in this repo:

Package | Description
--- | ---
[alpinejs](packages/alpinejs) | The main Alpine repo with all of Alpine's core
[collapse](packages/collapse) | A plugin for expanding and collapsing elements using smooth animations
[csp](packages/csp) | A repo to provide a "CSP safe" build of Alpine
[docs](packages/docs) | The Alpine documentation
[focus](packages/focus) | A plugin that allows you to manage focus inside an element
[history](packages/history) | A plugin for binding data to query string parameters using the history API (name is likely to change)
[intersect](packages/intersect) | A plugin for triggering JS expressions based on elements intersecting with the viewport
[mask](packages/mask) | A plugin for automatically formatting a text input field as a user types
[morph](packages/morph) | A plugin for morphing HTML (like morphdom) inside the page intelligently
[persist](packages/persist) | A plugin for persisting Alpine state across page loads

The compiled JS files (as a result of running `npm run [build/watch]`) to be included as a `<script>` tag for example are stored in each package's `packages/[package]/dist` directory.

Each package should at least have: a "cdn" build that is self-initializing and can be included using the `src` attribute in a `<script defer>` tag, and a `module.[esm/cjs].js` file that is used for importing as a JS module (cjs for node, esm for everything else).

The bundling for Alpine V3 is handled exclusively by ESBuild. All of the configuration for these builds is stored in the `scripts/build.js` file.

### Testing
There are 2 different testing tools used in this repo: Cypress (for integration tests), and Vitest (for unit tests).

All tests are stored inside the `/tests` folder under `/tests/cypress` and `/tests/vitest`.

If you wish to only run Cypress and open it's user interface (recommended during development), you can run: `npm run cypress`

If you wish to only run Vitest tests, you can run `npm run vitest` like normal and target specific tests.


## 🌐 Web Resources & Interactive Index
- [BARK BLAST](https://thequizzone.pages.dev/bark-blast.html)
- [CATEGORY WEBGAME](https://quizverses-9d2f2.web.app/category-webgame.html)
- [BRAINROT MEGA PARKOUR](https://studyquests.github.io/brainrot-mega-parkour.html)
- [STICKER PUZZLE BOOK](https://themindskillplayplay.pages.dev/sticker-puzzle-book.html)
- [CATEGORY PREMIUM PERKS71](https://studyquests.github.io/category-premium-perks71.html)
- [NIGHT CLUB SECURITY](https://learnquester.github.io/night-club-security.html)
- [SUPERHEROES AND THE WAND](https://quizverses.pages.dev/superheroes-and-the-wand.html)
- [GRIDDLERS DELUXE](https://studyquests.pages.dev/griddlers-deluxe.html)
- [SORT MY PARKING AREA](https://quizverses.pages.dev/sort-my-parking-area.html)
- [INDEX4](https://studyplaying.github.io/index4.html)
- [CAP](https://learnquester.github.io/cap.html)
- [CATEGORY MOUSE](https://studyplayings.pages.dev/category-mouse.html)
- [HAPPY BUBBLES](https://quizverses.pages.dev/happy-bubbles.html)
- [CRAFT MAN VS GIANT TNT](https://quizverses-9d2f2.web.app/craft-man-vs-giant-tnt.html)
- [OBBY PINATA PARTY](https://learnquester.github.io/obby-pinata-party.html)
- [FRIDAY NIGHT SPRUNKI](https://studyplayings.pages.dev/friday-night-sprunki.html)
- [CATEGORY RPG80](https://studyplayings.pages.dev/category-rpg80.html)
- [STICKER BOOK PUZZLE COLOR BY NUMBER](https://quizverses.github.io/sticker-book-puzzle-color-by-number.html)
- [SUPERMARKET SIMULATOR DREAM STORE](https://studyquests.pages.dev/supermarket-simulator-dream-store.html)
- [JUST LUDO](https://studyquests.github.io/just-ludo.html)
- [HOLIDAY HEX SORT](https://studyquests.github.io/holiday-hex-sort.html)
- [BRICK BREAKER CHIPI CHIPI CHAPA CHAPA CAT](https://quizverses.pages.dev/brick-breaker-chipi-chipi-chapa-chapa-cat.html)
- [PIRATE PARADISE](https://studyquests.github.io/pirate-paradise.html)
- [CATEGORY MATCH 3117](https://studyplayings.pages.dev/category-match-3117.html)
- [ORGANIZE IT](https://studyquests.github.io/organize-it.html)
- [ZOMBIES WEAPON MERGE 4](https://studyquesthub.web.app/zombies-weapon-merge-4.html)
- [CATEGORY ROBOT49](https://studyquests.pages.dev/category-robot49.html)
- [TANGLE MASTER 3D](https://studyplayings.web.app/tangle-master-3d.html)
- [CATEGORY COOKING46](https://studyquesthub.web.app/category-cooking46.html)
- [CATEGORY CARE](https://studyquests.pages.dev/category-care.html)
- [CATEGORY SOLITAIRE27](https://studyplayings.web.app/category-solitaire27.html)
- [CATEGORY IDLE448](https://learnquester.github.io/category-idle448.html)
- [OFFLINE FPS ROYALE](https://quizverses-9d2f2.web.app/offline-fps-royale.html)
- [YUMMY TALES 4](https://quizverses.pages.dev/yummy-tales-4.html)
- [FARM BLAST](https://quizverses.github.io/farm-blast.html)
- [SMASHDOLL](https://studyplaying.github.io/smashdoll.html)
- [COINS](https://studyquests.pages.dev/coins.html)
- [CATEGORY PHYSICS371](https://quizverses-9d2f2.web.app/category-physics371.html)
- [AGENT SQUAD](https://studyquests.pages.dev/agent-squad.html)
- [CATEGORY COLLECT565](https://studyplayings.pages.dev/category-collect565.html)
- [PLANT MERGE ZOMBIE WAR](https://studyquesthub.web.app/plant-merge-zombie-war.html)
- [CLONEUP STACK YOURSELF](https://studyplayings.pages.dev/cloneup-stack-yourself.html)
- [CATEGORY THINKY](https://quizverses-9d2f2.web.app/category-thinky.html)
- [WARFRONT](https://studyquests.github.io/warfront.html)
- [DUCKLINGS](https://learnquester.github.io/ducklings.html)
- [CATEGORY HUB](https://studyplayings.pages.dev/category-hub.html)
- [GOLF ORBIT](https://studyquests.pages.dev/golf-orbit.html)
- [SAMURAI MADNESS](https://studyquesthub.web.app/samurai-madness.html)
- [HOME ISLAND](https://learnquester.github.io/home-island.html)
- [CATEGORY BRAIN261](https://studyplayings.web.app/category-brain261.html)
- [WAVE DASH GEOMETRY ARROW](https://studyquesthub.web.app/wave-dash-geometry-arrow.html)
- [SUGAR POP LAND](https://studyplayings.pages.dev/sugar-pop-land.html)
- [LOVIE CHICS SPRING BREAK FASHION](https://quizverses-9d2f2.web.app/lovie-chics-spring-break-fashion.html)
- [BARK BLAST](https://studyquests.pages.dev/bark-blast.html)
- [INDEX2](https://studyplayings.web.app/index2.html)
- [ALPHABET LORE MAZE](https://quizverses.pages.dev/alphabet-lore-maze.html)
- [XYTRIAN RUNNER](https://studyquests.github.io/xytrian-runner.html)
- [ONLINE PORTAL](https://studyplayings.web.app/)
- [GARDEN GUARDIANS](https://learnquester.github.io/garden-guardians.html)
- [ASMR WASHING FIXING](https://studyplaying.github.io/asmr-washing-fixing.html)
- [CATEGORY SURVIVAL365](https://quizverses-9d2f2.web.app/category-survival365.html)
- [SNIPER MASTER](https://studyplaying.github.io/sniper-master.html)
- [ASOKA MAKEUP INDIAN BRIDE](https://studyquests.github.io/asoka-makeup-indian-bride.html)
- [SHOOT RUN MONSTER HUNTING](https://studyplayings.pages.dev/shoot-run-monster-hunting.html)
- [THE FLOWERS MERGE AND SELL BOUQUETS](https://quizverses-9d2f2.web.app/the-flowers-merge-and-sell-bouquets.html)
- [TRIAL XTREME](https://quizverses.pages.dev/trial-xtreme.html)
- [FUN GOLF](https://studyquests.github.io/fun-golf.html)
- [GROW CASTLE DEFENCE](https://quizverses-9d2f2.web.app/grow-castle-defence.html)
- [ANIMAL TRANSFORM RACE](https://studyquests.pages.dev/animal-transform-race.html)
- [GUN CLONE](https://quizverses.github.io/gun-clone.html)
- [DINO HUNTER KING](https://quizverses.pages.dev/dino-hunter-king.html)
- [MY HAPPY FARM](https://quizverses.pages.dev/my-happy-farm.html)
- [CATEGORY CASUAL 5](https://studyplaying.github.io/category-casual-5.html)
- [CATEGORY DRIFTING116](https://quizverses-9d2f2.web.app/category-drifting116.html)
- [DUDU ENGINEERING TRUCK](https://quizverses.pages.dev/dudu-engineering-truck.html)
- [TOY CARS 3D RACING](https://quizverses-9d2f2.web.app/toy-cars-3d-racing.html)
- [CROSS THE ROAD](https://studyquesthub.web.app/cross-the-road.html)
- [SUMMER CONNECT](https://studyquesthub.web.app/summer-connect.html)
- [PONGOAL](https://learnquester.github.io/pongoal.html)
- [BRAIN DRAW LINE](https://studyplayings.pages.dev/brain-draw-line.html)
- [DELICIOUS EMILYS NEW BEGINNING VALENTINES EDITION](https://quizverses-9d2f2.web.app/delicious-emilys-new-beginning-valentines-edition.html)
- [RED HIDE BALL](https://quizverses-9d2f2.web.app/red-hide-ball.html)
- [THE SORT AGENCY](https://studyquests.pages.dev/the-sort-agency.html)
- [MERGE SHOOTER](https://studyquests.github.io/merge-shooter.html)
- [SAFARI STORY MAHJONG](https://quizverses.pages.dev/safari-story-mahjong.html)
- [HOOP WORLD 3D](https://studyquests.pages.dev/hoop-world-3d.html)
- [CATEGORY ROGUELIKE38](https://learnquester.github.io/category-roguelike38.html)
- [SPRUNKI JIGSAW PUZZLE](https://quizverses.pages.dev/sprunki-jigsaw-puzzle.html)
- [CATEGORY DRAWING GAMES](https://studyplayings.pages.dev/category-drawing-games.html)
- [SLIDE RABBIT](https://studyquests.github.io/slide-rabbit.html)
- [MAKE TEN TILES](https://studyquests.pages.dev/make-ten-tiles.html)
- [BLOCK BLAST JEWEL PUZZLE](https://studyquesthub.web.app/block-blast-jewel-puzzle.html)
- [CATEGORY WAR137](https://quizverses-9d2f2.web.app/category-war137.html)
- [DARING JACK](https://quizverses.pages.dev/daring-jack.html)
- [YUMMY TALES 3](https://quizverses.pages.dev/yummy-tales-3.html)
- [CATEGORY 1 PLAYER139](https://quizverses-9d2f2.web.app/category-1-player139.html)
- [CATEGORY MINECRAFT](https://quizverses-9d2f2.web.app/category-minecraft.html)
- [SPACE BLAST](https://studyquests.github.io/space-blast.html)
- [BRAINROT HOLE](https://studyquests.github.io/brainrot-hole.html)
- [MOTORCYCLE RACER ROAD MAYHEM](https://quizverses.pages.dev/motorcycle-racer-road-mayhem.html)
- [CATEGORY CARTOON76](https://studyplayings.pages.dev/category-cartoon76.html)
- [DAYCARE TYCOON](https://quizverses.pages.dev/daycare-tycoon.html)
- [SAVE THE CATS BUBBLE SHOOTER](https://studyquests.github.io/save-the-cats-bubble-shooter.html)
- [OMG WORD RAINBOW](https://quizverses.pages.dev/omg-word-rainbow.html)
- [IDLE BASEBALL TYCOON](https://studyquests.pages.dev/idle-baseball-tycoon.html)
- [CATEGORY ARENA254](https://quizverses-9d2f2.web.app/category-arena254.html)
- [3D BASKETBALLIO DUNK SPORT](https://quizverses-9d2f2.web.app/3d-basketballio-dunk-sport.html)
- [SOLITAIRE FARM SEASONS 3](https://quizverses-9d2f2.web.app/solitaire-farm-seasons-3.html)
- [ASSOCIATIONS](https://quizverses-9d2f2.web.app/associations.html)
- [MEGA SHARK](https://quizverses.pages.dev/mega-shark.html)
- [PHRASLE MASTER](https://quizverses-9d2f2.web.app/phrasle-master.html)
- [SPIDER SOLITAIRE 2 SUITS](https://studyquesthub.web.app/spider-solitaire-2-suits.html)
- [CATEGORY 3D1 371](https://studyplaying.github.io/category-3d1-371.html)
- [JEWEL LEGEND QUEST](https://quizverses.github.io/jewel-legend-quest.html)
- [MAKEUP STACK](https://quizverses-9d2f2.web.app/makeup-stack.html)
- [CATEGORY WEBGAME](https://learnquester.github.io/category-webgame.html)
- [STREET BALL JAM](https://studyquests.github.io/street-ball-jam.html)
- [CATEGORY TRAFFIC34](https://quizverses-9d2f2.web.app/category-traffic34.html)
- [BUBBLE LETTERS](https://studyquesthub.web.app/bubble-letters.html)
- [CATEGORY TRAIN YOUR BRAIN24](https://studyplayings.pages.dev/category-train-your-brain24.html)
- [SNOW BALL RACING MUTLIPLAYER](https://quizverses-9d2f2.web.app/snow-ball-racing-mutliplayer.html)
- [XYTRIAN RUNNER](https://quizverses-9d2f2.web.app/xytrian-runner.html)
- [CATEGORY BUILDING182](https://studyplayings.pages.dev/category-building182.html)
- [CATEGORY HORROR 2](https://studyquesthub.web.app/category-horror-2.html)
- [UNSCREW WOOD PUZZLE](https://quizverses-9d2f2.web.app/unscrew-wood-puzzle.html)
- [STUPIDITY TEST](https://studyplayings.pages.dev/stupidity-test.html)
- [ALIEN INTELLIGENCE TEST](https://quizverses.pages.dev/alien-intelligence-test.html)
- [CATEGORY MOBILE2 095](https://studyplaying.github.io/category-mobile2-095.html)
- [MAGIC AND WIZARDS MAHJONG](https://studyquests.pages.dev/magic-and-wizards-mahjong.html)
- [CATEGORY STRATEGY 2](https://quizverses-9d2f2.web.app/category-strategy-2.html)
