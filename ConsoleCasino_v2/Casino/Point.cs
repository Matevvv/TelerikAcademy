using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Casino
{
    public struct Point  // just to keep the positions of things in the game
    {
        private int x;
        private int y;

        public int X
        {
            get { return this.x; }
            set { this.x = value; }
        }

        public int Y
        {
            get { return this.y; }
            set { this.y = value; }
        }

        public Point(int x, int y)
        {
            this.x = x;
            this.y = y;
        }
    }
}
