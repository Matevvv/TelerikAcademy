using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Casino
{
    public class Menu
    {
        public Style MenuStyle { get; private set; }
        public Frame MenuFrame { get; private set; }
        public string[] MenuItems { get; private set; }
        public int Position;

        private bool key;

        public Menu(string[] menuItems, Frame menuFrame, Style menuStyle)
        {
            this.MenuItems = menuItems;
            this.MenuFrame = menuFrame;
            this.MenuStyle = menuStyle;
        }

        public string CheckInput()
        {
            int length = this.MenuItems.Length;
            Point currentPoint = this.MenuFrame.TopLeft;
            Point newPoint = new Point(currentPoint.X + this.MenuFrame.Width / 2 - length / 2, currentPoint.Y + this.MenuFrame.Height / 2 - length / 2 + 1);
            key = true;
            Draw.WriteString("►", new Point(newPoint.X - 2, newPoint.Y));
            while (true)
            {
                ConsoleKeyInfo consoleKeyInfo = Console.ReadKey(true);
                key = consoleKeyInfo.Key != ConsoleKey.Enter;
                if (!key)
                {
                    return this.MenuItems[Position];
                }
                key = consoleKeyInfo.Key != ConsoleKey.UpArrow;
                if (!key)
                {
                    key = Position <= 0;
                    if (!key)
                    {                     
                        Draw.WriteString(" ", new Point(newPoint.X - 2, newPoint.Y + Position));
                        Position--;
                        Draw.WriteString("►", new Point(newPoint.X - 2, newPoint.Y + Position));
                    }

                }
                key = consoleKeyInfo.Key != ConsoleKey.DownArrow;
                if (!key)
                {
                    key = Position >= MenuItems.Length - 1;
                    if (!key)
                    {
                        Draw.WriteString(" ", new Point(newPoint.X - 2, newPoint.Y + Position));
                        Position++;
                        Draw.WriteString("►", new Point(newPoint.X - 2, newPoint.Y + Position));
                    }
                }
            }
        }
    }
}
