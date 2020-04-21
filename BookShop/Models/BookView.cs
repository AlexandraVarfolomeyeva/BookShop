﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookShop.Models
{
    public class BookView
    {
        public int Id { get; set; }
        public string image { get; set; } //url картинки
        public string Year { get; set; } //год публикации
        public int Cost { get; set; } //стоимость
        public bool Store { get; set; } //есть ли на складе
        public string Content { get; set; } //Описание (аннотация) книги
        public string Title { get; set; } //Название книги
        public string Publisher { get; set; }
        public string[] Authors { get; set; }
    }
}