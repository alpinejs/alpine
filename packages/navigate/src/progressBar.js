
export function startProgressBar() {
    createBar()

    incrementBar()
}

export function endProgressBar(callback) {
    finishProgressBar(() => { destroyBar(); callback() })
}

function createBar() {
    let bar = document.createElement('div')

    bar.setAttribute('id', 'alpine-progress-bar')
    bar.setAttribute('x-navigate:persist', 'alpine-progress-bar')
    bar.setAttribute('style', `
        width: 100%;
        height: 5px;
        background: black;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        transition: all 0.5s ease;
        transform: scaleX(0);
        transform-origin: left;
    `)

    document.body.appendChild(bar)

    return bar
}

function incrementBar(goal = .1) {
    let bar = document.getElementById('alpine-progress-bar')

    if (! bar) return

    let percentage = Number(bar.style.transform.match(/scaleX\((.+)\)/)[1])

    if (percentage > 1) return

    bar.style.transform = 'scaleX(' + goal + ')'

    setTimeout(() => {
        incrementBar(percentage + .1)
    }, 50)
}

function finishProgressBar(callback) {
    let bar = document.getElementById('alpine-progress-bar')
    bar.style.transform = 'scaleX(1)'
    setTimeout(callback, 500)
}

function destroyBar() {
    document.getElementById('alpine-progress-bar').remove()
}
