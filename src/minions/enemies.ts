export const enemies = [
    {
        type: 'primary-goblin',
        name: 'goblin1',
        health: 100,
        speed: 2,
        imagePositions: {
            up: './images/goblin2_upwards.png',
            left: './images/goblin2_left.png',
            down: './images/goblin2_down.png',
            right: './images/goblin2_right.png',
        },
        attack: 20
    },
    {
        type: 'primary-goblin',
        name: 'goblin2',
        health: 300,
        speed: 1,
        imagePositions: {
            up: './images/goblin3_up.png',
            left: './images/goblin3_left.png',
            down: './images/goblin3_down.png',
            right: './images/goblin3_right.png'
        },
        attack: 50,
    },
    {
        type: 'primary-goblin',
        name: 'vasile',
        health: 10000,
        speed: 0.25,
        imagePositions: {
            up: './images/goblin5_up.png',
            left: './images/goblin5_left.png',
            down: './images/goblin5_down.png',
            right: './images/goblin5_right.png'
        },
        attack: 10,
    },
]
