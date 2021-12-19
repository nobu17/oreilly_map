﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domains.Models
{
    public interface IGeoRepository
    {
        Task<Position> GetCurrentPositionAsync();
    }
}
