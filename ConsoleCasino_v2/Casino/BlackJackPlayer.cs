using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Casino
{
    public class BlackJackPlayer : Player, IPlayBlackJack
    {
        //  TODO: BlackJackPlayer and Dealer must inherit from a BlackJack class
        public bool IsGaming { get; set; }

        // for testing
        public BlackJackPlayer()
        { 
        }
        public void GetBlackJack()
        {
            this.Score = int.MaxValue;
        }
        public BlackJackPlayer(string name, Gender sex, int money)
        {
            this.Name = name;
            this.Sex = sex;
            this.Money = money;
            this.Hand = new List<Card>(6);
            this.PlayerFrame = Draw.plyerCardsFrame;
        }
        public bool CanBet(int bet)
        {
            if (this.Money >= bet)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public void UpdateMoney(int money)
        {
            this.Money += money;
        }
        public void Subscribe(BlackJackDealer dealer)
        {
            dealer.ChangeMoney += UpdateMoney;
        }
    }
}
