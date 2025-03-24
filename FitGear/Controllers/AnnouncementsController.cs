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

namespace FitGear.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AnnouncementsController : ControllerBase
    {
        private readonly IAnnouncementsRepository _announcementsRepository;
        private readonly IMapper _mapper;

        public AnnouncementsController(IAnnouncementsRepository announcementsRepository, IMapper mapper)
        {
            _announcementsRepository = announcementsRepository;
            _mapper = mapper;
        }

        // GET: api/Announcement
        [HttpGet]
        public async Task<ActionResult<IEnumerable<GetAnnouncementDto>>> GetAnnouncements()
        {
            var announcements = await _announcementsRepository.GetAllAsync();
            var records = _mapper.Map<List<GetAnnouncementDto>>(announcements);
            return Ok(records);
        }

        // GET: api/Announcement/5
        [HttpGet("{id}")]
        public async Task<ActionResult<GetAnnouncementDto>> GetAnnouncement(int id)
        {
            var announcement = await _announcementsRepository.GetAsync(id);

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

            var announcement = await _announcementsRepository.GetAsync(id);

            if (announcement == null)
            {
                return NotFound();
            }
            
            _mapper.Map(announcementDto, announcement);
            
            try
            {
                await _announcementsRepository.UpdateAsync(announcement);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await AnnouncementExists(id))
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
            await _announcementsRepository.AddAsync(announcement);

            return CreatedAtAction("GetAnnouncement", new { id = announcement.Id }, announcement);
        }

        // DELETE: api/Announcement/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAnnouncement(int id)
        {
            var announcement = await _announcementsRepository.GetAsync(id);
            if (announcement == null)
            {
                return NotFound();
            }

            await _announcementsRepository.DeleteAsync(id);

            return NoContent();
        }

        private Task<bool> AnnouncementExists(int id)
        {
            return _announcementsRepository.Exists(id);
        }
    }
}
