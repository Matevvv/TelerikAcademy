using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Casino
{
    public interface IBlackJack
    {
        void AddCard(Card card);
        int CountScore();
        void ClearHand();
    }
}
