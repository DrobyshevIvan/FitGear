using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using FitGear.Core.Contracts.IRepositories;
using FitGear.Core.Models.Category;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FitGear.Data;
using Microsoft.AspNetCore.Authorization;

namespace FitGear.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryRepository _categoryRepository;
        private readonly IMapper _mapper;


        public CategoryController(ICategoryRepository categoryRepository,
            IMapper mapper)
        {
            _categoryRepository = categoryRepository;
            _mapper = mapper;
        }

        // GET: api/Category
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<CategoryDto>>> GetCategories()
        {
            var categories = await _categoryRepository.GetAllAsync();
            return _mapper.Map<List<CategoryDto>>(categories);
        }

        // GET: api/Category/5
        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<CategoryDto>> GetCategory(int id)
        {
            var category = await _categoryRepository.GetAsync(id);

            if (category == null)
            {
                return NotFound();
            }

            return _mapper.Map<CategoryDto>(category);
        }

        // PUT: api/Category/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        [Authorize(Roles = "Administrator, Moderator")]
        public async Task<IActionResult> PutCategory(int id, UpdateCategoryDto categoryDto)
        {
            if (id != categoryDto.Id)
            {
                return BadRequest();
            }

            var existingCategory = await _categoryRepository.GetAsync(id);
            if (existingCategory == null)
            {
                return NotFound();
            }
            
            existingCategory.Name = categoryDto.Name;
            
            await _categoryRepository.UpdateAsync(existingCategory);

            return NoContent();
        }

        // POST: api/Category
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [Authorize(Roles = "Administrator, Moderator")]
        public async Task<ActionResult<Category>> PostCategory(UpdateCategoryDto categoryDto)
        {
            await _categoryRepository.AddAsync(_mapper.Map<Category>(categoryDto));

            return CreatedAtAction("GetCategory", new { id = categoryDto.Id }, categoryDto);
        }

        // DELETE: api/Category/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Administrator, Moderator")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            if (!await _categoryRepository.Exists(id))
            {
                return NotFound();
            }
            
            await _categoryRepository.DeleteAsync(id);

            return NoContent();
        }

        private Task<bool> CategoryExists(int id)
        {
            return _categoryRepository.Exists(id);
        }
    }
}
