import React from 'react'

import dice1 from './img/dice-1.png'
import dice2 from './img/dice-2.png'
import dice3 from './img/dice-3.png'
import dice4 from './img/dice-4.png'
import dice5 from './img/dice-5.png'
import dice6 from './img/dice-6.png'

class App extends React.Component {
    state = {
        megaScores: [0, 0],
        currScore: 0,
        activePlayer: 0,
        imgToShow: null,
        winnerPlayer: null
    }

    switchImages = randomNumber => {
        switch (randomNumber) {
            case 1:
                return dice1
            case 2:
                return dice2
            case 3:
                return dice3
            case 4:
                return dice4
            case 5:
                return dice5
            case 6:
                return dice6
            default:
                return null
        }
    }

    switchPlayers = async () => {
        await this.setState({
            activePlayer: this.state.activePlayer === 0 ? 1 : 0,
            currScore: 0,
            imgToShow: this.switchImages(1)
        })
    }

    winPlayers = async () => {
        await this.setState({
            winnerPlayer: this.state.activePlayer,
            imgToShow: null,
            currScore: 0
        })
        document.querySelector('.btn--roll').style.display = 'none'
        document.querySelector('.btn--hold').style.display = 'none'
    }

    rollDice = async () => {
        // 1) Roll the dice
        const randomNumber = Math.floor(Math.random() * 6) + 1

        // 2) If the random Number is 1, then change the activePlayer
        if (randomNumber === 1) {
            await this.switchPlayers()
            return
        }

        await this.setState({
            currScore: this.state.currScore + randomNumber
        })
        await this.setState({
            imgToShow: this.switchImages(randomNumber)
        })
    }

    handleHold = async () => {
        // 1) Add the currScore to the megaScore with respective to activePlayer
        const { activePlayer, currScore, megaScores } = this.state
        let megaScore = megaScores[activePlayer] + currScore

        if (activePlayer === 0) {
            await this.setState({
                megaScores: [megaScore, this.state.megaScores[1]]
            })
        } else {
            await this.setState({
                megaScores: [this.state.megaScores[0], megaScore]
            })
        }

        // 2) Check if the score is greater or equal to 100, set the winnerPlayer
        if (this.state.megaScores[activePlayer] >= 100) {
            await this.winPlayers()
            return
        }

        // 3) Otherwise just switch the players
        await this.switchPlayers()
    }

    handleNewGame = async () => {
        await this.setState({
            megaScores: [0, 0],
            currScore: 0,
            activePlayer: 0,
            imgToShow: null,
            winnerPlayer: null
        })
        document.querySelector('.btn--roll').style.display = 'block'
        document.querySelector('.btn--hold').style.display = 'block'
    }

    render() {
        return (
            <main>
                {this.state.megaScores.map((megaScore, index) => (
                    <section
                        key={index}
                        className={`player player--${index} ${
                            this.state.activePlayer === index ? ' player--active' : ''
                        } ${this.state.winnerPlayer === index ? 'player--winner' : ''}`}
                    >
                        <h2 className="name" id={`name-${index}`}>
                            Player {index}
                        </h2>
                        <p className="score" id={`score--${index}`}>
                            {megaScore}
                        </p>
                        <div className="current">
                            <p className="current-label">Current</p>
                            <p className="current-score" id={`current--${index}`}>
                                {this.state.activePlayer === index ? this.state.currScore : '0'}
                            </p>
                        </div>
                    </section>
                ))}

                {this.state.imgToShow && (
                    <img src={this.state.imgToShow} alt="Playing dice" className="dice" />
                )}

                <button className="btn btn--new" onClick={this.handleNewGame}>
                    🔄 New game
                </button>
                <button className="btn btn--roll" onClick={this.rollDice}>
                    🎲 Roll dice
                </button>
                <button className="btn btn--hold" onClick={this.handleHold}>
                    📥 Hold
                </button>
            </main>
        )
    }
}

export default App
