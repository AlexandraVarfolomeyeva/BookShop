using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Interfaces
{
    //CRUD Create Update Delete
    public interface IRepository<T> where T : class
    {
        ObservableCollection<T> GetList(); // получение всех объектов
        T GetItem(int id); // получение одного объекта по id
        T GetItem(string id); // получение одного объекта по id
        void Create(T item); // создание объекта
        void Update(T item); // обновление объекта
        void Delete(int id); // удаление объекта по id
        void Delete(string id); // удаление объекта по id
    }
}
