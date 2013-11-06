using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Casino
{
    public struct Style  // used to combine the way a charecters on the console are colored
    {
        public ConsoleColor foregroundColor;
        public ConsoleColor backgroundColor;

        public Style(ConsoleColor foregroundColor, ConsoleColor backgroundColor)  // main constructor
        {
            this.foregroundColor = foregroundColor;
            this.backgroundColor = backgroundColor;
        }
    }
}
