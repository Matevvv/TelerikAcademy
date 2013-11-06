using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;


// i think this class is complete
namespace Casino
{
    public class CardSuit
    {
        private char display;

        public readonly static CardSuit Diamonds;

        public readonly static CardSuit Hearts;

        public readonly static CardSuit Spades;

        public readonly static CardSuit Clubs;

        public readonly static CardSuit[] Suits;

        static CardSuit()
        {
            CardSuit.Diamonds = new CardSuit('\u0004');
            CardSuit.Hearts = new CardSuit('\u0003');
            CardSuit.Spades = new CardSuit('\u0006');
            CardSuit.Clubs = new CardSuit('\u0005');
            CardSuit[] allSuits = new CardSuit[4];
            allSuits[0] = CardSuit.Diamonds;
            allSuits[1] = CardSuit.Hearts;
            allSuits[2] = CardSuit.Spades;
            allSuits[3] = CardSuit.Clubs;
            CardSuit.Suits = allSuits;
        }

        public CardSuit(char display)
        {
            this.display = display;
        }

        public override string ToString()
        {
            string str = Convert.ToString(this.display);
            return str;
        }
    }
}
