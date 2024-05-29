using Microsoft.AspNetCore.Http;

namespace RrezeBack.Data.DTO
{
    public class ProfilePictureDto
    {
        public int RiderId { get; set; }
        public IFormFile ProfilePicture { get; set; }
    }
}
