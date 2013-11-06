using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Casino
{
    class Program
    {
        static void Main()
        {
            Console.SetWindowSize(92, 28);
            Console.BufferWidth = 92;
            Console.BufferHeight = 28;
            Console.CursorVisible = false;
            GameManager.StartCasino();
        }
    }
}
