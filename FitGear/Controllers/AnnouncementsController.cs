using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using FitGear.Contracts;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FitGear.Data;
using FitGear.Models.Announcement;
using Microsoft.AspNetCore.Authorization;

namespace FitGear.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AnnouncementsController : ControllerBase
    {
        private readonly IAnnouncementService _announcementService;
        private readonly IMapper _mapper;

        public AnnouncementsController(IAnnouncementService announcementService, IMapper mapper)
        {
            _announcementService = announcementService;
            _mapper = mapper;
        }

        // GET: api/Announcement
        [HttpGet]
        public async Task<ActionResult<IEnumerable<GetAnnouncementDto>>> GetAnnouncements()
        {
            var announcements = await _announcementService.GetAnnouncementsAsync();
            return Ok(announcements);
        }

        // GET: api/Announcement/5
        [HttpGet("{id}")]
        public async Task<ActionResult<GetAnnouncementDto>> GetAnnouncement(int id)
        {
            var announcement = await _announcementService.GetAnnouncementByIdAsync(id);
            if (announcement == null)
            {
                return NotFound();
            }

            return Ok(announcement);
        }
        
        // Нужно будет сделать контроллер GET для модератора/админа для просмотра всех бронирований и уже там бы будем обращатся к контексту
        // Используя Include для свзяи с таблицей Bookings

        // PUT: api/Announcement/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        [Authorize(Roles = "Administrator, Moderator")]
        public async Task<IActionResult> PutAnnouncement(int id, UpdateAnnouncementDto announcementDto)
        {
            if (id != announcementDto.Id)
            {
                return BadRequest();
            }

            var result = await _announcementService.UpdateAnnouncementAsync(id, announcementDto);
            if (!result)
            {
                return NotFound();
            }

            return NoContent();
        }

        // POST: api/Announcement
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [Authorize(Roles = "Administrator, Moderator")]
        public async Task<ActionResult<Announcement>> PostAnnouncement(CreateAnnouncementDto createAnnouncementDto)
        {
            var announcement = await _announcementService.CreateAnnouncementAsync(createAnnouncementDto);
            return CreatedAtAction(nameof(GetAnnouncement), new { id = announcement.Id }, announcement);
        }

        // DELETE: api/Announcement/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Administrator, Moderator")]
        public async Task<IActionResult> DeleteAnnouncement(int id)
        {
            var result = await _announcementService.DeleteAnnouncementAsync(id);
            if (!result)
            {
                return NotFound();
            }

            return NoContent();
        }

        private Task<bool> AnnouncementExists(int id)
        {
            return _announcementService.AnnouncementExistsAsync(id);
        }
    }
}
