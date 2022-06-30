import React from "react";
import dice1 from "../images/dice-one.svg";
import dice2 from "../images/dice-two.svg";
import dice3 from "../images/dice-three.svg";
import dice4 from "../images/dice-four.svg";
import dice5 from "../images/dice-five.svg";
import dice6 from "../images/dice-six.svg";

export default function Die(props) {
  const styles = {
    backgroundColor: props.isHeld ? "#0792F5" : "white",
  };

  function selectDiceImage() {
    let diceImage;
    switch (props.value) {
      case 1:
        diceImage = dice1;
        break;
      case 2:
        diceImage = dice2;
        break;
      case 3:
        diceImage = dice3;
        break;
      case 4:
        diceImage = dice4;
        break;
      case 5:
        diceImage = dice5;
        break;
      case 6:
        diceImage = dice6;
        break;
      default:
    }
    return diceImage;
  }

  return (
    <div className="die-face" style={styles} onClick={props.holdDice}>
      <img className="diceImage" src={selectDiceImage()} alt='dice'/>
    </div>
  );
}

/*

 */
