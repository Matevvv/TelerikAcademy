using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

// i think this class is complete
namespace Casino
{
    public class Card // discribes the plying card
    {
        private CardRank rank; // from the card rank class

        private CardSuit suit; // from the card suit class

        public CardRank CardRank  // property only get
        {
            get { return this.rank; } // returns the value of the rank
        }

        public CardSuit CardSuit // property only get
        {
            get { return this.suit; } // returns the suit of the card
        }

        public Card(CardRank rank, CardSuit suit) // main constructor for card
        {
            this.rank = rank;
            this.suit = suit;
        }
    }
}
