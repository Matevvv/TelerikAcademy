using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

// i think this class is complete
namespace Casino
{
    public class CardRank
    {
        private int value;  // holds the numerical value of the card rank
        private string display; // holds the way rank is drawn
        public readonly static CardRank Two; // this is 2-ka
        public readonly static CardRank Three; // this is 3-ka
        public readonly static CardRank Four; // this is 4-ka
        public readonly static CardRank Five; // this is 5-ca
        public readonly static CardRank Six; // this is 6-ca
        public readonly static CardRank Seven; // this is 7-ca
        public readonly static CardRank Eight;// this is 8-ca
        public readonly static CardRank Nine; // this is 9-ka
        public readonly static CardRank Ten; // this is 10
        public readonly static CardRank Jack; // this is Vale = 10
        public readonly static CardRank Queen; // this is dama = 10
        public readonly static CardRank King; // this is Pop = 10
        public readonly static CardRank Ace; // this is Aso = 11 or 1
        public readonly static CardRank[] Ranks; // this is array of all ranks

        public int Value  // only returns the actual value of the rank
        {
            get { return this.value; }
        }

        static CardRank()
        {
            CardRank.Two = new CardRank(2, "2");
            CardRank.Three = new CardRank(3, "3");
            CardRank.Four = new CardRank(4, "4");
            CardRank.Five = new CardRank(5, "5");
            CardRank.Six = new CardRank(6, "6");
            CardRank.Seven = new CardRank(7, "7");
            CardRank.Eight = new CardRank(8, "8");
            CardRank.Nine = new CardRank(9, "9");
            CardRank.Ten = new CardRank(10, "10");
            CardRank.Jack = new CardRank(10, "J");
            CardRank.Queen = new CardRank(10, "Q");
            CardRank.King = new CardRank(10, "K");
            CardRank.Ace = new CardRank(11, "A");
            CardRank[] all = new CardRank[13]; // holds all ranks
            all[0] = CardRank.Two;
            all[1] = CardRank.Three;
            all[2] = CardRank.Four;
            all[3] = CardRank.Five;
            all[4] = CardRank.Six;
            all[5] = CardRank.Seven;
            all[6] = CardRank.Eight;
            all[7] = CardRank.Nine;
            all[8] = CardRank.Ten;
            all[9] = CardRank.Jack;
            all[10] = CardRank.Queen;
            all[11] = CardRank.King;
            all[12] = CardRank.Ace;
            CardRank.Ranks = all;
        }

        public CardRank(int rank, string display)
        {
            this.value = rank;
            this.display = display;
        }

        public override string ToString()
        {
            return this.display;
        }
    }
}
