import React from 'react';
import Button from 'react-bootstrap/Button';

const JsonSuit = {
  "H": "Hearts",
  "C": "Clubs",
  "D": "Diamonds",
  "S": "Spades"
}

const JsonRank = {
  1: "Ace",
  2: "Two",
  3: "Three",
  4: "Four",
  5: "Five",
  6: "Six",
  7: "Seven",
  8: "Eight",
  9: "Nine",
  10: "Ten",
  11: "Jack",
  12: "Queen",
  13: "King",
}

const Card = (props) => {

  if('unknown' in props) {
    return <span>?</span>
  }

  const {suit, rank} = props.val
  const onClick = props.onSelect || ((c) => {})
  const disabled = !!props.notClickable

  const displaySuit = JsonSuit[suit]
  const displayRank = JsonRank[rank]
  const variant = suit == "H" || suit == "D" ? "outline-danger" : "outline-dark"
  return (<Button variant={variant} onClick={() => onClick(props.val)} disabled={disabled}>{displayRank} of {displaySuit}</Button>)
}

export default Card