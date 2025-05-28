export default function FilterSelect({ onFilterChange }) {
    return (
        <form class="w-[200px]">
            <select id="countries"
            onChange={(e) => onFilterChange(e.target.value)} 
            className="bg-gray-50 border-b border-gray-500 select-none
            text-gray-700 text-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 focus:outline-none
            dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <option selected>Choose a filter</option>
                <option value="Ascending">Ascending</option>
                <option value="Descending">Descending</option>
            </select>
        </form>
    )
}