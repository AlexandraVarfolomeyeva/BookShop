using DAL.EF;
using DAL.Entities;
using DAL.Interfaces;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Repository
{
    public class RepositoryOrder : IRepository<Order>
    {
        BookingContext db;
        public void Create(Order item)
        {
            db.Order.Add(Order);
            db.SaveChanges();
        }

        public void Delete(int id)
        {
            throw new NotImplementedException();
        }

        public void Delete(string id)
        {
            throw new NotImplementedException();
        }

        public Order GetItem(int id)
        {
            throw new NotImplementedException();
        }

        public Order GetItem(string id)
        {
            throw new NotImplementedException();
        }

        public ObservableCollection<Order> GetList()
        {
            throw new NotImplementedException();
        }

        public void Update(Order item)
        {
            throw new NotImplementedException();
        }
    }
}
