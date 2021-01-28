using System;
using GeoCoordinatePortable;

namespace Domains.Models
{
    public class Store
    {
        public Store(string storeName, string postalCode, string telCode, string address, string storeUrl, string mapUrl, Position position)
        {
            StoreName = storeName;
            PostalCode = postalCode;
            TelCode = telCode;
            Address = address;
            StoreUrl = storeUrl;
            MapUrl = mapUrl;
            Position = position;
        }

        public string StoreName { get; private set; }

        public string PostalCode { get; private set; }

        public string TelCode { get; private set; }

        public string Address { get; private set; }

        public string StoreUrl { get; private set; }

        public string MapUrl { get; private set; }

        public Position Position { get; private set; }

        public bool IsSamePrefecure(Prefecture prefecture)
        {
            return Address.StartsWith(prefecture.GetEnumDescription());
        }

        public double GetDistance(double latitude, double longitude)
        {
            return Position.GetDistance(latitude, longitude);
        }
    }

    public class Position
    {
        public Position(double latidude, double longtitude)
        {
            Latitude = latidude;
            Longitude = longtitude;
        }

        public double Latitude { get; private set; }

        public double Longitude { get; private set; }

        public double GetDistance(double latitude, double longitude)
        {
            return new GeoCoordinate(Latitude, Longitude).GetDistanceTo(new GeoCoordinate(latitude, longitude));
        }
    }
}
