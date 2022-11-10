import "./App.css";
import Die from "./components/Die";
import React, { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";

export default function App() {
	const [dice, setDice] = useState(allNewDice());
	const [tenzies, setTenzies] = useState(false);
	const [rollCount, setRollCounter] = useState(0);
	const [time, setTime] = useState(0);
	const [fastestTime, setFastestTime] = useState(
		JSON.parse(localStorage.getItem("fastestTime")) || null
	);
	const [leastRolls, setLeastRolls] = useState(
		JSON.parse(localStorage.getItem("leastRolls")) || null
	);

	// records best time
	useEffect(() => {
		const fastestTime = localStorage.getItem("fastestTime");
		if (tenzies) {
			if (!fastestTime) {
				localStorage.setItem("fastestTime", JSON.stringify(time));
			} else if (time < fastestTime) {
				setFastestTime(time);
			}
		}
	}, [time, tenzies]);

	// records least amount of rolls
	useEffect(() => {
		const leastRolls = localStorage.getItem("leastRolls");
		if (tenzies) {
			if (!leastRolls) {
				localStorage.setItem("leastRolls", JSON.stringify(rollCount));
			} else if (rollCount < leastRolls) {
				setLeastRolls(rollCount);
			}
		}
	}, [tenzies, rollCount]);

	// records time elapsed
	useEffect(() => {
		if (!tenzies) {
			let sec = setInterval(() => {
				setTime((prevTime) => prevTime + 1);
			}, 1000);
			return () => {
				clearInterval(sec);
			};
		} else {
			setTime((prevTime) => prevTime);
		}
	}, [tenzies]);

	// checks if all die are held
	useEffect(() => {
		const allHeld = dice.every((die) => die.isHeld);
		const firstValue = dice[0].value;
		const allSameValue = dice.every((die) => die.value === firstValue);
		if (allHeld && allSameValue) {
			setTenzies(true);
		}
	}, [dice]);

	// creates new randomised die
	function generateNewDie() {
		return {
			value: Math.ceil(Math.random() * 6),
			isHeld: false,
			id: nanoid(),
		};
	}

	// holds die if it's been clicked
	function holdDice(id) {
		setDice((oldDice) =>
			oldDice.map((die) => {
				return die.id === id ? { ...die, isHeld: !die.isHeld } : die;
			})
		);
	}

	// creates new dice
	function allNewDice() {
		const newDice = [];
		for (let i = 0; i < 10; i++) {
			newDice.push({
				value: Math.ceil(Math.random() * 6),
				isHeld: false,
				id: nanoid(),
			});
		}
		return newDice;
	}

	// rolls dice if they aren't held and also res
	function rollDice() {
		setDice((oldDice) =>
			oldDice.map((die) => {
				return die.isHeld ? die : generateNewDie();
			})
		);
		if (tenzies) {
			setTenzies(false);
			setDice(allNewDice());
			setRollCounter(-1);
			setTime(0);
		}
		setRollCounter((rollCount) => rollCount + 1);
	}

	// restarts the game
	function restartGame() {
		setTenzies(false);
		setDice(allNewDice());
		setRollCounter(0);
		setTime(0);
	}

	// creates 10 Die components
	const diceElements = dice.map((die) => (
		<Die
			key={die.id}
			value={die.value}
			isHeld={die.isHeld}
			holdDice={() => holdDice(die.id)}
		/>
	));

	return (
		<main>
			{tenzies && <Confetti />}
			<h1 className="title">Tenzies</h1>
			<p className="instructions">
				Roll until all dice are the same. Click each die to freeze it at its
				current value between rolls.
			</p>
			<div className="highscores">
				<p>Fastest Time: {fastestTime} 🏆</p>
				<p>Least Rolls: {leastRolls} 🎲</p>
			</div>
			<p className="counter">Number of rolls: {rollCount} 🎲</p>
			{!tenzies && <p className="timer">Time Elapsed: {time}⏱️</p>}
			{tenzies && (
				<p className="timer">Congratulations, time to finish was: {time} ⏱️</p>
			)}
			<div className="dice-container">{diceElements}</div>
			<div className="button-container">
				<button className="roll-dice" onClick={rollDice}>
					{tenzies ? "New Game" : "Roll"}
				</button>
				<button className="restart-game" onClick={restartGame}>
					Restart Game
				</button>
			</div>
		</main>
	);
}
