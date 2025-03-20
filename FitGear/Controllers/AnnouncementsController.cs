using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FitGear.Data;
using FitGear.Models.Announcement;

namespace FitGear.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AnnouncementsController : ControllerBase
    {
        private readonly FitGearDbContext _context;
        private readonly IMapper _mapper;

        public AnnouncementsController(FitGearDbContext context, IMapper _mapper)
        {
            _context = context;
            this._mapper = _mapper;
        }

        // GET: api/Announcement
        [HttpGet]
        public async Task<ActionResult<IEnumerable<GetAnnouncementDto>>> GetAnnouncements()
        {
            var announcements = await _context.Announcements.ToListAsync();
            var records = _mapper.Map<List<GetAnnouncementDto>>(announcements);
            return Ok(records);
        }

        // GET: api/Announcement/5
        [HttpGet("{id}")]
        public async Task<ActionResult<GetAnnouncementDto>> GetAnnouncement(int id)
        {
            var announcement = await _context.Announcements.FindAsync(id);

            if (announcement == null)
            {
                return NotFound();
            }

            return Ok(_mapper.Map<GetAnnouncementDto>(announcement));
        }
        
        // Нужно будет сделать контроллер GET для модератора/админа для просмотра всех бронирований и уже там бы будем обращатся к контексту
        // Используя Include для свзяи с таблицей Bookings

        // PUT: api/Announcement/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAnnouncement(int id, UpdateAnnouncementDto announcementDto)
        {
            if (id != announcementDto.Id)
            {
                return BadRequest();
            }

            // _context.Entry(announcement).State = EntityState.Modified;

            var announcement = await _context.Announcements.FindAsync(id);

            if (announcement == null)
            {
                return NotFound();
            }
            
            _mapper.Map(announcementDto, announcement);
            
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AnnouncementExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Announcement
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Announcement>> PostAnnouncement(CreateAnnouncementDto createAnnouncementDto)
        {
            var announcement = _mapper.Map<Announcement>(createAnnouncementDto);
            _context.Announcements.Add(announcement);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAnnouncement", new { id = announcement.Id }, announcement);
        }

        // DELETE: api/Announcement/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAnnouncement(int id)
        {
            var announcement = await _context.Announcements.FindAsync(id);
            if (announcement == null)
            {
                return NotFound();
            }

            _context.Announcements.Remove(announcement);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool AnnouncementExists(int id)
        {
            return _context.Announcements.Any(e => e.Id == id);
        }
    }
}
