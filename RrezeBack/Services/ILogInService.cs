using System.Threading.Tasks;
using RrezeBack.DTO;
using RrezeBack.Data.DTO;

namespace RrezeBack.Services
{
    public interface ILogInService
    {
        Task<object> LogInRider(LoginDTO dto);
        Task<object> LogInDriver(LoginDTO dto);
        Task<object> ConfirmFaRider(FaCredencialsDto dto);
        Task<object> ConfirmFaDriver(FaCredencialsDto dto);
        Task<bool> ResendFa(string email);
    }
}
