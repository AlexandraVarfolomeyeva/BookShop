using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookShop.DAL.Interfaces
{
    public interface IRepository<T> where T : class
    {
        IEnumerable<T> GetAll();
        T GetByID(int id);
        bool Exists(int id);
        void Create(T item);
        void Update(T item);
        void Delete(int id);
        void Save();

    }

}

