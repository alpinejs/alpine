import { haveClasses, beVisible, haveAttribute, haveText, html, notBeVisible, notExist, test, haveFocus, notHaveClasses, notHaveAttribute } from '../../../utils'

test('it works',
    [html`
        <div x-data x-menu>
            <span>
                <button x-menu:button trigger>
                    <span>Options</span>
                </button>
            </span>

            <div x-menu:items items>
                <div>
                    <p>Signed in as</p>
                    <p>tom@example.com</p>
                </div>

                <div>
                    <a x-menu:item href="#account-settings">
                        Account settings
                    </a>
                    <a x-menu:item href="#support">
                        Support
                    </a>
                    <a x-menu:item disabled href="#new-feature">
                        New feature (soon)
                    </a>
                    <a x-menu:item href="#license">
                        License
                    </a>
                </div>
                <div>
                    <a x-menu:item href="#sign-out">
                        Sign out
                    </a>
                </div>
            </div>
        </div>`],
    ({ get }) => {
        get('[items]').should(notBeVisible())
        get('[trigger]').click()
        get('[items]').should(beVisible())
    },
)

test('focusing away closes menu',
    [html`
    <div>
        <div x-data x-menu>
            <span>
                <button x-menu:button trigger>
                    <span>Options</span>
                </button>
            </span>
            <div x-menu:items items>
                <div>
                    <p>Signed in as</p>
                    <p>tom@example.com</p>
                </div>
                <div>
                    <a x-menu:item href="#account-settings">
                        Account settings
                    </a>
                    <a x-menu:item href="#support">
                        Support
                    </a>
                    <a x-menu:item href="#license">
                        License
                    </a>
                </div>
                <div>
                    <a x-menu:item href="#sign-out">
                        Sign out
                    </a>
                </div>
            </div>
        </div>

        <button>Focus away</button>
    </div>
    `],
    ({ get }) => {
        get('[items]').should(notBeVisible())
        get('[trigger]').click()
        get('[items]').should(beVisible())
        cy.focused().tab()
        get('[items]').should(notBeVisible())
    },
)

test('it works with x-model',
    [html`
        <div x-data="{ open: false }" x-menu x-model="open">
            <button trigger @click="open = !open">
                <span>Options</span>
            </button>

            <button x-menu:button>
                <span>Options</span>
            </button>

            <div x-menu:items items>
                <div>
                    <p>Signed in as</p>
                    <p>tom@example.com</p>
                </div>

                <div>
                    <a x-menu:item href="#account-settings">
                        Account settings
                    </a>
                    <a x-menu:item href="#support">
                        Support
                    </a>
                    <a x-menu:item disabled href="#new-feature">
                        New feature (soon)
                    </a>
                    <a x-menu:item href="#license">
                        License
                    </a>
                </div>
                <div>
                    <a x-menu:item href="#sign-out">
                        Sign out
                    </a>
                </div>
            </div>
        </div>`],
    ({ get }) => {
        get('[items]').should(notBeVisible())
        get('[trigger]').click()
        get('[items]').should(beVisible())
        get('[trigger]').click()
        get('[items]').should(notBeVisible())
    },
)

test('keyboard controls',
    [html`
        <div x-data x-menu>
            <span>
                <button x-menu:button trigger>
                    <span>Options</span>
                </button>
            </span>

            <div x-menu:items items>
                <div>
                    <p>Signed in as</p>
                    <p>tom@example.com</p>
                </div>

                <div>
                    <a x-menu:item href="#account-settings" :class="$menuItem.isActive && 'active'">
                        Account settings
                    </a>
                    <a x-menu:item href="#support" :class="$menuItem.isActive && 'active'">
                        Support
                    </a>
                    <a x-menu:item disabled href="#new-feature" :class="$menuItem.isActive && 'active'">
                        New feature (soon)
                    </a>
                    <a x-menu:item href="#license" :class="$menuItem.isActive && 'active'">
                        License
                    </a>
                </div>
                <div>
                    <a x-menu:item href="#sign-out" :class="$menuItem.isActive && 'active'">
                        Sign out
                    </a>
                </div>
            </div>
        </div>`],
    ({ get }) => {
        get('.active').should(notExist())
        get('[trigger]').type(' ')
        get('[items]')
            .should(beVisible())
            .should(haveFocus())
            .type('{downarrow}')
        get('[href="#account-settings"]')
            .should(haveClasses(['active']))
        get('[items]')
            .type('{downarrow}')
        get('[href="#support"]')
            .should(haveClasses(['active']))
            .type('{downarrow}')
        get('[href="#license"]')
            .should(haveClasses(['active']))
        get('[items]')
            .type('{uparrow}')
        get('[href="#support"]')
            .should(haveClasses(['active']))
        get('[items]')
            .type('{home}')
        get('[href="#account-settings"]')
            .should(haveClasses(['active']))
        get('[items]')
            .type('{end}')
        get('[href="#sign-out"]')
            .should(haveClasses(['active']))
        get('[items]')
            .type('{pageUp}')
        get('[href="#account-settings"]')
            .should(haveClasses(['active']))
        get('[items]')
            .type('{pageDown}')
        get('[href="#sign-out"]')
            .should(haveClasses(['active']))
        get('[items]')
            .tab()
            .should(haveFocus())
            .should(beVisible())
            .tab({ shift: true})
            .should(haveFocus())
            .should(beVisible())
            .type('{esc}')
            .should(notBeVisible())
    },
)

test('keyboard controls with x-teleport',
    [html`
        <div x-data x-menu>
            <span>
                <button x-menu:button trigger>
                    <span>Options</span>
                </button>
            </span>

            <template x-teleport="body">
                <div x-menu:items items>
                    <a x-menu:item href="#account-settings" :class="$menuItem.isActive && 'active'">
                        Account settings
                    </a>
                    <a x-menu:item href="#support" :class="$menuItem.isActive && 'active'">
                        Support
                    </a>
                </div>
            </template>
        </div>`],
    ({ get }) => {
        get('.active').should(notExist())
        get('[trigger]').type(' ')
        get('[items]')
            .should(beVisible())
            .should(haveFocus())
            .type('{downarrow}')
        get('[href="#account-settings"]')
            .should(haveClasses(['active']))
        get('[items]')
            .type('{downarrow}')
        get('[href="#support"]')
            .should(haveClasses(['active']))
            .type('{uparrow}')
        get('[href="#account-settings"]')
            .should(haveClasses(['active']))
        get('[items]')
            .tab()
            .should(haveFocus())
            .should(beVisible())
            .tab({ shift: true})
            .should(haveFocus())
            .should(beVisible())
            .type('{esc}')
            .should(notBeVisible())
    },
)

test('search',
    [html`
        <div x-data x-menu>
            <span>
                <button x-menu:button trigger>
                    <span>Options</span>
                </button>
            </span>

            <div x-menu:items items>
                <div>
                    <p>Signed in as</p>
                    <p>tom@example.com</p>
                </div>

                <div>
                    <a x-menu:item href="#account-settings" :class="$menuItem.isActive && 'active'">
                        Account settings
                    </a>
                    <a x-menu:item href="#support" :class="$menuItem.isActive && 'active'">
                        Support
                    </a>
                    <a x-menu:item disabled href="#new-feature" :class="$menuItem.isActive && 'active'">
                        New feature (soon)
                    </a>
                    <a x-menu:item href="#license" :class="$menuItem.isActive && 'active'">
                        License
                    </a>
                </div>
                <div>
                    <a x-menu:item href="#sign-out" :class="$menuItem.isActive && 'active'">
                        Sign out
                    </a>
                </div>
            </div>
        </div>`],
    ({ get, wait }) => {
        get('.active').should(notExist())
        get('[trigger]').click()
        get('[items]')
            .type('ac')
        get('[href="#account-settings"]')
            .should(haveClasses(['active']))
        wait(500)
        get('[items]')
            .type('si')
        get('[href="#sign-out"]')
            .should(haveClasses(['active']))
    },
)

test('has accessibility attributes',
    [html`
        <div x-data x-menu>
            <label x-menu:label>Options label</label>

            <span>
                <button x-menu:button trigger>
                    <span>Options</span>
                </button>
            </span>

            <div x-menu:items items>
                <div>
                    <p>Signed in as</p>
                    <p>tom@example.com</p>
                </div>

                <div>
                    <a x-menu:item href="#account-settings" :class="$menuItem.isActive && 'active'">
                        Account settings
                    </a>
                    <a x-menu:item href="#support" :class="$menuItem.isActive && 'active'">
                        Support
                    </a>
                    <a x-menu:item disabled href="#new-feature" :class="$menuItem.isActive && 'active'">
                        New feature (soon)
                    </a>
                    <a x-menu:item href="#license" :class="$menuItem.isActive && 'active'">
                        License
                    </a>
                </div>
                <div>
                    <a x-menu:item href="#sign-out" :class="$menuItem.isActive && 'active'">
                        Sign out
                    </a>
                </div>
            </div>
        </div>`],
    ({ get }) => {
        get('[trigger]')
            .should(haveAttribute('aria-haspopup', 'true'))
            .should(haveAttribute('aria-labelledby', 'alpine-menu-label-1'))
            .should(haveAttribute('aria-expanded', 'false'))
            .should(notHaveAttribute('aria-controls'))
            .should(haveAttribute('id', 'alpine-menu-button-1'))
            .click()
            .should(haveAttribute('aria-expanded', 'true'))
            .should(haveAttribute('aria-controls', 'alpine-menu-items-1'))

        get('[items]')
            .should(haveAttribute('aria-orientation', 'vertical'))
            .should(haveAttribute('role', 'menu'))
            .should(haveAttribute('id', 'alpine-menu-items-1'))
            .should(haveAttribute('aria-labelledby', 'alpine-menu-button-1'))
            .should(notHaveAttribute('aria-activedescendant'))
            .should(haveAttribute('tabindex', '0'))
            .type('{downarrow}')
            .should(haveAttribute('aria-activedescendant', 'alpine-menu-item-1'))

        get('[href="#account-settings"]')
            .should(haveAttribute('role', 'menuitem'))
            .should(haveAttribute('id', 'alpine-menu-item-1'))
            .should(haveAttribute('tabindex', '-1'))

        get('[href="#support"]')
            .should(haveAttribute('role', 'menuitem'))
            .should(haveAttribute('id', 'alpine-menu-item-2'))
            .should(haveAttribute('tabindex', '-1'))

        get('[items]')
            .type('{downarrow}')
            .should(haveAttribute('aria-activedescendant', 'alpine-menu-item-2'))
    },
)

test('$menuItem.isDisabled',
    [html`
        <div x-data x-menu>
            <label x-menu:label>Options label</label>

            <span>
                <button x-menu:button trigger>
                    <span>Options</span>
                </button>
            </span>

            <div x-menu:items items>
                <div>
                    <p>Signed in as</p>
                    <p>tom@example.com</p>
                </div>

                <div>
                    <a x-menu:item href="#account-settings" :class="{ 'active': $menuItem.isActive, 'disabled': $menuItem.isDisabled }">
                        Account settings
                    </a>
                    <a x-menu:item href="#support" :class="{ 'active': $menuItem.isActive, 'disabled': $menuItem.isDisabled }">
                        Support
                    </a>
                    <a x-menu:item disabled href="#new-feature" :class="{ 'active': $menuItem.isActive, 'disabled': $menuItem.isDisabled }">
                        New feature (soon)
                    </a>
                    <a x-menu:item href="#license" :class="{ 'active': $menuItem.isActive, 'disabled': $menuItem.isDisabled }">
                        License
                    </a>
                </div>
                <div>
                    <a x-menu:item href="#sign-out" :class="{ 'active': $menuItem.isActive, 'disabled': $menuItem.isDisabled }">
                        Sign out
                    </a>
                </div>
            </div>
        </div>`],
    ({ get }) => {
        get('[trigger]').click()
        get('[href="#account-settings"]').should(notHaveClasses(['disabled']))
        get('[href="#support"]').should(notHaveClasses(['disabled']))
        get('[href="#new-feature"]').should(haveClasses(['disabled']))
    },
)
